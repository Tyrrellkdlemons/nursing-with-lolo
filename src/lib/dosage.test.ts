import { describe, expect, it } from 'vitest';
import { desiredOverHave, gravityRate, isDosageAnswerCorrect, poundsToKilograms, pumpRate } from './dosage';
import { dosageProblems } from '../content/dosageProblems';

describe('dosage calculation helpers', () => {
  it('calculates desired over have', () => expect(desiredOverHave(300, 150, 5)).toBe(10));
  it('calculates an hourly pump rate', () => expect(pumpRate(1000, 8)).toBe(125));
  it('rounds gravity drops to a whole drop', () => expect(gravityRate(500, 15, 240)).toBe(31));
  it('converts pounds to kilograms', () => expect(poundsToKilograms(176)).toBe(80));
  it('accepts answers within a problem tolerance', () => {
    const problem = dosageProblems.find((item) => item.id === 'dose-003')!;
    expect(isDosageAnswerCorrect(problem, 10.04)).toBe(true);
    expect(isDosageAnswerCorrect(problem, 10.2)).toBe(false);
  });
  it('rejects invalid divisors', () => expect(() => desiredOverHave(10, 0)).toThrow());
});

