import type { ActivityEntry, QuestionAttempt } from '../context/LearningContext';

export function calculateAccuracy(attempts: QuestionAttempt[]): number {
  if (!attempts.length) return 0;
  return Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100);
}

export function subjectAccuracy(attempts: QuestionAttempt[]): Record<string, number> {
  const groups = new Map<string, QuestionAttempt[]>();
  for (const attempt of attempts) groups.set(attempt.subject, [...(groups.get(attempt.subject) ?? []), attempt]);
  return Object.fromEntries([...groups].map(([subject, values]) => [subject, calculateAccuracy(values)]));
}

export function studiedMinutesToday(activities: ActivityEntry[]): number {
  const today = new Date().toDateString();
  return activities
    .filter((activity) => new Date(activity.at).toDateString() === today)
    .reduce((sum, activity) => sum + (activity.type === 'study' ? activity.value : 0), 0);
}

export function activityStreak(activities: ActivityEntry[]): number {
  const days = new Set(activities.map((activity) => new Date(activity.at).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

