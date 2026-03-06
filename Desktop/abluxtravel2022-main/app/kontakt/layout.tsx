import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "../../lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Kontakt",
  description:
    "Kontaktiraj ABLux Travel tim za verski turizam, letovanja, gradske ture i personalizovane upite.",
  canonical: "/kontakt",
  keywords: ["kontakt", "turisticka agencija kontakt", "ablux travel beograd"],
});

export default function KontaktLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
