import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { caseStudies } from '../src/content/caseStudies';
import { contentTotals, flashcards, lessons, practiceExams, questions } from '../src/content/catalog';
import { clinicalSkills } from '../src/content/clinicalSkills';
import { dosageProblems } from '../src/content/dosageProblems';
import { quickSheets } from '../src/content/quickSheets';
import { downloadResources, resourceLessonMap } from '../src/content/resources';
import { studyPlanTemplates } from '../src/content/studyPlans';
import type { PracticeQuestion } from '../src/content/types';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors: string[] = [];

const check = (condition: unknown, message: string) => {
  if (!condition) errors.push(message);
};

const checkUniqueIds = (label: string, values: Array<{ id: string }>) => {
  const seen = new Set<string>();
  for (const value of values) {
    check(Boolean(value.id.trim()), `${label} has a blank ID.`);
    check(!seen.has(value.id), `${label} has duplicate ID "${value.id}".`);
    seen.add(value.id);
  }
};

const validIndex = (value: number, length: number) => Number.isInteger(value) && value >= 0 && value < length;

check(contentTotals.lessons === 30 && lessons.length === 30, `Expected 30 lessons; found ${lessons.length}.`);
check(contentTotals.flashcards === 300 && flashcards.length === 300, `Expected 300 flashcards; found ${flashcards.length}.`);
check(contentTotals.questions === 250 && questions.length === 250, `Expected 250 questions; found ${questions.length}.`);
check(contentTotals.exams === 5 && practiceExams.length === 5, `Expected 5 exams; found ${practiceExams.length}.`);
check(dosageProblems.length === 25, `Expected 25 dosage problems; found ${dosageProblems.length}.`);
check(clinicalSkills.length === 20, `Expected 20 clinical skills; found ${clinicalSkills.length}.`);
check(quickSheets.length === 20, `Expected 20 quick sheets; found ${quickSheets.length}.`);
check(downloadResources.length === 12, `Expected 12 downloadable guide/deck pairs; found ${downloadResources.length}.`);
check(caseStudies.length === 3, `Expected 3 case studies; found ${caseStudies.length}.`);
check(studyPlanTemplates.length === 5, `Expected 5 study-plan templates; found ${studyPlanTemplates.length}.`);

checkUniqueIds('Lessons', lessons);
checkUniqueIds('Flashcards', flashcards);
checkUniqueIds('Questions', questions);
checkUniqueIds('Practice exams', practiceExams);
checkUniqueIds('Dosage problems', dosageProblems);
checkUniqueIds('Clinical skills', clinicalSkills);
checkUniqueIds('Quick sheets', quickSheets);
checkUniqueIds('Download resources', downloadResources);
checkUniqueIds('Case studies', caseStudies);
checkUniqueIds('Study-plan templates', studyPlanTemplates);

const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const questionById = new Map(questions.map((question) => [question.id, question]));

