"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { ADMIN_SECTIONS } from "../../lib/admin-editors";

const priorityBySection: Record<string, "high" | "medium"> = {
  pocetna: "medium",
  aranzmani: "high",
  putovanja: "high",
  "iznajmljivanje-vozila": "high",
  "verski-turizam": "high",
  podesavanja: "medium",
};

export default function AdminPage() {
  const { language } = useSitePreferences();
  const highPriorityCount = ADMIN_SECTIONS.filter(
    (section) => priorityBySection[section.key] === "high"
  ).length;

  return (
    <section className="grid gap-6">
      <article className="section-holo overflow-hidden p-6 sm:p-8">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {language === "sr" ? "ABLux Travel administracija" : "ABLux Travel administration"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {language === "sr"
                ? "Komandni centar"
                : "Command center"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
              {language === "sr"
                ? "Na jednom mestu upravljate aranžmanima, slajdovima, verskim ponudama i operativnim podacima sajta."
                : "Manage packages, slide content, religious offers, and core site operations from one place."}
            </p>
          </div>
          <div className="grid gap-3">
            <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                {language === "sr" ? "Aktivni moduli" : "Active modules"}
              </p>
              <p className="mt-1 text-3xl font-semibold">{ADMIN_SECTIONS.length}</p>
            </article>
            <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                {language === "sr" ? "Visok prioritet" : "High priority"}
              </p>
              <p className="mt-1 text-3xl font-semibold">{highPriorityCount}</p>
            </article>
          </div>
        </div>
      </article>

      <section>
        <h3 className="mb-3 text-xl font-semibold">
          {language === "sr" ? "Operativni moduli" : "Operational modules"}
        </h3>
        <div className="stagger-grid grid gap-4 sm:grid-cols-2">
          {ADMIN_SECTIONS.map((section, index) => {
            const label = language === "sr" ? section.label.sr : section.label.en;
            const hint = language === "sr" ? section.hint.sr : section.hint.en;
            const isHigh = priorityBySection[section.key] === "high";
            return (
              <Link
                key={section.key}
                href={section.href}
                className="fx-lift section-holo flex flex-col gap-3 rounded-2xl border border-[var(--line)] p-5 transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold">{label}</p>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${
                      isHigh
                        ? "border-emerald-400/45 bg-emerald-400/10 text-emerald-300"
                        : "border-slate-400/45 bg-slate-400/10 text-slate-300"
                    }`}
                  >
                    {isHigh
                      ? language === "sr"
                        ? "prioritet"
                        : "priority"
                      : language === "sr"
                        ? "stabilno"
                        : "stable"}
                  </span>
                </div>
                <p className="text-sm text-muted">{hint}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
                  {language === "sr" ? "Otvori modul" : "Open module"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </section>
  );
}
