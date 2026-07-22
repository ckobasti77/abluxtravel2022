"use client";

import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import {
  hydrateFavoritesStore,
  type FavoriteDestination,
  useFavoritesStore,
} from "@/lib/store/use-favorites-store";
import { useSitePreferences } from "./site-preferences-provider";

type FavoriteDestinationButtonProps = {
  destination: FavoriteDestination;
  className?: string;
};

export default function FavoriteDestinationButton({
  destination,
  className = "",
}: FavoriteDestinationButtonProps) {
  const { language } = useSitePreferences();
  const isFavorite = useFavoritesStore((state) =>
    state.isDestinationFavorite(destination.id),
  );
  const toggleDestination = useFavoritesStore((state) => state.toggleDestination);
  const label = isFavorite
    ? language === "sr"
      ? "Ukloni iz sacuvanih destinacija"
      : "Remove from saved destinations"
    : language === "sr"
      ? "Sacuvaj destinaciju"
      : "Save destination";

  useEffect(() => {
    hydrateFavoritesStore();
  }, []);

  return (
    <button
      type="button"
      onClick={() => toggleDestination(destination)}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white shadow-sm backdrop-blur transition hover:bg-black/65 ${
        isFavorite ? "!border-rose-300/70 !bg-rose-500 text-white" : ""
      } ${className}`}
    >
      {isFavorite ? (
        <FaHeart aria-hidden size={14} />
      ) : (
        <FaRegHeart aria-hidden size={14} />
      )}
    </button>
  );
}
