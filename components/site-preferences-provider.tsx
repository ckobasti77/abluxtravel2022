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

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "sr";
  }

  const stored = window.localStorage.getItem(LANGUAGE_KEY);
  if (isLanguage(stored)) {
    return stored;
  }

  return navigator.language.toLowerCase().startsWith("sr") ? "sr" : "en";
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const attr = document.documentElement.dataset.theme;
  if (isTheme(attr)) {
    return attr;
  }

  const stored = window.localStorage.getItem(THEME_KEY);
  if (isTheme(stored)) {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

type SitePreferencesProviderProps = {
  children: ReactNode;
};

export function SitePreferencesProvider({ children }: SitePreferencesProviderProps) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === "sr" ? "sr-Latn" : "en";
    window.localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

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

