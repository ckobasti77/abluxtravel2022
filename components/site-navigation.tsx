"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaBars, FaMoon, FaSun, FaXmark } from "react-icons/fa6";
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
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const { dictionary, language, setLanguage, theme, toggleTheme } = useSitePreferences();
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const accountLink = useMemo(
    () =>
      session?.role === "admin"
        ? { href: "/admin", label: dictionary.nav.admin }
        : { href: "/signin", label: dictionary.nav.signIn },
    [dictionary.nav.admin, dictionary.nav.signIn, session?.role]
  );

  const nextThemeLabel = theme === "dark" ? dictionary.nav.switchToLight : dictionary.nav.switchToDark;
  const themeIcon = theme === "dark" ? <FaSun aria-hidden size={16} /> : <FaMoon aria-hidden size={16} />;
  const logoSrc = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";
  const logoSize = theme === "dark" ? { width: 500, height: 500 } : { width: 301, height: 318 };

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const previousScrollY = lastScrollYRef.current;
        const delta = currentScrollY - previousScrollY;

        setIsCompact(currentScrollY > 28);

        if (mobileOpen) {
          setIsNavVisible(true);
        } else if (currentScrollY <= 12) {
          setIsNavVisible(true);
        } else if (Math.abs(delta) >= 10) {
          setIsNavVisible(delta < 0);
        }

        lastScrollYRef.current = currentScrollY;
        tickingRef.current = false;
      });
    };

    lastScrollYRef.current = window.scrollY;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`site-nav fixed left-0 right-0 top-0 z-50 pt-3 ${
        isNavVisible ? "site-nav--visible" : "site-nav--hidden"
      }`}
    >
      <div className="site-nav-frame mx-auto w-full max-w-7xl px-3 sm:px-8">
        <div
          className={`surface site-nav-shell flex min-w-0 w-full items-center gap-3 rounded-2xl px-3 py-2.5 sm:px-5 ${
            isCompact ? "site-nav-shell--compact" : ""
          }`}
        >
          <Link
            href="/"
            className="inline-flex min-w-0 shrink-0 items-center"
            aria-label={dictionary.nav.brand}
          >
            <Image
              src={logoSrc}
              alt={dictionary.nav.brand}
              width={logoSize.width}
              height={logoSize.height}
              className={`w-auto max-w-[8.5rem] transition-[height,transform] duration-500 sm:max-w-none ${
                isCompact ? "h-10 sm:h-11" : "h-11 sm:h-14"
              }`}
              priority
            />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 text-sm font-medium md:flex">
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
              aria-label={nextThemeLabel}
              title={nextThemeLabel}
              className="surface-strong inline-flex h-9 w-9 items-center justify-center rounded-full text-sm transition hover:bg-[var(--primary-soft)]"
            >
              {themeIcon}
            </button>
            <Link href={accountLink.href} className="btn-primary !px-4 !py-2 !text-xs">
              {accountLink.label}
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
            className="surface-strong ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:hidden"
            onClick={() => setMobileOpen((previous) => !previous)}
          >
            {mobileOpen ? <FaXmark aria-hidden size={16} /> : <FaBars aria-hidden size={16} />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="surface site-fade site-nav-mobile mt-3 flex w-full min-w-0 flex-col gap-3 rounded-2xl p-4 md:hidden">
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

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage("sr")}
                className={`btn-secondary min-w-[3.35rem] !px-3 !py-2 !text-xs ${
                  language === "sr" ? "!bg-[var(--primary-soft)]" : ""
                }`}
              >
                SR
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`btn-secondary min-w-[3.35rem] !px-3 !py-2 !text-xs ${
                  language === "en" ? "!bg-[var(--primary-soft)]" : ""
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={nextThemeLabel}
                title={nextThemeLabel}
                className="btn-secondary w-full !justify-center !px-3 !py-2 !text-xs"
              >
                <span className="inline-flex items-center justify-center gap-2 whitespace-normal text-center leading-tight">
                  {themeIcon}
                  {nextThemeLabel}
                </span>
              </button>
            </div>

            <Link
              href={accountLink.href}
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-1 w-full !justify-center !px-4 !py-2 !text-xs"
            >
              {accountLink.label}
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
