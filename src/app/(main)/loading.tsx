import { Skeleton, PetGridSkeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-4 mb-8">
            <Skeleton className="h-12 w-64 bg-white/20" />
            <Skeleton className="h-12 w-80 bg-white/20" />
            <Skeleton className="h-5 w-96 bg-white/10 mt-2" />
            <Skeleton className="h-12 w-full max-w-xl bg-white/10 mt-6" />
          </div>
          {/* Strip */}
          <div className="bg-white/10 rounded-2xl px-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2">
                  <Skeleton className="w-9 h-9 rounded-full bg-white/20 shrink-0" />
                  <div className="space-y-1.5 flex-1 hidden sm:block">
                    <Skeleton className="h-4 w-20 bg-white/20" />
                    <Skeleton className="h-3 w-32 bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Browse by species */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Featured listings */}
      <div className="bg-gray-50 dark:bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          <PetGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
