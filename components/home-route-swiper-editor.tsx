"use client";

import CmsImage from "@/components/cms-image";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Doc, Id } from "../convex/_generated/dataModel";
import {
  HOME_ROUTE_SWIPER_DEFAULTS,
  type HomeRouteSwiperDefault,
} from "../lib/home-route-swiper-defaults";
import { useSitePreferences } from "./site-preferences-provider";
import {
  FaCloudArrowUp,
  FaImage,
  FaPen,
  FaPlus,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";

type HomeRouteSlideRecord = Doc<"homeRouteSlides"> & {
  imageUrl: string | null;
};

type HomeRouteSlideForm = {
  titleSr: string;
  titleEn: string;
  captionSr: string;
  captionEn: string;
  accent: string;
  order: number;
  isActive: boolean;
};

const ACCENTS = ["#67e8f9", "#f0abfc", "#93c5fd", "#fb7185", "#34d399"];

const padOrder = (order: number) => order.toString().padStart(2, "0");

const makeDefaultForm = (order: number): HomeRouteSlideForm => ({
  titleSr: `Ruta ${order}`,
  titleEn: `Route ${order}`,
  captionSr: `Destinacija ${padOrder(order)}`,
  captionEn: `Destination ${padOrder(order)}`,
  accent: ACCENTS[(order - 1) % ACCENTS.length],
  order,
  isActive: true,
});

const isAllowedImage = (file: File) =>
  file.type.startsWith("image/") ||
  /\.(avif|jpe?g|png|webp)$/i.test(file.name);

const titleFromFileName = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toForm = (slide: HomeRouteSlideRecord): HomeRouteSlideForm => ({
  titleSr: slide.title.sr,
  titleEn: slide.title.en,
  captionSr: slide.caption.sr,
  captionEn: slide.caption.en,
  accent: slide.accent,
  order: slide.order,
  isActive: slide.isActive,
});

export default function HomeRouteSwiperEditor() {
  const { language } = useSitePreferences();
  const slides = useQuery(api.homeRouteSlides.listAll) as
    | HomeRouteSlideRecord[]
    | undefined;
  const upsertSlide = useMutation(api.homeRouteSlides.upsert);
  const removeSlide = useMutation(api.homeRouteSlides.remove);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const sortedSlides = useMemo(() => {
    if (!slides) return [];
    return [...slides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [slides]);

  const maxOrder = useMemo(
    () => sortedSlides.reduce((max, item) => Math.max(max, item.order), 0),
    [sortedSlides]
  );
  const nextOrder = maxOrder + 1;

  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HomeRouteSlideRecord | null>(
    null
  );
  const [form, setForm] = useState<HomeRouteSlideForm>(makeDefaultForm(1));
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [importingDefaults, setImportingDefaults] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const isBusy = saving || bulkUploading || importingDefaults;
  const previewUrl = objectUrl ?? editingSlide?.imageUrl ?? null;

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const updateField = <K extends keyof HomeRouteSlideForm>(
    key: K,
    value: HomeRouteSlideForm[K]
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const clearObjectUrl = () => {
    setObjectUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  };

  const handleFileSelect = (selectedFile: File | null) => {
    clearObjectUrl();

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!isAllowedImage(selectedFile)) {
      setStatus(
        language === "sr"
          ? "Dozvoljene su samo slike: JPG, PNG, WEBP i AVIF."
          : "Allowed image files: JPG, PNG, WEBP, and AVIF."
      );
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setObjectUrl(URL.createObjectURL(selectedFile));
    setStatus(null);
  };

  const startCreate = () => {
    clearObjectUrl();
    setEditingSlide(null);
    setForm(makeDefaultForm(nextOrder));
    setFile(null);
    setStatus(null);
    setShowForm(true);
  };

  const startEdit = (slide: HomeRouteSlideRecord) => {
    clearObjectUrl();
    setEditingSlide(slide);
    setForm(toForm(slide));
    setFile(null);
    setStatus(null);
    setShowForm(true);
  };

  const closeForm = () => {
    clearObjectUrl();
    setShowForm(false);
    setEditingSlide(null);
    setFile(null);
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

  const saveSlide = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const titleSr = form.titleSr.trim();
    const titleEn = form.titleEn.trim();
    const captionSr = form.captionSr.trim();
    const captionEn = form.captionEn.trim();

    if (!titleSr || !titleEn || !captionSr || !captionEn) {
      setStatus(
        language === "sr"
          ? "Popunite naslov i oznaku za oba jezika."
          : "Fill in title and caption for both languages."
      );
      return;
    }

    setSaving(true);
    setStatus(language === "sr" ? "Čuvanje..." : "Saving...");

    try {
      const storageId = file
        ? await uploadBlob(file, file.type)
        : editingSlide?.storageId;

      if (!storageId) {
        setStatus(
          language === "sr"
            ? "Dodajte sliku pre čuvanja."
            : "Add an image before saving."
        );
        setSaving(false);
        return;
      }

      await upsertSlide({
        id: editingSlide?._id,
        title: { sr: titleSr, en: titleEn },
        caption: { sr: captionSr, en: captionEn },
        accent: form.accent,
        storageId,
        order: Number(form.order) || nextOrder,
        isActive: form.isActive,
      });

      setStatus(language === "sr" ? "Slika je sačuvana." : "Image saved.");
      closeForm();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : language === "sr"
            ? "Greška pri čuvanju."
            : "Save failed."
      );
    }

    setSaving(false);
  };

  const addUploadedImages = async (files: FileList | null) => {
    const imageFiles = Array.from(files ?? []).filter(isAllowedImage);
    if (imageFiles.length === 0) {
      setStatus(
        language === "sr"
          ? "Odaberite bar jednu sliku."
          : "Choose at least one image."
      );
      return;
    }

    setBulkUploading(true);
    setStatus(language === "sr" ? "Otpremanje slika..." : "Uploading images...");

    try {
      let order = maxOrder + 1;

      for (const imageFile of imageFiles) {
        const storageId = await uploadBlob(imageFile, imageFile.type);
        const title = titleFromFileName(imageFile.name) || `Ruta ${order}`;

        await upsertSlide({
          title: { sr: title, en: title },
          caption: {
            sr: `Destinacija ${padOrder(order)}`,
            en: `Destination ${padOrder(order)}`,
          },
          accent: ACCENTS[(order - 1) % ACCENTS.length],
          storageId,
          order,
          isActive: true,
        });

        order += 1;
      }

      setStatus(
        language === "sr" ? "Slike su dodate." : "Images have been added."
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : language === "sr"
            ? "Upload nije uspeo."
            : "Upload failed."
      );
    }

    setBulkUploading(false);
  };

  const importDefaultSlide = async (
    item: HomeRouteSwiperDefault,
    order: number
  ) => {
    const response = await fetch(item.src);
    if (!response.ok) {
      throw new Error(`Cannot load ${item.src}`);
    }

    const blob = await response.blob();
    const storageId = await uploadBlob(
      blob,
      response.headers.get("Content-Type") ?? blob.type
    );

    await upsertSlide({
      title: item.title,
      caption: item.caption,
      accent: item.accent,
      storageId,
      order,
      isActive: true,
    });
  };

  const importDefaultSlides = async () => {
    if (
      sortedSlides.length > 0 &&
      !window.confirm(
        language === "sr"
          ? "Postojeće slike neće biti obrisane. Uvesti još jedan set početnih slika?"
          : "Existing images will not be deleted. Import another default set?"
      )
    ) {
      return;
    }

    setImportingDefaults(true);
    setStatus(
      language === "sr"
        ? "Uvoz postojećih slika u Convex..."
        : "Importing existing images into Convex..."
    );

    try {
      let order = maxOrder + 1;
      for (const item of HOME_ROUTE_SWIPER_DEFAULTS) {
        await importDefaultSlide(item, order);
        order += 1;
      }

      setStatus(
        language === "sr"
          ? "Postojeće slike su uvezene u Convex."
          : "Existing images have been imported into Convex."
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : language === "sr"
            ? "Uvoz nije uspeo."
            : "Import failed."
      );
    }

    setImportingDefaults(false);
  };

  const deleteSlide = async (slide: HomeRouteSlideRecord) => {
    const confirmed = window.confirm(
      language === "sr" ? "Obrisati ovu sliku?" : "Delete this image?"
    );
    if (!confirmed) return;

    await removeSlide({ id: slide._id });
  };

  const onBulkInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void addUploadedImages(event.target.files);
    event.target.value = "";
  };

  return (
    <section className="grid gap-6">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Početna strana" : "Homepage"}
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              {language === "sr"
                ? "Swiper najtraženijih ruta"
                : "Requested routes swiper"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
              {language === "sr"
                ? "Slike se uploaduju u Convex storage i odatle prikazuju u sekciji “Brz pregled najtraženijih ruta”."
                : "Images are uploaded to Convex storage and displayed from there in the requested-routes section."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-primary text-sm"
              onClick={startCreate}
              disabled={isBusy}
            >
              <FaPlus className="text-xs" />
              {language === "sr" ? "Dodaj sliku" : "Add image"}
            </button>
            <label className="btn-secondary cursor-pointer text-sm">
              <FaCloudArrowUp className="text-xs" />
              {bulkUploading
                ? language === "sr"
                  ? "Otpremanje..."
                  : "Uploading..."
                : language === "sr"
                  ? "Brzi upload"
                  : "Quick upload"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                disabled={isBusy}
                onChange={onBulkInputChange}
              />
            </label>
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => void importDefaultSlides()}
              disabled={isBusy}
            >
              <FaImage className="text-xs" />
              {importingDefaults
                ? language === "sr"
                  ? "Uvoz..."
                  : "Importing..."
                : language === "sr"
                  ? "Uvezi postojeće slike"
                  : "Import existing images"}
            </button>
          </div>
        </div>
        {status ? <p className="mt-4 text-sm text-muted">{status}</p> : null}
      </article>

      {showForm ? (
        <form
          onSubmit={saveSlide}
          className="section-holo grid gap-5 p-5 sm:p-6 lg:grid-cols-[18rem_1fr]"
        >
          <div>
            <label className="group flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--line)] bg-[var(--bg-soft)] text-center transition hover:border-[var(--primary)]">
              {previewUrl ? (
                <CmsImage
                  src={previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="grid justify-items-center gap-2 px-5 text-sm text-muted">
                  <FaCloudArrowUp className="text-2xl" />
                  {language === "sr" ? "Odaberite sliku" : "Choose image"}
                </span>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                onChange={(event) =>
                  handleFileSelect(event.target.files?.[0] ?? null)
                }
              />
            </label>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold">
                {editingSlide
                  ? language === "sr"
                    ? "Uredi sliku"
                    : "Edit image"
                  : language === "sr"
                    ? "Nova slika"
                    : "New image"}
              </h2>
              <button
                type="button"
                className="rounded-lg p-2 text-muted transition hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
                onClick={closeForm}
                aria-label={language === "sr" ? "Zatvori" : "Close"}
              >
                <FaXmark />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Naslov SR</span>
                <input
                  className="control"
                  value={form.titleSr}
                  onChange={(event) => updateField("titleSr", event.target.value)}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Title EN</span>
                <input
                  className="control"
                  value={form.titleEn}
                  onChange={(event) => updateField("titleEn", event.target.value)}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Oznaka SR</span>
                <input
                  className="control"
                  value={form.captionSr}
                  onChange={(event) =>
                    updateField("captionSr", event.target.value)
                  }
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Caption EN</span>
                <input
                  className="control"
                  value={form.captionEn}
                  onChange={(event) =>
                    updateField("captionEn", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">
                  {language === "sr" ? "Redosled" : "Order"}
                </span>
                <input
                  type="number"
                  min={1}
                  className="control"
                  value={form.order}
                  onChange={(event) =>
                    updateField("order", Number(event.target.value))
                  }
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">
                  {language === "sr" ? "Akcent boja" : "Accent color"}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accent}
                    className="h-[2.9rem] w-14 rounded-lg border border-[var(--line)] bg-transparent p-1"
                    onChange={(event) =>
                      updateField("accent", event.target.value)
                    }
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {ACCENTS.map((accent) => (
                      <button
                        key={accent}
                        type="button"
                        className={`h-7 w-7 rounded-full border transition ${
                          form.accent === accent
                            ? "border-white"
                            : "border-[var(--line)]"
                        }`}
                        style={{ backgroundColor: accent }}
                        onClick={() => updateField("accent", accent)}
                        aria-label={accent}
                      />
                    ))}
                  </div>
                </div>
              </label>
              <label className="flex items-end gap-2 pb-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                />
                {language === "sr" ? "Aktivno" : "Active"}
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-4">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving
                  ? language === "sr"
                    ? "Čuvanje..."
                    : "Saving..."
                  : language === "sr"
                    ? "Sačuvaj"
                    : "Save"}
              </button>
              <button type="button" className="btn-secondary" onClick={closeForm}>
                {language === "sr" ? "Otkaži" : "Cancel"}
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedSlides.map((slide, index) => {
          const title = language === "sr" ? slide.title.sr : slide.title.en;
          const caption =
            language === "sr" ? slide.caption.sr : slide.caption.en;

          return (
            <article
              key={slide._id}
              className="overflow-hidden rounded-2xl border bg-[var(--surface)]"
              style={{ borderColor: slide.accent }}
            >
              <div className="aspect-[4/5] overflow-hidden bg-[var(--bg-soft)]">
                {slide.imageUrl ? (
                  <CmsImage
                    src={slide.imageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">
                    {language === "sr" ? "Nema slike" : "No image"}
                  </div>
                )}
              </div>
              <div className="grid gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {caption}
                    </p>
                    <h3 className="mt-1 truncate text-base font-semibold">
                      {title}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      slide.isActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-slate-500/15 text-slate-400"
                    }`}
                  >
                    {slide.isActive
                      ? language === "sr"
                        ? "Aktivno"
                        : "Active"
                      : language === "sr"
                        ? "Neaktivno"
                        : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center gap-2 border-t border-[var(--line)] pt-3">
                  <span className="mr-auto text-xs text-muted">
                    #{slide.order}
                  </span>
                  <button
                    type="button"
                    className="rounded-lg border border-[var(--line)] p-2 text-xs text-muted transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    onClick={() => startEdit(slide)}
                    aria-label={language === "sr" ? "Uredi" : "Edit"}
                  >
                    <FaPen />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[var(--line)] p-2 text-xs text-muted transition hover:border-red-400 hover:text-red-400"
                    onClick={() => void deleteSlide(slide)}
                    aria-label={language === "sr" ? "Obriši" : "Delete"}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {slides && sortedSlides.length === 0 ? (
          <article className="col-span-full rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg-soft)] p-8 text-center text-sm text-muted">
            {language === "sr"
              ? "Još nema slika za početni swiper."
              : "There are no homepage swiper images yet."}
          </article>
        ) : null}
      </section>
    </section>
  );
}