for (const lesson of lessons) {
  check(lesson.facts.length === 10, `${lesson.id} must contain 10 flashcard facts; found ${lesson.facts.length}.`);
  check(lesson.questions.length === 8, `${lesson.id} must contain 8 lesson questions; found ${lesson.questions.length}.`);
  check(lesson.objectives.length > 0, `${lesson.id} has no objectives.`);
  check(lesson.simpleExplanation.length > 0, `${lesson.id} has no simple explanation.`);
  check(lesson.summary.length >= 3, `${lesson.id} must have at least 3 summary points.`);
  check(lesson.sources.length > 0, `${lesson.id} has no source links.`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(lesson.reviewedDate), `${lesson.id} has an invalid reviewed date.`);
  lesson.sources.forEach((source) => check(/^https:\/\//.test(source.url), `${lesson.id} has a non-HTTPS source URL: ${source.url}`));
}

for (const card of flashcards) {
  const lesson = lessonById.get(card.lessonId);
  check(Boolean(lesson), `${card.id} points to missing lesson "${card.lessonId}".`);
  check(!lesson || card.subject === lesson.subject, `${card.id} subject does not match its lesson.`);
  check(Boolean(card.front.trim() && card.back.trim()), `${card.id} has an empty front or back.`);
}

const checkStandardQuestion = (question: PracticeQuestion) => {
  if (question.type === 'multiple-choice' || question.type === 'multiple-response') {
    check(question.options.length >= 2, `${question.id} needs at least two options.`);
    check(question.correct.length > 0, `${question.id} has no correct answer.`);
    check(question.correct.every((index) => validIndex(index, question.options.length)), `${question.id} has an out-of-range correct option.`);
    check(new Set(question.correct).size === question.correct.length, `${question.id} repeats a correct option index.`);
    check(question.optionRationales.length === question.options.length, `${question.id} must explain every answer option.`);
    check(question.type !== 'multiple-choice' || question.correct.length === 1, `${question.id} is multiple-choice but has ${question.correct.length} correct answers.`);
    check(question.type !== 'multiple-response' || question.correct.length >= 2, `${question.id} is multiple-response but has fewer than two correct answers.`);
  }
};

for (const question of questions) {
  const lesson = lessonById.get(question.lessonId);
  check(Boolean(lesson), `${question.id} points to missing lesson "${question.lessonId}".`);
  check(!lesson || question.subject === lesson.subject, `${question.id} subject "${question.subject}" does not match lesson subject "${lesson?.subject}".`);
  check(Boolean(question.prompt.trim() && question.rationale.trim()), `${question.id} has a blank prompt or rationale.`);
  checkStandardQuestion(question);

  if (question.type === 'ordered-response') {
    const count = question.orderedItems?.length ?? 0;
    check(count >= 2, `${question.id} needs ordered-response items.`);
    check(question.correctOrder?.length === count, `${question.id} correct order must include every item.`);
    check((question.correctOrder ?? []).every((index) => validIndex(index, count)), `${question.id} has an out-of-range order index.`);
    check(new Set(question.correctOrder).size === count, `${question.id} correct order must be a permutation.`);
  }
  if (question.type === 'matching') check((question.matchingPairs?.length ?? 0) >= 2, `${question.id} needs matching pairs.`);
  if (question.type === 'dosage') check(question.correct.length === 1 && Number.isFinite(question.correct[0]), `${question.id} needs one numeric answer.`);
  if (question.type === 'matrix') {
    check((question.matrixRows?.length ?? 0) >= 2, `${question.id} needs matrix rows.`);
    question.matrixRows?.forEach((row) => check(validIndex(row.correct, row.options.length), `${question.id} has an invalid matrix answer for "${row.label}".`));
  }
  if (question.type === 'bow-tie') {
    const bowTie = question.bowTie;
    check(Boolean(bowTie), `${question.id} has no bow-tie data.`);
    if (bowTie) {
      check(validIndex(bowTie.correctCondition, bowTie.conditions.length), `${question.id} has an invalid condition answer.`);
      check(bowTie.correctActions.length === 2 && bowTie.correctActions.every((index) => validIndex(index, bowTie.actions.length)), `${question.id} needs two valid action answers.`);
      check(bowTie.correctParameters.length === 2 && bowTie.correctParameters.every((index) => validIndex(index, bowTie.parameters.length)), `${question.id} needs two valid parameter answers.`);
    }
  }
  if (question.type === 'highlight') {
    check(Boolean(question.highlightText?.trim()), `${question.id} has no highlight text.`);
    check((question.highlightAnswers?.length ?? 0) > 0, `${question.id} has no highlight answers.`);
    question.highlightAnswers?.forEach((answer) => check(question.highlightText?.includes(answer), `${question.id} highlight answer is not present in its text.`));
  }
}

const examQuestionIds = new Set<string>();
for (const exam of practiceExams) {
  check(exam.questionIds.length === 50, `${exam.id} must contain 50 questions; found ${exam.questionIds.length}.`);
  check(new Set(exam.questionIds).size === exam.questionIds.length, `${exam.id} repeats a question.`);
  exam.questionIds.forEach((id) => {
    check(questionById.has(id), `${exam.id} points to missing question "${id}".`);
    check(!examQuestionIds.has(id), `${id} appears in more than one readiness exam.`);
    examQuestionIds.add(id);
  });
}
check(examQuestionIds.size === questions.length, `Readiness exams cover ${examQuestionIds.size} of ${questions.length} questions.`);

for (const problem of dosageProblems) {
  check(Number.isFinite(problem.answer), `${problem.id} has a non-numeric answer.`);
  check(problem.tolerance >= 0, `${problem.id} has a negative tolerance.`);
  check(problem.steps.length >= 2, `${problem.id} needs at least two solution steps.`);
  check(Boolean(problem.unit.trim() && problem.formula.trim()), `${problem.id} has a blank unit or formula.`);
}

for (const skill of clinicalSkills) {
  check(skill.steps.length >= 4, `${skill.id} needs at least four procedure steps.`);
  check(skill.safetyCheckpoints.length > 0, `${skill.id} has no safety checkpoints.`);
  check(/^https:\/\//.test(skill.source.url), `${skill.id} has a non-HTTPS source URL.`);
}

for (const sheet of quickSheets) {
  check(sheet.sections.length >= 2, `${sheet.id} needs at least two sections.`);
  check(sheet.downloadPath === `/downloads/quick-sheets/${sheet.id}.pdf`, `${sheet.id} has an unexpected download path.`);
  check(/^https:\/\//.test(sheet.source.url), `${sheet.id} has a non-HTTPS source URL.`);
}

const resourceIds = new Set(downloadResources.map((resource) => resource.id));
check(Object.keys(resourceLessonMap).length === resourceIds.size, 'Resource lesson map must have one entry for every download resource.');
for (const resource of downloadResources) {
  const mappedLessons = resourceLessonMap[resource.id] ?? [];
  check(mappedLessons.length > 0, `${resource.id} has no lesson mapping.`);
  mappedLessons.forEach((id) => check(lessonById.has(id), `${resource.id} maps to missing lesson "${id}".`));
  check(resource.pdf === `/downloads/guides/${resource.id}.pdf`, `${resource.id} has an unexpected PDF path.`);
  check(resource.pptx === `/downloads/presentations/${resource.id}.pptx`, `${resource.id} has an unexpected PPTX path.`);
}
Object.keys(resourceLessonMap).forEach((id) => check(resourceIds.has(id), `Resource lesson map has unknown key "${id}".`));

for (const studyCase of caseStudies) {
  check(studyCase.unfolding.length >= 3, `${studyCase.id} needs at least three unfolding stages.`);
  studyCase.unfolding.forEach((stage, index) => {
    check(stage.correct.length > 0, `${studyCase.id} stage ${index + 1} has no correct answer.`);
    check(stage.correct.every((answer) => validIndex(answer, stage.choices.length)), `${studyCase.id} stage ${index + 1} has an out-of-range correct answer.`);
  });
}

const routeRoots = new Set([
  '/', '/courses', '/library', '/flashcards', '/practice', '/nclex', '/dosage-lab', '/clinical-skills',
  '/quick-sheets', '/study-planner', '/downloads', '/notebook', '/progress', '/ask-lolo', '/settings', '/dashboard',
]);

const tsxFiles = (directory: string): string[] => readdirSync(directory).flatMap((entry) => {
  const path = join(directory, entry);
  return statSync(path).isDirectory() ? tsxFiles(path) : path.endsWith('.tsx') ? [path] : [];
});

for (const path of tsxFiles(join(root, 'src'))) {
  const source = readFileSync(path, 'utf8');
  const literalTargets = [...source.matchAll(/\bto="(\/[^"#]*)"/g)].map((match) => match[1]);
  for (const target of literalTargets) {
    const pathname = target.split('?')[0];
    if (pathname.startsWith('/lessons/')) {
      const id = pathname.slice('/lessons/'.length);
      check(lessonById.has(id), `${relative(root, path)} links to missing lesson "${id}".`);
    } else {
      check(routeRoots.has(pathname), `${relative(root, path)} links to unknown route "${pathname}".`);
    }
  }
}

if (errors.length) {
  console.error(`Content verification failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('Content verification passed.');
  console.log(`Validated ${lessons.length} lessons, ${flashcards.length} flashcards, ${questions.length} questions, ${practiceExams.length} exams, ${dosageProblems.length} dosage problems, ${clinicalSkills.length} clinical skills, ${quickSheets.length} quick sheets, ${downloadResources.length} guide/deck pairs, ${caseStudies.length} cases, and ${studyPlanTemplates.length} study plans.`);
}
