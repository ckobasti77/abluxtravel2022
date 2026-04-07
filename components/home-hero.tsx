"use client";

import Image from "next/image";
import Link from "next/link";
import { useSitePreferences } from "./site-preferences-provider";
import { useHeroData } from "../lib/use-categories";
import DynamicIcon from "./dynamic-icon";

const STAR_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  left: `${(i * 17) % 100}%`,
  top: `${(i * 29 + 13) % 100}%`,
  animationDelay: `${(i % 10) * 0.5}s`,
  animationDuration: `${3 + (i % 4)}s`,
}));

export default function HomeHero() {
  const { dictionary, language } = useSitePreferences();
  const heroData = useHeroData();

  return (
    <section className="hero-travel">
      {/* Desktop background */}
      <Image
        src="/background.avif"
        alt={dictionary.home.title}
        fill
        priority
        sizes="(min-width: 769px) 100vw, 0vw"
        className="hero-travel__bg hero-travel__bg--desktop"
      />
      {/* Mobile background */}
      <Image
        src="/background-mobile.avif"
        alt={dictionary.home.title}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 0vw"
        className="hero-travel__bg hero-travel__bg--mobile"
      />
      <div className="hero-travel__overlay" aria-hidden />

      {/* Subtle particle dots */}
      <div className="hero-travel__stars" aria-hidden>
        {STAR_PARTICLES.map((star, i) => (
          <span
            key={i}
            className="hero-travel__star"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <div className="hero-travel__content">
        <div className="hero-travel__center">
          <h1 className="hero-travel__title">{dictionary.home.title}</h1>
          <p className="hero-travel__subtitle">{dictionary.home.description}</p>

          <div className="hero-travel__ctas">
            <Link href="/aranzmani" className="hero-travel__btn hero-travel__btn--primary">
              {dictionary.nav.heroCta1}
            </Link>
            <Link href="/verski-turizam" className="hero-travel__btn hero-travel__btn--outline">
              {dictionary.nav.heroCta2}
            </Link>
          </div>
        </div>

        {/* Bottom 3 Category Buttons */}
        <div className="hero-travel__categories">
          {/* Hero trip */}
          {heroData?.heroTrip ? (
            <Link href={`/aranzmani/${heroData.heroTrip.slug}`} className="hero-travel__category">
              <span className="hero-travel__category-icon" aria-hidden>
                <DynamicIcon name={heroData.heroTrip.icon} size={28} />
              </span>
              <span className="hero-travel__category-label">{heroData.heroTrip.title}</span>
            </Link>
          ) : (
            <Link href="/putovanja" className="hero-travel__category">
              <span className="hero-travel__category-icon" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22V8" /><path d="M5 12s1-6 7-8c0 0-3 4-2 8" /><path d="M19 12s-1-6-7-8c0 0 3 4 2 8" /><path d="M12 4c-3-2-6-1-8 0 2-1 5 0 8 4" /><path d="M12 4c3-2 6-1 8 0-2-1-5 0-8 4" />
                </svg>
              </span>
              <span className="hero-travel__category-label">{dictionary.nav.heroExotic}</span>
            </Link>
          )}

          {/* Main arrangement category */}
          {heroData?.arrangement ? (
            <Link href={`/aranzmani?category=${heroData.arrangement.slug}`} className="hero-travel__category">
              <span className="hero-travel__category-icon" aria-hidden>
                <DynamicIcon name={heroData.arrangement.mainIcon} size={28} />
              </span>
              <span className="hero-travel__category-label">
                {language === "sr" ? heroData.arrangement.name.sr : heroData.arrangement.name.en}
              </span>
            </Link>
          ) : (
            <Link href="/aranzmani" className="hero-travel__category">
              <span className="hero-travel__category-icon" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01" /><path d="M8 10h.01M16 10h.01M12 10h.01" /><path d="M8 14h.01M16 14h.01M12 14h.01" />
                </svg>
              </span>
              <span className="hero-travel__category-label">{dictionary.nav.heroEurope}</span>
            </Link>
          )}

          {/* Main religious category */}
          {heroData?.religious ? (
            <Link href={`/verski-turizam?category=${heroData.religious.slug}`} className="hero-travel__category">
              <span className="hero-travel__category-icon" aria-hidden>
                <DynamicIcon name={heroData.religious.mainIcon} size={28} />
              </span>
              <span className="hero-travel__category-label">
                {language === "sr" ? heroData.religious.name.sr : heroData.religious.name.en}
              </span>
            </Link>
          ) : (
            <Link href="/verski-turizam" className="hero-travel__category">
              <span className="hero-travel__category-icon" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 22V8l-6-6-6 6v14" /><path d="M2 22h20" /><path d="M12 2v4" /><path d="M10 4h4" /><path d="M10 22v-5a2 2 0 0 1 4 0v5" />
                </svg>
              </span>
              <span className="hero-travel__category-label">{dictionary.nav.heroSvetinje}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
