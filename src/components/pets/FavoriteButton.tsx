"use client";

import { useState, useTransition } from "react";
import { useSession, signIn } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  listingId: string;
  initialFavorited?: boolean;
  className?: string;
};

export function FavoriteButton({ listingId, initialFavorited = false, className }: Props) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      signIn("google");
      return;
    }

    // Optimistic update
    setFavorited((prev) => !prev);

    startTransition(async () => {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId }),
        });
        const data = await res.json();
        if (res.ok) setFavorited(data.favorited);
        else setFavorited((prev) => !prev); // revert on error
      } catch {
        setFavorited((prev) => !prev); // revert on network error
      }
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={favorited ? "Remove from favourites" : "Add to favourites"}
      className={cn(
        "p-2 rounded-full backdrop-blur-sm transition-all",
        favorited
          ? "bg-red-500 text-white"
          : "bg-white/80 text-gray-400 hover:text-red-500",
        isPending && "opacity-70",
        className
      )}
    >
      <Heart className={cn("w-4 h-4", favorited && "fill-current")} />
    </button>
  );
}
