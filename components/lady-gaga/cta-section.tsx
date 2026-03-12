"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Props ─── */
export type CtaProps = {
  heading?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  phone?: string;
  address?: string;
  workingHours?: string;
};

const DEFAULTS: Required<CtaProps> = {
  heading: "Zakažite vaš termin",
  subtitle:
    "Pozovite nas ili pošaljite poruku — rado ćemo pronaći savršen termin za vas.",
  ctaLabel: "Pozovite nas",
  ctaHref: "tel:+38111234567",
  phone: "+381 11 234 567",
  address: "Beograd, Srbija",
  workingHours: "Pon–Sub: 09:00 – 20:00",
};

/* ═══════════════════════════════════════════════════
   CtaSection
   Elegant call-to-action with contact information.
   Warm background, centered layout.
   ═══════════════════════════════════════════════════ */
export default function CtaSection(props: CtaProps) {
  const p = { ...DEFAULTS, ...props };
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current!.querySelectorAll("[data-reveal]");
      gsap.fromTo(
        els,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      className="px-6 py-24 sm:px-10 sm:py-32 lg:py-40"
      style={{ backgroundColor: "var(--studio-bg-warm)" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        {/* Gold ornament */}
        <div data-reveal className="mx-auto mb-8 flex items-center justify-center gap-4">
          <span
            className="h-[1px] w-8"
            style={{ backgroundColor: "var(--studio-gold-light)" }}
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ color: "var(--studio-gold)" }}
          >
            <path
              d="M10 1l2.5 6.5L19 10l-6.5 2.5L10 19l-2.5-6.5L1 10l6.5-2.5L10 1z"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
          <span
            className="h-[1px] w-8"
            style={{ backgroundColor: "var(--studio-gold-light)" }}
          />
        </div>

        <h2
          data-reveal
          className="text-3xl font-light leading-snug tracking-wide sm:text-4xl lg:text-5xl"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--studio-text)",
          }}
        >
          {p.heading}
        </h2>

        <p
          data-reveal
          className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed tracking-wide"
          style={{
            color: "var(--studio-muted)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
        >
          {p.subtitle}
        </p>

        {/* CTA Button */}
        <div data-reveal className="mt-10">
          <a
            href={p.ctaHref}
            className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-[13px] font-semibold tracking-[0.2em] uppercase text-white transition-all duration-400"
            style={{
              backgroundColor: "var(--studio-gold)",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--studio-gold-dark)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(184, 149, 106, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--studio-gold)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            {p.ctaLabel}
          </a>
        </div>

        {/* Contact details */}
        <div
          data-reveal
          className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8"
        >
          <span
            className="text-[13px] tracking-wide"
            style={{
              color: "var(--studio-muted)",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
          >
            {p.phone}
          </span>
          <span
            className="hidden h-4 w-[1px] sm:block"
            style={{ backgroundColor: "var(--studio-line)" }}
          />
          <span
            className="text-[13px] tracking-wide"
            style={{
              color: "var(--studio-muted)",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
          >
            {p.address}
          </span>
          <span
            className="hidden h-4 w-[1px] sm:block"
            style={{ backgroundColor: "var(--studio-line)" }}
          />
          <span
            className="text-[13px] tracking-wide"
            style={{
              color: "var(--studio-muted)",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
          >
            {p.workingHours}
          </span>
        </div>
      </div>
    </section>
  );
}
