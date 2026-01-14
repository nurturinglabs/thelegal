'use client';

import { Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AnswerOptionsProps {
  options: string[];
  selectedOption: number | null;
  correctAnswer?: number; // Only shown after submission
  showResult?: boolean;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export default function AnswerOptions({
  options,
  selectedOption,
  correctAnswer,
  showResult = false,
  onSelect,
  disabled = false,
}: AnswerOptionsProps) {
  const getOptionStyles = (index: number) => {
    const isSelected = selectedOption === index;
    const isCorrect = correctAnswer === index;
    const isWrong = showResult && isSelected && !isCorrect;

    if (showResult) {
      if (isCorrect) {
        return 'bg-success/10 border-success text-success';
      }
      if (isWrong) {
        return 'bg-error/10 border-error text-error';
      }
      if (isSelected) {
        return 'bg-primary/10 border-primary';
      }
    } else if (isSelected) {
      return 'bg-primary/10 border-primary';
    }

    return 'bg-surface border-border hover:border-primary/50 hover:bg-primary/5';
  };

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedOption === index;
        const isCorrect = correctAnswer === index;
        const isWrong = showResult && isSelected && !isCorrect;

        return (
          <button
            key={index}
            onClick={() => !disabled && onSelect(index)}
            disabled={disabled}
            className={cn(
              'w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-200 text-left',
              getOptionStyles(index),
              disabled && !showResult && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Option Label */}
            <span
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm',
                showResult && isCorrect
                  ? 'bg-success text-white'
                  : showResult && isWrong
                  ? 'bg-error text-white'
                  : isSelected
                  ? 'bg-primary text-white'
                  : 'bg-surfaceLight text-textSecondary'
              )}
            >
              {showResult && isCorrect ? (
                <Check size={16} />
              ) : showResult && isWrong ? (
                <X size={16} />
              ) : (
                getOptionLabel(index)
              )}
            </span>

            {/* Option Text */}
            <span
              className={cn(
                'flex-1 pt-1',
                showResult && isCorrect
                  ? 'text-success font-medium'
                  : showResult && isWrong
                  ? 'text-error'
                  : isSelected
                  ? 'text-textPrimary font-medium'
                  : 'text-textSecondary'
              )}
            >
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
