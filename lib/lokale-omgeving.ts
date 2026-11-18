// Lokale testmodus: op localhost of tijdens `next dev` mag niets de echte wereld in. Geen lead naar
// Teamleader (via de Make-webhook), geen interne mail via Resend en geen rij in Supabase. .env.local
// bevat namelijk dezelfde sleutels als productie, dus zonder deze rem schrijft een lokale testscan
// gewoon in de echte database en mailt hij Gijs.
//
// De bestaande koppelingen zelf blijven ongewijzigd: elke server-actie vraagt hier alleen of hij in
// een lokale omgeving draait, en geeft dan een gesimuleerd "gelukt" terug (met `lokaal: true`), zodat
// de interface een duidelijke lokale melding kan tonen in plaats van een echte bevestiging.
//
// Bewust geen "use server": dit is een interne hulpfunctie, geen aanroepbare Server Action.
import "server-only";

import { headers } from "next/headers";

const LOKALE_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|[a-z0-9-]+\.localhost)(:\d+)?$/i;

export async function isLokaleOmgeving(): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;
  // Ook een lokale productiebuild (`next build && next start` op localhost) telt als lokaal.
  try {
    const host = (await headers()).get("host") ?? "";
    return LOKALE_HOST.test(host);
  } catch {
    // Buiten een request (bv. tijdens een build) is er geen host; dan is dit geen lokale testklik.
    return false;
  }
}

/** Eén herkenbare logregel per geblokkeerde verzending, zodat in de serverlog te controleren is dat er niets weg ging. */
export function meldGeblokkeerd(wat: string) {
  console.info(`[lokaal] ${wat} geblokkeerd: lokale omgeving, er is niets verstuurd of opgeslagen.`);
}
