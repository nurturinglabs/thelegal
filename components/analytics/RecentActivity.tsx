'use client';

import { FileText, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'test' | 'practice' | 'quiz';
  title: string;
  score: number;
  totalMarks: number;
  date: string;
  duration?: number; // in minutes
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'test':
        return <FileText size={16} className="text-primary" />;
      case 'practice':
        return <CheckCircle2 size={16} className="text-success" />;
      case 'quiz':
        return <TrendingUp size={16} className="text-warning" />;
    }
  };

  const getActivityBadge = (type: Activity['type']) => {
    switch (type) {
      case 'test':
        return <Badge variant="info" size="sm">Test</Badge>;
      case 'practice':
        return <Badge variant="success" size="sm">Practice</Badge>;
      case 'quiz':
        return <Badge variant="warning" size="sm">Quiz</Badge>;
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-textPrimary mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8 text-textMuted">
          <Clock size={32} className="mx-auto mb-3 opacity-50" />
          <p>No recent activity.</p>
          <p className="text-sm mt-1">Start a test or practice session to see your activity here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-textPrimary mb-4">
        Recent Activity
      </h3>

      <div className="space-y-3">
        {activities.slice(0, 10).map((activity) => {
          const percentage = (activity.score / activity.totalMarks) * 100;
          const formattedDate = format(new Date(activity.date), 'MMM d, yyyy');

          return (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg bg-surfaceLight border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-textPrimary line-clamp-1">
                      {activity.title}
                    </p>
                    {getActivityBadge(activity.type)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-textMuted">
                    <span>{formattedDate}</span>
                    {activity.duration && (
                      <>
                        <span>•</span>
                        <span>{activity.duration} min</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-textPrimary">
                  {activity.score.toFixed(1)}/{activity.totalMarks}
                </p>
                <p
                  className={`text-xs ${
                    percentage >= 70
                      ? 'text-success'
                      : percentage >= 50
                      ? 'text-warning'
                      : 'text-error'
                  }`}
                >
                  {percentage.toFixed(0)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
