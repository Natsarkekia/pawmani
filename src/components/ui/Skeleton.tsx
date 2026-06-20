import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700", className)} />
  );
}

export function PetCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-800 shadow">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3 mt-3" />
      </div>
    </div>
  );
}

export function PetGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PetCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListingFormSkeleton({ showPhone = false }: { showPhone?: boolean }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Heading */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-7 w-36 rounded-md" />
        <Skeleton className="h-4 w-56 rounded-md" />
      </div>

      <div className="space-y-8">
        {/* Photos */}
        <div>
          <Skeleton className="h-4 w-14 mb-3 rounded-md" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Purpose chips */}
        <div>
          <Skeleton className="h-4 w-20 mb-3 rounded-md" />
          <div className="flex gap-3">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>

        {/* Species chips */}
        <div>
          <Skeleton className="h-4 w-16 mb-3 rounded-md" />
          <div className="flex flex-wrap gap-2">
            {["w-14", "w-12", "w-14", "w-16", "w-12", "w-16", "w-20", "w-16"].map((w, i) => (
              <Skeleton key={i} className={`h-9 rounded-full ${w}`} />
            ))}
          </div>
        </div>

        {/* Title + Breed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-10 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Age + Unit + Gender */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-8 rounded-md" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
          <div className="col-span-2 sm:col-span-1 space-y-1.5">
            <Skeleton className="h-4 w-14 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Vaccination */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-10 w-full max-w-xs rounded-xl" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-10 rounded-md" />
          <Skeleton className="h-10 w-full max-w-xs rounded-xl" />
        </div>

        {/* Phone (create only) */}
        {showPhone && (
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ConversationSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="min-w-0 space-y-1.5">
          <Skeleton className="h-[14px] w-28 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>

      {/* Messages — anchored to bottom, colored like real bubbles */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end gap-3 py-2">
        <div className="flex justify-start">
          <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm h-14 w-48" />
        </div>
        <div className="flex justify-end">
          <div className="animate-pulse bg-blue-200 dark:bg-blue-900/50 rounded-2xl rounded-br-sm h-14 w-36" />
        </div>
        <div className="flex justify-start">
          <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm h-20 w-60" />
        </div>
        <div className="flex justify-end">
          <div className="animate-pulse bg-blue-200 dark:bg-blue-900/50 rounded-2xl rounded-br-sm h-14 w-44" />
        </div>
      </div>

      {/* Input — styled like the real textarea + send button */}
      <div className="flex items-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <div
          className="flex-1 animate-pulse border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800"
          style={{ minHeight: "44px" }}
        />
        <div className="w-[42px] h-[42px] shrink-0 animate-pulse bg-blue-300 dark:bg-blue-800 rounded-xl" />
      </div>
    </div>
  );
}
