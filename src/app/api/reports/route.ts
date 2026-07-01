import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (!await rateLimit(`reports:${getIp(req)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many reports" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetType, targetId, reason, explanation } = await req.json();

  if (!targetType || !targetId || !reason) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["LISTING", "BREEDER", "REVIEW", "MESSAGE"].includes(targetType)) {
    return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
  }

  if (explanation && explanation.length > 500) {
    return NextResponse.json({ error: "Explanation too long" }, { status: 400 });
  }

  const fullReason = explanation?.trim()
    ? `${reason}: ${explanation.trim()}`
    : reason;

  await db.report.create({
    data: {
      reporterId: session.user.id,
      targetType,
      targetId,
      reason: fullReason,
    },
  });

  revalidatePath("/admin/reports");

  return NextResponse.json({ ok: true });
}
