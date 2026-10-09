import { HOUSE_MODELS, parseHouseType, type HouseType } from "./woning-types";
import { MEASURES, MEASURE_GROUPS } from "./measures";
import { MC_PRIJZEN, GIJS_WARMTEPRIJS } from "./content/milieu-centraal";

// De maatregellijst en groepsindeling komen uit lib/measures.ts (de
// gedeelde "measure_catalog"), zodat dezelfde maatregel overal dezelfde id,
// label en zone heeft.
export const SCAN_MEASURES = MEASURES;
export const SCAN_GROUPS = MEASURE_GROUPS.map((g) => ({
  label: g.label,
  description: g.description,
  ids: MEASURES.filter((m) => m.group === g.id).map((m) => m.id),
}));

export const SCAN_WISHES = [
  "Lagere energiekosten",
  "Meer wooncomfort",
  "Minder gas gebruiken",
  "Zelf energie opwekken",
  "Zo energieneutraal mogelijk wonen",
  "Ook bij stroomuitval eigen stroom kunnen gebruiken",
];

// Volgorde: cv-ketel, hybride warmtepomp, volledig elektrische warmtepomp, stadsverwarming
// (bestaande, al verrekende categorie), dan de toegevoegde opties open haard of kachel/luchtverwarming
// (luchtverwarming is verplaatst vanuit AFGIFTE_OPTIES, want dit is een verwarmingsbrón, geen
// afgiftesysteem) en "Anders" (met toelichting, zie verwarmingAnders in ScanSession).
export const VERWARMING_OPTIES = ["Cv-ketel", "Hybride warmtepomp", "Volledig elektrische warmtepomp met boiler", "Stads- of blokverwarming", "Open haard of kachel", "Luchtverwarming", "Anders", "Weet ik niet"] as const;
export const AFGIFTE_OPTIES = ["Normale radiatoren (hoge temperatuur)", "Vloerverwarming of lagetemperatuurradiatoren", "Convectorputten", "Anders", "Weet ik niet"] as const;
export const WARMWATER_OPTIES = ["Douche", "Bad", "Stortdouche"] as const;
/** Oude antwoorden (eerdere versies van de vragen) naar de huidige opties, zodat een opgeslagen scan zijn antwoorden houdt. */
const OUDE_OPTIES: Record<string, string[]> = {
  "Open haard": ["Open haard of kachel"],
  "Normale radiatoren": ["Normale radiatoren (hoge temperatuur)"],
  "Radiatoren en vloerverwarming": ["Normale radiatoren (hoge temperatuur)", "Vloerverwarming of lagetemperatuurradiatoren"],
  "Douche en bad": ["Douche", "Bad"],
  "Stortdouche en/of luxe bad": ["Stortdouche"],
};
const metNieuweOpties = (v: unknown) => Array.isArray(v) ? [...new Set(v.flatMap((o) => (typeof o === "string" && OUDE_OPTIES[o]) || [o]))] : v;
export const MONUMENT_OPTIES = ["Geen monument", "Gemeentelijk monument", "Rijksmonument", "Weet ik niet"];
/** Welke verdiepingen verwarmd worden; bepaalt niet de schatting, is bedoeld om het gesprek met Gijs voor te bereiden. */
export const VERDIEPINGEN_OPTIES = ["Alleen beneden", "Beneden en boven", "Beneden en badkamer"] as const;
/** Kort en direct te kiezen, net als DAKKAPEL_OPTIES; bij "Meer" volgt een extra vraag naar het exacte aantal (aantalBewonersAantal). */
export const BEWONERS_OPTIES = ["1", "2", "3", "4", "5", "6", "Meer"] as const;

