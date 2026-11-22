import * as cy from "./clunkyard";
export { clunkyard_start, clunkyard_turn } from "./clunkyard";

// Enough to turn against the brake in the force rulesets.
const SEARCH_TURN = 0.33;
// How long to look again where a robot was last seen.
const MEMORY_TICKS = 60;
// How long a dodge lasts: half a second.
const DODGE_TICKS = 10;
// Degrees: sweeps the circle in half a second.
const SEARCH_ARC: f64 = 40;
// Units across at the target: it stays in the beam from tick to tick.
const HOLD_WIDTH: f64 = 60;
// Degrees: the narrowest the beam holds.
const MIN_ARC: f64 = 6;
// Ticks of sightings the aim averages.
const WINDOW = 12;
// Narrow sightings in the window before a shot.
const SIGHTINGS = 8;
// Ticks between looks around the target, for a nearer robot.
const LOOK_EVERY = 40;

// Reuse these output buffers on each turn. The stub runtime cannot reclaim them.
const me = cy.Vec3.create();
const still = cy.Vec3.create();
const where = cy.Vec3.create(); // the fitted line's position and velocity
const speed = cy.Vec3.create();
const gravity = cy.Vec3.create();
const last = cy.Vec3.create();
const target = cy.Contact.create();
const aim = cy.Solution.create();
const now = cy.Direction.create();
const cue = cy.Cue.create();
const scan = cy.Scan.create();
const storm = cy.Storm.create();
const zone = cy.Zone.create();
const CUES = 8;
const cues = heap.alloc(CUES * cy.Contact.SIZE); // this turn's passive contacts
// The last WINDOW sightings of one robot, five numbers each: tick, bearing
// error, x, y, z. The core keeps a history (cy.tracker_history), but reading
// its 32 records costs more fuel than a turn can spare, so the robot keeps
// the few it uses itself.
const SEEN = 5 * 8;
const sighted = heap.alloc(WINDOW * SEEN);
let sightedCount = 0; // sightings kept, the newest last
let sightedSlot = 0; // the robot they are of
const number = heap.alloc(8);
const whole = heap.alloc(4);

let freeFlight = false; // flying free, robots may be above or below
let forces = false; // the force rulesets: push the hull, not steer it
let lastSlot = 0; // the robot seen most recently, 0 for none yet
let dodgeUntil = 0; // the tick the dodge ends
let dodges = 0; // how many dodges so far
let tickRate: f64 = 0; // ticks a second

// Each import writes its answer through a pointer and returns a status.
function f64Of(status: i32): f64 {
  return status == cy.OK ? load<f64>(number) : 0;
}
function i32Of(status: i32): i32 {
  return status == cy.OK ? load<i32>(whole) : 0;
}
function angleDiff(target: f64, current: f64): f64 {
  return f64Of(cy.angles_angle_diff(target, current, number));
}
function bearingTo(from: cy.Vec3, to: cy.Vec3): f64 {
  return f64Of(cy.angles_bearing_to(from.ptr, to.ptr, number));
}
function elevationTo(from: cy.Vec3, to: cy.Vec3): f64 {
  return f64Of(cy.angles_elevation_to(from.ptr, to.ptr, number));
}
function unit(value: f64): f64 {
  return Math.max(-1, Math.min(1, value));
}

// Drives towards a heading and an elevation, turning harder the smaller gain is.
function steer(
  throttle: f64,
  heading: f64,
  elevation: f64,
  gain: f64,
  myHeading: f64,
  myPitch: f64,
): void {
  cy.drive_throttle(throttle);
  cy.drive_turn(unit(angleDiff(heading, myHeading) / gain));
  cy.drive_pitch_turn(unit((elevation - myPitch) / gain));
}

// The angle, in degrees, of a beam HOLD_WIDTH across at this range: atan by a rational fit, cheaper in fuel than Math.atan2.
function holdArc(range: f64): f64 {
  let x = HOLD_WIDTH / 2 / range;
  const flip = x > 1;
  if (flip) x = 1 / x;
  const angle = x / (1 + 0.28125 * x * x);
  return 2 * (flip ? 1.5707963 - angle : angle) * 57.29578;
}

// Keeps the target's sighting: when, how sharp, and where the sensors placed it.
function remember(tick: i32): void {
  if (target.slot != sightedSlot) sightedCount = 0;
  sightedSlot = target.slot;
  if (sightedCount == WINDOW) {
    memory.copy(sighted, sighted + SEEN, (WINDOW - 1) * SEEN);
    sightedCount--;
  }
  const at = sighted + sightedCount * SEEN,
    from = target.ptr + 48; // a contact's position is 48 bytes in
  store<f64>(at, <f64>tick, 0);
  store<f64>(at, target.bearing_error, 8);
  store<f64>(at, load<f64>(from, 0), 16);
  store<f64>(at, load<f64>(from, 8), 24);
  store<f64>(at, load<f64>(from, 16), 32);
  sightedCount++;
}

