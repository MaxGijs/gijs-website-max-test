import type { Alinea } from "./regio-lokaal";
import type { FAQItem } from "@/components/measures/FAQAccordion";
import { VERHALEN_UTRECHT_FLEVOLAND, PLAATSVERHALEN_FLEVOLAND } from "./gemeente-verhalen-utrecht-flevoland";

// Gemeentepagina's als "lokale verduurzamingspagina" (zie het rapport "Lokale SEO voor Gijs: van
// plaatsnaam-pagina naar lokale verduurzamingspagina"): vaste opbouw, maar per gemeente eigen,
// gecontroleerde inhoud. Borne is de pilot. Een gemeente zonder verhaal hier houdt de bestaande
// pagina uit lib/content/regio-lokaal.ts.

/** Foto met verifieerbare vrije licentie. Bij Wikimedia Commons (BY/BY-SA) is bronvermelding
 *  verplicht: author/license/licenseUrl/sourceUrl dan allemaal invullen. Bij Pexels-foto's is
 *  vermelding niet verplicht; dan volstaat `bron: "pexels"` zonder de overige velden, en toont
 *  de pagina geen credit. Geen van beide: een generieke sfeerfoto, bijvoorbeeld geleverd door Gijs. */
export type ProfielFoto = {
  src: string;
  alt: string;
  bron?: "wikimedia" | "pexels";
  author?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
  /** CSS object-position, als het onderwerp niet in het midden staat. */
  positie?: string;
  /** Toon in de eigen verhouding (bijvoorbeeld een plaatsnaambord) in plaats van bijgesneden. */
  natuurlijk?: boolean;
};

/** Uitgebreide lokale landingspagina (zie LokaalProfielPagina). Alleen feiten met bron.
 *  Alle woninginformatie staat in één sectie: cijfers, gebieden, keuzekaarten en het adviesblok.
 *  Winterswijk vult alles in; de overige pagina's krijgen dit profiel afgeleid uit hun eigen
 *  verhaal (lib/content/lokaal-profiel-adapter.ts), waarbij ontbrekende onderdelen wegblijven. */
export type LokaalProfiel = {
  hero: {
    /** Zonder foto toont de hero alleen tekst. */
    foto?: ProfielFoto;
    intro: string | Alinea[];
    layout?: "breed" | "portret";
    /** Zin vóór de links naar de andere kernen; standaard "Gijs werkt in het dorp {gemeente} en in". */
    kernenZin?: string;
  };
  inzichten?: {
    h2: string;
    alineas: (string | Alinea)[];
    /** Drie woningkenmerken die altijd zichtbaar zijn; de rest zit in de uitklap. */
    cijfers: { waarde: string; label: string }[];
    /** Aanvullende kerncijfers, alleen in de uitklap. */
    extraCijfers?: { waarde: string; label: string }[];
    bouwjaarLead: string;
    bouwperiodes: { label: string; percentage: number; tekst: string }[];
    bronnen: { naam: string; url: string; peildatum?: string }[];
    /** Uitleg bij verschillen tussen de tellingen, zodat de aantallen navolgbaar blijven. */
    bronNoot: string;
    gebieden?: {
      titel: string;
      cijfer: { waarde: string; label: string };
      tekst: string;
      aandachtspunten: { tekst: string; href?: string }[];
    }[];
    /** Twee keuzekaarten: de vragen waarmee bewoners binnenkomen. */
    kaarten: { titel: string; tekst?: string; alineas?: Alinea[]; links: { tekst: string; href: string }[] }[];
    /** De tekst loopt door; een deel met `nadruk` wordt dikgedrukt en groen weergegeven. */
    adviseur: { h3: string; tekst: (string | { nadruk: string })[] | Alinea[]; adviseur?: "thom" | "naud" };
    vergunning?: { tekst: string; bron: { naam: string; url: string } };
  };
  buurtschappen?: { eyebrow?: string; h2: string; lead?: string; bron?: { naam: string; url: string } };
  afsluiting: { tekst: string; /** Toont ook de getrackte woningscan-knop. */ scanKnop?: boolean };
};

export type GemeenteVerhaal = {
  /** Zet de uitgebreide lokale landingspagina aan in plaats van de standaardopbouw. */
  lokaalProfiel?: LokaalProfiel;
  seo: { title: string; description: string };
  kicker: string;
  h1: string;
  intro: Alinea[];
  /** Naam voor template-zinnen (Thom-blok, keuzekaarten, afsluiting) als de gemeentenaam geen
   *  echte plaatsnaam is — bijv. "de gemeente Noordoostpolder". Niet invullen als de gemeentenaam
   *  ook de naam van de hoofdplaats is (Dronten, Lelystad). */
  naamDisplay?: string;
  /** Slugs van de kernen (lib/content/regio.ts), in deze volgorde getoond. */
  kernen: string[];
  woningen?: {
    lead: string;
    kerncijfers: { waarde: string; label: string }[];
    /** Opeenvolgende bouwperiodes; de percentages tellen op tot (ongeveer) 100. */
    bouwperiodes: { label: string; percentage: number; tekst: string }[];
    voetnoot: string;
    bron: { naam: string; url: string };
  };
  lokaal: {
    titel: string;
    alineas: Alinea[];
    bekendVan?: { titel: string; kaarten: { icon: string; titel: string; tekst: string }[] };
    kernTekst: Record<string, string>;
    /** Optioneel: afbeelding die rechts in het lokale verhaalblok getoond wordt. */
    lokaalAfbeelding?: string;
    /** CBS-wijken in de gemeente. tijdvak = index in woningen.bouwperiodes (kleur), null = gemengd.
     *  koopwoningPercentage/bouwjaarVerdeling: optioneel, alleen invullen met een geverifieerd cijfer
     *  op wijkniveau (bijv. AlleCijfers.nl) — nooit schatten of van de gemeente overnemen. */
    wijken?: { titel: string; intro: string; lijst: {
      naam: string; woningen?: number; periode: string; tijdvak: number | null; type?: string;
      koopwoningPercentage?: number;
      bouwjaarVerdeling?: { label: string; percentage: number }[];
    }[]; bron: { naam: string; url: string } };
    ontwikkeling: { titel: string; tekst: string };
  };
  natuur?: {
    titel: string;
    lead: string;
    stappen: { icon: string; titel: string; tekst: string }[];
    zelf: string;
    bron: { naam: string; url: string };
  };
  faq: FAQItem[];
  verwant: { naam: string; href: string }[];
  /** Optioneel: rustig "oudere vs. nieuwere woning"-blok direct onder het woningverhaal, met
   * daaronder het persoonlijke adviesblok (foto + tekst + CTA). Percentage komt uit woningen.kerncijfers. */
  woningtypeAdvies?: {
    ouder: { kop: string; alineas: Alinea[]; linkTekst: string; linkHref: string };
    nieuwer: { kop: string; alineas: Alinea[] };
  };
  /** Optioneel: vier compacte isolatiekaarten direct na de lokaal-sectie. */
  isolatieKaarten?: {
    h2: string;
    intro: string;
    kaarten: { naam: string; icon: string; tekst: string; href: string; afbeelding?: string }[];
  };
  /** Optioneel: persoonlijk adviesblok met adviseur-foto, tekst en CTA. Afwijkend van woningtypeAdvies:
   *  kan op elke pagina staan, los van de "oudere/nieuwere woning"-logica. */
  persoonlijkAdviesBlok?: {
    label: string;
    h2: string;
    alineas: Alinea[];
    foto: string;
    fotoAlt: string;
    ctaLabel: string;
    ctaHref: string;
    checklist?: string[];
  };
  /** Optioneel: wijkinzichten-blok (2×2-grid) met per wijk een percentage, bouwperiode en tekst.
   *  Wordt getoond INSIDE de grijze container (vereist ook wijkKaarten). Integreert persoonlijkAdviesBlok. */
  wijkInzichtenBlok?: {
    titel: string;
    intro: string;
    inzichten: Array<{
      nummer: number;
      wijk: string;
      wijkLabel: string;
      percentage: string;
      bouwperiode: string;
      h3: string;
      alineas: string[];
    }>;
    bron: string;
  };
  /** Optioneel: compacte plaatsen (borden) + eventueel wijkkaarten. Als lokaal.wijken ook gezet is,
   *  wordt de CBS-wijkentabel hierboven getoond ipv de simpele kaarten. */
  wijkKaarten?: {
    h2?: string;
    intro?: string;
    kaarten?: { naam: string; tekst: string; href?: string }[];
    plaatsenTitel: string;
    plaatsen: { label: string; afbeelding?: string; href?: string; tekst: string }[];
  };
  partner?: {
    naam: string;
    logo: string;
    url: string;
    urlLabel: string;
    tagline: string;
    /** 'hero' = prominente sectie hoog op de pagina (default); 'compact' = kleine vermelding in de hero */
    display?: 'hero' | 'compact';
  };
  /** Brede 16:9-hero (foto rechts + witte gradient naar tekst links). Alleen zinvol als er ook een heroFoto beschikbaar is. */
  heroBreed?: boolean;
  /** Compacte kernkaarten in de lokaal-sectie (6-kol grid, kleine afbeelding + naam + pijl, geen groene knop). */
  kompaktKernenKaarten?: boolean;
  woningInzichtenBlok?: {
    h2: string;
    feitVariant?: 'cirkel' | 'heading' | 'subtiel';
    percentage?: string;
    percentageTekst: string;
    bodytekst: string;
    kaarten: [
      { icon: string; titel: string; tekst: string; href: string; linkTekst: string },
      { icon: string; titel: string; tekst: string; href: string; linkTekst: string }
    ];
    adviseur: { naam: 'thom' | 'naud'; h3: string; tekst: string };
  };
};

const BORNE: GemeenteVerhaal = {
  seo: {
    title: "Isolatie, zonnepanelen of warmtepomp in Borne | Gijs",
    description: "Isolatie, zonnepanelen of een warmtepomp in Borne, Zenderen of Hertme? Gijs adviseert onafhankelijk over spouwmuurisolatie en andere maatregelen, en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Borne",
  h1: "Isolatie, zonnepanelen of een warmtepomp in Borne?",
  intro: [
    ["Woon je in Borne, ", { tekst: "Zenderen", href: "/regio/overijssel/borne/zenderen" }, ", ", { tekst: "Hertme", href: "/regio/overijssel/borne/hertme" }, " of het buitengebied? Ontdek welke zonnepanelen, isolatie en installaties bij jouw woning passen, welke regelingen er nu in Borne zijn en waar je rekening mee moet houden."],
    ["Ruim een derde van de woningen in Borne is gebouwd vóór 1975. Juist daar valt vaak nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " en ", { tekst: "zonnepanelen", href: "/maatregelen/zonnepanelen" }, ". Gijs kijkt eerst wat er al is gedaan, en helpt je dan met de stap die logisch is."],
  ],
  kernen: ["borne", "zenderen", "hertme"],
  // CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 20 oktober 2026.
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Borne verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "10.857", label: "woningen" },
      { waarde: "35%", label: "gebouwd vóór 1975" },
      { waarde: "28%", label: "tussenwoning" },
      { waarde: "18%", label: "vrijstaand" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 35, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
      { label: "1975 – 1995", percentage: 29, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
      { label: "1995 – 2015", percentage: 21, tekst: "Meestal redelijk geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 15, tekst: "Al goed geïsoleerd. De aandacht verschuift naar installaties, zoals zonnepanelen en een thuisbatterij." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Daarom kijkt Gijs altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/borne/" },
  },
  woningtypeAdvies: {
    ouder: {
      kop: "Woon je in een oudere woning in Borne?",
      alineas: [
        ["Woningen uit de periode 1920–1975 hebben vaak een spouwmuur die oorspronkelijk niet is geïsoleerd. Omdat 35% van de woningen in Borne vóór 1975 is gebouwd, is spouwmuurisolatie misschien ook interessant voor jouw woning."],
        ["Of jouw woning geschikt is voor spouwmuurisolatie, hangt onder andere af van de staat van de spouw en of er al isolatie aanwezig is. Daarom is het verstandig om eerst te kijken wat er mogelijk is."],
      ],
      linkTekst: "Meer over spouwmuurisolatie",
      linkHref: "/maatregelen/spouwmuurisolatie",
    },
    nieuwer: {
      kop: "Woon je in een nieuwere woning, bijvoorbeeld in Bornsche Maten?",
      alineas: [
        ["Bij woningen die na 1995 zijn gebouwd, is de isolatie vaak al goed geregeld. Daarom zijn andere verduurzamingsmaatregelen misschien interessanter voor jouw woning."],
        ["Ben je op zoek naar een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, " of ", { tekst: "thuisbatterij", href: "/maatregelen/thuisbatterij" }, ", maar weet je niet goed wat bij jouw woning past? Ook hier kijkt Gijs graag met je mee, zodat je weet wat er mogelijk is en welke investering voor jou verstandig is."],
      ],
    },
  },
  lokaal: {
    titel: "Borne, Zenderen en Hertme: niet iedere woning is hetzelfde",
    alineas: [
      ["De gemeente Borne bestaat uit de kern Borne, de dorpen Zenderen en Hertme en het buitengebied. Of je nu in een rijwoning in de kern woont of in een vrijstaand huis aan de rand van een dorp: de vraag is steeds waar de meeste warmte weglekt."],
      ["Dat verschil telt. Een vrijstaande woning heeft meer buitenmuur, dak en vloer dan een tussenwoning van dezelfde grootte, dus daar weegt goede isolatie extra zwaar. Woningtype, bouwjaar en ligging zeggen meer over je huis dan alleen de plaatsnaam."],
      ["Wil je je woning isoleren in Borne? Gijs helpt bij het vinden van de juiste maatregel, van ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " en ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, " tot zonnepanelen, maar voert de werkzaamheden niet zelf uit. Eerst krijg je onafhankelijk advies, daarna begeleidt Gijs het traject van A tot Z."],
    ],
    bekendVan: {
      titel: "Waar is Borne bekend van?",
      kaarten: [
        { icon: "landmark", titel: "Bussemakerhuis", tekst: "Het enige bewaard gebleven linnenhandelshuis van Nederland, aan de Ennekerdijk. Herinnert aan 1675, toen Borne het belangrijkste linnenhandelscentrum van Twente was." },
      ],
    },
    // CBS-buurtindeling; woningen = CBS-woningvoorraad 2025, bouwjaren en woningtypen BAG 2026, via
    // AlleCijfers.nl (per buurt opgehaald op 20 oktober 2026).
    wijken: {
      titel: "Wijken in Borne",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen. Borne telt officieel 2 CBS-wijken; de bekende buurtnamen zoals Bornsche Maten en Stroom-Esch vallen allemaal onder wijk Borne.",
      lijst: [
        { naam: "Borne", woningen: 9611, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Buitengebied Borne", woningen: 924, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 15 }, { label: "2015 tot 2025", percentage: 19 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/borne/" },
    },
    kernTekst: {
      borne: "De kern van de gemeente, met de meeste woningen.",
      zenderen: "Dorp in de gemeente Borne, met sinds 1889 het Karmelietenklooster.",
      hertme: "Dorp in de gemeente Borne, bekend van het Openluchttheater Hertme.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Borne?",
      tekst: "In het warmteprogramma beschrijft de gemeente hoe Borne stap voor stap minder aardgas gaat gebruiken. Als tussendoel noemt de gemeente dat rond 2030 ongeveer 2.100 woningen van het gas af zijn of een grote isolatiestap hebben gemaakt. Isoleren is hoe dan ook een logische eerste stap.",
    },
  },
  // Gemeente Borne, borne.nl/natuurvriendelijk-isoleren, gecontroleerd op 20 oktober 2026.
  natuur: {
    titel: "Natuurvriendelijk isoleren in Borne",
    lead: "Alle woningeigenaren in de gemeente Borne moeten natuurvriendelijk isoleren. In spouwmuren, muren en daken wonen vaak beschermde dieren, zoals vleermuizen, huismussen en gierzwaluwen. Zo houd je daar rekening mee:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. De gemeente verwijst naar een overzicht van bedrijven die dit doen." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Gemeente en isolatiebedrijven zorgen voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "De melding is geregeld", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel. Wie niet natuurvriendelijk isoleert, kan een boete krijgen van de provincie.",
    bron: { naam: "Gemeente Borne", url: "https://www.borne.nl/natuurvriendelijk-isoleren" },
  },
  faq: [
    { question: "Moet ik in Borne natuurvriendelijk isoleren?", answer: "Ja. Volgens de gemeente Borne moeten alle woningeigenaren natuurvriendelijk isoleren. Het eenvoudigst is een isolatiebedrijf dat natuurvriendelijk isoleert: dat regelt ook de verplichte melding bij de provincie Overijssel." },
    { question: "Welke subsidies zijn er nu in Borne?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Borne in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Kan ik een gemeentelijke subsidie combineren met de ISDE?", answer: "Vaak wel, maar dat hangt af van de voorwaarden van beide regelingen. Gijs bekijkt dat met je tijdens de energiescan en helpt bij de aanvraag. Gijs kan toekenning niet garanderen." },
    { question: "Mijn huis is gebouwd vóór 1975. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer, maar het hangt af van wat er al is gedaan. Veel oudere woningen zijn al deels verbeterd. Tijdens de energiescan kijken we wat er nog te winnen valt." },
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, zoals een warmtepomp, zonnepanelen of een thuisbatterij, en naar de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs ook in Zenderen, Hertme en het buitengebied?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Borne, dus ook in de dorpen en daarbuiten." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
// Buurt "Zenderen" in gemeente Borne: 402 woningen, bouwjaar- en woningtype-verdeling per buurt.
const ZENDEREN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Zenderen | Gijs",
    description: "Je woning verduurzamen in Zenderen? Lees wat het bouwjaar zegt, hoe de gemeente Borne omgaat met natuurvriendelijk isoleren, en welke subsidies er nu zijn.",
  },
  kicker: "Dorp in gemeente Borne",
  h1: "Je woning verduurzamen in Zenderen",
  intro: [
    ["Woon je in Zenderen of het buitengebied rondom het dorp? Ontdek welke isolatie en installaties bij jouw woning passen, welke regelingen er nu in de gemeente ", { tekst: "Borne", href: "/regio/overijssel/borne" }, " zijn en waar je rekening mee moet houden."],
    ["Bijna een op de vijf woningen in Zenderen is gebouwd vóór 1945. Maar ook de naoorlogse woningen hebben vaak nog verduurzamingspotentie. Gijs kijkt eerst wat er al is gedaan en helpt je met de logische volgende stap."],
  ],
  kernen: ["zenderen", "borne", "hertme"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Zenderen verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "402", label: "woningen" },
      { waarde: "20%", label: "gebouwd vóór 1945" },
      { waarde: "38%", label: "vrijstaand" },
      { waarde: "83%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 20, tekst: "Historische lintbebouwing en Twentse boerderijen. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier vaak de grootste winst." },
      { label: "1945 – 1975", percentage: 27, tekst: "Wederopbouw en naoorlogse groei. Spouwmuren zijn er, maar de spouw is vaak nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 29, tekst: "De grootste bouwperiode van Zenderen. Deels geïsoleerd, maar bijna altijd te verbeteren. Eerst kijken wat er al zit, dan bijisoleren." },
      { label: "1995 – heden", percentage: 24, tekst: "Beter geïsoleerd dan de oudere perioden. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Zenderen, 2026", url: "https://www.allecijfers.nl/buurt/zenderen-borne/" },
  },
  lokaal: {
    titel: "Zenderen: een dorp met diepgewortelde geschiedenis",
    alineas: [
      ["Zenderen is het op één na grootste dorp van de gemeente Borne en heeft een rijke geschiedenis die teruggaat tot de tiende eeuw. De naam verwijst vermoedelijk naar de sintels (ijzerslak) die hier in de bodem te vinden zijn. Vroeger liepen de handelsroutes over de ", { tekst: "Bornsebeek", href: "https://nl.wikipedia.org/wiki/Zenderen", extern: true }, " en Azelerbeek."],
      ["De woningvoorraad loopt uiteen van historische lintbebouwing tot ruimere vrijstaande woningen in de nieuwere straten. Met 38% vrijstaande woningen is het buitenoppervlak per woning gemiddeld groter dan in de kern Borne. Dat maakt goede dakisolatie, spouwmuurisolatie en zonnepanelen in Zenderen extra zinvol."],
    ],
    bekendVan: {
      titel: "Waar is Zenderen bekend van?",
      kaarten: [
        { icon: "church", titel: "Karmelietenklooster", tekst: "Het Karmelietenklooster aan de rand van het dorp huisvest Karmelieten-fraters en -zusters. Het klooster is al decennia een herkenningspunt van Zenderen." },
      ],
    },
    kernTekst: {
      zenderen: "Je bent hier. Het op één na grootste dorp van de gemeente Borne.",
      borne: "De gemeentekern, met de meeste woningen en het gemeentehuis.",
      hertme: "Het kleinste dorp van de gemeente, bekend van het Openluchttheater.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Borne?",
      tekst: "In het warmteprogramma beschrijft de gemeente hoe Borne stap voor stap minder aardgas gaat gebruiken. Als tussendoel noemt de gemeente dat rond 2030 ongeveer 2.100 woningen van het gas af zijn of een grote isolatiestap hebben gemaakt. Dat geldt voor de hele gemeente, dus ook voor Zenderen.",
    },
  },
  natuur: {
    titel: "Natuurvriendelijk isoleren in de gemeente Borne",
    lead: "Alle woningeigenaren in de gemeente Borne moeten natuurvriendelijk isoleren. Dat geldt ook in Zenderen. In spouwmuren, muren en daken wonen vaak beschermde dieren, zoals vleermuizen, huismussen en gierzwaluwen. Zo houd je daar rekening mee:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. De gemeente verwijst naar een overzicht van bedrijven die dit doen." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Gemeente en isolatiebedrijven zorgen voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "De melding is geregeld", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel. Wie niet natuurvriendelijk isoleert, kan een boete krijgen van de provincie.",
    bron: { naam: "Gemeente Borne", url: "https://www.borne.nl/natuurvriendelijk-isoleren" },
  },
  faq: [
    { question: "Moet ik in Zenderen ook natuurvriendelijk isoleren?", answer: "Ja. De gemeentelijke plicht van Borne geldt voor alle woningeigenaren in de gemeente, ook in Zenderen. Het eenvoudigst is een isolatiebedrijf dat natuurvriendelijk werkt: dat regelt ook de verplichte melding bij de provincie Overijssel." },
    { question: "Welke subsidies zijn er voor mijn woning in Zenderen?", answer: "Zenderen valt onder de gemeente Borne. De regelingen van Borne zijn dus ook op jouw woning van toepassing. Op deze pagina staan de actuele regelingen uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt." },
    { question: "Mijn huis in Zenderen is van vóór 1945. Waar begin ik?", answer: "Bij oude Twentse woningen en boerderijen begint het meestal bij de spouw, het dak of de vloer. Maar veel oudere woningen zijn al deels verbeterd. Tijdens de energiescan kijkt Gijs wat er al is gedaan en wat de volgende logische stap is." },
    { question: "Mijn woning staat vrijstaand. Heeft dat invloed op de aanpak?", answer: "Ja. Een vrijstaande woning heeft meer buitenmuur, dak en vloer dan een tussenwoning van dezelfde grootte. Goede isolatie van de schil telt daardoor zwaarder mee in je energierekening. Gijs bekijkt de combinatie van schil en installaties in de juiste volgorde." },
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, zoals een warmtepomp, zonnepanelen of een thuisbatterij, en naar de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs ook in Zenderen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Borne, dus ook in Zenderen, Hertme en het buitengebied." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Borne", href: "/regio/overijssel/borne" },
    { naam: "Woning verduurzamen in Hertme", href: "/regio/overijssel/borne/hertme" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
// Buurt "Hertme" in gemeente Borne: 110 woningen. Vrijstaand dominant (64%), WOZ gem. €494.000.
const HERTME: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Hertme | Gijs",
    description: "Je woning verduurzamen in Hertme? Lees wat het bouwjaar zegt over jouw woning, de regels rondom natuurvriendelijk isoleren en welke subsidies er nu zijn.",
  },
  kicker: "Dorp in gemeente Borne",
  h1: "Je woning verduurzamen in Hertme",
  intro: [
    ["Woon je in Hertme of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen, welke regelingen er nu in de gemeente ", { tekst: "Borne", href: "/regio/overijssel/borne" }, " zijn en waar je rekening mee moet houden."],
    ["Bijna twee derde van de woningen in Hertme staat vrijstaand, het hoogste aandeel van de drie dorpen in Borne. Vrijstaande woningen hebben meer buitenoppervlak, wat betekent dat goede isolatie van dak, spouw en vloer extra bijdraagt."],
  ],
  kernen: ["hertme", "borne", "zenderen"],
  woningen: {
    lead: "Hertme heeft een eigen woningkarakter: klein en overwegend vrijstaand. Zo is de woningvoorraad verdeeld, en dit betekent het voor verduurzamen.",
    kerncijfers: [
      { waarde: "110", label: "woningen" },
      { waarde: "64%", label: "vrijstaand" },
      { waarde: "91%", label: "koopwoning" },
      { waarde: "€494.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 11, tekst: "Oude boerderijen en landelijke bebouwing. Kenmerkend voor de bosrijke omgeving van Hertme, bijna altijd zonder of met minimale isolatie." },
      { label: "1945 – 1975", percentage: 18, tekst: "Naoorlogse groei van het dorp, overwegend vrijstaand of twee-onder-een-kap. Spouwmuurisolatie is hier vrijwel altijd de eerste stap." },
      { label: "1975 – 1995", percentage: 36, tekst: "De grootste bouwperiode van Hertme. Ruime vrijstaande woningen waarbij isolatie en zonnepanelen goed gecombineerd kunnen worden." },
      { label: "1995 – heden", percentage: 35, tekst: "Redelijk modern gebouwd. De focus ligt vaker op installaties: warmtepomp, zonnepanelen of thuisbatterij." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Hertme, 2026", url: "https://www.allecijfers.nl/buurt/hertme-borne/" },
  },
  lokaal: {
    titel: "Hertme: klein dorp in de bosrijke omgeving",
    alineas: [
      ["Hertme is het kleinste van de drie dorpen in de gemeente Borne en ligt in een bosrijke omgeving, op zo'n zeven kilometer van Hengelo. Met 110 woningen is de schaal overzichtelijk, maar de verduurzamingsopgave is dezelfde als in de rest van Borne."],
      ["Bijna twee derde van de woningen staat vrijstaand. Dat maakt Hertme anders dan de kern Borne, waar tussenwoningen en appartementen domineren. Ruime daken en weinig beschaduwing bieden in Hertme optimale condities voor zonnepanelen, terwijl de grotere gevels en daken ook meer te winnen geven bij isolatie."],
    ],
    bekendVan: {
      titel: "Waar is Hertme bekend van?",
      kaarten: [
        { icon: "music", titel: "Openluchttheater Hertme", tekst: "Het openluchttheater trekt jaarlijks duizenden bezoekers met het Afrika Festival en Metropool Open Air, het grootste openluchtfestival van Twente." },
        { icon: "landmark", titel: "Sint-Stephanuskerk", tekst: "De neo-gotische kerk uit 1903, een vroeg werk van architect Wolter te Riele, is een gemeentelijk monument aan de rand van het dorp." },
      ],
    },
    kernTekst: {
      hertme: "Je bent hier. Klein dorp in bosrijke omgeving, met een eigen karakter.",
      borne: "De gemeentekern, met de meeste woningen en gemeentelijke voorzieningen.",
      zenderen: "Het grootste dorp van de gemeente buiten de kern, met een rijke geschiedenis.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Borne?",
      tekst: "In het warmteprogramma beschrijft de gemeente hoe Borne stap voor stap minder aardgas gaat gebruiken. Als tussendoel noemt de gemeente dat rond 2030 ongeveer 2.100 woningen van het gas af zijn of een grote isolatiestap hebben gemaakt. Dat geldt voor de hele gemeente, dus ook voor Hertme.",
    },
  },
  natuur: {
    titel: "Natuurvriendelijk isoleren in de gemeente Borne",
    lead: "Alle woningeigenaren in de gemeente Borne moeten natuurvriendelijk isoleren. Dat geldt ook in Hertme. In spouwmuren, muren en daken wonen vaak beschermde dieren, zoals vleermuizen, huismussen en gierzwaluwen. Zo houd je daar rekening mee:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. De gemeente verwijst naar een overzicht van bedrijven die dit doen." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Gemeente en isolatiebedrijven zorgen voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "De melding is geregeld", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel. Wie niet natuurvriendelijk isoleert, kan een boete krijgen van de provincie.",
    bron: { naam: "Gemeente Borne", url: "https://www.borne.nl/natuurvriendelijk-isoleren" },
  },
  faq: [
    { question: "Moet ik in Hertme ook natuurvriendelijk isoleren?", answer: "Ja. De gemeentelijke plicht van Borne geldt voor alle woningeigenaren in de gemeente, ook in Hertme. Het eenvoudigst is een isolatiebedrijf dat natuurvriendelijk werkt: dat regelt ook de verplichte melding bij de provincie Overijssel." },
    { question: "Welke subsidies zijn er voor mijn woning in Hertme?", answer: "Hertme valt onder de gemeente Borne. De regelingen van Borne gelden dus ook voor woningen in Hertme. Op deze pagina staan de actuele regelingen uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt." },
    { question: "Mijn woning in Hertme staat vrijstaand. Hoe pak ik dat aan?", answer: "Vrijstaande woningen hebben meer buitenoppervlak dan tussenwoningen, waardoor isolatie van dak, spouw en vloer extra loont. De juiste volgorde hangt af van wat er al is gedaan. Gijs bepaalt dat tijdens de energiescan." },
    { question: "Kan ik in Hertme een warmtepomp plaatsen?", answer: "In veel gevallen wel, maar de toepasbaarheid hangt af van de ruimte, de isolatiegraad en de warmtevraag van de woning. Gijs kijkt of eerst isoleren de logische eerste stap is, zodat een kleinere en goedkopere warmtepomp volstaat." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime daken en weinig beschaduwing maken Hertme goed geschikt voor zonnepanelen. Gijs kijkt naar de combinatie van isolatie en installaties en naar de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs ook in Hertme?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Borne, dus ook in Hertme en het buitengebied." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Borne", href: "/regio/overijssel/borne" },
    { naam: "Woning verduurzamen in Zenderen", href: "/regio/overijssel/borne/zenderen" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const HENGELO: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Hengelo | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij spouwmuurisolatie of dakisolatie in Hengelo? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Gemeente Hengelo",
  h1: "Je woning isoleren en verduurzamen in Hengelo",
  intro: [
    ["Woon je in Hengelo of het dorp ", { tekst: "Beckum", href: "/regio/overijssel/hengelo/beckum" }, " en wil je jouw woning isoleren? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Ruim een derde van de woningen in Hengelo is gebouwd vóór 1975. Juist in die naoorlogse wijken valt nog veel te winnen. Gijs kijkt samen met jou wat er al is gedaan en adviseert over de stap die het meest zinvol is."],
  ],
  kernen: ["hengelo", "beckum"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Hengelo verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "40.426", label: "woningen" },
      { waarde: "€313.000", label: "gem. WOZ-waarde" },
      { waarde: "57%", label: "koopwoning" },
      { waarde: "43%", label: "huurwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 20, tekst: "Veelal gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier bijna altijd de grootste winst." },
      { label: "1945 – 1975", percentage: 21, tekst: "Naoorlogse uitbreiding van de stad. Spouwmuren zijn er, maar de spouw is vaak nog leeg of dunner geïsoleerd." },
      { label: "1975 – 1995", percentage: 27, tekst: "Deels geïsoleerd, maar zelden op huidig niveau. Eerst kijken wat er zit, dan bijisoleren." },
      { label: "Na 1995", percentage: 32, tekst: "Beter geïsoleerd dan de oudere perioden. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/hengelo/" },
  },
  wijkInzichtenBlok: {
    titel: "Wat zeggen de wijkcijfers over jouw woning?",
    intro: "Niet iedere woning in Hengelo is hetzelfde. De bouwjaren verschillen behoorlijk per wijk en dat biedt kansen om je woning comfortabeler en energiezuiniger te maken. Ontdek wat er in jouw wijk te verbeteren valt.",
    inzichten: [
      {
        nummer: 1,
        wijk: "Tuindorp 't Lansink",
        wijkLabel: "Oudere woningen",
        percentage: "58%",
        bouwperiode: "gebouwd vóór 1945",
        h3: "Begin bij goede isolatie",
        alineas: [
          "In Tuindorp 't Lansink is 58% van de woningen vóór 1945 gebouwd. Bij deze karakteristieke oudere woningen is vaak nog winst te halen uit dakisolatie, isolerend glas, vloerisolatie en gevelisolatie, met oog voor de constructie en uitstraling van de woning.",
        ],
      },
      {
        nummer: 2,
        wijk: "Groot Driene",
        wijkLabel: "Woningen uit de jaren zestig en zeventig",
        percentage: "65%",
        bouwperiode: "gebouwd tussen 1965 en 1975",
        h3: "Wat is er sinds de bouw verbeterd?",
        alineas: [
          "In Groot Driene is 65% van de woningen gebouwd tussen 1965 en 1975, toen er nog veel minder werd geïsoleerd. Is de spouwmuur al aangepakt? Dan kijken we verder naar dak, vloer en glas, om voort te bouwen op wat er al is gedaan.",
        ],
      },
      {
        nummer: 3,
        wijk: "Hasseler Es",
        wijkLabel: "Woningen uit de jaren zeventig en tachtig",
        percentage: "81%",
        bouwperiode: "gebouwd tussen 1975 en 1985",
        h3: "Je isolatie kan beter",
        alineas: [
          "Maar liefst 81% van de woningen in Hasseler Es is gebouwd tussen 1975 en 1985. Deze woningen kregen bij de bouw al enige isolatie mee, maar materialen en technieken zijn sindsdien flink verbeterd: dak en vloer kunnen beter, en HR++-glas houdt meer warmte binnen.",
        ],
      },
      {
        nummer: 4,
        wijk: "Slangenbeek",
        wijkLabel: "Nieuwere woningen",
        percentage: "47%",
        bouwperiode: "gebouwd tussen 1995 en 2005",
        h3: "Slimmer verwarmen in plaats van extra isoleren",
        alineas: [
          "In Slangenbeek is 47% van de woningen gebouwd tussen 1995 en 2005 en vaak al goed geïsoleerd. Slimmer verwarmen is dan de volgende stap: vloerverwarming tegen een koude vloer, of een warmtepomp die, bij een geschikte woning, zelfs volledig elektrisch kan verwarmen.",
        ],
      },
    ],
    bron: "Bron woninggegevens: AlleCijfers.nl, wijk- en buurtgegevens Hengelo.",
  },
  lokaal: {
    titel: "Van industriestad naar energiezuinige woningen",
    alineas: [
      ["Hengelo staat bekend om zijn industriële verleden, met Stork en de arbeiderswoningen in Tuindorp. Maar ook jouw woning vertelt een verhaal. Van karakteristieke oudere woningen tot nieuwere woonwijken, Hengelo heeft het allemaal. Niet iedere woning is even comfortabel en daarom vraagt ook niet iedere woning om dezelfde verduurzamingsmaatregelen."],
      ["In oudere woningen kan bijvoorbeeld nog veel warmte verloren gaan via het dak, de gevel, de vloer of het glas. Nieuwere woningen zijn vaak al beter geïsoleerd, waardoor een warmtepomp of vloerverwarming interessanter kan zijn. Wat verstandig is, hangt af van wat er al aanwezig is en natuurlijk van jouw wensen."],
    ],
    kernTekst: {
      hengelo: "De stad zelf, met de meeste woningen en voorzieningen.",
      beckum: "Dorp aan de rand van Hengelo, met een meer landelijk karakter.",
    },
    wijken: {
      titel: "Overige wijken in Hengelo",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen. Groot Driene, Hasseler Es en Slangenbeek staan hierboven al met hun eigen wijkinzicht.",
      lijst: [
        { naam: "Binnenstad", woningen: 2202, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 40,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 26 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 2 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 5 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Hengelose Es", woningen: 5335, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 53,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 35 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Noord", woningen: 5135, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 44,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 18 }, { label: "1945 tot 1965", percentage: 51 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 1 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Berflo Es", woningen: 4027, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 42,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 25 }, { label: "1965 tot 1975", percentage: 2 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 14 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wilderinkshoek", woningen: 5135, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 57,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 38 }, { label: "1945 tot 1965", percentage: 27 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Woolde", woningen: 3792, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 59,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 15 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 22 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 5 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Buitengebied", woningen: 704, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/hengelo/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Hengelo?",
      tekst: "Hengelo werkt aan een warmteplan voor de stad. De focus ligt op wijkgerichte aanpak, waarbij oudere naoorlogse wijken als eerste aan de beurt komen. Isoleren is hoe dan ook de logische eerste stap, ongeacht wanneer je wijk aan de beurt is.",
    },
  },
  isolatieKaarten: {
    h2: "Waar kun je bij jouw woning beginnen?",
    intro: "Elke woning is anders. Daarom is het verstandig om eerst te kijken naar de isolatie van je dak, gevel, vloer en glas. Zo ontdek je waar bij jouw woning in Hengelo nog mogelijkheden liggen.",
    kaarten: [
      { naam: "Dakisolatie", icon: "house", tekst: "Is jouw dak al goed geïsoleerd? Met dakisolatie kun je warmteverlies beperken en het comfort in je woning verbeteren.", href: "/maatregelen/dakisolatie", afbeelding: "/images/maatregelen/dakisolatie/praktijk/inblazen-zolder.jpg" },
      { naam: "Gevelisolatie", icon: "building-2", tekst: "Hoe zit het met jouw spouwmuur? Spouwmuurisolatie kan bij geschikte woningen helpen om warmteverlies te beperken.", href: "/maatregelen/spouwmuurisolatie", afbeelding: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-aanbrengen-gijs.png" },
      { naam: "Vloerisolatie", icon: "align-bottom", tekst: "Last van een koude vloer? Vloerisolatie kan zorgen voor meer comfort en minder warmteverlies.", href: "/maatregelen/vloerisolatie", afbeelding: "/images/maatregelen/vloerisolatie/hero_vloerisolatie.png" },
      { naam: "Glasisolatie", icon: "square", tekst: "Heb je nog enkelglas of ouder dubbelglas? HR++-glas of triple glas kan helpen om warmte beter binnen te houden.", href: "/maatregelen/isolatieglas", afbeelding: "/images/maatregelen/glas/isolatieglas.png" },
    ],
  },
  persoonlijkAdviesBlok: {
    label: "PERSOONLIJK ADVIES IN HENGELO",
    h2: "Thom komt graag even langs om je te helpen",
    alineas: [
      ["Woon je in Tuindorp, Groot Driene, Hasseler Es, Slangenbeek of ergens anders in Hengelo? De wijkcijfers geven een eerste indruk, maar jouw woning verdient persoonlijk advies. Wat is er al verbeterd en waar valt nog winst te behalen?"],
      ["Thom komt graag bij je langs voor een ", { tekst: "gratis en vrijblijvende", href: "/contact#energiescan" }, " energiescan. Samen kijken jullie naar jouw woning, jouw wensen en de verduurzamingsmaatregelen die daarbij passen."],
      ["Wil je daarna verder verduurzamen? Gijs begeleidt en ontzorgt je van A tot Z. Van het eerste advies tot het regelen en begeleiden van de uitvoering, zodat je er zelf zo min mogelijk omkijken naar hebt."],
    ],
    foto: "/images/over-gijs/thom/thom-portret.png",
    fotoAlt: "Thom, adviseur bij Gijs in Hengelo",
    ctaLabel: "Plan jouw gratis energiescan",
    ctaHref: "/contact#energiescan",
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Hengelo",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren: vleermuizen, huismussen en gierzwaluwen. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Een goed isolatiebedrijf zorgt voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-en-landschap/ontheffing-flora-faunawet/" },
  },
  faq: [
    { question: "Welke subsidies zijn er nu in Hengelo?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Hengelo in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn huis in Hengelo is van vóór 1975. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer, maar het hangt af van wat er al is gedaan. Veel naoorlogse woningen zijn deels al verbeterd. Gijs kijkt wat er nog te winnen valt tijdens de energiescan." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In Hengelo wonen vleermuizen, huismussen en gierzwaluwen in spouwmuren en daken. Kies een isolatiebedrijf dat natuurvriendelijk werkt: dat regelt ook de melding bij de provincie." },
    { question: "Kan ik een gemeentelijke subsidie combineren met de ISDE?", answer: "Vaak wel, maar dat hangt af van de voorwaarden. Gijs bekijkt dat met je tijdens de energiescan en helpt bij de aanvraag. Gijs kan toekenning niet garanderen." },
    { question: "Is Gijs een isolatiebedrijf in Hengelo?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning in Hengelo. Vervolgens begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten. Je hoeft er zelf niet van wakker te liggen." },
    { question: "Helpt Gijs ook in Beckum?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hengelo, ook in het dorp Beckum." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
    { naam: "Woning verduurzamen in Borne", href: "/regio/overijssel/borne" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const ENSCHEDE: GemeenteVerhaal = {
  seo: {
    title: "Dakisolatie en vloerisolatie in Enschede | Gijs",
    description: "Op zoek naar dakisolatie of vloerisolatie in Enschede? Gijs helpt je met alle isolatiemaatregelen en installeert zonnepanelen. Gratis energiescan aan huis.",
  },
  kicker: "Gemeente Enschede",
  h1: "Dakisolatie, vloerisolatie en meer in Enschede",
  intro: [
    ["Woon je in Enschede of een van de dorpen zoals ", { tekst: "Glanerbrug", href: "/regio/overijssel/enschede/glanerbrug" }, ", ", { tekst: "Boekelo", href: "/regio/overijssel/enschede/boekelo" }, " of ", { tekst: "Lonneker", href: "/regio/overijssel/enschede/lonneker" }, "? Ontdek welke dakisolatie, vloerisolatie en andere maatregelen bij jouw woning passen en welke regelingen er nu zijn."],
    ["Bijna een vijfde van de woningen in Enschede is van voor 1945. In de naoorlogse uitbreidingswijken is de spouw er wel, maar zit er zelden al goede isolatie in. Dakisolatie en ", { tekst: "vloerisolatie", href: "/maatregelen/vloerisolatie" }, " zijn dan vaak de logische eerste stap. Gijs kijkt eerst wat er al is gedaan."],
  ],
  kernen: ["enschede", "glanerbrug", "boekelo", "lonneker"],
  woningen: {
    lead: "Enschede heeft een grote en gevarieerde woningvoorraad. Zo is die verdeeld naar bouwperiode, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "77.688", label: "woningen" },
      { waarde: "€301.000", label: "gem. WOZ-waarde" },
      { waarde: "38%", label: "appartement" },
      { waarde: "18%", label: "gebouwd vóór 1945" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 20, tekst: "Oudere stadswoningen en arbeiderswijken. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn de eerste winst." },
      { label: "1945 – 1975", percentage: 24, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn er, maar de spouw is vaak nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 24, tekst: "Deels geïsoleerd, maar zelden op huidig niveau. Bijisoleren levert hier de meeste winst op." },
      { label: "Na 1995", percentage: 32, tekst: "Beter geïsoleerd. De aandacht verschuift naar installaties: warmtepomp, zonnepanelen of een thuisbatterij." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/enschede/" },
  },
  lokaal: {
    titel: "Enschede: grote stad met een divers woningaanbod",
    alineas: [
      ["Enschede is de grootste stad van Overijssel en heeft een gevarieerde woningvoorraad: van historische panden in het centrum tot naoorlogse rijen­woningen en recente nieuwbouw. Met 38% appartementen is het aandeel meergezinswoningen groter dan in de meeste buurgemeenten."],
      ["Dat maakt de aanpak per woning anders. Een appartement in een VvE vraagt een andere aanpak dan een vrijstaande woning aan de stadsrand. Gijs kijkt per situatie wat de meest zinvolle stap is."],
      ["Dakisolatie en vloerisolatie zijn voor veel woningen in Enschede de eerste stap. Woningen van voor 1975 hebben zelden goed geïsoleerde daken of vloeren. Een schuin dak wordt van binnenuit geïsoleerd; een woning met kruipruimte is bijna altijd geschikt voor vloerisolatie. Welke maatregel als eerste zinvol is, hangt af van wat er al zit. Gijs kijkt dat tijdens de energiescan."],
    ],
    bekendVan: {
      titel: "Waar is Enschede bekend van?",
      kaarten: [
        { icon: "trophy", titel: "FC Twente", tekst: "FC Twente speelt in de Grolsch Veste en is een van de bekendste voetbalclubs van Nederland. De club draagt de naam van de hele regio." },
        { icon: "graduation-cap", titel: "Universiteit Twente", tekst: "De Universiteit Twente is een van de technische universiteiten van Nederland en huisvest tienduizenden studenten en onderzoekers." },
      ],
    },
    kernTekst: {
      enschede: "De grootste stad van Overijssel, met een divers woningaanbod.",
      glanerbrug: "Grensplaats bij de Duitse grens, met een gemengd woningbestand.",
      boekelo: "Dorp ten westen van Enschede, bekend als vestigingsplaats van de Grolsch-brouwerij.",
      lonneker: "Dorp ten noorden van Enschede, met een landelijk karakter.",
    },
    wijken: {
      titel: "Wijken in Enschede",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Binnensingelgebied", woningen: 15505, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 33,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Hogeland - Velve", woningen: 5839, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 57,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 29 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Boswinkel - Stadsveld", woningen: 10609, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 45,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 33 }, { label: "1965 tot 1975", percentage: 3 }, { label: "1975 tot 1985", percentage: 2 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Twekkelerveld - T.H.T.", woningen: 4693, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 42,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 32 }, { label: "1945 tot 1965", percentage: 32 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 1 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Enschede-Noord", woningen: 10234, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 40,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 15 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Ribbelt - Stokhorst", woningen: 4213, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 61,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 29 }, { label: "1945 tot 1965", percentage: 21 }, { label: "1965 tot 1975", percentage: 19 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 2 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Enschede-Zuid", woningen: 15030, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 50,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 1 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 41 }, { label: "1975 tot 1985", percentage: 26 }, { label: "1985 tot 1995", percentage: 19 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bedrijfsterreinen Enschede-West", woningen: 146, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 55,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 13 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 3 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 0 }, { label: "2025 en later", percentage: 57 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Glanerbrug en omgeving", woningen: 7201, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 64,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 6 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 34 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Landelijk gebied en kernen", woningen: 4218, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/enschede/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Enschede?",
      tekst: "Enschede werkt aan warmteplannen per wijk en stimuleert bewoners actief om te isoleren. De gemeente heeft een subsidieregeling voor woningisolatie. Isoleren is hoe dan ook de logische eerste stap, ongeacht wanneer je wijk aan de beurt is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Enschede",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren: vleermuizen, huismussen en gierzwaluwen. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Een goed isolatiebedrijf zorgt voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-en-landschap/ontheffing-flora-faunawet/" },
  },
  faq: [
    { question: "Welke subsidies zijn er nu in Enschede?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Enschede in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Ik woon in een VvE. Kan ik ook isoleren?", answer: "Ja, maar een VvE beslist collectief. Gijs kan je adviseren over wat er mogelijk is en hoe je het in de VvE bespreekbaar maakt." },
    { question: "Wanneer is dakisolatie of vloerisolatie zinvol in Enschede?", answer: "Voor woningen van voor 1975 is het dak of de vloer bijna altijd de moeite waard. Bij een schuin dak gaat het om de dakconstructie van binnenuit; bij een plat dak om isolatie bovenop. Woningen met een houten vloer boven een kruipruimte zijn bijna altijd geschikt voor vloerisolatie. Welk type dak of vloer je hebt en wat er al zit, bepaalt de aanpak. Gijs kijkt dat tijdens de energiescan." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. Vleermuizen, huismussen en gierzwaluwen komen voor in Enschede. Kies een isolatiebedrijf dat natuurvriendelijk werkt: dat regelt ook de melding bij de provincie." },
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, in de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs ook in de dorpen rondom Enschede?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Enschede, ook in Glanerbrug, Boekelo, Lonneker, Usselo en Twekkelo." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const ALMELO: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Almelo | Advies & ontzorging – Gijs",
    description: "Zoek je een isolatiebedrijf in Almelo? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Gemeente Almelo",
  h1: "Je woning isoleren en verduurzamen in Almelo",
  intro: [
    ["Woon je in Almelo of in de dorpen ", { tekst: "Aadorp", href: "/regio/overijssel/almelo/aadorp" }, " of ", { tekst: "Bornerbroek", href: "/regio/overijssel/almelo/bornerbroek" }, " en wil je jouw woning isoleren? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["In Almelo is ruim een kwart van de woningvoorraad in de naoorlogse periode gebouwd. Dat zijn woningen met spouwmuren, maar de spouw zit er zelden goed in. Gijs kijkt samen met jou wat er al is gedaan en adviseert over de stap die het meest zinvol is."],
  ],
  kernen: ["almelo", "aadorp", "bornerbroek"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Almelo verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "34.709", label: "woningen" },
      { waarde: "€295.000", label: "gem. WOZ-waarde" },
      { waarde: "71%", label: "eengezinswoning" },
      { waarde: "~32%", label: "tussenwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 17, tekst: "Oudere stadswoningen en arbeiderswijken uit de textielindustrie-era. Bijna altijd gebouwd zonder isolatie." },
      { label: "1945 – 1975", percentage: 25, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn er, maar de spouw is vaak nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 27, tekst: "Deels geïsoleerd, maar zelden op huidig niveau. Bijisoleren levert hier de meeste winst op." },
      { label: "Na 1995", percentage: 31, tekst: "Beter geïsoleerd. De winst zit vaker in installaties: warmtepomp, zonnepanelen of thuisbatterij." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/almelo/" },
  },
  lokaal: {
    titel: "Almelo: stad met textielgeschiedenis en naoorlogse wijken",
    alineas: [
      ["Almelo groeide groot als centrum van de Twentse textielindustrie. Na het verdwijnen van de industrie transformeerde de stad. De woningvoorraad weerspiegelt die geschiedenis: een mix van oudere arbeidswoningen, naoorlogse uitbreidingen en nieuwere wijken."],
      ["Tussenwoningen zijn het meest voorkomende type in Almelo. Dat maakt de aanpak per woning vrij uniform, maar de staat van isolatie loopt sterk uiteen. Gijs kijkt per huis wat er al is gedaan en wat de logische volgende stap is."],
      ["Op zoek naar een isolatiebedrijf in Almelo? Gijs helpt bij het isoleren van je woning, maar voert de isolatiewerkzaamheden niet zelf uit. Eerst krijg je onafhankelijk advies over passende maatregelen. Daarna begeleidt Gijs het traject van A tot Z, inclusief de uitvoering door vakexperts."],
    ],
    bekendVan: {
      titel: "Waar is Almelo bekend van?",
      kaarten: [
        { icon: "waves", titel: "Twentekanaal", tekst: "Het Almelo-Nordhorn kanaal verbond Almelo met Duitsland en speelde een cruciale rol in de aanvoer van grondstoffen voor de textielindustrie." },
        { icon: "building-2", titel: "Textielerfgoed", tekst: "In het stadscentrum en de fabriekswijken zijn nog sporen te zien van de bloeiende textielindustrie die Almelo groot maakte in de negentiende en twintigste eeuw." },
      ],
    },
    kernTekst: {
      almelo: "De stad zelf, met de meeste woningen en het stadscentrum.",
      aadorp: "Dorp ten noorden van Almelo, met overwegend eengezinswoningen.",
      bornerbroek: "Dorp ten zuiden van Almelo, met een mix van oud en nieuw.",
    },
    wijken: {
      titel: "Wijken in Almelo",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Binnenstad", woningen: 3585, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 29,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 24 }, { label: "1945 tot 1965", percentage: 5 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 30 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Riet", woningen: 3660, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 42,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 42 }, { label: "1945 tot 1965", percentage: 21 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Noorderkwartier", woningen: 2888, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 68,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 20 }, { label: "1945 tot 1965", percentage: 27 }, { label: "1965 tot 1975", percentage: 20 }, { label: "1975 tot 1985", percentage: 1 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 18 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Sluitersveld", woningen: 3191, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 53,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 9 }, { label: "1945 tot 1965", percentage: 25 }, { label: "1965 tot 1975", percentage: 2 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 18 }, { label: "2015 tot 2025", percentage: 18 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wierdense Hoek", woningen: 3106, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 46,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 12 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 51 }, { label: "1975 tot 1985", percentage: 1 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Nieuwstraat-Kwartier", woningen: 1583, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 35,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 58 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 3 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 0 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Ossenkoppelerhoek", woningen: 3234, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 41,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 20 }, { label: "1945 tot 1965", percentage: 65 }, { label: "1965 tot 1975", percentage: 1 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 2 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Hofkamp", woningen: 1759, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 64,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 18 }, { label: "1945 tot 1965", percentage: 28 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 3 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 20 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Schelfhorst", woningen: 4705, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 63,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 1 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 46 }, { label: "1975 tot 1985", percentage: 36 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Windmolenbroek", woningen: 5591, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 79,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 2 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 30 }, { label: "1985 tot 1995", percentage: 35 }, { label: "1995 tot 2005", percentage: 26 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Aadorp", woningen: 599, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 23 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bornerbroek", woningen: 808, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 78,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 18 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/almelo/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Almelo?",
      tekst: "Almelo werkt aan een warmtestrategie voor de stad en heeft aandacht voor de verduurzaming van de oudere woningvoorraad. Isoleren is hoe dan ook de logische eerste stap, ook als je niet in een aangewezen wijk woont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Almelo",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren: vleermuizen, huismussen en gierzwaluwen. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Een goed isolatiebedrijf zorgt voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-en-landschap/ontheffing-flora-faunawet/" },
  },
  faq: [
    { question: "Welke subsidies zijn er nu in Almelo?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Almelo in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn huis in Almelo is van vóór 1975. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer. Gijs kijkt wat er al is gedaan en wat de volgende logische stap is tijdens de energiescan." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. Vleermuizen, huismussen en gierzwaluwen komen voor in Almelo. Kies een isolatiebedrijf dat natuurvriendelijk werkt: dat regelt ook de melding bij de provincie." },
    { question: "Is Gijs een isolatiebedrijf in Almelo?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning in Almelo. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Aadorp en Bornerbroek. Je hoeft er zelf niet van wakker te liggen." },
    { question: "Helpt Gijs ook in Aadorp en Bornerbroek?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Almelo, ook in de dorpen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
  ],
  woningInzichtenBlok: {
    h2: "Je woning isoleren. Waar investeer je het beste als eerste in?",
    feitVariant: "subtiel",
    percentageTekst: "Almelo telt ruim 32.000 woningen, waarvan 47% koopwoning",
    bodytekst: "In Almelo staan veel naoorlogse rijtjeswoningen en tussenwoningen. De meeste hebben een spouwmuur, maar die is lang niet altijd gevuld. Tegelijk kan het dak of de vloer net zoveel warmteverlies veroorzaken. De vraag is niet of je moet isoleren, maar waar je het beste begint. Gijs kijkt wat er al is gedaan, waar de meeste winst zit en in welke volgorde het slim is om te investeren.",
    kaarten: [
      { icon: "layers", titel: "Spouw, dak of vloer?", tekst: "Bij veel woningen in Almelo is spouwmuurisolatie de snelste eerste stap. Maar als het dak al lekt of de vloer koud is, kan een andere volgorde slimmer zijn.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Lees over spouwmuurisolatie" },
      { icon: "piggy-bank", titel: "Subsidies in Almelo", tekst: "Voor isolatie en verduurzaming zijn er regelingen beschikbaar. Gijs helpt je graag bij het verzorgen van de subsidieaanvraag.", href: "/kennis#subsidies", linkTekst: "Lees over subsidies" },
    ],
    adviseur: { naam: "naud", h3: "Naud kijkt mee in Almelo", tekst: "Almelo heeft een grote, gevarieerde woningvoorraad. Naud bekijkt wat er bij jouw woning al is gedaan en welke investering nu het meeste resultaat oplevert." },
  },
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const HOF_VAN_TWENTE: GemeenteVerhaal = {
  naamDisplay: "de gemeente Hof van Twente",
  seo: {
    title: "Woning isoleren in Hof van Twente | Advies & ontzorging – Gijs",
    description: "Isolatiebedrijf in Hof van Twente nodig? Gijs geeft onafhankelijk verduurzamingsadvies voor woningen in Goor, Delden, Markelo, Diepenheim, Bentelo en Hengevelde. Gratis energiescan aan huis.",
  },
  kicker: "Gemeente Hof van Twente",
  h1: "Net zo groen worden als het Twickelse bos?",
  intro: [
    ["Hof van Twente staat bekend om zijn prachtige groene omgeving, met het Twickelse bos en Kasteel Twickel bij Delden als herkenbare plekken. Maar hoe groen is jouw woning eigenlijk? Of je nu in een karakteristieke woning in ", { tekst: "Delden", href: "/regio/overijssel/hof-van-twente/delden" }, " woont, een rijtjeswoning in ", { tekst: "Goor", href: "/regio/overijssel/hof-van-twente/goor" }, " hebt of juist wat vrijer woont in ", { tekst: "Markelo", href: "/regio/overijssel/hof-van-twente/markelo" }, ", iedere woning biedt andere mogelijkheden om te verduurzamen."],
    ["Ook in Diepenheim, Hengevelde en Bentelo vind je woningen met hun eigen kenmerken. Van oudere woningen en boerderijen in het buitengebied tot nieuwere woningen in de dorpskernen. Misschien kan jouw spouwmuur beter geïsoleerd worden, verlies je nog veel warmte via het dak of wil je eindelijk iets doen aan die koude vloer."],
  ],
  kompaktKernenKaarten: true,
  kernen: ["goor", "delden", "markelo", "diepenheim", "bentelo", "hengevelde"],
  woningen: {
    lead: "Hof van Twente heeft een overwegend landelijke woningvoorraad. Zo is die verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "15.711", label: "woningen" },
      { waarde: "€376.000", label: "gem. WOZ-waarde" },
      { waarde: "69%", label: "koopwoning" },
      { waarde: "~33%", label: "vrijstaand" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 20, tekst: "Traditionele boerderijen en dorpsbebouwing, bijna altijd gebouwd zonder isolatienormen. Hier is de verduurzamingswinst het grootst." },
      { label: "1945 – 1975", percentage: 26, tekst: "Naoorlogse woningen in de dorpskernen. Spouwmuren zijn er, maar de spouw is vaak nog leeg of dunner geïsoleerd." },
      { label: "1975 – 1995", percentage: 27, tekst: "Deels geïsoleerd, maar zelden op huidig niveau. Bijisoleren levert hier de meeste winst op." },
      { label: "Na 1995", percentage: 27, tekst: "Beter geïsoleerd. De winst zit vaker in installaties: warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/hof-van-twente/" },
  },
  lokaal: {
    titel: "Van Delden tot Bentelo",
    alineas: [
      ["De gemeente Hof van Twente bestaat uit zes kernen met ieder hun eigen karakter. Delden staat bekend om zijn historische centrum en Landgoed Twickel, Goor heeft een rijke textielgeschiedenis, Markelo ligt midden in het Twentse landschap en Diepenheim staat bekend om zijn kastelen, kunst en cultuur. Ook Hengevelde en Bentelo horen bij het karakter van Hof van Twente."],
      ["Deze verschillen zie je terug in de woningen. Van karakteristieke woningen en boerderijen tot moderne nieuwbouwwoningen. Ontdek hieronder wat er in jouw woonplaats mogelijk is."],
    ],
    bekendVan: {
      titel: "Waar is Hof van Twente bekend om?",
      kaarten: [
        { icon: "landmark", titel: "Landgoed Twickel", tekst: "Het Twickelse bos en Kasteel Twickel bij Delden zijn een van de bekendste en mooiste plekken van Hof van Twente." },
        { icon: "mountain-snow", titel: "Nationaal Landschap", tekst: "Hof van Twente ligt in het Nationaal Landschap Twente met afwisselende natuur, landgoederen en karakteristieke dorpen." },
      ],
    },
    kernTekst: {
      goor: "Het grootste dorp en centrum van de gemeente.",
      delden: "Historisch dorp met Kasteel Twickel in de nabijheid.",
      markelo: "Dorp midden in het Twentse landschap.",
      diepenheim: "Bekend om zijn kastelen, kunst en cultuur.",
      bentelo: "Landelijk dorp in het westen van de gemeente.",
      hengevelde: "Dorp met een landelijk karakter aan de Duitse grens.",
    },
    wijken: {
      titel: "Wijken in Hof van Twente",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Goor", woningen: 4134, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 58,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 19 }, { label: "1945 tot 1965", percentage: 17 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Whee II", woningen: 1498, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 2 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 40 }, { label: "1975 tot 1985", percentage: 25 }, { label: "1985 tot 1995", percentage: 16 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Markelo", woningen: 2702, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 19 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 20 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Verspreide huizen Kerspel en omgeving", woningen: 91, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 38,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 64 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 2 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Elsen", woningen: 237, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 43 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Diepenheim", woningen: 1228, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Delden", woningen: 3420, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 67,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 12 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 23 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Overig Delden", woningen: 80, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 84,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 25 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 22 }, { label: "1985 tot 1995", percentage: 20 }, { label: "1995 tot 2005", percentage: 2 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Hengevelde", woningen: 1447, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 18 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bentelo", woningen: 874, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/hof-van-twente/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Hof van Twente?",
      tekst: "Hof van Twente heeft een subsidieregeling voor woningisolatie. Isoleren loont extra in de landelijke gemeente, omdat vrijstaande woningen meer buitenoppervlak hebben. Gijs kijkt wat bij jouw situatie past.",
    },
  },
  persoonlijkAdviesBlok: {
    label: "Persoonlijk advies in Hof van Twente",
    h2: "Gijs kijkt graag even met je mee",
    alineas: [
      ["Twijfel je of jouw dak, spouwmuur of vloer goed geïsoleerd is, of ben je juist benieuwd of een warmtepomp of vloerverwarming bij jouw woning past? Gijs komt graag bij je langs voor een ", { tekst: "gratis en vrijblijvende", href: "/contact#energiescan" }, " energiescan. Samen kijken we naar jouw woning, wat er al aanwezig is en welke verduurzamingsmaatregelen voor jou interessant zijn."],
      ["Wil je daarna verder verduurzamen? Gijs begeleidt en ontzorgt je van A tot Z. Van het eerste advies tot het regelen en begeleiden van de uitvoering, zodat je er zelf zo min mogelijk omkijken naar hebt."],
    ],
    foto: "/images/over-gijs/thom/thom-portret.png",
    fotoAlt: "Thom, adviseur bij Gijs",
    ctaLabel: "Plan jouw gratis energiescan",
    ctaHref: "/contact#energiescan",
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Hof van Twente",
    lead: "In de landelijke gemeente Hof van Twente wonen beschermde vogels en vleermuizen in spouwmuren, muren en daken. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Een goed isolatiebedrijf zorgt voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-en-landschap/ontheffing-flora-faunawet/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Hof van Twente?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning in Hof van Twente. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Goor, Delden en Markelo." },
    { question: "Welke subsidies zijn er nu in Hof van Twente?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Hof van Twente in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn boerderij of vrijstaande woning is oud. Waar begin ik?", answer: "Bij vrijstaande woningen zijn dak, spouw en vloer bijna altijd de eerste stap. Hoe oud het gebouw is, maakt daarbij veel uit. Gijs kijkt wat er al is gedaan en wat de volgende logische stap is." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In de landelijke omgeving van Hof van Twente leven beschermde vogels en vleermuizen. Kies een isolatiebedrijf dat natuurvriendelijk werkt: dat regelt ook de melding bij de provincie." },
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, in de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs ook in de kleinere dorpen van Hof van Twente?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, ook in Delden, Markelo, Bentelo, Diepenheim, Hengevelde en het buitengebied." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Oldenzaal", href: "/regio/overijssel/oldenzaal" },
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const OLDENZAAL: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Oldenzaal | Gijs",
    description: "Je woning verduurzamen in Oldenzaal? Lees wat het bouwjaar zegt over jouw woning, hoe je omgaat met beschermde dieren bij isolatie, en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Oldenzaal",
  h1: "Je woning verduurzamen in Oldenzaal",
  intro: [
    ["Woon je in Oldenzaal? Ontdek welke isolatie en installaties bij jouw woning passen, welke regelingen er nu zijn en waar je rekening mee moet houden."],
    ["Bijna twee vijfde van de woningen in Oldenzaal is gebouwd in de periode 1945-1975. Juist die naoorlogse woningen hebben spouwmuren, maar de spouw zit er zelden goed in. Gijs kijkt eerst wat er al is gedaan."],
  ],
  kernen: ["oldenzaal"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Oldenzaal verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "14.974", label: "woningen" },
      { waarde: "€360.000", label: "gem. WOZ-waarde" },
      { waarde: "~34%", label: "tussenwoning" },
      { waarde: "13%", label: "gebouwd vóór 1945" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 13, tekst: "Historische bebouwing in de oude Hanzestad. Bijna altijd gebouwd zonder isolatienormen. De spouw is er vaak niet of is leeg." },
      { label: "1945 – 1975", percentage: 24, tekst: "Naoorlogse groei van de stad. Spouwmuren zijn er, maar de spouw is vaak nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 35, tekst: "De grootste bouwperiode van Oldenzaal. Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 28, tekst: "Beter geïsoleerd. De winst zit vaker in installaties: warmtepomp, zonnepanelen of thuisbatterij." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/oldenzaal/" },
  },
  lokaal: {
    titel: "Oldenzaal: van Hanzestad tot moderne woonstad",
    alineas: [
      ["Oldenzaal is een van de oudste steden van Twente en heeft een rijke geschiedenis als Hanzestad. Het middeleeuwse stadshart met de Basiliek van de heilige Plechelmus trekt bezoekers uit de regio. Omheen groeit een moderne stad met gevarieerde wijken."],
      ["De naoorlogse uitbreidingen bepalen het grootste deel van de woningvoorraad. In die wijken is de spouw er wel, maar zit er zelden al goede isolatie in. Gijs kijkt wat er al is gedaan en helpt je met de volgende stap."],
    ],
    bekendVan: {
      titel: "Waar is Oldenzaal bekend van?",
      kaarten: [
        { icon: "landmark", titel: "Basiliek Sint-Plechelmus", tekst: "De middeleeuwse Romaanse basiliek in het hart van de stad is een rijksmonument en een van de oudste kerken van Twente." },
        { icon: "history", titel: "Hanzestad", tekst: "Oldenzaal was als Hanzestad eeuwenlang een belangrijk handelscentrum op de route tussen Nederland en Duitsland." },
      ],
    },
    kernTekst: {
      oldenzaal: "Compacte Twentse stad met een rijke historische binnenstad.",
    },
    wijken: {
      titel: "Wijken in Oldenzaal",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Binnenstad", woningen: 1633, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 29,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 6 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 28 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Het Inslag-De Kleies", woningen: 1338, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 49,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 37 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Glinde-Hooiland", woningen: 1773, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 47,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 46 }, { label: "1965 tot 1975", percentage: 2 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 1 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Meijbree", woningen: 539, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 70,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 24 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 26 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Haerbroek-Scholtenhoek", woningen: 857, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 77,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 19 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 21 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Zuid-Berghuizen", woningen: 1913, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 54,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 5 }, { label: "1945 tot 1965", percentage: 58 }, { label: "1965 tot 1975", percentage: 22 }, { label: "1975 tot 1985", percentage: 1 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 0 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Hanzepoort", woningen: 22, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 91,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 39 }, { label: "1945 tot 1965", percentage: 17 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 22 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Eekte-Hazewinkel", woningen: 84, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 71,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 31 }, { label: "1945 tot 1965", percentage: 27 }, { label: "1965 tot 1975", percentage: 22 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 0 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Jufferbeek", woningen: 36, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 78,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 44 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 0 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 0 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Het Hulsbeek", woningen: 153, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 56,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 38 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Thij", woningen: 2632, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 68,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 0 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 82 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 2 }, { label: "1995 tot 2005", percentage: 0 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Graven Es", woningen: 2086, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 0 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 31 }, { label: "1995 tot 2005", percentage: 31 }, { label: "2005 tot 2015", percentage: 23 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Essen", woningen: 1847, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 2 }, { label: "1945 tot 1965", percentage: 1 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 54 }, { label: "1985 tot 1995", percentage: 39 }, { label: "1995 tot 2005", percentage: 2 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bekspring", woningen: 61, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 93,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 50 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 1 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 15 }, { label: "2025 en later", percentage: 7 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/oldenzaal/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Oldenzaal?",
      tekst: "Oldenzaal heeft een subsidieregeling voor woningisolatie. De gemeente stimuleert bewoners actief om te verduurzamen. Isoleren is hoe dan ook de logische eerste stap.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Oldenzaal",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren: vleermuizen, huismussen en gierzwaluwen. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Een goed isolatiebedrijf zorgt voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-en-landschap/ontheffing-flora-faunawet/" },
  },
  faq: [
    { question: "Welke subsidies zijn er nu in Oldenzaal?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Oldenzaal in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning in Oldenzaal is van vóór 1975. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer. Gijs kijkt wat er al is gedaan en wat de volgende logische stap is." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In Oldenzaal wonen vleermuizen, huismussen en gierzwaluwen in muren en daken. Kies een isolatiebedrijf dat natuurvriendelijk werkt." },
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, in de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs in de hele gemeente Oldenzaal?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Oldenzaal." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
  ],
  woningInzichtenBlok: {
    h2: "Je woning laten isoleren, zonder alles zelf te hoeven regelen",
    feitVariant: "subtiel",
    percentageTekst: "Oldenzaal telt ruim 13.000 woningen, waarvan 62% koopwoning",
    bodytekst: "Je wilt je woning verduurzamen, maar waar begin je? En hoe weet je of een isolatiebedrijf goed werk levert? In Oldenzaal zijn veel woningen uit de naoorlogse periode, toen isolatienormen nog niet bestonden. Gijs neemt het hele traject uit handen: van het eerste advies tot de oplevering door vakspecialisten. Zo hoef je het niet zelf uit te zoeken.",
    kaarten: [
      { icon: "shield-check", titel: "Onafhankelijk advies, geen verkooppraatje", tekst: "Gijs is geen isolatiebedrijf. Je krijgt eerst eerlijk advies over wat bij jouw woning past. Pas daarna wordt er iets uitgevoerd.", href: "/zo-werkt-gijs", linkTekst: "Lees hoe Gijs werkt" },
      { icon: "layers", titel: "Spouwmuurisolatie in Oldenzaal", tekst: "Veel naoorlogse woningen in Oldenzaal hebben een lege spouw. Spouwmuurisolatie is dan de snelste maatregel met het meeste resultaat.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Lees over spouwmuurisolatie" },
    ],
    adviseur: { naam: "naud", h3: "Naud helpt je verder in Oldenzaal", tekst: "Veel bewoners in Oldenzaal weten dat er iets te verbeteren valt, maar niet precies wat of in welke volgorde. Naud kijkt naar jouw situatie en maakt er een helder plan van." },
  },
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const HELLENDOORN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Hellendoorn | Gijs",
    description: "Op zoek naar een isolatiebedrijf in Hellendoorn of Nijverdal? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Gemeente Hellendoorn",
  h1: "Je woning verduurzamen in Hellendoorn",
  intro: [
    ["Woon je in de gemeente Hellendoorn, in ", { tekst: "Nijverdal", href: "/regio/overijssel/hellendoorn/nijverdal" }, ", ", { tekst: "Haarle", href: "/regio/overijssel/hellendoorn/haarle" }, " of het buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen."],
    ["Bijna twee derde van de woningen in de gemeente Hellendoorn is gebouwd vóór 1995. In die woningen is er vrijwel altijd verduurzamingspotentieel. Gijs kijkt wat logisch is als eerste stap."],
  ],
  kernen: ["hellendoorn", "nijverdal", "haarle", "daarle"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van de gemeente Hellendoorn verdeeld.",
    kerncijfers: [
      { waarde: "15.194", label: "woningen" },
      { waarde: "€395.000", label: "gem. WOZ-waarde" },
      { waarde: "~28%", label: "vrijstaand" },
      { waarde: "14%", label: "gebouwd vóór 1945" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 14, tekst: "Traditionele bebouwing in de dorpen. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier de eerste winst." },
      { label: "1945 – 1975", percentage: 22, tekst: "Naoorlogse woningen, overwegend in Nijverdal. Spouwmuren zijn er, maar de spouw is vaak leeg of dunner geïsoleerd dan nu." },
      { label: "1975 – 1995", percentage: 29, tekst: "De grootste bouwperiode. Deels geïsoleerd, maar bijna altijd te verbeteren. Bijisoleren levert hier de meeste winst." },
      { label: "Na 1995", percentage: 35, tekst: "Beter geïsoleerd. De winst zit vaker in installaties: warmtepomp, zonnepanelen of een thuisbatterij." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/hellendoorn/" },
  },
  lokaal: {
    titel: "Hellendoorn: van Sallandse natuur tot Nijverdal",
    alineas: [
      ["De gemeente Hellendoorn omvat Nijverdal als voornaamste woonkern en de kleinere dorpen Hellendoorn, Haarle, Daarle en Daarlerveen. De ligging aan de rand van de Sallandse Heuvelrug maakt de gemeente een groene omgeving met een mix van woontypen."],
      ["Vrijstaande woningen zijn goed vertegenwoordigd, zeker in de kleinere dorpen. In Nijverdal overheerst de eengezinswoning. Gijs kijkt per woning wat de meest zinvolle stap is."],
    ],
    bekendVan: {
      titel: "Waar is Hellendoorn bekend van?",
      kaarten: [
        { icon: "ferris-wheel", titel: "Avonturenpark Hellendoorn", tekst: "Een van de grootste pretparken van Nederland, gevestigd bij het dorp Hellendoorn in een bosrijke omgeving." },
        { icon: "tree-pine", titel: "Sallandse Heuvelrug", tekst: "De Sallandse Heuvelrug, een van de grootste stuifzandgebieden van Oost-Nederland, grenst aan de gemeente. Bij Haarle liggen uitgestrekte heidelandschappen." },
      ],
    },
    kernTekst: {
      hellendoorn: "Het historische dorp, herkenbaar door het pretpark en de bosrijke omgeving.",
      nijverdal: "De grootste woonkern van de gemeente, met het meeste voorzieningenaanbod.",
      haarle: "Klein dorp aan de rand van de Sallandse Heuvelrug, met overwegend vrijstaande woningen.",
      daarle: "Dorp in het landelijke deel van de gemeente.",
    },
    wijken: {
      titel: "Wijken in Hellendoorn",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Hellendoorn", woningen: 1857, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 73,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 33 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Nijverdal Noord", woningen: 763, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 89,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 47 }, { label: "1945 tot 1965", percentage: 28 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 3 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 2 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Nijverdal West", woningen: 3136, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 30 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 15 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Nijverdal Oost", woningen: 3915, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 64,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 36 }, { label: "1975 tot 1985", percentage: 27 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Buitengebied", woningen: 1900, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 84,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 32 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Kruidenwijk", woningen: 2588, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 1 }, { label: "1945 tot 1965", percentage: 1 }, { label: "1965 tot 1975", percentage: 1 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 51 }, { label: "1995 tot 2005", percentage: 25 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Haarle", woningen: 475, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 4 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 22 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 16 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Daarle", woningen: 231, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Daarlerveen", woningen: 329, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 77,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 15 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/hellendoorn/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Hellendoorn?",
      tekst: "Hellendoorn heeft een subsidieregeling voor woningisolatie en stimuleert bewoners actief om te verduurzamen. Isoleren is hoe dan ook de logische eerste stap, ook buiten de subsidietermijnen om.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Hellendoorn",
    lead: "In de gemeente Hellendoorn wonen beschermde vleermuizen, huismussen en gierzwaluwen in spouwmuren, muren en daken. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Een goed isolatiebedrijf zorgt voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-en-landschap/ontheffing-flora-faunawet/" },
  },
  faq: [
    { question: "Welke subsidies zijn er nu in Hellendoorn?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Hellendoorn in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer. Gijs kijkt wat er al is gedaan en wat de volgende logische stap is." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In de gemeente Hellendoorn wonen beschermde vleermuizen, huismussen en gierzwaluwen. Kies een isolatiebedrijf dat natuurvriendelijk werkt." },
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, in de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs ook in Nijverdal, Haarle en Daarlerveen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hellendoorn, ook in alle dorpen." },
    { question: "Is Gijs een isolatiebedrijf in Hellendoorn?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning. Vervolgens begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, zodat je er zelf niet van wakker hoeft te liggen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
  ],
  woningInzichtenBlok: {
    h2: "Je woning isoleren. Wat kost het en welke subsidie is mogelijk?",
    feitVariant: 'cirkel',
    percentage: "58%",
    percentageTekst: "van de woningen in de woonplaats Hellendoorn is gebouwd vóór 1975",
    bodytekst: "Wil je jouw woning beter isoleren, dan wil je weten welke maatregel geschikt is en wat de investering uiteindelijk kost. Mogelijke subsidies kunnen daarbij een belangrijke rol spelen. Toch verschilt de beschikbare ondersteuning per woning, maatregel en regeling. Het is daarom verstandig om eerst te onderzoeken welke isolatie al aanwezig is en voor welke verbeteringen je in aanmerking komt. Zo kun je de kosten, mogelijke besparing en beschikbare financiële ondersteuning beter tegen elkaar afwegen.",
    kaarten: [
      { icon: "banknote", titel: "Kom ik in aanmerking voor isolatiesubsidie?", tekst: "Controleer de actuele gemeentelijke en landelijke regelingen. De voorwaarden en vergoedingen kunnen veranderen en verschillen per woning.", href: "/kennis#subsidies", linkTekst: "Bekijk subsidiemogelijkheden" },
      { icon: "layers", titel: "Welke isolatie is de investering waard?", tekst: "De grootste verbetering hangt af van je woning en de bestaande isolatie. Vergelijk comfort, kosten en mogelijke besparing voordat je beslist.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Bekijk isolatiemaatregelen" },
    ],
    adviseur: { naam: "thom", h3: "Thom kijkt graag met je mee", tekst: "Wil je jouw woning in Hellendoorn isoleren en weten welke financiële ondersteuning mogelijk is? Thom helpt je inzicht te krijgen in passende maatregelen en de aandachtspunten bij de investering. Gijs begeleidt je van de eerste keuzes tot de uitvoering." },
  },
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const RIJSSEN_HOLTEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Rijssen-Holten | Advies & ontzorging – Gijs",
    description: "Op zoek naar een isolatiebedrijf in Rijssen of Holten? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, met oog voor beschermde dieren bij isolatie. Gratis energiescan.",
  },
  kicker: "Gemeente Rijssen-Holten",
  h1: "Je woning isoleren en verduurzamen in Rijssen-Holten",
  intro: [
    ["Woon je in ", { tekst: "Rijssen", href: "/regio/overijssel/rijssen-holten/rijssen" }, " of ", { tekst: "Holten", href: "/regio/overijssel/rijssen-holten/holten" }, "? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu zijn."],
    ["Met een gemiddelde WOZ-waarde van €386.000 en een groot aandeel vrijstaande woningen is verduurzaming in Rijssen-Holten vaak een bewuste keuze. Gijs kijkt wat bij jouw woning past."],
  ],
  kernen: ["rijssen-holten", "rijssen", "holten"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Rijssen-Holten verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "15.310", label: "woningen" },
      { waarde: "€386.000", label: "gem. WOZ-waarde" },
      { waarde: "~25%", label: "vrijstaand" },
      { waarde: "17%", label: "gebouwd vóór 1945" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 17, tekst: "Traditionele bebouwing in de historische kernen. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier de eerste winst." },
      { label: "1945 – 1975", percentage: 26, tekst: "Naoorlogse groei in Rijssen en Holten. Spouwmuren zijn er, maar de spouw is vaak leeg of dunner geïsoleerd." },
      { label: "1975 – 1995", percentage: 29, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren. Bijisoleren levert hier de meeste winst." },
      { label: "Na 1995", percentage: 28, tekst: "Beter geïsoleerd. De winst zit vaker in installaties: warmtepomp, zonnepanelen of thuisbatterij." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/rijssen-holten/" },
  },
  lokaal: {
    titel: "Rijssen-Holten: twee kernen, eigen karakter",
    alineas: [
      ["De gemeente Rijssen-Holten bestaat uit twee duidelijk verschillende kernen. Rijssen heeft een compacte binnenstad met een religieuze identiteit en een actieve woningmarkt. Holten ligt aan de rand van de Sallandse Heuvelrug en heeft een meer toeristisch karakter."],
      ["De woningvoorraad is gevarieerd: in Rijssen meer tussenwoningen en twee-onder-een-kap, in Holten meer vrijstaande woningen in een groenere omgeving. Gijs kijkt per woning naar de beste aanpak."],
    ],
    bekendVan: {
      titel: "Waar is Rijssen-Holten bekend van?",
      kaarten: [
        { icon: "tree-pine", titel: "Sallandse Heuvelrug", tekst: "Holten ligt aan de voet van de Sallandse Heuvelrug, met uitgestrekte heide, bossen en de markante Holterberg." },
        { icon: "flag", titel: "Canadees Ereveld Holten", tekst: "Op het Canadees Ereveld in Holten liggen meer dan 1.300 Canadese soldaten begraven die in de Tweede Wereldoorlog sneuvelden in Oost-Nederland." },
      ],
    },
    kernTekst: {
      "rijssen-holten": "De gemeente, met Rijssen en Holten als twee gelijkwaardige kernen.",
      rijssen: "Compacte stad met een rijke textielgeschiedenis en actieve woningmarkt.",
      holten: "Dorp aan de Sallandse Heuvelrug, met een toeristisch en groen karakter.",
    },
    wijken: {
      titel: "Wijken in Rijssen-Holten",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Stad Rijssen", woningen: 2555, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 66,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 22 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 16 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Buitengebied Rijssen", woningen: 234, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 84,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Holten", woningen: 3156, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 7 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 27 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bedrijventerrein Holten", woningen: 14, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 71,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 7 }, { label: "1945 tot 1965", percentage: 21 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 36 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Buitengebied Holten", woningen: 889, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 84,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 33 }, { label: "1945 tot 1965", percentage: 18 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bedrijventerrein Rijssen", woningen: 136, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 71,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 5 }, { label: "1945 tot 1965", percentage: 2 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 22 }, { label: "1985 tot 1995", percentage: 22 }, { label: "1995 tot 2005", percentage: 34 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Recreatiegebied De Borkeld", woningen: 25, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 92,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 3 }, { label: "1945 tot 1965", percentage: 53 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 28 }, { label: "2025 en later", percentage: 6 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Stadsrand Rijssen Noord", woningen: 2224, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 4 }, { label: "1945 tot 1965", percentage: 3 }, { label: "1965 tot 1975", percentage: 1 }, { label: "1975 tot 1985", percentage: 2 }, { label: "1985 tot 1995", percentage: 27 }, { label: "1995 tot 2005", percentage: 34 }, { label: "2005 tot 2015", percentage: 28 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Stadsrand Rijssen Zuid", woningen: 4990, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 59,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 4 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 35 }, { label: "1975 tot 1985", percentage: 22 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Stadsrand Rijssen Oost", woningen: 1087, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 4 }, { label: "1965 tot 1975", percentage: 2 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 33 }, { label: "2025 en later", percentage: 15 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/rijssen-holten/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Rijssen-Holten?",
      tekst: "Rijssen-Holten heeft een subsidieregeling voor woningisolatie en stimuleert bewoners actief. Isoleren loont extra bij vrijstaande woningen vanwege het grotere buitenoppervlak. Gijs kijkt wat bij jouw situatie past.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Rijssen-Holten",
    lead: "In de gemeente Rijssen-Holten wonen beschermde vleermuizen, huismussen en gierzwaluwen in spouwmuren, muren en daken. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Een goed isolatiebedrijf zorgt voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-en-landschap/ontheffing-flora-faunawet/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Rijssen-Holten?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, zowel in Rijssen als in Holten." },
    { question: "Welke subsidies zijn er nu in Rijssen-Holten?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Rijssen-Holten in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer. Gijs kijkt wat er al is gedaan en wat de volgende logische stap is." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In Rijssen-Holten wonen beschermde vleermuizen, huismussen en gierzwaluwen. Kies een isolatiebedrijf dat natuurvriendelijk werkt." },
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, in de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs ook in Rijssen en Holten?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Rijssen-Holten, zowel in Rijssen als in Holten en de kleinere kernen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Borne", href: "/regio/overijssel/borne" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const TWENTERAND: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Twenterand | Gijs",
    description: "Je woning verduurzamen in Twenterand, Vriezenveen, Vroomshoop of Den Ham? Lees wat het bouwjaar zegt en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Twenterand",
  h1: "Je woning verduurzamen in Twenterand",
  intro: [
    ["Woon je in de gemeente Twenterand, in ", { tekst: "Vriezenveen", href: "/regio/overijssel/twenterand/vriezenveen" }, ", ", { tekst: "Vroomshoop", href: "/regio/overijssel/twenterand/vroomshoop" }, " of ", { tekst: "Den Ham", href: "/regio/overijssel/twenterand/den-ham" }, "? Ontdek welke isolatie en installaties bij jouw woning passen."],
    ["Met ruim een derde vrijstaande woningen en een WOZ-waarde van gemiddeld €354.000 is Twenterand een landelijke gemeente waar verduurzaming per woning een andere aanpak vraagt. Gijs kijkt wat bij jouw huis past."],
  ],
  kernen: ["vriezenveen", "vroomshoop", "den-ham"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Twenterand verdeeld.",
    kerncijfers: [
      { waarde: "14.192", label: "woningen" },
      { waarde: "€354.000", label: "gem. WOZ-waarde" },
      { waarde: "~33%", label: "vrijstaand" },
      { waarde: "13%", label: "gebouwd vóór 1945" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 13, tekst: "Traditionele bebouwing in de veenkoloniale dorpen. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn de eerste winst." },
      { label: "1945 – 1975", percentage: 20, tekst: "Naoorlogse groei in de dorpen. Spouwmuren zijn er, maar de spouw is vaak leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 31, tekst: "De grootste bouwperiode in Twenterand. Deels geïsoleerd, maar bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 36, tekst: "Beter geïsoleerd. De aandacht verschuift naar installaties: warmtepomp, zonnepanelen of thuisbatterij." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/twenterand/" },
  },
  lokaal: {
    titel: "Twenterand: veenkoloniale linten en moderne woonkernen",
    alineas: [
      ["De gemeente Twenterand omvat een reeks dorpen in het noorden van Twente, van Vriezenveen tot Den Ham. De bebouwing heeft deels een veenkoloniaal karakter: lange linten, ruime kavels en vrijstaande woningen."],
      ["Die lintbebouwing maakt de woningvoorraad gevarieerd in bouwjaar en type. Een oud woonhuis aan de Vriezenveenseweg vraagt een andere aanpak dan een nieuwbouwwoning in Vroomshoop. Gijs kijkt per woning naar de beste volgorde."],
    ],
    bekendVan: {
      titel: "Waar is Twenterand bekend van?",
      kaarten: [
        { icon: "globe", titel: "Vriezenveen en de Russenhandel", tekst: "Vriezenveen was eeuwenlang bekend om de 'Russenhandel': inwoners trokken als rondreizende kooplieden tot diep in Rusland om linnen te verkopen." },
        { icon: "tree-pine", titel: "Veenkoloniaal landschap", tekst: "De gemeente ligt in een typisch veenkoloniaal landschap, met lange rechte kanalen, linten en open akkerland." },
      ],
    },
    kernTekst: {

      vriezenveen: "Het grootste dorp van de gemeente, met een rijke handelsgeschiedenis.",
      vroomshoop: "Woonkern in het midden van de gemeente.",
      "den-ham": "Dorp aan de rand van het Sallandse Heuvelrug-gebied.",
    },
    wijken: {
      titel: "Wijken in Twenterand",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Vriezenveen (kern)", woningen: 5417, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 67,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 13 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 15 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Westerhaar-Vriezenveensewijk", woningen: 1986, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 53,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 19 }, { label: "1975 tot 1985", percentage: 23 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Den Ham", woningen: 2384, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 77,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 20 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Vroomshoop", woningen: 4000, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 66,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 20 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Buitengebied Vriezenveen Noord", woningen: 331, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 22 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Buitengebied Vriezenveen Zuid", woningen: 74, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 61,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 32 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/twenterand/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Twenterand?",
      tekst: "Twenterand heeft een subsidieregeling voor woningisolatie en stimuleert verduurzaming actief. In de landelijke gemeente telt isolatie van het dak en de schil extra zwaar mee, zeker bij vrijstaande woningen.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Twenterand",
    lead: "In de gemeente Twenterand wonen beschermde vleermuizen, huismussen en gierzwaluwen in spouwmuren, muren en daken. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Een goed isolatiebedrijf zorgt voor vervangende plekken, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te doen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een vergunning aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-en-landschap/ontheffing-flora-faunawet/" },
  },
  faq: [
    { question: "Welke subsidies zijn er nu in Twenterand?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Twenterand in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer. Gijs kijkt wat er al is gedaan en wat de volgende logische stap is." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In Twenterand wonen beschermde vleermuizen, huismussen en gierzwaluwen. Kies een isolatiebedrijf dat natuurvriendelijk werkt." },
    { question: "Mijn woning staat vrijstaand. Heeft dat invloed op de aanpak?", answer: "Ja. Een vrijstaande woning heeft meer buitenmuur, dak en vloer. Goede isolatie van de schil telt daardoor zwaarder mee. Gijs bekijkt de combinatie van schil en installaties in de juiste volgorde." },
    { question: "Helpt Gijs ook in Vriezenveen, Vroomshoop en Den Ham?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Twenterand, ook in alle dorpen en het buitengebied." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
  ],
};

// ─── PlaatsVerhalen Hengelo ───────────────────────────────────────────────────

const BECKUM: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Beckum | Gijs",
    description: "Je woning verduurzamen in Beckum? Lees wat het bouwjaar zegt, hoe gemeente Hengelo omgaat met isoleren, en welke subsidies er nu zijn.",
  },
  kicker: "Dorp in gemeente Hengelo",
  h1: "Je woning verduurzamen in Beckum",
  intro: [
    ["Woon je in Beckum of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen, welke regelingen er nu in de gemeente ", { tekst: "Hengelo", href: "/regio/overijssel/hengelo" }, " zijn en waar je rekening mee moet houden."],
    ["Beckum is een klein dorp met overwegend vrijstaande woningen. Met meer buitenoppervlak per woning weegt goede isolatie van dak, spouw en vloer hier extra zwaar. Gijs kijkt eerst wat er al is gedaan en helpt je met de logische volgende stap."],
  ],
  kernen: ["beckum", "hengelo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Beckum verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "214", label: "woningen" },
      { waarde: "43%", label: "vrijstaand" },
      { waarde: "77%", label: "koopwoning" },
      { waarde: "44%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 10, tekst: "Boerderijen en historische lintbebouwing langs de doorgaande wegen. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 34, tekst: "Naoorlogse woonuitbreiding van het dorp. Spouwmuren zijn er, maar de spouw is vaak nog leeg." },
      { label: "1975 – 1995", percentage: 37, tekst: "De grootste bouwgolf in Beckum. Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 20, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Beckum (kern), 2026", url: "https://www.allecijfers.nl/buurt/beckum-kern-hengelo/" },
  },
  lokaal: {
    titel: "Beckum: groen dorp aan de rand van Hengelo",
    alineas: [
      ["Beckum is een klein landelijk dorp op de grens van Hengelo en het Twentse buitengebied. Het dorp heeft een rustig karakter, met veel groen en vrijstaande woningen langs de doorgaande wegen. De Deurningerbeek en de omliggende landbouwpercelen geven het dorp zijn open karakter."],
      ["Vrijstaande woningen in Beckum hebben meer buitenoppervlak dan tussenwoningen in de stad, waardoor isolatie van dak, gevels en vloer verhoudingsgewijs meer effect heeft. De ruime percelen bieden ook goede condities voor zonnepanelen."],
    ],
    kernTekst: {
      beckum: "Je bent hier. Klein landelijk dorp aan de rand van Hengelo.",
      hengelo: "De gemeente, met de meeste woningen en voorzieningen.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hengelo?",
      tekst: "Hengelo werkt aan een wijkgerichte warmteaanpak. Voor bewoners in het buitengebied en dorpen als Beckum geldt dat isoleren nu de logische eerste stap is, los van wanneer de gemeente met een alternatief warmtenet of -plan komt.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hengelo",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren: vleermuizen, huismussen en gierzwaluwen. Bij isolatie in Beckum moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Beckum?", answer: "Beckum valt onder de gemeente Hengelo. De regelingen van Hengelo gelden dus ook in Beckum. Op deze pagina staan de actuele regelingen uit de Energiesubsidiewijzer van Milieu Centraal." },
    { question: "Mijn woning in Beckum staat vrijstaand. Hoe pak ik dat aan?", answer: "Vrijstaande woningen hebben meer buitenoppervlak. Isolatie van dak, spouw en vloer loont daardoor verhoudingsgewijs meer. Gijs bekijkt de juiste volgorde tijdens de energiescan." },
    { question: "Kan ik in Beckum een warmtepomp plaatsen?", answer: "In de meeste vrijstaande woningen is dat mogelijk, maar de toepasbaarheid hangt af van isolatiegraad en warmtevraag. Gijs kijkt of eerst isoleren de logische stap is." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime percelen en weinig beschaduwing in Beckum maken zonnepanelen interessant. Gijs kijkt naar de combinatie van isolatie en installaties." },
    { question: "Helpt Gijs ook in Beckum?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hengelo, dus ook in Beckum en het buitengebied." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
  ],
};

// ─── PlaatsVerhalen Enschede ──────────────────────────────────────────────────

const BOEKELO: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Boekelo | Gijs",
    description: "Je woning verduurzamen in Boekelo? Lees wat het bouwjaar zegt, de regels rondom beschermde dieren bij isolatie en welke subsidies er nu zijn in gemeente Enschede.",
  },
  kicker: "Dorp in gemeente Enschede",
  h1: "Je woning verduurzamen in Boekelo",
  intro: [
    ["Woon je in Boekelo of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Enschede", href: "/regio/overijssel/enschede" }, " zijn."],
    ["Boekelo heeft een gevarieerde woningvoorraad, van oudere vrijstaande woningen langs de historische linten tot modernere woningen in de woonstraten. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["boekelo", "enschede", "glanerbrug", "lonneker", "usselo", "twekkelo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Boekelo verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "1.176", label: "woningen" },
      { waarde: "20%", label: "vrijstaand" },
      { waarde: "80%", label: "koopwoning" },
      { waarde: "63%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 13, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd zonder isolatie gebouwd." },
      { label: "1945 – 1975", percentage: 50, tekst: "Naoorlogse uitbreiding van het dorp. Spouwmuren zijn er, maar de spouw is vaak leeg." },
      { label: "1975 – 1995", percentage: 15, tekst: "De grootste bouwgolf. Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 22, tekst: "Beter geïsoleerd. De winst zit vaker in installaties of beter glas." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Boekelo, 2026", url: "https://www.allecijfers.nl/buurt/dorp-boekelo-enschede/" },
  },
  lokaal: {
    titel: "Boekelo: kuuroord met een eigen dorpskarakter",
    alineas: [
      ["Boekelo is bekend als kuuroord, dankzij de zoutbronnen die er in de negentiende eeuw werden ontdekt. Het dorp ligt op de grens van Enschede en Hengelo, in een afwisselend landschap van bossen, heidevelden en akkers."],
      ["Met een relatief groot aandeel vrijstaande en twee-onder-een-kapwoningen heeft Boekelo een ander verduurzamingsprofiel dan de compactere wijken in Enschede. Goede dakisolatie en zonnepanelen zijn hier verhoudingsgewijs interessant."],
    ],
    bekendVan: {
      titel: "Waar is Boekelo bekend van?",
      kaarten: [
        { icon: "waves", titel: "Boekelosezoutbronnen", tekst: "In de negentiende eeuw werden in Boekelo zoutbronnen ontdekt. Dit leidde tot de oprichting van een kuurbad, dat het dorp jarenlang op de kaart zette." },
      ],
    },
    kernTekst: {
      boekelo: "Je bent hier. Kuuroord met een landelijk karakter.",
      enschede: "De gemeentekern, met de meeste woningen en voorzieningen.",
      glanerbrug: "Grensdorp op de rand van Duitsland.",
      lonneker: "Landelijk dorp in het noorden van Enschede.",
      usselo: "Klein dorp in het zuidoosten van Enschede.",
      twekkelo: "Klein dorp op de grens met Hengelo.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Enschede?",
      tekst: "Enschede werkt aan een wijkgerichte warmtetransitie. Voor bewoners in dorpen als Boekelo geldt dat isoleren nu al loont, ongeacht de keuze voor een warmtenet of -bron in de toekomst.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Enschede",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren: vleermuizen, huismussen en gierzwaluwen. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de constructie." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Boekelo?", answer: "Boekelo valt onder de gemeente Enschede. De regelingen van Enschede gelden dus ook in Boekelo. Op deze pagina staan de actuele regelingen uit de Energiesubsidiewijzer." },
    { question: "Mijn woning staat vrijstaand. Hoe pak ik dat aan?", answer: "Vrijstaande woningen hebben meer buitenoppervlak. Isolatie van dak, spouw en vloer loont daardoor meer. Gijs bekijkt de juiste volgorde tijdens de energiescan." },
    { question: "Kijkt Gijs ook naar zonnepanelen in Boekelo?", answer: "Ja. Ruime percelen en weinig beschaduwing in Boekelo maken zonnepanelen interessant. Gijs kijkt naar de combinatie van isolatie en installaties." },
    { question: "Helpt Gijs ook in Boekelo?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Enschede, dus ook in Boekelo en de andere dorpen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
  ],
};

const GLANERBRUG: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Glanerbrug | Gijs",
    description: "Je woning verduurzamen in Glanerbrug? Lees wat het bouwjaar zegt, hoe gemeente Enschede omgaat met verduurzaming en welke subsidies er nu zijn.",
  },
  kicker: "Woonkern in gemeente Enschede",
  h1: "Je woning verduurzamen in Glanerbrug",
  intro: [
    ["Woon je in Glanerbrug? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Enschede", href: "/regio/overijssel/enschede" }, " zijn."],
    ["Glanerbrug is een compacte woonkern direct aan de Duitse grens. De naoorlogse woningbouw domineert, wat betekent dat spouwmuurisolatie hier voor veel woningen de eerste en meest effectieve stap is."],
  ],
  kernen: ["glanerbrug", "enschede", "boekelo", "lonneker", "usselo", "twekkelo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Glanerbrug verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "7.201", label: "woningen" },
      { waarde: "12%", label: "vrijstaand" },
      { waarde: "64%", label: "koopwoning" },
      { waarde: "41%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 17, tekst: "Oorspronkelijke bebouwing langs de grensdoorgangen. Gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 24, tekst: "Massale naoorlogse uitbreiding. Spouwmuren zijn aanwezig, maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 32, tekst: "Verder uitgebouwd. Deels geïsoleerd, maar zelden op huidig niveau." },
      { label: "Na 1995", percentage: 27, tekst: "Beter geïsoleerd. De winst zit vaker in installaties of beter glas." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Glanerbrug en omgeving, 2026", url: "https://www.allecijfers.nl/wijk/glanerbrug-en-omgeving-enschede/" },
  },
  lokaal: {
    titel: "Glanerbrug: grensdorp met een compacte woningvoorraad",
    alineas: [
      ["Glanerbrug ligt direct aan de grens met Duitsland, op enkele minuten van Gronau. De kern groeide sterk in de naoorlogse jaren, waardoor rijtjeswoningen en kleine twee-onder-een-kapwoningen de woningvoorraad domineren."],
      ["Het hoge aandeel naoorlogse woningen maakt spouwmuurisolatie voor veel bewoners de eerste en meest effectieve stap. In woningen met een al gevulde spouw is beter glas of een warmtepomp de logische volgende stap."],
    ],
    kernTekst: {
      glanerbrug: "Je bent hier. Compacte woonkern direct aan de Duitse grens.",
      enschede: "De gemeentekern, met de meeste woningen en voorzieningen.",
      boekelo: "Kuuroord met een landelijk karakter.",
      lonneker: "Landelijk dorp in het noorden van Enschede.",
      usselo: "Klein dorp in het zuidoosten van Enschede.",
      twekkelo: "Klein dorp op de grens met Hengelo.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Enschede?",
      tekst: "Enschede werkt aan een wijkgerichte warmtetransitie. Voor naoorlogse wijken zoals grote delen van Glanerbrug geldt dat isoleren nu al loont en een goede voorbereiding is op een toekomstige warmtebron.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Enschede",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren: vleermuizen, huismussen en gierzwaluwen. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de constructie." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Glanerbrug?", answer: "Glanerbrug valt onder de gemeente Enschede. De regelingen van Enschede gelden dus ook in Glanerbrug. Op deze pagina staan de actuele regelingen uit de Energiesubsidiewijzer." },
    { question: "Mijn naoorlogse woning heeft een spouw. Moet ik die vullen?", answer: "Dat hangt af van de staat van de woning en wat er al is gedaan. Spouwmuurisolatie is voor veel naoorlogse woningen de meest effectieve stap, maar Gijs kijkt altijd eerst naar jouw eigen huis." },
    { question: "Kan ik subsidie combineren met de ISDE?", answer: "Vaak wel, maar dat hangt af van de specifieke voorwaarden. Gijs bekijkt dat met je tijdens de energiescan en helpt bij de aanvraag." },
    { question: "Helpt Gijs ook in Glanerbrug?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Enschede, dus ook in Glanerbrug." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
  ],
};

const LONNEKER: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Lonneker | Gijs",
    description: "Je woning verduurzamen in Lonneker? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Enschede.",
  },
  kicker: "Dorp in gemeente Enschede",
  h1: "Je woning verduurzamen in Lonneker",
  intro: [
    ["Woon je in Lonneker of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Enschede", href: "/regio/overijssel/enschede" }, " zijn."],
    ["Lonneker is een klein agrarisch dorp in het noorden van Enschede, met een gemengde woningvoorraad van boerderijen, vrijstaande woningen en kleinschalige woonbuurten. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["lonneker", "enschede", "boekelo", "glanerbrug", "usselo", "twekkelo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Lonneker verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "828", label: "woningen" },
      { waarde: "23%", label: "vrijstaand" },
      { waarde: "82%", label: "koopwoning" },
      { waarde: "69%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 20, tekst: "Agrarische bebouwing en historische boerderijen. Bijna altijd zonder isolatienormen gebouwd." },
      { label: "1945 – 1975", percentage: 49, tekst: "Naoorlogse woningbouw. Spouwmuren zijn er, maar de spouw is vaak nog leeg." },
      { label: "1975 – 1995", percentage: 21, tekst: "Deels geïsoleerd. Bijna altijd nog te verbeteren, zeker bij vrijstaande woningen." },
      { label: "Na 1995", percentage: 10, tekst: "Beter geïsoleerd. De winst zit vaker in installaties of beter glas." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Lonneker, 2026", url: "https://www.allecijfers.nl/buurt/dorp-lonneker-enschede/" },
  },
  lokaal: {
    titel: "Lonneker: agrarisch dorp in het noorden van Enschede",
    alineas: [
      ["Lonneker is een van de oudste nederzettingen in de regio Enschede. Het dorp heeft een agrarisch karakter bewaard, met verspreide boerderijen en vrijstaande woningen in een open landschap. De kenmerkende Lonnekerberg biedt uitzicht over de omgeving."],
      ["Het hoge aandeel vrijstaande woningen maakt dakisolatie en spouwmuurisolatie in Lonneker extra effectief. Ruime percelen bieden ook goede condities voor zonnepanelen."],
    ],
    kernTekst: {
      lonneker: "Je bent hier. Agrarisch dorp in het noorden van Enschede.",
      enschede: "De gemeentekern, met de meeste woningen en voorzieningen.",
      boekelo: "Kuuroord met een landelijk karakter.",
      glanerbrug: "Grensdorp op de rand van Duitsland.",
      usselo: "Klein dorp in het zuidoosten van Enschede.",
      twekkelo: "Klein dorp op de grens met Hengelo.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Enschede?",
      tekst: "Enschede werkt aan een wijkgerichte warmtetransitie. Voor bewoners in landelijke dorpen als Lonneker geldt dat isoleren nu al loont, ongeacht de keuze voor een warmtebron in de toekomst.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Enschede",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Lonneker moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Lonneker?", answer: "Lonneker valt onder de gemeente Enschede. De regelingen van Enschede gelden dus ook in Lonneker." },
    { question: "Mijn boerderij in Lonneker is oud. Waar begin ik?", answer: "Bij oude boerderijen begint het vrijwel altijd bij de spouw, het dak of de vloer. Gijs kijkt wat er al is gedaan en wat de logische volgende stap is." },
    { question: "Helpt Gijs ook in Lonneker?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Enschede, dus ook in Lonneker." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Oldenzaal", href: "/regio/overijssel/oldenzaal" },
  ],
};

const USSELO: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Usselo | Gijs",
    description: "Je woning verduurzamen in Usselo? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Enschede.",
  },
  kicker: "Dorp in gemeente Enschede",
  h1: "Je woning verduurzamen in Usselo",
  intro: [
    ["Woon je in Usselo of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Enschede", href: "/regio/overijssel/enschede" }, " zijn."],
    ["Usselo is een klein landelijk dorp aan de zuidkant van Enschede, met overwegend vrijstaande woningen. Goede dakisolatie en spouwmuurisolatie zijn hier voor veel woningen de eerste stap. Gijs kijkt wat bij jouw huis past."],
  ],
  kernen: ["usselo", "enschede", "boekelo", "glanerbrug", "lonneker", "twekkelo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Usselo verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "147", label: "woningen" },
      { waarde: "65%", label: "vrijstaand" },
      { waarde: "73%", label: "koopwoning" },
      { waarde: "45%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 30, tekst: "Historische bebouwing op het markepad. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 15, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar vaak nog niet gevuld." },
      { label: "1975 – 1995", percentage: 13, tekst: "Grootste bouwgolf van Usselo. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 43, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Usselo, 2026", url: "https://www.allecijfers.nl/buurt/buurtschap-usselo-enschede/" },
  },
  lokaal: {
    titel: "Usselo: landelijk dorp aan de rand van de Eschmarke",
    alineas: [
      ["Usselo ligt aan de zuidoostelijke rand van Enschede, in de nabijheid van het natuurgebied de Eschmarke. Het dorp heeft een groen karakter met vrijstaande woningen en een rustige woonomgeving."],
      ["Het hoge aandeel vrijstaande woningen maakt dakisolatie, spouwmuurisolatie en zonnepanelen in Usselo extra interessant. De combinatie van isolatie en installaties bepaalt hier de meest effectieve volgorde."],
    ],
    kernTekst: {
      usselo: "Je bent hier. Landelijk dorp aan de rand van de Eschmarke.",
      enschede: "De gemeentekern, met de meeste woningen en voorzieningen.",
      boekelo: "Kuuroord met een landelijk karakter.",
      glanerbrug: "Grensdorp op de rand van Duitsland.",
      lonneker: "Landelijk dorp in het noorden van Enschede.",
      twekkelo: "Klein dorp op de grens met Hengelo.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Enschede?",
      tekst: "Enschede werkt aan een wijkgerichte warmtetransitie. Voor bewoners in landelijke dorpen als Usselo geldt dat isoleren nu al loont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Enschede",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Usselo moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Usselo?", answer: "Usselo valt onder de gemeente Enschede. De regelingen van Enschede gelden dus ook in Usselo." },
    { question: "Helpt Gijs ook in Usselo?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Enschede, dus ook in Usselo." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime percelen in Usselo bieden goede condities voor zonnepanelen. Gijs kijkt naar de juiste combinatie van isolatie en installaties." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
  ],
};

const TWEKKELO: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Twekkelo | Gijs",
    description: "Je woning verduurzamen in Twekkelo? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Enschede.",
  },
  kicker: "Dorp in gemeente Enschede",
  h1: "Je woning verduurzamen in Twekkelo",
  intro: [
    ["Woon je in Twekkelo of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Enschede", href: "/regio/overijssel/enschede" }, " zijn."],
    ["Twekkelo is een klein dorp op de grens van Enschede en Hengelo, vlakbij de Deurningerbeek. Met overwegend vrijstaande en twee-onder-een-kapwoningen is het een rustige, groene woonplek."],
  ],
  kernen: ["twekkelo", "enschede", "boekelo", "glanerbrug", "lonneker", "usselo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Twekkelo verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "84", label: "woningen" },
      { waarde: "77%", label: "vrijstaand" },
      { waarde: "68%", label: "koopwoning" },
      { waarde: "70%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 54, tekst: "Historische bebouwing langs de Twekkelerweg. Bijna altijd zonder isolatie gebouwd." },
      { label: "1945 – 1975", percentage: 16, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar vaak nog niet gevuld." },
      { label: "1975 – 1995", percentage: 16, tekst: "Grootste bouwgolf van Twekkelo. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 14, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Twekkelo, 2026", url: "https://www.allecijfers.nl/buurt/buurtschap-twekkelo-enschede/" },
  },
  lokaal: {
    titel: "Twekkelo: groen grensdorp tussen Enschede en Hengelo",
    alineas: [
      ["Twekkelo ligt in het grensgebied van Enschede en Hengelo, langs de Deurningerbeek. Het is een rustig dorp met weinig bebouwing, maar met een eigen identiteit. De omgeving is groen en open."],
      ["Vrijstaande en twee-onder-een-kapwoningen domineren. Dakisolatie en spouwmuurisolatie zijn hier voor de meeste woningen de eerste en meest effectieve stap. Ruime percelen bieden ook goede condities voor zonnepanelen."],
    ],
    kernTekst: {
      twekkelo: "Je bent hier. Klein grensdorp tussen Enschede en Hengelo.",
      enschede: "De gemeentekern, met de meeste woningen en voorzieningen.",
      boekelo: "Kuuroord met een landelijk karakter.",
      glanerbrug: "Grensdorp op de rand van Duitsland.",
      lonneker: "Landelijk dorp in het noorden van Enschede.",
      usselo: "Klein dorp in het zuidoosten van Enschede.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Enschede?",
      tekst: "Enschede werkt aan een wijkgerichte warmtetransitie. Voor bewoners in landelijke dorpen als Twekkelo geldt dat isoleren nu al loont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Enschede",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Twekkelo moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Twekkelo?", answer: "Twekkelo valt onder de gemeente Enschede. De regelingen van Enschede gelden dus ook in Twekkelo." },
    { question: "Helpt Gijs ook in Twekkelo?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Enschede, dus ook in Twekkelo." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime percelen in Twekkelo bieden goede condities voor zonnepanelen. Gijs kijkt naar de juiste combinatie van isolatie en installaties." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
  ],
};

// ─── PlaatsVerhalen Almelo ────────────────────────────────────────────────────

const AADORP: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Aadorp | Gijs",
    description: "Je woning verduurzamen in Aadorp? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Almelo.",
  },
  kicker: "Dorp in gemeente Almelo",
  h1: "Je woning verduurzamen in Aadorp",
  intro: [
    ["Woon je in Aadorp of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Almelo", href: "/regio/overijssel/almelo" }, " zijn."],
    ["Aadorp is een klein dorp ten westen van Almelo met een gevarieerde woningvoorraad. Van oude boerderijen langs de doorgaande weg tot naoorlogse rijtjeswoningen in de woonstraten. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["aadorp", "almelo", "bornerbroek", "harbrinkhoek-mariaparochie"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Aadorp verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "599", label: "woningen" },
      { waarde: "57%", label: "vrijstaand" },
      { waarde: "80%", label: "koopwoning" },
      { waarde: "68%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 13, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd zonder isolatienormen gebouwd." },
      { label: "1945 – 1975", percentage: 55, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 20, tekst: "Grootste bouwgolf van Aadorp. Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 13, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Aadorp, 2026", url: "https://www.allecijfers.nl/wijk/aadorp-almelo/" },
  },
  lokaal: {
    titel: "Aadorp: dorpse rust aan de westkant van Almelo",
    alineas: [
      ["Aadorp ligt aan de westkant van Almelo, langs het Twents-Sallands kanaal. Het dorp heeft een eigenstandig karakter, met een mix van naoorlogse woningbouw en agrarische bebouwing langs de doorgaande wegen."],
      ["Het relatief hoge aandeel naoorlogse woningen maakt spouwmuurisolatie voor veel bewoners de eerste en meest effectieve stap. Gijs kijkt per woning wat er al is gedaan en wat de logische volgende stap is."],
    ],
    kernTekst: {
      aadorp: "Je bent hier. Dorps karakter aan de westkant van Almelo.",
      almelo: "De gemeentekern, met de meeste woningen en voorzieningen.",
      bornerbroek: "Klein dorp in het zuiden van Almelo.",
      "harbrinkhoek-mariaparochie": "Twee gehuchten aan de zuidkant van Almelo.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Almelo?",
      tekst: "Almelo werkt aan een wijkgerichte warmtetransitie. Voor bewoners in dorpen als Aadorp geldt dat isoleren nu al loont, ongeacht de toekomstige keuze voor een warmtebron.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Almelo",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren: vleermuizen, huismussen en gierzwaluwen. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de constructie." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Aadorp?", answer: "Aadorp valt onder de gemeente Almelo. De regelingen van Almelo gelden dus ook in Aadorp." },
    { question: "Helpt Gijs ook in Aadorp?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Almelo, dus ook in Aadorp." },
    { question: "Mijn naoorlogse woning heeft een spouw. Moet ik die vullen?", answer: "Dat hangt af van de staat van de woning en wat er al is gedaan. Gijs kijkt altijd naar jouw eigen huis." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
  ],
};

const BORNERBROEK: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Bornerbroek | Gijs",
    description: "Je woning verduurzamen in Bornerbroek? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Almelo.",
  },
  kicker: "Dorp in gemeente Almelo",
  h1: "Je woning verduurzamen in Bornerbroek",
  intro: [
    ["Woon je in Bornerbroek of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Almelo", href: "/regio/overijssel/almelo" }, " zijn."],
    ["Bornerbroek is een landelijk dorp in het zuiden van de gemeente Almelo, met overwegend vrijstaande woningen en twee-onder-een-kapwoningen. Goede dakisolatie en spouwmuurisolatie zijn hier voor de meeste woningen de eerste stap."],
  ],
  kernen: ["bornerbroek", "almelo", "aadorp", "harbrinkhoek-mariaparochie"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Bornerbroek verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "808", label: "woningen" },
      { waarde: "50%", label: "vrijstaand" },
      { waarde: "78%", label: "koopwoning" },
      { waarde: "45%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 18, tekst: "Agrarische bebouwing en historische boerderijen. Bijna altijd zonder isolatienormen gebouwd." },
      { label: "1945 – 1975", percentage: 27, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 24, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 31, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Bornerbroek, 2026", url: "https://www.allecijfers.nl/wijk/bornerbroek-almelo/" },
  },
  lokaal: {
    titel: "Bornerbroek: landelijk dorp in het zuiden van Almelo",
    alineas: [
      ["Bornerbroek ligt in het zuidelijke buitengebied van de gemeente Almelo, in de buurt van Wierden en Rijssen. Het dorp heeft een agrarisch karakter met vrijstaande woningen langs de doorgaande wegen en een kleinschalige woonkern."],
      ["Het hoge aandeel vrijstaande en twee-onder-een-kapwoningen maakt dakisolatie en spouwmuurisolatie in Bornerbroek extra effectief. Gijs kijkt per woning wat de logische volgorde is."],
    ],
    kernTekst: {
      bornerbroek: "Je bent hier. Landelijk dorp in het zuiden van Almelo.",
      almelo: "De gemeentekern, met de meeste woningen en voorzieningen.",
      aadorp: "Dorp aan de westkant van Almelo.",
      "harbrinkhoek-mariaparochie": "Twee gehuchten aan de zuidkant van Almelo.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Almelo?",
      tekst: "Almelo werkt aan een wijkgerichte warmtetransitie. Voor bewoners in landelijke dorpen als Bornerbroek geldt dat isoleren nu al loont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Almelo",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Bornerbroek moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Bornerbroek?", answer: "Bornerbroek valt onder de gemeente Almelo. De regelingen van Almelo gelden dus ook in Bornerbroek." },
    { question: "Helpt Gijs ook in Bornerbroek?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Almelo, dus ook in Bornerbroek." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime percelen in Bornerbroek bieden goede condities voor zonnepanelen. Gijs kijkt naar de juiste combinatie van isolatie en installaties." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
  ],
};

const HARBRINKHOEK_MARIAPAROCHIE: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Harbrinkhoek-Mariaparochie | Gijs",
    description: "Je woning verduurzamen in Harbrinkhoek of Mariaparochie? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Almelo.",
  },
  kicker: "Buurtschappen in gemeente Almelo",
  h1: "Je woning verduurzamen in Harbrinkhoek-Mariaparochie",
  intro: [
    ["Woon je in Harbrinkhoek of Mariaparochie? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Almelo", href: "/regio/overijssel/almelo" }, " zijn."],
    ["Harbrinkhoek en Mariaparochie zijn twee kleine buurtschappen aan de zuidkant van Almelo. De woningvoorraad bestaat overwegend uit vrijstaande woningen in een landelijke omgeving. Gijs kijkt wat bij jouw huis past."],
  ],
  kernen: ["harbrinkhoek-mariaparochie", "almelo", "aadorp", "bornerbroek"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Harbrinkhoek-Mariaparochie verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "~350", label: "woningen" },
      { waarde: "~55%", label: "vrijstaand" },
      { waarde: "~82%", label: "koopwoning" },
      { waarde: "~32%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 12, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 20, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 38, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 30, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Harbrinkhoek, 2026", url: "https://www.allecijfers.nl/wijk/harbrinkhoek-en-mariaparochie/" },
  },
  lokaal: {
    titel: "Harbrinkhoek-Mariaparochie: buurtschappen aan de zuidkant van Almelo",
    alineas: [
      ["Harbrinkhoek en Mariaparochie zijn twee kleine buurtschappen in het buitengebied van Almelo, in de richting van Wierden en Rijssen. Het karakter is landelijk, met vrijstaande woningen langs de doorgaande wegen."],
      ["Met een hoog aandeel vrijstaande woningen zijn dakisolatie en spouwmuurisolatie hier de meest effectieve eerste stap. Ruime percelen bieden bovendien goede condities voor zonnepanelen."],
    ],
    kernTekst: {
      "harbrinkhoek-mariaparochie": "Je bent hier. Twee buurtschappen in het zuidelijke buitengebied.",
      almelo: "De gemeentekern, met de meeste woningen en voorzieningen.",
      aadorp: "Dorp aan de westkant van Almelo.",
      bornerbroek: "Landelijk dorp in het zuiden van Almelo.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Almelo?",
      tekst: "Almelo werkt aan een wijkgerichte warmtetransitie. Voor bewoners in het buitengebied geldt dat isoleren nu al loont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Almelo",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Harbrinkhoek-Mariaparochie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Harbrinkhoek of Mariaparochie?", answer: "Harbrinkhoek en Mariaparochie vallen onder de gemeente Almelo. De regelingen van Almelo gelden dus ook hier." },
    { question: "Helpt Gijs ook in Harbrinkhoek-Mariaparochie?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Almelo, dus ook in Harbrinkhoek en Mariaparochie." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime percelen in dit buitengebied bieden goede condities voor zonnepanelen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
  ],
};

// ─── PlaatsVerhalen Hof van Twente ────────────────────────────────────────────

const GOOR: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Goor | Gijs",
    description: "Je woning verduurzamen in Goor? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hof van Twente.",
  },
  kicker: "Kern in gemeente Hof van Twente",
  h1: "Je woning verduurzamen in Goor",
  intro: [
    ["Woon je in Goor? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hof van Twente", href: "/regio/overijssel/hof-van-twente" }, " zijn."],
    ["Goor is de grootste kern van de gemeente Hof van Twente. Met een gevarieerde woningvoorraad van naoorlogse rijtjeswoningen tot vrijstaande woningen in de nieuwere wijken is er voor elk huis een logische eerste stap."],
  ],
  kernen: ["goor", "delden", "markelo", "diepenheim", "bentelo", "hengevelde"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Goor verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "4.134", label: "woningen" },
      { waarde: "18%", label: "vrijstaand" },
      { waarde: "58%", label: "koopwoning" },
      { waarde: "62%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 22, tekst: "Historische bebouwing in het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 40, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 21, tekst: "Grootste bouwgolf van Goor. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 17, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Goor, 2026", url: "https://www.allecijfers.nl/wijk/goor-hof-van-twente/" },
  },
  lokaal: {
    titel: "Goor: de voornaamste kern van Hof van Twente",
    alineas: [
      ["Goor is de grootste stad van de gemeente Hof van Twente en heeft een actief centrum met winkels, horeca en voorzieningen. Het dorp heeft een lange textielgeschiedenis en is uitgegroeid tot het hart van de gemeente."],
      ["De woningvoorraad in Goor is gevarieerd: naoorlogse rijtjeswoningen in de uitbreidingswijken, vrijstaande woningen in de nieuwere buurten en historische panden in en rond het centrum. Per type woning verschilt de meest effectieve isolatiestap."],
    ],
    bekendVan: {
      titel: "Waar is Goor bekend van?",
      kaarten: [
        { icon: "factory", titel: "Textielgeschiedenis", tekst: "Goor kende in de twintigste eeuw een bloeiende textielindustrie. Meerdere fabrieken bepaalden het karakter van de stad en de omgeving." },
      ],
    },
    kernTekst: {
      goor: "Je bent hier. Voornaamste kern van de gemeente.",
      delden: "Historisch stadje ten noorden van Goor.",
      markelo: "Dorp in het westen van Hof van Twente.",
      diepenheim: "Klein dorp met een historisch kasteel.",
      bentelo: "Klein buurtschap in het zuiden van de gemeente.",
      hengevelde: "Dorp in het zuidoosten van Hof van Twente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hof van Twente?",
      tekst: "Hof van Twente werkt aan een warmtevisie. Voor bewoners in Goor geldt dat isoleren nu al loont en een goede voorbereiding is op welke warmtebron de gemeente ook kiest.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hof van Twente",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Goor moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de constructie." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Goor?", answer: "Goor valt onder de gemeente Hof van Twente. De regelingen van Hof van Twente gelden in Goor." },
    { question: "Mijn naoorlogse woning in Goor heeft een lege spouw. Wat moet ik doen?", answer: "Spouwmuurisolatie is voor veel naoorlogse woningen de meest effectieve eerste stap. Gijs kijkt of dat bij jouw woning ook het geval is." },
    { question: "Helpt Gijs ook in Goor?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, dus ook in Goor." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Gijs kijkt naar de combinatie van isolatie en installaties die bij jouw woning past." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
  woningInzichtenBlok: {
    h2: "Waar verliest jouw woning warmte en wat kun je eraan doen?",
    feitVariant: 'cirkel',
    percentage: "47%",
    percentageTekst: "van de woningen in Goor is gebouwd vóór 1975",
    bodytekst: "Een woning die snel afkoelt, tocht bij de ramen of een vloer die koud blijft aanvoelen: het zijn signalen dat het de moeite waard kan zijn om naar de isolatie te kijken. Je wilt dan vooral weten waar warmte verloren gaat en welke maatregel daadwerkelijk verschil kan maken. Bij woningen uit oudere bouwperioden is het belangrijk om te bekijken wat er sinds de bouw al is verbeterd. Misschien is het dak al nageïsoleerd, maar ontbreekt nog isolatie onder de vloer. Door de huidige situatie te laten beoordelen, kun je gericht investeren in meer wooncomfort en minder onnodig energieverbruik.",
    kaarten: [
      { icon: "search", titel: "Welke isolatie heeft mijn woning nodig?", tekst: "Een koud vertrek kan verschillende oorzaken hebben. Bekijk hoe dak-, vloer- en spouwmuurisolatie helpen om warmteverlies te beperken en waarom de beste keuze afhangt van de bestaande constructie.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Bekijk isolatiemogelijkheden" },
      { icon: "calculator", titel: "Wat kost isolatie en wat levert het op?", tekst: "De kosten en mogelijke besparing verschillen per woning. Ontdek welke factoren invloed hebben op de investering, eventuele subsidies en de verbetering van je wooncomfort.", href: "/kennis#subsidies", linkTekst: "Bekijk kosten en subsidies" },
    ],
    adviseur: { naam: "naud", h3: "Naud kijkt graag met je mee", tekst: "Heb je in Goor last van tocht, koude vloeren of hoge stookkosten? Naud bekijkt de bestaande isolatie en helpt bepalen welke verbeteringen passend zijn. Daarbij kijkt hij niet alleen naar afzonderlijke maatregelen, maar naar de woning als geheel. Gijs begeleidt vervolgens het traject van advies tot uitvoering." },
  },
};

const DELDEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Delden | Advies & ontzorging – Gijs",
    description: "Je woning isoleren in Delden? Gijs geeft onafhankelijk verduurzamingsadvies voor dit historische stadje in de gemeente Hof van Twente en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Stadje in gemeente Hof van Twente",
  h1: "Je woning isoleren en verduurzamen in Delden",
  intro: [
    ["Woon je in Delden? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hof van Twente", href: "/regio/overijssel/hof-van-twente" }, " zijn."],
    ["Delden is een historisch stadje met een gevarieerde woningvoorraad. Van karakteristieke panden in het centrum tot naoorlogse woningbouw in de uitbreidingswijken. Per woning verschilt de meest effectieve isolatiestap."],
  ],
  kernen: ["delden", "goor", "markelo", "diepenheim", "bentelo", "hengevelde"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Delden verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "3.420", label: "woningen" },
      { waarde: "27%", label: "vrijstaand" },
      { waarde: "67%", label: "koopwoning" },
      { waarde: "67%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 16, tekst: "Historische panden in en rond het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 51, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 21, tekst: "Verdere uitbreiding van het dorp. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 12, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Delden, 2026", url: "https://www.allecijfers.nl/wijk/delden-hof-van-twente/" },
  },
  lokaal: {
    titel: "Delden: historisch stadje met Kasteel Twickel",
    alineas: [
      ["Delden is een stadje in het noorden van de gemeente Hof van Twente, bekend door het nabijgelegen Kasteel Twickel en het omliggende landgoed. Het historische centrum heeft een eigen karakter, met karakteristieke panden langs de doorgaande straten."],
      ["De combinatie van historische bebouwing en naoorlogse uitbreidingswijken maakt Delden interessant voor zowel energierenovatie als reguliere isolatie. Bij oudere panden is aandacht voor de bouwkundige details extra belangrijk."],
    ],
    bekendVan: {
      titel: "Waar is Delden bekend van?",
      kaarten: [
        { icon: "landmark", titel: "Kasteel Twickel", tekst: "Het middeleeuwse Kasteel Twickel en het gelijknamige landgoed zijn het bekendste erfgoed van Delden. Het landgoed is een van de grootste particuliere landgoederen van Nederland." },
      ],
    },
    kernTekst: {
      delden: "Je bent hier. Historisch stadje met Kasteel Twickel.",
      goor: "De voornaamste kern van de gemeente.",
      markelo: "Dorp in het westen van Hof van Twente.",
      diepenheim: "Klein dorp met een historisch kasteel.",
      bentelo: "Klein buurtschap in het zuiden van de gemeente.",
      hengevelde: "Dorp in het zuidoosten van Hof van Twente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hof van Twente?",
      tekst: "Hof van Twente werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding, ongeacht welke warmtebron de gemeente kiest.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hof van Twente",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Delden moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Delden?", answer: "Delden valt onder de gemeente Hof van Twente. De regelingen van Hof van Twente gelden in Delden." },
    { question: "Mijn historische woning in Delden is bijzonder. Kan ik gewoon isoleren?", answer: "Bij historische panden gelden soms extra regels of beperkingen, afhankelijk van de monumentenstatus. Gijs kijkt wat mogelijk is en hoe je toch kunt verduurzamen." },
    { question: "Helpt Gijs ook in Delden?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, dus ook in Delden." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
  ],
  woningInzichtenBlok: {
    h2: "Comfortabeler wonen met behoud van het karakter van je huis",
    feitVariant: 'heading',
    percentageTekst: "Meer dan de helft van de woningen in Delden is gebouwd vóór 1975.",
    bodytekst: "Een oudere woning heeft vaak eigenschappen die je juist wilt behouden. Denk aan de gevel, karakteristieke ramen of andere bouwdetails. Tegelijk wil je prettig wonen, zonder koude vloeren of onnodig warmteverlies. Bij het isoleren van oudere woningen is het daarom belangrijk om te kijken naar de bestaande constructie en eventuele eerdere verbouwingen. Niet iedere isolatieoplossing is voor elk gebouw geschikt. Met een zorgvuldige aanpak kun je het comfort verbeteren en tegelijk rekening houden met vocht, ventilatie en de uitstraling van je woning.",
    kaarten: [
      { icon: "home", titel: "Welke isolatie past bij mijn oudere woning?", tekst: "Bekijk hoe dak-, vloer- en glasisolatie kunnen bijdragen aan meer comfort. De bouwkundige situatie bepaalt welke oplossingen technisch verstandig zijn.", href: "/maatregelen/dakisolatie", linkTekst: "Bekijk isolatiemogelijkheden" },
      { icon: "clipboard-check", titel: "Wat moet ik vooraf laten controleren?", tekst: "Bij oudere of beschermde woningen kunnen aanvullende aandachtspunten gelden. Denk aan de gevelconstructie, ventilatie en eventuele vergunningen. Goede voorbereiding voorkomt onnodige problemen.", href: "/contact#energiescan", linkTekst: "Plan een energiescan" },
    ],
    adviseur: { naam: "thom", h3: "Thom kijkt graag met je mee", tekst: "Wil je jouw woning in Delden verduurzamen, maar het karakter en de bestaande constructie behouden? Thom kijkt naar eerdere renovaties, de technische mogelijkheden en jouw wensen. Zo krijg je advies dat bij de woning past. Gijs helpt vervolgens bij het voorbereiden en begeleiden van de uitvoering." },
  },
};

const MARKELO: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Markelo | Gijs",
    description: "Je woning verduurzamen in Markelo? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hof van Twente.",
  },
  kicker: "Dorp in gemeente Hof van Twente",
  h1: "Je woning verduurzamen in Markelo",
  intro: [
    ["Woon je in Markelo of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hof van Twente", href: "/regio/overijssel/hof-van-twente" }, " zijn."],
    ["Markelo is een dorp in het westen van de gemeente Hof van Twente, met een gevarieerde woningvoorraad van historische boerderijen tot naoorlogse rijtjeswoningen. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["markelo", "goor", "delden", "diepenheim", "bentelo", "hengevelde"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Markelo verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "2.702", label: "woningen" },
      { waarde: "45%", label: "vrijstaand" },
      { waarde: "76%", label: "koopwoning" },
      { waarde: "55%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 18, tekst: "Agrarische bebouwing en historische panden. Bijna altijd zonder isolatienormen gebouwd." },
      { label: "1945 – 1975", percentage: 37, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 23, tekst: "Grootste bouwgolf van Markelo. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 22, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Markelo, 2026", url: "https://www.allecijfers.nl/wijk/markelo-hof-van-twente/" },
  },
  lokaal: {
    titel: "Markelo: dorp op de grens van Twente en Salland",
    alineas: [
      ["Markelo ligt in het westen van de gemeente Hof van Twente, op de grens van het Twentse en Sallandse landschap. Het dorp heeft een eeuwenoud marktkarakter en een afwisselend buitengebied met esgronden en beken."],
      ["De mix van agrarische bebouwing en naoorlogse woningbouw maakt de verduurzamingsopgave in Markelo gevarieerd. Per woning verschilt de meest effectieve eerste stap aanzienlijk."],
    ],
    kernTekst: {
      markelo: "Je bent hier. Dorp op de grens van Twente en Salland.",
      goor: "De voornaamste kern van de gemeente.",
      delden: "Historisch stadje met Kasteel Twickel.",
      diepenheim: "Klein dorp met een historisch kasteel.",
      bentelo: "Klein buurtschap in het zuiden van de gemeente.",
      hengevelde: "Dorp in het zuidoosten van Hof van Twente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hof van Twente?",
      tekst: "Hof van Twente werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding, ongeacht welke warmtebron de gemeente kiest.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hof van Twente",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Markelo moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Markelo?", answer: "Markelo valt onder de gemeente Hof van Twente. De regelingen van Hof van Twente gelden in Markelo." },
    { question: "Helpt Gijs ook in Markelo?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, dus ook in Markelo." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. In het buitengebied rond Markelo bieden ruime percelen goede condities voor zonnepanelen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
  ],
  woningInzichtenBlok: {
    h2: "Vrijstaand wonen is heerlijk, maar hoe houd je de warmte binnen?",
    feitVariant: 'cirkel',
    percentage: "48%",
    percentageTekst: "van de woningen in Markelo is vrijstaand",
    bodytekst: "Bij een vrijstaande woning grenzen meerdere gevels en het dak aan de buitenlucht. Dat maakt het interessant om goed te kijken naar de isolatie van de volledige woning. Misschien is het dak inmiddels verbeterd, maar voelt de vloer nog koud aan. Of je denkt aan een warmtepomp en wilt eerst weten of je woning daarvoor geschikt is. Door isolatie en verwarming op elkaar af te stemmen, voorkom je dat je investeert in maatregelen die afzonderlijk aantrekkelijk lijken, maar niet optimaal samenwerken.",
    kaarten: [
      { icon: "search", titel: "Waar verliest mijn woning warmte?", tekst: "Ontdek welke rol dak-, gevel- en vloerisolatie spelen. Laat eerst bekijken wat al is geïsoleerd en waar verbetering zinvol is.", href: "/maatregelen/dakisolatie", linkTekst: "Bekijk dakisolatie" },
      { icon: "flame", titel: "Is mijn woning klaar voor een warmtepomp?", tekst: "Een warmtepomp moet passen bij de warmtebehoefte en het bestaande verwarmingssysteem. Onderzoek daarom eerst welke voorwaarden bij jouw woning van belang zijn.", href: "/maatregelen/warmtepomp", linkTekst: "Bekijk warmtepomp" },
    ],
    adviseur: { naam: "naud", h3: "Naud kijkt graag met je mee", tekst: "Woon je vrijstaand in Markelo en wil je weten welke maatregelen werkelijk bij jouw woning passen? Naud beoordeelt de isolatie en verwarming in samenhang. Je krijgt overzicht over de mogelijkheden en de volgorde van verbeteringen. Gijs helpt daarna bij de uitvoering." },
  },
};

const DIEPENHEIM: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Diepenheim | Gijs",
    description: "Je woning verduurzamen in Diepenheim? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hof van Twente.",
  },
  kicker: "Dorp in gemeente Hof van Twente",
  h1: "Je woning verduurzamen in Diepenheim",
  intro: [
    ["Woon je in Diepenheim of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hof van Twente", href: "/regio/overijssel/hof-van-twente" }, " zijn."],
    ["Diepenheim is een klein dorp in het zuidwesten van de gemeente Hof van Twente, in een mooi coulisselandschap. De meeste woningen zijn vrijstaand of twee-onder-een-kap, gebouwd in de tweede helft van de twintigste eeuw."],
  ],
  kernen: ["diepenheim", "goor", "delden", "markelo", "bentelo", "hengevelde"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Diepenheim verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "1.228", label: "woningen" },
      { waarde: "47%", label: "vrijstaand" },
      { waarde: "74%", label: "koopwoning" },
      { waarde: "66%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 24, tekst: "Historische bebouwing bij het kasteel en langs de doorgaande wegen. Bijna altijd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 42, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 19, tekst: "Grootste bouwgolf van Diepenheim. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 15, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Diepenheim, 2026", url: "https://www.allecijfers.nl/wijk/diepenheim-hof-van-twente/" },
  },
  lokaal: {
    titel: "Diepenheim: pittoresk dorp met Kasteel Diepenheim",
    alineas: [
      ["Diepenheim is een klein dorp met een pittoresk karakter, in een coulisselandschap van houtwallen, beken en essen. Kasteel Diepenheim en de bijbehorende landgoederen bepalen mede het karakter van de omgeving."],
      ["De relatief jonge woningbouw in Diepenheim maakt spouwmuurisolatie voor een groot deel van de woningen de eerste en meest effectieve stap. Ruime percelen bieden ook goede condities voor zonnepanelen."],
    ],
    bekendVan: {
      titel: "Waar is Diepenheim bekend van?",
      kaarten: [
        { icon: "landmark", titel: "Kasteel Diepenheim", tekst: "Kasteel Diepenheim is een van de beter bewaarde kastelen in Overijssel. Het kasteel en het omliggende landgoed zijn bepalend voor het karakter van het dorp." },
      ],
    },
    kernTekst: {
      diepenheim: "Je bent hier. Pittoresk dorp met Kasteel Diepenheim.",
      goor: "De voornaamste kern van de gemeente.",
      delden: "Historisch stadje met Kasteel Twickel.",
      markelo: "Dorp op de grens van Twente en Salland.",
      bentelo: "Klein buurtschap in het zuiden van de gemeente.",
      hengevelde: "Dorp in het zuidoosten van Hof van Twente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hof van Twente?",
      tekst: "Hof van Twente werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding, ongeacht welke warmtebron de gemeente kiest.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hof van Twente",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Diepenheim moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Diepenheim?", answer: "Diepenheim valt onder de gemeente Hof van Twente. De regelingen van Hof van Twente gelden in Diepenheim." },
    { question: "Helpt Gijs ook in Diepenheim?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, dus ook in Diepenheim." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
  woningInzichtenBlok: {
    h2: "Een oudere woning isoleren vraagt om de juiste aanpak",
    feitVariant: 'cirkel',
    percentage: "26%",
    percentageTekst: "van de woningen in Diepenheim is gebouwd vóór 1945",
    bodytekst: "Bij oudere woningen is de oorspronkelijke bouwconstructie vaak anders dan bij moderne huizen. Daardoor vraagt isolatie om zorgvuldige keuzes. Je wilt minder tocht en een aangename temperatuur, maar voorkomen dat een verkeerde ingreep later vochtproblemen of schade veroorzaakt. Daarom is het belangrijk om eerst te onderzoeken welke isolatie al aanwezig is, hoe de constructie met vocht omgaat en welke maatregelen technisch geschikt zijn. Zo verbeter je het comfort met aandacht voor de kwaliteit en levensduur van je woning.",
    kaarten: [
      { icon: "brick-wall", titel: "Welke isolatie is geschikt voor oude muren?", tekst: "Niet iedere gevel heeft een geschikte spouw. Bekijk waarom de constructie, ventilatie en vochthuishouding belangrijk zijn.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Bekijk spouwmuurisolatie" },
      { icon: "shield-check", titel: "Hoe verbeter ik comfort zonder onnodige risico's?", tekst: "Dak-, vloer- of glasisolatie kan interessant zijn. Welke maatregel passend is, hangt af van de bestaande bouw en eerdere renovaties.", href: "/maatregelen/dakisolatie", linkTekst: "Bekijk dakisolatie" },
    ],
    adviseur: { naam: "thom", h3: "Thom kijkt graag met je mee", tekst: "Heb je een oudere woning in Diepenheim en wil je verantwoord isoleren? Thom kijkt naar de constructie, eventuele eerdere verbeteringen en mogelijke aandachtspunten. Zo krijg je een plan dat niet alleen het comfort verbetert, maar ook rekening houdt met de woning zelf. Gijs begeleidt de uitvoering." },
  },
};

const BENTELO: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Bentelo | Gijs",
    description: "Je woning verduurzamen in Bentelo? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hof van Twente.",
  },
  kicker: "Buurtschap in gemeente Hof van Twente",
  h1: "Je woning verduurzamen in Bentelo",
  intro: [
    ["Woon je in Bentelo of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hof van Twente", href: "/regio/overijssel/hof-van-twente" }, " zijn."],
    ["Bentelo is een klein buurtschap in het zuiden van de gemeente Hof van Twente, met een landelijk en rustig karakter. Vrijstaande woningen domineren de woningvoorraad, waardoor dakisolatie en spouwmuurisolatie hier het meeste effect hebben."],
  ],
  kernen: ["bentelo", "goor", "delden", "markelo", "diepenheim", "hengevelde"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Bentelo verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "874", label: "woningen" },
      { waarde: "49%", label: "vrijstaand" },
      { waarde: "72%", label: "koopwoning" },
      { waarde: "48%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische boerderijbebouwing. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 33, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 26, tekst: "Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 25, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Bentelo, 2026", url: "https://www.allecijfers.nl/wijk/bentelo-hof-van-twente/" },
  },
  lokaal: {
    titel: "Bentelo: landelijk buurtschap in het zuiden van Hof van Twente",
    alineas: [
      ["Bentelo is een klein buurtschap in het zuiden van de gemeente Hof van Twente, in een afwisselend coulisselandschap van houtwallen, weiden en beken. Het buurtschap heeft een agrarisch karakter, met vrijstaande woningen langs de doorgaande wegen."],
      ["Het hoge aandeel vrijstaande woningen maakt dakisolatie en spouwmuurisolatie in Bentelo extra effectief. Ruime percelen bieden ook goede condities voor zonnepanelen."],
    ],
    kernTekst: {
      bentelo: "Je bent hier. Landelijk buurtschap in het zuiden van Hof van Twente.",
      goor: "De voornaamste kern van de gemeente.",
      delden: "Historisch stadje met Kasteel Twickel.",
      markelo: "Dorp op de grens van Twente en Salland.",
      diepenheim: "Pittoresk dorp met Kasteel Diepenheim.",
      hengevelde: "Dorp in het zuidoosten van Hof van Twente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hof van Twente?",
      tekst: "Hof van Twente werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding, ongeacht welke warmtebron de gemeente kiest.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hof van Twente",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Bentelo moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Bentelo?", answer: "Bentelo valt onder de gemeente Hof van Twente. De regelingen van Hof van Twente gelden in Bentelo." },
    { question: "Helpt Gijs ook in Bentelo?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, dus ook in Bentelo." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
  ],
  woningInzichtenBlok: {
    h2: "Je woning in het buitengebied verduurzamen, met een duidelijk plan",
    feitVariant: 'cirkel',
    percentage: "49%",
    percentageTekst: "van de adressen in Bentelo ligt buiten de bebouwde kom",
    bodytekst: "Wonen in het buitengebied biedt ruimte, maar kan ook andere mogelijkheden en uitdagingen met zich meebrengen bij het verduurzamen. Misschien heb je een groot dak dat geschikt lijkt voor zonnepanelen. Of je wilt onderzoeken hoeveel warmte je woning verliest en of een warmtepomp een verstandige investering is. De beste oplossing hangt af van de bestaande isolatie, de installaties en jouw energieverbruik. Een samenhangend plan helpt om de juiste volgorde te bepalen en voorkomt dat je los van elkaar investeert in maatregelen die weinig toevoegen.",
    kaarten: [
      { icon: "layers", titel: "Welke isolatie levert meer comfort op?", tekst: "Bekijk hoe dak-, gevel- en vloerisolatie kunnen helpen om de warmtevraag te beperken en welke onderdelen bij jouw woning aandacht verdienen.", href: "/maatregelen/dakisolatie", linkTekst: "Bekijk isolatiemaatregelen" },
      { icon: "sun", titel: "Zijn zonnepanelen interessant voor mijn dak?", tekst: "Dakruimte alleen is niet voldoende. De ligging, schaduw, investering en het eigen stroomverbruik bepalen mede de financiële waarde.", href: "/maatregelen/zonnepanelen", linkTekst: "Bekijk zonnepanelen" },
    ],
    adviseur: { naam: "naud", h3: "Naud kijkt graag met je mee", tekst: "Woon je in het buitengebied van Bentelo en wil je jouw woning energiezuiniger maken? Naud kijkt naar de huidige isolatie, de mogelijkheden voor zonnepanelen en het verwarmingssysteem. Gijs helpt je om de maatregelen op elkaar af te stemmen en begeleidt de uitvoering." },
  },
};

const HENGEVELDE: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Hengevelde | Gijs",
    description: "Je woning verduurzamen in Hengevelde? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hof van Twente.",
  },
  kicker: "Dorp in gemeente Hof van Twente",
  h1: "Je woning verduurzamen in Hengevelde",
  intro: [
    ["Woon je in Hengevelde of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hof van Twente", href: "/regio/overijssel/hof-van-twente" }, " zijn."],
    ["Hengevelde is een dorp in het zuidoosten van de gemeente Hof van Twente, met een eigen identiteit en een gevarieerde woningvoorraad. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["hengevelde", "goor", "delden", "markelo", "diepenheim", "bentelo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Hengevelde verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "1.447", label: "woningen" },
      { waarde: "50%", label: "vrijstaand" },
      { waarde: "72%", label: "koopwoning" },
      { waarde: "54%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 20, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 34, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 23, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 24, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Hengevelde, 2026", url: "https://www.allecijfers.nl/wijk/hengevelde-hof-van-twente/" },
  },
  lokaal: {
    titel: "Hengevelde: dorp in het zuidoosten van Hof van Twente",
    alineas: [
      ["Hengevelde ligt in het zuidoosten van de gemeente Hof van Twente, aan de rand van het Achterhoekse coulisselandschap. Het dorp heeft een eigenstandig karakter, met een dorpscentrum en verspreide bebouwing in het buitengebied."],
      ["De mix van naoorlogse woningbouw en vrijstaande woningen maakt verduurzaming in Hengevelde gevarieerd. Spouwmuurisolatie en dakisolatie zijn voor de meeste woningen de eerste effectieve stap."],
    ],
    kernTekst: {
      hengevelde: "Je bent hier. Dorp in het zuidoosten van Hof van Twente.",
      goor: "De voornaamste kern van de gemeente.",
      delden: "Historisch stadje met Kasteel Twickel.",
      markelo: "Dorp op de grens van Twente en Salland.",
      diepenheim: "Pittoresk dorp met Kasteel Diepenheim.",
      bentelo: "Klein buurtschap in het zuiden van de gemeente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hof van Twente?",
      tekst: "Hof van Twente werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding, ongeacht welke warmtebron de gemeente kiest.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hof van Twente",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Hengevelde moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Hengevelde?", answer: "Hengevelde valt onder de gemeente Hof van Twente. De regelingen van Hof van Twente gelden in Hengevelde." },
    { question: "Helpt Gijs ook in Hengevelde?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, dus ook in Hengevelde." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Gijs kijkt naar de combinatie van isolatie en installaties die bij jouw woning past." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
  ],
  woningInzichtenBlok: {
    h2: "Je woning is al verbeterd. Wat is nu de verstandigste investering?",
    feitVariant: 'heading',
    percentageTekst: "2 op de 5 woningen in Hengevelde zijn vrijstaand.",
    bodytekst: "Heb je de afgelopen jaren al geïsoleerd of nieuw glas geplaatst? Dan wil je waarschijnlijk weten welke volgende stap echt waarde toevoegt. Een warmtepomp, vloerverwarming of zonnepanelen kan interessant zijn. Maar niet iedere installatie past automatisch bij elke woning. De juiste keuze hangt af van de huidige isolatie, de warmtebehoefte, het elektriciteitsverbruik en je toekomstplannen. Door die factoren eerst te beoordelen, kun je beter bepalen welke investering zinvol is en welke voorlopig kan wachten.",
    kaarten: [
      { icon: "flame", titel: "Is mijn woning geschikt voor een warmtepomp?", tekst: "Bekijk hoe isolatie, warmteafgifte en het bestaande verwarmingssysteem invloed hebben op de mogelijkheden.", href: "/maatregelen/warmtepomp", linkTekst: "Bekijk warmtepomp" },
      { icon: "battery-charging", titel: "Is energieopslag financieel interessant?", tekst: "Een thuisbatterij is niet voor iedere woning rendabel. Verbruik, zonnestroom, energietarieven en investeringskosten spelen een belangrijke rol.", href: "/maatregelen/zonnepanelen", linkTekst: "Bekijk zonnepanelen" },
    ],
    adviseur: { naam: "thom", h3: "Thom kijkt graag met je mee", tekst: "Wil je in Hengevelde verder verduurzamen en twijfel je welke installatie bij jouw woning past? Thom bekijkt de huidige isolatie en het energieverbruik. Je krijgt inzicht in passende mogelijkheden, zodat je niet investeert in een oplossing die weinig toevoegt. Gijs begeleidt de volgende stappen." },
  },
};

// ─── PlaatsVerhalen Hellendoorn ──────────────────────────────────────────────

const NIJVERDAL: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Nijverdal | Advies & ontzorging – Gijs",
    description: "Je woning isoleren in Nijverdal, de grootste kern van gemeente Hellendoorn? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Kern in gemeente Hellendoorn",
  h1: "Je woning isoleren en verduurzamen in Nijverdal",
  intro: [
    ["Woon je in Nijverdal? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hellendoorn", href: "/regio/overijssel/hellendoorn" }, " zijn."],
    ["Nijverdal is de grootste kern van de gemeente Hellendoorn. De woningvoorraad is gevarieerd: van naoorlogse rijtjeswoningen in de uitbreidingswijken tot vrijstaande woningen aan de rand van de Hellendoornse Berg. Per woning verschilt de eerste stap."],
  ],
  kernen: ["nijverdal", "daarle", "daarlerveen", "haarle"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Nijverdal verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "10.402", label: "woningen" },
      { waarde: "21%", label: "vrijstaand" },
      { waarde: "71%", label: "koopwoning" },
      { waarde: "61%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische bebouwing in het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 46, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 26, tekst: "Grootste bouwgolf van Nijverdal. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 13, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, woonplaats Nijverdal, 2026", url: "https://www.allecijfers.nl/woonplaats/nijverdal/" },
  },
  lokaal: {
    titel: "Nijverdal: kern aan de rand van de Hellendoornse Berg",
    alineas: [
      ["Nijverdal is de voornaamste kern van de gemeente Hellendoorn, aan de rand van het Sallandse Heuvelrug. De stad heeft een industriële geschiedenis, maar is omringd door natuur: de Hellendoornse Berg en de Regge zijn vlakbij."],
      ["De gevarieerde woningvoorraad vraagt om een maatwerkadvies per huis. Naoorlogse rijtjeswoningen profiteren het meest van spouwmuurisolatie, terwijl grotere vrijstaande woningen aan de rand van het dorp dakisolatie en vloerisolatie hoger op de agenda zullen hebben."],
    ],
    kernTekst: {
      nijverdal: "Je bent hier. Voornaamste kern van de gemeente.",
      daarle: "Dorp in het westen van de gemeente.",
      daarlerveen: "Klein buurtschap in het westelijke buitengebied.",
      haarle: "Dorp aan de rand van de Sallandse Heuvelrug.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hellendoorn?",
      tekst: "Hellendoorn werkt aan een warmtevisie. Voor bewoners in Nijverdal geldt dat isoleren nu al loont, ongeacht de keuze voor een toekomstige warmtebron.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hellendoorn",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Nijverdal moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Nijverdal?", answer: "Nijverdal valt onder de gemeente Hellendoorn. De regelingen van Hellendoorn gelden dus ook in Nijverdal." },
    { question: "Mijn naoorlogse woning in Nijverdal heeft een lege spouw. Wat doe ik?", answer: "Spouwmuurisolatie is voor veel naoorlogse woningen de meest effectieve eerste stap. Gijs kijkt of dat bij jouw woning ook het geval is." },
    { question: "Helpt Gijs ook in Nijverdal?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hellendoorn, dus ook in Nijverdal." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Gijs kijkt naar de combinatie van isolatie en installaties die bij jouw woning past." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
  ],
  woningInzichtenBlok: {
    h2: "Welke isolatiemaatregel past bij jouw woning in Nijverdal?",
    feitVariant: "cirkel",
    percentage: "45%",
    percentageTekst: "van de woningen in Nijverdal is gebouwd tussen 1945 en 1975",
    bodytekst: "In Nijverdal staan ruim 10.000 woningen. Bijna de helft stamt uit de naoorlogse bouwgolf, toen de vraag naar huizen groter was dan de aandacht voor isolatie. Dat maakt spouwmuurisolatie voor veel bewoners de eerste logische stap. Maar de beste eerste stap verschilt per woning. Gijs kijkt wat er bij jouw huis technisch het meest oplevert.",
    kaarten: [
      { icon: "layers", titel: "Spouwmuurisolatie bij naoorlogse woningen", tekst: "Een lege spouw is geen defect, maar een kans. Spouwmuurisolatie is bij naoorlogse woningen vaak de maatregel met het snelste resultaat.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Lees over spouwmuurisolatie" },
      { icon: "home", titel: "Dakisolatie bij vrijstaande woningen", tekst: "Nijverdal heeft relatief veel vrijstaande woningen. Bij dit type levert dakisolatie vaak het grootste comfort- en besparingsvoordeel op.", href: "/maatregelen/dakisolatie", linkTekst: "Lees over dakisolatie" },
    ],
    adviseur: { naam: "naud", h3: "Naud helpt je verder in Nijverdal", tekst: "Nijverdal is een gevarieerde woonplaats. Van naoorlogse rijtjeshuizen tot ruimere woningen aan de rand van de Hellendoornse Berg. Naud bekijkt wat er bij jouw huis past en welke stappen het meest opleveren." },
  },
};

const DAARLE: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Daarle | Gijs",
    description: "Je woning verduurzamen in Daarle? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hellendoorn.",
  },
  kicker: "Dorp in gemeente Hellendoorn",
  h1: "Je woning verduurzamen in Daarle",
  intro: [
    ["Woon je in Daarle of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hellendoorn", href: "/regio/overijssel/hellendoorn" }, " zijn."],
    ["Daarle is een klein landelijk dorp in het westen van de gemeente Hellendoorn. De woningvoorraad bestaat overwegend uit vrijstaande woningen en twee-onder-een-kapwoningen. Dakisolatie en spouwmuurisolatie hebben hier het meeste effect."],
  ],
  kernen: ["daarle", "nijverdal", "daarlerveen", "haarle"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Daarle verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "231", label: "woningen" },
      { waarde: "35%", label: "vrijstaand" },
      { waarde: "82%", label: "koopwoning" },
      { waarde: "54%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 11, tekst: "Historische boerderijbebouwing. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 43, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 25, tekst: "Grootste bouwgolf van Daarle. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 21, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Daarle, 2026", url: "https://www.allecijfers.nl/wijk/daarle-hellendoorn/" },
  },
  lokaal: {
    titel: "Daarle: landelijk dorp in het westen van Hellendoorn",
    alineas: [
      ["Daarle is een rustig dorp in het westelijke deel van de gemeente Hellendoorn, omgeven door weilanden en agrarische percelen. Het dorp heeft een eigen karakter, met vrijstaande woningen langs de doorgaande wegen en een kleinschalige woonkern."],
      ["Vrijstaande woningen in Daarle hebben meer buitenoppervlak, waardoor dakisolatie en spouwmuurisolatie verhoudingsgewijs meer effect hebben. Ruime percelen bieden ook goede condities voor zonnepanelen."],
    ],
    kernTekst: {
      daarle: "Je bent hier. Landelijk dorp in het westen van de gemeente.",
      nijverdal: "Voornaamste kern van de gemeente.",
      daarlerveen: "Klein buurtschap in het westelijke buitengebied.",
      haarle: "Dorp aan de rand van de Sallandse Heuvelrug.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hellendoorn?",
      tekst: "Hellendoorn werkt aan een warmtevisie. Voor bewoners in landelijke dorpen als Daarle geldt dat isoleren nu al loont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hellendoorn",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Daarle moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Daarle?", answer: "Daarle valt onder de gemeente Hellendoorn. De regelingen van Hellendoorn gelden dus ook in Daarle." },
    { question: "Helpt Gijs ook in Daarle?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hellendoorn, dus ook in Daarle." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
};

const DAARLERVEEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Daarlerveen | Gijs",
    description: "Je woning verduurzamen in Daarlerveen? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hellendoorn.",
  },
  kicker: "Buurtschap in gemeente Hellendoorn",
  h1: "Je woning verduurzamen in Daarlerveen",
  intro: [
    ["Woon je in Daarlerveen of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hellendoorn", href: "/regio/overijssel/hellendoorn" }, " zijn."],
    ["Daarlerveen is een klein buurtschap in het westelijke buitengebied van de gemeente Hellendoorn. Vrijstaande woningen domineren hier, waardoor dakisolatie en spouwmuurisolatie de grootste stap vooruit geven."],
  ],
  kernen: ["daarlerveen", "nijverdal", "daarle", "haarle"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Daarlerveen verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "329", label: "woningen" },
      { waarde: "37%", label: "vrijstaand" },
      { waarde: "77%", label: "koopwoning" },
      { waarde: "61%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 18, tekst: "Historische bebouwing in het buitengebied. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 43, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 17, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 21, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Daarlerveen, 2026", url: "https://www.allecijfers.nl/wijk/daarlerveen-hellendoorn/" },
  },
  lokaal: {
    titel: "Daarlerveen: buurtschap in het westelijke buitengebied",
    alineas: [
      ["Daarlerveen is een klein buurtschap in het westelijke buitengebied van de gemeente Hellendoorn, in de omgeving van Vriezenveen en Almelo. Het buurtschap heeft een rustig, agrarisch karakter."],
      ["Met veel vrijstaande woningen weegt goede isolatie van dak, spouw en vloer hier extra zwaar. Gijs kijkt wat er al is gedaan en helpt met de logische volgende stap."],
    ],
    kernTekst: {
      daarlerveen: "Je bent hier. Klein buurtschap in het westelijke buitengebied.",
      nijverdal: "Voornaamste kern van de gemeente.",
      daarle: "Landelijk dorp in het westen van de gemeente.",
      haarle: "Dorp aan de rand van de Sallandse Heuvelrug.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hellendoorn?",
      tekst: "Hellendoorn werkt aan een warmtevisie. Voor bewoners in het buitengebied geldt dat isoleren nu al loont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hellendoorn",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Daarlerveen moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Daarlerveen?", answer: "Daarlerveen valt onder de gemeente Hellendoorn. De regelingen van Hellendoorn gelden dus ook in Daarlerveen." },
    { question: "Helpt Gijs ook in Daarlerveen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hellendoorn, dus ook in Daarlerveen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
};

const HAARLE: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Haarle | Gijs",
    description: "Je woning verduurzamen in Haarle? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hellendoorn.",
  },
  kicker: "Dorp in gemeente Hellendoorn",
  h1: "Je woning verduurzamen in Haarle",
  intro: [
    ["Woon je in Haarle of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hellendoorn", href: "/regio/overijssel/hellendoorn" }, " zijn."],
    ["Haarle is een pittoresk dorp aan de rand van de Sallandse Heuvelrug. Met overwegend vrijstaande woningen in een bosrijke omgeving is dakisolatie hier voor veel woningen de eerste en meest effectieve stap."],
  ],
  kernen: ["haarle", "nijverdal", "daarle", "daarlerveen"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Haarle verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "475", label: "woningen" },
      { waarde: "26%", label: "vrijstaand" },
      { waarde: "69%", label: "koopwoning" },
      { waarde: "50%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 5, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 45, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 28, tekst: "Grootste bouwgolf van Haarle. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 22, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Haarle, 2026", url: "https://www.allecijfers.nl/wijk/haarle-hellendoorn/" },
  },
  lokaal: {
    titel: "Haarle: bosrijke dorpskern aan de Sallandse Heuvelrug",
    alineas: [
      ["Haarle ligt aan de voet van de Sallandse Heuvelrug, in een bosrijke omgeving. Het dorp trekt toeristen en wandelaars, maar heeft ook een zelfstandige dorpskern met een eigen basisschool, horeca en woningbouw."],
      ["De combinatie van bosrijke omgeving en overwegend vrijstaande woningen maakt dakisolatie in Haarle extra effectief. Gijs kijkt per woning wat de logische eerste stap is."],
    ],
    bekendVan: {
      titel: "Waar is Haarle bekend van?",
      kaarten: [
        { icon: "trees", titel: "Sallandse Heuvelrug", tekst: "Haarle ligt aan de rand van het Nationaal Park Sallandse Heuvelrug, een van de mooiste natuurgebieden van Overijssel met heide, stuifzand en bossen." },
      ],
    },
    kernTekst: {
      haarle: "Je bent hier. Bosrijk dorp aan de Sallandse Heuvelrug.",
      nijverdal: "Voornaamste kern van de gemeente.",
      daarle: "Landelijk dorp in het westen van de gemeente.",
      daarlerveen: "Klein buurtschap in het westelijke buitengebied.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Hellendoorn?",
      tekst: "Hellendoorn werkt aan een warmtevisie. Voor bewoners in dorpen als Haarle geldt dat isoleren nu al loont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hellendoorn",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Haarle moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Haarle?", answer: "Haarle valt onder de gemeente Hellendoorn. De regelingen van Hellendoorn gelden dus ook in Haarle." },
    { question: "Helpt Gijs ook in Haarle?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hellendoorn, dus ook in Haarle." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime percelen in Haarle bieden goede condities voor zonnepanelen. Gijs kijkt naar de juiste combinatie." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
  ],
};

// ─── PlaatsVerhalen Rijssen-Holten ───────────────────────────────────────────

const RIJSSEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Rijssen | Advies & ontzorging – Gijs",
    description: "Op zoek naar een isolatiebedrijf in Rijssen? Gijs geeft onafhankelijk verduurzamingsadvies voor de grootste kern van Rijssen-Holten en begeleidt je van A tot Z. Gratis energiescan.",
  },
  kicker: "Kern in gemeente Rijssen-Holten",
  h1: "Je woning isoleren en verduurzamen in Rijssen",
  intro: [
    ["Woon je in Rijssen? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" }, " zijn."],
    ["Rijssen is de grootste kern van de gemeente Rijssen-Holten. De woningvoorraad is gevarieerd: van compacte naoorlogse woningen in de oudere wijken tot ruime vrijstaande woningen in de nieuwere buurten. Per woning verschilt de meest effectieve stap."],
  ],
  kernen: ["rijssen", "holten"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Rijssen verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "11.226", label: "woningen" },
      { waarde: "21%", label: "vrijstaand" },
      { waarde: "68%", label: "koopwoning" },
      { waarde: "54%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 12, tekst: "Historische bebouwing in het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 42, tekst: "Naoorlogse uitbreiding van de stad. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 24, tekst: "Grootste bouwgolf van Rijssen. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 22, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, woonplaats Rijssen, 2026", url: "https://www.allecijfers.nl/woonplaats/rijssen/" },
  },
  lokaal: {
    titel: "Rijssen: textielstad tussen Twente en Salland",
    alineas: [
      ["Rijssen is een middelgrote stad met een sterke gemeenschapscultuur en een lange textielgeschiedenis. De stad ligt op de grens van Twente en Salland, met de Holterberg op de achtergrond."],
      ["De gevarieerde woningvoorraad vraagt om maatwerk per huis. Naoorlogse rijtjeswoningen profiteren het meest van spouwmuurisolatie, terwijl de grotere woningen aan de rand van de stad dakisolatie en vloerisolatie hoger op de agenda zullen hebben."],
    ],
    kernTekst: {
      rijssen: "Je bent hier. Voornaamste kern van de gemeente.",
      holten: "Dorp aan de Holterberg, in het zuiden van de gemeente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Rijssen-Holten?",
      tekst: "Rijssen-Holten werkt aan een warmtevisie. Voor bewoners in Rijssen geldt dat isoleren nu al loont, ongeacht de toekomstige keuze voor een warmtebron.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Rijssen-Holten",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Rijssen moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Rijssen?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning in Rijssen. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten." },
    { question: "Welke subsidies zijn er voor mijn woning in Rijssen?", answer: "Rijssen valt onder de gemeente Rijssen-Holten. De regelingen van Rijssen-Holten gelden dus ook in Rijssen." },
    { question: "Mijn naoorlogse woning in Rijssen heeft een lege spouw. Wat doe ik?", answer: "Spouwmuurisolatie is voor veel naoorlogse woningen de meest effectieve eerste stap. Gijs kijkt of dat bij jouw woning ook het geval is." },
    { question: "Helpt Gijs ook in Rijssen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Rijssen-Holten, dus ook in Rijssen." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Gijs kijkt naar de combinatie van isolatie en installaties die bij jouw woning past." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
  ],
  woningInzichtenBlok: {
    h2: "Vloerverwarming in een bestaande woning",
    feitVariant: "subtiel",
    percentageTekst: "Rijssen telt ruim 11.000 woningen, waarvan 68% koopwoning",
    bodytekst: "Steeds meer bewoners in Rijssen overwegen een warmtepomp. Een warmtepomp werkt het beste bij lage temperatuurverwarming, en daar hoort vloerverwarming bij. Maar vloerverwarming aanleggen in een bestaande woning klinkt ingrijpend. Dat hoeft niet altijd zo te zijn. Gijs bekijkt of jouw vloer geschikt is, welke systemen in aanmerking komen, en of het past binnen je totale verduurzamingsplan.",
    kaarten: [
      { icon: "thermometer", titel: "Warmtepomp en vloerverwarming", tekst: "Een warmtepomp werkt het efficiëntst bij lage aanvoertemperaturen. Vloerverwarming maakt dat mogelijk zonder grote radiatoren.", href: "/maatregelen/warmtepomp", linkTekst: "Lees over warmtepompen" },
      { icon: "layers", titel: "Eerst isoleren, dan verwarmen", tekst: "Goed geïsoleerde woningen hebben minder vermogen nodig. Dat maakt een kleinere warmtepomp mogelijk, met lagere kosten.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Lees over spouwmuurisolatie" },
    ],
    adviseur: { naam: "thom", h3: "Thom kijkt mee naar jouw woning in Rijssen", tekst: "Vloerverwarming in een bestaande woning vraagt om een goede beoordeling van de vloerconstructie en de isolatiestaat. Thom bekijkt wat er bij jouw huis kan en adviseert je over de juiste volgorde." },
  },
};

const HOLTEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Holten | Advies & ontzorging – Gijs",
    description: "Op zoek naar een isolatiebedrijf in Holten? Gijs geeft onafhankelijk verduurzamingsadvies over isolatie en zonnepanelen voor dit dorp aan de Holterberg, en begeleidt je van A tot Z.",
  },
  kicker: "Kern in gemeente Rijssen-Holten",
  h1: "Je woning isoleren en verduurzamen in Holten",
  intro: [
    ["Woon je in Holten of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" }, " zijn."],
    ["Holten is een dorp aan de rand van de Holterberg. Met een mix van woningen in de kern en vrijstaande woningen aan de bosrand is de verduurzamingsopgave gevarieerd. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["holten", "rijssen"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Holten verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "3.156", label: "woningen" },
      { waarde: "23%", label: "vrijstaand" },
      { waarde: "72%", label: "koopwoning" },
      { waarde: "58%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 9, tekst: "Historische bebouwing in het dorpscentrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 49, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 22, tekst: "Grootste bouwgolf van Holten. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 20, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Holten, 2026", url: "https://www.allecijfers.nl/wijk/holten-rijssen-holten/" },
  },
  lokaal: {
    titel: "Holten: dorp aan de Holterberg",
    alineas: [
      ["Holten ligt aan de voet van de Holterberg, een van de kenmerkende heuvels van Salland. Het dorp trekt wandelaars en fietsers en heeft een levendig centrum. Aan de rand van het dorp liggen vrijstaande woningen in een bosrijke omgeving."],
      ["Woningen dicht bij het bos profitteren extra van goede dakisolatie. Voor rijtjeswoningen in de kern is spouwmuurisolatie vaak de eerste en meest effectieve stap. Gijs kijkt per woning wat past."],
    ],
    bekendVan: {
      titel: "Waar is Holten bekend van?",
      kaarten: [
        { icon: "trees", titel: "Holterberg en Holten cemetery", tekst: "De Holterberg is een karakteristiek heuvellandschap met heide en bossen. Holten is ook bekend van de Commonwealth War Graves Commission begraafplaats voor de Tweede Wereldoorlog." },
      ],
    },
    kernTekst: {
      holten: "Je bent hier. Dorp aan de Holterberg.",
      rijssen: "De grootste kern van de gemeente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Rijssen-Holten?",
      tekst: "Rijssen-Holten werkt aan een warmtevisie. Voor bewoners in Holten geldt dat isoleren nu al loont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Rijssen-Holten",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Holten moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Holten?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning in Holten. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten." },
    { question: "Welke subsidies zijn er voor mijn woning in Holten?", answer: "Holten valt onder de gemeente Rijssen-Holten. De regelingen van Rijssen-Holten gelden dus ook in Holten." },
    { question: "Helpt Gijs ook in Holten?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Rijssen-Holten, dus ook in Holten." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime percelen aan de bosrand in Holten bieden goede condities voor zonnepanelen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
  ],
  woningInzichtenBlok: {
    h2: "Zonnepanelen op je dak. Wat levert het je werkelijk op?",
    feitVariant: "subtiel",
    percentageTekst: "Holten telt ruim 3.100 woningen, grotendeels koopwoning",
    bodytekst: "In Holten staan veel woningen met een ruim dak en een gunstige oriëntatie. Dat maakt zonnepanelen aantrekkelijk. Maar hoeveel panelen heb je werkelijk nodig, en hoe verhoudt de investering zich tot je energieverbruik? Die berekening verschilt per dak, per verbruiksprofiel en per aansluiting. Gijs kijkt naar de feiten en adviseert je over de combinatie van isolatie en opwek die bij jouw situatie past.",
    kaarten: [
      { icon: "sun", titel: "Opbrengst per dakoriëntatie", tekst: "Een dak op het zuiden levert het meest op, maar ook oost-west kan rendabel zijn. De opbrengst hangt af van oriëntatie, hellingshoek en schaduw.", href: "/maatregelen/zonnepanelen", linkTekst: "Lees over zonnepanelen" },
      { icon: "home", titel: "Eerst isoleren, dan opwekken", tekst: "Een goed geïsoleerde woning verbruikt minder. Dat betekent dat je minder panelen nodig hebt om hetzelfde resultaat te bereiken.", href: "/maatregelen/dakisolatie", linkTekst: "Lees over dakisolatie" },
    ],
    adviseur: { naam: "naud", h3: "Naud adviseert je in Holten", tekst: "Holten heeft veel woningen met ruime daken en weinig schaduw. Naud berekent wat zonnepanelen bij jouw woning opleveren en of het slim is om eerst te isoleren." },
  },
};

// ─── PlaatsVerhalen Twenterand ───────────────────────────────────────────────

const VRIEZENVEEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Vriezenveen | Advies & ontzorging – Gijs",
    description: "Je woning isoleren in Vriezenveen, de grootste kern van gemeente Twenterand? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Kern in gemeente Twenterand",
  h1: "Je woning isoleren en verduurzamen in Vriezenveen",
  intro: [
    ["Woon je in Vriezenveen? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Twenterand", href: "/regio/overijssel/twenterand" }, " zijn."],
    ["Vriezenveen is de grootste kern van de gemeente Twenterand. Met een gevarieerde woningvoorraad van naoorlogse rijtjeswoningen tot nieuwere vrijstaande woningen is er voor elk huis een logische eerste stap."],
  ],
  kernen: ["vriezenveen", "vroomshoop", "den-ham", "geerdijk", "de-pollen", "westerhaar-vriezenveensewijk"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Vriezenveen verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "5.417", label: "woningen" },
      { waarde: "28%", label: "vrijstaand" },
      { waarde: "67%", label: "koopwoning" },
      { waarde: "54%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 16, tekst: "Historische bebouwing langs de langgerekte veenkoloniale linten. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 38, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 30, tekst: "Grootste bouwgolf van Vriezenveen. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 17, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Vriezenveen (kern), 2026", url: "https://www.allecijfers.nl/wijk/vriezenveen-kern-twenterand/" },
  },
  lokaal: {
    titel: "Vriezenveen: veenkoloniale lint met een eigen karakter",
    alineas: [
      ["Vriezenveen is een langgerekt veenkoloniaal dorp dat zijn bijzondere structuur heeft bewaard. De historische lintbebouwing langs de Molenstraat en aangrenzende wegen is bepalend voor het karakter van de kern."],
      ["Naoorlogse rijtjeswoningen in de uitbreidingswijken profiteren het meest van spouwmuurisolatie. In de historische lintbebouwing is de situatie per woning anders en is maatwerk nodig. Gijs kijkt wat bij jouw huis past."],
    ],
    bekendVan: {
      titel: "Waar is Vriezenveen bekend van?",
      kaarten: [
        { icon: "map", titel: "Veenkoloniale lintbebouwing", tekst: "Vriezenveen heeft een opmerkelijk langgerekte structuur, ontstaan vanuit de veenontginning. De historische lintbebouwing is een karakteristiek voorbeeld van veenkoloniale stedenbouw in Overijssel." },
      ],
    },
    kernTekst: {
      vriezenveen: "Je bent hier. Grootste kern van de gemeente.",
      vroomshoop: "Dorp in het noorden van Twenterand.",
      "den-ham": "Historisch stadje in het noorden van de gemeente.",
      geerdijk: "Klein buurtschap bij Vriezenveen.",
      "de-pollen": "Buurtschap in het buitengebied van Twenterand.",
      "westerhaar-vriezenveensewijk": "Dorp in het westen van de gemeente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Twenterand?",
      tekst: "Twenterand werkt aan een warmtevisie. Voor bewoners in Vriezenveen geldt dat isoleren nu al loont, ongeacht de toekomstige keuze voor een warmtebron.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Twenterand",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Vriezenveen moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Vriezenveen?", answer: "Vriezenveen valt onder de gemeente Twenterand. De regelingen van Twenterand gelden dus ook in Vriezenveen." },
    { question: "Mijn historische lintbebouwing in Vriezenveen is bijzonder. Kan ik gewoon isoleren?", answer: "Bij historische panden gelden soms extra regels. Gijs kijkt wat mogelijk is en hoe je toch kunt verduurzamen." },
    { question: "Helpt Gijs ook in Vriezenveen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Twenterand, dus ook in Vriezenveen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
  woningInzichtenBlok: {
    h2: "Weet je welke isolatie jouw woning al heeft?",
    feitVariant: 'cirkel',
    percentage: "39%",
    percentageTekst: "van de woningen in Vriezenveen is gebouwd vóór 1975",
    bodytekst: "Misschien zijn de ramen al vervangen of is het dak jaren geleden geïsoleerd. Maar weet je ook wat er onder de vloer zit en of de gevel al is aangepakt? Zonder goed overzicht van eerdere verbeteringen is het lastig om te bepalen welke maatregelen nog waarde toevoegen. Door eerst de bestaande isolatie in kaart te brengen, voorkom je dubbel werk en kun je gerichter investeren. Dat geeft rust en duidelijkheid voordat je aan nieuwe werkzaamheden begint.",
    kaarten: [
      { icon: "clipboard-check", titel: "Hoe controleer ik de bestaande isolatie?", tekst: "Bouwdocumenten, eerdere werkzaamheden en een beoordeling van dak, vloer en gevel kunnen helpen om de huidige situatie inzichtelijk te maken.", href: "/contact#energiescan", linkTekst: "Plan een energiescan" },
      { icon: "list-ordered", titel: "Welke maatregel moet ik als eerste nemen?", tekst: "De juiste volgorde hangt af van warmteverlies, kosten, comfort en jouw plannen. Kies op basis van de woning, niet van een standaardlijst.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Bekijk isolatiemaatregelen" },
    ],
    adviseur: { naam: "naud", h3: "Naud kijkt graag met je mee", tekst: "Heb je in Vriezenveen geen volledig beeld van wat er al is geïsoleerd? Naud helpt de bestaande situatie te beoordelen en welke verbeteringen nog zinvol kunnen zijn. Gijs begeleidt je bij het uitvoeren van de gekozen maatregelen." },
  },
};

const VROOMSHOOP: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Vroomshoop | Advies & ontzorging – Gijs",
    description: "Je woning isoleren in Vroomshoop, het veenkoloniale dorp in gemeente Twenterand? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Dorp in gemeente Twenterand",
  h1: "Je woning isoleren en verduurzamen in Vroomshoop",
  intro: [
    ["Woon je in Vroomshoop of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Twenterand", href: "/regio/overijssel/twenterand" }, " zijn."],
    ["Vroomshoop is een dorp in het noorden van de gemeente Twenterand, met een veenkoloniaal karakter en een gevarieerde woningvoorraad. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["vroomshoop", "vriezenveen", "den-ham", "geerdijk", "de-pollen", "westerhaar-vriezenveensewijk"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Vroomshoop verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "4.000", label: "woningen" },
      { waarde: "28%", label: "vrijstaand" },
      { waarde: "66%", label: "koopwoning" },
      { waarde: "60%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 11, tekst: "Historische veenkoloniale lintbebouwing. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 49, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 22, tekst: "Grootste bouwgolf van Vroomshoop. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 18, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Vroomshoop, 2026", url: "https://www.allecijfers.nl/wijk/vroomshoop-twenterand/" },
  },
  lokaal: {
    titel: "Vroomshoop: veenkoloniaal dorp in het noorden van Twenterand",
    alineas: [
      ["Vroomshoop heeft een veenkoloniaal karakter, met een langgerekte structuur langs de doorgaande wegen. Het dorp heeft eigen voorzieningen en een eigenstandige identiteit binnen de gemeente Twenterand."],
      ["Naoorlogse rijtjeswoningen in de uitbreidingswijken zijn gebaat bij spouwmuurisolatie. In de historische lintbebouwing is maatwerk nodig. Gijs kijkt per woning wat de logische eerste stap is."],
    ],
    kernTekst: {
      vroomshoop: "Je bent hier. Veenkoloniaal dorp in het noorden van de gemeente.",
      vriezenveen: "Grootste kern van de gemeente.",
      "den-ham": "Historisch stadje in het noorden van de gemeente.",
      geerdijk: "Klein buurtschap bij Vriezenveen.",
      "de-pollen": "Buurtschap in het buitengebied van Twenterand.",
      "westerhaar-vriezenveensewijk": "Dorp in het westen van de gemeente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Twenterand?",
      tekst: "Twenterand werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding, ongeacht welke warmtebron de gemeente kiest.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Twenterand",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Vroomshoop moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Vroomshoop?", answer: "Vroomshoop valt onder de gemeente Twenterand. De regelingen van Twenterand gelden dus ook in Vroomshoop." },
    { question: "Helpt Gijs ook in Vroomshoop?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Twenterand, dus ook in Vroomshoop." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
};

const DEN_HAM: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Den Ham | Gijs",
    description: "Je woning verduurzamen in Den Ham? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Twenterand.",
  },
  kicker: "Dorp in gemeente Twenterand",
  h1: "Je woning verduurzamen in Den Ham",
  intro: [
    ["Woon je in Den Ham of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Twenterand", href: "/regio/overijssel/twenterand" }, " zijn."],
    ["Den Ham is een dorp in het noorden van de gemeente Twenterand, met een historisch karakter en een gevarieerde woningvoorraad van historische panden tot naoorlogse woningbouw. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["den-ham", "vriezenveen", "vroomshoop", "geerdijk", "de-pollen", "westerhaar-vriezenveensewijk"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Den Ham verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "2.384", label: "woningen" },
      { waarde: "43%", label: "vrijstaand" },
      { waarde: "77%", label: "koopwoning" },
      { waarde: "57%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 16, tekst: "Historische bebouwing in het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 41, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 23, tekst: "Grootste bouwgolf van Den Ham. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 21, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Den Ham, 2026", url: "https://www.allecijfers.nl/wijk/den-ham-twenterand/" },
  },
  lokaal: {
    titel: "Den Ham: historisch dorp in het noorden van Twenterand",
    alineas: [
      ["Den Ham is een oud dorp met een eigen identiteit, gelegen in het noordelijke deel van de gemeente Twenterand. Het dorp heeft een historisch centrum met karakteristieke bebouwing langs de doorgaande straten."],
      ["De combinatie van historische bebouwing en naoorlogse woningbouw maakt de verduurzamingsopgave in Den Ham gevarieerd. Per woning verschilt de meest effectieve eerste stap."],
    ],
    kernTekst: {
      "den-ham": "Je bent hier. Historisch dorp in het noorden van de gemeente.",
      vriezenveen: "Grootste kern van de gemeente.",
      vroomshoop: "Veenkoloniaal dorp in het noorden van de gemeente.",
      geerdijk: "Klein buurtschap bij Vriezenveen.",
      "de-pollen": "Buurtschap in het buitengebied van Twenterand.",
      "westerhaar-vriezenveensewijk": "Dorp in het westen van de gemeente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Twenterand?",
      tekst: "Twenterand werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Twenterand",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Den Ham moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Den Ham?", answer: "Den Ham valt onder de gemeente Twenterand. De regelingen van Twenterand gelden dus ook in Den Ham." },
    { question: "Helpt Gijs ook in Den Ham?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Twenterand, dus ook in Den Ham." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
};

const GEERDIJK: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Geerdijk | Gijs",
    description: "Je woning verduurzamen in Geerdijk? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Twenterand.",
  },
  kicker: "Buurtschap in gemeente Twenterand",
  h1: "Je woning verduurzamen in Geerdijk",
  intro: [
    ["Woon je in Geerdijk of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Twenterand", href: "/regio/overijssel/twenterand" }, " zijn."],
    ["Geerdijk is een klein buurtschap bij Vriezenveen, met overwegend vrijstaande woningen in een landelijke omgeving. Dakisolatie en spouwmuurisolatie hebben hier voor de meeste woningen het meeste effect."],
  ],
  kernen: ["geerdijk", "vriezenveen", "vroomshoop", "den-ham", "de-pollen", "westerhaar-vriezenveensewijk"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Geerdijk verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "355", label: "woningen" },
      { waarde: "72%", label: "vrijstaand" },
      { waarde: "88%", label: "koopwoning" },
      { waarde: "65%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 27, tekst: "Historische bebouwing in het buitengebied. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 38, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 19, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 16, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurten Geerdijk-West en -Oost, 2026", url: "https://www.allecijfers.nl/buurt/geerdijk-west-twenterand/" },
  },
  lokaal: {
    titel: "Geerdijk: buurtschap in het buitengebied van Twenterand",
    alineas: [
      ["Geerdijk is een klein buurtschap in het buitengebied van de gemeente Twenterand, vlakbij Vriezenveen. Het heeft een rustig, landelijk karakter met vrijstaande woningen langs de doorgaande wegen."],
      ["Vrijstaande woningen hebben meer buitenoppervlak. Dakisolatie, spouwmuurisolatie en vloerisolatie hebben hier verhoudingsgewijs meer effect. Gijs kijkt wat de logische volgorde is voor jouw woning."],
    ],
    kernTekst: {
      geerdijk: "Je bent hier. Klein buurtschap bij Vriezenveen.",
      vriezenveen: "Grootste kern van de gemeente.",
      vroomshoop: "Veenkoloniaal dorp in het noorden van de gemeente.",
      "den-ham": "Historisch dorp in het noorden van de gemeente.",
      "de-pollen": "Buurtschap in het buitengebied van Twenterand.",
      "westerhaar-vriezenveensewijk": "Dorp in het westen van de gemeente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Twenterand?",
      tekst: "Twenterand werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Twenterand",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Geerdijk moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Geerdijk?", answer: "Geerdijk valt onder de gemeente Twenterand. De regelingen van Twenterand gelden dus ook in Geerdijk." },
    { question: "Helpt Gijs ook in Geerdijk?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Twenterand, dus ook in Geerdijk." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
};

const DE_POLLEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in De Pollen | Gijs",
    description: "Je woning verduurzamen in De Pollen? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Twenterand.",
  },
  kicker: "Buurtschap in gemeente Twenterand",
  h1: "Je woning verduurzamen in De Pollen",
  intro: [
    ["Woon je in De Pollen of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Twenterand", href: "/regio/overijssel/twenterand" }, " zijn."],
    ["De Pollen is een klein buurtschap in het buitengebied van de gemeente Twenterand. Met overwegend vrijstaande woningen weegt goede isolatie hier extra zwaar. Gijs kijkt wat bij jouw huis past."],
  ],
  kernen: ["de-pollen", "vriezenveen", "vroomshoop", "den-ham", "geerdijk", "westerhaar-vriezenveensewijk"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van De Pollen verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "209", label: "woningen" },
      { waarde: "62%", label: "vrijstaand" },
      { waarde: "81%", label: "koopwoning" },
      { waarde: "60%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 27, tekst: "Historische bebouwing in het buitengebied. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 33, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 19, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 22, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt De Pollen, 2026", url: "https://www.allecijfers.nl/buurt/verspreide-huizen-de-pollen-twenterand/" },
  },
  lokaal: {
    titel: "De Pollen: buurtschap in het buitengebied van Twenterand",
    alineas: [
      ["De Pollen is een klein buurtschap in het buitengebied van de gemeente Twenterand. Het heeft een agrarisch karakter, met vrijstaande woningen langs de doorgaande wegen en een open landschap."],
      ["Met meer buitenoppervlak per woning weegt goede isolatie van dak, spouw en vloer hier extra zwaar. Gijs kijkt wat er al is gedaan en helpt met de logische volgende stap."],
    ],
    kernTekst: {
      "de-pollen": "Je bent hier. Klein buurtschap in het buitengebied.",
      vriezenveen: "Grootste kern van de gemeente.",
      vroomshoop: "Veenkoloniaal dorp in het noorden van de gemeente.",
      "den-ham": "Historisch dorp in het noorden van de gemeente.",
      geerdijk: "Klein buurtschap bij Vriezenveen.",
      "westerhaar-vriezenveensewijk": "Dorp in het westen van de gemeente.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Twenterand?",
      tekst: "Twenterand werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Twenterand",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in De Pollen moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in De Pollen?", answer: "De Pollen valt onder de gemeente Twenterand. De regelingen van Twenterand gelden dus ook in De Pollen." },
    { question: "Helpt Gijs ook in De Pollen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Twenterand, dus ook in De Pollen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
};

const WESTERHAAR_VRIEZENVEENSEWIJK: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Westerhaar-Vriezenveensewijk | Gijs",
    description: "Je woning verduurzamen in Westerhaar-Vriezenveensewijk? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Twenterand.",
  },
  kicker: "Dorp in gemeente Twenterand",
  h1: "Je woning verduurzamen in Westerhaar-Vriezenveensewijk",
  intro: [
    ["Woon je in Westerhaar-Vriezenveensewijk of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Twenterand", href: "/regio/overijssel/twenterand" }, " zijn."],
    ["Westerhaar-Vriezenveensewijk is een dorp in het westen van de gemeente Twenterand, met een veenkoloniaal karakter en een gevarieerde woningvoorraad. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["westerhaar-vriezenveensewijk", "vriezenveen", "vroomshoop", "den-ham", "geerdijk", "de-pollen"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Westerhaar-Vriezenveensewijk verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "1.986", label: "woningen" },
      { waarde: "33%", label: "vrijstaand" },
      { waarde: "53%", label: "koopwoning" },
      { waarde: "58%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 10, tekst: "Historische veenkoloniale lintbebouwing. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 48, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 23, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 19, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Westerhaar-Vriezenveensewijk, 2026", url: "https://www.allecijfers.nl/wijk/westerhaar-vriezenveensewijk-twenterand/" },
  },
  lokaal: {
    titel: "Westerhaar-Vriezenveensewijk: veenkoloniaal dorp in het westen",
    alineas: [
      ["Westerhaar-Vriezenveensewijk is een dorp met een typisch veenkoloniaal karakter, met een langgerekte structuur langs de doorgaande wegen. Het dorp heeft een eigenstandige identiteit en een eigen voorzieningenniveau."],
      ["Naoorlogse rijtjeswoningen in de uitbreidingswijken zijn gebaat bij spouwmuurisolatie. In de historische lintbebouwing is maatwerk nodig. Gijs kijkt per woning wat de logische eerste stap is."],
    ],
    kernTekst: {
      "westerhaar-vriezenveensewijk": "Je bent hier. Veenkoloniaal dorp in het westen van de gemeente.",
      vriezenveen: "Grootste kern van de gemeente.",
      vroomshoop: "Veenkoloniaal dorp in het noorden van de gemeente.",
      "den-ham": "Historisch dorp in het noorden van de gemeente.",
      geerdijk: "Klein buurtschap bij Vriezenveen.",
      "de-pollen": "Buurtschap in het buitengebied van Twenterand.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in de gemeente Twenterand?",
      tekst: "Twenterand werkt aan een warmtevisie. Isoleren is nu al de beste voorbereiding.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Twenterand",
    lead: "In spouwmuren, muren en daken wonen vaak beschermde dieren. Bij isolatie in Westerhaar-Vriezenveensewijk moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Meer hoef je zelf niet te doen. Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Gaat het om een beschermde soort? Dan regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Welke subsidies zijn er voor mijn woning in Westerhaar-Vriezenveensewijk?", answer: "Westerhaar-Vriezenveensewijk valt onder de gemeente Twenterand. De regelingen van Twenterand gelden dus ook hier." },
    { question: "Helpt Gijs ook in Westerhaar-Vriezenveensewijk?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Twenterand, dus ook in Westerhaar-Vriezenveensewijk." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Gijs kijkt naar de combinatie van isolatie en installaties die bij jouw woning past." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 23 oktober 2026.
// Gemeente Zwolle: 61.693 woningen (CBS 2025). Buurt Berkum: 1.719 woningen (CBS 2025).
const ZWOLLE: GemeenteVerhaal = {
  seo: {
    title: "Huis isoleren in Zwolle? Maatregelen & subsidies | Gijs",
    description: "Huis of woning isoleren in Zwolle? Bekijk maatregelen, actuele subsidies en vraag een gratis energiescan aan. Gijs is actief in heel Zwolle, van Stadshagen tot Windesheim.",
  },
  kicker: "Gemeente Zwolle",
  h1: "Je huis isoleren en verduurzamen in Zwolle",
  intro: [
    ["Woon je in Zwolle? Gijs helpt je uitzoeken welke isolatie en installaties bij jouw woning passen, en welke subsidies er nu gelden. Gijs is actief in de hele gemeente, van ", { tekst: "Stadshagen", href: "/regio/overijssel/zwolle/stadshagen" }, " en ", { tekst: "Westenholte", href: "/regio/overijssel/zwolle/westenholte" }, " tot het historische ", { tekst: "Windesheim", href: "/regio/overijssel/zwolle/windesheim" }, " en ", { tekst: "Berkum", href: "/regio/overijssel/zwolle/berkum" }, ", waar we samenwerken met bewonerscoöperatie BEN."],
    ["Van de ruim 61.000 woningen in Zwolle is bijna vier op de tien gebouwd vóór 1975, vaak met een buitenmuur die nog niet of nauwelijks is geïsoleerd. ", { tekst: "Spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " is dan vaak de eerste en meest effectieve stap, naast ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, " en ", { tekst: "vloerisolatie", href: "/maatregelen/vloerisolatie" }, ". Gijs kijkt altijd eerst wat er al is gedaan, en helpt dan met de stap die logisch is voor jouw huis."],
    ["Gijs is geen isolatiebedrijf, maar een onafhankelijke adviseur: je krijgt één vast aanspreekpunt dat met je meedenkt vanaf de eerste vraag tot en met de uitvoering door een erkend isolatiebedrijf. Zo ontzorgt Gijs je van A tot Z, ook bij het aanvragen van subsidie."],
  ],
  kernen: [
    "zwolle", "stadshagen", "westenholte", "berkum", "windesheim", "wijthmen", "herfte", "haerst",
    "frankhuis", "langenholte", "spoolde", "harculo", "hoog-zuthem",
    "brinkhoek", "bruggenhoek", "de-lichtmis", "katerveer", "oldeneel", "schelle", "veldhoek", "zalne",
    "de-ruiten", "nieuwe-wetering", "oud-ittersum", "oude-wetering", "tolhuislanden",
  ],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Zwolle verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "61.693", label: "woningen" },
      { waarde: "38%", label: "gebouwd vóór 1975" },
      { waarde: "53%", label: "koopwoning" },
      { waarde: "€375.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 38, tekst: "Bijna twee op de vijf Zwolse woningen is uit deze periode. Weinig of geen isolatie, spouw vaak nog leeg. Dak, spouw en vloer zijn hier de grootste kansen." },
      { label: "1975 – 1995", percentage: 27, tekst: "Deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Laat eerst checken wat er al zit, dan bijisoleren waar dat loont." },
      { label: "1995 – 2015", percentage: 24, tekst: "Redelijk geïsoleerd bij oplevering. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
      { label: "Na 2015", percentage: 10, tekst: "Al goed geïsoleerd. De aandacht verschuift naar installaties: zonnepanelen, thuisbatterij of een warmtepompoplossing." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/zwolle/" },
  },
  lokaal: {
    titel: "Zwolle: grote stad, gevarieerde woningvoorraad",
    alineas: [
      ["Zwolle is een grote, gevarieerde stad. De wijken verschillen sterk: van de historische binnenstad met soms monumentale panden, tot naoorlogse gezinswijken en nieuwbouwgebieden als Stadshagen. Die verscheidenheid zie je ook in de woningen: van appartement in het centrum tot vrijstaande woning in de buitenwijken."],
      ["In de wijk Berkum werkt Gijs samen met bewonerscoöperatie Berkum Energieneutraal (BEN). BEN begeleidt bewoners op weg naar een aardgasvrij-klare woning, in samenwerking met de gemeente Zwolle. Woon je elders in Zwolle en wil je je huis verduurzamen? Gijs helpt ook dan."],
    ],
    bekendVan: {
      titel: "Waar is Zwolle bekend van?",
      kaarten: [
        { icon: "landmark", titel: "De Peperbus", tekst: "De gotische toren van de Onze Lieve Vrouwekerk, het symbool van Zwolle." },
        { icon: "shield", titel: "PEC Zwolle", tekst: "Profvoetbalclub van de stad, spelend in de Eredivisie." },
        { icon: "leaf", titel: "Berkum Energieneutraal", tekst: "Bewonerscoöperatie in Berkum die de hele wijk aardgasvrij-klaar wil maken." },
      ],
    },
    kernTekst: {
      zwolle: "Je bent hier. Provinciestad van Overijssel, met 134.000 inwoners en een gevarieerde woningvoorraad.",
      stadshagen: "Grote moderne wijk in het westen, gebouwd vanaf 1995. Bijna 11.000 woningen.",
      westenholte: "Voormalige gemeente (Zwollerkerspel), nu wijk in het westen. Naoorlogs met historisch dorpscentrum.",
      berkum: "Woonwijk ten noorden van het centrum, actief bezig met verduurzaming via bewonerscoöperatie BEN.",
      windesheim: "Historisch dorp in het zuiden, bekend van de middeleeuwse Congregatie van Windesheim.",
      wijthmen: "Buurtschap met agrarisch karakter en estate-sfeer, ten zuiden van Zwolle.",
      herfte: "Klein buurtschap langs de Vecht, met overwegend vrijstaande woningen.",
      haerst: "Buurtschap in het Vechtdal, aan de grens met Zwartewaterland.",
    },
    wijken: {
      titel: "Wijken in Zwolle",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Binnenstad", woningen: 2878, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 30,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 49 }, { label: "1945 tot 1965", percentage: 2 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Diezerpoort", woningen: 6648, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 25,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 20 }, { label: "1945 tot 1965", percentage: 28 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wipstrik", woningen: 3162, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 56,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 42 }, { label: "1945 tot 1965", percentage: 17 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 0 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Assendorp", woningen: 6636, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 48,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 54 }, { label: "1945 tot 1965", percentage: 17 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 1 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Kamperpoort-Veerallee", woningen: 2068, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 37,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 15 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 1 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 32 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Poort van Zwolle", woningen: 159, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 51 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Westenholte", woningen: 2224, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 68,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 5 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 44 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Stadshagen", woningen: 10790, periode: "Grotendeels 1995 – 2015", tijdvak: 2, koopwoningPercentage: 66,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 0 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 39 }, { label: "2005 tot 2015", percentage: 30 }, { label: "2015 tot 2025", percentage: 22 }, { label: "2025 en later", percentage: 9 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Holtenbroek", woningen: 5109, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 35,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 0 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 46 }, { label: "1975 tot 1985", percentage: 2 }, { label: "1985 tot 1995", percentage: 2 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 17 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Aa-landen", woningen: 6289, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 49,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 0 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 49 }, { label: "1975 tot 1985", percentage: 42 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 0 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Vechtlanden", woningen: 418, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 91,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 25 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 30 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Berkum", woningen: 2180, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 64,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 5 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 24 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Marsweteringlanden", woningen: 408, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 85,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 19 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Schelle", woningen: 6046, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 73,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 6 }, { label: "1945 tot 1965", percentage: 1 }, { label: "1965 tot 1975", percentage: 1 }, { label: "1975 tot 1985", percentage: 1 }, { label: "1985 tot 1995", percentage: 64 }, { label: "1995 tot 2005", percentage: 23 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Ittersum", woningen: 6383, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 62,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 2 }, { label: "1945 tot 1965", percentage: 5 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 49 }, { label: "1985 tot 1995", percentage: 35 }, { label: "1995 tot 2005", percentage: 2 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Soestweteringlanden", woningen: 295, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 37 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/zwolle/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Zwolle?",
      tekst: "De gemeente Zwolle werkt aan een warmteprogramma: welke wijk verwarmt straks hoe, en op welke termijn gaat die van het aardgas af? Berkum is daarin al ver. Voor andere wijken geldt: isoleren is de eerste stap, ongeacht hoe de wijk later verwarmd gaat worden.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Zwolle",
    lead: "In spouwmuren, muren en daken van Zwolse woningen wonen vleermuizen, huismussen en gierzwaluwen. Dat zijn beschermde dieren. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een gespecialiseerd bedrijf weet hoe het met beschermde soorten omgaat en regelt ook de verplichte melding." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te gaan vóór er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Het isolatiebedrijf zorgt voor vervangende nestkasten of invliegopeningen, zoveel mogelijk onzichtbaar in de spouw of het dak." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te regelen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Wet natuurbescherming via provincie Overijssel", url: "https://www.overijssel.nl/thema/natuur-milieu-en-water/natuur/bescherming-planten-en-dieren/" },
  },
  faq: [
    { question: "Hoe isoleer ik de muren van mijn huis in Zwolle?", answer: "Bij de meeste naoorlogse woningen in Zwolle is spouwmuurisolatie de snelste manier om de buitenmuur te isoleren: het isolatiemateriaal wordt via een klein boorgat in de bestaande spouw aangebracht. Heeft jouw huis geen spouw, dan kijkt Gijs naar binnen- of buitengevelisolatie als alternatief." },
    { question: "Kan ik ook mijn dak of zolderplafond isoleren in Zwolle?", answer: "Ja. Dakisolatie, vaak aangebracht tussen de dakspanten of tegen het zolderplafond, is bij oudere Zwolse woningen samen met spouwmuurisolatie een van de eerste stappen. Gijs kijkt tijdens de energiescan welke methode bij jouw dakconstructie past en wat dat oplevert." },
    { question: "Helpt Gijs in heel Zwolle, niet alleen in Berkum?", answer: "Ja. Gijs helpt in de hele gemeente Zwolle. De samenwerking met Berkum Energieneutraal geldt specifiek voor de wijk Berkum, maar een gratis energiescan kun je overal in Zwolle aanvragen." },
    { question: "Welke subsidies zijn er nu in Zwolle?", answer: "Dat verandert regelmatig. Op deze pagina zie je de regelingen die nu voor Zwolle in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn huis is gebouwd vóór 1975. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer, maar het hangt af van wat er al is gedaan. Veel oudere Zwolse woningen zijn al deels verbeterd door een vorige eigenaar. Gijs kijkt tijdens de energiescan wat er nog te winnen valt." },
    { question: "Moet ik bij isolatie rekening houden met vleermuizen of huismussen?", answer: "Ja. In Zwolle, en in heel Nederland, zijn vleermuizen, huismussen en gierzwaluwen wettelijk beschermd. Kies een isolatiebedrijf dat hier mee weet om te gaan. Dat bedrijf regelt ook de melding bij de provincie Overijssel." },
    { question: "Kijkt Gijs ook naar zonnepanelen of een warmtepomp?", answer: "Ja. Gijs kijkt naar het geheel: isolatie én installaties, en naar de volgorde die past bij jouw woning. De gratis energiescan geeft je dat inzicht." },
    { question: "Ik huur mijn woning. Kan ik ook bij Gijs terecht?", answer: "Gijs richt zich op woningeigenaren. Huur je van een corporatie, dan kun je het beste contact opnemen met je verhuurder over verduurzaming." },
    { question: "Werk je samen met een isolatiebedrijf in Zwolle, of doet Gijs dat zelf?", answer: "Gijs voert de isolatiewerkzaamheden niet zelf uit. Als onafhankelijk adviseur kijkt Gijs welke maatregelen bij jouw woning passen en helpt je bij de keuze, subsidieaanvraag en begeleiding van de uitvoering. Gijs werkt daarvoor samen met erkende isolatiebedrijven in de regio Zwolle." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Berkum", href: "/regio/overijssel/zwolle/berkum" },
    { naam: "Verduurzamen in Overijssel", href: "/regio/overijssel" },
  ],
  partner: {
    naam: "Berkum Energieneutraal (BEN)",
    logo: "/Logo-BEN-275x300.png",
    url: "https://www.berkumenergieneutraal.nl",
    urlLabel: "berkumenergieneutraal.nl",
    tagline: "Gijs werkt samen met BEN, de bewonerscoöperatie die verduurzaming in Berkum organiseert.",
    display: 'compact',
  },
};

const BERKUM_ZWOLLE: GemeenteVerhaal = {
  seo: {
    title: "Woning verduurzamen in Berkum (Zwolle) met Gijs en BEN | Gijs",
    description: "Woon je in Berkum? Gijs werkt samen met Berkum Energieneutraal en helpt je met isolatie, installaties en een gratis energiescan op weg naar een aardgasvrij-klare woning.",
  },
  kicker: "Berkum, gemeente Zwolle",
  h1: "Je woning verduurzamen in Berkum",
  intro: [
    ["In Berkum wordt al jaren samengewerkt aan een wijk die minder energie gebruikt en straks zonder aardgas kan. Dat begint bij je eigen huis: hoe goed is het geïsoleerd, en wat is een logische volgende stap?"],
    ["Gijs helpt bewoners van Berkum om dat rustig en zonder verplichtingen te ontdekken. Met een gratis energiescan krijg je inzicht in je woning en een helder beeld van wat er kan, in samenwerking met bewonerscoöperatie ", { tekst: "Berkum Energieneutraal (BEN)", href: "https://www.berkumenergieneutraal.nl/", extern: true }, "."],
  ],
  kernen: ["berkum", "zwolle", "westenholte", "stadshagen", "windesheim"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Berkum verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "1.719", label: "woningen" },
      { waarde: "48%", label: "gebouwd 1945–1975" },
      { waarde: "71%", label: "koopwoning" },
      { waarde: "€474.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 2, tekst: "Slechts een klein deel van Berkum. Gebouwd zonder isolatienormen; spouw, dak en vloer zijn hier de grootste kansen." },
      { label: "1945 – 1975", percentage: 48, tekst: "De grootste bouwperiode van Berkum. Naoorlogse gezinswijken met spouwmuren die vaak nog leeg zijn of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 37, tekst: "Deels geïsoleerd bij oplevering, maar bijna altijd te verbeteren. Laat eerst checken wat er al zit." },
      { label: "Na 1995", percentage: 13, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd, ook door vorige eigenaren. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Berkum, 2026", url: "https://www.allecijfers.nl/buurt/berkum-zwolle/" },
  },
  lokaal: {
    titel: "Berkum en Berkum Energieneutraal",
    alineas: [
      ["Berkum Energieneutraal (BEN) is een initiatief van en voor bewoners van Berkum. Het wordt gedragen door vrijwilligers uit de wijk, verenigd in een stichting en een energiecoöperatie, in samenwerking met de gemeente Zwolle en de woningcorporaties."],
      ["BEN wil dat Berkum minder energie gebruikt, zelf duurzame energie opwekt en uiteindelijk van het aardgas af gaat. De eerste stap is het verduurzamen van de woningen zelf. Gijs is samenwerkingspartner van BEN: we helpen bewoners met inzicht in hun woning en de mogelijke vervolgstappen."],
      ["Berkum is aangewezen als proeftuin in het landelijke programma voor aardgasvrije wijken. Dat betekent niet dat bewoners verplicht zijn iets te doen. De energiescan bij Gijs is gratis en vrijblijvend, je beslist zelf wat je wanneer doet."],
    ],
    bekendVan: {
      titel: "Berkum in cijfers",
      kaarten: [
        { icon: "home", titel: "82% eengezins", tekst: "Tussenwoningen (29%), twee-onder-één-kap (21%) en vrijstaand (15%) zijn de meest voorkomende typen." },
        { icon: "leaf", titel: "Proeftuin aardgasvrij", tekst: "Berkum is één van de landelijke proeftuinen aardgasvrije wijken." },
        { icon: "users", titel: "BEN coöperatie", tekst: "Berkum Energieneutraal begeleidt bewoners bij verduurzaming, onafhankelijk van gemeente en corporaties." },
      ],
    },
    kernTekst: {
      berkum: "Je bent hier. Woonwijk ten noorden van het centrum, actief bezig met verduurzaming via BEN.",
      zwolle: "De provinciestad van Overijssel, met alle gemeentelijke voorzieningen.",
      westenholte: "Voormalige gemeente, nu wijk in het westen. Naoorlogs met historisch dorpscentrum.",
      stadshagen: "Grote moderne wijk in het westen van Zwolle, gebouwd vanaf 1995.",
      windesheim: "Historisch dorp in het zuiden, bekend van de middeleeuwse Congregatie van Windesheim.",
    },
    ontwikkeling: {
      titel: "Doel: aardgasvrij-ready in 2028",
      tekst: "BEN heeft de ambitie dat in 2028 alle woningen in Berkum aardgasvrij-ready zijn. Dat is een doel van BEN, geen belofte van Gijs. Aardgasvrij-ready betekent dat je huis zo goed geïsoleerd is dat het straks met een lagere temperatuur verwarmd kan worden, zonder dat je nu al van het gas af hoeft.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Berkum",
    lead: "In spouwmuren, muren en daken van woningen in Berkum wonen vleermuizen, huismussen en gierzwaluwen. Dat zijn beschermde dieren. Bij isolatie moet je hier rekening mee houden. Zo pak je dat aan:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een gespecialiseerd bedrijf weet hoe het met beschermde soorten omgaat en regelt ook de verplichte melding." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te gaan vóór er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Het isolatiebedrijf zorgt voor vervangende nestkasten of invliegopeningen, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te regelen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Wet natuurbescherming via provincie Overijssel", url: "https://www.overijssel.nl/thema/natuur-milieu-en-water/natuur/bescherming-planten-en-dieren/" },
  },
  faq: [
    { question: "Moet ik meedoen aan het BEN-programma?", answer: "Nee. Meedoen is altijd vrijwillig. De energiescan bij Gijs is gratis en vrijblijvend: je beslist zelf wat je wanneer doet, en met wie." },
    { question: "Wat is aardgasvrij-ready?", answer: "Aardgasvrij-ready betekent dat je woning zo goed geïsoleerd is dat ze straks met een lager temperatuurniveau verwarmd kan worden, zodat ze klaar is voor een warmtepomp. Je stapt nu nog niet van het gas af, maar je woning is er wel op voorbereid." },
    { question: "Welke subsidies zijn er nu in Berkum?", answer: "Berkum valt onder de gemeente Zwolle. Op deze pagina zie je de regelingen die nu voor Zwolle in de Energiesubsidiewijzer van Milieu Centraal staan. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn huis is gebouwd tussen 1945 en 1975. Waar begin ik?", answer: "Bijna de helft van Berkum is uit die periode. De spouw is vaak nog leeg of dunner geïsoleerd dan nu gebruikelijk. Gijs kijkt tijdens de energiescan wat er al is en welke stap de meeste winst geeft." },
    { question: "Is Gijs onderdeel van BEN of de gemeente?", answer: "Nee. Gijs is een onafhankelijke samenwerkingspartner van BEN. Gijs werkt niet namens BEN, de gemeente of een woningcorporatie, en is ook niet exclusief aan Berkum verbonden." },
    { question: "Kijkt Gijs ook naar zonnepanelen of een warmtepomp?", answer: "Ja. Gijs kijkt naar isolatie én installaties. Wat als eerste past, hangt af van jouw woning. In Berkum is isolatie vaak de logische eerste stap, maar de energiescan geeft je het complete beeld." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Verduurzamen in Overijssel", href: "/regio/overijssel" },
  ],
  partner: {
    naam: "Berkum Energieneutraal (BEN)",
    logo: "/Logo-BEN-275x300.png",
    url: "https://www.berkumenergieneutraal.nl",
    urlLabel: "berkumenergieneutraal.nl",
    tagline: "Gijs werkt samen met BEN, de bewonerscoöperatie die verduurzaming in Berkum organiseert.",
    display: 'hero',
  },
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 23 oktober 2026.
// Gemeente Zwolle heeft officieel één woonplaats. De sub-kernen zijn wijken en buurtschappen.
// Bouwperiodes voor buurtschappen zijn inschattingen; AlleCijfers toont ze als grafieken.
// Bronnen: wijk Westenholte, wijk Stadshagen, buurt Windesheim, buurt Wijthmen, buurt Herfte,
// buurt Haerst, allemaal AlleCijfers.nl 2026.

const WESTENHOLTE: GemeenteVerhaal = {
  seo: {
    title: "Westenholte: isolatie en verduurzaming | Gijs",
    description: "Woon je in Westenholte? Lees wat het bouwjaar van je wijk zegt over isoleren, en waar je rekening mee houdt bij beschermde dieren in spouw of dak.",
  },
  kicker: "Wijk in gemeente Zwolle",
  h1: "Je woning verduurzamen in Westenholte",
  intro: [
    ["Woon je in Westenholte? Gijs helpt je uitzoeken welke isolatie en installaties bij jouw woning passen en begeleidt je van advies tot uitvoering."],
    ["Westenholte was tot 1967 een zelfstandige gemeente. De meeste woningen zijn naoorlogs gebouwd, met name in de jaren zestig en zeventig. Juist in dat bouwjaar is de verduurzamingswinst vaak het grootst. De actuele subsidies van de gemeente ", { tekst: "Zwolle", href: "/regio/overijssel/zwolle" }, " gelden ook hier; zie de regelingen hieronder."],
  ],
  kernen: ["westenholte", "zwolle", "berkum", "stadshagen"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Westenholte verdeeld.",
    kerncijfers: [
      { waarde: "2.224", label: "woningen" },
      { waarde: "40%", label: "gebouwd vóór 1975" },
      { waarde: "68%", label: "koopwoning" },
      { waarde: "€408.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 5, tekst: "Historische bebouwing uit de tijd dat Westenholte een zelfstandige gemeente was. Bijna altijd gebouwd zonder isolatienormen, spouw, dak en vloer zijn hier de grootste winst." },
      { label: "1945 – 1975", percentage: 35, tekst: "De grootste groei van Westenholte als uitbreidingswijk van Zwolle. Spouwmuren aanwezig, maar de spouw is vaak nog leeg." },
      { label: "1975 – 1995", percentage: 40, tekst: "Deels geïsoleerd bij oplevering, maar bijna altijd te verbeteren. Eerst kijken wat er al zit, dan bijisoleren." },
      { label: "Na 1995", percentage: 20, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Westenholte, 2026", url: "https://www.allecijfers.nl/wijk/westenholte-zwolle/" },
  },
  lokaal: {
    titel: "Westenholte: voormalige gemeente met eigen karakter",
    alineas: [
      ["Westenholte was tot 1967 een zelfstandige gemeente, Zwollerkerspel genaamd. Het heeft een eigen historisch dorpscentrum met de Westenholterkerk, een 13e-eeuws rijksmonument dat nog steeds het hart van de wijk vormt."],
      ["Na de fusie groeide Westenholte verder met naoorlogse woonwijken. Die combinatie van historische bebouwing en naoorlogse uitbreiding bepaalt ook wat er te verduurzamen valt: bij de oudste woningen is de spouw vaak nog leeg, de nieuwere hebben al deels isolatie maar zijn bijna altijd te verbeteren."],
    ],
    bekendVan: {
      titel: "Waar is Westenholte bekend van?",
      kaarten: [
        { icon: "church", titel: "Westenholterkerk", tekst: "De 13e-eeuwse kerk is een rijksmonument en het historisch hart van de voormalige gemeente Zwollerkerspel." },
        { icon: "landmark", titel: "Voormalige gemeente", tekst: "Westenholte maakte tot 1967 deel uit van gemeente Zwollerkerspel, één van de oudste gemeenten rondom Zwolle." },
      ],
    },
    kernTekst: {
      westenholte: "Je bent hier. Voormalige gemeente, nu wijk in het westen van Zwolle.",
      zwolle: "De provinciestad van Overijssel, met het gemeentehuis en de meeste voorzieningen.",
      berkum: "Woonwijk ten noorden van het centrum, met bewonerscoöperatie BEN.",
      stadshagen: "Grote moderne wijk in het westen, gebouwd vanaf 1995.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Zwolle?",
      tekst: "De gemeente Zwolle werkt aan een warmteprogramma: welke wijk verwarmt straks hoe, en op welke termijn gaat die van het aardgas af? Isoleren is in Westenholte de eerste stap, ongeacht hoe de wijk later verwarmd gaat worden.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Westenholte",
    lead: "In spouwmuren, muren en daken van woningen in Westenholte wonen vleermuizen, huismussen en gierzwaluwen. Dat zijn beschermde dieren. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een gespecialiseerd bedrijf weet hoe het met beschermde soorten omgaat en regelt ook de verplichte melding." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te gaan vóór er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Het isolatiebedrijf zorgt voor vervangende nestkasten of invliegopeningen, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te regelen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Wet natuurbescherming via provincie Overijssel", url: "https://www.overijssel.nl/thema/natuur-milieu-en-water/natuur/bescherming-planten-en-dieren/" },
  },
  faq: [
    { question: "Helpt Gijs ook in Westenholte?", answer: "Ja. Gijs helpt in de hele gemeente Zwolle, ook in Westenholte. Een gratis energiescan is overal in Zwolle aan te vragen." },
    { question: "Welke subsidies zijn er in Westenholte?", answer: "Westenholte valt onder gemeente Zwolle. De regelingen die nu voor Zwolle gelden, zijn ook op jouw woning van toepassing. Met de subsidiecheck zie je wat er voor jouw adres geldt." },
    { question: "Mijn huis is uit de jaren zestig of zeventig. Waar begin ik?", answer: "Veel woningen in Westenholte zijn uit die periode. De spouwmuur is bijna altijd aanwezig, maar de spouw is vaak nog leeg of dunner geïsoleerd dan gebruikelijk. Gijs kijkt tijdens de energiescan wat er al is en welke stap de meeste winst geeft." },
    { question: "Mijn woning is een rijksmonument of nabij een monument. Mag ik zomaar isoleren?", answer: "Voor rijksmonumenten gelden beperkingen. Voor gewone woningen naast een monument zijn er geen bijzondere regels. Bij twijfel kijkt Gijs mee en verwijst naar de juiste instantie." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In heel Zwolle zijn vleermuizen, huismussen en gierzwaluwen wettelijk beschermd. Kies een isolatiebedrijf dat hier mee weet om te gaan, dat bedrijf regelt ook de melding bij de provincie." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Stadshagen", href: "/regio/overijssel/zwolle/stadshagen" },
    { naam: "Woning verduurzamen in Berkum", href: "/regio/overijssel/zwolle/berkum" },
  ],
};

const STADSHAGEN: GemeenteVerhaal = {
  seo: {
    title: "Stadshagen: isolatie en verduurzaming | Gijs",
    description: "Woon je in Stadshagen? Lees wat het bouwjaar van je nieuwbouwwoning betekent voor isoleren, en wat Gijs daarin voor je kan doen.",
  },
  kicker: "Wijk in gemeente Zwolle",
  h1: "Je woning verduurzamen in Stadshagen",
  intro: [
    ["Woon je in Stadshagen? Gijs helpt je uitzoeken welke isolatie en installaties bij jouw woning passen en begeleidt je van advies tot uitvoering."],
    ["Stadshagen is de grootste nieuwbouwwijk van Zwolle, gebouwd vanaf de jaren negentig. De meeste woningen zijn al goed geïsoleerd; de winst zit hier vaker in een warmtepomp, zonnepanelen of een thuisbatterij. De actuele subsidies van de gemeente ", { tekst: "Zwolle", href: "/regio/overijssel/zwolle" }, " gelden ook in Stadshagen; zie de regelingen hieronder."],
  ],
  kernen: ["stadshagen", "zwolle", "westenholte", "berkum"],
  woningen: {
    lead: "Stadshagen is bijna volledig naoorlogs. Dat is anders dan de rest van Zwolle, en dat zie je terug in wat verduurzamen betekent.",
    kerncijfers: [
      { waarde: "10.790", label: "woningen" },
      { waarde: "~5%", label: "gebouwd vóór 1995" },
      { waarde: "66%", label: "koopwoning" },
      { waarde: "€429.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1995", percentage: 5, tekst: "Slechts een klein deel bestaat uit oudere woningen. Hier is de verduurzamingsstrategie vergelijkbaar met de rest van Zwolle." },
      { label: "1995 – 2010", percentage: 55, tekst: "De eerste grote bouwfase van Stadshagen. Redelijk geïsoleerd bij oplevering, maar inmiddels ouder dan 15 jaar. Glas en installaties zijn hier vaak de volgende stap." },
      { label: "2010 – 2020", percentage: 30, tekst: "Gebouwd onder strengere energienormen. De schil is goed; de winst zit in slimme installaties en energieopwekking." },
      { label: "Na 2020", percentage: 10, tekst: "Bijna energieneutraal of bijna-energieneutraal (BENG). De focus ligt op zonnepanelen, thuisbatterijen en optimalisatie." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie. Gijs kijkt altijd naar jouw eigen huis, ook in Stadshagen zijn er grote verschillen per type en straat.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, wijk Stadshagen, 2026", url: "https://www.allecijfers.nl/wijk/stadshagen-zwolle/" },
  },
  lokaal: {
    titel: "Stadshagen: de grootste wijk van Zwolle",
    alineas: [
      ["Stadshagen is de grootste en meest recente uitbreidingswijk van Zwolle. De wijk is gebouwd op voormalige poldergrond ten westen van de stad, in meerdere fasen vanaf de jaren negentig. Het heeft zijn eigen winkelcentrum, scholen en groenstructuur, met veel water en parken."],
      ["Stadshagen bestaat uit meerdere buurten: Frankhuis, Breecamp, Milligen, Werkeren, Schoonhorst en Breezicht. De woningtypen lopen uiteen van sociale huurwoningen en tussenwoningen tot vrijstaande villa's aan het water."],
    ],
    bekendVan: {
      titel: "Stadshagen in beeld",
      kaarten: [
        { icon: "building-2", titel: "Grootste nieuwbouwwijk", tekst: "Stadshagen heeft bijna 11.000 woningen en is de grootste en snelst gegroeide wijk van Zwolle." },
        { icon: "droplets", titel: "Water en groen", tekst: "De wijk is ontworpen met veel water, parken en groenstroken, kenmerkend voor de planologie van de jaren negentig." },
        { icon: "shopping-cart", titel: "Winkelcentrum In de Boomgaard", tekst: "Het winkelcentrum is het kloppende hart van de wijk en heeft alles wat nodig is voor dagelijks gebruik." },
      ],
    },
    kernTekst: {
      stadshagen: "Je bent hier. Grootste nieuwbouwwijk van Zwolle, gebouwd vanaf 1995.",
      zwolle: "De provinciestad van Overijssel, met het gemeentehuis en de meeste voorzieningen.",
      westenholte: "Voormalige gemeente, nu wijk direct naast Stadshagen, met ouder naoorlogs karakter.",
      berkum: "Woonwijk ten noorden van het centrum, met bewonerscoöperatie BEN.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Stadshagen?",
      tekst: "Stadshagen groeit nog steeds, met nieuwe buurten die bijna-energieneutraal (BENG) worden gebouwd. Tegelijk vragen de eerste woningen uit de jaren negentig nu om onderhoud en verbetering, glas, installaties en eventueel extra isolatie.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Stadshagen",
    lead: "Ook in nieuwbouwwijken zoals Stadshagen nestelen vleermuizen, huismussen en gierzwaluwen in spouwmuren en daken. Bij isolatiewerkzaamheden moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een gespecialiseerd bedrijf weet hoe het met beschermde soorten omgaat en regelt ook de verplichte melding." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te gaan vóór er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Het isolatiebedrijf zorgt voor vervangende nestkasten of invliegopeningen." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te regelen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Wet natuurbescherming via provincie Overijssel", url: "https://www.overijssel.nl/thema/natuur-milieu-en-water/natuur/bescherming-planten-en-dieren/" },
  },
  faq: [
    { question: "Is verduurzamen in Stadshagen zinvol als mijn huis al goed geïsoleerd is?", answer: "Ja. De schil is bij nieuwbouwwoningen al beter. Maar ook in Stadshagen is er winst te halen met een hybride warmtepomp (gas besparen), zonnepanelen of een thuisbatterij. Gijs kijkt wat bij jouw woning past." },
    { question: "Welke subsidies zijn er in Stadshagen?", answer: "Stadshagen valt onder gemeente Zwolle. De regelingen die nu voor Zwolle gelden, zijn ook op jouw woning van toepassing. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook voor installaties in goed geïsoleerde woningen." },
    { question: "Mijn woning is uit 2005 of 2010. Wat is de logische stap?", answer: "Kijk eerst naar glas en installaties. Een hybride warmtepomp of zonnepanelen zijn in woningen uit die periode vaak de meest rendabele stap. Gijs beoordeelt tijdens de energiescan wat er al is en wat de logische volgorde is." },
    { question: "Moet ik ook bij een nieuwbouwwoning rekening houden met beschermde dieren?", answer: "Ja. Ook in nieuwbouw nestelen vleermuizen en huismussen. Kies een isolatiebedrijf dat hier mee weet om te gaan, dat regelt ook de melding bij de provincie." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Westenholte", href: "/regio/overijssel/zwolle/westenholte" },
    { naam: "Woning verduurzamen in Berkum", href: "/regio/overijssel/zwolle/berkum" },
  ],
};

const WINDESHEIM: GemeenteVerhaal = {
  seo: {
    title: "Windesheim: isolatie en verduurzaming | Gijs",
    description: "Woon je in het historische Windesheim? Lees wat het bouwjaar van je huis zegt over isoleren en verduurzamen.",
  },
  kicker: "Dorp in gemeente Zwolle",
  h1: "Je woning verduurzamen in Windesheim",
  intro: [
    ["Woon je in Windesheim? Gijs helpt je uitzoeken welke isolatie en installaties bij jouw woning passen en welke subsidies er nu in de gemeente ", { tekst: "Zwolle", href: "/regio/overijssel/zwolle" }, " gelden."],
    ["Windesheim is een historisch dorp in het zuiden van Zwolle, met een mix van oude bebouwing en nieuwere woningen. Met gemiddeld 156 woningen is het klein, maar de verduurzamingsopgave is er dezelfde als in de rest van de gemeente."],
  ],
  kernen: ["windesheim", "zwolle", "wijthmen", "herfte", "haerst"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Windesheim verdeeld.",
    kerncijfers: [
      { waarde: "156", label: "woningen" },
      { waarde: "~45%", label: "gebouwd vóór 1975" },
      { waarde: "~80%", label: "koopwoning" },
      { waarde: "€434.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische lintbebouwing langs de dorpskern. Gebouwd zonder isolatienormen, spouw, dak en vloer zijn hier de grootste kansen." },
      { label: "1945 – 1975", percentage: 30, tekst: "Naoorlogse uitbreiding van het dorp. Spouwmuren aanwezig, maar de spouw is vaak nog leeg of dunner geïsoleerd dan gebruikelijk." },
      { label: "1975 – 1995", percentage: 30, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren. Eerst kijken wat er al zit, dan bijisoleren." },
      { label: "Na 1995", percentage: 25, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "De bouwperiodes zijn inschattingen op basis van AlleCijfers.nl. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Windesheim, 2026", url: "https://www.allecijfers.nl/buurt/windesheim-zwolle/" },
  },
  lokaal: {
    titel: "Windesheim: dorp met een middeleeuwse naam",
    alineas: [
      ["Windesheim heeft een bijzondere plek in de Europese kerkgeschiedenis. Hier stichtten Geert Grote en Florens Radewijns in de 14e eeuw het klooster van Windesheim, de bakermat van de Congregatie van Windesheim, een invloedrijke monastieke beweging die zich door heel Europa verspreidde. Van het klooster resteert nu nog een kapel."],
      ["De Hogeschool Windesheim in Zwolle dankt haar naam aan dit historische dorp. In het dorp zelf wonen ruim 150 huishoudens in een mix van historische panden, naoorlogse woningen en enkele nieuwbouwhuizen."],
    ],
    bekendVan: {
      titel: "Waar is Windesheim bekend van?",
      kaarten: [
        { icon: "landmark", titel: "Congregatie van Windesheim", tekst: "De in 1387 gestichte monastieke congregatie verspreidde zich vanuit dit dorp over heel Europa en beïnvloedde de Devotio Moderna." },
        { icon: "book", titel: "Naamgever Hogeschool", tekst: "De Hogeschool Windesheim in Zwolle is vernoemd naar dit historische dorp." },
      ],
    },
    kernTekst: {
      windesheim: "Je bent hier. Historisch dorp in het zuiden van Zwolle, bekend van de middeleeuwse Congregatie van Windesheim.",
      zwolle: "De provinciestad van Overijssel, met het gemeentehuis en de meeste voorzieningen.",
      wijthmen: "Buurtschap met agrarisch karakter en estate-sfeer, ten zuiden van Zwolle.",
      herfte: "Klein buurtschap langs de Vecht, met overwegend vrijstaande woningen.",
      haerst: "Buurtschap in het Vechtdal, aan de grens met Zwartewaterland.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Zwolle?",
      tekst: "De gemeente Zwolle werkt aan een warmteprogramma: welke wijk verwarmt straks hoe, en op welke termijn gaat die van het aardgas af? Isoleren is ook voor Windesheim de eerste stap, ongeacht hoe het dorp later verwarmd gaat worden.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Windesheim",
    lead: "In spouwmuren, muren en daken van woningen in Windesheim wonen vleermuizen, huismussen en gierzwaluwen. Dat zijn beschermde dieren. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een gespecialiseerd bedrijf weet hoe het met beschermde soorten omgaat en regelt ook de verplichte melding." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te gaan vóór er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Het isolatiebedrijf zorgt voor vervangende nestkasten of invliegopeningen, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te regelen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Wet natuurbescherming via provincie Overijssel", url: "https://www.overijssel.nl/thema/natuur-milieu-en-water/natuur/bescherming-planten-en-dieren/" },
  },
  faq: [
    { question: "Helpt Gijs ook in Windesheim?", answer: "Ja. Gijs helpt in de hele gemeente Zwolle, ook in kleine kernen zoals Windesheim. Een gratis energiescan is overal in Zwolle aan te vragen." },
    { question: "Welke subsidies zijn er in Windesheim?", answer: "Windesheim valt onder gemeente Zwolle. De regelingen die nu voor Zwolle gelden, zijn ook op jouw woning van toepassing. Met de subsidiecheck zie je wat er voor jouw adres geldt." },
    { question: "Mijn woning staat in de historische kern van Windesheim. Mag ik isoleren?", answer: "Voor gewone woningen (geen rijksmonument) gelden geen bijzondere beperkingen. Gijs kijkt mee en verwijst bij twijfel naar de juiste instantie." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In heel Zwolle zijn vleermuizen, huismussen en gierzwaluwen wettelijk beschermd. Kies een isolatiebedrijf dat hier mee weet om te gaan, dat bedrijf regelt ook de melding bij de provincie." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Wijthmen", href: "/regio/overijssel/zwolle/wijthmen" },
    { naam: "Woning verduurzamen in Herfte", href: "/regio/overijssel/zwolle/herfte" },
  ],
};

const WIJTHMEN: GemeenteVerhaal = {
  seo: {
    title: "Wijthmen: isolatie en verduurzaming | Gijs",
    description: "Woon je in Wijthmen? Lees wat het bouwjaar van je huis in dit buurtschap zegt over isoleren en verduurzamen.",
  },
  kicker: "Buurtschap in gemeente Zwolle",
  h1: "Je woning verduurzamen in Wijthmen",
  intro: [
    ["Woon je in Wijthmen? Gijs helpt je uitzoeken welke isolatie en installaties bij jouw woning passen en welke subsidies er nu in de gemeente ", { tekst: "Zwolle", href: "/regio/overijssel/zwolle" }, " gelden."],
    ["Wijthmen is een buurtschap ten zuiden van Zwolle, met een agrarisch karakter en overwegend vrijstaande woningen. De gemiddelde WOZ-waarde is er hoog: €548.000. Gijs helpt ook in Wijthmen met de energiescan en verduurzamingsadvies."],
  ],
  kernen: ["wijthmen", "zwolle", "windesheim", "herfte", "haerst"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Wijthmen verdeeld.",
    kerncijfers: [
      { waarde: "252", label: "woningen" },
      { waarde: "~35%", label: "gebouwd vóór 1975" },
      { waarde: "~90%", label: "koopwoning" },
      { waarde: "€548.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische agrarische bebouwing. Bijna altijd gebouwd zonder isolatienormen, spouw, dak en vloer zijn hier de grootste kansen." },
      { label: "1945 – 1975", percentage: 20, tekst: "Naoorlogse woningbouw. Spouwmuren aanwezig maar de spouw is vaak nog leeg of dunner geïsoleerd." },
      { label: "1975 – 1995", percentage: 35, tekst: "De grootste bouwperiode van Wijthmen. Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 30, tekst: "Beter geïsoleerd. De winst zit vaker in installaties: warmtepomp, zonnepanelen of thuisbatterij." },
    ],
    voetnoot: "De bouwperiodes zijn inschattingen op basis van AlleCijfers.nl. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Wijthmen, 2026", url: "https://www.allecijfers.nl/buurt/wijthmen-zwolle/" },
  },
  lokaal: {
    titel: "Wijthmen: agrarisch buurtschap met estates",
    alineas: [
      ["Wijthmen is een buurtschap in het buitengebied van Zwolle, ten zuiden van de stad. Het landschap wordt gedomineerd door landgoederen, agrarische percelen en de Nieuwe Vecht. De bebouwing is overwegend vrijstaand, vandaar de hoge gemiddelde WOZ-waarde."],
      ["Met 252 woningen is Wijthmen klein. Een groot deel van de bewoners is woningeigenaar. Vrijstaande woningen hebben meer buitenmuur, dak en vloer dan tussenwoningen, waardoor goede isolatie extra bijdraagt."],
    ],
    bekendVan: {
      titel: "Wijthmen in beeld",
      kaarten: [
        { icon: "trees", titel: "Landgoederen", tekst: "Het buurtschap grenst aan meerdere landgoederen en landschappelijke zones langs de Nieuwe Vecht." },
        { icon: "home", titel: "Vrijstaande woningen", tekst: "Ruim 90% van de woningen is een koopwoning. Vrijstaand en twee-onder-één-kap zijn dominant." },
      ],
    },
    kernTekst: {
      wijthmen: "Je bent hier. Buurtschap met agrarisch karakter en estate-sfeer, ten zuiden van Zwolle.",
      zwolle: "De provinciestad van Overijssel, met het gemeentehuis en alle voorzieningen.",
      windesheim: "Historisch dorp in het zuiden, bekend van de middeleeuwse Congregatie van Windesheim.",
      herfte: "Klein buurtschap langs de Vecht, met overwegend vrijstaande woningen.",
      haerst: "Buurtschap in het Vechtdal, aan de grens met Zwartewaterland.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Zwolle?",
      tekst: "De gemeente Zwolle werkt aan een warmteprogramma: welke wijk verwarmt straks hoe? Voor het buitengebied zoals Wijthmen betekent dat in de meeste gevallen: individuele oplossingen, een warmtepomp of all-elektrisch. Isoleren is de eerste stap.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Wijthmen",
    lead: "In spouwmuren, muren en daken van woningen in Wijthmen wonen vleermuizen, huismussen en andere beschermde dieren. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een gespecialiseerd bedrijf weet hoe het met beschermde soorten omgaat en regelt ook de verplichte melding." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te gaan vóór er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Het isolatiebedrijf zorgt voor vervangende nestkasten of invliegopeningen, zoveel mogelijk onzichtbaar." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te regelen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Wet natuurbescherming via provincie Overijssel", url: "https://www.overijssel.nl/thema/natuur-milieu-en-water/natuur/bescherming-planten-en-dieren/" },
  },
  faq: [
    { question: "Helpt Gijs ook in Wijthmen?", answer: "Ja. Gijs helpt in de hele gemeente Zwolle, ook in het buitengebied. Een gratis energiescan is overal in Zwolle aan te vragen." },
    { question: "Welke subsidies zijn er in Wijthmen?", answer: "Wijthmen valt onder gemeente Zwolle. De regelingen die nu voor Zwolle gelden, zijn ook op jouw woning van toepassing. Met de subsidiecheck zie je wat er voor jouw adres geldt." },
    { question: "Mijn huis staat vrijstaand. Heeft dat invloed op de aanpak?", answer: "Ja. Een vrijstaande woning heeft meer buitenmuur, dak en vloer dan een tussenwoning. Goede isolatie van de schil telt daardoor zwaarder mee. Gijs bekijkt de combinatie van schil en installaties in de juiste volgorde." },
    { question: "Moet ik bij isolatie rekening houden met beschermde dieren?", answer: "Ja. In heel Zwolle, ook in het buitengebied, zijn vleermuizen, huismussen en gierzwaluwen wettelijk beschermd. Kies een isolatiebedrijf dat hier mee weet om te gaan." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Windesheim", href: "/regio/overijssel/zwolle/windesheim" },
    { naam: "Woning verduurzamen in Herfte", href: "/regio/overijssel/zwolle/herfte" },
  ],
};

const HERFTE: GemeenteVerhaal = {
  seo: {
    title: "Herfte: isolatie en verduurzaming | Gijs",
    description: "Woon je in Herfte? Lees wat het bouwjaar van je huis in dit buurtschap langs de Vecht zegt over isoleren.",
  },
  kicker: "Buurtschap in gemeente Zwolle",
  h1: "Je woning verduurzamen in Herfte",
  intro: [
    ["Woon je in Herfte? Gijs helpt je uitzoeken welke isolatie en installaties bij jouw woning passen en welke subsidies er nu in de gemeente ", { tekst: "Zwolle", href: "/regio/overijssel/zwolle" }, " gelden."],
    ["Herfte is een klein buurtschap langs de Vecht, ten westen van Zwolle. Met een gemiddelde WOZ-waarde van €704.000 en overwegend vrijstaande woningen is het een van de exclusiefste woonplekken in de gemeente. Gijs helpt ook hier met inzicht en advies."],
  ],
  kernen: ["herfte", "zwolle", "wijthmen", "haerst", "windesheim"],
  woningen: {
    lead: "Herfte heeft een bijzonder woningprofiel: klein, vrijstaand en relatief oud. Zo is de woningvoorraad verdeeld.",
    kerncijfers: [
      { waarde: "146", label: "woningen" },
      { waarde: "~50%", label: "gebouwd vóór 1975" },
      { waarde: "~90%", label: "koopwoning" },
      { waarde: "€704.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 20, tekst: "Historische bebouwing langs de Vecht. Bijna altijd gebouwd zonder isolatienormen, spouw, dak en vloer zijn hier de grootste winst." },
      { label: "1945 – 1975", percentage: 30, tekst: "Naoorlogse vrijstaande woningen. Spouwmuren aanwezig maar de spouw is vaak nog leeg of dunner geïsoleerd." },
      { label: "1975 – 1995", percentage: 25, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 25, tekst: "Beter geïsoleerd. De winst zit vaker in installaties: warmtepomp, zonnepanelen of thuisbatterij." },
    ],
    voetnoot: "De bouwperiodes zijn inschattingen op basis van AlleCijfers.nl. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Herfte, 2026", url: "https://www.allecijfers.nl/buurt/herfte-zwolle/" },
  },
  lokaal: {
    titel: "Herfte: exclusief buurtschap langs de Vecht",
    alineas: [
      ["Herfte ligt langs de Vecht, direct ten westen van Zwolle. Het buurtschap bestaat voornamelijk uit vrijstaande woningen op ruime kavels, omgeven door groen en water. De hoge gemiddelde WOZ-waarde van €704.000 weerspiegelt dit exclusieve karakter."],
      ["Met 146 woningen is Herfte klein. Een groot deel is voor 1975 gebouwd, waardoor er bij de oudere woningen nog veel te winnen is met isolatie. Bij de nieuwere woningen ligt de focus meer op installaties."],
    ],
    bekendVan: {
      titel: "Herfte in beeld",
      kaarten: [
        { icon: "waves", titel: "Vechtdal", tekst: "Herfte ligt direct aan de Vecht, omgeven door het Overijsselse Vechtdallandschap." },
        { icon: "home", titel: "Exclusief wonen", tekst: "Met een gem. WOZ-waarde van €704.000 behoort Herfte tot de duurste woonlocaties van de gemeente Zwolle." },
      ],
    },
    kernTekst: {
      herfte: "Je bent hier. Klein buurtschap langs de Vecht, met overwegend vrijstaande woningen.",
      zwolle: "De provinciestad van Overijssel, met het gemeentehuis en alle voorzieningen.",
      wijthmen: "Buurtschap met agrarisch karakter, ten zuiden van Zwolle.",
      haerst: "Buurtschap in het Vechtdal, aan de grens met Zwartewaterland.",
      windesheim: "Historisch dorp in het zuiden van Zwolle.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Zwolle?",
      tekst: "Voor het buitengebied zoals Herfte werkt de gemeente Zwolle aan individuele warmteoplossingen: een warmtepomp of all-elektrisch zijn de meest voor de hand liggende routes. Isoleren is de eerste stap.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Herfte",
    lead: "In spouwmuren, muren en daken van woningen in Herfte wonen vleermuizen en andere beschermde dieren. In de Vechtdalomgeving geldt extra aandacht voor de bescherming van de natuur. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een gespecialiseerd bedrijf weet hoe het met beschermde soorten omgaat en regelt ook de verplichte melding." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te gaan vóór er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Het isolatiebedrijf zorgt voor vervangende nestkasten of invliegopeningen." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te regelen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Wet natuurbescherming via provincie Overijssel", url: "https://www.overijssel.nl/thema/natuur-milieu-en-water/natuur/bescherming-planten-en-dieren/" },
  },
  faq: [
    { question: "Helpt Gijs ook in Herfte?", answer: "Ja. Gijs helpt in de hele gemeente Zwolle, ook in kleine kernen zoals Herfte. Een gratis energiescan is overal aan te vragen." },
    { question: "Welke subsidies zijn er in Herfte?", answer: "Herfte valt onder gemeente Zwolle. De regelingen die nu voor Zwolle gelden, zijn ook op jouw woning van toepassing. Met de subsidiecheck zie je wat er voor jouw adres geldt." },
    { question: "Mijn vrijstaande woning is van vóór 1975. Waar begin ik?", answer: "Bijna de helft van de woningen in Herfte is van vóór 1975. Bij vrijstaande woningen is er meer buitenoppervlak, dus telt goede isolatie extra. Gijs kijkt tijdens de energiescan wat er al is en welke stap de meeste winst geeft." },
    { question: "Moet ik bij isolatie rekening houden met de Vechtdal-natuur?", answer: "Ja. Naast de bescherming van vleermuizen, huismussen en gierzwaluwen (Wet natuurbescherming) is het Vechtdal een Natura 2000-gebied. Bij ingrijpende werkzaamheden dichtbij de oever is het verstandig om te overleggen met de provincie Overijssel." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Wijthmen", href: "/regio/overijssel/zwolle/wijthmen" },
    { naam: "Woning verduurzamen in Haerst", href: "/regio/overijssel/zwolle/haerst" },
  ],
};

const HAERST: GemeenteVerhaal = {
  seo: {
    title: "Haerst: isolatie en verduurzaming | Gijs",
    description: "Woon je in Haerst? Lees wat het bouwjaar van je huis in dit buurtschap in het Vechtdal zegt over isoleren.",
  },
  kicker: "Buurtschap in gemeente Zwolle",
  h1: "Je woning verduurzamen in Haerst",
  intro: [
    ["Woon je in Haerst? Gijs helpt je uitzoeken welke isolatie en installaties bij jouw woning passen en welke subsidies er nu in de gemeente ", { tekst: "Zwolle", href: "/regio/overijssel/zwolle" }, " gelden."],
    ["Haerst is een buurtschap in het Vechtdal, aan de grens van gemeente Zwolle en Zwartewaterland. Met gemiddeld €661.000 WOZ-waarde en overwegend vrijstaande woningen heeft het een landelijk, exclusief karakter."],
  ],
  kernen: ["haerst", "zwolle", "herfte", "wijthmen", "windesheim"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Haerst verdeeld.",
    kerncijfers: [
      { waarde: "108", label: "woningen" },
      { waarde: "~60%", label: "gebouwd vóór 1975" },
      { waarde: "~90%", label: "koopwoning" },
      { waarde: "€661.000", label: "gem. WOZ-waarde" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 30, tekst: "Historische agrarische bebouwing langs de Vecht. Bijna altijd gebouwd zonder isolatienormen, spouw, dak en vloer zijn hier de grootste kansen." },
      { label: "1945 – 1975", percentage: 30, tekst: "Naoorlogse bebouwing. Spouwmuren aanwezig, maar de spouw is vaak nog leeg of dunner geïsoleerd dan gebruikelijk." },
      { label: "1975 – 1995", percentage: 25, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 15, tekst: "Beter geïsoleerd. De winst zit vaker in installaties: warmtepomp, zonnepanelen of thuisbatterij." },
    ],
    voetnoot: "De bouwperiodes zijn inschattingen op basis van AlleCijfers.nl. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Haerst, 2026", url: "https://www.allecijfers.nl/buurt/haerst-zwolle/" },
  },
  lokaal: {
    titel: "Haerst: Vechtdal aan de gemeentegrens",
    alineas: [
      ["Haerst is een buurtschap dat deels in gemeente Zwolle en deels in gemeente Zwartewaterland ligt, direct langs de Vecht. Het heeft een landelijk, agrarisch karakter met vrijstaande woningen op ruime kavels. De gemiddelde WOZ-waarde van €661.000 weerspiegelt het exclusieve woonmilieu."],
      ["Bijna twee derde van de woningen is van vóór 1975. Bij veel van die woningen is de spouw nog leeg of dunner geïsoleerd dan gebruikelijk. Gijs kijkt tijdens de energiescan wat er al is gedaan en welke stap de meeste winst geeft."],
    ],
    bekendVan: {
      titel: "Haerst in beeld",
      kaarten: [
        { icon: "waves", titel: "Vechtdal", tekst: "Haerst ligt direct aan de Vecht en grenst aan het Overijsselse Vechtdallandschap." },
        { icon: "map-pin", titel: "Twee gemeenten", tekst: "Het buurtschap strekt zich uit over de grens van gemeente Zwolle en gemeente Zwartewaterland." },
      ],
    },
    kernTekst: {
      haerst: "Je bent hier. Buurtschap in het Vechtdal, aan de grens met Zwartewaterland.",
      zwolle: "De provinciestad van Overijssel, met het gemeentehuis en alle voorzieningen.",
      herfte: "Klein buurtschap langs de Vecht, met overwegend vrijstaande woningen.",
      wijthmen: "Buurtschap met agrarisch karakter en estate-sfeer, ten zuiden van Zwolle.",
      windesheim: "Historisch dorp in het zuiden van Zwolle.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Zwolle?",
      tekst: "Voor het buitengebied zoals Haerst werkt de gemeente Zwolle aan individuele warmteoplossingen. Een warmtepomp of all-elektrisch zijn de meest voor de hand liggende routes voor vrijstaande woningen. Isoleren is de eerste stap.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in Haerst",
    lead: "In spouwmuren, muren en daken van woningen in Haerst wonen vleermuizen en andere beschermde dieren. In de Vechtdalomgeving geldt extra aandacht voor natuurbescherming. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een gespecialiseerd bedrijf weet hoe het met beschermde soorten omgaat en regelt ook de verplichte melding." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te gaan vóór er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Het isolatiebedrijf zorgt voor vervangende nestkasten of invliegopeningen." },
      { icon: "file-check", titel: "Melding bij de provincie", tekst: "Het isolatiebedrijf doet de verplichte melding bij de provincie Overijssel. Dat hoef je niet zelf te regelen." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf laten onderzoeken of er beschermde dieren in je woning leven en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Wet natuurbescherming via provincie Overijssel", url: "https://www.overijssel.nl/thema/natuur-milieu-en-water/natuur/bescherming-planten-en-dieren/" },
  },
  faq: [
    { question: "Helpt Gijs ook in Haerst?", answer: "Ja. Gijs helpt in de hele gemeente Zwolle, ook in kleine kernen zoals Haerst. Een gratis energiescan is overal aan te vragen." },
    { question: "Welke subsidies zijn er in Haerst?", answer: "Haerst valt (voor het deel in Zwolle) onder gemeente Zwolle. De regelingen die nu voor Zwolle gelden, zijn van toepassing. Met de subsidiecheck zie je wat er voor jouw adres geldt." },
    { question: "Mijn vrijstaande woning is van vóór 1975. Waar begin ik?", answer: "Bijna twee derde van de woningen in Haerst is van vóór 1975. Bij vrijstaande woningen telt goede isolatie extra zwaar. Gijs kijkt tijdens de energiescan wat er al is en welke stap de meeste winst geeft." },
    { question: "Moet ik bij isolatie rekening houden met de Vechtdal-natuur?", answer: "Ja. Vleermuizen, huismussen en gierzwaluwen zijn wettelijk beschermd (Wet natuurbescherming). Het Vechtdal is ook een Natura 2000-gebied. Kies een isolatiebedrijf dat hier mee weet om te gaan." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Herfte", href: "/regio/overijssel/zwolle/herfte" },
    { naam: "Woning verduurzamen in Wijthmen", href: "/regio/overijssel/zwolle/wijthmen" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 23 oktober 2026.
const WIERDEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Wierden | Advies & ontzorging – Gijs",
    description: "Zoek je een isolatiebedrijf in Wierden of Enter? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Gemeente Wierden",
  h1: "Je woning isoleren en verduurzamen in Wierden",
  intro: [
    ["Woon je in Wierden, ", { tekst: "Enter", href: "/regio/overijssel/wierden/enter" }, ", Hoge Hexel of een van de andere dorpen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Ruim 40% van de woningen in de gemeente Wierden is gebouwd in de naoorlogse periode 1945-1975. Met een groot aandeel vrijstaande woningen en twee-onder-één-kappers is er in veel gevallen nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["wierden", "enter", "hoge-hexel", "notter", "rectum", "zuna", "ijpelo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Wierden verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "10.369", label: "woningen" },
      { waarde: "32%", label: "vrijstaand" },
      { waarde: "41%", label: "gebouwd 1945–1975" },
      { waarde: "73%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 11, tekst: "Historische bebouwing en oudere Twentse woningen. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier de grootste winst." },
      { label: "1945 – 1975", percentage: 41, tekst: "Naoorlogse groei en uitbreidingen in de dorpskernen. Spouwmuren zijn er, maar de spouw is vaak nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 24, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren. Eerst kijken wat er al zit, dan gericht bijisoleren." },
      { label: "Na 1995", percentage: 24, tekst: "Beter geïsoleerd dan de oudere perioden. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/wierden/" },
  },
  lokaal: {
    titel: "Wierden en Enter: dorpen met karakter",
    alineas: [
      ["De gemeente Wierden bestaat uit de kern Wierden en de dorpen Enter, Hoge Hexel, Notter, Rectum, Zuna en IJpelo. De gemeente heeft een landelijk karakter met veel vrijstaande en twee-onder-één-kapwoningen. Enter is de grootste kern en heeft een eigen winkelcentrum en voorzieningen."],
      ["Met een WOZ-waarde van gemiddeld €410.000 en 73% koopwoningen is de woningmarkt stabiel. Juist bij vrijstaande woningen in de naoorlogse periode is er vaak nog winst te halen: meer buitenoppervlak betekent dat isolatie van dak, spouw en vloer verhoudingsgewijs meer oplevert."],
      ["Op zoek naar een isolatiebedrijf in Wierden? Gijs helpt bij het isoleren van je woning, maar voert de isolatiewerkzaamheden niet zelf uit. Eerst krijg je onafhankelijk advies over passende maatregelen. Daarna begeleidt Gijs het traject van A tot Z, inclusief de uitvoering door vakexperts."],
    ],
    kernTekst: {
      wierden: "De gemeentekern, met het gemeentehuis en de meeste voorzieningen.",
      enter: "Het grootste dorp van de gemeente, met een eigen winkelcentrum.",
      "hoge-hexel": "Dorp in het westen van de gemeente Wierden.",
      notter: "Klein dorp ten zuiden van de kern Wierden.",
      rectum: "Dorp in het zuiden van de gemeente, in het Twentse landschap.",
      zuna: "Klein dorp aan de rand van de gemeente Wierden.",
      ijpelo: "Buurtschap in de gemeente Wierden.",
    },
    wijken: {
      titel: "Wijken in Wierden",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Wierden (kern)", woningen: 5946, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 6 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 24 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Landelijk gebied Wierden", woningen: 583, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 34 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 14 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Hooge-Hexel", woningen: 362, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 17 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Enter (kern)", woningen: 2354, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 6 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 21 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Landelijk gebied Enter", woningen: 681, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 84,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 24 }, { label: "2025 en later", percentage: 7 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Rectum - Notter - Zuna", woningen: 443, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 30 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/wierden/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Wierden?",
      tekst: "In Enter, de grootste kern van de gemeente, staan veel naoorlogse woningen met spouwmuren die nog niet of onvolledig zijn gevuld. In de buitendorpen als Notter, Rectum en Zuna tref je vaker vrijstaande woningen van vóór 1945, waarbij dak en vloer de grootste winst geven. Gijs kijkt per woning wat de logische volgorde is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Wierden",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Wierden moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Wierden?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Enter en de andere dorpen." },
    { question: "Welke subsidies zijn er voor mijn woning in Wierden?", answer: "Op deze pagina zie je de regelingen die nu voor Wierden gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Veel woningen zijn later al verbeterd. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Mijn woning staat in Enter of een ander dorp van Wierden. Maakt dat wat uit?", answer: "Nee. Gijs werkt in de hele gemeente Wierden, van Enter en Hoge Hexel tot Notter, Rectum, Zuna en IJpelo. De meeste woningen in Enter zijn uit de naoorlogse periode en vergelijkbaar gebouwd als die in de kern Wierden. Gijs kijkt altijd naar jouw eigen huis." },
    { question: "Helpt Gijs ook in Enter, Hoge Hexel en de andere dorpen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Wierden, dus ook in Enter, Hoge Hexel, Notter, Rectum, Zuna en IJpelo." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 23 oktober 2026.
const TUBBERGEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Tubbergen | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Tubbergen, Albergen of een ander dorp? Gijs geeft onafhankelijk advies en begeleidt je van A tot Z. Gratis energiescan.",
  },
  kicker: "Gemeente Tubbergen",
  h1: "Je woning isoleren en verduurzamen in Tubbergen",
  intro: [
    ["Woon je in ", { tekst: "Tubbergen", href: "/regio/overijssel/tubbergen/tubbergen" }, ", Albergen, Geesteren of een van de andere dorpen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["In de gemeente Tubbergen is 40% van de woningvoorraad vrijstaand, het hoogste aandeel van de regio. Vrijstaande woningen hebben meer buitenoppervlak en daarmee meer verduurzamingspotentie. Gijs kijkt wat er al is gedaan en adviseert over de stap die het meest zinvol is."],
  ],
  kernen: ["tubbergen", "albergen", "geesteren", "vasse", "reutum", "langeveen", "fleringen", "hezingen", "manderveen", "mariaparochie", "harbrinkhoek"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Tubbergen verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "8.940", label: "woningen" },
      { waarde: "40%", label: "vrijstaand" },
      { waarde: "33%", label: "gebouwd 1945–1975" },
      { waarde: "73%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 9, tekst: "Historische bebouwing, vaak Twentse boerderijen en lintbebouwing. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier de grootste winst." },
      { label: "1945 – 1975", percentage: 33, tekst: "Naoorlogse uitbreidingen in de dorpen. Spouwmuren zijn er, maar de spouw is vaak nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 28, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren. Eerst kijken wat er al zit, dan gericht bijisoleren." },
      { label: "Na 1995", percentage: 30, tekst: "Beter geïsoleerd dan de oudere perioden. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/tubbergen/" },
  },
  lokaal: {
    titel: "Tubbergen: een plattelandsgemeente met kleine dorpen",
    alineas: [
      ["De gemeente Tubbergen is een van de meest landelijke gemeenten van Overijssel. De gemeente bestaat uit de kern Tubbergen en een reeks kleinere dorpen: Albergen, Fleringen, Geesteren, Haarle, Harbrinkhoek, Hezingen, Langeveen, Mander, Manderveen, Mariaparochie, Reutum en Vasse. Het merendeel van de woningvoorraad is vrijstaand, aangevuld met twee-onder-één-kappers en boerderijen."],
      ["Met een gemiddelde WOZ-waarde van €432.000 en 73% koopwoningen is de woningmarkt robuust. De hoge WOZ-waarde en het grote aandeel vrijstaande woningen gaan hand in hand: isolatie van dak, spouw en vloer loont hier verhoudingsgewijs meer."],
      ["Op zoek naar een isolatiebedrijf in Tubbergen? Gijs helpt bij het isoleren van je woning, maar voert de isolatiewerkzaamheden niet zelf uit. Eerst krijg je onafhankelijk advies over passende maatregelen. Daarna begeleidt Gijs het traject van A tot Z, inclusief de uitvoering door vakexperts."],
    ],
    kernTekst: {
      tubbergen: "De hoofdkern van de gemeente, met het gemeentehuis en de meeste voorzieningen.",
      albergen: "Dorp in het noorden van de gemeente, met een eigen karakter.",
      geesteren: "Dorp in het zuiden van de gemeente Tubbergen.",
      vasse: "Klein dorp in de gemeente Tubbergen, dichtbij het Nationaal Landschap Twente.",
      reutum: "Dorp in het oosten van de gemeente.",
      langeveen: "Dorp in de gemeente Tubbergen.",
      fleringen: "Klein dorp in het westen van de gemeente.",
      hezingen: "Dorp in de gemeente Tubbergen.",
      manderveen: "Dorp in de gemeente Tubbergen, vlakbij het Bergvenner Veen.",
      mariaparochie: "Dorp op de grens met Almelo.",
      harbrinkhoek: "Dorp op de grens met de gemeente Almelo.",
    },
    wijken: {
      titel: "Wijken in Tubbergen",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Tubbergen", woningen: 2653, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 63,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 5 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 15 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Albergen", woningen: 1433, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 78,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Harbrinkhoek", woningen: 617, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 24 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 15 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Geesteren", woningen: 1771, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 73,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 9 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 16 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Langeveen", woningen: 509, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 17 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 20 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Vasse", woningen: 425, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 6 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Reutum", woningen: 530, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 73,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 23 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Fleringen", woningen: 355, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 9 }, { label: "1945 tot 1965", percentage: 5 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 23 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wijk Mariaparochie", woningen: 108, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 6 }, { label: "1945 tot 1965", percentage: 4 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 2 }, { label: "1985 tot 1995", percentage: 67 }, { label: "1995 tot 2005", percentage: 1 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 15 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wijk Manderveen", woningen: 255, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 15 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wijk Mander", woningen: 143, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 77,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wijk Hezingen", woningen: 85, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 71,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 25 }, { label: "1945 tot 1965", percentage: 6 }, { label: "1965 tot 1975", percentage: 15 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 19 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wijk Haarle", woningen: 56, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 77,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 21 }, { label: "1995 tot 2005", percentage: 16 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/tubbergen/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Tubbergen?",
      tekst: "Met elf kleine kernen en het hoogste aandeel vrijstaande woningen van de regio verschilt de woningvoorraad per dorp sterk. In Albergen staan andere huizen dan in Vasse of Langeveen. Gijs kijkt per woning wat de logische volgorde is, los van welk dorp je woont.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Tubbergen",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in Tubbergen moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Tubbergen?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Albergen, Geesteren en de andere dorpen." },
    { question: "Welke subsidies zijn er voor mijn woning in Tubbergen?", answer: "Op deze pagina zie je de regelingen die nu voor Tubbergen gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn vrijstaande woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft. Bij vrijstaande woningen loont goede isolatie verhoudingsgewijs meer." },
    { question: "Heeft een vrijstaande woning een andere aanpak dan een rijtjeswoning?", answer: "Ja. Een vrijstaande woning heeft meer buitengevel en meer dakoppervlak dan een rijtjeswoning met dezelfde inhoud. Goede isolatie loont daardoor verhoudingsgewijs meer. Met het hoge aandeel vrijstaande woningen in Tubbergen is dat voor veel bewoners relevant. Gijs brengt dat in kaart tijdens de energiescan." },
    { question: "Helpt Gijs ook in de kleinere dorpen van Tubbergen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Tubbergen, dus ook in Albergen, Fleringen, Geesteren, Langeveen, Manderveen en de andere dorpen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Almelo", href: "/regio/overijssel/almelo" },
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
    { naam: "Woning verduurzamen in Wierden", href: "/regio/overijssel/wierden" },
  ],
  woningInzichtenBlok: {
    h2: "Een vrijstaande woning verduurzamen begint met overzicht",
    feitVariant: 'cirkel',
    percentage: "29%",
    percentageTekst: "van de woningen in Tubbergen is vrijstaand",
    bodytekst: "Bij een vrijstaande woning zijn verschillende bouwdelen direct aan de buitenlucht blootgesteld. Daardoor is het verstandig om dak, gevel en vloer als geheel te bekijken. Je wilt voorkomen dat je eerst veel geld uitgeeft aan een installatie, terwijl het warmteverlies nog onnodig hoog is. Door de isolatie en het verwarmingssysteem samen te beoordelen, ontstaat een duidelijker beeld van de mogelijkheden. Zo kun je investeringen prioriteren en stap voor stap werken aan een comfortabelere woning.",
    kaarten: [
      { icon: "layers", titel: "Waar kan ik het beste beginnen met isoleren?", tekst: "Bekijk welke bouwdelen warmte verliezen en waarom de huidige isolatie bepaalt welke maatregel voorrang verdient.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Bekijk isolatiemaatregelen" },
      { icon: "calculator", titel: "Hoe verdeel ik de investeringen verstandig?", tekst: "Een duidelijk plan helpt om isolatie, installaties en beschikbare financiële mogelijkheden tegen elkaar af te wegen.", href: "/kennis#subsidies", linkTekst: "Bekijk financieringsmogelijkheden" },
    ],
    adviseur: { naam: "thom", h3: "Thom kijkt graag met je mee", tekst: "Woon je vrijstaand in Tubbergen en zie je veel verduurzamingsmogelijkheden? Thom bekijkt de woning als geheel en helpt prioriteiten stellen. Gijs ondersteunt bij het kiezen van passende maatregelen en begeleidt de uitvoering." },
  },
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 23 oktober 2026.
const DINKELLAND: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Dinkelland | Advies & ontzorging – Gijs",
    description: "Je woning isoleren in Dinkelland, Ootmarsum of Denekamp? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Gemeente Dinkelland",
  h1: "Je woning isoleren en verduurzamen in Dinkelland",
  intro: [
    ["Woon je in ", { tekst: "Ootmarsum", href: "/regio/overijssel/dinkelland/ootmarsum" }, ", ", { tekst: "Denekamp", href: "/regio/overijssel/dinkelland/denekamp" }, ", ", { tekst: "Weerselo", href: "/regio/overijssel/dinkelland/weerselo" }, " of een van de andere dorpen van de gemeente Dinkelland? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["In de gemeente Dinkelland is 44% van de woningvoorraad gebouwd in de naoorlogse periode 1945-1975. Met een groot aandeel vrijstaande woningen (42%) is er in veel gevallen nog winst te halen. Gijs kijkt samen met jou wat er al is gedaan en adviseert over de stap die het meest zinvol is."],
  ],
  kernen: ["ootmarsum", "denekamp", "weerselo", "saasveld", "rossum", "deurningen", "volthe", "breklenkamp", "lattrop", "berghum", "nutter", "gammelke", "tilligte", "lemselo", "noordijk", "oud-ootmarsum", "het-stift", "dulder", "t-loo", "beerkdorp"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Dinkelland verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "11.366", label: "woningen" },
      { waarde: "42%", label: "vrijstaand" },
      { waarde: "44%", label: "gebouwd 1945–1975" },
      { waarde: "75%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 9, tekst: "Historische bebouwing in de oude dorpskernen, waaronder Ootmarsum. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier de grootste winst." },
      { label: "1945 – 1975", percentage: 44, tekst: "Het grootste deel van de woningvoorraad. Spouwmuren zijn er, maar de spouw is in veel gevallen nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 28, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren. Eerst kijken wat er al zit, dan gericht bijisoleren." },
      { label: "Na 1995", percentage: 19, tekst: "Beter geïsoleerd dan de oudere perioden. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/dinkelland/" },
  },
  lokaal: {
    titel: "Dinkelland: een gemeente met twintig dorpen",
    alineas: [
      ["De gemeente Dinkelland bestaat uit twintig kernen, waarvan Ootmarsum en Denekamp de grootste zijn. De gemeente grenst aan Duitsland en heeft een uitgesproken landelijk karakter met veel vrijstaande woningen en boerderijen. De hoge WOZ-waarde (gemiddeld €424.000) en het grote aandeel koopwoningen (75%) weerspiegelen de sterke woningmarkt in dit deel van Overijssel."],
      ["Het grote aandeel naoorlogse woningen (44% gebouwd tussen 1945 en 1975) biedt veel verduurzamingspotentie. Bij vrijstaande woningen is er meer buitenoppervlak, wat betekent dat goede isolatie verhoudingsgewijs meer oplevert."],
      ["Op zoek naar een isolatiebedrijf in Dinkelland? Gijs helpt bij het isoleren van je woning, maar voert de isolatiewerkzaamheden niet zelf uit. Eerst krijg je onafhankelijk advies over passende maatregelen. Daarna begeleidt Gijs het traject van A tot Z, inclusief de uitvoering door vakexperts."],
    ],
    bekendVan: {
      titel: "Waar is Dinkelland bekend van?",
      kaarten: [
        { icon: "landmark", titel: "Ootmarsum", tekst: "Ootmarsum is een van de best bewaarde middeleeuwse stadjes van Overijssel, met een historisch centrum, het museum Openluchtmuseum Ootmarsum en de jaarlijkse vlöggelen (Paastraditie op de UNESCO-lijst van immaterieel erfgoed)." },
      ],
    },
    kernTekst: {
      ootmarsum: "Historisch stadje in het noorden van de gemeente, met een beschermd stadsgezicht.",
      denekamp: "Grootste kern van de gemeente en administratief centrum.",
      weerselo: "Dorp in het midden van de gemeente Dinkelland.",
      saasveld: "Dorp in het westen van de gemeente.",
      rossum: "Dorp aan de grens met Duitsland, in het zuiden van de gemeente.",
      deurningen: "Dorp in het zuiden van de gemeente.",
      volthe: "Klein dorp in de gemeente Dinkelland.",
      breklenkamp: "Dorp in het noorden van de gemeente, dichtbij de grens.",
      lattrop: "Dorp in het noorden van de gemeente.",
      berghum: "Klein dorp in de gemeente Dinkelland.",
      nutter: "Buurtschap in de gemeente Dinkelland.",
      gammelke: "Klein dorp in de gemeente Dinkelland.",
      tilligte: "Klein dorp in het noorden van de gemeente.",
      lemselo: "Dorp in de gemeente Dinkelland.",
      noordijk: "Buurtschap in de gemeente Dinkelland.",
      "oud-ootmarsum": "Buurtschap bij Ootmarsum.",
      "het-stift": "Klein buurtschap in de gemeente Dinkelland.",
      dulder: "Buurtschap in de gemeente Dinkelland.",
      "t-loo": "Buurtschap in de gemeente Dinkelland.",
      beerkdorp: "Buurtschap in de gemeente Dinkelland.",
    },
    wijken: {
      titel: "Wijken in Dinkelland",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Denekamp", woningen: 3954, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 70,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 7 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Lattrop-Breklenkamp", woningen: 369, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 78,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Tilligte", woningen: 294, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 14 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Agelo", woningen: 199, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 79,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 13 }, { label: "1945 tot 1965", percentage: 18 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Noord Deurningen", woningen: 538, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 71,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 13 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 21 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Ootmarsum", woningen: 2087, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 77,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 22 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Weerselo", woningen: 1346, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 6 }, { label: "1945 tot 1965", percentage: 6 }, { label: "1965 tot 1975", percentage: 19 }, { label: "1975 tot 1985", percentage: 21 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Rossum", woningen: 922, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 19 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Saasveld", woningen: 656, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 79,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 20 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Deurningen", woningen: 809, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 79,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 9 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 22 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Nutter", woningen: 65, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 68,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 18 }, { label: "1945 tot 1965", percentage: 4 }, { label: "1965 tot 1975", percentage: 15 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 16 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 7 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Oud Ootmarsum", woningen: 127, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 75,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 13 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/dinkelland/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Dinkelland?",
      tekst: "Dinkelland is een gemeente met twintig kernen, van het historische Ootmarsum tot kleine buurtschappen als Dulder en Gammelke. De verduurzamingsvraagstukken lopen uiteen: bij monumentale panden in Ootmarsum gelden andere regels dan bij naoorlogse woningen in Denekamp of Weerselo. Gijs helpt je uitzoeken wat voor jouw situatie past.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Dinkelland",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. In de omgeving van Dinkelland zijn ook Natura 2000-gebieden. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Dinkelland?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning in Dinkelland. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Ootmarsum, Denekamp en de andere dorpen." },
    { question: "Welke subsidies zijn er voor mijn woning in Dinkelland?", answer: "Op deze pagina zie je de regelingen die nu voor Dinkelland gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft. Bij vrijstaande woningen loont goede isolatie verhoudingsgewijs meer." },
    { question: "Mijn woning is een monument in Ootmarsum. Mag ik wel isoleren?", answer: "Bij een gemeentelijk of rijksmonument gelden extra regels. Spouwmuurisolatie en dakisolatie zijn in principe mogelijk, maar de gemeente of Rijksdienst voor het Cultureel Erfgoed moet soms vooraf toestemming geven. Gijs helpt ook bij monumentale woningen: we beginnen met uitzoeken wat wel en niet mag, vóórdat er iets wordt gepland." },
    { question: "Helpt Gijs ook in Ootmarsum, Denekamp en de andere dorpen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Dinkelland, dus ook in Ootmarsum, Denekamp, Weerselo, Saasveld en alle andere kernen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Oldenzaal", href: "/regio/overijssel/oldenzaal" },
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Losser", href: "/regio/overijssel/losser" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 23 oktober 2026.
const HAAKSBERGEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Haaksbergen | Advies & ontzorging – Gijs",
    description: "Zoek je een isolatiebedrijf in Haaksbergen, Buurse of Sint Isidorushoeve? Gijs geeft onafhankelijk advies en begeleidt je van A tot Z. Gratis energiescan.",
  },
  kicker: "Gemeente Haaksbergen",
  h1: "Je woning isoleren en verduurzamen in Haaksbergen",
  intro: [
    ["Woon je in Haaksbergen, ", { tekst: "Buurse", href: "/regio/overijssel/haaksbergen/buurse" }, " of ", { tekst: "Sint Isidorushoeve", href: "/regio/overijssel/haaksbergen/sint-isidorushoeve" }, " en wil je je woning isoleren? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["In de gemeente Haaksbergen is 44% van de woningen gebouwd in de naoorlogse periode 1945-1975. Dat zijn woningen met spouwmuren, maar de spouw zit er zelden goed in. Gijs kijkt samen met jou wat er al is gedaan en adviseert over de stap die het meest zinvol is."],
  ],
  kernen: ["haaksbergen", "buurse", "sint-isidorushoeve"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Haaksbergen verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "10.753", label: "woningen" },
      { waarde: "24%", label: "vrijstaand" },
      { waarde: "44%", label: "gebouwd 1945–1975" },
      { waarde: "70%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 10, tekst: "Historische bebouwing in de kern Haaksbergen. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier de grootste winst." },
      { label: "1945 – 1975", percentage: 44, tekst: "Het grootste deel van de woningvoorraad. Spouwmuren zijn er, maar de spouw is in veel gevallen nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 28, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren. Eerst kijken wat er al zit, dan gericht bijisoleren." },
      { label: "Na 1995", percentage: 18, tekst: "Beter geïsoleerd dan de oudere perioden. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/haaksbergen/" },
  },
  lokaal: {
    titel: "Haaksbergen, Buurse en Sint Isidorushoeve",
    alineas: [
      ["De gemeente Haaksbergen ligt tussen Enschede en Hof van Twente. De gemeente bestaat uit de kern Haaksbergen en de dorpen Buurse en Sint Isidorushoeve. Met 70% koopwoningen en een gemiddelde WOZ-waarde van €380.000 is de woningmarkt toegankelijk."],
      ["Het grote aandeel naoorlogse woningen (44% gebouwd tussen 1945 en 1975) biedt veel verduurzamingspotentie. Een deel van die woningen heeft een spouwmuur die nog leeg is of dunner geïsoleerd dan nu de standaard is. Gijs kijkt wat er al is gedaan en adviseert over de beste volgende stap."],
      ["Op zoek naar een isolatiebedrijf in Haaksbergen? Gijs helpt bij het isoleren van je woning, maar voert de isolatiewerkzaamheden niet zelf uit. Eerst krijg je onafhankelijk advies over passende maatregelen. Daarna begeleidt Gijs het traject van A tot Z, inclusief de uitvoering door vakexperts."],
    ],
    bekendVan: {
      titel: "Waar is Haaksbergen bekend van?",
      kaarten: [
        { icon: "train", titel: "Museum Buurt Spoorweg", tekst: "Haaksbergen herbergt het Museum Buurt Spoorweg: een historische stoomtramlijn die rijdt tussen Haaksbergen en Boekelo. Een van de weinige plaatsen in Nederland waar je nog met stoom kunt rijden." },
      ],
    },
    kernTekst: {
      haaksbergen: "De hoofdkern van de gemeente, met de meeste voorzieningen en het gemeentehuis.",
      buurse: "Dorp op de grens met Duitsland, in het groen van het Buurserzand.",
      "sint-isidorushoeve": "Buurtschap in de gemeente Haaksbergen.",
    },
    wijken: {
      titel: "Wijken in Haaksbergen",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Haaksbergen (dorp)", woningen: 7900, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 5 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 26 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 16 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Haaksbergen (buitengebied)", woningen: 940, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 24 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 17 }, { label: "2005 tot 2015", percentage: 24 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Sint Isidorushoeve", woningen: 498, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 17 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 16 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Buurse", woningen: 515, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 19 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Rietmolen", woningen: 82, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 79,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 31 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Hengevelde", woningen: 53, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 21 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Beckum", woningen: 64, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 30 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 21 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Haaksbergen-kern", woningen: 701, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 36,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 17 }, { label: "1945 tot 1965", percentage: 24 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 16 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/haaksbergen/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Haaksbergen?",
      tekst: "Haaksbergen heeft een compacte woningvoorraad van ruim 10.000 woningen, waarvan 44% gebouwd in de naoorlogse periode 1945-1975. Die woningen hebben vrijwel altijd een spouwmuur die leeg is of onvolledig gevuld. Dat is vaak de eerste maatregel die bewoners aanpakken, en ook de meest kosteneffectieve. Gijs kijkt altijd wat er al gedaan is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Haaksbergen",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in Haaksbergen moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Haaksbergen?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning in Haaksbergen. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Buurse en Sint Isidorushoeve." },
    { question: "Welke subsidies zijn er voor mijn woning in Haaksbergen?", answer: "Op deze pagina zie je de regelingen die nu voor Haaksbergen gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Loont spouwmuurisolatie ook als de spouw al gedeeltelijk gevuld is?", answer: "Dat hangt af van wat er al in de spouw zit en hoe dik. Een dunne laag uit de jaren tachtig voldoet meestal niet meer aan de huidige norm. Gijs kijkt of bijvulling of vervangende isolatie zinvol is, een bewering die je van buiten niet kunt doen zonder de spouw te inspecteren." },
    { question: "Helpt Gijs ook in Buurse en Sint Isidorushoeve?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Haaksbergen, dus ook in Buurse en Sint Isidorushoeve." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
  ],
  woningInzichtenBlok: {
    h2: "Een warme woning begint bij het aanpakken van warmteverlies",
    feitVariant: 'cirkel',
    percentage: "45%",
    percentageTekst: "van de woningen in Haaksbergen is gebouwd vóór 1975",
    bodytekst: "Blijft de woonkamer koud, ook wanneer de verwarming aanstaat? Of merk je tocht en koude vloeren? De oorzaak ligt niet altijd bij de verwarmingsinstallatie. Soms verliest de woning warmte via de vloer, gevel of het dak. Door eerst te bepalen waar het probleem ontstaat, kun je gerichter kiezen voor een passende isolatiemaatregel. Zo voorkom je dat je een nieuw systeem aanschaft terwijl de grootste verbetering mogelijk bij de bestaande isolatie ligt.",
    kaarten: [
      { icon: "thermometer", titel: "Waarom voelt mijn vloer koud aan?", tekst: "Bekijk wanneer vloerisolatie kan helpen en welke rol de kruipruimte, ventilatie en bestaande vloerconstructie spelen.", href: "/maatregelen/vloerisolatie", linkTekst: "Bekijk vloerisolatie" },
      { icon: "flame", titel: "Moet ik eerst isoleren voor een warmtepomp?", tekst: "De geschiktheid hangt af van de warmtebehoefte en de huidige installatie. Ontdek welke controles belangrijk zijn voordat je overstapt.", href: "/maatregelen/warmtepomp", linkTekst: "Bekijk warmtepomp" },
    ],
    adviseur: { naam: "thom", h3: "Thom kijkt graag met je mee", tekst: "Heb je in Haaksbergen last van koude ruimtes of tocht? Thom bekijkt waar warmte mogelijk verloren gaat en welke maatregelen het probleem kunnen aanpakken. Zo krijg je inzicht in de juiste oplossing, waarna Gijs helpt bij de uitvoering." },
  },
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 23 oktober 2026.
const LOSSER: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Losser | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Losser, De Lutte of Overdinkel? Gijs geeft onafhankelijk advies en begeleidt je van A tot Z. Gratis energiescan.",
  },
  kicker: "Gemeente Losser",
  h1: "Je woning isoleren en verduurzamen in Losser",
  intro: [
    ["Woon je in Losser, ", { tekst: "De Lutte", href: "/regio/overijssel/losser/de-lutte" }, ", ", { tekst: "Overdinkel", href: "/regio/overijssel/losser/overdinkel" }, ", ", { tekst: "Beuningen", href: "/regio/overijssel/losser/beuningen" }, " of ", { tekst: "Glane", href: "/regio/overijssel/losser/glane" }, " en wil je je woning isoleren? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["In de gemeente Losser is 41% van de woningvoorraad gebouwd in de naoorlogse periode 1945-1975, en nog eens 15% van vóór 1945. Dat zijn woningen waarbij er in veel gevallen nog winst te halen valt met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["losser", "de-lutte", "overdinkel", "beuningen", "glane"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Losser verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "10.210", label: "woningen" },
      { waarde: "27%", label: "vrijstaand" },
      { waarde: "41%", label: "gebouwd 1945–1975" },
      { waarde: "71%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische bebouwing in de kern Losser en langs de Dinkel. Bijna altijd gebouwd zonder isolatienormen. Spouw, dak en vloer zijn hier de grootste winst." },
      { label: "1945 – 1975", percentage: 41, tekst: "Het grootste deel van de woningvoorraad. Spouwmuren zijn er, maar de spouw is in veel gevallen nog leeg of dunner geïsoleerd dan nu gebruikelijk." },
      { label: "1975 – 1995", percentage: 23, tekst: "Deels geïsoleerd, maar bijna altijd te verbeteren. Eerst kijken wat er al zit, dan gericht bijisoleren." },
      { label: "Na 1995", percentage: 21, tekst: "Beter geïsoleerd dan de oudere perioden. De winst zit vaker in beter glas, een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/losser/" },
  },
  lokaal: {
    titel: "Losser en De Lutte: stad en recreatiedorp",
    alineas: [
      ["De gemeente Losser bestaat uit de kern Losser en de dorpen De Lutte, Overdinkel, Beuningen en Glane. De gemeente grenst aan Duitsland en ligt aan de Dinkel, een van de ongerepte rivieren van Twente. De Lutte is een bekende recreatiegemeenschap met hotels en bungalowparken."],
      ["Met 15% woningen van vóór 1945 heeft de gemeente een relatief oud woningbestand. Dat biedt veel kansen: bij oudere woningen is er in bijna alle gevallen nog winst te halen met isolatie van spouw, dak of vloer."],
      ["Op zoek naar een isolatiebedrijf in Losser? Gijs helpt bij het isoleren van je woning, maar voert de isolatiewerkzaamheden niet zelf uit. Eerst krijg je onafhankelijk advies over passende maatregelen. Daarna begeleidt Gijs het traject van A tot Z, inclusief de uitvoering door vakexperts."],
    ],
    bekendVan: {
      titel: "Waar is Losser bekend van?",
      kaarten: [
        { icon: "trees", titel: "De Lutte en de Dinkel", tekst: "De Lutte is het recreatiehart van de gemeente: bekend om de Dinkellandroutes, buitencentra en de natuur van het Dinkeltal vlakbij de grens met Duitsland." },
      ],
    },
    kernTekst: {
      losser: "De gemeentekern, met het gemeentehuis en de meeste voorzieningen.",
      "de-lutte": "Recreatiedorp in het zuiden van de gemeente, aan de grens met Duitsland.",
      overdinkel: "Dorp in het noorden van de gemeente, grenzend aan Gronau (Duitsland).",
      beuningen: "Klein dorp in het zuiden van de gemeente Losser.",
      glane: "Buurtschap op de grens van Losser en Duitsland.",
    },
    wijken: {
      titel: "Wijken in Losser",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Losser", woningen: 6118, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 23 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Glane", woningen: 210, periode: "Grotendeels vóór 1945", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 47 }, { label: "1945 tot 1965", percentage: 6 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Overdinkel", woningen: 1842, periode: "Grotendeels 1945 – 1975", tijdvak: 1, koopwoningPercentage: 65,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 20 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "De Lutte", woningen: 1645, periode: "Grotendeels na 1995", tijdvak: 3, koopwoningPercentage: 79,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 22 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 5 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Beuningen", woningen: 395, periode: "Grotendeels 1975 – 1995", tijdvak: 2, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 16 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/losser/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Losser?",
      tekst: "Met 15% woningen van vóór 1945 heeft Losser verhoudingsgewijs een oud woningbestand. Dat biedt kansen: deze woningen zijn gebouwd zonder isolatienormen en er is bijna altijd winst te halen. In De Lutte, met zijn recreatiewoningen en grotere percelen, speelt de combinatie met zonnepanelen vaker een rol. Gijs kijkt wat er per woning het meest oplevert.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Losser",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. De omgeving van Losser heeft ook Natura 2000-gebieden langs de Dinkel. Bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Losser?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning in Losser. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in De Lutte, Overdinkel en de andere dorpen." },
    { question: "Welke subsidies zijn er voor mijn woning in Losser?", answer: "Op deze pagina zie je de regelingen die nu voor Losser gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1945. Waar begin ik?", answer: "Bij oude woningen begint het bijna altijd bij de spouw, het dak of de vloer. Maar veel oudere woningen zijn later al deels verbeterd. Gijs kijkt tijdens de energiescan wat er al is gedaan en wat de logische volgende stap is." },
    { question: "Mijn woning heeft geen spouwmuur. Wat zijn de opties voor gevelisolatie?", answer: "Bij een woning zonder spouw zijn er twee alternatieven: binnenisolatie (minder oppervlak, geen vergunning) of buitengevelisolatie (vergunningsplichtig, meer impact). Welke aanpak het beste past, hangt af van de woningconstructie, het budget en de uitstraling. Gijs helpt je kiezen op basis van jouw specifieke huis." },
    { question: "Helpt Gijs ook in De Lutte, Overdinkel en de andere dorpen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Losser, dus ook in De Lutte, Overdinkel, Beuningen en Glane." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Oldenzaal", href: "/regio/overijssel/oldenzaal" },
    { naam: "Woning verduurzamen in Dinkelland", href: "/regio/overijssel/dinkelland" },
  ],
  woningInzichtenBlok: {
    h2: "Meer wooncomfort begint bij isolatie die bij jouw huis past",
    feitVariant: 'heading',
    percentageTekst: "Meer dan 4 op de 10 woningen in Losser zijn gebouwd vóór 1975.",
    bodytekst: "Een goed geïsoleerde woning merk je niet alleen aan het energieverbruik. Ook het dagelijks comfort kan verbeteren: minder koude oppervlakken, minder tocht en vertrekken die minder snel afkoelen. Welke isolatie daarbij het meeste verschil maakt, hangt af van jouw woning. Misschien is het dak al nageïsoleerd, maar blijft de beganegrondvloer koud. Of is het glas inmiddels vervangen en verdient de gevel aandacht. Door eerst te bekijken waar warmte verloren gaat, kun je gericht investeren in een comfortabeler huis.",
    kaarten: [
      { icon: "thermometer", titel: "Welke isolatie merk ik direct in huis?", tekst: "Een koude vloer of tocht kan verschillende oorzaken hebben. Bekijk hoe isolatie van vloer, dak en gevel het wooncomfort kan verbeteren.", href: "/maatregelen/vloerisolatie", linkTekst: "Bekijk vloerisolatie" },
      { icon: "trending-down", titel: "Wat betekent isolatie voor mijn energiekosten?", tekst: "De mogelijke besparing hangt af van de huidige situatie, het energieverbruik en de gekozen maatregel. Onderzoek wat realistisch is voor jouw woning.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Bekijk isolatiemaatregelen" },
    ],
    adviseur: { naam: "naud", h3: "Naud kijkt graag met je mee", tekst: "Wil je comfortabeler wonen in Losser, maar weet je niet welke isolatiemaatregel bij jouw huis past? Naud kijkt naar de bestaande situatie en helpt de mogelijkheden te vergelijken. Gijs begeleidt je bij de uitvoering, zodat je een duidelijk traject hebt." },
  },
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const DALFSEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Dalfsen | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Dalfsen, Nieuwleusen of Lemelerveld? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Dalfsen",
  h1: "Je woning isoleren en verduurzamen in Dalfsen",
  intro: [
    ["Woon je in Dalfsen, ", { tekst: "Nieuwleusen", href: "/regio/overijssel/dalfsen/nieuwleusen" }, ", ", { tekst: "Lemelerveld", href: "/regio/overijssel/dalfsen/lemelerveld" }, " of een van de andere dorpen in de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Ruim 40% van de woningen in Dalfsen is van vóór 1975. Met een groot aandeel vrijstaande woningen (35%) is er in veel gevallen nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["dalfsen", "nieuwleusen", "lemelerveld", "hoonhorst"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Dalfsen verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "12.599", label: "woningen" },
      { waarde: "35%", label: "vrijstaand" },
      { waarde: "41%", label: "gebouwd vóór 1975" },
      { waarde: "74%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 41, tekst: "Vrijstaande woningen en lintbebouwing langs de Vecht. Spouwmuren zijn er vaak, maar de spouw is regelmatig nog leeg of slecht gevuld. Dak en vloer zijn hier de gebruikelijke eerste stap." },
      { label: "1975 – 1995", percentage: 25, tekst: "Deels geïsoleerd bij oplevering, maar de isolatiewaarde is vaak lager dan tegenwoordig gebruikelijk. Bijisoleren geeft hier de meeste winst." },
      { label: "1995 – 2015", percentage: 21, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 13, tekst: "Al goed geïsoleerd bij oplevering. Zonnepanelen en een thuisbatterij zijn hier vaker de volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/dalfsen/" },
  },
  lokaal: {
    titel: "Dalfsen: landelijk wonen langs de Vecht",
    alineas: [
      ["De gemeente Dalfsen bestaat uit de kern Dalfsen en de dorpen Nieuwleusen, Lemelerveld, Hoonhorst en een reeks kleine kernen in het Vechtdal. De gemeente heeft een uitgesproken landelijk karakter met veel vrijstaande woningen en twee-onder-één-kappers."],
      ["Nieuwleusen is de grootste kern, met een eigen winkelcentrum. Lemelerveld en Hoonhorst zijn kleinere dorpen met een hecht gemeenschapskarakter. In het buitengebied staan ook voormalige boerderijen die verbouwd zijn tot woonboerderijen, een woningtype met eigen isolatie-uitdagingen."],
    ],
    bekendVan: {
      titel: "Waar is Dalfsen bekend om?",
      kaarten: [
        { icon: "landmark", titel: "Landgoed Rechteren", tekst: "Het 18e-eeuwse kasteel Rechteren aan de Vecht is een rijksmonument en een van de markantste buitenplaatsen van Overijssel." },
        { icon: "waves", titel: "Vechtdal", tekst: "De Vecht slingert door het landschap en is bepalend voor de gemeente. Het gebied trekt wandelaars, fietsers en kanoërs." },
      ],
    },
    kernTekst: {
      dalfsen: "De gemeentekern met het gemeentehuis en de meeste voorzieningen.",
      nieuwleusen: "De grootste kern van de gemeente, met een winkelcentrum.",
      lemelerveld: "Dorp ten zuiden van Dalfsen, met basisvoorzieningen.",
      hoonhorst: "Klein dorp in het westen van de gemeente.",
    },
    wijken: {
      titel: "Wijken in Dalfsen",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Dalfsen", woningen: 6407, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 13 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 20 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Nieuwleusen", woningen: 4126, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 73,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 12 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Lemelerveld", woningen: 2066, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 12 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 14 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/dalfsen/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Dalfsen?",
      tekst: "In Nieuwleusen en Lemelerveld staan veel woningen uit de jaren vijftig tot zeventig. Spouwmuurisolatie en dakisolatie zijn hier de meestgevraagde maatregelen. In het buitengebied tref je vaker vrijstaande woningen met een hoger verduurzamingspotentieel.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Dalfsen",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Dalfsen moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Dalfsen?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Nieuwleusen, Lemelerveld en de andere dorpen." },
    { question: "Welke subsidies zijn er voor mijn woning in Dalfsen?", answer: "Op deze pagina zie je de regelingen die nu voor Dalfsen gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Veel woningen in Dalfsen zijn later al verbeterd. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Helpt Gijs ook in Nieuwleusen en Lemelerveld?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Dalfsen, dus ook in Nieuwleusen, Lemelerveld, Hoonhorst en het buitengebied." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Ommen", href: "/regio/overijssel/ommen" },
    { naam: "Woning verduurzamen in Zwartewaterland", href: "/regio/overijssel/zwartewaterland" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const DEVENTER: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Deventer | Advies & ontzorging – Gijs",
    description: "Wil je je woning isoleren in Deventer of Bathmen? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z. Gratis energiescan aan huis.",
  },
  kicker: "Gemeente Deventer",
  h1: "Je woning isoleren en verduurzamen in Deventer",
  intro: [
    ["Woon je in Deventer, ", { tekst: "Bathmen", href: "/regio/overijssel/deventer/bathmen" }, ", ", { tekst: "Diepenveen", href: "/regio/overijssel/deventer/diepenveen" }, " of een van de andere kernen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Circa de helft van de woningen in Deventer is van vóór 1975. In het historisch centrum staan veel oude panden, met eigen aandachtspunten bij ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " en ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", maar ook in de naoorlogse wijken is er volop verduurzamingspotentieel."],
  ],
  kernen: ["deventer", "bathmen", "diepenveen", "colmschate", "schalkhaar"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Deventer verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "48.140", label: "woningen" },
      { waarde: "36%", label: "tussenwoning" },
      { waarde: "~50%", label: "gebouwd vóór 1975" },
      { waarde: "56%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 50, tekst: "Een groot deel van Deventer bestaat uit vooroorlogse panden en naoorlogse stadswijken. In het historisch centrum gelden soms beperkingen voor de uitstraling. Gijs kijkt wat er mogelijk is." },
      { label: "1975 – 1995", percentage: 18, tekst: "Deels geïsoleerd bij oplevering. Bijisoleren van spouw en dak geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 23, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp of zonnepanelen." },
      { label: "Na 2015", percentage: 9, tekst: "Al goed geïsoleerd. Zonnepanelen en een thuisbatterij zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/deventer/" },
  },
  lokaal: {
    titel: "Deventer: Hanzestad met een rijke woninggeschiedenis",
    alineas: [
      ["Deventer is een van de oudste steden van Nederland en een voormalige Hanzestad aan de IJssel. Het historisch centrum heeft meer dan vijfhonderd beschermde monumenten, waaronder Museum de Waag uit 1528. De gemeente omvat naast het stadscentrum ook kernen als Bathmen, Diepenveen, Colmschate en Schalkhaar."],
      ["In de naoorlogse wijken rondom het centrum staan veel tussenwoningen met spouwmuren. In de kleinere kernen als Bathmen en Diepenveen tref je vaker vrijstaande woningen en twee-onder-één-kappers. Gijs helpt in de hele gemeente, van centrum tot buitengebied."],
    ],
    bekendVan: {
      titel: "Waar is Deventer bekend om?",
      kaarten: [
        { icon: "landmark", titel: "Museum de Waag", tekst: "Het oudste waaggebouw van Nederland (1528) staat in het hart van de historische binnenstad." },
        { icon: "ship", titel: "Hanzestad", tekst: "Deventer was lid van de Hanzebond en heeft een rijke handelsgeschiedenis langs de IJssel." },
        { icon: "trophy", titel: "Go Ahead Eagles", tekst: "De profvoetbalclub van Deventer speelt in de Eredivisie en is al meer dan honderd jaar verbonden aan de stad." },
      ],
    },
    kernTekst: {
      deventer: "De historische binnenstad en grootste kern van de gemeente.",
      bathmen: "Dorp ten zuiden van Deventer, met een landelijk karakter.",
      diepenveen: "Dorp ten noorden van Deventer, met een eigen historische kern.",
      colmschate: "Wijk en kern ten oosten van het stadscentrum.",
      schalkhaar: "Kern ten noorden van Deventer, tussen de IJssel en het buitengebied.",
    },
    wijken: {
      titel: "Wijken in Deventer",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Binnenstad", woningen: 5535, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 33,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 49 }, { label: "1945 tot 1965", percentage: 3 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 20 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "De Hoven", woningen: 978, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 67 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 3 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 2 }, { label: "1995 tot 2005", percentage: 1 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Zandweerd", woningen: 6228, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 53,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 32 }, { label: "1945 tot 1965", percentage: 37 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 2 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Voorstad", woningen: 4964, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 47,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 62 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Borgele en Platvoet", woningen: 2605, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 41,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 2 }, { label: "1945 tot 1965", percentage: 1 }, { label: "1965 tot 1975", percentage: 71 }, { label: "1975 tot 1985", percentage: 19 }, { label: "1985 tot 1995", percentage: 1 }, { label: "1995 tot 2005", percentage: 1 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 0 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Keizerslanden", woningen: 6379, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 39,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 31 }, { label: "1965 tot 1975", percentage: 22 }, { label: "1975 tot 1985", percentage: 1 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 2 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 17 }, { label: "2025 en later", percentage: 7 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Rivierenwijk en Bergweide", woningen: 2404, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 36,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 42 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 1 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 28 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Colmschate-Noord", woningen: 2497, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 0 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 34 }, { label: "1975 tot 1985", percentage: 55 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 1 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Colmschate-Vijfhoek", woningen: 4675, periode: "Grotendeels 1995 – 2015", tijdvak: 2, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 0 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 68 }, { label: "2005 tot 2015", percentage: 26 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Colmschate-Zuid", woningen: 4150, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 65,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 3 }, { label: "1945 tot 1965", percentage: 4 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 63 }, { label: "1995 tot 2005", percentage: 18 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 1 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Diepenveen", woningen: 2149, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 21 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Schalkhaar", woningen: 2244, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 27 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Okkenbroek", woningen: 139, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 16 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Lettele", woningen: 667, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 33 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bathmen", woningen: 2526, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 77,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 25 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/deventer/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Deventer?",
      tekst: "In de naoorlogse wijken van Deventer, Colmschate, Schalkhaar en de uitbreidingen aan de oostkant, staan veel tussenwoningen met spouwmuren die nog niet of onvolledig zijn gevuld. In het historisch centrum gelden soms beperkingen voor de uitstraling van gevels; Gijs weet welke maatregelen dan nog mogelijk zijn.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Deventer",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Deventer moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Deventer?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Bathmen, Diepenveen en de andere kernen." },
    { question: "Mijn huis in Deventer heeft een lekkend of tochtig dak. Is dakisolatie een optie?", answer: "In veel gevallen wel. Bij een hellend dak kan isolatiemateriaal tussen de sporen of aan de binnenzijde worden aangebracht; bij een plat dak ligt het meestal bovenop. Gijs kijkt tijdens de energiescan welke methode past bij jouw dakconstructie, ook bij oudere panden in de binnenstad." },
    { question: "Welke subsidies zijn er voor mijn woning in Deventer?", answer: "Op deze pagina zie je de regelingen die nu voor Deventer gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning staat in de binnenstad van Deventer. Kan ik toch isoleren?", answer: "Ja, maar bij monumenten en panden in beschermd stadsgezicht gelden soms beperkingen voor gevelisolatie of dakisolatie die de uitstraling verandert. Gijs kijkt welke maatregelen wel mogelijk zijn, binnenisolatie, vloerisolatie of glas zijn vaak een optie." },
    { question: "Helpt Gijs ook in Bathmen en Diepenveen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Deventer, dus ook in Bathmen, Diepenveen, Colmschate en Schalkhaar." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Olst-Wijhe", href: "/regio/overijssel/olst-wijhe" },
    { naam: "Woning verduurzamen in Raalte", href: "/regio/overijssel/raalte" },
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const HARDENBERG: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Hardenberg | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Hardenberg of Dedemsvaart? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Hardenberg",
  h1: "Je woning isoleren en verduurzamen in Hardenberg",
  intro: [
    ["Woon je in Hardenberg, ", { tekst: "Dedemsvaart", href: "/regio/overijssel/hardenberg/dedemsvaart" }, ", ", { tekst: "Gramsbergen", href: "/regio/overijssel/hardenberg/gramsbergen" }, " of een van de andere dorpen in de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Ruim 40% van de woningen in Hardenberg is van vóór 1975. Met een groot aandeel vrijstaande woningen is er in veel gevallen nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["hardenberg", "dedemsvaart", "gramsbergen", "slagharen", "marienberg", "balkbrug", "bergentheim", "heemse"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Hardenberg verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "26.307", label: "woningen" },
      { waarde: "33%", label: "vrijstaand" },
      { waarde: "41%", label: "gebouwd vóór 1975" },
      { waarde: "70%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 41, tekst: "Lintbebouwing langs het Vechtdal en historische bebouwing in Dedemsvaart en Gramsbergen. Spouwmuren zijn er vaak, maar de spouw is regelmatig nog leeg." },
      { label: "1975 – 1995", percentage: 25, tekst: "Deels geïsoleerd bij oplevering. Bijisoleren van spouw en dak geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 20, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 14, tekst: "Al goed geïsoleerd bij oplevering. Zonnepanelen zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/hardenberg/" },
  },
  lokaal: {
    titel: "Hardenberg: wonen in het Vechtdal",
    alineas: [
      ["De gemeente Hardenberg omvat een groot gebied in het noordoosten van Overijssel, met als grootste kernen Hardenberg zelf en Dedemsvaart. Het Vechtdal is bepalend voor het landschap: de rivier de Vecht stroomt door de gemeente en trekt wandelaars en fietsers."],
      ["Dedemsvaart is ontstaan langs een historisch kanaalenstelsel uit de 19e eeuw. De gemeente heeft een sterk landelijk karakter, met veel vrijstaande woningen en twee-onder-één-kappers in en rond de dorpen."],
    ],
    bekendVan: {
      titel: "Waar is Hardenberg bekend om?",
      kaarten: [
        { icon: "waves", titel: "Vechtdal", tekst: "De rivier de Vecht slingert door de gemeente en maakt van Hardenberg een populair recreatiegebied voor fietsers, wandelaars en kanoërs." },
        { icon: "ship", titel: "Kanaalenstelsel Dedemsvaart", tekst: "Dedemsvaart ontstond langs het 19e-eeuwse kanaalenstelsel voor turfvervoer, zichtbaar in de rechte linten van de kern." },
      ],
    },
    kernTekst: {
      hardenberg: "De gemeentekern met het gemeentehuis en de meeste voorzieningen.",
      dedemsvaart: "Tweede kern van de gemeente, ontstaan langs het historisch kanaalenstelsel.",
      gramsbergen: "Dorp aan de Vecht in het westen van de gemeente.",
      slagharen: "Dorp in het noorden van de gemeente, bekend om attractiepark Slagharen.",
      marienberg: "Dorp in het midden van de gemeente.",
      balkbrug: "Dorp in het westen, gelegen langs het Overijssels Kanaal.",
      bergentheim: "Dorp in het midden-oosten van de gemeente.",
      heemse: "Dorp grenzend aan Hardenberg.",
    },
    wijken: {
      titel: "Wijken in Hardenberg",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Hardenberg", woningen: 9210, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 62,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 3 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 15 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 16 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Ane", woningen: 198, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 90,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 34 }, { label: "1945 tot 1965", percentage: 25 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Anerveen", woningen: 62, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 85,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 39 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Anevelde", woningen: 14, periode: "Grotendeels vóór 1975", tijdvak: 0,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 21 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 14 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Balkbrug", woningen: 1591, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 29 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bergentheim", woningen: 1346, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 18 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 6 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Brucht", woningen: 122, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 84,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 43 }, { label: "1945 tot 1965", percentage: 21 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Bruchterveld", woningen: 415, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 89,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 17 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 8 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Collendoorn", woningen: 140, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 33 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 14 }, { label: "2025 en later", percentage: 5 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Krim", woningen: 913, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 73,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 25 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 15 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Dedemsvaart", woningen: 5581, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 17 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 15 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Den Velde", woningen: 69, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 30 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Diffelen", woningen: 57, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 36 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Gramsbergen", woningen: 1496, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 8 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 20 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 19 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Heemserveen", woningen: 112, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 22 }, { label: "1945 tot 1965", percentage: 33 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 2 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Holtheme", woningen: 70, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 39 }, { label: "1945 tot 1965", percentage: 18 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Holthone", woningen: 42, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 48 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 2 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 24 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Hoogenweg", woningen: 185, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 30 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 24 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Kloosterhaar", woningen: 605, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 71,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 9 }, { label: "1945 tot 1965", percentage: 26 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Loozen", woningen: 73, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 84,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 29 }, { label: "1945 tot 1965", percentage: 18 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Lutten", woningen: 821, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 24 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Marienberg", woningen: 334, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Radewijk", woningen: 232, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 88,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 28 }, { label: "1945 tot 1965", percentage: 31 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Rheeze", woningen: 94, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 37 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Rheezerveen", woningen: 209, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 24 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 15 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Schuinesloot", woningen: 364, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 92,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 23 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Sibculo", woningen: 527, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 78,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 9 }, { label: "1945 tot 1965", percentage: 24 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Slagharen", woningen: 1388, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 15 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Venebrugge", woningen: 37, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 36 }, { label: "1945 tot 1965", percentage: 31 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/hardenberg/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Hardenberg?",
      tekst: "In Dedemsvaart staan veel woningen langs de kanaallinten, vaak tussenwoningen en twee-onder-één-kappers uit de jaren vijftig tot zeventig. In Hardenberg zelf en in de omliggende dorpen tref je vaker vrijstaande woningen. Gijs kijkt per woning wat de logische volgorde is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Hardenberg",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Hardenberg moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Hardenberg?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Dedemsvaart, Gramsbergen en de andere dorpen." },
    { question: "Welke subsidies zijn er voor mijn woning in Hardenberg?", answer: "Op deze pagina zie je de regelingen die nu voor Hardenberg gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Veel woningen zijn later al verbeterd. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Helpt Gijs ook in Dedemsvaart, Gramsbergen en de andere dorpen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hardenberg, van Dedemsvaart en Gramsbergen tot Slagharen, Mariënberg en Balkbrug." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Ommen", href: "/regio/overijssel/ommen" },
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
    { naam: "Woning verduurzamen in Staphorst", href: "/regio/overijssel/staphorst" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const KAMPEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Kampen | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Kampen of IJsselmuiden? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Kampen",
  h1: "Je woning isoleren en verduurzamen in Kampen",
  intro: [
    ["Woon je in Kampen, ", { tekst: "IJsselmuiden", href: "/regio/overijssel/kampen/ijsselmuiden" }, " of een van de andere kernen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Bijna 44% van de woningen in Kampen is van vóór 1975. In de historische binnenstad gelden soms beperkingen voor gevelaanpassingen, maar ook in de naoorlogse wijken en de dorpen is er volop verduurzamingspotentieel."],
  ],
  kernen: ["kampen", "ijsselmuiden", "grafhorst", "zalk", "wilsum", "kamperveen"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Kampen verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "23.734", label: "woningen" },
      { waarde: "37%", label: "tussenwoning" },
      { waarde: "44%", label: "gebouwd vóór 1975" },
      { waarde: "64%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 44, tekst: "Een aanzienlijk deel bestaat uit historische panden in de binnenstad en naoorlogse uitbreidingen in IJsselmuiden en Kampen-Noord. Spouwmuren zijn er vaak, maar de spouw is soms nog leeg." },
      { label: "1975 – 1995", percentage: 23, tekst: "Deels geïsoleerd bij oplevering. Bijisoleren van spouw en dak geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 21, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 12, tekst: "Al goed geïsoleerd. Zonnepanelen zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/kampen/" },
  },
  lokaal: {
    titel: "Kampen: Hanzestad aan de IJssel",
    alineas: [
      ["Kampen is een voormalige Hanzestad (eerste vermelding 1227) aan de IJssel, met een beschermd stadsgezicht en honderden rijksmonumenten in de historische binnenstad. Naast de stad omvat de gemeente de kernen IJsselmuiden, Grafhorst, Zalk, Wilsum en Kamperveen in het poldergebied."],
      ["In IJsselmuiden staan veel naoorlogse woningen, een van de snelst gegroeid kernen van de regio. In de kleine polderkernen als Grafhorst en Wilsum zijn het vrijstaande woningen en boerderijen die het beeld bepalen."],
    ],
    bekendVan: {
      titel: "Waar is Kampen bekend om?",
      kaarten: [
        { icon: "landmark", titel: "Hanzestad", tekst: "Kampen was een van de machtigste Hanzesteden van de Nederlanden. De middeleeuwse stadswal en de Bovenkerk zijn de bekendste monumenten." },
        { icon: "waves", titel: "IJssel", tekst: "De rivier de IJssel is bepalend voor de gemeente. Het polderland rondom de IJssel is een beschermd cultuurlandschap." },
      ],
    },
    kernTekst: {
      kampen: "De historische binnenstad met honderden rijksmonumenten.",
      ijsselmuiden: "Naoorlogse groeikern aan de westoever van de IJssel.",
      grafhorst: "Klein polderkerntje ten westen van Kampen.",
      zalk: "Dorp langs de IJssel, bekend om het beschermde dorpsgezicht.",
      wilsum: "Klein dorp in het poldergebied ten noorden van Kampen.",
      kamperveen: "Dorp in het polderlandschap ten westen van Kampen.",
    },
    wijken: {
      titel: "Wijken in Kampen",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Kampen", woningen: 17217, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 58,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 28 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Reeve", woningen: 78, periode: "Grotendeels na 2015", tijdvak: 3, koopwoningPercentage: 99,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 0 }, { label: "1945 tot 1965", percentage: 0 }, { label: "1965 tot 1975", percentage: 0 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 0 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 40 }, { label: "2025 en later", percentage: 60 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "IJsselmuiden", woningen: 4866, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 15 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Zalk", woningen: 286, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 6 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 15 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 8 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wilsum", woningen: 367, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 25 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 14 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Grafhorst", woningen: 341, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 18 }, { label: "1965 tot 1975", percentage: 3 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 12 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Kamperveen", woningen: 299, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 91,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "'s-Heerenbroek", woningen: 234, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 30 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Mastenbroek", woningen: 46, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 55 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/kampen/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Kampen?",
      tekst: "In IJsselmuiden staan veel tussenwoningen uit de jaren zestig tot tachtig met spouwmuren. In de historische binnenstad van Kampen gelden bij sommige panden beperkingen voor gevelaanpassingen; binnenisolatie of vloerisolatie zijn dan vaker een optie. Gijs kijkt wat er per woning mogelijk is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Kampen",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Kampen moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Kampen?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in IJsselmuiden en de andere kernen." },
    { question: "Welke subsidies zijn er voor mijn woning in Kampen?", answer: "Op deze pagina zie je de regelingen die nu voor Kampen gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning staat in de binnenstad van Kampen. Kan ik toch isoleren?", answer: "Ja, maar bij monumenten en panden in beschermd stadsgezicht gelden soms beperkingen voor uitstraling. Gijs kijkt welke maatregelen wél mogelijk zijn, vloerisolatie, binnenisolatie en glas zijn vaak een optie." },
    { question: "Helpt Gijs ook in IJsselmuiden, Grafhorst en de andere dorpen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Kampen, dus ook in IJsselmuiden, Grafhorst, Zalk, Wilsum en Kamperveen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Zwartewaterland", href: "/regio/overijssel/zwartewaterland" },
    { naam: "Woning verduurzamen in Staphorst", href: "/regio/overijssel/staphorst" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const OLST_WIJHE: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Olst-Wijhe | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Olst, Wijhe of Wesepe? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Olst-Wijhe",
  h1: "Je woning isoleren en verduurzamen in Olst-Wijhe",
  intro: [
    ["Woon je in ", { tekst: "Olst", href: "/regio/overijssel/olst-wijhe/olst" }, ", ", { tekst: "Wijhe", href: "/regio/overijssel/olst-wijhe/wijhe" }, ", ", { tekst: "Wesepe", href: "/regio/overijssel/olst-wijhe/wesepe" }, " of een van de andere kernen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Bijna de helft van de woningen in Olst-Wijhe is van vóór 1975. Met een groot aandeel vrijstaande woningen is er in veel gevallen nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["olst", "wijhe", "wesepe"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Olst-Wijhe verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "8.267", label: "woningen" },
      { waarde: "32%", label: "vrijstaand" },
      { waarde: "~49%", label: "gebouwd vóór 1975" },
      { waarde: "70%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 49, tekst: "Vrijstaande woningen en lintbebouwing langs de IJssel. Spouwmuren zijn er vaak, maar de spouw is regelmatig nog leeg of slecht gevuld." },
      { label: "1975 – 1995", percentage: 19, tekst: "Deels geïsoleerd bij oplevering. Bijisoleren van spouw en dak geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 19, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 13, tekst: "Al goed geïsoleerd bij oplevering. Zonnepanelen zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/olst-wijhe/" },
  },
  lokaal: {
    titel: "Olst-Wijhe: wonen langs de IJssel",
    alineas: [
      ["De gemeente Olst-Wijhe ligt aan de IJssel, tussen Deventer en Zwolle. De twee kernen Olst en Wijhe hebben elk een eigen dorpscentrum. Het landelijke karakter, met veel vrijstaande woningen en kleine kernen, maakt het een van de rustigere gemeenten van Overijssel."],
      ["In Wijhe staat een achthoekige houten paltrokmolen uit 1703 als rijksmonument. In Olst is landgoed De Haare met een historische tolpoort een bekende buitenplaats. De gemeente telt relatief veel eigenaar-bewoners (70%) met vrijstaande woningen uit de jaren vijftig en zestig."],
    ],
    bekendVan: {
      titel: "Waar is Olst-Wijhe bekend om?",
      kaarten: [
        { icon: "landmark", titel: "Paltrokmolen Wijhe", tekst: "De achthoekige houten paltrokmolen van Wijhe (1703) is een rijksmonument en een van de markantste gebouwen van de gemeente." },
        { icon: "waves", titel: "IJssel", tekst: "De IJssel vormt de oostelijke grens van de gemeente. Het rivierenlandschap bepaalt het karakter van Olst en Wijhe." },
      ],
    },
    kernTekst: {
      olst: "Kern aan de IJssel, met een historisch dorpscentrum en landgoed De Haare.",
      wijhe: "Grootste kern van de gemeente, met een rijksmonumentale paltrokmolen.",
      wesepe: "Klein dorp tussen Olst en Wijhe, met een landelijk karakter.",
    },
    wijken: {
      titel: "Wijken in Olst-Wijhe",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Olst", woningen: 2669, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 64,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 13 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wijhe", woningen: 2866, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 64,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wesepe", woningen: 531, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 15 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Boskamp", woningen: 546, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 62,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 25 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 21 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Boerhaar", woningen: 286, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 35 }, { label: "1945 tot 1965", percentage: 17 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Welsum", woningen: 255, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 85,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 45 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 3 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 5 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Den Nul", woningen: 343, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 38 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 2 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Eikelhof", woningen: 143, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 91,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 59 }, { label: "1945 tot 1965", percentage: 3 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Elshof", woningen: 306, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 88,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 47 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Marle", woningen: 24, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 50 }, { label: "1945 tot 1965", percentage: 4 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 21 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 0 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Middel", woningen: 130, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 93,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 52 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 2 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Herxen", woningen: 168, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 90,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 57 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/olst-wijhe/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Olst-Wijhe?",
      tekst: "Met bijna de helft van de woningvoorraad van vóór 1975 en een groot aandeel vrijstaande woningen is er in Olst-Wijhe veel verduurzamingspotentieel. Spouwmuurisolatie en dakisolatie zijn de meestgevraagde maatregelen. Gijs kijkt per woning wat de logische volgorde is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Olst-Wijhe",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Olst-Wijhe moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Olst-Wijhe?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Wijhe en Wesepe." },
    { question: "Welke subsidies zijn er voor mijn woning in Olst-Wijhe?", answer: "Op deze pagina zie je de regelingen die nu voor Olst-Wijhe gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Veel woningen zijn later al verbeterd. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Helpt Gijs ook in Olst en Wesepe?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Olst-Wijhe, dus ook in Olst, Wesepe en de buurtschappen in het buitengebied." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Deventer", href: "/regio/overijssel/deventer" },
    { naam: "Woning verduurzamen in Raalte", href: "/regio/overijssel/raalte" },
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const OMMEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Ommen | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Ommen of Vilsteren? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Ommen",
  h1: "Je woning isoleren en verduurzamen in Ommen",
  intro: [
    ["Woon je in Ommen, ", { tekst: "Vilsteren", href: "/regio/overijssel/ommen/vilsteren" }, ", ", { tekst: "Beerze", href: "/regio/overijssel/ommen/beerze" }, " of een van de andere dorpen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Bijna 44% van de woningen in Ommen is van vóór 1975. Met een groot aandeel vrijstaande woningen (38%) is er in veel gevallen nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["ommen", "vilsteren", "beerze", "stegeren", "varsen", "giethmen"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Ommen verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "7.934", label: "woningen" },
      { waarde: "38%", label: "vrijstaand" },
      { waarde: "44%", label: "gebouwd vóór 1975" },
      { waarde: "71%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 44, tekst: "Vrijstaande woningen langs de Vecht en historische bebouwing in Ommen. Spouwmuren zijn er vaak, maar de spouw is regelmatig nog leeg of slecht gevuld." },
      { label: "1975 – 1995", percentage: 26, tekst: "Deels geïsoleerd bij oplevering. Bijisoleren van spouw en dak geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 20, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 10, tekst: "Al goed geïsoleerd bij oplevering. Zonnepanelen zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/ommen/" },
  },
  lokaal: {
    titel: "Ommen: wonen langs de Vecht",
    alineas: [
      ["Ommen is een van de oudste steden van Overijssel, het ontving al in 1248 stadsrechten. De gemeente grenst aan Nationaal Park Sallandse Heuvelrug en heeft een uitgesproken landelijk karakter, met veel vrijstaande woningen en kleine kernen langs de Vecht."],
      ["De rivier de Vecht is bepalend voor het landschap van Ommen. Vilsteren, Beerze en de andere dorpen zijn kleine kernen met een hecht gemeenschapskarakter. In het buitengebied staan ook voormalige boerderijen die verbouwd zijn tot woonboerderijen."],
    ],
    bekendVan: {
      titel: "Waar is Ommen bekend om?",
      kaarten: [
        { icon: "waves", titel: "Vechtdal", tekst: "De Vecht is het hart van de gemeente. Het Vechtdal trekt wandelaars, fietsers en kanoërs en grenst aan Nationaal Park Sallandse Heuvelrug." },
        { icon: "landmark", titel: "Oudste stad van Overijssel", tekst: "Ommen ontving stadsrechten in 1248 en is een van de oudste steden van Overijssel." },
      ],
    },
    kernTekst: {
      ommen: "De stadskern van de gemeente, met de meeste voorzieningen.",
      vilsteren: "Dorp ten zuiden van Ommen, in het Vechtdal.",
      beerze: "Dorp in het zuiden van de gemeente, in een bosrijke omgeving.",
      stegeren: "Klein dorp in het noorden van de gemeente.",
      varsen: "Dorp langs de Vecht, ten westen van Ommen.",
      giethmen: "Buurtschap in het noorden van de gemeente Ommen.",
    },
    wijken: {
      titel: "Wijken in Ommen",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Ommen", woningen: 5886, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 67,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 7 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 20 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Arrien", woningen: 133, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 89,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 32 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 3 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Beerze", woningen: 75, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 77,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 43 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 15 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Beerzerveld", woningen: 378, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 79,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Dalmsholte", woningen: 125, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 42 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Giethmen", woningen: 76, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 89,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 36 }, { label: "1945 tot 1965", percentage: 22 }, { label: "1965 tot 1975", percentage: 1 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Lemele", woningen: 550, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 85,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 13 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Stegeren", woningen: 140, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 36 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 12 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Vilsteren", woningen: 157, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 78,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 19 }, { label: "1945 tot 1965", percentage: 15 }, { label: "1965 tot 1975", percentage: 37 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Vinkenbuurt", woningen: 171, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 48 }, { label: "1945 tot 1965", percentage: 18 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Witharen", woningen: 243, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 24 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/ommen/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Ommen?",
      tekst: "In Ommen zelf staan veel woningen uit de jaren vijftig tot zeventig met spouwmuren. In de omliggende dorpen en het buitengebied tref je vaker vrijstaande woningen en voormalige boerderijen. Gijs kijkt per woning wat de logische volgorde is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Ommen",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Ommen, die grenst aan Nationaal Park Sallandse Heuvelrug, moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Ommen?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies over welke maatregelen passen bij jouw woning. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Vilsteren, Beerze en de andere dorpen." },
    { question: "Welke subsidies zijn er voor mijn woning in Ommen?", answer: "Op deze pagina zie je de regelingen die nu voor Ommen gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Veel woningen zijn later al verbeterd. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Helpt Gijs ook in Vilsteren, Beerze en de andere dorpen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Ommen, van Vilsteren en Beerze tot Stegeren, Varsen en Giethmen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Dalfsen", href: "/regio/overijssel/dalfsen" },
    { naam: "Woning verduurzamen in Hardenberg", href: "/regio/overijssel/hardenberg" },
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const RAALTE: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Raalte | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Raalte of Heino? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Raalte",
  h1: "Je woning isoleren en verduurzamen in Raalte",
  intro: [
    ["Woon je in Raalte, ", { tekst: "Heino", href: "/regio/overijssel/raalte/heino" }, ", ", { tekst: "Heeten", href: "/regio/overijssel/raalte/heeten" }, " of een van de andere dorpen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Ruim een derde van de woningen in Raalte is van vóór 1975. Met een mix van vrijstaande woningen en tussenwoningen is er in veel gevallen nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["raalte", "heino", "heeten", "luttenberg", "marienheem", "broekland"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Raalte verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "16.573", label: "woningen" },
      { waarde: "27%", label: "vrijstaand" },
      { waarde: "37%", label: "gebouwd vóór 1975" },
      { waarde: "70%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 37, tekst: "Historische bebouwing in de dorpskernen en naoorlogse uitbreidingen. Spouwmuren zijn er vaak, maar de spouw is regelmatig nog leeg of slecht gevuld." },
      { label: "1975 – 1995", percentage: 33, tekst: "Een relatief groot deel van de woningvoorraad stamt uit deze periode. Deels geïsoleerd, maar bijisoleren geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 20, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 10, tekst: "Al goed geïsoleerd bij oplevering. Zonnepanelen zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/raalte/" },
  },
  lokaal: {
    titel: "Raalte: Salland op zijn best",
    alineas: [
      ["De gemeente Raalte ligt in het hart van Salland, met als grootste kern de stad Raalte en de dorpen Heino, Heeten, Luttenberg, Mariënheem en Broekland. De gemeente heeft een landelijk karakter met een mix van vrijstaande woningen, twee-onder-één-kappers en tussenwoningen."],
      ["Heino is een levendig dorp met eigen winkelstraat en voorzieningen. In Raalte zelf staat de neogotische Heilige Kruisverheffingskerk (1891) als rijksmonument, een herkenningspunt in het dorpslandschap."],
    ],
    bekendVan: {
      titel: "Waar is Raalte bekend om?",
      kaarten: [
        { icon: "landmark", titel: "Heilige Kruisverheffingskerk", tekst: "De neogotische kerk in Raalte (1891, architect A. Tepe) is een rijksmonument en het markantste gebouw van de gemeente." },
        { icon: "trees", titel: "Sallandse landschap", tekst: "De gemeente ligt in het Sallandse coulissenlandschap, met afwisseling van landbouwgrond, bossen en heidevelden." },
      ],
    },
    kernTekst: {
      raalte: "De hoofdkern van de gemeente met de meeste voorzieningen.",
      heino: "Levendig dorp met eigen winkelstraat, ten noorden van Raalte.",
      heeten: "Dorp ten zuiden van Raalte, met een rustig landelijk karakter.",
      luttenberg: "Dorp in het oosten van de gemeente, op de Sallandse Heuvelrug.",
      marienheem: "Klein dorp in het noorden van de gemeente.",
      broekland: "Buurtschap in het westen van de gemeente Raalte.",
    },
    wijken: {
      titel: "Wijken in Raalte",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Raalte", woningen: 8932, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 62,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 6 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 22 }, { label: "1985 tot 1995", percentage: 18 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Luttenberg", woningen: 948, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Mariënheem", woningen: 607, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 20 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 8 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Nieuw Heeten", woningen: 492, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Heeten", woningen: 1568, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 19 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Broekland", woningen: 498, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 81,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 17 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 21 }, { label: "1995 tot 2005", percentage: 13 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Heino", woningen: 3071, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 10 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 24 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 17 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Lierderholthuis", woningen: 192, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 22 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 15 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Laag Zuthem", woningen: 265, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 28 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 16 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/raalte/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Raalte?",
      tekst: "In Raalte en Heino staan veel woningen uit de jaren zeventig en tachtig. Spouwmuurisolatie en dakisolatie zijn hier de meestgevraagde maatregelen. In Luttenberg, op de heuvelrug, zijn het vaker vrijstaande woningen waarbij de combinatie dak, spouw en vloer de meeste winst geeft.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Raalte",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Raalte moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Raalte?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Heino, Heeten en de andere dorpen." },
    { question: "Welke subsidies zijn er voor mijn woning in Raalte?", answer: "Op deze pagina zie je de regelingen die nu voor Raalte gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Veel woningen zijn later al verbeterd. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Helpt Gijs ook in Heino, Heeten en de andere dorpen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Raalte, dus ook in Heino, Heeten, Luttenberg, Mariënheem en Broekland." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Deventer", href: "/regio/overijssel/deventer" },
    { naam: "Woning verduurzamen in Olst-Wijhe", href: "/regio/overijssel/olst-wijhe" },
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
  ],
  woningInzichtenBlok: {
    h2: "Spouwmuurisolatie zonder onnodige overlast",
    feitVariant: "heading",
    percentageTekst: "1 op de 3 woningen in Raalte is een tussenwoning",
    bodytekst: "Tussenwoningen delen een muur met de buren. Dat heeft voordelen bij isolatie: je verliest minder warmte via de zijgevels. Maar het betekent ook dat spouwmuurisolatie zorgvuldig moet gebeuren, zeker als de buurwoning al geïsoleerd is. Gijs zorgt dat het werk netjes en zonder onnodige overlast wordt uitgevoerd.",
    kaarten: [
      { icon: "layers", titel: "Spouwmuurisolatie bij tussenwoningen", tekst: "Bij een tussenwoning zit de meeste winst in de voor- en achtergevel. Spouwmuurisolatie is dan de meest effectieve eerste maatregel.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Lees over spouwmuurisolatie" },
      { icon: "home", titel: "Dakisolatie als volgende stap", tekst: "Na de spouw is het dak vaak de logische vervolgstap. Zeker bij woningen uit de jaren zeventig en tachtig, waar het dak nog niet of nauwelijks is geïsoleerd.", href: "/maatregelen/dakisolatie", linkTekst: "Lees over dakisolatie" },
    ],
    adviseur: { naam: "thom", h3: "Thom adviseert je in Raalte", tekst: "In Raalte staan veel tussenwoningen uit de jaren zeventig en tachtig. Thom bekijkt of de spouw al gevuld is, of er eerder al is geïsoleerd en welke stap nu het meeste oplevert." },
  },
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const STAPHORST: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Staphorst | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Staphorst of Rouveen? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Staphorst",
  h1: "Je woning isoleren en verduurzamen in Staphorst",
  intro: [
    ["Woon je in Staphorst, ", { tekst: "Rouveen", href: "/regio/overijssel/staphorst/rouveen" }, ", ", { tekst: "IJhorst", href: "/regio/overijssel/staphorst/ijhorst" }, " of een van de andere kernen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Ruim een derde van de woningen in Staphorst is van vóór 1975. Met een hoog aandeel koopwoningen (78%) en vrijstaande woningen is er in veel gevallen nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["staphorst", "rouveen", "ijhorst", "de-lichtmis"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Staphorst verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "6.279", label: "woningen" },
      { waarde: "33%", label: "vrijstaand" },
      { waarde: "36%", label: "gebouwd vóór 1975" },
      { waarde: "78%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 36, tekst: "Lintbebouwing langs de dorpsstraten en vrijstaande woningen op de veenkoloniale kavels. Spouwmuren zijn er vaak, maar de spouw is regelmatig nog leeg." },
      { label: "1975 – 1995", percentage: 20, tekst: "Deels geïsoleerd bij oplevering. Bijisoleren van spouw en dak geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 32, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 12, tekst: "Al goed geïsoleerd bij oplevering. Zonnepanelen zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/staphorst/" },
  },
  lokaal: {
    titel: "Staphorst: eigen karakter, sterke gemeenschap",
    alineas: [
      ["Staphorst is een gemeente met een sterk eigen karakter. De langgerekte dorpslinten, Staphorst en Rouveen, zijn kenmerkend voor de veenkoloniale ontginningsgeschiedenis. De gemeente staat nationaal bekend om de traditionele klederdracht, die vrouwen in de gemeente nog dagelijks dragen."],
      ["IJhorst en De Lichtmis zijn kleinere kernen in het westen van de gemeente. Het hoge aandeel koopwoningen (78%) en de dominantie van vrijstaande woningen maken Staphorst een gemeente met relatief veel verduurzamingspotentieel per woning."],
    ],
    bekendVan: {
      titel: "Waar is Staphorst bekend om?",
      kaarten: [
        { icon: "landmark", titel: "Klederdracht", tekst: "Staphorst staat nationaal bekend om de traditionele klederdracht. Museum Staphorst bewaart deze traditie; het Staphorster dotwork is erkend als immaterieel erfgoed." },
        { icon: "trees", titel: "Veenkoloniaal lint", tekst: "De langgerekte dorpslinten van Staphorst en Rouveen zijn een karakteristiek resultaat van de veenontginning." },
      ],
    },
    kernTekst: {
      staphorst: "Het hoofdlint van de gemeente, met het gemeentehuis en Museum Staphorst.",
      rouveen: "Het tweede grote lint, direct aansluitend op Staphorst.",
      ijhorst: "Klein dorp in het westen van de gemeente, bij de A28.",
      "de-lichtmis": "Kern in het westen van de gemeente, nabij IJhorst.",
    },
    wijken: {
      titel: "Wijken in Staphorst",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Staphorst (kern)", woningen: 3315, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 75,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 12 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 15 }, { label: "1985 tot 1995", percentage: 19 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Rouveen (kern)", woningen: 1309, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 26 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 21 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Rouveen (buitengebied)", woningen: 129, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 21 }, { label: "1945 tot 1965", percentage: 27 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 2 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 16 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 14 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Staphorst (buitengebied)", woningen: 645, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 88,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 25 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 15 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "IJhorst", woningen: 542, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 76,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 17 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Punthorst", woningen: 339, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 85,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 34 }, { label: "1945 tot 1965", percentage: 15 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/staphorst/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Staphorst?",
      tekst: "In de lintbebouwing van Staphorst en Rouveen staan veel vrijstaande woningen op ruime kavels. Dakisolatie en spouwmuurisolatie zijn hier de meestgevraagde maatregelen. Gijs kijkt per woning wat de logische volgorde is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Staphorst",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Staphorst moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Staphorst?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Rouveen, IJhorst en De Lichtmis." },
    { question: "Welke subsidies zijn er voor mijn woning in Staphorst?", answer: "Op deze pagina zie je de regelingen die nu voor Staphorst gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Veel woningen in Staphorst zijn later al verbeterd. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Helpt Gijs ook in Rouveen en IJhorst?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Staphorst, dus ook in Rouveen, IJhorst en De Lichtmis." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Zwartewaterland", href: "/regio/overijssel/zwartewaterland" },
    { naam: "Woning verduurzamen in Steenwijkerland", href: "/regio/overijssel/steenwijkerland" },
    { naam: "Woning verduurzamen in Dalfsen", href: "/regio/overijssel/dalfsen" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const STEENWIJKERLAND: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Steenwijkerland | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Steenwijk, Giethoorn of Vollenhove? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Steenwijkerland",
  h1: "Je woning isoleren en verduurzamen in Steenwijkerland",
  intro: [
    ["Woon je in ", { tekst: "Steenwijk", href: "/regio/overijssel/steenwijkerland/steenwijk" }, ", ", { tekst: "Giethoorn", href: "/regio/overijssel/steenwijkerland/giethoorn" }, ", ", { tekst: "Vollenhove", href: "/regio/overijssel/steenwijkerland/vollenhove" }, " of een van de andere kernen van de gemeente? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Bijna de helft van de woningen in Steenwijkerland is van vóór 1975. Met een groot aandeel vrijstaande woningen (32%) is er in veel gevallen nog winst te halen met ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, ", ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["steenwijk", "vollenhove", "oldemarkt", "giethoorn", "sint-jansklooster", "tuk", "steenwijkerwold", "wanneperveen", "blokzijl", "kuinre"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Steenwijkerland verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "20.632", label: "woningen" },
      { waarde: "32%", label: "vrijstaand" },
      { waarde: "~47%", label: "gebouwd vóór 1975" },
      { waarde: "66%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 47, tekst: "Vrijstaande woningen in de dorpen en historische bebouwing in Steenwijk en Vollenhove. Spouwmuren zijn er vaak, maar de spouw is regelmatig nog leeg of slecht gevuld." },
      { label: "1975 – 1995", percentage: 23, tekst: "Deels geïsoleerd bij oplevering. Bijisoleren van spouw en dak geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 20, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 10, tekst: "Al goed geïsoleerd bij oplevering. Zonnepanelen zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/steenwijkerland/" },
  },
  lokaal: {
    titel: "Steenwijkerland: van Giethoorn tot Vollenhove",
    alineas: [
      ["Steenwijkerland is een uitgestrekte gemeente in het noorden van Overijssel, met als grootste kern de stad Steenwijk. De gemeente omvat ook de historische vestingstad Vollenhove, het wereldberoemde Giethoorn en een reeks kleinere dorpen en kernen in het veenlandschap."],
      ["Giethoorn staat bekend als 'het Venetië van het Noorden': het dorp heeft nauwelijks verharde wegen en is vrijwel uitsluitend bereikbaar per boot of fiets. Nationaal Park De Weerribben-Wieden, het grootste aaneengesloten laagveenmoeras van Noordwest-Europa, valt grotendeels binnen de gemeente."],
    ],
    bekendVan: {
      titel: "Waar is Steenwijkerland bekend om?",
      kaarten: [
        { icon: "waves", titel: "Giethoorn", tekst: "Giethoorn staat wereldwijd bekend als 'het Venetië van het Noorden'. Het dorp is vrijwel uitsluitend bereikbaar per boot of fiets." },
        { icon: "landmark", titel: "Vollenhove", tekst: "Vollenhove is een historische vestingstad met middeleeuwse grachten en het 16e-eeuwse kasteel Toutenburg." },
      ],
    },
    kernTekst: {
      steenwijk: "De hoofdstad van de gemeente, met de meeste voorzieningen.",
      vollenhove: "Historische vestingstad met middeleeuwse grachten.",
      oldemarkt: "Dorp in het noorden van de gemeente.",
      giethoorn: "Wereldberoemd vaardorp, 'het Venetië van het Noorden'.",
      "sint-jansklooster": "Dorp in het noorden van de gemeente.",
      tuk: "Dorp ten zuiden van Steenwijk.",
      steenwijkerwold: "Dorp ten zuiden van Steenwijk.",
      wanneperveen: "Dorp in het veenlandschap van Steenwijkerland.",
      blokzijl: "Historisch stadje aan het Vollenhoverkanaal.",
      kuinre: "Dorp aan het Vollenhoverkanaal, in het noorden van de gemeente.",
    },
    wijken: {
      titel: "Wijken in Steenwijkerland",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Steenwijk", woningen: 8683, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 53,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 18 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Oldemarkt", woningen: 1194, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 16 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 20 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 21 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Kalenberg", woningen: 167, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 41 }, { label: "1945 tot 1965", percentage: 23 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Kuinre", woningen: 406, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 18 }, { label: "1945 tot 1965", percentage: 32 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Blankenham", woningen: 140, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 34 }, { label: "1945 tot 1965", percentage: 30 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 4 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Scheerwolde", woningen: 265, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 7 }, { label: "1945 tot 1965", percentage: 39 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 19 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Vollenhove", woningen: 1972, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 59,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 12 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 18 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Sint Jansklooster", woningen: 943, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 12 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 11 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 10 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Belt-Schutsloot", woningen: 258, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 84,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 18 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wanneperveen", woningen: 706, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 74,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 18 }, { label: "1945 tot 1965", percentage: 15 }, { label: "1965 tot 1975", percentage: 22 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 15 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Blokzijl", woningen: 657, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 71,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 29 }, { label: "1945 tot 1965", percentage: 15 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 4 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 19 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 6 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Giethoorn", woningen: 1353, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 72,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Zuidveen", woningen: 263, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 78,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 35 }, { label: "1945 tot 1965", percentage: 29 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Onna", woningen: 129, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 47 }, { label: "1945 tot 1965", percentage: 21 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Kallenkote", woningen: 137, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 69,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 39 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 1 }, { label: "2015 tot 2025", percentage: 21 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Eesveen", woningen: 249, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 42 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 8 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 2 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Bult", woningen: 54, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 83,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 7 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Baars", woningen: 39, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 85,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 38 }, { label: "1945 tot 1965", percentage: 26 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Witte Paarden", woningen: 96, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 96,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 59 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 3 }, { label: "1985 tot 1995", percentage: 3 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "De Pol", woningen: 64, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 92,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 74 }, { label: "1945 tot 1965", percentage: 3 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 8 }, { label: "1985 tot 1995", percentage: 2 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 2 }, { label: "2015 tot 2025", percentage: 5 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Willemsoord", woningen: 367, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 31 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 11 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Marijenkampen", woningen: 58, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 100,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 53 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 3 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Tuk", woningen: 873, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 20 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Steenwijkerwold", woningen: 878, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 60,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 24 }, { label: "1965 tot 1975", percentage: 16 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Basse", woningen: 97, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 90,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 44 }, { label: "1945 tot 1965", percentage: 14 }, { label: "1965 tot 1975", percentage: 11 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 6 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 8 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Paasloo", woningen: 160, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 94,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 43 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 4 }, { label: "1975 tot 1985", percentage: 7 }, { label: "1985 tot 1995", percentage: 9 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "IJsselham", woningen: 28, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 93,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 52 }, { label: "1945 tot 1965", percentage: 7 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 14 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Ossenzijl", woningen: 269, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 88,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 25 }, { label: "1965 tot 1975", percentage: 7 }, { label: "1975 tot 1985", percentage: 17 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Wetering", woningen: 99, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 86,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 27 }, { label: "1945 tot 1965", percentage: 27 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 1 }, { label: "1995 tot 2005", percentage: 8 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Nederland", woningen: 10, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 82,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 50 }, { label: "1945 tot 1965", percentage: 20 }, { label: "1965 tot 1975", percentage: 10 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 0 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        { naam: "Baarlo", woningen: 18, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 80,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 17 }, { label: "1945 tot 1965", percentage: 39 }, { label: "1965 tot 1975", percentage: 28 }, { label: "1975 tot 1985", percentage: 0 }, { label: "1985 tot 1995", percentage: 0 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/steenwijkerland/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Steenwijkerland?",
      tekst: "In Steenwijk staan veel woningen uit de jaren vijftig tot tachtig. In de kleinere dorpen als Giethoorn, Blokzijl en Vollenhove staan oudere panden, soms met monumentale status, waarbij gevelaanpassingen beperkingen kennen. Gijs kijkt welke maatregelen per woning mogelijk zijn.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Steenwijkerland",
    lead: "Steenwijkerland grenst aan Nationaal Park De Weerribben-Wieden. In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen, bij isolatie moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Steenwijkerland?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Giethoorn, Vollenhove en de andere kernen." },
    { question: "Welke subsidies zijn er voor mijn woning in Steenwijkerland?", answer: "Op deze pagina zie je de regelingen die nu voor Steenwijkerland gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning staat in Giethoorn. Kan ik toch isoleren?", answer: "Ja, maar bij panden in beschermd dorpsgezicht of met monumentale status gelden soms beperkingen voor de uitstraling. Gijs kijkt welke maatregelen wél mogelijk zijn, vloerisolatie, binnenisolatie en glas zijn dan vaak een optie." },
    { question: "Helpt Gijs ook in Giethoorn, Vollenhove en de andere dorpen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Steenwijkerland, van Steenwijk en Giethoorn tot Vollenhove, Blokzijl, Oldemarkt en Kuinre." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Staphorst", href: "/regio/overijssel/staphorst" },
    { naam: "Woning verduurzamen in Zwartewaterland", href: "/regio/overijssel/zwartewaterland" },
    { naam: "Woning verduurzamen in Kampen", href: "/regio/overijssel/kampen" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 27 oktober 2026.
const ZWARTEWATERLAND: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren in Zwartewaterland | Advies & ontzorging – Gijs",
    description: "Zoek je hulp bij het isoleren van je woning in Hasselt, Genemuiden of Zwartsluis? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z.",
  },
  kicker: "Gemeente Zwartewaterland",
  h1: "Je woning isoleren en verduurzamen in Zwartewaterland",
  intro: [
    ["Woon je in ", { tekst: "Hasselt", href: "/regio/overijssel/zwartewaterland/hasselt" }, ", ", { tekst: "Genemuiden", href: "/regio/overijssel/zwartewaterland/genemuiden" }, ", ", { tekst: "Zwartsluis", href: "/regio/overijssel/zwartewaterland/zwartsluis" }, " of ", { tekst: "Mastenbroek", href: "/regio/overijssel/zwartewaterland/mastenbroek" }, "? Gijs geeft onafhankelijk verduurzamingsadvies en begeleidt je van A tot Z, van de eerste keuzes tot en met de uitvoering door vakspecialisten."],
    ["Bijna 44% van de woningen in Zwartewaterland is van vóór 1975. Met een groot aandeel tussenwoningen (34%) is er in veel gevallen nog winst te halen met ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, ", ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
  ],
  kernen: ["hasselt", "genemuiden", "zwartsluis", "mastenbroek"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Zwartewaterland verdeeld, en dit betekent het meestal voor isolatie.",
    kerncijfers: [
      { waarde: "9.305", label: "woningen" },
      { waarde: "34%", label: "tussenwoning" },
      { waarde: "44%", label: "gebouwd vóór 1975" },
      { waarde: "72%", label: "koopwoning" },
    ],
    bouwperiodes: [
      { label: "Vóór 1975", percentage: 44, tekst: "Historische bebouwing in Hasselt en de lintbebouwing langs het Zwarte Water. Spouwmuren zijn er vaak, maar de spouw is regelmatig nog leeg of slecht gevuld." },
      { label: "1975 – 1995", percentage: 28, tekst: "Deels geïsoleerd bij oplevering. Bijisoleren van spouw en dak geeft hier nog de meeste winst." },
      { label: "1995 – 2015", percentage: 19, tekst: "Beter geïsoleerd. De winst zit vaker in beter glas of de overstap naar een warmtepomp." },
      { label: "Na 2015", percentage: 9, tekst: "Al goed geïsoleerd bij oplevering. Zonnepanelen zijn hier vaker de logische volgende stap." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, 2026", url: "https://www.allecijfers.nl/gemeente/zwartewaterland/" },
  },
  lokaal: {
    titel: "Zwartewaterland: drie karaktervolle kernen",
    alineas: [
      ["Zwartewaterland ontstond in 2001 door de fusie van Genemuiden, Zwartsluis en Hasselt. De drie kernen hebben elk een eigen karakter. Hasselt is de bestuurlijke hoofdkern en een historische vestingsstad. Genemuiden staat nationaal bekend als tapijthoofdstad van Nederland, meer dan 60% van de landelijke tapijtproductie komt uit dit cluster. Zwartsluis is een watersportdorp bij het sluizencomplex."],
      ["Het polderland langs het Zwarte Water bepaalt het karakter van de gemeente. Mastenbroek is een van de oudste droogmakerijen van Nederland. Veel woningen in de gemeente zijn van vóór 1975 en hebben nog verduurzamingspotentieel."],
    ],
    bekendVan: {
      titel: "Waar is Zwartewaterland bekend om?",
      kaarten: [
        { icon: "landmark", titel: "Hasselt: Hanzestad", tekst: "Hasselt is een historische vestings- en voormalige Hanzestad met de 14e-eeuwse Grote of Petruskerk als rijksmonument." },
        { icon: "building", titel: "Genemuiden: tapijthoofdstad", tekst: "Genemuiden is de tapijthoofdstad van Nederland: ruim 60% van de nationale tapijtproductie komt uit dit cluster." },
      ],
    },
    kernTekst: {
      hasselt: "De bestuurlijke hoofdkern, een historische Hanzestad aan het Zwarte Water.",
      genemuiden: "De tapijthoofdstad van Nederland, met een sterk industrieel karakter.",
      zwartsluis: "Watersportdorp bij het sluizencomplex aan de Zwolsche Diep.",
      mastenbroek: "Polderdorp in een van de oudste droogmakerijen van Nederland.",
    },
    wijken: {
      titel: "Wijken in Zwartewaterland",
      intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
      lijst: [
        { naam: "Genemuiden", woningen: 3602, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 78,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 13 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 17 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 10 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Kamperzeedijk", woningen: 210, periode: "Grotendeels 1975 – 1995", tijdvak: 1, koopwoningPercentage: 87,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 11 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 19 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 19 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 2 }] },
        { naam: "Hasselt", woningen: 3017, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 73,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 12 }, { label: "1945 tot 1965", percentage: 8 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 18 }, { label: "1985 tot 1995", percentage: 16 }, { label: "1995 tot 2005", percentage: 7 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 11 }, { label: "2025 en later", percentage: 4 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Landelijk gebied Hasselt", woningen: 192, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 90,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 35 }, { label: "1945 tot 1965", percentage: 19 }, { label: "1965 tot 1975", percentage: 5 }, { label: "1975 tot 1985", percentage: 5 }, { label: "1985 tot 1995", percentage: 8 }, { label: "1995 tot 2005", percentage: 5 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 13 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Zwartsluis", woningen: 2227, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 59,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 23 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 10 }, { label: "1995 tot 2005", percentage: 14 }, { label: "2005 tot 2015", percentage: 7 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 1 }] },
        { naam: "Mastenbroek", woningen: 57, periode: "Grotendeels vóór 1975", tijdvak: 0, koopwoningPercentage: 75,
          bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 14 }, { label: "1945 tot 1965", percentage: 24 }, { label: "1965 tot 1975", percentage: 6 }, { label: "1975 tot 1985", percentage: 16 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 11 }, { label: "2005 tot 2015", percentage: 6 }, { label: "2015 tot 2025", percentage: 7 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
      ],
      bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/zwartewaterland/" },
    },
    ontwikkeling: {
      titel: "Wat speelt er in Zwartewaterland?",
      tekst: "In Genemuiden en Hasselt staan veel tussenwoningen uit de jaren vijftig tot tachtig. Spouwmuurisolatie is hier de meestgevraagde maatregel. In Zwartsluis tref je vaker vrijstaande woningen langs het water. Gijs kijkt per woning wat de logische volgorde is.",
    },
  },
  natuur: {
    titel: "Beschermde dieren bij isolatie in gemeente Zwartewaterland",
    lead: "In spouwmuren, muren en daken wonen vleermuizen, huismussen en gierzwaluwen. Bij isolatie in de gemeente Zwartewaterland moet je hier rekening mee houden:",
    stappen: [
      { icon: "badge-check", titel: "Kies een natuurvriendelijk isolatiebedrijf", tekst: "Een erkend bedrijf weet welke soorten voorkomen en hoe je ze beschermt bij de werkzaamheden." },
      { icon: "bird", titel: "Dieren kunnen eerst weg", tekst: "Vleermuizen, huismussen en gierzwaluwen krijgen de kans om weg te vliegen voordat er wordt geïsoleerd." },
      { icon: "house-plus", titel: "Nieuwe verblijfplaatsen", tekst: "Na het isoleren worden nieuwe verblijfplaatsen aangebracht, zoveel mogelijk onzichtbaar in de spouw." },
      { icon: "file-check", titel: "Ontheffing via de provincie", tekst: "Bij een beschermde soort regelt het isolatiebedrijf de ontheffing bij de provincie Overijssel." },
    ],
    zelf: "Isoleer je zelf? Dan moet je zelf onderzoek laten doen naar beschermde soorten en een ontheffing aanvragen bij de provincie Overijssel.",
    bron: { naam: "Provincie Overijssel", url: "https://www.overijssel.nl/loket/natuur-flora-fauna/" },
  },
  faq: [
    { question: "Is Gijs een isolatiebedrijf in Zwartewaterland?", answer: "Gijs is geen uitvoerend isolatiebedrijf, maar begeleidt je onafhankelijk door het hele verduurzamingstraject. Het begint met persoonlijk advies. Daarna begeleiden en ontzorgen we je bij de uitvoering door vakspecialisten, ook in Genemuiden, Zwartsluis en Mastenbroek." },
    { question: "Welke subsidies zijn er voor mijn woning in Zwartewaterland?", answer: "Op deze pagina zie je de regelingen die nu voor Zwartewaterland gelden uit de Energiesubsidiewijzer van Milieu Centraal. Met de subsidiecheck zie je wat er voor jouw adres geldt, ook landelijk." },
    { question: "Mijn woning is van vóór 1975. Waar begin ik?", answer: "Dat hangt af van wat er al is gedaan. Veel woningen zijn later al verbeterd. Gijs kijkt tijdens de energiescan wat er al zit en welke stap de meeste winst geeft." },
    { question: "Helpt Gijs ook in Genemuiden, Zwartsluis en Mastenbroek?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Zwartewaterland, dus ook in Genemuiden, Zwartsluis en Mastenbroek." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Kampen", href: "/regio/overijssel/kampen" },
    { naam: "Woning verduurzamen in Zwolle", href: "/regio/overijssel/zwolle" },
    { naam: "Woning verduurzamen in Staphorst", href: "/regio/overijssel/staphorst" },
  ],
};

// Pexels-foto van Freek Wolsink, gratis te gebruiken, geen bronvermelding verplicht.
const WW = "/images/regio/gemeenten/winterswijk";
const WINTERSWIJK_FOTOS = {
  hero: { src: `${WW}/hero-dorp.jpg`, alt: "Lommerrijk pad met bakstenen woningen in Winterswijk", bron: "pexels", author: "Freek Wolsink" },
} satisfies Record<string, ProfielFoto>;

const VERHALEN: Record<string, GemeenteVerhaal> = {
  borne: BORNE,
  hengelo: HENGELO,
  enschede: ENSCHEDE,
  almelo: ALMELO,
  "hof-van-twente": HOF_VAN_TWENTE,
  oldenzaal: OLDENZAAL,
  hellendoorn: HELLENDOORN,
  "rijssen-holten": RIJSSEN_HOLTEN,
  twenterand: TWENTERAND,
  zwolle: ZWOLLE,
  wierden: WIERDEN,
  tubbergen: TUBBERGEN,
  dinkelland: DINKELLAND,
  haaksbergen: HAAKSBERGEN,
  losser: LOSSER,
  dalfsen: DALFSEN,
  deventer: DEVENTER,
  hardenberg: HARDENBERG,
  kampen: KAMPEN,
  "olst-wijhe": OLST_WIJHE,
  ommen: OMMEN,
  raalte: RAALTE,
  staphorst: STAPHORST,
  steenwijkerland: STEENWIJKERLAND,
  zwartewaterland: ZWARTEWATERLAND,
  // Gelderland — unieke inhoud per gemeente; CBS Kerncijfers wijken en buurten 2022
  aalten: {
    seo: {
      title: "Woning isoleren in Aalten | Gijs",
      description: "Wil je je woning isoleren in Aalten? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 11.976 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Aalten",
    h1: "Woning isoleren in Aalten",
    intro: [
      ["Woon je in Aalten, ", { tekst: "Bredevoort", href: "/regio/gelderland/aalten/bredevoort" }, ", ", { tekst: "Dinxperlo", href: "/regio/gelderland/aalten/dinxperlo" }, " of een van de andere kernen van de Achterhoekse gemeente? De woningvoorraad bestaat voor een groot deel uit vrijstaande woningen en boerderijen van vóór 1975, waar ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, ", ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, " of een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, " snel rendabel zijn."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Aalten verdeeld.",
      kerncijfers: [
        { waarde: "11.976", label: "woningen" },
        { waarde: "82%", label: "eengezinswoningen" },
        { waarde: "87%", label: "gebouwd vóór 2000" },
        { waarde: "71%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 48, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 39, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 13, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Aalten",
      alineas: [
        ["De gemeente Aalten telt drie hoofdkernen: Aalten, Bredevoort en Dinxperlo. Bredevoort staat bekend als boekenstad; Dinxperlo grenst direct aan Duitsland en heeft een gemengd woningbestand van ouder en nieuwer."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Aalten",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Aalten Kern", woningen: 5886, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Dinxperlo", woningen: 3774, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Buitengebied Aalten", woningen: 1465, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Bredevoort", woningen: 851, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Aalten?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Aalten zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  apeldoorn: {
    seo: {
      title: "Isoleren en verduurzamen in Apeldoorn | Gijs",
      description: "Wil je je woning isoleren in Apeldoorn? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 73.244 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Apeldoorn",
    h1: "Isoleren en verduurzamen in Apeldoorn",
    intro: [
      ["Woon je in Apeldoorn, ", { tekst: "Ugchelen", href: "/regio/gelderland/apeldoorn/ugchelen" }, ", ", { tekst: "Beekbergen", href: "/regio/gelderland/apeldoorn/beekbergen" }, ", ", { tekst: "Loenen", href: "/regio/gelderland/apeldoorn/loenen" }, " of een van de andere kernen? Apeldoorn is de grootste gemeente van Gelderland in oppervlak met een zeer diverse woningvoorraad: van naoorlogse rijtjeswoningen in de stadswijken tot ruime vrijstaande huizen in de bosrijke Veluwse buitengebieden."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Apeldoorn verdeeld.",
      kerncijfers: [
        { waarde: "73.244", label: "woningen" },
        { waarde: "71%", label: "eengezinswoningen" },
        { waarde: "84%", label: "gebouwd vóór 2000" },
        { waarde: "60%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 38, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 16, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Apeldoorn",
      alineas: [
        ["Naast de stad Apeldoorn vallen ook Ugchelen, Beekbergen, Loenen, Hoenderloo en tientallen buurtschappen onder de gemeente. In de bosrijke buitenwijken staan relatief veel vrijstaande woningen waarbij dakisolatie en kierdichting het grootste effect hebben op de energierekening."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Apeldoorn",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Zuidoost", woningen: 11363, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "West", woningen: 10413, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Noordoost", woningen: 10068, periode: "Overwegend vóór 2000", tijdvak: null, type: "tussenwoning" },
          { naam: "Zuid", woningen: 9201, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Oost", woningen: 7582, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "vrijstaand" },
          { naam: "Zuidwest", woningen: 6455, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Noord", woningen: 6157, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Centrum", woningen: 4666, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Beekbergen en omgeving", woningen: 1745, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Loenen en omgeving", woningen: 1408, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Wenum Wiesel Beemte", woningen: 1104, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Uddel en omgeving", woningen: 1026, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Apeldoorn?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Apeldoorn zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  // Arnhemse isolatietegoed: gecontroleerd op arnhem.nl/subsidies/isolatietegoed, 4 november 2026.
  // Basistegoed max. €1.700, met biobased materiaal tot €2.300. Voorwaarden en bedragen kunnen
  // wijzigen; daarom in de FAQ bewust gehedged en verwezen naar de gemeente voor de actuele regeling.
  arnhem: {
    seo: {
      title: "Huis isoleren in Arnhem? Isolatietegoed & subsidies | Gijs",
      description: "Huis isoleren in Arnhem? Gijs legt uit welke isolatiemaatregelen passen, hoe het Arnhemse isolatietegoed werkt en welke subsidies gelden. Gratis energiescan aan huis.",
    },
    kicker: "Gemeente Arnhem",
    h1: "Je woning verduurzamen in Arnhem",
    intro: [
      ["Woon je in Arnhem, in ", { tekst: "Presikhaaf", href: "/regio/gelderland/arnhem/presikhaaf" }, ", ", { tekst: "Malburgen", href: "/regio/gelderland/arnhem/malburgen" }, ", ", { tekst: "Klarendal", href: "/regio/gelderland/arnhem/klarendal" }, " of de Geitenkamp? Arnhem heeft een gevarieerde woningvoorraad: van historische panden in de binnenstad tot wederopbouwwoningen uit de jaren vijftig en zestig, en recente nieuwbouw in de buitenwijken."],
      ["Gijs geeft onafhankelijk advies over het isoleren van je bestaande woning: van ", { tekst: "spouwmuur", href: "/maatregelen/spouwmuurisolatie" }, " en ", { tekst: "dak", href: "/maatregelen/dakisolatie" }, " tot ", { tekst: "vloer", href: "/maatregelen/vloerisolatie" }, " en ", { tekst: "glas", href: "/maatregelen/isolatieglas" }, ". Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, welke stap het meeste oplevert en of je in aanmerking komt voor het Arnhemse isolatietegoed."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Arnhem verdeeld.",
      kerncijfers: [
        { waarde: "76.737", label: "woningen" },
        { waarde: "52%", label: "eengezinswoningen" },
        { waarde: "83%", label: "gebouwd vóór 2000" },
        { waarde: "43%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 17, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Arnhem",
      alineas: [
        ["Arnhem telt tientallen wijken, van de historische binnenstad tot Velp, Presikhaaf en de poldergebieden langs de Rijn. Naoorlogse rijtjeswoningen in Presikhaaf en Malburgen zijn bij uitstek geschikt voor spouwmuurisolatie — een maatregel die zich hier vaak in acht tot tien jaar terugverdient."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Arnhem",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Vredenburg/Kronenburg", woningen: 4446, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Velperweg e.o.", woningen: 4285, periode: "Overwegend vóór 2000", tijdvak: 0, type: "gemengd" },
          { naam: "Malburgen-Oost (Zuid)", woningen: 4164, periode: "Overwegend vóór 2000", tijdvak: 0, type: "gemengd" },
          { naam: "Presikhaaf-West", woningen: 4101, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "appartement" },
          { naam: "Klarendal", woningen: 4083, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Centrum", woningen: 3800, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Presikhaaf-Oost", woningen: 3797, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Spijkerkwartier", woningen: 3504, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Burgemeesterswijk/Hoogkamp", woningen: 3379, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Malburgen-Oost (Noord)", woningen: 2921, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "twee-onder-een-kap" },
          { naam: "St. Marten/Sonsbeek", woningen: 2841, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Arnhemse Broek", woningen: 2760, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Wat is het Arnhemse isolatietegoed en kom ik hiervoor in aanmerking?", answer: "De gemeente Arnhem biedt eigenaar-bewoners van een grondgebonden koopwoning van vóór 1993 een isolatietegoed van maximaal €1.700, oplopend tot €2.300 bij gebruik van biobased isolatiemateriaal. Er gelden voorwaarden over onder meer de WOZ-waarde, het energielabel en de woonoppervlakte. Gijs helpt je bepalen of je woning in aanmerking komt en welke isolatiemaatregel daarbij past; de aanvraag zelf loopt via de gemeente Arnhem. Bedragen en voorwaarden kunnen wijzigen, dus controleer de actuele regeling altijd bij de gemeente." },
      { question: "Welke gemeentelijke subsidies gelden in Arnhem?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Arnhem zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
      { question: "Werk je samen met een isolatiebedrijf in Arnhem, of doet Gijs dat zelf?", answer: "Gijs voert de isolatiewerkzaamheden niet zelf uit. Als onafhankelijk adviseur kijkt Gijs welke maatregelen bij jouw woning passen en helpt je bij de keuze, de subsidieaanvraag en de begeleiding van de uitvoering. Gijs werkt daarvoor samen met erkende isolatiebedrijven in de regio Arnhem." },
    ],
    verwant: [],
  },
  barneveld: {
    seo: {
      title: "Woning isoleren in Barneveld | Gijs",
      description: "Wil je je woning isoleren in Barneveld? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 22.799 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Barneveld",
    h1: "Woning isoleren in Barneveld",
    intro: [
      ["Woon je in Barneveld, ", { tekst: "Voorthuizen", href: "/regio/gelderland/barneveld/voorthuizen" }, ", ", { tekst: "Kootwijkerbroek", href: "/regio/gelderland/barneveld/kootwijkerbroek" }, ", ", { tekst: "Garderen", href: "/regio/gelderland/barneveld/garderen" }, " of een van de andere Veluwse kernen? Barneveld is een grote gemeente met veel vrijstaande woningen en twee-onder-één-kapwoningen, waarvan een groot deel gebouwd is tussen 1955 en 1985 — een bouwperiode waarbij ", { tekst: "spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }, " vrijwel altijd mogelijk is."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Barneveld verdeeld.",
      kerncijfers: [
        { waarde: "22.799", label: "woningen" },
        { waarde: "79%", label: "eengezinswoningen" },
        { waarde: "69%", label: "gebouwd vóór 2000" },
        { waarde: "68%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 38, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 31, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 31, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Barneveld",
      alineas: [
        ["De gemeente Barneveld bestaat uit Barneveld en kernen als Voorthuizen, Kootwijkerbroek, Garderen, Stroe en Terschuur. De relatief grote vrijstaande woningen bieden goede mogelijkheden voor dakisolatie; een moderne warmtepomp werkt hier goed door de ruime beschikbare buitenruimte."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Barneveld",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Barneveld", woningen: 13568, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "tussenwoning" },
          { naam: "Voorthuizen", woningen: 4488, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Kootwijkerbroek", woningen: 1797, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Garderen", woningen: 878, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Stroe", woningen: 588, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Terschuur", woningen: 549, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Zwartebroek", woningen: 546, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "De Glind", woningen: 203, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "tussenwoning" },
          { naam: "Kootwijk", woningen: 128, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Barneveld?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Barneveld zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  "berg-en-dal": {
    seo: {
      title: "Isoleren in Berg en Dal | Gijs",
      description: "Wil je je woning isoleren in Berg en Dal? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 15.802 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Berg en Dal",
    h1: "Isoleren in Berg en Dal",
    intro: [
      ["Woon je in ", { tekst: "Groesbeek", href: "/regio/gelderland/berg-en-dal/groesbeek" }, ", Beek, ", { tekst: "Millingen aan de Rijn", href: "/regio/gelderland/berg-en-dal/millingen-aan-de-rijn" }, " of een andere kern van de gemeente Berg en Dal? Deze heuvelachtige gemeente ten zuidoosten van Nijmegen heeft een gevarieerde woningvoorraad, van vrijstaande huizen op de stuwwal bij Groesbeek tot oudere arbeiderswoningen in de rivierkernen."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Berg en Dal verdeeld.",
      kerncijfers: [
        { waarde: "15.802", label: "woningen" },
        { waarde: "80%", label: "eengezinswoningen" },
        { waarde: "82%", label: "gebouwd vóór 2000" },
        { waarde: "61%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 18, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Berg en Dal",
      alineas: [
        ["Berg en Dal omvat kernen als Groesbeek, Beek, Berg en Dal, Millingen aan de Rijn en Ooij. Het heuvelachtige landschap — de Nijmeegse stuwwal — is uniek voor Nederland en zorgt voor specifieke warmteverliezen bij woningen die vrij op de helling staan."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Berg en Dal",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Groesbeek", woningen: 5866, periode: "Overwegend vóór 2000", tijdvak: null, type: "tussenwoning" },
          { naam: "Millingen aan de Rijn", woningen: 2631, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Beek", woningen: 1646, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Berg en Dal", woningen: 1255, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Ooij", woningen: 1148, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Breedeweg", woningen: 1109, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Leuth", woningen: 762, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "De Horst", woningen: 455, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Heilig Landstichting", woningen: 333, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Ubbergen", woningen: 252, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Kekerdom", woningen: 244, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Berg en Dal?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Berg en Dal zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  berkelland: {
    seo: {
      title: "Woning isoleren in Berkelland | Gijs",
      description: "Wil je je woning isoleren in Berkelland? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 19.525 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Berkelland",
    h1: "Woning isoleren in Berkelland",
    intro: [
      ["Woon je in ", { tekst: "Borculo", href: "/regio/gelderland/berkelland/borculo" }, ", ", { tekst: "Eibergen", href: "/regio/gelderland/berkelland/eibergen" }, ", ", { tekst: "Ruurlo", href: "/regio/gelderland/berkelland/ruurlo" }, ", ", { tekst: "Neede", href: "/regio/gelderland/berkelland/neede" }, " of een van de andere Achterhoekse kernen? Berkelland heeft een uitgesproken landelijk karakter, met een woningvoorraad die voor een groot deel bestaat uit vrijstaande woningen en boerderijen van vóór 1970."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Berkelland verdeeld.",
      kerncijfers: [
        { waarde: "19.525", label: "woningen" },
        { waarde: "81%", label: "eengezinswoningen" },
        { waarde: "85%", label: "gebouwd vóór 2000" },
        { waarde: "68%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 47, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 38, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 15, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Berkelland",
      alineas: [
        ["Berkelland telt kernen als Borculo, Eibergen, Ruurlo, Neede, Geesteren en Beltrum. De verspreide bebouwing in het Achterhoekse landschap maakt goede isolatie extra waardevol: vrijstaande woningen verliezen meer warmte dan rijtjeswoningen."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Berkelland",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Eibergen", woningen: 5594, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Neede", woningen: 4691, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Borculo", woningen: 4632, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Ruurlo", woningen: 3437, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Beltrum", woningen: 1171, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Berkelland?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Berkelland zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  beuningen: {
    seo: {
      title: "Verduurzamen in Beuningen | Gijs",
      description: "Wil je je woning isoleren in Beuningen? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 11.137 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Beuningen",
    h1: "Verduurzamen in Beuningen",
    intro: [
      ["Woon je in Beuningen, ", { tekst: "Ewijk", href: "/regio/gelderland/beuningen/ewijk" }, ", ", { tekst: "Winssen", href: "/regio/gelderland/beuningen/winssen" }, " of ", { tekst: "Weurt", href: "/regio/gelderland/beuningen/weurt" }, "? Beuningen is een woongemeente ten westen van Nijmegen, met een woningvoorraad die voor een groot deel bestaat uit rijtjeswoningen en twee-onder-één-kapwoningen uit de jaren zeventig en tachtig."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Beuningen verdeeld.",
      kerncijfers: [
        { waarde: "11.137", label: "woningen" },
        { waarde: "85%", label: "eengezinswoningen" },
        { waarde: "84%", label: "gebouwd vóór 2000" },
        { waarde: "70%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 38, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 16, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Beuningen",
      alineas: [
        ["De gemeente Beuningen omvat de kernen Beuningen, Ewijk, Winssen en Weurt langs de Waal. Veel woningen zijn gebouwd in de periode 1970–1990 en hebben spouwmuren zonder vulling — een maatregel die hier relatief snel en goedkoop is."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Beuningen",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Beuningen", woningen: 7549, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Ewijk", woningen: 1640, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Weurt", woningen: 1056, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Winssen", woningen: 892, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Beuningen?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Beuningen zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  bronckhorst: {
    seo: {
      title: "Woning isoleren in Bronckhorst | Gijs",
      description: "Wil je je woning isoleren in Bronckhorst? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 16.198 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Bronckhorst",
    h1: "Woning isoleren in Bronckhorst",
    intro: [
      ["Woon je in ", { tekst: "Vorden", href: "/regio/gelderland/bronckhorst/vorden" }, ", ", { tekst: "Hengelo", href: "/regio/gelderland/bronckhorst/hengelo" }, " (Gld), ", { tekst: "Zelhem", href: "/regio/gelderland/bronckhorst/zelhem" }, ", ", { tekst: "Hummelo", href: "/regio/gelderland/bronckhorst/hummelo" }, " of een van de tientallen buurtschappen? Bronckhorst is de grootste gemeente van Gelderland naar oppervlak, met een uitgesproken landelijk karakter. De woningvoorraad bestaat voor een groot deel uit oudere vrijstaande huizen en boerderijen."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Bronckhorst verdeeld.",
      kerncijfers: [
        { waarde: "16.198", label: "woningen" },
        { waarde: "84%", label: "eengezinswoningen" },
        { waarde: "89%", label: "gebouwd vóór 2000" },
        { waarde: "70%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 49, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 40, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 11, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Bronckhorst",
      alineas: [
        ["Bronckhorst omvat meer dan dertig kernen en buurtschappen, van Vorden en Zelhem tot Hengelo (Gld), Hummelo en Keppel. De historische boerderijwoningen zijn goed te isoleren via dakisolatie en gevelisolatie — een adviseur van Gijs kijkt welke aanpak bij jouw woning past."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Bronckhorst",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Zelhem", woningen: 4803, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Vorden", woningen: 3730, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Hengelo", woningen: 3673, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Steenderen", woningen: 2048, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Hummelo en Keppel", woningen: 1944, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Bronckhorst?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Bronckhorst zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  brummen: {
    seo: {
      title: "Woning verduurzamen in Brummen | Gijs",
      description: "Wil je je woning isoleren in Brummen? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 9.348 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Brummen",
    h1: "Woning verduurzamen in Brummen",
    intro: [
      ["Woon je in Brummen, ", { tekst: "Eerbeek", href: "/regio/gelderland/brummen/eerbeek" }, ", ", { tekst: "Hall", href: "/regio/gelderland/brummen/hall" }, " of ", { tekst: "Leuvenheim", href: "/regio/gelderland/brummen/leuvenheim" }, "? Brummen is een landelijke gemeente in de IJsselvallei, met een woningvoorraad die varieert van historische arbeiderswoningen in de dorpskern tot vrijstaande huizen in de buitengebieden langs de rivier."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Brummen verdeeld.",
      kerncijfers: [
        { waarde: "9.348", label: "woningen" },
        { waarde: "88%", label: "eengezinswoningen" },
        { waarde: "88%", label: "gebouwd vóór 2000" },
        { waarde: "62%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 48, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 40, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 12, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Brummen",
      alineas: [
        ["De gemeente Brummen omvat de kernen Brummen, Eerbeek, Hall, Leuvenheim en Tonden. Eerbeek is het grootste dorp en heeft relatief veel naoorlogse woningen waarbij spouwmuurisolatie de meest voor de hand liggende eerste stap is."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Brummen",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Eerbeek", woningen: 4362, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Brummen", woningen: 3981, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Hall", woningen: 329, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Leuvenheim", woningen: 293, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Empe", woningen: 254, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Tonden", woningen: 129, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Brummen?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Brummen zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  buren: {
    seo: {
      title: "Isoleren in de gemeente Buren | Gijs",
      description: "Wil je je woning isoleren in Buren? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 10.829 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Buren",
    h1: "Isoleren in de gemeente Buren",
    intro: [
      ["Woon je in ", { tekst: "Maurik", href: "/regio/gelderland/buren/maurik" }, ", ", { tekst: "Lienden", href: "/regio/gelderland/buren/lienden" }, ", ", { tekst: "Zoelen", href: "/regio/gelderland/buren/zoelen" }, ", ", { tekst: "Beusichem", href: "/regio/gelderland/buren/beusichem" }, " of een andere kern van de Betuwse gemeente Buren? Buren ligt in de fruitstreek en heeft een uitgesproken landelijk karakter, met veel vrijstaande woningen en boerderijen die baat hebben bij ", { tekst: "dakisolatie", href: "/maatregelen/dakisolatie" }, " en gevelisolatie."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Buren verdeeld.",
      kerncijfers: [
        { waarde: "10.829", label: "woningen" },
        { waarde: "92%", label: "eengezinswoningen" },
        { waarde: "81%", label: "gebouwd vóór 2000" },
        { waarde: "75%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 36, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 19, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Buren",
      alineas: [
        ["De gemeente Buren strekt zich uit over kernen als Maurik, Lienden, Zoelen, Beusichem en Eck en Wiel langs de Rijn en Linge. De agrarische omgeving en de verspreide bebouwing maken goede isolatie extra waardevol voor het terugdringen van de energierekening."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Buren",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Maurik", woningen: 2923, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand", koopwoningPercentage: 70,
            bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 19 }, { label: "1945 tot 1965", percentage: 9 }, { label: "1965 tot 1975", percentage: 17 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 14 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 3 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
          { naam: "Lienden", woningen: 2637, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand", koopwoningPercentage: 72,
            bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 15 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 14 }, { label: "1975 tot 1985", percentage: 9 }, { label: "1985 tot 1995", percentage: 15 }, { label: "1995 tot 2005", percentage: 19 }, { label: "2005 tot 2015", percentage: 9 }, { label: "2015 tot 2025", percentage: 6 }, { label: "2025 en later", percentage: 2 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
          { naam: "Beusichem", woningen: 1698, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand", koopwoningPercentage: 81,
            bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 13 }, { label: "1945 tot 1965", percentage: 11 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 10 }, { label: "2005 tot 2015", percentage: 11 }, { label: "2015 tot 2025", percentage: 9 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
          { naam: "Buren", woningen: 1540, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand", koopwoningPercentage: 75,
            bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 17 }, { label: "1945 tot 1965", percentage: 16 }, { label: "1965 tot 1975", percentage: 19 }, { label: "1975 tot 1985", percentage: 12 }, { label: "1985 tot 1995", percentage: 16 }, { label: "1995 tot 2005", percentage: 4 }, { label: "2005 tot 2015", percentage: 14 }, { label: "2015 tot 2025", percentage: 3 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
          { naam: "Zoelen", woningen: 1398, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand", koopwoningPercentage: 82,
            bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 23 }, { label: "1945 tot 1965", percentage: 10 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 13 }, { label: "1985 tot 1995", percentage: 13 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 5 }, { label: "2015 tot 2025", percentage: 12 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
          { naam: "Ingen", woningen: 807, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand", koopwoningPercentage: 73,
            bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 24 }, { label: "1945 tot 1965", percentage: 13 }, { label: "1965 tot 1975", percentage: 18 }, { label: "1975 tot 1985", percentage: 10 }, { label: "1985 tot 1995", percentage: 12 }, { label: "1995 tot 2005", percentage: 9 }, { label: "2005 tot 2015", percentage: 8 }, { label: "2015 tot 2025", percentage: 4 }, { label: "2025 en later", percentage: 1 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
          { naam: "Ravenswaaij", woningen: 255, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand", koopwoningPercentage: 86,
            bouwjaarVerdeling: [{ label: "Voor 1945", percentage: 35 }, { label: "1945 tot 1965", percentage: 12 }, { label: "1965 tot 1975", percentage: 9 }, { label: "1975 tot 1985", percentage: 6 }, { label: "1985 tot 1995", percentage: 5 }, { label: "1995 tot 2005", percentage: 6 }, { label: "2005 tot 2015", percentage: 4 }, { label: "2015 tot 2025", percentage: 22 }, { label: "2025 en later", percentage: 0 }, { label: "Bouwjaar onbekend", percentage: 0 }] },
        ],
        bron: { naam: "AlleCijfers.nl (CBS/BAG), peildatum 2025/2026", url: "https://www.allecijfers.nl/gemeente/buren/" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Buren?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Buren zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  culemborg: {
    seo: {
      title: "Verduurzamen in Culemborg | Gijs",
      description: "Wil je je woning isoleren in Culemborg? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 12.530 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Culemborg",
    h1: "Verduurzamen in Culemborg",
    intro: [
      ["Woon je in Culemborg? De historische vestingstad aan de Lek heeft een diverse woningvoorraad: van eeuwenoude panden in de beschermde binnenstad tot naoorlogse rijtjeswijken als Terweijde en recente nieuwbouw aan de stadsrand."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Culemborg verdeeld.",
      kerncijfers: [
        { waarde: "12.530", label: "woningen" },
        { waarde: "75%", label: "eengezinswoningen" },
        { waarde: "74%", label: "gebouwd vóór 2000" },
        { waarde: "63%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 41, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 33, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 26, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Culemborg",
      alineas: [
        ["Culemborg is een compacte gemeente die vrijwel samenvalt met de gelijknamige stad. De historische binnenstad stelt bijzondere eisen aan isolatie — soms zijn er monumentale beperkingen — terwijl de naoorlogse wijken bij uitstek geschikt zijn voor spouwmuurisolatie."],
        ["Bij een monumentaal of beeldbepalend pand in de binnenstad is het kozijn vaak onderdeel van het straatbeeld: daar is losse vervanging van het glas door ", { tekst: "isolatieglas", href: "/maatregelen/isolatieglas" }, " vaker haalbaar dan een heel nieuw kozijn. In nieuwere wijken zoals Terweijde is een ", { tekst: "kozijn", href: "/maatregelen/kozijnen" }, " met geïntegreerd isolatieglas, in kunststof of aluminium, meestal gewoon mogelijk. Gijs bekijkt wat in jouw situatie kan."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Culemborg",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Wijk 00", woningen: 12530, periode: "Overwegend vóór 2000", tijdvak: null, type: "tussenwoning" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Mag ik in de binnenstad van Culemborg mijn kozijnen vervangen?", answer: "Bij een monumentaal of beeldbepalend pand in de binnenstad gelden vaak extra regels voor kozijnen. Losse vervanging van het glas door isolatieglas is dan vaak wel mogelijk, zonder het kozijn zelf te vervangen. Gijs kijkt wat voor jouw pand haalbaar is en verwijst zo nodig naar de gemeente voor een vergunningscheck." },
      { question: "Welke gemeentelijke subsidies gelden in Culemborg?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Culemborg zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  doesburg: {
    seo: {
      title: "Woning isoleren in Doesburg | Gijs",
      description: "Wil je je woning isoleren in Doesburg? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 5.293 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Doesburg",
    h1: "Woning isoleren in Doesburg",
    intro: [
      ["Woon je in Doesburg? De kleine historische Hanzestad aan de samenvloeiing van IJssel en Oude IJssel heeft een woningvoorraad die voor een groot deel bestaat uit panden van vóór 1940 in de beschermde binnenstad, aangevuld met naoorlogse uitbreidingen aan de buitenrand."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Doesburg verdeeld.",
      kerncijfers: [
        { waarde: "5.293", label: "woningen" },
        { waarde: "78%", label: "eengezinswoningen" },
        { waarde: "86%", label: "gebouwd vóór 2000" },
        { waarde: "53%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 47, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 39, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 14, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Doesburg",
      alineas: [
        ["Doesburg is een van de kleinste steden van Gelderland, met een goed bewaard middeleeuws centrum en stadspoorten. Bij monumentale en historische woningen gelden soms beperkingen voor buitenisolatie; een adviseur van Gijs kijkt wat er bij jouw woning mogelijk is."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Doesburg",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Wijk 01", woningen: 5293, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Doesburg?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Doesburg zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  doetinchem: {
    seo: {
      title: "Isoleren en verduurzamen in Doetinchem | Gijs",
      description: "Wil je je woning isoleren in Doetinchem? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 26.129 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Doetinchem",
    h1: "Isoleren en verduurzamen in Doetinchem",
    intro: [
      ["Woon je in Doetinchem, ", { tekst: "Gaanderen", href: "/regio/gelderland/doetinchem/gaanderen" }, ", ", { tekst: "Wehl", href: "/regio/gelderland/doetinchem/wehl" }, " of ", { tekst: "IJzevoorde", href: "/regio/gelderland/doetinchem/ijzevoorde" }, "? Doetinchem is de grootste stad van de Achterhoek, met een diverse woningvoorraad van arbeiderswoningen in de binnenstad tot uitgebreide naoorlogse woonwijken aan de rand van de stad."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Doetinchem verdeeld.",
      kerncijfers: [
        { waarde: "26.129", label: "woningen" },
        { waarde: "75%", label: "eengezinswoningen" },
        { waarde: "83%", label: "gebouwd vóór 2000" },
        { waarde: "60%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 17, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Doetinchem",
      alineas: [
        ["De gemeente Doetinchem omvat de kernen Doetinchem, Gaanderen, Wehl en IJzevoorde. Veel woningen uit de jaren vijftig tot tachtig hebben nog geen of onvoldoende isolatie — spouwmuurisolatie en dakisolatie zijn hier doorgaans snel terugverdiend."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Doetinchem",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Wijk 06", woningen: 4481, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Wijk 02", woningen: 3517, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Wijk 07", woningen: 3374, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "vrijstaand" },
          { naam: "Wijk 09", woningen: 3033, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Wehl", woningen: 2921, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Doetinchem Centrum", woningen: 2487, periode: "Overwegend vóór 2000", tijdvak: null, type: "appartement" },
          { naam: "Buitengebied Doetinchem", woningen: 2475, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Wijk 04", woningen: 1777, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "vrijstaand" },
          { naam: "Wijk 03", woningen: 1310, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Wijk 08", woningen: 391, periode: "Overwegend na 2000", tijdvak: 2, type: "twee-onder-een-kap" },
          { naam: "Wijk 05", woningen: 363, periode: "Overwegend na 2000", tijdvak: 2, type: "appartement" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Doetinchem?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Doetinchem zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  druten: {
    seo: {
      title: "Woning verduurzamen in Druten | Gijs",
      description: "Wil je je woning isoleren in Druten? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 8.126 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Druten",
    h1: "Woning verduurzamen in Druten",
    intro: [
      ["Woon je in Druten, ", { tekst: "Puiflijk", href: "/regio/gelderland/druten/puiflijk" }, ", ", { tekst: "Afferden", href: "/regio/gelderland/druten/afferden" }, " of ", { tekst: "Deest", href: "/regio/gelderland/druten/deest" }, "? De gemeente Druten ligt in de Maas-Waalregio ten westen van Nijmegen, met een woningvoorraad die voor een groot deel bestaat uit vrijstaande en twee-onder-één-kapwoningen uit de jaren zestig en zeventig."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Druten verdeeld.",
      kerncijfers: [
        { waarde: "8.126", label: "woningen" },
        { waarde: "82%", label: "eengezinswoningen" },
        { waarde: "76%", label: "gebouwd vóór 2000" },
        { waarde: "64%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 42, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 34, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 24, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Druten",
      alineas: [
        ["Druten telt kernen als Druten, Puiflijk, Afferden en Deest in de polder tussen Maas en Waal. De polderligging en de relatief grote vrijstaande woningen maken dakisolatie en kierdichting extra waardevol."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Druten",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Druten", woningen: 5464, periode: "Overwegend vóór 2000", tijdvak: null, type: "tussenwoning" },
          { naam: "Deest", woningen: 815, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Afferden", woningen: 659, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Horssen", woningen: 652, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Puiflijk", woningen: 536, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Druten?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Druten zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  duiven: {
    seo: {
      title: "Isoleren in Duiven | Gijs",
      description: "Wil je je woning isoleren in Duiven? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 10.743 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Duiven",
    h1: "Isoleren in Duiven",
    intro: [
      ["Woon je in Duiven, ", { tekst: "Groessen", href: "/regio/gelderland/duiven/groessen" }, " of ", { tekst: "Loo", href: "/regio/gelderland/duiven/loo" }, "? Duiven is een groeigemeente in de Liemers, direct grenzend aan Arnhem, met een woningbestand dat varieert van oudere dorpswoningen in de kern tot recente nieuwbouwwijken aan de Rijnoevers."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Duiven verdeeld.",
      kerncijfers: [
        { waarde: "10.743", label: "woningen" },
        { waarde: "87%", label: "eengezinswoningen" },
        { waarde: "88%", label: "gebouwd vóór 2000" },
        { waarde: "67%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 48, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 40, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 12, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Duiven",
      alineas: [
        ["De gemeente Duiven omvat de kernen Duiven, Groessen en Loo langs de Rijn. De oudere woningdelen uit de jaren zestig en zeventig zijn goed te verduurzamen via spouwmuurisolatie; in nieuwere wijken speelt de omschakeling naar warmtepompen een grotere rol."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Duiven",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Duiven-Noord", woningen: 6181, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Duiven-Zuid", woningen: 3293, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Groessen", woningen: 779, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Loo", woningen: 438, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Duiven?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Duiven zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  ede: {
    seo: {
      title: "Je woning isoleren in Ede | Gijs",
      description: "Wil je je woning isoleren in Ede? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 49.152 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Ede",
    h1: "Je woning isoleren in Ede",
    intro: [
      ["Woon je in Ede, ", { tekst: "Bennekom", href: "/regio/gelderland/ede/bennekom" }, ", ", { tekst: "Lunteren", href: "/regio/gelderland/ede/lunteren" }, ", ", { tekst: "Otterlo", href: "/regio/gelderland/ede/otterlo" }, " of een van de andere kernen van deze grote Veluwse gemeente? Ede heeft een zeer gevarieerde woningvoorraad: van historische boerderijcomplexen tot uitgebreide naoorlogse woonwijken en recente nieuwbouwgebieden in het Food Valley-gebied."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Ede verdeeld.",
      kerncijfers: [
        { waarde: "49.152", label: "woningen" },
        { waarde: "69%", label: "eengezinswoningen" },
        { waarde: "77%", label: "gebouwd vóór 2000" },
        { waarde: "66%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 42, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 35, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 23, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Ede",
      alineas: [
        ["De gemeente Ede omvat kernen als Ede, Bennekom, Lunteren, Ederveen, Otterlo en Harskamp. De combinatie van oudere woningen in de dorpskernen en omvangrijke naoorlogse uitbreidingen — met name in de stad Ede zelf — biedt veel kansen voor spouwmuurisolatie en dakisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Ede",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Ede-West", woningen: 7035, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Bennekom", woningen: 6551, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Ede-Veldhuizen", woningen: 6079, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Ede-Oost", woningen: 5430, periode: "Overwegend vóór 2000", tijdvak: null, type: "appartement" },
          { naam: "Lunteren", woningen: 4988, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Ede-Zuid", woningen: 4873, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "twee-onder-een-kap" },
          { naam: "Rietkampen", woningen: 3168, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Maandereng", woningen: 2773, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Kernhem", woningen: 1918, periode: "Overwegend na 2000", tijdvak: 2, type: "vrijstaand" },
          { naam: "Ederveen", woningen: 1202, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Harskamp", woningen: 1178, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Otterlo", woningen: 1069, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Ede?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Ede zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  elburg: {
    seo: {
      title: "Woning verduurzamen in Elburg | Gijs",
      description: "Wil je je woning isoleren in Elburg? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 9.356 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Elburg",
    h1: "Woning verduurzamen in Elburg",
    intro: [
      ["Woon je in Elburg, ", { tekst: "'t Harde", href: "/regio/gelderland/elburg/t-harde" }, " of ", { tekst: "Doornspijk", href: "/regio/gelderland/elburg/doornspijk" }, "? De gemeente Elburg heeft een bijzondere woningmix: naast het goed bewaarde middeleeuwse stadscentrum van Elburg zijn er uitgebreide naoorlogse wijken in 't Harde en verspreide bebouwing in het Veluwse buitengebied."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Elburg verdeeld.",
      kerncijfers: [
        { waarde: "9.356", label: "woningen" },
        { waarde: "85%", label: "eengezinswoningen" },
        { waarde: "83%", label: "gebouwd vóór 2000" },
        { waarde: "65%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 17, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Elburg",
      alineas: [
        ["De gemeente Elburg omvat Elburg, 't Harde en Doornspijk. In het historische centrum van Elburg gelden soms monumentale randvoorwaarden; in de naoorlogse wijken van 't Harde zijn spouwmuurisolatie en dakisolatie vrijwel altijd goed toepasbaar."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Elburg",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Elburg", woningen: 4920, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Wijk 02", woningen: 2890, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Doornspijk", woningen: 1546, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Elburg?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Elburg zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  epe: {
    seo: {
      title: "Isoleren in Epe | Gijs",
      description: "Wil je je woning isoleren in Epe? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 14.586 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Epe",
    h1: "Isoleren in Epe",
    intro: [
      ["Woon je in Epe, ", { tekst: "Vaassen", href: "/regio/gelderland/epe/vaassen" }, ", ", { tekst: "Emst", href: "/regio/gelderland/epe/emst" }, " of ", { tekst: "Oene", href: "/regio/gelderland/epe/oene" }, "? Epe is een bosrijke Veluwse gemeente met een landelijk karakter en een woningvoorraad die voor een groot deel bestaat uit vrijstaande woningen en boerderijen. De expositie van vrijstaande woningen in de open Veluwse omgeving maakt goede isolatie extra effectief."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Epe verdeeld.",
      kerncijfers: [
        { waarde: "14.586", label: "woningen" },
        { waarde: "79%", label: "eengezinswoningen" },
        { waarde: "87%", label: "gebouwd vóór 2000" },
        { waarde: "65%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 48, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 39, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 13, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Epe",
      alineas: [
        ["Epe omvat de kernen Epe, Vaassen, Emst, Oene en Wissel, verspreid door een afwisselend landschap van bossen, heidevelden en uiterwaardengebied langs de IJssel. Dakisolatie en gevelisolatie zijn hier vanwege de vrijstaande bouw veelal de meest rendabele eerste stap."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Epe",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Epe", woningen: 7231, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Vaassen", woningen: 5523, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Emst", woningen: 1228, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Oene", woningen: 604, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Epe?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Epe zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  ermelo: {
    seo: {
      title: "Woning verduurzamen in Ermelo | Gijs",
      description: "Wil je je woning isoleren in Ermelo? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 11.156 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Ermelo",
    h1: "Woning verduurzamen in Ermelo",
    intro: [
      ["Woon je in Ermelo of Hierden? Ermelo is een bosrijke Veluwse gemeente met een bijzonder karakter: naast reguliere woonwijken heeft de gemeente veel conferentieoorden en zorginstellingen in de bossen. De woningvoorraad omvat zowel naoorlogse rijtjeswoningen als vrijstaande huizen in het buitengebied."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Ermelo verdeeld.",
      kerncijfers: [
        { waarde: "11.156", label: "woningen" },
        { waarde: "77%", label: "eengezinswoningen" },
        { waarde: "83%", label: "gebouwd vóór 2000" },
        { waarde: "63%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 17, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Ermelo",
      alineas: [
        ["De gemeente Ermelo bestaat uit de kernen Ermelo en Hierden. Spouwmuurisolatie is in de naoorlogse rijtjeswoningen de meest effectieve eerste maatregel; voor vrijstaande woningen in het buitengebied biedt dakisolatie de grootste besparing."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Ermelo",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Ermelo", woningen: 10845, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Speuld", woningen: 311, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Ermelo?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Ermelo zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  harderwijk: {
    seo: {
      title: "Isoleren en verduurzamen in Harderwijk | Gijs",
      description: "Wil je je woning isoleren in Harderwijk? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 19.942 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Harderwijk",
    h1: "Isoleren en verduurzamen in Harderwijk",
    intro: [
      ["Woon je in Harderwijk of ", { tekst: "Hierden", href: "/regio/gelderland/harderwijk/hierden" }, "? Harderwijk is een groeiende Hanzestad aan het Veluwemeer met een diverse woningvoorraad: van historische panden in het centrum tot uitgebreide naoorlogse wijken en de snel groeiende nieuwbouwwijk ", { tekst: "Drielanden", href: "/regio/gelderland/harderwijk/drielanden" }, "."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Harderwijk verdeeld.",
      kerncijfers: [
        { waarde: "19.942", label: "woningen" },
        { waarde: "69%", label: "eengezinswoningen" },
        { waarde: "73%", label: "gebouwd vóór 2000" },
        { waarde: "59%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 40, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 33, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 27, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Harderwijk",
      alineas: [
        ["Harderwijk en het aangrenzende Hierden vormen samen de gemeente Harderwijk. De naoorlogse wijken in Harderwijk hebben goede mogelijkheden voor spouwmuurisolatie; in de nieuwbouwwijk Drielanden spelen warmtepompen en zonnepanelen een centrale rol."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Harderwijk",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Drielanden", woningen: 3843, periode: "Overwegend na 2000", tijdvak: 2, type: "vrijstaand" },
          { naam: "Stadsweiden", woningen: 3420, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Tweelingstad", woningen: 2879, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Stadsdennen", woningen: 2656, periode: "Overwegend vóór 2000", tijdvak: null, type: "twee-onder-een-kap" },
          { naam: "Frankrijk", woningen: 1615, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Binnenstad", woningen: 1401, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "gemengd" },
          { naam: "Hierden", woningen: 1072, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Zeebuurt", woningen: 1002, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Friesegracht", woningen: 687, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Slingerbos", woningen: 551, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Waterfront", woningen: 317, periode: "Overwegend na 2000", tijdvak: 2, type: "tussenwoning" },
          { naam: "De Sypel", woningen: 259, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Harderwijk?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Harderwijk zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  hattem: {
    seo: {
      title: "Woning isoleren in Hattem | Gijs",
      description: "Wil je je woning isoleren in Hattem? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 5.298 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Hattem",
    h1: "Woning isoleren in Hattem",
    intro: [
      ["Woon je in Hattem? De compacte historische stad aan de IJssel heeft een woningvoorraad met een mix van oudere panden in de beschermde binnenstad en naoorlogse uitbreidingen aan de noordkant van de stad."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Hattem verdeeld.",
      kerncijfers: [
        { waarde: "5.298", label: "woningen" },
        { waarde: "83%", label: "eengezinswoningen" },
        { waarde: "87%", label: "gebouwd vóór 2000" },
        { waarde: "66%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 48, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 39, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 13, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Hattem",
      alineas: [
        ["Hattem is een compacte gemeente die vrijwel samenvalt met de gelijknamige stad. Bij historische panden in het centrum gelden soms monumentale beperkingen; in de naoorlogse wijken zijn spouwmuurisolatie en dakisolatie vrijwel altijd goed toepasbaar."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Hattem",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Hattem", woningen: 4985, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Polder Hattem en Molecaten", woningen: 313, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Hattem?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Hattem zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  heerde: {
    seo: {
      title: "Woning verduurzamen in Heerde | Gijs",
      description: "Wil je je woning isoleren in Heerde? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 7.924 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Heerde",
    h1: "Woning verduurzamen in Heerde",
    intro: [
      ["Woon je in Heerde, ", { tekst: "Wapenveld", href: "/regio/gelderland/heerde/wapenveld" }, " of ", { tekst: "Veessen", href: "/regio/gelderland/heerde/veessen" }, "? Heerde is een landelijke gemeente in de IJsselvallei tussen Apeldoorn en Hattem, met een woningvoorraad die voor een groot deel bestaat uit vrijstaande woningen en twee-onder-één-kapwoningen uit de jaren vijftig tot tachtig."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Heerde verdeeld.",
      kerncijfers: [
        { waarde: "7.924", label: "woningen" },
        { waarde: "83%", label: "eengezinswoningen" },
        { waarde: "84%", label: "gebouwd vóór 2000" },
        { waarde: "69%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 38, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 16, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Heerde",
      alineas: [
        ["De gemeente Heerde omvat de kernen Heerde, Wapenveld en Veessen, gelegen in het vruchtbare IJsseldal. De relatief veel vrijstaande woningen in het buitengebied bieden goede mogelijkheden voor dakisolatie; spouwmuurisolatie is in de woonkernen de meest voor de hand liggende stap."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Heerde",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Heerde", woningen: 5400, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Wapenveld", woningen: 2524, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Heerde?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Heerde zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  heumen: {
    seo: {
      title: "Isoleren in Heumen | Gijs",
      description: "Wil je je woning isoleren in Heumen? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 7.206 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Heumen",
    h1: "Isoleren in Heumen",
    intro: [
      ["Woon je in ", { tekst: "Malden", href: "/regio/gelderland/heumen/malden" }, ", Heumen, ", { tekst: "Overasselt", href: "/regio/gelderland/heumen/overasselt" }, " of ", { tekst: "Nederasselt", href: "/regio/gelderland/heumen/nederasselt" }, "? De gemeente Heumen ligt direct ten zuiden van Nijmegen en heeft een woningvoorraad die varieert van oudere dorpswoningen in de kleinere kernen tot de uitgebreide naoorlogse woonwijken in Malden."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Heumen verdeeld.",
      kerncijfers: [
        { waarde: "7.206", label: "woningen" },
        { waarde: "83%", label: "eengezinswoningen" },
        { waarde: "85%", label: "gebouwd vóór 2000" },
        { waarde: "71%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 47, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 38, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 15, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Heumen",
      alineas: [
        ["Heumen bestaat uit de kernen Malden, Heumen, Overasselt en Nederasselt. Malden is de grootste kern, met een groot aandeel naoorlogse rijtjeswoningen die goed te verduurzamen zijn via spouwmuurisolatie en dakisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Heumen",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Heumen", woningen: 5779, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Overasselt", woningen: 1427, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Heumen?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Heumen zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  lingewaard: {
    naamDisplay: "de gemeente Lingewaard",
    seo: {
      title: "Woning isoleren in Lingewaard | Gijs",
      description: "Wil je je woning isoleren in Lingewaard? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 19.872 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Lingewaard",
    h1: "Woning isoleren in Lingewaard",
    intro: [
      ["Woon je in ", { tekst: "Huissen", href: "/regio/gelderland/lingewaard/huissen" }, ", ", { tekst: "Bemmel", href: "/regio/gelderland/lingewaard/bemmel" }, ", ", { tekst: "Gendt", href: "/regio/gelderland/lingewaard/gendt" }, ", ", { tekst: "Angeren", href: "/regio/gelderland/lingewaard/angeren" }, " of ", { tekst: "Doornenburg", href: "/regio/gelderland/lingewaard/doornenburg" }, "? Lingewaard is een Betuwse gemeente ten noorden van Arnhem met een diverse woningvoorraad: van historische panden in Huissen tot naoorlogse rijtjeswijken in Bemmel en nieuwe woongebieden langs de Waal."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Lingewaard verdeeld.",
      kerncijfers: [
        { waarde: "19.872", label: "woningen" },
        { waarde: "83%", label: "eengezinswoningen" },
        { waarde: "78%", label: "gebouwd vóór 2000" },
        { waarde: "72%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 43, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 35, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 22, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Lingewaard",
      alineas: [
        ["De gemeente Lingewaard omvat kernen als Huissen, Bemmel, Gendt, Angeren en Doornenburg. De naoorlogse rijtjeswoningen in Bemmel en Huissen zijn bij uitstek geschikt voor spouwmuurisolatie; de oudere panden in Huissen stellen soms hogere eisen aan de aanpak."],
        ["Twijfel je tussen alleen nieuw glas of complete nieuwe kozijnen? Is het kozijn zelf nog in goede staat, dan is vervanging van het glas door ", { tekst: "isolatieglas", href: "/maatregelen/isolatieglas" }, " vaak de snelste en voordeligste stap. Is het kozijn versleten, tochtig of wil je een andere uitstraling, dan ligt een nieuw ", { tekst: "kozijn", href: "/maatregelen/kozijnen" }, " in kunststof of aluminium voor de hand. Gijs bespreekt dit tijdens de energiescan."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Lingewaard",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Huissen", woningen: 8499, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Bemmel", woningen: 8306, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Gendt", woningen: 3067, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Biedt Gijs kunststof of aluminium kozijnen in Lingewaard?", answer: "Ja. Gijs biedt zowel kunststof als aluminium kozijnen aan, en losse vervanging van het glas als het kozijn zelf nog goed is. Tijdens de gratis energiescan bekijkt Gijs wat het beste bij jouw woning in Lingewaard past." },
      { question: "Welke gemeentelijke subsidies gelden in Lingewaard?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Lingewaard zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  lochem: {
    seo: {
      title: "Verduurzamen in Lochem | Gijs",
      description: "Wil je je woning isoleren in Lochem? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 15.096 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Lochem",
    h1: "Verduurzamen in Lochem",
    intro: [
      ["Woon je in Lochem, ", { tekst: "Gorssel", href: "/regio/gelderland/lochem/gorssel" }, ", ", { tekst: "Eefde", href: "/regio/gelderland/lochem/eefde" }, ", ", { tekst: "Laren", href: "/regio/gelderland/lochem/laren" }, " of ", { tekst: "Almen", href: "/regio/gelderland/lochem/almen" }, "? Lochem is een Achterhoekse gemeente met een historisch centrum en een afwisselend landschap van bossen, beken en kampenlandschappen. De woningvoorraad varieert sterk per kern."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Lochem verdeeld.",
      kerncijfers: [
        { waarde: "15.096", label: "woningen" },
        { waarde: "84%", label: "eengezinswoningen" },
        { waarde: "83%", label: "gebouwd vóór 2000" },
        { waarde: "71%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 17, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Lochem",
      alineas: [
        ["De gemeente Lochem omvat kernen als Lochem, Gorssel, Eefde, Laren, Almen en Barchem. In de historische kern van Lochem zijn soms monumentale beperkingen voor buitenisolatie; in de omliggende dorpen zijn spouwmuurisolatie en dakisolatie veelal goed toepasbaar."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Lochem",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Lochem kern", woningen: 5752, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Gorssel", woningen: 4868, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Laren", woningen: 1822, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Almen-Harfsen", woningen: 1422, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Barchem", woningen: 744, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Lochem buitengebied", woningen: 488, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Lochem?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Lochem zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  maasdriel: {
    seo: {
      title: "Woning isoleren in Maasdriel | Gijs",
      description: "Wil je je woning isoleren in Maasdriel? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 10.115 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Maasdriel",
    h1: "Woning isoleren in Maasdriel",
    intro: [
      ["Woon je in ", { tekst: "Kerkdriel", href: "/regio/gelderland/maasdriel/kerkdriel" }, ", ", { tekst: "Hedel", href: "/regio/gelderland/maasdriel/hedel" }, ", Brakel of een andere kern van de Betuwse gemeente Maasdriel? Maasdriel ligt in de fruitstreek langs de Maas, met een woningvoorraad die voor een groot deel bestaat uit vrijstaande woningen en boerderijen, aangevuld met naoorlogse uitbreidingen in de dorpskernen."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Maasdriel verdeeld.",
      kerncijfers: [
        { waarde: "10.115", label: "woningen" },
        { waarde: "91%", label: "eengezinswoningen" },
        { waarde: "83%", label: "gebouwd vóór 2000" },
        { waarde: "71%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 17, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Maasdriel",
      alineas: [
        ["Maasdriel telt kernen als Kerkdriel, Hedel, Brakel, Alem, Well en Velddriel. De verspreide bebouwing in de fruitstreek maakt isolatie extra waardevol; vrijstaande woningen en boerderijen verliezen via dak en gevels relatief veel warmte."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Maasdriel",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Kerkdriel", woningen: 4168, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Hedel", woningen: 2060, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Ammerzoden", woningen: 1895, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Rossum", woningen: 1444, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Heerewaarden", woningen: 548, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Maasdriel?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Maasdriel zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  montferland: {
    naamDisplay: "de gemeente Montferland",
    seo: {
      title: "Woning verduurzamen in Montferland | Gijs",
      description: "Wil je je woning isoleren in Montferland? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 15.917 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Montferland",
    h1: "Woning verduurzamen in Montferland",
    intro: [
      ["Woon je in ", { tekst: "Didam", href: "/regio/gelderland/montferland/didam" }, ", ", { tekst: "'s-Heerenberg", href: "/regio/gelderland/montferland/s-heerenberg" }, ", ", { tekst: "Zeddam", href: "/regio/gelderland/montferland/zeddam" }, ", ", { tekst: "Kilder", href: "/regio/gelderland/montferland/kilder" }, " of een andere kern? Montferland is een Achterhoekse gemeente met een gevarieerd landschap — van de stuwwallen bij 's-Heerenberg tot de polderdorpen richting Zevenaar — en een bijpassende diverse woningvoorraad."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Montferland verdeeld.",
      kerncijfers: [
        { waarde: "15.917", label: "woningen" },
        { waarde: "82%", label: "eengezinswoningen" },
        { waarde: "83%", label: "gebouwd vóór 2000" },
        { waarde: "66%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 17, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Montferland",
      alineas: [
        ["Montferland omvat kernen als Didam, 's-Heerenberg, Zeddam, Kilder, Stokkum en Beek. Didam is de grootste kern met veel naoorlogse woningen; rondom kasteel Bergh in 's-Heerenberg staan historische panden waarvoor soms specifieke isolatieoplossingen nodig zijn."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Montferland",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Didam", woningen: 7442, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "'s-Heerenberg", woningen: 6734, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Brakel", woningen: 1741, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Montferland?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Montferland zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  "neder-betuwe": {
    naamDisplay: "de gemeente Neder-Betuwe",
    seo: {
      title: "Isoleren in Neder-Betuwe | Gijs",
      description: "Wil je je woning isoleren in Neder-Betuwe? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 8.867 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Neder-Betuwe",
    h1: "Isoleren in Neder-Betuwe",
    intro: [
      ["Woon je in ", { tekst: "Ochten", href: "/regio/gelderland/neder-betuwe/ochten" }, ", ", { tekst: "Kesteren", href: "/regio/gelderland/neder-betuwe/kesteren" }, ", ", { tekst: "Opheusden", href: "/regio/gelderland/neder-betuwe/opheusden" }, " of ", { tekst: "Dodewaard", href: "/regio/gelderland/neder-betuwe/dodewaard" }, "? De Betuwse gemeente Neder-Betuwe heeft een uitgesproken landelijk karakter in de fruitstreek langs de Rijn, met een woningvoorraad die voor een groot deel bestaat uit vrijstaande woningen en boerderijen."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Neder-Betuwe verdeeld.",
      kerncijfers: [
        { waarde: "8.867", label: "woningen" },
        { waarde: "91%", label: "eengezinswoningen" },
        { waarde: "81%", label: "gebouwd vóór 2000" },
        { waarde: "65%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 36, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 19, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Neder-Betuwe",
      alineas: [
        ["Neder-Betuwe omvat kernen als Ochten, Kesteren, Opheusden, Dodewaard en Echteld. De agrarische woningvoorraad — veel vrijstaande huizen en boerderijen — biedt grote mogelijkheden voor dakisolatie en gevelisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Neder-Betuwe",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Kesteren", woningen: 4405, periode: "Overwegend vóór 2000", tijdvak: null, type: "tussenwoning" },
          { naam: "Echteld", woningen: 2753, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Dodewaard", woningen: 1709, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Neder-Betuwe?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Neder-Betuwe zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  nijkerk: {
    seo: {
      title: "Woning isoleren in Nijkerk | Gijs",
      description: "Wil je je woning isoleren in Nijkerk? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 17.321 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Nijkerk",
    h1: "Woning isoleren in Nijkerk",
    intro: [
      ["Woon je in Nijkerk, ", { tekst: "Hoevelaken", href: "/regio/gelderland/nijkerk/hoevelaken" }, " of ", { tekst: "Nijkerkerveen", href: "/regio/gelderland/nijkerk/nijkerkerveen" }, "? Nijkerk is een groeigemeente aan de rand van de Veluwe en het Eemmeer, met een woningbestand dat de afgelopen decennia sterk is uitgebreid door nieuwbouw, naast de historische kern van de stad."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Nijkerk verdeeld.",
      kerncijfers: [
        { waarde: "17.321", label: "woningen" },
        { waarde: "83%", label: "eengezinswoningen" },
        { waarde: "76%", label: "gebouwd vóór 2000" },
        { waarde: "70%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 42, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 34, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 24, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Nijkerk",
      alineas: [
        ["De gemeente Nijkerk omvat Nijkerk, Hoevelaken en Nijkerkerveen. Hoevelaken heeft veel naoorlogse rijtjeswoningen die goed te verduurzamen zijn via spouwmuurisolatie; in de nieuwere wijken van Nijkerk en Corlaer speelt de omschakeling naar warmtepompen en zonnepanelen een grotere rol."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Nijkerk",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Nijkerk-stad", woningen: 11262, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Hoevelaken", woningen: 3899, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Nijkerkerveen en Holkerveen", woningen: 1459, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Appel, Driedorp, Kruishaar, Prinsenkamp", woningen: 569, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Arkemheen, Achterhoek, De Veenhuis", woningen: 132, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Nijkerk?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Nijkerk zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  nijmegen: {
    seo: {
      title: "Je woning verduurzamen in Nijmegen | Gijs",
      description: "Wil je je woning isoleren in Nijmegen? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 81.717 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Nijmegen",
    h1: "Je woning verduurzamen in Nijmegen",
    intro: [
      ["Woon je in Nijmegen, in ", { tekst: "Dukenburg", href: "/regio/gelderland/nijmegen/dukenburg" }, ", Heseveld, ", { tekst: "Bottendaal", href: "/regio/gelderland/nijmegen/bottendaal" }, ", het ", { tekst: "Waalfront", href: "/regio/gelderland/nijmegen/waalfront" }, " of een van de andere wijken? Nijmegen is de oudste stad van Nederland, met een zeer diverse woningvoorraad: van historische panden in de binnenstad tot wederopbouwwijken uit de jaren vijftig en de snelgroeiende nieuwbouwwijk ", { tekst: "Waalsprong", href: "/regio/gelderland/nijmegen/waalsprong" }, "."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Nijmegen verdeeld.",
      kerncijfers: [
        { waarde: "81.717", label: "woningen" },
        { waarde: "54%", label: "eengezinswoningen" },
        { waarde: "81%", label: "gebouwd vóór 2000" },
        { waarde: "43%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 36, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 19, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Nijmegen",
      alineas: [
        ["Nijmegen telt tientallen wijken, van de historische Benedenstad en Bottendaal tot naoorlogse woonwijken als Heseveld en Dukenburg, en de recente nieuwbouwwijk Waalsprong op de noordoever van de Waal. Oudere rijtjeswoningen in naoorlogse wijken zijn bij uitstek geschikt voor spouwmuurisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Nijmegen",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Nijmegen-Oost", woningen: 15072, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Nijmegen-Zuid", woningen: 11662, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Dukenburg", woningen: 10780, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Nijmegen-Midden", woningen: 9016, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Nijmegen-Nieuw-West", woningen: 8260, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "gemengd" },
          { naam: "Nijmegen-Oud-West", woningen: 7552, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "twee-onder-een-kap" },
          { naam: "Nijmegen-Noord", woningen: 7356, periode: "Overwegend na 2000", tijdvak: 2, type: "vrijstaand" },
          { naam: "Lindenholt", woningen: 6392, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Nijmegen-Centrum", woningen: 5627, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Nijmegen?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Nijmegen zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  nunspeet: {
    seo: {
      title: "Woning isoleren in Nunspeet | Gijs",
      description: "Wil je je woning isoleren in Nunspeet? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 10.957 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Nunspeet",
    h1: "Woning isoleren in Nunspeet",
    intro: [
      ["Woon je in Nunspeet, ", { tekst: "Hulshorst", href: "/regio/gelderland/nunspeet/hulshorst" }, ", ", { tekst: "Vierhouten", href: "/regio/gelderland/nunspeet/vierhouten" }, " of ", { tekst: "Elspeet", href: "/regio/gelderland/nunspeet/elspeet" }, "? Nunspeet is een bosrijke Veluwse gemeente met een woningvoorraad die varieert van vrijstaande huizen in de bossen tot naoorlogse rijtjeswoningen in de kern van Nunspeet."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Nunspeet verdeeld.",
      kerncijfers: [
        { waarde: "10.957", label: "woningen" },
        { waarde: "83%", label: "eengezinswoningen" },
        { waarde: "81%", label: "gebouwd vóór 2000" },
        { waarde: "65%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 36, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 19, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Nunspeet",
      alineas: [
        ["De gemeente Nunspeet omvat de kernen Nunspeet, Hulshorst, Vierhouten en Elspeet, verspreid over uitgestrekte bos- en heidegebieden. De combinatie van bosrijke omgeving en relatief veel vrijstaande woningen maakt dakisolatie en kierdichting bijzonder effectief."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Nunspeet",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Nunspeet", woningen: 9069, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Elspeet-Vierhouten", woningen: 1888, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Nunspeet?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Nunspeet zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  oldebroek: {
    seo: {
      title: "Woning verduurzamen in Oldebroek | Gijs",
      description: "Wil je je woning isoleren in Oldebroek? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 9.318 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Oldebroek",
    h1: "Woning verduurzamen in Oldebroek",
    intro: [
      ["Woon je in ", { tekst: "Wezep", href: "/regio/gelderland/oldebroek/wezep" }, ", Oldebroek, ", { tekst: "Hattemerbroek", href: "/regio/gelderland/oldebroek/hattemerbroek" }, " of ", { tekst: "'t Loo", href: "/regio/gelderland/oldebroek/t-loo" }, " Oldebroek? De gemeente Oldebroek heeft een landelijk karakter aan de rand van de Veluwe, met een woningvoorraad die voor een groot deel bestaat uit vrijstaande woningen en twee-onder-één-kapwoningen in dorpse bebouwing."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Oldebroek verdeeld.",
      kerncijfers: [
        { waarde: "9.318", label: "woningen" },
        { waarde: "85%", label: "eengezinswoningen" },
        { waarde: "80%", label: "gebouwd vóór 2000" },
        { waarde: "68%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 44, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 36, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 20, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Oldebroek",
      alineas: [
        ["Oldebroek omvat kernen als Wezep, Oldebroek, Hattemerbroek en 't Loo Oldebroek. Wezep is de grootste kern met een mix van oudere en nieuwere woningen; in het buitengebied staan veel vrijstaande huizen die goed te isoleren zijn via dak en gevels."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Oldebroek",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Wezep", woningen: 5557, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Oldebroek", woningen: 2953, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Oosterwolde", woningen: 808, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Oldebroek?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Oldebroek zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  "oost-gelre": {
    seo: {
      title: "Isoleren in Oost Gelre | Gijs",
      description: "Wil je je woning isoleren in Oost Gelre? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 12.910 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Oost Gelre",
    h1: "Isoleren in Oost Gelre",
    intro: [
      ["Woon je in ", { tekst: "Groenlo", href: "/regio/gelderland/oost-gelre/groenlo" }, ", ", { tekst: "Lichtenvoorde", href: "/regio/gelderland/oost-gelre/lichtenvoorde" }, ", ", { tekst: "Zieuwent", href: "/regio/gelderland/oost-gelre/zieuwent" }, " of ", { tekst: "Vragender", href: "/regio/gelderland/oost-gelre/vragender" }, "? Oost Gelre is een Achterhoekse gemeente met een afwisselende woningvoorraad: van historische panden in de beschermde stad Groenlo tot vrijstaande boerderijen en woningen in het agrarische buitengebied."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Oost Gelre verdeeld.",
      kerncijfers: [
        { waarde: "12.910", label: "woningen" },
        { waarde: "84%", label: "eengezinswoningen" },
        { waarde: "87%", label: "gebouwd vóór 2000" },
        { waarde: "74%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 48, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 39, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 13, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Oost Gelre",
      alineas: [
        ["Oost Gelre omvat kernen als Groenlo, Lichtenvoorde, Zieuwent, Vragender en Harreveld. Groenlo heeft een historisch stadsgezicht met een grachtenring; in de omliggende dorpen en het agrarische buitengebied zijn spouwmuurisolatie en dakisolatie veelal goed toepasbaar."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Oost Gelre",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Lichtenvoorde", woningen: 5716, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Groenlo", woningen: 4561, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Zieuwewnt", woningen: 816, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Lievelde", woningen: 542, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Harreveld", woningen: 515, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Vragender", woningen: 408, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Marienvelde", woningen: 352, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Oost Gelre?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Oost Gelre zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  "oude-ijsselstreek": {
    seo: {
      title: "Woning isoleren in Oude IJsselstreek | Gijs",
      description: "Wil je je woning isoleren in Oude IJsselstreek? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 17.401 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Oude IJsselstreek",
    h1: "Woning isoleren in Oude IJsselstreek",
    intro: [
      ["Woon je in ", { tekst: "Terborg", href: "/regio/gelderland/oude-ijsselstreek/terborg" }, ", ", { tekst: "Ulft", href: "/regio/gelderland/oude-ijsselstreek/ulft" }, ", ", { tekst: "Gendringen", href: "/regio/gelderland/oude-ijsselstreek/gendringen" }, ", ", { tekst: "Varsseveld", href: "/regio/gelderland/oude-ijsselstreek/varsseveld" }, " of ", { tekst: "Silvolde", href: "/regio/gelderland/oude-ijsselstreek/silvolde" }, "? De Achterhoekse gemeente Oude IJsselstreek strekt zich uit langs de Oude IJssel, met een woningvoorraad die varieert van historische arbeiderswoningen tot vrijstaande huizen en boerderijen in het buitengebied."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Oude IJsselstreek verdeeld.",
      kerncijfers: [
        { waarde: "17.401", label: "woningen" },
        { waarde: "85%", label: "eengezinswoningen" },
        { waarde: "89%", label: "gebouwd vóór 2000" },
        { waarde: "66%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 49, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 40, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 11, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Oude IJsselstreek",
      alineas: [
        ["Oude IJsselstreek omvat kernen als Terborg, Ulft, Gendringen, Varsseveld en Silvolde. De aanwezigheid van veel oudere woningen — een groot deel gebouwd vóór 1975 — biedt grote mogelijkheden voor spouwmuurisolatie en dakisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Oude IJsselstreek",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Ulft-Etten", woningen: 5784, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Silvolde-Terborg", woningen: 4679, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Varsseveld", woningen: 3960, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Overig Gendringen", woningen: 2978, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Oude IJsselstreek?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Oude IJsselstreek zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  overbetuwe: {
    naamDisplay: "de gemeente Overbetuwe",
    seo: {
      title: "Isoleren in Overbetuwe | Gijs",
      description: "Wil je je woning isoleren in Overbetuwe? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 19.947 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Overbetuwe",
    h1: "Isoleren in Overbetuwe",
    intro: [
      ["Woon je in ", { tekst: "Elst", href: "/regio/gelderland/overbetuwe/elst" }, ", ", { tekst: "Driel", href: "/regio/gelderland/overbetuwe/driel" }, ", ", { tekst: "Herveld", href: "/regio/gelderland/overbetuwe/herveld" }, ", ", { tekst: "Heteren", href: "/regio/gelderland/overbetuwe/heteren" }, " of een van de andere kernen van de Betuwse gemeente Overbetuwe? Overbetuwe is een groeigemeente tussen Arnhem en Nijmegen, met een diverse woningvoorraad van naoorlogse rijtjeswoningen in Elst tot vrijstaande huizen in het buitengebied."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Overbetuwe verdeeld.",
      kerncijfers: [
        { waarde: "19.947", label: "woningen" },
        { waarde: "87%", label: "eengezinswoningen" },
        { waarde: "74%", label: "gebouwd vóór 2000" },
        { waarde: "68%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 41, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 33, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 26, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Overbetuwe",
      alineas: [
        ["De gemeente Overbetuwe omvat tientallen kernen, van de grote woonkern Elst tot kleinere dorpen als Driel, Valburg, Andelst en Oosterhout. Elst heeft veel naoorlogse rijtjeswoningen die bij uitstek geschikt zijn voor spouwmuurisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Overbetuwe",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Elst-Zuid", woningen: 3092, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Elst-Noord", woningen: 2769, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Westeraam", woningen: 2413, periode: "Overwegend na 2000", tijdvak: 2, type: "vrijstaand" },
          { naam: "Kern Zetten", woningen: 2002, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Kern Heteren", woningen: 1938, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Driel", woningen: 1729, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Herveld", woningen: 1305, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Oosterhout", woningen: 1122, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Valburg", woningen: 800, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Andelst", woningen: 675, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Elst-Oost", woningen: 661, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Randwijk", woningen: 538, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Overbetuwe?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Overbetuwe zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  putten: {
    seo: {
      title: "Woning verduurzamen in Putten | Gijs",
      description: "Wil je je woning isoleren in Putten? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 9.727 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Putten",
    h1: "Woning verduurzamen in Putten",
    intro: [
      ["Woon je in Putten? De Veluwse gemeente heeft een compacte kern met naoorlogse uitbreidingen en een bosrijke omgeving. De woningvoorraad bestaat voor een groot deel uit vrijstaande woningen en twee-onder-één-kapwoningen uit de jaren vijftig tot tachtig."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Putten verdeeld.",
      kerncijfers: [
        { waarde: "9.727", label: "woningen" },
        { waarde: "86%", label: "eengezinswoningen" },
        { waarde: "77%", label: "gebouwd vóór 2000" },
        { waarde: "67%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 42, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 35, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 23, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Putten",
      alineas: [
        ["Putten is een compacte gemeente die vrijwel samenvalt met de kern Putten. De combinatie van oudere vrijstaande woningen en de bosrijke Veluwse ligging maakt dakisolatie en kierdichting extra waardevol voor het terugdringen van warmteverlies en energiekosten."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Putten",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Putten", woningen: 8989, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Bosgebied en Krachtighuizen", woningen: 738, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Putten?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Putten zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  renkum: {
    seo: {
      title: "Woning isoleren in Renkum | Gijs",
      description: "Wil je je woning isoleren in Renkum? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 14.985 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Renkum",
    h1: "Woning isoleren in Renkum",
    intro: [
      ["Woon je in Renkum, ", { tekst: "Oosterbeek", href: "/regio/gelderland/renkum/oosterbeek" }, ", ", { tekst: "Doorwerth", href: "/regio/gelderland/renkum/doorwerth" }, " of ", { tekst: "Heveadorp", href: "/regio/gelderland/renkum/heveadorp" }, "? De gemeente Renkum ligt direct ten westen van Arnhem, met een gevarieerde woningvoorraad: van historische villa's en bungalows in de bossen bij Oosterbeek tot naoorlogse rijtjeswoningen in Renkum en ", { tekst: "Wolfheze", href: "/regio/gelderland/renkum/wolfheze" }, "."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Renkum verdeeld.",
      kerncijfers: [
        { waarde: "14.985", label: "woningen" },
        { waarde: "69%", label: "eengezinswoningen" },
        { waarde: "90%", label: "gebouwd vóór 2000" },
        { waarde: "63%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 50, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 40, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 10, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Renkum",
      alineas: [
        ["Renkum omvat kernen als Oosterbeek, Renkum, Doorwerth, Heveadorp en Wolfheze. In de bosrijke omgeving van de Veluwezoom staan relatief veel vrijstaande woningen; spouwmuurisolatie en dakisolatie zijn hier de meest effectieve eerste stap."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Renkum",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Renkum Zuid", woningen: 2576, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Oosterbeek Noordoost", woningen: 2468, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Oosterbeek Zuidoost", woningen: 2463, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Bebouwde kom Doorwerth", woningen: 2406, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Heelsum ten westen van de rijksweg", woningen: 1701, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Renkum Noord", woningen: 1425, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Wolfheze ten noorden van het spoor", woningen: 453, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Oosterbeek West", woningen: 453, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Wolfheze ten zuiden van het spoor", woningen: 334, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Buitengebied Doorwerth", woningen: 324, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Heveadorp", woningen: 324, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Renkum?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Renkum zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  rheden: {
    seo: {
      title: "Verduurzamen in Rheden | Gijs",
      description: "Wil je je woning isoleren in Rheden? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 21.212 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Rheden",
    h1: "Verduurzamen in Rheden",
    intro: [
      ["Woon je in ", { tekst: "Dieren", href: "/regio/gelderland/rheden/dieren" }, ", ", { tekst: "Velp", href: "/regio/gelderland/rheden/velp" }, ", ", { tekst: "De Steeg", href: "/regio/gelderland/rheden/de-steeg" }, ", ", { tekst: "Laag-Soeren", href: "/regio/gelderland/rheden/laag-soeren" }, " of Rheden? De gemeente Rheden heeft een diverse woningvoorraad: van vrijstaande villa's in de bosrijke buitengebieden bij De Steeg tot naoorlogse arbeiderswoningen in Dieren en Velp."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Rheden verdeeld.",
      kerncijfers: [
        { waarde: "21.212", label: "woningen" },
        { waarde: "74%", label: "eengezinswoningen" },
        { waarde: "92%", label: "gebouwd vóór 2000" },
        { waarde: "55%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 51, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 41, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 8, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Rheden",
      alineas: [
        ["Rheden omvat kernen als Dieren, Velp, De Steeg, Laag-Soeren en Rheden, gelegen in het Veluwezoom-gebied. De industriële geschiedenis van Dieren heeft geleid tot een flink aandeel oudere arbeiderswoningen die goed te verduurzamen zijn via spouwmuurisolatie en dakisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Rheden",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Velp", woningen: 9024, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Dieren", woningen: 7966, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Rheden", woningen: 4222, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Rheden?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Rheden zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  rozendaal: {
    seo: {
      title: "Woning isoleren in Rozendaal | Gijs",
      description: "Wil je je woning isoleren in Rozendaal? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 688 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Rozendaal",
    h1: "Woning isoleren in Rozendaal",
    intro: [
      ["Woon je in Rozendaal? Rozendaal is de kleinste gemeente van Nederland naar inwoneraantal. De woningvoorraad bestaat hoofdzakelijk uit vrijstaande villa's en herenhuizen in een uniek landgoederenlandschap, met kasteel Rosendael als historisch middelpunt."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Rozendaal verdeeld.",
      kerncijfers: [
        { waarde: "688", label: "woningen" },
        { waarde: "98%", label: "eengezinswoningen" },
        { waarde: "89%", label: "gebouwd vóór 2000" },
        { waarde: "88%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 49, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 40, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 11, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Rozendaal",
      alineas: [
        ["Rozendaal is een zeer compacte gemeente die samenvalt met de kern Rozendaal, gelegen in het landgoederengebied ten noorden van Arnhem. De hoofdzakelijk vrijstaande woningvoorraad en de bosrijke omgeving maken dakisolatie en kierdichting hier bijzonder effectief."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Rozendaal",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Wijk 00", woningen: 688, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Rozendaal?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Rozendaal zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  scherpenzeel: {
    seo: {
      title: "Woning verduurzamen in Scherpenzeel | Gijs",
      description: "Wil je je woning isoleren in Scherpenzeel? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 4.002 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Scherpenzeel",
    h1: "Woning verduurzamen in Scherpenzeel",
    intro: [
      ["Woon je in Scherpenzeel? De kleine gemeente in de Gelderse Vallei heeft een compacte woningvoorraad die voor een groot deel bestaat uit naoorlogse rijtjeswoningen en twee-onder-één-kapwoningen, gebouwd in de jaren zeventig en tachtig."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Scherpenzeel verdeeld.",
      kerncijfers: [
        { waarde: "4.002", label: "woningen" },
        { waarde: "84%", label: "eengezinswoningen" },
        { waarde: "79%", label: "gebouwd vóór 2000" },
        { waarde: "72%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 43, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 36, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 21, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Scherpenzeel",
      alineas: [
        ["Scherpenzeel is een compacte gemeente die vrijwel samenvalt met de kern Scherpenzeel, gelegen tussen de Veluwe en de Utrechtse Heuvelrug. De relatief homogene naoorlogse woningvoorraad maakt spouwmuurisolatie hier één van de meest voor de hand liggende maatregelen."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Scherpenzeel",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Wijk 00", woningen: 4002, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Scherpenzeel?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Scherpenzeel zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  tiel: {
    seo: {
      title: "Isoleren en verduurzamen in Tiel | Gijs",
      description: "Wil je je woning isoleren in Tiel? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 18.080 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Tiel",
    h1: "Isoleren en verduurzamen in Tiel",
    intro: [
      ["Woon je in Tiel, ", { tekst: "Drumpt", href: "/regio/gelderland/tiel/drumpt" }, ", ", { tekst: "Zennewijnen", href: "/regio/gelderland/tiel/zennewijnen" }, " of ", { tekst: "Wadenoijen", href: "/regio/gelderland/tiel/wadenoijen" }, "? Tiel is het regionale centrum van de Betuwe, met een gevarieerde woningvoorraad: van historische panden in de binnenstad tot uitgebreide naoorlogse woonwijken als de Buurt en ", { tekst: "Medel", href: "/regio/gelderland/tiel/medel" }, "."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Tiel verdeeld.",
      kerncijfers: [
        { waarde: "18.080", label: "woningen" },
        { waarde: "74%", label: "eengezinswoningen" },
        { waarde: "86%", label: "gebouwd vóór 2000" },
        { waarde: "57%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 47, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 39, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 14, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Tiel",
      alineas: [
        ["De gemeente Tiel omvat de stad Tiel en de omliggende dorpen Drumpt, Zennewijnen en Wadenoijen langs de Waal. De naoorlogse woonwijken in Tiel hebben een groot aandeel rijtjeswoningen die goed te verduurzamen zijn; voor monumentale panden in de binnenstad gelden soms aanvullende eisen."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Tiel",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Tiel kern", woningen: 9308, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Tiel-Noord", woningen: 4445, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Tiel-Zuid", woningen: 3589, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "vrijstaand" },
          { naam: "Wadenoijen en Kapel Avezaath", woningen: 738, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Tiel?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Tiel zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  voorst: {
    seo: {
      title: "Woning isoleren in Voorst | Gijs",
      description: "Wil je je woning isoleren in Voorst? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 10.641 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Voorst",
    h1: "Woning isoleren in Voorst",
    intro: [
      ["Woon je in ", { tekst: "Twello", href: "/regio/gelderland/voorst/twello" }, ", Voorst, ", { tekst: "Wilp", href: "/regio/gelderland/voorst/wilp" }, " of ", { tekst: "Terwolde", href: "/regio/gelderland/voorst/terwolde" }, "? De gemeente Voorst is een landelijke gemeente in de IJsselvallei tussen Apeldoorn en Zutphen, met een woningbestand dat bestaat uit een mix van historische dorpswoningen en nieuwere vrijstaande huizen in het buitengebied."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Voorst verdeeld.",
      kerncijfers: [
        { waarde: "10.641", label: "woningen" },
        { waarde: "83%", label: "eengezinswoningen" },
        { waarde: "82%", label: "gebouwd vóór 2000" },
        { waarde: "66%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 18, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Voorst",
      alineas: [
        ["Voorst omvat kernen als Twello, Voorst, Wilp, Terwolde en De Vecht. Twello is de grootste kern met relatief veel naoorlogse woningen; in het ruime buitengebied staan veel vrijstaande huizen die via dakisolatie en gevelisolatie goed te verduurzamen zijn."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Voorst",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Twello-Nijbroek", woningen: 7469, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Klarenbeek-Teuge", woningen: 1309, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Voorst", woningen: 1188, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Wilp", woningen: 675, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Voorst?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Voorst zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  wageningen: {
    seo: {
      title: "Woning verduurzamen in Wageningen | Gijs",
      description: "Wil je je woning isoleren in Wageningen? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 17.721 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Wageningen",
    h1: "Woning verduurzamen in Wageningen",
    intro: [
      ["Woon je in Wageningen? De universiteitsstad in de Gelderse Vallei, bekend als centrum van het Food Valley, heeft een diverse woningvoorraad: van historische panden in het centrum tot naoorlogse rijtjeswijken en studentenwoningen op en rondom de Wageningse Berg."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Wageningen verdeeld.",
      kerncijfers: [
        { waarde: "17.721", label: "woningen" },
        { waarde: "48%", label: "eengezinswoningen" },
        { waarde: "77%", label: "gebouwd vóór 2000" },
        { waarde: "43%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 42, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 35, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 23, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Wageningen",
      alineas: [
        ["Wageningen valt grotendeels samen met de gelijknamige stad aan de Rijn. De aanwezigheid van Wageningen University maakt de gemeente uniek: naast gezinswoningen zijn er veel studentenpanden. Oudere rijtjeswoningen in naoorlogse wijken zijn bij uitstek geschikt voor spouwmuurisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Wageningen",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "De Buurt", woningen: 3698, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Boven- en Benedenbuurt", woningen: 2446, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "twee-onder-een-kap" },
          { naam: "Noordwest", woningen: 1772, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Kortenoord", woningen: 1698, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "appartement" },
          { naam: "Centrum", woningen: 1500, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "Nude", woningen: 1353, periode: "Overwegend vóór 2000", tijdvak: 0, type: "appartement" },
          { naam: "De Weiden en Boomgaarden", woningen: 1235, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "twee-onder-een-kap" },
          { naam: "Veluvia-Hamelakkers", woningen: 1207, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Wageningen Universiteit", woningen: 903, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "appartement" },
          { naam: "De Horsten", woningen: 877, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Buitengebied", woningen: 519, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Wageningen-Hoog", woningen: 513, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Wageningen?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Wageningen zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  "west-betuwe": {
    naamDisplay: "de gemeente West Betuwe",
    seo: {
      title: "Isoleren in West Betuwe | Gijs",
      description: "Wil je je woning isoleren in West Betuwe? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 20.875 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente West Betuwe",
    h1: "Isoleren in West Betuwe",
    intro: [
      ["Woon je in ", { tekst: "Geldermalsen", href: "/regio/gelderland/west-betuwe/geldermalsen" }, ", ", { tekst: "Beesd", href: "/regio/gelderland/west-betuwe/beesd" }, ", Leerdam, ", { tekst: "Asperen", href: "/regio/gelderland/west-betuwe/asperen" }, " of een andere kern? West Betuwe is een uitgestrekte Betuwse gemeente in de fruitstreek, met een diverse woningvoorraad van historische dorpskernen tot vrijstaande woningen en boerderijen in het open poldergebied."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van West Betuwe verdeeld.",
      kerncijfers: [
        { waarde: "20.875", label: "woningen" },
        { waarde: "90%", label: "eengezinswoningen" },
        { waarde: "82%", label: "gebouwd vóór 2000" },
        { waarde: "72%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 18, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente West Betuwe",
      alineas: [
        ["West Betuwe omvat kernen als Geldermalsen, Beesd, Leerdam, Asperen, Heukelum, Acquoy en Enspijk. De uitgestrekte gemeente heeft een gevarieerde woningvoorraad; de oudere vrijstaande woningen in het buitengebied bieden grote mogelijkheden voor dakisolatie en gevelisolatie."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in West Betuwe",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Geldermalsen", woningen: 4615, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Beesd", woningen: 2065, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Haaften", woningen: 1992, periode: "Overwegend vóór 2000", tijdvak: null, type: "tussenwoning" },
          { naam: "Meteren", woningen: 1712, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "vrijstaand" },
          { naam: "Waardenburg en Opijnen", woningen: 1704, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Deil", woningen: 1560, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Heukelum", woningen: 1346, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Varik en Ophemert", woningen: 1343, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Buurmalsen", woningen: 1242, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Asperen", woningen: 1238, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Herwijnen", woningen: 1150, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Vuren", woningen: 908, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in West Betuwe?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente West Betuwe zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  "west-maas-en-waal": {
    seo: {
      title: "Woning verduurzamen in West Maas en Waal | Gijs",
      description: "Wil je je woning isoleren in West Maas en Waal? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 8.222 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente West Maas en Waal",
    h1: "Woning verduurzamen in West Maas en Waal",
    intro: [
      ["Woon je in ", { tekst: "Beneden-Leeuwen", href: "/regio/gelderland/west-maas-en-waal/beneden-leeuwen" }, ", ", { tekst: "Boven-Leeuwen", href: "/regio/gelderland/west-maas-en-waal/boven-leeuwen" }, ", ", { tekst: "Dreumel", href: "/regio/gelderland/west-maas-en-waal/dreumel" }, " of ", { tekst: "Alphen", href: "/regio/gelderland/west-maas-en-waal/alphen" }, "? West Maas en Waal is een landelijke gemeente in het poldergebied tussen de Maas en de Waal, met een woningbestand dat voor een groot deel bestaat uit vrijstaande woningen en oudere boerderijcomplexen."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van West Maas en Waal verdeeld.",
      kerncijfers: [
        { waarde: "8.222", label: "woningen" },
        { waarde: "86%", label: "eengezinswoningen" },
        { waarde: "82%", label: "gebouwd vóór 2000" },
        { waarde: "71%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 18, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente West Maas en Waal",
      alineas: [
        ["West Maas en Waal omvat kernen als Beneden-Leeuwen, Boven-Leeuwen, Dreumel, Alphen en Wamel in de Maas-Waalpolders. De verspreide vrijstaande bebouwing maakt goede dakisolatie en gevelisolatie extra effectief — vrijstaande huizen verliezen relatief meer warmte dan rijtjeswoningen."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in West Maas en Waal",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Beneden-Leeuwen", woningen: 2991, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Dreumel", woningen: 1530, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Wamel", woningen: 1034, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Boven-Leeuwen", woningen: 906, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Alphen", woningen: 697, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Maasbommel", woningen: 501, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Appeltern", woningen: 344, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Altforst", woningen: 219, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in West Maas en Waal?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente West Maas en Waal zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  westervoort: {
    seo: {
      title: "Woning isoleren in Westervoort | Gijs",
      description: "Wil je je woning isoleren in Westervoort? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 6.723 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Westervoort",
    h1: "Woning isoleren in Westervoort",
    intro: [
      ["Woon je in Westervoort? De compacte gemeente aan de IJssel, direct grenzend aan Arnhem, heeft een woningbestand dat voor een groot deel bestaat uit naoorlogse arbeiderswoningen en rijtjeswoningen — woningtypes die goed te verduurzamen zijn."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Westervoort verdeeld.",
      kerncijfers: [
        { waarde: "6.723", label: "woningen" },
        { waarde: "87%", label: "eengezinswoningen" },
        { waarde: "90%", label: "gebouwd vóór 2000" },
        { waarde: "59%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 50, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 40, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 10, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Westervoort",
      alineas: [
        ["Westervoort is een compacte gemeente die vrijwel samenvalt met de kern Westervoort. De relatief hoge woningdichtheid en de naoorlogse rijtjeswoningen langs de IJssel maken spouwmuurisolatie hier een van de meest effectieve maatregelen."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Westervoort",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Wijk 00", woningen: 6723, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Westervoort?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Westervoort zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  wijchen: {
    seo: {
      title: "Isoleren en verduurzamen in Wijchen | Gijs",
      description: "Wil je je woning isoleren in Wijchen? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 18.023 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Wijchen",
    h1: "Isoleren en verduurzamen in Wijchen",
    intro: [
      ["Woon je in Wijchen, ", { tekst: "Niftrik", href: "/regio/gelderland/wijchen/niftrik" }, ", ", { tekst: "Leur", href: "/regio/gelderland/wijchen/leur" }, ", ", { tekst: "Batenburg", href: "/regio/gelderland/wijchen/batenburg" }, " of ", { tekst: "Bergharen", href: "/regio/gelderland/wijchen/bergharen" }, "? Wijchen is een groeigemeente ten westen van Nijmegen, met een diverse woningvoorraad: van oudere woningen rondom het historische kasteel tot uitgebreide naoorlogse wijken en recente nieuwbouwgebieden."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Wijchen verdeeld.",
      kerncijfers: [
        { waarde: "18.023", label: "woningen" },
        { waarde: "82%", label: "eengezinswoningen" },
        { waarde: "82%", label: "gebouwd vóór 2000" },
        { waarde: "67%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 45, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 37, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 18, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Wijchen",
      alineas: [
        ["De gemeente Wijchen omvat kernen als Wijchen, Niftrik, Leur, Batenburg en Bergharen. De naoorlogse woonwijken van Wijchen zijn bij uitstek geschikt voor spouwmuurisolatie; in de omliggende dorpen staan meer vrijstaande woningen waarbij dakisolatie de grootste besparing oplevert."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Wijchen",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Wijchen kern", woningen: 14887, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Alverna", woningen: 1182, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Bergharen", woningen: 712, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Hernen", woningen: 387, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Batenburg", woningen: 276, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Balgoij", woningen: 268, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Niftrik", woningen: 160, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Wijchen?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Wijchen zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
  winterswijk: {
    lokaalProfiel: {
      hero: {
        foto: WINTERSWIJK_FOTOS.hero,
        intro: "Van een woning in het dorp tot een karakteristieke boerderij in het buitengebied: elke woning vraagt om een eigen aanpak. Ontdek welke maatregelen bij jouw huis passen en hoe Gijs je daarbij helpt.",
        layout: "portret",
      },
      inzichten: {
        h2: "Je woning verduurzamen met behoud van haar karakter",
        alineas: [
          "Winterswijk heeft veel woningen met een eigen verhaal: een dorpswoning met oude details, een boerderij met een grote kap of een scholtenboerderij in het buitengebied. Juist daar wil je comfort winnen zonder te verliezen wat het huis bijzonder maakt.",
          "Dat kan, maar het vraagt om een aanpak per woning. Welke isolatie past, hangt af van de constructie, de staat van de woning en wat er al is gedaan. Gijs kijkt eerst naar jouw eigen huis, adviseert onafhankelijk en begeleidt daarna de uitvoering van begin tot eind.",
        ],
        cijfers: [
          { waarde: "28%", label: "gebouwd vóór 1945" },
          { waarde: "37%", label: "vrijstaand of twee-onder-een-kap" },
          { waarde: "70%", label: "koopwoningen" },
        ],
        bouwjaarLead: "57% van de woningen is gebouwd vóór 1975, dus voordat isoleren gebruikelijk werd.",
        bouwperiodes: [
          { label: "Vóór 1945", percentage: 28, tekst: "Oudere dorpswoningen en boerderijen. Gebouwd zonder isolatie, dus vaak veel winst, met aandacht voor het karakter." },
          { label: "1945 – 1975", percentage: 29, tekst: "Naoorlogse woningen. Meestal met een spouwmuur, maar die is vaak nog leeg." },
          { label: "1975 – 1995", percentage: 22, tekst: "Deels geïsoleerd bij de bouw, maar dunner dan nu gebruikelijk. Bijisoleren loont vaak." },
          { label: "Na 1995", percentage: 20, tekst: "Al redelijk tot goed geïsoleerd. De volgende stap is vaker glas, zonnepanelen of een warmtepomp." },
        ],
        bronnen: [
          { naam: "CBS en BAG via AlleCijfers.nl (woningvoorraad, eigendom, bouwjaren)", url: "https://allecijfers.nl/gemeente/winterswijk/", peildatum: "2026" },
          { naam: "Kadaster-woningtypering via AlleCijfers.nl (woningtypen)", url: "https://allecijfers.nl/gemeente/winterswijk/", peildatum: "1 juli 2026" },
        ],
        bronNoot: "De gemeente telt 13.515 woningen, verdeeld over de wijken Stad (10.951) en Land (2.564). Het percentage woningtypen komt uit de Kadaster-woningtypering, die 14.025 adressen met een woonfunctie telt. Daardoor sluiten de percentages en de aantallen niet precies op elkaar aan.",
        gebieden: [
          {
            titel: "In het dorp",
            cijfer: { waarde: "10.951", label: "woningen in wijk Stad" },
            tekst: "Rond het centrum staan oudere dorpswoningen, daarbuiten naoorlogse wijken met rij- en hoekwoningen. Een deel van het dorp is een gemeentelijk beschermd dorpsgezicht.",
            aandachtspunten: [
              { tekst: "Spouwmuurisolatie bij woningen met een lege spouw", href: "/maatregelen/spouwmuurisolatie" },
              { tekst: "Vloerisolatie bij rij- en hoekwoningen", href: "/maatregelen/vloerisolatie" },
              { tekst: "In het beschermd dorpsgezicht kan voor zichtbare aanpassingen een vergunning nodig zijn" },
            ],
          },
          {
            titel: "In het buitengebied",
            cijfer: { waarde: "2.564", label: "woningen in wijk Land" },
            tekst: "In de buurtschappen rond het dorp staan veel vrijstaande woningen en boerderijen, waaronder karakteristieke scholtenboerderijen. Grote daken en oudere constructies vragen om maatwerk.",
            aandachtspunten: [
              { tekst: "Dakisolatie bij grote dakvlakken", href: "/maatregelen/dakisolatie" },
              { tekst: "Isoleren met behoud van oude constructies en details" },
              { tekst: "Ruimte voor zonnepanelen, afhankelijk van de woning", href: "/maatregelen/zonnepanelen" },
            ],
          },
        ],
        kaarten: [
          {
            titel: "Welke isolatie past bij mijn gevel?",
            tekst: "Oudere woningen hebben lang niet altijd een spouw, en als die er is, is hij soms smal of al gevuld. Welke gevelisolatie past, hangt af van de constructie en van hoe de muur met vocht omgaat. Daarom kijkt Gijs eerst wat er zit.",
            links: [{ tekst: "Bekijk spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }],
          },
          {
            titel: "Meer comfort zonder grote verbouwing?",
            tekst: "Isolatieglas in de bestaande kozijnen en isolatie onder de vloer zijn meestal in een paar dagen gedaan. Je merkt het direct aan minder tocht en koude voeten, en de uitstraling van de woning blijft zoals hij is.",
            links: [
              { tekst: "Isolatieglas", href: "/maatregelen/isolatieglas" },
              { tekst: "Vloerisolatie", href: "/maatregelen/vloerisolatie" },
            ],
          },
        ],
        adviseur: {
          h3: "Thom kijkt graag met je mee",
          tekst: [
            "Wil je jouw woning in Winterswijk beter isoleren, maar weet je niet welke oplossing bij de bestaande bouw past? Thom komt langs voor een ",
            { nadruk: "gratis en vrijblijvende energiescan ter waarde van €349" },
            " en bekijkt de constructie, eerdere verbeteringen en jouw wensen. Gijs helpt je met passend advies en begeleidt de uitvoering, zodat je het traject niet zelf hoeft te organiseren.",
          ],
        },
        vergunning: {
          tekst: "Woon je in een monument of in het beschermd dorpsgezicht? Dan kan voor zichtbare aanpassingen een omgevingsvergunning nodig zijn. Controleer dit altijd bij de gemeente Winterswijk.",
          bron: { naam: "Erfgoedverordening Winterswijk 2019", url: "https://lokaleregelgeving.overheid.nl/CVDR635393" },
        },
      },
      buurtschappen: {
        h2: "Woon je in een van de buurtschappen?",
        lead: "Rond het dorp liggen negen buurtschappen, waarvan kerkdorp Meddo de grootste is. Voor elk buurtschap is er een eigen pagina.",
        bron: { naam: "ANWB, Buurtschappenroute Winterswijk", url: "https://www.anwb.nl/fietsroutes/routes/buurtschappenroute-noord" },
      },
      afsluiting: {
        tekst: "Benieuwd wat er bij jouw woning in Winterswijk past? Thom komt vrijblijvend langs, kijkt mee en zet de stappen op een rij.",
      },
    },
    seo: {
      title: "Woning verduurzamen in Winterswijk | Gijs",
      description: "Wil je je woning isoleren in Winterswijk? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 13.515 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Winterswijk",
    h1: "Verduurzamen in Winterswijk, met oog voor jouw woning",
    intro: [
      ["Woon je in het dorp Winterswijk of in een van de buurtschappen eromheen? Winterswijk is een Achterhoekse gemeente aan de Duitse grens, met een kleinschalig landschap en veel oudere woningen en boerderijen."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Winterswijk verdeeld.",
      kerncijfers: [
        { waarde: "13.515", label: "woningen" },
        { waarde: "70%", label: "koopwoningen" },
        { waarde: "28%", label: "gebouwd vóór 1945" },
        { waarde: "57%", label: "gebouwd vóór 1975" },
      ],
      bouwperiodes: [
        { label: "Vóór 1945", percentage: 28, tekst: "Oudere dorpswoningen en boerderijen. Gebouwd zonder isolatie, dus vaak veel winst, met aandacht voor het karakter." },
        { label: "1945 – 1975", percentage: 29, tekst: "Naoorlogse woningen. Meestal met een spouwmuur, maar die is vaak nog leeg." },
        { label: "1975 – 1995", percentage: 22, tekst: "Deels geïsoleerd bij de bouw, maar dunner dan nu gebruikelijk. Bijisoleren loont vaak." },
        { label: "Na 1995", percentage: 20, tekst: "Al redelijk tot goed geïsoleerd. De volgende stap is vaker glas, zonnepanelen of een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis. Aantal woningen en koopwoningen: CBS, 2025. Bouwjaren: Kadaster, 2026.",
      bron: { naam: "AlleCijfers.nl, gemeente Winterswijk", url: "https://allecijfers.nl/gemeente/winterswijk/" },
    },
    lokaal: {
      titel: "Het dorp en de buurtschappen",
      alineas: [
        ["De gemeente bestaat uit het dorp Winterswijk en negen buurtschappen eromheen, zoals Meddo, Kotten, Woold en Corle. De oudere vrijstaande woningen en boerderijen in het buitengebied bieden vaak veel mogelijkheden voor dakisolatie en vloerisolatie."],
      ],
      kernTekst: {},
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Winterswijk?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Winterswijk zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [
      { naam: "Woning verduurzamen in Aalten", href: "/regio/gelderland/aalten" },
      { naam: "Woning verduurzamen in Oost Gelre", href: "/regio/gelderland/oost-gelre" },
    ],
  },
  zaltbommel: {
    seo: {
      title: "Woning isoleren in Zaltbommel | Gijs",
      description: "Wil je je woning isoleren in Zaltbommel? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 11.623 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Zaltbommel",
    h1: "Woning isoleren in Zaltbommel",
    intro: [
      ["Woon je in Zaltbommel, ", { tekst: "Gameren", href: "/regio/gelderland/zaltbommel/gameren" }, ", ", { tekst: "Brakel", href: "/regio/gelderland/zaltbommel/brakel" }, " of een van de andere kernen? Zaltbommel is een historische Hanzestad aan de Maas, met een woningvoorraad die varieert van monumentale panden in de historische vesting tot naoorlogse rijtjeswoningen in de uitbreidingswijken."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Zaltbommel verdeeld.",
      kerncijfers: [
        { waarde: "11.623", label: "woningen" },
        { waarde: "87%", label: "eengezinswoningen" },
        { waarde: "77%", label: "gebouwd vóór 2000" },
        { waarde: "67%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 42, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 35, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 23, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Zaltbommel",
      alineas: [
        ["De gemeente Zaltbommel omvat kernen als Zaltbommel, Gameren, Brakel, Poederoijen en Zuilichem langs de Waal. In de historische vesting van Zaltbommel gelden soms monumentale beperkingen; in de naoorlogse woonwijken zijn spouwmuurisolatie en dakisolatie goed toepasbaar."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Zaltbommel",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Zaltbommel", woningen: 5685, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Brakel", woningen: 3058, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Kerkwijk", woningen: 2311, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Nederhemert", woningen: 569, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Zaltbommel?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Zaltbommel zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
    woningInzichtenBlok: {
      h2: "Dakisolatie voor meer comfort, met aandacht voor de constructie",
      feitVariant: "subtiel",
      percentageTekst: "Zaltbommel telt ruim 11.600 woningen, waarvan 67% koopwoning",
      bodytekst: "In de Bommelerwaard staan veel woningen met een kap. Dakisolatie is dan een logische maatregel, maar de constructie van het dak bepaalt welke aanpak mogelijk is. Sommige daken hebben genoeg ruimte voor isolatie tussen de spanten, bij andere is isolatie aan de buitenzijde of binnenzijde nodig. Gijs kijkt wat er bij jouw dak past en zorgt dat het werk goed wordt uitgevoerd.",
      kaarten: [
        { icon: "home", titel: "Dakisolatie bij woningen met een kap", tekst: "Bij een hellend dak kan isolatie tussen de spanten, aan de binnenzijde of aan de buitenzijde. De beste optie hangt af van de constructie.", href: "/maatregelen/dakisolatie", linkTekst: "Lees over dakisolatie" },
        { icon: "layers", titel: "Spouwmuurisolatie als aanvulling", tekst: "Na het dak is de gevel vaak de volgende stap. In de Bommelerwaard hebben veel woningen nog een lege spouw.", href: "/maatregelen/spouwmuurisolatie", linkTekst: "Lees over spouwmuurisolatie" },
      ],
      adviseur: { naam: "thom", h3: "Thom adviseert je in Zaltbommel", tekst: "De Bommelerwaard heeft een gevarieerde woningvoorraad, van dijkwoningen tot nieuwbouw. Thom bekijkt de constructie van je dak en adviseert welke isolatie past." },
    },
  },
  zevenaar: {
    seo: {
      title: "Isoleren in Zevenaar | Gijs",
      description: "Wil je je woning isoleren in Zevenaar? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 19.970 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Zevenaar",
    h1: "Isoleren in Zevenaar",
    intro: [
      ["Woon je in Zevenaar, ", { tekst: "Angerlo", href: "/regio/gelderland/zevenaar/angerlo" }, ", ", { tekst: "Babberich", href: "/regio/gelderland/zevenaar/babberich" }, " of ", { tekst: "Oud-Zevenaar", href: "/regio/gelderland/zevenaar/oud-zevenaar" }, "? Zevenaar is een groeigemeente in de Liemers, direct grenzend aan Duitsland en Arnhem, met een gevarieerde woningvoorraad van historische dorpswoningen in de kernen tot recente nieuwbouwwijken aan de stadsrand."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Zevenaar verdeeld.",
      kerncijfers: [
        { waarde: "19.970", label: "woningen" },
        { waarde: "82%", label: "eengezinswoningen" },
        { waarde: "85%", label: "gebouwd vóór 2000" },
        { waarde: "63%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 47, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 38, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 15, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Zevenaar",
      alineas: [
        ["De gemeente Zevenaar omvat kernen als Zevenaar, Angerlo, Babberich en Oud-Zevenaar. De oudere dorpskernen hebben veel woningen uit de jaren vijftig en zestig die goed geschikt zijn voor spouwmuurisolatie; in de nieuwere wijken van Zevenaar-Oost speelt de omschakeling naar warmtepompen een grotere rol."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Zevenaar",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Zevenaar", woningen: 11757, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Giesbeek", woningen: 1591, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Lobith", woningen: 1435, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Tolkamer", woningen: 1273, periode: "Overwegend vóór 2000", tijdvak: null, type: "vrijstaand" },
          { naam: "Pannerden", woningen: 1013, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Babberich", woningen: 943, periode: "Overwegend vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Angerlo", woningen: 593, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Herwen", woningen: 455, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Aerdt", woningen: 329, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Spijk", woningen: 321, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "tussenwoning" },
          { naam: "Lathum", woningen: 222, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Zevenaar?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Zevenaar zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
    woningInzichtenBlok: {
      h2: "Je hebt al verduurzaamd. Wat is de volgende verstandige stap?",
      feitVariant: "heading",
      percentageTekst: "Ruim 1 op de 3 woningen in Zevenaar is gebouwd tussen 1965 en 1975",
      bodytekst: "Veel bewoners in Zevenaar hebben de afgelopen jaren al een eerste stap gezet: nieuwe ramen, een geïsoleerd dak of spouwmuurisolatie. Maar is het genoeg? En wat is nu de verstandige vervolgstap? Dat hangt af van wat er al is gedaan en hoe de woning als geheel presteert. Gijs brengt de huidige staat in kaart en adviseert je over de maatregel die nu het meeste oplevert.",
      kaarten: [
        { icon: "clipboard-check", titel: "Wat is er al gedaan?", tekst: "Veel woningen uit deze periode zijn deels verbeterd, maar niet altijd op het niveau van nu. Gijs kijkt wat er al zit en wat de volgende stap is.", href: "/contact#energiescan", linkTekst: "Plan een energiescan" },
        { icon: "thermometer", titel: "Van isolatie naar installatie", tekst: "Bij een goed geïsoleerde woning wordt een warmtepomp interessant. De juiste volgorde bespaart geld en maakt de overstap eenvoudiger.", href: "/maatregelen/warmtepomp", linkTekst: "Lees over warmtepompen" },
      ],
      adviseur: { naam: "naud", h3: "Naud helpt je verder in Zevenaar", tekst: "In Zevenaar zijn veel woningen al deels verbeterd. Naud kijkt naar wat er is gedaan, wat nog ontbreekt en welke stap nu het meest oplevert." },
    },
  },
  zutphen: {
    seo: {
      title: "Je woning verduurzamen in Zutphen | Gijs",
      description: "Wil je je woning isoleren in Zutphen? Gijs geeft onafhankelijk advies over spouwmuurisolatie, dakisolatie en zonnepanelen. Bekijk de 22.267 woningen en welke subsidies gelden.",
    },
    kicker: "Gemeente Zutphen",
    h1: "Je woning verduurzamen in Zutphen",
    intro: [
      ["Woon je in Zutphen, ", { tekst: "Warnsveld", href: "/regio/gelderland/zutphen/warnsveld" }, " of ", { tekst: "Leesten", href: "/regio/gelderland/zutphen/leesten" }, "? Zutphen is een historische Hanzestad aan de IJssel, met een gevarieerde woningvoorraad: van eeuwenoude panden in de beschermde binnenstad tot naoorlogse arbeiderswijken en recente nieuwbouw aan de stadsranden."],
      ["Gijs geeft onafhankelijk advies. Tijdens een gratis energiescan aan huis kijkt een adviseur wat er technisch bij jouw woning past, en welke stap het meeste oplevert."],
    ],
    kernen: [],
    woningen: {
      lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Zutphen verdeeld.",
      kerncijfers: [
        { waarde: "22.267", label: "woningen" },
        { waarde: "68%", label: "eengezinswoningen" },
        { waarde: "84%", label: "gebouwd vóór 2000" },
        { waarde: "56%", label: "koopwoningen" },
      ],
      bouwperiodes: [
        { label: "Vóór 1975", percentage: 46, tekst: "Vaak gebouwd met weinig of geen isolatie. De spouw is regelmatig nog leeg; dak en vloer zijn vaak de eerste winst." },
        { label: "1975 – 2000", percentage: 38, tekst: "Meestal al deels geïsoleerd, maar vaak dunner dan nu gebruikelijk. Eerst kijken wat er zit, dan bijisoleren." },
        { label: "Na 2000", percentage: 16, tekst: "Vaak al redelijk tot goed geïsoleerd. De winst zit vaker in beter glas, zonnepanelen of de overstap naar een warmtepomp." },
      ],
      voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
      bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
    },
    lokaal: {
      titel: "Wijken in gemeente Zutphen",
      alineas: [
        ["Zutphen omvat naast de stad ook de kernen Warnsveld en Leesten. Historische panden in het centrum stellen bijzondere eisen aan isolatie; in de naoorlogse wijken als Leesten-Oost zijn spouwmuurisolatie en dakisolatie goed toepasbaar en snel terugverdiend."],
      ],
      kernTekst: {},
      wijken: {
        titel: "Wijken in Zutphen",
        intro: "De kleur geeft aan in welke bouwperiode de meeste woningen in die wijk vallen.",
        lijst: [
          { naam: "Waterkwartier", woningen: 5119, periode: "Overwegend vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Centrum - De Hoven", woningen: 4855, periode: "Overwegend vóór 2000", tijdvak: 0, type: "gemengd" },
          { naam: "Warnsveld", woningen: 3610, periode: "Overwegend vóór 2000", tijdvak: 0, type: "vrijstaand" },
          { naam: "Leesten", woningen: 3259, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "vrijstaand" },
          { naam: "Zuidwijken", woningen: 3146, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
          { naam: "Noordveen", woningen: 2278, periode: "Grotendeels vóór 2000", tijdvak: 0, type: "twee-onder-een-kap" },
        ],
        bron: { naam: "CBS Kerncijfers wijken en buurten 2022", url: "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/84799NED" },
      },
      ontwikkeling: {
        titel: "Woningverbetering in Gelderland",
        tekst: "Gelderland heeft veel woningen uit de jaren zestig en zeventig, die met relatief eenvoudige stappen goed te verbeteren zijn. De provincie en gemeenten ondersteunen eigenaren met advies en subsidies.",
      },
    },
    faq: [
      { question: "Welke gemeentelijke subsidies gelden in Zutphen?", answer: "Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Controleer de actuele mogelijkheden bij de gemeente Zutphen zelf of via de Energiesubsidiewijzer van Milieu Centraal." },
      { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
      { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
      { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding, geen technische beoordeling." },
    ],
    verwant: [],
  },
};

const PLAATS_VERHALEN: Record<string, Record<string, GemeenteVerhaal>> = {
  borne: { zenderen: ZENDEREN, hertme: HERTME },
  hengelo: { beckum: BECKUM },
  enschede: {
    boekelo: BOEKELO,
    glanerbrug: GLANERBRUG,
    lonneker: LONNEKER,
    usselo: USSELO,
    twekkelo: TWEKKELO,
  },
  almelo: {
    aadorp: AADORP,
    bornerbroek: BORNERBROEK,
    "harbrinkhoek-mariaparochie": HARBRINKHOEK_MARIAPAROCHIE,
  },
  "hof-van-twente": {
    goor: GOOR,
    delden: DELDEN,
    markelo: MARKELO,
    diepenheim: DIEPENHEIM,
    bentelo: BENTELO,
    hengevelde: HENGEVELDE,
  },
  hellendoorn: {
    nijverdal: NIJVERDAL,
    daarle: DAARLE,
    daarlerveen: DAARLERVEEN,
    haarle: HAARLE,
  },
  "rijssen-holten": {
    rijssen: RIJSSEN,
    holten: HOLTEN,
  },
  twenterand: {
    vriezenveen: VRIEZENVEEN,
    vroomshoop: VROOMSHOOP,
    "den-ham": DEN_HAM,
    geerdijk: GEERDIJK,
    "de-pollen": DE_POLLEN,
    "westerhaar-vriezenveensewijk": WESTERHAAR_VRIEZENVEENSEWIJK,
  },
  zwolle: {
    berkum: BERKUM_ZWOLLE,
    westenholte: WESTENHOLTE,
    stadshagen: STADSHAGEN,
    windesheim: WINDESHEIM,
    wijthmen: WIJTHMEN,
    herfte: HERFTE,
    haerst: HAERST,
  },
  ...PLAATSVERHALEN_FLEVOLAND,
};

export const getGemeenteVerhaal = (gemeenteSlug: string): GemeenteVerhaal | undefined =>
  VERHALEN[gemeenteSlug] ?? VERHALEN_UTRECHT_FLEVOLAND[gemeenteSlug];
export const getPlaatsVerhaal = (gemeenteSlug: string, plaatsSlug: string) =>
  PLAATS_VERHALEN[gemeenteSlug]?.[plaatsSlug];
