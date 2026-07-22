import type { MetadataRoute } from "next";
import { toCountrySlug } from "../lib/country-route";
import { SITE_URL } from "../lib/seo";

const PUBLIC_ROUTES = [
  "/",
  "/putovanja",
  "/destinacije",
  "/aranzmani",
  "/ponude",
  "/verski-turizam",
  "/o-nama",
  "/kontakt",
] as const;

const COUNTRY_NAMES = ["Grcka", "Italija", "Turska", "Crna Gora", "Izrael", "Egipat"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const countryRoutes = COUNTRY_NAMES.map((country) => toCountrySlug(country))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/putovanja/${slug}`);

  const routes = [...PUBLIC_ROUTES, ...countryRoutes];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : route.startsWith("/putovanja/") ? "daily" : "weekly",
    priority: route === "/" ? 1 : route.startsWith("/putovanja/") ? 0.85 : 0.8,
  }));
}
