# NURSING with LOLO Content Guide

This guide explains how to add or revise curriculum content without breaking search, flashcards, practice sessions, downloads, or learner progress. Public content must be original, clearly scoped as education, and safe enough to use as a study aid.

## Content map

| Content | Source | Current total | Consumer |
|---|---|---:|---|
| Lessons | `src/content/lessons-*.ts` | 30 | Courses, library, lesson reader, search |
| Flashcards | `Lesson.facts` | 300 | Flashcard study queue and dashboard |
| Standard questions | `Lesson.questions` | 240 | Lesson checks and practice engine |
| Advanced questions | `src/content/complexQuestions.ts` | 10 | Practice engine and NCLEX preparation |
| Practice exams | Derived in `src/content/catalog.ts` | 5 | NCLEX and practice exam modes |
| Case studies | `src/content/caseStudies.ts` | 3 | NCLEX clinical-judgment area |
| Dosage problems | `src/content/dosageProblems.ts` | 25 | Dosage Lab |
| Clinical skills | `src/content/clinicalSkills.ts` | 20 | Clinical Skills Center |
| Quick sheets | `src/content/quickSheets.ts` | 20 | Quick-reference library and PDF export |
| Download guides | `src/content/resources.ts` | 12 | Downloads and PDF/PPTX export |
| Study plans | `src/content/studyPlans.ts` | 5 | Study Planner |
| Reviewed sources | `src/content/sources.ts` | Shared registry | Lessons, skills, sheets, downloads |

`src/content/types.ts` is the schema reference. `src/content/catalog.ts` combines the collections and derives stable flashcard and standard-question IDs from each lesson ID and item position.

## ID rules

- Use lowercase kebab case: `respiratory-oxygenation`.
- Treat a published ID as permanent. Changing it disconnects stored progress, bookmarks, notes, and links.
- IDs must be unique across the relevant collection.
- Keep lesson IDs descriptive rather than tied to a course week or instructor.
- Flashcard IDs are generated as `<lesson-id>-card-01`; standard question IDs are generated as `<lesson-id>-q-01`.
- Advanced questions, dosage problems, case studies, skills, sheets, and resources define their own IDs and must not collide within their collection.

## Adding a lesson

Add a typed `Lesson` object to the most appropriate lesson collection:

- `lessons-foundations.ts`
- `lessons-adult-health.ts`
- `lessons-specialties.ts`

Then ensure its collection is included by `src/content/catalog.ts`. A complete lesson contains:

- identity and display metadata: ID, title, short title, subject, unit, icon, color, difficulty, minutes;
- purpose and objectives;
- plain-language explanation and key vocabulary;
- normal and abnormal findings plus risk factors;
- assessments, interventions, and ordered priority actions;
- medications, laboratory clues, diagnostics, and patient teaching;
- safety warnings, common mistakes, memory cues, and exam tips;
- a notice/interpret/respond/reflect clinical example;
- a quick summary;
- 10 flash facts;
- 8 original multiple-choice or multiple-response questions;
- reviewed public sources;
- review date, review status, and educational scope note.

Copy the object shape from an existing neighboring lesson rather than creating an untyped shortcut. TypeScript should catch missing fields.

### Lesson quality checklist

- Plain language comes before terminology.
- Expected, unexpected, and urgent cues are not blended together.
- Priority actions state what should be noticed or protected first without implying an unsupervised order.
- Safety warnings include escalation boundaries.
- Medication details avoid unsupported absolutes and remind learners to verify the exact product or order.
- Laboratory values note that ranges and critical thresholds vary when applicable.
- Clinical examples use fictional clients and contain no real identifying information.
- Memory tricks lead back to a correct concept instead of replacing reasoning.
- Review date uses `YYYY-MM-DD`.
- Use `reviewed` only after source and clinical review; otherwise use `instructor-check`.

## Writing flashcards

Lesson flashcards live in the `facts` array. Each flash fact needs:

- a focused prompt on the front;
- a concise, complete answer on the back;
- a useful tag;
- `easy`, `medium`, or `hard` difficulty.

Write one retrievable idea per card. Avoid vague fronts such as "Tell me about shock" and avoid answers so long that they become mini-lessons. Do not duplicate a card merely to increase the total.

Because IDs include the array position, append new cards when possible. Reordering published cards changes their generated IDs and can detach review history.

## Writing standard questions

Lesson questions support `multiple-choice` and `multiple-response`. Every question must include:

- a clinical prompt with enough information to answer;
- plausible original options;
- zero-based indexes in `correct`;
- an explanation of the reasoning in `rationale`;
- one explanation per answer in `optionRationales`;
- a priority concept;
- a test-taking clue that teaches reasoning rather than tricks;
- difficulty and Client Needs category.

Use one correct index for multiple choice and two or more only when multiple response is intentional. Avoid "all of the above," trivia, hidden assumptions, punitive language, and copyrighted test-bank wording. Ensure an option is not technically correct under a reasonable interpretation unless the rationale addresses the distinction.

Like flashcards, standard question IDs include their array position. Append rather than reorder whenever learner history matters.

## Adding advanced question types

Add advanced items to `src/content/complexQuestions.ts`. `QuestionType` supports:

