// Eén bron voor hoe een maatregel heet en wordt ingeleid, gebruikt op de
// landingspagina (3D-woningreis) en in de woningscan (stap "Wat wil je
// verbeteren?"), zodat dezelfde maatregel overal dezelfde naam, titel en
// uitleg heeft. Opbouw volgens de UX-afspraak:
//   MAATREGELNAAM (letterlijk, voor bezoeker én zoekmachine)
//   creatieve, begrijpelijke titel
//   korte uitleg in gewone taal
// Alle teksten komen uit bestaande Gijs-content (maatregelpagina's en de
// eerdere homepage-hoofdstukken); er zijn geen nieuwe claims toegevoegd.

export type MaatregelTitel = {
  /** Maatregelnaam, altijd letterlijk zichtbaar. */
  naam: string;
  /** Creatieve titel, komt na de naam. */
  titel: string;
  /** Korte uitleg in gewone taal. */
  uitleg: string;
  /** Slug van de maatregelpagina (/maatregelen/<slug>). */
  slug: string;
  /** Linktekst naar de maatregelpagina. */
  cta: string;
};

export const MAATREGEL_TITELS = {
  kozijnen: {
    naam: "Kozijnen",
    titel: "Kou en tocht blijven buiten.",
    uitleg: "Goede kozijnen houden kou en tocht beter buiten. Zo voelt het prettiger als je bij het raam zit.",
    slug: "kozijnen",
    cta: "Bekijk kozijnen",
  },
  isolatieglas: {
    naam: "Isolatieglas",
    titel: "Een warme deken voor je ramen.",
    uitleg: "Isolatieglas beperkt warmteverlies via het raam en voelt aan de binnenkant warmer aan.",
    slug: "isolatieglas",
    cta: "Bekijk isolatieglas",
  },
  dakisolatie: {
    naam: "Dakisolatie",
    titel: "Een warme muts voor je woning.",
    uitleg: "Onder het dak komt een laag isolatie. Die helpt om de warmte binnen te houden, zodat je minder hoeft te stoken.",
    slug: "dakisolatie",
    cta: "Bekijk dakisolatie",
  },
  zonnepanelen: {
    naam: "Zonnepanelen",
    titel: "Je eigen stroomfabriek op het dak.",
    uitleg: "Zonnepanelen vangen zonlicht op en maken er elektriciteit van. Die kun je in huis gebruiken, bijvoorbeeld voor je wasmachine.",
    slug: "zonnepanelen",
    cta: "Bekijk zonnepanelen",
  },
  spouwmuurisolatie: {
    naam: "Spouwmuurisolatie",
    titel: "Een extra jas in je muur.",
    uitleg: "Veel buitenmuren bestaan uit twee muren: de buitenmuur en de binnenmuur. Daartussen zit een ruimte, de spouw. Bij spouwmuurisolatie wordt die ruimte gevuld met isolatiemateriaal, zodat de warmte beter binnen blijft.",
    slug: "spouwmuurisolatie",
    cta: "Bekijk spouwmuurisolatie",
  },
  vloerisolatie: {
    naam: "Vloerisolatie",
    titel: "Warme sokken voor je vloer.",
    uitleg: "Vloerisolatie wordt vanuit de kruipruimte tegen de onderkant van de vloer aangebracht. Die laag helpt de warmte in de kamer te houden, zodat de vloer minder koud aanvoelt.",
    slug: "vloerisolatie",
    cta: "Bekijk vloerisolatie",
  },
  warmtepomp: {
    naam: "Warmtepomp",
    titel: "Warmte van buiten, voor binnen.",
    uitleg: "Een warmtepomp haalt warmte uit de buitenlucht. Met elektriciteit maakt hij die warmte bruikbaar om je woning te verwarmen.",
    slug: "warmtepomp",
    cta: "Bekijk warmtepompen",
  },
  thuisbatterij: {
    naam: "Thuisbatterij",
    titel: "Een voorraadkast voor je eigen stroom.",
    uitleg: "Een thuisbatterij bewaart elektriciteit, bijvoorbeeld zelf opgewekte zonnestroom die je niet meteen gebruikt. Die opgeslagen stroom kun je later alsnog in je woning gebruiken.",
    slug: "thuisbatterij",
    cta: "Bekijk thuisbatterij",
  },
  vloerverwarming: {
    naam: "Vloerverwarming",
    titel: "Vloerverwarming verwarmt je huis vanaf de vloer.",
    uitleg: "Bij vloerverwarming stroomt warm water door leidingen in de vloer. De vloer geeft die warmte gelijkmatig af aan de ruimte, in plaats van via radiatoren.",
    slug: "vloerverwarming",
    cta: "Bekijk vloerverwarming",
  },
} satisfies Record<string, MaatregelTitel>;

// Maatregel-id's uit de woningscan (lib/measures.ts) → titelset. "Glas en
// kozijnen" is in de scan één keuze; die krijgt de glastitel met beide
// maatregelpagina's als vervolg.
export const SCAN_TITELS: Record<string, MaatregelTitel> = {
  zonnepanelen: MAATREGEL_TITELS.zonnepanelen,
  warmtepomp: MAATREGEL_TITELS.warmtepomp,
  dakisolatie: MAATREGEL_TITELS.dakisolatie,
  gevelisolatie: MAATREGEL_TITELS.spouwmuurisolatie,
  vloerisolatie: MAATREGEL_TITELS.vloerisolatie,
  "glas-kozijnen": {
    naam: "Isolatieglas en kozijnen",
    titel: MAATREGEL_TITELS.isolatieglas.titel,
    uitleg: `${MAATREGEL_TITELS.isolatieglas.uitleg} ${MAATREGEL_TITELS.kozijnen.uitleg}`,
    slug: "isolatieglas",
    cta: "Bekijk isolatieglas",
  },
  vloerverwarming: MAATREGEL_TITELS.vloerverwarming,
  thuisbatterij: MAATREGEL_TITELS.thuisbatterij,
};
