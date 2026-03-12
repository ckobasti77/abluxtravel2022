"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Props ─── */
export type IntroProps = {
  badge?: string;
  heading?: string;
  paragraph?: string;
};

const DEFAULTS: Required<IntroProps> = {
  badge: "O nama",
  heading: "Prostor gde se lepota neguje sa pažnjom i strašću",
  paragraph:
    "Studio Lady Gaga je mesto gde se profesionalnost spaja sa toplinom. Sa dugogodišnjim iskustvom u frizerstvu, koloraciji i nezi kose, posvećeni smo svakoj klijentkinji pojedinačno — jer verujemo da prava lepota počinje sa pažnjom.",
};

/* ═══════════════════════════════════════════════════
   IntroSection
   Centered philosophy statement with generous spacing.
   GSAP: fade-up on scroll with stagger.
   ═══════════════════════════════════════════════════ */
export default function IntroSection(props: IntroProps) {
  const p = { ...DEFAULTS, ...props };
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current!.querySelectorAll("[data-reveal]");

      gsap.fromTo(
        els,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
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
      id="o-nama"
      ref={sectionRef}
      className="px-6 py-24 sm:px-10 sm:py-32 lg:py-40"
      style={{ backgroundColor: "var(--studio-bg)" }}
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* Badge */}
        <span
          data-reveal
          className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase"
          style={{
            color: "var(--studio-gold)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
        >
          {p.badge}
        </span>

        {/* Divider */}
        <span
          data-reveal
          className="mx-auto mt-5 mb-8 block h-[1px] w-12"
          style={{ backgroundColor: "var(--studio-gold-light)" }}
        />

        {/* Heading */}
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

        {/* Paragraph */}
        <p
          data-reveal
          className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed tracking-wide"
          style={{
            color: "var(--studio-muted)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
        >
          {p.paragraph}
        </p>
      </div>
    </section>
  );
}
