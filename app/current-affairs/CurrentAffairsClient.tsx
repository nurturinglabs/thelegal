'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Calendar,
  Clock,
  Bookmark,
  ChevronRight,
  Search,
  Flame,
  Star,
  BookOpen,
  X,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import CategoryBadge from '@/components/current-affairs/CategoryBadge';
import CurrentAffairsPageSkeleton from '@/components/skeletons/CurrentAffairsPageSkeleton';
import { CACategory, CA_CATEGORIES, STORAGE_KEYS } from '@/utils/constants';
import { formatDate, isWithinDays } from '@/utils/date';
import { useBookmarks } from '@/hooks/useBookmarks';
import articlesData from '@/data/currentAffairs.json';
import { ArticlesData, Article } from '@/types';
import { cn } from '@/utils/cn';

const data: ArticlesData = articlesData as ArticlesData;

// Sort options
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'date-desc' },
  { label: 'Oldest First', value: 'date-asc' },
  { label: 'Importance', value: 'importance' },
  { label: 'Read Time', value: 'readTime' },
];

// Date filter options
const DATE_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 90 Days', value: '90' },
];

// Importance filter options
const IMPORTANCE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export default function CurrentAffairsClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CACategory>('All');
  const [dateFilter, setDateFilter] = useState('all');
  const [importanceFilter, setImportanceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [readArticles, setReadArticles] = useState<string[]>([]);
  const { isArticleBookmarked, toggleArticleBookmark } = useBookmarks();

  // Load read articles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CA_QUIZ_ATTEMPTS);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        const readIds = (parsedData.attempts || []).map((a: { articleId: string }) => a.articleId);
        setReadArticles(readIds);
      } catch {
        setReadArticles([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Get bookmarked articles
  const bookmarkedArticles = useMemo(() => {
    return data.articles.filter((article) => isArticleBookmarked(article.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArticleBookmarked]);

  // Featured article (most recent high importance)
  const featuredArticle = useMemo(() => {
    const sorted = [...data.articles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted.find((a) => a.importance === 'high') || sorted[0];
  }, []);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let articles = [...data.articles];

    // Category filter
    if (selectedCategory !== 'All') {
      articles = articles.filter((a) => a.category === selectedCategory);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const days = parseInt(dateFilter);
      articles = articles.filter((a) => isWithinDays(a.date, days));
    }

    // Importance filter
    if (importanceFilter !== 'all') {
      articles = articles.filter((a) => a.importance === importanceFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter((a) => {
        return (
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    // Sort
    switch (sortBy) {
      case 'date-desc':
        articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        articles.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'importance':
        const importanceOrder = { high: 0, medium: 1, low: 2 };
        articles.sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);
        break;
      case 'readTime':
        articles.sort((a, b) => a.readTime - b.readTime);
        break;
    }

    return articles;
  }, [selectedCategory, dateFilter, importanceFilter, sortBy, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: data.articles.length };
    data.articles.forEach((article) => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Stats
  const stats = {
    totalArticles: data.articles.length,
    readCount: readArticles.length,
    bookmarkedCount: bookmarkedArticles.length,
  };

  const hasActiveFilters = selectedCategory !== 'All' || dateFilter !== 'all' || importanceFilter !== 'all' || searchQuery;

  const clearFilters = () => {
    setSelectedCategory('All');
    setDateFilter('all');
    setImportanceFilter('all');
    setSearchQuery('');
  };

  if (isLoading) {
    return <CurrentAffairsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <div className="border-b border-border bg-surface/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Newspaper size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-textPrimary">Current Affairs</h1>
                <p className="text-sm text-textMuted">{stats.totalArticles} articles</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={16} className="text-textMuted" />
                <span className="text-textMuted">Read:</span>
                <span className="font-semibold text-textPrimary">{stats.readCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Bookmark size={16} className="text-warning" />
                <span className="text-textMuted">Saved:</span>
                <span className="font-semibold text-textPrimary">{stats.bookmarkedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Featured Article */}
        {featuredArticle && !searchQuery && selectedCategory === 'All' && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star size={18} className="text-warning fill-warning" />
              <h2 className="font-semibold text-textPrimary">Featured Article</h2>
            </div>
            <Link href={`/current-affairs/${featuredArticle.id}`}>
              <Card variant="interactive" className="p-0 overflow-hidden border-l-4 border-l-primary">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryBadge category={featuredArticle.category} size="sm" />
                        <Badge variant="error" size="sm">
                          <Flame size={10} className="mr-1" />
                          Important
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-textPrimary mb-2 hover:text-primary transition-colors">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-textSecondary text-sm mb-3 line-clamp-2">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-textMuted">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDate(featuredArticle.date, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{featuredArticle.readTime} min read</span>
                        </div>
                        {featuredArticle.quiz && (
                          <span className="text-primary font-medium">Quiz Available</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleArticleBookmark(featuredArticle.id);
                      }}
                      className={cn(
                        'p-2 rounded-lg transition-colors flex-shrink-0',
                        isArticleBookmarked(featuredArticle.id)
                          ? 'text-warning bg-warning/10'
                          : 'text-textMuted hover:text-textPrimary hover:bg-surfaceLight'
                      )}
                    >
                      <Bookmark
                        size={20}
                        fill={isArticleBookmarked(featuredArticle.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-surface border border-border rounded-lg text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textPrimary"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-surface border border-border rounded-lg text-sm text-textPrimary focus:outline-none focus:border-primary cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-surface border border-border rounded-lg text-sm text-textPrimary focus:outline-none focus:border-primary cursor-pointer"
              >
                {DATE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            </div>

            {/* Importance Filter */}
            <div className="relative">
              <select
                value={importanceFilter}
                onChange={(e) => setImportanceFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-surface border border-border rounded-lg text-sm text-textPrimary focus:outline-none focus:border-primary cursor-pointer"
              >
                {IMPORTANCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label === 'All' ? 'All Importance' : opt.label + ' Importance'}
                  </option>
                ))}
              </select>
              <AlertCircle size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-textMuted">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CA_CATEGORIES.map((category) => {
              const count = categoryCounts[category] || 0;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-surface text-textSecondary hover:bg-surfaceLight border border-border'
                  )}
                >
                  {category}
                  <span className="ml-1.5 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <ArticleListItem
                key={article.id}
                article={article}
                isBookmarked={isArticleBookmarked(article.id)}
                isRead={readArticles.includes(article.id)}
                onBookmark={() => toggleArticleBookmark(article.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surfaceLight mb-4">
              <Newspaper size={32} className="text-textMuted" />
            </div>
            <h3 className="text-xl font-semibold text-textPrimary mb-2">No articles found</h3>
            <p className="text-textSecondary mb-6">
              {searchQuery
                ? `No articles match "${searchQuery}"`
                : 'Try adjusting your filters'}
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// List Item Component
function ArticleListItem({
  article,
  isBookmarked,
  isRead,
  onBookmark,
}: {
  article: Article;
  isBookmarked: boolean;
  isRead: boolean;
  onBookmark: () => void;
}) {
  const importanceColors = {
    low: 'bg-zinc-500',
    medium: 'bg-warning',
    high: 'bg-error',
  };

  return (
    <Link href={`/current-affairs/${article.id}`}>
      <Card
        variant="interactive"
        className={cn(
          'transition-all',
          isRead && 'opacity-70'
        )}
      >
        <div className="flex items-start gap-4">
          {/* Importance Indicator */}
          <div className="flex flex-col items-center gap-1 pt-1">
            <div className={cn('w-2 h-2 rounded-full', importanceColors[article.importance])} />
            <div className="text-[10px] text-textMuted uppercase tracking-wide">
              {article.importance.charAt(0)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <CategoryBadge category={article.category} size="sm" />
              {isRead && (
                <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
                  Read
                </span>
              )}
              {article.quiz && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Quiz
                </span>
              )}
            </div>

            <h3 className="font-semibold text-textPrimary mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            <p className="text-sm text-textSecondary line-clamp-2 mb-2">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 text-xs text-textMuted">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatDate(article.date, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{article.readTime} min</span>
              </div>
              {article.tags.length > 0 && (
                <div className="hidden sm:flex items-center gap-1">
                  {article.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-surfaceLight rounded text-textMuted">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmark();
              }}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isBookmarked
                  ? 'text-warning bg-warning/10'
                  : 'text-textMuted hover:text-textPrimary hover:bg-surfaceLight'
              )}
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <ChevronRight size={18} className="text-textMuted" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
