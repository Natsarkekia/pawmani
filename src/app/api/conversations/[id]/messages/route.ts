import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!rateLimit(`messages:${getIp(req)}`, 60, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) return NextResponse.json({ error: "Message is empty" }, { status: 400 });
  if (content.length > 1000) return NextResponse.json({ error: "Message must be 1000 characters or less" }, { status: 400 });

  const conv = await db.conversation.findUnique({
    where: { id },
    include: { breeder: { select: { user: { select: { id: true } } } } },
  });
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isParticipant = conv.buyerId === session.user.id || conv.breeder.user.id === session.user.id;
  if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const message = await db.message.create({
    data: { conversationId: id, senderId: session.user.id, content: content.trim() },
  });

  await db.conversation.update({ where: { id }, data: { lastMsgAt: new Date() } });

  return NextResponse.json({ id: message.id, content: message.content, createdAt: message.createdAt, isMine: true });
}
