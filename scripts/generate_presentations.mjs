import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

async function loadArtifactTool() {
  try {
    return await import('@oai/artifact-tool');
  } catch (packageError) {
    const bundledRoot = path.join(
      process.env.HOME || os.homedir(),
      '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies',
      'node', 'node_modules', '@oai', 'artifact-tool', 'dist',
    );
    for (const relativeEntry of ['artifact_tool.mjs', path.join('node', 'artifact_tool.mjs')]) {
      try {
        return await import(pathToFileURL(path.join(bundledRoot, relativeEntry)).href);
      } catch {
        // Try the next supported bundled layout.
      }
    }
    throw new Error(
      'PowerPoint generation requires the Codex bundled @oai/artifact-tool runtime. Run this command inside Codex, or use the already-generated decks in public/downloads/presentations.',
      { cause: packageError },
    );
  }
}

const { Presentation, PresentationFile } = await loadArtifactTool();

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.NURSING_LOLO_ROOT || path.resolve(scriptDir, '..');
const dataPath = process.env.NURSING_LOLO_DATA || path.join(root, 'tmp', 'artifact-content.json');
const outputDir = process.env.NURSING_LOLO_PPTX_OUT || path.join(root, 'public', 'downloads', 'presentations');
const qaDir = process.env.NURSING_LOLO_PPTX_QA || path.join(root, 'tmp', 'presentations-qa');
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(qaDir, { recursive: true });

const C = { navy: '#071C33', navy2: '#123B62', blue: '#456FF2', teal: '#26C9B5', coral: '#F17C8E', white: '#FFFFFF', pale: '#EEF4F8', ink: '#15324B', muted: '#5D7286', line: '#DCE6EF', violet: '#8B72EA', amber: '#F2A04F' };
const clean = (value) => String(value).replace(/[\u2013\u2014\u2011\u2212]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\u2026/g, '...').replace(/\u2192/g, '->').replace(/\u00b7/g, '-');

