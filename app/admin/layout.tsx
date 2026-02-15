"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
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
            <Link href="/signin" className="btn-primary mt-6">
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
            {language === "sr" ? "Admin Control Matrix" : "Admin Control Matrix"}
          </span>
          <h1 className="text-4xl font-semibold sm:text-5xl">{dictionary.admin.title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted sm:text-base">
            {language === "sr"
              ? "Centralno mesto za uredjivanje kljucnih sekcija sajta. Aranzmani editor je vec aktivan, ostale sekcije su spremne za dalje faze."
              : "Central place to manage key website sections. Arrangements editor is active, while other sections are prepared for next phases."}
          </p>
        </div>
        <article className="surface rounded-2xl px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {language === "sr" ? "Ulogovan admin" : "Signed in admin"}
          </p>
          <p className="mt-1 font-semibold">{session?.username}</p>
        </article>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="surface h-fit rounded-3xl p-4 lg:sticky lg:top-28">
          <p className="px-2 pb-2 text-xs uppercase tracking-[0.16em] text-muted">
            {language === "sr" ? "Sekcije editora" : "Editor sections"}
          </p>
          <nav className="grid gap-2">
            {ADMIN_SECTIONS.map((link) => {
              const label = language === "sr" ? link.label.sr : link.label.en;
              const hint = language === "sr" ? link.hint.sr : link.hint.en;
              const active =
                pathname === link.href || (pathname?.startsWith(link.href) ?? false);
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
