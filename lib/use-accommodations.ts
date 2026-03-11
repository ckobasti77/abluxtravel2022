import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export type AccommodationType =
  | "villa"
  | "apartment"
  | "hotel"
  | "room"
  | "hostel"
  | "other";

export type BoardType = "ro" | "bb" | "hb" | "fb" | "ai";

export type Accommodation = {
  _id: string;
  tripId: string;
  name: string;
  type: AccommodationType;
  description: string;
  pricePerPerson: number;
  currency: string;
  capacity: number;
  amenities: string[];
  boardType?: BoardType;
  roomInfo?: string;
  checkIn?: string;
  checkOut?: string;
  distanceToCenter?: string;
  imageStorageIds: string[];
  imageUrls: string[];
  order: number;
  isActive: boolean;
  updatedAt: number;
};

export const useAccommodationsByTrip = (
  tripId: string | undefined
): Accommodation[] => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const data = useQuery(
    api.accommodations.listByTrip,
    convexUrl && tripId
      ? { tripId: tripId as Id<"trips"> }
      : "skip"
  );

  return useMemo<Accommodation[]>(() => {
    if (!data) return [];
    return data as unknown as Accommodation[];
  }, [data]);
};
