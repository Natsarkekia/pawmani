import { db } from "@/lib/db";
import { UserTable } from "./UserTable";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} total</p>
      </div>
      <UserTable users={users} />
    </div>
  );
}
