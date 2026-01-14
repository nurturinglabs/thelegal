// App-wide constants

export const APP_NAME = 'The Legal';
export const APP_TAGLINE = 'Road to the Rule of Law';

// CLAT Sections
export const CLAT_SECTIONS = [
  'Legal Reasoning',
  'Logical Reasoning',
  'English Language',
  'Quantitative Techniques',
  'Current Affairs',
] as const;

export type CLATSection = typeof CLAT_SECTIONS[number];

// Current Affairs Categories
export const CA_CATEGORIES = [
  'All',
  'Legal & Constitutional',
  'International Relations',
  'Economy & Business',
  'Environment & Climate',
  'Science & Technology',
  'Social Issues',
  'Politics & Governance',
] as const;

export type CACategory = typeof CA_CATEGORIES[number];

// Date Filters
export const DATE_FILTERS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 3 months' },
  { value: 'all', label: 'All time' },
] as const;

// Question Difficulty
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

// Test Types
export const TEST_TYPES = ['full_length', 'sectional', 'previous_year'] as const;

export type TestType = typeof TEST_TYPES[number];

// Scoring
export const MARKS_PER_QUESTION = 1;
export const NEGATIVE_MARKS = 0.25;

// Study Goals
export const DEFAULT_DAILY_QUESTIONS_TARGET = 50;
export const DEFAULT_DAILY_STUDY_TIME_TARGET = 120; // minutes
export const DEFAULT_WEEKLY_QUESTIONS_TARGET = 350;
export const DEFAULT_WEEKLY_TESTS_TARGET = 2;

// localStorage Keys
export const STORAGE_KEYS = {
  BOOKMARKS: 'vidhi_bookmarks',
  USER_PROGRESS: 'vidhi_user_progress',
  TEST_ATTEMPTS: 'vidhi_test_attempts',
  PRACTICE_SESSIONS: 'vidhi_practice_sessions',
  CA_QUIZ_ATTEMPTS: 'vidhi_ca_quiz_attempts',
} as const;

// Navigation
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Learn', href: '/learn', icon: 'BookOpen' },
  { label: 'Practice', href: '/practice', icon: 'PenTool' },
  { label: 'Tests', href: '/tests', icon: 'FileText' },
  { label: 'Current Affairs', href: '/current-affairs', icon: 'Newspaper' },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
] as const;

// Mobile Navigation (Bottom nav - 5 items)
export const MOBILE_NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'Home' },
  { label: 'Learn', href: '/learn', icon: 'BookOpen' },
  { label: 'Practice', href: '/practice', icon: 'PenTool' },
  { label: 'Tests', href: '/tests', icon: 'FileText' },
  { label: 'More', href: '/current-affairs', icon: 'Menu' },
] as const;

// Debounce delays (milliseconds)
export const SEARCH_DEBOUNCE_DELAY = 300;

// Pagination
export const ARTICLES_PER_PAGE = 12;
export const QUESTIONS_PER_PAGE = 10;
