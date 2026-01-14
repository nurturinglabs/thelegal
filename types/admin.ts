/**
 * Admin Panel Types for Content Curation
 */

import { Article } from './currentAffairs';
import { Question } from './questions';
import { CACategory } from '@/utils/constants';

// Draft article being curated by the team
export interface ArticleDraft {
  id: string;
  status: 'discovered' | 'in_progress' | 'review' | 'published' | 'archived';

  // Source Information (from RSS or manual entry)
  sourceTitle: string;
  sourceUrl: string;
  sourceName: string; // e.g., "The Hindu", "PIB"
  sourceDate: string;
  sourceExcerpt: string;

  // Curated Content (written by your team)
  title: string;
  category: CACategory;
  subcategory: string;
  excerpt: string;
  content: string; // CLAT-focused summary and analysis
  tags: string[];
  readTime: number;
  importance: 'low' | 'medium' | 'high';

  // Quiz questions (created by your team)
  quiz?: {
    id: string;
    questions: Question[];
  };

  // Metadata
  curatedBy: string; // Team member who curated this
  reviewedBy?: string; // Team member who reviewed
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  // Notes for internal use
  internalNotes?: string;
}

// Curation workflow stages
export type CurationStatus =
  | 'discovered'    // Found via RSS feed
  | 'in_progress'   // Being written by curator
  | 'review'        // Awaiting review
  | 'published'     // Live on platform
  | 'archived';     // Removed from active content

// User roles for admin panel
export type AdminRole = 'curator' | 'reviewer' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  specialization?: CACategory[]; // Which categories they focus on
}

// Statistics for admin dashboard
export interface CurationStats {
  totalArticles: number;
  published: number;
  inProgress: number;
  inReview: number;
  discovered: number;

  // By category
  byCategory: Record<CACategory, number>;

  // By curator
  byCurator: Record<string, {
    drafted: number;
    published: number;
    avgQuality: number;
  }>;

  // Time metrics
  avgCurationTime: number; // in hours
  avgReviewTime: number;
}

// Content quality checklist
export interface QualityChecklist {
  hasTitle: boolean;
  hasExcerpt: boolean;
  hasContent: boolean;
  hasTags: boolean;
  hasCategory: boolean;
  hasQuiz: boolean;
  contentLength: number; // Should be 500-1500 words
  hasKeyPoints: boolean; // Bulleted key points
  hasCLATAnalysis: boolean; // Legal/analytical angle
  sourceAttributed: boolean;
  factChecked: boolean;
}

// Notification for reviewers
export interface ReviewNotification {
  id: string;
  articleId: string;
  articleTitle: string;
  curator: string;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

export type { Article, Question };
