"use client";

import Link from "next/link";
import { type CSSProperties, useMemo } from "react";
import {
  FaArrowRight,
  FaCalendarDays,
  FaLocationDot,
  FaRoute,
} from "react-icons/fa6";
import VerticalHeroSlider, {
  type VerticalHeroSlide,
} from "../../components/vertical-hero-slider";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { useJourneys } from "../../lib/use-journeys";

export default function PutovanjaPage() {
  const { language } = useSitePreferences();
  const journeys = useJourneys();
  const locale = language === "sr" ? "sr-RS" : "en-US";

  const sortedJourneys = useMemo(
    () =>
      [...journeys].sort(
        (a, b) => a.order - b.order || a.title.localeCompare(b.title),
      ),
    [journeys],
  );

  const slides = useMemo<VerticalHeroSlide[]>(() => {
    const formatDate = (iso: string) => {
      if (!iso) return "";
      const date = new Date(`${iso}T00:00:00`);
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    };

    return sortedJourneys.map((journey) => {
      const detailPreview = journey.detailMedia?.find((media) => media.url);
      const mediaUrl =
        journey.heroMediaUrl ||
        detailPreview?.url ||
        journey.imageUrls.find(Boolean) ||
        "";
      const dateRange = [formatDate(journey.departureDate), formatDate(journey.returnDate)]
        .filter(Boolean)
        .join(" - ");
      const duration =
        journey.days > 0 || journey.nights > 0
          ? language === "sr"
            ? `${journey.days} dana / ${journey.nights} noći`
            : `${journey.days} days / ${journey.nights} nights`
          : "";
      const destinationCount = journey.destinationCount ?? 0;

      return {
        id: journey._id,
        title: journey.title,
        subtitle:
          [duration, dateRange, journey.departureCity].filter(Boolean).join(" / ") ||
          (language === "sr"
            ? "Pažljivo odabrano putovanje"
            : "Carefully curated trip"),
        badge:
          destinationCount > 0
            ? language === "sr"
              ? `${destinationCount} destinacija`
              : `${destinationCount} destinations`
            : language === "sr"
              ? "Putovanje"
              : "Trip",
        copy:
          journey.description ||
          (language === "sr"
            ? "Putovanje sa povezanim destinacijama, terminima i jasnim narednim korakom."
            : "A trip with connected destinations, dates, and a clear next step."),
        mediaType: journey.heroMediaUrl
          ? journey.heroMediaType ?? "image"
          : detailPreview?.mediaType ?? "image",
        mediaUrl,
        primaryActionHref: `/putovanja/${journey.slug}`,
        primaryActionLabel:
          language === "sr"
            ? `Pogledaj putovanje ${journey.title}`
            : `View trip ${journey.title}`,
        secondaryActionHref: "/aranzmani",
        secondaryActionLabel:
          language === "sr" ? "Pogledaj aranžmane" : "View packages",
      };
    });
  }, [language, locale, sortedJourneys]);

  return (
    <main id="main-content" className="bg-[#0b0f14] text-white">
      <VerticalHeroSlider
        mode="putovanja"
        slides={slides}
        adminEditorHref="/admin/putovanja"
      />

      {sortedJourneys.length > 0 ? (
        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-8 lg:px-12">
          <header className="grid gap-3">
            <span className="w-fit rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              {language === "sr" ? "Putovanja" : "Trips"}
            </span>
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  {language === "sr"
                    ? "Izaberite putovanje, pa destinaciju koja vam najviše odgovara"
                    : "Choose the trip, then the destination that fits best"}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/68">
                  {language === "sr"
                    ? "Putovanje prikazuje okvir programa, a konkretne cene i rezervacioni koraci nalaze se na destinacijama unutar putovanja."
                    : "A trip presents the program framework, while concrete pricing and booking steps live on the destinations inside it."}
                </p>
              </div>
              <Link
                href="/destinacije"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white/85 transition hover:border-white/40 hover:bg-white/15"
              >
                {language === "sr" ? "Sve destinacije" : "All destinations"}
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedJourneys.map((journey, index) => {
              const dateLabel = [journey.departureDate, journey.returnDate]
                .filter(Boolean)
                .join(" - ");

              return (
                <article
                  key={journey._id}
                  className="grid gap-4 rounded-xl border border-white/12 bg-white/[0.06] p-4 text-white shadow-[0_22px_60px_-42px_rgba(255,255,255,0.5)] backdrop-blur"
                  style={{ "--stagger-index": index } as CSSProperties}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                      {journey.destinationCount
                        ? language === "sr"
                          ? `${journey.destinationCount} destinacija`
                          : `${journey.destinationCount} destinations`
                        : language === "sr"
                          ? "Program u pripremi"
                          : "Program in preparation"}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">
                      {journey.title}
                    </h3>
                    {journey.description ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/64">
                        {journey.description}
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
                    {journey.departureCity ? (
                      <p className="flex items-center gap-2">
                        <FaLocationDot className="text-xs text-white/45" />
                        {journey.departureCity}
                      </p>
                    ) : null}
                    <p className="flex items-center gap-2">
                      <FaRoute className="text-xs text-white/45" />
                      {journey.days} {language === "sr" ? "dana" : "days"} /{" "}
                      {journey.nights} {language === "sr" ? "noći" : "nights"}
                    </p>
                  </div>

                  <Link
                    href={`/putovanja/${journey.slug}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 text-sm font-semibold text-white/86 transition hover:border-white/40 hover:bg-black/30"
                  >
                    {language === "sr"
                      ? `Pogledaj putovanje ${journey.title}`
                      : `View trip ${journey.title}`}
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
