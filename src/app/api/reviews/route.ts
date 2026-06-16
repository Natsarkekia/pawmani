import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { breederId, rating, body } = await req.json();

  if (!breederId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  if (body && body.length > 1000) return NextResponse.json({ error: "Review must be 1000 characters or less" }, { status: 400 });

  // Prevent reviewing your own profile
  const profile = await db.breederProfile.findUnique({ where: { id: breederId } });
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (profile.userId === session.user.id) {
    return NextResponse.json({ error: "Cannot review yourself" }, { status: 403 });
  }

  await db.review.upsert({
    where: { reviewerId_breederId: { reviewerId: session.user.id, breederId } },
    update: { rating, body: body || null },
    create: { reviewerId: session.user.id, breederId, rating, body: body || null },
  });

  // Recalculate avgRating and reviewCount from actual data
  const agg = await db.review.aggregate({
    where: { breederId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await db.breederProfile.update({
    where: { id: breederId },
    data: {
      avgRating: agg._avg.rating ?? 0,
      reviewCount: agg._count.rating,
    },
  });

  revalidatePath(`/breeders/${breederId}`);

  // Bust the cached listing detail pages for this breeder too
  const listings = await db.listing.findMany({
    where: { breederId },
    select: { id: true },
  });
  for (const listing of listings) {
    revalidatePath(`/pets/${listing.id}`);
  }

  return NextResponse.json({ ok: true });
}
