import { Metadata } from 'next';
import CurrentAffairsClient from './CurrentAffairsClient';

export const metadata: Metadata = {
  title: 'Current Affairs - Daily Updates for CLAT',
  description: 'Stay updated with daily current affairs curated for CLAT preparation. Covers legal news, international relations, economy, politics, and more with CLAT-focused analysis.',
  keywords: ['CLAT current affairs', 'daily current affairs', 'legal current affairs', 'GK for CLAT', 'current affairs 2025'],
  openGraph: {
    title: 'Current Affairs - Daily Updates for CLAT',
    description: 'Stay updated with daily current affairs curated for CLAT preparation covering all important topics.',
  },
};

export default function CurrentAffairsPage() {
  return <CurrentAffairsClient />;
}
