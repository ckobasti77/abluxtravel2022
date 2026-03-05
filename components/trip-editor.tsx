"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useSitePreferences } from "./site-preferences-provider";
import { useTrips, Trip, TripStatus, TransportType } from "../lib/use-trips";
import {
  FaBus,
  FaPlane,
  FaCar,
  FaTrain,
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaImage,
} from "react-icons/fa6";

type ItineraryItem = { day: number; date: string; description: string };

type TripForm = {
  title: string;
  description: string;
  slug: string;
  price: number;
  currency: string;
  nights: number;
  days: number;
  transport: TransportType;
  departureDate: string;
  returnDate: string;
  departureCity: string;
  hotelInfo: string;
  depositPercentage: number;
  depositDeadline: string;
  itinerary: ItineraryItem[];
  includedText: string;
  notIncludedText: string;
  status: TripStatus;
  featured: boolean;
  order: number;
};

const emptyForm: TripForm = {
  title: "",
  description: "",
  slug: "",
  price: 0,
  currency: "RSD",
  nights: 0,
  days: 0,
  transport: "bus",
  departureDate: "",
  returnDate: "",
  departureCity: "",
  hotelInfo: "",
  depositPercentage: 0,
  depositDeadline: "",
  itinerary: [{ day: 1, date: "", description: "" }],
  includedText: "",
  notIncludedText: "",
  status: "upcoming",
  featured: false,
  order: 1,
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/[š]/g, "s")
    .replace(/[ž]/g, "z")
    .replace(/[đ]/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const transportOptions: { value: TransportType; icon: typeof FaBus }[] = [
  { value: "bus", icon: FaBus },
  { value: "plane", icon: FaPlane },
  { value: "car", icon: FaCar },
  { value: "train", icon: FaTrain },
];

type SectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function CollapsibleSection({ title, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
      >
        {title}
        {open ? <FaChevronUp className="text-xs text-muted" /> : <FaChevronDown className="text-xs text-muted" />}
      </button>
      {open ? <div className="border-t border-[var(--line)] px-4 py-4">{children}</div> : null}
    </div>
  );
}

export default function TripEditor() {
  const { dictionary, language } = useSitePreferences();
  const trips = useTrips();
  const upsertTrip = useMutation(api.trips.upsert);
  const removeTrip = useMutation(api.trips.remove);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [form, setForm] = useState<TripForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageStorageIds, setImageStorageIds] = useState<Id<"_storage">[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const t = dictionary.tripDetail;
  const a = dictionary.admin;

  const updateField = <K extends keyof TripForm>(key: K, value: TripForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !editingId) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const uploadUrl = await generateUploadUrl({});
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const json = await result.json();
        const storageId = json.storageId as Id<"_storage">;
        if (storageId) {
          setImageStorageIds((prev) => [...prev, storageId]);
          setImagePreviewUrls((prev) => [...prev, URL.createObjectURL(file)]);
        }
      }
    } catch {
      setStatus(language === "sr" ? "Greška pri uploadu slika." : "Image upload failed.");
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImageStorageIds((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addItineraryDay = () => {
    setForm((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, date: "", description: "" },
      ],
    }));
  };

  const removeItineraryDay = (index: number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, day: i + 1 })),
    }));
  };

  const updateItinerary = (index: number, field: keyof ItineraryItem, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      setStatus(language === "sr" ? "Naslov je obavezan." : "Title is required.");
      return;
    }

    setStatus(a.uploading);
    try {
      await upsertTrip({
        id: editingId ? (editingId as Id<"trips">) : undefined,
        slug: form.slug,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        currency: form.currency,
        nights: Number(form.nights),
        days: Number(form.days),
        transport: form.transport,
        departureDate: form.departureDate,
        returnDate: form.returnDate,
        departureCity: form.departureCity,
        hotelInfo: form.hotelInfo || undefined,
        depositPercentage: form.depositPercentage || undefined,
        depositDeadline: form.depositDeadline || undefined,
        itinerary: form.itinerary,
        included: form.includedText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        notIncluded: form.notIncludedText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        imageStorageIds,
        status: form.status,
        featured: form.featured,
        order: Number(form.order),
      });
      setStatus(a.saved);
      resetForm();
    } catch {
      setStatus(language === "sr" ? "Greška pri čuvanju." : "Save failed.");
    }
  };

  const editTrip = (trip: Trip) => {
    setEditingId(trip._id);
    setForm({
      title: trip.title,
      description: trip.description,
      slug: trip.slug,
      price: trip.price,
      currency: trip.currency,
      nights: trip.nights,
      days: trip.days,
      transport: trip.transport,
      departureDate: trip.departureDate,
      returnDate: trip.returnDate,
      departureCity: trip.departureCity,
      hotelInfo: trip.hotelInfo || "",
      depositPercentage: trip.depositPercentage || 0,
      depositDeadline: trip.depositDeadline || "",
      itinerary: trip.itinerary.length > 0 ? trip.itinerary : [{ day: 1, date: "", description: "" }],
      includedText: trip.included.join("\n"),
      notIncludedText: trip.notIncluded.join("\n"),
      status: trip.status,
      featured: trip.featured,
      order: trip.order,
    });
    setImageStorageIds(trip.imageStorageIds as Id<"_storage">[]);
    setImagePreviewUrls(trip.imageUrls.filter(Boolean));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageStorageIds([]);
    setImagePreviewUrls([]);
  };

  const handleDelete = async (tripId: string) => {
    const confirmed = window.confirm(
      language === "sr" ? "Obrisati ovaj aranžman?" : "Delete this trip?"
    );
    if (!confirmed) return;
    await removeTrip({ id: tripId as Id<"trips"> });
    if (editingId === tripId) resetForm();
  };

  const statusLabel = (s: TripStatus) => {
    if (s === "active") return t.statusActive;
    if (s === "upcoming") return t.statusUpcoming;
    return t.statusCompleted;
  };

  const transportLabel = (tr: TransportType) => {
    return t[tr];
  };

  return (
    <section className="grid gap-6">
      <article className="section-holo p-6 sm:p-8">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          {editingId
            ? language === "sr"
              ? "Izmeni aranžman"
              : "Edit trip"
            : language === "sr"
              ? "Novi aranžman"
              : "New trip"}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          {language === "sr"
            ? "Popunite sve detalje aranžmana. Svako polje se čuva u Convex bazi."
            : "Fill in all trip details. Every field is persisted to the Convex database."}
        </p>
      </article>

      <div className="grid gap-4">
        <CollapsibleSection title={language === "sr" ? "Slike" : "Images"}>
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-3">
              {imagePreviewUrls.map((url, i) => (
                <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-[var(--line)]">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                  >
                    <FaTrash className="text-white" />
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[var(--line)] text-muted transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
                <FaImage className="text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => void handleImageUpload(e.target.files)}
                />
              </label>
            </div>
            {uploading ? (
              <p className="text-sm text-muted">{a.uploading}</p>
            ) : null}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={language === "sr" ? "Osnovne informacije" : "Basic info"}>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">{a.slideTitle}</span>
                <input
                  className="control"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Slug</span>
                <input
                  className="control"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                />
              </label>
            </div>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{a.slideCopy}</span>
              <textarea
                className="control min-h-[6rem]"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={language === "sr" ? "Cena i trajanje" : "Price & duration"}>
          <div className="grid gap-4 sm:grid-cols-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.price}</span>
              <input
                type="number"
                min={0}
                className="control"
                value={form.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Valuta" : "Currency"}
              </span>
              <input
                className="control"
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.nights}</span>
              <input
                type="number"
                min={0}
                className="control"
                value={form.nights}
                onChange={(e) => updateField("nights", Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.days}</span>
              <input
                type="number"
                min={0}
                className="control"
                value={form.days}
                onChange={(e) => updateField("days", Number(e.target.value))}
              />
            </label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t.transport}>
          <div className="flex flex-wrap gap-3">
            {transportOptions.map((opt) => {
              const Icon = opt.icon;
              const active = form.transport === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("transport", opt.value)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "border-[var(--line)] hover:border-[var(--primary)]"
                  }`}
                >
                  <Icon />
                  {transportLabel(opt.value)}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={language === "sr" ? "Datumi i grad polaska" : "Dates & departure"}>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.departure}</span>
              <input
                type="date"
                className="control"
                value={form.departureDate}
                onChange={(e) => updateField("departureDate", e.target.value)}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.returnLabel}</span>
              <input
                type="date"
                className="control"
                value={form.returnDate}
                onChange={(e) => updateField("returnDate", e.target.value)}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.departureCity}</span>
              <input
                className="control"
                value={form.departureCity}
                onChange={(e) => updateField("departureCity", e.target.value)}
              />
            </label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={language === "sr" ? "Hotel i depozit" : "Hotel & deposit"}
          defaultOpen={false}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.hotel}</span>
              <input
                className="control"
                value={form.hotelInfo}
                onChange={(e) => updateField("hotelInfo", e.target.value)}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.deposit} (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                className="control"
                value={form.depositPercentage}
                onChange={(e) => updateField("depositPercentage", Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.depositDeadline}</span>
              <input
                type="date"
                className="control"
                value={form.depositDeadline}
                onChange={(e) => updateField("depositDeadline", e.target.value)}
              />
            </label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t.itinerary}>
          <div className="grid gap-3">
            {form.itinerary.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] p-3 sm:grid-cols-[60px_140px_1fr_auto]">
                <label className="grid gap-1">
                  <span className="text-xs text-muted">{t.days}</span>
                  <input
                    type="number"
                    min={1}
                    className="control"
                    value={item.day}
                    onChange={(e) => updateItinerary(index, "day", Number(e.target.value))}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-muted">
                    {language === "sr" ? "Datum" : "Date"}
                  </span>
                  <input
                    type="date"
                    className="control"
                    value={item.date}
                    onChange={(e) => updateItinerary(index, "date", e.target.value)}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-muted">{a.slideCopy}</span>
                  <input
                    className="control"
                    value={item.description}
                    onChange={(e) => updateItinerary(index, "description", e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItineraryDay(index)}
                  className="self-end rounded-lg border border-[var(--line)] p-2 text-sm text-muted transition hover:border-red-400 hover:text-red-400"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItineraryDay}
              className="btn-secondary w-fit"
            >
              <FaPlus className="text-xs" />
              {language === "sr" ? "Dodaj dan" : "Add day"}
            </button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={`${t.included} / ${t.notIncluded}`}
          defaultOpen={false}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.included}</span>
              <textarea
                className="control min-h-[8rem]"
                value={form.includedText}
                onChange={(e) => updateField("includedText", e.target.value)}
                placeholder={language === "sr" ? "Svaki red = jedna stavka" : "Each line = one item"}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{t.notIncluded}</span>
              <textarea
                className="control min-h-[8rem]"
                value={form.notIncludedText}
                onChange={(e) => updateField("notIncludedText", e.target.value)}
                placeholder={language === "sr" ? "Svaki red = jedna stavka" : "Each line = one item"}
              />
            </label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={language === "sr" ? "Status i redosled" : "Status & order"}>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">Status</span>
              <select
                className="control"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value as TripStatus)}
              >
                <option value="active">{t.statusActive}</option>
                <option value="upcoming">{t.statusUpcoming}</option>
                <option value="completed">{t.statusCompleted}</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">{a.order}</span>
              <input
                type="number"
                min={1}
                className="control"
                value={form.order}
                onChange={(e) => updateField("order", Number(e.target.value))}
              />
            </label>
            <label className="flex items-end gap-2 pb-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
              />
              <span className="text-sm font-semibold">{t.featured}</span>
            </label>
          </div>
        </CollapsibleSection>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={() => void handleSave()}
        >
          {a.save}
        </button>
        {editingId ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={resetForm}
          >
            {language === "sr" ? "Otkaži izmenu" : "Cancel edit"}
          </button>
        ) : null}
        {status ? (
          <span className="text-sm text-muted">{status}</span>
        ) : null}
      </div>

      <section className="mt-4">
        <h3 className="mb-4 text-xl font-semibold">
          {language === "sr" ? "Postojeći aranžmani" : "Existing trips"}
        </h3>
        {trips.length > 0 ? (
          <div className="stagger-grid grid gap-4 md:grid-cols-2">
            {trips.map((trip, index) => (
              <article
                key={trip._id}
                className="surface fx-lift rounded-2xl p-4"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.1em] text-muted">
                      /{trip.slug}
                    </p>
                    <h4 className="mt-1 text-lg font-semibold">{trip.title}</h4>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      trip.status === "active"
                        ? "border-emerald-400/35 bg-emerald-400/10"
                        : trip.status === "upcoming"
                          ? "border-amber-400/35 bg-amber-400/10"
                          : "border-slate-400/35 bg-slate-400/10"
                    }`}
                  >
                    {statusLabel(trip.status)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {trip.days} {t.days} · {trip.nights} {t.nights} ·{" "}
                  {transportLabel(trip.transport)} · {trip.departureCity}
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {new Intl.NumberFormat(language === "sr" ? "sr-RS" : "en-US", {
                    style: "currency",
                    currency: trip.currency,
                    maximumFractionDigits: 0,
                  }).format(trip.price)}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="btn-secondary text-xs"
                    onClick={() => editTrip(trip)}
                  >
                    {language === "sr" ? "Izmeni" : "Edit"}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs text-muted transition hover:border-red-400 hover:text-red-400"
                    onClick={() => void handleDelete(trip._id)}
                  >
                    {language === "sr" ? "Obriši" : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="surface rounded-2xl p-4 text-sm text-muted">
            {t.noTrips}
          </article>
        )}
      </section>
    </section>
  );
}
