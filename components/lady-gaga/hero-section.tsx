"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Props ─── */
export type HeroProps = {
  /** Large hero image URL */
  image: string;
  /** Main heading — line 1 */
  headingLine1?: string;
  /** Main heading — line 2 */
  headingLine2?: string;
  /** Subtitle / tagline */
  subtitle?: string;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA link */
  ctaHref?: string;
};

const DEFAULTS: Required<HeroProps> = {
  image: "/placeholder-hero.jpg",
  headingLine1: "Lepota i",
  headingLine2: "transformacija",
  subtitle:
    "Studio Lady Gaga — dugogodišnje iskustvo u profesionalnoj nezi kose, farbanju i stilizovanju.",
  ctaLabel: "Zakažite termin",
  ctaHref: "#kontakt",
};

/* ═══════════════════════════════════════════════════
   HeroSection
   Full-viewport hero with split layout on desktop.
   GSAP: staggered text reveal, image parallax,
   and subtle scale-in for the image.
   ═══════════════════════════════════════════════════ */
export default function HeroSection(props: HeroProps) {
  const p = { ...DEFAULTS, ...props };

  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const dividerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* ── Skip animations if user prefers reduced motion ── */
      if (prefersReduced) {
        gsap.set(
          [
            line1Ref.current,
            line2Ref.current,
            subtitleRef.current,
            ctaRef.current,
            dividerRef.current,
            imageRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, clipPath: "none" }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* ── Image reveal: clip + scale ── */
      tl.fromTo(
        imageRef.current,
        {
          clipPath: "inset(100% 0 0 0)",
          scale: 1.15,
        },
        {
          clipPath: "inset(0% 0 0 0)",
          scale: 1,
          duration: 1.4,
          ease: "power4.inOut",
        },
        0
      );

      /* ── Gold divider line ── */
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
        0.4
      );

      /* ── Heading line 1 ── */
      tl.fromTo(
        line1Ref.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.3
      );

      /* ── Heading line 2 ── */
      tl.fromTo(
        line2Ref.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.45
      );

      /* ── Subtitle ── */
      tl.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.7
      );

      /* ── CTA button ── */
      tl.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.9
      );

      /* ── Parallax on scroll ── */
      if (imageWrapRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col overflow-hidden lg:flex-row"
      style={{ backgroundColor: "var(--studio-bg)" }}
    >
      {/* ═══ Left: Text Content ═══ */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-32 pb-16 sm:px-10 lg:px-16 lg:pt-0 lg:pb-0 xl:px-24">
        {/* Gold accent divider */}
        <span
          ref={dividerRef}
          className="mb-8 block h-[1px] w-16 origin-left"
          style={{ backgroundColor: "var(--studio-gold)" }}
        />

        {/* Heading */}
        <h1
          className="overflow-hidden"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          <span
            ref={line1Ref}
            className="block text-5xl font-light leading-[1.1] tracking-wide sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ color: "var(--studio-text)" }}
          >
            {p.headingLine1}
          </span>
          <span
            ref={line2Ref}
            className="mt-1 block text-5xl font-light leading-[1.1] tracking-wide sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ color: "var(--studio-gold)" }}
          >
            {p.headingLine2}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-8 max-w-md text-[15px] leading-relaxed tracking-wide lg:text-base"
          style={{
            color: "var(--studio-muted)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
        >
          {p.subtitle}
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href={p.ctaHref}
          className="group mt-10 inline-flex w-fit items-center gap-3 rounded-full border px-8 py-3.5 text-[12px] font-semibold tracking-[0.2em] uppercase transition-all duration-400"
          style={{
            borderColor: "var(--studio-gold)",
            color: "var(--studio-gold)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--studio-gold)";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.boxShadow =
              "0 8px 30px rgba(184, 149, 106, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--studio-gold)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {p.ctaLabel}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* ═══ Right: Hero Image ═══ */}
      <div
        ref={imageWrapRef}
        className="relative flex-1 overflow-hidden lg:min-h-screen"
        style={{ minHeight: "50vh" }}
      >
        <div
          ref={imageRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${p.image})`,
            willChange: "transform",
          }}
        />

        {/* Soft gradient overlay on bottom for mobile readability */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(to bottom, var(--studio-bg) 0%, transparent 30%)",
          }}
        />

        {/* Soft vignette on left edge for desktop blend */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, var(--studio-bg) 0%, transparent 15%)",
          }}
        />
      </div>

      {/* ═══ Scroll indicator ═══ */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span
          className="text-[10px] font-medium tracking-[0.25em] uppercase"
          style={{
            color: "var(--studio-muted)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
        >
          Skrolujte
        </span>
        <span
          className="block h-10 w-[1px] animate-pulse"
          style={{ backgroundColor: "var(--studio-gold-light)" }}
        />
      </div>
    </section>
  );
}
