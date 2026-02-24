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

const SCROLL_COOLDOWN_MS = 520;
const CENTER_ALIGN_COOLDOWN_MS = 620;

export default function HomeScrollGallery() {
  const { language } = useSitePreferences();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const nextSectionRef = useRef<HTMLElement | null>(null);
  const lastStepAtRef = useRef(0);
  const centerAlignUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isStaticLayout, setIsStaticLayout] = useState(false);

  const content = useMemo(() => ORBIT_CONTENT[language], [language]);
  const maxIndex = Math.max(content.cards.length - 1, 0);
  const boundedActiveIndex = clamp(activeIndex, 0, maxIndex);
  const nextSectionLabel = language === "sr" ? "Sledeca sekcija" : "Next section";

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
    if (!section) {
      nextSectionRef.current = null;
      return;
    }

    const nextElement = section.nextElementSibling;
    nextSectionRef.current = nextElement instanceof HTMLElement ? nextElement : null;
  }, []);

  useEffect(() => {
    if (isStaticLayout) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) {
        return;
      }

      const direction = Math.sign(event.deltaY);
      if (direction === 0) {
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (sectionRect.bottom <= 0 || sectionRect.top >= viewportHeight) {
        return;
      }

      const trackRect = track.getBoundingClientRect();
      const now = Date.now();
      const canStepForward = direction > 0 && boundedActiveIndex < maxIndex;
      const canStepBackward = direction < 0 && boundedActiveIndex > 0;
      const canStepInDirection = canStepForward || canStepBackward;

      const viewportCenter = viewportHeight / 2;
      const trackCenter = trackRect.top + trackRect.height / 2;
      const centerOffset = trackCenter - viewportCenter;
      const centerTolerance = Math.min(64, viewportHeight * 0.08);
      const isWithinActivationBand =
        trackRect.top <= viewportHeight * 0.74 && trackRect.bottom >= viewportHeight * 0.26;

      if (canStepInDirection && isWithinActivationBand && Math.abs(centerOffset) > centerTolerance) {
        event.preventDefault();

        if (now >= centerAlignUntilRef.current) {
          centerAlignUntilRef.current = now + CENTER_ALIGN_COOLDOWN_MS;
          window.scrollBy({ top: centerOffset, behavior: "smooth" });
        }
        return;
      }

      if (now < centerAlignUntilRef.current) {
        if (canStepInDirection) {
          event.preventDefault();
        }
        return;
      }

      const isTrackCentered = Math.abs(centerOffset) <= centerTolerance;
      if (!isTrackCentered || !canStepInDirection) {
        return;
      }

      event.preventDefault();

      if (now - lastStepAtRef.current < SCROLL_COOLDOWN_MS) {
        return;
      }

      lastStepAtRef.current = now;
      setActiveIndex((previous) => clamp(previous + direction, 0, maxIndex));
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [boundedActiveIndex, isStaticLayout, maxIndex]);

  const scrollToNextSection = () => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    let nextSection = nextSectionRef.current;
    if (!nextSection) {
      const nextElement = section.nextElementSibling;
      if (nextElement instanceof HTMLElement) {
        nextSection = nextElement;
        nextSectionRef.current = nextElement;
      }
    }

    if (!nextSection) {
      return;
    }

    centerAlignUntilRef.current = Date.now() + CENTER_ALIGN_COOLDOWN_MS;
    nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} className={`home-orbit ${isStaticLayout ? "home-orbit--static" : ""}`}>
      <div className="home-orbit__intro">
        <span className="pill home-orbit__pill">{content.badge}</span>
        <h2 className="home-orbit__title">{content.title}</h2>
        <p className="home-orbit__description">{content.description}</p>
      </div>

      <div
        ref={trackRef}
        className="home-orbit__track"
        style={{ "--orbit-card-count": content.cards.length } as CSSProperties}
      >
        <div className="home-orbit__sticky">
          <div className="home-orbit__stack">
            {content.cards.map((card, index) => {
              const phase = boundedActiveIndex - index;
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
                const distance = Math.abs(boundedActiveIndex - index);
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

          {!isStaticLayout ? (
            <button
              type="button"
              className="home-orbit__next-button"
              onClick={scrollToNextSection}
              aria-label={nextSectionLabel}
            >
              {nextSectionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
