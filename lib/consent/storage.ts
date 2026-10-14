import type { ConsentPreferences } from "./types";

// Bewaart de cookiekeuze van de bezoeker in localStorage (niet sessionStorage:
// de keuze moet blijven staan als de bezoeker de site een andere dag opnieuw
// bezoekt, dat is hier expliciet vereist). Dit is de enige plek in de hele
// site die localStorage gebruikt — de woningscan gebruikt bewust
// sessionStorage (lib/scan-session.ts) en blijft dat doen.
//
// CONSENT_VERSION: ophogen zodra de doeleinden wezenlijk veranderen (bv. een
// nieuwe categorie, of een ingrijpend andere tool onder "Statistieken"). Een
// oudere of andere versie telt dan als "nog geen keuze gemaakt", dus de
// banner verschijnt opnieuw.
export const CONSENT_VERSION = 1;
const SLEUTEL = "gijs-cookie-consent";

export type OpgeslagenConsent = ConsentPreferences & {
  version: number;
  /** ISO-tijdstip van de laatste keuze — alleen voor eigen debugdoeleinden, nooit getoond. */
  beslistOp: string;
};

/** Geeft null als er nog geen (geldige, actuele) keuze is opgeslagen — dan moet de banner getoond worden. */
export function leesOpgeslagenConsent(): OpgeslagenConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const ruw = window.localStorage.getItem(SLEUTEL);
    if (!ruw) return null;
    const data = JSON.parse(ruw) as Partial<OpgeslagenConsent>;
    if (data.version !== CONSENT_VERSION) return null;
    if (typeof data.statistics !== "boolean" || typeof data.marketing !== "boolean") return null;
    return { statistics: data.statistics, marketing: data.marketing, version: CONSENT_VERSION, beslistOp: data.beslistOp ?? new Date().toISOString() };
  } catch {
    return null;
  }
}

export function schrijfConsent(voorkeuren: ConsentPreferences): void {
  if (typeof window === "undefined") return;
  try {
    const data: OpgeslagenConsent = { ...voorkeuren, version: CONSENT_VERSION, beslistOp: new Date().toISOString() };
    window.localStorage.setItem(SLEUTEL, JSON.stringify(data));
  } catch {
    // localStorage kan geblokkeerd zijn (privénavigatie, browserinstelling) — dan onthoudt de
    // site de keuze niet voor een volgend bezoek, maar de rest van de site blijft gewoon werken.
  }
}
