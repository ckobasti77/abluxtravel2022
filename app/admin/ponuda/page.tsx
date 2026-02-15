"use client";

import { useSitePreferences } from "../../../components/site-preferences-provider";

export default function AdminPonudaPage() {
  const { language } = useSitePreferences();

  return (
    <section className="surface rounded-3xl border border-[var(--line)] p-6 sm:p-8">
      <p className="inline-flex rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-3 py-1 text-xs uppercase tracking-[0.14em]">
        {language === "sr" ? "Sledeca faza" : "Next phase"}
      </p>
      <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
        {language === "sr" ? "Ponuda editor" : "Offer editor"}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
        {language === "sr"
          ? "Ovde ce ici kontrole za source status, intervale sinhronizacije i prioritete ponuda."
          : "This section is reserved for source status, synchronization intervals, and offer prioritization controls."}
      </p>
    </section>
  );
}
