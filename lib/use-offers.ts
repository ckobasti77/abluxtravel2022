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
    slug: "mediteran-travel",
    name: "Mediteran Travel",
    status: "connected",
    syncEverySeconds: 90,
    updatedAt: Date.parse("2026-02-09T08:00:00.000Z"),
  },
  {
    id: "source-b",
    slug: "evropa-tours",
    name: "Evropa Tours",
    status: "connected",
    syncEverySeconds: 120,
    updatedAt: Date.parse("2026-02-09T08:00:00.000Z"),
  },
  {
    id: "source-c",
    slug: "duhovna-putnik",
    name: "Duhovna Putnik",
    status: "syncing",
    syncEverySeconds: 60,
    lastSyncAt: Date.now() - 45_000,
    updatedAt: Date.now() - 45_000,
  },
];

const defaultOffers: AggregatedOffer[] = [
  {
    id: "offer-a",
    sourceSlug: "mediteran-travel",
    externalId: "MT-2401",
    title: "Krf i sever Grcke - prolecna tura",
    destination: "Grcka",
    departureCity: "Beograd",
    departureDate: "2026-06-12",
    returnDate: "2026-06-18",
    price: 699,
    currency: "EUR",
    seatsLeft: 12,
    tags: ["letovanje", "porodicno"],
    updatedAt: Date.now() - 60_000,
  },
  {
    id: "offer-b",
    sourceSlug: "evropa-tours",
    externalId: "ET-3110",
    title: "Rim, Firenca i Toskana",
    destination: "Italija",
    departureCity: "Nis",
    departureDate: "2026-07-03",
    returnDate: "2026-07-09",
    price: 840,
    currency: "EUR",
    seatsLeft: 10,
    tags: ["city-break", "kultura"],
    updatedAt: Date.now() - 115_000,
  },
  {
    id: "offer-c",
    sourceSlug: "duhovna-putnik",
    externalId: "DP-5520",
    title: "Istanbul i Kapadokija",
    destination: "Turska",
    departureCity: "Beograd",
    departureDate: "2026-08-15",
    returnDate: "2026-08-21",
    price: 910,
    currency: "EUR",
    seatsLeft: 8,
    tags: ["istorija", "grupe"],
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
