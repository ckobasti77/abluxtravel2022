"use client";

import { type CSSProperties, type ReactNode, useMemo } from "react";
import { useSitePreferences } from "./site-preferences-provider";

type SignalCard = {
  id: string;
  title: string;
  description: string;
  accent: string;
  icon: ReactNode;
};

type IconProps = {
  className?: string;
};

function OrbitIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="7.4" />
      <path d="M4.8 12h14.4" />
      <path d="M12 4.8v14.4" />
      <circle cx="12" cy="12" r="2.1" />
      <circle cx="18.7" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShieldPathIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3.2 19 6.4v5.1c0 4.5-2.6 7.7-7 9.3-4.4-1.6-7-4.8-7-9.3V6.4L12 3.2Z" />
      <path d="m8.7 12.1 2.3 2.3 4.3-4.4" />
    </svg>
  );
}

function PulseBoltIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.8 2.8 6.8 13h4.3l-1 8.2L17.2 11h-4.3z" />
      <path d="M3.5 7.4h2.7" />
      <path d="M17.8 17.1h2.7" />
      <path d="m5.2 17.7 1.9-1.9" />
      <path d="m16.9 6 1.9-1.9" />
    </svg>
  );
}

function NeuralAssistIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.2 12a6.8 6.8 0 1 1 13.6 0" />
      <rect x="4.2" y="11.2" width="3.1" height="5.6" rx="1.4" />
      <rect x="16.7" y="11.2" width="3.1" height="5.6" rx="1.4" />
      <path d="M7.3 17h2.7c.5 1.4 1.7 2.2 3.4 2.2h2.1" />
      <circle cx="16.4" cy="19.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function HomeAlienSignals() {
  const { dictionary } = useSitePreferences();

  const cards = useMemo<SignalCard[]>(
    () => [
      {
        id: "routes",
        title: dictionary.home.pulseCardATitle,
        description: dictionary.home.pulseCardADescription,
        accent: "#67e8f9",
        icon: <OrbitIcon className="home-signal-grid__icon" />,
      },
      {
        id: "safety",
        title: dictionary.home.pulseCardBTitle,
        description: dictionary.home.pulseCardBDescription,
        accent: "#60a5fa",
        icon: <ShieldPathIcon className="home-signal-grid__icon" />,
      },
      {
        id: "tempo",
        title: dictionary.home.pulseCardCTitle,
        description: dictionary.home.pulseCardCDescription,
        accent: "#34d399",
        icon: <PulseBoltIcon className="home-signal-grid__icon" />,
      },
      {
        id: "support",
        title: dictionary.home.pulseCardDTitle,
        description: dictionary.home.pulseCardDDescription,
        accent: "#fbbf24",
        icon: <NeuralAssistIcon className="home-signal-grid__icon" />,
      },
    ],
    [
      dictionary.home.pulseCardADescription,
      dictionary.home.pulseCardATitle,
      dictionary.home.pulseCardBDescription,
      dictionary.home.pulseCardBTitle,
      dictionary.home.pulseCardCDescription,
      dictionary.home.pulseCardCTitle,
      dictionary.home.pulseCardDDescription,
      dictionary.home.pulseCardDTitle,
    ]
  );

  return (
    <section className="home-signal-grid" aria-label={dictionary.home.pulseTitle}>
      <div className="home-signal-grid__frame">
        <div className="home-signal-grid__header">
          <span className="pill home-signal-grid__pill">{dictionary.home.pulseBadge}</span>
          <h2 className="home-signal-grid__title">{dictionary.home.pulseTitle}</h2>
          <p className="home-signal-grid__description">{dictionary.home.pulseDescription}</p>
        </div>

        <div className="home-signal-grid__cards">
          {cards.map((card, index) => (
            <article
              key={card.id}
              className="home-signal-grid__card"
              style={
                {
                  "--signal-accent": card.accent,
                  "--signal-index": index,
                } as CSSProperties
              }
            >
              <div className="home-signal-grid__icon-shell">{card.icon}</div>
              <h3 className="home-signal-grid__card-title">{card.title}</h3>
              <p className="home-signal-grid__card-description">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
