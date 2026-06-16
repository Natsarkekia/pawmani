"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };
type Props = { items: Item[] };

export function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">{item.q}</span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200",
                open === i && "rotate-180"
              )}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
