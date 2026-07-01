import { db } from "@/lib/db";
import { ReportCard } from "./ReportCard";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await db.report.findMany({
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" },
    ],
    include: {
      reporter: { select: { name: true, email: true } },
    },
  });

  const listingReportIds = reports
    .filter((r) => r.targetType === "LISTING")
    .map((r) => r.targetId);

  const breederReportIds = reports
    .filter((r) => r.targetType === "BREEDER")
    .map((r) => r.targetId);

  const [existingListings, reportedBreeders] = await Promise.all([
    db.listing.findMany({
      where: { id: { in: listingReportIds } },
      select: { id: true },
    }),
    db.breederProfile.findMany({
      where: { id: { in: breederReportIds } },
      select: { id: true, user: { select: { email: true } } },
    }),
  ]);

  const existingListingIds = new Set(existingListings.map((l) => l.id));
  const breederEmailMap = new Map(reportedBreeders.map((b) => [b.id, b.user.email]));

  const open = reports.filter((r) => r.status === "OPEN");
  const rest = reports.filter((r) => r.status !== "OPEN");

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">
          {open.length} open · {reports.length} total
        </p>
      </div>

      {reports.length === 0 && (
        <div className="rounded-xl border border-gray-800 p-10 text-center text-gray-600">
          No reports yet
        </div>
      )}

      {open.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Open</h2>
          <div className="space-y-3">
            {open.map((r) => (
              <ReportCard
                key={r.id}
                listingExists={r.targetType === "LISTING" ? existingListingIds.has(r.targetId) : false}
                report={{
                  id: r.id,
                  targetType: r.targetType,
                  targetId: r.targetId,
                  reason: r.reason,
                  status: r.status,
                  adminNote: r.adminNote,
                  createdAt: r.createdAt,
                  reporterName: r.reporter.name ?? r.reporter.email ?? "Unknown",
                  reportedEmail: r.targetType === "BREEDER" ? (breederEmailMap.get(r.targetId) ?? null) : null,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Resolved</h2>
          <div className="space-y-3">
            {rest.map((r) => (
              <ReportCard
                key={r.id}
                listingExists={r.targetType === "LISTING" ? existingListingIds.has(r.targetId) : false}
                report={{
                  id: r.id,
                  targetType: r.targetType,
                  targetId: r.targetId,
                  reason: r.reason,
                  status: r.status,
                  adminNote: r.adminNote,
                  createdAt: r.createdAt,
                  reporterName: r.reporter.name ?? r.reporter.email ?? "Unknown",
                  reportedEmail: r.targetType === "BREEDER" ? (breederEmailMap.get(r.targetId) ?? null) : null,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
