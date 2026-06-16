"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterPanel } from "./FilterPanel";
import { useSearchParams } from "next/navigation";

export function MobileFilterDrawer() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const filterCount = ["species", "gender", "minPrice", "maxPrice", "vaccination"].filter(
    (k) => searchParams.has(k)
  ).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-blue-300 transition-colors lg:hidden"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {filterCount > 0 && (
          <span className="bg-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto lg:hidden">
            <FilterPanel onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
