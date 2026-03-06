import { createElement, createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export type SiteSettings = {
  workingHours: string;
  address: string;
  phone: string;
  email: string;
  instagramUrl: string;
};

export const SETTINGS_DEFAULTS: SiteSettings = {
  workingHours: "Pon-Pet: 09:00-17:00, Sub: 10:00-14:00",
  address: "Bulevar Putnika 22, Beograd",
  phone: "+381 11 123 45 67",
  email: "info@abluxtravel2022.rs",
  instagramUrl: "https://instagram.com/abluxtravel",
};

const SettingsContext = createContext<SiteSettings>(SETTINGS_DEFAULTS);

/**
 * Must be rendered inside ConvexProvider.
 * Reads settings from Convex and provides them via context.
 * When Convex is not configured, the context default (SETTINGS_DEFAULTS) is used.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const data = useQuery(api.settings.get);

  const settings = useMemo<SiteSettings>(() => {
    if (!data) return SETTINGS_DEFAULTS;
    return {
      workingHours: data.workingHours || SETTINGS_DEFAULTS.workingHours,
      address: data.address || SETTINGS_DEFAULTS.address,
      phone: data.phone || SETTINGS_DEFAULTS.phone,
      email: data.email || SETTINGS_DEFAULTS.email,
      instagramUrl: data.instagramUrl || SETTINGS_DEFAULTS.instagramUrl,
    };
  }, [data]);

  return createElement(SettingsContext.Provider, { value: settings }, children);
}

/**
 * Safe to call anywhere — reads from context, falls back to SETTINGS_DEFAULTS.
 * Does NOT call useQuery, so it works outside ConvexProvider too.
 */
export const useSettings = (): SiteSettings => useContext(SettingsContext);
