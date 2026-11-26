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
  afbeelding: { path: string; alt: string; onderschrift?: string };
};

export const KENNIS_ARTIKELEN: KennisArtikel[] = [
  {
    slug: "dynamische-nettarieven-2029",
    titel: "Wat betekenen dynamische nettarieven vanaf 2029 voor jou?",
    seoTitel: "Wat betekenen dynamische nettarieven vanaf 2029 voor jou?",
    beschrijving: "Wat veranderen dynamische nettarieven vanaf 2029 aan jouw energierekening? Ontdek wat je kunt verwachten en hoe je hierop kunt inspelen.",
    intro: "Vanaf 2029 kan het moment waarop je stroom gebruikt invloed hebben op je energierekening. Wat verandert er en hoe speel je hierop in?",
    gepubliceerd: "2026-11-26",
    afbeelding: {
      path: "/images/kennis/nettarieven/pexels-bryandijkh-20219148.jpg",
      alt: "Bakstenen woning met verlichte ramen in de avondschemering",
      onderschrift: "Juist 's avonds, als veel huishoudens tegelijk stroom gebruiken, is het elektriciteitsnet het drukst.",
    },
  },
  {
    slug: "warmtepomp-rijtjeshuis-weinig-ruimte",
    titel: "Warmtepomp in een rijtjeshuis: kan dat als je weinig ruimte hebt?",
    seoTitel: "Warmtepomp rijtjeshuis: mogelijkheden bij weinig ruimte | Gijs",
    beschrijving: "Weinig ruimte voor een warmtepomp in een rijtjeshuis? Ontdek welke plaatsingsmogelijkheden er zijn en hoe je geluidsoverlast voorkomt.",
    intro: "Weinig tuin en buren op korte afstand? Ontdek waar je een warmtepomp kunt plaatsen bij een rijtjeshuis en hoe je geluidsoverlast voorkomt.",
    gepubliceerd: "2026-11-26",
    afbeelding: {
      path: "/images/kennis/warmtepomp-rijtjeshuis/rijtjeswoningen-laan.jpg",
      alt: "Laan met bomen en Nederlandse rijtjeswoningen van baksteen op de achtergrond",
      onderschrift: "Bij een rijtjeshuis zijn de plaatsingsmogelijkheden voor een warmtepomp beperkter, maar er zijn meer opties dan je misschien denkt.",
    },
  },
  {
    slug: "waarom-blijft-mijn-huis-koud",
    titel: "Waarom blijft je huis koud en wat kun je eraan doen?",
    seoTitel: "Waarom blijft mijn huis koud? Dit kun je doen | Gijs",
    beschrijving: "Blijft je huis koud ondanks de verwarming? Ontdek hoe je comfortabeler kunt wonen en tegelijkertijd kunt besparen op je energierekening.",
    intro: "Zit je 's avonds met een dekentje op de bank terwijl de verwarming aanstaat? Ontdek waarom je huis koud blijft en wat je eraan kunt doen.",
    gepubliceerd: "2026-11-26",
    afbeelding: {
      path: "/images/kennis/cv-ketel/radiator-bakstenen-muur.jpg",
      alt: "Witte radiator aan een bakstenen muur in een woning",
      onderschrift: "Een goed werkende radiator is niet genoeg als de warmte via slecht geïsoleerde muren, dak of vloer verloren gaat.",
    },
  },
  {
    slug: "vochtige-kruipruimte-isoleren",
    titel: "Kun je een vochtige kruipruimte zomaar isoleren?",
    seoTitel: "Vochtige kruipruimte isoleren: waar je op moet letten | Gijs",
    beschrijving: "Een vochtige kruipruimte is vaak geen belemmering voor vloerisolatie. Ontdek aan de hand van 6 stappen waar je op moet letten voordat je begint.",
    intro: "Een vochtige kruipruimte hoeft je vloerisolatie niet in de weg te staan. Lees aan de hand van zes stappen waar je op moet letten voordat je begint.",
    gepubliceerd: "2026-11-26",
    afbeelding: {
      path: "/images/kennis/kruipruimte/kruipruimte-kruipluik-open.webp",
      alt: "Geopend kruipluik in een woonkamer met daarbinnen een kruipruimte met grind en leidingen",
      onderschrift: "Een geopend kruipluik geeft direct zicht op de staat van je kruipruimte.",
    },
  },
  {
    slug: "uf-schuim-spouwmuurisolatie-risicos-alternatieven",
    titel: "UF-schuim bij spouwmuurisolatie: wat zijn de risico's en alternatieven?",
    seoTitel: "UF-schuim in de spouwmuur: risico's en alternatieven | Gijs",
    beschrijving: "De GGD raadt UF-schuim af en de subsidie is gestopt. Lees wat de risico's zijn, welke alternatieven er zijn en wat je met bestaande isolatie doet.",
    intro: "De GGD raadt UF-schuim voor spouwmuurisolatie af. Wat zijn de risico's, welke alternatieven zijn er en wat doe je met bestaande isolatie?",
    gepubliceerd: "2026-11-25",
    afbeelding: { path: "/images/kennis/spouwmuur/bakstenen-woningen-straat.jpg", alt: "Bakstenen woningen in een Nederlandse straat met vlaggen aan de gevel", onderschrift: "Veel Nederlandse bakstenen woningen zoals deze hebben een spouwmuur." },
  },
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