function addText(slide, text, position, style = {}) {
  const shape = slide.shapes.add({ geometry: 'textbox', position, fill: 'none', line: { style: 'solid', fill: 'none', width: 0 } });
  shape.text = clean(text);
  shape.text.style = { fontFace: 'Aptos', fontSize: 20, color: C.ink, ...style };
  return shape;
}
function addBox(slide, position, fill = C.white, lineFill = C.line, radius = 'rounded-xl') {
  return slide.shapes.add({ geometry: 'roundRect', position, fill, line: { style: 'solid', fill: lineFill, width: 1 }, borderRadius: radius });
}
function addRule(slide, left, top, width, fill = C.teal, height = 5) {
  return slide.shapes.add({ geometry: 'rect', position: { left, top, width, height }, fill, line: { style: 'solid', fill: 'none', width: 0 } });
}
function addFooter(slide, index, label = 'NURSING with LOLO') {
  addRule(slide, 64, 676, 1152, C.line, 1);
  addText(slide, label, { left: 66, top: 686, width: 300, height: 18 }, { fontSize: 11, color: C.muted, bold: true });
  addText(slide, String(index).padStart(2, '0'), { left: 1125, top: 686, width: 90, height: 18 }, { fontSize: 11, color: C.muted, bold: true, alignment: 'right' });
}
function addHeader(slide, eyebrow, title, index) {
  addText(slide, eyebrow.toUpperCase(), { left: 66, top: 48, width: 550, height: 24 }, { fontSize: 14, color: C.blue, bold: true });
  addText(slide, title, { left: 66, top: 78, width: 1120, height: 64 }, { fontSize: 38, color: C.navy, bold: true });
  addRule(slide, 66, 150, 88, C.teal, 6);
  addFooter(slide, index);
}
function addBullets(slide, items, frame, options = {}) {
  const count = Math.max(1, items.length); const gap = options.gap ?? 12; const itemHeight = (frame.height - gap * (count - 1)) / count;
  items.forEach((item, index) => {
    const top = frame.top + index * (itemHeight + gap);
    addBox(slide, { left: frame.left, top, width: frame.width, height: itemHeight }, options.fill ?? C.pale, options.line ?? C.line);
    addText(slide, String(index + 1).padStart(2, '0'), { left: frame.left + 16, top: top + 13, width: 40, height: 30 }, { fontSize: 14, color: options.numberColor ?? C.blue, bold: true });
    addText(slide, item, { left: frame.left + 58, top: top + 10, width: frame.width - 76, height: itemHeight - 16 }, { fontSize: options.fontSize ?? 18, color: options.textColor ?? C.ink, verticalAlignment: 'middle' });
  });
}
function titleSlide(p, r) {
  const s = p.slides.add(); s.background.fill = C.navy;
  addRule(s, 70, 68, 110, C.teal, 8);
  addText(s, 'NURSING WITH LOLO', { left: 70, top: 96, width: 520, height: 34 }, { fontSize: 16, color: C.teal, bold: true });
  addText(s, r.title, { left: 70, top: 186, width: 820, height: 175 }, { fontSize: 58, color: C.white, bold: true });
  addText(s, r.description, { left: 74, top: 385, width: 760, height: 95 }, { fontSize: 23, color: '#C4D6E3' });
  addText(s, 'Simple explanations - nursing priorities - original practice', { left: 74, top: 555, width: 720, height: 32 }, { fontSize: 17, color: '#91A9BB', bold: true });
  addBox(s, { left: 955, top: 120, width: 185, height: 185 }, '#123B62', '#2A5677', 'rounded-3xl');
  addText(s, 'LOLO', { left: 972, top: 168, width: 150, height: 70 }, { fontSize: 48, color: C.teal, bold: true, alignment: 'center', verticalAlignment: 'middle' });
  addText(s, 'STUDY EDITION\n2026', { left: 972, top: 248, width: 150, height: 55 }, { fontSize: 13, color: C.white, bold: true, alignment: 'center' });
  addText(s, 'Independent study aid - verify current clinical policy', { left: 70, top: 670, width: 600, height: 22 }, { fontSize: 11, color: '#829BAD' });
}
function objectiveSlide(p, r) { const s = p.slides.add(); s.background.fill = C.white; addHeader(s, 'Learning objectives', 'By the end, you can...', 2); addBullets(s, r.objectives.slice(0, 5), { left: 66, top: 185, width: 1148, height: 445 }, { fontSize: 19 }); }
function simpleSlide(p, r) { const s = p.slides.add(); s.background.fill = C.white; addHeader(s, 'Explain it simply', 'Start with the story that makes the details stick.', 3); addBullets(s, r.simplified.slice(0, 4), { left: 66, top: 185, width: 1148, height: 445 }, { fill: '#F4F1FF', line: '#DED7F5', numberColor: C.violet, fontSize: 18 }); }
function prioritySlide(p, r) { const s = p.slides.add(); s.background.fill = C.white; addHeader(s, 'Priority pathway', 'Notice the cue, connect the risk, then choose the safest action.', 4); const items = r.priorities.slice(0, 4); items.forEach((item, i) => { const left = 66 + i * 287; addBox(s, { left, top: 230, width: 250, height: 250 }, i % 2 ? '#F1F5FF' : '#EDF9F7', i % 2 ? '#CDD8FB' : '#C7EAE4'); addText(s, String(i + 1).padStart(2, '0'), { left: left + 20, top: 252, width: 50, height: 30 }, { fontSize: 20, color: i % 2 ? C.blue : '#168570', bold: true }); addText(s, item, { left: left + 20, top: 310, width: 210, height: 130 }, { fontSize: 18, color: C.ink, bold: true, verticalAlignment: 'middle' }); if (i < 3) addText(s, '->', { left: left + 252, top: 330, width: 35, height: 40 }, { fontSize: 26, color: C.muted, bold: true, alignment: 'center' }); }); }
function assessmentSlide(p, r) { const s = p.slides.add(); s.background.fill = C.white; addHeader(s, 'Assessment and safety', 'Trend the client, not a single number.', 5); addBox(s, { left: 66, top: 185, width: 548, height: 440 }, '#EDF9F7', '#C7EAE4'); addText(s, 'WHAT TO NOTICE', { left: 90, top: 212, width: 470, height: 28 }, { fontSize: 15, color: '#168570', bold: true }); addBullets(s, r.assessments.slice(0, 4), { left: 88, top: 258, width: 504, height: 335 }, { fill: C.white, fontSize: 16, gap: 9 }); addBox(s, { left: 640, top: 185, width: 574, height: 440 }, '#FFF1F3', '#F4CAD2'); addText(s, 'WHAT CAN HARM THE CLIENT', { left: 664, top: 212, width: 510, height: 28 }, { fontSize: 15, color: '#C8455D', bold: true }); addBullets(s, r.safety.slice(0, 4), { left: 662, top: 258, width: 530, height: 335 }, { fill: C.white, line: '#F4CAD2', numberColor: C.coral, fontSize: 16, gap: 9 }); }
function memorySlide(p, r) { const s = p.slides.add(); s.background.fill = C.navy; addText(s, 'MEMORY THAT TRANSFERS', { left: 66, top: 48, width: 600, height: 25 }, { fontSize: 14, color: C.teal, bold: true }); addText(s, 'Use the hook - then return to the clinical why.', { left: 66, top: 82, width: 1120, height: 62 }, { fontSize: 38, color: C.white, bold: true }); r.memory.slice(0, 4).forEach((item, i) => { const left = 66 + (i % 2) * 574; const top = 190 + Math.floor(i / 2) * 205; addBox(s, { left, top, width: 548, height: 170 }, i % 2 ? '#173A60' : '#113951', '#2A5677'); addText(s, '“', { left: left + 20, top: top + 12, width: 40, height: 45 }, { fontSize: 44, color: C.teal, bold: true }); addText(s, item, { left: left + 65, top: top + 31, width: 450, height: 110 }, { fontSize: 19, color: C.white, bold: true, verticalAlignment: 'middle' }); }); addText(s, 'Memory aids support recall; current clinical references and policy guide care.', { left: 66, top: 682, width: 850, height: 18 }, { fontSize: 11, color: '#8FA7B8' }); }
function clinicalSlide(p, r) { const s = p.slides.add(); s.background.fill = C.white; addHeader(s, 'Clinical judgment checkpoint', 'A changing client turns facts into decisions.', 7); addBox(s, { left: 66, top: 183, width: 1148, height: 92 }, '#F1F5FF', '#D4DDFB'); addText(s, r.clinicalExample.scenario, { left: 90, top: 202, width: 1100, height: 55 }, { fontSize: 19, color: C.ink, bold: true, verticalAlignment: 'middle' }); const groups = [['NOTICE', r.clinicalExample.notice, C.teal], ['INTERPRET', r.clinicalExample.interpret, C.blue], ['RESPOND', r.clinicalExample.respond, C.coral]]; groups.forEach(([label, items, color], i) => { const left = 66 + i * 382; addBox(s, { left, top: 305, width: 356, height: 285 }, C.white, color); addText(s, label, { left: left + 18, top: 327, width: 310, height: 26 }, { fontSize: 15, color, bold: true }); addText(s, items.slice(0, 3).map((item) => `• ${clean(item)}`).join('\n'), { left: left + 18, top: 370, width: 315, height: 170 }, { fontSize: 16, color: C.muted }); }); }
function questionSlide(p, r) { const q = r.questions[0]; const s = p.slides.add(); s.background.fill = C.white; addHeader(s, 'Practice question', 'Choose before you look at the rationale.', 8); addText(s, q.prompt, { left: 66, top: 185, width: 1148, height: 92 }, { fontSize: 25, color: C.ink, bold: true }); q.options.slice(0, 4).forEach((option, i) => { const left = 66 + (i % 2) * 574; const top = 315 + Math.floor(i / 2) * 125; addBox(s, { left, top, width: 548, height: 98 }, C.pale, C.line); addText(s, String.fromCharCode(65 + i), { left: left + 16, top: top + 25, width: 50, height: 42 }, { fontSize: 22, color: C.blue, bold: true, alignment: 'center' }); addText(s, option, { left: left + 75, top: top + 19, width: 445, height: 61 }, { fontSize: 18, color: C.ink, verticalAlignment: 'middle' }); }); }
function answerSlide(p, r) { const q = r.questions[0]; const ans = q.correct.map((i) => String.fromCharCode(65 + i)).join(', '); const s = p.slides.add(); s.background.fill = C.white; addHeader(s, 'Answer and rationale', `The answer is ${ans}. Now make the reasoning reusable.`, 9); addBox(s, { left: 66, top: 190, width: 1148, height: 185 }, '#EDF9F7', '#C7EAE4'); addText(s, q.rationale, { left: 94, top: 220, width: 1090, height: 120 }, { fontSize: 22, color: C.ink, bold: true, verticalAlignment: 'middle' }); addBox(s, { left: 66, top: 410, width: 550, height: 160 }, '#F1F5FF', '#D4DDFB'); addText(s, 'PRIORITY CONCEPT', { left: 90, top: 435, width: 500, height: 24 }, { fontSize: 14, color: C.blue, bold: true }); addText(s, q.priorityConcept, { left: 90, top: 478, width: 490, height: 55 }, { fontSize: 22, color: C.ink, bold: true }); addBox(s, { left: 640, top: 410, width: 574, height: 160 }, '#FFF4E8', '#F5D8B4'); addText(s, 'TEST-TAKING CLUE', { left: 666, top: 435, width: 510, height: 24 }, { fontSize: 14, color: '#A76513', bold: true }); addText(s, q.testTakingClue, { left: 666, top: 474, width: 510, height: 66 }, { fontSize: 19, color: C.ink, bold: true }); }
function closeSlide(p, r) { const s = p.slides.add(); s.background.fill = C.navy; addText(s, 'TAKE IT WITH YOU', { left: 66, top: 48, width: 500, height: 25 }, { fontSize: 14, color: C.teal, bold: true }); addText(s, 'Five things worth remembering', { left: 66, top: 84, width: 1100, height: 65 }, { fontSize: 42, color: C.white, bold: true }); addBullets(s, r.summary.slice(0, 5), { left: 66, top: 185, width: 1148, height: 345 }, { fill: '#123B62', line: '#2A5677', numberColor: C.teal, textColor: C.white, fontSize: 17, gap: 9 }); addText(s, `Reviewed ${r.reviewedDate}. Independent educational study aid. Verify current clinical references, instructor direction, scope, orders, manufacturer instructions, and facility policy.`, { left: 66, top: 568, width: 1148, height: 58 }, { fontSize: 14, color: '#AFC3D1' }); const refs = r.sources.slice(0, 3).map((source) => `${source.organization}: ${source.title}`).join(' | '); addText(s, refs, { left: 66, top: 642, width: 1148, height: 30 }, { fontSize: 10, color: '#7F99AB' }); }

