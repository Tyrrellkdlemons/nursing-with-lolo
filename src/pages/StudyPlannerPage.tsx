import { ArrowRight, CalendarDays, Check, Clock3, RefreshCw, Sparkles, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import { lessons, subjects } from '../content/catalog';
import { studyPlanTemplates } from '../content/studyPlans';
import { useLearning, type PlannerTask } from '../context/LearningContext';
import { PageHeader } from '../components/ui';

export default function StudyPlannerPage() {
  const { state, updateSettings, setPlannerTasks, togglePlannerTask } = useLearning();
  const [templateId, setTemplateId] = useState(studyPlanTemplates[0].id);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [minutes, setMinutes] = useState(60);
  const [weak, setWeak] = useState(subjects[0] ?? '');
  const [strong, setStrong] = useState(subjects[1] ?? subjects[0] ?? '');
  const template = studyPlanTemplates.find((item) => item.id === templateId)!;
  const tasksByDate = useMemo(() => Object.entries(state.plannerTasks.reduce<Record<string, PlannerTask[]>>((groups, task) => { (groups[task.date] ??= []).push(task); return groups; }, {})).sort((a, b) => a[0].localeCompare(b[0])).slice(0, 14), [state.plannerTasks]);
  const completed = state.plannerTasks.filter((task) => task.completed).length;
  const generate = () => {
    const start = new Date(); const tasks: PlannerTask[] = []; let lessonIndex = 0;
    for (let day = 0; day < template.days; day += 1) {
      const date = new Date(start); date.setDate(start.getDate() + day);
      if ((day % 7) >= daysPerWeek) continue;
      const targetSubject = day % 3 === 0 ? weak : day % 5 === 0 ? strong : subjects[day % subjects.length];
      const options = lessons.filter((lesson) => lesson.subject === targetSubject);
      const lesson = options[lessonIndex++ % Math.max(1, options.length)] ?? lessons[lessonIndex % lessons.length];
      tasks.push({ id: `${Date.now()}-${day}-lesson`, date: date.toISOString().slice(0, 10), title: `Learn: ${lesson.shortTitle}`, minutes: Math.round(minutes * 0.5), completed: false, subject: lesson.subject });
      tasks.push({ id: `${Date.now()}-${day}-practice`, date: date.toISOString().slice(0, 10), title: day % 2 ? '10 question retrieval set' : 'Flashcard review + mistake notebook', minutes: Math.round(minutes * 0.5), completed: false, subject: targetSubject });
    }
    setPlannerTasks(tasks); updateSettings({ dailyGoalMinutes: minutes });
  };
  const reschedule = () => {
    const today = new Date().toISOString().slice(0, 10); let offset = 1;
    setPlannerTasks(state.plannerTasks.map((task) => task.completed || task.date >= today ? task : (() => { const date = new Date(); date.setDate(date.getDate() + offset++); return { ...task, date: date.toISOString().slice(0, 10) }; })()));
  };
  return <div><PageHeader eyebrow="STUDY PLANNER" title="A plan that bends without breaking." description="Choose your exam window and study capacity. LOLO balances concepts, retrieval, questions, and recovery so a missed day is rescheduled—not punished." />
    <div className="planner-layout"><section className="planner-builder"><span className="eyebrow">BUILD MY PLAN</span><h2>Start with what is realistic.</h2><label>Quick plan<select value={templateId} onChange={(event) => { setTemplateId(event.target.value); const value = studyPlanTemplates.find((item) => item.id === event.target.value)!; setMinutes(value.dailyMinutes); }}>{studyPlanTemplates.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><div className="form-grid"><label>Exam date<input type="date" value={state.examDate} onChange={(event) => updateSettings({ examDate: event.target.value })} /></label><label>Target score<input type="number" min="50" max="100" value={state.targetScore} onChange={(event) => updateSettings({ targetScore: Number(event.target.value) })} /></label><label>Study days / week<input type="range" min="2" max="7" value={daysPerWeek} onChange={(event) => setDaysPerWeek(Number(event.target.value))} /><strong>{daysPerWeek} days</strong></label><label>Minutes / session<input type="range" min="20" max="180" step="5" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} /><strong>{minutes} min</strong></label><label>Weak subject<select value={weak} onChange={(event) => setWeak(event.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><label>Strong subject<select value={strong} onChange={(event) => setStrong(event.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="plan-preview"><Sparkles /><p><strong>{template.title}</strong>{template.description}</p></div><button className="button button--primary button--wide" onClick={generate}>Generate my plan <ArrowRight /></button></section>
      <section className="planner-summary"><div className="planner-summary__top"><div><span className="eyebrow">PLAN PROGRESS</span><h2>{completed} of {state.plannerTasks.length} tasks complete</h2></div><span className="big-percent">{state.plannerTasks.length ? Math.round((completed / state.plannerTasks.length) * 100) : 0}%</span></div><div className="meter__track"><span style={{ width: `${state.plannerTasks.length ? (completed / state.plannerTasks.length) * 100 : 0}%` }} /></div><div className="planner-summary__stats"><div><CalendarDays /><strong>{template.days}</strong><span>calendar days</span></div><div><Clock3 /><strong>{minutes}</strong><span>minutes / session</span></div><div><Target /><strong>{state.targetScore}%</strong><span>target score</span></div></div>{state.plannerTasks.length > 0 && <button className="button button--secondary button--wide" onClick={reschedule}><RefreshCw /> Reschedule missed tasks</button>}</section></div>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">DAILY CHECKLIST</span><h2>{tasksByDate.length ? 'Your next study blocks' : 'Generate a plan to fill your calendar.'}</h2></div></div><div className="calendar-list">{tasksByDate.map(([date, tasks]) => <article key={date}><header><span>{new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' })}</span><strong>{new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</strong></header><div>{tasks.map((task) => <button key={task.id} className={task.completed ? 'is-complete' : ''} onClick={() => togglePlannerTask(task.id)}><span>{task.completed && <Check />}</span><p><strong>{task.title}</strong><small>{task.subject} · {task.minutes} min</small></p></button>)}</div></article>)}</div></section>
  </div>;
}

