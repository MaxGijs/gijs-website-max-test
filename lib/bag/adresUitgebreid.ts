"use server";

import type { HouseType } from "@/lib/woning-types";

// Aanvullende woninggegevens via de BAG API Individuele Bevragingen
// (Kadaster), zodat bouwjaar, woonoppervlakte en enkele richtwaarden voor
// isolatiematen al bekend kunnen zijn.
//
// Sleutel is nog fictief: BAG_API_KEY is een echte, gratis aan te vragen
// sleutel via https://formulieren.kadaster.nl/aanvraag_bag_api_individuele_bevragingen_productie
// (zie Getting started: https://github.com/lvbag/BAG-API/blob/master/Getting%20started.md).
// Zolang de sleutel leeg is, doet deze functie niets: de scan werkt dan
// gewoon met alleen het PDOK-adres, zoals nu.
const BAG_API_KEY = process.env.BAG_API_KEY ?? "";
const ADRESSEN_URL = "https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressenuitgebreid";
const PANDEN_URL = "https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/panden";
const HEADERS = { Accept: "application/hal+json", "Accept-Crs": "epsg:28992", "X-Api-Key": BAG_API_KEY };

export type BagGegevens = {
  bouwjaar: string;
  woonoppervlakte: string;
  /** Werkelijke oppervlakte van de begane grond, uit de kadastrale plattegrond (pand-geometrie). Leeg als de plattegrond niet kon worden opgehaald. */
  vloeroppervlakte: string;
  /** Richtwaarde voor het dakoppervlak: plattegrond x standaard hellingsfactor. Geen exacte meting (dakhelling staat niet in de BAG). */
  dakoppervlakte: string;
  /** Richtwaarde voor het buitengeveloppervlak: omtrek x aangenomen bouwhoogte, min. gedeelde muren met de buren. Geen exacte meting (bouwhoogte staat niet in de BAG). */
  gevelOppervlakte: string;
};

/** Oppervlakte (m², shoelace-formule) en omtrek (m) van een gesloten veelhoek in RD-coördinaten (meters). */
function veelhoekMaten(ring: [number, number][]) {
  let oppervlakte = 0;
  let omtrek = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    oppervlakte += x1 * y2 - x2 * y1;
    omtrek += Math.hypot(x2 - x1, y2 - y1);
  }
  return { oppervlakte: Math.abs(oppervlakte) / 2, omtrek };
}

/** Standaard dakhellingsfactor (plattegrond → dakvlak) en aangenomen bouwhoogte: de BAG kent geen dakhelling of bouwhoogte, dit zijn richtwaarden. */
const DAK_HELLINGSFACTOR = 1.3;
const AANGENOMEN_BOUWHOOGTE = 5.4;
/** Aandeel van de omtrek dat een gedeelde muur met de buren is (niet te isoleren), per woningtype. */
const GEDEELDE_MUUR_AANDEEL: Record<HouseType, number> = {
  hoekwoning: 0.2,
  tussenwoning: 0.4,
  "twee-onder-een-kap": 0.2,
  vrijstaand: 0,
};

async function haalPandGeometrieOp(pandIdentificatie: string) {
  const response = await fetch(`${PANDEN_URL}/${encodeURIComponent(pandIdentificatie)}`, { headers: HEADERS, cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json();
  const ring = data?.pand?.geometrie?.coordinates?.[0] as [number, number, number][] | undefined;
  if (!ring || ring.length < 4) return null;
  return veelhoekMaten(ring.map(([x, y]) => [x, y]));
}

/** Sommige (met name oudere) panden omvatten meerdere woningen; deel de plattegrond dan door het aantal adressen. */
async function telAdressenPerPand(pandIdentificatie: string): Promise<number> {
  const response = await fetch(`${ADRESSEN_URL}?pandIdentificatie=${encodeURIComponent(pandIdentificatie)}`, { headers: HEADERS, cache: "no-store" });
  if (!response.ok) return 1;
  const data = await response.json();
  const lijst = data?._embedded?.adressen;
  return Array.isArray(lijst) && lijst.length > 0 ? lijst.length : 1;
}

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

    const gegevens: BagGegevens = { bouwjaar, woonoppervlakte, vloeroppervlakte: "", dakoppervlakte: "", gevelOppervlakte: "" };
    const pandId = Array.isArray(adres.pandIdentificaties) ? adres.pandIdentificaties[0] : undefined;
    if (typeof pandId === "string") {
      const [geometrie, aantalAdressen] = await Promise.all([haalPandGeometrieOp(pandId), telAdressenPerPand(pandId)]);
      if (geometrie) {
        const vloerM2 = geometrie.oppervlakte / aantalAdressen;
        const omtrekPerAdres = geometrie.omtrek / aantalAdressen;
        const gedeeld = GEDEELDE_MUUR_AANDEEL[houseType] ?? 0;
        gegevens.vloeroppervlakte = String(Math.round(vloerM2));
        gegevens.dakoppervlakte = String(Math.round(vloerM2 * DAK_HELLINGSFACTOR));
        gegevens.gevelOppervlakte = String(Math.round(omtrekPerAdres * AANGENOMEN_BOUWHOOGTE * (1 - gedeeld)));
      }
    }
    return gegevens;
  } catch {
    return null;
  }
}
