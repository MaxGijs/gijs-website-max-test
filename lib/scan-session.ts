import { HOUSE_MODELS, parseHouseType, type HouseType } from "./woning-types";
import { MEASURES, MEASURE_GROUPS } from "./measures";

// De maatregellijst en groepsindeling komen sinds week 3 uit
// lib/measures.ts (de gedeelde "measure_catalog"), zodat dezelfde
// maatregel overal dezelfde id, label en zone heeft — zie het
// bestandscommentaar daar voor de reden.
export const SCAN_MEASURES = MEASURES;
export const SCAN_GROUPS = MEASURE_GROUPS.map((g) => ({
  label: g.label,
  description: g.description,
  ids: MEASURES.filter((m) => m.group === g.id).map((m) => m.id),
}));

export const SCAN_WISHES = [
  "Minder tocht",
  "Een warmere vloer",
  "Minder gas gebruiken",
  "Zelf stroom opwekken",
];

export type ScanSession = {
  version: 5;
  step: number;
  reached: number;

  postcode: string;
  huisnummer: string;
  houseType: HouseType;

  /** Bevestigd via "Ja, dit is mijn woning" (stap Woning) — pas daarna tonen we de controleerbare velden. */
  woningBevestigd: boolean;

  bouwjaar: string;
  woonoppervlakte: string;
  monument: string;
  kruipruimte: string;
  typeMuren: string;
  /** Uit "Bouw jouw woning". Standaard true: bestaande modellen tonen de dakkapel altijd al, dus dit verandert niets totdat de bewoner het bewust uitzet. */
  dakkapelAanwezig: boolean;
  /** Uit "Bouw jouw woning". Heeft alleen zichtbaar effect bij een vrijstaand-achtig woningtype (garage-groep in dat model). */
  aanbouwAanwezig: boolean;

  verwarming: string;
  installatiejaarCv: string;
  warmteafgifte: string;
  warmWater: string;

  bestaandeMaatregelen: string[];
  /** Alleen relevant/getoond wanneer "zonnepanelen" in bestaandeMaatregelen staat. */
  zonnepanelenAantal: string;

  aantalBewoners: string;
  elektriciteitsverbruik: string;
  gasverbruik: string;
  elektriciteitsprijs: string;
  gasprijs: string;
  energielabel: string;

  measures: string[];
  name: string;
  addressLabel: string;
  contact: string;
  wishes: string[];
  advice: boolean;
  manualAddress: boolean;
  /** Verplicht vóór de scan; zonder dit kan de bewoner nooit voorbij stap 0 komen (zie readScan). */
  akkoordVoorwaarden: boolean;
};

export const SCAN_KEY = "gijs-woningscan-v2";

export const freshScan = (
  postcode = "",
  huisnummer = "",
  houseType: HouseType = "hoekwoning"
): ScanSession => ({
  version: 5,
  step: 0,
  reached: 0,

  postcode,
  huisnummer,
  houseType,

  woningBevestigd: false,

  bouwjaar: "",
  woonoppervlakte: "",
  monument: "",
  kruipruimte: "",
  typeMuren: "",
  dakkapelAanwezig: true,
  aanbouwAanwezig: true,

  verwarming: "",
  installatiejaarCv: "",
  warmteafgifte: "",
  warmWater: "",

  bestaandeMaatregelen: [],
  zonnepanelenAantal: "",

  aantalBewoners: "",
  elektriciteitsverbruik: "",
  gasverbruik: "",
  elektriciteitsprijs: "",
  gasprijs: "",
  energielabel: "",

  measures: [],
  name: "",
  addressLabel: "",
  contact: "",
  wishes: [],
  advice: false,
  manualAddress: false,
  akkoordVoorwaarden: false,
});

