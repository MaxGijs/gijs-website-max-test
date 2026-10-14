// Eén centrale definitie van de cookietoestemming: twee optionele categorieën
// (noodzakelijk staat hier bewust niet bij — die is nooit uit te zetten en
// vraagt dus ook nooit toestemming). Zie lib/consent/storage.ts voor de
// opslag en components/consent/ConsentProvider.tsx voor de React-kant.
export type ConsentPreferences = {
  /** Google Analytics 4, Microsoft Clarity, Contentsquare — allemaal onder één categorie, zie components/consent/CookieSettingsModal.tsx. */
  statistics: boolean;
  /** Nu nog niet gebruikt (geen enkele marketingtracking is live); staat klaar voor later. */
  marketing: boolean;
};

export const GEEN_TOESTEMMING: ConsentPreferences = { statistics: false, marketing: false };
export const ALLE_TOESTEMMING: ConsentPreferences = { statistics: true, marketing: true };
