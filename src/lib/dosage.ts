import type { DosageProblem } from '../content/types';

export function isDosageAnswerCorrect(problem: DosageProblem, value: number): boolean {
  return Number.isFinite(value) && Math.abs(value - problem.answer) <= problem.tolerance;
}

export function desiredOverHave(desired: number, have: number, quantity = 1): number {
  if (!Number.isFinite(desired) || !Number.isFinite(have) || !Number.isFinite(quantity) || have === 0) {
    throw new Error('Use finite values and a non-zero available dose.');
  }
  return (desired / have) * quantity;
}

export function pumpRate(volumeMl: number, hours: number): number {
  if (volumeMl < 0 || hours <= 0) throw new Error('Volume must be non-negative and time must be positive.');
  return volumeMl / hours;
}

export function gravityRate(volumeMl: number, dropFactor: number, minutes: number): number {
  if (volumeMl < 0 || dropFactor <= 0 || minutes <= 0) throw new Error('Use valid positive infusion inputs.');
  return Math.round((volumeMl * dropFactor) / minutes);
}

export function poundsToKilograms(pounds: number): number {
  if (pounds < 0) throw new Error('Weight cannot be negative.');
  return pounds / 2.2;
}

