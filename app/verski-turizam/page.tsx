"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { AggregatedOffer, useOffersLiveBoard } from "../../lib/use-offers";

const RELIGIOUS_KEYWORDS = [
  "verski",
  "religious",
  "hodo",
  "pilgr",
  "svet",
  "holy",
  "manast",
  "monast",
  "church",
  "jerusalim",
  "jerusalem",
  "sinaj",
  "sinai",
  "ostrog",
];

const RELIGIOUS_FALLBACK_OFFERS: AggregatedOffer[] = [
  {
    id: "religious-a",
    sourceSlug: "ablux",
    externalId: "ABL-REL-101",
    title: "Hodocasce Ostrog i manastiri Crne Gore",
    destination: "Crna Gora",
    departureCity: "Beograd",
    departureDate: "2026-04-18",
    returnDate: "2026-04-22",
    price: 289,
    currency: "EUR",
    seatsLeft: 14,
    tags: ["verski", "hodocasce", "manastiri"],
    updatedAt: Date.parse("2026-02-12T10:00:00.000Z"),
  },
  {
    id: "religious-b",
    sourceSlug: "ablux",
    externalId: "ABL-REL-102",
    title: "Sveta zemlja - Jerusalim, Vitlejem i Nazaret",
    destination: "Izrael",
    departureCity: "Beograd",
    departureDate: "2026-05-09",
    returnDate: "2026-05-15",
    price: 1190,
    currency: "EUR",
    seatsLeft: 9,
    tags: ["verski", "sveta zemlja", "jerusalim"],
    updatedAt: Date.parse("2026-02-11T14:30:00.000Z"),
  },
  {
    id: "religious-c",
    sourceSlug: "ablux",
    externalId: "ABL-REL-103",
    title: "Sinajska ruta i sveta mesta Egipta",
    destination: "Egipat",
    departureCity: "Nis",
    departureDate: "2026-06-02",
    returnDate: "2026-06-08",
    price: 870,
    currency: "EUR",
    seatsLeft: 11,
    tags: ["religious", "sinai", "holy-sites"],
    updatedAt: Date.parse("2026-02-10T09:40:00.000Z"),
  },
];

const isReligiousOffer = (offer: AggregatedOffer) => {
  const source = `${offer.title} ${offer.destination} ${offer.tags.join(" ")}`.toLowerCase();
  return RELIGIOUS_KEYWORDS.some((keyword) => source.includes(keyword));
};

const formatPrice = (offer: AggregatedOffer, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.price);

const formatDate = (isoDate: string | undefined, locale: string, fallback: string) => {
  if (!isoDate) return fallback;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(parsed);
};

export default function VerskiTurizamPage() {
  const { dictionary, language } = useSitePreferences();
  const [query, setQuery] = useState("");
  const locale = language === "sr" ? "sr-RS" : "en-US";
  const offers = useOffersLiveBoard(undefined, RELIGIOUS_FALLBACK_OFFERS);

  const filteredOffers = useMemo(() => {
    const religiousOnly = offers.filter(isReligiousOffer);
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return religiousOnly;
    }

    return religiousOnly.filter((offer) => {
      const source = `${offer.title} ${offer.destination} ${offer.departureCity ?? ""} ${offer.tags.join(" ")}`;
      return source.toLowerCase().includes(normalizedQuery);
    });
  }, [offers, query]);

  return (
    <AlienShell className="site-fade">
      <section className="space-y-5">
        <span className="pill">{dictionary.religious.badge}</span>
        <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
          {dictionary.religious.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted">
          {dictionary.religious.description}
        </p>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="surface rounded-2xl p-5">
          <label htmlFor="religious-search" className="text-sm font-semibold">
            {dictionary.religious.searchLabel}
          </label>
          <input
            id="religious-search"
            className="control mt-3"
            placeholder={dictionary.religious.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </article>

        <article className="surface rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {dictionary.religious.boardTitle}
          </p>
          <p className="mt-2 text-3xl font-semibold">{filteredOffers.length}</p>
          <p className="mt-2 text-sm text-muted">
            {language === "sr"
              ? "Broj ponuda koje odgovaraju verskom turizmu i aktivnom filteru."
              : "Number of offers matching religious tourism and the active filter."}
          </p>
          <Link href="/ponuda" className="btn-secondary mt-4">
            {dictionary.religious.viewAllOffers}
          </Link>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">{dictionary.religious.boardTitle}</h2>
        {filteredOffers.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer) => (
              <article key={offer.id} className="surface rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">{offer.sourceSlug}</p>
                <h3 className="mt-2 text-lg font-semibold">{offer.title}</h3>
                <p className="mt-2 text-sm text-muted">{offer.destination}</p>
                <p className="mt-1 text-sm text-muted">
                  {dictionary.offers.departure}: {offer.departureCity || dictionary.offers.tbd}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {formatDate(offer.departureDate, locale, dictionary.offers.tbd)} -{" "}
                  {formatDate(offer.returnDate, locale, dictionary.offers.tbd)}
                </p>
                <p className="mt-4 text-2xl font-semibold">{formatPrice(offer, locale)}</p>
                <p className="mt-1 text-sm text-muted">
                  {dictionary.offers.seats}:{" "}
                  {typeof offer.seatsLeft === "number" ? offer.seatsLeft : dictionary.offers.unknown}
                </p>
                {offer.tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {offer.tags.map((tag) => (
                      <span
                        key={`${offer.id}-${tag}`}
                        className="rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-2.5 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="surface rounded-2xl p-5 text-sm text-muted">
            {dictionary.religious.noResults}
          </div>
        )}
      </section>
    </AlienShell>
  );
}
