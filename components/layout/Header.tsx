'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, User, Menu, Scale } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/utils/constants';
import { cn } from '@/utils/cn';
import SearchTrigger from '@/components/search/SearchTrigger';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Learn', href: '/learn' },
    { label: 'Practice', href: '/practice' },
    { label: 'Tests', href: '/tests' },
    { label: 'Current Affairs', href: '/current-affairs' },
    { label: 'End Goal', href: '/end-goal' },
    { label: 'Analytics', href: '/analytics' },
  ];

  return (
    <header className="lg:hidden sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Scale size={20} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-textPrimary block leading-tight">{APP_NAME}</span>
            <span className="text-[10px] text-textMuted leading-tight">{APP_TAGLINE}</span>
          </div>
        </Link>

        {/* Tablet Navigation - hidden on mobile (bottom nav) and desktop (sidebar) */}
        <nav className="hidden md:flex lg:hidden items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-textSecondary'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <SearchTrigger variant="icon" />

          {/* Notifications */}
          <button className="relative text-textMuted hover:text-textPrimary transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-error" />
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-textPrimary hover:bg-surfaceLight transition-colors">
            <User size={18} />
            <span className="hidden sm:inline text-sm font-medium">Guest</span>
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-textMuted hover:text-textPrimary">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
