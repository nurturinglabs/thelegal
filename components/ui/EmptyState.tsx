import { ReactNode } from 'react';
import { LucideIcon, FileQuestion, Search, BookOpen, Inbox } from 'lucide-react';
import Button from './Button';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: 'default' | 'search' | 'content' | 'inbox';
  className?: string;
  children?: ReactNode;
}

const defaultIcons = {
  default: FileQuestion,
  search: Search,
  content: BookOpen,
  inbox: Inbox,
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
  children,
}: EmptyStateProps) {
  const Icon = icon || defaultIcons[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-surfaceLight flex items-center justify-center mb-4">
        <Icon size={32} className="text-textMuted" />
      </div>

      <h3 className="text-lg font-semibold text-textPrimary mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-textSecondary max-w-md mb-6">{description}</p>
      )}

      {children}

      {action && (
        <div className="mt-4">
          {action.href ? (
            <a href={action.href}>
              <Button variant="primary">{action.label}</Button>
            </a>
          ) : (
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
