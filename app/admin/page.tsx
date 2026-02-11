"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { getSession } from "../../lib/local-auth";
import { Doc, Id } from "../../convex/_generated/dataModel";

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
      <div className="min-h-screen bg-[#0b0f14] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 text-center">
          <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]">
            Admin Access
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Pristup imaju samo admin korisnici.
          </p>
          <Link
            href="/signin"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-xs uppercase tracking-[0.35em]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setStatus("Izaberi MP4 fajl.");
      return;
    }
    setStatus("Upload u toku...");
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
        throw new Error("Upload nije uspeo.");
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
      setStatus("Slajd sacuvan.");
      setForm({
        title: "",
        subtitle: "",
        badge: "",
        copy: "",
        order: (sortedSlides.length || 0) + 1,
        isActive: true,
      });
      setFile(null);
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : "Doslo je do greske."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <div>
          <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]">
            Admin · A.B.Lux travel 2022
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Upload MP4, naslov, podnaslov i opis za slajdove.
          </p>
        </div>

        <form
          onSubmit={handleUpload}
          className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2"
        >
          <div className="flex flex-col gap-4">
            <input
              className="h-12 rounded-xl border border-white/20 bg-white/5 px-4 text-sm outline-none transition focus:border-white/60"
              placeholder="Naslov"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
            <input
              className="h-12 rounded-xl border border-white/20 bg-white/5 px-4 text-sm outline-none transition focus:border-white/60"
              placeholder="Podnaslov"
              value={form.subtitle}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, subtitle: event.target.value }))
              }
              required
            />
            <textarea
              className="h-28 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/60"
              placeholder="Opis (opciono)"
              value={form.copy}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, copy: event.target.value }))
              }
            />
            <input
              className="h-12 rounded-xl border border-white/20 bg-white/5 px-4 text-sm outline-none transition focus:border-white/60"
              placeholder="Badge nocenja (npr. 4 nocenja)"
              value={form.badge}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, badge: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
              <span>MP4 snimak</span>
              <input
                type="file"
                accept="video/mp4"
                className="text-sm"
                onChange={(event) =>
                  setFile(event.target.files?.[0] ?? null)
                }
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                className="h-12 w-28 rounded-xl border border-white/20 bg-white/5 px-4 text-sm outline-none transition focus:border-white/60"
                value={form.order}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    order: Number(event.target.value),
                  }))
                }
              />
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                />
                Aktivno
              </label>
            </div>
            <button
              type="submit"
              className="mt-2 h-12 rounded-xl border border-white/40 text-xs uppercase tracking-[0.35em] transition hover:border-white"
            >
              Sacuvaj slajd
            </button>
            {status ? <p className="text-sm text-white/70">{status}</p> : null}
          </div>
        </form>

        <div className="grid gap-4">
          <h2 className="text-sm uppercase tracking-[0.3em] text-white/60">
            Trenutni slajdovi
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedSlides.map((slide) => (
              <div
                key={slide._id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Redosled: {slide.order}
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {slide.title}
                </div>
                <div className="text-sm text-white/70">{slide.subtitle}</div>
                {slide.badge ? (
                  <div className="mt-2 inline-flex rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                    {slide.badge}
                  </div>
                ) : null}
                {slide.copy ? (
                  <div className="mt-2 text-sm text-white/60">
                    {slide.copy}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
