import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Pawmani — Find Your Perfect Pet",
    template: "%s | Pawmani",
  },
  description:
    "Connect with responsible, verified breeders. Find dogs, cats, birds, rabbits, and exotic pets from trusted sources.",
  keywords: ["pet breeding", "buy pets", "dogs for sale", "cats for sale", "responsible breeders"],
  openGraph: {
    type: "website",
    siteName: "Pawmani",
    title: "Pawmani — Find Your Perfect Pet",
    description: "Connect with responsible breeders. Find your perfect companion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
