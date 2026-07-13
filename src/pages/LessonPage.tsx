import { ArrowLeft, Bookmark, BrainCircuit, Check, CheckCircle2, ChevronRight, Clock3, FileDown, Lightbulb, NotebookPen, Printer, ShieldAlert, Sparkles, Stethoscope, Target, TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { lessons } from '../content/catalog';
import { useLearning } from '../context/LearningContext';

const ListSection = ({ id, title, items, icon }: { id: string; title: string; items: string[]; icon?: React.ReactNode }) => (
  <section className="lesson-section" id={id}><h2>{icon}{title}</h2><ul className="check-list">{items.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></section>
);

export default function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessons.find((item) => item.id === lessonId);
  const { state, toggleLessonComplete, toggleBookmark, addNote } = useLearning();
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  if (!lesson) return <Navigate to="/library" replace />;
  const bookmarked = state.bookmarkedLessons.includes(lesson.id);
  const complete = state.completedLessons.includes(lesson.id);
  const question = lesson.questions[questionIndex];
  const next = lessons[(lessons.findIndex((item) => item.id === lesson.id) + 1) % lessons.length];
  const contents = [['simple', 'Explain it simply'], ['notice', 'What to notice'], ['assess', 'Assessments'], ['priorities', 'Priority actions'], ['safety', 'Safety'], ['clinical', 'Clinical example'], ['practice', 'Practice'], ['summary', 'Quick summary']];

  const saveNote = () => {
    if (!note.trim()) return;
    addNote({ title: `Note: ${lesson.shortTitle}`, body: note.trim(), subject: lesson.subject, lessonId: lesson.id, pinned: false });
    setNote(''); setNoteOpen(false);
  };

  return (
    <article className="lesson-page">
      <Link className="back-link" to="/library"><ArrowLeft /> Back to library</Link>
      <header className="lesson-hero" style={{ '--lesson-accent': lesson.color } as React.CSSProperties}>
        <div className="lesson-hero__icon">{lesson.icon}</div>
        <div className="lesson-hero__copy"><div className="lesson-card__badges"><span>{lesson.subject}</span><span>{lesson.unit}</span><span className={`difficulty-tag difficulty-tag--${lesson.difficulty}`}>{lesson.difficulty}</span></div><h1>{lesson.title}</h1><p>{lesson.whyItMatters}</p><div className="lesson-hero__meta"><span><Clock3 /> {lesson.minutes} minutes</span><span><Target /> {lesson.objectives.length} objectives</span><span><BrainCircuit /> {lesson.questions.length} checks</span><span><span className={`review-dot review-dot--${lesson.reviewStatus}`} /> Reviewed {new Date(lesson.reviewedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div></div>
        <div className="lesson-hero__actions"><button className={bookmarked ? 'button button--secondary is-active' : 'button button--secondary'} onClick={() => toggleBookmark('lesson', lesson.id)}><Bookmark fill={bookmarked ? 'currentColor' : 'none'} /> {bookmarked ? 'Saved' : 'Save'}</button><button className="button button--secondary" onClick={() => setNoteOpen(true)}><NotebookPen /> Note</button><button className="icon-button" onClick={() => window.print()} aria-label="Print lesson"><Printer /></button></div>
      </header>
      <div className="lesson-layout">
        <aside className="lesson-toc"><span className="eyebrow">IN THIS LESSON</span>{contents.map(([id, label], index) => <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}<div className="lesson-toc__progress"><strong>{complete ? 'Lesson mastered' : 'Ready when you are'}</strong><button className={complete ? 'button button--success button--wide' : 'button button--primary button--wide'} onClick={() => toggleLessonComplete(lesson.id, lesson.title, lesson.subject)}>{complete ? <><CheckCircle2 /> Completed</> : 'Mark complete'}</button></div></aside>
        <div className="lesson-content">
          <section className="lesson-section lesson-objectives"><span className="eyebrow">LEARNING OBJECTIVES</span><h2>By the end, you can…</h2><ol>{lesson.objectives.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></section>
          <section className="simple-panel" id="simple"><div className="simple-panel__head"><span><Sparkles /></span><div><span className="eyebrow">EXPLAIN IT SIMPLY</span><h2>The version that actually sticks.</h2></div></div>{lesson.simpleExplanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          <section className="lesson-section"><h2><Lightbulb />Key vocabulary</h2><div className="vocab-grid">{lesson.vocabulary.map((item) => <div key={item.term}><strong>{item.term}</strong><p>{item.definition}</p></div>)}</div></section>
          <div className="compare-grid" id="notice"><section className="compare-card compare-card--normal"><h2>Expected / baseline clues</h2><ul>{lesson.normalFindings.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="compare-card compare-card--warning"><h2>Unexpected / concerning clues</h2><ul>{lesson.abnormalFindings.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
          <section className="notice-do-grid"><div><span className="notice-do-grid__icon"><Stethoscope /></span><h3>What the nurse should notice</h3><ul>{lesson.assessments.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul></div><div><span className="notice-do-grid__icon notice-do-grid__icon--priority"><Target /></span><h3>What the nurse should do first</h3><ul>{lesson.priorityActions.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul></div><div><span className="notice-do-grid__icon notice-do-grid__icon--danger"><ShieldAlert /></span><h3>What can harm the client</h3><ul>{lesson.safetyWarnings.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul></div></section>
          <ListSection id="assess" title="Focused nursing assessments" items={lesson.assessments} icon={<Stethoscope />} />
          <ListSection id="priorities" title="Interventions and priority actions" items={[...lesson.priorityActions, ...lesson.interventions]} icon={<Target />} />
          <div className="detail-grid"><ListSection id="medications" title="Medication connections" items={lesson.medications} /><ListSection id="labs" title="Labs and diagnostics" items={[...lesson.labs, ...lesson.diagnostics]} /></div>
          <div className="detail-grid"><ListSection id="teaching" title="Patient teaching" items={lesson.patientTeaching} /><ListSection id="safety" title="Safety warnings" items={lesson.safetyWarnings} icon={<TriangleAlert />} /></div>
          <section className="lesson-section memory-section"><h2><Lightbulb />Memory tricks + exam clues</h2><div className="memory-grid">{lesson.memoryTricks.map((item) => <blockquote key={item}>{item}</blockquote>)}</div><ul className="exam-tip-list">{lesson.examTips.map((item) => <li key={item}><Target />{item}</li>)}</ul></section>
          <section className="lesson-section"><h2>Common mistakes</h2><div className="mistake-list">{lesson.commonMistakes.map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div></section>
          <section className="clinical-example" id="clinical"><div className="clinical-example__head"><BrainCircuit /><div><span className="eyebrow">CLINICAL JUDGMENT CHECKPOINT</span><h2>{lesson.clinicalExample.scenario}</h2></div></div><div className="judgment-path"><div><span>1</span><h3>Notice</h3>{lesson.clinicalExample.notice.map((item) => <p key={item}>{item}</p>)}</div><ChevronRight /><div><span>2</span><h3>Interpret</h3>{lesson.clinicalExample.interpret.map((item) => <p key={item}>{item}</p>)}</div><ChevronRight /><div><span>3</span><h3>Respond</h3>{lesson.clinicalExample.respond.map((item) => <p key={item}>{item}</p>)}</div></div><blockquote>{lesson.clinicalExample.reflect}</blockquote></section>
          <section className="lesson-section practice-check" id="practice"><div className="panel__head"><div><span className="eyebrow">CHECK YOUR THINKING</span><h2>Question {questionIndex + 1} of {lesson.questions.length}</h2></div><span className="difficulty-tag">{question.difficulty}</span></div><p className="practice-check__prompt">{question.prompt}</p><div className="answer-stack">{question.options.map((option, index) => <button key={option} disabled={answer !== null} className={answer === null ? '' : question.correct.includes(index) ? 'is-correct' : answer === index ? 'is-wrong' : ''} onClick={() => setAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{answer !== null && question.correct.includes(index) && <Check />}</button>)}</div>{answer !== null && <div className="rationale-box"><strong>{question.correct.includes(answer) ? 'Correct — here is the clinical why.' : 'Review the priority clue.'}</strong><p>{question.rationale}</p><p><b>Test-taking clue:</b> {question.testTakingClue}</p><button className="button button--secondary" onClick={() => { setQuestionIndex((questionIndex + 1) % lesson.questions.length); setAnswer(null); }}>Next question <ChevronRight /></button></div>}</section>
          <section className="lesson-section summary-card" id="summary"><span className="eyebrow">QUICK SUMMARY</span><h2>If you remember only a few things…</h2><ol>{lesson.summary.slice(0, 5).map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol><div className="summary-card__actions"><Link className="button button--secondary" to={`/flashcards?lesson=${lesson.id}`}>Study 10 flashcards</Link><Link className="button button--secondary" to={`/practice?lesson=${lesson.id}`}>Practice all 8 questions</Link><button className="button button--secondary" onClick={() => window.print()}><FileDown /> Print lesson</button></div></section>
          <section className="source-box"><strong>Sources and review note</strong><p>{lesson.scopeNote}</p>{lesson.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.organization}: {source.title}</a>)}</section>
          <nav className="lesson-next"><div><span className="eyebrow">NEXT LESSON</span><strong>{next.title}</strong></div><Link className="button button--primary" to={`/lessons/${next.id}`}>Continue <ChevronRight /></Link></nav>
        </div>
      </div>
      {noteOpen && <div className="dialog-backdrop" role="presentation"><section className="note-dialog" role="dialog" aria-modal="true" aria-label={`Add note to ${lesson.title}`}><div className="panel__head"><div><span className="eyebrow">LESSON NOTE</span><h2>{lesson.shortTitle}</h2></div><button className="icon-button" onClick={() => setNoteOpen(false)} aria-label="Close note"><X /></button></div><label>What do you want to remember?<textarea autoFocus value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write the concept in your own words…" rows={8} /></label><div className="note-dialog__actions"><button className="button button--secondary" onClick={() => setNoteOpen(false)}>Cancel</button><button className="button button--primary" onClick={saveNote}>Save note</button></div></section></div>}
    </article>
  );
}
