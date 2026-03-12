"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp, FaCircle } from "react-icons/fa6";
import PageAdminEditorDock from "../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { toCountrySlug } from "../../lib/country-route";
import { TripSlide, useSlides } from "../../lib/use-slides";
import { useSession } from "../../lib/use-session";

const IDLE_MS = 3200;
const SCROLL_COOLDOWN_MS = 900;
const SWIPE_THRESHOLD = 50;

export default function PutovanjaPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayLocked, setOverlayLocked] = useState(false);
  const { language } = useSitePreferences();
  const session = useSession();

  const fallbackSlides: TripSlide[] = useMemo(
    () => [
      {
        id: "iceland",
        title: "Iceland",
        subtitle: "5 dana / 4 noci / Reykjavik + Golden Circle",
        badge: "4 nocenja",
        copy: "Vulkani, gejziri, lagune i aurora kao glavna scena.",
        mediaUrl: "",
      },
      {
        id: "cappadocia",
        title: "Cappadocia",
        subtitle: "4 dana / 3 noci / Let balonom u zoru",
        badge: "3 nocenja",
        copy: "Pecinske sobe, doline i panorame koje izgledaju nestvarno.",
        mediaUrl: "",
      },
      {
        id: "amalfi",
        title: "Amalfi",
        subtitle: "7 dana / 6 noci / Obala, limuni i more",
        badge: "6 nocenja",
        copy: "Spoj opustanja i elegantnog tempa italijanske rivijere.",
        mediaUrl: "",
      },
    ],
    []
  );

  const slides = useSlides(fallbackSlides);
  const copy =
    language === "sr"
      ? {
          slidePrefix: "Scena",
          offersFor: "Pogledaj ponude za",
          swipeHint: "Prevuci ili skroluj za sledecu scenu",
          emptyTitle: "Hero sekcija trenutno nema aktivne scene",
          emptyDescription:
            "Trenutno nema aktivnih scena. Novi prikazi destinacija bice dodati uskoro.",
          previous: "Prethodna",
          next: "Sledeca",
          jumpTo: "Idi na scenu",
          openPackages: "Otvori aranžmane",
        }
      : {
          slidePrefix: "Scene",
          offersFor: "View offers for",
          swipeHint: "Swipe or scroll to move to the next scene",
          emptyTitle: "Hero section currently has no active scenes",
          emptyDescription:
            "There are currently no active scenes. New destination highlights will be added soon.",
          previous: "Previous",
          next: "Next",
          jumpTo: "Jump to scene",
          openPackages: "Open packages",
        };

  const lastScrollRef = useRef(0);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const editorDockRef = useRef<HTMLDivElement | null>(null);
  const isAdmin = session?.role === "admin";

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) {
        setActiveIndex(0);
        return;
      }
      const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
      setActiveIndex(nextIndex);
      setOverlayVisible(true);
    },
    [slides.length]
  );

  const goPrev = useCallback(() => {
    if (activeIndex <= 0) return;
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    if (activeIndex >= slides.length - 1) return;
    goTo(activeIndex + 1);
  }, [activeIndex, goTo, slides.length]);

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
      setOverlayLocked((previous) => {
        const nextLocked = !previous;
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
      if (slides.length <= 1) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        if (activeIndex >= slides.length - 1) return;
        event.preventDefault();
        if (canSlide()) {
          goTo(activeIndex + 1);
        }
      }
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        if (activeIndex <= 0) return;
        event.preventDefault();
        if (canSlide()) {
          goTo(activeIndex - 1);
        }
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
      const scrollY = window.scrollY;

      if (isAdmin && scrollY > 0) {
        if (event.deltaY < 0) {
          event.preventDefault();
          lastScrollRef.current = Date.now();
          if (slides.length > 0) {
            goTo(slides.length - 1);
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (slides.length <= 1) return;
      if (event.deltaY > 0) {
        if (activeIndex >= slides.length - 1) {
          if (isAdmin && editorDockRef.current) {
            const dockTop = editorDockRef.current.getBoundingClientRect().top;
            if (dockTop > 8) {
              event.preventDefault();
              editorDockRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
          return;
        }
        event.preventDefault();
        if (canSlide()) {
          goTo(activeIndex + 1);
        }
      } else if (event.deltaY < 0) {
        if (activeIndex <= 0) return;
        event.preventDefault();
        if (canSlide()) {
          goTo(activeIndex - 1);
        }
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.changedTouches[0]?.clientY ?? null;
      setOverlayVisible(true);
      scheduleIdle();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (slides.length <= 1) return;
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY ?? null;
      touchStartYRef.current = null;
      if (startY === null || endY === null) return;
      const deltaY = startY - endY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
      if (!canSlide()) return;
      if (deltaY > 0) {
        if (activeIndex >= slides.length - 1) return;
        goTo(activeIndex + 1);
      } else {
        if (activeIndex <= 0) return;
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
  }, [activeIndex, goTo, isAdmin, overlayLocked, slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <main id="main-content" className="bg-[#0b0f14] text-white">
      <section className="relative h-screen w-full overflow-hidden overscroll-none">
        <div
          className="absolute left-0 top-0 h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{
            transform: `translateY(-${Math.min(activeIndex, Math.max(0, slides.length - 1)) * 100}vh)`,
          }}
        >
          {slides.length > 0 ? (
            slides.map((slide, index) => {
              const countrySlug = toCountrySlug(slide.title) || toCountrySlug(slide.id);
              const countryHref = countrySlug ? `/putovanja/${countrySlug}` : "/putovanja";
              const shouldRenderVideo =
                slide.mediaType === "video" && Math.abs(index - activeIndex) <= 1;
              const shouldRenderImage =
                slide.mediaType === "image" && Boolean(slide.mediaUrl);

              return (
                <section key={slide.id} className="relative h-screen w-full overflow-hidden">
                  {shouldRenderVideo && slide.mediaUrl ? (
                    <video
                      className="absolute left-0 top-0 h-full w-full object-cover"
                      src={slide.mediaUrl}
                      autoPlay={index === activeIndex}
                      muted
                      loop
                      playsInline
                      preload={index === activeIndex ? "auto" : "metadata"}
                      disablePictureInPicture
                    />
                  ) : shouldRenderImage ? (
                    <img
                      className="absolute left-0 top-0 h-full w-full object-cover"
                      src={slide.mediaUrl}
                      alt={slide.title}
                      loading={index === activeIndex ? "eager" : "lazy"}
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
                    <div className="relative mx-auto flex w-[min(760px,92vw)] flex-col gap-5 rounded-2xl border border-white/16 bg-black/30 px-5 py-6 text-center backdrop-blur-sm sm:px-8">
                      <div className="text-[11px] uppercase tracking-[0.35em] text-white/70">
                        {copy.slidePrefix} {index + 1} / {slides.length}
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
                      <div className="mt-2 flex flex-wrap justify-center gap-2">
                        <Link
                          href={countryHref}
                          className="inline-flex rounded-full border border-white/45 bg-black/25 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/90 transition hover:border-white hover:bg-black/35"
                        >
                          {copy.offersFor} {slide.title}
                        </Link>
                        <Link
                          href="/aranzmani"
                          className="inline-flex rounded-full border border-white/25 bg-black/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-white/80 transition hover:border-white/40 hover:text-white"
                        >
                          {copy.openPackages}
                        </Link>
                      </div>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-white/50 sm:text-[11px]">
                        {copy.swipeHint}
                      </p>
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <section className="relative h-screen w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f14] via-[#111827] to-[#1f2937]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
              <div className="relative z-10 mx-auto flex h-full w-[min(760px,92vw)] flex-col items-center justify-center gap-6 text-center">
                <h1 className="text-3xl font-semibold uppercase tracking-[0.12em] sm:text-5xl">
                  {copy.emptyTitle}
                </h1>
                <p className="max-w-2xl text-sm text-white/75 sm:text-base">
                  {copy.emptyDescription}
                </p>
              </div>
            </section>
          )}
        </div>

        {slides.length > 1 ? (
          <div className="absolute bottom-5 left-1/2 z-20 flex w-[min(92vw,860px)] -translate-x-1/2 flex-col gap-3 rounded-2xl border border-white/20 bg-black/35 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white/85 transition hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label={copy.previous}
              >
                <FaArrowUp aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={activeIndex >= slides.length - 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white/85 transition hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label={copy.next}
              >
                <FaArrowDown aria-hidden />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${copy.jumpTo} ${index + 1}`}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] transition ${
                    index === activeIndex
                      ? "border-white/60 bg-white/20 text-white"
                      : "border-white/20 bg-black/20 text-white/70 hover:border-white/40"
                  }`}
                >
                  <FaCircle className="text-[8px]" aria-hidden />
                  <span>{index + 1}</span>
                </button>
              ))}
            </div>

            {activeSlide ? (
              <p className="hidden text-xs text-white/75 sm:block">{activeSlide.title}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      <div ref={editorDockRef}>
        <PageAdminEditorDock
          slot="putovanja"
          className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-12 text-[var(--text)] sm:px-8 lg:px-12"
        />
      </div>
    </main>
  );
}

