import { db } from "@/lib/db";
import { ReportCard } from "./ReportCard";

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
                report={{
                  id: r.id,
                  targetType: r.targetType,
                  targetId: r.targetId,
                  reason: r.reason,
                  status: r.status,
                  adminNote: r.adminNote,
                  createdAt: r.createdAt,
                  reporterName: r.reporter.name ?? r.reporter.email ?? "Unknown",
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
                report={{
                  id: r.id,
                  targetType: r.targetType,
                  targetId: r.targetId,
                  reason: r.reason,
                  status: r.status,
                  adminNote: r.adminNote,
                  createdAt: r.createdAt,
                  reporterName: r.reporter.name ?? r.reporter.email ?? "Unknown",
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
