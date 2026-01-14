import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';

export default function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="space-y-2">
        <Skeleton variant="text" width="300px" height="36px" />
        <Skeleton variant="text" width="400px" height="20px" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} variant="bordered">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton variant="text" width="100px" height="16px" className="mb-2" />
                <Skeleton variant="text" width="60px" height="32px" className="mb-2" />
                <Skeleton variant="text" width="80px" height="14px" />
              </div>
              <Skeleton variant="rectangular" width="40px" height="40px" className="rounded-lg" />
            </div>
          </Card>
        ))}
      </div>

      {/* Daily Goals */}
      <Card>
        <Skeleton variant="text" width="120px" height="24px" className="mb-2" />
        <Skeleton variant="text" width="200px" height="16px" className="mb-4" />
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton variant="text" width="80px" height="16px" />
              <Skeleton variant="text" width="60px" height="16px" />
            </div>
            <Skeleton variant="rectangular" width="100%" height="8px" className="rounded-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton variant="text" width="120px" height="16px" />
              <Skeleton variant="text" width="60px" height="16px" />
            </div>
            <Skeleton variant="rectangular" width="100%" height="8px" className="rounded-full" />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <Skeleton variant="text" width="140px" height="24px" className="mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height="44px" className="rounded-lg" />
          ))}
        </div>
      </Card>

      {/* CLAT Sections */}
      <Card>
        <Skeleton variant="text" width="140px" height="24px" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border border-border rounded-lg">
              <Skeleton variant="text" width="140px" height="20px" className="mb-2" />
              <Skeleton variant="text" width="100px" height="14px" className="mb-3" />
              <div className="flex items-center gap-2">
                <Skeleton variant="rectangular" width="100%" height="8px" className="rounded-full flex-1" />
                <Skeleton variant="rectangular" width="40px" height="20px" className="rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