export function readScan(raw: string | null): ScanSession | null {
  try {
    const v = JSON.parse(raw ?? "null");

    // Vorige versie had 6 stappen (0-5); deze versie heeft er 7 (0-6) met
    // een nieuwe stap "Bouw jouw woning" ertussen, dus dezelfde stapindex
    // betekent nu iets anders — geen zinvolle migratie mogelijk, dus een
    // oudere sessie start gewoon opnieuw in plaats van op een verkeerde
    // stap te landen.
    if (
      !v ||
      v.version !== 5 ||
      !parseHouseType(v.houseType) ||
      !Number.isInteger(v.step) ||
      !Number.isInteger(v.reached) ||
      v.step < 0 ||
      v.step > v.reached ||
      v.reached > 6 ||
      typeof v.postcode !== "string" ||
      typeof v.huisnummer !== "string" ||
      !Array.isArray(v.measures)
    ) {
      return null;
    }

    // Zonder akkoord kan de bewoner nooit voorbij stap 0 (Adres) zijn
    // gekomen — een opgeslagen step/reached die dat wel suggereert (bijv.
    // een sessie van vóór dit akkoord bestond) is dus niet te vertrouwen
    // en wordt teruggezet naar het begin in plaats van de bewoner een
    // scan te laten hervatten die nooit geaccepteerd is.
    const akkoordVoorwaarden = v.akkoordVoorwaarden === true;

    return {
      ...freshScan(v.postcode, v.huisnummer, v.houseType),

      step: akkoordVoorwaarden ? v.step : 0,
      reached: akkoordVoorwaarden ? v.reached : 0,
      akkoordVoorwaarden,

      woningBevestigd: v.woningBevestigd === true,

      bouwjaar: typeof v.bouwjaar === "string" ? v.bouwjaar : "",
      woonoppervlakte:
        typeof v.woonoppervlakte === "string" ? v.woonoppervlakte : "",
      monument: typeof v.monument === "string" ? v.monument : "",
      kruipruimte: typeof v.kruipruimte === "string" ? v.kruipruimte : "",
      typeMuren: typeof v.typeMuren === "string" ? v.typeMuren : "",
      dakkapelAanwezig: typeof v.dakkapelAanwezig === "boolean" ? v.dakkapelAanwezig : true,
      aanbouwAanwezig: typeof v.aanbouwAanwezig === "boolean" ? v.aanbouwAanwezig : true,

      verwarming: typeof v.verwarming === "string" ? v.verwarming : "",
      installatiejaarCv:
        typeof v.installatiejaarCv === "string" ? v.installatiejaarCv : "",
      warmteafgifte:
        typeof v.warmteafgifte === "string" ? v.warmteafgifte : "",
      warmWater: typeof v.warmWater === "string" ? v.warmWater : "",

      bestaandeMaatregelen: Array.isArray(v.bestaandeMaatregelen)
        ? v.bestaandeMaatregelen.filter(
            (item: unknown) => typeof item === "string"
          )
        : [],
      zonnepanelenAantal:
        typeof v.zonnepanelenAantal === "string" ? v.zonnepanelenAantal : "",

      aantalBewoners:
        typeof v.aantalBewoners === "string" ? v.aantalBewoners : "",
      elektriciteitsverbruik:
        typeof v.elektriciteitsverbruik === "string"
          ? v.elektriciteitsverbruik
          : "",
      gasverbruik:
        typeof v.gasverbruik === "string" ? v.gasverbruik : "",
      elektriciteitsprijs:
        typeof v.elektriciteitsprijs === "string"
          ? v.elektriciteitsprijs
          : "",
      gasprijs: typeof v.gasprijs === "string" ? v.gasprijs : "",
      energielabel: typeof v.energielabel === "string" ? v.energielabel : "",

      measures: [
        ...new Set<string>(
          v.measures.filter((id: unknown) =>
            SCAN_MEASURES.some((m) => m.id === id)
          )
        ),
      ],

      name: typeof v.name === "string" ? v.name : "",
      addressLabel:
        typeof v.addressLabel === "string" ? v.addressLabel : "",
      contact: typeof v.contact === "string" ? v.contact : "",

      wishes: Array.isArray(v.wishes)
        ? v.wishes.filter(
            (w: unknown) =>
              typeof w === "string" && SCAN_WISHES.includes(w)
          )
        : [],

      advice: v.advice === true,
      manualAddress: v.manualAddress === true,
    };
  } catch {
    return null;
  }
}

export const sameAddress = (
  a: Pick<ScanSession, "postcode" | "huisnummer">,
  b: Pick<ScanSession, "postcode" | "huisnummer">
) =>
  a.postcode.replace(/\s/g, "").toUpperCase() ===
    b.postcode.replace(/\s/g, "").toUpperCase() &&
  a.huisnummer.trim().toUpperCase() ===
    b.huisnummer.trim().toUpperCase();

export function scanMessage(s: ScanSession) {
  return [
    "Hoi Gijs, ik wil graag een gratis energiescan aan huis bespreken.",
    "",
    "Naam: " + (s.name.trim() || "Nog in te vullen"),
    "Contact: " + (s.contact.trim() || "Nog in te vullen"),
    "Adres: " +
      (s.addressLabel || s.postcode + " " + s.huisnummer) +
      (s.manualAddress ? " (handmatig ingevuld)" : ""),
    "Woningtype: " + HOUSE_MODELS[s.houseType].label,
    "Bouwjaar: " + (s.bouwjaar || "Nog niet ingevuld"),
    "Woonoppervlakte: " +
      (s.woonoppervlakte ? s.woonoppervlakte + " m²" : "Nog niet ingevuld"),
    "Energielabel: " + (s.energielabel || "Nog niet ingevuld"),
    "Aantal bewoners: " + (s.aantalBewoners || "Nog niet ingevuld"),
    "Gasverbruik: " +
      (s.gasverbruik ? s.gasverbruik + " m³" : "Nog niet ingevuld"),
    "Elektriciteitsverbruik: " +
      (s.elektriciteitsverbruik
        ? s.elektriciteitsverbruik + " kWh"
        : "Nog niet ingevuld"),
    "Wensen: " + (s.wishes.join(", ") || "Samen bespreken"),
    "Al aanwezig: " +
      (SCAN_MEASURES.filter((m) => s.bestaandeMaatregelen.includes(m.id))
        .map((m) => m.label)
        .join(", ") || "Nog niet aangegeven") +
      (s.bestaandeMaatregelen.includes("zonnepanelen") && s.zonnepanelenAantal
        ? ` (${s.zonnepanelenAantal} panelen)`
        : ""),
    "Interesse in: " +
      (SCAN_MEASURES.filter((m) => s.measures.includes(m.id))
        .map((m) => m.label)
        .join(", ") || "Advies over de mogelijkheden"),
    s.advice ? "Ik ontvang graag hulp bij het kiezen." : "",
  ]
    .filter((line, i) => line || i === 1)
    .join("\n");
}