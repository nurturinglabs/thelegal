'use client';

import { useState } from 'react';
import { BookOpen, Filter } from 'lucide-react';
import ModuleCard from '@/components/learn/ModuleCard';
import { CLAT_SECTIONS, CLATSection } from '@/utils/constants';
import modulesData from '@/data/modules.json';
import { ModulesData } from '@/types';
import { cn } from '@/utils/cn';

const data: ModulesData = modulesData as ModulesData;

export default function LearnClient() {
  const [selectedSection, setSelectedSection] = useState<CLATSection | 'All'>('All');

  // Filter modules by section
  const filteredModules = selectedSection === 'All'
    ? data.modules
    : data.modules.filter(m => m.section === selectedSection);

  // Group modules by section
  const modulesBySection = CLAT_SECTIONS.reduce((acc, section) => {
    acc[section] = data.modules.filter(m => m.section === section);
    return acc;
  }, {} as Record<CLATSection, typeof data.modules>);

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 rounded-lg bg-accent/10">
          <BookOpen size={32} className="text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-textPrimary mb-2">Learn</h1>
          <p className="text-textSecondary">
            Master CLAT concepts through structured learning modules. Each module contains video lessons, readings, and practice quizzes.
          </p>
        </div>
      </div>

      {/* Section Filters */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter size={18} className="text-textMuted" />
          <span className="text-sm font-medium text-textMuted">Filter by:</span>
        </div>

        <button
          onClick={() => setSelectedSection('All')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
            selectedSection === 'All'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface border border-border text-textSecondary hover:bg-surfaceLight hover:text-textPrimary'
          )}
        >
          All Sections
        </button>

        {CLAT_SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              selectedSection === section
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface border border-border text-textSecondary hover:bg-surfaceLight hover:text-textPrimary'
            )}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-border">
          <div className="text-2xl font-bold text-textPrimary mb-1">
            {data.modules.length}
          </div>
          <div className="text-xs text-textMuted">Total Modules</div>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <div className="text-2xl font-bold text-textPrimary mb-1">
            {data.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
          </div>
          <div className="text-xs text-textMuted">Total Lessons</div>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <div className="text-2xl font-bold text-textPrimary mb-1">
            {data.modules.filter(m => m.progress > 0).length}
          </div>
          <div className="text-xs text-textMuted">In Progress</div>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <div className="text-2xl font-bold text-textPrimary mb-1">
            {data.modules.filter(m => m.progress === 100).length}
          </div>
          <div className="text-xs text-textMuted">Completed</div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-textMuted">
          Showing <span className="font-semibold text-textPrimary">{filteredModules.length}</span>{' '}
          {filteredModules.length === 1 ? 'module' : 'modules'}
        </p>
      </div>

      {/* Modules Grid */}
      {selectedSection === 'All' ? (
        /* Grouped by Section */
        <div className="space-y-8">
          {CLAT_SECTIONS.map((section) => {
            const sectionModules = modulesBySection[section];
            if (sectionModules.length === 0) return null;

            return (
              <div key={section}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-textPrimary">{section}</h2>
                  <span className="text-sm text-textMuted">
                    {sectionModules.length} {sectionModules.length === 1 ? 'module' : 'modules'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectionModules.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Filtered View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
}
