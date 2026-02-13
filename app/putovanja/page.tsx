"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { toCountrySlug } from "../../lib/country-route";
import { TripSlide, useSlides } from "../../lib/use-slides";

export default function PutovanjaPage() {
  const { dictionary, language } = useSitePreferences();
  const [query, setQuery] = useState("");

  const fallbackSlides: TripSlide[] = useMemo(
    () =>
      language === "sr"
        ? [
            {
              id: "grcka",
              title: "Grcka",
              subtitle: "7 dana / letovanje / više polazaka",
              badge: "Porodicno",
              copy: "Plaže, ostrva i aranžmani prilagodeni razlicitim budžetima.",
              videoUrl: "/videos/amalfi.mp4",
            },
            {
              id: "italija",
              title: "Italija",
              subtitle: "5 dana / gradske ture / premium opcije",
              badge: "City break",
              copy: "Rim, Milano, Firenca i pažljivo planirane kulturne ture.",
              videoUrl: "/videos/cappadocia.mp4",
            },
            {
              id: "turska",
              title: "Turska",
              subtitle: "6 dana / Istanbul + dodatni program",
              badge: "Popularno",
              copy: "Spoj istorije, gastronomije i modernih putnickih sadržaja.",
              videoUrl: "/videos/iceland.mp4",
            },
          ]
        : [
            {
              id: "greece",
              title: "Greece",
              subtitle: "7 days / summer vacation / multiple departures",
              badge: "Family",
              copy: "Beaches, islands, and packages adapted to multiple budgets.",
              videoUrl: "/videos/amalfi.mp4",
            },
            {
              id: "italy",
              title: "Italy",
              subtitle: "5 days / city tours / premium options",
              badge: "City break",
              copy: "Rome, Milan, Florence, and carefully planned cultural tours.",
              videoUrl: "/videos/cappadocia.mp4",
            },
            {
              id: "turkey",
              title: "Turkey",
              subtitle: "6 days / Istanbul + additional program",
              badge: "Popular",
              copy: "A blend of history, gastronomy, and modern travel experiences.",
              videoUrl: "/videos/iceland.mp4",
            },
          ],
    [language]
  );

  const slides = useSlides(fallbackSlides);

  const filteredSlides = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return slides;
    return slides.filter((slide) => {
      const source = `${slide.title} ${slide.subtitle} ${slide.copy ?? ""}`.toLowerCase();
      return source.includes(search);
    });
  }, [query, slides]);

  return (
    <AlienShell className="site-fade">
      <section className="space-y-5">
        <span className="pill">{dictionary.trips.badge}</span>
        <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
          {dictionary.trips.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted">
          {dictionary.trips.description}
        </p>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="surface rounded-2xl p-5">
          <label htmlFor="trip-search" className="text-sm font-semibold">
            {dictionary.trips.searchLabel}
          </label>
          <input
            id="trip-search"
            className="control mt-3"
            placeholder={dictionary.trips.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </article>

        <article className="surface rounded-2xl p-5">
          <h2 className="text-xl font-semibold">{dictionary.trips.readyTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{dictionary.trips.readyDescription}</p>
        </article>
      </section>

      <section className="mt-6">
        {filteredSlides.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSlides.map((slide) => {
              const countrySlug = toCountrySlug(slide.title) || toCountrySlug(slide.id);
              const href = countrySlug ? `/putovanja/${countrySlug}` : "/putovanja";

              return (
                <article key={slide.id} className="surface overflow-hidden rounded-3xl">
                  <div className="relative h-52 w-full overflow-hidden">
                    {slide.videoUrl ? (
                      <video
                        className="h-full w-full object-cover"
                        src={slide.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        disablePictureInPicture
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#1f3a70,#133050)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {slide.badge ? (
                      <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-black/35 px-3 py-1 text-xs text-white">
                        {slide.badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="p-5">
                    <h2 className="text-2xl font-semibold">{slide.title}</h2>
                    <p className="mt-2 text-sm text-muted">{slide.subtitle}</p>
                    {slide.copy ? (
                      <p className="mt-3 text-sm leading-6 text-muted">{slide.copy}</p>
                    ) : null}
                    <Link href={href} className="btn-secondary mt-4 w-full">
                      {dictionary.trips.openCountry}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="surface rounded-2xl p-5 text-sm text-muted">
            {dictionary.trips.noResults}
          </div>
        )}
      </section>
    </AlienShell>
  );
}

