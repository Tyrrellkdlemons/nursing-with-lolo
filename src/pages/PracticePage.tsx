import { AlarmClock, ArrowLeft, ArrowRight, Bookmark, BrainCircuit, CheckCircle2, ClipboardCheck, Flag, GraduationCap, RotateCcw, Sparkles, Target, Timer, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { PageHeader, ProgressRing } from '../components/ui';
import { practiceExams, questions, subjects } from '../content/catalog';
import type { PracticeQuestion } from '../content/types';
import { useLearning } from '../context/LearningContext';

type SessionMode = 'practice' | 'tutor' | 'timed' | 'exam' | 'weak' | 'missed' | 'random' | 'subject';

const modes: Array<{ id: SessionMode; title: string; body: string; icon: typeof Target }> = [
  { id: 'practice', title: 'Practice', body: '10 mixed questions with rationales as you go.', icon: ClipboardCheck },
  { id: 'tutor', title: 'Tutor', body: 'Slow down and study every option explanation.', icon: Sparkles },
  { id: 'timed', title: 'Timed', body: '25 mixed questions with a 40-minute clock.', icon: Timer },
  { id: 'exam', title: 'Exam', body: '50 questions; review rationales after submitting.', icon: GraduationCap },
  { id: 'weak', title: 'Weak subjects', body: 'Questions from your lowest-accuracy subject.', icon: Target },
  { id: 'missed', title: 'Missed questions', body: 'Retry the items in your mistake notebook.', icon: RotateCcw },
  { id: 'subject', title: 'Subject set', body: 'Choose one course and focus your review.', icon: BrainCircuit },
  { id: 'random', title: 'Random 20', body: 'A fresh cross-curriculum challenge.', icon: AlarmClock },
];

export default function PracticePage() {
  const [params] = useSearchParams();
  const { state, recordQuestion, toggleBookmark } = useLearning();
  const [mode, setMode] = useState<SessionMode>('practice');
  const [subject, setSubject] = useState(subjects[0] ?? '');
  const [session, setSession] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const requestedQuestion = params.get('question');
  const requestedLesson = params.get('lesson');
  const requestedExam = params.get('exam');

  useEffect(() => {
    let requestedSession: PracticeQuestion[] = [];
    if (requestedExam) {
      const exam = practiceExams.find((item) => item.id === requestedExam);
      if (exam) {
        setMode('exam');
        requestedSession = exam.questionIds.map((id) => questions.find((item) => item.id === id)).filter((item): item is PracticeQuestion => Boolean(item));
      }
    }
    else if (requestedQuestion) { const found = questions.find((item) => item.id === requestedQuestion); if (found) requestedSession = [found]; }
    else if (requestedLesson) requestedSession = questions.filter((item) => item.lessonId === requestedLesson);
    if (requestedSession.length) {
      setSession(requestedSession);
      setIndex(0);
      setAnswers({});
      setFlags([]);
      setSeconds(0);
      setFinished(false);
    }
  }, [requestedExam, requestedLesson, requestedQuestion]);
  useEffect(() => {
    if (!session.length || finished) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [finished, session.length]);

  const start = () => {
    let pool = [...questions]; let count = 10;
    if (mode === 'subject') pool = pool.filter((item) => item.subject === subject);
    if (mode === 'missed') { const missed = new Set(state.attempts.filter((item) => !item.correct).map((item) => item.questionId)); pool = pool.filter((item) => missed.has(item.id)); }
    if (mode === 'weak') {
      const scores = new Map<string, { total: number; correct: number }>();
      state.attempts.forEach((item) => { const entry = scores.get(item.subject) ?? { total: 0, correct: 0 }; entry.total += 1; if (item.correct) entry.correct += 1; scores.set(item.subject, entry); });
      const weak = [...scores].sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)[0]?.[0];
      if (weak) pool = pool.filter((item) => item.subject === weak);
    }
    if (mode === 'timed') count = 25; if (mode === 'exam') count = 50; if (mode === 'random') count = 20; if (mode === 'tutor') count = 10;
    pool = [...pool].sort(() => Math.random() - 0.5);
    setSession(pool.slice(0, Math.min(count, pool.length))); setIndex(0); setAnswers({}); setFlags([]); setSeconds(0); setFinished(false);
  };
  const record = (correct: boolean) => {
    const question = session[index];
    if (answers[question.id] === undefined) { setAnswers((value) => ({ ...value, [question.id]: correct })); recordQuestion(question.id, correct, question.subject); }
  };
  const score = Object.values(answers).filter(Boolean).length;
  const breakdown = useMemo(() => {
    const groups: Record<string, { correct: number; total: number }> = {};
    session.forEach((question) => { groups[question.subject] ??= { correct: 0, total: 0 }; groups[question.subject].total += 1; if (answers[question.id]) groups[question.subject].correct += 1; });
    return groups;
  }, [answers, session]);

  if (finished) return <div><PageHeader eyebrow="SCORE REPORT" title="Your result is a study map." description="Review the lowest category first, then retake only the questions that need another pass." /><section className="score-hero"><ProgressRing value={Math.round((score / session.length) * 100)} label="score" size={150} /><div><span className="eyebrow">SESSION COMPLETE</span><h2>{score} of {session.length} correct</h2><p>{score / session.length >= 0.8 ? 'Strong work. Protect the concepts you missed with one short review.' : 'This is useful data, not a verdict. Your next review is already more focused.'}</p><div><button className="button button--primary" onClick={() => { const missed = session.filter((question) => !answers[question.id]); setSession(missed.length ? missed : session); setIndex(0); setAnswers({}); setFinished(false); setSeconds(0); }}>Retake missed</button><button className="button button--secondary" onClick={() => { setSession([]); setFinished(false); }}>New session</button></div></div></section><div className="score-grid"><section className="panel"><h2>Subject breakdown</h2>{Object.entries(breakdown).map(([name, values]) => <div className="score-row" key={name}><span>{name}</span><div><span style={{ width: `${(values.correct / values.total) * 100}%` }} /></div><strong>{values.correct}/{values.total}</strong></div>)}</section><section className="panel"><h2>Session details</h2><div className="result-stats"><div><AlarmClock /><strong>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong><span>time</span></div><div><Flag /><strong>{flags.length}</strong><span>flagged</span></div><div><Bookmark /><strong>{session.filter((item) => state.bookmarkedQuestions.includes(item.id)).length}</strong><span>saved</span></div></div></section></div></div>;

  if (!session.length) return <div><PageHeader eyebrow="PRACTICE CENTER" title="Train the decision, not the guess." description="Choose a mode, answer original questions, and use every rationale to build a stronger clinical pattern." /><div className="mode-grid">{modes.map(({ id, title, body, icon: Icon }) => <button key={id} className={mode === id ? 'is-active' : ''} onClick={() => setMode(id)}><span><Icon /></span><strong>{title}</strong><p>{body}</p>{mode === id && <CheckCircle2 />}</button>)}</div>{mode === 'subject' && <label className="subject-picker">Choose a subject<select value={subject} onChange={(event) => setSubject(event.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label>}<section className="start-test-panel"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>{modes.find((item) => item.id === mode)?.title}</h2><p>{mode === 'exam' ? practiceExams[0].description : modes.find((item) => item.id === mode)?.body}</p></div><button className="button button--primary" onClick={start}>Start session <ArrowRight /></button></section></div>;

  const question = session[index];
  return <div className="test-page"><header className="test-header"><button className="text-button" onClick={() => setSession([])}><ArrowLeft /> Exit</button><div><span>Question {index + 1} of {session.length}</span><div className="test-progress"><span style={{ width: `${((index + 1) / session.length) * 100}%` }} /></div></div><span className="test-clock"><Timer /> {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span></header><div className="test-layout"><aside className="question-nav"><span className="eyebrow">QUESTIONS</span><div>{session.map((item, itemIndex) => <button key={item.id} onClick={() => setIndex(itemIndex)} className={`${itemIndex === index ? 'is-current' : ''} ${answers[item.id] !== undefined ? answers[item.id] ? 'is-correct' : 'is-wrong' : ''}`}>{itemIndex + 1}{flags.includes(item.id) && <Flag />}</button>)}</div><button className="button button--secondary button--wide" disabled={Object.keys(answers).length === 0} onClick={() => setFinished(true)}>Finish & score</button></aside><main className="question-panel"><div className="question-panel__top"><span className={`difficulty-tag difficulty-tag--${question.difficulty}`}>{question.difficulty}</span><div><button className={state.bookmarkedQuestions.includes(question.id) ? 'is-active' : ''} onClick={() => toggleBookmark('question', question.id)}><Bookmark fill={state.bookmarkedQuestions.includes(question.id) ? 'currentColor' : 'none'} /> Save</button><button className={flags.includes(question.id) ? 'is-active' : ''} onClick={() => setFlags((values) => values.includes(question.id) ? values.filter((id) => id !== question.id) : [...values, question.id])}><Flag fill={flags.includes(question.id) ? 'currentColor' : 'none'} /> Flag</button></div></div><QuestionRenderer question={question} onComplete={record} showRationale={mode !== 'exam'} /><footer className="question-panel__footer"><button className="button button--secondary" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}><ArrowLeft /> Previous</button>{index < session.length - 1 ? <button className="button button--primary" onClick={() => setIndex((value) => value + 1)}>Next <ArrowRight /></button> : <button className="button button--primary" onClick={() => setFinished(true)}>Finish session</button>}</footer></main></div></div>;
}
