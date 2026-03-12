"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ─── */
export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
};

export type GalleryProps = {
  badge?: string;
  heading?: string;
  subtitle?: string;
  images?: GalleryImage[];
};

const PLACEHOLDER_IMAGES: GalleryImage[] = [
  { id: "1", src: "/placeholder-gallery-1.jpg", alt: "Transformacija kose 1" },
  { id: "2", src: "/placeholder-gallery-2.jpg", alt: "Transformacija kose 2" },
  { id: "3", src: "/placeholder-gallery-3.jpg", alt: "Transformacija kose 3" },
  { id: "4", src: "/placeholder-gallery-4.jpg", alt: "Transformacija kose 4" },
  { id: "5", src: "/placeholder-gallery-5.jpg", alt: "Transformacija kose 5" },
  { id: "6", src: "/placeholder-gallery-6.jpg", alt: "Transformacija kose 6" },
  { id: "7", src: "/placeholder-gallery-7.jpg", alt: "Transformacija kose 7" },
  { id: "8", src: "/placeholder-gallery-8.jpg", alt: "Transformacija kose 8" },
];

/* ═══════════════════════════════════════════════════
   GallerySection
   Masonry-style image grid showcasing transformations.
   GSAP: stagger fade-in with slight Y offset.
   Images have subtle hover scale + shadow.
   ═══════════════════════════════════════════════════ */
export default function GallerySection(props: GalleryProps) {
  const {
    badge = "Galerija",
    heading = "Najnovije transformacije",
    subtitle = "Snimci koji prikazuju teksturu, sjaj i finalni finish u pokretu.",
    images = PLACEHOLDER_IMAGES,
  } = props;

  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* ── Header ── */
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

      /* ── Gallery items ── */
      const items = itemsRef.current.filter(Boolean);
      gsap.fromTo(
        items,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current!.querySelector("[data-grid]"),
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Masonry-like: alternate tall/short items ── */
  const getAspect = (i: number): string => {
    const pattern = [
      "3/4",   // tall
      "4/3",   // wide
      "1/1",   // square
      "3/4",   // tall
      "4/3",   // wide
      "3/4",   // tall
      "1/1",   // square
      "4/3",   // wide
    ];
    return pattern[i % pattern.length];
  };

  return (
    <section
      id="galerija"
      ref={sectionRef}
      className="px-6 py-20 sm:px-10 sm:py-28 lg:py-32"
      style={{ backgroundColor: "var(--studio-bg)" }}
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
          <p
            className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed tracking-wide"
            style={{
              color: "var(--studio-muted)",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* ── Masonry Grid ── */}
        <div
          data-grid
          className="columns-2 gap-4 sm:columns-3 lg:columns-4"
          style={{ columnGap: "16px" }}
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="group mb-4 overflow-hidden rounded-xl break-inside-avoid"
            >
              <div
                className="bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{
                  backgroundImage: `url(${img.src})`,
                  aspectRatio: getAspect(i),
                  backgroundColor: "var(--studio-bg-accent)",
                }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>

        {/* ── "See all" link ── */}
        <div className="mt-14 text-center">
          <a
            href="#galerija"
            className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300"
            style={{
              color: "var(--studio-gold)",
              fontFamily: "var(--font-manrope), sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--studio-gold-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--studio-gold)")
            }
          >
            Pogledajte celu galeriju
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
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
      </div>
    </section>
  );
}
