"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
};

const ROLES = ["BUYER", "BREEDER", "ADMIN"] as const;

const roleBadge: Record<string, string> = {
  BUYER: "bg-gray-800 text-gray-300",
  BREEDER: "bg-blue-900/50 text-blue-400",
  ADMIN: "bg-purple-900/50 text-purple-400",
};

export function UserTable({ users: initial }: { users: User[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<Record<string, string>>({});

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const changeRole = async (userId: string, newRole: string) => {
    if (!confirm(`Change role to ${newRole}?`)) {
      setPendingRole((p) => ({ ...p, [userId]: users.find((u) => u.id === userId)!.role }));
      return;
    }
    setSaving(userId);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setPendingRole((p) => {
      const next = { ...p };
      delete next[userId];
      return next;
    });
    setSaving(null);
  };

  const deleteUser = async (userId: string, name: string | null) => {
    if (!confirm(`Delete "${name ?? "this user"}" permanently? This will remove all their listings and data.`)) return;
    setDeleting(userId);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      router.refresh();
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
          placeholder="Search by name or email…"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500"
        />
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">User</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Role</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Joined</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Change Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((u) => {
              const currentRole = pendingRole[u.id] ?? u.role;
              return (
                <tr key={u.id} className="hover:bg-gray-900/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                        {u.image ? (
                          <Image src={u.image} alt="" width={32} height={32} className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            {(u.name ?? u.email ?? "?")[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-200 font-medium leading-tight">{u.name ?? "—"}</p>
                        <p className="text-gray-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleBadge[u.role] ?? "bg-gray-800 text-gray-400"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    {u.id === session?.user?.id ? (
                      <span className="text-xs text-gray-600 italic">you</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={currentRole}
                          onChange={(e) => {
                            setPendingRole((p) => ({ ...p, [u.id]: e.target.value }));
                          }}
                          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-gray-500"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        {pendingRole[u.id] && pendingRole[u.id] !== u.role && (
                          <button
                            onClick={() => changeRole(u.id, pendingRole[u.id])}
                            disabled={saving === u.id}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2.5 py-1.5 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {saving === u.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.id !== session?.user?.id && (
                      <button
                        onClick={() => deleteUser(u.id, u.name)}
                        disabled={deleting === u.id}
                        className="p-1.5 text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Delete user"
                      >
                        {deleting === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-600">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
