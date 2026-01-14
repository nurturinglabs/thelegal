'use client';

import { Search, Command } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { cn } from '@/utils/cn';

interface SearchTriggerProps {
  variant?: 'icon' | 'button' | 'full';
  className?: string;
}

export default function SearchTrigger({ variant = 'button', className }: SearchTriggerProps) {
  const { openSearch } = useSearch();

  // Register Cmd+K / Ctrl+K shortcut
  useKeyboardShortcut({
    key: 'k',
    modifier: ['meta'],
    callback: openSearch,
  });

  // Also register Ctrl+K for Windows/Linux
  useKeyboardShortcut({
    key: 'k',
    modifier: ['ctrl'],
    callback: openSearch,
  });

  if (variant === 'icon') {
    return (
      <button
        onClick={openSearch}
        className={cn(
          'p-2 text-textMuted hover:text-textPrimary transition-colors rounded-lg hover:bg-surfaceLight',
          className
        )}
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        onClick={openSearch}
        className={cn(
          'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-border bg-surfaceLight/50 text-textMuted hover:text-textSecondary hover:border-border/80 transition-colors',
          className
        )}
      >
        <Search size={18} />
        <span className="flex-1 text-left text-sm">Search...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded border border-border bg-surface">
          <Command size={10} />
          <span>K</span>
        </kbd>
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={openSearch}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface text-textMuted hover:text-textPrimary hover:bg-surfaceLight transition-colors',
        className
      )}
    >
      <Search size={16} />
      <span className="hidden sm:inline text-sm">Search</span>
      <kbd className="hidden md:flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded border border-border bg-surfaceLight">
        <Command size={10} />
        <span>K</span>
      </kbd>
    </button>
  );
}
