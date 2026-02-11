export type SiteNavItem = {
  label: string;
  href: string;
};

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { label: "Pocetna", href: "/" },
  { label: "Putovanja", href: "/putovanja" },
  { label: "Aranzmani", href: "/aranzmani" },
  { label: "Ponuda", href: "/ponuda" },
  { label: "O nama", href: "/o-nama" },
  { label: "Kontakt", href: "/kontakt" },
];