/** Dakkapel, garage en aanbouw zijn van buitenaf te zien: geen "weet ik niet" nodig. */
export const DAKKAPEL_OPTIES = ["Geen", "1", "2", "Meerdere"] as const;
export const JA_NEE_OPTIES = ["Ja", "Nee"] as const;
/** Aan welke kant van de hoekwoning de buurwoning staat (gezien vanaf de straat). */
export const HOEK_ZIJDE_OPTIES = ["Links", "Rechts"] as const;
/** Op welke werkdagen de bewoner goed bereikbaar is (meerdere mogelijk; opgeslagen als "Maandag, Woensdag"). */
export const VOORKEURSMOMENT_OPTIES = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"] as const;
/** Gekozen dagen uit voorkeursmoment, in weekvolgorde. Oude waarden (ochtend/middag/avond) vallen weg. */
export const bereikbareDagen = (v: string) => VOORKEURSMOMENT_OPTIES.filter((d) => v.split(",").map((x) => x.trim()).includes(d));

/** Verwarmingen die zelf nooit aardgas gebruiken: stadsverwarming, een volledig elektrische
 * warmtepomp en een open haard of kachel (hout). "Weet ik niet", "Luchtverwarming" en "Anders" tellen mee
 * als gas, want de meeste woningen hebben toch een cv-ketel als basis. */
const GEEN_GAS_VERWARMING = ["Stads- of blokverwarming", "Volledig elektrische warmtepomp met boiler", "Open haard of kachel"];
/** Of de verwarming (deels) op aardgas draait. */
export const gebruiktGas = (verwarming: string[]) =>
  verwarming.length === 0 || verwarming.some((v) => !GEEN_GAS_VERWARMING.includes(v));
export const gebruiktWarmtenet = (verwarming: string[]) => verwarming.includes("Stads- of blokverwarming");
/** Welke gekozen verwarming leidend is voor de verbruiksschatting, bij meerdere keuzes. */
export const primaireVerwarming = (verwarming: string[]) => VERWARMING_OPTIES.find((o) => verwarming.includes(o)) ?? "";

/**
 * Antwoord op een woningvraag. "onbekend" = de bewoner koos "Ik weet het
 * niet"; dat is iets anders dan "nee" en wordt ook zo bewaard.
 * null = de vraag is (nog) niet beantwoord.
 */
export type Antwoord = "ja" | "nee" | "onbekend";

// Drie stappen: woning bevestigen, alles over woning en energie op één
// pagina, en direct het woningplan.
export const SCAN_STAPPEN = ["Jouw woning", "Woning en energie", "Jouw woningplan"] as const;
export const STAP = { woning: 0, gegevens: 1, plan: 2 } as const;

