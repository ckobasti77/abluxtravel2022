"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import { TripSlide, useSlides } from "../../lib/use-slides";

const AUTO_ROTATE_MS = 7000;

export default function AranzmaniPage() {
  const fallbackSlides: TripSlide[] = useMemo(
    () => [
      {
        id: "antarctica",
        title: "Antarctica Aurora Grid",
        subtitle: "8 dana / 7 noci / privatni ledolomac",
        badge: "Ultra premium",
        copy: "Ledeni horizont i polarno nebo kao vanzemaljski bioskop.",
        videoUrl: "/videos/iceland.mp4",
      },
      {
        id: "namibia",
        title: "Namibia Red Dunes",
        subtitle: "6 dana / 5 noci / desert + stargazing",
        badge: "Small group",
        copy: "Crvene dine i nocno nebo bez svetlosnog zagadjenja.",
        videoUrl: "/videos/cappadocia.mp4",
      },
      {
        id: "azores",
        title: "Azores Ocean Lab",
        subtitle: "7 dana / 6 noci / termalna ostrva",
        badge: "Eco route",
        copy: "Vulkanska jezera, termalne lagune i okeanski vetar.",
        videoUrl: "/videos/amalfi.mp4",
      },
    ],
    []
  );

  const slides = useSlides(fallbackSlides);
  const deck = slides.length > 0 ? slides : fallbackSlides;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (deck.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % deck.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [deck.length]);
  const boundedActiveIndex =
    deck.length > 0 ? Math.min(activeIndex, deck.length - 1) : 0;
  const activeSlide = deck[boundedActiveIndex];

  return (
    <AlienShell>
      <section className="grid gap-7 pb-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-cyan-100/25 bg-cyan-100/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-cyan-100/90">
            Aranzmani Zona
          </p>
          <h1 className="max-w-xl text-4xl uppercase tracking-[0.14em] text-cyan-50 sm:text-5xl">
            Aranzmani koji izgledaju kao sci-fi signal.
          </h1>
          <p className="max-w-lg text-cyan-50/75">
            Trenutno prikazujemo kurirane ture, a backend je vec oslonjen na Convex
            da se ponuda kasnije puni i osvezava u realnom vremenu.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-cyan-100">
            <span className="rounded-full border border-cyan-100/30 bg-cyan-100/10 px-4 py-2">
              Live read model
            </span>
            <span className="rounded-full border border-cyan-100/30 bg-cyan-100/10 px-4 py-2">
              Convex ready
            </span>
            <span className="rounded-full border border-cyan-100/30 bg-cyan-100/10 px-4 py-2">
              Multi source plan
            </span>
          </div>
          <Link
            href="/ponuda"
            className="inline-flex rounded-full border border-cyan-100/35 px-6 py-3 text-xs uppercase tracking-[0.3em] text-cyan-100 transition hover:border-cyan-100/75"
          >
            Predji na Ponudu
          </Link>
        </div>

        <div className="alien-panel relative overflow-hidden rounded-3xl p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-100/20">
            {activeSlide.videoUrl ? (
              <video
                key={activeSlide.id}
                className="h-[320px] w-full object-cover sm:h-[420px]"
                src={activeSlide.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
              />
            ) : (
              <div className="h-[320px] w-full bg-gradient-to-br from-[#112035] via-[#102a4f] to-[#122855] sm:h-[420px]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030711ee] via-[#03071177] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">
                Aktivni Aranzman
              </p>
              <h2 className="mt-2 text-2xl uppercase tracking-[0.12em] text-cyan-50 sm:text-3xl">
                {activeSlide.title}
              </h2>
              <p className="mt-2 text-sm text-cyan-50/75">{activeSlide.subtitle}</p>
              {activeSlide.copy ? (
                <p className="mt-3 text-sm text-cyan-50/65">{activeSlide.copy}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 pb-4 md:grid-cols-3">
        {deck.map((slide, index) => (
          <button
            type="button"
            key={slide.id}
            onClick={() => setActiveIndex(index)}
            className={`rounded-2xl border p-4 text-left transition ${
              index === boundedActiveIndex
                ? "border-cyan-100/70 bg-cyan-100/12"
                : "border-cyan-100/20 bg-cyan-100/5 hover:border-cyan-100/45"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">
              Signal {index + 1}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-cyan-50">
              {slide.title}
            </p>
            {slide.badge ? (
              <p className="mt-2 text-xs text-cyan-50/65">{slide.badge}</p>
            ) : null}
          </button>
        ))}
      </section>
    </AlienShell>
  );
}
