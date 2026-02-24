import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "O nama",
  description:
    "Saznaj vise o ABLux Travel agenciji, nasoj misiji i vrednostima koje gradimo od 2022. godine.",
  canonical: "/o-nama",
  keywords: ["o nama", "ablux travel", "turisticka agencija beograd"],
});

export default function ONamaLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
