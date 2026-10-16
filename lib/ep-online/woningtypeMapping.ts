import type { HouseType } from "@/lib/woning-types";

// Eén centrale mapping van EP-Online's "Gebouwtype" (het officieel
// geregistreerde gebouwtype bij een energielabel) naar de vier woningtypes
// die de Gijs-woningscan gebruikt. Niet verspreiden over meerdere bestanden.
//
// GECONTROLEERD tegen echte API-responses (13-10-2026, los steekproefje van
// ruim 20 adressen met EP_ONLINE_API_KEY): de volgende Gebouwtype-waarden
// kwamen voor: "Rijwoning tussen", "Rijwoning hoek", "Twee-onder-één-kap",
// "Vrijstaande woning", "Flatwoning (overig)", leeg, en de samengestelde
// waarde "Twee-onder-een-kap / rijwoning hoek" (let op: zonder accent op
// "een", in tegenstelling tot de losse waarde "Twee-onder-één-kap").
//
// Die samengestelde waarde komt relatief vaak voor en betekent dat EP-Online
// zelf niet kan onderscheiden of het pand een twee-onder-één-kap-woning of
// een kop/hoekwoning in een rij is (bouwkundig vaak nauwelijks te
// onderscheiden). Hier bewust NIET geraden welke van de twee het is: blijft
// "onbekend", net als "Flatwoning (overig)" (geen van de vier Gijs-
// woningtypes). De bewoner kiest dan zelf — zie de "Kon niet automatisch
// worden bepaald"-tekst in StapBevestigen.tsx, die precies voor dit soort
// gevallen verschijnt.
const GEBOUWTYPE_NAAR_HOUSETYPE: Record<string, HouseType> = {
  "vrijstaande woning": "vrijstaand",
  "rijwoning hoek": "hoekwoning",
  "rijwoning tussen": "tussenwoning",
  "twee-onder-één-kap": "twee-onder-een-kap",
};

/** Geeft null bij een onbekend/niet-ondersteund of dubbelzinnig gebouwtype (bv. appartement, de samengestelde
 * "twee-onder-een-kap / rijwoning hoek"-waarde, of woonboot) — dan kiest de bewoner zelf. */
export function mapGebouwtypeNaarHouseType(gebouwtype: string | null | undefined): HouseType | null {
  if (!gebouwtype) return null;
  return GEBOUWTYPE_NAAR_HOUSETYPE[gebouwtype.trim().toLowerCase()] ?? null;
}

/** True voor de samengestelde EP-Online-waarde "Twee-onder-een-kap / rijwoning hoek" (met of zonder accent). */
export function isTweeOnderEenKapOfHoek(gebouwtype: string | null | undefined): boolean {
  const t = (gebouwtype ?? "").trim().toLowerCase().replace("één", "een");
  return t.includes("twee-onder-een-kap") && t.includes("rijwoning hoek");
}

/**
 * Combineert EP-Online met het woningtype dat uit de BAG-plattegronden is afgeleid
 * (lib/bag/woningtypeGeometrie.ts):
 * - eenduidig gebouwtype bij EP-Online → dat geldt (officieel geregistreerd bij het label);
 * - de samengestelde "twee-onder-een-kap / rijwoning hoek" → de BAG beslist tussen die twee;
 * - geen label of geen bruikbaar type → het BAG-type (of null als ook dat niet lukte).
 */
export function combineerWoningtype(
  epOnline: { houseType: HouseType | null; tweeOnderEenKapOfHoek?: boolean } | null,
  uitBag: HouseType | null,
): HouseType | null {
  if (epOnline?.houseType) return epOnline.houseType;
  if (epOnline?.tweeOnderEenKapOfHoek) return uitBag === "twee-onder-een-kap" || uitBag === "hoekwoning" ? uitBag : null;
  return uitBag;
}
