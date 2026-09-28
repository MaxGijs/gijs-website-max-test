import { HOUSE_MODELS, parseHouseType, type HouseType } from "./woning-types";
import { MEASURES, MEASURE_GROUPS } from "./measures";

// De maatregellijst en groepsindeling komen uit lib/measures.ts (de
// gedeelde "measure_catalog"), zodat dezelfde maatregel overal dezelfde id,
// label en zone heeft.
export const SCAN_MEASURES = MEASURES;
export const SCAN_GROUPS = MEASURE_GROUPS.map((g) => ({
  label: g.label,
  description: g.description,
  ids: MEASURES.filter((m) => m.group === g.id).map((m) => m.id),
}));

// Stap 2 "Jouw wensen": doelen en ambities van de bewoner. Energieneutraal
// wonen staat hier als wens, niet als losse technische maatregel.
export const SCAN_WISHES = [
  "Lagere energiekosten",
  "Meer wooncomfort",
  "Minder gas gebruiken",
  "Zelf energie opwekken",
  "Zo energieneutraal mogelijk wonen",
];

/**
 * Antwoord op een woningvraag. "onbekend" = de bewoner koos "Ik weet het
 * niet"; dat is iets anders dan "nee" en wordt ook zo bewaard.
 * null = de vraag is (nog) niet beantwoord.
 */
export type Antwoord = "ja" | "nee" | "onbekend";

// Zeven stappen, één logische klantreis (zie WoningFlow.tsx).
export const SCAN_STAPPEN = [
  "Jouw woning",
  "Jouw wensen",
  "Woning aanvullen",
  "Wat is al aanwezig?",
  "Wat wil je verbeteren?",
  "Resultaat",
  "Jouw woningplan",
] as const;
export const STAP = { woning: 0, wensen: 1, aanvullen: 2, aanwezig: 3, verbeteren: 4, resultaat: 5, plan: 6 } as const;

export type ScanSession = {
  version: 6;
  step: number;
  reached: number;
  /** Gezet bij "Wijzigen" vanuit het woningplan: de stap toont dan "Terug naar mijn woningplan". */
  terugNaarPlan: boolean;

  postcode: string;
  huisnummer: string;
  houseType: HouseType;
  addressLabel: string;
  manualAddress: boolean;
  /** Afgerond in stap 1 met "Ja, dit klopt". Wordt daarna niet opnieuw gevraagd. */
  woningBevestigd: boolean;

  wishes: string[];
  /** "Ik weet het nog niet" bij de wensen. */
  wensenOnbekend: boolean;

  dakkapel: Antwoord | null;
  garage: Antwoord | null;
  aanbouw: Antwoord | null;
  kruipruimte: Antwoord | null;
  spouwmuur: Antwoord | null;
  /** Optioneel, alleen als de bewoner het weet. Leeg = niet ingevuld. */
  bouwjaar: string;
  woonoppervlakte: string;
  monument: string;

  bestaandeMaatregelen: string[];
  /** "Ik weet het niet precies" bij wat al aanwezig is. */
  aanwezigOnbekend: boolean;
  zonnepanelenAantal: string;
  verwarming: string;
  warmteafgifte: string;
  warmWater: string;
  aantalBewoners: string;
  elektriciteitsverbruik: string;
  gasverbruik: string;
  elektriciteitsprijs: string;
  gasprijs: string;

  measures: string[];
  advice: boolean;
  name: string;
  contact: string;
};

// Nieuwe sleutel: oudere sessies (andere stapindeling) starten opnieuw in
// plaats van op een verkeerde stap te landen.
export const SCAN_KEY = "gijs-woningscan-v3";

export const freshScan = (postcode = "", huisnummer = "", houseType: HouseType = "hoekwoning"): ScanSession => ({
  version: 6,
  step: 0,
  reached: 0,
  terugNaarPlan: false,
  postcode,
  huisnummer,
  houseType,
  addressLabel: "",
  manualAddress: false,
  woningBevestigd: false,
  wishes: [],
  wensenOnbekend: false,
  dakkapel: null,
  garage: null,
  aanbouw: null,
  kruipruimte: null,
  spouwmuur: null,
  bouwjaar: "",
  woonoppervlakte: "",
  monument: "",
  bestaandeMaatregelen: [],
  aanwezigOnbekend: false,
  zonnepanelenAantal: "",
  verwarming: "",
  warmteafgifte: "",
  warmWater: "",
  aantalBewoners: "",
  elektriciteitsverbruik: "",
  gasverbruik: "",
  elektriciteitsprijs: "",
  gasprijs: "",
  measures: [],
  advice: false,
  name: "",
  contact: "",
});

const tekst = (v: unknown) => (typeof v === "string" ? v : "");
const antwoord = (v: unknown): Antwoord | null => (v === "ja" || v === "nee" || v === "onbekend" ? v : null);
const lijst = (v: unknown, toegestaan: (s: string) => boolean) =>
  Array.isArray(v) ? [...new Set(v.filter((s: unknown): s is string => typeof s === "string" && toegestaan(s)))] : [];
const bekendeMaatregel = (id: string) => SCAN_MEASURES.some((m) => m.id === id);

