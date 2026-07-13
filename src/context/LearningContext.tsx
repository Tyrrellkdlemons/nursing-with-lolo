import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { exportJson, loadLocalState, saveLocalState } from '../lib/storage';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type CardRating = 'easy' | 'medium' | 'hard';

export interface StudyNote {
  id: string;
  title: string;
  body: string;
  subject: string;
  lessonId?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionAttempt {
  questionId: string;
  correct: boolean;
  subject: string;
  answeredAt: string;
}

export interface CardReview {
  rating: CardRating;
  reviewedAt: string;
  dueAt: string;
  intervalDays: number;
}

export interface ActivityEntry {
  id: string;
  type: 'lesson' | 'question' | 'flashcard' | 'dosage' | 'study';
  label: string;
  subject: string;
  value: number;
  at: string;
}

export interface PlannerTask {
  id: string;
  date: string;
  title: string;
  minutes: number;
  completed: boolean;
  subject: string;
}

export interface LearningState {
  learnerName: string;
  completedLessons: string[];
  bookmarkedLessons: string[];
  bookmarkedCards: string[];
  bookmarkedQuestions: string[];
  bookmarkedSheets: string[];
  notes: StudyNote[];
  attempts: QuestionAttempt[];
  cardReviews: Record<string, CardReview>;
  activities: ActivityEntry[];
  plannerTasks: PlannerTask[];
  dailyGoalMinutes: number;
  targetScore: number;
  examDate: string;
  theme: ThemeSetting;
  fontScale: number;
  reducedMotion: boolean;
  highContrast: boolean;
  timerSeconds: number;
}

const initialState: LearningState = {
  learnerName: 'LOLO',
  completedLessons: [],
  bookmarkedLessons: [],
  bookmarkedCards: [],
  bookmarkedQuestions: [],
  bookmarkedSheets: [],
  notes: [],
  attempts: [],
  cardReviews: {},
  activities: [],
  plannerTasks: [],
  dailyGoalMinutes: 45,
  targetScore: 80,
  examDate: '',
  theme: 'system',
  fontScale: 1,
  reducedMotion: false,
  highContrast: false,
  timerSeconds: 0,
};

interface LearningContextValue {
  state: LearningState;
  updateSettings: (settings: Partial<LearningState>) => void;
  toggleLessonComplete: (lessonId: string, title?: string, subject?: string) => void;
  toggleBookmark: (kind: 'lesson' | 'card' | 'question' | 'sheet', id: string) => void;
  addNote: (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<StudyNote>) => void;
  deleteNote: (id: string) => void;
  recordQuestion: (questionId: string, correct: boolean, subject: string) => void;
  rateCard: (cardId: string, rating: CardRating, subject: string) => void;
  recordActivity: (entry: Omit<ActivityEntry, 'id' | 'at'>) => void;
  setPlannerTasks: (tasks: PlannerTask[]) => void;
  togglePlannerTask: (id: string) => void;
  setTimerSeconds: (seconds: number) => void;
  resetProgress: () => void;
  exportProgress: () => void;
}

const LearningContext = createContext<LearningContextValue | null>(null);

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningState>(() => loadLocalState(initialState));

