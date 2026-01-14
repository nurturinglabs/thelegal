import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';

export default function TestsPageSkeleton() {
  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton variant="rectangular" width="48px" height="48px" className="rounded-lg" />
          <div>
            <Skeleton variant="text" width="160px" height="36px" className="mb-2" />
            <Skeleton variant="text" width="280px" height="20px" />
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Skeleton variant="rectangular" width="140px" height="28px" className="rounded-full" />
          <Skeleton variant="rectangular" width="140px" height="28px" className="rounded-full" />
          <Skeleton variant="rectangular" width="160px" height="28px" className="rounded-full" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton variant="rectangular" width="300px" height="44px" className="rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" width="100px" height="40px" className="rounded-lg" />
          <Skeleton variant="rectangular" width="100px" height="40px" className="rounded-lg" />
          <Skeleton variant="rectangular" width="120px" height="40px" className="rounded-lg" />
          <Skeleton variant="rectangular" width="140px" height="40px" className="rounded-lg" />
        </div>
      </div>

      {/* Test Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton variant="rectangular" width="80px" height="24px" className="rounded-full" />
                  <Skeleton variant="rectangular" width="60px" height="24px" className="rounded-full" />
                </div>
                <Skeleton variant="text" width="100%" height="24px" className="mb-2" />
                <Skeleton variant="text" width="80%" height="16px" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-textMuted mb-4">
              <Skeleton variant="text" width="100px" height="16px" />
              <Skeleton variant="text" width="80px" height="16px" />
              <Skeleton variant="text" width="80px" height="16px" />
            </div>

            {/* Sections */}
            <div className="flex flex-wrap gap-1 mb-4">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} variant="rectangular" width="80px" height="20px" className="rounded" />
              ))}
            </div>

            {/* Button */}
            <Skeleton variant="rectangular" width="100%" height="40px" className="rounded-lg" />
          </Card>
        ))}
      </div>
    </div>
  );
}