// A straight line through the narrowest of the last WINDOW ticks' sightings:
// where the robot is now and how fast it moves, into position and velocity.
// Each sighting is off by its bearing error; the line averages that out.
// Ordinary least squares, with time counted back from now so the line's value
// at now is its intercept. Gives how many sightings it used.
function fit(tick: i32, position: cy.Vec3, velocity: cy.Vec3): i32 {
  let best: f64 = 1e9;
  for (let i = 0; i < sightedCount; i++) {
    const at = sighted + i * SEEN;
    if (<i32>load<f64>(at, 0) > tick - WINDOW) best = Math.min(best, load<f64>(at, 8));
  }
  const widest = 1.5 * best;
  let n: f64 = 0,
    st: f64 = 0,
    stt: f64 = 0,
    sx: f64 = 0,
    sy: f64 = 0,
    sz: f64 = 0,
    stx: f64 = 0,
    sty: f64 = 0,
    stz: f64 = 0;
  for (let i = 0; i < sightedCount; i++) {
    const at = sighted + i * SEEN;
    const when = <i32>load<f64>(at, 0);
    if (when <= tick - WINDOW || load<f64>(at, 8) > widest) continue; // out of the window, or a look's wide sighting
    const dt = <f64>(when - tick),
      x = load<f64>(at, 16),
      y = load<f64>(at, 24),
      z = load<f64>(at, 32);
    n++;
    st += dt;
    stt += dt * dt;
    sx += x;
    sy += y;
    sz += z;
    stx += dt * x;
    sty += dt * y;
    stz += dt * z;
  }
  if (n < 2) return 0;
  const spread = n * stt - st * st;
  const kx = (n * stx - st * sx) / spread,
    ky = (n * sty - st * sy) / spread,
    kz = (n * stz - st * sz) / spread;
  position.x = (sx - kx * st) / n;
  position.y = (sy - ky * st) / n;
  position.z = (sz - kz * st) / n;
  velocity.x = kx * tickRate;
  velocity.y = ky * tickRate;
  velocity.z = kz * tickRate;
  return <i32>n;
}

function start(): void {
  tickRate = <f64>i32Of(cy.match_tick_rate(whole));
  cy.arena_gravity(gravity.ptr);
  freeFlight = i32Of(cy.match_is_3d(whole)) == 1 && gravity.z == 0;
  forces = i32Of(cy.match_control(whole)) == cy.CONTROL_FORCES;
}

