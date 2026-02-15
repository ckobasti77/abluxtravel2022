import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SiteNavigation from "../components/site-navigation";
import SiteFooter from "../components/site-footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const themeScript = `(() => {
  try {
    const stored = localStorage.getItem("ablux_theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = "dark";
  }
})();`;

export const metadata: Metadata = {
  title: "ABLux Travel",
  description:
    "ABLux Travel - turisticka agencija za verski turizam, letovanja, gradska putovanja i ekskurzije.",
  icons: {
    icon: [{ url: "/logo.png?v=20260214", type: "image/png" }],
    shortcut: [{ url: "/logo.png?v=20260214", type: "image/png" }],
    apple: [{ url: "/logo.png?v=20260214", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-Latn" suppressHydrationWarning>
      <body className={`${manrope.variable} ${sora.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>
          <SiteNavigation />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}

