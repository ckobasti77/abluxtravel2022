"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaBus,
  FaPlane,
  FaCar,
  FaTrain,
  FaCheck,
  FaXmark,
  FaArrowLeft,
  FaCalendarDays,
  FaLocationDot,
  FaHotel,
  FaMoneyBillWave,
} from "react-icons/fa6";
import AlienShell from "../../../components/alien-shell";
import { useSitePreferences } from "../../../components/site-preferences-provider";
import { useTripBySlug, TransportType } from "../../../lib/use-trips";

const transportIcons: Record<TransportType, typeof FaBus> = {
  bus: FaBus,
  plane: FaPlane,
  car: FaCar,
  train: FaTrain,
};

export default function TripDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { dictionary, language } = useSitePreferences();
  const trip = useTripBySlug(slug);
  const t = dictionary.tripDetail;
  const locale = language === "sr" ? "sr-RS" : "en-US";

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
            <Link href="/kontakt" className="btn-primary mt-5 w-full !justify-center">
              {t.contactCta}
            </Link>
          </div>
        </aside>
      </div>
    </AlienShell>
  );
}

