import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 flex items-center gap-5">
        <Skeleton className="w-[72px] h-[72px] rounded-full shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-4 w-52 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-full mt-1" />
        </div>
      </div>

      {/* Listings card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
              <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
              <div className="flex-1 min-w-0 space-y-2 hidden sm:block">
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
