import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PawPrint, Star, Plus } from "lucide-react";
import { DeleteListingButton } from "@/components/account/DeleteListingButton";
import { HideListingButton } from "@/components/account/HideListingButton";
import { PhoneEditor } from "@/components/account/PhoneEditor";
import { LocationEditor } from "@/components/account/LocationEditor";
import { BioEditor } from "@/components/account/BioEditor";
import { formatPrice } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const [session, { t }] = await Promise.all([auth(), getT()]);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      breederProfile: {
        include: {
          listings: {
            orderBy: { createdAt: "desc" },
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 flex items-center gap-5">
        <Avatar
          src={user.image}
          name={user.name}
          size={72}
          className="rounded-full border border-gray-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 truncate">{user.email}</p>
          <span className="inline-block mt-2 text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
            {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Listings */}
      {user.breederProfile ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-blue-600" />
                {t("account_myListings")}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {user.breederProfile.avgRating.toFixed(1)}
              </div>
              <div className="mt-1 space-y-1">
                <LocationEditor initialCity={user.breederProfile.city} />
                <PhoneEditor initial={user.breederProfile.phone} />
                <BioEditor initial={user.breederProfile.bio} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/breeders/${user.breederProfile.id}`}
                className="text-sm text-blue-700 hover:underline font-medium"
              >
                {t("account_publicProfile")}
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {t("account_new")}
              </Link>
            </div>
          </div>

          {user.breederProfile.listings.length > 0 ? (
            <div className="space-y-3">
              {user.breederProfile.listings.map((listing) => (
                <div
                  key={listing.id}
                  className={`flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${listing.status === "ARCHIVED" ? "opacity-50" : ""}`}
                >
                  <Link href={`/pets/${listing.id}`} className="shrink-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                      {listing.images[0] && (
                        <Image
                          src={listing.images[0].url}
                          alt={listing.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </Link>
                  <Link href={`/pets/${listing.id}`} className="flex-1 min-w-0 hidden sm:block">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{listing.title}</p>
                      {listing.status === "ARCHIVED" && (
                        <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full shrink-0">
                          {t("account_hidden")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {listing.price != null
                        ? formatPrice(listing.price)
                        : listing.purpose === "BREEDING"
                          ? t("card_breeding")
                          : listing.purpose === "ADOPT"
                            ? t("card_adopt")
                            : t("card_negotiable")} ·{" "}
                      <span className={listing.purpose === "BREEDING" ? "text-green-600" : listing.purpose === "ADOPT" ? "text-purple-600" : "text-blue-600"}>
                        {listing.purpose === "BREEDING" ? t("account_breeding") : listing.purpose === "ADOPT" ? t("account_forAdopt") : t("account_forSale")}
                      </span>
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <HideListingButton id={listing.id} status={listing.status} />
                    <Link
                      href={`/edit/${listing.id}`}
                      className="text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    >
                      {t("account_edit")}
                    </Link>
                    <DeleteListingButton id={listing.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-gray-400">
              <PawPrint className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">{t("account_noListings")}</p>
              <Link href="/create" className="mt-2 text-sm text-blue-700 hover:underline">{t("account_postFirstPet")}</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center">
          <PawPrint className="w-10 h-10 text-blue-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">{t("account_readyToPost")}</p>
          <p className="text-sm text-gray-500 mb-4">{t("account_createFirstListing")}</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("nav_postPet")}
          </Link>
        </div>
      )}
    </div>
  );
}
