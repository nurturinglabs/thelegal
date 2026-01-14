'use client';

import { ChevronLeft, ChevronRight, Check, SkipForward } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  hasSelectedAnswer: boolean;
  showResult: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

export default function QuestionNavigation({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  hasSelectedAnswer,
  showResult,
  onPrevious,
  onNext,
  onSubmit,
  onSkip,
  onFinish,
}: QuestionNavigationProps) {
  const isLastQuestion = currentQuestion === totalQuestions;
  const isFirstQuestion = currentQuestion === 1;

  return (
    <div className="space-y-4">
      {/* Question Palette */}
      <div className="p-4 bg-surface rounded-lg border border-border">
        <p className="text-sm text-textMuted mb-3">Question Palette</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
            const isAnswered = answeredQuestions.has(num - 1);
            const isCurrent = num === currentQuestion;

            return (
              <button
                key={num}
                className={cn(
                  'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200',
                  isCurrent
                    ? 'bg-primary text-white'
                    : isAnswered
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-surfaceLight text-textSecondary hover:bg-primary/10'
                )}
              >
                {num}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-textMuted">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-success/20 border border-success/30" />
            <span>Answered ({answeredQuestions.size})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-surfaceLight" />
            <span>Unanswered ({totalQuestions - answeredQuestions.size})</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          icon={<ChevronLeft size={18} />}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {!showResult ? (
            <>
              <Button
                variant="ghost"
                size="md"
                onClick={onSkip}
                icon={<SkipForward size={18} />}
              >
                Skip
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={onSubmit}
                disabled={!hasSelectedAnswer}
                icon={<Check size={18} />}
              >
                Check
              </Button>
            </>
          ) : isLastQuestion ? (
            <Button
              variant="primary"
              size="md"
              onClick={onFinish}
            >
              Finish Practice
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={onNext}
              icon={<ChevronRight size={18} />}
              iconPosition="right"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
