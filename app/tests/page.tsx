import { Metadata } from 'next';
import TestsClient from './TestsClient';

export const metadata: Metadata = {
  title: 'Mock Tests - CLAT Full-Length & Sectional Tests',
  description: 'Take CLAT mock tests including full-length tests, sectional tests, and previous year papers. Get detailed analysis and improve your exam performance.',
  keywords: ['CLAT mock tests', 'CLAT full-length tests', 'CLAT previous year papers', 'CLAT sectional tests', 'online CLAT test'],
  openGraph: {
    title: 'Mock Tests - CLAT Full-Length & Sectional Tests',
    description: 'Take CLAT mock tests including full-length tests, sectional tests, and previous year papers.',
  },
};

export default function TestsPage() {
  return <TestsClient />;
}
