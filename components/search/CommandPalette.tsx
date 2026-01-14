'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  FileText,
  BookOpen,
  Newspaper,
  ArrowRight,
  Command
} from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from '@/utils/cn';

// Import data
import currentAffairsData from '@/data/currentAffairs.json';
import modulesData from '@/data/modules.json';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: 'article' | 'module' | 'lesson';
  href: string;
  icon: typeof FileText;
  metadata?: string;
}

export default function CommandPalette() {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Build searchable index
  const searchIndex = useMemo(() => {
    const results: SearchResult[] = [];

    // Add articles
    currentAffairsData.articles.forEach((article) => {
      results.push({
        id: article.id,
        title: article.title,
        description: article.excerpt,
        category: 'article',
        href: `/current-affairs/${article.id}`,
        icon: Newspaper,
        metadata: article.category,
      });
    });

    // Add modules and lessons
    modulesData.modules.forEach((module) => {
      results.push({
        id: module.id,
        title: module.title,
        description: module.description,
        category: 'module',
        href: `/learn/${module.id}`,
        icon: BookOpen,
        metadata: module.section,
      });

      // Add lessons
      module.lessons.forEach((lesson) => {
        results.push({
          id: lesson.id,
          title: lesson.title,
          description: `Part of ${module.title}`,
          category: 'lesson',
          href: `/learn/${module.id}/${lesson.id}`,
          icon: FileText,
          metadata: module.section,
        });
      });
    });

    return results;
  }, []);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Show recent/popular items when no query
      return searchIndex.slice(0, 8);
    }

    const lowerQuery = query.toLowerCase();
    const results = searchIndex.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.metadata?.toLowerCase().includes(lowerQuery)
      );
    });

    return results.slice(0, 10);
  }, [query, searchIndex]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            router.push(filteredResults[selectedIndex].href);
            closeSearch();
            setQuery('');
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeSearch();
          setQuery('');
          break;
      }
    },
    [isOpen, filteredResults, selectedIndex, router, closeSearch]
  );

  // Keyboard navigation listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    closeSearch();
    setQuery('');
  };

  // Category labels
  const categoryLabels = {
    article: 'Current Affairs',
    module: 'Learning Module',
    lesson: 'Lesson',
  };

  const categoryColors = {
    article: 'bg-primary/10 text-primary',
    module: 'bg-accent/10 text-accent',
    lesson: 'bg-warning/10 text-warning',
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          closeSearch();
          setQuery('');
        }}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 animate-scale-in">
        <div className="mx-4 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search size={20} className="text-textMuted" />
            <input
              type="text"
              placeholder="Search articles, modules, lessons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-textPrimary placeholder-textMuted outline-none"
              autoFocus
            />
            <div className="flex items-center gap-1">
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-surfaceLight px-1.5 text-xs text-textMuted">
                ESC
              </kbd>
              <button
                onClick={() => {
                  closeSearch();
                  setQuery('');
                }}
                className="p-1 text-textMuted hover:text-textPrimary sm:hidden"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredResults.length === 0 ? (
              <div className="py-8 text-center text-textMuted">
                <Search size={40} className="mx-auto mb-3 opacity-50" />
                <p>No results found for &quot;{query}&quot;</p>
                <p className="text-sm mt-1">Try searching for articles, modules, or lessons</p>
              </div>
            ) : (
              <div className="space-y-1">
                {!query.trim() && (
                  <p className="px-3 py-2 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Quick Access
                  </p>
                )}
                {filteredResults.map((result, index) => {
                  const Icon = result.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'w-full flex items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                        isSelected
                          ? 'bg-primary/10 text-textPrimary'
                          : 'text-textSecondary hover:bg-surfaceLight'
                      )}
                    >
                      <div className={cn(
                        'mt-0.5 rounded-lg p-2',
                        isSelected ? 'bg-primary/20' : 'bg-surfaceLight'
                      )}>
                        <Icon size={16} className={isSelected ? 'text-primary' : 'text-textMuted'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'font-medium truncate',
                            isSelected ? 'text-textPrimary' : 'text-textSecondary'
                          )}>
                            {result.title}
                          </span>
                          <span className={cn(
                            'text-xs px-1.5 py-0.5 rounded',
                            categoryColors[result.category]
                          )}>
                            {categoryLabels[result.category]}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-sm text-textMuted truncate mt-0.5">
                            {result.description}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <ArrowRight size={16} className="text-primary mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-textMuted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-5 items-center rounded border border-border bg-surfaceLight px-1.5">↑</kbd>
                <kbd className="inline-flex h-5 items-center rounded border border-border bg-surfaceLight px-1.5">↓</kbd>
                <span className="ml-1">Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-5 items-center rounded border border-border bg-surfaceLight px-1.5">↵</kbd>
                <span className="ml-1">Open</span>
              </span>
            </div>
            <span className="hidden sm:flex items-center gap-1">
              <Command size={12} />
              <span>K to search</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
