'use client';

import { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export default function AchievementNotification({
  achievement,
  onDismiss,
}: AchievementNotificationProps) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="fixed top-4 right-4 z-[60] animate-slide-in-right">
      <div className={cn(
        'flex items-center gap-4 rounded-xl border border-warning/30 bg-surface p-4 shadow-2xl',
        'min-w-[320px] max-w-[400px]'
      )}>
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-warning/20 to-orange-500/20 text-3xl">
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles size={14} className="text-warning" />
            <span className="text-xs font-medium text-warning uppercase tracking-wider">
              Achievement Unlocked!
            </span>
          </div>
          <h4 className="text-base font-semibold text-textPrimary truncate">
            {achievement.title}
          </h4>
          <p className="text-sm text-textMuted truncate">{achievement.description}</p>
          <p className="text-xs text-primary font-medium mt-1">
            +{achievement.xpReward} XP
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 text-textMuted hover:text-textPrimary transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
