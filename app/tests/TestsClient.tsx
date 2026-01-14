'use client';

import { useState } from 'react';
import { FileText, Filter, Search } from 'lucide-react';
import TestCard from '@/components/tests/TestCard';
import Badge from '@/components/ui/Badge';
import testsData from '@/data/tests.json';
import { TestsData } from '@/types';
import { TestType } from '@/utils/constants';

const data: TestsData = testsData as TestsData;

type FilterType = 'all' | TestType;

export default function TestsClient() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Tests' },
    { value: 'full_length', label: 'Full Length' },
    { value: 'sectional', label: 'Sectional' },
    { value: 'previous_year', label: 'Previous Year' },
  ];

  const filteredTests = data.tests.filter((test) => {
    const matchesFilter = filter === 'all' || test.type === filter;
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch && test.published;
  });

  const testCounts = {
    all: data.tests.filter((t) => t.published).length,
    full_length: data.tests.filter((t) => t.type === 'full_length' && t.published).length,
    sectional: data.tests.filter((t) => t.type === 'sectional' && t.published).length,
    previous_year: data.tests.filter((t) => t.type === 'previous_year' && t.published).length,
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Mock Tests</h1>
            <p className="text-textSecondary">
              Practice with full-length and sectional tests
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="info" size="md">
            {testCounts.full_length} Full Length Tests
          </Badge>
          <Badge variant="success" size="md">
            {testCounts.sectional} Sectional Tests
          </Badge>
          <Badge variant="warning" size="md">
            {testCounts.previous_year} Previous Year Papers
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
          />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surfaceLight border border-border text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter size={18} className="text-textMuted flex-shrink-0" />
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === option.value
                  ? 'bg-primary text-white'
                  : 'bg-surfaceLight text-textSecondary hover:bg-border'
              }`}
            >
              {option.label}
              <span className="ml-1.5 text-xs opacity-75">
                ({testCounts[option.value]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Test Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText size={48} className="text-textMuted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-textPrimary mb-2">
            No tests found
          </h3>
          <p className="text-textSecondary">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="text-lg font-semibold text-textPrimary mb-2">
          About CLAT Mock Tests
        </h3>
        <div className="text-sm text-textSecondary space-y-2">
          <p>
            <strong>Full Length Tests:</strong> 120 questions in 120 minutes, covering all 5 sections.
            Perfect for simulating the actual CLAT exam experience.
          </p>
          <p>
            <strong>Sectional Tests:</strong> 30 questions in 30 minutes, focused on a single section.
            Ideal for targeted practice.
          </p>
          <p>
            <strong>Previous Year Papers:</strong> Actual CLAT papers from previous years.
            Great for understanding the exam pattern.
          </p>
          <p className="pt-2 text-textMuted">
            Marking Scheme: +1 for correct answer, -0.25 for incorrect answer
          </p>
        </div>
      </div>
    </div>
  );
}
