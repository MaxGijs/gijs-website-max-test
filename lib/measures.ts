// ════════════════════════════════════════════════════════════════
// MAATREGELCATALOGUS — het prototype van wat de Productbriefing
// "measure_catalog" noemt (sectie 14, minimaal datamodel).
//
// Dit bestand was tot week 3 in tweeën opgeknipt: `SCAN_MEASURES` in
// lib/scan-session.ts (voor de wensen-stap) en `MEASURES` in
// lib/mock/woning.ts (voor prijzen/zones), met andere id's en labels
// voor dezelfde maatregelen. Eén lijst hier voorkomt dat een maatregel
// op de ene plek anders heet of andere voorbeeldbedragen heeft dan op
// de andere.
//
// Bedragen zijn nog steeds bewust fictief (zie computeWoningplanTotals
// hieronder) — geen echte Gijs-rekenmotor, geen echt prijsboek.
// ════════════════════════════════════════════════════════════════

export type WoningZoneId = "dak" | "gevel" | "vloer" | "kozijnen" | "installaties";

export const ZONE_LABELS: Record<WoningZoneId, string> = {
  dak: "Dak",
  gevel: "Gevel",
  vloer: "Vloer",
  kozijnen: "Kozijnen",
  installaties: "Installaties",
};

export type MeasureGroupId = "isolatie" | "installaties";

export const MEASURE_GROUPS: { id: MeasureGroupId; label: string; description: string }[] = [
  {
    id: "installaties",
    label: "Installaties",
    description: "Zelf stroom opwekken, bewaren of anders verwarmen.",
  },
  {
    id: "isolatie",
    label: "Isolatie",
    description: "Warmte binnenhouden via dak, muren, vloer en ramen.",
  },
];

export type Measure = {
  id: string;
  /** Waar dit onderdeel op de 3D-woning zit — bepaalt welke maatregelen verschijnen na een zone-klik. */
  zone: WoningZoneId;
  group: MeasureGroupId;
  label: string;
  /** Korte tekst voor de wensen-stap. */
  text: string;
  /** Langere, neutrale omschrijving voor het woningplan (geen resultaatclaims). */
  omschrijving: string;
  /** Voorbeeldbedrag, geen echte Gijs-prijs. */
  brutoInvestering: number;
  /** Voorbeeldbedrag, geen echte besparingsclaim. */
  besparingPerJaar: number;
  /** false = (nog) geen zichtbare verandering op het 3D-model. */
  zichtbaarIn3D: boolean;
};

export const MEASURES: Measure[] = [
  {
    id: "zonnepanelen",
    zone: "installaties",
    group: "installaties",
    label: "Zonnepanelen",
    text: "Voeg panelen toe aan het dak voor eigen stroom.",
    omschrijving: "Zonnepanelen op het dakvlak.",
    brutoInvestering: 6000,
    besparingPerJaar: 500,
    zichtbaarIn3D: true,
  },
  {
    id: "warmtepomp",
    zone: "installaties",
    group: "installaties",
    label: "Warmtepomp",
    text: "Bekijk de buitenunit naast je woning.",
    omschrijving: "Hybride warmtepomp naast (of in plaats van) de ketel.",
    brutoInvestering: 8000,
    besparingPerJaar: 600,
    zichtbaarIn3D: true,
  },
  {
    id: "dakisolatie",
    zone: "dak",
    group: "isolatie",
    label: "Dakisolatie",
    text: "Bekijk de isolatielaag onder de dakbedekking.",
    omschrijving: "Isolatie aan de binnen- of buitenzijde van het dak.",
    brutoInvestering: 5000,
    besparingPerJaar: 500,
    zichtbaarIn3D: true,
  },
  {
    id: "gevelisolatie",
    zone: "gevel",
    group: "isolatie",
    label: "Spouwisolatie",
    text: "Kijk tussen de muren naar de extra isolatielaag.",
    omschrijving: "Spouwmuurisolatie van de buitengevel.",
    brutoInvestering: 3000,
    besparingPerJaar: 300,
    zichtbaarIn3D: true,
  },
  {
    id: "vloerisolatie",
    zone: "vloer",
    group: "isolatie",
    label: "Vloerisolatie",
    text: "Bekijk de isolatie onder de begane grond.",
    omschrijving: "Isolatie onder de begane grondvloer.",
    brutoInvestering: 2000,
    besparingPerJaar: 200,
    zichtbaarIn3D: true,
  },
  {
    id: "glas-kozijnen",
    zone: "kozijnen",
    group: "isolatie",
    label: "Glas en kozijnen",
    text: "Geef de woning herkenbaar nieuwe ramen en kozijnen.",
    omschrijving: "Triple glas in nieuwe kozijnen.",
    brutoInvestering: 10000,
    besparingPerJaar: 400,
    zichtbaarIn3D: true,
  },
  {
    id: "vloerverwarming",
    zone: "vloer",
    group: "installaties",
    label: "Vloerverwarming",
    text: "Bekijk de leidingen in de dekvloer, onder de afwerkvloer.",
    omschrijving: "Vloerverwarming als vervanging van of aanvulling op radiatoren.",
    brutoInvestering: 4000,
    besparingPerJaar: 150,
    zichtbaarIn3D: true,
  },
  {
    id: "thuisbatterij",
    zone: "installaties",
    group: "installaties",
    label: "Thuisbatterij",
    text: "Bekijk de buitenkast naast de warmtepomp.",
    omschrijving: "Opslag van eigen zonnestroom voor later gebruik.",
    brutoInvestering: 7000,
    besparingPerJaar: 150,
    zichtbaarIn3D: true,
  },
];

