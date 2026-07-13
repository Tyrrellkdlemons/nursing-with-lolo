import { ArrowRight, Award, BookOpen, BrainCircuit, CalendarClock, Check, ChevronRight, ClipboardCheck, Flame, Layers3, Play, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { flashcards, lessons, questions } from '../content/catalog';
import { quickSheets } from '../content/quickSheets';
import { useLearning } from '../context/LearningContext';
import { activityStreak, calculateAccuracy, studiedMinutesToday, subjectAccuracy } from '../lib/progress';
import { Meter, ProgressRing } from '../components/ui';

export default function DashboardPage() {
  const { state, recordQuestion } = useLearning();
  const [dailyAnswer, setDailyAnswer] = useState<number | null>(null);
  const daily = questions[new Date().getDate() % Math.max(1, questions.length)];
  const completed = state.completedLessons.length;
  const accuracy = calculateAccuracy(state.attempts);
  const studied = studiedMinutesToday(state.activities);
  const streak = activityStreak(state.activities);
  const subjectScores = subjectAccuracy(state.attempts);
  const weakSubject = Object.entries(subjectScores).sort((a, b) => a[1] - b[1])[0]?.[0];
  const recommended = lessons.find((lesson) => lesson.subject === weakSubject && !state.completedLessons.includes(lesson.id)) ?? lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) ?? lessons[0];
  const nextTasks = state.plannerTasks.filter((task) => !task.completed).slice(0, 3);
  const progress = Math.round((completed / lessons.length) * 100);

  const weekData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - (6 - index)); return date; });
    return days.map((date) => ({
      day: date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1),
      value: state.activities.filter((activity) => new Date(activity.at).toDateString() === date.toDateString()).length,
    }));
  }, [state.activities]);

  const answerDaily = (index: number) => {
    if (dailyAnswer !== null) return;
    setDailyAnswer(index);
    recordQuestion(daily.id, daily.correct.includes(index), daily.subject);
  };

  return (
    <div className="dashboard-page">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <span className="hero-kicker"><Sparkles size={15} /> YOUR STUDY COMMAND CENTER</span>
          <h1>Master nursing <span>one clear decision</span> at a time.</h1>
          <p>Learn the “why,” practice the priority, and turn every miss into a smarter next step—with a calm system built for nursing school and NCLEX-PN review.</p>
          <div className="hero-panel__actions">
            <Link className="button button--primary" to={`/lessons/${recommended.id}`}><Play size={17} /> Start studying</Link>
            <Link className="button button--glass" to="/practice"><ClipboardCheck size={17} /> Practice test</Link>
          </div>
          <div className="hero-panel__trust"><span><ShieldCheck /> Original questions</span><span><BrainCircuit /> Clinical judgment</span><span><Target /> Local progress</span></div>
        </div>
        <div className="hero-visual" aria-label="Animated learning progress illustration">
          <div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" />
          <div className="hero-visual__core"><span className="eyebrow">WEEKLY MASTERY</span><strong>{accuracy || 72}<small>%</small></strong><p>{state.attempts.length ? 'based on your answers' : 'starter target'}</p><svg viewBox="0 0 210 58" aria-hidden="true"><path d="M3 42 C22 28, 34 50, 54 31 S87 35, 104 20 S139 48, 158 24 S186 29,207 8" /><path className="hero-visual__area" d="M3 42 C22 28, 34 50, 54 31 S87 35, 104 20 S139 48, 158 24 S186 29,207 8 L207 58 L3 58z" /></svg></div>
          <div className="float-chip float-chip--top"><Flame /><span><strong>{streak || 1} day</strong> study streak</span></div>
          <div className="float-chip float-chip--bottom"><Award /><span><strong>{completed}</strong> lessons mastered</span></div>
        </div>
      </section>

      <section className="dashboard-strip" aria-label="Learning stats">
        <div><span className="stat-icon stat-icon--teal"><BookOpen /></span><p><strong>{completed}<small> / {lessons.length}</small></strong><span>Lessons complete</span></p></div>
        <div><span className="stat-icon stat-icon--violet"><Layers3 /></span><p><strong>{Object.keys(state.cardReviews).length}<small> / {flashcards.length}</small></strong><span>Cards reviewed</span></p></div>
        <div><span className="stat-icon stat-icon--coral"><Target /></span><p><strong>{accuracy}<small>%</small></strong><span>Question accuracy</span></p></div>
        <div><span className="stat-icon stat-icon--blue"><CalendarClock /></span><p><strong>{studied}<small> min</small></strong><span>Studied today</span></p></div>
      </section>

      <div className="dashboard-grid dashboard-grid--primary">
        <section className="panel continue-card">
          <div className="panel__head"><div><span className="eyebrow">RECOMMENDED NEXT</span><h2>{recommended.title}</h2></div><span className="subject-chip">{recommended.subject}</span></div>
          <p>{recommended.whyItMatters}</p>
          <div className="continue-card__meta"><span><BookOpen /> {recommended.minutes} min lesson</span><span><Layers3 /> 10 cards</span><span><ClipboardCheck /> 8 checks</span></div>
          <Meter value={state.completedLessons.includes(recommended.id) ? 1 : 0} max={1} label="Lesson progress" />
          <Link className="button button--primary button--wide" to={`/lessons/${recommended.id}`}>Open lesson <ArrowRight size={17} /></Link>
        </section>

        <section className="panel goal-card">
          <div className="panel__head"><div><span className="eyebrow">TODAY'S GOAL</span><h2>Keep the promise small.</h2></div><ProgressRing value={Math.min(100, Math.round((studied / state.dailyGoalMinutes) * 100))} label="done" /></div>
          <p>{studied >= state.dailyGoalMinutes ? 'Goal complete. A short recall round is a bonus, not a requirement.' : `${Math.max(0, state.dailyGoalMinutes - studied)} focused minutes left. One session is enough to move forward.`}</p>
          <div className="week-bars" aria-label="Seven-day activity">
            {weekData.map((day, index) => <div key={`${day.day}-${index}`}><span style={{ height: `${Math.max(10, Math.min(100, day.value * 18))}%` }} /><small>{day.day}</small></div>)}
          </div>
        </section>
      </div>

      <div className="dashboard-grid dashboard-grid--secondary">
        <section className="panel daily-question">
          <div className="panel__head"><div><span className="eyebrow">DAILY QUESTION</span><h2>One question. Full rationale.</h2></div><span className="difficulty-tag">{daily.difficulty}</span></div>
          <p className="daily-question__prompt">{daily.prompt}</p>
          <div className="answer-stack">
            {daily.options.map((option, index) => {
              const selected = dailyAnswer === index;
              const correct = daily.correct.includes(index);
              return <button key={option} disabled={dailyAnswer !== null} className={dailyAnswer === null ? '' : correct ? 'is-correct' : selected ? 'is-wrong' : ''} onClick={() => answerDaily(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{dailyAnswer !== null && correct && <Check />}</button>;
            })}
          </div>
          {dailyAnswer !== null && <div className={`rationale-box ${daily.correct.includes(dailyAnswer) ? 'rationale-box--correct' : ''}`} role="status"><strong>{daily.correct.includes(dailyAnswer) ? 'You caught the priority.' : 'This one joins your review queue.'}</strong><p>{daily.rationale}</p></div>}
        </section>

        <section className="panel plan-card">
          <div className="panel__head"><div><span className="eyebrow">YOUR PLAN</span><h2>Coming up</h2></div><Link to="/study-planner" aria-label="Open study planner"><ChevronRight /></Link></div>
          {nextTasks.length ? <div className="task-list">{nextTasks.map((task) => <div key={task.id}><span><CalendarClock /></span><p><strong>{task.title}</strong><small>{new Date(task.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {task.minutes} min</small></p></div>)}</div> : <div className="empty-mini"><CalendarClock /><p><strong>Your plan is ready to be built.</strong><span>Choose an exam date and available study time.</span></p><Link to="/study-planner">Build my plan</Link></div>}
          <div className="mini-callout"><Sparkles /><p><strong>LOLO tip</strong><span>Close your notes and explain the priority aloud. Retrieval beats rereading.</span></p></div>
        </section>
      </div>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">QUICK WINS</span><h2>Study in the mode you need now.</h2></div><Link to="/courses">Explore all courses <ArrowRight /></Link></div>
        <div className="quick-win-grid">
          <Link to="/flashcards"><span className="stat-icon stat-icon--violet"><Layers3 /></span><div><strong>Flashcard sprint</strong><p>300 cards with easy, medium, and hard review queues.</p></div><ChevronRight /></Link>
          <Link to="/dosage-lab"><span className="stat-icon stat-icon--teal"><Target /></span><div><strong>Dosage warm-up</strong><p>25 safe, step-by-step calculation problems.</p></div><ChevronRight /></Link>
          <Link to="/quick-sheets"><span className="stat-icon stat-icon--coral"><BookOpen /></span><div><strong>Printable review</strong><p>{quickSheets.length} clean quick sheets for last-mile recall.</p></div><ChevronRight /></Link>
        </div>
      </section>

      <section className="motivation-band"><div><Award /><span><strong>Clarity compounds.</strong><p>Every rationale you truly understand is one less guess on exam day.</p></span></div><Link className="button button--light" to="/progress">See my progress <ArrowRight /></Link></section>
    </div>
  );
}

