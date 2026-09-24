// ════════════════════════════════════════════════════════════════
// WONINGDOSSIER — centrale, uitbreidbare datastructuur voor
// woninggegevens (prototype, week 3).
//
// De Productbriefing (sectie 5 en 14) vraagt om per belangrijk
// woningveld bron, datum, betrouwbaarheid, status en eventuele
// correctie vast te leggen, en noemt als latere entiteiten onder
// andere `property`, `property_snapshot`, `building_part`,
// `installation` en `energy_profile`. Dit bestand bouwt dat idee nu al
// als eenvoudige types en mockdata, zodat een latere overstap naar
// echte databronnen (PDOK, BAG, Cyclomedia, Gijs-opname) een kwestie
// wordt van een nieuwe adapter die dezelfde `Datapunt`-vorm vult, niet
// van een nieuw datamodel.
//
// Er is bewust GEEN koppeling met een echte databron: dit blijft
// voorbeelddata voor het prototype (zie lib/mock/adres voor de enige
// echte externe bron, PDOK-adresopzoeking).
// ════════════════════════════════════════════════════════════════

import type { HouseType } from "./woning-types";
import type { WoningZoneId } from "./measures";

/** Waar een waarde vandaan komt. Later uit te breiden met BAG, Cyclomedia, AI, Gijs-opname. */
export type Bron = "voorbeelddata" | "bewoner";

export type Betrouwbaarheid = "hoog" | "gemiddeld" | "laag";

export type DatapuntStatus = "geschat" | "bevestigd" | "gecorrigeerd";

/**
 * Eén woningveld met herkomst — de kern van de "Gijs-waarheid" uit de
 * Productbriefing (sectie 5): niet alleen een waarde, maar ook waar hij
 * vandaan komt en hoe zeker Gijs daarvan is.
 */
export type Datapunt<T> = {
  waarde: T;
  bron: Bron;
  datum: string;
  betrouwbaarheid: Betrouwbaarheid;
  status: DatapuntStatus;
  /** Alleen ingevuld als de bewoner (nog) aangeeft het niet zeker te weten. */
  onzekerheid?: string;
  correctie?: { vorigeWaarde: T; reden: string };
};

function schatting<T>(waarde: T): Datapunt<T> {
  return {
    waarde,
    bron: "voorbeelddata",
    datum: "2026-09-01",
    betrouwbaarheid: "gemiddeld",
    status: "geschat",
  };
}

/** Bewoner bevestigt of corrigeert een geschatte waarde. */
export function bevestigDatapunt<T>(dp: Datapunt<T>, nieuweWaarde: T): Datapunt<T> {
  const gewijzigd = nieuweWaarde !== dp.waarde;
  return {
    waarde: nieuweWaarde,
    bron: "bewoner",
    datum: new Date().toISOString().slice(0, 10),
    betrouwbaarheid: "hoog",
    status: gewijzigd ? "gecorrigeerd" : "bevestigd",
    ...(gewijzigd ? { correctie: { vorigeWaarde: dp.waarde, reden: "Aangepast door bewoner" } } : {}),
  };
}

/** Eén bouwdeel/zone (Productbriefing: `building_part` / `zone`). In het prototype alleen een indicatieve status, geen echte inspectie. */
export type Bouwdeel = {
  id: WoningZoneId;
  label: string;
  indicatie: Datapunt<string>;
};

/** Eén installatie (Productbriefing: `installation`). */
export type Installatie = {
  id: string;
  label: string;
  omschrijving: Datapunt<string>;
};

/** Energieprofiel (Productbriefing: `energy_profile`) — nu alleen label en verwarmingstype; verbruik/opwek volgen pas als de bewoner dat optioneel invult (progressive profiling, sectie 2). */
export type Energieprofiel = {
  energielabel: Datapunt<string>;
  verwarming: Datapunt<string>;
};

/** Eén woningdossier (Productbriefing: `property` + `property_snapshot`). */
export type Woningdossier = {
  adres: { postcode: string; huisnummer: string; label: string; handmatig: boolean };
  woningtype: Datapunt<HouseType>;
  bouwjaar: Datapunt<number>;
  woonoppervlakte: Datapunt<number>;
  /** Uit de homeQgo-benchmark (week 2): naast bouwjaar/oppervlak ook deze drie standaard gecontroleerd. */
  monumentstatus: Datapunt<string>;
  kruipruimte: Datapunt<string>;
  typeMuren: Datapunt<string>;
  bouwdelen: Record<WoningZoneId, Bouwdeel>;
  installaties: Installatie[];
  energieprofiel: Energieprofiel;
  /** Maatregel-id's (zie lib/measures.ts) die al voor deze woning zijn uitgevoerd. */
  bestaandeMaatregelen: string[];
  /** Maatregel-id's die de bewoner overweegt — het huidige "Mijn woningplan" (Productbriefing: `measure_selection`). */
  gewenstMaatregelen: string[];
};

