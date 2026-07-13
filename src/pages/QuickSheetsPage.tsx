import { Bookmark, Download, ExternalLink, FileText, Printer, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { quickSheets } from '../content/quickSheets';
import { useLearning } from '../context/LearningContext';

export default function QuickSheetsPage() {
  const { state, toggleBookmark } = useLearning();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All sheets');
  const categories = [...new Set(quickSheets.map((sheet) => sheet.category))];
  const filtered = useMemo(() => quickSheets.filter((sheet) => (category === 'All sheets' || sheet.category === category) && `${sheet.title} ${sheet.category} ${sheet.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const selected = quickSheets.find((sheet) => sheet.id === params.get('sheet'));
  const setSelected = (id?: string) => { const next = new URLSearchParams(params); id ? next.set('sheet', id) : next.delete('sheet'); setParams(next); };
  return <div><PageHeader eyebrow="EDUCATIONAL QUICK-REFERENCE SHEETS" title="The page you want five minutes before class." description="Clean, printable review sheets for recall—not a substitute for the current textbook, instructor, order, or facility policy." actions={<a className="button button--primary" href="/downloads/nursing-with-lolo-quick-sheet-bundle.pdf" download>Download bundle <Download /></a>} />
    <section className="library-toolbar"><label className="field field--search"><Search /><span className="sr-only">Search quick sheets</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lab values, isolation, IV math…" /></label><div className="segmented-control segmented-control--wrap">{['All sheets', ...categories].map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></section>
    <div className="sheet-grid">{filtered.map((sheet) => <article key={sheet.id} style={{ '--sheet-accent': sheet.accent } as React.CSSProperties}><div className="sheet-grid__preview"><div><span>LOLO QUICK STUDY</span><strong>{sheet.title}</strong>{sheet.sections.slice(0, 2).map((section) => <p key={section.heading}>{section.heading}</p>)}</div><FileText /></div><div className="sheet-grid__body"><span className="eyebrow">{sheet.category}</span><h2>{sheet.title}</h2><p>{sheet.description}</p><div><button className="button button--secondary" onClick={() => setSelected(sheet.id)}>Preview</button><a className="icon-button" href={sheet.downloadPath} download aria-label={`Download ${sheet.title}`}><Download /></a><button className={state.bookmarkedSheets.includes(sheet.id) ? 'icon-button is-active' : 'icon-button'} onClick={() => toggleBookmark('sheet', sheet.id)} aria-label={`Save ${sheet.title}`}><Bookmark fill={state.bookmarkedSheets.includes(sheet.id) ? 'currentColor' : 'none'} /></button></div></div></article>)}</div>
    {selected && <div className="dialog-backdrop dialog-backdrop--page" role="presentation"><article className="sheet-preview" role="dialog" aria-modal="true" aria-label={`${selected.title} preview`} style={{ '--sheet-accent': selected.accent } as React.CSSProperties}><header><div><span className="eyebrow">NURSING WITH LOLO · QUICK STUDY</span><h1>{selected.title}</h1><p>{selected.description}</p></div><button className="icon-button" onClick={() => setSelected()} aria-label="Close preview"><X /></button></header><div className="sheet-preview__sections">{selected.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul></section>)}</div><footer><div><strong>Study aid, not clinical policy.</strong><p>Last reviewed {selected.reviewedDate}. Verify current references, instructor guidance, and facility requirements.</p><a href={selected.source.url} target="_blank" rel="noreferrer">{selected.source.organization} <ExternalLink /></a></div><div><button className="button button--secondary" onClick={() => window.print()}><Printer /> Print</button><a className="button button--primary" href={selected.downloadPath} download><Download /> PDF</a></div></footer></article></div>}
  </div>;
}

