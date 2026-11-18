// Kennisartikelen onder /kennis/[slug]. Eén plek voor de gegevens die overzicht, metadata,
// sitemap en structured data delen; de artikeltekst zelf staat per artikel in components/kennis/.
//
// Datums: uitsluitend echte datums (JJJJ-MM-DD). `gepubliceerd` = de dag dat het artikel live
// gaat; `gewijzigd` alleen invullen bij een inhoudelijke wijziging ná publicatie, nooit
// automatisch of "voor de zekerheid".
export type KennisArtikel = {
  slug: string;
  titel: string;          // H1, letterlijk zoals de auteur hem schreef
  seoTitel: string;
  beschrijving: string;   // metabeschrijving
  intro: string;          // korte tekst voor de kaart op /kennis
  gepubliceerd: string;
  gewijzigd?: string;
  afbeelding: { path: string; alt: string };
};

export const KENNIS_ARTIKELEN: KennisArtikel[] = [
  {
    slug: "slimme-warmtepomp-subsidie-2027",
    titel: "Slimme warmtepomp subsidie vanaf 2027: wat verandert er?",
    seoTitel: "Slimme warmtepomp subsidie 2027: wat verandert er? | Gijs",
    beschrijving: "Vanaf 2027 mogelijk €200 extra subsidie voor slimme warmtepompen. Ontdek wat er verandert en welke warmtepomp bij jouw woning past.",
    intro: "Vanaf 2027 wil de overheid slimme warmtepompen extra stimuleren met een subsidiebonus van €200. Wat maakt een warmtepomp slim en wat betekent dit voor jouw woning?",
    // LET OP: zet dit op de echte livegangdatum als het artikel later dan vandaag online gaat.
    gepubliceerd: "2026-11-18",
    afbeelding: { path: "/images/maatregelen/warmtepomp/warmtepomp-hero.png", alt: "Een installateur van Gijs plaatst een warmtepomp tegen de gevel van een woning" },
  },
];

export const kennisArtikelPad = (slug: string) => "/kennis/" + slug;
/** Id voor de foto- en titelovergang (lib/overgang.ts) van kaart op /kennis naar artikel. */
export const artikelOvergangId = (slug: string) => "artikel-" + slug;

export function formatteerDatum(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}
