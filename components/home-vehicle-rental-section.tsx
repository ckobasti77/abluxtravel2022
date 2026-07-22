"use client";

import CmsImage from "@/components/cms-image";
import Link from "next/link";
import { useMemo, type CSSProperties } from "react";
import { useQuery } from "convex/react";
import { FaArrowRight, FaBus, FaVanShuttle } from "react-icons/fa6";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import {
  VEHICLE_RENTAL_ITEMS,
  VEHICLE_RENTAL_PATH,
  type VehicleRentalKey,
} from "../lib/vehicle-rentals";
import { useSitePreferences } from "./site-preferences-provider";

type VehicleRentalImageRecord = {
  key: VehicleRentalKey;
  storageId: Id<"_storage"> | null;
  imageUrl: string | null;
  updatedAt: number | null;
};

const iconByKey: Record<VehicleRentalKey, typeof FaBus> = {
  bus: FaBus,
  luxuryVan: FaVanShuttle,
};

export default function HomeVehicleRentalSection() {
  const { language } = useSitePreferences();
  const records = useQuery(api.vehicleRentalImages.list) as
    | VehicleRentalImageRecord[]
    | undefined;

  const imagesByKey = useMemo(
    () => new Map((records ?? []).map((record) => [record.key, record.imageUrl])),
    [records]
  );

  return (
    <section className="section-holo mt-10 overflow-hidden p-5 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr] xl:items-end">
        <div>
          <span className="pill">
            {language === "sr" ? "Nova usluga" : "New service"}
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            {language === "sr"
              ? "Iznajmljivanje vozila sa vozačem"
              : "Vehicle rental with driver"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            {language === "sr"
              ? "Organizovan prevoz za grupe, poslovne goste, transfere i posebne prilike, uz jasnu komunikaciju i profesionalnog vozača."
              : "Organized transport for groups, business guests, transfers, and special occasions with clear coordination and a professional driver."}
          </p>
          <Link href={VEHICLE_RENTAL_PATH} className="btn-primary mt-5">
            {language === "sr" ? "Pogledaj vozila" : "View vehicles"}
            <FaArrowRight className="text-xs" aria-hidden />
          </Link>
        </div>

        <div className="stagger-grid grid gap-4 md:grid-cols-2">
          {VEHICLE_RENTAL_ITEMS.map((item, index) => {
            const title = language === "sr" ? item.shortTitle.sr : item.shortTitle.en;
            const eyebrow = language === "sr" ? item.eyebrow.sr : item.eyebrow.en;
            const imageUrl = imagesByKey.get(item.key);
            const Icon = iconByKey[item.key];

            return (
              <Link
                key={item.key}
                href={VEHICLE_RENTAL_PATH}
                className="group fx-lift overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]"
                style={
                  {
                    "--stagger-index": index,
                    "--vehicle-accent": item.accent,
                  } as CSSProperties
                }
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-[var(--bg-soft)]">
                  {imageUrl ? (
                    <CmsImage
                      src={imageUrl}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--primary-soft),var(--surface))] text-5xl text-[var(--primary)]">
                      <Icon aria-hidden />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/75">
                      {eyebrow}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold leading-tight">
                      {title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
