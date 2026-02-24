import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Ponuda",
  description:
    "Kompletna turisticka ponuda na jednom mestu: sopstveni programi i partnerske agencijske ture.",
  canonical: "/ponuda",
  keywords: ["turisticka ponuda", "ponude putovanja", "ablux travel ponuda"],
});

export default function PonudaLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
