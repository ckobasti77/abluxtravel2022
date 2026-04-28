import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Ponude",
  description:
    "Aktivne ABLux Travel ponude sa cenama, terminima, polascima i raspoloživim mestima za brže poređenje.",
  canonical: "/ponude",
  keywords: ["ponude za putovanja", "turističke ponude", "ABLux Travel ponude"],
});

export default function PonudeLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
