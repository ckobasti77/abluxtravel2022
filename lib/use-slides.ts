import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export type TripSlide = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  copy?: string;
  videoUrl: string;
};

type ConvexSlide = {
  _id: string;
  title: string;
  subtitle: string;
  badge?: string;
  copy?: string;
  videoUrl: string | null;
};

export const useSlides = (fallback: TripSlide[]) => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const data = useQuery(api.slides.list, convexUrl ? {} : "skip");

  return useMemo<TripSlide[]>(() => {
    if (!data) {
      return fallback;
    }
    return (data as ConvexSlide[]).map((slide) => ({
      id: slide._id,
      title: slide.title,
      subtitle: slide.subtitle,
      badge: slide.badge,
      copy: slide.copy,
      videoUrl: slide.videoUrl ?? "",
    }));
  }, [data, fallback]);
};
