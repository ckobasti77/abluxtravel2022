"use client";

import CmsImage from "@/components/cms-image";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { useSitePreferences } from "../site-preferences-provider";
import { FaXmark, FaCloudArrowUp } from "react-icons/fa6";

type SlideRecord = Doc<"slides"> & {
  mediaType?: "video" | "image";
  mediaName?: string | null;
  mediaUrl: string | null;
};

type SlideSlideOverProps = {
  open: boolean;
  slide: SlideRecord | null;
  totalSlides: number;
  onClose: () => void;
};

type SlideForm = {
  title: string;
  subtitle: string;
  badge: string;
  copy: string;
  order: number;
  isActive: boolean;
};

const emptyForm: SlideForm = {
  title: "",
  subtitle: "",
  badge: "",
  copy: "",
  order: 1,
  isActive: true,
};

const resolveUploadMediaType = (
  file: File
): "video" | "image" | undefined => {
  if (file.type === "video/mp4") return "video";
  if (file.type.startsWith("image/")) return "image";
  const n = file.name.toLowerCase();
  if (n.endsWith(".mp4")) return "video";
  if (/\.(jpg|jpeg|png|webp|avif)$/.test(n)) return "image";
  return undefined;
};

export default function SlideSlideOver({
  open,
  slide,
  totalSlides,
  onClose,
}: SlideSlideOverProps) {
  const { language } = useSitePreferences();
  const upsert = useMutation(api.slides.upsert);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const panelRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<SlideForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (slide) {
      setForm({
        title: slide.title,
        subtitle: slide.subtitle,
        badge: slide.badge ?? "",
        copy: slide.copy ?? "",
        order: slide.order,
        isActive: slide.isActive,
      });
      setFilePreview(slide.mediaUrl);
    } else {
      setForm({ ...emptyForm, order: totalSlides + 1 });
      setFilePreview(null);
    }
    setFile(null);
    setStatus(null);
  }, [slide, open, totalSlides]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const mediaType = resolveUploadMediaType(f);
    if (!mediaType) {
      setStatus(
        language === "sr"
          ? "Dozvoljeni su MP4, JPG, JPEG, PNG, WEBP i AVIF."
          : "Allowed: MP4, JPG, JPEG, PNG, WEBP, AVIF."
      );
      return;
    }
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setStatus(
        language === "sr" ? "Naslov je obavezan." : "Title is required."
      );
      return;
    }
    if (!form.subtitle.trim()) {
      setStatus(
        language === "sr"
          ? "Podnaslov je obavezan."
          : "Subtitle is required."
      );
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      let storageId: Id<"_storage"> | undefined;
      let mediaType: "video" | "image" | undefined;
      let mediaName: string | undefined;

      if (file) {
        mediaType = resolveUploadMediaType(file);
        const uploadUrl = await generateUploadUrl({});
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const json = await result.json();
        storageId = json.storageId as Id<"_storage"> | undefined;
        if (!storageId) throw new Error("Upload failed.");
        mediaName = file.name;
      }

      await upsert({
        id: slide ? (slide._id as Id<"slides">) : undefined,
        title: form.title,
        subtitle: form.subtitle,
        badge: form.badge || undefined,
        copy: form.copy || undefined,
        mediaType: mediaType ?? slide?.mediaType,
        videoUrl: mediaName ?? slide?.videoUrl,
        storageId: storageId ?? slide?.storageId,
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

      {/* Slide-over panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-[var(--line)] bg-[var(--surface-strong)] shadow-2xl transition-transform sm:max-w-md"
        style={{ animation: "admin-slide-in-right 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-4 sm:px-6">
          <h3 className="text-base font-bold">
            {slide
              ? language === "sr"
                ? "Uredi Slajd"
                : "Edit Slide"
              : language === "sr"
                ? "Novi Slajd"
                : "New Slide"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
          >
            <FaXmark className="text-lg" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="grid gap-5">
            {/* Media upload zone */}
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
              {filePreview ? (
                <div className="mb-3 w-full overflow-hidden rounded-lg">
                  {(file ? resolveUploadMediaType(file) : slide?.mediaType) ===
                  "video" ? (
                    <video
                      src={filePreview}
                      className="aspect-video w-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <CmsImage
                      src={filePreview}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                  )}
                </div>
              ) : (
                <FaCloudArrowUp className="mb-2 text-2xl text-[var(--muted)]" />
              )}
              <p className="text-sm font-semibold">
                {language === "sr"
                  ? "Mediju ucitaj"
                  : "Upload media"}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {language === "sr"
                  ? "MP4 video ili slika (JPG, PNG, WEBP)"
                  : "MP4 video or image (JPG, PNG, WEBP)"}
              </p>
              <label className="mt-3 cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
                {language === "sr" ? "Odaberi fajl" : "Choose file"}
                <input
                  type="file"
                  accept="video/mp4,image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </label>
            </div>

            {/* Title */}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Naslov" : "Title"}
              </span>
              <input
                className="control"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder={
                  language === "sr" ? "Kapadokija" : "Cappadocia"
                }
              />
            </label>

            {/* Subtitle */}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Podnaslov" : "Subtitle"}
              </span>
              <input
                className="control"
                value={form.subtitle}
                onChange={(e) =>
                  setForm((p) => ({ ...p, subtitle: e.target.value }))
                }
                placeholder={
                  language === "sr"
                    ? "Nebo od Balona"
                    : "Sky of Balloons"
                }
              />
            </label>

            {/* Badge (optional) */}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Bedz" : "Badge"}{" "}
                <span className="font-normal text-[var(--muted)]">
                  ({language === "sr" ? "opciono" : "optional"})
                </span>
              </span>
              <input
                className="control"
                value={form.badge}
                onChange={(e) =>
                  setForm((p) => ({ ...p, badge: e.target.value }))
                }
              />
            </label>

            {/* Copy (optional) */}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Opis" : "Copy"}{" "}
                <span className="font-normal text-[var(--muted)]">
                  ({language === "sr" ? "opciono" : "optional"})
                </span>
              </span>
              <textarea
                className="control !min-h-[80px]"
                value={form.copy}
                onChange={(e) =>
                  setForm((p) => ({ ...p, copy: e.target.value }))
                }
              />
            </label>

            {/* Order */}
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Redosled" : "Order"}
              </span>
              <input
                type="number"
                min={1}
                className="control"
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    order: Number(e.target.value),
                  }))
                }
              />
            </label>

            {/* Status toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Status</span>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, isActive: !p.isActive }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                  form.isActive ? "bg-emerald-500" : "bg-slate-600"
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
                ? "Sacuvaj"
                : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}

