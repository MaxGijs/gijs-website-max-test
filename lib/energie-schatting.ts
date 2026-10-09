// "Help me schatten": een voorstel voor het jaarverbruik, uitsluitend
// opgebouwd uit de gepubliceerde gemiddelden van Milieu Centraal
// (lib/content/milieu-centraal.ts). De bewoner kan het voorstel altijd
// aanpassen; het echte verbruik van de jaarafrekening gaat voor.

import type { HouseType } from "./woning-types";
import { HOUSE_MODELS } from "./woning-types";
import { MC_GEMIDDELD_1_BEWONER, MC_GEMIDDELD_2_PLUS, MC_VERWARMING, MC_WARMTENET_GJ, type McIsolatie, type McWoonsituatie } from "./content/milieu-centraal";
import { gebruiktGas, gebruiktWarmtenet, primaireVerwarming } from "./scan-session";

const ISOLATIE_MAATREGELEN = ["dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen"];

/**
 * Globale indeling op basis van wat al aanwezig is: alle vier isolatie-
 * maatregelen = goed, twee of drie = redelijk, anders matig.
 */
export function isolatieNiveau(bestaand: string[]): McIsolatie {
  const aantal = ISOLATIE_MAATREGELEN.filter((id) => bestaand.includes(id)).length;
  return aantal === 4 ? "goed" : aantal >= 2 ? "redelijk" : "matig";
}

export const eenBewoner = (aantalBewoners: string) => aantalBewoners === "1";

export const woonsituaties = (aantalBewoners: string) => (eenBewoner(aantalBewoners) ? MC_GEMIDDELD_1_BEWONER : MC_GEMIDDELD_2_PLUS);

/** Standaard de Milieu Centraal-omschrijving die het dichtst bij het woningtype ligt; de bewoner kan een andere kiezen. */
export function standaardWoonsituatie(houseType: HouseType, aantalBewoners: string): McWoonsituatie {
  const lijst = woonsituaties(aantalBewoners);
  const id = eenBewoner(aantalBewoners) ? "oud-middelgroot"
    : houseType === "vrijstaand" ? "oud-groot-vrijstaand"
    : houseType === "twee-onder-een-kap" ? "oud-groot"
    : "oud-middelgroot";
  return lijst.find((w) => w.id === id) ?? lijst[0];
}

export type Schatting = {
  stroom: number;
  gas: number | null;
  warmte: number | null;
  isolatie: McIsolatie;
  woonsituatie: McWoonsituatie;
  uitleg: string[];
};

const rond = (n: number) => Math.round(n / 10) * 10;

export function schatVerbruik(invoer: { houseType: HouseType; aantalBewoners: string; verwarming: string[]; bestaandeMaatregelen: string[]; woonsituatieId?: string }): Schatting {
  const { houseType, aantalBewoners } = invoer;
  // Bij meerdere gekozen verwarmingen (bv. cv-ketel én houtkachel) is de eerste in VERWARMING_OPTIES-volgorde leidend voor de schatting.
  const verwarming = primaireVerwarming(invoer.verwarming);
  const isolatie = isolatieNiveau(invoer.bestaandeMaatregelen);
  const woonsituatie = woonsituaties(aantalBewoners).find((w) => w.id === invoer.woonsituatieId) ?? standaardWoonsituatie(houseType, aantalBewoners);
  const tabel = MC_VERWARMING[houseType][isolatie];
  const bewonersTekst = eenBewoner(aantalBewoners) ? "1 bewoner" : "2 of meer bewoners";
  const uitleg = [`Stroom: gemiddelde van Milieu Centraal voor "${woonsituatie.label}" met ${bewonersTekst}.`];
  const woning = `een gemiddelde ${HOUSE_MODELS[houseType].label.toLowerCase()} met ${isolatie}e isolatie (afgeleid van wat je al hebt aangevinkt)`;

  let stroom = woonsituatie.stroom;
  let gas: number | null = null;
  let warmte: number | null = null;

  if (verwarming === "Stads- of blokverwarming") {
    warmte = MC_WARMTENET_GJ;
    uitleg.push(`Warmte: gemiddeld warmteverbruik bij een warmtenet volgens Milieu Centraal (${MC_WARMTENET_GJ} GJ per jaar).`);
  } else if (verwarming === "Volledig elektrische warmtepomp met boiler") {
    const wp = tabel.volledig ?? MC_VERWARMING[houseType].redelijk.volledig ?? 0;
    stroom = woonsituatie.stroom - tabel.cvKetel.stroom + wp;
    uitleg.push(`Verwarming en warm water: volledige warmtepomp in ${woning}, volgens Milieu Centraal ${wp.toLocaleString("nl-NL")} kWh per jaar.`);
    if (tabel.volledig === null) uitleg.push("Milieu Centraal geeft voor een volledige warmtepomp geen cijfer bij matige isolatie; daarom is gerekend met redelijke isolatie.");
  } else if (verwarming === "Hybride warmtepomp") {
    gas = tabel.hybride.gas;
    stroom = woonsituatie.stroom - tabel.cvKetel.stroom + tabel.hybride.stroom;
    uitleg.push(`Verwarming en warm water: hybride warmtepomp in ${woning}, volgens Milieu Centraal ${tabel.hybride.gas.toLocaleString("nl-NL")} m³ gas en ${tabel.hybride.stroom.toLocaleString("nl-NL")} kWh stroom per jaar.`);
  } else {
    gas = tabel.cvKetel.gas;
    uitleg.push(`Gas: cv-ketel in ${woning}, volgens Milieu Centraal ${tabel.cvKetel.gas.toLocaleString("nl-NL")} m³ per jaar voor verwarming en warm water.`);
  }
  if (verwarming !== "Stads- of blokverwarming" && verwarming !== "Volledig elektrische warmtepomp met boiler" && gas === null) gas = tabel.cvKetel.gas;
  if (warmte === null) uitleg.push("De verwarmingscijfers van Milieu Centraal gaan uit van 2 personen.");
  uitleg.push("Het afgiftesysteem en het warm water in de badkamer veranderen de schatting niet: daar publiceert Milieu Centraal geen cijfers voor.");
  return { stroom: rond(stroom), gas: gas === null ? null : rond(gas), warmte, isolatie, woonsituatie, uitleg };
}

/** "1.234,5" of "1234" → getal; leeg of ongeldig → null. */
export function leesGetal(waarde: string): number | null {
  const n = Number(waarde.replace(/\./g, "").replace(",", ".").trim());
  return waarde.trim() !== "" && Number.isFinite(n) && n >= 0 ? n : null;
}

/** Variabele energiekosten per jaar uit het ingevulde verbruik en de ingevulde prijzen (zonder vaste kosten en belastingteruggave). */
export function energiekosten(s: { verwarming: string[]; elektriciteitsverbruik: string; gasverbruik: string; warmteverbruik: string; elektriciteitsprijs: string; gasprijs: string; warmteprijs: string }) {
  const regel = (verbruik: string, prijs: string) => {
    const v = leesGetal(verbruik), p = leesGetal(prijs);
    return v === null || p === null ? null : v * p;
  };
  const stroom = regel(s.elektriciteitsverbruik, s.elektriciteitsprijs);
  const gas = gebruiktGas(s.verwarming) ? regel(s.gasverbruik, s.gasprijs) : 0;
  const warmte = gebruiktWarmtenet(s.verwarming) ? regel(s.warmteverbruik, s.warmteprijs) : 0;
  if (stroom === null || gas === null || warmte === null) return null;
  return { stroom, gas, warmte, totaal: stroom + gas + warmte };
}
