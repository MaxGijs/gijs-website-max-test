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

// ── Bouwjaarperiode ──────────────────────────────────────────────────────────────────────────────
// De bestaande code kende geen indeling voor de verbruiksschatting (alleen de RVO-referentieperioden
// voor oppervlakten in lib/content/verduurzaming-financieel.ts en SPOUWMUREN_VANAF = 1930). Daarom de
// minimale indeling uit de opdracht (november 2026), af te stemmen met Thom:
//   vóór 1930     geen spouwmuur, sterk wisselende bouw: standaardschatting minder betrouwbaar
//   1930 t/m 1974 oorspronkelijk (vrijwel) ongeïsoleerd: woningtype is een bruikbare basis
//   vanaf 1975    eerste isolatie-eisen: bij de bouw waarschijnlijk al enige isolatie toegepast
// De grens 1975 valt samen met de RVO-referentieperiode "1975–1991" en is een aanname (Thom noemde
// 1975 of 1978).
export type Bouwperiode = "voor1930" | "1930-1974" | "vanaf1975" | "onbekend";
export const BOUWPERIODE_LABEL: Record<Bouwperiode, string> = {
  voor1930: "vóór 1930",
  "1930-1974": "1930 tot 1975",
  vanaf1975: "1975 of later",
  onbekend: "onbekend bouwjaar",
};
export function bouwperiodeVan(bouwjaar: number | null): Bouwperiode {
  if (bouwjaar === null || bouwjaar < 1000) return "onbekend";
  return bouwjaar < 1930 ? "voor1930" : bouwjaar < 1975 ? "1930-1974" : "vanaf1975";
}

const NIVEAU_VOLGORDE: McIsolatie[] = ["matig", "redelijk", "goed"];

/**
 * Isolatieniveau voor de Milieu Centraal-tabel: wat de bewoner aanvinkte (isolatieNiveau), met voor
 * woningen vanaf 1975 minimaal "redelijk", omdat er bij de bouw al isolatie-eisen golden. Ouder dan
 * 1975 of onbekend: alleen wat is aangevinkt telt (het bouwjaar is geen bewijs van latere renovaties).
 */
