'use client';

import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ children, className }: TabsProps) {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-lg bg-surface border border-border p-1 overflow-x-auto scrollbar-hide', className)}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  // This component expects to be used within Tabs context
  // For simplicity, we'll use a more direct approach
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm',
        'data-[state=inactive]:text-textMuted hover:text-textPrimary hover:bg-surfaceLight',
        className
      )}
      data-value={value}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ children, className }: TabsContentProps) {
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
}
