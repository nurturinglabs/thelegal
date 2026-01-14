'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';
import { SEARCH_DEBOUNCE_DELAY } from '@/utils/constants';

interface ArticleSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ArticleSearch({ searchQuery, onSearchChange }: ArticleSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  // Sync with external changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search articles by title, content, or tags..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        icon={<Search size={20} />}
        fullWidth
      />

      {localQuery && (
        <p className="text-xs text-textMuted mt-2">
          Searching for &quot;{localQuery}&quot;...
        </p>
      )}
    </div>
  );
}
