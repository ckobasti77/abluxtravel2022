"use client";

import CmsImage from "@/components/cms-image";
import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import AddToCartButton from "../../components/add-to-cart-button";
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
    title: "Hodočašće Ostrog i manastiri Crne Gore",
    destination: "Crna Gora",
    departureCity: "Beograd",
    departureDate: "2026-04-18",
    returnDate: "2026-04-22",
    price: 289,
    currency: "EUR",
    seatsLeft: 14,
    tags: ["verski", "hodočašće", "manastiri"],
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
    departureCity: "Ni?",
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
        new Set(religiousOffers.flatMap((offer) => offer.tags.map((tag) => tag.toLowerCase())))
      ).slice(0, 10),
    [religiousOffers]
  );

  const minPrice = useMemo(() => {
    if (filteredOffers.length === 0) return null;
    return Math.min(...filteredOffers.map((offer) => offer.price));
  }, [filteredOffers]);

  const isAdmin = session?.role === "admin";
  const activeDestinations = new Set(filteredOffers.map((offer) => offer.destination)).size;
  const hasFilter = query.trim().length > 0;

  return (
    <AlienShell className="site-fade page-stack">
      <section className="page-hero">
        <span className="pill">{dictionary.religious.badge}</span>
        <h1 className="page-title">{dictionary.religious.title}</h1>
        <p className="page-subtitle">{dictionary.religious.description}</p>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Aktivne verske" : "Active religious"}</p>
          <p className="metric-card__value">{filteredOffers.length}</p>
          <p className="metric-card__hint">{language === "sr" ? "Ponude koje trenutno odgovaraju filteru." : "Offers currently matching the filter."}</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Destinacije" : "Destinations"}</p>
          <p className="metric-card__value">{activeDestinations}</p>
          <p className="metric-card__hint">{language === "sr" ? "Raspon svetih lokacija i ruta." : "Range of holy places and routes."}</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Najniža cena" : "Lowest price"}</p>
          <p className="metric-card__value">
            {minPrice !== null
              ? new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: filteredOffers[0]?.currency ?? "EUR",
                  maximumFractionDigits: 0,
                }).format(minPrice)
              : "-"}
          </p>
          <p className="metric-card__hint">{language === "sr" ? "Brza orijentacija budžeta." : "Quick budget orientation."}</p>
        </article>
      </section>

      <section className="filter-shell grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="grid gap-3">
          <label htmlFor="religious-search" className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            {dictionary.religious.searchLabel}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="religious-search"
              className="control"
              placeholder={dictionary.religious.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {hasFilter ? (
              <button
                type="button"
                className="btn-secondary !min-h-11 !px-4 !py-2 !text-xs"
                onClick={() => setQuery("")}
              >
                {language === "sr" ? "Reset" : "Reset"}
              </button>
            ) : null}
          </div>
          {uniqueTags.length > 0 ? (
            <div className="tag-list">
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="tag-chip cursor-pointer transition hover:border-[var(--primary)]"
                  onClick={() => setQuery(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          ) : null}
        </article>

        <article className="panel-glass">
          <p className="metric-card__label">{dictionary.religious.boardTitle}</p>
          <p className="metric-card__value">{filteredOffers.length}</p>
          <p className="panel-muted">
            {language === "sr"
              ? "Broj ponuda koje odgovaraju verskom turizmu i aktivnom filteru."
              : "Number of offers matching religious tourism and the active filter."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/aranzmani" className="btn-secondary !min-h-10 !px-4 !py-2 !text-xs">
              {dictionary.religious.viewAllOffers}
            </Link>
            {isAdmin ? (
              <Link href="/admin/verski-turizam" className="btn-primary !min-h-10 !px-4 !py-2 !text-xs">
                {language === "sr" ? "Uredi ponude" : "Edit offers"}
              </Link>
            ) : null}
          </div>
        </article>
      </section>

      <section className="stagger-grid grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer, index) => (
            <article
              key={offer.id}
              className="panel-glass fx-lift"
              style={{ "--stagger-index": index } as CSSProperties}
            >
              {offer.imageUrls && offer.imageUrls.length > 0 ? (
                <CmsImage
                  src={offer.imageUrls[0]}
                  alt={offer.title}
                  className="mb-3 h-44 w-full rounded-xl border border-[var(--line)] object-cover"
                />
              ) : null}

              <div className="grid gap-1">
                <p className="text-xs uppercase tracking-[0.1em] text-muted">{offer.sourceSlug}</p>
                <h2 className="text-lg font-semibold leading-tight">{offer.title}</h2>
                <p className="text-sm text-muted">{offer.destination}</p>
              </div>

              <div className="mt-3 grid gap-1 text-sm text-muted">
                <p>
                  {dictionary.offers.departure}: {offer.departureCity || dictionary.offers.tbd}
                </p>
                <p>
                  {formatDate(offer.departureDate, locale, dictionary.offers.tbd)} -{" "}
                  {formatDate(offer.returnDate, locale, dictionary.offers.tbd)}
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-2xl font-semibold text-[var(--primary)]">{formatPrice(offer, locale)}</p>
                <p className="text-sm text-muted">
                  {dictionary.offers.seats}:{" "}
                  {typeof offer.seatsLeft === "number" ? offer.seatsLeft : dictionary.offers.unknown}
                </p>
              </div>

              {offer.tags.length > 0 ? (
                <div className="mt-3 tag-list">
                  {offer.tags.map((tag) => (
                    <span key={`${offer.id}-${tag}`} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <AddToCartButton
                  id={offer.id}
                  type="offer"
                  title={offer.title}
                  price={offer.price}
                  currency={offer.currency}
                  imageUrl={offer.imageUrls?.[0]}
                  meta={{ destination: offer.destination, departureCity: offer.departureCity ?? "" }}
                  className="!min-h-10"
                />
                <Link href="/kontakt" className="btn-secondary !min-h-10 !px-4 !py-2 !text-xs">
                  {language === "sr" ? "Pošalji upit" : "Send inquiry"}
                </Link>
                {offer.pdfUrl ? (
                  <a
                    href={offer.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary !min-h-10 !px-4 !py-2 !text-xs"
                  >
                    {language === "sr" ? "PDF program" : "PDF program"}
                  </a>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state md:col-span-2 xl:col-span-3">
            <h2 className="empty-state__title">{dictionary.religious.noResults}</h2>
            <p className="empty-state__copy">
              {language === "sr"
                ? "Pokušajte sa drugim pojmom ili odaberite neku od predloženih oznaka iznad pretrage."
                : "Try another keyword or choose one of the suggested tags above."}
            </p>
          </div>
        )}
      </section>

      <PageAdminEditorDock slot="religious" className="mt-2" />
    </AlienShell>
  );
}




