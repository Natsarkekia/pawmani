import { PageHero } from "@/components/ui/PageHero";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ", description: "Frequently asked questions about Pawmani." };

const SECTIONS = [
  {
    title: "For Buyers",
    items: [
      { q: "How do I know a breeder is legitimate?", a: "Every breeder on Pawmani has a public profile showing their real name, location, and reviews from verified past buyers. We require breeders to provide health records and vaccination details on every listing. We encourage you to read reviews carefully, ask questions before paying, and always insist on seeing the animal in person or via video call before committing." },
      { q: "Can I visit a breeder before buying?", a: "Absolutely, and we strongly encourage it. Responsible breeders welcome visits from prospective buyers. If a breeder refuses to let you see where the animals are raised, that's a red flag. You can contact any breeder directly through our messaging system to arrange a visit." },
      { q: "What should I ask a breeder before buying?", a: "Ask for health test results for both parents, the vaccination and deworming schedule, details about socialisation, whether a health guarantee is offered, and whether they'll take the animal back if your circumstances change. Our About page has a full breeder standards checklist." },
      { q: "Is my payment protected?", a: "Pawmani facilitates introductions between buyers and breeders but does not process payments directly. We strongly recommend never sending money via wire transfer or gift cards, always using traceable payment methods, and meeting the animal before final payment. Report any suspicious activity to us immediately." },
      { q: "What do I do if I receive a sick animal?", a: "Contact the breeder immediately and document everything with photos and vet records. Most responsible breeders offer a health guarantee. If you cannot resolve the issue with the breeder, contact us and we'll investigate and may remove the breeder from the platform." },
    ],
  },
  {
    title: "For Breeders",
    items: [
      { q: "How do I list my animals on Pawmani?", a: "Create an account, set your role to Breeder, complete your breeder profile with your location and bio, then click 'Create Listing' from your account dashboard. Each listing requires at least one photo, a full description, age, breed, vaccination status, and a price or 'contact for price'." },
      { q: "Is there a fee to list?", a: "Pawmani is currently free for breeders during our launch period. We may introduce optional premium listings in the future, but basic listings will always be free." },
      { q: "Can I list multiple species?", a: "Yes. Your breeder profile can have listings for any species — dogs, cats, birds, rabbits, and exotic animals are all welcome as long as they meet our welfare guidelines." },
      { q: "How are reviews handled?", a: "Buyers who have contacted you through Pawmani can leave a rating and review on your profile. You cannot remove reviews, but you can flag any review you believe is fraudulent for our team to assess." },
    ],
  },
  {
    title: "Account & Platform",
    items: [
      { q: "How do I sign up?", a: "Click 'Get Started' or 'Sign in' in the top navigation and use your Google account. We use Google OAuth so you don't need to create a separate password." },
      { q: "Can I be both a buyer and a breeder?", a: "Yes. Any user can browse and favourite listings. If you'd like to create listings, update your role to Breeder in your account settings." },
      { q: "How do I report a listing or breeder?", a: "Every listing has a 'Report' option in the menu. Our team reviews all reports within 48 hours. For urgent welfare concerns, contact us directly via the Contact page." },
      { q: "Is my personal information safe?", a: "We take privacy seriously. Your email address is never displayed publicly. Read our full Privacy Policy for details on what data we collect and how it's used." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div>
      <PageHero title="Frequently Asked Questions" subtitle="Everything you need to know about buying and selling on Pawmani." />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <FaqAccordion items={section.items} />
          </div>
        ))}

        <div className="text-center py-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">Still have questions?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Our team usually replies within a few hours.</p>
          <Link href="/contact" className="inline-block bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
