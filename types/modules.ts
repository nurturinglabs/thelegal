import { CLATSection, DifficultyLevel } from '@/utils/constants';

export interface Lesson {
  id: string;
  title: string;
  type: 'reading' | 'quiz';
  duration: number;
  content: string;
  completed: boolean;
  questionIds?: string[];
}

export interface Module {
  id: string;
  section: CLATSection;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedTime: number;
  thumbnail: string;
  lessons: Lesson[];
  progress: number;
}

export interface ModulesData {
  modules: Module[];
}
