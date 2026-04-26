"use client";

import CmsImage from "@/components/cms-image";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import AdminPageHeader from "./admin/admin-page-header";
import AccommodationEditor from "./accommodation-editor";
import DestinationsDataTable from "./admin/destinations-data-table";
import DestinationSlideOver from "./admin/destination-slide-over";
import TripSlideOver from "./admin/trip-slide-over";
import InlineCategories from "./inline-categories";
import { useSitePreferences } from "./site-preferences-provider";
import type { Destination } from "../lib/use-destinations";
import { Trip, TripStatus, useTrips } from "../lib/use-trips";
import {
  FaBed,
  FaChevronDown,
  FaLocationDot,
  FaPen,
  FaPlus,
  FaStar,
  FaTrash,
} from "react-icons/fa6";

const formatDate = (value: string, language: string) => {
  if (!value) return language === "sr" ? "Bez datuma" : "No date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "sr" ? "sr-RS" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const statusTone = (status: TripStatus) => {
  if (status === "active") {
    return "border-emerald-400/35 bg-emerald-400/10 text-emerald-500";
  }
  if (status === "upcoming") {
    return "border-amber-400/35 bg-amber-400/10 text-amber-500";
  }
  return "border-slate-400/35 bg-slate-400/10 text-slate-400";
};

