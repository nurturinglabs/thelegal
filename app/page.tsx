import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard - Track Your CLAT Preparation Progress',
  description: 'Monitor your CLAT preparation journey with personalized analytics, daily goals, study streaks, and performance insights across all sections.',
  openGraph: {
    title: 'Dashboard - Track Your CLAT Preparation Progress',
    description: 'Monitor your CLAT preparation journey with personalized analytics, daily goals, study streaks, and performance insights.',
  },
};

export default function HomePage() {
  return <DashboardClient />;
}
