"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useSitePreferences } from "./site-preferences-provider";

type GalleryCard = {
  id: string;
  title: string;
  caption: string;
  src: string;
  accent: string;
};

type GalleryContent = {
  badge: string;
  title: string;
  description: string;
  cards: GalleryCard[];
};

const ORBIT_CONTENT: Record<"sr" | "en", GalleryContent> = {
  sr: {
    badge: "Immersive scroll sekcija",
    title: "Slike ulaze i izlaze kroz centar dok skrolujes",
    description:
      "Editorial storytelling + motion depth + glass layer: svaka scena prolazi kroz fokusnu tacku ekrana i pravi cinematic osecaj kretanja.",
    cards: [
      {
        id: "pilgrimage",
        title: "Sveti gradovi i hodocasca",
        caption: "Curated Journey 01",
        src: "/home-swiper/20251120_155602.jpg",
        accent: "#67e8f9",
      },
      {
        id: "coast",
        title: "Leto bez kompromisa",
        caption: "Curated Journey 02",
        src: "/home-swiper/20251120_160325.jpg",
        accent: "#f0abfc",
      },
      {
        id: "north",
        title: "Polarni premium ritam",
        caption: "Curated Journey 03",
        src: "/home-swiper/20251213_144248.jpg",
        accent: "#93c5fd",
      },
      {
        id: "desert",
        title: "Pustinjski minimalizam",
        caption: "Curated Journey 04",
        src: "/home-swiper/20251213_144402.jpg",
        accent: "#fb7185",
      },
      {
        id: "city",
        title: "Neonske gradske ture",
        caption: "Curated Journey 05",
        src: "/home-swiper/20251229_233453.jpg",
        accent: "#34d399",
      },
    ],
  },
  en: {
    badge: "Immersive scroll section",
    title: "Images enter and exit through the center while you scroll",
    description:
      "Editorial storytelling + motion depth + glass layers: each frame crosses the center focus point for a cinematic browsing rhythm.",
    cards: [
      {
        id: "pilgrimage",
        title: "Sacred cities and pilgrimages",
        caption: "Curated Journey 01",
        src: "/home-swiper/20251120_155602.jpg",
        accent: "#67e8f9",
      },
      {
        id: "coast",
        title: "Summer without compromise",
        caption: "Curated Journey 02",
        src: "/home-swiper/20251120_160325.jpg",
        accent: "#f0abfc",
      },
      {
        id: "north",
        title: "Nordic premium tempo",
        caption: "Curated Journey 03",
        src: "/home-swiper/20251213_144248.jpg",
        accent: "#93c5fd",
      },
      {
        id: "desert",
        title: "Desert minimalism",
        caption: "Curated Journey 04",
        src: "/home-swiper/20251213_144402.jpg",
        accent: "#fb7185",
      },
      {
        id: "city",
        title: "Neon city circuits",
        caption: "Curated Journey 05",
        src: "/home-swiper/20251229_233453.jpg",
        accent: "#34d399",
      },
    ],
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function HomeScrollGallery() {
  const { language } = useSitePreferences();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isStaticLayout, setIsStaticLayout] = useState(false);

  const content = useMemo(() => ORBIT_CONTENT[language], [language]);
  const timelineSpan = Math.max(content.cards.length - 1, 1);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrowViewportQuery = window.matchMedia("(max-width: 920px)");

    const syncLayoutMode = () => {
      setIsStaticLayout(reducedMotionQuery.matches || narrowViewportQuery.matches);
    };

    syncLayoutMode();
    reducedMotionQuery.addEventListener("change", syncLayoutMode);
    narrowViewportQuery.addEventListener("change", syncLayoutMode);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncLayoutMode);
      narrowViewportQuery.removeEventListener("change", syncLayoutMode);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isStaticLayout) {
      return;
    }

    let frame = 0;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const travelDistance = Math.max(rect.height - viewportHeight, 1);
      const traveled = clamp(-rect.top, 0, travelDistance);
      setProgress(traveled / travelDistance);
    };

    const onViewportChange = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [isStaticLayout]);

  return (
    <section ref={sectionRef} className={`home-orbit ${isStaticLayout ? "home-orbit--static" : ""}`}>
      <div className="home-orbit__intro">
        <span className="pill home-orbit__pill">{content.badge}</span>
        <h2 className="home-orbit__title">{content.title}</h2>
        <p className="home-orbit__description">{content.description}</p>
      </div>

      <div
        className="home-orbit__track"
        style={{ "--orbit-card-count": content.cards.length } as CSSProperties}
      >
        <div className="home-orbit__sticky">
          <div className="home-orbit__stack">
            {content.cards.map((card, index) => {
              const phase = progress * timelineSpan - index;
              const boundedPhase = clamp(phase, -1.18, 1.18);
              const distance = Math.abs(boundedPhase);
              const emphasis = clamp(1 - distance, 0, 1);

              const cardStyle: CSSProperties = isStaticLayout
                ? ({ "--orbit-accent": card.accent } as CSSProperties)
                : ({
                    "--orbit-accent": card.accent,
                    transform: `translate3d(${(boundedPhase * 22).toFixed(2)}px, ${(boundedPhase * -248).toFixed(2)}px, 0) scale(${(1 - distance * 0.16).toFixed(3)}) rotate(${(boundedPhase * -8).toFixed(2)}deg)`,
                    opacity: clamp(1 - Math.pow(distance, 1.65), 0.18, 1),
                    filter: `blur(${(distance * 4).toFixed(2)}px) saturate(${(1 + emphasis * 0.36).toFixed(2)})`,
                    zIndex: Math.round(100 + emphasis * 120),
                  } as CSSProperties);

              return (
                <article key={card.id} className="home-orbit__card surface-strong" style={cardStyle}>
                  <div className="home-orbit__image-wrap">
                    <Image
                      src={card.src}
                      alt={card.title}
                      fill
                      priority={index === 0}
                      className="home-orbit__image"
                      sizes="(max-width: 920px) 92vw, 520px"
                    />
                  </div>
                  <div className="home-orbit__veil" />
                  <div className="home-orbit__meta">
                    <p>{card.caption}</p>
                    <h3>{card.title}</h3>
                  </div>
                </article>
              );
            })}
          </div>

          {!isStaticLayout ? (
            <div className="home-orbit__rail" aria-hidden="true">
              {content.cards.map((card, index) => {
                const distance = Math.abs(progress * timelineSpan - index);
                const markerOpacity = clamp(1 - distance * 0.72, 0.26, 1);
                const markerClass = distance < 0.4 ? "home-orbit__dot is-active" : "home-orbit__dot";
                return (
                  <span
                    key={`${card.id}-dot`}
                    className={markerClass}
                    style={{ opacity: markerOpacity, backgroundColor: card.accent }}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
