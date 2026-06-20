"use client";

import { useBrowse } from "./BrowseContext";
import { PetGridSkeleton } from "@/components/ui/Skeleton";

export function ListingsGridWrapper({ children }: { children: React.ReactNode }) {
  const { isFilterPending } = useBrowse();
  if (isFilterPending) return <PetGridSkeleton count={12} />;
  return <>{children}</>;
}
