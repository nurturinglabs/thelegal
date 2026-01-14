'use client';

import { Flame, Trophy, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: boolean[];
  totalXP: number;
  level: {
    level: number;
    title: string;
    nextLevelXP: number;
    progress: number;
  };
}

export default function StreakCard({
  currentStreak,
  longestStreak,
  weeklyActivity,
  totalXP,
  level,
}: StreakCardProps) {
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Calculate progress to next level
  const progressPercent = level.nextLevelXP === Infinity
    ? 100
    : Math.min((level.progress / (level.nextLevelXP - (totalXP - level.progress))) * 100, 100);

  return (
    <Card className="bg-gradient-to-br from-surface to-surfaceLight border-border/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Streak Section */}
        <div className="flex items-center gap-4">
          <div className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl',
            currentStreak > 0
              ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
              : 'bg-surfaceLight'
          )}>
            <Flame
              size={32}
              className={currentStreak > 0 ? 'text-orange-500' : 'text-textMuted'}
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-textPrimary">{currentStreak}</span>
              <span className="text-sm text-textMuted">day streak</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-textMuted mt-0.5">
              <Trophy size={14} className="text-warning" />
              <span>Best: {longestStreak} days</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="flex flex-col items-center sm:items-end gap-2">
          <p className="text-xs text-textMuted">This Week</p>
          <div className="flex gap-1.5">
            {weeklyActivity.map((active, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all',
                    active
                      ? 'bg-primary text-white'
                      : index === 6
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'bg-surfaceLight text-textMuted'
                  )}
                >
                  {active && <Flame size={14} />}
                  {!active && dayLabels[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* XP and Level */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Zap size={16} className="text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-textPrimary">Level {level.level}</span>
              <span className="text-xs text-textMuted ml-1.5">{level.title}</span>
            </div>
          </div>
          <span className="text-sm font-medium text-primary">{totalXP} XP</span>
        </div>
        <div className="h-2 bg-surfaceLight rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {level.nextLevelXP !== Infinity && (
          <p className="text-xs text-textMuted mt-1 text-right">
            {level.nextLevelXP - totalXP} XP to Level {level.level + 1}
          </p>
        )}
      </div>
    </Card>
  );
}
