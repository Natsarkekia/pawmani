"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GEORGIAN_CITIES, getCityName } from "@/lib/cities";
import { useLang } from "@/lib/i18n/client";
import { useBrowse } from "./BrowseContext";

const inactiveChip = "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300";
const activeChip = "bg-blue-700 text-white border-blue-700";

type Props = { onClose?: () => void };

export function FilterPanel({ onClose }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useLang();
  const { startFilterTransition } = useBrowse();
  const [pending, setPending] = useState<Record<string, string>>({});

  useEffect(() => {
    setPending({});
  }, [searchParams]);

  const get = (key: string) => key in pending ? pending[key] : searchParams.get(key) ?? "";

  const set = useCallback(
    (key: string, value: string) => {
      setPending(prev => ({ ...prev, [key]: value }));
      startFilterTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) { params.set(key, value); } else { params.delete(key); }
        params.delete("page");
        router.replace(`/browse?${params.toString()}`);
      });
    },
    [router, searchParams, startFilterTransition]
  );

  const clearAll = () => {
    setPending({});
    router.replace("/browse");
  };

  const hasFilters = ["species", "gender", "minPrice", "maxPrice", "vaccination", "purpose", "city"].some(
    (k) => searchParams.has(k)
  );

  const SPECIES = [
    { label: t("browse_all"), value: "" },
    { label: t("browse_dogs"), value: "DOG" },
    { label: t("browse_cats"), value: "CAT" },
    { label: t("browse_birds"), value: "BIRD" },
    { label: t("browse_rabbits"), value: "RABBIT" },
    { label: t("browse_fish"), value: "FISH" },
    { label: t("browse_rodents"), value: "RODENT" },
    { label: t("browse_reptiles"), value: "REPTILE" },
    { label: t("browse_exotic"), value: "EXOTIC" },
  ];

  const GENDERS = [
    { label: t("browse_any"), value: "" },
    { label: t("browse_male"), value: "MALE" },
    { label: t("browse_female"), value: "FEMALE" },
  ];

  const PURPOSES = [
    { label: t("browse_all"), value: "" },
    { label: t("browse_forSale"), value: "SALE" },
    { label: t("browse_forBreeding"), value: "BREEDING" },
    { label: t("browse_forAdopt"), value: "ADOPT" },
  ];

  const VACCINATION = [
    { label: t("browse_any"), value: "" },
    { label: t("browse_fullyVaccinated"), value: "FULL" },
    { label: t("browse_partial"), value: "PARTIAL" },
    { label: t("browse_none"), value: "NONE" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white">{t("browse_filters")}</h2>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-blue-700 dark:text-blue-400 hover:underline font-medium cursor-pointer">
              {t("browse_clearAll")}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 lg:hidden cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("browse_purpose")}</p>
        <div className="flex flex-wrap gap-2">
          {PURPOSES.map((p) => (
            <button key={p.value} onClick={() => set("purpose", p.value)} className={cn("px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer",
              get("purpose") === p.value
                ? p.value === "BREEDING" ? "bg-green-600 text-white border-green-600"
                  : p.value === "ADOPT" ? "bg-purple-600 text-white border-purple-600"
                  : activeChip
                : inactiveChip
            )}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Species */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("browse_species")}</p>
        <div className="flex flex-wrap gap-2">
          {SPECIES.map((s) => (
            <button key={s.value} onClick={() => set("species", s.value)} className={cn("px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer",
              get("species") === s.value ? activeChip : inactiveChip
            )}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("browse_gender")}</p>
        <div className="flex gap-2">
          {GENDERS.map((g) => (
            <button key={g.value} onClick={() => set("gender", g.value)} className={cn("px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer",
              get("gender") === g.value ? activeChip : inactiveChip
            )}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("browse_city")}</p>
        <select value={get("city")} onChange={(e) => set("city", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer">
          <option value="">{t("browse_allCities")}</option>
          {GEORGIAN_CITIES.map((c) => (
            <option key={c} value={c}>{getCityName(c, locale)}</option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("browse_priceRange")}</p>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₾</span>
            <input type="number" placeholder={t("browse_min")} defaultValue={get("minPrice")} onBlur={(e) => set("minPrice", e.target.value)}
              className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <span className="text-gray-400 text-sm">{t("browse_to")}</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₾</span>
            <input type="number" placeholder={t("browse_max")} defaultValue={get("maxPrice")} onBlur={(e) => set("maxPrice", e.target.value)}
              className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Vaccination */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("browse_vaccination")}</p>
        <div className="flex flex-wrap gap-2">
          {VACCINATION.map((v) => (
            <button key={v.value} onClick={() => set("vaccination", v.value)} className={cn("px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer",
              get("vaccination") === v.value ? activeChip : inactiveChip
            )}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
