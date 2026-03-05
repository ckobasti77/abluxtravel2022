"use client";

import Link from "next/link";
import { useSitePreferences } from "./site-preferences-provider";
import { ADMIN_SECTIONS, PAGE_EDITOR_CONFIG, PageEditorSlot } from "../lib/admin-editors";
import { useSession } from "../lib/use-session";
import type { CSSProperties } from "react";

type PageAdminEditorDockProps = {
  slot: PageEditorSlot;
  className?: string;
  panelClassName?: string;
};

const cx = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

export default function PageAdminEditorDock({
  slot,
  className,
  panelClassName,
}: PageAdminEditorDockProps) {
  const { language } = useSitePreferences();
  const session = useSession();

  if (session?.role !== "admin") {
    return null;
  }

  const config = PAGE_EDITOR_CONFIG[slot];
  const adminSection = ADMIN_SECTIONS.find((item) => item.key === config.adminSection);
  const label = language === "sr" ? config.title.sr : config.title.en;
  const description = language === "sr" ? config.description.sr : config.description.en;
  const roadmap =
    language === "sr"
      ? [
          "Uredi naslov, ton i CTA poruke sekcije kroz admin panel.",
          "Sinhronizuj ponude, prioritete i vizuelni raspored bez ulaska u kod.",
          "Testiraj iskustvo kroz preview tok i odmah objavi izmenu.",
        ]
      : [
          "Update section headlines, tone, and CTA copy from the admin panel.",
          "Sync offers, priorities, and visual order without touching code.",
          "Validate experience in preview flow and publish immediately.",
        ];
  const statusLabel =
    config.status === "ready"
      ? language === "sr"
        ? "Aktivno"
        : "Active"
      : language === "sr"
        ? "Priprema"
        : "Planned";

  return (
    <section className={className}>
      <div
        className={cx(
          "rounded-3xl border border-[var(--line)] bg-[linear-gradient(145deg,var(--primary-soft),transparent_56%)] p-6 sm:p-8",
          panelClassName
        )}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {language === "sr" ? "Page editor dock" : "Page editor dock"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>
          </div>
          <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
            {statusLabel}
          </span>
        </div>

        <article className="section-holo rounded-2xl p-5 sm:p-6">
          <p className="text-sm leading-6 text-muted">
            {language === "sr"
              ? "Ovaj modul je spreman za operativno uredjivanje. Fokus je da marketing tim brzo menja poruke i ponude bez zastoja."
              : "This module is ready for operational editing. The focus is enabling fast content and offer updates without bottlenecks."}
          </p>
          <ul className="stagger-grid mt-4 grid gap-2 text-sm text-muted">
            {roadmap.map((item, index) => (
              <li
                key={item}
                className="fx-lift rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                {item}
              </li>
            ))}
          </ul>
          {adminSection ? (
            <Link href={adminSection.href} className="btn-secondary mt-5">
              {language === "sr" ? "Otvori control centar" : "Open control center"}
            </Link>
          ) : null}
        </article>
      </div>
    </section>
  );
}
