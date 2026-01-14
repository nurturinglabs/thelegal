'use client';

import { BookOpen } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

interface QuestionDisplayProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  passage?: string;
  section: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  negativeMarks: number;
}

export default function QuestionDisplay({
  questionNumber,
  totalQuestions,
  question,
  passage,
  section,
  topic,
  difficulty,
  marks,
  negativeMarks,
}: QuestionDisplayProps) {
  const getDifficultyVariant = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="info" size="sm">
          Q {questionNumber}/{totalQuestions}
        </Badge>
        <Badge variant="neutral" size="sm">
          {section}
        </Badge>
        <Badge variant="neutral" size="sm">
          {topic}
        </Badge>
        <Badge variant={getDifficultyVariant(difficulty)} size="sm">
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
      </div>

      {/* Marks Info */}
      <div className="flex items-center gap-4 text-sm text-textMuted">
        <span className="text-success">+{marks} mark{marks > 1 ? 's' : ''}</span>
        <span className="text-error">-{negativeMarks} for wrong</span>
      </div>

      {/* Passage (if any) */}
      {passage && (
        <div className="p-4 bg-surfaceLight rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm text-textSecondary mb-2">
            <BookOpen size={14} />
            <span>Passage</span>
          </div>
          <p className="text-textPrimary leading-relaxed whitespace-pre-wrap">
            {passage}
          </p>
        </div>
      )}

      {/* Question */}
      <div className={cn(
        "p-4 rounded-lg",
        passage ? "bg-surface border border-border" : "bg-surfaceLight"
      )}>
        <p className="text-lg text-textPrimary leading-relaxed">
          {question}
        </p>
      </div>
    </div>
  );
}
