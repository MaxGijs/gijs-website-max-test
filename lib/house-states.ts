// Gedeelde "lagen" van het ene Gijs-woningmodel (public/models/*.glb), zodat
// landingspagina, woningscan en later configurator en woningplan over
// dezelfde onderdelen praten in plaats van elk hun eigen naamlogica.
// Een laag koppelt een begrijpelijke naam aan objectnamen in het model.
// "cavity" en "crawlspace" zijn ruimtes zonder eigen geometrie: die worden
// zichtbaar doordat de lagen eromheen uit elkaar schuiven.

export type HuisLaag =
  | "exterior"
  | "roof"
  | "roof-insulation"
  | "outer-wall"
  | "cavity"
  | "cavity-insulation"
  | "inner-wall"
  | "floor"
  | "crawlspace"
  | "floor-insulation"
  | "windows"
  | "solar-panels"
  | "heat-pump"
  | "battery";

export type Gevelkant = "voor" | "achter" | "links" | "rechts";

export const HUIS_LAGEN: Record<HuisLaag, { omschrijving: string; patroon: RegExp | null }> = {
  exterior: { omschrijving: "De woning van buiten, zoals je hem op straat ziet.", patroon: null },
  roof: { omschrijving: "Dakpannen, latten, goot, schoorsteen en dakkapel.", patroon: /^(Dakpannen|Tengellatten|Panlatten|Dakgoot|Schoorsteen|Dakkapel)/ },
  "roof-insulation": { omschrijving: "De isolatielaag onder het dak.", patroon: /^Dakisolatie/ },
  "outer-wall": { omschrijving: "De buitenmuur (het metselwerk dat je van buiten ziet).", patroon: /^Buitengevel_/ },
  cavity: { omschrijving: "De ruimte tussen buitenmuur en binnenmuur (de spouw).", patroon: null },
  "cavity-insulation": { omschrijving: "Isolatiemateriaal in de spouw.", patroon: /^(Spouwisolatie_|Zijgevel_garage_isolatie)/ },
  "inner-wall": { omschrijving: "De binnenmuur.", patroon: /^(Binnenmuur_|Bouwmuur_)/ },
  floor: { omschrijving: "De begane grondvloer: afwerkvloer, draagvloer en eventuele vloerverwarming.", patroon: /^(Vloer|Vloerconstructie|Vloerverwarming)$/ },
  crawlspace: { omschrijving: "De kruipruimte onder de vloer.", patroon: null },
  "floor-insulation": { omschrijving: "De isolatielaag tegen de onderkant van de vloer.", patroon: /^Vloerisolatie$/ },
  windows: { omschrijving: "Ramen, kozijnen en deuren.", patroon: /^(Raam|Kozijn|Voordeur|Achterdeur)/ },
  "solar-panels": { omschrijving: "Zonnepanelen op het dak.", patroon: /^Zonnepaneel/ },
  "heat-pump": { omschrijving: "De buitenunit (en binnenunit) van de warmtepomp.", patroon: /^Warmtepomp/ },
  battery: { omschrijving: "De thuisbatterij.", patroon: /^Thuisbatterij$/ },
};

/** Hoort een modelobject (op naam) bij deze laag? */
export function inLaag(naam: string, laag: HuisLaag) {
  const patroon = HUIS_LAGEN[laag].patroon;
  return patroon ? patroon.test(naam) : false;
}

/** Gevellaag voor één kant, bijvoorbeeld outer-wall + "rechts" → "Buitengevel_rechts". */
export function gevelObject(laag: "outer-wall" | "cavity-insulation" | "inner-wall", kant: Gevelkant) {
  return laag === "outer-wall" ? `Buitengevel_${kant}` : laag === "cavity-insulation" ? `Spouwisolatie_${kant}` : `Binnenmuur_${kant}`;
}

/** Installatie-laag bij een maatregel-id uit de woningscan (lib/measures.ts). */
export const INSTALLATIE_LAAG: Record<string, HuisLaag> = {
  zonnepanelen: "solar-panels",
  warmtepomp: "heat-pump",
  thuisbatterij: "battery",
};
