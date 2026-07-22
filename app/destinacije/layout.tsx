import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Destinacije",
  description:
    "Pregled ABLux Travel destinacija odvojen od aranžmana i ponuda, sa brzim pristupom aktivnim programima po zemlji.",
  canonical: "/destinacije",
  keywords: ["destinacije", "putovanja po zemlji", "ABLux Travel destinacije"],
});

export default function DestinacijeLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
