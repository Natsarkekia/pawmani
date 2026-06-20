import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { Providers } from "@/components/Providers";
import { getLocale } from "@/lib/i18n/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const name = locale === "ka" ? "ფაუმანი" : "Pawmani";
  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description:
      "Connect with responsible, verified breeders. Find dogs, cats, birds, rabbits, and exotic pets from trusted sources.",
    keywords: ["pet breeding", "buy pets", "dogs for sale", "cats for sale", "responsible breeders"],
    openGraph: {
      type: "website",
      siteName: "Pawmani",
      title: "Pawmani",
      description: "Connect with responsible breeders. Find your perfect companion.",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Pawmani",
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className={`${inter.variable} antialiased bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
