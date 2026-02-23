"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useId, useMemo, useState } from "react";
import { useSitePreferences } from "./site-preferences-provider";

type HeroAction = {
  href: string;
  label: string;
};

export default function HomeHero() {
  const { dictionary } = useSitePreferences();
  const [toolkitOpen, setToolkitOpen] = useState(false);
  const toolkitId = useId();

  const actions = useMemo<HeroAction[]>(
    () => [
      { href: "/ponuda", label: dictionary.home.heroToolkitOffers },
      { href: "/aranzmani", label: dictionary.home.heroToolkitArrangements },
      { href: "/verski-turizam", label: dictionary.home.heroToolkitReligious },
    ],
    [
      dictionary.home.heroToolkitArrangements,
      dictionary.home.heroToolkitOffers,
      dictionary.home.heroToolkitReligious,
    ]
  );

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

      <div className="home-command-hero__content">
        <span className="pill home-command-hero__pill">{dictionary.home.badge}</span>
        <h1 className="home-command-hero__title">{dictionary.home.title}</h1>
        <p className="home-command-hero__description">{dictionary.home.description}</p>

        <div className={`home-command-hero__actions ${toolkitOpen ? "is-open" : ""}`}>
          <div className="home-command-hero__cta-row">
            <button
              type="button"
              aria-expanded={toolkitOpen}
              aria-controls={toolkitId}
              className="home-command-hero__trigger"
              onClick={() => setToolkitOpen((open) => !open)}
            >
              <span>{dictionary.home.heroPrimaryCta}</span>
              <span className="home-command-hero__trigger-icon" aria-hidden>
                {toolkitOpen ? "-" : "+"}
              </span>
            </button>
            <Link href="/kontakt" className="home-command-hero__inquiry">
              {dictionary.home.ctaContact}
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
                key={action.href}
                href={action.href}
                tabIndex={toolkitOpen ? 0 : -1}
                className="home-command-hero__tool"
                style={{ "--hero-tool-index": index } as CSSProperties}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
