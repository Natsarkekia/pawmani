"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Phone, MessageSquare, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n/client";

type Props = {
  breederName: string;
  breederPhone: string | null;
  listingTitle: string;
  listingId: string;
  breederId: string;
  breederUserId: string;
};

export function ContactButton({ breederName, breederPhone, listingTitle, listingId, breederId, breederUserId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messaging, setMessaging] = useState(false);

  const { t } = useLang();
  const isOwnListing = session?.user?.id === breederUserId;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleMessage = async () => {
    if (!session) {
      signIn("google", { callbackUrl: `/pets/${listingId}` });
      return;
    }
    setMessaging(true);
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, breederId }),
    });
    if (res.ok) {
      const { id } = await res.json();
      router.push(`/messages/${id}`);
    }
    setMessaging(false);
  };

  if (isOwnListing) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer"
      >
        <MessageCircle className="w-5 h-5" />
        {t("contact_breeder")}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[200]" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[200] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md mx-auto overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{t("contact_breeder")}: {breederName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Re: {listingTitle}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {breederPhone && (
                <a
                  href={`tel:${breederPhone}`}
                  className="flex items-center gap-3 w-full bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3.5 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-green-600 dark:text-green-500">{t("contact_phone")}</p>
                    <p className="text-base font-semibold text-green-700 dark:text-green-400 group-hover:underline">
                      {breederPhone}
                    </p>
                  </div>
                </a>
              )}

              <button
                onClick={handleMessage}
                disabled={messaging}
                className="flex items-center gap-3 w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3.5 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shrink-0">
                  {messaging ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-blue-600 dark:text-blue-500">{t("contact_inApp")}</p>
                  <p className="text-base font-semibold text-blue-700 dark:text-blue-400">{t("contact_sendMessage")}</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
