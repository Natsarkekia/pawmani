import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (!rateLimit(`listings:${getIp(req)}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title, species, breed, ageValue, ageUnit,
    gender, purpose, price, description, city, phone, images, vaccinationStatus,
  } = body;

  if (!title || !species || !breed || !ageValue || !ageUnit || !gender || !purpose || !description || !city || !vaccinationStatus) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (title.length > 100)       return NextResponse.json({ error: "Title must be 100 characters or less" }, { status: 400 });
  if (breed.length > 100)       return NextResponse.json({ error: "Breed must be 100 characters or less" }, { status: 400 });
  if (description.length > 2000) return NextResponse.json({ error: "Description must be 2000 characters or less" }, { status: 400 });

  if (!Array.isArray(images) || images.length === 0 || images.length > 4) {
    return NextResponse.json({ error: "Between 1 and 4 images required" }, { status: 400 });
  }
  const supabaseBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/`;
  if (!images.every((url: unknown) => typeof url === "string" && url.startsWith(supabaseBase))) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  const existing = await db.breederProfile.findUnique({ where: { userId: session.user.id } });

  const profile = await db.breederProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, city, phone: phone || null },
    update: { phone: phone || null },
  });

  if (!existing) {
    await db.user.update({ where: { id: session.user.id }, data: { role: "BREEDER" } });
  }

  const listing = await db.listing.create({
    data: {
      breederId: profile.id,
      title,
      species,
      breed,
      ageValue: Number(ageValue),
      ageUnit,
      gender,
      purpose,
      price: purpose === "BREEDING" ? null : price ? Number(price) : null,
      vaccinationStatus,
      description,
      city,
      status: "AVAILABLE",
      images: {
        create: (images as string[]).map((url: string, i: number) => ({
          url,
          displayOrder: i,
          isPrimary: i === 0,
        })),
      },
    },
  });

  return NextResponse.json({ id: listing.id });
}
