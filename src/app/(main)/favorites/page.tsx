import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, PawPrint } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PetCard } from "@/components/pets/PetCard";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta_favourites") };
}
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const [session, { t, locale }] = await Promise.all([auth(), getT()]);
  if (!session?.user?.id) redirect("/login?callbackUrl=/favorites");

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  const active = favorites.filter((f) => f.listing.status !== "ARCHIVED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("fav_title")}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {active.length} {active.length !== 1 ? t("fav_savedPlural") : t("fav_saved")}
          </p>
        </div>
      </div>

      {active.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {active.map((fav) => (
            <PetCard
              key={fav.listing.id}
              id={fav.listing.id}
              title={fav.listing.title}
              breed={fav.listing.breed}
              species={fav.listing.species}
              ageValue={fav.listing.ageValue}
              ageUnit={fav.listing.ageUnit}
              gender={fav.listing.gender}
              price={fav.listing.price}
              city={fav.listing.city}
              imageUrl={
                fav.listing.images[0]?.url ??
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop"
              }
              isFavorited={true}
              purpose={fav.listing.purpose}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-28 text-gray-400">
          <PawPrint className="w-14 h-14 mb-4 opacity-20" />
          <p className="text-lg font-semibold text-gray-500">{t("fav_empty")}</p>
          <p className="text-sm mt-1 mb-6">{t("fav_tapHeart")}</p>
          <Link
            href="/browse"
            className="bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
          >
            {t("fav_browse")}
          </Link>
        </div>
      )}
    </div>
  );
}
