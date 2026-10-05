import type { Sleutel } from "../stappen";

/*
 * PROTOTYPE (branch animejs-poppenhuis-prototype): Anime.js v4 op het bestaande poppenhuis.
 * Wegwerpcode om te beoordelen of Anime.js past bij de echte interactieve woning.
 * Verwijderen = deze map weg + in app/page.tsx weer HomeCutawayTest renderen.
 *
 * 11 staten: gesloten, open, de 8 maatregelen in dezelfde volgorde als stappen.ts (en de huidige
 * homepage), en een overzicht. De indexen vallen precies samen met STAP/EIND uit stappen.ts, zodat de
 * bestaande camerastanden (route.standen) en hun bogen rond de woning ongewijzigd bruikbaar zijn.
 *
 * Welke bestaande objecten (scene-graph van public/models/woning/gijs-hoekwoning.glb, na
 * prepareHouse + maakRealistisch + maakCutaway) per staat bewegen:
 *
 *  0 Gesloten       niets beweegt; camera = route.standen[0] (zelfde als de huidige homepage).
 *  1 Open woning    groep "Kopgevel" (maquette.ts: Buitengevel_rechts, Spouwisolatie_rechts, Binnenmuur_rechts,
 *                   Raam_rechts_*, Regenpijpen, plintdeel, funderingsbalk) schuift rustig naar buiten (x) en
 *                   vervaagt daarna (eigen gekloonde kopMaterialen). In dit model is de open kant de rechter
 *                   kopgevel, niet de voorgevel.
 *  2 Kozijnen       het grootste raam in de voorgevel (een Raam_voor_*-groep, gekozen door bouwRoute) komt een
 *                   stukje uit de gevel naar voren (z); de kozijndelen (kozijn_links/rechts/boven/onder/stijl,
 *                   alle niet-transparante materialen van die groep) lichten op.
 *  3 Isolatieglas   zelfde raam, schuift terug in de gevel; alleen de "glas"-mesh (transparant materiaal) licht op.
 *                   Camera iets dichterbij dan bij kozijnen (route.standen[STAP.glas]).
 *  4 Dak            Dakpannen, Dakkapel, Schoorsteen_01/02, Dakgoot, Panlatten, Tengellatten en Dakisolatie
 *                   schuiven gelaagd omhoog (offsets uit route.bewegingen). Dakisolatie licht op.
 *  5 Zonnepanelen   dak terug; daarna worden de Zonnepaneel_*-groepen "gelegd": vervagen in en zakken een paar
 *                   centimeter op hun plek. Alle panelen behalve userData.garagePanel (bestaat niet bij de
 *                   hoekwoning); de dakkapelpanelen (Zonnepaneel_dakkapel_*) doen gewoon mee, net als op de homepage.
 *  6 Spouw          Buitengevel_voor en Spouwisolatie_voor schuiven naar voren (z), Binnenmuur_voor blijft staan.
 *  7 Vloer          Vloerisolatie zakt iets de kruipruimte in (y). De vloer zelf omhoog kan niet zonder het
 *                   gemeubileerde interieur (maquette.ts) te verschuiven of erdoorheen te prikken.
 *  8 Warmtepomp     Warmtepomp_DeWarmte (+ Warmtepomp_binnenunit) verschijnt (opacity, kleine schaalbeweging).
 *  9 Thuisbatterij  Thuisbatterij (in de trapkast, zie maquette.ts) verschijnt op dezelfde manier.
 * 10 Overzicht      alles rustig terug naar het open poppenhuis met alle installaties; camera = route.standen[EIND].
 *
 * Installaties verschijnen bij hun eigen hoofdstuk en blijven daarna staan (net als op de huidige homepage).
 * Het bouwdeel in focus krijgt een groene zweem en een annotatielijn; de rest dimt licht (lichtsterkte).
 */

export type FocusSleutel = Sleutel;
/** Zelfde volgorde als MAATREGELEN in stappen.ts. */
export const FOCUS: FocusSleutel[] = ["kozijn", "glas", "dak", "zon", "spouw", "vloer", "pomp", "batterij"];

export type Staat = {
  id: "gesloten" | "open" | Sleutel | "overzicht";
  knop: string;
  /** 0 = kopgevel dicht, 1 = weggeschoven. */
  kop: number;
  /** Raam (kozijn) uit de gevel naar voren. */
  raam: number;
  dak: number;
  spouw: number;
  vloer: number;
  /** Installaties zichtbaar (0..1). */
  zon: number;
  pomp: number;
  batterij: number;
  /** Welk bouwdeel oplicht en een annotatie krijgt. */
  focus: FocusSleutel | null;
  /** Rest van de woning iets gedimd (0..1). */
  dim: number;
};

const S = (id: Staat["id"], knop: string, w: Partial<Omit<Staat, "id" | "knop">>): Staat =>
  ({ id, knop, kop: 1, raam: 0, dak: 0, spouw: 0, vloer: 0, zon: 0, pomp: 0, batterij: 0, focus: null, dim: 0, ...w });
const focus = (sleutel: FocusSleutel) => ({ focus: sleutel, dim: 1 });

export const STATEN: Staat[] = [
  S("gesloten", "Gesloten", { kop: 0 }),
  S("open", "Open woning", {}),
  S("kozijn", "Kozijnen", { raam: 1, ...focus("kozijn") }),
  S("glas", "Isolatieglas", { ...focus("glas") }),
  S("dak", "Dak", { dak: 1, ...focus("dak") }),
  S("zon", "Zonnepanelen", { zon: 1, ...focus("zon") }),
  S("spouw", "Spouw", { zon: 1, spouw: 1, ...focus("spouw") }),
  S("vloer", "Vloer", { zon: 1, vloer: 1, ...focus("vloer") }),
  S("pomp", "Warmtepomp", { zon: 1, pomp: 1, ...focus("pomp") }),
  S("batterij", "Thuisbatterij", { zon: 1, pomp: 1, batterij: 1, ...focus("batterij") }),
  S("overzicht", "Overzicht", { zon: 1, pomp: 1, batterij: 1 }),
];

/** Imperatieve besturing van de scène (scroll en de tijdelijke dev-knoppen gebruiken dezelfde ingang). */
export type Regie = { naar: (staat: number) => void };
