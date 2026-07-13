import type { StudyPlanTemplate } from './types';

export const studyPlanTemplates: StudyPlanTemplate[] = [
  {
    id: 'seven-day-exam', title: '7-Day Exam Reset', days: 7, dailyMinutes: 75,
    description: 'A focused week that alternates concept review, retrieval practice, and a final mixed exam.',
    focus: ['2 weak lessons daily', '20 flashcards', '15 practice questions', 'mistake notebook'],
    cadence: ['Days 1-2: map weak areas', 'Days 3-5: targeted review', 'Day 6: mixed exam', 'Day 7: light recall and rest'],
  },
  {
    id: 'fourteen-day-pharm', title: '14-Day Pharmacology', days: 14, dailyMinutes: 60,
    description: 'Build medication knowledge around classes, monitoring, safety, and patient teaching.',
    focus: ['medication safety', 'class patterns', 'adverse-effect red flags', 'calculation practice'],
    cadence: ['Learn one class family', 'Recall without notes', 'Answer 10 questions', 'Review errors the next day'],
  },
  {
    id: 'thirty-day-nclex', title: '30-Day NCLEX Sprint', days: 30, dailyMinutes: 90,
    description: 'A balanced month of Client Needs review, clinical judgment, and timed mixed practice.',
    focus: ['Client Needs rotation', 'clinical judgment', 'priority and delegation', 'timed question sets'],
    cadence: ['5 study days', '1 mixed test day', '1 recovery and planning day'],
  },
  {
    id: 'sixty-day-nclex', title: '60-Day NCLEX Build', days: 60, dailyMinutes: 75,
    description: 'A steady plan for rebuilding foundations before moving to mixed adaptive-style practice.',
    focus: ['foundation repair', 'systems review', 'pharmacology', 'case studies'],
    cadence: ['Weeks 1-2: fundamentals', 'Weeks 3-5: systems', 'Weeks 6-7: specialty', 'Week 8: mixed readiness'],
  },
  {
    id: 'weekend-intensive', title: 'Weekend Intensive', days: 2, dailyMinutes: 180,
    description: 'Two structured blocks for an upcoming unit exam without turning the weekend into one long cram.',
    focus: ['high-yield sheet', 'two 25-question sets', 'dosage lab', 'teach-back summary'],
    cadence: ['50-minute focus block', '10-minute break', 'active recall', 'end-of-day error review'],
  },
];

