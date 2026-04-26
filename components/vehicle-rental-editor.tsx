"use client";

import CmsImage from "@/components/cms-image";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  FaBus,
  FaCloudArrowUp,
  FaFloppyDisk,
  FaTrash,
  FaVanShuttle,
} from "react-icons/fa6";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import {
  VEHICLE_RENTAL_ITEMS,
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

const isAllowedImage = (file: File) =>
  file.type.startsWith("image/") ||
  /\.(avif|jpe?g|png|webp)$/i.test(file.name);

export default function VehicleRentalEditor() {
  const { language } = useSitePreferences();
  const records = useQuery(api.vehicleRentalImages.list) as
    | VehicleRentalImageRecord[]
    | undefined;
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const upsertImage = useMutation(api.vehicleRentalImages.upsert);
  const removeImage = useMutation(api.vehicleRentalImages.remove);

  const [files, setFiles] = useState<Partial<Record<VehicleRentalKey, File>>>(
    {}
  );
  const [previews, setPreviews] = useState<
    Partial<Record<VehicleRentalKey, string>>
  >({});
  const previewsRef = useRef(previews);
  const [savingKey, setSavingKey] = useState<VehicleRentalKey | null>(null);
  const [status, setStatus] = useState<
    Partial<Record<VehicleRentalKey, string>>
  >({});

  const recordsByKey = useMemo(
    () => new Map((records ?? []).map((record) => [record.key, record])),
    [records]
  );

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((preview) => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  const clearPreview = (key: VehicleRentalKey) => {
    setPreviews((current) => {
      const preview = current[key];
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const setItemStatus = (key: VehicleRentalKey, message: string) => {
    setStatus((current) => ({ ...current, [key]: message }));
  };

  const selectImage = (
    key: VehicleRentalKey,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    clearPreview(key);

    if (!file) {
      setFiles((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
      return;
    }

    if (!isAllowedImage(file)) {
      setItemStatus(
        key,
        language === "sr"
          ? "Dozvoljene su samo slike: JPG, PNG, WEBP i AVIF."
          : "Allowed image files: JPG, PNG, WEBP, and AVIF."
      );
      return;
    }

    setFiles((current) => ({ ...current, [key]: file }));
    setPreviews((current) => ({
      ...current,
      [key]: URL.createObjectURL(file),
    }));
    setItemStatus(
      key,
      language === "sr"
        ? "Slika je spremna. Kliknite Sačuvaj sliku."
        : "Image is ready. Click Save image."
    );
  };

  const uploadBlob = async (blob: Blob, contentType?: string) => {
    const uploadUrl = await generateUploadUrl({});
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType || blob.type || "application/octet-stream",
      },
      body: blob,
    });

    if (!result.ok) {
      throw new Error("Upload failed.");
    }

    const json = (await result.json()) as { storageId?: Id<"_storage"> };
    if (!json.storageId) {
      throw new Error("Upload failed.");
    }

    return json.storageId;
  };

  const saveImage = async (key: VehicleRentalKey) => {
    const file = files[key];

    if (!file) {
      setItemStatus(
        key,
        language === "sr"
          ? "Prvo odaberite sliku za ovu stavku."
          : "Choose an image for this item first."
      );
      return;
    }

    setSavingKey(key);
    setItemStatus(key, language === "sr" ? "Otpremanje..." : "Uploading...");

    try {
      const storageId = await uploadBlob(file, file.type);
      await upsertImage({ key, storageId });
      setFiles((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
      clearPreview(key);
      setItemStatus(
        key,
        language === "sr"
          ? "Glavna slika je sačuvana."
          : "Main image has been saved."
      );
    } catch (error) {
      setItemStatus(
        key,
        error instanceof Error
          ? error.message
          : language === "sr"
            ? "Čuvanje nije uspelo."
            : "Save failed."
      );
    }

    setSavingKey(null);
  };

  const deleteImage = async (key: VehicleRentalKey) => {
    const confirmed = window.confirm(
      language === "sr"
        ? "Obrisati glavnu sliku za ovu stavku?"
        : "Delete the main image for this item?"
    );

    if (!confirmed) {
      return;
    }

    setSavingKey(key);
    try {
      await removeImage({ key });
      clearPreview(key);
      setFiles((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
      setItemStatus(
        key,
        language === "sr" ? "Slika je obrisana." : "Image deleted."
      );
    } catch (error) {
      setItemStatus(
        key,
        error instanceof Error
          ? error.message
          : language === "sr"
            ? "Brisanje nije uspelo."
            : "Delete failed."
      );
    }
    setSavingKey(null);
  };

  return (
    <section className="grid gap-6">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Iznajmljivanje vozila" : "Vehicle rental"}
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              {language === "sr"
                ? "Glavne slike za stranicu i početnu sekciju"
                : "Main images for the page and homepage section"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
              {language === "sr"
                ? "Svaka stavka ima poseban upload. Sačuvana slika se prikazuje na početnoj stranici i na stranici Iznajmljivanje vozila."
                : "Each item has its own upload. The saved image appears on the homepage and the Vehicle rental page."}
            </p>
          </div>
        </div>
      </article>

      <section className="grid gap-5 lg:grid-cols-2">
        {VEHICLE_RENTAL_ITEMS.map((item) => {
          const record = recordsByKey.get(item.key);
          const previewUrl = previews[item.key] ?? record?.imageUrl ?? null;
          const label = language === "sr" ? item.title.sr : item.title.en;
          const description =
            language === "sr" ? item.description.sr : item.description.en;
          const Icon = iconByKey[item.key];
          const isSaving = savingKey === item.key;
          const hasSavedImage = Boolean(record?.imageUrl);

          return (
            <article key={item.key} className="section-holo p-5 sm:p-6">
              <div className="grid gap-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--primary)]">
                    <Icon aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {language === "sr"
                        ? "Poseban upload"
                        : "Separate upload"}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">{label}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {description}
                    </p>
                  </div>
                </div>

                <label className="group relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--line)] bg-[var(--bg-soft)] text-center transition hover:border-[var(--primary)]">
                  {previewUrl ? (
                    <CmsImage
                      src={previewUrl}
                      alt={label}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="grid justify-items-center gap-2 px-5 text-sm text-muted">
                      <FaCloudArrowUp className="text-2xl" />
                      {language === "sr"
                        ? "Odaberite glavnu sliku"
                        : "Choose main image"}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                    {language === "sr" ? "Promeni sliku" : "Change image"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    disabled={isSaving}
                    onChange={(event) => selectImage(item.key, event)}
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={isSaving || !files[item.key]}
                    onClick={() => void saveImage(item.key)}
                  >
                    <FaFloppyDisk className="text-xs" />
                    {isSaving
                      ? language === "sr"
                        ? "Čuvanje..."
                        : "Saving..."
                      : language === "sr"
                        ? "Sačuvaj sliku"
                        : "Save image"}
                  </button>
                  {hasSavedImage ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={isSaving}
                      onClick={() => void deleteImage(item.key)}
                    >
                      <FaTrash className="text-xs" />
                      {language === "sr" ? "Obriši" : "Delete"}
                    </button>
                  ) : null}
                </div>

                {status[item.key] ? (
                  <p className="text-sm text-muted">{status[item.key]}</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </section>
  );
}
