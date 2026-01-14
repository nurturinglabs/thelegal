'use client';

import { useEffect, useState } from 'react';
import { BarChart3, RefreshCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import StatsOverview from '@/components/analytics/StatsOverview';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import SectionScores from '@/components/analytics/SectionScores';
import WeakAreas from '@/components/analytics/WeakAreas';
import RecentActivity from '@/components/analytics/RecentActivity';
import { STORAGE_KEYS, CLAT_SECTIONS } from '@/utils/constants';
import testsData from '@/data/tests.json';
import questionsData from '@/data/questions.json';
import { TestsData, QuestionsData, TestAttempt } from '@/types';

const tests: TestsData = testsData as TestsData;
const questions: QuestionsData = questionsData as QuestionsData;

interface AnalyticsData {
  totalAttempts: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  bestScore: number;
  currentStreak: number;
  performanceData: { date: string; accuracy: number; score: number }[];
  sectionScores: { section: string; accuracy: number; attempted: number; correct: number }[];
  weakAreas: { topic: string; section: string; accuracy: number; attempted: number }[];
  recentActivity: {
    id: string;
    type: 'test' | 'practice' | 'quiz';
    title: string;
    score: number;
    totalMarks: number;
    date: string;
    duration?: number;
  }[];
}

export default function AnalyticsClient() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateAnalytics = () => {
    setLoading(true);

    // Get test attempts from localStorage
    const testAttemptsData = localStorage.getItem(STORAGE_KEYS.TEST_ATTEMPTS);
    const testAttempts: TestAttempt[] = testAttemptsData
      ? JSON.parse(testAttemptsData).attempts || []
      : [];

    // Get CA quiz attempts
    const caQuizData = localStorage.getItem(STORAGE_KEYS.CA_QUIZ_ATTEMPTS);
    const caQuizAttempts = caQuizData ? JSON.parse(caQuizData).attempts || [] : [];

    // Get practice sessions
    const practiceData = localStorage.getItem(STORAGE_KEYS.PRACTICE_SESSIONS);
    const practiceSessions: {
      topicStats: Record<string, { attempted: number; correct: number }>;
      sessions: { topicId: string; date: string; correct: number; total: number }[];
    } = practiceData
      ? JSON.parse(practiceData)
      : { topicStats: {}, sessions: [] };

    // Calculate basic stats
    const totalAttempts = testAttempts.length + caQuizAttempts.length + practiceSessions.sessions.length;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let totalTimeSpent = 0;
    let bestScorePercentage = 0;

    // Section-wise tracking
    const sectionStats: Record<string, { attempted: number; correct: number }> = {};
    CLAT_SECTIONS.forEach((section) => {
      sectionStats[section] = { attempted: 0, correct: 0 };
    });

    // Topic-wise tracking
    const topicStats: Record<string, { section: string; attempted: number; correct: number }> = {};

    // Process test attempts
    testAttempts.forEach((attempt) => {
      const test = tests.tests.find((t) => t.id === attempt.testId);
      if (!test) return;

      const answeredCount = Object.keys(attempt.answers).length;
      totalQuestions += answeredCount;

      // Calculate correct/incorrect from answers
      Object.entries(attempt.answers).forEach(([questionId, selectedAnswer]) => {
        const question = questions.questions.find((q) => q.id === questionId);
        if (question) {
          // Update section stats
          if (sectionStats[question.section]) {
            sectionStats[question.section].attempted++;
          }

          // Update topic stats
          const topicKey = `${question.section}-${question.topic}`;
          if (!topicStats[topicKey]) {
            topicStats[topicKey] = { section: question.section, attempted: 0, correct: 0 };
          }
          topicStats[topicKey].attempted++;

          if (selectedAnswer === question.correctAnswer) {
            correctAnswers++;
            if (sectionStats[question.section]) {
              sectionStats[question.section].correct++;
            }
            topicStats[topicKey].correct++;
          } else {
            incorrectAnswers++;
          }
        }
      });

      // Track best score
      const scorePercentage = test.totalMarks > 0 ? (attempt.score / test.totalMarks) * 100 : 0;
      if (scorePercentage > bestScorePercentage) {
        bestScorePercentage = scorePercentage;
      }

      // Estimate time spent (test duration)
      totalTimeSpent += test.duration;
    });

    // Process CA quiz attempts
    caQuizAttempts.forEach((attempt: { score: number; total: number }) => {
      totalQuestions += attempt.total;
      correctAnswers += attempt.score;
      incorrectAnswers += attempt.total - attempt.score;

      if (sectionStats['Current Affairs']) {
        sectionStats['Current Affairs'].attempted += attempt.total;
        sectionStats['Current Affairs'].correct += attempt.score;
      }
    });

    // Process practice sessions
    Object.entries(practiceSessions.topicStats).forEach(([topicKey, stats]) => {
      totalQuestions += stats.attempted;
      correctAnswers += stats.correct;
      incorrectAnswers += stats.attempted - stats.correct;

      // Extract section from topicKey (format: "Section-Topic")
      const section = topicKey.split('-')[0];
      if (sectionStats[section]) {
        sectionStats[section].attempted += stats.attempted;
        sectionStats[section].correct += stats.correct;
      }

      // Update topic stats
      if (!topicStats[topicKey]) {
        topicStats[topicKey] = { section, attempted: 0, correct: 0 };
      }
      topicStats[topicKey].attempted += stats.attempted;
      topicStats[topicKey].correct += stats.correct;
    });

    // Calculate averages
    const averageAccuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Prepare performance chart data (last 7 attempts)
    const performanceData = testAttempts
      .slice(-7)
      .map((attempt) => {
        const test = tests.tests.find((t) => t.id === attempt.testId);
        return {
          date: new Date(attempt.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          accuracy: attempt.accuracy,
          score: test ? (attempt.score / test.totalMarks) * 100 : 0,
        };
      });

    // Prepare section scores
    const sectionScores = CLAT_SECTIONS.map((section) => ({
      section,
      accuracy:
        sectionStats[section].attempted > 0
          ? (sectionStats[section].correct / sectionStats[section].attempted) * 100
          : 0,
      attempted: sectionStats[section].attempted,
      correct: sectionStats[section].correct,
    }));

    // Find weak areas (topics with accuracy < 60%)
    const weakAreas = Object.entries(topicStats)
      .filter(([, stats]) => stats.attempted >= 2) // At least 2 attempts
      .map(([key, stats]) => ({
        topic: key.split('-')[1],
        section: stats.section,
        accuracy: (stats.correct / stats.attempted) * 100,
        attempted: stats.attempted,
      }))
      .filter((area) => area.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy);

    // Prepare recent activity (combine tests and practice sessions)
    const testActivities = testAttempts.map((attempt) => {
      const test = tests.tests.find((t) => t.id === attempt.testId);
      return {
        id: attempt.attemptId,
        type: 'test' as const,
        title: test?.title || 'Unknown Test',
        score: attempt.score,
        totalMarks: test?.totalMarks || 0,
        date: attempt.endTime,
        duration: test?.duration,
      };
    });

    const practiceActivities = practiceSessions.sessions.map((session, index) => {
      const [, ...topicParts] = session.topicId.split('-');
      const topic = topicParts.join('-');
      return {
        id: `practice-${index}`,
        type: 'practice' as const,
        title: `${topic} Practice`,
        score: session.correct,
        totalMarks: session.total,
        date: session.date,
      };
    });

    const recentActivity = [...testActivities, ...practiceActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    // Calculate streak (simplified - just count consecutive days with activity)
    const currentStreak = Math.min(testAttempts.length, 7); // Simplified

    setAnalytics({
      totalAttempts,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      averageAccuracy,
      totalTimeSpent,
      bestScore: bestScorePercentage,
      currentStreak,
      performanceData,
      sectionScores,
      weakAreas,
      recentActivity,
    });

    setLoading(false);
  };

  useEffect(() => {
    calculateAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-surfaceLight rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-surfaceLight rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-surfaceLight rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Analytics</h1>
            <p className="text-textSecondary">Track your CLAT preparation progress</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<RefreshCcw size={16} />}
          onClick={calculateAnalytics}
        >
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <StatsOverview
          totalAttempts={analytics.totalAttempts}
          totalQuestions={analytics.totalQuestions}
          correctAnswers={analytics.correctAnswers}
          incorrectAnswers={analytics.incorrectAnswers}
          averageAccuracy={analytics.averageAccuracy}
          totalTimeSpent={analytics.totalTimeSpent}
          bestScore={analytics.bestScore}
          currentStreak={analytics.currentStreak}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PerformanceChart data={analytics.performanceData} />
        <SectionScores data={analytics.sectionScores} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeakAreas areas={analytics.weakAreas} />
        <RecentActivity activities={analytics.recentActivity} />
      </div>

      {/* Empty State Message */}
      {analytics.totalAttempts === 0 && (
        <div className="mt-8 p-8 rounded-lg bg-primary/5 border border-primary/20 text-center">
          <BarChart3 size={48} className="text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-textPrimary mb-2">
            Start Your CLAT Journey
          </h3>
          <p className="text-textSecondary mb-4 max-w-md mx-auto">
            Take tests and practice sessions to see your performance analytics here.
            Track your progress, identify weak areas, and improve your scores.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/tests">
              <Button variant="primary">Take a Test</Button>
            </a>
            <a href="/practice">
              <Button variant="outline">Practice Questions</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
