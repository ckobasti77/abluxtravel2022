"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import { useSitePreferences } from "./site-preferences-provider";

type SlideForm = {
  title: string;
  subtitle: string;
  badge: string;
  copy: string;
  order: number;
  isActive: boolean;
};

type SlideRecord = Doc<"slides"> & { videoUrl: string | null };
type SlideDraft = SlideForm;

type AranzmaniEditorProps = {
  title?: string;
  description?: string;
  className?: string;
};

export default function AranzmaniEditor({
  title,
  description,
  className,
}: AranzmaniEditorProps) {
  const { dictionary, language } = useSitePreferences();
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<SlideForm>({
    title: "",
    subtitle: "",
    badge: "",
    copy: "",
    order: 1,
    isActive: true,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [editingSlides, setEditingSlides] = useState<Record<string, SlideDraft>>({});

  const slides = useQuery(api.slides.list) as SlideRecord[] | undefined;
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const upsert = useMutation(api.slides.upsert);

  const sortedSlides = useMemo(() => {
    if (!slides) return [];
    return [...slides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [slides]);

  useEffect(() => {
    setEditingSlides((previous) => {
      const next = { ...previous };
      let changed = false;

      for (const slide of sortedSlides) {
        if (next[slide._id]) {
          continue;
        }
        next[slide._id] = {
          title: slide.title,
          subtitle: slide.subtitle,
          badge: slide.badge ?? "",
          copy: slide.copy ?? "",
          order: slide.order,
          isActive: slide.isActive,
        };
        changed = true;
      }

      return changed ? next : previous;
    });
  }, [sortedSlides]);

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setStatus(dictionary.admin.noFile);
      return;
    }

    setStatus(dictionary.admin.uploading);

    try {
      const uploadUrl = await generateUploadUrl({});
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const json = await result.json();
      const storageId = json.storageId as Id<"_storage"> | undefined;

      if (!storageId) {
        throw new Error("Upload failed.");
      }

      await upsert({
        title: form.title,
        subtitle: form.subtitle,
        badge: form.badge || undefined,
        copy: form.copy || undefined,
        videoUrl: file.name,
        storageId,
        order: Number(form.order),
        isActive: form.isActive,
      });

      setStatus(dictionary.admin.saved);
      setForm({
        title: "",
        subtitle: "",
        badge: "",
        copy: "",
        order: (sortedSlides.length || 0) + 1,
        isActive: true,
      });
      setFile(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unexpected error.");
    }
  };

  const onSlideDraftChange = <Key extends keyof SlideDraft>(
    slideId: string,
    key: Key,
    value: SlideDraft[Key]
  ) => {
    setEditingSlides((previous) => ({
      ...previous,
      [slideId]: {
        ...(previous[slideId] ?? {
          title: "",
          subtitle: "",
          badge: "",
          copy: "",
          order: 1,
          isActive: true,
        }),
        [key]: value,
      },
    }));
  };

  const saveExistingSlide = async (slide: SlideRecord) => {
    const draft = editingSlides[slide._id];
    if (!draft) {
      return;
    }

    try {
      await upsert({
        id: slide._id,
        title: draft.title,
        subtitle: draft.subtitle,
        badge: draft.badge || undefined,
        copy: draft.copy || undefined,
        videoUrl: slide.videoUrl ?? "",
        storageId: slide.storageId,
        order: Number(draft.order),
        isActive: draft.isActive,
      });
      setStatus(
        language === "sr" ? "Slajd je azuriran." : "Slide has been updated."
      );
    } catch {
      setStatus(
        language === "sr" ? "Azuriranje slajda nije uspelo." : "Failed to update slide."
      );
    }
  };

  return (
    <section className={className}>
      <div className="mb-5 space-y-2">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title ?? dictionary.admin.title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          {description ?? dictionary.admin.subtitle}
        </p>
      </div>

      <div className="stagger-grid grid gap-3 sm:grid-cols-3">
        <article className="surface fx-lift rounded-2xl p-4" style={{ "--stagger-index": 0 } as CSSProperties}>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">{dictionary.admin.order}</p>
          <p className="mt-2 text-2xl font-semibold">{sortedSlides.length}</p>
        </article>
        <article className="surface fx-lift rounded-2xl p-4" style={{ "--stagger-index": 1 } as CSSProperties}>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">{dictionary.admin.active}</p>
          <p className="mt-2 text-2xl font-semibold">
            {sortedSlides.filter((slide) => slide.isActive).length}
          </p>
        </article>
        <article className="surface fx-lift rounded-2xl p-4" style={{ "--stagger-index": 2 } as CSSProperties}>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">MP4</p>
          <p className="mt-2 text-2xl font-semibold">{file ? "1" : "0"}</p>
        </article>
      </div>

      <form onSubmit={handleUpload} className="section-holo mt-6 grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4">
          <input
            className="control"
            placeholder={dictionary.admin.slideTitle}
            value={form.title}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, title: event.target.value }))
            }
            required
          />
          <input
            className="control"
            placeholder={dictionary.admin.slideSubtitle}
            value={form.subtitle}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, subtitle: event.target.value }))
            }
            required
          />
          <input
            className="control"
            placeholder={`${dictionary.admin.slideBadge} (${dictionary.admin.optional})`}
            value={form.badge}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, badge: event.target.value }))
            }
          />
          <textarea
            className="control"
            placeholder={`${dictionary.admin.slideCopy} (${dictionary.admin.optional})`}
            value={form.copy}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, copy: event.target.value }))
            }
          />
        </div>

        <div className="grid content-start gap-4">
          <label className="text-sm font-semibold">{dictionary.admin.uploadLabel}</label>
          <input
            type="file"
            accept="video/mp4"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            required
          />

          <div className="grid gap-4 sm:grid-cols-[150px_1fr] sm:items-center">
            <input
              type="number"
              min={1}
              className="control"
              value={form.order}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  order: Number(event.target.value),
                }))
              }
            />

            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    isActive: event.target.checked,
                  }))
                }
              />
              {dictionary.admin.active}
            </label>
          </div>

          <button type="submit" className="btn-primary w-full sm:w-fit">
            {dictionary.admin.save}
          </button>

          {status ? (
            <p className="rounded-xl border border-[var(--line)] bg-[var(--primary-soft)] px-4 py-3 text-sm">
              {status}
            </p>
          ) : null}
        </div>
      </form>

      <section className="mt-8">
        <h3 className="mb-4 text-xl font-semibold sm:text-2xl">{dictionary.admin.currentSlides}</h3>
        <div className="stagger-grid grid gap-4 md:grid-cols-2">
          {sortedSlides.map((slide, index) => (
            <article
              key={slide._id}
              className="surface fx-lift rounded-2xl p-4"
              style={{ "--stagger-index": index } as CSSProperties}
            >
              <p className="text-xs uppercase tracking-[0.1em] text-muted">
                {dictionary.admin.order}: {slide.order}
              </p>
              <div className="mt-3 grid gap-3">
                <input
                  className="control"
                  value={editingSlides[slide._id]?.title ?? slide.title}
                  onChange={(event) => onSlideDraftChange(slide._id, "title", event.target.value)}
                />
                <input
                  className="control"
                  value={editingSlides[slide._id]?.subtitle ?? slide.subtitle}
                  onChange={(event) =>
                    onSlideDraftChange(slide._id, "subtitle", event.target.value)
                  }
                />
                <input
                  className="control"
                  value={editingSlides[slide._id]?.badge ?? slide.badge ?? ""}
                  onChange={(event) => onSlideDraftChange(slide._id, "badge", event.target.value)}
                  placeholder={dictionary.admin.slideBadge}
                />
                <textarea
                  className="control"
                  value={editingSlides[slide._id]?.copy ?? slide.copy ?? ""}
                  onChange={(event) => onSlideDraftChange(slide._id, "copy", event.target.value)}
                  placeholder={dictionary.admin.slideCopy}
                />
                <div className="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-center">
                  <input
                    type="number"
                    min={1}
                    className="control"
                    value={editingSlides[slide._id]?.order ?? slide.order}
                    onChange={(event) =>
                      onSlideDraftChange(slide._id, "order", Number(event.target.value || "1"))
                    }
                  />
                  <label className="inline-flex items-center gap-2 text-sm text-muted">
                    <input
                      type="checkbox"
                      checked={editingSlides[slide._id]?.isActive ?? slide.isActive}
                      onChange={(event) =>
                        onSlideDraftChange(slide._id, "isActive", event.target.checked)
                      }
                    />
                    {dictionary.admin.active}
                  </label>
                </div>
                {slide.videoUrl ? (
                  <video
                    className="h-36 w-full rounded-xl border border-[var(--line)] object-cover"
                    src={slide.videoUrl}
                    muted
                    loop
                    playsInline
                  />
                ) : null}
                <button
                  type="button"
                  className="btn-secondary w-full !justify-center"
                  onClick={() => void saveExistingSlide(slide)}
                >
                  {language === "sr" ? "Sacuvaj izmene" : "Save changes"}
                </button>
              </div>
            </article>
          ))}
          {sortedSlides.length === 0 ? (
            <article className="surface rounded-2xl p-4 text-sm text-muted">
              {language === "sr"
                ? "Trenutno nema aktivnih slajdova. Dodaj prvi MP4 slajd da popunis hero sekciju."
                : "There are no active slides yet. Add your first MP4 slide to populate the hero section."}
            </article>
          ) : null}
        </div>
      </section>
    </section>
  );
}
