import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const listing = await db.listing.findUnique({
    where: { id },
    select: { breederId: true, breeder: { select: { userId: true } } },
  });

  if (!listing) return NextResponse.json({ ok: false }, { status: 404 });

  const session = await auth();
  if (session?.user?.id === listing.breeder.userId) {
    return NextResponse.json({ ok: false });
  }

  await db.listing.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({ ok: true });
}