export type ScanSession = {
  version: 9;
  step: number;
  reached: number;
  /** Gezet bij "Wijzigen" vanuit het woningplan: de knop wordt dan "Terug naar mijn woningplan". */
  terugNaarPlan: boolean;

  postcode: string;
  huisnummer: string;
  houseType: HouseType;
  /** Herkomst van het huidige woningtype: "" = nog geen bron (standaardwaarde), "automatisch" = via EP-Online bepaald, "handmatig" = bewoner heeft zelf gekozen. Alleen "handmatig" mag een volgende automatische herkenning tegenhouden. */
  woningtypeBron: "" | "automatisch" | "handmatig";
  addressLabel: string;
  manualAddress: boolean;
  woningBevestigd: boolean;
  /** Alleen bij hoekwoning: aan welke kant de buurwoning staat, voor de illustratieve woningweergave. */
  hoekZijde: string;

  /** "Geen" | "1" | "2" | "Meerdere". */
  dakkapel: string;
  /** Alleen bij dakkapel "Meerdere": hoeveel/waar, in eigen woorden. */
  dakkapelAantal: string;
  garage: string;
  aanbouw: string;
  kruipruimte: Antwoord | null;
  spouwmuur: Antwoord | null;
  bouwjaar: string;
  woonoppervlakte: string;
  monument: string;
  /** Letter van het officieel geregistreerde energielabel (bv. "C"), via EP-Online. "" = niet gevonden of nog niet opgehaald. */
  energielabel: string;
  /** True zodra bouwjaar/woonoppervlakte automatisch via het Kadaster (BAG) zijn ingevuld. */
  bagOpgehaald: boolean;
  /** Werkelijke oppervlakte begane grond uit de kadastrale plattegrond; leeg als niet opgehaald. */
  vloeroppervlakte: string;
  /** Richtwaarde dakoppervlak (plattegrond x standaard hellingsfactor); geen exacte meting. */
  dakoppervlakte: string;
  /** Richtwaarde geveloppervlak (omtrek x aangenomen bouwhoogte, min. gedeelde muren); geen exacte meting. */
  gevelOppervlakte: string;

  /** Meerdere keuzes mogelijk: sommige woningen hebben bijvoorbeeld zowel een cv-ketel als een houtkachel. */
  verwarming: string[];
  /** Toelichting bij verwarming "Anders". */
  verwarmingAnders: string;
  /** "Alleen beneden", "Beneden en boven" of "Beneden en badkamer"; "" = niet ingevuld. */
  verwarmdeVerdiepingen: string;
  warmteafgifte: string[];
  /** Toelichting bij warmteafgifte "Anders". */
  warmteafgifteAnders: string;
  /** Warm water in de badkamer: douche, douche en bad, en/of stortdouche/luxe bad. */
  warmWater: string[];

  bestaandeMaatregelen: string[];
  aanwezigOnbekend: boolean;
  zonnepanelenAantal: string;

  /** "1" | "2" | "3" | "4" | "Meer". */
  aantalBewoners: string;
  /** Alleen bij aantalBewoners "Meer": het exacte aantal, in eigen woorden (zelfde patroon als dakkapelAantal). */
  aantalBewonersAantal: string;
  elektriciteitsverbruik: string;
  gasverbruik: string;
  /** Alleen bij stads- of blokverwarming, in GJ per jaar. */
  warmteverbruik: string;
  elektriciteitsprijs: string;
  gasprijs: string;
  warmteprijs: string;

  wishes: string[];
  wensenOnbekend: boolean;

  measures: string[];
  /** "Ik wil iets wijzigen aan wat ik al heb" (veldnaam blijft voor bestaande scans). */
  advice: boolean;
  /** Bij advice: wat de bewoner wil wijzigen, in eigen woorden. */
  wijzigToelichting: string;
  /** Voornaam (veldnaam "name" blijft voor bestaande opgeslagen scans). */
  name: string;
  achternaam: string;
  email: string;
  telefoon: string;
  /** Wanneer goed bereikbaar voor de energiescan-aanvraag; "" = niet gekozen. */
  voorkeursmoment: string;
  /** Vrije toelichting bij de aanvraag, bv. "Alleen 's avonds bereikbaar". */
  opmerking: string;

  /** Id van het dossier in Supabase (uuid, in de browser aangemaakt bij de eerste opslag); leeg = nog niet opgeslagen. */
  dossierId: string;
  /** True zodra de bewoner de aanvraag heeft afgerond; volgende opslagen houden de status "afgerond". */
  scanAfgerond: boolean;
};

// Nieuwe sleutel: sessies met het oude datamodel (andere verwarmingsopties, "1 bewoner"-notatie) starten opnieuw.
export const SCAN_KEY = "gijs-woningscan-v6";

