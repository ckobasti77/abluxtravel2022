import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Aranžmani",
  description:
    "Premium aranžmani ABLux Travel agencije sa jasnim terminima, cenama i detaljnim programom putovanja.",
  canonical: "/aranzmani",
  keywords: ["aranžmani", "premium putovanja", "ABLux Travel aranžmani"],
});

export default function AranzmaniLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
