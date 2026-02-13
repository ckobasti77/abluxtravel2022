"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { TripSlide, useSlides } from "../../lib/use-slides";

const AUTO_ROTATE_MS = 7000;

export default function AranzmaniPage() {
  const { dictionary, language } = useSitePreferences();

  const fallbackSlides: TripSlide[] = useMemo(
    () =>
      language === "sr"
        ? [
            {
              id: "hilandar",
              title: "Hilandar i sever Grcke",
              subtitle: "6 dana / verski program / grupni polazak",
              badge: "Verski turizam",
              copy: "Program sa pažljivo planiranom rutom, vodicem i podrškom tokom cele ture.",
              videoUrl: "/videos/iceland.mp4",
            },
            {
              id: "rim",
              title: "Rim i Vatikan",
              subtitle: "5 dana / gradski i kulturni program",
              badge: "Premium",
              copy: "Spoj istorijskih lokaliteta, organizovanih obilazaka i slobodnog vremena.",
              videoUrl: "/videos/amalfi.mp4",
            },
            {
              id: "kapadokija",
              title: "Kapadokija Experience",
              subtitle: "4 dana / mali broj putnika",
              badge: "Small group",
              copy: "Komforan tempo putovanja i unapred definisani kvalitet usluge.",
              videoUrl: "/videos/cappadocia.mp4",
            },
          ]
        : [
            {
              id: "hilandar",
              title: "Hilandar and Northern Greece",
              subtitle: "6 days / religious program / group departure",
              badge: "Religious tourism",
              copy: "A carefully planned route with guidance and full support throughout the trip.",
              videoUrl: "/videos/iceland.mp4",
            },
            {
              id: "rome",
              title: "Rome and Vatican",
              subtitle: "5 days / city and cultural program",
              badge: "Premium",
              copy: "A mix of historic landmarks, guided visits, and well-balanced free time.",
              videoUrl: "/videos/amalfi.mp4",
            },
            {
              id: "cappadocia",
              title: "Cappadocia Experience",
              subtitle: "4 days / limited group size",
              badge: "Small group",
              copy: "Comfortable pace and a clear service-quality standard for each traveler.",
              videoUrl: "/videos/cappadocia.mp4",
            },
          ],
    [language]
  );

  const slides = useSlides(fallbackSlides);
  const deck = slides.length > 0 ? slides : fallbackSlides;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (deck.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % deck.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [deck.length]);

  const safeIndex = Math.min(activeIndex, Math.max(deck.length - 1, 0));
  const activeSlide = deck[safeIndex];

  return (
    <AlienShell className="site-fade">
      <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div className="space-y-5">
          <span className="pill">{dictionary.arrangements.badge}</span>
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
            {dictionary.arrangements.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted">
            {dictionary.arrangements.description}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="surface rounded-2xl p-4 text-sm font-medium">
              {dictionary.arrangements.trackA}
            </article>
            <article className="surface rounded-2xl p-4 text-sm font-medium">
              {dictionary.arrangements.trackB}
            </article>
            <article className="surface rounded-2xl p-4 text-sm font-medium">
              {dictionary.arrangements.trackC}
            </article>
          </div>

          <Link href="/ponuda" className="btn-primary">
            {dictionary.arrangements.openOffers}
          </Link>
        </div>

        <article className="surface overflow-hidden rounded-3xl p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-2xl">
            {activeSlide?.videoUrl ? (
              <video
                key={activeSlide.id}
                className="h-80 w-full object-cover sm:h-[420px]"
                src={activeSlide.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
              />
            ) : (
              <div className="h-80 w-full bg-[linear-gradient(135deg,#1f3a70,#133050)] sm:h-[420px]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                {dictionary.arrangements.active}
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{activeSlide?.title}</h2>
              <p className="mt-2 text-sm text-white/80">{activeSlide?.subtitle}</p>
              {activeSlide?.copy ? (
                <p className="mt-3 text-sm text-white/75">{activeSlide.copy}</p>
              ) : null}
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        {deck.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`surface rounded-2xl p-4 text-left transition ${
              index === safeIndex
                ? "border-[color:var(--primary)] bg-[var(--primary-soft)]"
                : "hover:border-[color:var(--primary)]"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {dictionary.arrangements.signal} {index + 1}
            </p>
            <h3 className="mt-2 text-base font-semibold">{slide.title}</h3>
            {slide.badge ? <p className="mt-2 text-sm text-muted">{slide.badge}</p> : null}
          </button>
        ))}
      </section>
    </AlienShell>
  );
}

