"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Flag, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n/client";

type Props = {
  targetType: "LISTING" | "BREEDER";
  targetId: string;
  targetName: string;
};

export function ReportButton({ targetType, targetId, targetName }: Props) {
  const { data: session } = useSession();
  const { t } = useLang();
  const REASONS = [
    t("report_misleading"),
    t("report_animalWelfare"),
    t("report_scam"),
    t("report_inappropriate"),
    t("report_other"),
  ];
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleOpen = () => {
    if (!session) {
      signIn("google");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReason("");
    setExplanation("");
    setDone(false);
  };

  const handleSubmit = async () => {
    if (!reason || submitting) return;
    setSubmitting(true);
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, reason, explanation: explanation.trim() }),
    });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
      >
        <Flag className="w-3.5 h-3.5" />
        {t("report_trigger")}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[200]" onClick={handleClose} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[200] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{t("report_trigger")}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[260px]">{targetName}</p>
              </div>
              <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {done ? (
                <div className="py-6 text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">{t("report_submitted")}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("report_submittedMsg")}</p>
                  <button onClick={handleClose} className="mt-4 text-sm text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">{t("report_close")}</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("report_whyReporting")}</p>
                    <div className="flex flex-wrap gap-2">
                      {REASONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setReason(r)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer",
                            reason === r
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-300"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t("report_additionalDetails")} <span className="text-gray-400 font-normal">({t("report_optional")})</span>
                    </label>
                    <textarea
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      maxLength={500}
                      rows={3}
                      placeholder={t("report_placeholder")}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-red-400 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!reason || submitting}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                    {t("report_submit")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
