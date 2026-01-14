'use client';

import Link from 'next/link';
import { Calendar, Clock, Bookmark } from 'lucide-react';
import Card from '@/components/ui/Card';
import CategoryBadge from './CategoryBadge';
import { Article } from '@/types';
import { formatDate } from '@/utils/date';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/utils/cn';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { isArticleBookmarked, toggleArticleBookmark } = useBookmarks();
  const bookmarked = isArticleBookmarked(article.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleArticleBookmark(article.id);
  };

  const importanceColors = {
    low: 'text-textMuted',
    medium: 'text-warning',
    high: 'text-error',
  };

  return (
    <Link href={`/current-affairs/${article.id}`}>
      <Card variant="interactive" className="h-full flex flex-col">
        {/* Header with Category Badge */}
        <div className="flex items-start justify-between mb-3">
          <CategoryBadge category={article.category} size="sm" />
          <button
            onClick={handleBookmarkClick}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              bookmarked
                ? 'text-warning bg-warning/10'
                : 'text-textMuted hover:text-textPrimary hover:bg-surfaceLight'
            )}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark
              size={18}
              fill={bookmarked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-textPrimary mb-2 line-clamp-2 hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-textSecondary mb-4 line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-textMuted mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(article.date, 'MMM dd')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{article.readTime} min</span>
            </div>
          </div>

          {/* Importance Indicator */}
          <span
            className={cn(
              'text-xs font-medium capitalize',
              importanceColors[article.importance]
            )}
          >
            {article.importance}
          </span>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 rounded bg-surfaceLight text-textMuted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
