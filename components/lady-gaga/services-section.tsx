"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ─── */
export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type ServicesProps = {
  badge?: string;
  heading?: string;
  services?: ServiceItem[];
};

const PLACEHOLDER_SERVICES: ServiceItem[] = [
  {
    id: "koloracija",
    title: "Koloracija i korekcija boje",
    description: "Kreativno farbanje, balayage, ombré i korekcija nijansi.",
    image: "/placeholder-service-1.jpg",
  },
  {
    id: "sisanje",
    title: "Šišanje i stilizovanje",
    description: "Moderna i klasična šišanja prilagođena vašem licu.",
    image: "/placeholder-service-2.jpg",
  },
  {
    id: "nega",
    title: "Dubinska nega kose",
    description: "Keratinski tretmani, botoks za kosu i obnova strukture.",
    image: "/placeholder-service-3.jpg",
  },
  {
    id: "svecane",
    title: "Svečane i izvorne frizure",
    description: "Savršene frizure za venčanja, proslave i specijalne prilike.",
    image: "/placeholder-service-4.jpg",
  },
  {
    id: "konsultacije",
    title: "Konsultacije i rutina",
    description: "Personalizovani plan nege i preporuke proizvoda za vas.",
    image: "/placeholder-service-5.jpg",
  },
  {
    id: "oporavak",
    title: "Oporavak oštećene kose",
    description: "Intenzivni program za suvu, lomljivu i hemijski tretiranau kosu.",
    image: "/placeholder-service-6.jpg",
  },
];

/* ═══════════════════════════════════════════════════
   ServicesSection
   2×3 grid of large service images with hover overlay.
   GSAP: stagger fade-in-up on scroll.
   ═══════════════════════════════════════════════════ */
export default function ServicesSection(props: ServicesProps) {
  const {
    badge = "Naše usluge",
    heading = "Svaka usluga, osmišljena za vas",
    services = PLACEHOLDER_SERVICES,
  } = props;

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* ── Header reveal ── */
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

      /* ── Cards stagger ── */
      const cards = cardsRef.current.filter(Boolean);
      gsap.fromTo(
        cards,
        { y: 70, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="usluge"
      ref={sectionRef}
      className="px-6 py-20 sm:px-10 sm:py-28 lg:py-32"
      style={{ backgroundColor: "var(--studio-bg-warm)" }}
    >
      <div className="mx-auto max-w-7xl">
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
            className="mt-5 text-3xl font-light leading-snug tracking-wide sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              color: "var(--studio-text)",
            }}
          >
            {heading}
          </h2>
        </div>

        {/* ── Grid ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={service.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${service.image})` }}
              />

              {/* Default gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(to top, rgba(26,23,20,0.7) 0%, transparent 50%)",
                }}
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ backgroundColor: "rgba(26, 23, 20, 0.65)" }}
              >
                <p
                  className="max-w-xs text-[14px] leading-relaxed tracking-wide text-white/80"
                  style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                >
                  {service.description}
                </p>
                <span
                  className="mt-5 inline-block h-[1px] w-10"
                  style={{ backgroundColor: "var(--studio-gold)" }}
                />
              </div>

              {/* Title (always visible at bottom) */}
              <div className="absolute right-0 bottom-0 left-0 p-6">
                <h3
                  className="text-xl font-light tracking-wide text-white sm:text-2xl"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
