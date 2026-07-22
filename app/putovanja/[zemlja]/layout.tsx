import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fromCountrySlug } from "../../../lib/country-route";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "../../../lib/seo";

type CountryLayoutProps = {
  children: ReactNode;
  params: Promise<{ zemlja: string }>;
};

export async function generateMetadata({
  params,
}: CountryLayoutProps): Promise<Metadata> {
  const { zemlja } = await params;
  const country = fromCountrySlug(zemlja);
  const title = `${country} putovanja`;
  const description = `Aktivne ponude i termini za destinaciju ${country} u okviru ABLux Travel programa.`;
  const canonical = `/putovanja/${zemlja}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function CountryLayout({ children }: CountryLayoutProps) {
  return children;
}
