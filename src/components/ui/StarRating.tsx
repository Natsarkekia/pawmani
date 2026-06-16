import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { rating: number; max?: number; size?: "sm" | "md" };

export function StarRating({ rating, max = 5, size = "sm" }: Props) {
  const sz = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sz,
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"
          )}
        />
      ))}
    </div>
  );
}
