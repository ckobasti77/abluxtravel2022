"use client";

import CmsImage from "@/components/cms-image";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
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
  const activeDestinations = destinations.filter((item) => item.isActive);
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

      {trip.imageUrls.length > 0 ? (
        <section className="panel-glass overflow-hidden">
          <div className="flex snap-x gap-3 overflow-x-auto pb-2">
            {trip.imageUrls.filter(Boolean).map((url, i) => (
              <CmsImage
                key={i}
                src={url}
                alt={`${trip.title} ${i + 1}`}
                className="h-56 w-auto shrink-0 snap-center rounded-xl border border-[var(--line)] object-cover sm:h-72"
              />
            ))}
          </div>
        </section>
      ) : null}

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

          {activeDestinations.length > 0 ? (
            <section className="grid gap-4">
              <header className="grid gap-1">
                <h2 className="text-2xl font-semibold">
                  {language === "sr" ? "Destinacije u ovom putovanju" : "Destinations in this trip"}
                </h2>
                <p className="panel-muted">
                  {language === "sr"
                    ? "Izaberite destinaciju i pogledajte osnovne informacije i cenu."
                    : "Browse destinations with key details and pricing."}
                </p>
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                {activeDestinations.map((item) => {
                  const heroImage = item.imageUrls?.find(Boolean);
                  return (
                    <article key={item._id} className="panel-glass overflow-hidden">
                      <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]">
                        {heroImage ? (
                          <CmsImage
                            src={heroImage}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-muted">
                            {language === "sr" ? "Bez slike" : "No image"}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 grid gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <span className="shrink-0 text-base font-semibold text-[var(--primary)]">
                            {formatPrice(item.price, item.currency)}
                          </span>
                        </div>
                        {item.description ? (
                          <p className="text-sm leading-6 text-muted">{item.description}</p>
                        ) : null}
                      </div>
                    </article>
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
            <p className="text-3xl font-semibold text-[var(--primary)]">{formatPrice(trip.price, trip.currency)}</p>
            <p className="mt-1 text-sm text-muted">
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

            <AddToCartButton
              id={trip._id}
              type="trip"
              title={trip.title}
              price={trip.price}
              currency={trip.currency}
              imageUrl={trip.imageUrls?.[0]}
              meta={{ departureCity: trip.departureCity, departureDate: trip.departureDate }}
              className="mt-5 w-full !justify-center"
            />
            <Link href="/kontakt" className="btn-secondary mt-2 w-full !justify-center">
              {t.contactCta}
            </Link>
          </div>
        </aside>
      </div>
    </AlienShell>
  );
}