type DossierInput = {
  adres: { postcode: string; huisnummer: string; label: string; handmatig: boolean };
  houseType: HouseType;
  /** Lege string = nog niet door bewoner ingevuld → val terug op voorbeelddata. */
  bouwjaar: string;
  woonoppervlakte: string;
  monument: string;
  kruipruimte: string;
  typeMuren: string;
  verwarming: string;
  energielabel: string;
  bestaandeMaatregelen: string[];
  gewenstMaatregelen: string[];
};

const VOORBEELDWAARDEN = {
  bouwjaar: 1972,
  woonoppervlakte: 120,
  monument: "Geen monument",
  kruipruimte: "Aanwezig",
  typeMuren: "Spouwmuur",
  verwarming: "Gasketel (H/R)",
  energielabel: "D",
};

const BOUWDEEL_LABELS: Record<WoningZoneId, string> = {
  dak: "Dak",
  gevel: "Gevel",
  vloer: "Vloer",
  kozijnen: "Kozijnen",
  installaties: "Installaties",
};

const BOUWDEEL_INDICATIES: Record<WoningZoneId, string> = {
  dak: "Nog niet geïnspecteerd",
  gevel: "Nog niet geïnspecteerd",
  vloer: "Nog niet geïnspecteerd",
  kozijnen: "Nog niet geïnspecteerd",
  installaties: "Nog niet geïnspecteerd",
};

/**
 * Bouwt een woningdossier voor het prototype: bevestigde gegevens van
 * de bewoner (uit de scansessie) aangevuld met voorbeelddata voor wat
 * nog niet is ingevuld. Er is geen echte woningdatabron (BAG/PDOK voor
 * kenmerken, Cyclomedia) — alleen het adres komt uit een echte bron
 * (PDOK), de kenmerken hieronder blijven voorbeelddata tot een bewoner
 * ze bevestigt of aanpast.
 */
export function maakWoningdossier(input: DossierInput): Woningdossier {
  const numOr = (value: string, fallback: number) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  const bouwjaar: Datapunt<number> = input.bouwjaar
    ? bevestigDatapunt(schatting(VOORBEELDWAARDEN.bouwjaar), numOr(input.bouwjaar, VOORBEELDWAARDEN.bouwjaar))
    : schatting(VOORBEELDWAARDEN.bouwjaar);

  const woonoppervlakte: Datapunt<number> = input.woonoppervlakte
    ? bevestigDatapunt(schatting(VOORBEELDWAARDEN.woonoppervlakte), numOr(input.woonoppervlakte, VOORBEELDWAARDEN.woonoppervlakte))
    : schatting(VOORBEELDWAARDEN.woonoppervlakte);

  const verwarming: Datapunt<string> = input.verwarming
    ? bevestigDatapunt(schatting(VOORBEELDWAARDEN.verwarming), input.verwarming)
    : schatting(VOORBEELDWAARDEN.verwarming);

  const energielabel: Datapunt<string> = input.energielabel
    ? bevestigDatapunt(schatting(VOORBEELDWAARDEN.energielabel), input.energielabel)
    : schatting(VOORBEELDWAARDEN.energielabel);

  const monumentstatus: Datapunt<string> = input.monument
    ? bevestigDatapunt(schatting(VOORBEELDWAARDEN.monument), input.monument)
    : schatting(VOORBEELDWAARDEN.monument);

  const kruipruimte: Datapunt<string> = input.kruipruimte
    ? bevestigDatapunt(schatting(VOORBEELDWAARDEN.kruipruimte), input.kruipruimte)
    : schatting(VOORBEELDWAARDEN.kruipruimte);

  const typeMuren: Datapunt<string> = input.typeMuren
    ? bevestigDatapunt(schatting(VOORBEELDWAARDEN.typeMuren), input.typeMuren)
    : schatting(VOORBEELDWAARDEN.typeMuren);

  const bouwdelen = Object.fromEntries(
    (Object.keys(BOUWDEEL_LABELS) as WoningZoneId[]).map((zone) => [
      zone,
      { id: zone, label: BOUWDEEL_LABELS[zone], indicatie: schatting(BOUWDEEL_INDICATIES[zone]) } satisfies Bouwdeel,
    ])
  ) as Record<WoningZoneId, Bouwdeel>;

  return {
    adres: input.adres,
    woningtype: bevestigDatapunt(schatting(input.houseType), input.houseType),
    bouwjaar,
    woonoppervlakte,
    monumentstatus,
    kruipruimte,
    typeMuren,
    bouwdelen,
    installaties: [{ id: "cv-ketel", label: "CV-ketel", omschrijving: schatting("Nog niet gecontroleerd") }],
    energieprofiel: { energielabel, verwarming },
    bestaandeMaatregelen: input.bestaandeMaatregelen,
    gewenstMaatregelen: input.gewenstMaatregelen,
  };
}
