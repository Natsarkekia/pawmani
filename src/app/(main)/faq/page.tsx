import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { getT } from "@/lib/i18n/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ", description: "Frequently asked questions about Pawmani." };

export default async function FaqPage() {
  const { t } = await getT();

  const SECTIONS = [
    {
      title: t("faq_section1"),
      items: [
        { q: t("faq_q1_1"), a: t("faq_a1_1") },
        { q: t("faq_q1_2"), a: t("faq_a1_2") },
        { q: t("faq_q1_3"), a: t("faq_a1_3") },
        { q: t("faq_q1_4"), a: t("faq_a1_4") },
        { q: t("faq_q1_5"), a: t("faq_a1_5") },
      ],
    },
    {
      title: t("faq_section2"),
      items: [
        { q: t("faq_q2_1"), a: t("faq_a2_1") },
        { q: t("faq_q2_2"), a: t("faq_a2_2") },
        { q: t("faq_q2_3"), a: t("faq_a2_3") },
        { q: t("faq_q2_4"), a: t("faq_a2_4") },
      ],
    },
    {
      title: t("faq_section3"),
      items: [
        { q: t("faq_q3_1"), a: t("faq_a3_1") },
        { q: t("faq_q3_2"), a: t("faq_a3_2") },
        { q: t("faq_q3_3"), a: t("faq_a3_3") },
        { q: t("faq_q3_4"), a: t("faq_a3_4") },
      ],
    },
  ];

  return (
    <div>
      <PageHero title={t("faq_title")} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <FaqAccordion items={section.items} />
          </div>
        ))}

        <div className="text-center py-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{t("faq_stillHaveQuestions")}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t("faq_replyTime")}</p>
          <Link href="/contact" className="inline-block bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors">
            {t("faq_contactUs")}
          </Link>
        </div>
      </div>
    </div>
  );
}
