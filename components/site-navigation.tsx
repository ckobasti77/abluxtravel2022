"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  FaBars,
  FaChevronDown,
  FaMagnifyingGlass,
  FaMoon,
  FaSun,
  FaXmark,
} from "react-icons/fa6";
import { signOut } from "../lib/local-auth";
import { SITE_NAV_ITEMS, type SiteNavSubItem } from "../lib/site-nav";
import { useSession } from "../lib/use-session";
import { useTrips } from "../lib/use-trips";
import { useSlides } from "../lib/use-slides";
import { useOffersLiveBoard } from "../lib/use-offers";
import { isReligiousOffer } from "../lib/religious";
import { useCategories } from "../lib/use-categories";
import { toCountrySlug } from "../lib/country-route";
import { useSitePreferences } from "./site-preferences-provider";
import CartButton from "./cart-button";

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function SiteNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const isHome = pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(isHome);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  const { dictionary, language, setLanguage, theme, toggleTheme } =
    useSitePreferences();

  const trips = useTrips();
  const slides = useSlides([]);
  const offers = useOffersLiveBoard(undefined, []);
  const arrangementCategories = useCategories("arrangement");
  const religiousCategories = useCategories("religious");

  const navItems = useMemo(() => {
    const offeredTrips = trips.filter((trip) => trip.status !== "completed");

    // Trips dropdown: individual trips
    const tripChildren: SiteNavSubItem[] = offeredTrips.map((t) => ({
      key: `trip-${t.slug}`,
      href: `/aranzmani/${t.slug}`,
      label: t.title,
    }));
    const slideChildren = slides.reduce<SiteNavSubItem[]>((acc, slide) => {
        const countrySlug = toCountrySlug(slide.title) || toCountrySlug(slide.id);
        if (!countrySlug) return acc;
        acc.push({
          key: `slide-${slide.id}`,
          href: `/putovanja/${countrySlug}`,
          label: slide.title,
        });
        return acc;
      }, []);

    // Arrangements dropdown: categories or fallback to individual trips
    const arrCatChildren: SiteNavSubItem[] = arrangementCategories.map((c) => ({
      key: `cat-arr-${c._id}`,
      href: `/aranzmani?category=${c.slug}`,
      label: language === "sr" ? c.name.sr : c.name.en,
    }));
    const arrFallback: SiteNavSubItem[] = offeredTrips.map((t) => ({
      key: `arr-${t.slug}`,
      href: `/aranzmani/${t.slug}`,
      label: t.title,
    }));

    // Religious dropdown: individual offers or fallback to categories
    const religiousOfferChildren: SiteNavSubItem[] = offers
      .filter((o) => isReligiousOffer(o))
      .map((o) => ({
        key: `rel-${o.id}`,
        href: `/verski-turizam#${encodeURIComponent(o.id)}`,
        label: o.navTitle?.trim() || o.title,
      }));
    const relCatChildren: SiteNavSubItem[] = religiousCategories.map((c) => ({
      key: `cat-rel-${c._id}`,
      href: `/verski-turizam?category=${c.slug}`,
      label: language === "sr" ? c.name.sr : c.name.en,
    }));

    return SITE_NAV_ITEMS.map((item) => {
      if (item.key === "trips") {
        const children =
          tripChildren.length > 0
            ? tripChildren
            : slideChildren.length > 0
              ? slideChildren
              : item.children;
        return { ...item, children };
      }
      if (item.key === "arrangements") {
        const children = arrCatChildren.length > 0 ? arrCatChildren : arrFallback;
        return { ...item, children: children.length > 0 ? children : item.children };
      }
      if (item.key === "religiousTourism") {
        const children =
          religiousOfferChildren.length > 0 ? religiousOfferChildren : relCatChildren;
        return { ...item, children: children.length > 0 ? children : item.children };
      }
      return item;
    });
  }, [trips, slides, offers, arrangementCategories, religiousCategories, language]);

  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navBarRef = useRef<HTMLDivElement>(null);

  const adminLink = useMemo(
    () =>
      session?.role === "admin"
        ? { href: "/admin", label: dictionary.nav.admin }
        : null,
    [dictionary.nav.admin, session?.role],
  );

  const nextThemeLabel =
    theme === "dark"
      ? dictionary.nav.switchToLight
      : dictionary.nav.switchToDark;
  const themeIcon =
    theme === "dark" ? (
      <FaSun aria-hidden size={13} />
    ) : (
      <FaMoon aria-hidden size={13} />
    );
  const logoSrc = theme === "dark" ? "/logo-dark.avif" : "/logo-light.avif";
  const logoSize =
    theme === "dark"
      ? { width: 500, height: 500 }
      : { width: 301, height: 318 };

  /* ── handlers ── */
  const handleSignOut = () => {
    signOut();
    setMobileOpen(false);
    if (pathname.startsWith("/admin")) {
      router.push("/auth?mode=signin");
      return;
    }
    router.refresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/aranzmani?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 180);
  };

  /* ── effects ── */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }
    document.body.style.setProperty("overflow", "hidden");
    return () => void document.body.style.removeProperty("overflow");
  }, [mobileOpen]);

  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const prev = lastScrollYRef.current;
        const delta = y - prev;

        setIsScrolled(y > 20);
        const heroElement = document.querySelector<HTMLElement>(".hero-travel");
        const navHeight = navBarRef.current?.offsetHeight ?? 0;
        setIsOverHero((heroElement?.getBoundingClientRect().bottom ?? 0) > navHeight);

        if (mobileOpen) setIsNavVisible(true);
        else if (y <= 12) setIsNavVisible(true);
        else if (Math.abs(delta) >= 10) setIsNavVisible(delta < 0);

        lastScrollYRef.current = y;
        tickingRef.current = false;
      });
    };
    lastScrollYRef.current = window.scrollY;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome, mobileOpen]);

  /* close mobile/search on navigation — handled via onClick on links */
  const isHeroUnderNav = isHome && isOverHero;

  if (pathname.startsWith("/admin")) return null;

  /* ────────────────────── JSX ────────────────────── */
  return (
    <header
      className={`site-nav fixed inset-x-0 top-0 z-50 ${
        isNavVisible ? "site-nav--visible" : "site-nav--hidden"
      } ${mobileOpen ? "site-nav--mobile-open" : ""}`}
    >
      <div
        ref={navBarRef}
        className={`nav-bar ${isScrolled ? "nav-bar--scrolled" : ""} ${isHeroUnderNav ? "nav-bar--hero" : ""}`}
      >
        <div className="nav-bar__inner">
          {/* ─── Logo ─── */}
          <Link
            href="/"
            className="nav-bar__logo"
            aria-label={dictionary.nav.brand}
          >
            <Image
              src={logoSrc}
              alt={dictionary.nav.brand}
              width={logoSize.width}
              height={logoSize.height}
              className={`w-auto transition-[height] duration-500 ${
                isScrolled ? "h-8 sm:h-9" : "h-9 sm:h-11"
              }`}
              priority
            />
          </Link>

          {/* ─── Desktop Links ─── */}
          <nav className="nav-bar__links">
            {navItems.map((item) => (
              <div
                key={item.key}
                className="nav-bar__link-wrap"
                onMouseEnter={() =>
                  item.children && handleDropdownEnter(item.key)
                }
                onMouseLeave={() =>
                  item.children && handleDropdownLeave()
                }
              >
                <Link
                  href={item.href}
                  className={`nav-bar__link ${
                    isActivePath(pathname, item.href)
                      ? "nav-bar__link--active"
                      : ""
                  }`}
                >
                  {dictionary.nav[item.key]}
                  {item.children && (
                    <FaChevronDown
                      size={8}
                      className={`ml-1 transition-transform duration-200 ${
                        openDropdown === item.key ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  )}
                </Link>

                {/* dropdown */}
                {item.children && (
                  <div
                    className={`nav-dropdown ${
                      openDropdown === item.key ? "nav-dropdown--open" : ""
                    }`}
                  >
                    <div
                      className={`nav-dropdown__card ${
                        item.children.length > 5
                          ? "nav-dropdown__card--scrollable"
                          : ""
                      }`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          className="nav-dropdown__item"
                        >
                          {child.label ??
                            dictionary.nav[
                              child.key as keyof typeof dictionary.nav
                            ]}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ─── Desktop Actions ─── */}
          <div className="nav-bar__actions">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              className="nav-action-btn"
            >
              <FaMagnifyingGlass aria-hidden size={12} />
            </button>

            {/* Language */}
            <div className="nav-lang">
              <button
                type="button"
                onClick={() => setLanguage("sr")}
                className={`nav-lang__btn ${
                  language === "sr" ? "nav-lang__btn--active" : ""
                }`}
              >
                SR
              </button>
              <span className="nav-lang__sep" />
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`nav-lang__btn ${
                  language === "en" ? "nav-lang__btn--active" : ""
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={nextThemeLabel}
              title={nextThemeLabel}
              className="nav-action-btn"
            >
              {themeIcon}
            </button>

            {/* Cart */}
            <CartButton />

            {/* Auth */}
            {session ? (
              <div className="flex items-center gap-1.5">
                {/* <span className="nav-bar__user">{session.displayName}</span> */}
                {adminLink && (
                  <Link
                    href={adminLink.href}
                    className="nav-auth-btn nav-auth-btn--gold"
                  >
                    {adminLink.label}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="nav-auth-btn"
                >
                  {dictionary.nav.signOut}
                </button>
              </div>
            ) : (
              <Link href="/auth" className="nav-auth-btn nav-auth-btn--gold">
                {dictionary.nav.signIn}
              </Link>
            )}
          </div>

          {/* ─── Mobile Controls ─── */}
          <div className="nav-bar__mobile-actions">
            <div className="nav-lang nav-lang--mobile">
              <button
                type="button"
                onClick={() => setLanguage("sr")}
                className={`nav-lang__btn ${language === "sr" ? "nav-lang__btn--active" : ""}`}
              >
                SR
              </button>
              <span className="nav-lang__sep" />
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`nav-lang__btn ${language === "en" ? "nav-lang__btn--active" : ""}`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={nextThemeLabel}
              title={nextThemeLabel}
              className="nav-action-btn"
            >
              {themeIcon}
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              className="nav-action-btn"
            >
              <FaMagnifyingGlass aria-hidden size={12} />
            </button>

            <CartButton />

            <button
              type="button"
              aria-label={
                mobileOpen
                  ? dictionary.nav.closeMenu
                  : dictionary.nav.openMenu
              }
              className="nav-action-btn nav-action-btn--hamburger"
              onClick={() => setMobileOpen((p) => !p)}
            >
              {mobileOpen ? (
                <FaXmark aria-hidden size={17} />
              ) : (
                <FaBars aria-hidden size={16} />
              )}
            </button>
          </div>
        </div>

        {/* ─── Search Drawer (shared desktop / mobile) ─── */}
        <div
          className={`nav-search ${searchOpen ? "nav-search--open" : ""}`}
        >
          <form onSubmit={handleSearchSubmit} className="nav-search__form">
            <FaMagnifyingGlass
              size={14}
              className="shrink-0 opacity-40"
              aria-hidden
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dictionary.nav.searchPlaceholder}
              className="nav-search__input"
            />
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="nav-search__close"
              aria-label={dictionary.nav.closeMenu}
            >
              <FaXmark size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* ────── Mobile Full-Screen Drawer ────── */}
      <div
        className={`nav-mobile ${mobileOpen ? "nav-mobile--open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <nav
          className="nav-mobile__links"
          aria-label={dictionary.nav.openMenu}
        >
          {navItems.map((item, i) => (
            <div
              key={item.key}
              className="nav-mobile__group"
              style={{ "--mi": i } as CSSProperties}
            >
              <div className="nav-mobile__row">
                <Link
                  href={item.href}
                  tabIndex={mobileOpen ? 0 : -1}
                  className={`nav-mobile__link ${
                    isActivePath(pathname, item.href)
                      ? "nav-mobile__link--active"
                      : ""
                  }`}
                  onClick={() => !item.children && setMobileOpen(false)}
                >
                  {dictionary.nav[item.key]}
                </Link>
                {item.children && (
                  <button
                    type="button"
                    tabIndex={mobileOpen ? 0 : -1}
                    onClick={() =>
                      setMobileAccordion((p) =>
                        p === item.key ? null : item.key,
                      )
                    }
                    className="nav-mobile__chevron"
                    aria-label="Toggle submenu"
                  >
                    <FaChevronDown
                      size={10}
                      className={`transition-transform duration-200 ${
                        mobileAccordion === item.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* accordion children */}
              {item.children && mobileAccordion === item.key && (
                <div className="nav-mobile__accordion">
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      className="nav-mobile__sublink"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label ??
                        dictionary.nav[
                          child.key as keyof typeof dictionary.nav
                        ]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* bottom utility row */}
        <div className="nav-mobile__footer">
          <div className="nav-mobile__utils">
            <div className="nav-lang nav-lang--mobile">
              <button
                type="button"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={() => setLanguage("sr")}
                className={`nav-lang__btn ${
                  language === "sr" ? "nav-lang__btn--active" : ""
                }`}
              >
                SR
              </button>
              <span className="nav-lang__sep" />
              <button
                type="button"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={() => setLanguage("en")}
                className={`nav-lang__btn ${
                  language === "en" ? "nav-lang__btn--active" : ""
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              tabIndex={mobileOpen ? 0 : -1}
              onClick={toggleTheme}
              aria-label={nextThemeLabel}
              className="nav-action-btn"
            >
              {themeIcon}
            </button>
          </div>

          {session ? (
            <>
              <p className="nav-mobile__username">{session.displayName}</p>
              {adminLink && (
                <Link
                  href={adminLink.href}
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={() => setMobileOpen(false)}
                  className="nav-auth-btn nav-auth-btn--gold w-full justify-center"
                >
                  {adminLink.label}
                </Link>
              )}
              <button
                type="button"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={handleSignOut}
                className="nav-auth-btn w-full justify-center"
              >
                {dictionary.nav.signOut}
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              tabIndex={mobileOpen ? 0 : -1}
              onClick={() => setMobileOpen(false)}
              className="nav-auth-btn nav-auth-btn--gold w-full justify-center"
            >
              {dictionary.nav.signIn}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
