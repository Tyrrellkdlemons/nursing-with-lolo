import { ArrowDown, ArrowUp, Check, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { PracticeQuestion } from '../content/types';

export function QuestionRenderer({ question, onComplete, showRationale = true }: { question: PracticeQuestion; onComplete?: (correct: boolean) => void; showRationale?: boolean }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [dose, setDose] = useState('');
  const [order, setOrder] = useState<string[]>(question.orderedItems ?? []);
  const [matching, setMatching] = useState<number[]>([]);
  const [matrix, setMatrix] = useState<number[]>([]);
  const [condition, setCondition] = useState<number | null>(null);
  const [actions, setActions] = useState<number[]>([]);
  const [parameters, setParameters] = useState<number[]>([]);
  const [highlights, setHighlights] = useState<number[]>([]);
  const sentences = useMemo(() => question.highlightText?.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((item) => item.trim()) ?? [], [question.highlightText]);

  useEffect(() => {
    setSelected([]); setSubmitted(false); setDose(''); setOrder(question.orderedItems ?? []); setMatching([]); setMatrix([]);
    setCondition(null); setActions([]); setParameters([]); setHighlights([]);
  }, [question]);

  const isCorrect = () => {
    if (question.type === 'multiple-choice' || question.type === 'multiple-response') return selected.length === question.correct.length && selected.every((item) => question.correct.includes(item));
    if (question.type === 'dosage') return Math.abs(Number(dose) - Number(question.correct[0])) < 0.001;
    if (question.type === 'ordered-response') return order.every((item, index) => question.orderedItems?.[question.correctOrder?.[index] ?? -1] === item);
    if (question.type === 'matching') return question.matchingPairs?.every((_, index) => matching[index] === index) ?? false;
    if (question.type === 'matrix') return question.matrixRows?.every((row, index) => matrix[index] === row.correct) ?? false;
    if (question.type === 'bow-tie' && question.bowTie) return condition === question.bowTie.correctCondition && actions.length === question.bowTie.correctActions.length && actions.every((item) => question.bowTie!.correctActions.includes(item)) && parameters.length === question.bowTie.correctParameters.length && parameters.every((item) => question.bowTie!.correctParameters.includes(item));
    if (question.type === 'highlight') return Boolean(highlights.length > 0 && highlights.every((index) => question.highlightAnswers?.some((answer) => sentences[index].includes(answer))) && question.highlightAnswers?.every((answer) => highlights.some((index) => sentences[index].includes(answer))));
    return false;
  };
  const result = submitted ? isCorrect() : false;
  const submit = () => { const correct = isCorrect(); setSubmitted(true); onComplete?.(correct); };
  const canSubmit = question.type === 'dosage' ? dose.trim() !== '' : question.type === 'ordered-response' ? order.length > 0 : question.type === 'matching' ? matching.filter((value) => value !== undefined).length === (question.matchingPairs?.length ?? 0) : question.type === 'matrix' ? matrix.filter((value) => value !== undefined).length === (question.matrixRows?.length ?? 0) : question.type === 'bow-tie' ? condition !== null && actions.length === 2 && parameters.length === 2 : question.type === 'highlight' ? highlights.length > 0 : selected.length > 0;
  const toggle = (list: number[], setter: (value: number[]) => void, index: number, max = Infinity) => setter(list.includes(index) ? list.filter((item) => item !== index) : list.length < max ? [...list, index] : list);

  return (
    <div className="question-renderer">
      <div className="question-renderer__type"><span>{question.type.replaceAll('-', ' ')}</span><span>{question.clientNeeds}</span></div>
      <h2>{question.prompt}</h2>
      {(question.type === 'multiple-choice' || question.type === 'multiple-response') && <div className="answer-stack">{question.options.map((option, index) => {
        const chosen = selected.includes(index); const correct = question.correct.includes(index);
        return <button key={option} disabled={submitted} className={submitted ? correct ? 'is-correct' : chosen ? 'is-wrong' : '' : chosen ? 'is-selected' : ''} onClick={() => question.type === 'multiple-choice' ? setSelected([index]) : toggle(selected, setSelected, index)}><span>{String.fromCharCode(65 + index)}</span>{option}{submitted && correct && <Check />}</button>;
      })}</div>}
      {question.type === 'dosage' && <label className="dose-answer"><span>Numeric answer</span><div><input inputMode="decimal" value={dose} disabled={submitted} onChange={(event) => setDose(event.target.value)} /><strong>mL</strong></div></label>}
      {question.type === 'ordered-response' && <div className="order-list">{order.map((item, index) => <div key={item} className={submitted ? (question.orderedItems?.[question.correctOrder?.[index] ?? -1] === item ? 'is-correct' : 'is-wrong') : ''}><span>{index + 1}</span><p>{item}</p><button disabled={submitted || index === 0} onClick={() => setOrder((current) => current.map((value, itemIndex) => itemIndex === index - 1 ? current[index] : itemIndex === index ? current[index - 1] : value))} aria-label={`Move ${item} up`}><ArrowUp /></button><button disabled={submitted || index === order.length - 1} onClick={() => setOrder((current) => current.map((value, itemIndex) => itemIndex === index + 1 ? current[index] : itemIndex === index ? current[index + 1] : value))} aria-label={`Move ${item} down`}><ArrowDown /></button></div>)}</div>}
      {question.type === 'matching' && question.matchingPairs && <div className="matching-list">{question.matchingPairs.map((pair, index) => <label key={pair.left}><strong>{pair.left}</strong><select disabled={submitted} value={matching[index] ?? ''} onChange={(event) => setMatching((current) => { const next = [...current]; next[index] = Number(event.target.value); return next; })}><option value="">Choose a match</option>{question.matchingPairs!.map((candidate, candidateIndex) => <option key={candidate.right} value={candidateIndex}>{candidate.right}</option>)}</select>{submitted && <span className={matching[index] === index ? 'success-text' : 'danger-text'}>{matching[index] === index ? 'Correct' : `Answer: ${pair.right}`}</span>}</label>)}</div>}
      {question.type === 'matrix' && question.matrixRows && <div className="matrix-table"><div className="matrix-table__head"><span>Finding or task</span>{question.matrixRows[0].options.map((option) => <strong key={option}>{option}</strong>)}</div>{question.matrixRows.map((row, rowIndex) => <div key={row.label} className={submitted ? matrix[rowIndex] === row.correct ? 'is-correct' : 'is-wrong' : ''}><span>{row.label}</span>{row.options.map((option, optionIndex) => <label key={option}><input type="radio" name={`${question.id}-${rowIndex}`} disabled={submitted} checked={matrix[rowIndex] === optionIndex} onChange={() => setMatrix((current) => { const next = [...current]; next[rowIndex] = optionIndex; return next; })} /><span className="sr-only">{option}</span></label>)}</div>)}</div>}
      {question.type === 'bow-tie' && question.bowTie && <div className="bow-tie"><div><h3>Most likely condition</h3>{question.bowTie.conditions.map((item, index) => <button disabled={submitted} className={condition === index ? 'is-selected' : ''} onClick={() => setCondition(index)} key={item}>{item}</button>)}</div><div><h3>2 actions</h3>{question.bowTie.actions.map((item, index) => <button disabled={submitted} className={actions.includes(index) ? 'is-selected' : ''} onClick={() => toggle(actions, setActions, index, 2)} key={item}>{item}</button>)}</div><div><h3>2 parameters</h3>{question.bowTie.parameters.map((item, index) => <button disabled={submitted} className={parameters.includes(index) ? 'is-selected' : ''} onClick={() => toggle(parameters, setParameters, index, 2)} key={item}>{item}</button>)}</div></div>}
      {question.type === 'highlight' && <div className="highlight-question" aria-label="Select text to highlight">{sentences.map((sentence, index) => <button key={sentence} disabled={submitted} className={highlights.includes(index) ? 'is-selected' : ''} onClick={() => toggle(highlights, setHighlights, index)}>{sentence}</button>)}</div>}
      {!submitted && <button className="button button--primary" disabled={!canSubmit} onClick={submit}>Check answer</button>}
      {submitted && showRationale && <div className={`rationale-box ${result ? 'rationale-box--correct' : ''}`} role="status"><strong>{result ? 'Correct — the priority is clear.' : 'Review this reasoning, then try it again later.'}</strong><p>{question.rationale}</p><div className="rationale-meta"><span><b>Priority:</b> {question.priorityConcept}</span><span><b>Exam clue:</b> {question.testTakingClue}</span></div>{question.optionRationales.length > 0 && <details><summary>Why each option is right or wrong</summary><ol>{question.optionRationales.map((item, index) => <li key={item}><strong>{String.fromCharCode(65 + index)}.</strong> {item}</li>)}</ol></details>}</div>}
      {submitted && <button className="text-button" onClick={() => { setSubmitted(false); setSelected([]); setDose(''); setOrder(question.orderedItems ?? []); setMatching([]); setMatrix([]); setCondition(null); setActions([]); setParameters([]); setHighlights([]); }}><RotateCcw /> Try again</button>}
    </div>
  );
}
