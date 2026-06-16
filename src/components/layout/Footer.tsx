"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";
import { useLang } from "@/lib/i18n/client";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <PawPrint className="w-5 h-5 text-blue-400" />
              Pawmani
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">{t("footer_tagline")}</p>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-3">{t("footer_company")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">{t("footer_about")}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">{t("footer_faq")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t("footer_contact")}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t("footer_privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t("footer_terms")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-sm text-center">
          © {new Date().getFullYear()} Pawmani. {t("footer_rights")}
        </div>
      </div>
    </footer>
  );
}
