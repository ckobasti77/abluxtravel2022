import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SiteNavigation from "../components/site-navigation";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AB Lux Travel 2022",
  description: "Turisticka platforma za aranzmane i live ponude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body
        className={`${spaceGrotesk.variable} ${orbitron.variable} antialiased`}
      >
        <Providers>
          <SiteNavigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
