"use client";

import CmsImage from "@/components/cms-image";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useSitePreferences } from "../site-preferences-provider";
import { Destination } from "../../lib/use-destinations";
import { FaXmark, FaCloudArrowUp, FaTrash } from "react-icons/fa6";

type DestinationSlideOverProps = {
  open: boolean;
  destination: Destination | null;
  tripId?: string;
  pageSlug?: string;
  onClose: () => void;
};

type DestinationForm = {
  title: string;
  description: string;
  price: number;
  currency: string;
  order: number;
  isActive: boolean;
};

const emptyForm: DestinationForm = {
  title: "",
  description: "",
  price: 0,
  currency: "USD",
  order: 1,
  isActive: true,
};

const formFromDestination = (destination: Destination): DestinationForm => ({
  title: destination.title,
  description: destination.description,
  price: destination.price,
  currency: destination.currency,
  order: destination.order,
  isActive: destination.isActive,
});

export default function DestinationSlideOver({
  open,
  destination,
  tripId,
  pageSlug,
  onClose,
}: DestinationSlideOverProps) {
  const { language } = useSitePreferences();
  const upsertDestination = useMutation(api.destinations.upsert);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const panelRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<DestinationForm>(() =>
    destination ? formFromDestination(destination) : emptyForm
  );
  const [imageStorageIds, setImageStorageIds] = useState<Id<"_storage">[]>(
    () =>
      destination ? (destination.imageStorageIds as Id<"_storage">[]) : []
  );
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(
    () => (destination ? destination.imageUrls.filter(Boolean) : [])
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const updateField = <K extends keyof DestinationForm>(
    key: K,
    value: DestinationForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
          setImagePreviewUrls((prev) => [
            ...prev,
            URL.createObjectURL(file),
          ]);
        }
      }
    } catch {
      setStatus(
        language === "sr"
          ? "Greska pri uploadu slika."
          : "Image upload failed."
      );
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImageStorageIds((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    void handleImageUpload(e.dataTransfer.files);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setStatus(
        language === "sr"
          ? "Naslov destinacije je obavezan."
          : "Destination title is required."
      );
      return;
    }

    if (!tripId && !pageSlug) {
      setStatus(
        language === "sr"
          ? "Nije pronadjeno putovanje."
          : "No trip/page context found."
      );
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      await upsertDestination({
        id: destination
          ? (destination._id as Id<"destinations">)
          : undefined,
        tripId: tripId ? (tripId as Id<"trips">) : undefined,
        pageSlug: pageSlug || undefined,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        currency: form.currency,
        imageStorageIds,
        order: Number(form.order),
        isActive: form.isActive,
      });

      onClose();
    } catch {
      setStatus(
        language === "sr" ? "Greska pri cuvanju." : "Save failed."
      );
    }
    setSaving(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel â€” full-screen on mobile, max-w-md on desktop */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-[var(--line)] bg-[var(--surface-strong)] shadow-2xl transition-transform sm:max-w-md"
        style={{ animation: "admin-slide-in-right 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-4 sm:px-6">
          <h3 className="min-w-0 truncate text-base font-bold">
            {destination
              ? `${language === "sr" ? "Uredi" : "Edit"}: ${destination.title}`
              : language === "sr"
                ? "Nova Destinacija"
                : "New Destination"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
          >
            <FaXmark className="text-lg" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="grid gap-5">
            {/* Image upload zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
                dragOver
                  ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                  : "border-[var(--line)] bg-[var(--bg-soft)]"
              }`}
            >
              <FaCloudArrowUp className="mb-2 text-2xl text-[var(--muted)]" />
              <p className="text-sm font-semibold">
                {language === "sr" ? "Sliku ucitaj" : "Upload image"}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {language === "sr"
                  ? "Prevucite sliku ovde ili kliknite da odaberete"
                  : "Drag & drop or click to browse"}
              </p>
              <label className="mt-3 cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
                {language === "sr" ? "Odaberi fajl" : "Choose file"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    void handleImageUpload(e.target.files)
                  }
                />
              </label>
              {uploading ? (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {language === "sr" ? "Otpremanje..." : "Uploading..."}
                </p>
              ) : null}
            </div>

            {/* Image previews */}
            {imagePreviewUrls.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {imagePreviewUrls.map((url, i) => (
                  <div
                    key={i}
                    className="group relative h-16 w-16 overflow-hidden rounded-lg border border-[var(--line)]"
                  >
                    <CmsImage
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                    >
                      <FaTrash className="text-xs text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Title */}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Naziv" : "Name"}
              </span>
              <input
                className="control"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder={
                  language === "sr"
                    ? "Kapadokija - Nebo od Balona"
                    : "Cappadocia - Sky of Balloons"
                }
              />
            </label>

            {/* Price + Currency */}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Cena" : "Price"}
              </span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="control flex-1"
                  value={form.price}
                  onChange={(e) =>
                    updateField("price", Number(e.target.value))
                  }
                />
                <select
                  className="control !w-24"
                  value={form.currency}
                  onChange={(e) =>
                    updateField("currency", e.target.value)
                  }
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="RSD">RSD</option>
                </select>
              </div>
            </label>

            {/* Description â€” plain textarea */}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Kratak opis" : "Short description"}
              </span>
              <textarea
                className="control !min-h-[120px]"
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder={
                  language === "sr"
                    ? "Opisite destinaciju..."
                    : "Describe the destination..."
                }
              />
            </label>

            {/* Status toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Status</span>
              <button
                type="button"
                onClick={() =>
                  updateField("isActive", !form.isActive)
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                  form.isActive
                    ? "bg-emerald-500"
                    : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    form.isActive
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-medium ${
                  form.isActive
                    ? "text-emerald-400"
                    : "text-[var(--muted)]"
                }`}
              >
                {form.isActive
                  ? language === "sr"
                    ? "Aktiven"
                    : "Active"
                  : language === "sr"
                    ? "Neaktivno"
                    : "Inactive"}
              </span>
            </div>

            {/* Status message */}
            {status ? (
              <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-400">
                {status}
              </p>
            ) : null}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--line)] px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-sm"
          >
            {language === "sr" ? "Otkazi" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="btn-primary text-sm"
          >
            {saving
              ? language === "sr"
                ? "Cuvanje..."
                : "Saving..."
              : language === "sr"
                ? "Sacuvaj Promene"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

