"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Loader2 } from "lucide-react";

export function HideListingButton({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isHidden = status === "ARCHIVED";

  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/listings/${id}/visibility`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: isHidden ? "AVAILABLE" : "ARCHIVED" }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={isHidden ? "Make visible" : "Hide listing"}
      className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isHidden ? (
        <ArchiveRestore className="w-4 h-4" />
      ) : (
        <Archive className="w-4 h-4" />
      )}
    </button>
  );
}
