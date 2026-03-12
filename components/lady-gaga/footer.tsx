"use client";

/* ─── Props ─── */
export type FooterProps = {
  phone?: string;
  email?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
};

const DEFAULTS: Required<FooterProps> = {
  phone: "+381 11 234 567",
  email: "info@ladygagastudio.rs",
  address: "Beograd, Srbija",
  instagram: "https://instagram.com/ladygagastudio",
  facebook: "https://facebook.com/ladygagastudio",
};

/* ═══════════════════════════════════════════════════
   StudioFooter
   Minimal, elegant footer with logo, links,
   social icons, and copyright.
   ═══════════════════════════════════════════════════ */
export default function StudioFooter(props: FooterProps) {
  const p = { ...DEFAULTS, ...props };
  const year = new Date().getFullYear();

  return (
    <footer
      className="px-6 py-16 sm:px-10 lg:px-12"
      style={{
        backgroundColor: "var(--studio-text)",
        color: "rgba(255,255,255,0.6)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* ── Top: Logo + Socials ── */}
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo */}
          <div
            className="flex flex-col items-start leading-none"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            <span
              className="text-[10px] font-medium tracking-[0.3em] uppercase"
              style={{ color: "var(--studio-gold)" }}
            >
              Studio
            </span>
            <span className="text-xl font-semibold tracking-wider text-white">
              Lady Gaga
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a
              href={p.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-white"
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href={p.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-white"
              aria-label="Facebook"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="my-10 h-[1px] w-full"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        />

        {/* ── Bottom: Nav + Contact ── */}
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6 sm:justify-start">
            {[
              { label: "Usluge", href: "#usluge" },
              { label: "Galerija", href: "#galerija" },
              { label: "O nama", href: "#o-nama" },
              { label: "Kontakt", href: "#kontakt" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 hover:text-white"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contact */}
          <div
            className="flex flex-wrap justify-center gap-4 text-[12px] tracking-wide sm:justify-end"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="transition-colors duration-300 hover:text-white">
              {p.phone}
            </a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href={`mailto:${p.email}`} className="transition-colors duration-300 hover:text-white">
              {p.email}
            </a>
          </div>
        </div>

        {/* ── Copyright ── */}
        <p
          className="mt-10 text-center text-[11px] tracking-wide"
          style={{
            color: "rgba(255,255,255,0.3)",
            fontFamily: "var(--font-manrope), sans-serif",
          }}
        >
          &copy; {year} Studio Lady Gaga. Sva prava zadržana.
        </p>
      </div>
    </footer>
  );
}
