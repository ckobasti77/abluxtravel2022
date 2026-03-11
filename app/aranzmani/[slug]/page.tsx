"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaBus,
  FaPlane,
  FaCar,
  FaTrain,
  FaUser,
  FaCheck,
  FaXmark,
  FaArrowLeft,
  FaCalendarDays,
  FaLocationDot,
  FaHotel,
  FaMoneyBillWave,
  FaHouse,
  FaBuilding,
  FaDoorOpen,
  FaBed,
  FaEllipsis,
  FaUsers,
  FaUtensils,
  FaClock,
  FaWifi,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";
import AlienShell from "../../../components/alien-shell";
import { useSitePreferences } from "../../../components/site-preferences-provider";
import { useTripBySlug, TransportType } from "../../../lib/use-trips";
import {
  useAccommodationsByTrip,
  AccommodationType,
  Accommodation,
} from "../../../lib/use-accommodations";

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

  const [expandedAcc, setExpandedAcc] = useState<string | null>(null);

  if (trip === undefined) {
    return (
      <AlienShell className="site-fade">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="surface animate-pulse rounded-2xl px-8 py-6 text-muted">
            {language === "sr" ? "Ucitavanje..." : "Loading..."}
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
          <p className="text-muted">
            {language === "sr" ? "Aranzman nije pronadjen." : "Trip not found."}
          </p>
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
    <AlienShell className="site-fade">
      <Link
        href="/aranzmani"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-[var(--primary)]"
      >
        <FaArrowLeft className="text-xs" />
        {t.back}
      </Link>

      {trip.imageUrls.length > 0 ? (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {trip.imageUrls.filter(Boolean).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${trip.title} ${i + 1}`}
              className="h-64 w-auto shrink-0 rounded-2xl border border-[var(--line)] object-cover sm:h-80"
            />
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{trip.title}</h1>
            <p className="mt-3 text-base leading-7 text-muted">{trip.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="surface flex items-center gap-3 rounded-xl p-3">
              <TransportIcon className="text-lg text-[var(--primary)]" />
              <div>
                <p className="text-xs text-muted">{t.transport}</p>
                <p className="text-sm font-semibold">{t[trip.transport]}</p>
              </div>
            </div>
            <div className="surface flex items-center gap-3 rounded-xl p-3">
              <FaCalendarDays className="text-lg text-[var(--primary)]" />
              <div>
                <p className="text-xs text-muted">{t.departure}</p>
                <p className="text-sm font-semibold">{formatDate(trip.departureDate)}</p>
              </div>
            </div>
            <div className="surface flex items-center gap-3 rounded-xl p-3">
              <FaLocationDot className="text-lg text-[var(--primary)]" />
              <div>
                <p className="text-xs text-muted">{t.departureCity}</p>
                <p className="text-sm font-semibold">{trip.departureCity}</p>
              </div>
            </div>
          </div>

          {/* Accommodation Section */}
          {activeAccommodations.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">{acc.title}</h2>
              <p className="mt-1 text-sm text-muted">{acc.subtitle}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {activeAccommodations.map((item) => {
                  const AccIcon = accommodationIcons[item.type];
                  const isExpanded = expandedAcc === item._id;
                  const heroImg = item.imageUrls?.[0];

                  return (
                    <div
                      key={item._id}
                      className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--primary)]/30"
                    >
                      {/* Hero image */}
                      {heroImg && (
                        <div className="relative h-40 w-full overflow-hidden bg-[var(--bg-soft)]">
                          <img
                            src={heroImg}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <AccIcon className="text-[10px]" />
                            {acc[item.type]}
                          </div>
                        </div>
                      )}

                      <div className="p-4">
                        {/* Name & type (when no image) */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {!heroImg && (
                              <div className="mb-2 flex items-center gap-1.5 text-xs text-muted">
                                <AccIcon />
                                {acc[item.type]}
                              </div>
                            )}
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-[var(--primary)]">
                              {formatPrice(item.pricePerPerson, item.currency)}
                            </p>
                            <p className="text-[11px] text-muted">{acc.perPerson}</p>
                          </div>
                        </div>

                        {/* Quick info row */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <FaUsers className="text-[10px]" />
                            {acc.upTo} {item.capacity} {acc.guests}
                          </span>
                          {item.boardType && (
                            <span className="flex items-center gap-1">
                              <FaUtensils className="text-[10px]" />
                              {acc[item.boardType]}
                            </span>
                          )}
                          {item.distanceToCenter && (
                            <span className="flex items-center gap-1">
                              <FaLocationDot className="text-[10px]" />
                              {item.distanceToCenter}
                            </span>
                          )}
                        </div>

                        {/* Amenities chips */}
                        {item.amenities.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.amenities.slice(0, isExpanded ? undefined : 4).map((a, i) => (
                              <span
                                key={i}
                                className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-2 py-0.5 text-[11px]"
                              >
                                {a}
                              </span>
                            ))}
                            {!isExpanded && item.amenities.length > 4 && (
                              <span className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-2 py-0.5 text-[11px] text-muted">
                                +{item.amenities.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Expand / collapse button */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedAcc(isExpanded ? null : item._id)
                          }
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--line)] py-2 text-xs font-medium text-muted transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        >
                          {isExpanded
                            ? language === "sr"
                              ? "Sakrij detalje"
                              : "Hide details"
                            : acc.viewDetails}
                          {isExpanded ? (
                            <FaChevronUp className="text-[10px]" />
                          ) : (
                            <FaChevronDown className="text-[10px]" />
                          )}
                        </button>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-3 space-y-3 border-t border-[var(--line)] pt-3">
                            {item.description && (
                              <p className="text-sm leading-6 text-muted">
                                {item.description}
                              </p>
                            )}

                            {/* Extra images */}
                            {item.imageUrls.filter(Boolean).length > 1 && (
                              <div className="flex gap-2 overflow-x-auto pb-1">
                                {item.imageUrls
                                  .filter(Boolean)
                                  .slice(1)
                                  .map((url, i) => (
                                    <img
                                      key={i}
                                      src={url}
                                      alt={`${item.name} ${i + 2}`}
                                      className="h-24 w-auto shrink-0 rounded-xl border border-[var(--line)] object-cover"
                                    />
                                  ))}
                              </div>
                            )}

                            <div className="grid gap-2 text-sm sm:grid-cols-2">
                              {item.roomInfo && (
                                <div className="flex items-center gap-2">
                                  <FaDoorOpen className="shrink-0 text-xs text-[var(--primary)]" />
                                  <span>{item.roomInfo}</span>
                                </div>
                              )}
                              {item.checkIn && (
                                <div className="flex items-center gap-2">
                                  <FaClock className="shrink-0 text-xs text-[var(--primary)]" />
                                  <span>Check-in: {item.checkIn}</span>
                                </div>
                              )}
                              {item.checkOut && (
                                <div className="flex items-center gap-2">
                                  <FaClock className="shrink-0 text-xs text-[var(--primary)]" />
                                  <span>Check-out: {item.checkOut}</span>
                                </div>
                              )}
                              {item.distanceToCenter && (
                                <div className="flex items-center gap-2">
                                  <FaLocationDot className="shrink-0 text-xs text-[var(--primary)]" />
                                  <span>{item.distanceToCenter}</span>
                                </div>
                              )}
                            </div>

                            {/* All amenities when expanded */}
                            {item.amenities.length > 4 && (
                              <div className="flex flex-wrap gap-1.5">
                                {item.amenities.map((a, i) => (
                                  <span
                                    key={i}
                                    className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-2 py-0.5 text-[11px]"
                                  >
                                    {a}
                                  </span>
                                ))}
                              </div>
                            )}

                            <Link
                              href="/kontakt"
                              className="btn-primary mt-2 w-full !justify-center text-sm"
                            >
                              {t.contactCta}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {trip.itinerary.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold">{t.itinerary}</h2>
              <div className="mt-4 space-y-3">
                {trip.itinerary.map((item, i) => (
                  <div
                    key={i}
                    className="surface flex gap-4 rounded-xl p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)]">
                      {item.day}
                    </div>
                    <div>
                      {item.date ? (
                        <p className="text-xs text-muted">{formatDate(item.date)}</p>
                      ) : null}
                      <p className="text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {(trip.included.length > 0 || trip.notIncluded.length > 0) ? (
            <section className="grid gap-6 sm:grid-cols-2">
              {trip.included.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold">{t.included}</h3>
                  <ul className="mt-3 space-y-2">
                    {trip.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FaCheck className="mt-0.5 shrink-0 text-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {trip.notIncluded.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold">{t.notIncluded}</h3>
                  <ul className="mt-3 space-y-2">
                    {trip.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
                        <FaXmark className="mt-0.5 shrink-0 text-red-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="section-holo rounded-2xl p-5">
            <p className="text-3xl font-semibold text-[var(--primary)]">
              {formatPrice(trip.price, trip.currency)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {trip.days} {t.days} | {trip.nights} {t.nights}
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="text-muted">{t.departure}:</span>{" "}
                {formatDate(trip.departureDate)}
              </p>
              <p>
                <span className="text-muted">{t.returnLabel}:</span>{" "}
                {formatDate(trip.returnDate)}
              </p>
            </div>
            {trip.hotelInfo ? (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <FaHotel className="text-muted" />
                <span>{trip.hotelInfo}</span>
              </div>
            ) : null}
            {trip.depositPercentage ? (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <FaMoneyBillWave className="text-muted" />
                <span>
                  {t.deposit}: {trip.depositPercentage}%
                  {trip.depositDeadline
                    ? ` (${t.depositDeadline}: ${formatDate(trip.depositDeadline)})`
                    : ""}
                </span>
              </div>
            ) : null}

            {/* Quick accommodation summary in sidebar */}
            {activeAccommodations.length > 0 && (
              <div className="mt-4 border-t border-[var(--line)] pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  {acc.title}
                </p>
                <div className="space-y-2">
                  {activeAccommodations.slice(0, 3).map((item) => {
                    const AccIcon = accommodationIcons[item.type];
                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <AccIcon className="shrink-0 text-xs text-muted" />
                          <span className="truncate">{item.name}</span>
                        </span>
                        <span className="shrink-0 font-medium text-[var(--primary)]">
                          {formatPrice(item.pricePerPerson, item.currency)}
                        </span>
                      </div>
                    );
                  })}
                  {activeAccommodations.length > 3 && (
                    <p className="text-xs text-muted">
                      +{activeAccommodations.length - 3}{" "}
                      {language === "sr" ? "još opcija" : "more options"}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Link href="/kontakt" className="btn-primary mt-5 w-full !justify-center">
              {t.contactCta}
            </Link>
          </div>
        </aside>
      </div>
    </AlienShell>
  );
}
