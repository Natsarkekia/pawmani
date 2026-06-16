import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ count: 0 });

  const count = await db.message.count({
    where: {
      senderId: { not: session.user.id },
      readAt: null,
      conversation: {
        OR: [
          { buyerId: session.user.id },
          { breeder: { userId: session.user.id } },
        ],
      },
    },
  });

  return NextResponse.json({ count });
}
