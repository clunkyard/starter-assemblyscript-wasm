/**
 * Generated from protocol/v2/api.json by protocol/v2/codegen/wasm-surfaces.js; do not edit. Run `make api`.
 *
 * Clunkyard WebAssembly ABI 4 for AssemblyScript: every clunkyard.* import
 * at its import name (sensors_nearest_v1, with sensors_nearest for the
 * latest version), the records and the constants. Each import returns a
 * status (OK, NONE for absent) and writes through pointers (usize) into
 * memory; each costs fuel. A record is a view over its bytes: allocate one
 * with Record.create() and pass record.ptr.
 *
 * robot(start, turn) registers the callbacks, and the entry file re-exports
 * the module's two exports. Build with --runtime stub and
 * --use abort=clunkyard/cyAbort, since the host allows no import but these.
 *
 *   import * as cy from "./clunkyard";
 *   export { clunkyard_start, clunkyard_turn } from "./clunkyard";
 *   const target = cy.Contact.create();
 *   function turn(): void {
 *     if (cy.sensors_nearest(target.ptr) == cy.OK) { cy.gun_aim_heading(target.bearing); cy.gun_fire(); }
 *   }
 *   cy.robot(null, turn);
 */

export const API_VERSION = "2.0.0";
export const API_MAJOR: i32 = 2;
export const API_MINOR: i32 = 0;
/** Done. */
export const OK: i32 = 0;
/** Absent, which is not an error: no precise contact, a mechanic that is off, a shot that cannot reach, or a field that is unset. */
export const NONE: i32 = 1;
/** The buffer is too short; the length or count says how much is needed. */
export const SHORT: i32 = 2;
/** A number is NaN or infinite; the field is left unset. */
export const E_NOT_FINITE: i32 = -1;
/** A number is outside what the call accepts. */
export const E_RANGE: i32 = -2;
/** An argument is malformed: a null pointer, a slot out of range, text that is not UTF-8. */
export const E_ARGUMENT: i32 = -3;
/** The wrong point in the session, such as a state query before the first state. */
export const E_PHASE: i32 = -4;
/** The binding's API version is newer than the core's, or a different major. */
export const E_VERSION: i32 = -5;
/** A fault in the core. It is never the robot's fault; the handle resets on the next state. */
export const E_INTERNAL: i32 = -6;
/** source: none */
export const SOURCE_NONE: i32 = 0;
/** source: scan */
export const SOURCE_SCAN: i32 = 1;
/** source: proximity */
export const SOURCE_PROXIMITY: i32 = 2;
/** source: faint */
export const SOURCE_FAINT: i32 = 3;
/** source: beam */
export const SOURCE_BEAM: i32 = 4;
/** source: muzzle */
export const SOURCE_MUZZLE: i32 = 5;
/** source: motion */
export const SOURCE_MOTION: i32 = 6;
/** source: ping */
export const SOURCE_PING: i32 = 7;
/** mode: none */
export const MODE_NONE: i32 = 0;
/** mode: 2d */
export const MODE_TWO_D: i32 = 1;
/** mode: 3d */
export const MODE_THREE_D: i32 = 2;
/** ruleset: none */
export const RULESET_NONE: i32 = 0;
/** ruleset: classic */
export const RULESET_CLASSIC: i32 = 1;
/** ruleset: inertial-2d */
export const RULESET_INERTIAL_2D: i32 = 2;
/** ruleset: gravity-flat */
export const RULESET_GRAVITY_FLAT: i32 = 3;
/** ruleset: gravity-hills */
export const RULESET_GRAVITY_HILLS: i32 = 4;
/** ruleset: zero-g */
export const RULESET_ZERO_G: i32 = 5;
/** control: none */
export const CONTROL_NONE: i32 = 0;
/** control: direct */
export const CONTROL_DIRECT: i32 = 1;
/** control: forces */
export const CONTROL_FORCES: i32 = 2;
/** terrain_kind: none */
export const TERRAIN_KIND_NONE: i32 = 1;
/** terrain_kind: flat */
export const TERRAIN_KIND_FLAT: i32 = 2;
/** terrain_kind: hills */
export const TERRAIN_KIND_HILLS: i32 = 3;
/** shape: none */
export const SHAPE_NONE: i32 = 0;
/** shape: circle */
export const SHAPE_CIRCLE: i32 = 1;
/** shape: sphere */
export const SHAPE_SPHERE: i32 = 2;
/** shape: column */
export const SHAPE_COLUMN: i32 = 3;
/** pickup_kind: any */
export const PICKUP_KIND_ANY: i32 = 0;
/** pickup_kind: energy */
export const PICKUP_KIND_ENERGY: i32 = 1;
/** pickup_kind: health */
export const PICKUP_KIND_HEALTH: i32 = 2;
/** pickup_kind: armour */
export const PICKUP_KIND_ARMOUR: i32 = 3;
/** compute_unit: none */
export const COMPUTE_UNIT_NONE: i32 = 0;
/** compute_unit: operations */
export const COMPUTE_UNIT_OPERATIONS: i32 = 1;
/** compute_unit: fuel */
export const COMPUTE_UNIT_FUEL: i32 = 2;
/** compute_unit: cpu-ms */
export const COMPUTE_UNIT_CPU_MS: i32 = 3;
/** event: none */
export const EVENT_NONE: i32 = 0;
/** event: hello */
export const EVENT_HELLO: i32 = 1;
/** event: state */
export const EVENT_STATE: i32 = 2;
/** event: end */
export const EVENT_END: i32 = 3;

