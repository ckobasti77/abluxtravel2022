"use client";

import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import PageAdminEditorDock from "../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { useSession } from "../../lib/use-session";
import { AggregatedOffer, useOffersLiveBoard } from "../../lib/use-offers";
import { isReligiousOffer } from "../../lib/religious";

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
    tags: ["verski", "sinaj", "sveta mesta"],
    updatedAt: Date.parse("2026-02-10T09:40:00.000Z"),
  },
];

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
  const session = useSession();
  const [query, setQuery] = useState("");
  const locale = language === "sr" ? "sr-RS" : "en-US";
  const offers = useOffersLiveBoard(undefined, RELIGIOUS_FALLBACK_OFFERS);

  const religiousOffers = useMemo(() => offers.filter((offer) => isReligiousOffer(offer)), [offers]);

  const filteredOffers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return religiousOffers;
    }

    return religiousOffers.filter((offer) => {
      const source = `${offer.title} ${offer.destination} ${offer.departureCity ?? ""} ${offer.tags.join(" ")}`;
      return source.toLowerCase().includes(normalizedQuery);
    });
  }, [religiousOffers, query]);

  const uniqueTags = useMemo(
    () =>
      Array.from(
        new Set(filteredOffers.flatMap((offer) => offer.tags.map((tag) => tag.toLowerCase())))
      ).slice(0, 8),
    [filteredOffers]
  );

  const minPrice = useMemo(() => {
    if (filteredOffers.length === 0) return null;
    return Math.min(...filteredOffers.map((offer) => offer.price));
  }, [filteredOffers]);

  const isAdmin = session?.role === "admin";

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

      <section className="stagger-grid mt-7 grid gap-3 sm:grid-cols-3">
        <article className="surface fx-lift rounded-2xl p-4" style={{ "--stagger-index": 0 } as CSSProperties}>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Aktivne verske" : "Active religious"}
          </p>
          <p className="mt-2 text-2xl font-semibold">{filteredOffers.length}</p>
        </article>
        <article className="surface fx-lift rounded-2xl p-4" style={{ "--stagger-index": 1 } as CSSProperties}>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Destinacije" : "Destinations"}
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {new Set(filteredOffers.map((offer) => offer.destination)).size}
          </p>
        </article>
        <article className="surface fx-lift rounded-2xl p-4" style={{ "--stagger-index": 2 } as CSSProperties}>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Najniza cena" : "Lowest price"}
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {minPrice !== null
              ? new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: filteredOffers[0]?.currency ?? "EUR",
                  maximumFractionDigits: 0,
                }).format(minPrice)
              : "-"}
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="section-holo p-5">
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
          {uniqueTags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-xs text-muted transition hover:border-[var(--primary)] hover:text-[var(--text)]"
                  onClick={() => setQuery(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          ) : null}
        </article>

        <article className="section-holo p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {dictionary.religious.boardTitle}
          </p>
          <p className="mt-2 text-3xl font-semibold">{filteredOffers.length}</p>
          <p className="mt-2 text-sm text-muted">
            {language === "sr"
              ? "Broj ponuda koje odgovaraju verskom turizmu i aktivnom filteru."
              : "Number of offers matching religious tourism and the active filter."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/aranzmani" className="btn-secondary">
              {dictionary.religious.viewAllOffers}
            </Link>
            {isAdmin ? (
              <Link href="/admin/verski-turizam" className="btn-primary">
                {language === "sr" ? "Uredi verske ponude" : "Edit religious offers"}
              </Link>
            ) : null}
          </div>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">{dictionary.religious.boardTitle}</h2>
        {filteredOffers.length > 0 ? (
          <div className="stagger-grid grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer, index) => (
              <article
                key={offer.id}
                className="surface fx-lift rounded-2xl p-4"
                style={{ "--stagger-index": index } as CSSProperties}
              >
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
                {offer.pdfUrl ? (
                  <div className="mt-3 space-y-2">
                    <a
                      href={offer.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-xl border border-[var(--line)] px-3 py-2 text-xs text-muted transition hover:border-[var(--primary)] hover:text-[var(--text)]"
                    >
                      {language === "sr" ? "Otvori PDF program" : "Open PDF brochure"}
                    </a>
                    <details className="rounded-xl border border-[var(--line)] p-2">
                      <summary className="cursor-pointer text-xs text-muted">
                        {language === "sr" ? "Pregled / prelistavanje PDF-a" : "Preview / browse PDF"}
                      </summary>
                      <iframe
                        src={`${offer.pdfUrl}#toolbar=1&navpanes=0`}
                        className="mt-2 h-64 w-full rounded-lg border border-[var(--line)] bg-white"
                        title={`${offer.id}-pdf-preview`}
                      />
                    </details>
                  </div>
                ) : null}
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

      <PageAdminEditorDock slot="religious" className="mt-10" />
    </AlienShell>
  );
}
