// Dataset voor lokale SEO (Twente), aangeleverd als "Gemeenteborden"-
// beeldset (zie public/images/regio/gemeenteborden/<Gemeente>/<Kern>.png — simpele,
// zelf ontworpen plaatsnaambord-graphics, geen foto's, dus zonder
// auteursrechtelijk risico).
//
// Brondata voor de regiopagina's (app/regio/...). Welke gemeenten en
// plaatsen daadwerkelijk een pagina krijgen, staat in lib/content/regio.ts
// (vlaggen gepubliceerd/indexeerbaar); dit bestand blijft de ruwe set.
//
// Correcties op de aangeleverde brondata (2026-10-19), bevestigd door zowel Wikipedia
// ("Lijst van steden en dorpen in Overijssel") als het Deep Research-rapport over Overijssel:
// "Dem Ham" → "Den Ham" (Twenterand), "Dijkerbroek" → "Dijkerhoek" en "Lichtenberg" → "Ligtenberg"
// (Rijssen-Holten). De bijbehorende plaatsnaambord-bestanden zijn hernoemd.
//
// Update 2026-10-20: de nieuwe, systematisch gegenereerde bordenset
// (Gijs_Overijssel_18_overige_gemeenten_368_borden.zip, zie plaatsenoverzicht.csv) vervangt het oude
// bord waar voor dezelfde plaats een nieuwe .webp-versie is aangeleverd (zelfde twee basissjablonen,
// consistenter en met correcte naamgeving). Waar de oude set een typefout bleek te hebben, bevestigd
// door de nieuwe CSV, is ook de naam gecorrigeerd: "Ijpelo" → "IJpelo" (Wierden), "Sint Isodorushoeve"
// → "Sint Isidorushoeve" (Haaksbergen). Beide gemeenten zijn nog niet gepubliceerd, dus dit raakt geen
// bestaande links. Plaatsen zonder nieuwe versie behouden hun oorspronkelijke .png-bord.
export type LokaleSeoKern = { naam: string; bord?: string };
export type LokaleSeoGemeente = { naam: string; kernen: LokaleSeoKern[] };

const bord = (gemeente: string, kern: string, ext: "png" | "webp" = "png") => `/images/regio/gemeenteborden/${gemeente}/${kern}.${ext}`;
/** namen: gewone string = bestaand .png-bord; [naam, "webp"] = vervangen door de nieuwe bordenset;
 *  [naam, "webp", bestand] = nieuw bord met een andere bestandsnaam dan de plaatsnaam. */
const kernen = (gemeente: string, namen: (string | [string, "webp", string?])[]): LokaleSeoKern[] =>
  namen.map(n => {
    if (!Array.isArray(n)) return { naam: n, bord: bord(gemeente, n) };
    const [naam, ext, bestand] = n;
    return { naam, bord: bord(gemeente, bestand ?? naam, ext) };
  });

export const LOKALE_SEO_GEMEENTEN: LokaleSeoGemeente[] = [
  // Harbrinkhoek-Mariaparochie: het Almelose deel heet Mariaparochie; dat nieuwe bord vervangt het oude
  // bord met de typefout "Harbinkhoek".
  { naam: "Almelo", kernen: kernen("Almelo", [["Aadorp", "webp"], ["Almelo", "webp"], "Azelo", ["Bavinkel", "webp"], ["Bornerbroek", "webp"], ["Deldenerbroek", "webp"], ["Harbrinkhoek-Mariaparochie", "webp", "Mariaparochie"], ["Tusveld", "webp"], "Weitemanslanden"]) },
  { naam: "Borne", kernen: kernen("Borne", [["Borne", "webp"], ["Hertme", "webp"], ["Zenderen", "webp"]]) },
  { naam: "Dinkelland", kernen: kernen("Dinkelland", ["'t Loo", "Beerkdorp", ["Berghum", "webp"], ["Breklenkamp", "webp"], ["Denekamp", "webp"], ["Deurningen", "webp"], ["Dulder", "webp"], ["Gammelke", "webp"], ["Het Stift", "webp"], ["Lattrop", "webp"], ["Lemselo", "webp"], "Nijstad", ["Noordijk", "webp"], ["Nutter", "webp"], ["Ootmarsum", "webp"], ["Oud Ootmarsum", "webp"], ["Rossum", "webp"], ["Saasveld", "webp"], ["Tilligte", "webp"], ["Volthe", "webp"], ["Weerselo", "webp"]]) },
  { naam: "Enschede", kernen: kernen("Enschede", [["Enschede", "webp"], ["Boekelo", "webp"], ["Glanerbrug", "webp"], ["Lonneker", "webp"], ["Usselo", "webp"], ["Twekkelo", "webp"]]) },
  { naam: "Haaksbergen", kernen: kernen("Haaksbergen", [["Buurse", "webp"], ["Haaksbergen", "webp"], ["Sint Isidorushoeve", "webp"]]) },
  { naam: "Hellendoorn", kernen: kernen("Hellendoorn", [["Daarle", "webp"], ["Daarlerveen", "webp"], ["Haarle", "webp"], ["Hellendoorn", "webp"], ["Nijverdal", "webp"]]) },
  { naam: "Hengelo", kernen: kernen("Hengelo", [["Hengelo", "webp"], ["Beckum", "webp"]]) },
  { naam: "Hof van Twente", kernen: kernen("Hof van Twente", [["Bentelo", "webp"], ["Delden", "webp"], ["Diepenheim", "webp"], ["Goor", "webp"], ["Hengevelde", "webp"], ["Markelo", "webp"]]) },
  { naam: "Losser", kernen: kernen("Losser", [["Beuningen", "webp"], ["De Lutte", "webp"], ["Glane", "webp"], ["Losser", "webp"], ["Overdinkel", "webp"]]) },
  { naam: "Oldenzaal", kernen: kernen("Oldenzaal", [["Oldenzaal", "webp"]]) },
  { naam: "Rijssen-Holten", kernen: kernen("Rijssen-Holten", [["Beuseberg", "webp"], ["Dijkerhoek", "webp"], ["Espelo", "webp"], ["Holten", "webp"], ["Ligtenberg", "webp"], ["Neerdorp", "webp"], ["Rijssen", "webp"]]) },
  { naam: "Tubbergen", kernen: kernen("Tubbergen", [["Albergen", "webp"], ["Fleringen", "webp"], ["Geesteren", "webp"], ["Harbrinkhoek", "webp"], ["Hezingen", "webp"], ["Langeveen", "webp"], ["Manderveen", "webp"], ["Mariaparochie", "webp"], ["Reutum", "webp"], ["Tubbergen", "webp"], ["Vasse", "webp"]]) },
  { naam: "Twenterand", kernen: kernen("Twenterand", [["Bruinehaar", "webp"], ["De Pollen", "webp"], ["Den Ham", "webp"], ["Geerdijk", "webp"], "Twenterand", ["Vriezenveen", "webp"], ["Vroomshoop", "webp"], ["Weitemanslanden", "webp"], ["Westerhaar-Vriezenveensewijk", "webp"], ["Westerhoeven", "webp"]]) },
  { naam: "Wierden", kernen: kernen("Wierden", [["Enter", "webp"], ["Hoge Hexel", "webp"], ["IJpelo", "webp"], ["Notter", "webp"], ["Rectum", "webp"], ["Wierden", "webp"], ["Zuna", "webp"]]) },
];
