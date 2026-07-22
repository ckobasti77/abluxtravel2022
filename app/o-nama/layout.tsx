import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "O nama",
  description:
    "Saznajte više o ABLux Travel agenciji, našoj misiji i vrednostima koje gradimo od 2022. godine.",
  canonical: "/o-nama",
  keywords: ["o nama", "ABLux Travel", "turistička agencija Beograd"],
});

export default function ONamaLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
