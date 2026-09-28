// ════════════════════════════════════════════════════════════════
// WONINGDOSSIER — centrale, uitbreidbare datastructuur voor
// woninggegevens.
//
// Per woningveld wordt vastgelegd: waarde, bron, datum, betrouwbaarheid,
// status en eventuele onzekerheid (Productbriefing sectie 5 en 14). Een
// latere koppeling met echte databronnen (BAG, Cyclomedia, Gijs-opname) is
// dan een nieuwe adapter die dezelfde `Datapunt`-vorm vult, geen nieuw
// datamodel.
//
// Er worden GEEN voorbeeld- of schattingswaarden ingevuld: wat de bewoner
// niet heeft ingevuld blijft "niet ingevuld", en "Ik weet het niet" wordt
// als "onbekend" bewaard (niet als "nee"). Alleen het adres komt uit een
// echte bron (PDOK-adresopzoeking).
// ════════════════════════════════════════════════════════════════

import type { HouseType } from "./woning-types";
import type { Antwoord } from "./scan-session";

/** Waar een waarde vandaan komt. Later uit te breiden met BAG, Cyclomedia, Gijs-opname. */
export type Bron = "bewoner" | "adresregister";

export type Betrouwbaarheid = "hoog" | "gemiddeld" | "laag";

/**
 * bevestigd    = door de bewoner opgegeven of bevestigd
 * onbekend     = de bewoner gaf aan het niet te weten ("Ik weet het niet")
 * niet_ingevuld = (nog) niet gevraagd of overgeslagen
 */
export type DatapuntStatus = "bevestigd" | "onbekend" | "niet_ingevuld";

export type Datapunt<T> = {
  waarde: T | null;
  bron: Bron | null;
  datum: string | null;
  betrouwbaarheid: Betrouwbaarheid | null;
  status: DatapuntStatus;
  /** Alleen bij status "onbekend": waarom de waarde ontbreekt. */
  onzekerheid?: string;
};

const vandaag = () => new Date().toISOString().slice(0, 10);

const nietIngevuld = <T,>(): Datapunt<T> => ({ waarde: null, bron: null, datum: null, betrouwbaarheid: null, status: "niet_ingevuld" });

/** Vrije invoer van de bewoner (leeg = niet ingevuld). */
export function vanBewoner<T>(waarde: T | null | undefined): Datapunt<T> {
  if (waarde === null || waarde === undefined || waarde === "") return nietIngevuld<T>();
  return { waarde, bron: "bewoner", datum: vandaag(), betrouwbaarheid: "hoog", status: "bevestigd" };
}

/** Ja/Nee/Ik weet het niet → Datapunt<boolean>. "Ik weet het niet" is onbekend, niet "nee". */
export function vanAntwoord(antwoord: Antwoord | null): Datapunt<boolean> {
  if (antwoord === null) return nietIngevuld<boolean>();
  if (antwoord === "onbekend") {
    return { waarde: null, bron: "bewoner", datum: vandaag(), betrouwbaarheid: "laag", status: "onbekend", onzekerheid: "Bewoner weet het niet" };
  }
  return { waarde: antwoord === "ja", bron: "bewoner", datum: vandaag(), betrouwbaarheid: "hoog", status: "bevestigd" };
}

export type Woningdossier = {
  adres: { postcode: string; huisnummer: string; label: string; handmatig: boolean; bron: Bron };
  woningtype: Datapunt<HouseType>;
  dakkapel: Datapunt<boolean>;
  garage: Datapunt<boolean>;
  aanbouw: Datapunt<boolean>;
  kruipruimte: Datapunt<boolean>;
  spouwmuur: Datapunt<boolean>;
  bouwjaar: Datapunt<number>;
  woonoppervlakte: Datapunt<number>;
  monumentstatus: Datapunt<string>;
  wensen: Datapunt<string[]>;
  energieprofiel: {
    verwarming: Datapunt<string>;
    warmteafgifte: Datapunt<string>;
    warmWater: Datapunt<string>;
  };
  /** Maatregel-id's (lib/measures.ts) die al aanwezig zijn. Worden niet opnieuw als nieuwe maatregel voorgesteld. */
  bestaandeMaatregelen: Datapunt<string[]>;
  /** Maatregel-id's die de bewoner wil verbeteren (Productbriefing: `measure_selection`). */
  gewenstMaatregelen: string[];
};

type DossierInput = {
  adres: { postcode: string; huisnummer: string; label: string; handmatig: boolean };
  houseType: HouseType;
  dakkapel: Antwoord | null;
  garage: Antwoord | null;
  aanbouw: Antwoord | null;
  kruipruimte: Antwoord | null;
  spouwmuur: Antwoord | null;
  bouwjaar: string;
  woonoppervlakte: string;
  monument: string;
  wensen: string[];
  wensenOnbekend: boolean;
  verwarming: string;
  warmteafgifte: string;
  warmWater: string;
  bestaandeMaatregelen: string[];
  aanwezigOnbekend: boolean;
  gewenstMaatregelen: string[];
};

const getal = (v: string) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** "Weet ik niet" in een keuzelijst telt als onbekend, niet als waarde. */
function vanKeuze(waarde: string): Datapunt<string> {
  if (waarde === "Weet ik niet") return { ...vanAntwoord("onbekend"), waarde: null } as Datapunt<string>;
  return vanBewoner(waarde);
}

function vanLijst(waarden: string[], onbekend: boolean): Datapunt<string[]> {
  if (waarden.length) return vanBewoner(waarden);
  if (onbekend) return { ...vanAntwoord("onbekend"), waarde: null } as Datapunt<string[]>;
  return nietIngevuld<string[]>();
}

export function maakWoningdossier(input: DossierInput): Woningdossier {
  return {
    adres: { ...input.adres, bron: input.adres.handmatig ? "bewoner" : "adresregister" },
    woningtype: vanBewoner(input.houseType),
    dakkapel: vanAntwoord(input.dakkapel),
    garage: vanAntwoord(input.garage),
    aanbouw: vanAntwoord(input.aanbouw),
    kruipruimte: vanAntwoord(input.kruipruimte),
    spouwmuur: vanAntwoord(input.spouwmuur),
    bouwjaar: vanBewoner(getal(input.bouwjaar)),
    woonoppervlakte: vanBewoner(getal(input.woonoppervlakte)),
    monumentstatus: vanKeuze(input.monument),
    wensen: vanLijst(input.wensen, input.wensenOnbekend),
    energieprofiel: {
      verwarming: vanKeuze(input.verwarming),
      warmteafgifte: vanKeuze(input.warmteafgifte),
      warmWater: vanKeuze(input.warmWater),
    },
    bestaandeMaatregelen: vanLijst(input.bestaandeMaatregelen, input.aanwezigOnbekend),
    gewenstMaatregelen: input.gewenstMaatregelen,
  };
}
