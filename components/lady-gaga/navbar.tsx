"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ─── Types ─── */
type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: "Usluge", href: "#usluge" },
  { label: "Galerija", href: "#galerija" },
  { label: "O nama", href: "#o-nama" },
  { label: "Kontakt", href: "#kontakt" },
];

/* ═══════════════════════════════════════════════════
   StudioNavbar
   Glassmorphism navigation — transparent at top,
   frosted glass on scroll. Minimalist & elegant.
   ═══════════════════════════════════════════════════ */
export default function StudioNavbar() {
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Entry animation ── */
  useEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        linksRef.current.filter(Boolean),
        { y: -12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.6,
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const setLinkRef = useCallback(
    (i: number) => (el: HTMLAnchorElement | null) => {
      linksRef.current[i] = el;
    },
    []
  );

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-out"
        style={{
          backgroundColor: scrolled
            ? "var(--studio-glass-bg)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none",
          WebkitBackdropFilter: scrolled
            ? "blur(20px) saturate(1.6)"
            : "none",
          borderBottom: scrolled
            ? "1px solid var(--studio-glass-border)"
            : "1px solid transparent",
          boxShadow: scrolled ? "var(--studio-shadow-sm)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          {/* ── Logo ── */}
          <a
            href="#"
            className="flex flex-col items-start leading-none"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            <span
              className="text-xs font-medium tracking-[0.3em] uppercase"
              style={{ color: "var(--studio-gold)" }}
            >
              Studio
            </span>
            <span
              className="text-xl font-semibold tracking-wider lg:text-2xl"
              style={{ color: "var(--studio-text)" }}
            >
              Lady Gaga
            </span>
          </a>

          {/* ── Desktop links ── */}
          <div className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                ref={setLinkRef(i)}
                href={link.href}
                className="relative text-[13px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-100"
                style={{
                  color: "var(--studio-muted)",
                  fontFamily: "var(--font-manrope), sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--studio-gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--studio-muted)")
                }
              >
                {link.label}
              </a>
            ))}

            {/* ── CTA ── */}
            <a
              href="#kontakt"
              className="rounded-full border px-6 py-2.5 text-[12px] font-semibold tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                borderColor: "var(--studio-gold)",
                color: "var(--studio-gold)",
                fontFamily: "var(--font-manrope), sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--studio-gold)";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--studio-gold)";
              }}
            >
              Zakaži termin
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
          >
            <span
              className="block h-[1.5px] w-6 transition-all duration-300"
              style={{
                backgroundColor: "var(--studio-text)",
                transform: mobileOpen
                  ? "rotate(45deg) translateY(4.5px)"
                  : "none",
              }}
            />
            <span
              className="block h-[1.5px] w-6 transition-all duration-300"
              style={{
                backgroundColor: "var(--studio-text)",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-[1.5px] w-6 transition-all duration-300"
              style={{
                backgroundColor: "var(--studio-text)",
                transform: mobileOpen
                  ? "rotate(-45deg) translateY(-4.5px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden"
        style={{
          backgroundColor: "var(--studio-bg)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-light tracking-[0.2em] uppercase transition-colors duration-300"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              color: "var(--studio-text)",
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#kontakt"
          onClick={() => setMobileOpen(false)}
          className="mt-4 rounded-full border px-8 py-3 text-sm font-medium tracking-[0.15em] uppercase"
          style={{
            borderColor: "var(--studio-gold)",
            color: "var(--studio-gold)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
        >
          Zakaži termin
        </a>
      </div>
    </>
  );
}
