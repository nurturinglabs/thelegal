'use client';

import { CA_CATEGORIES, DATE_FILTERS, CACategory } from '@/utils/constants';
import Select from '@/components/ui/Select';
import { cn } from '@/utils/cn';

interface ArticleFiltersProps {
  selectedCategory: CACategory;
  onCategoryChange: (category: CACategory) => void;
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
}

export default function ArticleFilters({
  selectedCategory,
  onCategoryChange,
  dateFilter,
  onDateFilterChange,
}: ArticleFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Category Tabs - Horizontal Scroll on Mobile */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-2 min-w-max">
            {CA_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface border border-border text-textSecondary hover:bg-surfaceLight hover:text-textPrimary'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-4">
        <Select
          value={dateFilter}
          onChange={onDateFilterChange}
          options={DATE_FILTERS}
          className="w-48"
        />

        <span className="text-sm text-textMuted">
          Filter articles by time period
        </span>
      </div>
    </div>
  );
}
