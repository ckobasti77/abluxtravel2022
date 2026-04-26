import type { Metadata } from "next";
import { createPageMetadata } from "../../../lib/page-metadata";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return createPageMetadata({
    title: `${title} | Aranžman`,
    description: `Detalji aranžmana ${title} — cena, program, transport i sve informacije za putovanje.`,
    canonical: `/aranzmani/${slug}`,
    keywords: [title, "aranžman", "putovanje", "ABLux Travel"],
  });
}

export default function TripDetailLayout({ children }: Props) {
  return <>{children}</>;
}
