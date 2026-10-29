/** The speed wheel: a walk-speed multiplier from half to double, 1x pointing straight up. */
export const MIN_SPEED = 0.5;
export const MAX_SPEED = 2;
const SWEEP = 135;
const KEY = "pad.speed";

export const clampSpeed = (v) => (Number.isFinite(v) ? Math.min(MAX_SPEED, Math.max(MIN_SPEED, v)) : 1);

/** Wheel angle in degrees for a speed: logarithmic, so 0.5x and 2x sit symmetric about 1x. */
export const angleOf = (speed) => (Math.log2(clampSpeed(speed)) / Math.log2(MAX_SPEED)) * SWEEP;

/** Speed for a wheel angle in degrees (clamped to the sweep). */
export const speedOf = (angle) => clampSpeed(2 ** ((Math.max(-SWEEP, Math.min(SWEEP, angle)) / SWEEP) * Math.log2(MAX_SPEED)));

/** One keyboard or scroll step: a quarter of 1x. */
export const nudge = (speed, dir) => clampSpeed(Math.round((speed + 0.25 * Math.sign(dir)) * 4) / 4);

export function loadSpeed() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw == null ? 1 : clampSpeed(Number.parseFloat(raw));
  } catch {
    return 1;
  }
}

export function saveSpeed(speed) {
  try {
    localStorage.setItem(KEY, String(clampSpeed(speed)));
  } catch {
    // Private mode or blocked storage: the wheel still works for this visit.
  }
}
