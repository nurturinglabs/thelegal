'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/contexts/ToastContext';
import { SearchProvider } from '@/contexts/SearchContext';
import CommandPalette from '@/components/search/CommandPalette';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ToastProvider>
      <SearchProvider>
        {children}
        <CommandPalette />
      </SearchProvider>
    </ToastProvider>
  );
}
