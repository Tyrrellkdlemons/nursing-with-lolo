import { ArrowRight, BrainCircuit, Check, ChevronRight, ClipboardCheck, ExternalLink, Flag, Layers3, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { caseStudies } from '../content/caseStudies';
import { practiceExams, questions } from '../content/catalog';
import { PageHeader } from '../components/ui';

const categories = [
  ['Coordinated Care', 'Assignment, delegation, continuity, advocacy, ethics, and team communication.', '18-24%'],
  ['Safety & Infection Control', 'Error prevention, precautions, incident response, equipment, and client protection.', '10-16%'],
  ['Health Promotion & Maintenance', 'Growth, prevention, pregnancy, screening, and self-care across the lifespan.', '6-12%'],
  ['Psychosocial Integrity', 'Therapeutic communication, coping, mental health, crisis, and support systems.', '9-15%'],
  ['Basic Care & Comfort', 'Mobility, elimination, nutrition, rest, hygiene, and nonpharmacologic comfort.', '7-13%'],
  ['Pharmacological Therapies', 'Safe administration, monitoring, adverse effects, teaching, and calculations.', '10-16%'],
  ['Reduction of Risk Potential', 'Trends, diagnostics, complications, procedures, and changes in condition.', '9-15%'],
  ['Physiological Adaptation', 'Acute, chronic, emergent, and life-threatening physiologic responses.', '7-13%'],
];

export default function NclexPage() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const current = caseStudies[caseIndex];
  const stage = current.unfolding[stageIndex];
  const isCorrect = selected.length === stage.correct.length && selected.every((item) => stage.correct.includes(item));
  const choose = (index: number) => setSelected((values) => values.includes(index) ? values.filter((item) => item !== index) : [...values, index]);
  const advance = () => { if (stageIndex < current.unfolding.length - 1) setStageIndex((value) => value + 1); else { setCaseIndex((value) => (value + 1) % caseStudies.length); setStageIndex(0); } setSelected([]); setChecked(false); };

  return <div><PageHeader eyebrow="2026 NCLEX-PN" title="Think like the item writer." description="Practice Client Needs, clinical judgment, priority, and next-generation formats without memorizing a commercial test bank." actions={<a className="button button--secondary" href="https://www.ncsbn.org/publications/2026-nclex-pn-test-plan" target="_blank" rel="noreferrer">Official test plan <ExternalLink /></a>} />
    <section className="nclex-hero"><div><span className="hero-kicker"><ShieldCheck /> BUILT FROM THE OFFICIAL TEST-PLAN FRAMEWORK</span><h2>See the cue. Name the risk. Choose the safest next action.</h2><p>The clinical judgment measurement model rewards a repeatable process: recognize cues, analyze them, prioritize hypotheses, generate solutions, take action, and evaluate outcomes.</p><div><Link className="button button--primary" to="/practice">Start mixed practice <ArrowRight /></Link><Link className="button button--glass" to="/lessons/2026-nclex-pn-clinical-judgment-prioritization">Learn the strategy</Link></div></div><div className="judgment-wheel" aria-label="Clinical judgment cycle"><span>Recognize</span><span>Analyze</span><span>Prioritize</span><strong><BrainCircuit /> CLINICAL<br />JUDGMENT</strong><span>Generate</span><span>Act</span><span>Evaluate</span></div></section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">CLIENT NEEDS</span><h2>Know what the exam is sampling.</h2></div><span className="info-pill">Ranges are approximate item-distribution ranges from the 2026 PN test plan</span></div><div className="category-grid">{categories.map(([title, body, range], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><p>{body}</p><small>{range}</small></article>)}</div></section>
    <section className="case-lab"><div className="case-lab__head"><div><span className="eyebrow">UNFOLDING CASE STUDY {caseIndex + 1} / {caseStudies.length}</span><h2>{current.title}</h2><p>{current.setting} · {current.client}</p></div><span className="stage-chip">{stage.stage}</span></div><div className="case-update"><Sparkles /><p><strong>New information</strong>{stage.update}</p></div><h3>{stage.question}</h3><div className="answer-stack">{stage.choices.map((choice, index) => <button key={choice} disabled={checked} className={checked ? stage.correct.includes(index) ? 'is-correct' : selected.includes(index) ? 'is-wrong' : '' : selected.includes(index) ? 'is-selected' : ''} onClick={() => choose(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}{checked && stage.correct.includes(index) && <Check />}</button>)}</div>{!checked ? <button className="button button--primary" disabled={!selected.length} onClick={() => setChecked(true)}>Submit selection</button> : <div className={`rationale-box ${isCorrect ? 'rationale-box--correct' : ''}`}><strong>{isCorrect ? 'Correct cue cluster.' : 'Pause and reconnect the cue to the risk.'}</strong><p>{stage.rationale}</p><button className="button button--secondary" onClick={advance}>{stageIndex < current.unfolding.length - 1 ? 'Continue case' : 'Next case'} <ChevronRight /></button></div>}</section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">READINESS EXAMS</span><h2>Five 50-question checkpoints.</h2></div><Link to="/practice">All practice modes <ArrowRight /></Link></div><div className="exam-grid">{practiceExams.map((exam, index) => <article key={exam.id}><div><span><ClipboardCheck /></span><small>EXAM {index + 1}</small></div><h3>{exam.title}</h3><p>{exam.description}</p><ul><li><Layers3 /> {exam.questionIds.length} items</li><li><Flag /> flag + review</li><li><Target /> category score</li></ul><Link className="button button--secondary button--wide" to={`/practice?exam=${exam.id}`}>Open exam <ArrowRight /></Link></article>)}</div></section>
    <section className="strategy-band"><div><BrainCircuit /><span><strong>LOLO’s priority reset</strong><p>Before choosing an answer: “What can harm this client first—and what can I safely do about it now?”</p></span></div><Link to="/quick-sheets?sheet=priority-delegation">Open strategy sheet <ArrowRight /></Link></section>
  </div>;
}
