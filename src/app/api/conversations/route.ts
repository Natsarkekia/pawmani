import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.breederProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const conversations = await db.conversation.findMany({
    where: {
      OR: [
        { buyerId: session.user.id },
        ...(profile ? [{ breederId: profile.id }] : []),
      ],
    },
    orderBy: { lastMsgAt: "desc" },
    include: {
      listing: {
        select: { id: true, title: true, images: { where: { isPrimary: true }, take: 1 } },
      },
      buyer: { select: { id: true, name: true, image: true } },
      breeder: { select: { id: true, user: { select: { id: true, name: true, image: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const result = await Promise.all(
    conversations.map(async (conv) => {
      const isUserBuyer = conv.buyerId === session.user.id;
      const otherParty = isUserBuyer
        ? { name: conv.breeder.user.name, image: conv.breeder.user.image }
        : { name: conv.buyer.name, image: conv.buyer.image };

      const unreadCount = await db.message.count({
        where: { conversationId: conv.id, senderId: { not: session.user.id }, readAt: null },
      });

      return {
        id: conv.id,
        listing: { id: conv.listing.id, title: conv.listing.title, imageUrl: conv.listing.images[0]?.url ?? null },
        otherParty,
        lastMessage: conv.messages[0]
          ? { content: conv.messages[0].content, createdAt: conv.messages[0].createdAt, isMine: conv.messages[0].senderId === session.user.id }
          : null,
        unreadCount,
      };
    })
  );

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId, breederId } = await req.json();
  if (!listingId || !breederId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { breeder: { select: { userId: true } } },
  });
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (listing.breeder.userId === session.user.id) {
    return NextResponse.json({ error: "Cannot message your own listing" }, { status: 403 });
  }

  const conv = await db.conversation.upsert({
    where: { listingId_buyerId: { listingId, buyerId: session.user.id } },
    create: { listingId, buyerId: session.user.id, breederId },
    update: {},
  });

  return NextResponse.json({ id: conv.id });
}