export const freshScan = (postcode = "", huisnummer = "", houseType: HouseType = "hoekwoning"): ScanSession => ({
  version: 9,
  step: 0,
  reached: 0,
  terugNaarPlan: false,
  postcode,
  huisnummer,
  houseType,
  woningtypeBron: "",
  addressLabel: "",
  manualAddress: false,
  woningBevestigd: false,
  hoekZijde: "",
  dakkapel: "",
  dakkapelAantal: "",
  garage: "",
  aanbouw: "",
  kruipruimte: null,
  spouwmuur: null,
  bouwjaar: "",
  woonoppervlakte: "",
  monument: "",
  energielabel: "",
  bagOpgehaald: false,
  vloeroppervlakte: "",
  dakoppervlakte: "",
  gevelOppervlakte: "",
  verwarming: [],
  verwarmingAnders: "",
  verwarmdeVerdiepingen: "",
  warmteafgifte: [],
  warmteafgifteAnders: "",
  warmWater: [],
  bestaandeMaatregelen: [],
  aanwezigOnbekend: false,
  zonnepanelenAantal: "",
  aantalBewoners: "",
  aantalBewonersAantal: "",
  elektriciteitsverbruik: "",
  gasverbruik: "",
  warmteverbruik: "",
  // Prijzen staan vooringevuld (Milieu Centraal, januari 2026; warmte: opgave Gijs) en zijn aan te passen.
  elektriciteitsprijs: MC_PRIJZEN.stroom,
  gasprijs: MC_PRIJZEN.gas,
  warmteprijs: GIJS_WARMTEPRIJS,
  wishes: [],
  wensenOnbekend: false,
  measures: [],
  advice: false,
  wijzigToelichting: "",
  name: "",
  achternaam: "",
  email: "",
  telefoon: "",
  voorkeursmoment: "",
  opmerking: "",
  dossierId: "",
  scanAfgerond: false,
});

// Max is een harde bovengrens tegen willekeurig grote invoer (bv. een direct aangeroepen
// server action, buiten de normale formuliervelden om, die geen HTML maxLength kent).
// Normale invoer via het formulier blijft altijd ruim binnen deze grens.
const tekst = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max) : "");
const optie = (v: unknown, opties: readonly string[]) => (typeof v === "string" && opties.includes(v) ? v : "");
const antwoord = (v: unknown): Antwoord | null => (v === "ja" || v === "nee" || v === "onbekend" ? v : null);
const lijst = (v: unknown, toegestaan: (s: string) => boolean) =>
  Array.isArray(v) ? [...new Set(v.filter((s: unknown): s is string => typeof s === "string" && toegestaan(s)))] : [];
