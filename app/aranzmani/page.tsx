"use client";

import CmsImage from "@/components/cms-image";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaBus, FaCar, FaPlane, FaTrain, FaUser } from "react-icons/fa6";
import AlienShell from "../../components/alien-shell";
import PageAdminEditorDock from "../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { TransportType, TripStatus, useTrips } from "../../lib/use-trips";

const transportIcons: Record<TransportType, typeof FaBus> = {
  bus: FaBus,
  plane: FaPlane,
  car: FaCar,
  train: FaTrain,
  self: FaUser,
};

const statusClass: Record<TripStatus, string> = {
  active: "border-emerald-400/35 bg-emerald-400/10 text-emerald-300",
  upcoming: "border-amber-400/35 bg-amber-400/10 text-amber-300",
  completed: "border-slate-400/35 bg-slate-400/10 text-slate-300",
};

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

export default function AranzmaniPage() {
  const { dictionary, language } = useSitePreferences();
  const trips = useTrips();
  const t = dictionary.tripDetail;
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all");
  const [search, setSearch] = useState("");

  const locale = language === "sr" ? "sr-RS" : "en-US";

  const filtered = useMemo(() => {
    let result = trips;
    if (statusFilter !== "all") {
      result = result.filter((trip) => trip.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (trip) =>
          trip.title.toLowerCase().includes(q) ||
          trip.description.toLowerCase().includes(q) ||
          trip.departureCity.toLowerCase().includes(q)
      );
    }
    return result;
  }, [trips, statusFilter, search]);

  const activeCount = useMemo(
    () => trips.filter((trip) => trip.status === "active").length,
    [trips]
  );

  const uniqueCities = useMemo(
    () =>
      filtered.reduce((sum, trip) => sum + (trip.destinationCount ?? 0), 0),
    [filtered]
  );

  const averagePrice = useMemo(() => {
    if (filtered.length === 0) {
      return null;
    }
    const priced = filtered
      .map((trip) => trip.lowestDestinationPrice ?? trip.price)
      .filter((price) => price > 0);
    if (priced.length === 0) {
      return null;
    }
    const total = priced.reduce((sum, price) => sum + price, 0);
    return Math.round(total / priced.length);
  }, [filtered]);

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const isFiltered = search.trim().length > 0 || statusFilter !== "all";

  return (
    <AlienShell className="site-fade page-stack">
      <section className="page-hero">
        <span className="pill">{dictionary.arrangements.badge}</span>
        <h1 className="page-title">{dictionary.arrangements.title}</h1>
        <p className="page-subtitle">{dictionary.arrangements.description}</p>
        <div className="page-hero__meta tag-list">
          <span className="tag-chip">{dictionary.arrangements.trackA}</span>
          <span className="tag-chip">{dictionary.arrangements.trackB}</span>
          <span className="tag-chip">{dictionary.arrangements.trackC}</span>
        </div>
      </section>

      <section className="metric-grid" aria-label={language === "sr" ? "Kljucne metrike" : "Key metrics"}>
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Ukupno aranžmana" : "Total packages"}</p>
          <p className="metric-card__value">{trips.length}</p>
          <p className="metric-card__hint">{language === "sr" ? "Sve trenutno objavljene ponude." : "All currently published offers."}</p>
        </article>

        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Aktivno" : "Active now"}</p>
          <p className="metric-card__value">{activeCount}</p>
          <p className="metric-card__hint">{language === "sr" ? "Programi spremni za upit i rezervaciju." : "Programs ready for inquiry and booking."}</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">{language === "sr" ? "Destinacije" : "Destinations"}</p>
          <p className="metric-card__value">{uniqueCities}</p>
          <p className="metric-card__hint">{language === "sr" ? "Ukupan broj ponuda vezanih za aranžmane." : "Total offers attached to package groups."}</p>
        </article>
      </section>

      <section className="filter-shell">
        <div className="grid gap-3 lg:grid-cols-[1fr_14rem_auto] lg:items-end">
          <label className="grid gap-2" htmlFor="arrangements-search">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              {t.search}
            </span>
            <input
              id="arrangements-search"
              className="control"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label className="grid gap-2" htmlFor="arrangements-status">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              {t.filterByStatus}
            </span>
            <select
              id="arrangements-status"
              className="control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TripStatus | "all")}
            >
              <option value="all">{t.allTrips}</option>
              <option value="active">{t.statusActive}</option>
              <option value="upcoming">{t.statusUpcoming}</option>
              <option value="completed">{t.statusCompleted}</option>
            </select>
          </label>

          <div className="flex flex-col gap-2 lg:min-w-[10.5rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              {language === "sr" ? "Rezultata" : "Results"}
            </p>
            <p className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-center text-sm font-semibold">
              {filtered.length}
            </p>
            {isFiltered ? (
              <button type="button" className="btn-secondary !min-h-9 !px-3 !py-2 !text-xs" onClick={resetFilters}>
                {language === "sr" ? "Resetuj filtere" : "Reset filters"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {filtered.length > 0 ? (
        <section className="stagger-grid grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((trip, index) => {
            const TransportIcon = transportIcons[trip.transport];
            const heroImage = trip.imageUrls?.[0];
            const visiblePrice = trip.lowestDestinationPrice ?? trip.price;
            const visibleCurrency =
              trip.lowestDestinationCurrency ?? trip.currency;
            return (
              <article
                key={trip._id}
                className="panel-glass group fx-lift overflow-hidden"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <Link href={`/aranzmani/${trip.slug}`} className="block">
                  <div className="relative h-52 w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]">
                    {heroImage ? (
                      <CmsImage
                        src={heroImage}
                        alt={trip.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-muted/40">
                        <TransportIcon />
                      </div>
                    )}
                    <span
                      className={cx(
                        "absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        statusClass[trip.status]
                      )}
                    >
                      {trip.status === "active"
                        ? t.statusActive
                        : trip.status === "upcoming"
                          ? t.statusUpcoming
                          : t.statusCompleted}
                    </span>
                  </div>
                </Link>

                <div className="mt-4 grid gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <TransportIcon />
                    <span>
                      {trip.destinationCount ?? 0}{" "}
                      {language === "sr" ? "destinacija" : "destinations"}
                    </span>
                    {(trip.subagencyDestinationCount ?? 0) > 0 ? (
                      <span className="ml-auto rounded-full border border-[var(--line)] px-2 py-0.5">
                        {trip.subagencyDestinationCount} Subagentura
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-lg font-semibold leading-tight">{trip.title}</h3>
                  <p className="text-sm leading-6 text-muted line-clamp-3">{trip.description}</p>
                  {trip.departureDate || trip.returnDate ? (
                    <p className="text-sm text-muted">
                      {formatDate(trip.departureDate)}
                      {trip.returnDate ? ` - ${formatDate(trip.returnDate)}` : ""}
                    </p>
                  ) : null}

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-2xl font-semibold text-[var(--primary)]">
                      {visiblePrice > 0
                        ? formatPrice(visiblePrice, visibleCurrency)
                        : language === "sr"
                          ? "Na upit"
                          : "On request"}
                    </p>
                    <div className="flex items-center gap-2">
                      <Link href={`/aranzmani/${trip.slug}`} className="btn-secondary !min-h-9 !px-4 !py-2 !text-xs">
                        {language === "sr" ? "Pogledaj ponude" : "View offers"}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="empty-state">
          <h2 className="empty-state__title">{t.noTrips}</h2>
          <p className="empty-state__copy">
            {language === "sr"
              ? "Pokušajte sa drugim statusom ili uklonite pojam pretrage da biste videli više opcija."
              : "Try another status or clear the search term to see more options."}
          </p>
          {isFiltered ? (
            <button type="button" className="btn-secondary mt-4" onClick={resetFilters}>
              {language === "sr" ? "Prikaži sve aranžmane" : "Show all packages"}
            </button>
          ) : null}
        </div>
      )}

      {averagePrice !== null ? (
        <section className="panel-glass">
          <p className="metric-card__label">{language === "sr" ? "Prosečna cena trenutno filtriranih" : "Average price in current selection"}</p>
          <p className="metric-card__value">{formatPrice(averagePrice, filtered[0]?.currency ?? "EUR")}</p>
          <p className="panel-muted">
            {language === "sr"
              ? "Koristan signal za brzu procenu budžeta pre otvaranja detalja aranžmana."
              : "Useful signal for quick budget estimation before opening package details."}
          </p>
        </section>
      ) : null}

      <PageAdminEditorDock slot="aranzmani" className="mt-2" />
    </AlienShell>
  );
}




