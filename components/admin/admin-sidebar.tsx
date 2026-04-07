"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartLine,
  FaUmbrellaBeach,
  FaPlane,
  FaUsers,
  FaPhotoFilm,
  FaGear,
  FaChurch,
  FaChevronDown,
  FaPlus,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import { useSitePreferences } from "../site-preferences-provider";
import { useSession } from "../../lib/use-session";
import {
  ADMIN_SECTIONS,
  type AdminSectionIcon,
} from "../../lib/admin-editors";
import { useState, useEffect, type ReactNode } from "react";

const ICON_MAP: Record<AdminSectionIcon, ReactNode> = {
  dashboard: <FaChartLine className="text-sm" />,
  arrangements: <FaUmbrellaBeach className="text-sm" />,
  trips: <FaPlane className="text-sm" />,
  users: <FaUsers className="text-sm" />,
  media: <FaPhotoFilm className="text-sm" />,
  settings: <FaGear className="text-sm" />,
  religious: <FaChurch className="text-sm" />,
};

export default function AdminSidebar() {
  const { language } = useSitePreferences();
  const pathname = usePathname();
  const session = useSession();
  const [settingsOpen, setSettingsOpen] = useState(
    pathname.startsWith("/admin/podesavanja")
  );
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(
    null
  );
  const mobileOpen = mobileOpenPath === pathname;
  const openMobileMenu = () => setMobileOpenPath(pathname);
  const closeMobileMenu = () => setMobileOpenPath(null);

  // Prevent body scroll when mobile menu is open
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

  const mainSections = ADMIN_SECTIONS.filter(
    (s) => s.key !== "podesavanja"
  );
  const settingsSection = ADMIN_SECTIONS.find(
    (s) => s.key === "podesavanja"
  );

  const navContent = (
    <>
      {/* Logo / header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
            <FaPlus className="text-xs" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight">
              ABL elin Admin
            </p>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          type="button"
          onClick={closeMobileMenu}
          className="rounded-lg p-1.5 text-[var(--muted)] transition hover:text-[var(--text)] lg:hidden"
        >
          <FaXmark className="text-lg" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Main admin link */}
        <Link
          href="/admin"
          className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
            pathname === "/admin"
              ? "bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
              : "text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
          }`}
        >
          <FaChartLine className="text-sm shrink-0" />
          <span>
            {language === "sr" ? "Kontrolna tabla" : "Dashboard"}
          </span>
        </Link>

        {/* Main sections */}
        {mainSections.map((section) => {
          const active =
            pathname === section.href ||
            pathname.startsWith(section.href + "/");
          const label =
            language === "sr" ? section.label.sr : section.label.en;
          return (
            <Link
              key={section.key}
              href={section.href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
                  : "text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
              }`}
            >
              <span className="shrink-0">
                {ICON_MAP[section.icon]}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Settings with sub-menu */}
        {settingsSection ? (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                pathname.startsWith("/admin/podesavanja")
                  ? "bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
                  : "text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
              }`}
            >
              <FaGear className="text-sm shrink-0" />
              <span className="flex-1 text-left">
                {language === "sr"
                  ? settingsSection.label.sr
                  : settingsSection.label.en}
              </span>
              <FaChevronDown
                className={`text-[10px] transition-transform ${
                  settingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {settingsOpen ? (
              <div className="ml-5 mt-1 grid gap-0.5 border-l border-[var(--line)] pl-3">
                {[
                  {
                    href: "/admin/podesavanja",
                    label:
                      language === "sr"
                        ? "Kartasi"
                        : "Card providers",
                  },
                  {
                    href: "/admin/podesavanja#media",
                    label: "Medija",
                  },
                  {
                    href: "/admin/podesavanja#settings",
                    label:
                      language === "sr"
                        ? "Podesavanje"
                        : "Settings",
                  },
                ].map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="rounded-md px-3 py-2 text-xs text-[var(--muted)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </nav>

      {/* Bottom: user info */}
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
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button — fixed top-left */}
      <button
        type="button"
        onClick={openMobileMenu}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] shadow-lg transition hover:text-[var(--text)] lg:hidden"
        aria-label="Open menu"
      >
        <FaBars className="text-base" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      ) : null}

      {/* Sidebar — off-canvas on mobile, static on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--bg)] transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
