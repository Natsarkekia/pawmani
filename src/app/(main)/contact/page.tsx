"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { PageHero } from "@/components/ui/PageHero";
import { MessageSquare, Clock, Send, CheckCircle } from "lucide-react";
import { useLang } from "@/lib/i18n/client";


export default function ContactPage() {
  const { data: session } = useSession();
  const { t } = useLang();
  const TOPICS = [t("contact_topic1"), t("contact_topic2"), t("contact_topic3"), t("contact_topic4")];
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", topic: "", message: "" });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSending(true);
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSending(false);
    if (res.ok) {
      setSent(true);
    } else {
      setError("Something went wrong. Please try again or email us directly.");
    }
  };

  if (sent) {
    return (
      <div>
        <PageHero title={t("contact_pageTitle")} />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("contact_msgReceived")}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t("contact_msgReceivedDesc")}</p>
          <button onClick={() => setSent(false)} className="mt-6 text-sm text-blue-700 dark:text-blue-400 hover:underline">{t("contact_sendAnother")}</button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <PageHero title={t("contact_pageTitle")} subtitle={t("contact_pageSubtitle")} />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t("contact_signInPrompt")}</p>
          <button onClick={() => signIn("google")} className="bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors cursor-pointer">
            {t("form_signInGoogle")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero title={t("contact_pageTitle")} subtitle={t("contact_pageSubtitle")} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{t("contact_responseTime")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t("contact_responseTimeVal")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{t("contact_welfareReports")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t("contact_welfareDesc")}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("contact_name")}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={t("contact_name")}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("contact_topic")}</label>
                <select
                  value={form.topic}
                  onChange={(e) => set("topic", e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-400"
                >
                  <option value="" disabled>{t("contact_selectTopic")}</option>
                  {TOPICS.map((topic) => <option key={topic}>{topic}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("contact_messagelabel")}</label>
                <textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={5}
                  placeholder={t("contact_messagePlaceholder")}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.message || sending}
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
                {sending ? t("contact_sending") : t("contact_send")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
