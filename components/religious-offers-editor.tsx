"use client";

import CmsImage from "@/components/cms-image";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { useSitePreferences } from "./site-preferences-provider";
import { useOffersLiveBoard, type AggregatedOffer } from "../lib/use-offers";
import {
  MANUAL_RELIGIOUS_SOURCE_SLUG,
  isReligiousOffer,
  normalizeReligiousTags,
} from "../lib/religious";
import { useCategories } from "../lib/use-categories";
import InlineCategories from "./inline-categories";

type ReligiousOfferForm = {
  externalId: string;
  title: string;
  navTitle: string;
  destination: string;
  departureCity: string;
  departureDate: string;
  returnDate: string;
  price: string;
  currency: string;
  seatsLeft: string;
  tags: string;
};

const emptyForm: ReligiousOfferForm = {
  externalId: "",
  title: "",
  navTitle: "",
  destination: "",
  departureCity: "",
  departureDate: "",
  returnDate: "",
  price: "",
  currency: "EUR",
  seatsLeft: "",
  tags: "verski, hodočašće",
};

const formatPrice = (offer: AggregatedOffer, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.price);

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatTagLabel = (tag: string, language: "sr" | "en") => {
  if (language !== "sr") return tag;

  const normalized = tag.trim().toLowerCase();
  if (normalized === "hodocasce") return "hodočašće";

  return tag;
};

