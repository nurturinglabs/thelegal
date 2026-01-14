'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TestTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  onPauseToggle?: () => void;
  showPauseButton?: boolean;
}

export default function TestTimer({
  durationMinutes,
  onTimeUp,
  isPaused = false,
  onPauseToggle,
  showPauseButton = false,
}: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onTimeUp]);

  const isLowTime = timeLeft <= 300; // 5 minutes
  const isCriticalTime = timeLeft <= 60; // 1 minute

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-lg border',
        isCriticalTime
          ? 'bg-error/10 border-error/30 text-error animate-pulse'
          : isLowTime
          ? 'bg-warning/10 border-warning/30 text-warning'
          : 'bg-surfaceLight border-border text-textPrimary'
      )}
    >
      {isCriticalTime ? (
        <AlertTriangle size={20} className="animate-bounce" />
      ) : (
        <Clock size={20} />
      )}

      <div className="flex flex-col">
        <span className="text-xs text-textMuted">Time Remaining</span>
        <span
          className={cn(
            'font-mono text-lg font-semibold',
            isCriticalTime && 'text-error',
            isLowTime && !isCriticalTime && 'text-warning'
          )}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      {showPauseButton && onPauseToggle && (
        <button
          onClick={onPauseToggle}
          className={cn(
            'ml-2 p-2 rounded-lg transition-colors',
            isPaused
              ? 'bg-success/10 text-success hover:bg-success/20'
              : 'bg-surfaceLight text-textSecondary hover:bg-border'
          )}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      )}
    </div>
  );
}
