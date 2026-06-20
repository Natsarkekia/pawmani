import { PetGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function BrowseLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-24 mt-2" />
      </div>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-5 shadow space-y-4">
            <Skeleton className="h-5 w-20" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-16" />)}
            </div>
            <Skeleton className="h-5 w-16 mt-2" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-14" />)}
            </div>
            <Skeleton className="h-5 w-24 mt-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <Skeleton className="h-9 w-40" />
          </div>
          <PetGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
