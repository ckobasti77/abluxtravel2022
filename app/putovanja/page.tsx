"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TripSlide, useSlides } from "../../lib/use-slides";
import { toCountrySlug } from "../../lib/country-route";

const IDLE_MS = 2500;
const SCROLL_COOLDOWN_MS = 900;
const SWIPE_THRESHOLD = 50;

export default function PutovanjaPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayLocked, setOverlayLocked] = useState(false);

  const fallbackSlides: TripSlide[] = useMemo(
    () => [
      {
        id: "iceland",
        title: "Iceland",
        subtitle: "5 dana / 4 noci / Reykjavik + Golden Circle",
        badge: "4 nocenja",
        copy: "Vulkani, gejziri, lagune i aurora kao glavna scena.",
        videoUrl: "/videos/iceland.mp4",
      },
      {
        id: "cappadocia",
        title: "Cappadocia",
        subtitle: "4 dana / 3 noci / Let balonom u zoru",
        badge: "3 nocenja",
        copy: "Pecinske sobe, doline i panorame koje izgledaju nestvarno.",
        videoUrl: "/videos/cappadocia.mp4",
      },
      {
        id: "amalfi",
        title: "Amalfi",
        subtitle: "7 dana / 6 noci / Obala, limuni i more",
        badge: "6 nocenja",
        copy: "Spoj opustanja i elegantnog tempa italijanske rivijere.",
        videoUrl: "/videos/amalfi.mp4",
      },
    ],
    []
  );

  const slides = useSlides(fallbackSlides);
  const lastScrollRef = useRef(0);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) {
        setActiveIndex(0);
        return;
      }
      const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
      setActiveIndex(nextIndex);
    },
    [slides.length]
  );

  useEffect(() => {
    const clearIdle = () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
    };

    const scheduleIdle = () => {
      clearIdle();
      idleTimer.current = setTimeout(() => {
        if (!overlayLocked) {
          setOverlayVisible(false);
        }
      }, IDLE_MS);
    };

    const canSlide = () => {
      const now = Date.now();
      if (now - lastScrollRef.current < SCROLL_COOLDOWN_MS) {
        return false;
      }
      lastScrollRef.current = now;
      return true;
    };

    const onMouseMove = () => {
      setOverlayVisible(true);
      scheduleIdle();
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select")) {
        return;
      }
      setOverlayLocked((prev) => {
        const nextLocked = !prev;
        if (nextLocked) {
          setOverlayVisible(true);
          scheduleIdle();
        } else {
          clearIdle();
          setOverlayVisible(false);
        }
        return nextLocked;
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        if (canSlide()) goTo(activeIndex + 1);
      }
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        if (canSlide()) goTo(activeIndex - 1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(slides.length - 1);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (!canSlide()) return;
      if (event.deltaY > 0) {
        goTo(activeIndex + 1);
      } else if (event.deltaY < 0) {
        goTo(activeIndex - 1);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.changedTouches[0]?.clientY ?? null;
      setOverlayVisible(true);
      scheduleIdle();
    };

    const onTouchEnd = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY ?? null;
      touchStartYRef.current = null;
      if (startY === null || endY === null) return;
      const deltaY = startY - endY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
      if (!canSlide()) return;
      if (deltaY > 0) {
        goTo(activeIndex + 1);
      } else {
        goTo(activeIndex - 1);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    scheduleIdle();

    return () => {
      clearIdle();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeIndex, goTo, overlayLocked, slides.length]);

  return (
    <div className="relative h-screen w-screen overflow-hidden overscroll-none bg-[#0b0f14] text-white">
      <div
        className="absolute left-0 top-0 h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          transform: `translateY(-${
            Math.min(activeIndex, Math.max(0, slides.length - 1)) * 100
          }vh)`,
        }}
      >
        {slides.map((slide, index) => {
          const countrySlug = toCountrySlug(slide.title) || toCountrySlug(slide.id);
          const countryHref = countrySlug ? `/putovanja/${countrySlug}` : "/putovanja";
          const shouldRenderVideo = Math.abs(index - activeIndex) <= 1;
          return (
            <section
              key={slide.id}
              className="relative h-screen w-screen overflow-hidden"
            >
              {slide.videoUrl && shouldRenderVideo ? (
                <video
                  className="absolute left-0 top-0 h-full w-full object-cover"
                  src={slide.videoUrl}
                  autoPlay={index === activeIndex}
                  muted
                  loop
                  playsInline
                  preload={index === activeIndex ? "auto" : "metadata"}
                  disablePictureInPicture
                />
              ) : (
                <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-[#0b0f14] via-[#111827] to-[#1f2937]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  overlayVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
                <div className="relative mx-auto flex w-[min(720px,90vw)] flex-col gap-5 px-5 text-center">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-white/70">
                    Putovanje {index + 1} / {slides.length}
                  </div>
                  <h1 className="text-3xl font-semibold uppercase tracking-[0.15em] sm:text-5xl">
                    {slide.title}
                  </h1>
                  {slide.badge ? (
                    <div className="mx-auto inline-flex rounded-full border border-white/35 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/90">
                      {slide.badge}
                    </div>
                  ) : null}
                  <p className="text-base text-white/80 sm:text-lg">{slide.subtitle}</p>
                  {slide.copy ? (
                    <p className="text-sm text-white/70 sm:text-base">{slide.copy}</p>
                  ) : null}
                  <Link
                    href={countryHref}
                    className="mx-auto mt-3 inline-flex rounded-full border border-white/45 bg-black/25 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/90 transition hover:border-white hover:bg-black/35"
                  >
                    Ponude za {slide.title}
                  </Link>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-white/50 sm:text-[11px]">
                    Swipe ili scroll za sledeci slajd
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
