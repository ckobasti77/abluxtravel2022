export type LocalizedText = {
  sr: string;
  en: string;
};

export type AdminSectionKey =
  | "aranzmani"
  | "putovanja"
  | "ponuda"
  | "kontakt"
  | "podesavanja";

export type AdminSectionConfig = {
  key: AdminSectionKey;
  href: `/admin/${AdminSectionKey}`;
  label: LocalizedText;
  hint: LocalizedText;
};

export const ADMIN_SECTIONS: AdminSectionConfig[] = [
  {
    key: "aranzmani",
    href: "/admin/aranzmani",
    label: { sr: "Aranzmani", en: "Arrangements" },
    hint: { sr: "Hero video slajdovi", en: "Hero video slides" },
  },
  {
    key: "putovanja",
    href: "/admin/putovanja",
    label: { sr: "Putovanja", en: "Trips" },
    hint: { sr: "Destinacije i sekcije", en: "Destinations and sections" },
  },
  {
    key: "ponuda",
    href: "/admin/ponuda",
    label: { sr: "Ponuda", en: "Offer Board" },
    hint: { sr: "Aktivni feed i source status", en: "Live feed and source status" },
  },
  {
    key: "kontakt",
    href: "/admin/kontakt",
    label: { sr: "Kontakt", en: "Contact" },
    hint: { sr: "Forma i info blokovi", en: "Form and info blocks" },
  },
  {
    key: "podesavanja",
    href: "/admin/podesavanja",
    label: { sr: "Podesavanja", en: "Settings" },
    hint: { sr: "Globalna pravila sajta", en: "Global site rules" },
  },
];

export type PageEditorSlot =
  | "home"
  | "aranzmani"
  | "putovanja"
  | "country"
  | "ponuda"
  | "kontakt"
  | "about";

export type PageEditorConfig = {
  adminSection: AdminSectionKey;
  title: LocalizedText;
  description: LocalizedText;
  status: "ready" | "planned";
};

export const PAGE_EDITOR_CONFIG: Record<PageEditorSlot, PageEditorConfig> = {
  home: {
    adminSection: "podesavanja",
    title: { sr: "Pocetna editor zona", en: "Home editor zone" },
    description: {
      sr: "Pripremljeno za buduci editor hero teksta, CTA blokova i metrika.",
      en: "Prepared for a future editor of hero copy, CTA blocks, and metrics.",
    },
    status: "planned",
  },
  aranzmani: {
    adminSection: "aranzmani",
    title: { sr: "Aranzmani editor", en: "Arrangements editor" },
    description: {
      sr: "Aktivni editor za hero slajdove i redosled prikaza.",
      en: "Active editor for hero slides and display order.",
    },
    status: "ready",
  },
  putovanja: {
    adminSection: "putovanja",
    title: { sr: "Putovanja editor zona", en: "Trips editor zone" },
    description: {
      sr: "Pripremljeno za uredjivanje kartica destinacija i filter bloka.",
      en: "Prepared for destination cards and filter block editing.",
    },
    status: "planned",
  },
  country: {
    adminSection: "putovanja",
    title: { sr: "Editor za zemlju", en: "Country page editor" },
    description: {
      sr: "Pripremljeno za pravila prikaza ponuda po drzavi.",
      en: "Prepared for country-specific offer presentation rules.",
    },
    status: "planned",
  },
  ponuda: {
    adminSection: "ponuda",
    title: { sr: "Ponuda editor zona", en: "Offer editor zone" },
    description: {
      sr: "Pripremljeno za source kontrole, prioritete i board sekcije.",
      en: "Prepared for source controls, priorities, and board sections.",
    },
    status: "planned",
  },
  kontakt: {
    adminSection: "kontakt",
    title: { sr: "Kontakt editor zona", en: "Contact editor zone" },
    description: {
      sr: "Pripremljeno za upravljanje formom i kontakt blokovima.",
      en: "Prepared for form behavior and contact block management.",
    },
    status: "planned",
  },
  about: {
    adminSection: "podesavanja",
    title: { sr: "O nama editor zona", en: "About editor zone" },
    description: {
      sr: "Pripremljeno za buduce uredjivanje sekcije O nama.",
      en: "Prepared for future About page editing.",
    },
    status: "planned",
  },
};

