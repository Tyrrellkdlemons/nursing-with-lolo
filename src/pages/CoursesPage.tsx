import { ArrowRight, BookOpen, CheckCircle2, Clock3, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { lessons, subjects } from '../content/catalog';
import { useLearning } from '../context/LearningContext';
import { PageHeader, ProgressRing } from '../components/ui';

const palette = ['#32cbb9', '#6b7cff', '#f08395', '#ee9a61', '#8c72e8', '#4ba7df', '#50bd7f', '#d37cba'];

export default function CoursesPage() {
  const { state } = useLearning();
  return (
    <div>
      <PageHeader eyebrow="30 ORIGINAL LESSONS" title="A curriculum that connects the dots." description="Move from fundamentals to adult health and specialty nursing, with the same simple lesson rhythm in every subject." actions={<Link className="button button--primary" to="/library">Browse every lesson <ArrowRight /></Link>} />
      <div className="course-grid">
        {subjects.map((subject, index) => {
          const items = lessons.filter((lesson) => lesson.subject === subject);
          const complete = items.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
          const minutes = items.reduce((sum, lesson) => sum + lesson.minutes, 0);
          return (
            <article className="course-card" key={subject} style={{ '--course-accent': palette[index % palette.length] } as React.CSSProperties}>
              <div className="course-card__top"><span className="course-card__number">{String(index + 1).padStart(2, '0')}</span><ProgressRing value={Math.round((complete / items.length) * 100)} label="done" size={66} /></div>
              <span className="eyebrow">COURSE</span><h2>{subject}</h2>
              <p>{items.map((lesson) => lesson.shortTitle).slice(0, 3).join(' · ')}</p>
              <div className="course-card__meta"><span><BookOpen /> {items.length} lessons</span><span><Clock3 /> {minutes} min</span><span><Layers3 /> {items.length * 10} cards</span></div>
              <div className="course-card__lessons">{items.slice(0, 4).map((lesson) => <Link key={lesson.id} to={`/lessons/${lesson.id}`}><span className={state.completedLessons.includes(lesson.id) ? 'complete-dot' : ''}>{state.completedLessons.includes(lesson.id) && <CheckCircle2 />}</span>{lesson.title}<ArrowRight /></Link>)}</div>
              <Link className="button button--secondary button--wide" to={`/library?subject=${encodeURIComponent(subject)}`}>Open course <ArrowRight /></Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

