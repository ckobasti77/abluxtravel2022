export type SiteNavItem = {
  key:
    | "home"
    | "trips"
    | "arrangements"
    | "religiousTourism"
    | "about"
    | "contact";
  href: string;
};

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { key: "home", href: "/" },
  { key: "trips", href: "/putovanja" },
  { key: "arrangements", href: "/aranzmani" },
  { key: "religiousTourism", href: "/verski-turizam" },
  { key: "about", href: "/o-nama" },
  { key: "contact", href: "/kontakt" },
];
