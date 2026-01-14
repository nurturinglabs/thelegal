'use client';

import { Bookmark } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/utils/cn';

interface BookmarkButtonProps {
  articleId: string;
  className?: string;
}

export default function BookmarkButton({ articleId, className }: BookmarkButtonProps) {
  const { isArticleBookmarked, toggleArticleBookmark } = useBookmarks();
  const isBookmarked = isArticleBookmarked(articleId);

  return (
    <Button
      variant={isBookmarked ? 'primary' : 'outline'}
      onClick={() => toggleArticleBookmark(articleId)}
      icon={
        <Bookmark
          size={18}
          fill={isBookmarked ? 'currentColor' : 'none'}
        />
      }
      className={cn('transition-all', className)}
    >
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
}
