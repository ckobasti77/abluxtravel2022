"use client";

import Link from "next/link";
import { type CSSProperties, useMemo } from "react";
import { FaArrowRight, FaCalendarDays, FaLocationDot, FaRoute } from "react-icons/fa6";
import VerticalHeroSlider, {
  type VerticalHeroSlide,
} from "../../components/vertical-hero-slider";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { useTrips } from "../../lib/use-trips";

export default function AranzmaniPage() {
  const { language } = useSitePreferences();
  const trips = useTrips();
  const locale = language === "sr" ? "sr-RS" : "en-US";
  const sortedTrips = useMemo(
    () => [...trips].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    [trips],
  );

  const slides = useMemo<VerticalHeroSlide[]>(() => {
    const formatDate = (iso: string) => {
      if (!iso) return "";
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    };

    return sortedTrips
      .map((trip) => {
        const detailPreview = trip.detailMedia?.find((media) => media.url);
        const mediaUrl =
          trip.heroMediaUrl ||
          detailPreview?.url ||
          trip.imageUrls.find(Boolean) ||
          "";
        const dateRange = [formatDate(trip.departureDate), formatDate(trip.returnDate)]
          .filter(Boolean)
          .join(" - ");
        const duration =
          trip.days > 0 || trip.nights > 0
            ? language === "sr"
              ? `${trip.days} dana / ${trip.nights} noci`
              : `${trip.days} days / ${trip.nights} nights`
            : "";
        const destinationCount = trip.destinationCount ?? 0;

        return {
          id: trip._id,
          title: trip.title,
          subtitle:
            [duration, dateRange, trip.departureCity].filter(Boolean).join(" / ") ||
            (language === "sr"
              ? "Pažljivo odabran program putovanja"
              : "Carefully curated travel program"),
          badge:
            destinationCount > 0
              ? language === "sr"
                ? `${destinationCount} destinacija`
                : `${destinationCount} destinations`
              : language === "sr"
                ? "Kuriran program"
                : "Curated program",
          copy:
            trip.description ||
            (language === "sr"
              ? "Kompletan okvir putovanja sa destinacijama, terminima i jasnim narednim korakom."
              : "A complete travel framework with destinations, dates, and a clear next step."),
          mediaType: trip.heroMediaUrl
            ? trip.heroMediaType ?? "image"
            : detailPreview?.mediaType ?? "image",
          mediaUrl,
          primaryActionHref: `/aranzmani/${trip.slug}`,
          primaryActionLabel:
            language === "sr"
              ? `Pogledaj aranžmane za ${trip.title}`
              : `View packages for ${trip.title}`,
          secondaryActionHref: "/ponude",
          secondaryActionLabel:
            language === "sr" ? "Pogledaj ponude" : "View offers",
        };
      });
  }, [language, locale, sortedTrips]);

  return (
    <main id="main-content" className="bg-[#0b0f14] text-white">
      <VerticalHeroSlider
        mode="aranzmani"
        slides={slides}
        adminEditorHref="/admin/aranzmani"
      />

      {sortedTrips.length > 0 ? (
        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-8 lg:px-12">
          <header className="grid gap-3">
            <span className="w-fit rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              {language === "sr" ? "Aranžmani" : "Packages"}
            </span>
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  {language === "sr"
                    ? "Izaberite program, pa destinaciju koja vam najviše odgovara"
                    : "Choose the program, then the destination that fits best"}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/68">
                  {language === "sr"
                    ? "Aranžman prikazuje okvir putovanja. Cena i rezervacioni koraci nalaze se na konkretnim destinacijama unutar aranžmana."
                    : "A package presents the travel framework. Pricing and booking actions live on the concrete destinations inside each package."}
                </p>
              </div>
              <Link
                href="/ponude"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white/85 transition hover:border-white/40 hover:bg-white/15"
              >
                {language === "sr" ? "Sve ponude" : "All offers"}
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedTrips.map((trip, index) => {
              const dateLabel = [trip.departureDate, trip.returnDate]
                .filter(Boolean)
                .join(" - ");
              return (
                <article
                  key={trip._id}
                  className="grid gap-4 rounded-xl border border-white/12 bg-white/[0.06] p-4 text-white shadow-[0_22px_60px_-42px_rgba(255,255,255,0.5)] backdrop-blur"
                  style={{ "--stagger-index": index } as CSSProperties}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                      {trip.destinationCount
                        ? language === "sr"
                          ? `${trip.destinationCount} destinacija`
                          : `${trip.destinationCount} destinations`
                        : language === "sr"
                          ? "Program u pripremi"
                          : "Program in preparation"}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">
                      {trip.title}
                    </h3>
                    {trip.description ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/64">
                        {trip.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-2 text-sm text-white/62">
                    {dateLabel ? (
                      <p className="flex items-center gap-2">
                        <FaCalendarDays className="text-xs text-white/45" />
                        {dateLabel}
                      </p>
                    ) : null}
                    {trip.departureCity ? (
                      <p className="flex items-center gap-2">
                        <FaLocationDot className="text-xs text-white/45" />
                        {trip.departureCity}
                      </p>
                    ) : null}
                    <p className="flex items-center gap-2">
                      <FaRoute className="text-xs text-white/45" />
                      {trip.days} {language === "sr" ? "dana" : "days"} / {trip.nights}{" "}
                      {language === "sr" ? "noći" : "nights"}
                    </p>
                  </div>

                  <Link
                    href={`/aranzmani/${trip.slug}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 text-sm font-semibold text-white/86 transition hover:border-white/40 hover:bg-black/30"
                  >
                    {language === "sr"
                      ? `Pogledaj aranžmane za ${trip.title}`
                      : `View packages for ${trip.title}`}
                    <FaArrowRight className="text-xs" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
