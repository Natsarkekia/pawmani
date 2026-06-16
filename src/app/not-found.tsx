import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50 dark:bg-gray-950">
      <PawPrint className="w-16 h-16 text-blue-200 mb-6" />
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Page not found</p>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm"
        >
          Go home
        </Link>
        <Link
          href="/browse"
          className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-6 py-2.5 rounded-xl hover:border-blue-300 transition-colors text-sm"
        >
          Browse pets
        </Link>
      </div>
    </div>
  );
}
