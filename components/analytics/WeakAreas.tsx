'use client';

import { AlertTriangle, TrendingDown, BookOpen } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface WeakArea {
  topic: string;
  section: string;
  accuracy: number;
  attempted: number;
}

interface WeakAreasProps {
  areas: WeakArea[];
}

export default function WeakAreas({ areas }: WeakAreasProps) {
  if (areas.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-textPrimary mb-4">
          Areas to Improve
        </h3>
        <div className="text-center py-8 text-textMuted">
          <TrendingDown size={32} className="mx-auto mb-3 opacity-50" />
          <p>Great job! No weak areas identified yet.</p>
          <p className="text-sm mt-1">Keep practicing to get personalized recommendations.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-textPrimary">
          Areas to Improve
        </h3>
        <Badge variant="warning" size="sm">
          {areas.length} topics
        </Badge>
      </div>

      <div className="space-y-3">
        {areas.slice(0, 5).map((area) => (
          <div
            key={`${area.section}-${area.topic}`}
            className="flex items-center justify-between p-3 rounded-lg bg-surfaceLight border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertTriangle size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-textPrimary">{area.topic}</p>
                <p className="text-xs text-textMuted">{area.section}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-error">{area.accuracy.toFixed(0)}%</p>
              <p className="text-xs text-textMuted">{area.attempted} attempted</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link href="/practice">
          <Button variant="outline" fullWidth icon={<BookOpen size={16} />}>
            Practice Weak Areas
          </Button>
        </Link>
      </div>
    </Card>
  );
}
