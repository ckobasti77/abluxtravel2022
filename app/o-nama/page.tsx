"use client";

import Link from "next/link";
import type { Language } from "../../lib/i18n";
import AlienShell from "../../components/alien-shell";
import PageAdminEditorDock from "../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../components/site-preferences-provider";
import styles from "./page.module.css";

type AboutExperience = {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroChips: string[];
  panelLabel: string;
  panelValue: string;
  panelHint: string;
  primaryCta: string;
  secondaryCta: string;
  metricsTitle: string;
  metricsDescription: string;
  metrics: Array<{
    value: string;
    label: string;
    description: string;
    tone: "cyan" | "violet" | "emerald" | "amber";
  }>;
  protocolTitle: string;
  protocolDescription: string;
  protocolSteps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  crewTitle: string;
  crewDescription: string;
  crew: Array<{
    name: string;
    role: string;
    description: string;
  }>;
  valuesDescription: string;
  valueExtensions: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const ABOUT_EXPERIENCE: Record<Language, AboutExperience> = {
  sr: {
    heroBadge: "ABLux Travel od 2022.",
    heroTitle: "Planiramo putovanja koja su jasna, bezbedna i dobro organizovana.",
    heroDescription:
      "ABLux je turistička agencija koja spaja proverenu logistiku, iskustvo u organizaciji i direktnu podršku putnicima.",
    heroChips: ["Verski turizam", "Letovanja i city break", "Ekskurzije za decu"],
    panelLabel: "Pouzdanost",
    panelValue: "Jedan tim od upita do realizacije",
    panelHint: "Svaki program proveravamo pre objave i pratimo tokom cele realizacije.",
    primaryCta: "Pogledaj ponudu",
    secondaryCta: "Pošalji upit",
    metricsTitle: "Brojevi koji su nam važni",
    metricsDescription:
      "Kvalitet merimo kroz pouzdanost organizacije, jasnu komunikaciju i dostupnost tima.",
    metrics: [
      {
        value: "2022",
        label: "Godina osnivanja",
        description: "Od početka gradimo saradnju sa proverenim partnerima i jasnim procesima.",
        tone: "cyan",
      },
      {
        value: "48h",
        label: "Prosečan rok odgovora",
        description: "Na većinu upita odgovaramo u roku do 48 sati sa konkretnim predlogom.",
        tone: "violet",
      },
      {
        value: "100%",
        label: "Provera itinerera",
        description: "Svaki plan prolazi proveru termina, logistike, smeštaja i cene.",
        tone: "emerald",
      },
      {
        value: "1 tim",
        label: "Podrška od početka do kraja",
        description: "Isti tim vodi komunikaciju pre puta, tokom puta i po povratku.",
        tone: "amber",
      },
    ],
    protocolTitle: "Kako organizujemo putovanje",
    protocolDescription: "Proces je jednostavan, transparentan i prilagođen vašim prioritetima.",
    protocolSteps: [
      {
        step: "01",
        title: "Razgovor i potrebe",
        description:
          "Saslušamo vaše želje, budžet i termin kako bismo predložili realnu i kvalitetnu opciju.",
      },
      {
        step: "02",
        title: "Predlog rute",
        description:
          "Pripremamo program putovanja sa jasno definisanim koracima, cenom i uslovima.",
      },
      {
        step: "03",
        title: "Potvrda i priprema",
        description:
          "Nakon potvrde dobijate sve važne informacije i plan realizacije pre polaska.",
      },
      {
        step: "04",
        title: "Podrška tokom putovanja",
        description:
          "Tokom puta ostajemo dostupni za pitanja i brzo rešavanje operativnih situacija.",
      },
    ],
    crewTitle: "Naš tim",
    crewDescription:
      "Spajamo iskustvo iz turizma, operacija i korisničke podrške kako bi svako putovanje proteklo sigurno.",
    crew: [
      {
        name: "Savetnik za putovanja",
        role: "Planiranje",
        description: "Pomaže pri izboru destinacije i programa u skladu sa vašim ciljevima.",
      },
      {
        name: "Koordinator realizacije",
        role: "Operacije",
        description: "Vodi logistiku, termine i koordinaciju kako bi putovanje teklo po planu.",
      },
      {
        name: "Podrška putnicima",
        role: "Komunikacija",
        description: "Dostupna je za pitanja i brzu razmenu informacija tokom celog procesa.",
      },
    ],
    valuesDescription: "Poverenje gradimo odgovornim radom i jasnom komunikacijom.",
    valueExtensions: [
      "Svaki plan putovanja prilagođavamo budžetu, terminu i prioritetima putnika.",
      "Uslovi, termini i troškovi su prikazani unapred bez skrivenih stavki.",
      "Partnerstva gradimo sa agencijama i dobavljačima koji imaju proverenu reputaciju.",
    ],
    ctaTitle: "Planirate sledeće putovanje?",
    ctaDescription:
      "Pošaljite upit i dobićete predlog puta sa jasnim terminima, cenama i organizacijom.",
    ctaPrimary: "Pogledaj aranžmane",
    ctaSecondary: "Kontakt",
  },
  en: {
    heroBadge: "ABLux Travel since 2022",
    heroTitle: "We organize trips that are clear, safe, and reliable.",
    heroDescription:
      "ABLux is a travel agency focused on dependable logistics, practical planning, and direct traveler support.",
    heroChips: ["Religious tourism", "Summer and city breaks", "Children excursions"],
    panelLabel: "Reliability",
    panelValue: "One team from inquiry to travel",
    panelHint: "Each program is reviewed before launch and monitored through full delivery.",
    primaryCta: "Browse offers",
    secondaryCta: "Send inquiry",
    metricsTitle: "Numbers that matter to us",
    metricsDescription:
      "We track quality through dependable organization, clear communication, and team availability.",
    metrics: [
      {
        value: "2022",
        label: "Founded",
        description: "Since day one, we have built cooperation with trusted partners.",
        tone: "cyan",
      },
      {
        value: "48h",
        label: "Average response time",
        description: "Most inquiries receive a concrete proposal within 48 hours.",
        tone: "violet",
      },
      {
        value: "100%",
        label: "Itinerary review",
        description: "Every itinerary is checked for schedule, logistics, accommodation, and price.",
        tone: "emerald",
      },
      {
        value: "1 team",
        label: "End-to-end support",
        description: "The same team supports travelers before, during, and after the trip.",
        tone: "amber",
      },
    ],
    protocolTitle: "How we organize each trip",
    protocolDescription: "Our process is simple, transparent, and adapted to real traveler needs.",
    protocolSteps: [
      {
        step: "01",
        title: "Needs and planning",
        description:
          "We understand your goals, budget, and preferred dates before proposing options.",
      },
      {
        step: "02",
        title: "Route proposal",
        description:
          "We prepare a clear program with route details, timing, and full pricing.",
      },
      {
        step: "03",
        title: "Confirmation and prep",
        description:
          "After confirmation, you receive all key instructions and the full preparation plan.",
      },
      {
        step: "04",
        title: "Support during travel",
        description:
          "During travel, our team remains available for fast and practical assistance.",
      },
    ],
    crewTitle: "Our team",
    crewDescription:
      "We combine tourism expertise, operations, and traveler support to keep each trip stable.",
    crew: [
      {
        name: "Travel advisor",
        role: "Planning",
        description: "Helps you choose the right destination and program for your group.",
      },
      {
        name: "Operations coordinator",
        role: "Operations",
        description: "Manages logistics, timing, and partner coordination for smooth execution.",
      },
      {
        name: "Traveler support",
        role: "Communication",
        description: "Provides timely answers and practical updates throughout the process.",
      },
    ],
    valuesDescription: "We build trust through responsible work and clear information.",
    valueExtensions: [
      "Each proposal is adapted to traveler priorities, budget, and available dates.",
      "Terms, timelines, and pricing are shown upfront without hidden conditions.",
      "We select partners based on service quality and reliable delivery.",
    ],
    ctaTitle: "Planning your next trip?",
    ctaDescription:
      "Send an inquiry and receive a clear route proposal with transparent timing and pricing.",
    ctaPrimary: "View packages",
    ctaSecondary: "Contact",
  },
};

export default function ONamaPage() {
  const { dictionary, language } = useSitePreferences();
  const experience = ABOUT_EXPERIENCE[language];
  const mergedValues = [
    dictionary.about.valueA,
    dictionary.about.valueB,
    dictionary.about.valueC,
    ...experience.valueExtensions,
  ];

  return (
    <AlienShell className={`site-fade ${styles.page}`}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden />
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <span className={`pill ${styles.heroBadge}`}>{experience.heroBadge}</span>
            <p className={styles.heroEyebrow}>{dictionary.about.badge}</p>
            <h1 className={styles.heroTitle}>{experience.heroTitle}</h1>
            <p className={styles.heroDescription}>
              {experience.heroDescription} {dictionary.about.intro}
            </p>
            <ul className={styles.heroChipList}>
              {experience.heroChips.map((chip) => (
                <li key={chip} className={styles.heroChip}>
                  {chip}
                </li>
              ))}
            </ul>
            <div className={styles.heroActions}>
              <Link href="/aranzmani" className={`btn-primary ${styles.heroPrimary}`}>
                {experience.primaryCta}
              </Link>
              <Link href="/kontakt" className={`btn-secondary ${styles.heroSecondary}`}>
                {experience.secondaryCta}
              </Link>
            </div>
          </div>

          <aside className={styles.heroPanel}>
            <p className={styles.panelLabel}>{experience.panelLabel}</p>
            <p className={styles.panelValue}>{experience.panelValue}</p>
            <p className={styles.panelHint}>{experience.panelHint}</p>
            <ul className={styles.signalList}>
              <li className={styles.signalItem}>
                <span className={styles.signalKey}>
                  {language === "sr" ? "Misija" : "Mission"}
                </span>
                <span className={styles.signalValue}>{dictionary.about.mission}</span>
              </li>
              <li className={styles.signalItem}>
                <span className={styles.signalKey}>
                  {language === "sr" ? "Vizija" : "Vision"}
                </span>
                <span className={styles.signalValue}>{dictionary.about.vision}</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{experience.metricsTitle}</h2>
          <p className={styles.sectionDescription}>{experience.metricsDescription}</p>
        </header>
        <div className={styles.metricsGrid}>
          {experience.metrics.map((metric) => (
            <article key={metric.label} className={`${styles.metricCard} ${styles[metric.tone]}`}>
              <p className={styles.metricValue}>{metric.value}</p>
              <h3 className={styles.metricLabel}>{metric.label}</h3>
              <p className={styles.metricDescription}>{metric.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{experience.protocolTitle}</h2>
          <p className={styles.sectionDescription}>{experience.protocolDescription}</p>
        </header>
        <div className={styles.protocolGrid}>
          {experience.protocolSteps.map((item) => (
            <article key={item.step} className={styles.protocolCard}>
              <span className={styles.protocolStep}>{item.step}</span>
              <h3 className={styles.protocolTitle}>{item.title}</h3>
              <p className={styles.protocolDescription}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{experience.crewTitle}</h2>
          <p className={styles.sectionDescription}>{experience.crewDescription}</p>
        </header>
        <div className={styles.crewGrid}>
          {experience.crew.map((member) => (
            <article key={member.name} className={styles.crewCard}>
              <p className={styles.crewRole}>{member.role}</p>
              <h3 className={styles.crewName}>{member.name}</h3>
              <p className={styles.crewDescription}>{member.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.valuesSection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{dictionary.about.valuesTitle}</h2>
          <p className={styles.sectionDescription}>{experience.valuesDescription}</p>
        </header>
        <div className={styles.valuesGrid}>
          {mergedValues.map((value) => (
            <article key={value} className={styles.valueCard}>
              <p>{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{experience.ctaTitle}</h2>
        <p className={styles.ctaDescription}>{experience.ctaDescription}</p>
        <div className={styles.ctaActions}>
          <Link href="/aranzmani" className={`btn-primary ${styles.heroPrimary}`}>
            {experience.ctaPrimary}
          </Link>
          <Link href="/kontakt" className={`btn-secondary ${styles.heroSecondary}`}>
            {experience.ctaSecondary}
          </Link>
        </div>
      </section>

      <PageAdminEditorDock slot="about" className="mt-12" />
    </AlienShell>
  );
}
