"use client";

import CmsImage from "@/components/cms-image";
import Link from "next/link";
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { useQuery } from "convex/react";
import {
  FaArrowRight,
  FaBus,
  FaCalendarCheck,
  FaCheck,
  FaPhone,
  FaRoute,
  FaShieldHalved,
  FaVanShuttle,
} from "react-icons/fa6";
import AlienShell from "../../components/alien-shell";
import ImageLightbox, {
  type LightboxImage,
} from "../../components/image-lightbox";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  VEHICLE_RENTAL_ITEMS,
  type VehicleRentalKey,
} from "../../lib/vehicle-rentals";

type VehicleRentalImageRecord = {
  key: VehicleRentalKey;
  storageId: Id<"_storage"> | null;
  imageUrl: string | null;
  additionalStorageIds: Id<"_storage">[];
  additionalImageUrls: (string | null)[];
  updatedAt: number | null;
};

const iconByKey: Record<VehicleRentalKey, typeof FaBus> = {
  bus: FaBus,
  luxuryVan: FaVanShuttle,
};

export default function IznajmljivanjeVozilaPage() {
  const { language } = useSitePreferences();
  const [lightboxState, setLightboxState] = useState<{
    key: VehicleRentalKey;
    index: number;
  } | null>(null);
  const records = useQuery(api.vehicleRentalImages.list) as
    | VehicleRentalImageRecord[]
    | undefined;
  const recordsByKey = useMemo(
    () => new Map((records ?? []).map((record) => [record.key, record])),
    [records]
  );

  const copy =
    language === "sr"
      ? {
          badge: "Iznajmljivanje vozila",
          title: "Pouzdan prevoz sa profesionalnim vozačem",
          description:
            "Za grupna putovanja, poslovne transfere i privatne polaske organizujemo vozilo, vozača i rutu tako da put bude miran, tačan i udoban.",
          primaryCta: "Pošalji upit",
          secondaryCta: "Pozovi agenciju",
          processTitle: "Kako funkcioniše rezervacija",
          processItems: [
            "Pošaljite datum, relaciju, broj putnika i očekivano trajanje puta.",
            "Pripremamo predlog vozila, okvir rute i uslove najma.",
            "Nakon potvrde, vozač i vozilo se organizuju prema dogovorenom planu.",
          ],
          bestFor: "Najbolje za",
          capacity: "Kapacitet",
          included: "Usluga uključuje",
          gallery: "Dodatne slike",
          openImage: "Uvećaj sliku",
          closeImage: "Zatvori prikaz slike",
          previousImage: "Prethodna slika",
          nextImage: "Sledeća slika",
          contactTitle: "Trebate autobus ili luksuzni kombi?",
          contactCopy:
            "Pošaljite osnovne detalje puta i dobićete konkretan predlog za najam sa vozačem.",
        }
      : {
          badge: "Vehicle rental",
          title: "Reliable transport with a professional driver",
          description:
            "For group trips, business transfers, and private departures, we coordinate the vehicle, driver, and route so the journey stays calm, punctual, and comfortable.",
          primaryCta: "Send inquiry",
          secondaryCta: "Call agency",
          processTitle: "How booking works",
          processItems: [
            "Send the date, route, number of passengers, and expected trip duration.",
            "We prepare a vehicle proposal, route outline, and rental terms.",
            "After confirmation, the driver and vehicle are arranged according to plan.",
          ],
          bestFor: "Best for",
          capacity: "Capacity",
          included: "Service includes",
          gallery: "Gallery",
          openImage: "Open image",
          closeImage: "Close image viewer",
          previousImage: "Previous image",
          nextImage: "Next image",
          contactTitle: "Need a coach or luxury van?",
          contactCopy:
            "Send the basic trip details and you will receive a concrete rental proposal with driver.",
        };

  const imageGroupsByKey = useMemo(() => {
    const groups = new Map<VehicleRentalKey, LightboxImage[]>();

    VEHICLE_RENTAL_ITEMS.forEach((item) => {
      const title = language === "sr" ? item.title.sr : item.title.en;
      const record = recordsByKey.get(item.key);
      const urls = [
        record?.imageUrl ?? null,
        ...(record?.additionalImageUrls ?? []),
      ].filter((url): url is string => Boolean(url));

      groups.set(
        item.key,
        urls.map((url, imageIndex) => ({
          src: url,
          alt:
            imageIndex === 0
              ? title
              : `${title} ${copy.gallery} ${imageIndex}`,
        }))
      );
    });

    return groups;
  }, [copy.gallery, language, recordsByKey]);

  const activeLightboxImages = lightboxState
    ? (imageGroupsByKey.get(lightboxState.key) ?? [])
    : [];
  const setActiveLightboxIndex = useCallback((nextIndex: number | null) => {
    if (nextIndex === null) {
      setLightboxState(null);
      return;
    }

    setLightboxState((current) =>
      current ? { ...current, index: nextIndex } : current
    );
  }, []);

  return (
    <AlienShell className="site-fade page-stack">
      <section className="page-hero">
        <span className="pill">{copy.badge}</span>
        <h1 className="page-title">{copy.title}</h1>
        <p className="page-subtitle">{copy.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/kontakt" className="btn-primary">
            {copy.primaryCta}
            <FaArrowRight className="text-xs" aria-hidden />
          </Link>
          <Link href="/kontakt" className="btn-secondary">
            <FaPhone className="text-xs" aria-hidden />
            {copy.secondaryCta}
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {VEHICLE_RENTAL_ITEMS.map((item, index) => {
          const title = language === "sr" ? item.title.sr : item.title.en;
          const eyebrow = language === "sr" ? item.eyebrow.sr : item.eyebrow.en;
          const description =
            language === "sr" ? item.description.sr : item.description.en;
          const bestFor = language === "sr" ? item.bestFor.sr : item.bestFor.en;
          const capacity = language === "sr" ? item.capacity.sr : item.capacity.en;
          const record = recordsByKey.get(item.key);
          const imageUrl = record?.imageUrl;
          const galleryImages = (record?.additionalImageUrls ?? []).filter(
            (url): url is string => Boolean(url)
          );
          const Icon = iconByKey[item.key];

          return (
            <article
              key={item.key}
              className="panel-glass fx-lift overflow-hidden"
              style={{ "--stagger-index": index } as CSSProperties}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)]">
                {imageUrl ? (
                  <button
                    type="button"
                    className="h-full w-full cursor-zoom-in text-left"
                    aria-label={`${copy.openImage}: ${title}`}
                    onClick={() => setLightboxState({ key: item.key, index: 0 })}
                  >
                    <CmsImage
                      src={imageUrl}
                      alt={title}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </button>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--primary-soft),var(--surface))] text-6xl text-[var(--primary)]">
                    <Icon aria-hidden />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/75">
                    {eyebrow}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">
                    {title}
                  </h2>
                </div>
              </div>

              {galleryImages.length ? (
                <div className="mt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {copy.gallery}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {galleryImages.map((galleryImageUrl, galleryIndex) => (
                      <button
                        key={`${item.key}-${galleryIndex}-${galleryImageUrl}`}
                        type="button"
                        className="relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]"
                        aria-label={`${copy.openImage}: ${title} ${galleryIndex + 1}`}
                        onClick={() =>
                          setLightboxState({
                            key: item.key,
                            index: imageUrl ? galleryIndex + 1 : galleryIndex,
                          })
                        }
                      >
                        <CmsImage
                          src={galleryImageUrl}
                          alt={`${title} ${copy.gallery} ${galleryIndex + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 grid gap-5">
                <p className="text-sm leading-7 text-muted sm:text-base">
                  {description}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      <FaRoute aria-hidden />
                      {copy.bestFor}
                    </p>
                    <p className="mt-2 text-sm leading-6">{bestFor}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      <FaShieldHalved aria-hidden />
                      {copy.capacity}
                    </p>
                    <p className="mt-2 text-sm leading-6">{capacity}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {copy.included}
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight.sr}
                        className="flex gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm leading-6"
                      >
                        <FaCheck
                          className="mt-1 shrink-0 text-[var(--primary)]"
                          aria-hidden
                        />
                        <span>
                          {language === "sr" ? highlight.sr : highlight.en}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="section-holo p-6 sm:p-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <FaCalendarCheck aria-hidden />
              {language === "sr" ? "Upit za najam" : "Rental inquiry"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              {copy.contactTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
              {copy.contactCopy}
            </p>
          </div>
          <Link href="/kontakt" className="btn-primary">
            {copy.primaryCta}
            <FaArrowRight className="text-xs" aria-hidden />
          </Link>
        </div>
      </section>
      <ImageLightbox
        images={activeLightboxImages}
        activeIndex={lightboxState?.index ?? null}
        closeLabel={copy.closeImage}
        previousLabel={copy.previousImage}
        nextLabel={copy.nextImage}
        onActiveIndexChange={setActiveLightboxIndex}
      />
    </AlienShell>
  );
}
