import Link from 'next/link';
import { APP_NAME } from '@/utils/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-textMuted">
          <p>© {currentYear} {APP_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-textPrimary transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-textPrimary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-textPrimary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