  useEffect(() => saveLocalState(state), [state]);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = state.theme === 'dark' || (state.theme === 'system' && prefersDark);
    root.dataset.theme = isDark ? 'dark' : 'light';
    root.dataset.contrast = state.highContrast ? 'high' : 'normal';
    root.dataset.motion = state.reducedMotion ? 'reduced' : 'full';
    root.style.setProperty('--font-scale', String(state.fontScale));
  }, [state.theme, state.highContrast, state.reducedMotion, state.fontScale]);

  const updateSettings = useCallback((settings: Partial<LearningState>) => {
    setState((current) => ({ ...current, ...settings }));
  }, []);

  const recordActivity = useCallback((entry: Omit<ActivityEntry, 'id' | 'at'>) => {
    setState((current) => ({
      ...current,
      activities: [{ ...entry, id: makeId(), at: new Date().toISOString() }, ...current.activities].slice(0, 500),
    }));
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string, title = 'Lesson', subject = 'Study') => {
    setState((current) => {
      const completing = !current.completedLessons.includes(lessonId);
      return {
        ...current,
        completedLessons: completing
          ? [...current.completedLessons, lessonId]
          : current.completedLessons.filter((id) => id !== lessonId),
        activities: completing
          ? [{ id: makeId(), type: 'lesson' as const, label: `Completed ${title}`, subject, value: 1, at: new Date().toISOString() }, ...current.activities].slice(0, 500)
          : current.activities,
      };
    });
  }, []);

  const toggleBookmark = useCallback((kind: 'lesson' | 'card' | 'question' | 'sheet', id: string) => {
    const key = ({ lesson: 'bookmarkedLessons', card: 'bookmarkedCards', question: 'bookmarkedQuestions', sheet: 'bookmarkedSheets' } as const)[kind];
    setState((current) => {
      const values = current[key];
      return { ...current, [key]: values.includes(id) ? values.filter((value) => value !== id) : [...values, id] };
    });
  }, []);

  const addNote = useCallback((note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setState((current) => ({ ...current, notes: [{ ...note, id: makeId(), createdAt: now, updatedAt: now }, ...current.notes] }));
  }, []);

  const updateNote = useCallback((id: string, note: Partial<StudyNote>) => {
    setState((current) => ({
      ...current,
      notes: current.notes.map((item) => item.id === id ? { ...item, ...note, updatedAt: new Date().toISOString() } : item),
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setState((current) => ({ ...current, notes: current.notes.filter((note) => note.id !== id) }));
  }, []);

  const recordQuestion = useCallback((questionId: string, correct: boolean, subject: string) => {
    setState((current) => ({
      ...current,
      attempts: [...current.attempts, { questionId, correct, subject, answeredAt: new Date().toISOString() }].slice(-2000),
      activities: [{ id: makeId(), type: 'question' as const, label: correct ? 'Answered correctly' : 'Added to review queue', subject, value: correct ? 1 : 0, at: new Date().toISOString() }, ...current.activities].slice(0, 500),
    }));
  }, []);

  const rateCard = useCallback((cardId: string, rating: CardRating, subject: string) => {
    const intervalDays = rating === 'easy' ? 7 : rating === 'medium' ? 3 : 1;
    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + intervalDays);
    setState((current) => ({
      ...current,
      cardReviews: { ...current.cardReviews, [cardId]: { rating, reviewedAt: now.toISOString(), dueAt: due.toISOString(), intervalDays } },
      activities: [{ id: makeId(), type: 'flashcard' as const, label: `Rated ${rating}`, subject, value: 1, at: now.toISOString() }, ...current.activities].slice(0, 500),
    }));
  }, []);

  const setPlannerTasks = useCallback((plannerTasks: PlannerTask[]) => setState((current) => ({ ...current, plannerTasks })), []);
  const togglePlannerTask = useCallback((id: string) => setState((current) => ({
    ...current,
    plannerTasks: current.plannerTasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task),
  })), []);
  const setTimerSeconds = useCallback((timerSeconds: number) => setState((current) => ({ ...current, timerSeconds })), []);
  const resetProgress = useCallback(() => setState({ ...initialState, theme: state.theme }), [state.theme]);
  const exportProgress = useCallback(() => exportJson(state, 'nursing-with-lolo-progress.json'), [state]);

  const value = useMemo<LearningContextValue>(() => ({
    state, updateSettings, toggleLessonComplete, toggleBookmark, addNote, updateNote, deleteNote,
    recordQuestion, rateCard, recordActivity, setPlannerTasks, togglePlannerTask, setTimerSeconds,
    resetProgress, exportProgress,
  }), [state, updateSettings, toggleLessonComplete, toggleBookmark, addNote, updateNote, deleteNote, recordQuestion, rateCard, recordActivity, setPlannerTasks, togglePlannerTask, setTimerSeconds, resetProgress, exportProgress]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning must be used inside LearningProvider.');
  return context;
}
