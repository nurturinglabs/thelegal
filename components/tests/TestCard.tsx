import Link from 'next/link';
import { Clock, FileText, Award, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Test } from '@/types';

interface TestCardProps {
  test: Test;
  attempted?: boolean;
  lastScore?: number;
}

export default function TestCard({ test, attempted, lastScore }: TestCardProps) {
  const typeLabels = {
    full_length: 'Full Length',
    sectional: 'Sectional',
    previous_year: 'Previous Year',
  };

  const typeColors = {
    full_length: 'info',
    sectional: 'success',
    previous_year: 'warning',
  } as const;

  const difficultyColors = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  } as const;

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={typeColors[test.type]} size="sm">
              {typeLabels[test.type]}
            </Badge>
            <Badge variant={difficultyColors[test.difficulty]} size="sm">
              {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
            </Badge>
          </div>
          {attempted && (
            <Badge variant="neutral" size="sm">
              Attempted
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-textPrimary mb-3">
          {test.title}
        </h3>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-textMuted mb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{test.duration} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText size={16} />
            <span>{test.totalQuestions} questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award size={16} />
            <span>{test.totalMarks} marks</span>
          </div>
        </div>

        {/* Sections */}
        <div className="mb-4 flex-1">
          <p className="text-xs text-textMuted mb-2">Sections:</p>
          <div className="flex flex-wrap gap-1.5">
            {test.sections.map((section) => (
              <span
                key={section.name}
                className="text-xs px-2 py-0.5 rounded bg-surfaceLight text-textSecondary"
              >
                {section.name.split(' ')[0]} ({section.questions})
              </span>
            ))}
          </div>
        </div>

        {/* Last Score (if attempted) */}
        {attempted && lastScore !== undefined && (
          <div className="mb-4 p-3 rounded-lg bg-surfaceLight border border-border">
            <p className="text-xs text-textMuted mb-1">Last Score</p>
            <p className="text-lg font-semibold text-textPrimary">
              {lastScore}/{test.totalMarks}
              <span className="text-sm font-normal text-textMuted ml-2">
                ({Math.round((lastScore / test.totalMarks) * 100)}%)
              </span>
            </p>
          </div>
        )}

        {/* CTA */}
        <Link href={`/tests/${test.id}`}>
          <Button
            variant={attempted ? 'outline' : 'primary'}
            fullWidth
            iconPosition="right"
            icon={<ChevronRight size={18} />}
          >
            {attempted ? 'Reattempt Test' : 'Start Test'}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
