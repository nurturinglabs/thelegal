'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji
  category: 'streak' | 'learning' | 'practice' | 'test' | 'special';
  requirement: number;
  xpReward: number;
}

export interface UserAchievement extends Achievement {
  unlockedAt: string | null;
  progress: number;
}

const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  { id: 'streak-3', title: 'Getting Started', description: 'Maintain a 3-day streak', icon: '🔥', category: 'streak', requirement: 3, xpReward: 50 },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', category: 'streak', requirement: 7, xpReward: 100 },
  { id: 'streak-14', title: 'Fortnight Fighter', description: 'Maintain a 14-day streak', icon: '🔥', category: 'streak', requirement: 14, xpReward: 200 },
  { id: 'streak-30', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '🔥', category: 'streak', requirement: 30, xpReward: 500 },

  // Learning achievements
  { id: 'articles-5', title: 'Curious Reader', description: 'Read 5 articles', icon: '📰', category: 'learning', requirement: 5, xpReward: 30 },
  { id: 'articles-20', title: 'News Enthusiast', description: 'Read 20 articles', icon: '📰', category: 'learning', requirement: 20, xpReward: 100 },
  { id: 'articles-50', title: 'Current Affairs Expert', description: 'Read 50 articles', icon: '📰', category: 'learning', requirement: 50, xpReward: 250 },

  // Practice achievements
  { id: 'questions-25', title: 'First Steps', description: 'Answer 25 questions', icon: '✏️', category: 'practice', requirement: 25, xpReward: 50 },
  { id: 'questions-100', title: 'Century Club', description: 'Answer 100 questions', icon: '✏️', category: 'practice', requirement: 100, xpReward: 150 },
  { id: 'questions-500', title: 'Practice Pro', description: 'Answer 500 questions', icon: '✏️', category: 'practice', requirement: 500, xpReward: 400 },
  { id: 'questions-1000', title: 'Question Master', description: 'Answer 1000 questions', icon: '✏️', category: 'practice', requirement: 1000, xpReward: 750 },

  // Quiz achievements
  { id: 'quizzes-5', title: 'Quiz Taker', description: 'Complete 5 quizzes', icon: '🎯', category: 'practice', requirement: 5, xpReward: 50 },
  { id: 'quizzes-20', title: 'Quiz Champion', description: 'Complete 20 quizzes', icon: '🎯', category: 'practice', requirement: 20, xpReward: 150 },

  // Test achievements
  { id: 'tests-1', title: 'First Test', description: 'Complete your first mock test', icon: '📝', category: 'test', requirement: 1, xpReward: 100 },
  { id: 'tests-5', title: 'Test Veteran', description: 'Complete 5 mock tests', icon: '📝', category: 'test', requirement: 5, xpReward: 250 },
  { id: 'tests-10', title: 'Mock Master', description: 'Complete 10 mock tests', icon: '📝', category: 'test', requirement: 10, xpReward: 500 },

  // Special achievements
  { id: 'first-day', title: 'Welcome!', description: 'Start your CLAT preparation journey', icon: '🎉', category: 'special', requirement: 1, xpReward: 25 },
  { id: 'early-bird', title: 'Early Bird', description: 'Study before 7 AM', icon: '🌅', category: 'special', requirement: 1, xpReward: 50 },
  { id: 'night-owl', title: 'Night Owl', description: 'Study after 11 PM', icon: '🦉', category: 'special', requirement: 1, xpReward: 50 },
];

const STORAGE_KEY = 'vidhi_achievements';

interface AchievementProgress {
  [key: string]: {
    unlockedAt: string | null;
    progress: number;
  };
}

