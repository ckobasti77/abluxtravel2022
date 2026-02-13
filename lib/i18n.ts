export type Language = "sr" | "en";
export type ThemeMode = "light" | "dark";

export type SiteDictionary = {
  nav: {
    brand: string;
    home: string;
    trips: string;
    arrangements: string;
    offers: string;
    about: string;
    contact: string;
    signIn: string;
    admin: string;
    language: string;
    theme: string;
    switchToLight: string;
    switchToDark: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    rights: string;
    note: string;
  };
  home: {
    badge: string;
    title: string;
    description: string;
    ctaOffers: string;
    ctaContact: string;
    metricFounded: string;
    metricFocus: string;
    metricPartners: string;
    focusTitle: string;
    focusA: string;
    focusB: string;
    focusC: string;
    modelTitle: string;
    modelDescription: string;
    modelA: string;
    modelB: string;
    modelC: string;
  };
  about: {
    badge: string;
    title: string;
    intro: string;
    mission: string;
    vision: string;
    valuesTitle: string;
    valueA: string;
    valueB: string;
    valueC: string;
  };
  contact: {
    badge: string;
    title: string;
    description: string;
    formTitle: string;
    infoTitle: string;
    fullName: string;
    email: string;
    phone: string;
    travelType: string;
    travelTypePlaceholder: string;
    travelTypeReligious: string;
    travelTypeSummer: string;
    travelTypeEurope: string;
    travelTypeExcursions: string;
    travelTypeCustom: string;
    travelers: string;
    month: string;
    message: string;
    consent: string;
    submit: string;
    success: string;
    requiredError: string;
    emailError: string;
    officeLabel: string;
    officeValue: string;
    emailLabel: string;
    emailValue: string;
    phoneLabel: string;
    phoneValue: string;
    hoursLabel: string;
    hoursValue: string;
  };
  offers: {
    badge: string;
    title: string;
    description: string;
    filterLabel: string;
    filterPlaceholder: string;
    metricSources: string;
    metricConnected: string;
    metricSyncing: string;
    metricLastUpdate: string;
    sourcesTitle: string;
    boardTitle: string;
    noResults: string;
    statusPlanned: string;
    statusConnected: string;
    statusSyncing: string;
    statusPaused: string;
    syncInterval: string;
    lastSync: string;
    departure: string;
    seats: string;
    unknown: string;
    notSynced: string;
    tbd: string;
  };
  trips: {
    badge: string;
    title: string;
    description: string;
    searchLabel: string;
    searchPlaceholder: string;
    openCountry: string;
    noResults: string;
    readyTitle: string;
    readyDescription: string;
  };
  arrangements: {
    badge: string;
    title: string;
    description: string;
    active: string;
    openOffers: string;
    trackA: string;
    trackB: string;
    trackC: string;
    signal: string;
  };
  country: {
    badge: string;
    title: string;
    description: string;
    back: string;
    noOffers: string;
  };
  auth: {
    signInTitle: string;
    signInDescription: string;
    signUpTitle: string;
    signUpDescription: string;
    username: string;
    password: string;
    signInButton: string;
    signUpButton: string;
    noAccount: string;
    hasAccount: string;
    invalidCredentials: string;
    userExists: string;
  };
  admin: {
    accessTitle: string;
    accessDescription: string;
    title: string;
    subtitle: string;
    slideTitle: string;
    slideSubtitle: string;
    slideBadge: string;
    slideCopy: string;
    uploadLabel: string;
    order: string;
    active: string;
    save: string;
    noFile: string;
    uploading: string;
    saved: string;
    currentSlides: string;
    signIn: string;
    optional: string;
  };
};

