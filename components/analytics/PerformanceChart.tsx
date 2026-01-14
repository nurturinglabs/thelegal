'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/components/ui/Card';

interface PerformanceDataPoint {
  date: string;
  accuracy: number;
  score: number;
}

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  title?: string;
}

export default function PerformanceChart({
  data,
  title = 'Performance Over Time',
}: PerformanceChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-textPrimary mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-textMuted">
          <p>No performance data yet. Take some tests to see your progress!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-textPrimary mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#fafafa',
              }}
              formatter={(value) => [`${(value as number)?.toFixed(1) ?? 0}%`, '']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="Accuracy"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#8b5cf6' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Score"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22c55e' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
