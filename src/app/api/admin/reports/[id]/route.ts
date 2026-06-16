import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_STATUSES = ["OPEN", "REVIEWED", "DISMISSED", "ACTIONED"] as const;
type ReportStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status, adminNote } = await req.json();

  if (!VALID_STATUSES.includes(status as ReportStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await db.report.update({
    where: { id },
    data: {
      status,
      adminNote: adminNote?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true });
}
