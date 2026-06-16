"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createT, type Locale, type TranslationKey } from "./index";

type LangCtx = {
  locale: Locale;
  t: (key: TranslationKey) => string;
  toggle: () => void;
};

const LangContext = createContext<LangCtx>(null!);

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const router = useRouter();

  const toggle = () => {
    const next: Locale = locale === "ka" ? "en" : "ka";
    document.cookie = `lang=${next};path=/;max-age=31536000;SameSite=Lax`;
    setLocale(next);
    router.refresh();
  };

  return (
    <LangContext.Provider value={{ locale, t: createT(locale), toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
