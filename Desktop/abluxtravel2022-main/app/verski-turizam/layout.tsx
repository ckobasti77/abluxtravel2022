import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Verski turizam",
  description:
    "Hodocasca i verska putovanja uz kompletnu organizaciju i proverene rute ka svetim destinacijama.",
  canonical: "/verski-turizam",
  keywords: ["verski turizam", "hodocasce", "svete destinacije"],
});

export default function VerskiTurizamLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
