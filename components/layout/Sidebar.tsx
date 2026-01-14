'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  FileText,
  Newspaper,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  Scale,
  Bell,
  User,
  Target
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { APP_NAME, APP_TAGLINE } from '@/utils/constants';
import SearchTrigger from '@/components/search/SearchTrigger';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Persist collapse state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', JSON.stringify(newState));
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Learn', href: '/learn', icon: BookOpen },
    { label: 'Practice', href: '/practice', icon: PenTool },
    { label: 'Tests', href: '/tests', icon: FileText },
    { label: 'Current Affairs', href: '/current-affairs', icon: Newspaper },
    { label: 'End Goal', href: '/end-goal', icon: Target },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-border bg-surface transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className={cn(
        'flex items-center border-b border-border h-16 px-4',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Scale size={22} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-textPrimary truncate">{APP_NAME}</h1>
              <p className="text-[10px] text-textMuted truncate leading-tight">{APP_TAGLINE}</p>
            </div>
          )}
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        {isCollapsed ? (
          <SearchTrigger variant="icon" className="w-full justify-center" />
        ) : (
          <SearchTrigger variant="full" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isCollapsed && 'justify-center px-2',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-textSecondary hover:bg-surfaceLight hover:text-textPrimary'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Study Stats - Only show when expanded */}
      {!isCollapsed && (
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-surfaceLight p-3">
            <p className="text-xs font-medium text-textMuted mb-2">Today&apos;s Progress</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-textSecondary">Questions</span>
                  <span className="text-textPrimary font-medium">0/50</span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-textSecondary">Study Time</span>
                  <span className="text-textPrimary font-medium">0h 0m</span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Section */}
      <div className={cn(
        'border-t border-border p-3',
        isCollapsed ? 'space-y-2' : 'space-y-1'
      )}>
        {/* Notifications */}
        <button
          className={cn(
            'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium',
            'text-textMuted hover:bg-surfaceLight hover:text-textPrimary transition-all',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Notifications' : undefined}
        >
          <div className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-error" />
          </div>
          {!isCollapsed && <span>Notifications</span>}
        </button>

        {/* User Profile */}
        <button
          className={cn(
            'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium',
            'text-textMuted hover:bg-surfaceLight hover:text-textPrimary transition-all',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Guest' : undefined}
        >
          <User size={20} />
          {!isCollapsed && <span>Guest</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className={cn(
            'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium',
            'text-textMuted hover:bg-surfaceLight hover:text-textPrimary transition-all',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <>
              <ChevronLeft size={20} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
