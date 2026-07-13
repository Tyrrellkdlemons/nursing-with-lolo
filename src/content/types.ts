export type Difficulty = 'easy' | 'medium' | 'hard';
export type ReviewStatus = 'reviewed' | 'instructor-check';
export type QuestionType =
  | 'multiple-choice'
  | 'multiple-response'
  | 'ordered-response'
  | 'matching'
  | 'dosage'
  | 'matrix'
  | 'bow-tie'
  | 'highlight'
  | 'case-study';

export interface SourceLink {
  title: string;
  organization: string;
  url: string;
  reviewed: string;
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface ClinicalExample {
  scenario: string;
  notice: string[];
  interpret: string[];
  respond: string[];
  reflect: string;
}

export interface FlashFact {
  front: string;
  back: string;
  tag: string;
  difficulty: Difficulty;
}

export interface QuestionSeed {
  prompt: string;
  type: 'multiple-choice' | 'multiple-response';
  options: string[];
  correct: number[];
  rationale: string;
  optionRationales: string[];
  priorityConcept: string;
  testTakingClue: string;
  difficulty: Difficulty;
  clientNeeds: string;
}

export interface Lesson {
  id: string;
  title: string;
  shortTitle: string;
  subject: string;
  unit: string;
  icon: string;
  color: string;
  difficulty: Difficulty;
  minutes: number;
  whyItMatters: string;
  objectives: string[];
  simpleExplanation: string[];
  vocabulary: VocabularyTerm[];
  normalFindings: string[];
  abnormalFindings: string[];
  riskFactors: string[];
  assessments: string[];
  interventions: string[];
  priorityActions: string[];
  medications: string[];
  labs: string[];
  diagnostics: string[];
  patientTeaching: string[];
  safetyWarnings: string[];
  commonMistakes: string[];
  memoryTricks: string[];
  examTips: string[];
  clinicalExample: ClinicalExample;
  summary: string[];
  facts: FlashFact[];
  questions: QuestionSeed[];
  sources: SourceLink[];
  reviewedDate: string;
  reviewStatus: ReviewStatus;
  scopeNote: string;
}

export interface Flashcard extends FlashFact {
  id: string;
  lessonId: string;
  subject: string;
}

export interface PracticeQuestion extends Omit<QuestionSeed, 'type'> {
  id: string;
  lessonId: string;
  subject: string;
  type: QuestionType;
  orderedItems?: string[];
  correctOrder?: number[];
  matrixRows?: Array<{ label: string; options: string[]; correct: number }>;
  matchingPairs?: Array<{ left: string; right: string }>;
  bowTie?: {
    conditions: string[];
    actions: string[];
    parameters: string[];
    correctCondition: number;
    correctActions: number[];
    correctParameters: number[];
  };
  highlightText?: string;
  highlightAnswers?: string[];
}

export interface DosageProblem {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  prompt: string;
  ordered: string;
  available: string;
  answer: number;
  unit: string;
  tolerance: number;
  steps: string[];
  formula: string;
  safetyNote: string;
}

export interface ClinicalSkill {
  id: string;
  title: string;
  category: string;
  minutes: number;
  supplies: string[];
  preparation: string[];
  steps: string[];
  safetyCheckpoints: string[];
  commonMistakes: string[];
  documentationExample: string;
  patientTeaching: string[];
  source: SourceLink;
}

export interface QuickSheet {
  id: string;
  title: string;
  category: string;
  description: string;
  sections: Array<{ heading: string; points: string[] }>;
  accent: string;
  reviewedDate: string;
  source: SourceLink;
  downloadPath?: string;
}

export interface StudyPlanTemplate {
  id: string;
  title: string;
  days: number;
  description: string;
  dailyMinutes: number;
  focus: string[];
  cadence: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  setting: string;
  client: string;
  unfolding: Array<{
    stage: string;
    update: string;
    question: string;
    choices: string[];
    correct: number[];
    rationale: string;
  }>;
}

