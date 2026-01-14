import { Metadata } from 'next';
import AnalyticsClient from './AnalyticsClient';

export const metadata: Metadata = {
  title: 'Analytics - Performance Insights & Progress',
  description: 'Track your CLAT preparation progress with detailed analytics. View section-wise performance, accuracy trends, time analysis, and personalized recommendations.',
  keywords: ['CLAT performance analytics', 'study progress tracker', 'CLAT preparation analysis', 'performance insights'],
  openGraph: {
    title: 'Analytics - Performance Insights & Progress',
    description: 'Track your CLAT preparation progress with detailed analytics and performance insights.',
  },
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
