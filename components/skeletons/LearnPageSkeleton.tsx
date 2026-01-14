import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';

export default function LearnPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <Skeleton variant="rectangular" width="56px" height="56px" className="rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <Skeleton variant="text" width="100px" height="36px" className="mb-2" />
          <Skeleton variant="text" width="400px" height="20px" />
        </div>
      </div>

      {/* Section Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <Skeleton variant="rectangular" width="100px" height="40px" className="rounded-lg" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="120px" height="40px" className="rounded-lg" />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-surface border border-border">
            <Skeleton variant="text" width="60px" height="32px" className="mb-1" />
            <Skeleton variant="text" width="80px" height="14px" />
          </div>
        ))}
      </div>

      {/* Results Count */}
      <Skeleton variant="text" width="150px" height="16px" />

      {/* Module Sections */}
      {[...Array(3)].map((_, sectionIdx) => (
        <div key={sectionIdx}>
          <div className="flex items-center gap-3 mb-4">
            <Skeleton variant="text" width="200px" height="28px" />
            <Skeleton variant="text" width="80px" height="16px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, cardIdx) => (
              <Card key={cardIdx} className="overflow-hidden">
                {/* Thumbnail */}
                <Skeleton variant="rectangular" width="100%" height="140px" className="mb-4" />

                {/* Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton variant="rectangular" width="100px" height="24px" className="rounded-full" />
                </div>

                {/* Title & Description */}
                <Skeleton variant="text" width="100%" height="24px" className="mb-2" />
                <Skeleton variant="text" width="100%" height="16px" className="mb-1" />
                <Skeleton variant="text" width="80%" height="16px" className="mb-4" />

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton variant="text" width="80px" height="14px" />
                  <Skeleton variant="text" width="100px" height="14px" />
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <Skeleton variant="text" width="60px" height="14px" />
                    <Skeleton variant="text" width="30px" height="14px" />
                  </div>
                  <Skeleton variant="rectangular" width="100%" height="8px" className="rounded-full" />
                </div>

                {/* Button */}
                <Skeleton variant="rectangular" width="100%" height="40px" className="rounded-lg" />
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
