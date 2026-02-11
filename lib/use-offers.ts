import { useMemo } from "react";
import { useQueries, type RequestForQueries } from "convex/react";
import { api } from "../convex/_generated/api";

export type SourceStatus = "planned" | "connected" | "syncing" | "paused";

export type OfferSource = {
  id: string;
  slug: string;
  name: string;
  status: SourceStatus;
  syncEverySeconds: number;
  lastSyncAt?: number;
  updatedAt: number;
};

export type AggregatedOffer = {
  id: string;
  sourceSlug: string;
  externalId: string;
  title: string;
  destination: string;
  departureCity?: string;
  departureDate?: string;
  returnDate?: string;
  price: number;
  currency: string;
  seatsLeft?: number;
  tags: string[];
  updatedAt: number;
};

const defaultSources: OfferSource[] = [
  {
    id: "source-a",
    slug: "orbital-trips",
    name: "Orbital Trips",
    status: "planned",
    syncEverySeconds: 90,
    updatedAt: Date.parse("2026-02-09T08:00:00.000Z"),
  },
  {
    id: "source-b",
    slug: "quantum-voyages",
    name: "Quantum Voyages",
    status: "planned",
    syncEverySeconds: 120,
    updatedAt: Date.parse("2026-02-09T08:00:00.000Z"),
  },
  {
    id: "source-c",
    slug: "stellar-escape",
    name: "Stellar Escape",
    status: "syncing",
    syncEverySeconds: 60,
    lastSyncAt: Date.now() - 45_000,
    updatedAt: Date.now() - 45_000,
  },
];

const defaultOffers: AggregatedOffer[] = [
  {
    id: "offer-a",
    sourceSlug: "stellar-escape",
    externalId: "SE-1138",
    title: "Santorini Lunar Nights",
    destination: "Santorini",
    departureCity: "Beograd",
    departureDate: "2026-04-19",
    returnDate: "2026-04-24",
    price: 1099,
    currency: "EUR",
    seatsLeft: 7,
    tags: ["premium", "sea-view"],
    updatedAt: Date.now() - 60_000,
  },
  {
    id: "offer-b",
    sourceSlug: "orbital-trips",
    externalId: "OT-9044",
    title: "Madeira Hyper Green",
    destination: "Madeira",
    departureCity: "Nis",
    departureDate: "2026-05-06",
    returnDate: "2026-05-12",
    price: 1260,
    currency: "EUR",
    seatsLeft: 11,
    tags: ["nature", "family"],
    updatedAt: Date.now() - 115_000,
  },
  {
    id: "offer-c",
    sourceSlug: "quantum-voyages",
    externalId: "QV-2001",
    title: "Reykjavik Northern Flux",
    destination: "Reykjavik",
    departureCity: "Beograd",
    departureDate: "2026-03-11",
    returnDate: "2026-03-16",
    price: 1485,
    currency: "EUR",
    seatsLeft: 4,
    tags: ["aurora", "small-group"],
    updatedAt: Date.now() - 180_000,
  },
];

type ConvexSource = {
  _id: string;
  slug: string;
  name: string;
  status: SourceStatus;
  syncEverySeconds: number;
  lastSyncAt?: number;
  updatedAt: number;
};

type ConvexOffer = {
  _id: string;
  sourceSlug: string;
  externalId: string;
  title: string;
  destination: string;
  departureCity?: string;
  departureDate?: string;
  returnDate?: string;
  price: number;
  currency: string;
  seatsLeft?: number;
  tags: string[];
  updatedAt: number;
};

export const useOfferSources = (fallback?: OfferSource[]) => {
  const base = fallback ?? defaultSources;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const sourceQueries = useMemo(() => {
    if (!convexUrl) {
      return {} as RequestForQueries;
    }
    return {
      listSources: {
        query: api.offers.listSources,
        args: {},
      },
    } as RequestForQueries;
  }, [convexUrl]);
  const sourceQuery = useQueries(sourceQueries);
  const rows = sourceQuery.listSources;

  return useMemo<OfferSource[]>(() => {
    if (!rows || rows instanceof Error) {
      return base;
    }
    return (rows as ConvexSource[]).map((source) => ({
      id: source._id,
      slug: source.slug,
      name: source.name,
      status: source.status,
      syncEverySeconds: source.syncEverySeconds,
      lastSyncAt: source.lastSyncAt,
      updatedAt: source.updatedAt,
    }));
  }, [base, rows]);
};

export const useOffersLiveBoard = (destination?: string, fallback?: AggregatedOffer[]) => {
  const base = fallback ?? defaultOffers;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const normalizedDestination = destination?.trim();
  const liveBoardQueries = useMemo(() => {
    if (!convexUrl) {
      return {} as RequestForQueries;
    }
    return {
      listLiveBoard: {
        query: api.offers.listLiveBoard,
        args: normalizedDestination
          ? {
              limit: 40,
              destination: normalizedDestination,
            }
          : {
              limit: 40,
            },
      },
    } as RequestForQueries;
  }, [convexUrl, normalizedDestination]);
  const liveBoardQuery = useQueries(liveBoardQueries);
  const rows = liveBoardQuery.listLiveBoard;

  return useMemo<AggregatedOffer[]>(() => {
    const data = rows && !(rows instanceof Error)
      ? (rows as ConvexOffer[]).map((offer) => ({
          id: offer._id,
          sourceSlug: offer.sourceSlug,
          externalId: offer.externalId,
          title: offer.title,
          destination: offer.destination,
          departureCity: offer.departureCity,
          departureDate: offer.departureDate,
          returnDate: offer.returnDate,
          price: offer.price,
          currency: offer.currency,
          seatsLeft: offer.seatsLeft,
          tags: offer.tags,
          updatedAt: offer.updatedAt,
        }))
      : base;

    if (!normalizedDestination) {
      return data;
    }

    const query = normalizedDestination.toLowerCase();
    return data.filter((offer) => offer.destination.toLowerCase().includes(query));
  }, [base, normalizedDestination, rows]);
};
