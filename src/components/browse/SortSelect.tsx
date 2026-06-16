"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n/client";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLang();
  const current = searchParams.get("sort") ?? "newest";

  const OPTIONS = [
    { label: t("browse_newestFirst"), value: "newest" },
    { label: t("browse_oldestFirst"), value: "oldest" },
    { label: t("browse_priceLow"), value: "priceAsc" },
    { label: t("browse_priceHigh"), value: "priceDesc" },
  ];

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.replace(`/browse?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-400 cursor-pointer"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
