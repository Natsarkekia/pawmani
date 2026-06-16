import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    select: { listingId: true },
  });

  return NextResponse.json(favorites.map((f) => f.listingId));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await req.json();
  if (!listingId) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }

  const existing = await db.favorite.findUnique({
    where: { userId_listingId: { userId: session.user.id, listingId } },
  });

  if (existing) {
    await db.favorite.delete({
      where: { userId_listingId: { userId: session.user.id, listingId } },
    });
    return NextResponse.json({ favorited: false });
  }

  await db.favorite.create({
    data: { userId: session.user.id, listingId },
  });
  return NextResponse.json({ favorited: true });
}
