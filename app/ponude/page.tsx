"use client";

import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCalendarDays,
  FaLocationDot,
  FaMagnifyingGlass,
  FaUsers,
} from "react-icons/fa6";
import AddToCartButton from "../../components/add-to-cart-button";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { toCountrySlug } from "../../lib/country-route";
import {
  type AggregatedOffer,
  useOfferSources,
  useOffersLiveBoard,
} from "../../lib/use-offers";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const formatDate = (isoDate: string | undefined, locale: string, fallback: string) => {
  if (!isoDate) return fallback;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(parsed);
};

const formatPrice = (offer: AggregatedOffer, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.price);

export default function PonudePage() {
  const { dictionary, language } = useSitePreferences();
  const [query, setQuery] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("q") ?? params.get("tag") ?? "";
  });
  const offers = useOffersLiveBoard();
  const sources = useOfferSources();
  const locale = language === "sr" ? "sr-RS" : "en-US";

  const sourceNameBySlug = useMemo(
    () => new Map(sources.map((source) => [source.slug, source.name])),
    [sources],
  );

  const tags = useMemo(
    () => Array.from(new Set(offers.flatMap((offer) => offer.tags))).slice(0, 10),
    [offers],
  );

  const filteredOffers = useMemo(() => {
    const search = normalize(query.trim());
    if (!search) return offers;

    return offers.filter((offer) => {
      const source = [
        offer.title,
        offer.destination,
        offer.departureCity ?? "",
        offer.externalId,
        offer.sourceSlug,
        ...offer.tags,
      ]
        .join(" ")
        .toLowerCase();
      return normalize(source).includes(search);
    });
  }, [offers, query]);

  const visibleDestinations = useMemo(
    () => new Set(filteredOffers.map((offer) => offer.destination)).size,
    [filteredOffers],
  );
  const visibleSources = useMemo(
    () => new Set(filteredOffers.map((offer) => offer.sourceSlug)).size,
    [filteredOffers],
  );

  return (
    <AlienShell className="site-fade page-stack">
      <section className="page-hero">
        <span className="pill">{dictionary.offers.badge}</span>
        <h1 className="page-title">
          {language === "sr" ? "Ponude koje možete odmah da uporedite" : "Offers ready to compare"}
        </h1>
        <p className="page-subtitle">
          {language === "sr"
            ? "Ponude su konkretne opcije sa cenom, terminom, polaskom i raspoloživim mestima. Aranžmani ostaju programski okvir, a ovde birate ponudu koja odgovara vašem planu."
            : "Offers are concrete options with price, dates, departure details, and availability. Packages stay as the program framework; here you choose the offer that matches your plan."}
        </p>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Aktivne ponude" : "Active offers"}</p>
          <p className="metric-card__value">{filteredOffers.length}</p>
          <p className="metric-card__hint">
            {language === "sr" ? "Opcije vidljive kroz trenutni filter." : "Options visible in the current filter."}
          </p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Destinacije" : "Destinations"}</p>
          <p className="metric-card__value">{visibleDestinations}</p>
          <p className="metric-card__hint">
            {language === "sr" ? "Različiti pravci putovanja u ponudi." : "Different travel directions in the offer board."}
          </p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Izvori" : "Sources"}</p>
          <p className="metric-card__value">{visibleSources}</p>
          <p className="metric-card__hint">
            {language === "sr" ? "Sve aktivne ponude u jednom pregledu." : "All active offers in one overview."}
          </p>
        </article>
      </section>

      <section className="filter-shell grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="grid gap-3">
          <label htmlFor="offers-search" className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            {language === "sr" ? "Pretraga ponuda" : "Offer search"}
          </label>
          <div className="relative">
            <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted" />
            <input
              id="offers-search"
              className="control !pl-9"
              placeholder={
                language === "sr"
                  ? "Pretraži po destinaciji, terminu ili tagu"
                  : "Search by destination, date, or tag"
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {tags.length > 0 ? (
            <div className="tag-list">
              {tags.map((tag) => (
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
          <h2 className="text-lg font-semibold">
            {language === "sr" ? "Brže do odluke" : "Faster decision flow"}
          </h2>
          <p className="panel-muted mt-2">
            {language === "sr"
              ? "Svaka kartica prikazuje cenu, polazak i dostupnost bez mešanja sa roditeljskim aranžmanima."
              : "Each card shows price, departure, and availability without mixing it with parent package pages."}
          </p>
        </article>
      </section>

      <section>
        {filteredOffers.length > 0 ? (
          <div className="stagger-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer, index) => (
              <article
                key={offer.id}
                id={offer.id}
                className="panel-glass fx-lift flex h-full flex-col overflow-hidden"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <div className="relative h-24 w-full overflow-hidden rounded-xl border border-[var(--line)]">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#164f8f,#11345f)]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                  <div className="relative flex h-full items-center justify-between gap-3 px-4">
                    <p className="text-sm font-semibold text-white">{offer.destination}</p>
                    <span className="rounded-full border border-white/35 bg-black/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-white/90">
                      {sourceNameBySlug.get(offer.sourceSlug) ?? offer.sourceSlug}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col gap-3">
                  <div>
                    <h2 className="text-xl font-semibold leading-tight">{offer.title}</h2>
                    <p className="mt-2 text-2xl font-semibold text-[var(--primary)]">
                      {formatPrice(offer, locale)}
                    </p>
                  </div>

                  <div className="grid gap-2 text-sm text-muted">
                    <p className="flex items-center gap-2">
                      <FaLocationDot className="text-xs text-[var(--primary)]" />
                      {dictionary.offers.departure}: {offer.departureCity || dictionary.offers.tbd}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarDays className="text-xs text-[var(--primary)]" />
                      {formatDate(offer.departureDate, locale, dictionary.offers.tbd)} -{" "}
                      {formatDate(offer.returnDate, locale, dictionary.offers.tbd)}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUsers className="text-xs text-[var(--primary)]" />
                      {dictionary.offers.seats}:{" "}
                      {typeof offer.seatsLeft === "number" ? offer.seatsLeft : dictionary.offers.unknown}
                    </p>
                  </div>

                  {offer.tags.length > 0 ? (
                    <div className="tag-list">
                      {offer.tags.map((tag) => (
                        <span key={`${offer.id}-${tag}`} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-auto grid gap-2 pt-2">
                    <AddToCartButton
                      id={offer.id}
                      type="offer"
                      title={offer.title}
                      price={offer.price}
                      currency={offer.currency}
                      meta={{
                        destination: offer.destination,
                        departureCity: offer.departureCity ?? "",
                      }}
                      className="w-full !justify-center"
                    />
                    <div className="grid gap-2 sm:grid-cols-2">
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
                          {language === "sr" ? "PDF program" : "PDF brochure"}
                        </a>
                      ) : (
                        <Link
                          href={
                            toCountrySlug(offer.destination)
                              ? `/putovanja/${toCountrySlug(offer.destination)}`
                              : "/destinacije"
                          }
                          className="btn-secondary !min-h-10 !px-4 !py-2 !text-xs"
                        >
                          {language === "sr" ? "Destinacije" : "Destinations"}
                          <FaArrowRight className="text-xs" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="empty-state__title">
              {language === "sr" ? "Nema ponuda za trenutni filter." : "No offers match the current filter."}
            </h2>
            <p className="empty-state__copy">
              {language === "sr"
                ? "Promenite pojam pretrage ili izaberite drugi tag."
                : "Change the search term or select another tag."}
            </p>
          </div>
        )}
      </section>
    </AlienShell>
  );
}
