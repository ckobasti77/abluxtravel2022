"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaBus, FaPlane, FaCar, FaTrain, FaUser } from "react-icons/fa6";
import AlienShell from "../../components/alien-shell";
import PageAdminEditorDock from "../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { useTrips, TripStatus, TransportType } from "../../lib/use-trips";

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

  return (
    <AlienShell className="site-fade">
      <section className="space-y-5">
        <span className="pill">{dictionary.arrangements.badge}</span>
        <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
          {dictionary.arrangements.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted">
          {dictionary.arrangements.description}
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
        <input
          className="control"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TripStatus | "all")}
        >
          <option value="all">{t.allTrips}</option>
          <option value="active">{t.statusActive}</option>
          <option value="upcoming">{t.statusUpcoming}</option>
          <option value="completed">{t.statusCompleted}</option>
        </select>
      </section>

      {filtered.length > 0 ? (
        <section className="stagger-grid mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((trip, index) => {
            const TransportIcon = transportIcons[trip.transport];
            const heroImage = trip.imageUrls?.[0];
            return (
              <Link
                key={trip._id}
                href={`/aranzmani/${trip.slug}`}
                className="surface fx-lift group block overflow-hidden rounded-2xl transition"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <div className="relative h-48 w-full overflow-hidden bg-[var(--bg-soft)]">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt={trip.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-muted/30">
                      <TransportIcon />
                    </div>
                  )}
                  <span
                    className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[trip.status]}`}
                  >
                    {trip.status === "active"
                      ? t.statusActive
                      : trip.status === "upcoming"
                        ? t.statusUpcoming
                        : t.statusCompleted}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <TransportIcon />
                    <span>
                      {trip.days} {t.days} | {trip.nights} {t.nights}
                    </span>
                    <span className="ml-auto">{trip.departureCity}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{trip.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(trip.departureDate)}
                    {trip.returnDate ? ` - ${formatDate(trip.returnDate)}` : ""}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-[var(--primary)]">
                    {formatPrice(trip.price, trip.currency)}
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <div className="surface mt-6 rounded-2xl p-6 text-center text-sm text-muted">
          {t.noTrips}
        </div>
      )}

      <PageAdminEditorDock slot="aranzmani" className="mt-10" />
    </AlienShell>
  );
}
