/**
 * Hero choreography, shared by the 3D corridor and the type overlay so the
 * two can never drift apart.
 *
 * The hero alternates between two modes as you scroll:
 *   - IMAGE phases — prints fly past the camera, the backdrop sits low
 *   - TEXT phases  — prints fade out entirely and the backdrop footage
 *                    comes up bright, so a line of type reads over clean
 *                    moving light
 *
 * Anything outside a TEXT phase is an IMAGE phase. Edit the windows here
 * to re-time the whole hero.
 */

export type Phase = { start: number; end: number };

export const TEXT_PHASES: Phase[] = [
  { start: 0.21, end: 0.31 },
  { start: 0.53, end: 0.63 },
  { start: 0.85, end: 0.95 },
];

export const HERO_LINES = [
  "Every frame is a room you can walk back into.",
  "Weddings · Portraits · Parties · Events · Commercial",
  "We shoot the in-between — the half-second before everyone remembers to pose.",
];

/** Crossfade width, in progress units, on each side of a text phase. */
const FADE = 0.05;

/** 0 = pure image phase, 1 = fully in a text phase. */
export function textPhaseStrength(t: number): number {
  let strongest = 0;
  for (const phase of TEXT_PHASES) {
    let v = 0;
    if (t >= phase.start - FADE && t <= phase.end + FADE) {
      if (t < phase.start) v = (t - (phase.start - FADE)) / FADE;
      else if (t > phase.end) v = 1 - (t - phase.end) / FADE;
      else v = 1;
    }
    strongest = Math.max(strongest, Math.min(1, Math.max(0, v)));
  }
  return strongest;
}

/** Opacity for one text line: fades in, holds, fades out inside its phase. */
export function lineOpacity(t: number, index: number): number {
  const phase = TEXT_PHASES[index];
  if (!phase || t < phase.start - FADE || t > phase.end + FADE) return 0;
  const span = phase.end - phase.start;
  const inEnd = phase.start + span * 0.28;
  const outStart = phase.end - span * 0.28;
  if (t < inEnd) return Math.max(0, (t - (phase.start - FADE)) / (inEnd - (phase.start - FADE)));
  if (t <= outStart) return 1;
  return Math.max(0, 1 - (t - outStart) / (phase.end + FADE - outStart));
}