async function generate(resource) {
  const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  titleSlide(p, resource); objectiveSlide(p, resource); simpleSlide(p, resource); prioritySlide(p, resource); assessmentSlide(p, resource); memorySlide(p, resource); clinicalSlide(p, resource); questionSlide(p, resource); answerSlide(p, resource); closeSlide(p, resource);
  const deckQa = path.join(qaDir, resource.id); await fs.mkdir(deckQa, { recursive: true });
  for (const [index, slide] of p.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, '0')}`;
    const png = await p.export({ slide, format: 'png', scale: 1 }); await fs.writeFile(path.join(deckQa, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
    const layout = await slide.export({ format: 'layout' }); await fs.writeFile(path.join(deckQa, `${stem}.layout.json`), await layout.text());
  }
  const montage = await p.export({ format: 'webp', montage: true, scale: 1 }); await fs.writeFile(path.join(deckQa, 'montage.webp'), new Uint8Array(await montage.arrayBuffer()));
  const outputPath = path.join(outputDir, `${resource.id}.pptx`);
  const pptx = await PresentationFile.exportPptx(p); await pptx.save(outputPath);
  await fs.rm(`${outputPath}.inspect.ndjson`, { force: true });
  return { id: resource.id, slides: p.slides.items.length };
}

const results = [];
for (const resource of data.resources) { results.push(await generate(resource)); process.stdout.write(`Generated ${resource.id}\n`); }
await fs.writeFile(path.join(qaDir, 'manifest.json'), JSON.stringify(results, null, 2));
console.log(`Generated ${results.length} PowerPoint decks.`);
