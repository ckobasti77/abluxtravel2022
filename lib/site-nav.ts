export type SiteNavItem = {
  key:
    | "home"
    | "trips"
    | "arrangements"
    | "religiousTourism"
    | "offers"
    | "about"
    | "contact";
  href: string;
};

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { key: "home", href: "/" },
  { key: "trips", href: "/putovanja" },
  { key: "arrangements", href: "/aranzmani" },
  { key: "religiousTourism", href: "/verski-turizam" },
  { key: "offers", href: "/ponuda" },
  { key: "about", href: "/o-nama" },
  { key: "contact", href: "/kontakt" },
];

