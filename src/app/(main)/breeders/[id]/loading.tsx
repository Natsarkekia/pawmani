import { Skeleton, PetGridSkeleton } from "@/components/ui/Skeleton";

export default function BreederLoading() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <Skeleton className="w-24 h-24 rounded-2xl shrink-0 bg-blue-600/50" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-48 bg-blue-600/50" />
              <Skeleton className="h-4 w-36 bg-blue-600/50" />
              <Skeleton className="h-4 w-full max-w-lg bg-blue-600/50" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-6 w-36" />
            <PetGridSkeleton count={4} />
            <Skeleton className="h-6 w-24 mt-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
