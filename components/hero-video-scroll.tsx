"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ── Timestamp map (seconds) ────────────────────────────── */
const T = {
  scene1End: 1.35,
  trans1End: 1.85,
  scene2End: 6.3,
  trans2End: 6.8,
  end: 8.0,
} as const;

/* Durations derived from deltas */
const D = {
  scene1: T.scene1End,
  trans1: T.trans1End - T.scene1End,
  scene2: T.scene2End - T.trans1End,
  trans2: T.trans2End - T.scene2End,
  scene3: T.end - T.trans2End,
} as const;

/* Progress boundaries for snap */
const P = {
  trans1Start: T.scene1End / T.end,
  trans1End: T.trans1End / T.end,
  trans2Start: T.scene2End / T.end,
  trans2End: T.trans2End / T.end,
} as const;

/* ── Frame extraction ───────────────────────────────────── */
const FPS = 30;
const TOTAL_FRAMES = Math.ceil(T.end * FPS); // 240

/**
 * Decode every frame of the video into GPU-ready ImageBitmaps.
 * After this, scroll playback is just array lookup + drawImage (< 1ms).
 */
async function extractFrames(
  video: HTMLVideoElement,
  onFirstFrame?: () => void,
): Promise<ImageBitmap[]> {
  const frames: ImageBitmap[] = [];

  for (let i = 0; i <= TOTAL_FRAMES; i++) {
    const time = (i / TOTAL_FRAMES) * T.end;
    video.currentTime = time;
    await new Promise<void>((r) =>
      video.addEventListener("seeked", () => r(), { once: true }),
    );
    const bmp = await createImageBitmap(video);
    frames.push(bmp);

    /* Paint first frame to canvas immediately so user sees something */
    if (i === 0 && onFirstFrame) onFirstFrame();
  }

  return frames;
}

/* ════════════════════════════════════════════════════════════ */

