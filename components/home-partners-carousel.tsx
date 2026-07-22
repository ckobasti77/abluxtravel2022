"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSitePreferences } from "./site-preferences-provider";

gsap.registerPlugin(ScrollTrigger);

/* ── Partner logos ── */
const PARTNER_LOGOS = Array.from({ length: 17 }, (_, i) => ({
  id: `partner-${String(i + 1).padStart(2, "0")}`,
  src: `/partners/partner-${String(i + 1).padStart(2, "0")}.png`,
  alt: `Partner ${i + 1}`,
}));

export default function HomePartnersCarousel() {
  const { dictionary } = useSitePreferences();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* ── GSAP scroll-triggered entry ── */
  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".partners-header",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".partners-track-wrap",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 0.25,
          ease: "power2.out",
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

  /* ── Pause on hover ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const pause = () => track.style.animationPlayState = "paused";
    const play = () => track.style.animationPlayState = "running";

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", play);
    return () => {
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", play);
    };
  }, []);

  return (
    <section ref={sectionRef} className="partners-section mt-24">
      {/* ── Header ── */}
      <div className="partners-header">
        <span className="pill">{dictionary.home.partnersBadge}</span>
        <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">
          {dictionary.home.partnersTitle}
        </h2>
      </div>

      {/* ── Carousel ── */}
      <div className="partners-track-wrap mt-10">
        <div ref={trackRef} className="partners-track" aria-label="Partner logos">
          {/* Original set */}
          {PARTNER_LOGOS.map((logo) => (
            <div key={logo.id} className="partners-logo">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={100}
                className="partners-logo__img"
                sizes="160px"
              />
            </div>
          ))}
          {/* Clone for seamless loop */}
          {PARTNER_LOGOS.map((logo) => (
            <div key={`${logo.id}-clone`} className="partners-logo" aria-hidden="true">
              <Image
                src={logo.src}
                alt=""
                width={200}
                height={100}
                className="partners-logo__img"
                sizes="160px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