/** A vector in world axes. 24 bytes. */
export class Vec3 {
  static readonly SIZE: usize = 24;
  constructor(public readonly ptr: usize) {}
  /** A zeroed Vec3, from the heap. */
  static create(): Vec3 { const ptr = heap.alloc(24); memory.fill(ptr, 0, 24); return new Vec3(ptr); }
  get x(): f64 { return load<f64>(this.ptr, 0); }
  set x(value: f64) { store<f64>(this.ptr, value, 0); }
  get y(): f64 { return load<f64>(this.ptr, 8); }
  set y(value: f64) { store<f64>(this.ptr, value, 8); }
  get z(): f64 { return load<f64>(this.ptr, 16); }
  set z(value: f64) { store<f64>(this.ptr, value, 16); }
}

/** A rotation rate or torque about the robot's own axes. 24 bytes. */
export class Rotation {
  static readonly SIZE: usize = 24;
  constructor(public readonly ptr: usize) {}
  /** A zeroed Rotation, from the heap. */
  static create(): Rotation { const ptr = heap.alloc(24); memory.fill(ptr, 0, 24); return new Rotation(ptr); }
  get yaw(): f64 { return load<f64>(this.ptr, 0); }
  set yaw(value: f64) { store<f64>(this.ptr, value, 0); }
  get pitch(): f64 { return load<f64>(this.ptr, 8); }
  set pitch(value: f64) { store<f64>(this.ptr, value, 8); }
  get roll(): f64 { return load<f64>(this.ptr, 16); }
  set roll(value: f64) { store<f64>(this.ptr, value, 16); }
}

/** A direction as a heading and an elevation. 16 bytes. */
export class Direction {
  static readonly SIZE: usize = 16;
  constructor(public readonly ptr: usize) {}
  /** A zeroed Direction, from the heap. */
  static create(): Direction { const ptr = heap.alloc(16); memory.fill(ptr, 0, 16); return new Direction(ptr); }
  get heading(): f64 { return load<f64>(this.ptr, 0); }
  set heading(value: f64) { store<f64>(this.ptr, value, 0); }
  get pitch(): f64 { return load<f64>(this.ptr, 8); }
  set pitch(value: f64) { store<f64>(this.ptr, value, 8); }
}

/** The chassis axes as unit vectors in world axes. 72 bytes. */
export class AttitudeV1 {
  static readonly SIZE: usize = 72;
  constructor(public readonly ptr: usize) {}
  /** A zeroed AttitudeV1, from the heap. */
  static create(): AttitudeV1 { const ptr = heap.alloc(72); memory.fill(ptr, 0, 72); return new AttitudeV1(ptr); }
  get forward(): Vec3 { return new Vec3(this.ptr + 0); }
  get right(): Vec3 { return new Vec3(this.ptr + 24); }
  get up(): Vec3 { return new Vec3(this.ptr + 48); }
}
export { AttitudeV1 as Attitude };

/** What the previous tick applied to you, after the battery scaled the drive. 56 bytes. */
export class AppliedV1 {
  static readonly SIZE: usize = 56;
  constructor(public readonly ptr: usize) {}
  /** A zeroed AppliedV1, from the heap. */
  static create(): AppliedV1 { const ptr = heap.alloc(56); memory.fill(ptr, 0, 56); return new AppliedV1(ptr); }
  get force(): Vec3 { return new Vec3(this.ptr + 0); }
  get torque(): Rotation { return new Rotation(this.ptr + 24); }
  get brake(): f64 { return load<f64>(this.ptr, 48); }
  set brake(value: f64) { store<f64>(this.ptr, value, 48); }
}
export { AppliedV1 as Applied };

/** The scan that produced this tick's contacts: the one your previous act asked for. 32 bytes. */
export class ScanV1 {
  static readonly SIZE: usize = 32;
  constructor(public readonly ptr: usize) {}
  /** A zeroed ScanV1, from the heap. */
  static create(): ScanV1 { const ptr = heap.alloc(32); memory.fill(ptr, 0, 32); return new ScanV1(ptr); }
  get heading(): f64 { return load<f64>(this.ptr, 0); }
  set heading(value: f64) { store<f64>(this.ptr, value, 0); }
  get pitch(): f64 { return load<f64>(this.ptr, 8); }
  set pitch(value: f64) { store<f64>(this.ptr, value, 8); }
  get arc(): f64 { return load<f64>(this.ptr, 16); }
  set arc(value: f64) { store<f64>(this.ptr, value, 16); }
  get range(): f64 { return load<f64>(this.ptr, 24); }
  set range(value: f64) { store<f64>(this.ptr, value, 24); }
}
export { ScanV1 as Scan };

