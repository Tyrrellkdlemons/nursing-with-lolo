import { Calculator, Check, ChevronLeft, ChevronRight, FlaskConical, RotateCcw, ShieldAlert, Timer, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { dosageProblems } from '../content/dosageProblems';
import { useLearning } from '../context/LearningContext';
import { isDosageAnswerCorrect } from '../lib/dosage';
import { PageHeader } from '../components/ui';

const conversions = [
  ['g', 'mg', 1000], ['mg', 'mcg', 1000], ['kg', 'g', 1000], ['L', 'mL', 1000], ['oz', 'mL', 30], ['lb', 'kg', 1 / 2.2],
] as const;

export default function DosageLabPage() {
  const { recordActivity } = useLearning();
  const [category, setCategory] = useState('All categories');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [fromValue, setFromValue] = useState('1');
  const [conversion, setConversion] = useState(0);
  const categories = [...new Set(dosageProblems.map((item) => item.category))];
  const deck = useMemo(() => dosageProblems.filter((item) => category === 'All categories' || item.category === category), [category]);
  const problem = deck[index % deck.length];
  const correct = checked && isDosageAnswerCorrect(problem, Number(answer));
  const conversionItem = conversions[conversion];
  const converted = Number(fromValue) * conversionItem[2];
  const submit = () => { if (!answer.trim() || checked) return; const result = isDosageAnswerCorrect(problem, Number(answer)); setChecked(true); setScore((value) => ({ correct: value.correct + (result ? 1 : 0), total: value.total + 1 })); recordActivity({ type: 'dosage', label: result ? 'Dosage problem correct' : 'Dosage problem reviewed', subject: problem.category, value: result ? 1 : 0 }); };
  const move = (direction: number) => { setIndex((value) => (value + direction + deck.length) % deck.length); setAnswer(''); setChecked(false); };

  return <div><PageHeader eyebrow="DOSAGE CALCULATION LAB" title="Make the units do the thinking." description="Practice the setup, show every cancellation, estimate first, and treat high-alert math as a safety process—not a trick." />
    <section className="dosage-stats"><div><span><FlaskConical /></span><p><strong>{dosageProblems.length}</strong><small>guided problems</small></p></div><div><span><Calculator /></span><p><strong>{categories.length}</strong><small>calculation types</small></p></div><div><span><Timer /></span><p><strong>{score.total ? Math.round((score.correct / score.total) * 100) : 0}%</strong><small>session accuracy</small></p></div><div className="dosage-stats__warning"><ShieldAlert /><p><strong>Safety before speed</strong><small>Verify the order, concentration, units, range, rounding, and policy.</small></p></div></section>
    <div className="dosage-layout"><main className="dosage-problem"><div className="dosage-problem__head"><label>Practice set<select value={category} onChange={(event) => { setCategory(event.target.value); setIndex(0); setAnswer(''); setChecked(false); }}><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><span>{index + 1} / {deck.length}</span></div><div className="dosage-problem__card"><div className="lesson-card__badges"><span>{problem.category}</span><span className={`difficulty-tag difficulty-tag--${problem.difficulty}`}>{problem.difficulty}</span></div><h2>{problem.title}</h2><p className="dosage-prompt">{problem.prompt}</p><div className="order-available"><div><span>ORDERED</span><strong>{problem.ordered}</strong></div><div><span>AVAILABLE</span><strong>{problem.available}</strong></div></div><label className="dose-answer"><span>Your answer</span><div className={checked ? correct ? 'is-correct' : 'is-wrong' : ''}><input inputMode="decimal" value={answer} disabled={checked} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(); }} /><strong>{problem.unit}</strong>{checked && (correct ? <Check /> : <X />)}</div></label>{!checked ? <button className="button button--primary button--wide" onClick={submit} disabled={!answer.trim()}>Check my calculation</button> : <div className={`calculation-solution ${correct ? 'is-correct' : ''}`}><span className="eyebrow">{correct ? 'CORRECT SETUP' : 'LET’S WALK IT BACK'}</span><h3>{problem.formula}</h3><ol>{problem.steps.map((step) => <li key={step}>{step}</li>)}</ol><div className="answer-reveal"><span>Answer</span><strong>{problem.answer} {problem.unit}</strong></div><p><ShieldAlert /> {problem.safetyNote}</p></div>}</div><footer><button className="button button--secondary" onClick={() => move(-1)}><ChevronLeft /> Previous</button><button className="button button--primary" onClick={() => move(1)}>Next problem <ChevronRight /></button></footer></main>
      <aside className="dosage-tools"><section className="panel"><span className="eyebrow">UNIT CONVERTER</span><h2>Convert before you calculate.</h2><label>Conversion<select value={conversion} onChange={(event) => setConversion(Number(event.target.value))}>{conversions.map((item, index) => <option key={`${item[0]}-${item[1]}`} value={index}>{item[0]} → {item[1]}</option>)}</select></label><div className="converter-row"><label><span>{conversionItem[0]}</span><input type="number" value={fromValue} onChange={(event) => setFromValue(event.target.value)} /></label><span>→</span><div><span>{conversionItem[1]}</span><strong>{Number.isFinite(converted) ? Number(converted.toFixed(4)) : '—'}</strong></div></div></section><section className="panel formula-card"><span className="eyebrow">FORMULA WALL</span><h2>Four setups to know</h2><div><strong>Tablets / liquids</strong><code>D ÷ H × Q</code></div><div><strong>Pump rate</strong><code>mL ÷ hr</code></div><div><strong>Gravity rate</strong><code>(mL × gtt/mL) ÷ min</code></div><div><strong>Weight based</strong><code>dose/kg × kg</code></div></section><section className="mini-callout"><RotateCcw /><p><strong>Estimate first.</strong><span>If the desired dose is about twice what you have, the answer should be about twice the quantity.</span></p></section></aside></div>
  </div>;
}

