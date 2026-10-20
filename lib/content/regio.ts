// Datamodel voor de lokale SEO-structuur: Nederland → provincie → gemeente
// → plaats. Eén template per niveau (app/regio/...), geen losse page.tsx per
// plaats. Namen, gemeente-plaatsrelaties en plaatsnaamborden komen uit de
// aangeleverde "Gemeenteborden"-set (lib/content/lokale-seo.ts,
// public/images/regio/gemeenteborden/<Gemeente>/<Kern>.png). Er wordt hier niets aan
// toegevoegd dat niet in die set staat.
//
// Twee vlaggen per gemeente en plaats:
// - gepubliceerd: de pagina bestaat en wordt gelinkt. Zet dit alleen aan als
//   de inhoud gecontroleerd is (naam, relatie, afbeelding).
// - indexeerbaar: de pagina mag in zoekmachines en de sitemap. Alleen voor
//   complete, geverifieerde pagina's (geen doorway-pagina's). Werkt bovenop
//   SEO_INDEXABLE in lib/seo.ts: previews blijven altijd noindex.
//
// Unieke, plaatsgerichte inhoud (Berkum, Borne, Hengelo, Enschede) staat los hiervan in
// lib/content/regio-lokaal.ts; de templates tonen die als hij er is, anders de generieke opzet.
import { LOKALE_SEO_GEMEENTEN } from "./lokale-seo";

export type RegioProvincie = { slug: string; naam: string; gepubliceerd: boolean; indexeerbaar: boolean };
export type RegioGemeente = {
  slug: string;
  naam: string;
  provincie: string;
  plaatsen: string[];
  // Alleen invullen met een geverifieerde, officiële link van de gemeente
  // zelf (bijv. www.<gemeente>.nl/subsidie...). Zonder deze link toont de
  // gemeentelijke-subsidiesectie geen knop — Gijs zoekt gemeentelijke
  // subsidies niet voor de klant uit en verzint geen gemeentelink.
  officieleSubsidieUrl?: string;
  gepubliceerd: boolean;
  indexeerbaar: boolean;
};
export type RegioPlaats = {
  slug: string;
  naam: string;
  gemeente: string;
  provincie: string;
  // Plaatsnaambord uit de Gemeenteborden-set; ontbreekt voor plaatsen buiten Twente (bijv. Berkum).
  afbeelding?: string;
  gepubliceerd: boolean;
  indexeerbaar: boolean;
};

export const slugify = (naam: string) =>
  naam.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const REGIO_PROVINCIES: RegioProvincie[] = [
  { slug: "overijssel", naam: "Overijssel", gepubliceerd: true, indexeerbaar: true },
];

