import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { LanguageProvider } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const v = store.get("lang")?.value;
  const initialLocale: Locale = v === "en" || v === "ka" ? v : "ka";

  return (
    <LanguageProvider initialLocale={initialLocale}>
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
      </div>
    </LanguageProvider>
  );
}
