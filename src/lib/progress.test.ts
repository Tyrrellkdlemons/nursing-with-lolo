import { describe, expect, it } from 'vitest';
import { calculateAccuracy, subjectAccuracy } from './progress';

describe('progress calculations', () => {
  const attempts = [
    { questionId: '1', correct: true, subject: 'Safety', answeredAt: '2026-07-13' },
    { questionId: '2', correct: false, subject: 'Safety', answeredAt: '2026-07-13' },
    { questionId: '3', correct: true, subject: 'Pharmacology', answeredAt: '2026-07-13' },
  ];
  it('calculates overall accuracy', () => expect(calculateAccuracy(attempts)).toBe(67));
  it('calculates subject accuracy', () => expect(subjectAccuracy(attempts)).toEqual({ Safety: 50, Pharmacology: 100 }));
  it('returns zero for no attempts', () => expect(calculateAccuracy([])).toBe(0));
});

