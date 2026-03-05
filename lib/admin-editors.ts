export type LocalizedText = {
  sr: string;
  en: string;
};

export type AdminSectionKey =
  | "aranzmani"
  | "putovanja"
  | "verski-turizam"
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
    label: { sr: "Aranzmani", en: "Packages" },
    hint: {
      sr: "Kreiranje i uredjivanje kompletnih aranzmana",
      en: "Create and edit full package details",
    },
  },
  {
    key: "putovanja",
    href: "/admin/putovanja",
    label: { sr: "Putovanja", en: "Trips" },
    hint: {
      sr: "Video slajdovi i hero scene za stranicu Zemlje",
      en: "Video slides and hero scenes for the Countries page",
    },
  },
  {
    key: "verski-turizam",
    href: "/admin/verski-turizam",
    label: { sr: "Verski turizam", en: "Religious tourism" },
    hint: {
      sr: "Editor verskih ponuda i hodocasca",
      en: "Religious offers and pilgrimage editor",
    },
  },
  {
    key: "podesavanja",
    href: "/admin/podesavanja",
    label: { sr: "Podesavanja", en: "Settings" },
    hint: {
      sr: "Radno vreme, kontakt i Instagram",
      en: "Working hours, contact and Instagram",
    },
  },
];

export type PageEditorSlot =
  | "home"
  | "aranzmani"
  | "putovanja"
  | "religious"
  | "country"
  | "zemlje"
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
    title: { sr: "Pocetna command zona", en: "Home command zone" },
    description: {
      sr: "Upravljanje glavnim porukama, CTA blokovima i ritmom prve impresije.",
      en: "Control hero messaging, CTA blocks, and first-impression pacing.",
    },
    status: "ready",
  },
  aranzmani: {
    adminSection: "aranzmani",
    title: { sr: "Aranzmani editor", en: "Packages editor" },
    description: {
      sr: "Upravljanje aranzmanima: cene, itinerer, slike i detalji putovanja.",
      en: "Manage trip packages: pricing, itinerary, images, and travel details.",
    },
    status: "ready",
  },
  putovanja: {
    adminSection: "putovanja",
    title: { sr: "Putovanja editor zona", en: "Trips editor zone" },
    description: {
      sr: "Uredjivanje destinacijskih kartica, reda prikaza i prodajnog fokusa po zemlji.",
      en: "Edit destination cards, ordering, and conversion focus by country.",
    },
    status: "ready",
  },
  religious: {
    adminSection: "verski-turizam",
    title: { sr: "Verski editor zona", en: "Religious editor zone" },
    description: {
      sr: "Uredjivanje ponuda za hodocasca, svetinje i verske destinacije.",
      en: "Manage pilgrimage, holy-site, and faith-focused travel offers.",
    },
    status: "ready",
  },
  country: {
    adminSection: "putovanja",
    title: { sr: "Editor za zemlju", en: "Country page editor" },
    description: {
      sr: "Kontrola prezentacije ponuda po zemlji i prioriteta najjacih programa.",
      en: "Control country page presentation and priorities of top-performing offers.",
    },
    status: "ready",
  },
  zemlje: {
    adminSection: "putovanja",
    title: { sr: "Zemlje video editor", en: "Countries video editor" },
    description: {
      sr: "Upravljanje fullscreen video slajdovima za stranicu Zemlje.",
      en: "Manage fullscreen video slides for the Countries page.",
    },
    status: "ready",
  },
  about: {
    adminSection: "podesavanja",
    title: { sr: "O nama editor zona", en: "About editor zone" },
    description: {
      sr: "Uredjivanje narativa brenda, misije i vrednosti koje grade poverenje.",
      en: "Edit brand narrative, mission, and trust-building value statements.",
    },
    status: "ready",
  },
};
