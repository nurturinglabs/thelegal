import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';

interface ArticleCardSkeletonProps {
  count?: number;
}

export default function ArticleCardSkeleton({ count = 1 }: ArticleCardSkeletonProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="overflow-hidden animate-fade-in">
          {/* Thumbnail */}
          <Skeleton variant="rectangular" width="100%" height="160px" className="mb-4" />

          {/* Category & Date */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton variant="rectangular" width="100px" height="24px" className="rounded-full" />
            <Skeleton variant="text" width="80px" height="14px" />
          </div>

          {/* Title */}
          <Skeleton variant="text" width="100%" height="24px" className="mb-2" />
          <Skeleton variant="text" width="80%" height="24px" className="mb-3" />

          {/* Excerpt */}
          <div className="space-y-2 mb-4">
            <Skeleton variant="text" width="100%" height="14px" />
            <Skeleton variant="text" width="100%" height="14px" />
            <Skeleton variant="text" width="60%" height="14px" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Skeleton variant="text" width="80px" height="14px" />
            <Skeleton variant="rectangular" width="32px" height="32px" className="rounded" />
          </div>
        </Card>
      ))}
    </>
  );
}
