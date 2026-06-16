import { PageHero } from "@/components/ui/PageHero";
import { Shield, Heart, Star, Users, CheckCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Pawmani's mission to connect responsible breeders with loving families.",
};

const VALUES = [
  { icon: Shield, title: "Ethical Breeding", description: "We hold every breeder to a strict code of conduct that prioritises animal health, proper socialisation, and honest representation." },
  { icon: Heart, title: "Animal Welfare First", description: "Every policy on Pawmani is designed with the animal's wellbeing at its core — before profits, before convenience." },
  { icon: Star, title: "Radical Transparency", description: "Breeders must disclose health records, vaccination status, and pedigree information. No surprises for buyers." },
  { icon: Users, title: "Real Community", description: "Pawmani is built on honest reviews from real buyers. Our community keeps standards high and bad actors out." },
];

const DOS = [
  "Health-test both parents for breed-specific genetic conditions before breeding",
  "Provide a clean, stimulating, and spacious environment for all animals",
  "Socialise litters with humans, children, and other animals from an early age",
  "Complete all age-appropriate vaccinations and deworming before rehoming",
  "Be honest and transparent about the animal's health, temperament, and lineage",
  "Screen buyers to ensure they understand the commitment required",
  "Offer a health guarantee and be willing to take the animal back if needed",
  "Keep accurate records and provide buyers with copies of health documentation",
  "Limit the number of litters per female per year to protect her health",
  "Continue to be available for questions after the sale",
];

const DONTS = [
  "Breed animals with known heritable health conditions",
  "Separate puppies or kittens from their mother before 8 weeks of age",
  "Misrepresent an animal's breed, age, health status, or temperament",
  "Operate or source from commercial puppy or kitten mills",
  "Sell animals in pet stores, flea markets, or via roadside stands",
  "Breed animals solely for profit without regard for welfare",
  "Neglect veterinary care to cut costs",
  "Breed females on every heat cycle",
  "Use high-pressure sales tactics or artificial urgency",
  "Abandon responsibility for an animal after the sale",
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="Our Mission"
        subtitle="Pawmani exists to make responsible pet ownership accessible — and to ensure every animal sold through our platform goes to a loving, prepared home."
      />

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-none text-gray-600 dark:text-gray-300 text-base leading-relaxed space-y-4">
          <p>
            The pet marketplace is broken. Too many platforms turn a blind eye to puppy mills, misrepresented breeds, and sick animals sold to unsuspecting families. Pawmani was founded in 2023 to fix that.
          </p>
          <p>
            We built a platform where every breeder is a real, accountable person — someone whose name, location, and reviews are publicly visible. Where buyers can see health records before they pay a deposit. Where the community holds standards high because everyone benefits when it does.
          </p>
          <p>
            We believe responsible breeding is worth celebrating. Breeders who health-test their animals, socialise their litters properly, and stay in contact with buyers deserve recognition — and buyers who do their research deserve a trustworthy place to find them.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 dark:bg-gray-950 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Breeder Standards</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">The standards every Pawmani breeder agrees to uphold.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl p-6">
            <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5" /> Responsible breeders do
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
              <XCircle className="w-5 h-5" /> Responsible breeders don&apos;t
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Enforcement</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Pawmani reserves the right to remove any listing or breeder that violates these standards without notice. Buyers are encouraged to report listings or breeders that appear to fall below our standards. Serious welfare concerns will be reported to the appropriate local authorities.
          </p>
        </div>
      </section>
    </div>
  );
}
