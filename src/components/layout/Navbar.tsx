"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { PawPrint, Heart, Menu, X, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { MessagesNavIcon } from "@/components/messages/MessagesNavIcon";
import { useLang } from "@/lib/i18n/client";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const { t, locale, toggle } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileUserOpen, setMobileUserOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileUserRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const mobileOpenRef = useRef(false);

  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (mobileUserRef.current && !mobileUserRef.current.contains(e.target as Node)) {
        setMobileUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (mobileOpenRef.current) return;
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 60) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-transform duration-300 md:translate-y-0 ${navHidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <PawPrint className="w-6 h-6" />
            <span>Pawmani</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/browse?purpose=BREEDING" className="hover:text-blue-700 transition-colors">{t("nav_findMatch")}</Link>
            <Link href="/browse?purpose=SALE" className="hover:text-blue-700 transition-colors">{t("nav_marketplace")}</Link>
            <Link href="/browse?purpose=ADOPT" className="hover:text-blue-700 transition-colors">{t("nav_adopt")}</Link>
            <Link href="/about" className="hover:text-blue-700 transition-colors">{t("nav_about")}</Link>
            <Link href="/faq" className="hover:text-blue-700 transition-colors">{t("nav_faq")}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggle} className="flex items-center justify-center w-7 h-7 hover:opacity-70 transition-opacity cursor-pointer" aria-label="Switch language">
              <span className={`fi ${locale === "ka" ? "fi-gb" : "fi-ge"}`} style={{ fontSize: "1.1rem", display: "block" }} />
            </button>
            <ThemeToggle />

            {session ? (
              <>
                <Link href="/create" className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                  <Plus className="w-4 h-4" />
                  {t("nav_postPet")}
                </Link>
                <MessagesNavIcon />
                <Link href="/favorites" className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors" aria-label={t("nav_favourites")}>
                  <Heart className="w-5 h-5" />
                </Link>
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Open user menu">
                    <Avatar src={session.user?.image} name={session.user?.name} size={36} className="rounded-full border-2 border-gray-200 hover:border-blue-400 transition-colors" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-300 dark:border-gray-800 py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{session.user?.email}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 transition-colors" onClick={() => setUserMenuOpen(false)}>{t("nav_myAccount")}</Link>
                      <Link href="/messages" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 transition-colors" onClick={() => setUserMenuOpen(false)}>{t("nav_messages")}</Link>
                      <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 transition-colors" onClick={() => setUserMenuOpen(false)}>{t("nav_favourites")}</Link>
                      <hr className="my-1 border-gray-100 dark:border-gray-800" />
                      <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">{t("nav_signOut")}</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button onClick={() => signIn("google")} className="cursor-pointer bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                {t("nav_signIn")}
              </button>
            )}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex items-center justify-between h-16">
          {/* Left: hamburger */}
          <button className="p-2 text-gray-600 dark:text-gray-300 cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center: logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700" onClick={() => setMobileOpen(false)}>
            <PawPrint className="w-6 h-6" />
            <span>Pawmani</span>
          </Link>

          {/* Right: avatar or sign-in */}
          {session ? (
            <div className="relative" ref={mobileUserRef}>
              <button onClick={() => setMobileUserOpen(!mobileUserOpen)} className="p-1 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Open user menu">
                <Avatar src={session.user?.image} name={session.user?.name} size={34} className="rounded-full border-2 border-gray-200 hover:border-blue-400 transition-colors" />
              </button>
              {mobileUserOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-300 dark:border-gray-800 py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{session.user?.email}</p>
                  </div>
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 transition-colors" onClick={() => setMobileUserOpen(false)}>{t("nav_myAccount")}</Link>
                  <Link href="/messages" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 transition-colors" onClick={() => setMobileUserOpen(false)}>{t("nav_messages")}</Link>
                  <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 transition-colors" onClick={() => setMobileUserOpen(false)}>{t("nav_favourites")}</Link>
                  <hr className="my-1 border-gray-100 dark:border-gray-800" />
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">{t("nav_signOut")}</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => signIn("google")} className="cursor-pointer text-sm font-medium text-blue-700 px-2 py-1" aria-label="Sign in">
              {t("nav_signIn")}
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-1">
          <Link href="/browse?purpose=BREEDING" className="block text-sm font-medium text-gray-700 dark:text-gray-300 py-2.5" onClick={() => setMobileOpen(false)}>{t("nav_findMatch")}</Link>
          <Link href="/browse?purpose=SALE" className="block text-sm font-medium text-gray-700 dark:text-gray-300 py-2.5" onClick={() => setMobileOpen(false)}>{t("nav_marketplace")}</Link>
          <Link href="/browse?purpose=ADOPT" className="block text-sm font-medium text-gray-700 dark:text-gray-300 py-2.5" onClick={() => setMobileOpen(false)}>{t("nav_adopt")}</Link>
          <Link href="/about" className="block text-sm font-medium text-gray-700 dark:text-gray-300 py-2.5" onClick={() => setMobileOpen(false)}>{t("nav_about")}</Link>
          <Link href="/faq" className="block text-sm font-medium text-gray-700 dark:text-gray-300 py-2.5" onClick={() => setMobileOpen(false)}>{t("nav_faq")}</Link>

          <div className="flex items-center gap-4 py-1 border-t border-gray-100 dark:border-gray-800 mt-1 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t("nav_theme")}</span>
              <ThemeToggle />
            </div>
            <button onClick={toggle} className="flex items-center justify-center w-7 h-7 hover:opacity-70 transition-opacity cursor-pointer">
              <span className={`fi ${locale === "ka" ? "fi-gb" : "fi-ge"}`} style={{ fontSize: "1.1rem", display: "block" }} />
            </button>
          </div>

          {session && (
            <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-3">
              <Link href="/create" className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors" onClick={() => setMobileOpen(false)}>
                <Plus className="w-4 h-4" />
                {t("nav_postPet")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
