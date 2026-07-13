import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLearning } from '../context/LearningContext';

const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export function StudyTimer() {
  const { state, setTimerSeconds, recordActivity } = useLearning();
  const [running, setRunning] = useState(false);
  const startRef = useRef(state.timerSeconds);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setTimerSeconds(state.timerSeconds + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running, setTimerSeconds, state.timerSeconds]);

  const reset = () => {
    const studied = Math.floor((state.timerSeconds - startRef.current) / 60);
    if (studied > 0) recordActivity({ type: 'study', label: `Focused study · ${studied} min`, subject: 'Focus session', value: studied });
    setRunning(false);
    setTimerSeconds(0);
    startRef.current = 0;
  };

  return (
    <div className="study-timer" aria-label="Study timer">
      <Timer size={16} aria-hidden="true" />
      <span aria-live="polite">{formatTime(state.timerSeconds)}</span>
      <button className="icon-button icon-button--small" onClick={() => setRunning((value) => !value)} aria-label={running ? 'Pause study timer' : 'Start study timer'}>
        {running ? <Pause size={15} /> : <Play size={15} />}
      </button>
      <button className="icon-button icon-button--small" onClick={reset} aria-label="Reset and save study timer">
        <RotateCcw size={14} />
      </button>
    </div>
  );
}

