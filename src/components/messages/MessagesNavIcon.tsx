"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export function MessagesNavIcon() {
  const [unread, setUnread] = useState(0);

  const fetchCount = useCallback(async () => {
    const res = await fetch("/api/messages/unread-count");
    if (res.ok) {
      const data = await res.json();
      setUnread(data.count);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 10000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchCount();
    };
    const onFocus = () => fetchCount();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchCount]);

  return (
    <Link
      href="/messages"
      className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
      aria-label="Messages"
      onClick={() => setUnread(0)}
    >
      <MessageSquare className="w-5 h-5" />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-[10px] font-bold leading-none">{unread > 9 ? "9+" : unread}</span>
        </span>
      )}
    </Link>
  );
}
