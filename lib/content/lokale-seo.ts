// Dataset voor lokale SEO (Twente), aangeleverd als "Gemeenteborden"-
// beeldset (zie public/gemeenteborden/<Gemeente>/<Kern>.png — simpele,
// zelf ontworpen plaatsnaambord-graphics, geen foto's, dus zonder
// auteursrechtelijk risico).
//
// Brondata voor de regiopagina's (app/regio/...). Welke gemeenten en
// plaatsen daadwerkelijk een pagina krijgen, staat in lib/content/regio.ts
// (vlaggen gepubliceerd/indexeerbaar); dit bestand blijft de ruwe set.
//
// Bekende kanttekening in de brondata: "Dem Ham" (gemeente Twenterand)
// is vermoedelijk een schrijffout voor "Den Ham" — hier ongewijzigd
// overgenomen zoals aangeleverd, dus controleren vóór gebruik.
export type LokaleSeoKern = { naam: string; bord: string };
export type LokaleSeoGemeente = { naam: string; kernen: LokaleSeoKern[] };

const bord = (gemeente: string, kern: string) => `/gemeenteborden/${gemeente}/${kern}.png`;
const kernen = (gemeente: string, namen: string[]): LokaleSeoKern[] =>
  namen.map(naam => ({ naam, bord: bord(gemeente, naam) }));

export const LOKALE_SEO_GEMEENTEN: LokaleSeoGemeente[] = [
  { naam: "Almelo", kernen: kernen("Almelo", ["Aadorp", "Almelo", "Azelo", "Bavinkel", "Bornerbroek", "Deldenerbroek", "Harbrinkhoek-Mariaparochie", "Tusveld", "Weitemanslanden"]) },
  { naam: "Borne", kernen: kernen("Borne", ["Borne", "Hertme", "Zenderen"]) },
  { naam: "Dinkelland", kernen: kernen("Dinkelland", ["'t Loo", "Beerkdorp", "Berghum", "Breklenkamp", "Denekamp", "Deurningen", "Dulder", "Gammelke", "Het Stift", "Lattrop", "Lemselo", "Nijstad", "Noordijk", "Nutter", "Ootmarsum", "Oud Ootmarsum", "Rossum", "Saasveld", "Tilligte", "Volthe", "Weerselo"]) },
  { naam: "Enschede", kernen: kernen("Enschede", ["Enschede"]) },
  { naam: "Haaksbergen", kernen: kernen("Haaksbergen", ["Buurse", "Haaksbergen", "Sint Isodorushoeve"]) },
  { naam: "Hellendoorn", kernen: kernen("Hellendoorn", ["Daarle", "Daarlerveen", "Haarle", "Hellendoorn", "Nijverdal"]) },
  { naam: "Hengelo", kernen: kernen("Hengelo", ["Hengelo"]) },
  { naam: "Hof van Twente", kernen: kernen("Hof van Twente", ["Bentelo", "Delden", "Diepenheim", "Goor", "Hengevelde", "Markelo"]) },
  { naam: "Losser", kernen: kernen("Losser", ["Beuningen", "De Lutte", "Glane", "Losser", "Overdinkel"]) },
  { naam: "Oldenzaal", kernen: kernen("Oldenzaal", ["Oldenzaal"]) },
  { naam: "Rijssen-Holten", kernen: kernen("Rijssen-Holten", ["Beuseberg", "Dijkerbroek", "Espelo", "Holten", "Lichtenberg", "Neerdorp", "Rijssen"]) },
  { naam: "Tubbergen", kernen: kernen("Tubbergen", ["Albergen", "Fleringen", "Geesteren", "Harbrinkhoek", "Hezingen", "Langeveen", "Manderveen", "Mariaparochie", "Reutum", "Tubbergen", "Vasse"]) },
  { naam: "Twenterand", kernen: kernen("Twenterand", ["Bruinehaar", "De Pollen", "Dem Ham", "Geerdijk", "Twenterand", "Vriezenveen", "Vroomshoop", "Weitemanslanden", "Westerhaar-Vriezenveensewijk", "Westerhoeven"]) },
  { naam: "Wierden", kernen: kernen("Wierden", ["Enter", "Hoge Hexel", "Ijpelo", "Notter", "Rectum", "Wierden", "Zuna"]) },
];
