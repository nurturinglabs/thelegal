import Skeleton from '@/components/ui/Skeleton';
import ArticleCardSkeleton from './ArticleCardSkeleton';

export default function CurrentAffairsPageSkeleton() {
  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton variant="rectangular" width="48px" height="48px" className="rounded-lg" />
          <div>
            <Skeleton variant="text" width="180px" height="36px" className="mb-2" />
            <Skeleton variant="text" width="300px" height="20px" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <Skeleton variant="rectangular" width="100%" height="44px" className="rounded-lg lg:max-w-md" />

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="100px" height="40px" className="rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton variant="rectangular" width="140px" height="40px" className="rounded-lg" />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" width="150px" height="16px" />
        <Skeleton variant="rectangular" width="100px" height="32px" className="rounded-lg" />
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCardSkeleton count={6} />
      </div>
    </div>
  );
}
