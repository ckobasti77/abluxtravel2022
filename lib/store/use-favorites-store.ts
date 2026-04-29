"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteDestination = {
  id: string;
  title: string;
  href: string;
  imageUrl?: string;
  priceLabel?: string;
};

type FavoritesState = {
  destinations: FavoriteDestination[];
  toggleDestination: (destination: FavoriteDestination) => void;
  isDestinationFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      destinations: [],

      toggleDestination: (destination) => {
        const exists = get().destinations.some((item) => item.id === destination.id);

        if (exists) {
          set({
            destinations: get().destinations.filter((item) => item.id !== destination.id),
          });
          return;
        }

        set({ destinations: [...get().destinations, destination] });
      },

      isDestinationFavorite: (id) =>
        get().destinations.some((item) => item.id === id),
    }),
    {
      name: "ablux_favorite_destinations",
      skipHydration: true,
    },
  ),
);

let favoritesHydrationStarted = false;

export const hydrateFavoritesStore = () => {
  if (favoritesHydrationStarted) return;
  favoritesHydrationStarted = true;
  void useFavoritesStore.persist.rehydrate();
};
