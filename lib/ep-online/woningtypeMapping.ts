import type { HouseType } from "@/lib/woning-types";

// Eén centrale mapping van EP-Online's "Gebouwtype" (het officieel
// geregistreerde gebouwtype bij een energielabel) naar de vier woningtypes
// die de Gijs-woningscan gebruikt. Niet verspreiden over meerdere bestanden.
//
// Bron van deze exacte tekstwaarden: de officiële EP-Online API-
// documentatie (business rules), niet zelf verzonnen:
// https://github.com/Dictu/EP-online-API/blob/master/Documentatie/Energielabel/EnergielabelApi-validaties.md
// Daar staan de geregistreerde gebouwtypes met hun naam, onder andere:
// 1 Vrijstaande woning, 2 Rijwoning hoek, 3 Rijwoning tussen,
// 7 Appartement (met een eigen subtype, niet een van de vier hieronder),
// 12 Twee-onder-één-kap, 13/15 Woonboot, 14 Woonwagen, 16 Logieswoning.
// Alleen de eerste vier komen overeen met een Gijs-woningtype; de rest
// (appartement, woonboot, woonwagen, logieswoning) heeft geen van de vier
// opties en blijft dus onbekend — dan kiest de bewoner het zelf.
//
// Dit is nog niet bevestigd tegen een echte, ruwe JSON-respons (er is nog
// geen EP_ONLINE_API_KEY): de hierboven gedocumenteerde namen zijn wel de
// officiële, geregistreerde gebouwtypenamen, maar mocht de REST API v5 een
// net iets andere schrijfwijze teruggeven, dan mapt die simpelweg niet mee
// (geen gok, gewoon "onbekend") totdat dit met een echte respons is
// gecontroleerd en deze mapping zo nodig is aangevuld.
const GEBOUWTYPE_NAAR_HOUSETYPE: Record<string, HouseType> = {
  "vrijstaande woning": "vrijstaand",
  "rijwoning hoek": "hoekwoning",
  "rijwoning tussen": "tussenwoning",
  "twee-onder-één-kap": "twee-onder-een-kap",
};

/** Geeft null bij een onbekend/niet-ondersteund gebouwtype (bv. appartement, woonboot) — dan kiest de bewoner zelf. */
export function mapGebouwtypeNaarHouseType(gebouwtype: string | null | undefined): HouseType | null {
  if (!gebouwtype) return null;
  return GEBOUWTYPE_NAAR_HOUSETYPE[gebouwtype.trim().toLowerCase()] ?? null;
}
