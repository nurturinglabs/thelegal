'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  PenTool,
  FileText,
  Menu,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface MobileNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function MobileNav() {
  const pathname = usePathname();

  const navItems: MobileNavItem[] = [
    { label: 'Dashboard', href: '/', icon: Home },
    { label: 'Learn', href: '/learn', icon: BookOpen },
    { label: 'Practice', href: '/practice', icon: PenTool },
    { label: 'Tests', href: '/tests', icon: FileText },
    { label: 'More', href: '/current-affairs', icon: Menu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 lg:hidden pb-safe">
      <div className="grid grid-cols-5 h-16 min-h-[64px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 min-h-[44px]',
                isActive
                  ? 'text-primary'
                  : 'text-textMuted hover:text-textPrimary'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
