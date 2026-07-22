const FALLBACK_SITE_URL = "https://www.abluxtravel2022.rs";

export const SITE_NAME = "ABLux Travel";
export const SITE_SHORT_NAME = "ABLux";
export const SITE_DESCRIPTION =
  "ABLux Travel je premium turistička agencija za verski turizam, letovanja, gradske ture i grupna putovanja sa jasnom organizacijom i sigurnim iskustvom.";
export const SITE_KEYWORDS = [
  "ABLux Travel",
  "turistička agencija",
  "verski turizam",
  "hodočašća",
  "putovanja",
  "aranžmani",
  "letovanja",
  "gradske ture",
  "ekskurzije",
  "turistička ponuda Srbija",
  "premium putovanja",
  "religious tourism",
  "travel agency Serbia",
];
export const DEFAULT_OG_IMAGE = "/pocetna.avif";
export const CONTACT_EMAIL = "info@abluxtravel2022.rs";
export const CONTACT_PHONE = "+381111234567";

export const CONTACT_ADDRESS = {
  streetAddress: "Bulevar Putnika 22",
  addressLocality: "Beograd",
  addressCountry: "RS",
};

const normalizeSiteUrl = (value: string) => {
  const candidate = value.trim();
  if (!candidate) {
    return FALLBACK_SITE_URL;
  }

  try {
    const url = new URL(candidate);
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
};

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL
);
export const SITE_URL_OBJECT = new URL(SITE_URL);
