import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const conv = await db.conversation.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, title: true } },
      buyer: { select: { id: true, name: true, image: true } },
      breeder: { select: { id: true, user: { select: { id: true, name: true, image: true } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isParticipant = conv.buyerId === session.user.id || conv.breeder.user.id === session.user.id;
  if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.message.updateMany({
    where: { conversationId: id, senderId: { not: session.user.id }, readAt: null },
    data: { readAt: new Date() },
  });

  const isUserBuyer = conv.buyerId === session.user.id;
  const otherParty = isUserBuyer
    ? { id: conv.breeder.user.id, name: conv.breeder.user.name, image: conv.breeder.user.image }
    : { id: conv.buyer.id, name: conv.buyer.name, image: conv.buyer.image };

  return NextResponse.json({
    id: conv.id,
    listing: conv.listing,
    otherParty,
    messages: conv.messages.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      isMine: m.senderId === session.user.id,
    })),
  });
}
