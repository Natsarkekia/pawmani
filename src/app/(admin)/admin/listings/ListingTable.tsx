"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ExternalLink, Trash2 } from "lucide-react";

type Listing = {
  id: string;
  title: string;
  species: string;
  purpose: string;
  status: string;
  price: number | null;
  city: string;
  createdAt: Date;
  coverImage: string | null;
  breederName: string;
};

const speciesBadge: Record<string, string> = {
  DOG: "bg-amber-900/40 text-amber-400",
  CAT: "bg-orange-900/40 text-orange-400",
  BIRD: "bg-sky-900/40 text-sky-400",
  RABBIT: "bg-pink-900/40 text-pink-400",
  EXOTIC: "bg-green-900/40 text-green-400",
};

export function ListingTable({ listings: initial }: { listings: Listing[] }) {
  const [listings, setListings] = useState(initial);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = listings.filter((l) => {
    const q = query.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.breederName.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.species.toLowerCase().includes(q)
    );
  });

  const deleteListing = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" permanently? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, breeder, city…"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500"
        />
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Listing</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Breeder</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Species</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Purpose</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Price</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">City</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-gray-900/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                      {l.coverImage ? (
                        <Image src={l.coverImage} alt="" width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-gray-800" />
                      )}
                    </div>
                    <span className="text-gray-200 font-medium truncate max-w-[160px]">{l.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{l.breederName}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${speciesBadge[l.species] ?? "bg-gray-800 text-gray-400"}`}>
                    {l.species}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${l.purpose === "BREEDING" ? "bg-green-900/40 text-green-400" : "bg-blue-900/40 text-blue-400"}`}>
                    {l.purpose}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {l.price != null ? `${l.price.toLocaleString()} ₾` : "—"}
                </td>
                <td className="px-4 py-3 text-gray-400">{l.city}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(l.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/pets/${l.id}`}
                      target="_blank"
                      className="p-1.5 text-gray-500 hover:text-gray-200 transition-colors"
                      title="View listing"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => deleteListing(l.id, l.title)}
                      disabled={deleting === l.id}
                      className="p-1.5 text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                      title="Delete listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-600">No listings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
