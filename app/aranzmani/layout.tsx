import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Aranzmani",
  description:
    "Premium aranzmani ABLux Travel agencije sa jasnim terminima, cenama i detaljnim programom putovanja.",
  canonical: "/aranzmani",
  keywords: ["aranzmani", "premium putovanja", "ablux travel aranzmani"],
});

export default function AranzmaniLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