const bekendeMaatregel = (id: string) => SCAN_MEASURES.some((m) => m.id === id);
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function readScan(raw: string | null): ScanSession | null {
  try {
    const v = JSON.parse(raw ?? "null");
    const laatste = SCAN_STAPPEN.length - 1;
    if (!v || v.version !== 9 || !parseHouseType(v.houseType) || !Number.isInteger(v.step) || !Number.isInteger(v.reached) || v.step < 0 || v.step > v.reached || v.reached > laatste || typeof v.postcode !== "string" || typeof v.huisnummer !== "string" || v.postcode.length > 10 || v.huisnummer.length > 10) {
      return null;
    }
    const bevestigd = v.woningBevestigd === true;
    const basis = freshScan(v.postcode, v.huisnummer, v.houseType);
    return {
      ...basis,
      step: bevestigd ? v.step : 0,
      reached: bevestigd ? v.reached : 0,
      terugNaarPlan: v.terugNaarPlan === true && bevestigd,
      woningtypeBron: v.woningtypeBron === "automatisch" || v.woningtypeBron === "handmatig" ? v.woningtypeBron : "",
      addressLabel: tekst(v.addressLabel, 200),
      manualAddress: v.manualAddress === true,
      woningBevestigd: bevestigd,
      hoekZijde: optie(v.hoekZijde, HOEK_ZIJDE_OPTIES),
      dakkapel: optie(v.dakkapel, DAKKAPEL_OPTIES),
      dakkapelAantal: tekst(v.dakkapelAantal, 200),
      garage: optie(v.garage, JA_NEE_OPTIES),
      aanbouw: optie(v.aanbouw, JA_NEE_OPTIES),
      kruipruimte: antwoord(v.kruipruimte),
      spouwmuur: antwoord(v.spouwmuur),
      bouwjaar: tekst(v.bouwjaar, 10),
      woonoppervlakte: tekst(v.woonoppervlakte, 10),
      monument: optie(v.monument, MONUMENT_OPTIES),
      energielabel: tekst(v.energielabel, 10),
      bagOpgehaald: v.bagOpgehaald === true,
      vloeroppervlakte: tekst(v.vloeroppervlakte, 10),
      dakoppervlakte: tekst(v.dakoppervlakte, 10),
      gevelOppervlakte: tekst(v.gevelOppervlakte, 10),
      verwarming: lijst(metNieuweOpties(v.verwarming), (o) => (VERWARMING_OPTIES as readonly string[]).includes(o)),
      verwarmingAnders: tekst(v.verwarmingAnders, 200),
      verwarmdeVerdiepingen: optie(v.verwarmdeVerdiepingen, VERDIEPINGEN_OPTIES),
      warmteafgifte: lijst(metNieuweOpties(v.warmteafgifte), (o) => (AFGIFTE_OPTIES as readonly string[]).includes(o)),
      warmteafgifteAnders: tekst(v.warmteafgifteAnders, 200),
      warmWater: lijst(metNieuweOpties(v.warmWater), (o) => (WARMWATER_OPTIES as readonly string[]).includes(o)),
      bestaandeMaatregelen: lijst(v.bestaandeMaatregelen, bekendeMaatregel),
      aanwezigOnbekend: v.aanwezigOnbekend === true,
      zonnepanelenAantal: tekst(v.zonnepanelenAantal, 10),
      aantalBewoners: optie(v.aantalBewoners, BEWONERS_OPTIES),
      aantalBewonersAantal: tekst(v.aantalBewonersAantal, 10),
      elektriciteitsverbruik: tekst(v.elektriciteitsverbruik, 15),
      gasverbruik: tekst(v.gasverbruik, 15),
      warmteverbruik: tekst(v.warmteverbruik, 15),
      elektriciteitsprijs: typeof v.elektriciteitsprijs === "string" && v.elektriciteitsprijs.length <= 15 ? v.elektriciteitsprijs : basis.elektriciteitsprijs,
      // De oude standaardprijs (1,35) schuift mee naar de huidige; een zelf ingevulde prijs blijft staan.
      gasprijs: typeof v.gasprijs === "string" && v.gasprijs.length <= 15 && v.gasprijs !== "1,35" ? v.gasprijs : basis.gasprijs,
      warmteprijs: typeof v.warmteprijs === "string" && v.warmteprijs.length <= 15 ? v.warmteprijs : basis.warmteprijs,
      wishes: lijst(v.wishes, (w) => SCAN_WISHES.includes(w)),
      wensenOnbekend: v.wensenOnbekend === true,
      measures: lijst(v.measures, bekendeMaatregel),
      advice: v.advice === true,
      wijzigToelichting: tekst(v.wijzigToelichting, 500),
      name: tekst(v.name, 100),
      achternaam: tekst(v.achternaam, 100),
      email: tekst(v.email, 254),
      telefoon: tekst(v.telefoon, 20),
      voorkeursmoment: typeof v.voorkeursmoment === "string" ? bereikbareDagen(v.voorkeursmoment).join(", ") : "",
      opmerking: tekst(v.opmerking, 500),
      dossierId: typeof v.dossierId === "string" && UUID.test(v.dossierId) ? v.dossierId : "",
      scanAfgerond: v.scanAfgerond === true,
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

/** Leesbare tekst voor dakkapel: "Geen", "1", "2" of "Meerdere (toelichting)". */
export const dakkapelTekst = (s: Pick<ScanSession, "dakkapel" | "dakkapelAantal">) =>
  !s.dakkapel ? "Niet ingevuld" : s.dakkapel === "Meerdere" && s.dakkapelAantal.trim() ? `Meerdere: ${s.dakkapelAantal.trim()}` : s.dakkapel;

/** Leesbare tekst voor aantal bewoners: "1 bewoner", "2 bewoners" of "Meer: <toelichting> bewoners". */
export const bewonersTekst = (s: Pick<ScanSession, "aantalBewoners" | "aantalBewonersAantal">) => {
  if (!s.aantalBewoners) return "Niet ingevuld";
  if (s.aantalBewoners === "Meer") return s.aantalBewonersAantal.trim() ? `${s.aantalBewonersAantal.trim()} bewoners` : "Meer dan 4 bewoners";
  return `${s.aantalBewoners} ${s.aantalBewoners === "1" ? "bewoner" : "bewoners"}`;
};

export function scanMessage(s: ScanSession) {
  const namen = (ids: string[]) => SCAN_MEASURES.filter((m) => ids.includes(m.id)).map((m) => m.label).join(", ");
  return [
    "Hoi Gijs, ik wil graag een gratis energiescan aan huis bespreken.",
    "",
    "Naam: " + ([s.name.trim(), s.achternaam.trim()].filter(Boolean).join(" ") || "Nog in te vullen"),
    "E-mailadres: " + (s.email.trim() || "Niet ingevuld"),
    "Telefoonnummer: " + (s.telefoon.trim() || "Niet ingevuld"),
    "Wanneer bereikbaar: " + (s.voorkeursmoment || "Niet ingevuld"),
    "Adres: " + (s.addressLabel || s.postcode + " " + s.huisnummer) + (s.manualAddress ? " (handmatig ingevuld)" : ""),
    "Woningtype: " + HOUSE_MODELS[s.houseType].label,
    "Bouwjaar: " + (s.bouwjaar || "Niet ingevuld"),
    "Woonoppervlakte: " + (s.woonoppervlakte ? s.woonoppervlakte + " m²" : "Niet ingevuld"),
    "Dakkapel: " + dakkapelTekst(s),
    "Garage: " + (s.garage || "Niet ingevuld"),
    "Aanbouw: " + (s.aanbouw || "Niet ingevuld"),
    "Kruipruimte: " + antwoordTekst(s.kruipruimte),
    "Spouwmuren: " + antwoordTekst(s.spouwmuur),
    "Verwarming: " + (s.verwarming.includes("Anders") && s.verwarmingAnders.trim() ? s.verwarming.map(w => w === "Anders" ? `Anders: ${s.verwarmingAnders.trim()}` : w).join(", ") : s.verwarming.join(", ") || "Niet ingevuld"),
    "Verwarmde verdiepingen: " + (s.verwarmdeVerdiepingen || "Niet ingevuld"),
    "Warmteafgifte: " + (s.warmteafgifte.includes("Anders") && s.warmteafgifteAnders.trim() ? s.warmteafgifte.map(w => w === "Anders" ? `Anders: ${s.warmteafgifteAnders.trim()}` : w).join(", ") : s.warmteafgifte.join(", ") || "Niet ingevuld"),
    "Warm water badkamer: " + (s.warmWater.join(", ") || "Niet ingevuld"),
    "Al aanwezig: " + (namen(s.bestaandeMaatregelen) || (s.aanwezigOnbekend ? "Weet ik niet precies" : "Nog niet aangegeven")) +
      (s.bestaandeMaatregelen.includes("zonnepanelen") && s.zonnepanelenAantal ? ` (${s.zonnepanelenAantal} panelen)` : ""),
    "Aantal bewoners: " + bewonersTekst(s),
    "Stroomverbruik: " + (s.elektriciteitsverbruik ? s.elektriciteitsverbruik + " kWh per jaar" : "Niet ingevuld"),
    gebruiktGas(s.verwarming) ? "Gasverbruik: " + (s.gasverbruik ? s.gasverbruik + " m³ per jaar" : "Niet ingevuld") : "",
    gebruiktWarmtenet(s.verwarming) ? "Warmteverbruik: " + (s.warmteverbruik ? s.warmteverbruik + " GJ per jaar" : "Niet ingevuld") : "",
    "Wensen: " + (s.wishes.join(", ") || (s.wensenOnbekend ? "Weet ik nog niet" : "Samen bespreken")),
    "Wil meer weten over: " + (namen(s.measures) || "Advies over de mogelijkheden"),
    s.advice ? "Wil iets wijzigen aan wat er al is" + (s.wijzigToelichting.trim() ? ": " + s.wijzigToelichting.trim() : "") : "",
    s.opmerking.trim() ? "Opmerking: " + s.opmerking.trim() : "",
  ]
    .filter((line, i) => line || i === 1)
    .join("\n");
}
