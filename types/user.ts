import { CLATSection } from '@/utils/constants';

export interface UserStats {
  totalStudyTime: number;
  questionsAttempted: number;
  questionsCorrect: number;
  testsCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

export interface SectionProgress {
  questionsAttempted: number;
  accuracy: number;
  averageTime: number;
  weakTopics: string[];
}

export interface ModuleProgress {
  completed: boolean;
  lessonsCompleted: string[];
  progress: number;
}

export interface DailyGoals {
  questionsTarget: number;
  questionsCompleted: number;
  studyTimeTarget: number;
  studyTimeCompleted: number;
}

export interface WeeklyGoals {
  questionsTarget: number;
  questionsCompleted: number;
  testsTarget: number;
  testsCompleted: number;
}

export interface UserProgress {
  userId: string;
  stats: UserStats;
  sectionProgress: Record<CLATSection, SectionProgress>;
  moduleProgress: Record<string, ModuleProgress>;
  goals: {
    daily: DailyGoals;
    weekly: WeeklyGoals;
  };
  lastUpdated: string;
}

export interface Bookmarks {
  articles: string[];
  questions: string[];
  lastUpdated: string;
}

export interface PracticeSession {
  sessionId: string;
  topic: string;
  section: CLATSection;
  date: string;
  questionsAttempted: number;
  questionsCorrect: number;
  totalTime: number;
  questionDetails: {
    questionId: string;
    userAnswer: number;
    correct: boolean;
    timeTaken: number;
  }[];
}

export interface PracticeSessionsData {
  sessions: PracticeSession[];
}
