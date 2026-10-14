import { leesOpgeslagenConsent } from "@/lib/consent/storage";
import { pushToDataLayer } from "@/lib/consent/dataLayer";

// Centrale, providerneutrale analytics-laag. Geen enkele plek in de app roept
// een analyticsprovider rechtstreeks aan; alles loopt via track()/logError()
// hieronder. De provider hier is GTM/dataLayer (GA4 wordt via Google Tag
// Manager beheerd, zie GtmLoader.tsx — geen apart gtag.js-script).
//
// Toestemming: track() stuurt alléén iets naar dataLayer als er al
// statistieken-toestemming is opgeslagen (leesOpgeslagenConsent — zelfde bron
// als ConsentProvider). Dat is bewust een harde, hier-in-code gecontroleerde
// grens, los van of GTM al geladen is of hoe de tags in GTM zelf zijn
// ingesteld: zo kan nooit gedrag van vóór toestemming alsnog verstuurd worden
// zodra GTM later laadt (een dataLayer-push die al in de wachtrij stond vóór
// GTM initialiseert, wordt namelijk gewoon alsnog verwerkt).
//
// Nooit doorgeven: naam, e-mailadres, telefoonnummer, volledig adres,
// postcode+huisnummer samen, of vrije tekst (bericht/opmerking). Alleen het
// eventtype en de hieronder expliciet getypeerde, niet-herleidbare properties.

export type AnalyticsEvent =
  // Bestaande events (ongewijzigd, voor compatibiliteit met waar ze al gebruikt worden).
  | { name: "scan_started" }
  | { name: "address_lookup_succeeded" }
  | { name: "address_lookup_failed"; reason: "ongeldige-invoer" | "niet-gevonden" | "onbereikbaar" }
  | { name: "scan_completed" }
  | { name: "energy_scan_requested" }
  | { name: "contact_form_submitted" }
  // Nieuw, voor de klantreis website → lead (zie het analytics-rapport voor de GTM/GA4-koppeling).
  | { name: "woningscan_started" }
  | { name: "woningscan_step_viewed"; step: number; step_name: string }
  | { name: "woningscan_step_completed"; step: number; step_name: string }
  | { name: "woningscan_completed" }
  | { name: "woningplan_viewed" }
  | { name: "contact_form_started" }
  | { name: "lead_created"; source: "woningscan" | "contactformulier" }
  | { name: "whatsapp_clicked"; plaats: string }
  | { name: "cta_clicked"; cta: string };

export type AnalyticsErrorContext =
  | "contact_form"
  | "energiescan_aanvraag"
  | "address_lookup";

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  logError(context: AnalyticsErrorContext, message: string): void;
}

function heeftStatistiekenToestemming(): boolean {
  return leesOpgeslagenConsent()?.statistics === true;
}

const GTM_PROVIDER: AnalyticsProvider = {
  track(event) {
    if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event);
    if (!heeftStatistiekenToestemming()) return;
    const { name, ...properties } = event;
    pushToDataLayer({ event: name, ...properties });
  },
  logError(context, message) {
    // Foutlogging is bewust geen analytics-event (geen foutmeldingen naar GA4/dataLayer) — dit
    // blijft, net als voorheen, alleen een ontwikkelconsole-hulpmiddel. Een losse foutmonitoring-
    // dienst (bv. Sentry) valt buiten deze opdracht.
    if (process.env.NODE_ENV !== "production") console.debug("[analytics:error]", context, message);
  },
};

const ACTIVE_PROVIDER: AnalyticsProvider = GTM_PROVIDER;

export function track(event: AnalyticsEvent) {
  try { ACTIVE_PROVIDER.track(event); } catch { /* analytics mag de app nooit breken */ }
}

export function logError(context: AnalyticsErrorContext, error: unknown) {
  try { ACTIVE_PROVIDER.logError(context, error instanceof Error ? error.message : String(error)); } catch { /* analytics mag de app nooit breken */ }
}
