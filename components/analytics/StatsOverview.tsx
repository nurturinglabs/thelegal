'use client';

import { Target, CheckCircle2, XCircle, Clock, TrendingUp, Award } from 'lucide-react';
import Card from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface StatsOverviewProps {
  totalAttempts: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageAccuracy: number;
  totalTimeSpent: number; // in minutes
  bestScore: number;
  currentStreak: number;
}

export default function StatsOverview({
  totalAttempts,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  averageAccuracy,
  totalTimeSpent,
  bestScore,
  currentStreak,
}: StatsOverviewProps) {
  const stats = [
    {
      label: 'Tests Taken',
      value: totalAttempts,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Questions Attempted',
      value: totalQuestions,
      icon: CheckCircle2,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Correct Answers',
      value: correctAnswers,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Incorrect Answers',
      value: incorrectAnswers,
      icon: XCircle,
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    {
      label: 'Average Accuracy',
      value: `${averageAccuracy.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Study Time',
      value: `${Math.floor(totalTimeSpent / 60)}h ${totalTimeSpent % 60}m`,
      icon: Clock,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'Best Score',
      value: `${bestScore}%`,
      icon: Award,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg', stat.bgColor)}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-textPrimary">{stat.value}</p>
              <p className="text-xs text-textMuted">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
