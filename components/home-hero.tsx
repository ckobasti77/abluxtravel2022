"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import { useSitePreferences } from "./site-preferences-provider";

type HeroAction = {
  href: string;
  label: string;
};

type HeroParticle = CSSProperties;

const deterministicNoise = (seed: number) => {
  const value = Math.sin(seed * 9999.91) * 43758.5453123;
  return value - Math.floor(value);
};

const buildParticleStyles = (count: number): HeroParticle[] =>
  Array.from({ length: count }, (_, index) => {
    const base = index + 1;
    const x = 5 + deterministicNoise(base * 1.37) * 90;
    const y = 5 + deterministicNoise(base * 2.11) * 90;
    const size = 2 + deterministicNoise(base * 2.89) * 4;
    const duration = 3 + deterministicNoise(base * 3.73) * 6;
    const delay = deterministicNoise(base * 4.19) * 5;
    const opacity = 0.2 + deterministicNoise(base * 5.21) * 0.6;

    return {
      "--p-x": `${x.toFixed(2)}%`,
      "--p-y": `${y.toFixed(2)}%`,
      "--p-size": `${size.toFixed(2)}px`,
      "--p-dur": `${duration.toFixed(2)}s`,
      "--p-delay": `${delay.toFixed(2)}s`,
      "--p-opacity": opacity.toFixed(3),
    } as CSSProperties;
  });

export default function HomeHero() {
  const { dictionary } = useSitePreferences();
  const [toolkitOpen, setToolkitOpen] = useState(false);
  const toolkitId = "home-command-toolkit";

  const actions = useMemo<HeroAction[]>(
    () => [
      { href: "/aranzmani", label: dictionary.home.heroToolkitOffers },
      { href: "/aranzmani", label: dictionary.home.heroToolkitArrangements },
      { href: "/verski-turizam", label: dictionary.home.heroToolkitReligious },
    ],
    [
      dictionary.home.heroToolkitArrangements,
      dictionary.home.heroToolkitOffers,
      dictionary.home.heroToolkitReligious,
    ]
  );

  const particleStyles = useMemo(() => buildParticleStyles(24), []);

  return (
    <section className={`home-command-hero ${toolkitOpen ? "is-expanded" : ""}`}>
      <Image
        src="/pocetna.avif"
        alt={dictionary.home.title}
        fill
        priority
        sizes="100vw"
        className="home-command-hero__image"
      />
      <div className="home-command-hero__dimmer" aria-hidden />
      <div className="home-command-hero__ambient" aria-hidden />
      <div className="home-command-hero__scanline" aria-hidden />

      <div className="home-command-hero__holo-grid" aria-hidden />
      <div className="home-command-hero__aurora" aria-hidden />
      <div className="home-command-hero__aurora home-command-hero__aurora--alt" aria-hidden />

      <div className="home-command-hero__particles" aria-hidden>
        {particleStyles.map((particleStyle, index) => (
          <span key={index} className="home-command-hero__particle" style={particleStyle} />
        ))}
      </div>

      <div className="home-command-hero__ring-pulse" aria-hidden />
      <div className="home-command-hero__ring-pulse home-command-hero__ring-pulse--2" aria-hidden />
      <div className="home-command-hero__ring-pulse home-command-hero__ring-pulse--3" aria-hidden />

      <div className="home-command-hero__content">
        <div className="home-command-hero__intro">
          <span className="home-command-hero__pill">
            <span className="home-command-hero__pill-dot" aria-hidden />
            {dictionary.home.badge}
          </span>
          <h1 className="home-command-hero__title">
            <span className="home-command-hero__title-main">{dictionary.home.title}</span>
            <span className="home-command-hero__title-glow" aria-hidden>
              {dictionary.home.title}
            </span>
          </h1>
          <p className="home-command-hero__description">{dictionary.home.description}</p>
        </div>

        <div className={`home-command-hero__actions ${toolkitOpen ? "is-open" : ""}`}>
          <div className="home-command-hero__cta-row">
            <button
              type="button"
              aria-expanded={toolkitOpen}
              aria-controls={toolkitId}
              className="home-command-hero__trigger"
              onClick={() => setToolkitOpen((open) => !open)}
            >
              <span className="home-command-hero__trigger-text">
                {dictionary.home.heroPrimaryCta}
              </span>
              <span className="home-command-hero__trigger-icon" aria-hidden>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M2.5 4.5L6.5 8.5L10.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <Link href="/kontakt" className="home-command-hero__inquiry">
              <span className="home-command-hero__inquiry-glow" aria-hidden />
              {dictionary.home.ctaContact}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden style={{ opacity: 0.7 }}>
                <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div
            id={toolkitId}
            role="group"
            aria-label={dictionary.home.heroToolkitLabel}
            aria-hidden={!toolkitOpen}
            className="home-command-hero__toolkit"
          >
            {actions.map((action, index) => (
              <Link
                key={`${action.href}-${action.label}-${index}`}
                href={action.href}
                tabIndex={toolkitOpen ? 0 : -1}
                className="home-command-hero__tool"
                style={{ "--hero-tool-index": index } as CSSProperties}
              >
                <span className="home-command-hero__tool-label">{action.label}</span>
                <span className="home-command-hero__tool-arrow" aria-hidden>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
