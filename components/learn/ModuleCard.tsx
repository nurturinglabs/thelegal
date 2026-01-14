import Link from 'next/link';
import { Clock, BookOpen, PlayCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { Module } from '@/types';
import { cn } from '@/utils/cn';

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  } as const;

  const sectionColors: Record<string, string> = {
    'Legal Reasoning': 'bg-primary/10 text-primary',
    'Logical Reasoning': 'bg-accent/10 text-accent',
    'English Language': 'bg-warning/10 text-warning',
    'Quantitative Techniques': 'bg-error/10 text-error',
    'Current Affairs': 'bg-primary/10 text-primary',
  };

  return (
    <Link href={`/learn/${module.id}`}>
      <Card variant="interactive" className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant={difficultyColors[module.difficulty]} size="sm">
            {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
          </Badge>
          <div className={cn('px-2 py-1 rounded text-xs font-medium', sectionColors[module.section] || 'bg-surfaceLight text-textMuted')}>
            {module.section}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-textPrimary mb-2 hover:text-primary transition-colors">
          {module.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-textSecondary mb-4 line-clamp-2 flex-1">
          {module.description}
        </p>

        {/* Progress */}
        {module.progress > 0 ? (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-textMuted">Progress</span>
              <span className="text-textPrimary font-medium">{module.progress}%</span>
            </div>
            <Progress value={module.progress} max={100} size="sm" color="success" />
          </div>
        ) : (
          <div className="mb-4 py-2">
            <span className="text-xs text-textMuted">Not started</span>
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-textMuted pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{module.lessons.length} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{module.estimatedTime} min</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-primary font-medium">
            <PlayCircle size={16} />
            <span>Start</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
