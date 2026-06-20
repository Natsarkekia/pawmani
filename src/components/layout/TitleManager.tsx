"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/client";
import type { TranslationKey } from "@/lib/i18n";

const ROUTE_TITLES: Record<string, TranslationKey> = {
  "/browse": "meta_browse",
  "/account": "meta_account",
  "/favorites": "meta_favourites",
  "/messages": "meta_messages",
  "/faq": "meta_faq",
  "/about": "meta_about",
  "/privacy": "meta_privacy",
  "/terms": "meta_terms",
};

export function TitleManager() {
  const pathname = usePathname();
  const { t } = useLang();

  useEffect(() => {
    const site = t("meta_siteName");

    const staticKey = ROUTE_TITLES[pathname];
    if (staticKey) {
      document.title = `${t(staticKey)} | ${site}`;
      return;
    }
    if (pathname.startsWith("/edit/")) {
      document.title = `${t("meta_editListing")} | ${site}`;
      return;
    }
    if (pathname.startsWith("/breeders/")) {
      document.title = `${t("meta_breederProfile")} | ${site}`;
      return;
    }
    // /pets/[id] and everything else — fall back to site name;
    // server metadata will override with the real title once it loads
    document.title = site;
  }, [pathname, t]);

  return null;
}
