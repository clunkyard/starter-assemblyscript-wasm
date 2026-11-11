// A starter robot for rules v2, in AssemblyScript on WebAssembly ABI 4: it
// calls the robot core through the clunkyard.* imports in clunkyard.ts,
// next to this file. It sweeps a medium scan to find a robot, narrows the
// scan to hold it, leads it with shots whose power suits the range, fires
// only when the turret is on target, keeps battery back for driving, looks
// again where it last saw one, follows a passive cue when it has nothing
// better and steps out of the storm.
//
// The trade-offs (the imports answer with the numbers the hello set):
//   scan     a narrow arc reaches further; a wide one finds robots nearby
//   power    heavy shots hit harder for less battery, but fly slowly
//   battery  shots and driving share it, and it refills slowly
//   turret   it turns at a limited rate; cy.gun_aim_now is where it points now
//   fuel     every import costs fuel, so read each fact once a turn
// A cue (cy.tracker_cue) says roughly where a robot is, within its
// bearing_error degrees: good for where to look, not where to shoot.
// The stub runtime never frees memory, so the records are made once, here;
// a field view such as cue.position takes only a few bytes a turn.
// Clunkyard WebAssembly ABI 4: the robot calls the core through imports
// from "clunkyard", declared in clunkyard.h. Export memory and, through
// CY_ROBOT(start, turn), clunkyard_start and clunkyard_turn. Each import
// returns a status (CY_OK 0, CY_NONE 1 for absent) and writes results
// through pointers; each costs fuel. In C each import is cy_<name>, as
// cy_sensors_nearest(&contact).
// match: match_mode match_ruleset match_control match_robots match_is_3d
//   match_tick_rate match_max_ticks robot_id robot_seed
// clock: clock_tick clock_seconds clock_remaining_ticks
// arena: arena_size arena_gravity arena_terrain_kind arena_ground_height
// me: me_health me_position me_velocity me_heading me_pitch me_roll
//   me_angular_velocity me_attitude me_grounded me_altitude me_applied
// battery: battery_charge battery_capacity battery_regen
//   battery_sustainable_drive battery_compute battery_drive_cost
// drive: drive_hover_lift drive_throttle drive_turn drive_pitch_turn
//   drive_thrust drive_strafe drive_lift drive_yaw_torque
//   drive_pitch_torque drive_roll_torque drive_brake drive_get_throttle
//   drive_get_turn drive_get_pitch_turn drive_get_thrust drive_get_strafe
//   drive_get_lift drive_get_yaw_torque drive_get_pitch_torque
//   drive_get_roll_torque drive_get_brake
// gun: gun_aim_now gun_cooldown_ticks gun_spread gun_max_power
//   gun_damage_scale gun_can_fire gun_shot_speed gun_shot_cost
//   gun_reload_ticks gun_shot_damage gun_power_for_speed
//   gun_power_for_flight_time gun_lead gun_lead_point gun_aim_heading
//   gun_aim_pitch gun_fire gun_power gun_get_aim_heading gun_get_aim_pitch
//   gun_get_fire gun_get_power
// scanner: scanner_last scanner_proximity_range scanner_reach
//   scanner_arc_for_reach scanner_heading scanner_arc scanner_pitch
//   scanner_get_heading scanner_get_arc scanner_get_pitch
// sensors: sensors_contacts sensors_nearest sensors_cues sensors_contact
//   sensors_position_of
// tracker: tracker_cue tracker_nearest_bearing_rate tracker_velocity
//   tracker_position tracker_last_seen tracker_configure
// nav: nav_zone nav_zone_margin nav_zone_contains nav_zone_distance_from
//   nav_storm nav_storm_margin nav_storm_contains nav_storm_distance_from
//   nav_hill nav_hill_margin nav_hill_contains nav_hill_distance_from
//   nav_pickups nav_nearest_pickup nav_field_distance
// score: score_me score_best score_armour
// angles: angles_normalize angles_angle_diff angles_bearing_to
//   angles_elevation_to angles_direction angles_distance angles_clamp
// status: status_text status_value status_get_text status_get_value
// raw: raw_number raw_text raw_has raw_flag raw_count raw_line raw_extra
// session: session_log
// Records: cy_contact, cy_vec3, cy_direction and the rest, in clunkyard.h.
// Angles are degrees from the +x axis; pitch is positive up.
// Manual: https://clunkyard.com/manual#wasm
import * as cy from "./clunkyard";
export { clunkyard_start, clunkyard_turn } from "./clunkyard";

// Enough to turn against the brake in the force rulesets.
const SEARCH_TURN = 0.33;
// How long to look again where a robot was last seen.
const MEMORY_TICKS = 60;

// The records the imports write into, and room for one number or count.
const me = cy.Vec3.create();
const still = cy.Vec3.create();
const gravity = cy.Vec3.create();
const last = cy.Vec3.create();
const target = cy.Contact.create();
const aim = cy.Solution.create();
const now = cy.Direction.create();
const cue = cy.Cue.create();
const scan = cy.Scan.create();
const storm = cy.Storm.create();
const zone = cy.Zone.create();
const number = heap.alloc(8);
const whole = heap.alloc(4);

let freeFlight = false; // flying free, robots may be above or below
let lastSlot = 0; // the robot seen most recently, 0 for none yet

