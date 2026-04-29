"use client";

import CmsImage from "@/components/cms-image";
import { type CSSProperties, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaArrowRight,
  FaArrowLeft,
  FaBed,
  FaBuilding,
  FaBus,
  FaCalendarDays,
  FaCar,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaDoorOpen,
  FaEllipsis,
  FaHotel,
  FaHouse,
  FaLocationDot,
  FaMoneyBillWave,
  FaPlane,
  FaRoute,
  FaTrain,
  FaUser,
  FaUsers,
  FaUtensils,
  FaXmark,
} from "react-icons/fa6";
import AddToCartButton from "../../../components/add-to-cart-button";
import AlienShell from "../../../components/alien-shell";
import { useSitePreferences } from "../../../components/site-preferences-provider";
import { AccommodationType, useAccommodationsByTrip } from "../../../lib/use-accommodations";
import { useDestinationsByTrip } from "../../../lib/use-destinations";
import { TransportType, useTripBySlug } from "../../../lib/use-trips";

const transportIcons: Record<TransportType, typeof FaBus> = {
  bus: FaBus,
  plane: FaPlane,
  car: FaCar,
  train: FaTrain,
  self: FaUser,
};

const accommodationIcons: Record<AccommodationType, typeof FaHouse> = {
  villa: FaHouse,
  apartment: FaBuilding,
  hotel: FaHotel,
  room: FaDoorOpen,
  hostel: FaBed,
  other: FaEllipsis,
};

const getIframeSrc = (value: string | undefined) => {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  return srcMatch?.[1] ?? trimmed;
};


