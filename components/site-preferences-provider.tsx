"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DICTIONARY,
  type Language,
  type SiteDictionary,
  type ThemeMode,
} from "../lib/i18n";

const LANGUAGE_KEY = "ablux_language";
const THEME_KEY = "ablux_theme";
const DEFAULT_LANGUAGE: Language = "sr";
const DEFAULT_THEME: ThemeMode = "dark";

type SitePreferencesContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  dictionary: SiteDictionary;
};

const SitePreferencesContext = createContext<SitePreferencesContextValue | null>(
  null
);

const isLanguage = (value: string | null | undefined): value is Language =>
  value === "sr" || value === "en";

const isTheme = (value: string | null | undefined): value is ThemeMode =>
  value === "light" || value === "dark";

const listeners = new Set<() => void>();

const notifyPreferenceListeners = () => {
  listeners.forEach((listener) => listener());
};

const subscribeToPreferences = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const getLanguageSnapshot = (): Language => {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
  if (isLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return navigator.language.toLowerCase().startsWith("sr")
    ? "sr"
    : "en";
};

const getThemeSnapshot = (): ThemeMode => {
  const attrTheme = document.documentElement.dataset.theme;
  if (isTheme(attrTheme)) {
    return attrTheme;
  }

  const storedTheme = window.localStorage.getItem(THEME_KEY);
  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getServerLanguageSnapshot = () => DEFAULT_LANGUAGE;
const getServerThemeSnapshot = () => DEFAULT_THEME;

const applyLanguage = (language: Language) => {
  document.documentElement.lang = language === "sr" ? "sr-Latn" : "en";
  window.localStorage.setItem(LANGUAGE_KEY, language);
};

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
};

const setLanguagePreference = (language: Language) => {
  applyLanguage(language);
  notifyPreferenceListeners();
};

const setThemePreference = (theme: ThemeMode) => {
  applyTheme(theme);
  notifyPreferenceListeners();
};

type SitePreferencesProviderProps = {
  children: ReactNode;
};

export function SitePreferencesProvider({ children }: SitePreferencesProviderProps) {
  const language = useSyncExternalStore(
    subscribeToPreferences,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );
  const theme = useSyncExternalStore(
    subscribeToPreferences,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyLanguage(language);
  }, [language]);

  const value = useMemo<SitePreferencesContextValue>(
    () => ({
      language,
      setLanguage: setLanguagePreference,
      theme,
      setTheme: setThemePreference,
      toggleTheme: () =>
        setThemePreference(theme === "dark" ? "light" : "dark"),
      dictionary: DICTIONARY[language],
    }),
    [language, theme]
  );

  return (
    <SitePreferencesContext.Provider value={value}>
      {children}
    </SitePreferencesContext.Provider>
  );
}

export const useSitePreferences = () => {
  const context = useContext(SitePreferencesContext);
  if (!context) {
    throw new Error("useSitePreferences must be used within SitePreferencesProvider");
  }
  return context;
};
