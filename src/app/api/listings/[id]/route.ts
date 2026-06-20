import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

async function getOwnerProfile(userId: string, listingId: string) {
  const profile = await db.breederProfile.findUnique({ where: { userId } });
  if (!profile) return null;
  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.breederId !== profile.id) return null;
  return { profile, listing };
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await getOwnerProfile(session.user.id, id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { title, species, breed, ageValue, ageUnit, gender, purpose, price, description, vaccinationStatus, city, images } = body;

  if (title && title.length > 100)        return NextResponse.json({ error: "Title must be 100 characters or less" }, { status: 400 });
  if (breed && breed.length > 100)        return NextResponse.json({ error: "Breed must be 100 characters or less" }, { status: 400 });
  if (description && description.length > 2000) return NextResponse.json({ error: "Description must be 2000 characters or less" }, { status: 400 });

  if (!Array.isArray(images) || images.length === 0 || images.length > 4) {
    return NextResponse.json({ error: "Between 1 and 4 images required" }, { status: 400 });
  }
  const supabaseBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/`;
  if (!images.every((url: unknown) => typeof url === "string" && url.startsWith(supabaseBase))) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  // Find old images so we can delete removed ones from storage after the update
  const oldImages = await db.listingImage.findMany({ where: { listingId: id }, select: { url: true } });

  await db.listingImage.deleteMany({ where: { listingId: id } });

  await db.listing.update({
    where: { id },
    data: {
      title, species, breed,
      ageValue: Number(ageValue),
      ageUnit, gender, purpose,
      price: (purpose === "BREEDING" || purpose === "ADOPT") ? null : price ? Number(price) : null,
      description, vaccinationStatus, city,
      images: {
        create: (images as string[]).map((url: string, i: number) => ({
          url,
          displayOrder: i,
          isPrimary: i === 0,
        })),
      },
    },
  });

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/`;
  const removedPaths = oldImages
    .map((img) => img.url)
    .filter((url) => !(images as string[]).includes(url))
    .map((url) => url.replace(base, ""))
    .filter(Boolean);
  if (removedPaths.length > 0) {
    await supabaseAdmin.storage.from("pet-images").remove(removedPaths);
  }

  return NextResponse.json({ id });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await getOwnerProfile(session.user.id, id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const images = await db.listingImage.findMany({ where: { listingId: id }, select: { url: true } });

  await db.listing.delete({ where: { id } });

  if (images.length > 0) {
    const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/`;
    const paths = images.map((img) => img.url.replace(base, "")).filter(Boolean);
    if (paths.length > 0) {
      await supabaseAdmin.storage.from("pet-images").remove(paths);
    }
  }

  return NextResponse.json({ ok: true });
}