export function geschatIsolatieniveau(bestaand: string[], bouwjaar: number | null): McIsolatie {
  const uitMaatregelen = isolatieNiveau(bestaand);
  const basis: McIsolatie = bouwperiodeVan(bouwjaar) === "vanaf1975" ? "redelijk" : "matig";
  return NIVEAU_VOLGORDE[Math.max(NIVEAU_VOLGORDE.indexOf(uitMaatregelen), NIVEAU_VOLGORDE.indexOf(basis))];
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

export function schatVerbruik(invoer: { houseType: HouseType; aantalBewoners: string; verwarming: string[]; bestaandeMaatregelen: string[]; woonsituatieId?: string; /** Optioneel: tilt woningen vanaf 1975 naar minimaal "redelijk" (zie geschatIsolatieniveau). */ bouwjaar?: number | null }): Schatting {
  const { houseType, aantalBewoners } = invoer;
  // Bij meerdere gekozen verwarmingen (bv. cv-ketel én houtkachel) is de eerste in VERWARMING_OPTIES-volgorde leidend voor de schatting.
  const verwarming = primaireVerwarming(invoer.verwarming);
  const isolatie = invoer.bouwjaar === undefined ? isolatieNiveau(invoer.bestaandeMaatregelen) : geschatIsolatieniveau(invoer.bestaandeMaatregelen, invoer.bouwjaar);
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

export type Bereik = { min: number; max: number };

/**
 * Stroomverbruik zonder warmtepomp, als bandbreedte: ervaringscijfer van Thom (gesprek november 2026):
 * "bij twee mensen ligt het bij de 2.100 kWh en bij 3 à 4 kan het stijgen naar 3.000 kWh". Het
 * Milieu Centraal-gemiddelde ligt in dezelfde orde (2.410 tot 2.780 kWh bij twee of meer bewoners).
 */
export const STROOM_BANDBREEDTE_THOM: Bereik = { min: 2100, max: 3000 };

export type ScanSchatting = {
  /** Bandbreedte: laag = één bewoner, hoog = twee of meer bewoners (beide Milieu Centraal). */
  stroom: Bereik & { midden: number };
  gas: number | null;
  warmte: number | null;
  isolatie: McIsolatie;
  periode: Bouwperiode;
  /** Begrijpelijke regels voor "Waar is de schatting op gebaseerd?". */
  uitleg: string[];
};

/**
 * "Help mij schatten" zonder de vraag naar het aantal bewoners. Hergebruikt schatVerbruik() en de
 * Milieu Centraal-tabellen ongewijzigd:
 * - gas (en warmte) hangen af van woningtype, verwarming en isolatieniveau; dat laatste komt uit de
 *   aangevinkte maatregelen plus de bouwjaarperiode (geschatIsolatieniveau). Het aantal bewoners
 *   speelt in die tabel geen rol (Milieu Centraal rekent met 2 personen);
 * - stroom hangt wél sterk af van het aantal bewoners. Dat vragen we niet meer, dus geen schijnprecies
 *   getal maar een bandbreedte tussen het Milieu Centraal-gemiddelde voor één bewoner en dat voor twee
 *   of meer bewoners. In het veld komt het midden daarvan; de bewoner kan dat aanpassen.
 * Woonoppervlakte verandert de schatting niet: Milieu Centraal publiceert per woningtype, niet per m².
 */
export function schatVerbruikVoorScan(invoer: { houseType: HouseType; bouwjaar: number | null; woonoppervlakte: number | null; verwarming: string[]; bestaandeMaatregelen: string[]; aanwezigOnbekend: boolean; naamVan: (id: string) => string }): ScanSchatting {
  const basis = { houseType: invoer.houseType, verwarming: invoer.verwarming, bestaandeMaatregelen: invoer.bestaandeMaatregelen, bouwjaar: invoer.bouwjaar };
  const een = schatVerbruik({ ...basis, aantalBewoners: "1" });
  const meer = schatVerbruik({ ...basis, aantalBewoners: "2" });
  // Extra stroom van een warmtepomp volgens de Milieu Centraal-tabel (zelfde berekening als schatVerbruik:
  // verschil met een cv-ketel bij hetzelfde isolatieniveau), bovenop Thoms bandbreedte voor het huishouden.
  const zonderPomp = schatVerbruik({ ...basis, verwarming: ["Cv-ketel"], aantalBewoners: "2" });
  const pompExtra = Math.max(0, meer.stroom - zonderPomp.stroom);
  const stroom = { min: STROOM_BANDBREEDTE_THOM.min + pompExtra, max: STROOM_BANDBREEDTE_THOM.max + pompExtra };
  const midden = rond((stroom.min + stroom.max) / 2);
  const periode = bouwperiodeVan(invoer.bouwjaar);
  const nl = (n: number) => n.toLocaleString("nl-NL");
  const type = HOUSE_MODELS[invoer.houseType].label.toLowerCase();
  const verwarming = primaireVerwarming(invoer.verwarming);

  const uitleg: string[] = [`Woningtype: ${type}.`];
  uitleg.push(
    periode === "onbekend" ? "Bouwjaar: onbekend. We gaan uit van wat je hebt aangevinkt."
    : periode === "voor1930" ? `Bouwjaar: ${invoer.bouwjaar}. Bij woningen van vóór 1930 is een standaardschatting minder betrouwbaar; wat er later aan isolatie is gedaan, telt daarom extra zwaar.`
    : periode === "1930-1974" ? `Bouwjaar: ${invoer.bouwjaar}. Woningen uit deze periode zijn bij de bouw (vrijwel) niet geïsoleerd; het woningtype geeft een bruikbare basis.`
    : `Bouwjaar: ${invoer.bouwjaar}. Vanaf 1975 golden isolatie-eisen bij de bouw; we rekenen daarom met minimaal redelijke isolatie.`,
  );
  if (invoer.woonoppervlakte) uitleg.push(`Woonoppervlakte: ${nl(invoer.woonoppervlakte)} m². Ter controle; de cijfers van Milieu Centraal gelden per woningtype, niet per m², dus het oppervlak verandert de schatting niet.`);
  const gedaan = invoer.bestaandeMaatregelen.map(invoer.naamVan);
  uitleg.push(
    gedaan.length ? `Al gedaan: ${gedaan.join(", ").toLowerCase()}. Daarmee rekenen we met ${een.isolatie}e isolatie.`
    : invoer.aanwezigOnbekend ? `Je weet niet precies wat er al is gedaan. We rekenen met ${een.isolatie}e isolatie; Gijs controleert dit bij de woningopname.`
    : `Nog niets aangevinkt. We rekenen met ${een.isolatie}e isolatie.`,
  );
  if (meer.gas !== null) {
    uitleg.push(verwarming === "Hybride warmtepomp"
      ? `Gas: ${nl(meer.gas)} m³ per jaar, gemiddelde van Milieu Centraal voor een ${type} met ${een.isolatie}e isolatie en een hybride warmtepomp.`
      : `Gas: ${nl(meer.gas)} m³ per jaar, gemiddelde van Milieu Centraal voor een ${type} met ${een.isolatie}e isolatie en een cv-ketel (verwarming en warm water).`);
  }
  if (meer.warmte !== null) uitleg.push(`Warmte: ${meer.warmte} GJ per jaar, gemiddelde van Milieu Centraal bij een warmtenet.`);
  uitleg.push(`Stroom: tussen ${nl(stroom.min)} en ${nl(stroom.max)} kWh per jaar. Met twee bewoners ligt het rond de onderkant, met drie of vier rond de bovenkant (ervaring van Gijs)${pompExtra ? `. Daarin zit ${nl(pompExtra)} kWh voor je warmtepomp (Milieu Centraal)` : ""}. We vullen het midden in: ${nl(midden)} kWh.`);
  uitleg.push("Dit is een indicatie. Het verbruik op je jaarafrekening is altijd nauwkeuriger.");
  return { stroom: { ...stroom, midden }, gas: meer.gas, warmte: meer.warmte, isolatie: een.isolatie, periode, uitleg };
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
