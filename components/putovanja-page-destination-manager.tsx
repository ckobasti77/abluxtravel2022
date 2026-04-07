"use client";

import { useMemo, useState } from "react";
import DestinationEditor from "./destination-editor";
import { useSitePreferences } from "./site-preferences-provider";
import { toCountrySlug } from "../lib/country-route";
import { useSlides } from "../lib/use-slides";

type PutovanjaOption = {
  id: string;
  title: string;
  pageSlug: string;
};

export default function PutovanjaPageDestinationManager() {
  const { language } = useSitePreferences();
  const slides = useSlides([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);

  const options = useMemo<PutovanjaOption[]>(
    () =>
      slides
        .map((slide) => {
          const pageSlug = toCountrySlug(slide.title) || toCountrySlug(slide.id);
          if (!pageSlug) return null;
          return {
            id: slide.id,
            title: slide.title,
            pageSlug,
          } satisfies PutovanjaOption;
        })
        .filter((item): item is PutovanjaOption => Boolean(item)),
    [slides],
  );

  const effectivePageSlug = useMemo(() => {
    if (
      selectedPageSlug &&
      options.some((option) => option.pageSlug === selectedPageSlug)
    ) {
      return selectedPageSlug;
    }
    return options[0]?.pageSlug ?? "";
  }, [selectedPageSlug, options]);

  const selectedOption = useMemo(
    () => options.find((option) => option.pageSlug === effectivePageSlug) ?? null,
    [effectivePageSlug, options],
  );

  return (
    <section className="grid gap-4">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Putovanja destination editor" : "Putovanja destination editor"}
        </p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
          {language === "sr"
            ? "Destinacije po putovanja stranici"
            : "Destinations per putovanja page"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          {language === "sr"
            ? "Izaberi stranicu putovanja i upravljaj njenim destinacijama (dodaj, izmeni, obrisi)."
            : "Choose a putovanja page and manage its destinations (add, edit, delete)."}
        </p>
      </article>

      {options.length > 0 ? (
        <>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr"
                ? "Izaberi putovanja stranicu"
                : "Select putovanja page"}
            </span>
            <select
              className="control"
              value={effectivePageSlug}
              onChange={(event) => setSelectedPageSlug(event.target.value)}
            >
              {options.map((option) => (
                <option key={option.id} value={option.pageSlug}>
                  {option.title}
                </option>
              ))}
            </select>
          </label>

          {selectedOption ? (
            <DestinationEditor
              pageSlug={selectedOption.pageSlug}
              title={
                language === "sr"
                  ? `Destinacije: ${selectedOption.title}`
                  : `Destinations: ${selectedOption.title}`
              }
              description={
                language === "sr"
                  ? "Destinacije su vezane za izabranu /putovanja/[stranica] rutu."
                  : "Destinations are linked to the selected /putovanja/[page] route."
              }
            />
          ) : null}
        </>
      ) : (
        <article className="surface rounded-2xl p-4 text-sm text-muted">
          {language === "sr"
            ? "Nema putovanja stranica za uredjivanje. Prvo dodaj aktivne slajdove."
            : "No putovanja pages available to edit yet. Add active slides first."}
        </article>
      )}
    </section>
  );
}
