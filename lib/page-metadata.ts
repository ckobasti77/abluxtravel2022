import type { Metadata } from "next";
import { SITE_NAME } from "./seo";

type PageMetadataInput = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
};

export const createPageMetadata = ({
  title,
  description,
  canonical,
  keywords,
}: PageMetadataInput): Metadata => ({
  title,
  description,
  keywords,
  alternates: {
    canonical,
  },
  openGraph: {
    type: "website",
    title: `${title} | ${SITE_NAME}`,
    description,
    url: canonical,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${SITE_NAME}`,
    description,
  },
});
