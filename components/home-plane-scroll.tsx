"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type HomePlaneScrollProps = {
  children: ReactNode;
};

export default function HomePlaneScroll({ children }: HomePlaneScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const plane = planeRef.current;
    if (!container || !plane) return;

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const planeHeight = plane.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Start: only ~45px of tail tip peeks from the top of the viewport
      // (plane is above viewport, tail just barely visible)
      const startY = -(planeHeight - 45);
      // End: nose exits below viewport
      const endY = viewportHeight + 60;

      gsap.fromTo(
        plane,
        {
          y: startY,
          scale: 0.86,
          transformOrigin: "center top",
        },
        {
          y: endY,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 2.2,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="plane-scroll-scene">
      {/* Plane flies down on scroll — positioned fixed, animates via GSAP */}
      <div ref={planeRef} className="plane-flyby-track" aria-hidden="true">
        <Image
          src="/plane-top-view.png"
          alt=""
          width={900}
          height={900}
          className="plane-flyby__img"
          priority
          sizes="110vw"
        />
      </div>

      {children}
    </div>
  );
}
