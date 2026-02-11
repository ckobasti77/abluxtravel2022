"use client";

import { useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import { AggregatedOffer, OfferSource, SourceStatus, useOfferSources, useOffersLiveBoard } from "../../lib/use-offers";

const sourceStatusLabel: Record<SourceStatus, string> = {
  planned: "Planned",
  connected: "Connected",
  syncing: "Syncing",
  paused: "Paused",
};

const sourceStatusClass: Record<SourceStatus, string> = {
  planned: "text-cyan-100/75 border-cyan-100/20 bg-cyan-100/8",
  connected: "text-emerald-200 border-emerald-300/30 bg-emerald-300/12",
  syncing: "text-amber-200 border-amber-300/30 bg-amber-300/12",
  paused: "text-rose-200 border-rose-300/30 bg-rose-300/12",
};

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

const formatDateTime = (timestamp?: number) => {
  if (!timestamp) return "Nije sinhronizovano";
  return new Intl.DateTimeFormat("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
};

const getSourceName = (slug: string, sources: OfferSource[]) => {
  const source = sources.find((item) => item.slug === slug);
  return source ? source.name : slug;
};

export default function PonudaPage() {
  const [destinationFilter, setDestinationFilter] = useState("");
  const sources = useOfferSources();
  const offers = useOffersLiveBoard(destinationFilter);

  const metrics = useMemo(() => {
    const connected = sources.filter((source) => source.status === "connected").length;
    const syncing = sources.filter((source) => source.status === "syncing").length;
    const latest = offers.reduce((acc, offer) => Math.max(acc, offer.updatedAt), 0);
    return {
      totalSources: sources.length,
      connectedSources: connected,
      syncingSources: syncing,
      latestUpdate: latest,
    };
  }, [offers, sources]);

  return (
    <AlienShell>
      <section className="grid gap-8 pb-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-cyan-100/90">
            Ponuda Matrix
          </p>
          <h1 className="max-w-2xl text-4xl uppercase tracking-[0.14em] text-cyan-50 sm:text-5xl">
            Live agregator ponuda za vise agencija.
          </h1>
          <p className="max-w-xl text-cyan-50/75">
            Stranica je spremna da prikazuje i osvezava ponude iz 15+ partnera u
            realnom vremenu cim dobijes zeleno svetlo za pristup njihovim bazama.
          </p>
          <div className="alien-panel rounded-2xl p-4 sm:p-5">
            <label
              htmlFor="destination-filter"
              className="text-xs uppercase tracking-[0.25em] text-cyan-100/70"
            >
              Filter destinacije
            </label>
            <input
              id="destination-filter"
              value={destinationFilter}
              onChange={(event) => setDestinationFilter(event.target.value)}
              placeholder="npr. Santorini"
              className="mt-3 h-11 w-full rounded-xl border border-cyan-100/20 bg-cyan-100/8 px-4 text-sm text-cyan-50 outline-none transition placeholder:text-cyan-50/35 focus:border-cyan-100/60"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="alien-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">Izvori</p>
            <p className="mt-2 text-2xl text-cyan-50">{metrics.totalSources}</p>
          </div>
          <div className="alien-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">Connected</p>
            <p className="mt-2 text-2xl text-cyan-50">{metrics.connectedSources}</p>
          </div>
          <div className="alien-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">Syncing</p>
            <p className="mt-2 text-2xl text-cyan-50">{metrics.syncingSources}</p>
          </div>
          <div className="alien-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">Poslednji update</p>
            <p className="mt-2 text-sm text-cyan-50/80">{formatDateTime(metrics.latestUpdate)}</p>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-cyan-100/70">
          Izvori Podataka
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sources.map((source) => (
            <article
              key={source.id}
              className="alien-panel rounded-2xl p-4"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
                {source.slug}
              </p>
              <h3 className="mt-2 text-base uppercase tracking-[0.14em] text-cyan-50">
                {source.name}
              </h3>
              <p
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${sourceStatusClass[source.status]}`}
              >
                {sourceStatusLabel[source.status]}
              </p>
              <p className="mt-3 text-sm text-cyan-50/70">
                Sync interval: {source.syncEverySeconds}s
              </p>
              <p className="mt-1 text-xs text-cyan-50/60">
                Last sync: {formatDateTime(source.lastSyncAt)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-cyan-100/70">
          Live Board Ponuda
        </h2>
        {offers.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <article key={offer.id} className="alien-panel rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
                  {getSourceName(offer.sourceSlug, sources)}
                </p>
                <h3 className="mt-2 text-base uppercase tracking-[0.12em] text-cyan-50">
                  {offer.title}
                </h3>
                <p className="mt-2 text-sm text-cyan-50/75">{offer.destination}</p>
                <p className="mt-1 text-sm text-cyan-50/65">
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
            Nema ponuda za trazeni filter.
          </div>
        )}
      </section>
    </AlienShell>
  );
}
