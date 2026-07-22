import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Putovanja",
  description:
    "Istraži aktivne destinacije i putovanja ABLux Travel agencije, sa pregledom ponuda po zemlji i terminu.",
  canonical: "/putovanja",
  keywords: ["putovanja", "destinacije", "turistička ponuda"],
});

export default function PutovanjaLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