function turn(): void {
  cy.me_position(me.ptr);
  const heading = f64Of(cy.me_heading(number));
  const pitch = f64Of(cy.me_pitch(number));
  const tick = i32Of(cy.clock_tick(whole));
  cy.drive_brake(0.2);

  if (cy.sensors_nearest(target.ptr) == cy.OK) {
    lastSlot = target.slot;
    const range = target.range,
      bearing = target.bearing,
      elevation = target.elevation;
    steer(range > 350 ? 0.7 : range < 200 ? -0.4 : 0.2, bearing, elevation, 45, heading, pitch);
    remember(tick);
    // Halve the beam each tick until it is HOLD_WIDTH across at the target:
    // narrow enough for a precise bearing, wide enough to keep it in. Every
    // LOOK_EVERY ticks widen it for a tick, so a nearer robot can be found.
    const hold = Math.max(MIN_ARC, holdArc(range));
    cy.scanner_last(scan.ptr);
    cy.scanner_heading(bearing);
    cy.scanner_arc(
      tick % LOOK_EVERY == 0 ? SEARCH_ARC : Math.max(hold, Math.min(SEARCH_ARC, scan.arc / 2)),
    );
    cy.scanner_pitch(elevation);
    // The heaviest shot that still covers the range in about a second,
    // aimed where the target will be, lobbed under gravity; straight at it
    // when no shot reaches it. An exact contact: gun_lead is the intercept
    // if the target holds its course. A noisy one: lead the fitted line, and
    // fire only once it rests on enough sightings.
    store<f64>(number, 1);
    const power = f64Of(cy.gun_power_for_flight_time(range, 1, number));
    let found = false,
      ready = true;
    if (target.bearing_error > 0) {
      const used = fit(tick, where, speed);
      found = used > 0 && cy.gun_lead_point(where.ptr, speed.ptr, power, aim.ptr) == cy.OK;
      ready = found && used >= SIGHTINGS;
    } else found = cy.gun_lead(target.ptr, power, aim.ptr) == cy.OK;
    if (!found) {
      aim.heading = bearing;
      aim.pitch = elevation;
    }
    cy.gun_aim_heading(aim.heading);
    cy.gun_aim_pitch(aim.pitch);
    cy.gun_aim_now(now.ptr);
    const canFire = i32Of(cy.gun_can_fire(power, 10, whole)) == 1;
    const onTarget =
      Math.abs(angleDiff(aim.heading, now.heading)) < 3 && Math.abs(aim.pitch - now.pitch) < 3;
    if (ready && onTarget && canFire) {
      cy.gun_fire();
      cy.gun_power(power);
    }
  } else if (
    lastSlot != 0 &&
    cy.tracker_last_seen(lastSlot, whole) == cy.OK &&
    tick - load<i32>(whole) < MEMORY_TICKS &&
    cy.tracker_position(lastSlot, last.ptr) == cy.OK
  ) {
    // Head for where it was, sweeping a narrow scan across that bearing.
    const bearing = bearingTo(me, last);
    const elevation = freeFlight ? elevationTo(me, last) : 0;
    steer(0.7, bearing, elevation, 45, heading, pitch);
    cy.scanner_heading(bearing + <f64>((tick % 5) - 2) * 8);
    cy.scanner_arc(30);
    cy.scanner_pitch(elevation);
  } else if (cy.tracker_cue(cue.ptr) == cy.OK) {
    // Head the way the cue points, sweeping the scan across its error.
    const heard = cue.position;
    const bearing = bearingTo(me, heard);
    const elevation = freeFlight ? elevationTo(me, heard) : 0;
    const error = Math.min(cue.bearing_error, 30);
    steer(0.6, bearing, elevation, 45, heading, pitch);
    cy.scanner_heading(bearing + (<f64>((tick % 5) - 2) / 2) * error);
    cy.scanner_arc(30);
    cy.scanner_pitch(elevation);
  } else {
    steer(0.5, heading, 0, 45, heading, pitch);
    cy.drive_turn(SEARCH_TURN);
    // Sweeps the circle in half a second, flying free at three heights in turn.
    cy.scanner_last(scan.ptr);
    cy.scanner_heading(scan.heading + 36);
    cy.scanner_arc(40);
    cy.scanner_pitch(freeFlight ? <f64>(((tick / 10) % 3) - 1) * 35 : 0);
  }

  // A simple dodge: vary it, or predict the shooter. A muzzle cue means a
  // robot fired; for half a second swerve off the line of fire, left and
  // right in turn. More cues than the array holds (cy.SHORT) count as none
  // heard.
  if (tick >= dodgeUntil && cy.sensors_cues(cues, CUES, whole) == cy.OK) {
    const count = load<u32>(whole);
    for (let i: u32 = 0; i < count; i++) {
      // A contact's source is the whole number 4 bytes in.
      if (load<i32>(cues + i * cy.Contact.SIZE, 4) == cy.SOURCE_MUZZLE) {
        dodgeUntil = tick + DODGE_TICKS;
        dodges++;
        break;
      }
    }
  }
  if (tick < dodgeUntil) {
    const side: f64 = dodges % 2 == 1 ? 1 : -1; // turn is positive left, strafe positive right
    if (forces) {
      cy.drive_throttle(0.5);
      cy.drive_strafe(-side);
    } else {
      cy.drive_throttle(1);
      cy.drive_turn(side);
    }
  }

  // Low battery: drive gently so the shots can still be paid for.
  const charge = f64Of(cy.battery_charge(number)),
    capacity = f64Of(cy.battery_capacity(number));
  if (charge < capacity / 4) cy.drive_throttle(f64Of(cy.drive_get_throttle(number)) * 0.5);

  // The storm drifts across the arena and hurts anything inside it. Near its
  // edge, step out across its path: at right angles to its drift, on the
  // side this robot is already on, so it passes by.
  if (
    cy.nav_storm(storm.ptr) == cy.OK &&
    cy.nav_storm_margin(me.ptr, number) == cy.OK &&
    load<f64>(number) > -60
  ) {
    const away = bearingTo(storm.center, me),
      drift = bearingTo(still, storm.velocity);
    steer(1, drift + (angleDiff(away, drift) < 0 ? -90 : 90), 0, 30, heading, pitch);
  }

  // Sudden death: head back inside the safe zone.
  if (
    cy.nav_zone(zone.ptr) == cy.OK &&
    cy.nav_zone_margin(me.ptr, number) == cy.OK &&
    load<f64>(number) < 60
  ) {
    const centre = zone.center;
    const climb = zone.shape == cy.SHAPE_SPHERE ? elevationTo(me, centre) : 0;
    steer(0.8, bearingTo(me, centre), climb, 30, heading, pitch);
  }
}

cy.robot(start, turn);
