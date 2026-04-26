export type SiteNavSubItem = {
  key: string;
  href: string;
  label?: string;
};

export type SiteNavItem = {
  key:
    | "home"
    | "trips"
    | "arrangements"
    | "religiousTourism"
    | "rentBus"
    | "about"
    | "contact";
  href: string;
  children?: SiteNavSubItem[];
};

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { key: "home", href: "/" },
  {
    key: "trips",
    href: "/putovanja",
    children: [
      { key: "subExotic", href: "/putovanja" },
      { key: "subEurope", href: "/putovanja" },
      { key: "subCountries", href: "/zemlje" },
    ],
  },
  {
    key: "arrangements",
    href: "/aranzmani",
    children: [
      { key: "subAllPackages", href: "/aranzmani" },
      { key: "subSummer", href: "/aranzmani" },
      { key: "subExcursions", href: "/aranzmani" },
    ],
  },
  {
    key: "religiousTourism",
    href: "/verski-turizam",
    children: [
      { key: "subPilgrimages", href: "/verski-turizam" },
      { key: "subMonasteries", href: "/verski-turizam" },
    ],
  },
  { key: "rentBus", href: "/iznajmljivanje-vozila" },
  { key: "about", href: "/o-nama" },
  { key: "contact", href: "/kontakt" },
];
