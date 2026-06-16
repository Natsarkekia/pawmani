import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

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
