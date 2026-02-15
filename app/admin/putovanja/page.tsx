"use client";

import { useSitePreferences } from "../../../components/site-preferences-provider";

export default function AdminPutovanjaPage() {
  const { language } = useSitePreferences();

  return (
    <section className="surface rounded-3xl border border-[var(--line)] p-6 sm:p-8">
      <p className="inline-flex rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-3 py-1 text-xs uppercase tracking-[0.14em]">
        {language === "sr" ? "Sledeca faza" : "Next phase"}
      </p>
      <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
        {language === "sr" ? "Putovanja editor" : "Trips editor"}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
        {language === "sr"
          ? "Ovde ide upravljanje sekcijama za prikaz destinacija, pretrage i cards prikaza na stranici Putovanja."
          : "This section is reserved for destination structure, search controls, and cards management on the Trips page."}
      </p>
    </section>
  );
}
