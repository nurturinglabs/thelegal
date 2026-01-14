import { Metadata } from 'next';
import EndGoalClient from './EndGoalClient';

export const metadata: Metadata = {
  title: 'End Goal - Top NLUs & Law Colleges in India',
  description: 'Explore top National Law Universities and law colleges in India. Compare rankings, fees, placement records, and cutoffs to choose your dream law school.',
  keywords: ['NLU colleges', 'top law colleges India', 'NLSIU Bangalore', 'NALSAR', 'NLU Delhi', 'CLAT cutoffs', 'law college rankings'],
  openGraph: {
    title: 'End Goal - Top NLUs & Law Colleges in India',
    description: 'Explore top National Law Universities and law colleges in India with detailed rankings and information.',
  },
};

export default function EndGoalPage() {
  return <EndGoalClient />;
}
