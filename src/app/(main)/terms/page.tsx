import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using Pawmani, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. We reserve the right to update these terms at any time; continued use of the platform following notice of changes constitutes acceptance.`,
  },
  {
    title: "2. Eligibility",
    body: `You must be at least 18 years old to use Pawmani. By creating an account, you represent that you are 18 or older and that the information you provide is accurate and complete.`,
  },
  {
    title: "3. Breeder Responsibilities",
    body: `Breeders agree to comply with all applicable laws and regulations in their jurisdiction, including those governing the sale of animals and any required licences or permits. All listing content must be accurate and not misleading. Breeders must follow Pawmani's breeder standards as described on our About page. Violation of these standards may result in immediate removal from the platform.`,
  },
  {
    title: "4. Buyer Responsibilities",
    body: `Buyers are responsible for conducting their own due diligence before purchasing an animal. Pawmani provides a platform for introductions but does not guarantee the health, temperament, or pedigree of any animal listed. Buyers should verify all claims independently, meet animals in person where possible, and use secure payment methods.`,
  },
  {
    title: "5. Prohibited Conduct",
    body: `You may not use Pawmani to list wild-caught or illegally sourced animals; engage in fraud, misrepresentation, or deceptive practices; harass, threaten, or abuse other users; scrape, spam, or use automated tools without permission; violate any applicable law or regulation; or post listings for animals you do not own or have authorisation to sell.`,
  },
  {
    title: "6. Platform Role",
    body: `Pawmani is a marketplace platform and is not a party to any transaction between buyers and breeders. We do not handle payments, take title to animals, or guarantee the outcome of any transaction. Any disputes between buyers and breeders are the responsibility of those parties, though we will assist in mediation where possible.`,
  },
  {
    title: "7. Listing Removal",
    body: `Pawmani reserves the right to remove any listing or suspend any account at any time, with or without notice, for any reason including but not limited to violation of these Terms, our breeder standards, or applicable law.`,
  },
  {
    title: "8. Intellectual Property",
    body: `You retain ownership of content you post on Pawmani (photos, descriptions, reviews). By posting content, you grant Pawmani a non-exclusive, royalty-free licence to display and distribute that content on the platform. You may not use Pawmani's branding, logo, or content without written permission.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `To the fullest extent permitted by law, Pawmani is not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including losses related to a transaction with a breeder or buyer. Our total liability to you shall not exceed the amount you have paid us (if any) in the past 12 months.`,
  },
  {
    title: "10. Governing Law",
    body: `These Terms are governed by the laws of Georgia. Any disputes shall be resolved in the courts of Georgia.`,
  },
  {
    title: "11. Contact",
    body: `Questions about these Terms? Contact us at hello@pawmani.com.`,
  },
];

export default function TermsPage() {
  return (
    <div>
      <PageHero title="Terms of Service" subtitle="Last updated: June 2026" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Please read these Terms of Service carefully before using Pawmani. These terms constitute a legally binding agreement between you and Pawmani regarding your use of our platform.
        </p>
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">{s.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
