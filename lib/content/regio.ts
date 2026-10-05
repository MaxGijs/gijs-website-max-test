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
// Pilot: alleen gemeente Borne en plaats Hertme staan aan.
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
  afbeelding: string;
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
  borne: { indexeerbaar: true, plaatsen: { hertme: { indexeerbaar: false }, zenderen: { indexeerbaar: false } } },
  hengelo: { indexeerbaar: true, plaatsen: {} },
  enschede: { indexeerbaar: true, plaatsen: {} },
  "hof-van-twente": { indexeerbaar: true, plaatsen: { bentelo: { indexeerbaar: false }, delden: { indexeerbaar: false }, diepenheim: { indexeerbaar: false }, goor: { indexeerbaar: false }, hengevelde: { indexeerbaar: false }, markelo: { indexeerbaar: false } } },
};

// Geverifieerde officiële subsidiepagina's per gemeente (zelf nagekeken,
// geen bedragen of voorwaarden overgenomen — zie RegioGemeente.officieleSubsidieUrl).
const OFFICIELE_SUBSIDIE_URL: Record<string, string> = {
  borne: "https://www.borne.nl/nip-isolatieactie",
  enschede: "https://www.enschede.nl/subsidie-voor-isolatie",
  hengelo: "https://www.hengelo.nl/duurzaam/hulp-bij-verduurzamen/subsidies.html",
  oldenzaal: "https://www.oldenzaal.nl/subsidie-isolatie-eigen-woning",
  "hof-van-twente": "https://www.hofvantwente.nl/direct-regelen/wonen-en-leven/duurzaamheid/subsidies-verduurzaming-woning/",
};

// Alle gemeenten in de Gemeenteborden-set liggen in Twente, provincie Overijssel.
export const REGIO_GEMEENTEN: RegioGemeente[] = LOKALE_SEO_GEMEENTEN.map(g => {
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

export const REGIO_PLAATSEN: RegioPlaats[] = LOKALE_SEO_GEMEENTEN.flatMap(g => {
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
