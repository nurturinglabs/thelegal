'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import { CLAT_SECTIONS } from '@/utils/constants';

interface SectionScore {
  section: string;
  accuracy: number;
  attempted: number;
  correct: number;
}

interface SectionScoresProps {
  data: SectionScore[];
  showRadar?: boolean;
}

export default function SectionScores({ data, showRadar = true }: SectionScoresProps) {
  // Prepare data for radar chart
  const radarData = CLAT_SECTIONS.map((section) => {
    const sectionData = data.find((d) => d.section === section);
    return {
      section: section.split(' ')[0], // Shorten for display
      fullName: section,
      accuracy: sectionData?.accuracy || 0,
    };
  });

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'success';
    if (accuracy >= 60) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-textPrimary mb-4">
        Section-wise Performance
      </h3>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-textMuted">
          <p>No section data yet. Complete some tests to see your section-wise performance!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          {showRadar && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis
                    dataKey="section"
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    stroke="#71717a"
                    fontSize={10}
                    tickCount={5}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#fafafa',
                    }}
                    formatter={(value, _name, props) => [
                      `${(value as number)?.toFixed(1) ?? 0}%`,
                      (props as { payload: { fullName: string } }).payload.fullName,
                    ]}
                  />
                  <Radar
                    name="Accuracy"
                    dataKey="accuracy"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Progress Bars */}
          <div className="space-y-4">
            {CLAT_SECTIONS.map((section) => {
              const sectionData = data.find((d) => d.section === section);
              const accuracy = sectionData?.accuracy || 0;
              const attempted = sectionData?.attempted || 0;
              const correct = sectionData?.correct || 0;

              return (
                <div key={section}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-textSecondary">{section}</span>
                    <span className="text-sm font-medium text-textPrimary">
                      {accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={accuracy}
                    max={100}
                    color={getAccuracyColor(accuracy)}
                    size="sm"
                  />
                  <p className="text-xs text-textMuted mt-1">
                    {correct}/{attempted} correct
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
