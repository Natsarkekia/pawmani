"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  isMine: boolean;
};

type ConversationData = {
  id: string;
  listing: { id: string; title: string };
  otherParty: { id: string; name: string | null; image: string | null };
  messages: Message[];
};

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: convId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/conversations/${convId}`);
    if (!res.ok) { router.push("/messages"); return; }
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [convId, router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (!data) return;
    if (isFirstLoad.current) {
      bottomRef.current?.scrollIntoView();
      isFirstLoad.current = false;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.messages.length]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    router.push("/login?callbackUrl=/messages");
    return null;
  }

  if (!data) return null;

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");

    const res = await fetch(`/api/conversations/${convId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const msg = await res.json();
      setData((prev) => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
    }
    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Link
          href="/messages"
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Avatar src={data.otherParty.image} name={data.otherParty.name} size={36} className="rounded-full shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">{data.otherParty.name}</p>
          <Link href={`/pets/${data.listing.id}`} className="text-xs text-blue-600 hover:underline truncate block">
            {data.listing.title}
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2">
        {data.messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No messages yet. Say hello!</p>
        )}
        {data.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.isMine
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm"
              }`}
            >
              {msg.content}
              <p className={`text-xs mt-1 ${msg.isMine ? "text-blue-200" : "text-gray-400"}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write a message..."
          rows={1}
          maxLength={1000}
          className="flex-1 resize-none border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