export default function HeroVideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);

  const framesRef = useRef<ImageBitmap[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [ready, setReady] = useState(false);

  /* Paint a specific frame index to the canvas */
  const paintFrame = (index: number) => {
    const ctx = ctxRef.current;
    const frames = framesRef.current;
    if (!ctx || frames.length === 0) return;
    const clamped = Math.max(0, Math.min(index, frames.length - 1));
    ctx.drawImage(frames[clamped], 0, 0);
  };

  /* Extract all frames on mount */
  useEffect(() => {
    const vid = videoRef.current;
    const cvs = canvasRef.current;
    if (!vid || !cvs) return;

    let cancelled = false;

    const init = async () => {
      /* Wait for metadata so we know video dimensions */
      if (vid.readyState < 1) {
        await new Promise<void>((r) =>
          vid.addEventListener("loadedmetadata", () => r(), { once: true }),
        );
      }
      if (cancelled) return;

      /* Size canvas to native video resolution */
      cvs.width = vid.videoWidth;
      cvs.height = vid.videoHeight;
      ctxRef.current = cvs.getContext("2d", { alpha: false });

      /* Extract every frame */
      const frames = await extractFrames(vid, () => {
        /* Paint frame 0 immediately */
        if (ctxRef.current && !cancelled) {
          ctxRef.current.drawImage(vid, 0, 0);
        }
      });
      if (cancelled) {
        frames.forEach((b) => b.close());
        return;
      }

      framesRef.current = frames;
      setReady(true);
    };

    init();

    return () => {
      cancelled = true;
      framesRef.current.forEach((b) => b.close());
      framesRef.current = [];
    };
  }, []);

  /* ── Master GSAP timeline ─────────────────────────────── */
  useGSAP(
    () => {
      if (!ready) return;

      const plane = planeRef.current;
      const s1 = scene1Ref.current;
      const s2 = scene2Ref.current;
      const s3 = scene3Ref.current;
      if (!plane || !s1 || !s2 || !s3) return;

      /* Initial states */
      gsap.set(plane, { y: "-100vh" });
      gsap.set(s1, { opacity: 1, y: 0 });
      gsap.set(s2, { opacity: 0, y: 50 });
      gsap.set(s3, { opacity: 0, y: 50 });

      /* Snap only inside the two narrow transition zones */
      const snapThrough = (progress: number) => {
        const mid1 = (P.trans1Start + P.trans1End) / 2;
        if (progress > P.trans1Start && progress < P.trans1End) {
          return progress < mid1 ? P.trans1Start : P.trans1End;
        }
        const mid2 = (P.trans2Start + P.trans2End) / 2;
        if (progress > P.trans2Start && progress < P.trans2End) {
          return progress < mid2 ? P.trans2Start : P.trans2End;
        }
        return progress;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=600vh",
          scrub: 0.5,
          pin: true,
          snap: {
            snapTo: snapThrough,
            duration: { min: 0.15, max: 0.4 },
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * TOTAL_FRAMES);
            paintFrame(idx);
          },
        },
      });

      /* ─ Scene 1 ─────────────────────────────────────────── */
      tl.to({}, { duration: D.scene1 });

      /* ─ Transition 1 — plane wipe ───────────────────────── */
      tl.to({}, { duration: D.trans1 });
      tl.fromTo(
        plane,
        { y: "-100vh" },
        { y: "100vh", duration: D.trans1, ease: "power2.inOut" },
        "<",
      );
      tl.to(s1, { opacity: 0, y: -50, duration: D.trans1, ease: "power2.inOut" }, "<");
      tl.to(s2, { opacity: 1, y: 0, duration: D.trans1, ease: "power2.inOut" }, "<");
      tl.set(plane, { y: "-100vh" });

      /* ─ Scene 2 ─────────────────────────────────────────── */
      tl.to({}, { duration: D.scene2 });

      /* ─ Transition 2 — plane wipe ───────────────────────── */
      tl.to({}, { duration: D.trans2 });
      tl.fromTo(
        plane,
        { y: "-100vh" },
        { y: "100vh", duration: D.trans2, ease: "power2.inOut" },
        "<",
      );
      tl.to(s2, { opacity: 0, y: -50, duration: D.trans2, ease: "power2.inOut" }, "<");
      tl.to(s3, { opacity: 1, y: 0, duration: D.trans2, ease: "power2.inOut" }, "<");
      tl.set(plane, { y: "-100vh" });

      /* ─ Scene 3 ─────────────────────────────────────────── */
      tl.to({}, { duration: D.scene3 });
    },
    { scope: containerRef, dependencies: [ready] },
  );

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {/* Video — hidden, used only as frame source during extraction */}
      <video
        ref={videoRef}
        src="/flying.webm"
        muted
        playsInline
        preload="auto"
        className="pointer-events-none absolute opacity-0"
        aria-hidden="true"
      />

      {/* Canvas — GPU-painted frames, object-cover via CSS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* Scene 1 text */}
      <div
        ref={scene1Ref}
        className="absolute inset-0 z-10 flex items-center justify-center px-4"
      >
        <div className="text-center">
          <h2 className="font-heading text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl">
            Spiritual Journeys
          </h2>
          <p className="mt-4 text-lg text-white/80 drop-shadow md:text-xl">
            Sacred destinations across the world
          </p>
        </div>
      </div>

      {/* Scene 2 text */}
      <div
        ref={scene2Ref}
        className="absolute inset-0 z-10 flex items-center justify-center px-4"
      >
        <div className="text-center">
          <h2 className="font-heading text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl">
            Tropical Escapes
          </h2>
          <p className="mt-4 text-lg text-white/80 drop-shadow md:text-xl">
            Sun, sand, and paradise awaits
          </p>
        </div>
      </div>

      {/* Scene 3 text */}
      <div
        ref={scene3Ref}
        className="absolute inset-0 z-10 flex items-center justify-center px-4"
      >
        <div className="text-center">
          <h2 className="font-heading text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl">
            City Breaks
          </h2>
          <p className="mt-4 text-lg text-white/80 drop-shadow md:text-xl">
            Explore iconic capitals and hidden gems
          </p>
        </div>
      </div>

      {/* Plane transition mask */}
      <div
        ref={planeRef}
        className="pointer-events-none absolute top-0 z-20 h-screen w-[120vw] will-change-transform"
        style={{ left: "-10vw" }}
        aria-hidden="true"
      >
        <Image
          src="/plane.avif"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="120vw"
        />
      </div>
    </div>
  );
}
