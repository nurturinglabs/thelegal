import { Metadata } from 'next';
import LearnClient from './LearnClient';

export const metadata: Metadata = {
  title: 'Learn - CLAT Study Modules & Lessons',
  description: 'Master CLAT concepts with structured learning modules covering Legal Reasoning, Logical Reasoning, English Language, Quantitative Techniques, and Current Affairs.',
  keywords: ['CLAT study material', 'legal reasoning lessons', 'CLAT modules', 'law entrance preparation', 'CLAT syllabus'],
  openGraph: {
    title: 'Learn - CLAT Study Modules & Lessons',
    description: 'Master CLAT concepts with structured learning modules covering all five sections of the exam.',
  },
};

export default function LearnPage() {
  return <LearnClient />;
}
