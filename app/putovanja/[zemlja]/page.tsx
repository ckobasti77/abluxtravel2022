"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type CSSProperties, useMemo, useState } from "react";
import AlienShell from "../../../components/alien-shell";
import PageAdminEditorDock from "../../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../../components/site-preferences-provider";
import { fromCountrySlug } from "../../../lib/country-route";
import { AggregatedOffer, useOffersLiveBoard } from "../../../lib/use-offers";

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
  const [query, setQuery] = useState("");

  const countryName = useMemo(() => fromCountrySlug(slug), [slug]);
  const offers = useOffersLiveBoard(countryName);
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

  return (
    <AlienShell className="site-fade">
      <section className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <span className="pill">{dictionary.country.badge}</span>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            {dictionary.country.title} {countryName || "-"}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted sm:text-base">
            {dictionary.country.description}
          </p>
        </div>

        <Link href="/putovanja" className="btn-secondary h-11 px-6">
          {dictionary.country.back}
        </Link>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="section-holo p-5">
          <label htmlFor="country-offers-search" className="text-sm font-semibold">
            {dictionary.trips.searchLabel}
          </label>
          <input
            id="country-offers-search"
            className="control mt-3"
            placeholder={dictionary.trips.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </article>

        <article className="section-holo p-5">
          <h2 className="text-xl font-semibold">{dictionary.trips.readyTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{dictionary.trips.readyDescription}</p>
        </article>
      </section>

      <section className="mt-6">
        {filteredOffers.length > 0 ? (
          <div className="stagger-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer, index) => (
              <article
                key={offer.id}
                className="surface fx-lift overflow-hidden rounded-3xl"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <div className="relative h-20 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#1f3a70,#133050)]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                  <div className="relative flex h-full items-center justify-between gap-3 px-4">
                    <p className="text-sm font-semibold text-white">{offer.destination}</p>
                    <span className="rounded-full border border-white/35 bg-black/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-white/90">
                      {offer.sourceSlug}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-semibold">{offer.title}</h2>
                  <p className="mt-3 text-sm text-muted">
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
                          className="mt-2 h-56 w-full rounded-lg border border-[var(--line)] bg-white"
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
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface rounded-2xl p-6 text-sm text-muted">
            {query.trim() ? dictionary.trips.noResults : dictionary.country.noOffers}
          </div>
        )}
      </section>

      <PageAdminEditorDock slot="country" className="mt-10" />
    </AlienShell>
  );
}
