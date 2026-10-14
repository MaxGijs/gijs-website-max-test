import type { ConsentPreferences } from "./types";

// Google Consent Mode v2: de daadwerkelijke standaard ("alles denied") staat
// in components/consent/ConsentDefaultScript.tsx en draait zo vroeg mogelijk
// (next/script strategy="beforeInteractive"), vóór GTM zelf laadt. Deze
// functie stuurt daarna de "update" door zodra de echte (opgeslagen of
// zojuist gekozen) voorkeur bekend is — dat mag altijd, ook als GTM nog niet
// geladen is: window.dataLayer bestaat dan al (door het default-script) en
// de update blijft gewoon in de wachtrij staan totdat GTM 'm oppikt.
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function werkConsentModeBij(voorkeuren: ConsentPreferences): void {
  gtag("consent", "update", {
    analytics_storage: voorkeuren.statistics ? "granted" : "denied",
    ad_storage: voorkeuren.marketing ? "granted" : "denied",
    ad_user_data: voorkeuren.marketing ? "granted" : "denied",
    ad_personalization: voorkeuren.marketing ? "granted" : "denied",
  });
  // Los van Consent Mode zelf: een gewone dataLayer-event, zodat eigen GTM-triggers
  // ("als statistieken-toestemming verandert, doe dan X") hierop kunnen reageren.
  if (typeof window !== "undefined") {
    window.dataLayer?.push({ event: "consent_update", consent_statistics: voorkeuren.statistics, consent_marketing: voorkeuren.marketing });
  }
}
