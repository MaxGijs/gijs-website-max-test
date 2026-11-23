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
  /** Lokaal artikel: alleen als kaart op de eigen regiopagina, niet op /kennis. */
  alleenRegio?: boolean;
  afbeelding: { path: string; alt: string };
};

export const KENNIS_ARTIKELEN: KennisArtikel[] = [
  {
    slug: "zonnepanelen-rendabel-zonder-salderen",
    titel: "Is zonnepanelen kopen nog wel rendabel zonder salderingsregeling?",
    seoTitel: "Zonnepanelen zonder salderen: nog rendabel? | Gijs",
    beschrijving: "Salderen stopt op 1 januari 2027. Verdien je zonnepanelen dan nog terug? Lees wat ze kosten, wat ze opleveren en wanneer ze bij je woning passen.",
    intro: "De zonnepaneelmarkt krimpt en salderen stopt op 1 januari 2027. Verdien je zonnepanelen dan nog terug, en wanneer past het bij jouw woning?",
    gepubliceerd: "2026-11-23",
    afbeelding: { path: "/images/kennis/zonnepanelen/zonnepanelen-blauwe-lucht.jpg", alt: "Zonnepanelen op een dak tegen een blauwe lucht met wolken" },
  },
  {
    slug: "cv-ketel-vervangen-2029-gas-of-warmtepomp",
    titel: "Cv-ketel vervangen vóór 2029: kies je nog voor gas of een warmtepomp?",
    seoTitel: "Cv-ketel vervangen vóór 2029: gas of warmtepomp? | Gijs",
    beschrijving: "Vanaf 2029 wil het kabinet bij vervanging van de cv-ketel een slimme hybride warmtepomp als standaard. Lees wat er verandert en wat je nu kunt doen.",
    intro: "Het kabinet wil vanaf 2029 bij vervanging van de cv-ketel een slimme hybride warmtepomp als standaard. Wat betekent dat voor jouw woning en wat kun je nu het beste doen?",
    gepubliceerd: "2026-11-20",
    afbeelding: { path: "/images/kennis/cv-ketel/slimme-thermostaat.jpg", alt: "Een hand bedient een slimme thermostaat aan de muur" },
  },
  {
    slug: "warmtenet-kerschoten-verduurzamen-apeldoorn",
    titel: "Warmtenet Kerschoten onzeker: waar begin je met verduurzamen in Apeldoorn?",
    seoTitel: "Warmtenet Kerschoten onzeker: verduurzamen in Apeldoorn | Gijs",
    beschrijving: "Het warmtenet in Kerschoten gaat niet door. Moet je wachten met verduurzamen in Apeldoorn? Lees waar je begint en waar je op let.",
    intro: "Het warmtenet in Kerschoten gaat voorlopig niet door. Moet je daarom wachten met het verduurzamen van je woning in Apeldoorn?",
    gepubliceerd: "2026-11-19",
    alleenRegio: true,
    afbeelding: { path: "/images/maatregelen/dakisolatie/praktijk/tijdens-het-werk.jpg", alt: "Een Gijs-vakspecialist isoleert het dak van een woning" },
  },
  {
    slug: "salderen-stopt-2027-thuisbatterij",
    titel: "Salderen stopt in 2027, dus een thuisbatterij kopen? Of toch niet?",
    seoTitel: "Salderen stopt in 2027: thuisbatterij kopen? | Gijs",
    beschrijving: "Salderen stopt op 1 januari 2027. Is een thuisbatterij dan slim, of bespaar je meer met een andere maatregel? Lees waar je op let.",
    intro: "Salderen stopt op 1 januari 2027 en steeds meer mensen overwegen een thuisbatterij. Maar levert diezelfde investering elders misschien meer op?",
    // LET OP: zet dit op de echte livegangdatum als het artikel later dan vandaag online gaat.
    gepubliceerd: "2026-11-18",
    afbeelding: { path: "/images/maatregelen/thuisbatterij/thuisbatterij-hero-v2.png", alt: "Een Gijs-installateur sluit een thuisbatterij aan" },
  },
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
