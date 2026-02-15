"use client";

import { useSitePreferences } from "../../../components/site-preferences-provider";

export default function AdminPodesavanjaPage() {
  const { language } = useSitePreferences();

  return (
    <section className="surface rounded-3xl border border-[var(--line)] p-6 sm:p-8">
      <p className="inline-flex rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-3 py-1 text-xs uppercase tracking-[0.14em]">
        {language === "sr" ? "Sledeca faza" : "Next phase"}
      </p>
      <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
        {language === "sr" ? "Globalna podesavanja" : "Global settings"}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
        {language === "sr"
          ? "Ovde ce biti centralna pravila sajta: SEO profil, istaknute boje i globalne content sekcije."
          : "This section is reserved for global site rules: SEO profile, featured colors, and global content sections."}
      </p>
    </section>
  );
}
