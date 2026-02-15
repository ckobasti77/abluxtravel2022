"use client";

import Link from "next/link";
import AranzmaniEditor from "./aranzmani-editor";
import { useSitePreferences } from "./site-preferences-provider";
import { ADMIN_SECTIONS, PAGE_EDITOR_CONFIG, PageEditorSlot } from "../lib/admin-editors";
import { useSession } from "../lib/use-session";

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

        {slot === "aranzmani" ? (
          <AranzmaniEditor />
        ) : (
          <article className="surface rounded-2xl p-5 sm:p-6">
            <p className="text-sm leading-6 text-muted">
              {language === "sr"
                ? "Editor za ovu stranicu je mapiran u admin panel, ali UI kontrole jos nisu implementirane. Struktura je spremna za sledecu fazu."
                : "The editor for this page is mapped in the admin panel, but its UI controls are not implemented yet. Structure is ready for the next phase."}
            </p>
            {adminSection ? (
              <Link href={adminSection.href} className="btn-secondary mt-4">
                {language === "sr" ? "Otvori admin sekciju" : "Open admin section"}
              </Link>
            ) : null}
          </article>
        )}
      </div>
    </section>
  );
}
