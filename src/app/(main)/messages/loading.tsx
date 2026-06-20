import { Skeleton } from "@/components/ui/Skeleton";

function ConversationRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-[14px] w-28 rounded-md" />
          <Skeleton className="h-3 w-14 rounded-md shrink-0" />
        </div>
        <Skeleton className="h-3 w-40 rounded-md" />
        <Skeleton className="h-3 w-52 rounded-md" />
      </div>
    </div>
  );
}

export default function MessagesLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Skeleton className="h-8 w-36 mb-6 rounded-lg" />
      <div className="space-y-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <ConversationRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
