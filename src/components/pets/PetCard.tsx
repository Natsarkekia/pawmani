"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCityName } from "@/lib/cities";
import { FavoriteButton } from "./FavoriteButton";
import { useLang } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n";

type PetCardProps = {
  id: string;
  title: string;
  breed: string;
  species: string;
  ageValue: number;
  ageUnit: string;
  gender: string;
  price: number | null;
  city: string;
  imageUrl: string;
  isFavorited?: boolean;
  purpose?: string;
  locale?: Locale;
};

function formatAge(value: number, unit: string, locale: Locale): string {
  if (locale === "ka") {
    const labels: Record<string, string> = { WEEKS: "კვირა", MONTHS: "თვე", YEARS: "წელი" };
    return `${value} ${labels[unit] ?? unit}`;
  }
  const labels: Record<string, string> = { WEEKS: "week", MONTHS: "month", YEARS: "year" };
  const label = labels[unit] ?? unit.toLowerCase();
  return `${value} ${label}${value !== 1 ? "s" : ""}`;
}

export function PetCard({
  id,
  title,
  breed,
  ageValue,
  ageUnit,
  gender,
  price,
  city,
  imageUrl,
  isFavorited = false,
  purpose,
  locale: localeProp,
}: PetCardProps) {
  const { t, locale: ctxLocale } = useLang();
  const locale = localeProp ?? ctxLocale;

  const genderLabel = gender.toLowerCase() === "male" ? t("card_male") : t("card_female");

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <Link href={`/pets/${id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <FavoriteButton listingId={id} initialFavorited={isFavorited} className="absolute top-3 right-3" />
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="bg-blue-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {genderLabel}
          </span>
          {purpose === "BREEDING" && (
            <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {t("card_breeding")}
            </span>
          )}
        </div>
      </Link>

      <Link href={`/pets/${id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{breed} · {formatAge(ageValue, ageUnit, locale)}</p>
          </div>
          <p className="text-blue-700 dark:text-blue-400 font-bold text-sm whitespace-nowrap shrink-0">{formatPrice(price, purpose)}</p>
        </div>
        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 dark:text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{getCityName(city, locale)}</span>
        </div>
      </Link>
    </div>
  );
}
