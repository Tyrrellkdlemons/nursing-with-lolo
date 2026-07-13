import { adultHealthLessons } from './lessons-adult-health';
import { foundationLessons } from './lessons-foundations';
import { specialtyLessons } from './lessons-specialties';
import { complexQuestions } from './complexQuestions';
import type { Flashcard, PracticeQuestion } from './types';

export const lessons = [...foundationLessons, ...adultHealthLessons, ...specialtyLessons];

export const flashcards: Flashcard[] = lessons.flatMap((lesson) =>
  lesson.facts.map((fact, index) => ({
    ...fact,
    id: `${lesson.id}-card-${String(index + 1).padStart(2, '0')}`,
    lessonId: lesson.id,
    subject: lesson.subject,
  })),
);

const standardQuestions: PracticeQuestion[] = lessons.flatMap((lesson) =>
  lesson.questions.map((question, index) => ({
    ...question,
    id: `${lesson.id}-q-${String(index + 1).padStart(2, '0')}`,
    lessonId: lesson.id,
    subject: lesson.subject,
  })),
);

export const questions: PracticeQuestion[] = [...standardQuestions, ...complexQuestions];

export const subjects = [...new Set(lessons.map((lesson) => lesson.subject))];

export const practiceExams = Array.from({ length: 5 }, (_, index) => ({
  id: `exam-${index + 1}`,
  title: index === 4 ? 'Comprehensive Readiness Exam' : `Practice Exam ${index + 1}`,
  description: '50 original mixed-subject questions with answer rationales and category feedback.',
  questionIds: questions.slice(index * 50, index * 50 + 50).map((question) => question.id),
  minutes: 75,
}));

export const contentTotals = {
  lessons: lessons.length,
  flashcards: flashcards.length,
  questions: questions.length,
  exams: practiceExams.length,
};

