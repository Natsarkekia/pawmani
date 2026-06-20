"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { useLang } from "@/lib/i18n/client";

export function BrowseSearchBar({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLang();
  const [query, setQuery] = useState(initialValue);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const q = query.trim();
    if (q) { params.set("search", q); } else { params.delete("search"); }
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
      <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 shadow-sm">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("search_placeholder")}
          className="flex-1 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent outline-none"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm cursor-pointer"
      >
        {t("search_button")}
      </button>
    </div>
  );
}
