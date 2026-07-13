import { ArrowRight, Bookmark, BookOpen, CheckCircle2, Clock3, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { lessons, subjects } from '../content/catalog';
import { useLearning } from '../context/LearningContext';
import { EmptyState, PageHeader } from '../components/ui';

export default function LibraryPage() {
  const { state, toggleBookmark } = useLearning();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const subject = params.get('subject') ?? 'All subjects';
  const difficulty = params.get('difficulty') ?? 'All levels';
  const status = params.get('status') ?? 'All lessons';
  const filtered = useMemo(() => lessons.filter((lesson) => {
    const text = `${lesson.title} ${lesson.subject} ${lesson.summary.join(' ')} ${lesson.vocabulary.map((item) => item.term).join(' ')}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase()))
      && (subject === 'All subjects' || lesson.subject === subject)
      && (difficulty === 'All levels' || lesson.difficulty === difficulty)
      && (status === 'All lessons' || (status === 'Completed' ? state.completedLessons.includes(lesson.id) : !state.completedLessons.includes(lesson.id)));
  }), [difficulty, query, state.completedLessons, status, subject]);
  const setFilter = (key: string, value: string) => { const next = new URLSearchParams(params); value.startsWith('All ') ? next.delete(key) : next.set(key, value); setParams(next); };

  return (
    <div>
      <PageHeader eyebrow="LESSON LIBRARY" title="Find the concept behind the question." description="Every lesson starts simple, then builds the assessment cues, priorities, safety points, memory hooks, and rationales you need." />
      <section className="library-toolbar">
        <label className="field field--search"><Search /><span className="sr-only">Search lessons</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, terms, or symptoms" /></label>
        <div className="filter-row"><SlidersHorizontal aria-hidden="true" /><label>Subject<select value={subject} onChange={(event) => setFilter('subject', event.target.value)}><option>All subjects</option>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><label>Level<select value={difficulty} onChange={(event) => setFilter('difficulty', event.target.value)}><option>All levels</option><option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option></select></label><label>Status<select value={status} onChange={(event) => setFilter('status', event.target.value)}><option>All lessons</option><option>Completed</option><option>Not started</option></select></label></div>
      </section>
      <div className="results-meta"><strong>{filtered.length}</strong> lessons found <span>·</span> {filtered.reduce((sum, lesson) => sum + lesson.minutes, 0)} study minutes</div>
      {filtered.length ? <div className="lesson-grid">{filtered.map((lesson) => {
        const complete = state.completedLessons.includes(lesson.id);
        const bookmarked = state.bookmarkedLessons.includes(lesson.id);
        return <article className="lesson-card" key={lesson.id} style={{ '--lesson-accent': lesson.color } as React.CSSProperties}>
          <div className="lesson-card__visual"><span>{lesson.icon}</span><div className="lesson-card__visual-lines" /><button className={bookmarked ? 'is-active' : ''} onClick={() => toggleBookmark('lesson', lesson.id)} aria-label={bookmarked ? `Remove ${lesson.title} bookmark` : `Bookmark ${lesson.title}`}><Bookmark fill={bookmarked ? 'currentColor' : 'none'} /></button></div>
          <div className="lesson-card__body"><div className="lesson-card__badges"><span>{lesson.subject}</span><span className={`difficulty-tag difficulty-tag--${lesson.difficulty}`}>{lesson.difficulty}</span></div><h2>{lesson.title}</h2><p>{lesson.whyItMatters}</p><div className="lesson-card__meta"><span><Clock3 /> {lesson.minutes} min</span><span><BookOpen /> {lesson.objectives.length} objectives</span>{complete && <span className="success-text"><CheckCircle2 /> Complete</span>}</div><Link to={`/lessons/${lesson.id}`}>{complete ? 'Review lesson' : 'Start lesson'} <ArrowRight /></Link></div>
        </article>;
      })}</div> : <EmptyState icon={<Search />} title="No lessons match those filters" body="Clear a filter or search for a broader nursing concept." action={<button className="button button--secondary" onClick={() => { setQuery(''); setParams({}); }}>Clear filters</button>} />}
    </div>
  );
}

