import type { ConsentPreferences } from "./types";
import { pushToDataLayer } from "./dataLayer";

// Google Consent Mode v2: de daadwerkelijke standaard ("alles denied") staat
// in components/consent/ConsentDefaultScript.tsx en draait zo vroeg mogelijk
// (next/script strategy="beforeInteractive"), vóór GTM zelf laadt. Deze
// functie stuurt daarna de "update" door zodra de echte (opgeslagen of
// zojuist gekozen) voorkeur bekend is — dat mag altijd, ook als GTM nog niet
// geladen is: window.dataLayer bestaat dan al (door het default-script) en
// de update blijft gewoon in de wachtrij staan totdat GTM 'm oppikt.
//
// BELANGRIJK: gtag() moet het échte, natieve arguments-object doorgeven aan
// dataLayer.push — niet een met rest-parameters (...args) samengestelde
// gewone Array. Google's gtag.js/GTM herkent alleen de eerste vorm als een
// geldige consent-opdracht; een Array met identieke inhoud wordt
// stilzwijgend genegeerd (bevestigd: analytics_storage bleef op "denied"
// staan, ook na toestemming — zie het rapport van 14 oktober 2026). Daarom
// hier bewust een gewone function-declaratie (geen rest-parameters of
// spread, ook al zou een linter daarom kunnen vragen) die intern het echte
// arguments-object gebruikt, exact het patroon dat ConsentDefaultScript.tsx
// ook al gebruikt.
// De parameters hieronder dienen alleen om TypeScript de juiste aanroepvorm te laten afdwingen;
// de functie gebruikt zelf bewust "arguments" (hieronder), niet deze namen — een gewone
// function-declaratie met benoemde parameters heeft nog steeds het echte arguments-object,
// zolang het geen rest-parameter (...rest) of pijlfunctie is.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- namen dienen alleen als type-afdwinging, zie hierboven
function gtag(_command: "consent", _action: "update", _params: Record<string, string>) {
  // eslint-disable-next-line prefer-rest-params -- moet het échte arguments-object zijn, zie hierboven
  pushToDataLayer(arguments);
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
  pushToDataLayer({ event: "consent_update", consent_statistics: voorkeuren.statistics, consent_marketing: voorkeuren.marketing });
}