export function measuresForZone(zone: WoningZoneId): Measure[] {
  return MEASURES.filter((m) => m.zone === zone);
}

export function measuresForGroup(group: MeasureGroupId): Measure[] {
  return MEASURES.filter((m) => m.group === group);
}

export type WoningplanTotals = {
  brutoInvestering: number;
  besparingPerJaar: number;
  subsidieVoorbeeld: number;
  nettoInvestering: number;
  financieringslastPerMaand: number;
  nettoMaandeffectPerMaand: number;
  energieverbruikIndicatieKwh: number;
  /** null zolang er niets geselecteerd is of er niets te besparen valt (voorkomt delen door 0 / oneindig). */
  terugverdientijdJaar: number | null;
};

/**
 * Illustratieve, lokale optelsom — GEEN rekenmotor. Er bestaat nog geen
 * echte Gijs-rekenmotor (zie Productbriefing sectie 8); deze functie
 * dient alleen om te laten zien HOE resultaten later gepresenteerd
 * kunnen worden, met duidelijk fictieve voorbeeldbedragen.
 *
 * De subsidie is een vast, verzonnen percentage (15%) los van elke
 * echte regeling (geen ISDE of andere naam) — puur om de opbouw van
 * het rijtje bruto -> subsidie -> netto te kunnen tonen.
 */
export function computeWoningplanTotals(selectedIds: string[]): WoningplanTotals {
  const selected = MEASURES.filter((m) => selectedIds.includes(m.id));
  const brutoInvestering = selected.reduce((sum, m) => sum + m.brutoInvestering, 0);
  const besparingPerJaar = selected.reduce((sum, m) => sum + m.besparingPerJaar, 0);
  const subsidieVoorbeeld = Math.round(brutoInvestering * 0.15);
  const nettoInvestering = brutoInvestering - subsidieVoorbeeld;
  const financieringslastPerMaand = Math.round(nettoInvestering / 120); // indicatief, 10 jaar, exclusief rente
  const nettoMaandeffectPerMaand = Math.round(financieringslastPerMaand - besparingPerJaar / 12);
  const baselineKwh = 12000; // indicatief basisverbruik, zelfde orde van grootte als prototype 1
  const reductie = Math.min(selected.length * 0.08, 0.4);
  const energieverbruikIndicatieKwh = Math.round(baselineKwh * (1 - reductie));
  const terugverdientijdJaar = besparingPerJaar > 0 ? Math.round((nettoInvestering / besparingPerJaar) * 10) / 10 : null;

  return {
    brutoInvestering,
    besparingPerJaar,
    subsidieVoorbeeld,
    nettoInvestering,
    financieringslastPerMaand,
    nettoMaandeffectPerMaand,
    energieverbruikIndicatieKwh,
    terugverdientijdJaar,
  };
}

export function formatEuro(bedrag: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(bedrag);
}