export default function TripDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { dictionary, language } = useSitePreferences();
  const trip = useTripBySlug(slug);
  const t = dictionary.tripDetail;
  const acc = dictionary.accommodation;
  const locale = language === "sr" ? "sr-RS" : "en-US";

  const accommodations = useAccommodationsByTrip(trip?._id);
  const activeAccommodations = accommodations.filter((a) => a.isActive);
  const destinations = useDestinationsByTrip(trip?._id);
  const activeDestinations = useMemo(
    () => destinations.filter((item) => item.isActive),
    [destinations],
  );
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(
    null,
  );
  const selectedDestination = useMemo(() => {
    if (activeDestinations.length === 0) {
      return null;
    }
    return (
      activeDestinations.find((item) => item._id === selectedDestinationId) ??
      activeDestinations[0]
    );
  }, [activeDestinations, selectedDestinationId]);
  const selectedDestinationImages = useMemo(
    () => selectedDestination?.imageUrls.filter(Boolean) ?? [],
    [selectedDestination],
  );
  const detailMediaItems = useMemo(() => {
    if (!trip) return [];
    const media = trip.detailMedia?.filter((item) => item.url) ?? [];
    if (media.length > 0) return media;
    return trip.imageUrls
      .filter(Boolean)
      .map((url) => ({ url, mediaType: "image" as const }));
  }, [trip]);
  const [expandedAcc, setExpandedAcc] = useState<string | null>(null);

  if (trip === undefined) {
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

  if (trip === null) {
    return (
      <AlienShell className="site-fade">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-semibold">404</h1>
          <p className="text-muted">{language === "sr" ? "Aranžman nije pronađen." : "Trip not found."}</p>
          <Link href="/aranzmani" className="btn-primary">
            {t.back}
          </Link>
        </div>
      </AlienShell>
    );
  }

  const TransportIcon = transportIcons[trip.transport];

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
    return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(d);
  };

  const formatShortDate = (iso: string | undefined) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
  };
  const destinationContactCta =
    language === "sr"
      ? "Pošalji upit za ovu destinaciju"
      : "Send inquiry for this destination";

  return (
    <AlienShell className="site-fade page-stack">
      <section className="page-hero">
        <Link href="/aranzmani" className="inline-flex w-fit items-center gap-2 text-sm text-muted transition hover:text-[var(--primary)]">
          <FaArrowLeft className="text-xs" />
          {t.back}
        </Link>
        <h1 className="page-title">{trip.title}</h1>
        <p className="page-subtitle">{trip.description}</p>
      </section>

      {detailMediaItems.length > 0 ? (
        <section className="panel-glass overflow-hidden">
          <div className="flex snap-x gap-3 overflow-x-auto pb-2">
            {detailMediaItems.map((media, i) =>
              media.mediaType === "video" ? (
                <video
                  key={`${media.url}-${i}`}
                  src={media.url}
                  className="h-56 w-auto shrink-0 snap-center rounded-xl border border-[var(--line)] object-cover sm:h-72"
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <CmsImage
                  key={`${media.url}-${i}`}
                  src={media.url}
                  alt={`${trip.title} ${i + 1}`}
                  className="h-56 w-auto shrink-0 snap-center rounded-xl border border-[var(--line)] object-cover sm:h-72"
                />
              ),
            )}
          </div>
        </section>
      ) : null}

      {activeDestinations.length > 0 ? (
        <section className="grid gap-4">
          <header className="grid gap-1">
            <h2 className="text-2xl font-semibold">
              {language === "sr" ? "Destinacije u aranžmanu" : "Destinations in this package"}
            </h2>
            <p className="panel-muted">
              {language === "sr"
                ? "Cena se prikazuje na konkretnoj destinaciji, kako bi izbor bio jasan i bez mešanja sa glavnim aranžmanom."
                : "Pricing is shown on concrete destinations, keeping the parent package clean and easy to compare."}
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeDestinations.map((item, index) => {
              const heroImage = item.imageUrls?.find(Boolean);
              const active = item._id === selectedDestination?._id;
              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setSelectedDestinationId(item._id)}
                  className={`group overflow-hidden rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)]"
                  }`}
                  style={{ "--stagger-index": index } as CSSProperties}
                >
                  <div className="relative h-40 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]">
                    {heroImage ? (
                      <CmsImage
                        src={heroImage}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,#173b71,#155eef)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <span className="shrink-0 rounded-full border border-white/30 bg-black/40 px-2.5 py-1 text-xs font-semibold text-white">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {item.description ? (
                      <p className="line-clamp-2 text-sm leading-6 text-muted">
                        {item.description}
                      </p>
                    ) : null}
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--primary)]">
                      {language === "sr" ? "Pogledaj detalje destinacije" : "View destination details"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="metric-grid">
          <article className="metric-card">
            <p className="metric-card__label">{t.transport}</p>
            <p className="metric-card__value inline-flex items-center gap-2 text-[1.2rem] sm:text-[1.5rem]">
              <TransportIcon className="text-[var(--primary)]" />
              {t[trip.transport]}
            </p>
            <p className="metric-card__hint">{language === "sr" ? "Tip prevoza za ovaj aranžman." : "Transport type for this package."}</p>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">{t.departure}</p>
            <p className="metric-card__value">{formatDate(trip.departureDate)}</p>
            <p className="metric-card__hint">{language === "sr" ? `Povratak: ${formatDate(trip.returnDate)}` : `Return: ${formatDate(trip.returnDate)}`}</p>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">{t.departureCity}</p>
            <p className="metric-card__value">{trip.departureCity}</p>
            <p className="metric-card__hint">{trip.days} {t.days} | {trip.nights} {t.nights}</p>
          </article>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-6">
          {activeAccommodations.length > 0 ? (
            <section className="grid gap-4">
              <header className="grid gap-1">
                <h2 className="text-2xl font-semibold">{acc.title}</h2>
                <p className="panel-muted">{acc.subtitle}</p>
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                {activeAccommodations.map((item) => {
                  const AccIcon = accommodationIcons[item.type];
                  const isExpanded = expandedAcc === item._id;
                  const heroImg = item.imageUrls?.[0];

                  return (
                    <article key={item._id} className="panel-glass group overflow-hidden">
                      {heroImg ? (
                        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]">
                          <CmsImage
                            src={heroImg}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <AccIcon className="text-[10px]" />
                            {acc[item.type]}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-4 grid gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {!heroImg ? (
                              <div className="mb-1 flex items-center gap-1.5 text-xs text-muted">
                                <AccIcon />
                                {acc[item.type]}
                              </div>
                            ) : null}
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-[var(--primary)]">
                              {formatPrice(item.pricePerPerson, item.currency)}
                            </p>
                            <p className="text-[11px] text-muted">{acc.perPerson}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <FaUsers className="text-[10px]" />
                            {acc.upTo} {item.capacity} {acc.guests}
                          </span>
                          {item.boardType ? (
                            <span className="flex items-center gap-1">
                              <FaUtensils className="text-[10px]" />
                              {acc[item.boardType]}
                            </span>
                          ) : null}
                          {item.distanceToCenter ? (
                            <span className="flex items-center gap-1">
                              <FaLocationDot className="text-[10px]" />
                              {item.distanceToCenter}
                            </span>
                          ) : null}
                        </div>

                        {item.amenities.length > 0 ? (
                          <div className="tag-list">
                            {item.amenities.slice(0, isExpanded ? undefined : 4).map((a, i) => (
                              <span key={i} className="tag-chip">
                                {a}
                              </span>
                            ))}
                            {!isExpanded && item.amenities.length > 4 ? (
                              <span className="tag-chip text-muted">+{item.amenities.length - 4}</span>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="flex items-center gap-2">
                          <AddToCartButton
                            id={item._id}
                            type="accommodation"
                            title={`${item.name} - ${trip.title}`}
                            price={item.pricePerPerson}
                            currency={item.currency}
                            imageUrl={heroImg}
                            compact
                          />
                          <button
                            type="button"
                            onClick={() => setExpandedAcc(isExpanded ? null : item._id)}
                            className="btn-secondary !min-h-10 flex-1 !justify-center !px-3 !py-2 !text-xs"
                          >
                            {isExpanded ? (language === "sr" ? "Sakrij detalje" : "Hide details") : acc.viewDetails}
                            {isExpanded ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                          </button>
                        </div>

                        {isExpanded ? (
                          <div className="grid gap-3 border-t border-[var(--line)] pt-3">
                            {item.description ? (
                              <p className="text-sm leading-6 text-muted">{item.description}</p>
                            ) : null}

                            {item.imageUrls.filter(Boolean).length > 1 ? (
                              <div className="flex gap-2 overflow-x-auto pb-1">
                                {item.imageUrls
                                  .filter(Boolean)
                                  .slice(1)
                                  .map((url, i) => (
                                    <CmsImage
                                      key={i}
                                      src={url}
                                      alt={`${item.name} ${i + 2}`}
                                      className="h-24 w-auto shrink-0 rounded-xl border border-[var(--line)] object-cover"
                                    />
                                  ))}
                              </div>
                            ) : null}

                            <div className="grid gap-2 text-sm sm:grid-cols-2">
                              {item.roomInfo ? (
                                <div className="flex items-center gap-2">
                                  <FaDoorOpen className="shrink-0 text-xs text-[var(--primary)]" />
                                  <span>{item.roomInfo}</span>
                                </div>
                              ) : null}
                              {item.checkIn ? (
                                <div className="flex items-center gap-2">
                                  <FaClock className="shrink-0 text-xs text-[var(--primary)]" />
                                  <span>Check-in: {item.checkIn}</span>
                                </div>
                              ) : null}
                              {item.checkOut ? (
                                <div className="flex items-center gap-2">
                                  <FaClock className="shrink-0 text-xs text-[var(--primary)]" />
                                  <span>Check-out: {item.checkOut}</span>
                                </div>
                              ) : null}
                              {item.distanceToCenter ? (
                                <div className="flex items-center gap-2">
                                  <FaLocationDot className="shrink-0 text-xs text-[var(--primary)]" />
                                  <span>{item.distanceToCenter}</span>
                                </div>
                              ) : null}
                            </div>

                            <Link href="/kontakt" className="btn-primary mt-1 w-full !justify-center !text-sm">
                              {t.contactCta}
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {activeDestinations.length > 0 && selectedDestination ? (
            <section className="grid gap-4">
              <header className="grid gap-1">
                <h2 className="text-2xl font-semibold">
                  {language === "sr" ? "Destinacije aranžmana" : "Package destinations"}
                </h2>
	                <p className="panel-muted">
	                  {language === "sr"
	                    ? "Izaberite konkretnu destinaciju, proverite cenu i nastavite ka upitu ili rezervaciji."
	                    : "Choose a concrete destination, review the price, and continue toward inquiry or booking."}
	                </p>
              </header>

              <article className="panel-glass overflow-hidden">
                <div className="grid gap-5">
                  <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)]">
                    {(selectedDestination.offerType ?? "own") === "subagency" ? (
                      getIframeSrc(selectedDestination.iframeUrl) ? (
                        <iframe
	                          src={getIframeSrc(selectedDestination.iframeUrl)}
	                          title={selectedDestination.title}
	                          className="h-[520px] min-h-[520px] w-full bg-white sm:h-[560px] sm:min-h-[560px]"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                        />
                      ) : (
	                        <div className="flex h-full min-h-[300px] items-center justify-center p-6 text-center text-sm text-muted">
	                          {language === "sr"
	                            ? "Link za prikaz ponude trenutno nije dostupan."
	                            : "The offer preview link is not available right now."}
	                        </div>
                      )
                    ) : selectedDestinationImages[0] ? (
                      <CmsImage
                        src={selectedDestinationImages[0]}
                        alt={selectedDestination.title}
                        className="h-full min-h-[300px] w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-muted">
                        {language === "sr" ? "Bez slike" : "No image"}
                      </div>
                    )}
                    <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/25 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
	                        {(selectedDestination.offerType ?? "own") === "subagency"
	                          ? language === "sr"
	                            ? "Partnerska ponuda"
	                            : "Partner offer"
	                          : language === "sr"
	                            ? "Naša ponuda"
                            : "Our offer"}
                      </span>
                      <span className="rounded-full border border-white/25 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {activeDestinations.findIndex(
                          (item) => item._id === selectedDestination._id,
                        ) + 1}{" "}
                        / {activeDestinations.length}
                      </span>
                    </div>
                  </div>

                  <div className="grid content-start gap-4">
                    <div>
                      <p className="metric-card__label">
	                        {(selectedDestination.offerType ?? "own") === "subagency"
	                          ? selectedDestination.partnerName ||
	                            (language === "sr" ? "Partnerska ponuda" : "Partner offer")
	                          : language === "sr"
                            ? "Naša ponuda"
                            : "Our offer"}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold leading-tight">
                        {selectedDestination.title}
                      </h3>
                      {selectedDestination.description ? (
                        <p className="mt-3 text-sm leading-6 text-muted">
                          {selectedDestination.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-2 text-sm text-muted">
                      {selectedDestination.departureCity ? (
                        <p className="flex items-center gap-2">
                          <FaLocationDot className="text-xs text-[var(--primary)]" />
                          {selectedDestination.departureCity}
                        </p>
                      ) : null}
                      {selectedDestination.durationLabel ? (
                        <p className="flex items-center gap-2">
                          <FaRoute className="text-xs text-[var(--primary)]" />
                          {selectedDestination.durationLabel}
                        </p>
                      ) : null}
                      {selectedDestination.departureDate ? (
                        <p className="flex items-center gap-2">
                          <FaCalendarDays className="text-xs text-[var(--primary)]" />
                          {formatShortDate(selectedDestination.departureDate)}
                          {selectedDestination.returnDate
                            ? ` - ${formatShortDate(selectedDestination.returnDate)}`
                            : ""}
                        </p>
                      ) : null}
                      {selectedDestination.partnerOfferCode ? (
                        <p className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-xs text-[var(--primary)]" />
                          {language === "sr" ? "Šifra ponude" : "Offer code"}:{" "}
                          {selectedDestination.partnerOfferCode}
                        </p>
                      ) : null}
                    </div>

                    {selectedDestination.contactNote ? (
                      <p className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs leading-5 text-muted">
                        {selectedDestination.contactNote}
                      </p>
                    ) : null}
                  </div>
                </div>

                {(selectedDestination.offerType ?? "own") !== "subagency" &&
                selectedDestinationImages.length > 1 ? (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {selectedDestinationImages.slice(1).map((url, index) => (
                      <CmsImage
                        key={url}
                        src={url}
                        alt={`${selectedDestination.title} ${index + 2}`}
                        className="h-24 w-auto shrink-0 rounded-xl border border-[var(--line)] object-cover"
                      />
                    ))}
                  </div>
                ) : null}
              </article>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {activeDestinations.map((item) => {
                  const active = item._id === selectedDestination._id;
                  const heroImage = item.imageUrls?.find(Boolean);
                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setSelectedDestinationId(item._id)}
                      className={`group rounded-2xl border p-3 text-left transition ${
                        active
                          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                          : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <div className="grid grid-cols-[4.5rem_1fr] gap-3">
                        <div className="h-16 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]">
                          {heroImage ? (
                            <CmsImage
                              src={heroImage}
                              alt={item.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
	                            <div className="flex h-full items-center justify-center text-[10px] text-muted">
	                              {(item.offerType ?? "own") === "subagency"
	                                ? language === "sr"
	                                  ? "prikaz"
	                                  : "preview"
	                                : language === "sr"
	                                  ? "bez slike"
                                  : "no image"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {item.title}
                          </p>
	                          <p className="mt-1 text-xs text-muted">
	                            {(item.offerType ?? "own") === "subagency"
	                              ? language === "sr"
	                                ? "Partnerska ponuda"
	                                : "Partner offer"
	                              : language === "sr"
                                ? "Naša ponuda"
                                : "Our offer"}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[var(--primary)]">
                            {formatPrice(item.price, item.currency)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {trip.itinerary.length > 0 ? (
            <section className="grid gap-3">
              <h2 className="text-2xl font-semibold">{t.itinerary}</h2>
              <div className="grid gap-3">
                {trip.itinerary.map((item, i) => (
                  <article key={i} className="panel-glass flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)]">
                      {item.day}
                    </div>
                    <div>
                      {item.date ? <p className="text-xs text-muted">{formatDate(item.date)}</p> : null}
                      <p className="text-sm leading-6">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {trip.included.length > 0 || trip.notIncluded.length > 0 ? (
            <section className="grid gap-4 sm:grid-cols-2">
              {trip.included.length > 0 ? (
                <article className="panel-glass">
                  <h3 className="text-lg font-semibold">{t.included}</h3>
                  <ul className="mt-3 grid gap-2">
                    {trip.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FaCheck className="mt-0.5 shrink-0 text-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {trip.notIncluded.length > 0 ? (
                <article className="panel-glass">
                  <h3 className="text-lg font-semibold">{t.notIncluded}</h3>
                  <ul className="mt-3 grid gap-2">
                    {trip.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
                        <FaXmark className="mt-0.5 shrink-0 text-red-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-30 lg:self-start">
          <div className="filter-shell">
            {activeDestinations.length > 0 && selectedDestination ? (
              <>
                <p className="metric-card__label">
                  {language === "sr" ? "Izabrana ponuda" : "Selected offer"}
                </p>
                <h2 className="mt-2 text-xl font-semibold leading-tight">
                  {selectedDestination.title}
                </h2>
                <p className="mt-3 text-3xl font-semibold text-[var(--primary)]">
                  {formatPrice(
                    selectedDestination.price,
                    selectedDestination.currency,
                  )}
                </p>
                <div className="mt-4 grid gap-2 text-sm text-muted">
                  <p className="inline-flex items-center gap-2">
                    <FaRoute className="text-xs text-[var(--primary)]" />
                    {activeDestinations.length}{" "}
                    {language === "sr" ? "ponuda u grupi" : "offers in group"}
                  </p>
                  {selectedDestination.departureCity ? (
                    <p className="inline-flex items-center gap-2">
                      <FaLocationDot className="text-xs text-[var(--primary)]" />
                      {selectedDestination.departureCity}
                    </p>
                  ) : null}
                  {selectedDestination.departureDate ? (
                    <p className="inline-flex items-center gap-2">
                      <FaCalendarDays className="text-xs text-[var(--primary)]" />
                      {formatShortDate(selectedDestination.departureDate)}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-2 border-t border-[var(--line)] pt-4">
                  {activeDestinations.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setSelectedDestinationId(item._id)}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                        item._id === selectedDestination._id
                          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                          : "border-[var(--line)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <span className="min-w-0 truncate">{item.title}</span>
                      <span className="shrink-0 font-semibold text-[var(--primary)]">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </button>
                  ))}
                </div>

                <AddToCartButton
                  id={selectedDestination._id}
                  type="destination"
                  title={`${selectedDestination.title} - ${trip.title}`}
                  price={selectedDestination.price}
                  currency={selectedDestination.currency}
                  imageUrl={selectedDestinationImages[0]}
                  meta={{
                    parentPackage: trip.title,
                    departureCity: selectedDestination.departureCity ?? "",
                    departureDate: selectedDestination.departureDate ?? "",
                  }}
                  className="mt-5 w-full !justify-center"
                />
                <Link href="/kontakt" className="btn-secondary mt-2 w-full !justify-center">
                  {destinationContactCta}
                  <FaArrowRight className="text-xs" />
                </Link>
                {(selectedDestination.offerType ?? "own") === "subagency" &&
                selectedDestination.externalUrl ? (
                  <a
                    href={selectedDestination.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary mt-2 w-full !justify-center"
                  >
                    {language === "sr" ? "Otvori ponudu" : "Open offer"}
                  </a>
                ) : null}
              </>
	            ) : (
	              <>
	                <p className="metric-card__label">
	                  {language === "sr" ? "Pregled aranžmana" : "Package overview"}
	                </p>
	                <h2 className="mt-2 text-xl font-semibold leading-tight">
	                  {trip.title}
	                </h2>
	                <p className="mt-3 text-sm text-muted">
	                  {trip.days} {t.days} | {trip.nights} {t.nights}
	                </p>

                <div className="mt-3 grid gap-2 text-sm">
                  <p className="inline-flex items-start gap-2">
                    <FaCalendarDays className="mt-0.5 text-muted" />
                    <span>
                      <span className="text-muted">{t.departure}: </span>
                      {formatDate(trip.departureDate)}
                    </span>
                  </p>
                  <p className="inline-flex items-start gap-2">
                    <FaLocationDot className="mt-0.5 text-muted" />
                    <span>
                      <span className="text-muted">{t.departureCity}: </span>
                      {trip.departureCity}
                    </span>
                  </p>
                </div>

                {trip.hotelInfo ? (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm">
                    <FaHotel className="text-muted" />
                    <span>{trip.hotelInfo}</span>
                  </p>
                ) : null}

                {trip.depositPercentage ? (
                  <p className="mt-3 inline-flex items-start gap-2 text-sm">
                    <FaMoneyBillWave className="mt-0.5 text-muted" />
                    <span>
                      {t.deposit}: {trip.depositPercentage}%
                      {trip.depositDeadline ? ` (${t.depositDeadline}: ${formatDate(trip.depositDeadline)})` : ""}
                    </span>
                  </p>
                ) : null}

                {activeAccommodations.length > 0 ? (
                  <div className="mt-4 border-t border-[var(--line)] pt-3">
                    <p className="metric-card__label">{acc.title}</p>
                    <div className="mt-2 grid gap-2">
                      {activeAccommodations.slice(0, 3).map((item) => {
                        const AccIcon = accommodationIcons[item.type];
                        return (
                          <div key={item._id} className="flex items-center justify-between gap-2 text-sm">
                            <span className="flex min-w-0 items-center gap-1.5 truncate">
                              <AccIcon className="shrink-0 text-xs text-muted" />
                              <span className="truncate">{item.name}</span>
                            </span>
                            <span className="shrink-0 font-medium text-[var(--primary)]">
                              {formatPrice(item.pricePerPerson, item.currency)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

	                <Link href="/kontakt" className="btn-primary mt-5 w-full !justify-center">
	                  {t.contactCta}
	                </Link>
              </>
            )}
          </div>
        </aside>
      </div>
    </AlienShell>
  );
}





