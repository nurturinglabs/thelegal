import { CLATSection, DifficultyLevel, TestType } from '@/utils/constants';

export interface Question {
  id: string;
  section: CLATSection;
  topic: string;
  difficulty: DifficultyLevel;
  question: string;
  passage?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  marks: number;
  negativeMarks: number;
  timeLimit?: number;
  reference?: string;
}

export interface QuestionsData {
  questions: Question[];
  topics: Record<CLATSection, string[]>;
}

export interface Test {
  id: string;
  title: string;
  type: TestType;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  sections: TestSection[];
  instructions: string[];
  difficulty: DifficultyLevel;
  published: boolean;
}

export interface TestSection {
  name: CLATSection;
  questions: number;
  questionIds: string[];
}

export interface TestsData {
  tests: Test[];
}

export interface TestAttempt {
  attemptId: string;
  testId: string;
  startTime: string;
  endTime: string;
  answers: Record<string, number>;
  score: number;
  accuracy: number;
  sectionScores: Record<string, number>;
  timeSpent: Record<string, number>;
}

export interface TestAttemptsData {
  attempts: TestAttempt[];
}
