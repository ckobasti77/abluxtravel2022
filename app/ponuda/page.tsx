"use client";

import { useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import PageAdminEditorDock from "../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../components/site-preferences-provider";
import {
  AggregatedOffer,
  OfferSource,
  SourceStatus,
  useOfferSources,
  useOffersLiveBoard,
} from "../../lib/use-offers";

const sourceStatusClass: Record<SourceStatus, string> = {
  planned: "border-slate-400/35 bg-slate-400/10",
  connected: "border-emerald-400/35 bg-emerald-400/10",
  syncing: "border-amber-400/35 bg-amber-400/10",
  paused: "border-rose-400/35 bg-rose-400/10",
};

const getSourceName = (slug: string, sources: OfferSource[]) => {
  const source = sources.find((item) => item.slug === slug);
  return source ? source.name : slug;
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

const formatDateTime = (timestamp: number | undefined, locale: string, fallback: string) => {
  if (!timestamp) return fallback;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
};

export default function PonudaPage() {
  const { dictionary, language } = useSitePreferences();
  const [destinationFilter, setDestinationFilter] = useState("");
  const sources = useOfferSources();
  const offers = useOffersLiveBoard(destinationFilter);
  const locale = language === "sr" ? "sr-RS" : "en-US";

  const sourceStatusLabel: Record<SourceStatus, string> = useMemo(
    () => ({
      planned: dictionary.offers.statusPlanned,
      connected: dictionary.offers.statusConnected,
      syncing: dictionary.offers.statusSyncing,
      paused: dictionary.offers.statusPaused,
    }),
    [dictionary.offers]
  );

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
    <AlienShell className="site-fade">
      <section className="space-y-5">
        <span className="pill">{dictionary.offers.badge}</span>
        <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
          {dictionary.offers.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted">
          {dictionary.offers.description}
        </p>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="surface rounded-2xl p-5">
          <label htmlFor="destination-filter" className="text-sm font-semibold">
            {dictionary.offers.filterLabel}
          </label>
          <input
            id="destination-filter"
            value={destinationFilter}
            onChange={(event) => setDestinationFilter(event.target.value)}
            placeholder={dictionary.offers.filterPlaceholder}
            className="control mt-3"
          />
        </article>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="surface rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {dictionary.offers.metricSources}
            </p>
            <p className="mt-2 text-2xl font-semibold">{metrics.totalSources}</p>
          </article>
          <article className="surface rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {dictionary.offers.metricConnected}
            </p>
            <p className="mt-2 text-2xl font-semibold">{metrics.connectedSources}</p>
          </article>
          <article className="surface rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {dictionary.offers.metricSyncing}
            </p>
            <p className="mt-2 text-2xl font-semibold">{metrics.syncingSources}</p>
          </article>
          <article className="surface rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {dictionary.offers.metricLastUpdate}
            </p>
            <p className="mt-2 text-sm font-medium text-muted">
              {formatDateTime(metrics.latestUpdate, locale, dictionary.offers.notSynced)}
            </p>
          </article>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">{dictionary.offers.sourcesTitle}</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sources.map((source) => (
            <article key={source.id} className="surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">{source.slug}</p>
              <h3 className="mt-2 text-lg font-semibold">{source.name}</h3>
              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${sourceStatusClass[source.status]}`}
              >
                {sourceStatusLabel[source.status]}
              </span>
              <p className="mt-3 text-sm text-muted">
                {dictionary.offers.syncInterval}: {source.syncEverySeconds}s
              </p>
              <p className="mt-1 text-sm text-muted">
                {dictionary.offers.lastSync}: {formatDateTime(source.lastSyncAt, locale, dictionary.offers.notSynced)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">{dictionary.offers.boardTitle}</h2>
        {offers.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <article key={offer.id} className="surface rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">
                  {getSourceName(offer.sourceSlug, sources)}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{offer.title}</h3>
                <p className="mt-2 text-sm text-muted">{offer.destination}</p>
                <p className="mt-1 text-sm text-muted">
                  {dictionary.offers.departure}: {offer.departureCity || dictionary.offers.tbd}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {formatDate(offer.departureDate, locale, dictionary.offers.tbd)} -{" "}
                  {formatDate(offer.returnDate, locale, dictionary.offers.tbd)}
                </p>
                <p className="mt-4 text-2xl font-semibold">
                  {formatPrice(offer, locale)}
                </p>
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
            {dictionary.offers.noResults}
          </div>
        )}
      </section>

      <PageAdminEditorDock slot="ponuda" className="mt-10" />
    </AlienShell>
  );
}

