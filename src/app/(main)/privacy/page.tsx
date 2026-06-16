import { PageHero } from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: `When you create an account via Google OAuth, we receive your name, email address, and profile photo from Google. We do not receive your Google password. When you use Pawmani, we also collect information you provide directly — such as your breeder profile details, listing content, messages, and reviews — as well as usage data such as pages visited, search queries, and device information.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use your information to operate and improve Pawmani, to facilitate communication between buyers and breeders, to display your public profile and listings, to send transactional notifications (e.g. new messages), and to detect and prevent fraud or abuse. We do not sell your personal data to third parties.`,
  },
  {
    title: "3. What Is Publicly Visible",
    body: `Your display name, profile photo, and breeder profile (if applicable) are visible to all Pawmani users. Your email address is never displayed publicly. Messages you send are visible only to you and the recipient. Reviews you write are publicly attributed to your display name.`,
  },
  {
    title: "4. Data Storage & Security",
    body: `Your data is stored in a secure PostgreSQL database hosted by Supabase. We use industry-standard encryption in transit (TLS) and at rest. Access to the production database is restricted to authorised personnel only. Despite our best efforts, no system is completely secure — please use a strong, unique password for your Google account.`,
  },
  {
    title: "5. Cookies",
    body: `We use session cookies to keep you logged in. You can disable cookies in your browser settings, but doing so may affect your ability to use Pawmani.`,
  },
  {
    title: "6. Third-Party Services",
    body: `Pawmani uses Google OAuth for authentication (Google's privacy policy applies), Supabase for database and image storage hosting, and Vercel for application hosting. Each of these services has its own privacy policy.`,
  },
  {
    title: "7. Data Retention & Deletion",
    body: `You may request deletion of your account and associated data by contacting us at hello@pawmani.com. We will action deletion requests within 30 days. Note that reviews you have received from other users may be retained as part of the breeder's public record.`,
  },
  {
    title: "8. Children's Privacy",
    body: `Pawmani is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with their information, please contact us and we will delete it promptly.`,
  },
  {
    title: "9. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. Continued use of Pawmani after changes are posted constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact",
    body: `For privacy-related questions or data deletion requests, contact us at hello@pawmani.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <PageHero title="Privacy Policy" subtitle="Last updated: June 2026" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          This Privacy Policy describes how Pawmani (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, and shares information about you when you use our platform at pawmani.com. By using Pawmani, you agree to the collection and use of information in accordance with this policy.
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
