'use client';

import { BookOpen, ChevronRight, Target } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

interface TopicCardProps {
  section: string;
  topic: string;
  questionCount: number;
  completedCount?: number;
  accuracy?: number;
  onClick: () => void;
}

export default function TopicCard({
  section,
  topic,
  questionCount,
  completedCount = 0,
  accuracy,
  onClick,
}: TopicCardProps) {
  const progress = questionCount > 0 ? (completedCount / questionCount) * 100 : 0;

  const getSectionColor = (section: string) => {
    const colors: Record<string, string> = {
      'Legal Reasoning': 'text-primary bg-primary/10',
      'Logical Reasoning': 'text-accent bg-accent/10',
      'English Language': 'text-success bg-success/10',
      'Quantitative Techniques': 'text-warning bg-warning/10',
      'Current Affairs': 'text-info bg-info/10',
    };
    return colors[section] || 'text-textSecondary bg-surfaceLight';
  };

  return (
    <Card
      variant="interactive"
      className="group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg', getSectionColor(section))}>
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-textPrimary group-hover:text-primary transition-colors">
              {topic}
            </h3>
            <p className="text-sm text-textMuted mt-0.5">{section}</p>
          </div>
        </div>
        <ChevronRight
          size={20}
          className="text-textMuted group-hover:text-primary transition-colors"
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm text-textSecondary">
          <Target size={14} />
          <span>{questionCount} questions</span>
        </div>
        {accuracy !== undefined && accuracy > 0 && (
          <Badge
            variant={accuracy >= 70 ? 'success' : accuracy >= 50 ? 'warning' : 'error'}
            size="sm"
          >
            {accuracy.toFixed(0)}% accuracy
          </Badge>
        )}
      </div>

      {completedCount > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-textMuted mb-1">
            <span>Progress</span>
            <span>{completedCount}/{questionCount}</span>
          </div>
          <div className="h-1.5 bg-surfaceLight rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
