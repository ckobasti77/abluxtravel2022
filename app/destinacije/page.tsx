"use client";

import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import { FaArrowRight, FaLocationDot, FaMagnifyingGlass, FaTag } from "react-icons/fa6";
import CmsImage from "../../components/cms-image";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { toCountrySlug } from "../../lib/country-route";
import { useOffersLiveBoard } from "../../lib/use-offers";
import { useSlides } from "../../lib/use-slides";

type DestinationCard = {
  key: string;
  name: string;
  slug: string;
  copy: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  offerCount: number;
  lowestPrice?: number;
  currency?: string;
  tags: string[];
};

const fallbackDestinations = [
  {
    name: "Grčka",
    copy: "More, ostrva, porodični odmor i ture koje lako uklapaju tempo grupe.",
  },
  {
    name: "Italija",
    copy: "Gradovi umetnosti, obala, gastronomija i programi za putnike koji žele sadržajan ritam.",
  },
  {
    name: "Turska",
    copy: "Spoj istorije, odmora i pažljivo planiranih tura kroz najtraženije regije.",
  },
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function DestinacijePage() {
  const { language } = useSitePreferences();
  const [query, setQuery] = useState("");
  const slides = useSlides([]);
  const offers = useOffersLiveBoard();
  const locale = language === "sr" ? "sr-RS" : "en-US";

  const cards = useMemo<DestinationCard[]>(() => {
    const groupedOffers = new Map<
      string,
      { count: number; lowestPrice?: number; currency?: string; tags: Set<string> }
    >();

    for (const offer of offers) {
      const slug = toCountrySlug(offer.destination) || normalize(offer.destination);
      const current =
        groupedOffers.get(slug) ?? {
          count: 0,
          lowestPrice: undefined,
          currency: offer.currency,
          tags: new Set<string>(),
        };
      current.count += 1;
      if (current.lowestPrice === undefined || offer.price < current.lowestPrice) {
        current.lowestPrice = offer.price;
        current.currency = offer.currency;
      }
      offer.tags.forEach((tag) => current.tags.add(tag));
      groupedOffers.set(slug, current);
    }

    const bySlug = new Map<string, DestinationCard>();

    for (const slide of slides) {
      const slug = toCountrySlug(slide.title) || toCountrySlug(slide.id);
      if (!slug) continue;
      const offerStats = groupedOffers.get(slug);
      bySlug.set(slug, {
        key: slide.id,
        name: slide.title,
        slug,
        copy:
          slide.copy ||
          (language === "sr"
            ? "Destinacija sa pažljivo odabranim programima i jasnim sledećim korakom."
            : "A destination with curated programs and a clear next step."),
        mediaUrl: slide.mediaUrl || undefined,
        mediaType: slide.mediaType,
        offerCount: offerStats?.count ?? 0,
        lowestPrice: offerStats?.lowestPrice,
        currency: offerStats?.currency,
        tags: Array.from(offerStats?.tags ?? []),
      });
    }

    for (const [slug, stats] of groupedOffers) {
      if (bySlug.has(slug)) continue;
      const offer = offers.find((item) => (toCountrySlug(item.destination) || normalize(item.destination)) === slug);
      if (!offer) continue;
      bySlug.set(slug, {
        key: slug,
        name: offer.destination,
        slug,
        copy:
          language === "sr"
            ? "Aktivna destinacija sa konkretnim ponudama, terminima i cenama za brzo poređenje."
            : "An active destination with concrete offers, dates, and prices for quick comparison.",
        offerCount: stats.count,
        lowestPrice: stats.lowestPrice,
        currency: stats.currency,
        tags: Array.from(stats.tags),
      });
    }

    if (bySlug.size === 0) {
      for (const item of fallbackDestinations) {
        const slug = toCountrySlug(item.name) || normalize(item.name);
        bySlug.set(slug, {
          key: slug,
          name: item.name,
          slug,
          copy: item.copy,
          offerCount: 0,
          tags: [],
        });
      }
    }

    return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [language, offers, slides]);

  const filteredCards = useMemo(() => {
    const search = normalize(query.trim());
    if (!search) return cards;
    return cards.filter((card) =>
      normalize([card.name, card.copy, ...card.tags].join(" ")).includes(search),
    );
  }, [cards, query]);

  const formatLowestPrice = (card: DestinationCard) => {
    if (!card.lowestPrice || !card.currency) {
      return language === "sr" ? "Ponude na upit" : "Offers on request";
    }
    return `${language === "sr" ? "od" : "from"} ${new Intl.NumberFormat(locale, {
      style: "currency",
      currency: card.currency,
      maximumFractionDigits: 0,
    }).format(card.lowestPrice)}`;
  };

  return (
    <AlienShell className="site-fade page-stack">
      <section className="page-hero">
        <span className="pill">{language === "sr" ? "Destinacije" : "Destinations"}</span>
        <h1 className="page-title">
          {language === "sr" ? "Destinacije za lakši izbor putovanja" : "Destinations for easier trip planning"}
        </h1>
        <p className="page-subtitle">
          {language === "sr"
            ? "Ovde su odvojene destinacije od aranžmana i ponuda: prvo birate pravac, zatim otvarate konkretne programe i dostupne termine."
            : "Destinations are separated from packages and offers: choose the direction first, then open concrete programs and available dates."}
        </p>
      </section>

      <section className="filter-shell grid gap-3">
        <label htmlFor="destinations-search" className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          {language === "sr" ? "Pretraga destinacija" : "Destination search"}
        </label>
        <div className="relative">
          <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted" />
          <input
            id="destinations-search"
            className="control !pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              language === "sr"
                ? "Upišite zemlju, grad ili tip putovanja"
                : "Type a country, city, or travel style"
            }
          />
        </div>
      </section>

      <section>
        {filteredCards.length > 0 ? (
          <div className="stagger-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCards.map((card, index) => (
              <article
                key={card.key}
                className="panel-glass fx-lift flex h-full flex-col overflow-hidden"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <div className="relative h-44 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]">
                  {card.mediaType === "video" && card.mediaUrl ? (
                    <video
                      src={card.mediaUrl}
                      className="h-full w-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : card.mediaUrl ? (
                    <CmsImage src={card.mediaUrl} alt={card.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#173b71,#155eef)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                    <h2 className="text-xl font-semibold text-white">{card.name}</h2>
                    <span className="rounded-full border border-white/30 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white">
                      {formatLowestPrice(card)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col gap-3">
                  <p className="text-sm leading-6 text-muted">{card.copy}</p>
                  <div className="grid gap-2 text-sm text-muted">
                    <p className="flex items-center gap-2">
                      <FaLocationDot className="text-xs text-[var(--primary)]" />
                      {card.offerCount > 0
                        ? language === "sr"
                          ? `${card.offerCount} aktivnih ponuda`
                          : `${card.offerCount} active offers`
                        : language === "sr"
                          ? "Program u pripremi"
                          : "Program in preparation"}
                    </p>
                    {card.tags.length > 0 ? (
                      <p className="flex items-center gap-2">
                        <FaTag className="text-xs text-[var(--primary)]" />
                        {card.tags.slice(0, 3).join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <Link href={`/putovanja/${card.slug}`} className="btn-primary mt-auto w-full !justify-center">
                    {language === "sr" ? `Pogledaj ponude za ${card.name}` : `View offers for ${card.name}`}
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="empty-state__title">
              {language === "sr" ? "Nema destinacija za trenutnu pretragu." : "No destinations match this search."}
            </h2>
            <p className="empty-state__copy">
              {language === "sr"
                ? "Uklonite filter ili pokušajte sa drugim pojmom."
                : "Clear the filter or try a different term."}
            </p>
          </div>
        )}
      </section>
    </AlienShell>
  );
}
