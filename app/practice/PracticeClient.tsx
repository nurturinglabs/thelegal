'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PenTool, Search, Filter, BarChart2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import TopicCard from '@/components/practice/TopicCard';
import { CLAT_SECTIONS, STORAGE_KEYS } from '@/utils/constants';
import questionsData from '@/data/questions.json';
import { QuestionsData } from '@/types';

const questions: QuestionsData = questionsData as QuestionsData;

interface TopicStats {
  attempted: number;
  correct: number;
}

interface PracticeStats {
  [key: string]: TopicStats;
}

export default function PracticeClient() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceStats, setPracticeStats] = useState<PracticeStats>({});

  // Load practice stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRACTICE_SESSIONS);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setPracticeStats(data.topicStats || {});
      } catch {
        setPracticeStats({});
      }
    }
  }, []);

  // Get all unique topics with question counts
  const topicsWithCounts = useMemo(() => {
    const topicMap = new Map<string, { section: string; topic: string; count: number }>();

    questions.questions.forEach((q) => {
      const key = `${q.section}-${q.topic}`;
      if (topicMap.has(key)) {
        topicMap.get(key)!.count++;
      } else {
        topicMap.set(key, { section: q.section, topic: q.topic, count: 1 });
      }
    });

    return Array.from(topicMap.values());
  }, []);

  // Filter topics based on section and search
  const filteredTopics = useMemo(() => {
    return topicsWithCounts.filter((item) => {
      const matchesSection = selectedSection === 'All' || item.section === selectedSection;
      const matchesSearch =
        searchQuery === '' ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.section.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSection && matchesSearch;
    });
  }, [topicsWithCounts, selectedSection, searchQuery]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    let totalAttempted = 0;
    let totalCorrect = 0;

    Object.values(practiceStats).forEach((stats) => {
      totalAttempted += stats.attempted;
      totalCorrect += stats.correct;
    });

    return {
      attempted: totalAttempted,
      correct: totalCorrect,
      accuracy: totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0,
    };
  }, [practiceStats]);

  const handleTopicClick = (section: string, topic: string) => {
    const topicId = `${section}-${topic}`.toLowerCase().replace(/\s+/g, '-');
    router.push(`/practice/${encodeURIComponent(topicId)}`);
  };

  const getTopicStats = (section: string, topic: string) => {
    const key = `${section}-${topic}`;
    return practiceStats[key];
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10">
          <PenTool size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Practice</h1>
          <p className="text-textSecondary">Master topics with focused practice sessions</p>
        </div>
      </div>

      {/* Stats Overview */}
      {overallStats.attempted > 0 && (
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-textPrimary">Your Progress</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-textPrimary">{overallStats.attempted}</p>
              <p className="text-sm text-textMuted">Questions Practiced</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{overallStats.correct}</p>
              <p className="text-sm text-textMuted">Correct Answers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{overallStats.accuracy.toFixed(1)}%</p>
              <p className="text-sm text-textMuted">Overall Accuracy</p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Section Filter */}
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-surface border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="All">All Sections</option>
            {CLAT_SECTIONS.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section Tabs (Mobile-friendly horizontal scroll) */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedSection('All')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedSection === 'All'
              ? 'bg-primary text-white'
              : 'bg-surface text-textSecondary hover:bg-surfaceLight'
          }`}
        >
          All
        </button>
        {CLAT_SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSection === section
                ? 'bg-primary text-white'
                : 'bg-surface text-textSecondary hover:bg-surfaceLight'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((item) => {
            const stats = getTopicStats(item.section, item.topic);
            return (
              <TopicCard
                key={`${item.section}-${item.topic}`}
                section={item.section}
                topic={item.topic}
                questionCount={item.count}
                completedCount={stats?.attempted || 0}
                accuracy={
                  stats && stats.attempted > 0
                    ? (stats.correct / stats.attempted) * 100
                    : undefined
                }
                onClick={() => handleTopicClick(item.section, item.topic)}
              />
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <PenTool size={48} className="mx-auto text-textMuted mb-4" />
          <h3 className="text-xl font-semibold text-textPrimary mb-2">No Topics Found</h3>
          <p className="text-textMuted">
            {searchQuery
              ? `No topics match "${searchQuery}"`
              : 'No topics available for the selected section.'}
          </p>
        </Card>
      )}

      {/* Section Summary */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Questions by Section</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CLAT_SECTIONS.map((section) => {
            const sectionQuestions = questions.questions.filter((q) => q.section === section);
            return (
              <Card key={section} className="text-center p-4">
                <p className="text-2xl font-bold text-textPrimary">{sectionQuestions.length}</p>
                <p className="text-xs text-textMuted mt-1 line-clamp-1">{section}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
