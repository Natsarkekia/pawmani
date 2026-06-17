"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { useLang } from "@/lib/i18n/client";

export function SearchBar() {
  const router = useRouter();
  const { t } = useLang();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = query.trim();
    router.push(q ? `/browse?search=${encodeURIComponent(q)}` : "/browse");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
      <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("search_placeholder")}
          className="flex-1 text-gray-900 placeholder-gray-400 outline-none text-sm bg-transparent"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-white text-blue-800 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm text-center shadow-lg"
      >
        {t("search_button")}
      </button>
    </div>
  );
}