// Welke gemeenten en plaatsen live staan. Sleutel = gemeente-slug.
// Een plaats met dezelfde naam als de gemeente (bijv. Borne in Borne) krijgt
// geen eigen plaatspagina: die valt samen met de gemeentepagina.
const PUBLICATIE: Record<string, { indexeerbaar: boolean; plaatsen: Record<string, { indexeerbaar: boolean }> }> = {
  // Plaatsen staan bewust op indexeerbaar: false — dunne pagina's (noindex,
  // follow via createMetadata's robots.follow:true), totdat ze net als de
  // gemeentepagina's eigen, unieke content krijgen. Ze blijven wel
  // gepubliceerd (bestaan en worden gelinkt), alleen niet in de sitemap
  // (zie REGIO_INDEXEERBARE_PADEN hieronder, die op indexeerbaar filtert).
  // Hertme en Zenderen zijn officieel dorpen (geen buurtschap), dus krijgen een eigen,
  // indexeerbare pagina — net als de rest van deze lijst, op verzoek van Max na het leggen van de
  // aangeleverde plaatsenset naast https://nl.wikipedia.org/wiki/Lijst_van_steden_en_dorpen_in_Overijssel
  // (2026-10-19). Pure buurtschappen (geen eigen voorzieningen/dorpsstatus) blijven indexeerbaar: false.
  borne: { indexeerbaar: true, plaatsen: { hertme: { indexeerbaar: true }, zenderen: { indexeerbaar: true } } },
  // Beckum: enige kerkdorp van de gemeente, bronverifieerd herkenningspunt ('t Proggiehoes).
  hengelo: { indexeerbaar: true, plaatsen: { beckum: { indexeerbaar: true } } },
  // Boekelo, Glanerbrug, Lonneker, Usselo: dorpen met elk een bronverifieerd rijksmonument als
  // herkenningspunt. Twekkelo: buurtschap, maar met voldoende unieke, bronverifieerde content
  // (Johanneskerk, drie essen/zoutwinning) om toch een eigen pagina te verdienen.
  enschede: { indexeerbaar: true, plaatsen: { boekelo: { indexeerbaar: true }, glanerbrug: { indexeerbaar: true }, lonneker: { indexeerbaar: true }, usselo: { indexeerbaar: true }, twekkelo: { indexeerbaar: true } } },
  // Aadorp en Bornerbroek zijn dorpen; Harbrinkhoek-Mariaparochie is een dorp dat de gemeentegrens
  // met Tubbergen overschrijdt. Azelo, Bavinkel, Deldenerbroek, Tusveld en Weitemanslanden zijn
  // buurtschappen zonder eigen voorzieningen en blijven daarom indexeerbaar: false.
  almelo: { indexeerbaar: true, plaatsen: { aadorp: { indexeerbaar: true }, bornerbroek: { indexeerbaar: true }, "harbrinkhoek-mariaparochie": { indexeerbaar: true }, azelo: { indexeerbaar: false }, bavinkel: { indexeerbaar: false }, deldenerbroek: { indexeerbaar: false }, tusveld: { indexeerbaar: false }, weitemanslanden: { indexeerbaar: false } } },
  oldenzaal: { indexeerbaar: true, plaatsen: {} },
  "hof-van-twente": { indexeerbaar: true, plaatsen: { bentelo: { indexeerbaar: true }, delden: { indexeerbaar: true }, diepenheim: { indexeerbaar: true }, goor: { indexeerbaar: true }, hengevelde: { indexeerbaar: true }, markelo: { indexeerbaar: true } } },
  // Pilot B uit de Deep Research-uitbreiding (2026-10-19): gemeentenaam en zoekplaats lopen hier
  // sterk uiteen, dus Rijssen en Holten, Nijverdal en Vriezenveen/Vroomshoop krijgen eigen pagina's.
  // Beuseberg, Dijkerhoek, Espelo, Ligtenberg en Neerdorp zijn buurtschappen, geen dorpen.
  "rijssen-holten": { indexeerbaar: true, plaatsen: { rijssen: { indexeerbaar: true }, holten: { indexeerbaar: true }, beuseberg: { indexeerbaar: false }, dijkerhoek: { indexeerbaar: false }, espelo: { indexeerbaar: false }, ligtenberg: { indexeerbaar: false }, neerdorp: { indexeerbaar: false } } },
  // Daarle, Daarlerveen en Haarle zijn net als Nijverdal officieel dorpen.
  hellendoorn: { indexeerbaar: true, plaatsen: { nijverdal: { indexeerbaar: true }, daarle: { indexeerbaar: true }, daarlerveen: { indexeerbaar: true }, haarle: { indexeerbaar: true } } },
  // Den Ham, De Pollen, Geerdijk en Westerhaar-Vriezenveensewijk zijn net als Vriezenveen en
  // Vroomshoop officieel dorpen. "Westerhoeven" bleek bij gericht onderzoek (2026-10-19, een
  // gemeentelijke nieuwsbrief) geen officiële kern te zijn maar een verspreide-huizengebied
  // ("Verspreide huizen De Westerhoeve"); de Wikipedia-bronlijst had dit dus fout. Terug op
  // indexeerbaar: false, net als Bruinehaar en Weitemanslanden (buurtschappen).
  twenterand: { indexeerbaar: true, plaatsen: { vriezenveen: { indexeerbaar: true }, vroomshoop: { indexeerbaar: true }, "den-ham": { indexeerbaar: true }, geerdijk: { indexeerbaar: true }, "de-pollen": { indexeerbaar: true }, "westerhaar-vriezenveensewijk": { indexeerbaar: true }, westerhoeven: { indexeerbaar: false }, bruinehaar: { indexeerbaar: false }, weitemanslanden: { indexeerbaar: false } } },
  // Zwolle is alleen een eenvoudige bovenliggende overzichtspagina (noindex) voor de wijk Berkum,
  // waar Gijs met Berkum Energieneutraal samenwerkt. Geen SEO-pagina voor heel Zwolle.
  zwolle: { indexeerbaar: false, plaatsen: { berkum: { indexeerbaar: true } } },
};

// Gemeenten en wijken buiten de Gemeenteborden-set (die alleen Twente dekt). Bewust alleen de
// plaatsen die een eigen pagina hebben: een volledige kernenlijst van deze gemeenten staat niet in
// de aangeleverde data en wordt niet verzonnen.
const EXTRA_GEMEENTEN: { naam: string; kernen: { naam: string; bord?: string }[] }[] = [
  { naam: "Zwolle", kernen: [{ naam: "Zwolle", bord: "/images/regio/gemeenteborden/Zwolle/Zwolle.webp" }, { naam: "Berkum" }] },
  // Overige Overijsselse gemeenten, nog zonder eigen pagina (geen PUBLICATIE-entry, dus
  // gepubliceerd: false) — tonen op de provinciepagina als "binnenkort", zodat zichtbaar is dat
  // Gijs heel Overijssel bedient. De 432-plaatsenrollout (apart Deep Research-rapport) komt later.
  { naam: "Dalfsen", kernen: [] },
  { naam: "Deventer", kernen: [] },
  { naam: "Hardenberg", kernen: [] },
  { naam: "Kampen", kernen: [] },
  { naam: "Olst-Wijhe", kernen: [] },
  { naam: "Ommen", kernen: [] },
  { naam: "Raalte", kernen: [] },
  { naam: "Staphorst", kernen: [] },
  { naam: "Steenwijkerland", kernen: [] },
  { naam: "Zwartewaterland", kernen: [] },
];
const ALLE_BRONGEMEENTEN: { naam: string; kernen: { naam: string; bord?: string }[] }[] = [...LOKALE_SEO_GEMEENTEN, ...EXTRA_GEMEENTEN];

