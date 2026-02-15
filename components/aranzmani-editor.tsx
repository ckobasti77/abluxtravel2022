"use client";

import { useMemo, useState } from "react";
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
  const { dictionary } = useSitePreferences();
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

  const slides = useQuery(api.slides.list) as SlideRecord[] | undefined;
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const upsert = useMutation(api.slides.upsert);

  const sortedSlides = useMemo(() => {
    if (!slides) return [];
    return [...slides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [slides]);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <section className={className}>
      <div className="mb-5 space-y-2">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title ?? dictionary.admin.title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          {description ?? dictionary.admin.subtitle}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="surface rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">{dictionary.admin.order}</p>
          <p className="mt-2 text-2xl font-semibold">{sortedSlides.length}</p>
        </article>
        <article className="surface rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">{dictionary.admin.active}</p>
          <p className="mt-2 text-2xl font-semibold">
            {sortedSlides.filter((slide) => slide.isActive).length}
          </p>
        </article>
        <article className="surface rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">MP4</p>
          <p className="mt-2 text-2xl font-semibold">{file ? "1" : "0"}</p>
        </article>
      </div>

      <form
        onSubmit={handleUpload}
        className="surface mt-6 grid gap-6 rounded-3xl border border-[var(--line)] p-5 sm:p-6 xl:grid-cols-[1.15fr_0.85fr]"
      >
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
        <div className="grid gap-4 md:grid-cols-2">
          {sortedSlides.map((slide) => (
            <article key={slide._id} className="surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.1em] text-muted">
                {dictionary.admin.order}: {slide.order}
              </p>
              <h4 className="mt-2 text-lg font-semibold">{slide.title}</h4>
              <p className="text-sm text-muted">{slide.subtitle}</p>
              {slide.badge ? (
                <span className="mt-3 inline-flex rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-3 py-1 text-xs">
                  {slide.badge}
                </span>
              ) : null}
              {slide.copy ? <p className="mt-3 text-sm text-muted">{slide.copy}</p> : null}
            </article>
          ))}
          {sortedSlides.length === 0 ? (
            <article className="surface rounded-2xl p-4 text-sm text-muted">
              Trenutno nema aktivnih slajdova. Dodaj prvi MP4 slajd da popunis hero.
            </article>
          ) : null}
        </div>
      </section>
    </section>
  );
}
