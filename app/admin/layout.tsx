import { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard - Vidhi',
  description: 'Content curation and management for Vidhi CLAT Prep',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <LayoutDashboard size={24} className="text-primary" />
            <span className="text-xl font-bold text-textPrimary">
              Vidhi <span className="text-primary">Admin</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/articles"
              className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
            >
              Articles
            </Link>
            <Link
              href="/admin/quizzes"
              className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
            >
              Quizzes
            </Link>
            <Link
              href="/admin/team"
              className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
            >
              Team
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:text-primaryDark transition-colors"
            >
              ← Back to App
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-textPrimary">Admin User</div>
              <div className="text-xs text-textMuted">admin@vidhi.com</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main>{children}</main>

      {/* Admin Footer */}
      <footer className="bg-surface border-t border-border mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-sm text-textMuted text-center">
            Admin Dashboard - Vidhi CLAT Prep Platform © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