/** A robot the sensors detect this tick. 72 bytes. */
export class ContactV1 {
  static readonly SIZE: usize = 72;
  constructor(public readonly ptr: usize) {}
  /** A zeroed ContactV1, from the heap. */
  static create(): ContactV1 { const ptr = heap.alloc(72); memory.fill(ptr, 0, 72); return new ContactV1(ptr); }
  get slot(): i32 { return load<i32>(this.ptr, 0); }
  set slot(value: i32) { store<i32>(this.ptr, value, 0); }
  get source(): i32 { return load<i32>(this.ptr, 4); }
  set source(value: i32) { store<i32>(this.ptr, value, 4); }
  get range(): f64 { return load<f64>(this.ptr, 8); }
  set range(value: f64) { store<f64>(this.ptr, value, 8); }
  get bearing(): f64 { return load<f64>(this.ptr, 16); }
  set bearing(value: f64) { store<f64>(this.ptr, value, 16); }
  get elevation(): f64 { return load<f64>(this.ptr, 24); }
  set elevation(value: f64) { store<f64>(this.ptr, value, 24); }
  get bearing_error(): f64 { return load<f64>(this.ptr, 32); }
  set bearing_error(value: f64) { store<f64>(this.ptr, value, 32); }
  get range_error(): f64 { return load<f64>(this.ptr, 40); }
  set range_error(value: f64) { store<f64>(this.ptr, value, 40); }
  get position(): Vec3 { return new Vec3(this.ptr + 48); }
}
export { ContactV1 as Contact };

/** The most accurate passive contact the Tracker holds: where to look, not where to shoot. 40 bytes. */
export class CueV1 {
  static readonly SIZE: usize = 40;
  constructor(public readonly ptr: usize) {}
  /** A zeroed CueV1, from the heap. */
  static create(): CueV1 { const ptr = heap.alloc(40); memory.fill(ptr, 0, 40); return new CueV1(ptr); }
  get source(): i32 { return load<i32>(this.ptr, 0); }
  set source(value: i32) { store<i32>(this.ptr, value, 0); }
  get tick(): i32 { return load<i32>(this.ptr, 4); }
  set tick(value: i32) { store<i32>(this.ptr, value, 4); }
  get bearing_error(): f64 { return load<f64>(this.ptr, 8); }
  set bearing_error(value: f64) { store<f64>(this.ptr, value, 8); }
  get position(): Vec3 { return new Vec3(this.ptr + 16); }
}
export { CueV1 as Cue };

/** Where to aim for a shot fired now to meet a target, and when it meets it. 24 bytes. */
export class SolutionV1 {
  static readonly SIZE: usize = 24;
  constructor(public readonly ptr: usize) {}
  /** A zeroed SolutionV1, from the heap. */
  static create(): SolutionV1 { const ptr = heap.alloc(24); memory.fill(ptr, 0, 24); return new SolutionV1(ptr); }
  get heading(): f64 { return load<f64>(this.ptr, 0); }
  set heading(value: f64) { store<f64>(this.ptr, value, 0); }
  get pitch(): f64 { return load<f64>(this.ptr, 8); }
  set pitch(value: f64) { store<f64>(this.ptr, value, 8); }
  get time(): f64 { return load<f64>(this.ptr, 16); }
  set time(value: f64) { store<f64>(this.ptr, value, 16); }
}
export { SolutionV1 as Solution };

/** The sudden-death safe zone. 40 bytes. */
export class ZoneV1 {
  static readonly SIZE: usize = 40;
  constructor(public readonly ptr: usize) {}
  /** A zeroed ZoneV1, from the heap. */
  static create(): ZoneV1 { const ptr = heap.alloc(40); memory.fill(ptr, 0, 40); return new ZoneV1(ptr); }
  get shape(): i32 { return load<i32>(this.ptr, 0); }
  set shape(value: i32) { store<i32>(this.ptr, value, 0); }
  get reserved(): i32 { return load<i32>(this.ptr, 4); }
  set reserved(value: i32) { store<i32>(this.ptr, value, 4); }
  get radius(): f64 { return load<f64>(this.ptr, 8); }
  set radius(value: f64) { store<f64>(this.ptr, value, 8); }
  get center(): Vec3 { return new Vec3(this.ptr + 16); }
}
export { ZoneV1 as Zone };

/** The storm now. 72 bytes. */
export class StormV1 {
  static readonly SIZE: usize = 72;
  constructor(public readonly ptr: usize) {}
  /** A zeroed StormV1, from the heap. */
  static create(): StormV1 { const ptr = heap.alloc(72); memory.fill(ptr, 0, 72); return new StormV1(ptr); }
  get shape(): i32 { return load<i32>(this.ptr, 0); }
  set shape(value: i32) { store<i32>(this.ptr, value, 0); }
  get reserved(): i32 { return load<i32>(this.ptr, 4); }
  set reserved(value: i32) { store<i32>(this.ptr, value, 4); }
  get radius(): f64 { return load<f64>(this.ptr, 8); }
  set radius(value: f64) { store<f64>(this.ptr, value, 8); }
  get dps(): f64 { return load<f64>(this.ptr, 16); }
  set dps(value: f64) { store<f64>(this.ptr, value, 16); }
  get center(): Vec3 { return new Vec3(this.ptr + 24); }
  get velocity(): Vec3 { return new Vec3(this.ptr + 48); }
}
export { StormV1 as Storm };

