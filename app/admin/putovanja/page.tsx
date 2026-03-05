"use client";

import AranzmaniEditor from "../../../components/aranzmani-editor";
import { useSitePreferences } from "../../../components/site-preferences-provider";

export default function AdminPutovanjaPage() {
  const { language } = useSitePreferences();

  return (
    <section className="grid gap-6">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Video slajdovi" : "Video slides"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {language === "sr" ? "Video slajdovi za /zemlje stranicu" : "Video slides for /countries page"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          {language === "sr"
            ? "Upravljajte fullscreen video scenama koje se prikazuju na stranici Zemlje. Svaki slajd predstavlja jednu destinaciju."
            : "Manage fullscreen video scenes displayed on the Countries page. Each slide represents a destination."}
        </p>
      </article>

      <AranzmaniEditor
        title={language === "sr" ? "Zemlje media editor" : "Countries media editor"}
        description={
          language === "sr"
            ? "Dodajte, rasporedite i aktivirajte video scene za stranicu /zemlje."
            : "Add, order, and activate video scenes for the /countries page."
        }
      />
    </section>
  );
}
