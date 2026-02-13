"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { getSession } from "../../lib/local-auth";

type SlideForm = {
  title: string;
  subtitle: string;
  badge: string;
  copy: string;
  order: number;
  isActive: boolean;
};

type SlideRecord = Doc<"slides"> & { videoUrl: string | null };

export default function AdminPage() {
  const { dictionary } = useSitePreferences();
  const session = getSession();

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

  if (!session || session.role !== "admin") {
    return (
      <AlienShell className="site-fade">
        <section className="mx-auto max-w-2xl">
          <article className="surface rounded-3xl p-8 text-center">
            <h1 className="text-3xl font-semibold">{dictionary.admin.accessTitle}</h1>
            <p className="mt-3 text-sm text-muted">{dictionary.admin.accessDescription}</p>
            <Link href="/signin" className="btn-primary mt-6">
              {dictionary.admin.signIn}
            </Link>
          </article>
        </section>
      </AlienShell>
    );
  }

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
        badge: form.badge ? form.badge : undefined,
        copy: form.copy ? form.copy : undefined,
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
    <AlienShell className="site-fade">
      <section>
        <h1 className="text-4xl font-semibold">{dictionary.admin.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{dictionary.admin.subtitle}</p>
      </section>

      <section className="mt-8">
        <form
          onSubmit={handleUpload}
          className="surface grid gap-6 rounded-3xl p-5 sm:p-6 lg:grid-cols-2"
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

          <div className="grid gap-4">
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
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">{dictionary.admin.currentSlides}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sortedSlides.map((slide) => (
            <article key={slide._id} className="surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.1em] text-muted">
                {dictionary.admin.order}: {slide.order}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{slide.title}</h3>
              <p className="text-sm text-muted">{slide.subtitle}</p>
              {slide.badge ? (
                <span className="mt-3 inline-flex rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-3 py-1 text-xs">
                  {slide.badge}
                </span>
              ) : null}
              {slide.copy ? <p className="mt-3 text-sm text-muted">{slide.copy}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </AlienShell>
  );
}

