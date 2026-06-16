"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, List, Flag, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: List },
];

export function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-800 flex flex-col sticky top-0 h-screen">
      <div className="px-5 py-5 border-b border-gray-800">
        <span className="font-bold text-base">Pawmani</span>
        <span className="text-xs text-gray-500 block mt-0.5">Admin Panel</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-800/50 hover:text-gray-300 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Back to site
        </Link>
      </div>
    </aside>
  );
}
