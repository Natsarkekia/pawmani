import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PetCard } from "@/components/pets/PetCard";
import { FilterPanel } from "@/components/browse/FilterPanel";
import { MobileFilterDrawer } from "@/components/browse/MobileFilterDrawer";
import { SortSelect } from "@/components/browse/SortSelect";
import { PawPrint } from "lucide-react";
import { getT } from "@/lib/i18n/server";
import { findGeorgianCity } from "@/lib/cities";
import { BrowseSearchBar } from "@/components/browse/BrowseSearchBar";
import { PetGridSkeleton } from "@/components/ui/Skeleton";
import { BrowseProvider } from "@/components/browse/BrowseContext";
import { ListingsGridWrapper } from "@/components/browse/ListingsGridWrapper";
import type { Prisma, Species, Gender, VaccinationStatus, ListingPurpose } from "@prisma/client";
import type { Locale, TranslationKey } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta_browse") };
}

type SearchParams = Promise<{
  species?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  vaccination?: string;
  purpose?: string;
  sort?: string;
  page?: string;
  search?: string;
  city?: string;
}>;

const PER_PAGE = 12;

const getListings = unstable_cache(
  async (params: Awaited<SearchParams>) => _getListings(params),
  ["browse-listings"],
  { revalidate: 60 }
);

async function _getListings(params: Awaited<SearchParams>) {
  const where: Prisma.ListingWhereInput = { status: "AVAILABLE" };

  if (params.species) where.species = params.species as Species;
  if (params.gender) where.gender = params.gender as Gender;
  if (params.vaccination) where.vaccinationStatus = params.vaccination as VaccinationStatus;
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = Number(params.minPrice);
    if (params.maxPrice) where.price.lte = Number(params.maxPrice);
  }
  if (params.purpose) where.purpose = params.purpose as ListingPurpose;
  if (params.city) where.city = params.city;
  if (params.search) {
    const georgianCity = findGeorgianCity(params.search);
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { breed: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { city: { contains: params.search, mode: "insensitive" } },
      ...(georgianCity ? [{ city: georgianCity }] : []),
    ];
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    params.sort === "priceAsc"
      ? { price: "asc" }
      : params.sort === "priceDesc"
      ? { price: "desc" }
      : params.sort === "oldest"
      ? { createdAt: "asc" }
      : { createdAt: "desc" };

  const page = Math.max(1, Number(params.page ?? 1));
  const skip = (page - 1) * PER_PAGE;

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy,
      skip,
      take: PER_PAGE,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    db.listing.count({ where }),
  ]);

  return { listings, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}

function PaginationLink({
  page,
  current,
  searchParams,
}: {
  page: number;
  current: number;
  searchParams: Awaited<SearchParams>;
}) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => { if (v) params.set(k, v); });
  params.set("page", String(page));

  return (
    <a
      href={`/browse?${params.toString()}`}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        page === current
          ? "bg-blue-700 text-white"
          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500"
      }`}
    >
      {page}
    </a>
  );
}

async function getFavoriteIds(userId: string | undefined) {
  if (!userId) return new Set<string>();
  const favs = await db.favorite.findMany({
    where: { userId },
    select: { listingId: true },
  });
  return new Set(favs.map((f) => f.listingId));
}

async function ListingsGrid({ params, locale }: { params: Awaited<SearchParams>; locale: Locale }) {
  const [{ listings, total, page, totalPages }, session, { t }] = await Promise.all([
    getListings(params),
    auth(),
    getT(),
  ]);
  const favoriteIds = await getFavoriteIds(session?.user?.id);
  const availableLabel = total === 1 ? t("browse_available") : t("browse_availablePlural");

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <PawPrint className="w-14 h-14 mb-4 opacity-20" />
        <p className="font-semibold text-lg text-gray-500">{t("browse_noListings")}</p>
        <p className="text-sm mt-1">{t("browse_adjustFilters")}</p>
        <a href="/browse" className="mt-4 text-sm text-blue-700 hover:underline font-medium">
          {t("browse_clearFilters")}
        </a>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{total} {availableLabel}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {listings.map((listing) => (
          <PetCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            breed={listing.breed}
            species={listing.species}
            ageValue={listing.ageValue}
            ageUnit={listing.ageUnit}
            gender={listing.gender}
            price={listing.price}
            city={listing.city}
            imageUrl={listing.images[0]?.url ?? "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop"}
            isFavorited={favoriteIds.has(listing.id)}
            purpose={listing.purpose}
            locale={locale}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationLink key={p} page={p} current={page} searchParams={params} />
          ))}
        </div>
      )}
    </>
  );
}

export default async function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { t, locale } = await getT();

  const SPECIES_LABELS: Record<string, string> = {
    DOG: t("browse_dogs"), CAT: t("browse_cats"), BIRD: t("browse_birds"),
    RABBIT: t("browse_rabbits"), FISH: t("browse_fish"), RODENT: t("browse_rodents"),
    REPTILE: t("browse_reptiles"), EXOTIC: t("browse_exotic"),
  };
  const speciesLabel = params.species ? SPECIES_LABELS[params.species] ?? params.species : "";

  const withSpecies = (adjKey: TranslationKey) =>
    locale === "ka"
      ? `${t(adjKey)} ${speciesLabel}`
      : `${speciesLabel} ${t(adjKey)}`;

  const pageTitle = params.search
    ? `${t("browse_resultsFor")} "${params.search}"`
    : params.purpose === "BREEDING"
    ? params.species ? withSpecies("browse_forBreedingLabel") : t("browse_breedingMatches")
    : params.purpose === "ADOPT"
    ? params.species ? withSpecies("browse_forAdoptLabel") : t("browse_forAdopt")
    : params.purpose === "SALE"
    ? params.species ? withSpecies("browse_forSaleLabel") : t("browse_forSale")
    : params.species
    ? (locale === "ka" ? speciesLabel : `${t("browse_all")} ${speciesLabel}`)
    : t("browse_browseAll");

  return (
    <BrowseProvider>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {params.search ? t("browse_resultsFor") : pageTitle}
        </h1>
        <Suspense>
          <BrowseSearchBar initialValue={params.search ?? ""} />
        </Suspense>
      </div>

      <div className="flex gap-8">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-5 shadow">
            <Suspense>
              <FilterPanel />
            </Suspense>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <Suspense>
              <MobileFilterDrawer />
            </Suspense>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500 hidden sm:block">{t("browse_sortByLabel")}</span>
              <Suspense>
                <SortSelect />
              </Suspense>
            </div>
          </div>

          {/* Results grid — suspends on initial load, shows skeleton on filter change */}
          <ListingsGridWrapper>
            <Suspense fallback={<PetGridSkeleton count={12} />}>
              <ListingsGrid params={params} locale={locale} />
            </Suspense>
          </ListingsGridWrapper>
        </div>
      </div>
    </div>
    </BrowseProvider>
  );
}