export default function TripEditor() {
  const { dictionary, language } = useSitePreferences();
  const trips = useTrips();
  const removeTrip = useMutation(api.trips.remove);

  const [tripSlideOverOpen, setTripSlideOverOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [expandedDestinationTripIds, setExpandedDestinationTripIds] = useState<
    Set<string>
  >(new Set());
  const [expandedAccommodationTripIds, setExpandedAccommodationTripIds] =
    useState<Set<string>>(new Set());
  const [destinationSlideOverOpen, setDestinationSlideOverOpen] =
    useState(false);
  const [destinationTripId, setDestinationTripId] = useState("");
  const [editingDestination, setEditingDestination] =
    useState<Destination | null>(null);

  const t = dictionary.tripDetail;

  const sortedTrips = useMemo(
    () => [...trips].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    [trips]
  );

  const activeCount = sortedTrips.filter((trip) => trip.status === "active").length;
  const destinationCount = sortedTrips.reduce(
    (total, trip) => total + (trip.destinationCount ?? 0),
    0
  );

  const statusLabel = (status: TripStatus) => {
    if (status === "active") return t.statusActive;
    if (status === "upcoming") return t.statusUpcoming;
    return t.statusCompleted;
  };

  const openNewTrip = () => {
    setEditingTrip(null);
    setTripSlideOverOpen(true);
  };

  const openEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setTripSlideOverOpen(true);
  };

  const closeTripSlideOver = () => {
    setTripSlideOverOpen(false);
    setEditingTrip(null);
  };

  const handleDelete = async (tripId: string) => {
    const confirmed = window.confirm(
      language === "sr" ? "Obrisati ovaj aranžman?" : "Delete this trip?"
    );
    if (!confirmed) return;
    await removeTrip({ id: tripId as Id<"trips"> });
    if (editingTrip?._id === tripId) {
      closeTripSlideOver();
    }
  };

  const toggleTripDestinations = (tripId: string) => {
    setExpandedDestinationTripIds((previous) => {
      const next = new Set(previous);
      if (next.has(tripId)) {
        next.delete(tripId);
      } else {
        next.add(tripId);
      }
      return next;
    });
  };

  const toggleTripAccommodations = (tripId: string) => {
    setExpandedAccommodationTripIds((previous) => {
      const next = new Set(previous);
      if (next.has(tripId)) {
        next.delete(tripId);
      } else {
        next.add(tripId);
      }
      return next;
    });
  };

  const openNewDestination = (tripId: string) => {
    setEditingDestination(null);
    setDestinationTripId(tripId);
    setDestinationSlideOverOpen(true);
  };

  const openEditDestination = (destination: Destination, tripId: string) => {
    setEditingDestination(destination);
    setDestinationTripId(tripId);
    setDestinationSlideOverOpen(true);
  };

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    {
      label: language === "sr" ? "Aranžmani" : "Packages",
      href: "/admin/aranzmani",
    },
  ];

  return (
    <section className="grid gap-6">
      <AdminPageHeader
        breadcrumbs={breadcrumbs}
        title={language === "sr" ? "Pregled aranžmana" : "Package overview"}
        subtitle={
          language === "sr"
            ? "Aranžmani su odmah vidljivi, a dodavanje i izmena se rade kroz bočni panel."
            : "Packages are visible immediately, with create and edit actions handled in a slide-over."
        }
        actions={[
          {
            label: language === "sr" ? "Novi aranžman" : "New package",
            onClick: openNewTrip,
          },
        ]}
      />

      <InlineCategories type="arrangement" />

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="surface rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Ukupno aranžmana" : "Total packages"}
          </p>
          <p className="mt-2 text-2xl font-semibold">{sortedTrips.length}</p>
        </article>
        <article className="surface rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {dictionary.admin.active}
          </p>
          <p className="mt-2 text-2xl font-semibold">{activeCount}</p>
        </article>
        <article className="surface rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Destinacije" : "Destinations"}
          </p>
          <p className="mt-2 text-2xl font-semibold">{destinationCount}</p>
        </article>
      </div>

      {sortedTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] bg-[var(--bg-soft)] px-4 py-12 text-center">
          <p className="text-sm font-semibold">
            {language === "sr" ? "Nema aranžmana" : "No packages yet"}
          </p>
          <p className="mt-1 max-w-md text-xs leading-5 text-[var(--muted)]">
            {language === "sr"
              ? "Dodajte prvi aranžman, pa zatim otvorite destinacije za konkretne ponude."
              : "Add the first package, then open destinations for concrete offers."}
          </p>
        </div>
      ) : null}

      <div className="stagger-grid grid gap-4">
        {sortedTrips.map((trip, index) => {
          const isExpanded = expandedDestinationTripIds.has(trip._id);
          const accommodationsExpanded = expandedAccommodationTripIds.has(
            trip._id
          );
          const heroImage = trip.imageUrls.find(Boolean);
          const destinationLabel =
            language === "sr"
              ? `${trip.destinationCount ?? 0} destinacija`
              : `${trip.destinationCount ?? 0} destinations`;

          return (
            <article
              key={trip._id}
              className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]"
              style={{ "--stagger-index": index } as CSSProperties}
            >
              <div className="grid gap-3 p-3 sm:grid-cols-[132px_1fr_auto] sm:items-center sm:p-4">
                <div className="h-28 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] sm:h-20">
                  {heroImage ? (
                    <CmsImage
                      src={heroImage}
                      alt={trip.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
                      {language === "sr" ? "Nema slike" : "No image"}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-base font-bold">{trip.title}</p>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusTone(
                        trip.status
                      )}`}
                    >
                      {statusLabel(trip.status)}
                    </span>
                    {trip.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                        <FaStar className="text-[9px]" />
                        {t.featured}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 truncate text-xs text-[var(--muted)]">
                    /{trip.slug} · {formatDate(trip.departureDate, language)} ·{" "}
                    {destinationLabel}
                  </p>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                    {trip.description ||
                      (language === "sr"
                        ? "Roditeljski aranžman za povezane destinacije."
                        : "Parent package for connected destinations.")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => openEditTrip(trip)}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-xs text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <FaPen className="text-[10px]" />
                    {language === "sr" ? "Uredi" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTripDestinations(trip._id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition ${
                      isExpanded
                        ? "border-[var(--primary)] text-[var(--primary)]"
                        : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <FaLocationDot className="text-[10px]" />
                    {language === "sr" ? "Destinacije" : "Destinations"}
                    <FaChevronDown
                      className={`text-[10px] transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTripAccommodations(trip._id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition ${
                      accommodationsExpanded
                        ? "border-[var(--primary)] text-[var(--primary)]"
                        : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <FaBed className="text-[10px]" />
                    {language === "sr" ? "Smeštaj" : "Accommodation"}
                    <FaChevronDown
                      className={`text-[10px] transition-transform ${
                        accommodationsExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(trip._id)}
                    className="flex items-center justify-center rounded-lg border border-[var(--line)] p-1.5 text-xs text-[var(--muted)] transition hover:border-red-400 hover:text-red-400"
                    aria-label={language === "sr" ? "Obriši aranžman" : "Delete package"}
                    title={language === "sr" ? "Obriši aranžman" : "Delete package"}
                  >
                    <FaTrash className="text-[10px]" />
                  </button>
                </div>
              </div>

              {isExpanded ? (
                <div className="border-t border-[var(--line)] bg-[var(--bg-soft)] p-3 sm:p-4">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        {language === "sr"
                          ? `Destinacije za: ${trip.title}`
                          : `Destinations for: ${trip.title}`}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {language === "sr"
                          ? "Ovde se dodaju konkretne ponude, cene, datumi i subagenture."
                          : "Add concrete offers, pricing, dates, and subagencies here."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openNewDestination(trip._id)}
                      className="btn-primary self-start !min-h-9 !px-3 !py-2 !text-xs sm:self-auto"
                    >
                      <FaPlus className="text-[10px]" />
                      {language === "sr" ? "Nova destinacija" : "New destination"}
                    </button>
                  </div>
                  <DestinationsDataTable
                    tripId={trip._id}
                    offerMode
                    onEdit={(destination) => openEditDestination(destination, trip._id)}
                  />
                </div>
              ) : null}

              {accommodationsExpanded ? (
                <div className="border-t border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4">
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      {language === "sr"
                        ? `Smeštaj za: ${trip.title}`
                        : `Accommodation for: ${trip.title}`}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {language === "sr"
                        ? "Opcije smeštaja ostaju vezane za izabrani aranžman."
                        : "Accommodation options remain connected to the selected package."}
                    </p>
                  </div>
                  <AccommodationEditor tripId={trip._id} />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {tripSlideOverOpen ? (
        <TripSlideOver
          key={editingTrip ? `edit-${editingTrip._id}` : "new-trip"}
          open={tripSlideOverOpen}
          trip={editingTrip}
          onClose={closeTripSlideOver}
        />
      ) : null}

      {destinationSlideOverOpen ? (
        <DestinationSlideOver
          key={
            editingDestination
              ? `edit-${editingDestination._id}`
              : `new-${destinationTripId}`
          }
          open={destinationSlideOverOpen}
          destination={editingDestination}
          tripId={destinationTripId}
          offerMode
          onClose={() => {
            setDestinationSlideOverOpen(false);
            setEditingDestination(null);
            setDestinationTripId("");
          }}
        />
      ) : null}
    </section>
  );
}