/** The king-of-the-hill zone now. 80 bytes. */
export class HillV1 {
  static readonly SIZE: usize = 80;
  constructor(public readonly ptr: usize) {}
  /** A zeroed HillV1, from the heap. */
  static create(): HillV1 { const ptr = heap.alloc(80); memory.fill(ptr, 0, 80); return new HillV1(ptr); }
  get shape(): i32 { return load<i32>(this.ptr, 0); }
  set shape(value: i32) { store<i32>(this.ptr, value, 0); }
  get holder(): i32 { return load<i32>(this.ptr, 4); }
  set holder(value: i32) { store<i32>(this.ptr, value, 4); }
  get contested(): bool { return load<i32>(this.ptr, 8) != 0; }
  set contested(value: bool) { store<i32>(this.ptr, value ? 1 : 0, 8); }
  get moves_tick(): i32 { return load<i32>(this.ptr, 12); }
  set moves_tick(value: i32) { store<i32>(this.ptr, value, 12); }
  get held_ticks(): i32 { return load<i32>(this.ptr, 16); }
  set held_ticks(value: i32) { store<i32>(this.ptr, value, 16); }
  get best_held_ticks(): i32 { return load<i32>(this.ptr, 20); }
  set best_held_ticks(value: i32) { store<i32>(this.ptr, value, 20); }
  get radius(): f64 { return load<f64>(this.ptr, 24); }
  set radius(value: f64) { store<f64>(this.ptr, value, 24); }
  get center(): Vec3 { return new Vec3(this.ptr + 32); }
  get next(): Vec3 { return new Vec3(this.ptr + 56); }
}
export { HillV1 as Hill };

/** A cell on the field. 40 bytes. */
export class PickupV1 {
  static readonly SIZE: usize = 40;
  constructor(public readonly ptr: usize) {}
  /** A zeroed PickupV1, from the heap. */
  static create(): PickupV1 { const ptr = heap.alloc(40); memory.fill(ptr, 0, 40); return new PickupV1(ptr); }
  get kind(): i32 { return load<i32>(this.ptr, 0); }
  set kind(value: i32) { store<i32>(this.ptr, value, 0); }
  get expires_tick(): i32 { return load<i32>(this.ptr, 4); }
  set expires_tick(value: i32) { store<i32>(this.ptr, value, 4); }
  get amount(): f64 { return load<f64>(this.ptr, 8); }
  set amount(value: f64) { store<f64>(this.ptr, value, 8); }
  get position(): Vec3 { return new Vec3(this.ptr + 16); }
}
export { PickupV1 as Pickup };

/** How the match charges compute against the battery. 16 bytes. */
export class ComputeV1 {
  static readonly SIZE: usize = 16;
  constructor(public readonly ptr: usize) {}
  /** A zeroed ComputeV1, from the heap. */
  static create(): ComputeV1 { const ptr = heap.alloc(16); memory.fill(ptr, 0, 16); return new ComputeV1(ptr); }
  get k(): f64 { return load<f64>(this.ptr, 0); }
  set k(value: f64) { store<f64>(this.ptr, value, 0); }
  get quanta(): i32 { return load<i32>(this.ptr, 8); }
  set quanta(value: i32) { store<i32>(this.ptr, value, 8); }
  get unit(): i32 { return load<i32>(this.ptr, 12); }
  set unit(value: i32) { store<i32>(this.ptr, value, 12); }
}
export { ComputeV1 as Compute };

