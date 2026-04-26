export type LocalizedText = {
  sr: string;
  en: string;
};

export type AdminSectionKey =
  | "pocetna"
  | "aranzmani"
  | "putovanja"
  | "iznajmljivanje-vozila"
  | "verski-turizam"
  | "podesavanja";

export type AdminSectionIcon =
  | "dashboard"
  | "home"
  | "arrangements"
  | "trips"
  | "vehicles"
  | "users"
  | "media"
  | "settings"
  | "religious";

export type AdminSectionConfig = {
  key: AdminSectionKey;
  href: `/admin/${AdminSectionKey}`;
  label: LocalizedText;
  hint: LocalizedText;
  icon: AdminSectionIcon;
};

export const ADMIN_SECTIONS: AdminSectionConfig[] = [
  {
    key: "pocetna",
    href: "/admin/pocetna",
    label: { sr: "Početna", en: "Home" },
    hint: {
      sr: "Slike i redosled za početni swiper najtraženijih ruta",
      en: "Images and ordering for the homepage requested-routes swiper",
    },
    icon: "home",
  },
  {
    key: "aranzmani",
    href: "/admin/aranzmani",
    label: { sr: "Aranžmani", en: "Packages" },
    hint: {
      sr: "Kreiranje i uređivanje kompletnih aranžmana",
      en: "Create and edit full package details",
    },
    icon: "arrangements",
  },
  {
    key: "putovanja",
    href: "/admin/putovanja",
    label: { sr: "Putovanja", en: "Trips" },
    hint: {
      sr: "Video slajdovi i hero scene za stranicu Putovanja",
      en: "Video slides and hero scenes for the Trips page",
    },
    icon: "trips",
  },
  {
    key: "iznajmljivanje-vozila",
    href: "/admin/iznajmljivanje-vozila",
    label: { sr: "Iznajmljivanje vozila", en: "Vehicle rental" },
    hint: {
      sr: "Glavne slike za autobus i luksuzni kombi sa vozačem",
      en: "Main images for coach and luxury van rental with driver",
    },
    icon: "vehicles",
  },
  {
    key: "verski-turizam",
    href: "/admin/verski-turizam",
    label: { sr: "Verski turizam", en: "Religious tourism" },
    hint: {
      sr: "Uređivanje verskih ponuda i hodočašća",
      en: "Religious offers and pilgrimage editor",
    },
    icon: "religious",
  },
  {
    key: "podesavanja",
    href: "/admin/podesavanja",
    label: { sr: "Podešavanja", en: "Settings" },
    hint: {
      sr: "Radno vreme, kontakt i Instagram",
      en: "Working hours, contact and Instagram",
    },
    icon: "settings",
  },
];

export type PageEditorSlot =
  | "home"
  | "aranzmani"
  | "putovanja"
  | "religious"
  | "country"
  | "about";

export type PageEditorConfig = {
  adminSection: AdminSectionKey;
  title: LocalizedText;
  description: LocalizedText;
  status: "ready" | "planned";
};

export const PAGE_EDITOR_CONFIG: Record<PageEditorSlot, PageEditorConfig> = {
  home: {
    adminSection: "pocetna",
    title: { sr: "Početna command zona", en: "Home command zone" },
    description: {
      sr: "Upravljanje glavnim porukama, CTA blokovima i ritmom prve impresije.",
      en: "Control hero messaging, CTA blocks, and first-impression pacing.",
    },
    status: "ready",
  },
  aranzmani: {
    adminSection: "aranzmani",
    title: { sr: "Aranžmani editor", en: "Packages editor" },
    description: {
      sr: "Upravljanje aranžmanima: cene, program, slike i detalji putovanja.",
      en: "Manage trip packages: pricing, itinerary, images, and travel details.",
    },
    status: "ready",
  },
  putovanja: {
    adminSection: "putovanja",
    title: { sr: "Putovanja video editor zona", en: "Trips media editor zone" },
    description: {
      sr: "Uređivanje fullscreen destinacijskih scena, redosleda slajdova i CTA prelaza na stranicu pojedinačne zemlje.",
      en: "Edit full-screen destination scenes, slide order, and CTA transitions to individual country pages.",
    },
    status: "ready",
  },
  religious: {
    adminSection: "verski-turizam",
    title: { sr: "Verski editor zona", en: "Religious editor zone" },
    description: {
      sr: "Uređivanje ponuda za hodočašća, svetinje i verske destinacije.",
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
  about: {
    adminSection: "podesavanja",
    title: { sr: "O nama editor zona", en: "About editor zone" },
    description: {
      sr: "Uređivanje narativa brenda, misije i vrednosti koje grade poverenje.",
      en: "Edit brand narrative, mission, and trust-building value statements.",
    },
    status: "ready",
  },
};
