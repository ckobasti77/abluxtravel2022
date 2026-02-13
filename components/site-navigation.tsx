"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { SITE_NAV_ITEMS } from "../lib/site-nav";
import { useSession } from "../lib/use-session";
import { useSitePreferences } from "./site-preferences-provider";

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function SiteNavigation() {
  const pathname = usePathname();
  const session = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dictionary, language, setLanguage, theme, toggleTheme } = useSitePreferences();

  const accountLink = useMemo(
    () =>
      session?.role === "admin"
        ? { href: "/admin", label: dictionary.nav.admin }
        : { href: "/signin", label: dictionary.nav.signIn },
    [dictionary.nav.admin, dictionary.nav.signIn, session?.role]
  );

  const nextThemeLabel = theme === "dark" ? dictionary.nav.switchToLight : dictionary.nav.switchToDark;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-8">
      <div className="surface mx-auto flex w-full max-w-7xl items-center gap-4 rounded-2xl px-4 py-3 sm:px-6">
        <Link href="/" className="inline-flex items-center" aria-label={dictionary.nav.brand}>
          <Image
            src="/logo.png"
            alt={dictionary.nav.brand}
            width={426}
            height={259}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium md:flex">
          {SITE_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActivePath(pathname, item.href)
                  ? "text-[var(--primary)]"
                  : "text-muted transition hover:text-[var(--text)]"
              }
            >
              {dictionary.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="surface-strong inline-flex rounded-full p-1">
            <button
              type="button"
              onClick={() => setLanguage("sr")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                language === "sr" ? "bg-[var(--primary-soft)] text-[var(--text)]" : "text-muted"
              }`}
            >
              SR
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                language === "en" ? "bg-[var(--primary-soft)] text-[var(--text)]" : "text-muted"
              }`}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-secondary !px-4 !py-2 !text-xs"
          >
            {nextThemeLabel}
          </button>
          <Link href={accountLink.href} className="btn-primary !px-4 !py-2 !text-xs">
            {accountLink.label}
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
          className="surface-strong ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          onClick={() => setMobileOpen((previous) => !previous)}
        >
          {mobileOpen ? "X" : "="}
        </button>
      </div>

      {mobileOpen ? (
        <div className="surface site-fade mx-auto mt-3 flex w-full max-w-7xl flex-col gap-3 rounded-2xl p-4 md:hidden">
          {SITE_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActivePath(pathname, item.href)
                  ? "font-semibold text-[var(--primary)]"
                  : "text-muted"
              }
              onClick={() => setMobileOpen(false)}
            >
              {dictionary.nav[item.key]}
            </Link>
          ))}

          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage("sr")}
              className={`btn-secondary !px-3 !py-2 !text-xs ${
                language === "sr" ? "!bg-[var(--primary-soft)]" : ""
              }`}
            >
              SR
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`btn-secondary !px-3 !py-2 !text-xs ${
                language === "en" ? "!bg-[var(--primary-soft)]" : ""
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary !px-3 !py-2 !text-xs"
            >
              {nextThemeLabel}
            </button>
          </div>

          <Link
            href={accountLink.href}
            onClick={() => setMobileOpen(false)}
            className="btn-primary mt-1 !justify-center !px-4 !py-2 !text-xs"
          >
            {accountLink.label}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
