"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n/client";

type Props = {
  breederId: string;
  existing?: { rating: number; body: string | null } | null;
};

export function ReviewForm({ breederId, existing }: Props) {
  const router = useRouter();
  const { t } = useLang();
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [body, setBody] = useState(existing?.body ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const RATING_LABELS = ["", t("bp_ratingPoor"), t("bp_ratingFair"), t("bp_ratingGood"), t("bp_ratingGreat"), t("bp_ratingExcellent")];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError(t("bp_selectRating")); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breederId, rating, body }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
        <p className="text-green-700 font-semibold text-sm">{t("bp_reviewSubmitted")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
      <p className="font-semibold text-gray-900 dark:text-white text-sm">
        {existing ? t("bp_updateYourReview") : t("bp_leaveReview")}
      </p>

      {/* Star picker */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                n <= (hovered || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200 fill-gray-200"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {RATING_LABELS[rating]}
          </span>
        )}
      </div>

      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t("bp_reviewPlaceholder")}
        className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !rating}
        className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("bp_submitting")}</> : existing ? t("bp_updateReview") : t("bp_submitReview")}
      </button>
    </form>
  );
}
