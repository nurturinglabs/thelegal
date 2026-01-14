'use client';

import { Lock, Check } from 'lucide-react';
import { UserAchievement } from '@/hooks/useAchievements';
import { cn } from '@/utils/cn';

interface AchievementsGridProps {
  achievements: UserAchievement[];
  compact?: boolean;
}

export default function AchievementsGrid({ achievements, compact = false }: AchievementsGridProps) {
  const categories = [
    { id: 'streak', label: 'Streak' },
    { id: 'learning', label: 'Learning' },
    { id: 'practice', label: 'Practice' },
    { id: 'test', label: 'Tests' },
    { id: 'special', label: 'Special' },
  ];

  if (compact) {
    // Show only unlocked achievements in a compact row
    const unlocked = achievements.filter((a) => a.unlockedAt);

    return (
      <div className="flex flex-wrap gap-2">
        {unlocked.slice(0, 6).map((achievement) => (
          <div
            key={achievement.id}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl"
            title={`${achievement.title}: ${achievement.description}`}
          >
            {achievement.icon}
          </div>
        ))}
        {unlocked.length > 6 && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surfaceLight text-sm font-medium text-textMuted">
            +{unlocked.length - 6}
          </div>
        )}
        {unlocked.length === 0 && (
          <p className="text-sm text-textMuted">No achievements yet. Keep studying!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryAchievements = achievements.filter((a) => a.category === category.id);
        if (categoryAchievements.length === 0) return null;

        return (
          <div key={category.id}>
            <h3 className="text-sm font-medium text-textMuted mb-3">{category.label}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categoryAchievements.map((achievement) => {
                const isUnlocked = achievement.unlockedAt !== null;
                const progress = achievement.progress / achievement.requirement;

                return (
                  <div
                    key={achievement.id}
                    className={cn(
                      'relative flex flex-col items-center rounded-xl border p-4 transition-all',
                      isUnlocked
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-surfaceLight/50'
                    )}
                  >
                    {/* Badge Icon */}
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl text-2xl mb-2',
                        isUnlocked
                          ? 'bg-primary/20'
                          : 'bg-surface text-textMuted grayscale'
                      )}
                    >
                      {isUnlocked ? (
                        achievement.icon
                      ) : (
                        <Lock size={20} />
                      )}
                    </div>

                    {/* Title */}
                    <h4 className={cn(
                      'text-sm font-medium text-center',
                      isUnlocked ? 'text-textPrimary' : 'text-textMuted'
                    )}>
                      {achievement.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-textMuted text-center mt-0.5 line-clamp-2">
                      {achievement.description}
                    </p>

                    {/* Progress or XP */}
                    {isUnlocked ? (
                      <div className="flex items-center gap-1 mt-2">
                        <Check size={12} className="text-success" />
                        <span className="text-xs text-success font-medium">
                          +{achievement.xpReward} XP
                        </span>
                      </div>
                    ) : (
                      <div className="w-full mt-2">
                        <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/50 rounded-full transition-all"
                            style={{ width: `${Math.min(progress * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-textMuted text-center mt-1">
                          {achievement.progress}/{achievement.requirement}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
