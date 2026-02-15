"use client";

import { useSitePreferences } from "../../../components/site-preferences-provider";

export default function AdminKontaktPage() {
  const { language } = useSitePreferences();

  return (
    <section className="surface rounded-3xl border border-[var(--line)] p-6 sm:p-8">
      <p className="inline-flex rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-3 py-1 text-xs uppercase tracking-[0.14em]">
        {language === "sr" ? "Sledeca faza" : "Next phase"}
      </p>
      <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
        {language === "sr" ? "Kontakt editor" : "Contact editor"}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
        {language === "sr"
          ? "Ovde ce ici upravljanje kontakt podacima, FAQ sekcijom i pravilima za formu upita."
          : "This section is reserved for contact details, FAQ blocks, and inquiry form behavior rules."}
      </p>
    </section>
  );
}
