import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Star, ShieldCheck, ChevronRight, Check } from "lucide-react";
import { db } from "@/lib/db";
import { PhotoGallery } from "@/components/pets/PhotoGallery";
import { ContactButton } from "@/components/pets/ContactModal";
import { ReportButton } from "@/components/pets/ReportModal";
import { PetCard } from "@/components/pets/PetCard";
import { formatPrice } from "@/lib/utils";
import { getCityName } from "@/lib/cities";
import { Avatar } from "@/components/ui/Avatar";
import { getT } from "@/lib/i18n/server";
import type { Locale, TranslationKey } from "@/lib/i18n";
import type { Metadata } from "next";

const getListing = unstable_cache(
  async (id: string) =>
    db.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        breeder: {
          include: {
            user: { select: { id: true, name: true, image: true } },
            listings: {
              where: { status: "AVAILABLE" },
              select: { id: true },
            },
          },
        },
      },
    }),
  ["listing"],
  { revalidate: 60 }
);

const getRelated = unstable_cache(
  async (species: string, excludeId: string) =>
    db.listing.findMany({
      where: { species: species as never, status: "AVAILABLE", NOT: { id: excludeId } },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
  ["related-listings"],
  { revalidate: 60 }
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "Listing Not Found" };
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
  };
}

function formatAgeLocale(value: number, unit: string, locale: Locale, t: (k: TranslationKey) => string): string {
  if (locale === "ka") {
    const label: Record<string, string> = { WEEKS: t("age_weeks"), MONTHS: t("age_months"), YEARS: t("age_years") };
    return `${value} ${label[unit] ?? unit}`;
  }
  const singular: Record<string, string> = { WEEKS: "week", MONTHS: "month", YEARS: "year" };
  const plural: Record<string, string> = { WEEKS: "weeks", MONTHS: "months", YEARS: "years" };
  return `${value} ${value === 1 ? (singular[unit] ?? unit) : (plural[unit] ?? unit)}`;
}

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, { t, locale }] = await Promise.all([
    getListing(id),
    getT(),
  ]);
  if (!listing) notFound();

  const related = await getRelated(listing.species, id);

  const VACCINATION_LABELS = {
    FULL: { label: t("pet_fullyVaccinated"), color: "bg-green-100 text-green-700" },
    PARTIAL: { label: t("pet_partialVaccinated"), color: "bg-yellow-100 text-yellow-700" },
    NONE: { label: t("pet_notVaccinated"), color: "bg-gray-100 text-gray-500" },
  };

  const SPECIES_LABEL: Record<string, string> = {
    DOG: t("browse_dogs"), CAT: t("browse_cats"), BIRD: t("browse_birds"), RABBIT: t("browse_rabbits"),
    FISH: t("browse_fish"), RODENT: t("browse_rodents"), REPTILE: t("browse_reptiles"), EXOTIC: t("browse_exotic"),
  };

  const GENDER_LABEL: Record<string, string> = {
    MALE: t("form_male"), FEMALE: t("form_female"),
  };

  const vax = VACCINATION_LABELS[listing.vaccinationStatus];

  const details = [
    { label: t("pet_species"), value: SPECIES_LABEL[listing.species] ?? listing.species },
    { label: t("pet_breed"), value: listing.breed },
    { label: t("pet_age"), value: formatAgeLocale(listing.ageValue, listing.ageUnit, locale, t) },
    { label: t("pet_gender"), value: GENDER_LABEL[listing.gender] ?? listing.gender },
    { label: t("pet_vaccination"), value: vax.label },
    ...(listing.city ? [{ label: t("pet_location"), value: getCityName(listing.city, locale) }] : []),
  ];

  const activeCount = listing.breeder.listings.length;
  const activeLabel = activeCount === 1 ? t("pet_activeListing") : t("pet_activeListings");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-700">{t("nav_home")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/browse" className="hover:text-blue-700">{t("browse_browseAll")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/browse?species=${listing.species}`} className="hover:text-blue-700">
          {SPECIES_LABEL[listing.species]}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{listing.title}</span>
      </nav>

      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{listing.title}</h1>
        <p className="text-2xl font-bold text-blue-700 mt-1">{formatPrice(listing.price, listing.purpose)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-8">
          <PhotoGallery images={listing.images} title={listing.title} />

          {/* Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("pet_details")}</h2>
            <div className="grid grid-cols-2 gap-3">
              {details.map((d) => (
                <div key={d.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{d.label}</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t("pet_about")}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{listing.description}</p>
          </div>

          {/* Vaccination badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${vax.color}`}>
              <Check className="w-3.5 h-3.5" />
              {vax.label}
            </span>
          </div>
        </div>

        {/* Right column — unified breeder + contact card */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-5">
              {/* Breeder info */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t("pet_listedBy")}</p>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={listing.breeder.user.image}
                    name={listing.breeder.user.name}
                    size={48}
                    className="rounded-full border border-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{listing.breeder.user.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {listing.breeder.avgRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({listing.breeder.reviewCount} {activeCount === 1 ? t("bp_review") : t("bp_reviews")})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breeder meta */}
              <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600" />
                  {activeCount} {activeLabel}
                </div>
              </div>

              {listing.breeder.bio && (
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {listing.breeder.bio}
                </p>
              )}

              <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-3">
                {listing.status === "AVAILABLE" ? (
                  <ContactButton
                    breederName={listing.breeder.user.name ?? "the breeder"}
                    breederPhone={listing.breeder.phone}
                    listingTitle={listing.title}
                    listingId={listing.id}
                    breederId={listing.breederId}
                    breederUserId={listing.breeder.user.id}
                  />
                ) : (
                  <div className="w-full text-center py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium rounded-xl text-sm">
                    {t("pet_notAvailable")}
                  </div>
                )}
                <Link
                  href={`/breeders/${listing.breederId}`}
                  className="block w-full text-center border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  {t("pet_viewProfile")}
                </Link>
                <div className="flex justify-center pt-1">
                  <ReportButton targetType="LISTING" targetId={listing.id} targetName={listing.title} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related listings */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("pet_more")} {SPECIES_LABEL[listing.species]}</h2>
            <Link href={`/browse?species=${listing.species}`} className="text-sm text-blue-700 hover:underline font-medium">
              {t("pet_viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((r) => (
              <PetCard
                key={r.id}
                id={r.id}
                title={r.title}
                breed={r.breed}
                species={r.species}
                ageValue={r.ageValue}
                ageUnit={r.ageUnit}
                gender={r.gender}
                price={r.price}
                city={r.city}
                imageUrl={
                  r.images[0]?.url ??
                  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop"
                }
                purpose={r.purpose}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
