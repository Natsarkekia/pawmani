"use client";

import { useState } from "react";
import { Phone, Check, Pencil } from "lucide-react";
import { isValidGeorgianPhone } from "@/lib/utils";

export function PhoneEditor({ initial }: { initial: string | null }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!isValidGeorgianPhone(value)) return;
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: value }),
    });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      {editing ? (
        <>
          <input
            autoFocus
            type="tel"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="5xx xxx xxx"
            className="text-sm border rounded-lg px-2.5 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none w-44 border-gray-200 dark:border-gray-700 focus:border-blue-400"
          />
          <button
            onClick={save}
            disabled={saving || !isValidGeorgianPhone(value)}
            className="p-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {value || "No contact number"}
          </span>
          <button onClick={() => setEditing(true)} className="p-1 text-gray-400 hover:text-blue-700 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
