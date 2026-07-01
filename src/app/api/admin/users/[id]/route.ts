import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

const VALID_ROLES = ["BUYER", "BREEDER", "ADMIN"] as const;
type Role = (typeof VALID_ROLES)[number];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { role } = await req.json();

  if (!VALID_ROLES.includes(role as Role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  await db.user.update({ where: { id }, data: { role } });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  // Collect listing images for Supabase storage cleanup
  const breederProfile = await db.breederProfile.findUnique({
    where: { userId: id },
    include: { listings: { include: { images: { select: { url: true } } } } },
  });

  await db.user.delete({ where: { id } });

  // Clean up Supabase images after DB delete succeeds
  if (breederProfile) {
    const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/`;
    const paths = breederProfile.listings
      .flatMap((l) => l.images)
      .map((img) => img.url.replace(base, ""))
      .filter(Boolean);
    if (paths.length > 0) {
      await supabaseAdmin.storage.from("pet-images").remove(paths);
    }
  }

  revalidatePath("/admin/users");
  revalidatePath("/browse");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