/** The match is 2D or 3D. */
@external("clunkyard", "match_mode")
export declare function match_mode(out: usize): i32;
/** The ruleset in play. */
@external("clunkyard", "match_ruleset")
export declare function match_ruleset(out: usize): i32;
/** Whether the drive sets speeds (direct) or forces. */
@external("clunkyard", "match_control")
export declare function match_control(out: usize): i32;
/** Robots in the match, you included; slots run 1 to this. */
@external("clunkyard", "match_robots")
export declare function match_robots(out: usize): i32;
/** The match is 3D. */
@external("clunkyard", "match_is_3d")
export declare function match_is_3d(out: usize): i32;
/** Ticks per second. */
@external("clunkyard", "match_tick_rate")
export declare function match_tick_rate(out: usize): i32;
/** The last tick the match can reach. */
@external("clunkyard", "match_max_ticks")
export declare function match_max_ticks(out: usize): i32;
/** The id the protocol gives the robot in a slot. */
@external("clunkyard", "robot_id")
export declare function robot_id(slot: i32, buf: usize, capacity: u32, length: usize): i32;
/** This tick, from 0. */
@external("clunkyard", "clock_tick")
export declare function clock_tick(out: usize): i32;
/** The match time in seconds. */
@external("clunkyard", "clock_seconds")
export declare function clock_seconds(out: usize): i32;
/** Ticks left: match.max_ticks less this tick. */
@external("clunkyard", "clock_remaining_ticks")
export declare function clock_remaining_ticks(out: usize): i32;
/** The arena runs from 0 to this on each axis. */
@external("clunkyard", "arena_size")
export declare function arena_size(out: usize): i32;
/** The acceleration of gravity, units/s². */
@external("clunkyard", "arena_gravity")
export declare function arena_gravity(out: usize): i32;
/** The kind of ground: none, flat or hills. */
@external("clunkyard", "arena_terrain_kind")
export declare function arena_terrain_kind(out: usize): i32;
/** The height of the ground at a point, interpolated as the arena does. */
@external("clunkyard", "arena_ground_height")
export declare function arena_ground_height(x: f64, y: f64, out: usize): i32;
/** Health left. */
@external("clunkyard", "me_health")
export declare function me_health(out: usize): i32;
/** Your centre. */
@external("clunkyard", "me_position")
export declare function me_position(out: usize): i32;
/** Your velocity, units/s. */
@external("clunkyard", "me_velocity")
export declare function me_velocity(out: usize): i32;
/** Your chassis heading. */
@external("clunkyard", "me_heading")
export declare function me_heading(out: usize): i32;
/** Your chassis pitch; 0 in 2D. */
@external("clunkyard", "me_pitch")
export declare function me_pitch(out: usize): i32;
/** Your chassis roll; 0 in 2D and classic. */
@external("clunkyard", "me_roll")
export declare function me_roll(out: usize): i32;
/** Your rotation rates, degrees/s. */
@external("clunkyard", "me_angular_velocity")
export declare function me_angular_velocity(out: usize): i32;
/** Your chassis axes in world axes. */
@external("clunkyard", "me_attitude_v1")
export declare function me_attitude_v1(out: usize): i32;
/** You rest on the ground, under gravity. */
@external("clunkyard", "me_grounded")
export declare function me_grounded(out: usize): i32;
/** In 3D, the height of your underside above the ground. */
@external("clunkyard", "me_altitude")
export declare function me_altitude(out: usize): i32;
/** What the previous tick applied to you. */
@external("clunkyard", "me_applied_v1")
export declare function me_applied_v1(out: usize): i32;
/** Charge now, before this tick's regeneration and driving. */
@external("clunkyard", "battery_charge")
export declare function battery_charge(out: usize): i32;
/** Charge when full. */
@external("clunkyard", "battery_capacity")
export declare function battery_capacity(out: usize): i32;
/** Charge regained each second. */
@external("clunkyard", "battery_regen")
export declare function battery_regen(out: usize): i32;
/** The drive fraction regeneration pays for forever. */
@external("clunkyard", "battery_sustainable_drive")
export declare function battery_sustainable_drive(out: usize): i32;
/** How compute is charged, when the match charges it. */
@external("clunkyard", "battery_compute_v1")
export declare function battery_compute_v1(out: usize): i32;
/** What holding a drive fraction costs each second, by hello.formulas.driveCost. */
@external("clunkyard", "battery_drive_cost")
export declare function battery_drive_cost(fraction: f64, out: usize): i32;
/** The forces.lift that cancels gravity for a level robot; 0 without gravity. */
@external("clunkyard", "drive_hover_lift")
export declare function drive_hover_lift(out: usize): i32;
/** Ask for direct controls this tick; the arena decides what they do in the ruleset. */
@external("clunkyard", "drive_throttle")
export declare function drive_throttle(value: f64): i32;
/** Ask for direct controls this tick; the arena decides what they do in the ruleset. */
@external("clunkyard", "drive_turn")
export declare function drive_turn(value: f64): i32;
/** Ask for direct controls this tick; the arena decides what they do in the ruleset. */
@external("clunkyard", "drive_pitch_turn")
export declare function drive_pitch_turn(value: f64): i32;
/** Ask for forces and torques this tick, in the force rulesets. */
@external("clunkyard", "drive_thrust")
export declare function drive_thrust(value: f64): i32;
/** Ask for forces and torques this tick, in the force rulesets. */
@external("clunkyard", "drive_strafe")
export declare function drive_strafe(value: f64): i32;
/** Ask for forces and torques this tick, in the force rulesets. */
@external("clunkyard", "drive_lift")
export declare function drive_lift(value: f64): i32;
/** Ask for forces and torques this tick, in the force rulesets. */
@external("clunkyard", "drive_yaw_torque")
export declare function drive_yaw_torque(value: f64): i32;
/** Ask for forces and torques this tick, in the force rulesets. */
@external("clunkyard", "drive_pitch_torque")
export declare function drive_pitch_torque(value: f64): i32;
/** Ask for forces and torques this tick, in the force rulesets. */
@external("clunkyard", "drive_roll_torque")
export declare function drive_roll_torque(value: f64): i32;
/** Ask for forces and torques this tick, in the force rulesets. */
@external("clunkyard", "drive_brake")
export declare function drive_brake(value: f64): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_throttle")
export declare function drive_get_throttle(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_turn")
export declare function drive_get_turn(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_pitch_turn")
export declare function drive_get_pitch_turn(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_thrust")
export declare function drive_get_thrust(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_strafe")
export declare function drive_get_strafe(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_lift")
export declare function drive_get_lift(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_yaw_torque")
export declare function drive_get_yaw_torque(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_pitch_torque")
export declare function drive_get_pitch_torque(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_roll_torque")
export declare function drive_get_roll_torque(out: usize): i32;
/** What this tick's act holds for a drive field so far, as set. */
@external("clunkyard", "drive_get_brake")
export declare function drive_get_brake(out: usize): i32;
/** Where the turret points now; a shot leaves along it. */
@external("clunkyard", "gun_aim_now")
export declare function gun_aim_now(out: usize): i32;
/** Ticks until the gun can fire; 0 means it can fire this tick. */
@external("clunkyard", "gun_cooldown_ticks")
export declare function gun_cooldown_ticks(out: usize): i32;
/** The aim spread a shot would have at your speed now. */
@external("clunkyard", "gun_spread")
export declare function gun_spread(out: usize): i32;
/** The heaviest shot the battery pays for now; 0 when it cannot pay for the lightest. */
@external("clunkyard", "gun_max_power")
export declare function gun_max_power(out: usize): i32;
/** The escalation multiplier on hit damage this tick. */
@external("clunkyard", "gun_damage_scale")
export declare function gun_damage_scale(out: usize): i32;
/** The cooldown is 0 and the battery pays for a shot at this power and still holds the reserve. */
@external("clunkyard", "gun_can_fire")
export declare function gun_can_fire(power: f64, reserve: f64, out: usize): i32;
/** How fast a shot at this power flies, units/s, by hello.formulas.shotSpeed. */
@external("clunkyard", "gun_shot_speed")
export declare function gun_shot_speed(power: f64, out: usize): i32;
/** What a shot at this power costs the battery, by hello.formulas.shotCost. */
@external("clunkyard", "gun_shot_cost")
export declare function gun_shot_cost(power: f64, out: usize): i32;
/** The reload after a shot at this power, ticks, by hello.formulas.reloadTicks. */
@external("clunkyard", "gun_reload_ticks")
export declare function gun_reload_ticks(power: f64, out: usize): i32;
/** The damage of a hit at this power before escalation, by hello.formulas.shotDamage. */
@external("clunkyard", "gun_shot_damage")
export declare function gun_shot_damage(power: f64, out: usize): i32;
/** The power whose shot flies at this speed, within the legal powers, by hello.formulas.powerForSpeed. */
@external("clunkyard", "gun_power_for_speed")
export declare function gun_power_for_speed(speed: f64, out: usize): i32;
/** The power whose shot covers this range in this time, within the legal powers. */
@external("clunkyard", "gun_power_for_flight_time")
export declare function gun_power_for_flight_time(range: f64, seconds: f64, out: usize): i32;
/** The aim at which a shot fired now meets the contact if it holds its tracked velocity; absent when no shot reaches it. */
@external("clunkyard", "gun_lead_v1")
export declare function gun_lead_v1(contact: usize, power: f64, out: usize): i32;
/** The aim at which a shot fired now meets a point moving at this velocity; absent when no shot reaches it. */
@external("clunkyard", "gun_lead_point_v1")
export declare function gun_lead_point_v1(position: usize, velocity: usize, power: f64, out: usize): i32;
/** Ask the turret to turn toward a direction; it slews at gun.turnRate. */
@external("clunkyard", "gun_aim_heading")
export declare function gun_aim_heading(value: f64): i32;
/** Ask the turret to turn toward a direction; it slews at gun.turnRate. */
@external("clunkyard", "gun_aim_pitch")
export declare function gun_aim_pitch(value: f64): i32;
/** Ask to fire this tick; the arena decides whether the gun and battery allow it. */
@external("clunkyard", "gun_fire")
export declare function gun_fire(): i32;
/** Ask to fire this tick; the arena decides whether the gun and battery allow it. */
@external("clunkyard", "gun_power")
export declare function gun_power(value: f64): i32;
/** What this tick's act holds for a gun field so far, as set. */
@external("clunkyard", "gun_get_aim_heading")
export declare function gun_get_aim_heading(out: usize): i32;
/** What this tick's act holds for a gun field so far, as set. */
@external("clunkyard", "gun_get_aim_pitch")
export declare function gun_get_aim_pitch(out: usize): i32;
/** What this tick's act holds for a gun field so far, as set. */
@external("clunkyard", "gun_get_fire")
export declare function gun_get_fire(out: usize): i32;
/** What this tick's act holds for a gun field so far, as set. */
@external("clunkyard", "gun_get_power")
export declare function gun_get_power(out: usize): i32;
/** The scan that produced this tick's contacts. */
@external("clunkyard", "scanner_last_v1")
export declare function scanner_last_v1(out: usize): i32;
/** Robots this close are detected in any direction. */
@external("clunkyard", "scanner_proximity_range")
export declare function scanner_proximity_range(out: usize): i32;
/** How far a scan of this arc reaches, by hello.formulas.reach. */
@external("clunkyard", "scanner_reach")
export declare function scanner_reach(arc: f64, out: usize): i32;
/** The widest arc that still reaches this far, by hello.formulas.arcForReach. */
@external("clunkyard", "scanner_arc_for_reach")
export declare function scanner_arc_for_reach(range: f64, out: usize): i32;
/** Ask where the scanner points for the next state. */
@external("clunkyard", "scanner_heading")
export declare function scanner_heading(value: f64): i32;
/** Ask where the scanner points for the next state. */
@external("clunkyard", "scanner_arc")
export declare function scanner_arc(value: f64): i32;
/** Ask where the scanner points for the next state. */
@external("clunkyard", "scanner_pitch")
export declare function scanner_pitch(value: f64): i32;
/** What this tick's act holds for a scanner field so far, as set. */
@external("clunkyard", "scanner_get_heading")
export declare function scanner_get_heading(out: usize): i32;
/** What this tick's act holds for a scanner field so far, as set. */
@external("clunkyard", "scanner_get_arc")
export declare function scanner_get_arc(out: usize): i32;
/** What this tick's act holds for a scanner field so far, as set. */
@external("clunkyard", "scanner_get_pitch")
export declare function scanner_get_pitch(out: usize): i32;
/** Every contact this tick: scan and proximity first, nearest first, then passive ones. */
@external("clunkyard", "sensors_contacts_v1")
export declare function sensors_contacts_v1(out: usize, capacity: u32, count: usize): i32;
/** The nearest precise contact this tick. Passive contacts are never returned. */
@external("clunkyard", "sensors_nearest_v1")
export declare function sensors_nearest_v1(out: usize): i32;
/** This tick's passive contacts, most accurate (smallest bearing error) first. */
@external("clunkyard", "sensors_cues_v1")
export declare function sensors_cues_v1(out: usize, capacity: u32, count: usize): i32;
/** The precise contact for a robot this tick, if it was detected. */
@external("clunkyard", "sensors_contact_v1")
export declare function sensors_contact_v1(slot: i32, out: usize): i32;
/** Where a contact places its robot: your position plus its range along its bearing and elevation. */
@external("clunkyard", "sensors_position_of_v1")
export declare function sensors_position_of_v1(contact: usize, out: usize): i32;
/** The most accurate passive contact heard in the last cue_ticks (60 by default), or absent. */
@external("clunkyard", "tracker_cue_v1")
export declare function tracker_cue_v1(out: usize): i32;
/** How fast the nearest contact's bearing turns, from two sightings. */
@external("clunkyard", "tracker_nearest_bearing_rate")
export declare function tracker_nearest_bearing_rate(out: usize): i32;
/** The robot's tracked velocity; zero when it has no track. */
@external("clunkyard", "tracker_velocity")
export declare function tracker_velocity(slot: i32, out: usize): i32;
/** Where the robot was last seen, if it was. */
@external("clunkyard", "tracker_position")
export declare function tracker_position(slot: i32, out: usize): i32;
/** The tick the robot was last seen, if it was. */
@external("clunkyard", "tracker_last_seen")
export declare function tracker_last_seen(slot: i32, out: usize): i32;
/** Sets the Tracker's parameters, in the robot's start only; after the first state it refuses with E_PHASE. */
@external("clunkyard", "tracker_configure")
export declare function tracker_configure(smoothing: f64, forget_ticks: i32, cue_ticks: i32): i32;
/** The sudden-death safe zone, once sudden death starts. */
@external("clunkyard", "nav_zone_v1")
export declare function nav_zone_v1(out: usize): i32;
/** How far inside the zone a point is, by its shape's distance; absent while there is none. */
@external("clunkyard", "nav_zone_margin")
export declare function nav_zone_margin(point: usize, out: usize): i32;
/** The point is inside the zone by at least the margin; absent while there is none. */
@external("clunkyard", "nav_zone_contains")
export declare function nav_zone_contains(point: usize, margin: f64, out: usize): i32;
/** How far a point is from the zone's edge, 0 inside; absent while there is none. */
@external("clunkyard", "nav_zone_distance_from")
export declare function nav_zone_distance_from(point: usize, out: usize): i32;
/** The storm, once it enters. */
@external("clunkyard", "nav_storm_v1")
export declare function nav_storm_v1(out: usize): i32;
/** How far inside the storm a point is, by its shape's distance; absent while there is none. */
@external("clunkyard", "nav_storm_margin")
export declare function nav_storm_margin(point: usize, out: usize): i32;
/** The point is inside the storm by at least the margin; absent while there is none. */
@external("clunkyard", "nav_storm_contains")
export declare function nav_storm_contains(point: usize, margin: f64, out: usize): i32;
/** How far a point is from the storm's edge, 0 inside; absent while there is none. */
@external("clunkyard", "nav_storm_distance_from")
export declare function nav_storm_distance_from(point: usize, out: usize): i32;
/** The hill, once it appears. */
@external("clunkyard", "nav_hill_v1")
export declare function nav_hill_v1(out: usize): i32;
/** How far inside the hill a point is, by its shape's distance; absent while there is none. */
@external("clunkyard", "nav_hill_margin")
export declare function nav_hill_margin(point: usize, out: usize): i32;
/** The point is inside the hill by at least the margin; absent while there is none. */
@external("clunkyard", "nav_hill_contains")
export declare function nav_hill_contains(point: usize, margin: f64, out: usize): i32;
/** How far a point is from the hill's edge, 0 inside; absent while there is none. */
@external("clunkyard", "nav_hill_distance_from")
export declare function nav_hill_distance_from(point: usize, out: usize): i32;
/** Every pickup on the field. */
@external("clunkyard", "nav_pickups_v1")
export declare function nav_pickups_v1(out: usize, capacity: u32, count: usize): i32;
/** The pickup of this kind nearest you by field distance, if there is one. */
@external("clunkyard", "nav_nearest_pickup_v1")
export declare function nav_nearest_pickup_v1(kind: i32, out: usize): i32;
/** The distance between two points as the field measures it: in the plane under gravity, in space otherwise. */
@external("clunkyard", "nav_field_distance")
export declare function nav_field_distance(a: usize, b: usize, out: usize): i32;
/** Your score; absent when the match does not score. */
@external("clunkyard", "score_me")
export declare function score_me(out: usize): i32;
/** The best other robot's score; absent when the match does not score. */
@external("clunkyard", "score_best")
export declare function score_best(out: usize): i32;
/** Your armour; absent when the match has no objectives. */
@external("clunkyard", "score_armour")
export declare function score_armour(out: usize): i32;
/** An angle brought into 0 to 360, exactly: degrees % 360, plus 360 when that is negative. */
@external("clunkyard", "angles_normalize")
export declare function angles_normalize(degrees: f64, out: usize): i32;
/** The signed turn from current to target: normalize(target - current + 540) - 180. */
@external("clunkyard", "angles_angle_diff")
export declare function angles_angle_diff(target: f64, current: f64, out: usize): i32;
/** The heading from one point to another. */
@external("clunkyard", "angles_bearing_to")
export declare function angles_bearing_to(from: usize, to: usize, out: usize): i32;
/** The elevation from one point to another. */
@external("clunkyard", "angles_elevation_to")
export declare function angles_elevation_to(from: usize, to: usize, out: usize): i32;
/** The unit vector along a heading and pitch. */
@external("clunkyard", "angles_direction")
export declare function angles_direction(heading: f64, pitch: f64, out: usize): i32;
/** The straight-line distance between two points. */
@external("clunkyard", "angles_distance")
export declare function angles_distance(a: usize, b: usize, out: usize): i32;
/** A value held within low and high. */
@external("clunkyard", "angles_clamp")
export declare function angles_clamp(value: f64, low: f64, high: f64, out: usize): i32;
/** Set the status line; leaving it out keeps the last one. */
@external("clunkyard", "status_text")
export declare function status_text(text: usize, text_length: u32): i32;
/** Set the status line; leaving it out keeps the last one. */
@external("clunkyard", "status_value")
export declare function status_value(value: f64): i32;
/** What this tick's act holds for the status line so far, as set. */
@external("clunkyard", "status_get_text")
export declare function status_get_text(buf: usize, capacity: u32, length: usize): i32;
/** What this tick's act holds for the status line so far, as set. */
@external("clunkyard", "status_get_value")
export declare function status_get_value(out: usize): i32;
/** The number at a path, if there is one. */
@external("clunkyard", "raw_number")
export declare function raw_number(path: usize, path_length: u32, out: usize): i32;
/** The string at a path, if there is one. */
@external("clunkyard", "raw_text")
export declare function raw_text(path: usize, path_length: u32, buf: usize, capacity: u32, length: usize): i32;
/** Something is at the path. */
@external("clunkyard", "raw_has")
export declare function raw_has(path: usize, path_length: u32, out: usize): i32;
/** The boolean at a path, if there is one. */
@external("clunkyard", "raw_flag")
export declare function raw_flag(path: usize, path_length: u32, out: usize): i32;
/** The length of the array at a path, if there is one. */
@external("clunkyard", "raw_count")
export declare function raw_count(path: usize, path_length: u32, out: usize): i32;
/** The last line the session read: the hello, or the latest state. */
@external("clunkyard", "raw_line")
export declare function raw_line(buf: usize, capacity: u32, length: usize): i32;
/** Adds fields the API does not cover to this tick's act; a key the API writes (v, type, tick, drive, forces, aim, scan, fire, status) is refused with E_ARGUMENT. */
@external("clunkyard", "raw_extra")
export declare function raw_extra(json: usize, json_length: u32): i32;
/** Writes a line to standard error, never to the protocol. */
@external("clunkyard", "session_log")
export declare function session_log(line: usize, line_length: u32): i32;
/** The seed for the robot's own randomness. */
@external("clunkyard", "robot_seed")
export declare function robot_seed(out: usize): i32;

export { me_attitude_v1 as me_attitude };
export { me_applied_v1 as me_applied };
export { battery_compute_v1 as battery_compute };
export { gun_lead_v1 as gun_lead };
export { gun_lead_point_v1 as gun_lead_point };
export { scanner_last_v1 as scanner_last };
export { sensors_contacts_v1 as sensors_contacts };
export { sensors_nearest_v1 as sensors_nearest };
export { sensors_cues_v1 as sensors_cues };
export { sensors_contact_v1 as sensors_contact };
export { sensors_position_of_v1 as sensors_position_of };
export { tracker_cue_v1 as tracker_cue };
export { nav_zone_v1 as nav_zone };
export { nav_storm_v1 as nav_storm };
export { nav_hill_v1 as nav_hill };
export { nav_pickups_v1 as nav_pickups };
export { nav_nearest_pickup_v1 as nav_nearest_pickup };

let startFn: (() => void) | null = null;
let turnFn: (() => void) | null = null;

/** Registers the robot: start runs once after the hello (null for none), turn once a state. */
export function robot(start: (() => void) | null, turn: () => void): void {
  startFn = start;
  turnFn = turn;
}

export function clunkyard_start(): i32 {
  const start = startFn;
  if (start) start();
  return 0;
}

export function clunkyard_turn(): i32 {
  const turn = turnFn;
  if (turn) turn();
  return 0;
}

/** The abort the host allows: a trap (--use abort=clunkyard/cyAbort). */
export function cyAbort(message: string | null, file: string | null, line: u32, column: u32): void {
  unreachable();
}
