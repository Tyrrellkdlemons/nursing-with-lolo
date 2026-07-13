import { describe, expect, it } from 'vitest';
import { contentTotals, flashcards, lessons, practiceExams, questions } from './catalog';
import { downloadResources, resourceLessonMap } from './resources';

describe('curriculum catalog', () => {
  it('meets required content totals', () => {
    expect(contentTotals).toEqual({ lessons: 30, flashcards: 300, questions: 250, exams: 5 });
  });

  it('uses unique identifiers', () => {
    for (const collection of [lessons, flashcards, questions, practiceExams]) {
      const ids = collection.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('keeps complete answer rationales', () => {
    const standard = questions.filter((question) => question.type === 'multiple-choice' || question.type === 'multiple-response');
    for (const question of standard) {
      expect(question.rationale.length).toBeGreaterThan(20);
      expect(question.optionRationales).toHaveLength(question.options.length);
      expect(question.correct.length).toBeGreaterThan(0);
    }
  });

  it('keeps every card, question, exam, and download mapped to real content', () => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id));
    const questionIds = new Set(questions.map((question) => question.id));

    expect(flashcards.every((card) => lessonIds.has(card.lessonId))).toBe(true);
    expect(questions.every((question) => lessonIds.has(question.lessonId))).toBe(true);
    expect(practiceExams.every((exam) => exam.questionIds.length === 50 && exam.questionIds.every((id) => questionIds.has(id)))).toBe(true);
    expect(downloadResources.every((resource) => resourceLessonMap[resource.id]?.length > 0 && resourceLessonMap[resource.id].every((id) => lessonIds.has(id)))).toBe(true);
  });
});
