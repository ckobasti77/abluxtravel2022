"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { SITE_NAV_ITEMS } from "../lib/site-nav";
import { useSession } from "../lib/use-session";

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

  const accountLink = useMemo(
    () =>
      session?.role === "admin"
        ? { href: "/admin", label: "Admin" }
        : { href: "/signin", label: "Sign In" },
    [session?.role]
  );

  return (
    <nav className="relative z-40">
      <div className="fixed left-0 right-0 top-0 px-4 pt-4 sm:px-8">
        <div className="alien-panel mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-2xl px-4 sm:px-6">
          <Link href="/" className="text-sm uppercase tracking-[0.32em] text-cyan-100">
            AB Lux Travel 2022
          </Link>

          <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-cyan-50/85 md:flex">
            {SITE_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActivePath(pathname, item.href)
                    ? "text-cyan-100"
                    : "text-cyan-100/60 transition hover:text-cyan-100"
                }
              >
                {item.label}
              </Link>
            ))}
            <div className="h-5 w-px bg-cyan-100/20" />
            <Link
              href={accountLink.href}
              className="rounded-full border border-cyan-100/35 px-4 py-2 text-[10px] tracking-[0.3em] text-cyan-100 transition hover:border-cyan-100/70"
            >
              {accountLink.label}
            </Link>
          </div>

          <button
            aria-label="Meni"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-100/30 text-sm text-cyan-100 md:hidden"
          >
            {mobileOpen ? "X" : "="}
          </button>
        </div>

        {mobileOpen ? (
          <div className="alien-panel mx-auto mt-3 w-full max-w-7xl rounded-2xl p-4 md:hidden">
            <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.25em] text-cyan-50/80">
              {SITE_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={isActivePath(pathname, item.href) ? "text-cyan-100" : ""}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={accountLink.href}
                onClick={() => setMobileOpen(false)}
                className="pt-1 text-cyan-100/90"
              >
                {accountLink.label}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
