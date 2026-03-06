"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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

type SitePreferencesProviderProps = {
  children: ReactNode;
};

export function SitePreferencesProvider({ children }: SitePreferencesProviderProps) {
  const [language, setLanguage] = useState<Language>("sr");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    const nextLanguage = isLanguage(storedLanguage)
      ? storedLanguage
      : navigator.language.toLowerCase().startsWith("sr")
        ? "sr"
        : "en";

    const attrTheme = document.documentElement.dataset.theme;
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    const nextTheme = isTheme(attrTheme)
      ? attrTheme
      : isTheme(storedTheme)
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    const timeoutId = window.setTimeout(() => {
      setLanguage(nextLanguage);
      setTheme(nextTheme);
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [isHydrated, theme]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    document.documentElement.lang = language === "sr" ? "sr-Latn" : "en";
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [isHydrated, language]);

  const value = useMemo<SitePreferencesContextValue>(
    () => ({
      language,
      setLanguage,
      theme,
      setTheme,
      toggleTheme: () =>
        setTheme((previous) => (previous === "dark" ? "light" : "dark")),
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
