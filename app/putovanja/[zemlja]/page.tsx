"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type CSSProperties, useMemo, useState } from "react";
import AlienShell from "../../../components/alien-shell";
import AddToCartButton from "../../../components/add-to-cart-button";
import DestinationLoopCarousel from "../../../components/destination-loop-carousel";
import DestinationEditor from "../../../components/destination-editor";
import JourneyDetailPage from "../../../components/journey-detail-page";
import PageAdminEditorDock from "../../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../../components/site-preferences-provider";
import { fromCountrySlug } from "../../../lib/country-route";
import { useJourneyBySlug } from "../../../lib/use-journeys";
import { useDestinationsByPage } from "../../../lib/use-destinations";
import { AggregatedOffer, useOffersLiveBoard } from "../../../lib/use-offers";
import { useSession } from "../../../lib/use-session";

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

export default function CountryTripsPage() {
  const params = useParams<{ zemlja: string }>();
  const slug = typeof params?.zemlja === "string" ? params.zemlja : "";
  const { dictionary, language } = useSitePreferences();
  const session = useSession();
  const [query, setQuery] = useState("");
  const isAdmin = session?.role === "admin";
  const journey = useJourneyBySlug(slug);

  const countryName = useMemo(() => fromCountrySlug(slug), [slug]);
  const offers = useOffersLiveBoard(countryName);
  const destinations = useDestinationsByPage(slug);
  const locale = language === "sr" ? "sr-RS" : "en-US";

  const filteredOffers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return offers;
    return offers.filter((offer) => {
      const source = [
        offer.title,
        offer.destination,
        offer.departureCity ?? "",
        offer.externalId,
        ...offer.tags,
      ]
        .join(" ")
        .toLowerCase();
      return source.includes(search);
    });
  }, [offers, query]);

  const uniqueTags = useMemo(
    () => Array.from(new Set(offers.flatMap((offer) => offer.tags))).slice(0, 8),
    [offers]
  );

  const minPrice = useMemo(() => {
    if (filteredOffers.length === 0) {
      return null;
    }
    return Math.min(...filteredOffers.map((offer) => offer.price));
  }, [filteredOffers]);

  const hasQuery = query.trim().length > 0;
  const activeDestinations = useMemo(
    () => destinations.filter((item) => item.isActive),
    [destinations],
  );

  if (journey === undefined) {
    return (
      <AlienShell className="site-fade">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="surface animate-pulse rounded-2xl px-8 py-6 text-muted">
            {language === "sr" ? "Učitavanje..." : "Loading..."}
          </div>
        </div>
      </AlienShell>
    );
  }

  if (journey) {
    return <JourneyDetailPage journey={journey} />;
  }

  return (
    <AlienShell className="site-fade page-stack">
      <section className="page-hero">
        <span className="pill">{dictionary.country.badge}</span>
        <h1 className="page-title">
          {dictionary.country.title} {countryName || "-"}
        </h1>
        <p className="page-subtitle">{dictionary.country.description}</p>
        <div className="page-hero__meta">
          <Link href="/putovanja" className="btn-secondary !min-h-10 !px-5 !py-2 !text-xs">
            {dictionary.country.back}
          </Link>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Aktivne ponude" : "Active offers"}</p>
          <p className="metric-card__value">{filteredOffers.length}</p>
          <p className="metric-card__hint">{language === "sr" ? "Ukupan broj trenutno vidljivih opcija." : "Total number of currently visible options."}</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Izvori" : "Sources"}</p>
          <p className="metric-card__value">{new Set(filteredOffers.map((offer) => offer.sourceSlug)).size}</p>
          <p className="metric-card__hint">{language === "sr" ? "Agencije i sistemi iz kojih dolaze ponude." : "Agencies and systems providing these offers."}</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Najniža cena" : "Lowest price"}</p>
          <p className="metric-card__value">
            {minPrice === null
              ? "-"
              : new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: filteredOffers[0]?.currency ?? "EUR",
                  maximumFractionDigits: 0,
                }).format(minPrice)}
          </p>
          <p className="metric-card__hint">{language === "sr" ? "Brza procena budžeta za ovu zemlju." : "Quick budget orientation for this country."}</p>
        </article>
      </section>

      <section className="filter-shell grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="grid gap-3">
          <label htmlFor="country-offers-search" className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            {dictionary.trips.searchLabel}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="country-offers-search"
              className="control"
              placeholder={dictionary.trips.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {hasQuery ? (
              <button type="button" className="btn-secondary !min-h-11 !px-4 !py-2 !text-xs" onClick={() => setQuery("")}>
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
          <h2 className="text-lg font-semibold">{dictionary.trips.readyTitle}</h2>
          <p className="panel-muted mt-2">{dictionary.trips.readyDescription}</p>
        </article>
      </section>

      {activeDestinations.length > 0 ? (
        <section className="grid gap-4">
          <header className="grid gap-1">
            <h2 className="text-2xl font-semibold">
              {language === "sr"
                ? "Istaknute destinacije za ovu stranicu"
                : "Featured destinations for this page"}
            </h2>
            <p className="panel-muted">
              {language === "sr"
                ? "Kurirana lista destinacija sa cenama i opisima."
                : "Curated destination list with pricing and descriptions."}
            </p>
          </header>

          <DestinationLoopCarousel
            destinations={activeDestinations}
            locale={locale}
            noImageLabel={language === "sr" ? "Bez slike" : "No image"}
            ariaLabel={
              language === "sr"
                ? "Beskonacni prikaz istaknutih destinacija"
                : "Infinite featured destinations carousel"
            }
          />
        </section>
      ) : null}

      <section>
        {filteredOffers.length > 0 ? (
          <div className="stagger-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer, index) => (
              <article
                key={offer.id}
                className="panel-glass fx-lift overflow-hidden"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <div className="relative h-20 w-full overflow-hidden rounded-xl border border-[var(--line)]">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#1f3a70,#133050)]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                  <div className="relative flex h-full items-center justify-between gap-3 px-4">
                    <p className="text-sm font-semibold text-white">{offer.destination}</p>
                    <span className="rounded-full border border-white/35 bg-black/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-white/90">
                      {offer.sourceSlug}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <h2 className="text-xl font-semibold leading-tight">{offer.title}</h2>
                  <p className="text-sm text-muted">
                    {dictionary.offers.departure}: {offer.departureCity || dictionary.offers.tbd}
                  </p>
                  <p className="text-sm text-muted">
                    {formatDate(offer.departureDate, locale, dictionary.offers.tbd)} -{" "}
                    {formatDate(offer.returnDate, locale, dictionary.offers.tbd)}
                  </p>
                  <p className="text-2xl font-semibold text-[var(--primary)]">{formatPrice(offer, locale)}</p>
                  <p className="text-sm text-muted">
                    {dictionary.offers.seats}:{" "}
                    {typeof offer.seatsLeft === "number" ? offer.seatsLeft : dictionary.offers.unknown}
                  </p>

                  {offer.tags.length > 0 ? (
                    <div className="tag-list mt-1">
                      {offer.tags.map((tag) => (
                        <span key={`${offer.id}-${tag}`} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <AddToCartButton
                      id={offer.id}
                      type="offer"
                      title={offer.title}
                      price={offer.price}
                      currency={offer.currency}
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
                        {language === "sr" ? "PDF program" : "PDF brochure"}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="empty-state__title">
              {query.trim() ? dictionary.trips.noResults : dictionary.country.noOffers}
            </h2>
            <p className="empty-state__copy">
              {language === "sr"
                ? "Pokušajte sa drugim pojmom ili uklonite filter da biste videli dostupne ponude."
                : "Try another term or clear filters to see available offers."}
            </p>
          </div>
        )}
      </section>

      {isAdmin && slug ? (
        <section className="mt-2">
          <DestinationEditor
            pageSlug={slug}
            title={
              language === "sr"
                ? `Admin: destinacije za ${countryName || slug}`
                : `Admin: destinations for ${countryName || slug}`
            }
            description={
              language === "sr"
                ? "Dodaj, izmeni i obriši destinacije direktno na ovoj /putovanja stranici."
                : "Add, edit, and delete destinations directly on this /putovanja page."
            }
          />
        </section>
      ) : null}

      <PageAdminEditorDock slot="country" className="mt-2" />
    </AlienShell>
  );
}