export function readScan(raw: string | null): ScanSession | null {
  try {
    const v = JSON.parse(raw ?? "null");
    const laatste = SCAN_STAPPEN.length - 1;
    if (!v || v.version !== 6 || !parseHouseType(v.houseType) || !Number.isInteger(v.step) || !Number.isInteger(v.reached) || v.step < 0 || v.step > v.reached || v.reached > laatste || typeof v.postcode !== "string" || typeof v.huisnummer !== "string") {
      return null;
    }
    const bevestigd = v.woningBevestigd === true;
    // Zonder bevestigde woning kan de bewoner niet voorbij stap 1 zijn.
    const step = bevestigd ? v.step : 0;
    return {
      ...freshScan(v.postcode, v.huisnummer, v.houseType),
      step,
      reached: bevestigd ? v.reached : 0,
      terugNaarPlan: v.terugNaarPlan === true && bevestigd,
      addressLabel: tekst(v.addressLabel),
      manualAddress: v.manualAddress === true,
      woningBevestigd: bevestigd,
      wishes: lijst(v.wishes, (w) => SCAN_WISHES.includes(w)),
      wensenOnbekend: v.wensenOnbekend === true,
      dakkapel: antwoord(v.dakkapel),
      garage: antwoord(v.garage),
      aanbouw: antwoord(v.aanbouw),
      kruipruimte: antwoord(v.kruipruimte),
      spouwmuur: antwoord(v.spouwmuur),
      bouwjaar: tekst(v.bouwjaar),
      woonoppervlakte: tekst(v.woonoppervlakte),
      monument: tekst(v.monument),
      bestaandeMaatregelen: lijst(v.bestaandeMaatregelen, bekendeMaatregel),
      aanwezigOnbekend: v.aanwezigOnbekend === true,
      zonnepanelenAantal: tekst(v.zonnepanelenAantal),
      verwarming: tekst(v.verwarming),
      warmteafgifte: tekst(v.warmteafgifte),
      warmWater: tekst(v.warmWater),
      aantalBewoners: tekst(v.aantalBewoners),
      elektriciteitsverbruik: tekst(v.elektriciteitsverbruik),
      gasverbruik: tekst(v.gasverbruik),
      elektriciteitsprijs: tekst(v.elektriciteitsprijs),
      gasprijs: tekst(v.gasprijs),
      measures: lijst(v.measures, bekendeMaatregel),
      advice: v.advice === true,
      name: tekst(v.name),
      contact: tekst(v.contact),
    };
  } catch {
    return null;
  }
}

export const sameAddress = (a: Pick<ScanSession, "postcode" | "huisnummer">, b: Pick<ScanSession, "postcode" | "huisnummer">) =>
  a.postcode.replace(/\s/g, "").toUpperCase() === b.postcode.replace(/\s/g, "").toUpperCase() &&
  a.huisnummer.trim().toUpperCase() === b.huisnummer.trim().toUpperCase();

/** Leesbare tekst voor een ja/nee/onbekend-antwoord. */
export const antwoordTekst = (a: Antwoord | null) => (a === "ja" ? "Ja" : a === "nee" ? "Nee" : a === "onbekend" ? "Weet ik niet" : "Niet ingevuld");

export function scanMessage(s: ScanSession) {
  const namen = (ids: string[]) => SCAN_MEASURES.filter((m) => ids.includes(m.id)).map((m) => m.label).join(", ");
  return [
    "Hoi Gijs, ik wil graag een gratis energiescan aan huis bespreken.",
    "",
    "Naam: " + (s.name.trim() || "Nog in te vullen"),
    "Contact: " + (s.contact.trim() || "Nog in te vullen"),
    "Adres: " + (s.addressLabel || s.postcode + " " + s.huisnummer) + (s.manualAddress ? " (handmatig ingevuld)" : ""),
    "Woningtype: " + HOUSE_MODELS[s.houseType].label,
    "Dakkapel: " + antwoordTekst(s.dakkapel),
    "Garage: " + antwoordTekst(s.garage),
    "Aanbouw: " + antwoordTekst(s.aanbouw),
    "Kruipruimte: " + antwoordTekst(s.kruipruimte),
    "Spouwmuren: " + antwoordTekst(s.spouwmuur),
    "Bouwjaar: " + (s.bouwjaar || "Niet ingevuld"),
    "Woonoppervlakte: " + (s.woonoppervlakte ? s.woonoppervlakte + " m²" : "Niet ingevuld"),
    "Wensen: " + (s.wishes.join(", ") || (s.wensenOnbekend ? "Weet ik nog niet" : "Samen bespreken")),
    "Al aanwezig: " + (namen(s.bestaandeMaatregelen) || (s.aanwezigOnbekend ? "Weet ik niet precies" : "Nog niet aangegeven")) +
      (s.bestaandeMaatregelen.includes("zonnepanelen") && s.zonnepanelenAantal ? ` (${s.zonnepanelenAantal} panelen)` : ""),
    "Verwarming: " + (s.verwarming || "Niet ingevuld"),
    "Aantal bewoners: " + (s.aantalBewoners || "Niet ingevuld"),
    "Gasverbruik: " + (s.gasverbruik ? s.gasverbruik + " m³" : "Niet ingevuld"),
    "Elektriciteitsverbruik: " + (s.elektriciteitsverbruik ? s.elektriciteitsverbruik + " kWh" : "Niet ingevuld"),
    "Wil verbeteren: " + (namen(s.measures) || "Advies over de mogelijkheden"),
    s.advice ? "Ik ontvang graag hulp bij het kiezen." : "",
  ]
    .filter((line, i) => line || i === 1)
    .join("\n");
}