export function useAchievements() {
  const [progress, setProgress] = useState<AchievementProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch {
        setProgress({});
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  // Get achievements with progress
  const achievements = useMemo((): UserAchievement[] => {
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlockedAt: progress[achievement.id]?.unlockedAt || null,
      progress: progress[achievement.id]?.progress || 0,
    }));
  }, [progress]);

  // Update progress for an achievement
  const updateProgress = useCallback((achievementId: string, newProgress: number) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) return;

    setProgress((prev) => {
      const current = prev[achievementId] || { unlockedAt: null, progress: 0 };

      // Already unlocked
      if (current.unlockedAt) return prev;

      const updated = { ...current, progress: newProgress };

      // Check if achievement unlocked
      if (newProgress >= achievement.requirement) {
        updated.unlockedAt = new Date().toISOString();
        setNewlyUnlocked(achievement);
        // Auto-clear after 5 seconds
        setTimeout(() => setNewlyUnlocked(null), 5000);
      }

      return { ...prev, [achievementId]: updated };
    });
  }, []);

  // Check multiple achievements based on stats
  const checkAchievements = useCallback((stats: {
    currentStreak?: number;
    articlesRead?: number;
    questionsTotal?: number;
    quizzesTaken?: number;
    testsCompleted?: number;
    totalDaysActive?: number;
  }) => {
    // Streak achievements
    if (stats.currentStreak) {
      if (stats.currentStreak >= 3) updateProgress('streak-3', stats.currentStreak);
      if (stats.currentStreak >= 7) updateProgress('streak-7', stats.currentStreak);
      if (stats.currentStreak >= 14) updateProgress('streak-14', stats.currentStreak);
      if (stats.currentStreak >= 30) updateProgress('streak-30', stats.currentStreak);
    }

    // Articles achievements
    if (stats.articlesRead) {
      if (stats.articlesRead >= 5) updateProgress('articles-5', stats.articlesRead);
      if (stats.articlesRead >= 20) updateProgress('articles-20', stats.articlesRead);
      if (stats.articlesRead >= 50) updateProgress('articles-50', stats.articlesRead);
    }

    // Questions achievements
    if (stats.questionsTotal) {
      if (stats.questionsTotal >= 25) updateProgress('questions-25', stats.questionsTotal);
      if (stats.questionsTotal >= 100) updateProgress('questions-100', stats.questionsTotal);
      if (stats.questionsTotal >= 500) updateProgress('questions-500', stats.questionsTotal);
      if (stats.questionsTotal >= 1000) updateProgress('questions-1000', stats.questionsTotal);
    }

    // Quiz achievements
    if (stats.quizzesTaken) {
      if (stats.quizzesTaken >= 5) updateProgress('quizzes-5', stats.quizzesTaken);
      if (stats.quizzesTaken >= 20) updateProgress('quizzes-20', stats.quizzesTaken);
    }

    // Test achievements
    if (stats.testsCompleted) {
      if (stats.testsCompleted >= 1) updateProgress('tests-1', stats.testsCompleted);
      if (stats.testsCompleted >= 5) updateProgress('tests-5', stats.testsCompleted);
      if (stats.testsCompleted >= 10) updateProgress('tests-10', stats.testsCompleted);
    }

    // First day achievement
    if (stats.totalDaysActive && stats.totalDaysActive >= 1) {
      updateProgress('first-day', 1);
    }

    // Time-based achievements
    const hour = new Date().getHours();
    if (hour < 7) updateProgress('early-bird', 1);
    if (hour >= 23) updateProgress('night-owl', 1);
  }, [updateProgress]);

  // Get unlocked count
  const unlockedCount = useMemo(() => {
    return achievements.filter((a) => a.unlockedAt !== null).length;
  }, [achievements]);

  // Get total XP from achievements
  const achievementXP = useMemo(() => {
    return achievements
      .filter((a) => a.unlockedAt !== null)
      .reduce((sum, a) => sum + a.xpReward, 0);
  }, [achievements]);

  // Dismiss notification
  const dismissNotification = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  return {
    achievements,
    unlockedCount,
    totalCount: ACHIEVEMENTS.length,
    achievementXP,
    checkAchievements,
    newlyUnlocked,
    dismissNotification,
    isLoaded,
  };
}
