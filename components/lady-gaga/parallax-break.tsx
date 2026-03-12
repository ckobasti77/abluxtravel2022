"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Props ─── */
export type ParallaxBreakProps = {
  image: string;
  quote?: string;
  author?: string;
};

const DEFAULTS: Required<ParallaxBreakProps> = {
  image: "/placeholder-parallax.jpg",
  quote: "Svaki detalj tretmana je planiran da rezultat izgleda luksuozno i ostane zdrav dugoročno.",
  author: "— Studio Lady Gaga",
};

/* ═══════════════════════════════════════════════════
   ParallaxBreak
   Full-width parallax image divider with optional
   centered quote overlay. Premium visual pause.
   ═══════════════════════════════════════════════════ */
export default function ParallaxBreak(props: ParallaxBreakProps) {
  const p = { ...DEFAULTS, ...props };
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* ── Parallax ── */
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      /* ── Text reveal ── */
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "70vh", minHeight: "400px" }}
    >
      {/* Background image */}
      <div
        ref={imageRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${p.image})`,
          top: "-20%",
          height: "140%",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(26, 23, 20, 0.55)" }}
      />

      {/* Content */}
      <div
        ref={textRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <span
          className="mb-6 block h-[1px] w-16"
          style={{ backgroundColor: "var(--studio-gold)" }}
        />
        <blockquote
          className="max-w-2xl text-2xl font-light leading-relaxed tracking-wide text-white sm:text-3xl lg:text-4xl"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          &ldquo;{p.quote}&rdquo;
        </blockquote>
        <cite
          className="mt-6 text-[12px] font-medium not-italic tracking-[0.25em] uppercase text-white/60"
          style={{ fontFamily: "var(--font-manrope), sans-serif" }}
        >
          {p.author}
        </cite>
      </div>
    </section>
  );
}
