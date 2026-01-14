import { CACategory } from '@/utils/constants';

export interface Article {
  id: string;
  title: string;
  category: CACategory;
  subcategory?: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  readTime: number;
  importance: 'low' | 'medium' | 'high';
  relatedArticles: string[];
  quiz?: {
    id: string;
    questions: number;
  };
}

export interface ArticlesData {
  articles: Article[];
  categories: readonly string[];
}

export interface CAQuizAttempt {
  quizId: string;
  articleId: string;
  date: string;
  score: number;
  total: number;
  answers: Record<string, number>;
}

export interface CAQuizAttemptsData {
  attempts: CAQuizAttempt[];
}