// Geverifieerde officiële subsidiepagina's per gemeente (zelf nagekeken,
// geen bedragen of voorwaarden overgenomen — zie RegioGemeente.officieleSubsidieUrl).
const OFFICIELE_SUBSIDIE_URL: Record<string, string> = {
  borne: "https://www.borne.nl/nip-isolatieactie",
  enschede: "https://www.enschede.nl/subsidie-voor-isolatie",
  hengelo: "https://www.hengelo.nl/duurzaam/hulp-bij-verduurzamen/subsidies.html",
  oldenzaal: "https://www.oldenzaal.nl/subsidie-isolatie-eigen-woning",
  "hof-van-twente": "https://www.hofvantwente.nl/direct-regelen/wonen-en-leven/duurzaamheid/subsidies-verduurzaming-woning/",
  "rijssen-holten": "https://www.rijssen-holten.nl/duurzaam/subsidie-laten-isoleren-door-een-bedrijf/",
  hellendoorn: "https://www.hellendoorn.nl/direct-regelen/belastingen-en-subsidies/subsidies-2/subsidie-woningisolatie/",
  twenterand: "https://www.twenterand.nl/isoleren?origin=%2Fduurzaamheidssubsidie",
};

// Alle gemeenten in de Gemeenteborden-set liggen in Twente; Zwolle ligt ook in Overijssel.
export const REGIO_GEMEENTEN: RegioGemeente[] = ALLE_BRONGEMEENTEN.map(g => {
  const slug = slugify(g.naam);
  const pub = PUBLICATIE[slug];
  return {
    slug,
    naam: g.naam,
    provincie: "overijssel",
    plaatsen: g.kernen.map(k => slugify(k.naam)),
    officieleSubsidieUrl: OFFICIELE_SUBSIDIE_URL[slug],
    gepubliceerd: !!pub,
    indexeerbaar: !!pub?.indexeerbaar,
  };
});

export const REGIO_PLAATSEN: RegioPlaats[] = ALLE_BRONGEMEENTEN.flatMap(g => {
  const gemeente = slugify(g.naam);
  return g.kernen.map(k => {
    const slug = slugify(k.naam);
    const pub = PUBLICATIE[gemeente]?.plaatsen[slug];
    return { slug, naam: k.naam, gemeente, provincie: "overijssel", afbeelding: k.bord, gepubliceerd: !!pub, indexeerbaar: !!pub?.indexeerbaar };
  });
});

export const getProvincie = (slug: string) => REGIO_PROVINCIES.find(p => p.slug === slug && p.gepubliceerd);
export const getGemeente = (provincie: string, slug: string) =>
  REGIO_GEMEENTEN.find(g => g.provincie === provincie && g.slug === slug && g.gepubliceerd);
export const getPlaats = (provincie: string, gemeente: string, slug: string) =>
  REGIO_PLAATSEN.find(p => p.provincie === provincie && p.gemeente === gemeente && p.slug === slug && p.gepubliceerd);
export const gemeentenVan = (provincie: string) => REGIO_GEMEENTEN.filter(g => g.provincie === provincie && g.gepubliceerd);
// Ongefilterd (incl. nog niet gepubliceerde gemeenten): voor de kaartnavigatie,
// die ook "binnenkort"-gemeenten toont zodat zichtbaar is dat de regio groter
// is dan wat nu al klikbaar is.
export const alleGemeentenVan = (provincie: string) => REGIO_GEMEENTEN.filter(g => g.provincie === provincie);
export const plaatsenVan = (provincie: string, gemeente: string) =>
  REGIO_PLAATSEN.filter(p => p.provincie === provincie && p.gemeente === gemeente);

export const regioPad = (...delen: string[]) => ["/regio", ...delen].join("/");

export const REGIO_INDEXEERBARE_PADEN = [
  "/regio",
  ...REGIO_PROVINCIES.filter(p => p.gepubliceerd && p.indexeerbaar).map(p => regioPad(p.slug)),
  ...REGIO_GEMEENTEN.filter(g => g.gepubliceerd && g.indexeerbaar).map(g => regioPad(g.provincie, g.slug)),
  ...REGIO_PLAATSEN.filter(p => p.gepubliceerd && p.indexeerbaar).map(p => regioPad(p.provincie, p.gemeente, p.slug)),
];
