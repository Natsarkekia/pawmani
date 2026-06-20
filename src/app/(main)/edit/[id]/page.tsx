import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditListingForm } from "./EditListingForm";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta_editListing") };
}

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/edit/${id}`);

  const profile = await db.breederProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) notFound();

  const listing = await db.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { displayOrder: "asc" } } },
  });

  if (!listing || listing.breederId !== profile.id) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Listing</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Changes are published immediately.</p>
      </div>
      <EditListingForm
        listing={{
          id: listing.id,
          title: listing.title,
          species: listing.species,
          breed: listing.breed,
          ageValue: listing.ageValue,
          ageUnit: listing.ageUnit,
          gender: listing.gender,
          purpose: listing.purpose,
          price: listing.price,
          description: listing.description,
          vaccinationStatus: listing.vaccinationStatus,
          city: listing.city,
          images: listing.images.map((img) => img.url),
        }}
      />
    </div>
  );
}
