"use client";

import StudioNavbar from "../../components/lady-gaga/navbar";
import HeroSection from "../../components/lady-gaga/hero-section";
import IntroSection from "../../components/lady-gaga/intro-section";
import ServicesSection from "../../components/lady-gaga/services-section";
import FeaturesSection from "../../components/lady-gaga/features-section";
import ParallaxBreak from "../../components/lady-gaga/parallax-break";
import GallerySection from "../../components/lady-gaga/gallery-section";
import CtaSection from "../../components/lady-gaga/cta-section";
import StudioFooter from "../../components/lady-gaga/footer";

/* ═══════════════════════════════════════════════════════
   Studio Lady Gaga — Homepage
   ═══════════════════════════════════════════════════════
   Premium beauty salon landing page.

   All sections accept dynamic props and can be wired
   to a CMS / Convex backend. Currently using sensible
   defaults for placeholder content.

   Structure:
   1. Navbar      — Glassmorphism, fixed
   2. Hero        — Full viewport, split layout, GSAP stagger
   3. Intro       — Philosophy, centered, breathing room
   4. Services    — 2×3 image grid with hover overlays
   5. Features    — 4-col trust/value propositions
   6. Parallax    — Full-width parallax image break
   7. Gallery     — Masonry grid of transformations
   8. CTA         — Contact call-to-action
   9. Footer      — Minimal, elegant
   ═══════════════════════════════════════════════════════ */

export default function StudioHomePage() {
  return (
    <main>
      <StudioNavbar />

      {/* ─── 1. Hero ─── */}
      <HeroSection
        image="/placeholder-hero.jpg"
        headingLine1="Lepota i"
        headingLine2="transformacija"
        subtitle="Studio Lady Gaga — dugogodišnje iskustvo u profesionalnoj nezi kose, farbanju i stilizovanju. Vaša kosa zaslužuje najviši standard."
        ctaLabel="Zakažite termin"
        ctaHref="#kontakt"
      />

      {/* ─── 2. Intro / Philosophy ─── */}
      <IntroSection
        badge="Dobrodošli"
        heading="Prostor gde se lepota neguje sa pažnjom i strašću"
        paragraph="Studio Lady Gaga je mesto gde se profesionalnost spaja sa toplinom. Sa dugogodišnjim iskustvom u frizerstvu, koloraciji i nezi kose, posvećeni smo svakoj klijentkinji pojedinačno — jer verujemo da prava lepota počinje sa pažnjom."
      />

      {/* ─── 3. Services ─── */}
      <ServicesSection
        badge="Naše usluge"
        heading="Svaka usluga, osmišljena za vas"
        services={[
          {
            id: "koloracija",
            title: "Koloracija i korekcija boje",
            description:
              "Kreativno farbanje, balayage, ombré i korekcija nijansi sa premium proizvodima.",
            image: "/placeholder-service-1.jpg",
          },
          {
            id: "sisanje",
            title: "Šišanje i stilizovanje",
            description:
              "Moderna i klasična šišanja prilagođena obliku vašeg lica i ličnom stilu.",
            image: "/placeholder-service-2.jpg",
          },
          {
            id: "nega",
            title: "Dubinska nega kose",
            description:
              "Keratinski tretmani, botoks za kosu i intenzivna obnova strukture dlake.",
            image: "/placeholder-service-3.jpg",
          },
          {
            id: "svecane",
            title: "Svečane frizure",
            description:
              "Savršene frizure za venčanja, proslave i svaki poseban trenutak.",
            image: "/placeholder-service-4.jpg",
          },
          {
            id: "konsultacije",
            title: "Konsultacije i plan nege",
            description:
              "Personalizovani plan nege i preporuke proizvoda za vašu kosu.",
            image: "/placeholder-service-5.jpg",
          },
          {
            id: "oporavak",
            title: "Oporavak oštećene kose",
            description:
              "Intenzivni program za suvu, lomljivu i hemijski tretiranu kosu.",
            image: "/placeholder-service-6.jpg",
          },
        ]}
      />

      {/* ─── 4. Features / Why us ─── */}
      <FeaturesSection
        badge="Zašto mi"
        heading="Preciznost, bezbednost i personalizovan plan za svaku klijentkinju"
      />

      {/* ─── 5. Parallax Divider ─── */}
      <ParallaxBreak
        image="/placeholder-parallax.jpg"
        quote="Svaki detalj tretmana je planiran da rezultat izgleda luksuzno i ostane zdrav dugoročno."
        author="— Studio Lady Gaga"
      />

      {/* ─── 6. Gallery ─── */}
      <GallerySection
        badge="Transformacije"
        heading="Najnovije transformacije"
        subtitle="Direktno sa stolice — rezultati koji govore sami za sebe."
        images={[
          { id: "g1", src: "/placeholder-gallery-1.jpg", alt: "Balayage transformacija" },
          { id: "g2", src: "/placeholder-gallery-2.jpg", alt: "Koloracija plavom" },
          { id: "g3", src: "/placeholder-gallery-3.jpg", alt: "Keratinski tretman" },
          { id: "g4", src: "/placeholder-gallery-4.jpg", alt: "Svečana frizura" },
          { id: "g5", src: "/placeholder-gallery-5.jpg", alt: "Ombré efekat" },
          { id: "g6", src: "/placeholder-gallery-6.jpg", alt: "Dubinska nega" },
          { id: "g7", src: "/placeholder-gallery-7.jpg", alt: "Bob šišanje" },
          { id: "g8", src: "/placeholder-gallery-8.jpg", alt: "Platinum blond" },
        ]}
      />

      {/* ─── 7. CTA ─── */}
      <CtaSection
        heading="Zakažite vaš termin"
        subtitle="Pozovite nas ili pošaljite poruku — rado ćemo pronaći savršen termin za vas."
        ctaLabel="Pozovite nas"
        ctaHref="tel:+38111234567"
        phone="+381 11 234 567"
        address="Beograd, Srbija"
        workingHours="Pon–Sub: 09:00 – 20:00"
      />

      {/* ─── 8. Footer ─── */}
      <StudioFooter
        phone="+381 11 234 567"
        email="info@ladygagastudio.rs"
        address="Beograd, Srbija"
        instagram="https://instagram.com/ladygagastudio"
        facebook="https://facebook.com/ladygagastudio"
      />
    </main>
  );
}
