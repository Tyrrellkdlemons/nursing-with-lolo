import Fuse from 'fuse.js';
import { ArrowRight, BookOpen, Bot, BrainCircuit, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { lessons } from '../content/catalog';

type Message = { role: 'user' | 'lolo'; text: string; lessonIds?: string[] };
const prompts = ['Explain electrolytes simply', 'How do I prioritize NCLEX questions?', 'Compare contact and droplet precautions', 'Help me remember ADPIE'];

export default function AskLoloPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ role: 'lolo', text: 'Hi, LOLO. I can simplify the original lessons in this site, compare concepts, suggest memory hooks, and point you to practice. I do not diagnose or give patient-specific treatment advice.' }]);
  const fuse = useMemo(() => new Fuse(lessons, { keys: ['title', 'subject', 'simpleExplanation', 'summary', 'vocabulary.term'], threshold: 0.48 }), []);
  const ask = (text = input) => {
    const value = text.trim(); if (!value) return;
    const matches = fuse.search(value).slice(0, 3).map((item) => item.item);
    const primary = matches[0];
    const reply = primary ? `${primary.simpleExplanation[0]} ${primary.summary.slice(0, 2).join(' ')} Memory hook: ${primary.memoryTricks[0]}` : 'I could not find a close lesson match in the local library. Try naming a body system, nursing action, medication-safety concept, or NCLEX priority.';
    setMessages((current) => [...current, { role: 'user', text: value }, { role: 'lolo', text: reply, lessonIds: matches.map((item) => item.id) }]); setInput('');
  };
  return <div><PageHeader eyebrow="LOCAL GUIDED STUDY ASSISTANT" title="Ask LOLO to make it make sense." description="This base mode answers from the site’s structured curriculum—no API key, account, or patient data required." />
    <div className="assistant-layout"><main className="chat-panel"><div className="chat-panel__head"><span><Bot /></span><div><strong>Ask LOLO</strong><small><i /> Local lesson mode · ready</small></div><span className="safety-pill"><ShieldCheck /> Study only</span></div><div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`chat-message chat-message--${message.role}`}>{message.role === 'lolo' && <span><Sparkles /></span>}<div><p>{message.text}</p>{message.lessonIds?.length ? <div>{message.lessonIds.map((id) => { const lesson = lessons.find((item) => item.id === id)!; return <Link key={id} to={`/lessons/${id}`}><BookOpen /> {lesson.shortTitle} <ArrowRight /></Link>; })}</div> : null}</div></div>)}</div><div className="suggestion-chips">{prompts.map((prompt) => <button key={prompt} onClick={() => ask(prompt)}>{prompt}</button>)}</div><form onSubmit={(event) => { event.preventDefault(); ask(); }}><label><span className="sr-only">Ask LOLO</span><textarea rows={2} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask for a simple explanation, comparison, memory trick, or study path…" /></label><button className="button button--primary" type="submit" disabled={!input.trim()}><Send /> Send</button></form></main><aside><section className="panel"><BrainCircuit /><span className="eyebrow">GOOD THINGS TO ASK</span><h2>Keep it study-focused.</h2><ul><li>Simplify a nursing concept</li><li>Compare similar disorders</li><li>Build a memory hook</li><li>Explain a missed rationale</li><li>Choose a lesson sequence</li></ul></section><section className="scope-banner"><ShieldCheck /><div><strong>Safe boundaries</strong><p>Do not enter patient identifiers. Ask a clinician or emergency service about real symptoms, diagnosis, dosing, or treatment.</p></div></section><section className="panel"><span className="eyebrow">OPTIONAL AI PATH</span><h2>Secure integration ready</h2><p>A future server-side Netlify Function can add an AI model without placing a secret in browser code. The site remains fully useful without it.</p></section></aside></div>
  </div>;
}