export const DICTIONARY: Record<Language, SiteDictionary> = {
  sr: {
    nav: {
      brand: "ABLux Travel",
      home: "Pocetna",
      trips: "Putovanja",
      arrangements: "Aranžmani",
      offers: "Ponuda",
      about: "O nama",
      contact: "Kontakt",
      signIn: "Prijava",
      admin: "Admin",
      language: "Jezik",
      theme: "Tema",
      switchToLight: "Svetla",
      switchToDark: "Tamna",
      openMenu: "Otvori meni",
      closeMenu: "Zatvori meni",
    },
    footer: {
      rights: "Sva prava zadržana.",
      note: "Verski turizam, letovanja, evropske ture i ekskurzije za decu.",
    },
    home: {
      badge: "Turisticka agencija od 2022.",
      title: "Pouzdana putovanja osmišljena do detalja.",
      description:
        "ABLux Travel je osnovan sa jasnom vizijom: da svako putovanje bude sigurno, sadržajno i nezaboravno iskustvo. Poseban fokus stavljamo na verski turizam, uz pažljivo izabrana letovanja, evropske gradove i ekskurzije za decu.",
      ctaOffers: "Pregledaj kompletnu ponudu",
      ctaContact: "Pošalji upit",
      metricFounded: "Godina osnivanja: 2022",
      metricFocus: "Specijalizacija: verski turizam",
      metricPartners: "Planirano 15+ partnerskih agencija",
      focusTitle: "Na šta stavljamo akcenat",
      focusA: "Verska putovanja sa pažljivo planiranim rutama i pouzdanom organizacijom.",
      focusB: "Letovanja i gradske ture prilagodene razlicitim budžetima i ritmu putovanja.",
      focusC: "Ekskurzije za decu sa visokim standardima bezbednosti i sadržaja.",
      modelTitle: "Jedna platforma za kompletnu prodaju",
      modelDescription:
        "Sajt je postavljen kao centralno mesto za vaše aranžmane i ponude partnerskih agencija. Integracija API poziva i real-time osvežavanja je vec predvidena u strukturi sistema.",
      modelA: "Vaši aranžmani i putovanja na jednom mestu",
      modelB: "Agregacija ponuda drugih agencija uz provizijsku prodaju",
      modelC: "Spremno za automatsko povlacenje i ažuriranje podataka",
    },
    about: {
      badge: "Ko smo mi",
      title: "ABLux Travel gradi ozbiljan i dugorocan turizam.",
      intro:
        "ABLux Travel je turisticka agencija osnovana 2022. godine sa jasnom vizijom da putnicima pruži kvalitetna, pažljivo osmišljena i pouzdana putovanja.",
      mission:
        "Poseban akcenat od samog pocetka stavljamo na verski turizam, uz bogatu ponudu letovanja, putovanja u evropske gradove i organizaciju ekskurzija za decu.",
      vision:
        "Naš tim posveceno radi na tome da svako putovanje bude sigurno, sadržajno i nezaboravno iskustvo.",
      valuesTitle: "Vrednosti koje pratimo",
      valueA: "Pouzdanost i transparentna komunikacija sa putnicima.",
      valueB: "Kvalitet programa i pažljivo planirana logistika.",
      valueC: "Stalno unapredenje ponude kroz partnerstva i digitalizaciju.",
    },
    contact: {
      badge: "Kontakt i upiti",
      title: "Pošaljite upit za putovanje",
      description:
        "Popunite formu i naš tim ce vam poslati personalizovan predlog putovanja sa tacnim detaljima i cenom.",
      formTitle: "Forma za upit",
      infoTitle: "Kontakt informacije",
      fullName: "Ime i prezime",
      email: "Email adresa",
      phone: "Telefon",
      travelType: "Tip putovanja",
      travelTypePlaceholder: "Izaberite tip putovanja",
      travelTypeReligious: "Verski turizam",
      travelTypeSummer: "Letovanje",
      travelTypeEurope: "Evropski gradovi",
      travelTypeExcursions: "Ekskurzije za decu",
      travelTypeCustom: "Poseban zahtev",
      travelers: "Broj putnika",
      month: "Planirani mesec putovanja",
      message: "Opis upita",
      consent: "Saglasan/na sam da me kontaktirate u vezi sa ovim upitom.",
      submit: "Pošalji upit",
      success: "Hvala. Upit je zabeležen i spreman za backend slanje.",
      requiredError: "Popunite obavezna polja i oznacite saglasnost.",
      emailError: "Unesite ispravnu email adresu.",
      officeLabel: "Adresa",
      officeValue: "Bulevar Putnika 22, Beograd",
      emailLabel: "Email",
      emailValue: "info@abluxtravel2022.rs",
      phoneLabel: "Telefon",
      phoneValue: "+381 11 123 45 67",
      hoursLabel: "Radno vreme",
      hoursValue: "Ponedeljak - petak, 09:00 - 17:00",
    },
    offers: {
      badge: "Agregator ponuda",
      title: "Kompletna ponuda na jednom mestu",
      description:
        "Ovde objedinjavate sopstvene programe i ponude partnerskih agencija. Stranica je spremna za real-time sinhronizaciju cim API integracije budu dostupne.",
      filterLabel: "Filter po destinaciji",
      filterPlaceholder: "Na primer: Rim",
      metricSources: "Izvori",
      metricConnected: "Povezani izvori",
      metricSyncing: "Sinhronizacija u toku",
      metricLastUpdate: "Poslednje osvežavanje",
      sourcesTitle: "Status izvora podataka",
      boardTitle: "Aktivne ponude",
      noResults: "Nema ponuda za trenutni filter.",
      statusPlanned: "Planirano",
      statusConnected: "Povezano",
      statusSyncing: "Sinhronizuje se",
      statusPaused: "Pauzirano",
      syncInterval: "Interval sinhronizacije",
      lastSync: "Poslednja sinhronizacija",
      departure: "Polazak",
      seats: "Slobodna mesta",
      unknown: "Nepoznato",
      notSynced: "Nije sinhronizovano",
      tbd: "U pripremi",
    },
    trips: {
      badge: "Destinacije",
      title: "Putovanja i zemlje",
      description:
        "Izaberite destinaciju i otvorite sve ponude koje su trenutno aktivne za tu zemlju.",
      searchLabel: "Pretraga destinacija",
      searchPlaceholder: "Upišite zemlju ili opis",
      openCountry: "Pogledaj ponude",
      noResults: "Nema rezultata za uneti pojam.",
      readyTitle: "Spremno za proširenje",
      readyDescription:
        "Model stranice je spreman za automatsko dodavanje destinacija iz više izvora podataka.",
    },
    arrangements: {
      badge: "Istaknuti aranžmani",
      title: "Premium aranžmani koji podižu poverenje",
      description:
        "Kurirani prikaz aranžmana sa fokusom na kvalitet programa, jasne informacije i moderan prikaz.",
      active: "Aktivni aranžman",
      openOffers: "Idi na kompletnu ponudu",
      trackA: "Kvalitet programa",
      trackB: "Pouzdana organizacija",
      trackC: "Jasne cene i termini",
      signal: "Aranžman",
    },
    country: {
      badge: "Ponude po zemlji",
      title: "Aktivne ponude za",
      description: "Filtrirani pregled svih dostupnih putovanja za izabranu zemlju.",
      back: "Nazad na putovanja",
      noOffers: "Trenutno nema aktivnih ponuda za ovu destinaciju.",
    },
    auth: {
      signInTitle: "Prijava",
      signInDescription: "Pristup korisnickom nalogu i administraciji.",
      signUpTitle: "Registracija",
      signUpDescription: "Kreirajte nalog i sacuvajte omiljena putovanja.",
      username: "Korisnicko ime",
      password: "Lozinka",
      signInButton: "Prijavi se",
      signUpButton: "Kreiraj nalog",
      noAccount: "Nemate nalog?",
      hasAccount: "Vec imate nalog?",
      invalidCredentials: "Pogrešno korisnicko ime ili lozinka.",
      userExists: "Korisnik vec postoji.",
    },
    admin: {
      accessTitle: "Admin pristup",
      accessDescription: "Pristup ovoj stranici imaju samo admin korisnici.",
      title: "Admin panel",
      subtitle: "Dodavanje i uredivanje video slajdova za prikaz aranžmana i putovanja.",
      slideTitle: "Naslov",
      slideSubtitle: "Podnaslov",
      slideBadge: "Oznaka",
      slideCopy: "Opis",
      uploadLabel: "MP4 fajl",
      order: "Redosled",
      active: "Aktivno",
      save: "Sacuvaj slajd",
      noFile: "Izaberite MP4 fajl.",
      uploading: "Otpremanje u toku...",
      saved: "Slajd je sacuvan.",
      currentSlides: "Trenutni slajdovi",
      signIn: "Prijava",
      optional: "Opciono",
    },
  },
  en: {
    nav: {
      brand: "ABLux Travel",
      home: "Home",
      trips: "Trips",
      arrangements: "Packages",
      offers: "Offers",
      about: "About",
      contact: "Contact",
      signIn: "Sign In",
      admin: "Admin",
      language: "Language",
      theme: "Theme",
      switchToLight: "Light",
      switchToDark: "Dark",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    footer: {
      rights: "All rights reserved.",
      note: "Religious tourism, summer vacations, European city tours, and school excursions.",
    },
    home: {
      badge: "Travel agency established in 2022",
      title: "Reliable trips designed with care.",
      description:
        "ABLux Travel was founded with a clear vision: to provide high-quality, carefully planned, and dependable travel experiences. Our main focus is religious tourism, supported by summer programs, European city breaks, and excursions for children.",
      ctaOffers: "Browse full offer",
      ctaContact: "Send inquiry",
      metricFounded: "Founded: 2022",
      metricFocus: "Core focus: religious tourism",
      metricPartners: "Planned 15+ partner agencies",
      focusTitle: "What we focus on",
      focusA: "Religious journeys with carefully planned routes and reliable logistics.",
      focusB: "Summer and city tours adapted to different budgets and travel styles.",
      focusC: "Children excursions with strong safety and content standards.",
      modelTitle: "One platform for complete sales",
      modelDescription:
        "The website is built as a central hub for your own packages and partner agency offers. API integrations and real-time updates are already considered in the system structure.",
      modelA: "Your own trips and packages in one place",
      modelB: "Aggregated partner offers with commission-based sales",
      modelC: "Ready for automated data pull and live updates",
    },
    about: {
      badge: "Who we are",
      title: "ABLux Travel builds serious and long-term tourism services.",
      intro:
        "ABLux Travel is a travel agency founded in 2022 with a clear vision to provide quality, carefully designed, and reliable travel.",
      mission:
        "From day one, we have placed special emphasis on religious tourism, while also offering summer vacations, European city trips, and excursions for children.",
      vision:
        "Our team is fully committed to making every trip safe, meaningful, and memorable.",
      valuesTitle: "Our values",
      valueA: "Reliability and transparent communication with travelers.",
      valueB: "High program quality and carefully planned logistics.",
      valueC: "Continuous growth through partnerships and digitalization.",
    },
    contact: {
      badge: "Contact and inquiries",
      title: "Send a travel inquiry",
      description:
        "Fill in the form and our team will prepare a personalized travel proposal with full details and pricing.",
      formTitle: "Inquiry form",
      infoTitle: "Contact details",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      travelType: "Travel type",
      travelTypePlaceholder: "Choose travel type",
      travelTypeReligious: "Religious tourism",
      travelTypeSummer: "Summer vacation",
      travelTypeEurope: "European cities",
      travelTypeExcursions: "Children excursions",
      travelTypeCustom: "Custom request",
      travelers: "Number of travelers",
      month: "Planned travel month",
      message: "Inquiry details",
      consent: "I agree to be contacted regarding this inquiry.",
      submit: "Send inquiry",
      success: "Thank you. The inquiry is recorded and ready for backend delivery.",
      requiredError: "Please fill all required fields and accept consent.",
      emailError: "Please enter a valid email address.",
      officeLabel: "Address",
      officeValue: "Bulevar Putnika 22, Belgrade",
      emailLabel: "Email",
      emailValue: "info@abluxtravel2022.rs",
      phoneLabel: "Phone",
      phoneValue: "+381 11 123 45 67",
      hoursLabel: "Working hours",
      hoursValue: "Monday - Friday, 09:00 - 17:00",
    },
    offers: {
      badge: "Offer aggregator",
      title: "Complete offer in one place",
      description:
        "Combine your own programs with partner agency offers. This page is ready for real-time sync as soon as API integrations are available.",
      filterLabel: "Destination filter",
      filterPlaceholder: "Example: Rome",
      metricSources: "Sources",
      metricConnected: "Connected",
      metricSyncing: "Syncing",
      metricLastUpdate: "Last update",
      sourcesTitle: "Data source status",
      boardTitle: "Active offers",
      noResults: "No offers found for the current filter.",
      statusPlanned: "Planned",
      statusConnected: "Connected",
      statusSyncing: "Syncing",
      statusPaused: "Paused",
      syncInterval: "Sync interval",
      lastSync: "Last sync",
      departure: "Departure",
      seats: "Seats left",
      unknown: "Unknown",
      notSynced: "Not synced",
      tbd: "TBD",
    },
    trips: {
      badge: "Destinations",
      title: "Trips and countries",
      description:
        "Choose a destination and open all offers currently active for that country.",
      searchLabel: "Search destinations",
      searchPlaceholder: "Type country or keyword",
      openCountry: "View offers",
      noResults: "No matches for your search.",
      readyTitle: "Ready to scale",
      readyDescription:
        "The page model is prepared for automatic destination expansion from multiple data sources.",
    },
    arrangements: {
      badge: "Featured packages",
      title: "Premium packages that build trust",
      description:
        "Curated package showcase focused on program quality, clear information, and modern presentation.",
      active: "Active package",
      openOffers: "Open full offer",
      trackA: "Program quality",
      trackB: "Reliable organization",
      trackC: "Clear pricing and dates",
      signal: "Package",
    },
    country: {
      badge: "Country offers",
      title: "Active offers for",
      description: "Filtered overview of all available trips for the selected country.",
      back: "Back to trips",
      noOffers: "There are currently no active offers for this destination.",
    },
    auth: {
      signInTitle: "Sign In",
      signInDescription: "Access your account and admin features.",
      signUpTitle: "Sign Up",
      signUpDescription: "Create an account and save your favorite trips.",
      username: "Username",
      password: "Password",
      signInButton: "Sign In",
      signUpButton: "Create account",
      noAccount: "No account yet?",
      hasAccount: "Already have an account?",
      invalidCredentials: "Invalid username or password.",
      userExists: "User already exists.",
    },
    admin: {
      accessTitle: "Admin access",
      accessDescription: "Only admin users can access this page.",
      title: "Admin panel",
      subtitle: "Upload and manage video slides used across packages and trips.",
      slideTitle: "Title",
      slideSubtitle: "Subtitle",
      slideBadge: "Badge",
      slideCopy: "Description",
      uploadLabel: "MP4 file",
      order: "Order",
      active: "Active",
      save: "Save slide",
      noFile: "Please choose an MP4 file.",
      uploading: "Uploading...",
      saved: "Slide saved.",
      currentSlides: "Current slides",
      signIn: "Sign In",
      optional: "Optional",
    },
  },
};

