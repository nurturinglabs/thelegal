'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Target, Clock, PenTool, FileText, Newspaper, BarChart3, Award, Flame } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import StreakCard from '@/components/gamification/StreakCard';
import AchievementsGrid from '@/components/gamification/AchievementsGrid';
import AchievementNotification from '@/components/gamification/AchievementNotification';
import { useStreak } from '@/hooks/useStreak';
import { useAchievements } from '@/hooks/useAchievements';
import { STORAGE_KEYS, CLAT_SECTIONS } from '@/utils/constants';
import testsData from '@/data/tests.json';
import questionsData from '@/data/questions.json';
import { TestsData, QuestionsData, TestAttempt } from '@/types';

const tests: TestsData = testsData as TestsData;
const questions: QuestionsData = questionsData as QuestionsData;

interface DashboardStats {
  questionsSolved: number;
  accuracy: number;
  streak: number;
  studyTimeMinutes: number;
  todayQuestions: number;
  sectionStats: Record<string, { solved: number; correct: number }>;
}

export default function DashboardClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    questionsSolved: 0,
    accuracy: 0,
    streak: 0,
    studyTimeMinutes: 0,
    todayQuestions: 0,
    sectionStats: {},
  });

  // Gamification hooks
  const { streakData, stats: streakStats, getLevel, isLoaded: streakLoaded } = useStreak();
  const { achievements, checkAchievements, newlyUnlocked, dismissNotification, unlockedCount, totalCount } = useAchievements();

  useEffect(() => {
    // Initialize section stats
    const sectionStats: Record<string, { solved: number; correct: number }> = {};
    CLAT_SECTIONS.forEach((section) => {
      sectionStats[section] = { solved: 0, correct: 0 };
    });

    let totalQuestions = 0;
    let totalCorrect = 0;
    let studyTimeMinutes = 0;

    // Get test attempts
    const testAttemptsData = localStorage.getItem(STORAGE_KEYS.TEST_ATTEMPTS);
    if (testAttemptsData) {
      const { attempts } = JSON.parse(testAttemptsData);
      (attempts || []).forEach((attempt: TestAttempt) => {
        const test = tests.tests.find((t) => t.id === attempt.testId);
        if (test) {
          studyTimeMinutes += test.duration;
        }

        Object.entries(attempt.answers).forEach(([questionId, selectedAnswer]) => {
          const question = questions.questions.find((q) => q.id === questionId);
          if (question) {
            totalQuestions++;
            if (sectionStats[question.section]) {
              sectionStats[question.section].solved++;
            }
            if (selectedAnswer === question.correctAnswer) {
              totalCorrect++;
              if (sectionStats[question.section]) {
                sectionStats[question.section].correct++;
              }
            }
          }
        });
      });
    }

    // Get CA quiz attempts
    const caQuizData = localStorage.getItem(STORAGE_KEYS.CA_QUIZ_ATTEMPTS);
    if (caQuizData) {
      const { attempts } = JSON.parse(caQuizData);
      (attempts || []).forEach((attempt: { score: number; total: number }) => {
        totalQuestions += attempt.total;
        totalCorrect += attempt.score;
        if (sectionStats['Current Affairs']) {
          sectionStats['Current Affairs'].solved += attempt.total;
          sectionStats['Current Affairs'].correct += attempt.score;
        }
      });
    }

    // Get practice sessions
    const practiceData = localStorage.getItem(STORAGE_KEYS.PRACTICE_SESSIONS);
    if (practiceData) {
      const data = JSON.parse(practiceData);
      Object.entries(data.topicStats || {}).forEach(([topicKey, topicStats]) => {
        const typedStats = topicStats as { attempted: number; correct: number };
        totalQuestions += typedStats.attempted;
        totalCorrect += typedStats.correct;

        // Extract section from topicKey
        const section = topicKey.split('-')[0];
        if (sectionStats[section]) {
          sectionStats[section].solved += typedStats.attempted;
          sectionStats[section].correct += typedStats.correct;
        }
      });
    }

    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    // Calculate streak (simplified)
    const streak = totalQuestions > 0 ? Math.min(7, Math.ceil(totalQuestions / 10)) : 0;

    setStats({
      questionsSolved: totalQuestions,
      accuracy,
      streak,
      studyTimeMinutes,
      todayQuestions: totalQuestions, // Simplified - in real app would filter by today's date
      sectionStats,
    });
    setIsLoading(false);
  }, []);

  // Check achievements when stats are loaded
  useEffect(() => {
    if (!isLoading && streakLoaded) {
      checkAchievements({
        currentStreak: streakData.currentStreak,
        articlesRead: streakStats.articlesRead,
        questionsTotal: stats.questionsSolved,
        quizzesTaken: streakStats.quizzesTaken,
        testsCompleted: streakStats.testsCompleted,
        totalDaysActive: streakData.totalDaysActive,
      });
    }
  }, [isLoading, streakLoaded, streakData, streakStats, stats.questionsSolved, checkAchievements]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const level = getLevel();

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Achievement Notification */}
      <AchievementNotification
        achievement={newlyUnlocked}
        onDismiss={dismissNotification}
      />

      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-textPrimary">Welcome back, Guest!</h1>
        <p className="text-textSecondary">Track your CLAT preparation progress and stay on top of your goals.</p>
      </div>

      {/* Streak & XP Card */}
      {streakLoaded && (
        <StreakCard
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
          weeklyActivity={streakData.weeklyActivity}
          totalXP={streakStats.totalXP}
          level={level}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered" className="hover:border-primary transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-textMuted mb-1">Questions Solved</p>
              <p className="text-2xl font-bold text-textPrimary">{stats.questionsSolved}</p>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp size={14} />
                {stats.questionsSolved > 0 ? 'Keep it up!' : 'Start practicing'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="hover:border-accent transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-textMuted mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-textPrimary">{stats.accuracy.toFixed(1)}%</p>
              <p className="text-xs text-textMuted mt-1">
                {stats.accuracy >= 70 ? 'Excellent!' : stats.accuracy >= 50 ? 'Good progress' : 'Keep going!'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Target size={20} className="text-accent" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="hover:border-warning transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-textMuted mb-1">Current Streak</p>
              <p className="text-2xl font-bold text-textPrimary">{stats.streak} days</p>
              <p className="text-xs text-textMuted mt-1">
                {stats.streak > 0 ? 'On fire!' : 'Build your streak'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Flame size={20} className="text-warning" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="hover:border-primary transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-textMuted mb-1">Study Time</p>
              <p className="text-2xl font-bold text-textPrimary">{formatTime(stats.studyTimeMinutes)}</p>
              <p className="text-xs text-textMuted mt-1">Total</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock size={20} className="text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Goals */}
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-textPrimary mb-1">Daily Goals</h2>
          <p className="text-sm text-textMuted">Stay consistent with your preparation</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-textSecondary">Questions</span>
              <span className="text-sm font-bold text-textPrimary">{Math.min(stats.todayQuestions, 50)} / 50</span>
            </div>
            <Progress value={Math.min(stats.todayQuestions, 50)} max={50} color="primary" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-textSecondary">Study Time (minutes)</span>
              <span className="text-sm font-bold text-textPrimary">{Math.min(stats.studyTimeMinutes, 120)} / 120</span>
            </div>
            <Progress value={Math.min(stats.studyTimeMinutes, 120)} max={120} color="primary" />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-textPrimary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/practice">
            <Button variant="outline" fullWidth icon={<PenTool size={18} />}>
              Start Practice
            </Button>
          </Link>
          <Link href="/tests">
            <Button variant="outline" fullWidth icon={<FileText size={18} />}>
              Take Mock Test
            </Button>
          </Link>
          <Link href="/current-affairs">
            <Button variant="outline" fullWidth icon={<Newspaper size={18} />}>
              Read Current Affairs
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline" fullWidth icon={<BarChart3 size={18} />}>
              View Analytics
            </Button>
          </Link>
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-textPrimary">Achievements</h2>
            <p className="text-sm text-textMuted">{unlockedCount} of {totalCount} unlocked</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
            <Award size={20} className="text-warning" />
          </div>
        </div>
        <AchievementsGrid achievements={achievements} compact />
      </Card>

      {/* CLAT Sections */}
      <Card>
        <h2 className="text-xl font-bold text-textPrimary mb-4">CLAT Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLAT_SECTIONS.map((section) => {
            const sectionData = stats.sectionStats[section] || { solved: 0, correct: 0 };
            const sectionAccuracy = sectionData.solved > 0
              ? (sectionData.correct / sectionData.solved) * 100
              : 0;

            return (
              <Link
                key={section}
                href={`/practice?section=${encodeURIComponent(section)}`}
                className="p-4 border border-border rounded-lg hover:border-primary transition-colors block"
              >
                <h3 className="font-semibold text-textPrimary mb-2">{section}</h3>
                <p className="text-xs text-textMuted mb-3">{sectionData.solved} questions solved</p>
                <div className="flex items-center gap-2">
                  <Progress value={sectionAccuracy} max={100} size="sm" color="primary" />
                  <Badge
                    variant={sectionAccuracy >= 70 ? 'success' : sectionAccuracy >= 50 ? 'warning' : 'neutral'}
                    size="sm"
                  >
                    {sectionAccuracy.toFixed(0)}%
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
