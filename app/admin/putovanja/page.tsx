"use client";

import AranzmaniEditor from "../../../components/aranzmani-editor";
import { useSitePreferences } from "../../../components/site-preferences-provider";

export default function AdminPutovanjaPage() {
  const { language } = useSitePreferences();

  return (
    <section className="grid gap-6">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Media slajdovi" : "Media slides"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {language === "sr" ? "Media slajdovi za /putovanja stranicu" : "Media slides for /trips page"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          {language === "sr"
            ? "Upravljajte fullscreen scenama (video ili slika) koje se prikazuju na stranici Putovanja. Svaki slajd predstavlja jednu destinaciju."
            : "Manage fullscreen scenes (video or image) displayed on the Trips page. Each slide represents one destination."}
        </p>
      </article>

      <AranzmaniEditor
        title={language === "sr" ? "Putovanja media editor" : "Trips media editor"}
        description={
          language === "sr"
            ? "Dodajte, rasporedite i aktivirajte scene (video ili slika) za stranicu /putovanja."
            : "Add, order, and activate scenes (video or image) for the /trips page."
        }
      />
    </section>
  );
}

