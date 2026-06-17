"use client";

import { useState } from "react";
import { FileText, Check, Pencil } from "lucide-react";
import { useLang } from "@/lib/i18n/client";

export function BioEditor({ initial }: { initial: string | null }) {
  const { t } = useLang();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: value }),
    });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="flex items-start gap-2 mt-2">
      <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
      {editing ? (
        <div className="flex items-start gap-2 flex-1">
          <textarea
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Tell buyers about yourself..."
            rows={3}
            className="text-sm border rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none w-full border-gray-200 dark:border-gray-700 focus:border-blue-400 resize-none"
          />
          <button
            onClick={save}
            disabled={saving}
            className="p-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-1 flex-1">
          <span className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {value || t("bio_empty")}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-gray-400 hover:text-blue-700 transition-colors shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
