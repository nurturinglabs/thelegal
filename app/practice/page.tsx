import { Metadata } from 'next';
import PracticeClient from './PracticeClient';

export const metadata: Metadata = {
  title: 'Practice - CLAT Questions & Topic-wise Practice',
  description: 'Practice CLAT questions organized by topics and difficulty levels. Improve your skills in Legal Reasoning, Logical Reasoning, English, Quant, and Current Affairs.',
  keywords: ['CLAT practice questions', 'CLAT MCQs', 'legal reasoning practice', 'CLAT question bank', 'topic-wise practice'],
  openGraph: {
    title: 'Practice - CLAT Questions & Topic-wise Practice',
    description: 'Practice CLAT questions organized by topics and difficulty levels across all exam sections.',
  },
};

export default function PracticePage() {
  return <PracticeClient />;
}
