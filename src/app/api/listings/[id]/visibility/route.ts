import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const profile = await db.breederProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing || listing.breederId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { status } = await req.json();
  if (status !== "AVAILABLE" && status !== "ARCHIVED") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await db.listing.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
