"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import AlienShell from "../../../components/alien-shell";
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

  const countryName = useMemo(() => fromCountrySlug(slug), [slug]);
  const offers = useOffersLiveBoard(countryName);
  const locale = language === "sr" ? "sr-RS" : "en-US";

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

      <section className="mt-8">
        {offers.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <article key={offer.id} className="surface rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">
                  {offer.destination}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{offer.title}</h2>
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
          <div className="surface rounded-2xl p-6 text-sm text-muted">
            {dictionary.country.noOffers}
          </div>
        )}
      </section>
    </AlienShell>
  );
}

