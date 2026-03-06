"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { ADMIN_SECTIONS } from "../../lib/admin-editors";
import { useSession } from "../../lib/use-session";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { dictionary, language } = useSitePreferences();
  const pathname = usePathname();
  const session = useSession();

  const isAdmin = session?.role === "admin";

  if (!isAdmin) {
    return (
      <AlienShell className="site-fade">
        <section className="mx-auto max-w-2xl">
          <article className="surface rounded-3xl p-8 text-center">
            <h1 className="text-3xl font-semibold">{dictionary.admin.accessTitle}</h1>
            <p className="mt-3 text-sm text-muted">{dictionary.admin.accessDescription}</p>
            <Link href="/auth?mode=signin&next=%2Fadmin" className="btn-primary mt-6">
              {dictionary.admin.signIn}
            </Link>
          </article>
        </section>
      </AlienShell>
    );
  }

  return (
    <AlienShell className="site-fade">
      <section className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
        <div className="space-y-3">
          <span className="pill">
            {language === "sr" ? "Alien admin matrix" : "Alien admin matrix"}
          </span>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            {language === "sr" ? "ABLux Admin Komanda" : "ABLux Admin Command"}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted sm:text-base">
            {language === "sr"
              ? "Glavna kontrolna zona za uredjivanje stranica, ponuda i operativnih signala sajta."
              : "Main control zone for editing pages, offers, and operational website signals."}
          </p>
        </div>
        <article className="surface rounded-2xl px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {language === "sr" ? "Ulogovan admin" : "Signed in admin"}
          </p>
          <p className="mt-1 font-semibold">{session?.displayName}</p>
          <p className="text-xs text-muted">{session?.email}</p>
        </article>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="surface h-fit rounded-3xl p-4 lg:sticky lg:top-28">
          <p className="px-2 pb-2 text-xs uppercase tracking-[0.16em] text-muted">
            {language === "sr" ? "Editor moduli" : "Editor modules"}
          </p>
          <nav className="grid gap-2">
            <Link
              href="/admin"
              className={`rounded-2xl border px-3 py-3 transition ${
                pathname === "/admin"
                  ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                  : "border-[var(--line)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]"
              }`}
            >
              <p className="text-sm font-semibold">
                {language === "sr" ? "Main admin page" : "Main admin page"}
              </p>
              <p className="mt-1 text-xs text-muted">
                {language === "sr"
                  ? "Ulazna komandna tabla"
                  : "Main command dashboard"}
              </p>
            </Link>
            {ADMIN_SECTIONS.map((link) => {
              const label = language === "sr" ? link.label.sr : link.label.en;
              const hint = language === "sr" ? link.hint.sr : link.hint.en;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-2xl border px-3 py-3 transition ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--line)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]"
                  }`}
                >
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-1 text-xs text-muted">{hint}</p>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </section>
    </AlienShell>
  );
}
