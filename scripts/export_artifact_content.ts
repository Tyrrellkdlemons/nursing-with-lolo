import { mkdir, writeFile } from 'node:fs/promises';
import { lessons } from '../src/content/catalog';
import { dosageProblems } from '../src/content/dosageProblems';
import { quickSheets } from '../src/content/quickSheets';
import { downloadResources, resourceLessonMap } from '../src/content/resources';

const unique = <T>(values: T[]) => [...new Set(values)];

const resources = downloadResources.map((resource) => {
  const selected = (resourceLessonMap[resource.id] ?? []).map((id) => lessons.find((lesson) => lesson.id === id)).filter(Boolean) as typeof lessons;
  const primary = selected[0] ?? lessons[0];
  return {
    ...resource,
    objectives: unique(selected.flatMap((lesson) => lesson.objectives)).slice(0, 6),
    simplified: unique(selected.flatMap((lesson) => lesson.simpleExplanation)).slice(0, 6),
    assessments: unique(selected.flatMap((lesson) => lesson.assessments)).slice(0, 8),
    priorities: unique(selected.flatMap((lesson) => lesson.priorityActions)).slice(0, 8),
    safety: unique(selected.flatMap((lesson) => lesson.safetyWarnings)).slice(0, 7),
    memory: unique(selected.flatMap((lesson) => lesson.memoryTricks)).slice(0, 6),
    summary: unique(selected.flatMap((lesson) => lesson.summary)).slice(0, 8),
    clinicalExample: primary.clinicalExample,
    questions: selected.flatMap((lesson) => lesson.questions.slice(0, 2)).slice(0, 4),
    sources: unique(selected.flatMap((lesson) => lesson.sources.map((source) => `${source.organization}|${source.title}|${source.url}`))).map((value) => {
      const [organization, title, url] = value.split('|'); return { organization, title, url };
    }),
    reviewedDate: '2026-07-13',
  };
});

await mkdir('tmp', { recursive: true });
await writeFile('tmp/artifact-content.json', JSON.stringify({ resources, quickSheets, dosageProblems }, null, 2), 'utf8');
console.log(`Exported ${resources.length} guides and ${quickSheets.length} quick sheets.`);
