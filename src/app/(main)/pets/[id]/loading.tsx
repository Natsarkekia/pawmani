import { Skeleton, PetGridSkeleton } from "@/components/ui/Skeleton";

export default function PetDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-4 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-20 h-20" />)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      <div className="mt-16">
        <Skeleton className="h-7 w-40 mb-6" />
        <PetGridSkeleton count={3} />
      </div>
    </div>
  );
}
