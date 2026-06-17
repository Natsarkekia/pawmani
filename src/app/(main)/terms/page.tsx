import { PageHero } from "@/components/ui/PageHero";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default async function TermsPage() {
  const { t } = await getT();

  const SECTIONS = [
    { title: t("terms_s1_title"),  body: t("terms_s1_body") },
    { title: t("terms_s2_title"),  body: t("terms_s2_body") },
    { title: t("terms_s3_title"),  body: t("terms_s3_body") },
    { title: t("terms_s4_title"),  body: t("terms_s4_body") },
    { title: t("terms_s5_title"),  body: t("terms_s5_body") },
    { title: t("terms_s6_title"),  body: t("terms_s6_body") },
    { title: t("terms_s7_title"),  body: t("terms_s7_body") },
    { title: t("terms_s8_title"),  body: t("terms_s8_body") },
    { title: t("terms_s9_title"),  body: t("terms_s9_body") },
    { title: t("terms_s10_title"), body: t("terms_s10_body") },
    { title: t("terms_s11_title"), body: t("terms_s11_body") },
  ];

  return (
    <div>
      <PageHero title={t("terms_title")} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{t("terms_intro")}</p>
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">{s.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.body}</p>
          </section>
        ))}
        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">{t("terms_lastUpdated")}</p>
      </div>
    </div>
  );
}
