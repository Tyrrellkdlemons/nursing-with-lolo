import { Bookmark, ChevronLeft, ChevronRight, Keyboard, Layers3, Maximize2, RotateCcw, Shuffle, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { flashcards, lessons, subjects } from '../content/catalog';
import { useLearning, type CardRating } from '../context/LearningContext';
import { PageHeader } from '../components/ui';

const shuffleScore = (id: string, seed: number) => {
  let hash = seed >>> 0;
  for (const character of id) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
  return hash;
};

export default function FlashcardsPage() {
  const [params] = useSearchParams();
  const { state, rateCard, toggleBookmark } = useLearning();
  const [subject, setSubject] = useState('All subjects');
  const [mode, setMode] = useState('All cards');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const lessonId = params.get('lesson');
  const requestedCard = params.get('card');
  const deck = useMemo(() => {
    let values = flashcards.filter((card) => (!lessonId || card.lessonId === lessonId) && (subject === 'All subjects' || card.subject === subject));
    if (mode === 'Hard') values = values.filter((card) => state.cardReviews[card.id]?.rating === 'hard');
    if (mode === 'Due now') values = values.filter((card) => !state.cardReviews[card.id] || new Date(state.cardReviews[card.id].dueAt) <= new Date());
    if (mode === 'Saved') values = values.filter((card) => state.bookmarkedCards.includes(card.id));
    if (shuffleSeed) values = [...values].sort((a, b) => shuffleScore(a.id, shuffleSeed) - shuffleScore(b.id, shuffleSeed));
    return values;
  }, [lessonId, mode, shuffleSeed, state.bookmarkedCards, state.cardReviews, subject]);
  const card = deck[index % Math.max(1, deck.length)];

  useEffect(() => {
    const requestedIndex = requestedCard ? deck.findIndex((item) => item.id === requestedCard) : -1;
    setIndex(requestedIndex >= 0 ? requestedIndex : 0);
    setFlipped(false);
    // The deck can change after a rating; only an explicit filter or URL change
    // should jump the learner back to the requested card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, mode, requestedCard, subject]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!card || ['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)) return;
      if (event.code === 'Space') { event.preventDefault(); setFlipped((value) => !value); }
      if (event.key === 'ArrowRight') { setIndex((value) => (value + 1) % deck.length); setFlipped(false); }
      if (event.key === 'ArrowLeft') { setIndex((value) => (value - 1 + deck.length) % deck.length); setFlipped(false); }
      if (['1', '2', '3'].includes(event.key)) review((['hard', 'medium', 'easy'] as CardRating[])[Number(event.key) - 1]);
    };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  });
  const review = (rating: CardRating) => { if (!card) return; rateCard(card.id, rating, card.subject); setIndex((value) => (value + 1) % deck.length); setFlipped(false); };
  const speak = () => { if (!card || !('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${card.front}. ${card.back}`)); };

  return (
    <div className={fullscreen ? 'flashcard-page flashcard-page--fullscreen' : 'flashcard-page'}>
      <PageHeader eyebrow="SPACED REVIEW" title="Make recall automatic." description="Flip, rate, and revisit the cards your brain needs most. Your next-review schedule stays on this device." />
      <section className="study-toolbar"><label>Subject<select value={subject} onChange={(event) => setSubject(event.target.value)}><option>All subjects</option>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><div className="segmented-control" aria-label="Deck mode">{['All cards', 'Due now', 'Hard', 'Saved'].map((item) => <button key={item} className={mode === item ? 'is-active' : ''} onClick={() => setMode(item)}>{item}</button>)}</div><button className="button button--secondary" onClick={() => setShuffleSeed(Date.now())}><Shuffle /> Shuffle</button></section>
      <div className="flashcard-stage">
        <div className="flashcard-stage__top"><span>{deck.length ? index + 1 : 0} / {deck.length}</span><div className="flashcard-progress"><span style={{ width: `${deck.length ? ((index + 1) / deck.length) * 100 : 0}%` }} /></div><button className="icon-button" onClick={speak} aria-label="Read card aloud"><Volume2 /></button><button className="icon-button" onClick={() => setFullscreen((value) => !value)} aria-label="Toggle full-screen flashcards"><Maximize2 /></button></div>
        {card ? <><button className={`flashcard ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? `Answer: ${card.back}. Click to see question.` : `Question: ${card.front}. Click to reveal answer.`}><span className="flashcard__face flashcard__front"><span className="eyebrow">{card.subject} · {card.tag}</span><strong>{card.front}</strong><small>Tap or press space to reveal</small></span><span className="flashcard__face flashcard__back"><span className="eyebrow">ANSWER</span><strong>{card.back}</strong><small>{card.difficulty} · rate this memory</small></span></button><div className="flashcard-actions"><button className="icon-button" onClick={() => { setIndex((value) => (value - 1 + deck.length) % deck.length); setFlipped(false); }} aria-label="Previous card"><ChevronLeft /></button><button className="rating-button rating-button--hard" onClick={() => review('hard')}><span>1</span> Hard<small>again tomorrow</small></button><button className="rating-button rating-button--medium" onClick={() => review('medium')}><span>2</span> Medium<small>in 3 days</small></button><button className="rating-button rating-button--easy" onClick={() => review('easy')}><span>3</span> Easy<small>in 7 days</small></button><button className="icon-button" onClick={() => { setIndex((value) => (value + 1) % deck.length); setFlipped(false); }} aria-label="Next card"><ChevronRight /></button></div><div className="flashcard-utility"><button onClick={() => toggleBookmark('card', card.id)} className={state.bookmarkedCards.includes(card.id) ? 'is-active' : ''}><Bookmark fill={state.bookmarkedCards.includes(card.id) ? 'currentColor' : 'none'} /> Save card</button><span><Keyboard /> Space flips · arrows move · 1/2/3 rate</span></div></> : <div className="empty-state"><Layers3 /><h3>No cards in this queue</h3><p>Try another subject or switch back to all cards.</p><button className="button button--secondary" onClick={() => { setSubject('All subjects'); setMode('All cards'); }}><RotateCcw /> Reset filters</button></div>}
      </div>
    </div>
  );
}
