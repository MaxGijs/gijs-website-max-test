// Centrale, providerneutrale analytics-/foutlogging-laag. Geen enkele plek
// in de app roept een analyticsprovider rechtstreeks aan; alles loopt via
// track()/logError() hieronder, zodat een provider later op precies één
// plek wordt aangesloten.
//
// Status: er is nog geen provider gekozen. ACTIVE_PROVIDER is daarom de
// no-op hieronder, en de app moet onveranderd blijven werken zolang dat zo
// is (geen crashes, geen netwerkverkeer, geen console-ruis in productie).
//
// Waar een echte provider later wordt aangesloten (één regel, hieronder bij
// ACTIVE_PROVIDER):
// - Plausible/Matomo (pageviews + custom events, geen PII, cookieloos):
//   track() stuurt het eventtype + de niet-herleidbare properties door.
// - GA4: zelfde, via gtag('event', name, properties).
// - Sentry: logError() stuurt de fout door naar Sentry.captureException/
//   captureMessage; track() kan als Sentry-breadcrumb dienen.
// In alle gevallen geldt: alléén aanroepen wanneer de gekozen provider is
// geconfigureerd én (indien vereist) de bezoeker toestemming heeft gegeven.
// Die consent-check hoort in de provider-implementatie zelf, niet hier.
//
// Nooit doorgeven: naam, e-mailadres, telefoonnummer, volledig adres of
// vrije tekst (bericht/opmerking). Alleen het eventtype en de hieronder
// expliciet getypeerde, niet-herleidbare properties.

export type AnalyticsEvent =
  | { name: "scan_started" }
  | { name: "address_lookup_succeeded" }
  | { name: "address_lookup_failed"; reason: "ongeldige-invoer" | "niet-gevonden" | "onbereikbaar" }
  | { name: "scan_completed" }
  | { name: "energy_scan_requested" }
  | { name: "contact_form_submitted" };

export type AnalyticsErrorContext =
  | "contact_form"
  | "energiescan_aanvraag"
  | "address_lookup";

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  logError(context: AnalyticsErrorContext, message: string): void;
}

// Veilige no-op: wordt gebruikt zolang er geen provider is aangesloten.
// In development loggen we naar de console, puur zodat events tijdens het
// bouwen/testen zichtbaar zijn; in productie doet dit object niets.
const NOOP_PROVIDER: AnalyticsProvider = {
  track(event) {
    if (process.env.NODE_ENV !== "production") console.debug("[analytics:noop]", event);
  },
  logError(context, message) {
    if (process.env.NODE_ENV !== "production") console.debug("[analytics:noop:error]", context, message);
  },
};

// Eén plek om straks een echte provider aan te sluiten.
const ACTIVE_PROVIDER: AnalyticsProvider = NOOP_PROVIDER;

export function track(event: AnalyticsEvent) {
  try { ACTIVE_PROVIDER.track(event); } catch { /* analytics mag de app nooit breken */ }
}

export function logError(context: AnalyticsErrorContext, error: unknown) {
  try { ACTIVE_PROVIDER.logError(context, error instanceof Error ? error.message : String(error)); } catch { /* analytics mag de app nooit breken */ }
}
