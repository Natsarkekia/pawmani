import Link from "next/link";
import { Shield, Heart, Star, ArrowRight, PawPrint, Sparkles, Home } from "lucide-react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PetCard } from "@/components/pets/PetCard";
import { SearchBar } from "@/components/home/SearchBar";
import { getT } from "@/lib/i18n/server";

const getFeaturedListings = unstable_cache(
  async () =>
    db.listing.findMany({
      where: { status: "AVAILABLE" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
  ["featured-listings"],
  { revalidate: 60 }
);

export default async function HomePage() {
  const [listings, session, { t, locale }] = await Promise.all([
    getFeaturedListings(),
    auth(),
    getT(),
  ]);

  let favoriteIds = new Set<string>();
  if (session?.user?.id) {
    const favs = await db.favorite.findMany({
      where: { userId: session.user.id },
      select: { listingId: true },
    });
    favoriteIds = new Set(favs.map((f) => f.listingId));
  }

  const SPECIES = [
    { label: t("home_dogs"), value: "DOG", emoji: "🐕", color: "bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800 hover:border-amber-400" },
    { label: t("home_cats"), value: "CAT", emoji: "🐈", color: "bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-800 hover:border-purple-400" },
    { label: t("home_birds"), value: "BIRD", emoji: "🦜", color: "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800 hover:border-green-400" },
    { label: t("home_rabbits"), value: "RABBIT", emoji: "🐇", color: "bg-pink-100 dark:bg-pink-900/20 border-pink-300 dark:border-pink-800 hover:border-pink-400" },
    { label: t("home_fish"), value: "FISH", emoji: "🐟", color: "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800 hover:border-blue-400" },
    { label: t("home_rodents"), value: "RODENT", emoji: "🐹", color: "bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800 hover:border-orange-400" },
    { label: t("home_reptiles"), value: "REPTILE", emoji: "🐍", color: "bg-lime-100 dark:bg-lime-900/20 border-lime-300 dark:border-lime-800 hover:border-lime-400" },
    { label: t("home_exotic"), value: "EXOTIC", emoji: "🦎", color: "bg-teal-100 dark:bg-teal-900/20 border-teal-300 dark:border-teal-800 hover:border-teal-400" },
  ];

  const WHY_US = [
    { icon: Sparkles, title: t("home_matchTitle"), description: t("home_matchDesc") },
    { icon: Shield, title: t("home_breedersTitle"), description: t("home_breedersDesc") },
    { icon: Star, title: t("home_reviewsTitle"), description: t("home_reviewsDesc") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-center sm:text-left">
              {t("home_heroTitle1")}<br />
              <span className="text-blue-300">{t("home_heroTitle2")}</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl text-center sm:text-left">{t("home_heroSubtitle")}</p>

            <SearchBar />
          </div>

          {/* Floating island strip */}
          <div className="mt-8 bg-white dark:bg-slate-900 border border-blue-100 dark:border-transparent rounded-2xl px-4 py-4">
            <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-slate-700">
              <Link href="/browse?purpose=BREEDING" className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 py-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                </div>
                <div className="min-w-0 text-center sm:text-left">
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{t("home_stripMatchTitle")}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate hidden sm:block">{t("home_stripMatchDesc")}</p>
                </div>
              </Link>
              <Link href="/browse?purpose=SALE" className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 py-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <PawPrint className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="min-w-0 text-center sm:text-left">
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{t("home_stripSaleTitle")}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate hidden sm:block">{t("home_stripSaleDesc")}</p>
                </div>
              </Link>
              <Link href="/browse?purpose=ADOPT" className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 py-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                </div>
                <div className="min-w-0 text-center sm:text-left">
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{t("home_stripAdoptTitle")}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate hidden sm:block">{t("home_stripAdoptDesc")}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by species */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("home_browseBySpecies")}</h2>
          <Link href="/browse" className="text-blue-700 text-sm font-medium hover:underline flex items-center gap-1">
            {t("home_viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SPECIES.map((s) => (
            <Link key={s.value} href={`/browse?species=${s.value}`} className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${s.color}`}>
              <span className="text-4xl">{s.emoji}</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="bg-gray-50 dark:bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("home_recentlyListed")}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t("home_freshListings")}</p>
            </div>
            <Link href="/browse" className="text-blue-700 text-sm font-medium hover:underline flex items-center gap-1">
              {t("home_viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <div className="text-center py-16 text-gray-400">
              <PawPrint className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t("home_noListings")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Pawmani */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("home_whyTitle")}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">{t("home_whySubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WHY_US.map((item) => (
            <div key={item.title} className="text-center p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-5">
                <item.icon className="w-7 h-7 text-blue-700 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home_ctaTitle")}</h2>
          <p className="text-blue-200 mb-8 max-w-lg mx-auto">{t("home_ctaSubtitle")}</p>
          <Link href="/browse" className="inline-flex items-center gap-2 bg-white text-blue-800 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            {t("home_ctaButton")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
