import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, city, bio } = await req.json();

  if (bio && bio.length > 500) return NextResponse.json({ error: "Bio must be 500 characters or less" }, { status: 400 });

  await db.breederProfile.update({
    where: { userId: session.user.id },
    data: {
      ...(phone !== undefined && { phone: phone || null }),
      ...(city !== undefined && { city }),
      ...(bio !== undefined && { bio: bio || null }),
    },
  });

  return NextResponse.json({ ok: true });
}
