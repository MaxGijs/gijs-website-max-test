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
// Er staan bewust geen prijzen, besparingen of terugverdientijden in: die
// zijn (nog) niet door Gijs vrijgegeven. Subsidie per m² staat in
// lib/content/subsidie-per-m2.ts (uit het subsidieoverzicht van Gijs).
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
    label: "Isolaties",
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
    zichtbaarIn3D: true,
  },
  {
    id: "warmtepomp",
    zone: "installaties",
    group: "installaties",
    label: "Warmtepomp",
    text: "Bekijk de buitenunit naast je woning.",
    omschrijving: "Hybride warmtepomp naast (of in plaats van) de ketel.",
    zichtbaarIn3D: true,
  },
  {
    id: "dakisolatie",
    zone: "dak",
    group: "isolatie",
    label: "Dakisolatie",
    text: "Bekijk de isolatielaag onder de dakbedekking.",
    omschrijving: "Isolatie aan de binnen- of buitenzijde van het dak.",
    zichtbaarIn3D: true,
  },
  {
    id: "gevelisolatie",
    zone: "gevel",
    group: "isolatie",
    label: "Spouwmuurisolatie",
    text: "Kijk tussen de muren naar de extra isolatielaag.",
    omschrijving: "Spouwmuurisolatie van de buitengevel.",
    zichtbaarIn3D: true,
  },
  {
    id: "vloerisolatie",
    zone: "vloer",
    group: "isolatie",
    label: "Vloerisolatie",
    text: "Bekijk de isolatie onder de begane grond.",
    omschrijving: "Isolatie onder de begane grondvloer.",
    zichtbaarIn3D: true,
  },
  {
    id: "glas-kozijnen",
    zone: "kozijnen",
    group: "isolatie",
    label: "Isolatieglas en kozijnen",
    text: "Geef de woning herkenbaar nieuwe ramen en kozijnen.",
    omschrijving: "Triple glas in nieuwe kozijnen.",
    zichtbaarIn3D: true,
  },
  {
    id: "vloerverwarming",
    zone: "vloer",
    group: "installaties",
    label: "Vloerverwarming",
    text: "Bekijk de leidingen in de dekvloer, onder de afwerkvloer.",
    omschrijving: "Vloerverwarming als vervanging van of aanvulling op radiatoren.",
    zichtbaarIn3D: true,
  },
  {
    id: "thuisbatterij",
    zone: "installaties",
    group: "installaties",
    label: "Thuisbatterij",
    text: "Bekijk de buitenkast naast de warmtepomp.",
    omschrijving: "Opslag van eigen zonnestroom voor later gebruik.",
    zichtbaarIn3D: true,
  },
];

export function measuresForZone(zone: WoningZoneId): Measure[] {
  return MEASURES.filter((m) => m.zone === zone);
}

export function measuresForGroup(group: MeasureGroupId): Measure[] {
  return MEASURES.filter((m) => m.group === group);
}
