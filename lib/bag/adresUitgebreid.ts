"use server";

import type { HouseType } from "@/lib/woning-types";

// Aanvullende woninggegevens via de BAG API Individuele Bevragingen
// (Kadaster), zodat bouwjaar en woonoppervlakte al bekend kunnen zijn.
//
// Sleutel is nog fictief: BAG_API_KEY is een echte, gratis aan te vragen
// sleutel via https://formulieren.kadaster.nl/aanvraag_bag_api_individuele_bevragingen_productie
// (zie Getting started: https://github.com/lvbag/BAG-API/blob/master/Getting%20started.md).
// Zolang de sleutel leeg is, doet deze functie niets: de scan werkt dan
// gewoon met alleen het PDOK-adres, zoals nu.
const BAG_API_KEY = process.env.BAG_API_KEY ?? "";
const ADRESSEN_URL = "https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressenuitgebreid";
const HEADERS = { Accept: "application/hal+json", "Accept-Crs": "epsg:28992", "X-Api-Key": BAG_API_KEY };

export type BagGegevens = {
  bouwjaar: string;
  woonoppervlakte: string;
  /** Richtwaarde voor het vloeroppervlak (isoleerbaar), gemiddelde per woningtype van Gijs. */
  vloeroppervlakte: string;
  /** Richtwaarde voor het dakoppervlak (isolatie aan de binnenzijde), gemiddelde per woningtype van Gijs. */
  dakoppervlakte: string;
  /** Richtwaarde voor het spouwmuuroppervlak, gemiddelde per woningtype van Gijs. */
  gevelOppervlakte: string;
};

// Gemiddelde isolatie-oppervlakten per woningtype (Max, 23-11-2026): leidend boven een schatting uit de
// kadastrale plattegrond (pand-geometrie) of andere metingen. Eerder werden vloer-, dak- en geveloppervlak
// berekend uit de pandvorm in de BAG (omtrek/oppervlak van het pand, met aannames voor dakhelling en
// bouwhoogte); die aanpak gaf er geregeld ~15-30% naast (bijv. een garage vlak bij een vrijstaande woning,
// zie project-woningtype-geometrie). Deze vaste gemiddeldes vervangen die berekening volledig.
const RICHTWAARDE_OPPERVLAK: Record<HouseType, { vloer: number; dak: number; gevel: number }> = {
  tussenwoning: { gevel: 50, dak: 55, vloer: 40 },
  hoekwoning: { gevel: 80, dak: 55, vloer: 45 },
  "twee-onder-een-kap": { gevel: 90, dak: 60, vloer: 55 },
  vrijstaand: { gevel: 130, dak: 100, vloer: 90 },
};

/**
 * Haalt bouwjaar, woonoppervlakte en richtwaarden voor vloer-, dak- en
 * geveloppervlak op bij een BAG-nummeraanduiding-id (die PDOK meegeeft bij
 * het adres opzoeken). Faalt altijd stil (geen sleutel, geen data, of de
 * dienst is niet bereikbaar): dit is een bonus, geen verplicht onderdeel
 * van de scan.
 */
export async function haalBagGegevensOp(nummeraanduidingId: string, houseType: HouseType): Promise<BagGegevens | null> {
  if (!BAG_API_KEY || !nummeraanduidingId) return null;
  try {
    const response = await fetch(`${ADRESSEN_URL}/${encodeURIComponent(nummeraanduidingId)}`, { headers: HEADERS, cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    // De opvraging-op-id geeft het adres direct terug (geen _embedded-envelop, anders dan de zoekresultaten).
    const adres = data?._embedded?.adressenUitgebreid?.[0] ?? data;
    if (!adres) return null;
    const bouwjaar = Array.isArray(adres.oorspronkelijkBouwjaar) ? String(adres.oorspronkelijkBouwjaar[0] ?? "") : "";
    const woonoppervlakte = typeof adres.oppervlakte === "number" ? String(adres.oppervlakte) : "";
    if (!bouwjaar && !woonoppervlakte) return null;

    const richtwaarde = RICHTWAARDE_OPPERVLAK[houseType];
    return {
      bouwjaar, woonoppervlakte,
      vloeroppervlakte: String(richtwaarde.vloer),
      dakoppervlakte: String(richtwaarde.dak),
      gevelOppervlakte: String(richtwaarde.gevel),
    };
  } catch {
    return null;
  }
}
