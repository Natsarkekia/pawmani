"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Check, Loader2 } from "lucide-react";

type Report = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  adminNote: string | null;
  createdAt: Date;
  reporterName: string;
  reportedEmail?: string | null;
};

const statusBadge: Record<string, string> = {
  OPEN: "bg-red-900/40 text-red-400",
  REVIEWED: "bg-yellow-900/40 text-yellow-400",
  DISMISSED: "bg-gray-800 text-gray-500",
  ACTIONED: "bg-green-900/40 text-green-400",
};

const typeBadge: Record<string, string> = {
  LISTING: "bg-blue-900/40 text-blue-400",
  BREEDER: "bg-purple-900/40 text-purple-400",
  REVIEW: "bg-yellow-900/40 text-yellow-400",
  MESSAGE: "bg-gray-800 text-gray-400",
};

function targetLink(type: string, id: string): string | null {
  if (type === "LISTING") return `/pets/${id}`;
  if (type === "BREEDER") return `/breeders/${id}`;
  return null;
}

export function ReportCard({ report: initial, listingExists }: { report: Report; listingExists: boolean }) {
  const [status, setStatus] = useState(initial.status);
  const [note, setNote] = useState(initial.adminNote ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(initial.targetType === "LISTING" && !listingExists);

  const save = async (newStatus?: string) => {
    const s = newStatus ?? status;
    setSaving(true);
    await fetch(`/api/admin/reports/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s, adminNote: note }),
    });
    setStatus(s);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this listing permanently? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/listings/${initial.targetId}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      setDeleted(true);
      save("ACTIONED");
    }
  };

  const link = targetLink(initial.targetType, initial.targetId);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge[status] ?? "bg-gray-800 text-gray-400"}`}>
            {status}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeBadge[initial.targetType] ?? "bg-gray-800 text-gray-400"}`}>
            {initial.targetType}
          </span>
          {link && (
            <Link
              href={link}
              target="_blank"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              View <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
        <span className="text-xs text-gray-600 shrink-0">
          {new Date(initial.createdAt).toLocaleDateString("en-GB")}
        </span>
      </div>

      <p className="mt-3 text-gray-300 text-sm">{initial.reason}</p>
      <p className="mt-1 text-xs text-gray-600">Reported by {initial.reporterName}</p>
      {initial.reportedEmail && (
        <p className="mt-0.5 text-xs text-gray-600">Reported user: <span className="text-gray-400">{initial.reportedEmail}</span></p>
      )}

      {deleted && (
        <p className="mt-2 text-xs text-green-400">Listing deleted.</p>
      )}

      <div className="mt-4 space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Admin note (optional)…"
          rows={2}
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-700 focus:outline-none focus:border-gray-600 resize-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          {(["REVIEWED", "DISMISSED", "ACTIONED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => save(s)}
              disabled={saving || status === s}
              className={`text-xs px-3 py-1.5 rounded border transition-colors disabled:cursor-default ${
                status === s
                  ? s === "REVIEWED"
                    ? "bg-yellow-800 border-yellow-800 text-white"
                    : s === "DISMISSED"
                    ? "bg-gray-700 border-gray-700 text-white"
                    : "bg-green-800 border-green-800 text-white"
                  : s === "REVIEWED"
                  ? "border-yellow-900 text-yellow-600 hover:border-yellow-700 hover:text-yellow-400"
                  : s === "DISMISSED"
                  ? "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
                  : "border-green-900 text-green-700 hover:border-green-700 hover:text-green-400"
              }`}
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
          <button
            onClick={() => save()}
            disabled={saving}
            className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1.5 rounded border border-gray-800 hover:border-gray-600 transition-colors"
          >
            Save note
          </button>
          {saved && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          {initial.targetType === "LISTING" && !deleted && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto text-xs text-red-600 hover:text-red-400 px-2 py-1.5 rounded border border-red-900 hover:border-red-700 transition-colors"
            >
              {deleting ? "Deleting…" : "Delete Listing"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
