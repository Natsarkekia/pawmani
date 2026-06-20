"use client";

import { useEffect } from "react";

export function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    fetch(`/api/listings/${id}/view`, { method: "POST" });
  }, [id]);

  return null;
}
