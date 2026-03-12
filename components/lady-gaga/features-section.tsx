"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ─── */
export type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export type FeaturesProps = {
  badge?: string;
  heading?: string;
  features?: FeatureItem[];
};

/* ── Elegant minimal SVG icons ── */
const DiamondIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M14 2L26 14L14 26L2 14Z" />
    <path d="M7 8h14l-7 16L7 8z" opacity="0.3" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M14 3L4 7v7c0 5.5 4.3 10.6 10 12 5.7-1.4 10-6.5 10-12V7L14 3z" />
    <path d="M10 14l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SparkleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M14 2v24M2 14h24M6 6l16 16M22 6L6 22" strokeLinecap="round" />
    <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.15" />
  </svg>
);
const HeartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M14 24S3 17 3 10a5.5 5.5 0 0 1 11 0 5.5 5.5 0 0 1 11 0c0 7-11 14-11 14z" />
  </svg>
);

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: "preciznost",
    title: "Precizna dijagnostika",
    description:
      "Svaki tretman kreće pažljivom analizom strukture kose, kako bismo primenili tačno ono što vama treba.",
    icon: <DiamondIcon />,
  },
  {
    id: "bezbednost",
    title: "Bezbednost i kvalitet",
    description:
      "Koristimo isključivo profesionalne proizvode i proverene metode za dugotrajan rezultat.",
    icon: <ShieldIcon />,
  },
  {
    id: "personalizacija",
    title: "Personalizovan pristup",
    description:
      "Svaka klijentkinja dobija plan nege prilagođen njenom tipu kose, životnom stilu i željama.",
    icon: <SparkleIcon />,
  },
  {
    id: "strast",
    title: "Strast prema lepoti",
    description:
      "Ovo nije samo posao — to je naša strast. Svaka transformacija je umetnički izraz.",
    icon: <HeartIcon />,
  },
];

/* ═══════════════════════════════════════════════════
   FeaturesSection
   4-column grid of feature cards with icon, title,
   and description. Clean, minimal, premium feel.
   ═══════════════════════════════════════════════════ */
export default function FeaturesSection(props: FeaturesProps) {
  const {
    badge = "Zašto mi",
    heading = "Preciznost, bezbednost i personalizovan plan za svaku klijentkinju",
    features = DEFAULT_FEATURES,
  } = props;

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current!.querySelector("[data-header]");
      if (header) {
        gsap.fromTo(
          header.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: header,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const cards = cardsRef.current.filter(Boolean);
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current!.querySelector("[data-cards]"),
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
      ref={sectionRef}
      className="px-6 py-20 sm:px-10 sm:py-28 lg:py-32"
      style={{ backgroundColor: "var(--studio-surface)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Header ── */}
        <div data-header className="mb-16 text-center lg:mb-20">
          <span
            className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase"
            style={{
              color: "var(--studio-gold)",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
          >
            {badge}
          </span>
          <h2
            className="mx-auto mt-5 max-w-2xl text-3xl font-light leading-snug tracking-wide sm:text-4xl"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              color: "var(--studio-text)",
            }}
          >
            {heading}
          </h2>
        </div>

        {/* ── Cards grid ── */}
        <div
          data-cards
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, i) => (
            <div
              key={feature.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="text-center"
            >
              {/* Icon circle */}
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--studio-bg-warm)",
                  color: "var(--studio-gold)",
                }}
              >
                {feature.icon}
              </div>

              <h3
                className="mt-6 text-lg font-normal tracking-wide"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--studio-text)",
                }}
              >
                {feature.title}
              </h3>

              <p
                className="mt-3 text-[13px] leading-relaxed tracking-wide"
                style={{
                  color: "var(--studio-muted)",
                  fontFamily: "var(--font-manrope), sans-serif",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
