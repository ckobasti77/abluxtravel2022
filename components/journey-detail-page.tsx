"use client";

import CmsImage from "@/components/cms-image";
import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBus,
  FaCalendarDays,
  FaCar,
  FaCheck,
  FaLocationDot,
  FaMoneyBillWave,
  FaPlane,
  FaRoute,
  FaTrain,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import AddToCartButton from "./add-to-cart-button";
import AlienShell from "./alien-shell";
import { useSitePreferences } from "./site-preferences-provider";
import { useDestinationsByPage } from "../lib/use-destinations";
import type { TransportType, Trip } from "../lib/use-trips";

const transportIcons: Record<TransportType, typeof FaBus> = {
  bus: FaBus,
  plane: FaPlane,
  car: FaCar,
  train: FaTrain,
  self: FaUser,
};

const getIframeSrc = (value: string | undefined) => {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  return srcMatch?.[1] ?? trimmed;
};

export default function JourneyDetailPage({ journey }: { journey: Trip }) {
  const { dictionary, language } = useSitePreferences();
  const destinations = useDestinationsByPage(journey.slug);
  const activeDestinations = useMemo(
    () => destinations.filter((item) => item.isActive),
    [destinations],
  );
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(
    null,
  );
  const selectedDestination = useMemo(() => {
    if (activeDestinations.length === 0) return null;
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
    const media = journey.detailMedia?.filter((item) => item.url) ?? [];
    if (media.length > 0) return media;
    return journey.imageUrls
      .filter(Boolean)
      .map((url) => ({ url, mediaType: "image" as const }));
  }, [journey.detailMedia, journey.imageUrls]);

  const t = dictionary.tripDetail;
  const locale = language === "sr" ? "sr-RS" : "en-US";
  const TransportIcon = transportIcons[journey.transport];

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (iso: string | undefined) => {
    if (!iso) return "";
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
  };
  const destinationContactCta =
    language === "sr"
      ? "Pošalji upit za ovu destinaciju"
      : "Send inquiry for this destination";

  return (
    <AlienShell className="site-fade page-stack">
      <section className="page-hero">
        <Link
          href="/putovanja"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted transition hover:text-[var(--primary)]"
        >
          <FaArrowLeft className="text-xs" />
          {language === "sr" ? "Nazad na putovanja" : "Back to trips"}
        </Link>
        <h1 className="page-title">{journey.title}</h1>
        <p className="page-subtitle">{journey.description}</p>
      </section>

      {detailMediaItems.length > 0 ? (
        <section className="panel-glass overflow-hidden">
          <div className="flex snap-x gap-3 overflow-x-auto pb-2">
            {detailMediaItems.map((media, index) =>
              media.mediaType === "video" ? (
                <video
                  key={`${media.url}-${index}`}
                  src={media.url}
                  className="h-56 w-auto shrink-0 snap-center rounded-xl border border-[var(--line)] object-cover sm:h-72"
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <CmsImage
                  key={`${media.url}-${index}`}
                  src={media.url}
                  alt={`${journey.title} ${index + 1}`}
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
              {language === "sr"
                ? "Destinacije u putovanju"
                : "Destinations in this trip"}
            </h2>
            <p className="panel-muted">
              {language === "sr"
                ? "Izaberite konkretnu destinaciju, proverite cenu i nastavite ka upitu ili rezervaciji."
                : "Choose a concrete destination, review the price, and continue toward inquiry or booking."}
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
              {t[journey.transport]}
            </p>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">{t.departure}</p>
            <p className="metric-card__value">{formatDate(journey.departureDate) || "-"}</p>
          </article>
          <article className="metric-card">
            <p className="metric-card__label">{t.departureCity}</p>
            <p className="metric-card__value">{journey.departureCity || "-"}</p>
          </article>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          {selectedDestination ? (
            <section className="grid gap-4">
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
                        <div className="flex h-full min-h-[300px] items-center justify-center p-6 text-center text-muted">
                          {language === "sr"
                            ? "Partnerski prikaz nije dostupan."
                            : "Partner preview is not available."}
                        </div>
                      )
                    ) : selectedDestinationImages[0] ? (
                      <CmsImage
                        src={selectedDestinationImages[0]}
                        alt={selectedDestination.title}
                        className="h-full min-h-[300px] w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,#173b71,#155eef)]" />
                    )}
                  </div>

                  <div className="grid content-start gap-4">
                    <div>
                      {(selectedDestination.offerType ?? "own") === "subagency" &&
                      !selectedDestination.partnerName ? null : (
                        <p className="metric-card__label">
                          {(selectedDestination.offerType ?? "own") === "subagency"
                            ? selectedDestination.partnerName
                            : language === "sr"
                              ? "Naša ponuda"
                              : "Our offer"}
                        </p>
                      )}
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
                          {formatDate(selectedDestination.departureDate)}
                          {selectedDestination.returnDate
                            ? ` - ${formatDate(selectedDestination.returnDate)}`
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
            </section>
          ) : null}

          {journey.itinerary.length > 0 ? (
            <section className="grid gap-3">
              <h2 className="text-2xl font-semibold">{t.itinerary}</h2>
              <div className="grid gap-3">
                {journey.itinerary.map((item, index) => (
                  <article key={index} className="panel-glass flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)]">
                      {item.day}
                    </div>
                    <div>
                      {item.date ? (
                        <p className="text-xs text-muted">{formatDate(item.date)}</p>
                      ) : null}
                      <p className="text-sm leading-6">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {journey.included.length > 0 || journey.notIncluded.length > 0 ? (
            <section className="grid gap-4 sm:grid-cols-2">
              {journey.included.length > 0 ? (
                <article className="panel-glass">
                  <h3 className="text-lg font-semibold">{t.included}</h3>
                  <ul className="mt-3 grid gap-2">
                    {journey.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <FaCheck className="mt-0.5 shrink-0 text-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}
              {journey.notIncluded.length > 0 ? (
                <article className="panel-glass">
                  <h3 className="text-lg font-semibold">{t.notIncluded}</h3>
                  <ul className="mt-3 grid gap-2">
                    {journey.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted">
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
            <p className="metric-card__label">
              {language === "sr" ? "Pregled putovanja" : "Trip overview"}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-tight">
              {selectedDestination?.title ?? journey.title}
            </h2>
            {selectedDestination ? (
              <p className="mt-3 text-3xl font-semibold text-[var(--primary)]">
                {formatPrice(selectedDestination.price, selectedDestination.currency)}
              </p>
            ) : null}

            <div className="mt-4 grid gap-2 text-sm text-muted">
              <p className="inline-flex items-center gap-2">
                <FaRoute className="text-xs text-[var(--primary)]" />
                {activeDestinations.length}{" "}
                {language === "sr" ? "destinacija" : "destinations"}
              </p>
              {journey.departureCity ? (
                <p className="inline-flex items-center gap-2">
                  <FaLocationDot className="text-xs text-[var(--primary)]" />
                  {journey.departureCity}
                </p>
              ) : null}
              {journey.departureDate ? (
                <p className="inline-flex items-center gap-2">
                  <FaCalendarDays className="text-xs text-[var(--primary)]" />
                  {formatDate(journey.departureDate)}
                </p>
              ) : null}
            </div>

            {activeDestinations.length > 0 ? (
              <div className="mt-4 grid gap-2 border-t border-[var(--line)] pt-4">
                {activeDestinations.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setSelectedDestinationId(item._id)}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                      item._id === selectedDestination?._id
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
            ) : null}

            {selectedDestination ? (
              <>
                <AddToCartButton
                  id={selectedDestination._id}
                  type="destination"
                  title={`${selectedDestination.title} - ${journey.title}`}
                  price={selectedDestination.price}
                  currency={selectedDestination.currency}
                  imageUrl={selectedDestinationImages[0]}
                  meta={{
                    parentPackage: journey.title,
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
              <Link href="/kontakt" className="btn-primary mt-5 w-full !justify-center">
                {t.contactCta}
              </Link>
            )}
          </div>
        </aside>
      </div>
    </AlienShell>
  );
}
