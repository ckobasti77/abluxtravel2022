"use client";

import ReligiousOffersEditor from "../../../components/religious-offers-editor";
import { useSitePreferences } from "../../../components/site-preferences-provider";

export default function AdminVerskiTurizamPage() {
  const { language } = useSitePreferences();

  return (
    <section className="grid gap-6">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Faith control deck" : "Faith control deck"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {language === "sr"
            ? "Komanda za verski turizam"
            : "Religious tourism command"}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          {language === "sr"
            ? "Centralni editor za kreiranje, izmenu i deaktivaciju ponuda vezanih za hodochasca i sveta mesta."
            : "Central editor for creating, updating, and deactivating pilgrimage and holy-site offers."}
        </p>
      </article>

      <ReligiousOffersEditor />
    </section>
  );
}
