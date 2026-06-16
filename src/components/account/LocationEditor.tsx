"use client";

import { useState } from "react";
import { MapPin, Check, Pencil } from "lucide-react";
import { GEORGIAN_CITIES } from "@/lib/cities";

type Props = { initialCity: string };

export function LocationEditor({ initialCity }: Props) {
  const [editing, setEditing] = useState(false);
  const [city, setCity] = useState(initialCity);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!city) return;
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      {editing ? (
        <>
          <select
            autoFocus
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-400"
          >
            <option value="" disabled>Select city</option>
            {GEORGIAN_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={save}
            disabled={saving || !city}
            className="p-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-500 dark:text-gray-400">{city || "—"}</span>
          <button onClick={() => setEditing(true)} className="p-1 text-gray-400 hover:text-blue-700 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
