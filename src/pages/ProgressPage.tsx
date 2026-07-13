import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, BookOpen, BrainCircuit, Clock3, Flame, Layers3, Target, TrendingUp } from 'lucide-react';
import { PageHeader, ProgressRing } from '../components/ui';
import { lessons } from '../content/catalog';
import { useLearning } from '../context/LearningContext';
import { activityStreak, calculateAccuracy, subjectAccuracy } from '../lib/progress';

export default function ProgressPage() {
  const { state } = useLearning();
  const accuracy = calculateAccuracy(state.attempts);
  const scores = subjectAccuracy(state.attempts);
  const streak = activityStreak(state.activities);
  const weekly = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - (6 - index)); const items = state.activities.filter((item) => new Date(item.at).toDateString() === date.toDateString()); return { day: date.toLocaleDateString(undefined, { weekday: 'short' }), activity: items.length, minutes: items.filter((item) => item.type === 'study').reduce((sum, item) => sum + item.value, 0) }; });
  const subjectData = Object.entries(scores).map(([subject, score]) => ({ subject: subject.length > 18 ? `${subject.slice(0, 16)}…` : subject, score })).sort((a, b) => a.score - b.score);
  const totalMinutes = state.activities.filter((item) => item.type === 'study').reduce((sum, item) => sum + item.value, 0);
  const achievements = [
    { icon: BookOpen, title: 'First lesson', body: 'Complete one lesson', unlocked: state.completedLessons.length >= 1 },
    { icon: Layers3, title: 'Recall builder', body: 'Review 25 flashcards', unlocked: Object.keys(state.cardReviews).length >= 25 },
    { icon: Target, title: 'Question climber', body: 'Answer 50 questions', unlocked: state.attempts.length >= 50 },
    { icon: Flame, title: 'Three-day rhythm', body: 'Study 3 days in a row', unlocked: streak >= 3 },
    { icon: Award, title: 'Course finisher', body: 'Complete 10 lessons', unlocked: state.completedLessons.length >= 10 },
    { icon: BrainCircuit, title: 'Clinical thinker', body: 'Reach 80% accuracy after 25 answers', unlocked: state.attempts.length >= 25 && accuracy >= 80 },
  ];
  return <div><PageHeader eyebrow="LEARNER ANALYTICS" title="Progress you can act on." description="See what is getting stronger, where the misses cluster, and the smallest next move that will make tomorrow easier." />
    <section className="progress-overview"><div><ProgressRing value={Math.round((state.completedLessons.length / lessons.length) * 100)} label="curriculum" size={112} /><p><strong>{state.completedLessons.length} / {lessons.length}</strong><span>lessons mastered</span></p></div><div><span><Target /></span><p><strong>{accuracy}%</strong><span>question accuracy</span></p></div><div><span><Layers3 /></span><p><strong>{Object.keys(state.cardReviews).length}</strong><span>cards reviewed</span></p></div><div><span><Clock3 /></span><p><strong>{totalMinutes}</strong><span>focused minutes</span></p></div><div><span><Flame /></span><p><strong>{streak}</strong><span>day streak</span></p></div></section>
    <div className="chart-grid"><section className="panel chart-panel"><div className="panel__head"><div><span className="eyebrow">LAST 7 DAYS</span><h2>Study activity</h2></div><TrendingUp /></div><div className="chart" role="img" aria-label={`Weekly study activity: ${weekly.map((item) => `${item.day} ${item.activity} events`).join(', ')}`}><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly}><defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f7cff" stopOpacity={0.45}/><stop offset="100%" stopColor="#4f7cff" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)"/><XAxis dataKey="day" tickLine={false} axisLine={false}/><YAxis hide/><Tooltip/><Area type="monotone" dataKey="activity" stroke="#4f7cff" strokeWidth={3} fill="url(#activityFill)" /></AreaChart></ResponsiveContainer></div></section><section className="panel chart-panel"><div className="panel__head"><div><span className="eyebrow">CATEGORY PERFORMANCE</span><h2>Accuracy by subject</h2></div><Target /></div>{subjectData.length ? <div className="chart" role="img" aria-label={`Subject accuracy: ${subjectData.map((item) => `${item.subject} ${item.score}%`).join(', ')}`}><ResponsiveContainer width="100%" height="100%"><BarChart data={subjectData} layout="vertical" margin={{ left: 20 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--line)"/><XAxis type="number" domain={[0, 100]} hide/><YAxis type="category" dataKey="subject" tickLine={false} axisLine={false} width={115}/><Tooltip/><Bar dataKey="score" fill="#2fc9b5" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer></div> : <div className="empty-mini"><Target /><p><strong>Your subject map appears after practice.</strong><span>Answer a few questions to reveal strong and weak areas.</span></p></div>}</section></div>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">ACHIEVEMENTS</span><h2>Milestones worth celebrating.</h2></div></div><div className="achievement-grid">{achievements.map(({ icon: Icon, title, body, unlocked }) => <article key={title} className={unlocked ? 'is-unlocked' : ''}><span><Icon /></span><div><strong>{title}</strong><p>{body}</p></div>{unlocked && <Award />}</article>)}</div></section>
    <section className="recommendation-card"><BrainCircuit /><div><span className="eyebrow">RECOMMENDED NEXT ACTION</span><h2>{subjectData.length ? `Strengthen ${subjectData[0].subject}` : 'Answer your first 10 questions'}</h2><p>{subjectData.length ? 'Take a short targeted set, read every rationale, then explain the priority without looking.' : 'A small mixed set gives LOLO enough data to make the dashboard personal.'}</p></div></section>
  </div>;
}

