import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./studio.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Lady Gaga | Salon lepote Beograd",
  description:
    "Lepota, zdravlje i transformacija kose na jednom mestu. Profesionalni frizerski salon u Beogradu sa dugogodišnjim iskustvom.",
  openGraph: {
    type: "website",
    locale: "sr_RS",
    title: "Studio Lady Gaga | Salon lepote",
    description:
      "Lepota, zdravlje i transformacija kose na jednom mestu.",
  },
};

/**
 * Studio sub-layout — nested under the root layout.
 *
 * NOTE: For production, this route should live in its own
 * route group `(studio)` with a dedicated root layout so it
 * doesn't inherit the travel-agency chrome (nav, footer).
 * For development / preview purposes, this wrapper hides
 * the parent layout's elements via CSS and applies the
 * studio design tokens + fonts.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`studio-shell ${cormorant.variable} ${manrope.variable}`}
      style={{
        fontFamily: "var(--font-manrope), sans-serif",
        backgroundColor: "var(--studio-bg)",
        color: "var(--studio-text)",
      }}
    >
      {/* Hide parent layout travel-agency chrome */}
      <style>{`
        body > .skip-link,
        body header:has(nav[class*="site-nav"]),
        body > div > nav,
        body > div > header,
        body footer:has([class*="site-footer"]) { display: none !important; }
        .studio-shell ~ footer { display: none !important; }
        [class*="quick-actions"] { display: none !important; }
        #main-content { all: unset; }
      `}</style>
      {children}
    </div>
  );
}
