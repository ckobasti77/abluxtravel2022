import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export type TripStatus = "active" | "upcoming" | "completed";
export type TransportType = "bus" | "plane" | "car" | "train" | "self";

export type Trip = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  nights: number;
  days: number;
  transport: TransportType;
  departureDate: string;
  returnDate: string;
  departureCity: string;
  hotelInfo?: string;
  depositPercentage?: number;
  depositDeadline?: string;
  itinerary: { day: number; date: string; description: string }[];
  included: string[];
  notIncluded: string[];
  imageStorageIds: string[];
  imageUrls: string[];
  status: TripStatus;
  categoryId?: string;
  isHero?: boolean;
  heroIcon?: string;
  featured: boolean;
  order: number;
  updatedAt: number;
};

export const useTrips = (options?: {
  status?: TripStatus;
  featuredOnly?: boolean;
}): Trip[] => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const data = useQuery(
    api.trips.list,
    convexUrl
      ? {
          status: options?.status,
          featuredOnly: options?.featuredOnly,
        }
      : "skip"
  );

  return useMemo<Trip[]>(() => {
    if (!data) return [];
    return data as unknown as Trip[];
  }, [data]);
};

export const useTripBySlug = (slug: string): Trip | null | undefined => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const data = useQuery(api.trips.getBySlug, convexUrl ? { slug } : "skip");

  return useMemo(() => {
    if (data === undefined) return undefined;
    if (data === null) return null;
    return data as unknown as Trip;
  }, [data]);
};
