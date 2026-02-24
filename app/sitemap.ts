import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo";

const PUBLIC_ROUTES = [
  "/",
  "/putovanja",
  "/aranzmani",
  "/verski-turizam",
  "/ponuda",
  "/o-nama",
  "/kontakt",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
