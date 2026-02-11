"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import AlienShell from "../../../components/alien-shell";
import { fromCountrySlug } from "../../../lib/country-route";
import { AggregatedOffer, useOffersLiveBoard } from "../../../lib/use-offers";

const formatPrice = (offer: AggregatedOffer) =>
  new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.price);

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "TBD";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("sr-RS", { dateStyle: "medium" }).format(parsed);
};

export default function CountryTripsPage() {
  const params = useParams<{ zemlja: string }>();
  const slug = typeof params?.zemlja === "string" ? params.zemlja : "";

  const countryName = useMemo(() => fromCountrySlug(slug), [slug]);
  const offers = useOffersLiveBoard(countryName);

  return (
    <AlienShell>
      <section className="grid gap-5 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <p className="inline-flex rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-cyan-100/90">
            Putovanja po zemlji
          </p>
          <h1 className="text-4xl uppercase tracking-[0.14em] text-cyan-50 sm:text-5xl">
            {countryName || "Destinacija"}
          </h1>
          <p className="max-w-2xl text-sm text-cyan-50/75 sm:text-base">
            Sve aktivne ponude za izabranu zemlju.
          </p>
        </div>
        <Link
          href="/putovanja"
          className="inline-flex h-12 items-center justify-center rounded-full border border-cyan-100/35 px-6 text-xs uppercase tracking-[0.28em] text-cyan-100 transition hover:border-cyan-100/70"
        >
          Nazad na zemlje
        </Link>
      </section>

      <section className="pb-8">
        {offers.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <article key={offer.id} className="alien-panel rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
                  {offer.destination}
                </p>
                <h2 className="mt-2 text-base uppercase tracking-[0.12em] text-cyan-50">
                  {offer.title}
                </h2>
                <p className="mt-3 text-sm text-cyan-50/70">
                  {offer.departureCity ? `Polazak: ${offer.departureCity}` : "Polazak: TBD"}
                </p>
                <p className="mt-1 text-sm text-cyan-50/65">
                  {formatDate(offer.departureDate)} - {formatDate(offer.returnDate)}
                </p>
                <p className="mt-4 text-xl text-cyan-100">{formatPrice(offer)}</p>
                <p className="mt-1 text-xs text-cyan-50/60">
                  Slobodna mesta: {typeof offer.seatsLeft === "number" ? offer.seatsLeft : "?"}
                </p>
                {offer.tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {offer.tags.map((tag) => (
                      <span
                        key={`${offer.id}-${tag}`}
                        className="rounded-full border border-cyan-100/20 bg-cyan-100/8 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-50/75"
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
          <div className="alien-panel rounded-2xl p-6 text-sm text-cyan-50/70">
            Trenutno nema aktivnih ponuda za {countryName || "ovu zemlju"}.
          </div>
        )}
      </section>
    </AlienShell>
  );
}
