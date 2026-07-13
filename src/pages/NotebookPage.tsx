import { Bookmark, BookOpen, Download, Edit3, FileText, Layers3, NotebookPen, Pin, Plus, Printer, Search, ShieldAlert, Trash2, X, type LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeader } from '../components/ui';
import { flashcards, lessons, questions } from '../content/catalog';
import { quickSheets } from '../content/quickSheets';
import { useLearning, type StudyNote } from '../context/LearningContext';

function BookmarkSection({ title, Icon, items, onRemove }: { title: string; Icon: LucideIcon; items: Array<{ id: string; label: string; href: string }>; onRemove: (id: string) => void }) {
  return <section><h2><Icon />{title}<span>{items.length}</span></h2>{items.length ? <div>{items.map((item) => <article key={item.id}><Link to={item.href}>{item.label}</Link><button onClick={() => onRemove(item.id)} aria-label={`Remove ${item.label} bookmark`}><X /></button></article>)}</div> : <p>No saved {title.toLowerCase()} yet.</p>}</section>;
}

export default function NotebookPage() {
  const { state, addNote, updateNote, deleteNote, exportProgress, toggleBookmark } = useLearning();
  const [tab, setTab] = useState<'notes' | 'bookmarks'>('notes');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<StudyNote | null | 'new'>(null);
  const [draft, setDraft] = useState({ title: '', body: '', subject: 'General' });
  const notes = useMemo(() => state.notes.filter((note) => `${note.title} ${note.body} ${note.subject}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt)), [query, state.notes]);
  const openNew = () => { setDraft({ title: '', body: '', subject: 'General' }); setEditing('new'); };
  const openEdit = (note: StudyNote) => { setDraft({ title: note.title, body: note.body, subject: note.subject }); setEditing(note); };
  const save = () => { if (!draft.title.trim() || !draft.body.trim()) return; if (editing === 'new') addNote({ ...draft, title: draft.title.trim(), body: draft.body.trim(), pinned: false }); else if (editing) updateNote(editing.id, draft); setEditing(null); };
  const bookmarkedLessons = lessons.filter((item) => state.bookmarkedLessons.includes(item.id));
  const bookmarkedCards = flashcards.filter((item) => state.bookmarkedCards.includes(item.id));
  const bookmarkedQuestions = questions.filter((item) => state.bookmarkedQuestions.includes(item.id));
  const bookmarkedSheets = quickSheets.filter((item) => state.bookmarkedSheets.includes(item.id));

  return <div><PageHeader eyebrow="STUDY NOTEBOOK" title="Keep the explanation that made it click." description="Write in your own words, attach notes to lessons, pin the important ones, and keep every saved question, card, and sheet together." actions={<div><button className="button button--secondary" onClick={exportProgress}><Download /> Export</button><button className="button button--primary" onClick={openNew}><Plus /> New note</button></div>} />
    <div className="notebook-toolbar"><div className="segmented-control"><button className={tab === 'notes' ? 'is-active' : ''} onClick={() => setTab('notes')}>Notes <span>{state.notes.length}</span></button><button className={tab === 'bookmarks' ? 'is-active' : ''} onClick={() => setTab('bookmarks')}>Bookmarks <span>{bookmarkedLessons.length + bookmarkedCards.length + bookmarkedQuestions.length + bookmarkedSheets.length}</span></button></div><label className="field field--search"><Search /><span className="sr-only">Search notebook</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your notebook" /></label></div>
    {tab === 'notes' ? notes.length ? <div className="note-grid">{notes.map((note) => <article key={note.id} className={note.pinned ? 'is-pinned' : ''}><header><span className="subject-chip">{note.subject}</span><button className={note.pinned ? 'is-active' : ''} onClick={() => updateNote(note.id, { pinned: !note.pinned })} aria-label={note.pinned ? 'Unpin note' : 'Pin note'}><Pin fill={note.pinned ? 'currentColor' : 'none'} /></button></header><h2>{note.title}</h2><p>{note.body}</p><footer><small>Updated {new Date(note.updatedAt).toLocaleDateString()}</small><div><button onClick={() => openEdit(note)} aria-label={`Edit ${note.title}`}><Edit3 /></button><button onClick={() => deleteNote(note.id)} aria-label={`Delete ${note.title}`}><Trash2 /></button></div></footer></article>)}</div> : <EmptyState icon={<NotebookPen />} title="Your notebook is open" body="Add a concept in your own words or save a note directly from any lesson." action={<button className="button button--primary" onClick={openNew}><Plus /> Add first note</button>} /> : <div className="bookmark-sections">
      <BookmarkSection title="Lessons" Icon={BookOpen} items={bookmarkedLessons.map((item) => ({ id: item.id, label: item.title, href: `/lessons/${item.id}` }))} onRemove={(id) => toggleBookmark('lesson', id)} />
      <BookmarkSection title="Flashcards" Icon={Layers3} items={bookmarkedCards.map((item) => ({ id: item.id, label: item.front, href: `/flashcards?card=${item.id}` }))} onRemove={(id) => toggleBookmark('card', id)} />
      <BookmarkSection title="Questions" Icon={FileText} items={bookmarkedQuestions.map((item) => ({ id: item.id, label: item.prompt, href: `/practice?question=${item.id}` }))} onRemove={(id) => toggleBookmark('question', id)} />
      <BookmarkSection title="Quick sheets" Icon={Bookmark} items={bookmarkedSheets.map((item) => ({ id: item.id, label: item.title, href: `/quick-sheets?sheet=${item.id}` }))} onRemove={(id) => toggleBookmark('sheet', id)} />
    </div>}
    {editing && <div className="dialog-backdrop" role="presentation"><section className="note-dialog" role="dialog" aria-modal="true" aria-label={editing === 'new' ? 'Create note' : 'Edit note'}><div className="panel__head"><div><span className="eyebrow">{editing === 'new' ? 'NEW NOTE' : 'EDIT NOTE'}</span><h2>Write it like you would teach it.</h2></div><button className="icon-button" onClick={() => setEditing(null)} aria-label="Close"><X /></button></div><label>Title<input autoFocus value={draft.title} onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value }))} /></label><label>Subject<input value={draft.subject} onChange={(event) => setDraft((value) => ({ ...value, subject: event.target.value }))} /></label><label>Note<textarea rows={9} value={draft.body} onChange={(event) => setDraft((value) => ({ ...value, body: event.target.value }))} /></label><p className="privacy-note"><ShieldAlert aria-hidden="true" /> Use study-only examples. Do not enter real patient names, identifiers, or protected health information.</p><div className="note-dialog__actions"><button className="button button--secondary" onClick={() => window.print()}><Printer /> Print</button><button className="button button--primary" onClick={save}>Save note</button></div></section></div>}
  </div>;
}