- `ordered-response` with `orderedItems` and `correctOrder`;
- `matching` with `matchingPairs`;
- `dosage` with numeric answer and complete units in the prompt;
- `matrix` with `matrixRows`;
- `bow-tie` with conditions, actions, parameters, and correct indexes;
- `highlight` with source text and exact acceptable selections;
- `case-study` when a question is part of a broader unfolding case.

Every advanced item still needs a rationale, priority concept, test-taking clue, difficulty, Client Needs category, lesson link, and subject. Open the item in the practice engine and test both correct and incorrect paths.

## Adding a case study

Add a `CaseStudy` to `src/content/caseStudies.ts`. A case includes a fictional client, setting, and ordered stages. Every stage should introduce new information, ask a decision-focused question, define the correct selection indexes, and explain why the new data change the priority.

Do not use real patient details. Keep stages clinically coherent: later information must not contradict the earlier baseline unless the change is explicit.

## Adding a dosage problem

Add a `DosageProblem` to `src/content/dosageProblems.ts` with:

- ordered dose and available concentration;
- numeric answer, unit, and permitted tolerance;
- visible formula and worked steps;
- safe rounding or verification note;
- category and difficulty.

Compute every answer independently before committing. Keep units explicit in the prompt and steps. Avoid presenting generated practice as an authorization to calculate or administer a real client's medication. Changes to calculation logic belong in `src/lib/dosage.ts` and require tests in `src/lib/dosage.test.ts`.

## Adding a clinical skill

Add a `ClinicalSkill` to `src/content/clinicalSkills.ts`. Include supplies, preparation, ordered steps, safety checkpoints, common errors, a fictional documentation example, patient teaching, and a reviewed source.

Skills are conceptual study guides. They must tell the learner to follow current instructor, manufacturer, facility, legal, and scope requirements. Do not imply that reading a checklist establishes competency.

## Adding a quick-reference sheet

Add a sheet with the local `sheet(...)` helper in `src/content/quickSheets.ts`. Each sheet needs:

- stable ID and descriptive title;
- category, summary, and accessible accent color;
- compact sections with short points;
- reviewed source and date.

The helper generates `/downloads/quick-sheets/<id>.pdf`. Keep content concise enough for a printable sheet and avoid absolute laboratory, medication, or policy claims that vary by setting.

## Adding a downloadable guide

Add the guide metadata to `src/content/resources.ts`. The resource ID determines both output names:

```text
public/downloads/guides/<resource-id>.pdf
public/downloads/presentations/<resource-id>.pptx
```

Then map that resource ID to one or more lesson IDs in `scripts/export_artifact_content.ts`. The exporter collects objectives, simplified explanations, assessments, priorities, safety notes, memory cues, questions, and sources from those lessons.

Generate and inspect both formats after any resource or mapped-lesson change:

```bash
npm run export:artifacts
npm run generate:pdf
npm run generate:pptx
```

PowerPoint regeneration requires the Codex-bundled `@oai/artifact-tool` runtime (or an explicitly provided compatible package). The finished decks are already included in the release tree and do not require that runtime to build, deploy, download, or edit. See `README.md` for the exact prerequisite, isolated-workspace override variables, and QA expectations.

## Sources and review status

Prefer authoritative primary or public-health sources such as current government agencies, regulators, and official exam-plan publishers. Add reusable sources to `src/content/sources.ts` using the `SourceLink` shape:

```ts
{
  title: 'Page title',
  organization: 'Publishing organization',
  url: 'https://authoritative.example/page',
  reviewed: 'YYYY-MM-DD',
}
```

Open every link during review. Confirm that it directly supports the content, that the publication is current enough for the topic, and that the title and organization are accurate. Never invent a citation. Avoid long quotations; summarize in original language.

Use lesson-level `reviewStatus: 'instructor-check'` when content still needs subject-matter confirmation. A review date records the last check; it does not make the content universally applicable.

## Safety and copyright rules

- Do not import ATI, Canvas, commercial test-bank, textbook, or course-platform wording.
- Do not include student names, emails, account data, grades, session paths, or authenticated URLs.
- Do not write patient-specific diagnosis or treatment instructions.
- Do not claim accreditation, official NCLEX affiliation, or guaranteed passage.
- Do not present a fixed range or protocol as universal when laboratories and facilities differ.
- Do not describe a procedure without a scope, policy, supervision, and escalation boundary.
- Do not publish private archive material. `original-upload/` must remain ignored.

## Validation workflow

Before committing content:

```bash
npm run verify:content
npm run typecheck
npm run test:run
npm run build
```

Then perform a manual review:

1. Search for the new title, vocabulary, and tags.
2. Open the lesson from both Courses and the Library.
3. Complete each lesson question and inspect every rationale.
4. Review its flashcards in both desktop and mobile layouts.
5. Confirm bookmark, note, and completion state after refresh.
6. If artifacts changed, render every PDF page and presentation slide.
7. Check all source and download links.
8. Inspect the browser console and network panel.

The exact current totals are asserted in `src/content/catalog.test.ts`. If the curriculum intentionally grows, update those assertions only after reviewing the new material and its downstream exam distribution.
