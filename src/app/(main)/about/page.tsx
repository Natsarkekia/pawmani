import { PageHero } from "@/components/ui/PageHero";
import { Shield, Heart, Star, Users, CheckCircle, XCircle } from "lucide-react";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta_about"), description: "Learn about Pawmani's mission to connect responsible breeders with loving families." };
}




export default async function AboutPage() {
  const { t } = await getT();

  const VALUES = [
    { icon: Shield, title: t("about_value1Title"), description: t("about_value1Desc") },
    { icon: Heart,  title: t("about_value2Title"), description: t("about_value2Desc") },
    { icon: Star,   title: t("about_value3Title"), description: t("about_value3Desc") },
    { icon: Users,  title: t("about_value4Title"), description: t("about_value4Desc") },
  ];

  const DOS = [
    t("about_do1"), t("about_do2"), t("about_do3"), t("about_do4"), t("about_do5"),
    t("about_do6"), t("about_do7"), t("about_do8"), t("about_do9"), t("about_do10"),
  ];

  const DONTS = [
    t("about_dont1"), t("about_dont2"), t("about_dont3"), t("about_dont4"),
    t("about_dont5"), t("about_dont6"), t("about_dont7"), t("about_dont8"),
  ];

  return (
    <div>
      <PageHero
        title={t("about_missionTitle")}
        subtitle={t("about_missionSubtitle")}
      />

      {/* Values */}
      <section className="bg-gray-50 dark:bg-gray-950 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">{t("about_valuesTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-300 dark:border-gray-800 shadow">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breeding standards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("about_standardsTitle")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("about_standardsSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl p-6">
            <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5" /> {t("about_dosTitle")}
            </h3>
            <ul className="space-y-2.5">
              {DOS.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-500 dark:text-green-400" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-6">
            <h3 className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5" /> {t("about_dontsTitle")}
            </h3>
            <ul className="space-y-2.5">
              {DONTS.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300">
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400 dark:text-red-500" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("about_enforcementTitle")}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p><strong>Pawmani</strong>{t("about_enforcement1")}</p>
            <p>{t("about_enforcement2")}</p>
            <p>{t("about_enforcement3")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
