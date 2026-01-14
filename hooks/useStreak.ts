'use client';

import { useState, useEffect, useCallback } from 'react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalDaysActive: number;
  weeklyActivity: boolean[]; // Last 7 days, index 0 = 6 days ago, index 6 = today
}

interface StudyStats {
  questionsToday: number;
  questionsTotal: number;
  articlesRead: number;
  quizzesTaken: number;
  testsCompleted: number;
  totalXP: number;
}

const STORAGE_KEY = 'vidhi_streak_data';
const STATS_KEY = 'vidhi_study_stats';

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalDaysActive: 0,
  weeklyActivity: [false, false, false, false, false, false, false],
};

const defaultStats: StudyStats = {
  questionsToday: 0,
  questionsTotal: 0,
  articlesRead: 0,
  quizzesTaken: 0,
  testsCompleted: 0,
  totalXP: 0,
};

function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData);
  const [stats, setStats] = useState<StudyStats>(defaultStats);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem(STORAGE_KEY);
    const savedStats = localStorage.getItem(STATS_KEY);

    if (savedStreak) {
      try {
        const parsed = JSON.parse(savedStreak);
        setStreakData(parsed);
      } catch {
        setStreakData(defaultStreakData);
      }
    }

    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        // Reset daily questions if it's a new day
        const today = getDateString();
        if (parsed.lastQuestionDate !== today) {
          parsed.questionsToday = 0;
          parsed.lastQuestionDate = today;
        }
        setStats(parsed);
      } catch {
        setStats(defaultStats);
      }
    }

    setIsLoaded(true);
  }, []);

  // Check and update streak on load
  useEffect(() => {
    if (!isLoaded) return;

    const today = getDateString();
    const { lastActiveDate, currentStreak, longestStreak, totalDaysActive, weeklyActivity } = streakData;

    // If already active today, no need to update
    if (lastActiveDate === today) return;

    let newStreak = currentStreak;
    let newTotalDays = totalDaysActive;
    const newWeeklyActivity = [...weeklyActivity];

    if (lastActiveDate) {
      const daysDiff = getDaysDifference(lastActiveDate, today);

      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newStreak = currentStreak + 1;
        newTotalDays = totalDaysActive + 1;
      } else if (daysDiff > 1) {
        // Streak broken - reset
        newStreak = 1;
        newTotalDays = totalDaysActive + 1;
      }
    } else {
      // First time
      newStreak = 1;
      newTotalDays = 1;
    }

    // Update weekly activity - shift left and add today
    newWeeklyActivity.shift();
    newWeeklyActivity.push(true);

    const updatedData: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      lastActiveDate: today,
      totalDaysActive: newTotalDays,
      weeklyActivity: newWeeklyActivity,
    };

    setStreakData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  }, [isLoaded, streakData]);

  // Record activity (question answered, article read, etc.)
  const recordActivity = useCallback((type: 'question' | 'article' | 'quiz' | 'test', xp: number = 10) => {
    setStats((prev) => {
      const updated = { ...prev };
      updated.totalXP += xp;

      switch (type) {
        case 'question':
          updated.questionsToday += 1;
          updated.questionsTotal += 1;
          break;
        case 'article':
          updated.articlesRead += 1;
          break;
        case 'quiz':
          updated.quizzesTaken += 1;
          break;
        case 'test':
          updated.testsCompleted += 1;
          break;
      }

      localStorage.setItem(STATS_KEY, JSON.stringify({ ...updated, lastQuestionDate: getDateString() }));
      return updated;
    });
  }, []);

  // Get XP level
  const getLevel = useCallback(() => {
    const xp = stats.totalXP;
    if (xp < 100) return { level: 1, title: 'Beginner', nextLevelXP: 100, progress: xp };
    if (xp < 300) return { level: 2, title: 'Apprentice', nextLevelXP: 300, progress: xp - 100 };
    if (xp < 600) return { level: 3, title: 'Scholar', nextLevelXP: 600, progress: xp - 300 };
    if (xp < 1000) return { level: 4, title: 'Expert', nextLevelXP: 1000, progress: xp - 600 };
    if (xp < 1500) return { level: 5, title: 'Master', nextLevelXP: 1500, progress: xp - 1000 };
    return { level: 6, title: 'Grandmaster', nextLevelXP: Infinity, progress: 0 };
  }, [stats.totalXP]);

  return {
    streakData,
    stats,
    isLoaded,
    recordActivity,
    getLevel,
  };
}
