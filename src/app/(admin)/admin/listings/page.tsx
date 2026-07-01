import { db } from "@/lib/db";
import { ListingTable } from "./ListingTable";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const listings = await db.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1, orderBy: { displayOrder: "asc" } },
      breeder: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });

  const rows = listings.map((l) => ({
    id: l.id,
    title: l.title,
    species: l.species,
    purpose: l.purpose,
    status: l.status,
    price: l.price,
    city: l.city,
    createdAt: l.createdAt,
    coverImage: l.images[0]?.url ?? null,
    breederName: l.breeder.user.name ?? l.breeder.user.email ?? "Unknown",
  }));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Listings</h1>
        <p className="text-gray-500 text-sm mt-1">{listings.length} total</p>
      </div>
      <ListingTable listings={rows} />
    </div>
  );
}
