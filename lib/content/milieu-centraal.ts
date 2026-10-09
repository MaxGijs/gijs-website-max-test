// Referentiecijfers van Milieu Centraal, overgenomen zoals ze op de site
// staan (opgehaald 28-09-2026). Niets hieronder is afgerond of bijgeschat;
// pas deze tabellen aan als Milieu Centraal ze bijwerkt.

import type { HouseType } from "../woning-types";

export const MC_BRONNEN = {
  gemiddeld: "https://www.milieucentraal.nl/energie-besparen/inzicht-in-je-energierekening/gemiddeld-energieverbruik/",
  hybride: "https://www.milieucentraal.nl/energie-besparen/duurzaam-verwarmen-en-koelen/hybride-warmtepomp/",
  volledig: "https://www.milieucentraal.nl/energie-besparen/duurzaam-verwarmen-en-koelen/volledige-warmtepomp/",
  prijzen: "https://www.milieucentraal.nl/energie-besparen/energieprijzen-voor-besparingen/",
} as const;

/** "Gemiddeld energieverbruik": gas (m³/jaar) en elektriciteitslevering (kWh/jaar) per woonsituatie. */
export type McWoonsituatie = { id: string; label: string; gas: number; stroom: number };

export const MC_GEMIDDELD_1_BEWONER: McWoonsituatie[] = [
  { id: "nieuw-klein-appartement", label: "Nieuw klein appartement", gas: 550, stroom: 1390 },
  { id: "oud-klein-appartement", label: "Oud klein appartement", gas: 690, stroom: 1430 },
  { id: "oud-klein", label: "Oude kleine woning (2-onder-1-kap, hoek, tussen)", gas: 850, stroom: 1470 },
  { id: "oud-middelgroot", label: "Oude middelgrote woning (2-onder-1-kap, hoek, tussen)", gas: 1010, stroom: 1730 },
];

export const MC_GEMIDDELD_2_PLUS: McWoonsituatie[] = [
  { id: "oud-klein-appartement", label: "Oud klein appartement", gas: 860, stroom: 2100 },
  { id: "oud-klein", label: "Oude kleine woning (hoek, tussen)", gas: 1000, stroom: 2410 },
  { id: "oud-middelgroot", label: "Oude middelgrote woning (hoek, tussen)", gas: 1110, stroom: 2780 },
  { id: "nieuw-middelgroot", label: "Nieuwe middelgrote woning (hoek, tussen)", gas: 900, stroom: 2810 },
  { id: "oud-groot", label: "Oude grote woning (hoek, tussen)", gas: 1520, stroom: 3520 },
  { id: "oud-groot-vrijstaand", label: "Oude grote vrijstaande woning", gas: 1850, stroom: 4240 },
];

/** Gemiddeld warmteverbruik bij een warmtenet (stadsverwarming), verwarming + warm water. */
export const MC_WARMTENET_GJ = 20;

export type McIsolatie = "matig" | "redelijk" | "goed";
type Verbruik = { gas: number; stroom: number };

/**
 * Energieverbruik per jaar voor verwarming en warm water, gemiddelde woning
 * met 2 personen. Cv-ketel en hybride: pagina "Hybride warmtepomp".
 * Volledige warmtepomp: pagina "Volledig elektrische warmtepomp" (daar
 * geen rij voor matige isolatie: Milieu Centraal noemt die niet geschikt).
 */
export const MC_VERWARMING: Record<HouseType, Record<McIsolatie, { cvKetel: Verbruik; hybride: Verbruik; volledig: number | null }>> = {
  tussenwoning: {
    matig: { cvKetel: { gas: 1140, stroom: 280 }, hybride: { gas: 590, stroom: 1580 }, volledig: null },
    redelijk: { cvKetel: { gas: 1020, stroom: 260 }, hybride: { gas: 540, stroom: 1390 }, volledig: 3560 },
    goed: { cvKetel: { gas: 770, stroom: 220 }, hybride: { gas: 450, stroom: 1120 }, volledig: 2970 },
  },
  hoekwoning: {
    matig: { cvKetel: { gas: 1360, stroom: 310 }, hybride: { gas: 680, stroom: 1930 }, volledig: null },
    redelijk: { cvKetel: { gas: 1230, stroom: 290 }, hybride: { gas: 630, stroom: 1730 }, volledig: 4070 },
    goed: { cvKetel: { gas: 950, stroom: 250 }, hybride: { gas: 530, stroom: 1400 }, volledig: 3410 },
  },
  "twee-onder-een-kap": {
    matig: { cvKetel: { gas: 1530, stroom: 340 }, hybride: { gas: 750, stroom: 2190 }, volledig: null },
    redelijk: { cvKetel: { gas: 1390, stroom: 320 }, hybride: { gas: 690, stroom: 1960 }, volledig: 4440 },
    goed: { cvKetel: { gas: 1070, stroom: 270 }, hybride: { gas: 580, stroom: 1600 }, volledig: 3680 },
  },
  vrijstaand: {
    matig: { cvKetel: { gas: 2150, stroom: 440 }, hybride: { gas: 980, stroom: 3210 }, volledig: null },
    redelijk: { cvKetel: { gas: 1930, stroom: 400 }, hybride: { gas: 890, stroom: 2860 }, volledig: 5670 },
    goed: { cvKetel: { gas: 1460, stroom: 330 }, hybride: { gas: 710, stroom: 2300 }, volledig: 4540 },
  },
};

/**
 * Standaardprijzen in de woningscan. Stroom: gemiddelde prijs nieuwe contracten januari 2026 volgens
 * Milieu Centraal ("ongeveer"). Gas: gemiddelde gasprijs zoals opgegeven door Gijs (€ 1,42 per m³).
 */
export const MC_PRIJZEN = { stroom: "0,27", gas: "1,42" } as const;

/** Door Gijs opgegeven prijs voor stadsverwarming (€ per GJ). */
export const GIJS_WARMTEPRIJS = "40,97";
