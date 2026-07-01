import { db } from "@/lib/db";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [buyers, breeders, admins, listings, openReports, reviews, recentReports] = await Promise.all([
    db.user.count({ where: { role: "BUYER" } }),
    db.user.count({ where: { role: "BREEDER" } }),
    db.user.count({ where: { role: "ADMIN" } }),
    db.listing.count(),
    db.report.count({ where: { status: "OPEN" } }),
    db.review.count(),
    db.report.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { reporter: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Users"
          value={buyers + breeders + admins}
          sub={`${breeders} breeders · ${buyers} buyers`}
        />
        <StatCard label="Listings" value={listings} />
        <StatCard label="Open Reports" value={openReports} alert={openReports > 0} />
        <StatCard label="Reviews" value={reviews} />
      </div>

      {recentReports.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Open Reports</h2>
            <Link
              href="/admin/reports"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Reason</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Reporter</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentReports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-900/40">
                    <td className="px-4 py-3">
                      <TypeBadge type={r.targetType} />
                    </td>
                    <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{r.reason}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {r.reporter.name ?? r.reporter.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(r.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 p-10 text-center text-gray-600">
          No open reports
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: number;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        alert ? "border-red-500/40 bg-red-950/20" : "border-gray-800 bg-gray-900/50"
      }`}
    >
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold ${alert ? "text-red-400" : "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    LISTING: "bg-blue-900/40 text-blue-400",
    BREEDER: "bg-purple-900/40 text-purple-400",
    REVIEW: "bg-yellow-900/40 text-yellow-400",
    MESSAGE: "bg-gray-800 text-gray-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[type] ?? "bg-gray-800 text-gray-400"}`}>
      {type}
    </span>
  );
}
