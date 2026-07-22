"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  FaBars,
  FaBus,
  FaChartLine,
  FaChurch,
  FaGear,
  FaHouse,
  FaPhotoFilm,
  FaPlane,
  FaUmbrellaBeach,
  FaUsers,
  FaXmark,
} from "react-icons/fa6";
import { ADMIN_SECTIONS, type AdminSectionIcon } from "../../lib/admin-editors";
import { SITE_NAME } from "../../lib/seo";
import { useSession } from "../../lib/use-session";
import { useSitePreferences } from "../site-preferences-provider";

const ICON_MAP: Record<AdminSectionIcon, ReactNode> = {
  dashboard: <FaChartLine className="text-sm" />,
  home: <FaHouse className="text-sm" />,
  arrangements: <FaUmbrellaBeach className="text-sm" />,
  trips: <FaPlane className="text-sm" />,
  vehicles: <FaBus className="text-sm" />,
  users: <FaUsers className="text-sm" />,
  media: <FaPhotoFilm className="text-sm" />,
  settings: <FaGear className="text-sm" />,
  religious: <FaChurch className="text-sm" />,
};

export default function AdminSidebar() {
  const { language } = useSitePreferences();
  const pathname = usePathname();
  const session = useSession();
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const mobileOpen = mobileOpenPath === pathname;
  const openMobileMenu = () => setMobileOpenPath(pathname);
  const closeMobileMenu = () => setMobileOpenPath(null);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const mainSections = ADMIN_SECTIONS.filter((section) => section.key !== "podesavanja");
  const settingsSection = ADMIN_SECTIONS.find((section) => section.key === "podesavanja");

  const navContent = (
    <>
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-5">
        <Link
          href="/admin"
          onClick={closeMobileMenu}
          className="flex min-w-0 items-center gap-3 transition hover:opacity-90"
        >
          <Image
            src="/logo-dark.avif"
            alt={SITE_NAME}
            width={500}
            height={500}
            className="h-10 w-auto shrink-0"
            priority
          />
          <div className="min-w-0">
            <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              {language === "sr" ? "Administracija" : "Administration"}
            </p>
            <p className="truncate text-base font-semibold tracking-tight text-[var(--text)]">
              {SITE_NAME}
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={closeMobileMenu}
          className="rounded-lg p-1.5 text-[var(--muted)] transition hover:text-[var(--text)] lg:hidden"
          aria-label={language === "sr" ? "Zatvori meni" : "Close menu"}
        >
          <FaXmark className="text-lg" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          {language === "sr" ? "Moduli" : "Modules"}
        </p>

        <Link
          href="/admin"
          onClick={closeMobileMenu}
          className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
            pathname === "/admin"
              ? "bg-[var(--primary-soft)] font-semibold text-[var(--primary)]"
              : "text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
          }`}
        >
          <FaChartLine className="shrink-0 text-sm" />
          <span>{language === "sr" ? "Kontrolna tabla" : "Dashboard"}</span>
        </Link>

        {mainSections.map((section) => {
          const active =
            pathname === section.href || pathname.startsWith(`${section.href}/`);
          const label = language === "sr" ? section.label.sr : section.label.en;

          return (
            <Link
              key={section.key}
              href={section.href}
              onClick={closeMobileMenu}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-[var(--primary-soft)] font-semibold text-[var(--primary)]"
                  : "text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
              }`}
            >
              <span className="shrink-0">{ICON_MAP[section.icon]}</span>
              <span>{label}</span>
            </Link>
          );
        })}

        {settingsSection ? (
          <Link
            href={settingsSection.href}
            onClick={closeMobileMenu}
            className={`mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
              pathname.startsWith("/admin/podesavanja")
                ? "bg-[var(--primary-soft)] font-semibold text-[var(--primary)]"
                : "text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
            }`}
          >
            <span className="shrink-0">{ICON_MAP.settings}</span>
            <span>{language === "sr" ? settingsSection.label.sr : settingsSection.label.en}</span>
          </Link>
        ) : null}
      </nav>

      <div className="border-t border-[var(--line)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
            {session?.displayName?.charAt(0)?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
               {session?.displayName ?? "Admin"}
            </p>
            <p className="truncate text-xs text-[var(--muted)]">
               {session?.email ?? ""}
            </p>
            <p className="truncate pt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              {language === "sr" ? "Admin nalog" : "Admin account"}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={openMobileMenu}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] shadow-lg transition hover:text-[var(--text)] lg:hidden"
        aria-label={language === "sr" ? "Otvori meni" : "Open menu"}
      >
        <FaBars className="text-base" />
      </button>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[296px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--bg)] transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
