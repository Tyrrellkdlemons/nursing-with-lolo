import Fuse from 'fuse.js';
import { BookOpen, FileText, Layers3, Search, Stethoscope, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinicalSkills } from '../content/clinicalSkills';
import { flashcards, lessons, questions } from '../content/catalog';
import { quickSheets } from '../content/quickSheets';

type SearchItem = {
  id: string;
  title: string;
  body: string;
  type: 'Lesson' | 'Flashcard' | 'Question' | 'Clinical skill' | 'Quick sheet';
  href: string;
};

export function SearchCommand({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const items = useMemo<SearchItem[]>(() => [
    ...lessons.map((item) => ({ id: item.id, title: item.title, body: `${item.subject} ${item.summary.join(' ')}`, type: 'Lesson' as const, href: `/lessons/${item.id}` })),
    ...flashcards.map((item) => ({ id: item.id, title: item.front, body: `${item.back} ${item.subject}`, type: 'Flashcard' as const, href: `/flashcards?card=${item.id}` })),
    ...questions.map((item) => ({ id: item.id, title: item.prompt, body: `${item.subject} ${item.priorityConcept}`, type: 'Question' as const, href: `/practice?question=${item.id}` })),
    ...clinicalSkills.map((item) => ({ id: item.id, title: item.title, body: `${item.category} ${item.steps.join(' ')}`, type: 'Clinical skill' as const, href: `/clinical-skills?skill=${item.id}` })),
    ...quickSheets.map((item) => ({ id: item.id, title: item.title, body: `${item.category} ${item.description}`, type: 'Quick sheet' as const, href: `/quick-sheets?sheet=${item.id}` })),
  ], []);
  const fuse = useMemo(() => new Fuse(items, { keys: ['title', 'body', 'type'], threshold: 0.36, includeScore: true }), [items]);
  const results = query.trim() ? fuse.search(query).slice(0, 12).map((result) => result.item) : items.filter((item) => item.type === 'Lesson').slice(0, 6);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const icon = (type: SearchItem['type']) => type === 'Lesson' ? <BookOpen /> : type === 'Flashcard' ? <Layers3 /> : type === 'Clinical skill' ? <Stethoscope /> : <FileText />;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="command-dialog" role="dialog" aria-modal="true" aria-label="Search the learning library">
        <div className="command-dialog__search">
          <Search size={20} aria-hidden="true" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lessons, cards, questions, skills..." aria-label="Search query" />
          <button className="icon-button" onClick={onClose} aria-label="Close search"><X size={19} /></button>
        </div>
        <div className="command-dialog__meta"><span>{query ? `${results.length} best matches` : 'Try “prioritization,” “potassium,” or “SBAR”'}</span><kbd>Esc</kbd></div>
        <div className="command-results">
          {results.map((item) => (
            <button key={`${item.type}-${item.id}`} onClick={() => { navigate(item.href); onClose(); }}>
              <span className="command-results__icon">{icon(item.type)}</span>
              <span><strong>{item.title}</strong><small>{item.type}</small></span>
            </button>
          ))}
          {!results.length && <div className="empty-state"><Search /><h3>No match yet</h3><p>Try a symptom, system, medication class, or nursing action.</p></div>}
        </div>
      </section>
    </div>
  );
}

