import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { MapPin, Star, ShieldCheck, ChevronRight, MessageSquare, PawPrint, Phone } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PetCard } from "@/components/pets/PetCard";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewForm } from "@/components/breeders/ReviewForm";
import { Avatar } from "@/components/ui/Avatar";
import { ReportButton } from "@/components/pets/ReportModal";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

const getBreeder = unstable_cache(
  async (id: string) =>
    db.breederProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, image: true, createdAt: true, id: true } },
        listings: {
          where: { status: "AVAILABLE" },
          orderBy: { createdAt: "desc" },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            reviewer: { select: { name: true, image: true } },
          },
        },
      },
    }),
  ["breeder-profile"],
  { revalidate: 60 }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const breeder = await getBreeder(id);
  if (!breeder) return { title: "Breeder Not Found" };
  return {
    title: `${breeder.user.name} — Breeder Profile`,
    description: breeder.bio ?? `View listings and reviews for ${breeder.user.name} on Pawmani.`,
  };
}

const RATING_BARS = [5, 4, 3, 2, 1];

export default async function BreederProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [breeder, session, { t, locale }] = await Promise.all([getBreeder(id), auth(), getT()]);
  if (!breeder) notFound();

  const isOwnProfile = session?.user?.id === breeder.userId;

  const existingReview = session?.user?.id
    ? await db.review.findUnique({
        where: { reviewerId_breederId: { reviewerId: session.user.id, breederId: id } },
        select: { rating: true, body: true },
      })
    : null;

  const memberSince = new Date(breeder.user.createdAt).getFullYear();
  const ratingCounts = RATING_BARS.map(
    (r) => breeder.reviews.filter((rev) => rev.rating === r).length
  );

  const listingCount = breeder.listings.length;
  const reviewCount = breeder.reviewCount;

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-blue-300 mb-8">
            <Link href="/" className="hover:text-white">{t("nav_home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/browse" className="hover:text-white">{t("browse_browseAll")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{breeder.user.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar
              src={breeder.user.image}
              name={breeder.user.name}
              size={96}
              className="rounded-2xl border-2 border-white/20 shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">{breeder.user.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-200 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {breeder.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {t("bp_memberSince")} {memberSince}
                </span>
              </div>

              {breeder.bio && (
                <p className="text-blue-100 mt-4 text-sm leading-relaxed max-w-2xl">
                  {breeder.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{listingCount}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{t("bp_activeListings")}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <p className="text-2xl font-bold">{breeder.avgRating.toFixed(1)}</p>
                  </div>
                  <p className="text-blue-300 text-xs mt-0.5">{t("bp_avgRating")}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{reviewCount}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{t("bp_reviewsSection")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: listings + reviews */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active listings */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                {t("bp_activeListings")}
                <span className="ml-2 text-base font-normal text-gray-400">
                  ({listingCount})
                </span>
              </h2>

              {listingCount > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {breeder.listings.map((listing) => (
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
                      imageUrl={
                        listing.images[0]?.url ??
                        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop"
                      }
                      locale={locale}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                  <PawPrint className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">{t("bp_noActiveListings")}</p>
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                {t("bp_reviewsSection")}
                <span className="ml-2 text-base font-normal text-gray-400">
                  ({breeder.reviews.length})
                </span>
              </h2>

              {/* Review form */}
              {!isOwnProfile && (
                session ? (
                  <div className="mb-6">
                    <ReviewForm breederId={id} existing={existingReview} />
                  </div>
                ) : (
                  <div className="mb-6 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <Link href={`/login?callbackUrl=/breeders/${id}`} className="text-blue-700 dark:text-blue-400 font-medium hover:underline">
                        {t("bp_signInToReview")}
                      </Link>{" "}
                      {t("bp_toLeaveReview")}
                    </p>
                  </div>
                )
              )}

              {breeder.reviews.length > 0 ? (
                <div className="space-y-4">
                  {breeder.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        {review.reviewer.image ? (
                          <Image
                            src={review.reviewer.image}
                            alt={review.reviewer.name ?? "Reviewer"}
                            width={40}
                            height={40}
                            className="rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold shrink-0">
                            {(review.reviewer.name ?? "U")[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {review.reviewer.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <StarRating rating={review.rating} />
                          {review.body && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                              {review.body}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                  <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">{t("bp_noReviews")}</p>
                </div>
              )}
            </section>
          </div>

          {/* Right: rating summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Rating breakdown */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t("bp_ratingSummary")}</h3>

                <div className="flex items-center gap-4 mb-5">
                  <p className="text-5xl font-bold text-gray-900 dark:text-white">
                    {breeder.avgRating.toFixed(1)}
                  </p>
                  <div>
                    <StarRating rating={breeder.avgRating} size="md" />
                    <p className="text-sm text-gray-400 mt-1">
                      {reviewCount} {reviewCount !== 1 ? t("bp_reviews") : t("bp_review")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {RATING_BARS.map((r, i) => (
                    <div key={r} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-4 shrink-0">{r}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all"
                          style={{
                            width:
                              breeder.reviewCount > 0
                                ? `${(ratingCounts[i] / breeder.reviewCount) * 100}%`
                                : "0%",
                          }}
                        />
                      </div>
                      <span className="text-gray-400 w-4 text-right shrink-0">
                        {ratingCounts[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick info */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  {breeder.city}
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  {t("bp_memberSince")} {memberSince}
                </div>
                <div className="flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-blue-600 shrink-0" />
                  {listingCount} {listingCount !== 1 ? t("bp_listingsPlural") : t("bp_listings")}
                </div>
                {breeder.phone && (
                  <a
                    href={`tel:${breeder.phone}`}
                    className="flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:underline font-medium"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    {breeder.phone}
                  </a>
                )}
              </div>

              <Link
                href="/browse"
                className="block w-full text-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {t("home_ctaButton")}
              </Link>

              {!isOwnProfile && (
                <div className="flex justify-center">
                  <ReportButton targetType="BREEDER" targetId={id} targetName={breeder.user.name ?? "this breeder"} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