export default function ReligiousOffersEditor() {
  const { language, dictionary } = useSitePreferences();
  const locale = language === "sr" ? "sr-RS" : "en-US";
  const upsertOffer = useMutation(api.offers.upsertOffer);
  const deactivateOffer = useMutation(api.offers.deactivateOffer);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const offers = useOffersLiveBoard(undefined, []);

  const [form, setForm] = useState<ReligiousOfferForm>(emptyForm);
  const [editingExternalId, setEditingExternalId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pdfStorageId, setPdfStorageId] = useState<Id<"_storage"> | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [removePdfOnSave, setRemovePdfOnSave] = useState(false);
  const [imageStorageIds, setImageStorageIds] = useState<Id<"_storage">[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");

  const religiousCategories = useCategories("religious");

  const religiousOffers = useMemo(
    () =>
      offers
        .filter((offer) => isReligiousOffer(offer))
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [offers]
  );

  const manualOffers = useMemo(
    () =>
      religiousOffers.filter(
        (offer) => offer.sourceSlug.toLowerCase() === MANUAL_RELIGIOUS_SOURCE_SLUG
      ),
    [religiousOffers]
  );

  const fillFromOffer = (offer: AggregatedOffer) => {
    setEditingExternalId(offer.externalId);
    setForm({
      externalId: offer.externalId,
      title: offer.title,
      navTitle: (offer as AggregatedOffer & { navTitle?: string }).navTitle ?? "",
      destination: offer.destination,
      departureCity: offer.departureCity ?? "",
      departureDate: offer.departureDate ?? "",
      returnDate: offer.returnDate ?? "",
      price: String(offer.price),
      currency: offer.currency,
      seatsLeft: offer.seatsLeft ? String(offer.seatsLeft) : "",
      tags: offer.tags.join(", "),
    });
    setPdfStorageId((offer.pdfStorageId as Id<"_storage"> | undefined) ?? null);
    setPdfUrl(offer.pdfUrl ?? null);
    setPdfFileName(offer.pdfFileName ?? "");
    setImageStorageIds((offer.imageStorageIds as Id<"_storage">[] | undefined) ?? []);
    setImagePreviewUrls((offer.imageUrls ?? []).filter(Boolean));
    setRemovePdfOnSave(false);
    setCategoryId((offer as AggregatedOffer & { categoryId?: string }).categoryId ?? "");
  };

  const resetForm = () => {
    setEditingExternalId(null);
    setForm(emptyForm);
    setPdfStorageId(null);
    setPdfUrl(null);
    setPdfFileName("");
    setImageStorageIds([]);
    setImagePreviewUrls([]);
    setRemovePdfOnSave(false);
    setCategoryId("");
  };

  const handlePdfUpload = async (file: File | null) => {
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setStatus(language === "sr" ? "Dozvoljen je samo PDF fajl." : "Only PDF files are allowed.");
      return;
    }

    setPdfUploading(true);
    setStatus(language === "sr" ? "Otpremanje PDF fajla..." : "Uploading PDF...");
    try {
      const uploadUrl = await generateUploadUrl({});
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/pdf" },
        body: file,
      });
      const json = await result.json();
      const storageId = json.storageId as Id<"_storage"> | undefined;
      if (!storageId) {
        throw new Error("Missing storage id");
      }
      setPdfStorageId(storageId);
      setPdfUrl(URL.createObjectURL(file));
      setPdfFileName(file.name);
      setRemovePdfOnSave(false);
      setStatus(language === "sr" ? "PDF je uspešno dodat." : "PDF uploaded successfully.");
    } catch {
      setStatus(language === "sr" ? "Upload PDF fajla nije uspeo." : "PDF upload failed.");
    } finally {
      setPdfUploading(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setImageUploading(true);
    setStatus(language === "sr" ? "Otpremanje slika..." : "Uploading images...");

    try {
      const nextStorageIds: Id<"_storage">[] = [];
      const nextPreviewUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        const uploadUrl = await generateUploadUrl({});
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        const json = await result.json();
        const storageId = json.storageId as Id<"_storage"> | undefined;

        if (!storageId) {
          throw new Error("Missing storage id");
        }

        nextStorageIds.push(storageId);
        nextPreviewUrls.push(URL.createObjectURL(file));
      }

      if (nextStorageIds.length === 0) {
        setStatus(
          language === "sr"
            ? "Nijedna validna slika nije odabrana."
            : "No valid image files were selected."
        );
        return;
      }

      setImageStorageIds((previous) => [...previous, ...nextStorageIds]);
      setImagePreviewUrls((previous) => [...previous, ...nextPreviewUrls]);
      setStatus(language === "sr" ? "Slike su uspešno dodate." : "Images uploaded successfully.");
    } catch {
      setStatus(language === "sr" ? "Upload slika nije uspeo." : "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageStorageIds((previous) => previous.filter((_, i) => i !== index));
    setImagePreviewUrls((previous) => previous.filter((_, i) => i !== index));
  };
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || pdfUploading || imageUploading) return;

    const title = form.title.trim();
    const destination = form.destination.trim();
    const price = parseNumber(form.price);
    const seatsLeft = form.seatsLeft.trim() ? parseNumber(form.seatsLeft) : null;

    if (!title || !destination || !price || price <= 0) {
      setStatus(
        language === "sr"
          ? "Unesite naziv, destinaciju i validnu cenu."
          : "Please enter title, destination, and a valid price."
      );
      return;
    }

    if (seatsLeft !== null && seatsLeft < 0) {
      setStatus(language === "sr" ? "Broj mesta ne može biti negativan." : "Seats cannot be negative.");
      return;
    }

    setBusy(true);
    setStatus(language === "sr" ? "Čuvanje ponude..." : "Saving offer...");
    try {
      const externalId = form.externalId.trim() || `REL-${Date.now()}`;
      const tags = normalizeReligiousTags(
        form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      );

      await upsertOffer({
        sourceSlug: MANUAL_RELIGIOUS_SOURCE_SLUG,
        externalId,
        title,
        destination,
        departureCity: form.departureCity.trim() || undefined,
        departureDate: form.departureDate || undefined,
        returnDate: form.returnDate || undefined,
        price,
        currency: form.currency.trim().toUpperCase() || "EUR",
        seatsLeft: seatsLeft ?? undefined,
        tags,
        navTitle: form.navTitle.trim() || undefined,
        pdfStorageId: pdfStorageId ?? undefined,
        pdfFileName: pdfStorageId ? pdfFileName || "brochure.pdf" : undefined,
        imageStorageIds,
        categoryId: categoryId
          ? (categoryId as unknown as Id<"categories">)
          : undefined,
        clearPdf: removePdfOnSave,
        normalizedHash: `${MANUAL_RELIGIOUS_SOURCE_SLUG}:${externalId}:${title}:${destination}:${price}`
          .toLowerCase()
          .replace(/\s+/g, "-"),
        score: 100,
        rawSnapshot: JSON.stringify({
          source: "manual-admin",
          editedAt: new Date().toISOString(),
        }),
        isActive: true,
      });

      setStatus(
        language === "sr"
          ? editingExternalId
            ? "Ponuda je ažurirana."
            : "Nova verska ponuda je sačuvana."
          : editingExternalId
            ? "Offer has been updated."
            : "Religious offer has been created."
      );
      resetForm();
    } catch {
      setStatus(
        language === "sr"
          ? "Došlo je do greške pri čuvanju."
          : "Failed to save the offer."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDeactivate = async (offer: AggregatedOffer) => {
    if (busy) return;
    const confirmed = window.confirm(
      language === "sr"
        ? "Da li sigurno želite da deaktivirate ovu ponudu?"
        : "Are you sure you want to deactivate this offer?"
    );
    if (!confirmed) return;

    setBusy(true);
    setStatus(language === "sr" ? "Deaktiviranje..." : "Deactivating...");
    try {
      await deactivateOffer({
        sourceSlug: offer.sourceSlug,
        externalId: offer.externalId,
      });
      setStatus(language === "sr" ? "Ponuda je deaktivirana." : "Offer has been deactivated.");
      if (editingExternalId === offer.externalId) {
        resetForm();
      }
    } catch {
      setStatus(
        language === "sr"
          ? "Deaktiviranje nije uspelo."
          : "Could not deactivate the offer."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="grid gap-6">
      <InlineCategories type="religious" />

      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Verski operativni pregled" : "Religious operations overview"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {language === "sr" ? "Editor verskih ponuda" : "Religious offers editor"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          {language === "sr"
            ? "Ovde upravljate ponudama za hodočašća i verske ture. Sve izmene se odmah reflektuju na stranici Verski turizam."
            : "Manage pilgrimage and faith-focused offers here. All changes are reflected immediately on the Religious Tourism page."}
        </p>
      </article>

      <div className="stagger-grid grid gap-3 sm:grid-cols-3">
        <article
          className="surface fx-lift rounded-2xl p-4"
          style={{ "--stagger-index": 0 } as CSSProperties}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Ukupno verskih" : "Total religious"}
          </p>
          <p className="mt-2 text-2xl font-semibold">{religiousOffers.length}</p>
        </article>
        <article
          className="surface fx-lift rounded-2xl p-4"
          style={{ "--stagger-index": 1 } as CSSProperties}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Ručno uređene" : "Manually managed"}
          </p>
          <p className="mt-2 text-2xl font-semibold">{manualOffers.length}</p>
        </article>
        <article
          className="surface fx-lift rounded-2xl p-4"
          style={{ "--stagger-index": 2 } as CSSProperties}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Izvor" : "Source"}
          </p>
          <p className="mt-2 text-lg font-semibold">{MANUAL_RELIGIOUS_SOURCE_SLUG}</p>
        </article>
      </div>

      <form
        onSubmit={handleSave}
        className="section-holo grid gap-5 p-5 sm:p-6 xl:grid-cols-2"
      >
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">External ID</span>
            <input
              className="control"
              value={form.externalId}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, externalId: event.target.value }))
              }
              placeholder="REL-2026-001"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Naziv ponude" : "Offer title"}
            </span>
            <input
              className="control"
              value={form.title}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, title: event.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Kratak naslov za navigaciju" : "Short nav title"}
            </span>
            <input
              className="control"
              value={form.navTitle}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, navTitle: event.target.value }))
              }
              placeholder={language === "sr" ? "npr. Ostrog i CG manastiri" : "e.g. Ostrog & Montenegro"}
            />
            <span className="text-xs text-muted">
              {language === "sr"
                ? "Prikazuje se kao podlink u navigaciji. Ostavite prazno ako ne želite da se prikazuje."
                : "Shown as a sub-link in navigation. Leave empty to hide from nav."}
            </span>
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Destinacija" : "Destination"}
            </span>
            <input
              className="control"
              value={form.destination}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, destination: event.target.value }))
              }
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Cena" : "Price"}
              </span>
              <input
                type="number"
                min={1}
                className="control"
                value={form.price}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, price: event.target.value }))
                }
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Valuta" : "Currency"}
              </span>
              <input
                className="control"
                value={form.currency}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, currency: event.target.value }))
                }
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Grad polaska" : "Departure city"}
            </span>
            <input
              className="control"
              value={form.departureCity}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, departureCity: event.target.value }))
              }
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Datum polaska" : "Departure date"}
              </span>
              <input
                type="date"
                className="control"
                value={form.departureDate}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, departureDate: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Datum povratka" : "Return date"}
              </span>
              <input
                type="date"
                className="control"
                value={form.returnDate}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, returnDate: event.target.value }))
                }
              />
            </label>
          </div>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Slobodna mesta" : "Seats left"}
            </span>
            <input
              type="number"
              min={0}
              className="control"
              value={form.seatsLeft}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, seatsLeft: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">Tags</span>
            <input
              className="control"
              value={form.tags}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, tags: event.target.value }))
              }
              placeholder="verski, hodočašće, manastiri"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Kategorija" : "Category"}
            </span>
            <select
              className="control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">
                {dictionary.admin.categorySelectPlaceholder}
              </option>
              {religiousCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {language === "sr" ? cat.name.sr : cat.name.en}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-2">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Slike ponude" : "Offer images"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <label className="btn-secondary cursor-pointer !px-3 !py-2 !text-xs">
                {imageUploading
                  ? language === "sr"
                    ? "Otpremanje slika..."
                    : "Uploading images..."
                  : language === "sr"
                    ? "Dodaj slike"
                    : "Upload images"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={busy || pdfUploading || imageUploading}
                  onChange={(event) => void handleImageUpload(event.target.files)}
                />
              </label>
            </div>
            {imagePreviewUrls.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {imagePreviewUrls.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className="relative h-20 w-20 overflow-hidden rounded-xl border border-[var(--line)]"
                  >
                    <CmsImage
                      src={imageUrl}
                      alt={language === "sr" ? "Slika ponude" : "Offer image"}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white"
                      onClick={() => removeImage(index)}
                      disabled={busy || pdfUploading || imageUploading}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            {imageStorageIds.length > 0 ? (
              <p className="text-xs text-muted">
                {language === "sr"
                  ? `Ukupno slika: ${imageStorageIds.length}`
                  : `Total images: ${imageStorageIds.length}`}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-semibold">
              {language === "sr" ? "PDF brošura" : "PDF brochure"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <label className="btn-secondary cursor-pointer !px-3 !py-2 !text-xs">
                {pdfUploading
                  ? language === "sr"
                    ? "Otpremanje..."
                    : "Uploading..."
                  : language === "sr"
                    ? "Dodaj PDF"
                    : "Upload PDF"}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  disabled={busy || pdfUploading || imageUploading}
                  onChange={(event) => void handlePdfUpload(event.target.files?.[0] ?? null)}
                />
              </label>
              {pdfStorageId ? (
                <button
                  type="button"
                  className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs text-muted transition hover:border-red-400 hover:text-red-300"
                  onClick={() => {
                    setPdfStorageId(null);
                    setPdfUrl(null);
                    setPdfFileName("");
                    setRemovePdfOnSave(true);
                  }}
                  disabled={busy || pdfUploading || imageUploading}
                >
                  {language === "sr" ? "Ukloni PDF" : "Remove PDF"}
                </button>
              ) : null}
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs text-muted transition hover:border-[var(--primary)] hover:text-[var(--text)]"
                >
                  {language === "sr" ? "Otvori PDF" : "Open PDF"}
                </a>
              ) : null}
            </div>
            {pdfFileName ? <p className="text-xs text-muted">{pdfFileName}</p> : null}
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="h-60 w-full rounded-xl border border-[var(--line)] bg-white"
                title={language === "sr" ? "Pregled PDF brošure" : "PDF brochure preview"}
              />
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary" disabled={busy || pdfUploading || imageUploading}>
              {editingExternalId
                ? language === "sr"
                  ? "Sačuvaj izmene"
                  : "Save changes"
                : language === "sr"
                  ? "Dodaj ponudu"
                  : "Add offer"}
            </button>
            {editingExternalId ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
                disabled={busy || pdfUploading || imageUploading}
              >
              {language === "sr" ? "Otkaži izmenu" : "Cancel edit"}
              </button>
            ) : null}
            {status ? <span className="text-sm text-muted">{status}</span> : null}
          </div>
        </div>
      </form>

      <section>
        <h3 className="mb-4 text-xl font-semibold sm:text-2xl">
          {language === "sr" ? "Aktivne verske ponude" : "Active religious offers"}
        </h3>
        {religiousOffers.length > 0 ? (
          <div className="stagger-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {religiousOffers.map((offer, index) => {
              const isManual = offer.sourceSlug.toLowerCase() === MANUAL_RELIGIOUS_SOURCE_SLUG;
              return (
                <article
                  key={offer.id}
                  className="surface fx-lift rounded-2xl p-4"
                  style={{ "--stagger-index": index } as CSSProperties}
                >
                  {offer.imageUrls && offer.imageUrls.length > 0 ? (
                    <CmsImage
                      src={offer.imageUrls[0]}
                      alt={offer.title}
                      className="mb-3 h-40 w-full rounded-xl border border-[var(--line)] object-cover"
                    />
                  ) : null}
                  <p className="text-xs uppercase tracking-[0.12em] text-muted">
                    {offer.sourceSlug}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold">{offer.title}</h4>
                  <p className="mt-1 text-sm text-muted">{offer.destination}</p>
                  <p className="mt-2 text-xl font-semibold">{formatPrice(offer, locale)}</p>
                  <p className="mt-1 text-sm text-muted">
                    {language === "sr" ? "ID" : "ID"}: {offer.externalId}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {language === "sr" ? "Mesta" : "Seats"}:{" "}
                    {typeof offer.seatsLeft === "number" ? offer.seatsLeft : "-"}
                  </p>
                  {offer.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {offer.tags.map((tag) => (
                        <span
                          key={`${offer.id}-${tag}`}
                          className="rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-2.5 py-1 text-xs"
                        >
                          {formatTagLabel(tag, language)}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {offer.pdfUrl ? (
                    <div className="mt-3 space-y-2">
                      <a
                        href={offer.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-xl border border-[var(--line)] px-3 py-2 text-xs text-muted transition hover:border-[var(--primary)] hover:text-[var(--text)]"
                      >
                        {language === "sr" ? "Otvori PDF" : "Open PDF"}
                      </a>
                      <details className="rounded-xl border border-[var(--line)] p-2">
                        <summary className="cursor-pointer text-xs text-muted">
                          {language === "sr" ? "Pregled / prelistavanje" : "Preview / browse"}
                        </summary>
                        <iframe
                          src={`${offer.pdfUrl}#toolbar=1&navpanes=0`}
                          className="mt-2 h-56 w-full rounded-lg border border-[var(--line)] bg-white"
                          title={`${offer.title}-pdf-preview`}
                        />
                      </details>
                    </div>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isManual ? (
                      <button
                        type="button"
                        className="btn-secondary !px-3 !py-2 !text-xs"
                        onClick={() => fillFromOffer(offer)}
                        disabled={busy}
                      >
                        {language === "sr" ? "Izmeni" : "Edit"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs text-muted transition hover:border-red-400 hover:text-red-300"
                      onClick={() => void handleDeactivate(offer)}
                      disabled={busy}
                    >
                      {language === "sr" ? "Deaktiviraj" : "Deactivate"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <article className="surface rounded-2xl p-4 text-sm text-muted">
            {language === "sr"
              ? "Trenutno nema verskih ponuda."
              : "There are currently no religious offers."}
          </article>
        )}
      </section>
    </section>
  );
}