// Each import writes its answer through a pointer and returns a status.
function f64Of(status: i32): f64 { return status == cy.OK ? load<f64>(number) : 0; }
function i32Of(status: i32): i32 { return status == cy.OK ? load<i32>(whole) : 0; }
function angleDiff(target: f64, current: f64): f64 { return f64Of(cy.angles_angle_diff(target, current, number)); }
function bearingTo(from: cy.Vec3, to: cy.Vec3): f64 { return f64Of(cy.angles_bearing_to(from.ptr, to.ptr, number)); }
function elevationTo(from: cy.Vec3, to: cy.Vec3): f64 { return f64Of(cy.angles_elevation_to(from.ptr, to.ptr, number)); }
function unit(value: f64): f64 { return Math.max(-1, Math.min(1, value)); }

// Drives towards a heading and an elevation, turning harder the smaller gain is.
function steer(throttle: f64, heading: f64, elevation: f64, gain: f64, myHeading: f64, myPitch: f64): void {
  cy.drive_throttle(throttle);
  cy.drive_turn(unit(angleDiff(heading, myHeading) / gain));
  cy.drive_pitch_turn(unit((elevation - myPitch) / gain));
}

function start(): void {
  cy.arena_gravity(gravity.ptr);
  freeFlight = i32Of(cy.match_is_3d(whole)) == 1 && gravity.z == 0;
}

function turn(): void {
  cy.me_position(me.ptr);
  const heading = f64Of(cy.me_heading(number));
  const pitch = f64Of(cy.me_pitch(number));
  const tick = i32Of(cy.clock_tick(whole));
  cy.drive_brake(0.2);

  if (cy.sensors_nearest(target.ptr) == cy.OK) {
    lastSlot = target.slot;
    const range = target.range, bearing = target.bearing, elevation = target.elevation;
    steer(range > 350 ? 0.7 : range < 200 ? -0.4 : 0.2, bearing, elevation, 45, heading, pitch);
    cy.scanner_heading(bearing); // narrow: holds it, reaching about 735
    cy.scanner_arc(20);
    cy.scanner_pitch(elevation);
    // The heaviest shot that still covers the range in about a second,
    // aimed where the target will be, lobbed under gravity; straight at it
    // when no shot reaches it.
    store<f64>(number, 1);
    const power = f64Of(cy.gun_power_for_flight_time(range, 1, number));
    if (cy.gun_lead(target.ptr, power, aim.ptr) != cy.OK) {
      aim.heading = bearing;
      aim.pitch = elevation;
    }
    cy.gun_aim_heading(aim.heading);
    cy.gun_aim_pitch(aim.pitch);
    cy.gun_aim_now(now.ptr);
    const canFire = i32Of(cy.gun_can_fire(power, 10, whole)) == 1;
    const onTarget = Math.abs(angleDiff(aim.heading, now.heading)) < 3 && Math.abs(aim.pitch - now.pitch) < 3;
    if (onTarget && canFire) {
      cy.gun_fire();
      cy.gun_power(power);
    }
  } else if (lastSlot != 0 && cy.tracker_last_seen(lastSlot, whole) == cy.OK && tick - load<i32>(whole) < MEMORY_TICKS
      && cy.tracker_position(lastSlot, last.ptr) == cy.OK) {
    // Head for where it was, sweeping a narrow scan across that bearing.
    const bearing = bearingTo(me, last);
    const elevation = freeFlight ? elevationTo(me, last) : 0;
    steer(0.7, bearing, elevation, 45, heading, pitch);
    cy.scanner_heading(bearing + <f64>(tick % 5 - 2) * 8);
    cy.scanner_arc(30);
    cy.scanner_pitch(elevation);
  } else if (cy.tracker_cue(cue.ptr) == cy.OK) {
    // Head the way the cue points, sweeping the scan across its error.
    const heard = cue.position;
    const bearing = bearingTo(me, heard);
    const elevation = freeFlight ? elevationTo(me, heard) : 0;
    const error = Math.min(cue.bearing_error, 30);
    steer(0.6, bearing, elevation, 45, heading, pitch);
    cy.scanner_heading(bearing + <f64>(tick % 5 - 2) / 2 * error);
    cy.scanner_arc(30);
    cy.scanner_pitch(elevation);
  } else {
    steer(0.5, heading, 0, 45, heading, pitch);
    cy.drive_turn(SEARCH_TURN);
    // Sweeps the circle in half a second, flying free at three heights in turn.
    cy.scanner_last(scan.ptr);
    cy.scanner_heading(scan.heading + 36);
    cy.scanner_arc(40);
    cy.scanner_pitch(freeFlight ? <f64>((tick / 10) % 3 - 1) * 35 : 0);
  }

  // Low battery: drive gently so the shots can still be paid for.
  const charge = f64Of(cy.battery_charge(number)), capacity = f64Of(cy.battery_capacity(number));
  if (charge < capacity / 4) cy.drive_throttle(f64Of(cy.drive_get_throttle(number)) * 0.5);

  // The storm drifts across the arena and hurts anything inside it. Near its
  // edge, step out across its path: at right angles to its drift, on the
  // side this robot is already on, so it passes by.
  if (cy.nav_storm(storm.ptr) == cy.OK && cy.nav_storm_margin(me.ptr, number) == cy.OK && load<f64>(number) > -60) {
    const away = bearingTo(storm.center, me), drift = bearingTo(still, storm.velocity);
    steer(1, drift + (angleDiff(away, drift) < 0 ? -90 : 90), 0, 30, heading, pitch);
  }

  // Sudden death: head back inside the safe zone.
  if (cy.nav_zone(zone.ptr) == cy.OK && cy.nav_zone_margin(me.ptr, number) == cy.OK && load<f64>(number) < 60) {
    const centre = zone.center;
    const climb = zone.shape == cy.SHAPE_SPHERE ? elevationTo(me, centre) : 0;
    steer(0.8, bearingTo(me, centre), climb, 30, heading, pitch);
  }
}

cy.robot(start, turn);
