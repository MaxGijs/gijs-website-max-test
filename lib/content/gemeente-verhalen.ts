import type { Alinea } from "./regio-lokaal";
import type { FAQItem } from "@/components/measures/FAQAccordion";

// Gemeentepagina's als "lokale verduurzamingspagina" (zie het rapport "Lokale SEO voor Gijs: van
// plaatsnaam-pagina naar lokale verduurzamingspagina"): vaste opbouw, maar per gemeente eigen,
// gecontroleerde inhoud. Borne is de pilot. Een gemeente zonder verhaal hier houdt de bestaande
// pagina uit lib/content/regio-lokaal.ts.

export type GemeenteVerhaal = {
  seo: { title: string; description: string };
  kicker: string;
  h1: string;
  intro: Alinea[];
  /** Slugs van de kernen (lib/content/regio.ts), in deze volgorde getoond. */
  kernen: string[];
  woningen: {
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
    /** CBS-buurten in de kern. tijdvak = index in woningen.bouwperiodes (kleur), null = gemengd. */
    wijken?: { titel: string; intro: string; lijst: { naam: string; woningen: number; periode: string; tijdvak: number | null; type: string }[]; bron: { naam: string; url: string } };
    ontwikkeling: { titel: string; tekst: string };
  };
  natuur: {
    titel: string;
    lead: string;
    stappen: { icon: string; titel: string; tekst: string }[];
    zelf: string;
    bron: { naam: string; url: string };
  };
  faq: FAQItem[];
  verwant: { naam: string; href: string }[];
};

const BORNE: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Borne | Gijs",
    description: "Je woning verduurzamen in Borne, Zenderen of Hertme? Wat het bouwjaar zegt, natuurvriendelijk isoleren, isolatie en installaties, en de actuele subsidies in Borne.",
  },
  kicker: "Gemeente Borne",
  h1: "Je woning verduurzamen in Borne",
  intro: [
    ["Woon je in Borne, ", { tekst: "Zenderen", href: "/regio/overijssel/borne/zenderen" }, ", ", { tekst: "Hertme", href: "/regio/overijssel/borne/hertme" }, " of het buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen, welke regelingen er nu in Borne zijn en waar je rekening mee moet houden."],
    ["Ruim een derde van de woningen in Borne is gebouwd vóór 1975. Juist daar valt vaak nog winst te halen. Gijs kijkt eerst wat er al is gedaan, en helpt je dan met de stap die logisch is."],
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
  lokaal: {
    titel: "Borne, Zenderen en Hertme: niet iedere woning is hetzelfde",
    alineas: [
      ["De gemeente Borne bestaat uit de kern Borne, de dorpen Zenderen en Hertme en het buitengebied. Of je nu in een rijwoning in de kern woont of in een vrijstaand huis aan de rand van een dorp: de vraag is steeds waar de meeste warmte weglekt."],
      ["Dat verschil telt. Een vrijstaande woning heeft meer buitenmuur, dak en vloer dan een tussenwoning van dezelfde grootte, dus daar weegt goede isolatie extra zwaar. Woningtype, bouwjaar en ligging zeggen meer over je huis dan alleen de plaatsnaam."],
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
      intro: "Ook binnen de kern verschilt het per wijk. De kleur volgt de bouwperiodes hierboven.",
      lijst: [
        { naam: "Borne Centrum", woningen: 1910, periode: "Gemengd, oud en nieuw", tijdvak: null, type: "appartement" },
        { naam: "’t Wensink Noord", woningen: 452, periode: "Vooral vóór 1965", tijdvak: 0, type: "vrijstaand" },
        { naam: "’t Wensink Zuid", woningen: 882, periode: "Vooral 1965 – 1975", tijdvak: 0, type: "tussenwoning" },
        { naam: "Dikkerslaan-Molenkampsweg", woningen: 764, periode: "Vooral 1950 – 1980", tijdvak: 0, type: "twee-onder-een-kap" },
        { naam: "Letterveld I", woningen: 572, periode: "Vooral 1965 – 1985", tijdvak: 0, type: "twee-onder-een-kap" },
        { naam: "Letterveld II", woningen: 1283, periode: "Vooral 1965 – 1985", tijdvak: 0, type: "tussenwoning" },
        { naam: "Tichelkamp", woningen: 499, periode: "Vooral 1965 – 1985", tijdvak: 0, type: "tussenwoning" },
        { naam: "Stroom-Esch", woningen: 1544, periode: "Vooral 1985 – 1995", tijdvak: 1, type: "tussenwoning" },
        { naam: "Bornsche Maten", woningen: 1585, periode: "Vrijwel alles na 2000", tijdvak: 2, type: "tussenwoning" },
      ],
      bron: { naam: "CBS en BAG via AlleCijfers.nl", url: "https://www.allecijfers.nl/gemeente/borne/" },
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
    ["Bijna twee derde van de woningen in Hertme staat vrijstaand — het hoogste aandeel van de drie dorpen in Borne. Vrijstaande woningen hebben meer buitenoppervlak, wat betekent dat goede isolatie van dak, spouw en vloer extra bijdraagt."],
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
      { label: "Vóór 1945", percentage: 11, tekst: "Oude boerderijen en landelijke bebouwing. Kenmerkend voor de bosrijke omgeving van Hertme — bijna altijd zonder of met minimale isolatie." },
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
    title: "Woning isoleren en verduurzamen in Hengelo | Gijs",
    description: "Je woning verduurzamen in Hengelo of Beckum? Lees wat het bouwjaar zegt, hoe je rekening houdt met beschermde dieren bij isolatie, en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Hengelo",
  h1: "Je woning verduurzamen in Hengelo",
  intro: [
    ["Woon je in Hengelo of het dorp ", { tekst: "Beckum", href: "/regio/overijssel/hengelo/beckum" }, "? Ontdek welke isolatie en installaties bij jouw woning passen, welke regelingen er nu in Hengelo zijn en waar je rekening mee moet houden."],
    ["Ruim een derde van de woningen in Hengelo is gebouwd vóór 1975. Juist in die naoorlogse wijken valt nog veel te winnen. Gijs kijkt eerst wat er al is gedaan en helpt je met de stap die logisch is."],
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
  lokaal: {
    titel: "Hengelo: industriestad met een gevarieerde woningvoorraad",
    alineas: [
      ["Hengelo groeide in de twintigste eeuw uit tot een van de grootste steden van Twente, gedreven door de maakindustrie. De wederopbouw na de Tweede Wereldoorlog liet een grote naoorlogse woningvoorraad achter. Vandaag is Hengelo een compacte stad met zowel oudbouw in het centrum als rustige wijken en het dorp Beckum aan de rand."],
      ["De variatie in woningtype is groot. Huurders in meergezinswoningen en kopers van vrijstaande woningen hebben elk een ander startpunt. Gijs kijkt per woning wat de meest zinvolle stap is."],
    ],
    bekendVan: {
      titel: "Waar is Hengelo bekend van?",
      kaarten: [
        { icon: "factory", titel: "Stork-erfgoed", tekst: "Hengelo was decennialang de vestigingsplaats van Stork N.V., een van de grootste machinefabrieken van Nederland. Het industriële erfgoed is nog zichtbaar in de stad." },
        { icon: "music", titel: "Twentse Schouwburg", tekst: "De Twentse Schouwburg in het hart van Hengelo is een van de grootste theaters van de regio en trekt jaarlijks tienduizenden bezoekers." },
      ],
    },
    kernTekst: {
      hengelo: "De stad zelf, met de meeste woningen en voorzieningen.",
      beckum: "Dorp aan de rand van Hengelo, met een meer landelijk karakter.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Hengelo?",
      tekst: "Hengelo werkt aan een warmteplan voor de stad. De focus ligt op wijkgerichte aanpak, waarbij oudere naoorlogse wijken als eerste aan de beurt komen. Isoleren is hoe dan ook de logische eerste stap, ongeacht wanneer je wijk aan de beurt is.",
    },
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
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, zoals een warmtepomp, zonnepanelen of een thuisbatterij, en naar de volgorde die bij jouw woning past." },
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
    title: "Woning isoleren en verduurzamen in Enschede | Gijs",
    description: "Je woning verduurzamen in Enschede? Lees wat het bouwjaar zegt, hoe je rekening houdt met beschermde dieren bij isolatie, en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Enschede",
  h1: "Je woning verduurzamen in Enschede",
  intro: [
    ["Woon je in Enschede of een van de dorpen zoals ", { tekst: "Glanerbrug", href: "/regio/overijssel/enschede/glanerbrug" }, ", ", { tekst: "Boekelo", href: "/regio/overijssel/enschede/boekelo" }, " of ", { tekst: "Lonneker", href: "/regio/overijssel/enschede/lonneker" }, "? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu zijn."],
    ["Bijna een vijfde van de woningen in Enschede is van voor 1945. In de naoorlogse uitbreidingswijken is de spouw er wel, maar zit er zelden al goede isolatie in. Gijs kijkt eerst wat er al is gedaan."],
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
    { question: "Mijn huis is van vóór 1945. Waar begin ik?", answer: "Vaak bij de spouw, het dak of de vloer. Gijs kijkt wat er al is gedaan en wat de volgende logische stap is." },
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
    title: "Woning isoleren en verduurzamen in Almelo | Gijs",
    description: "Je woning verduurzamen in Almelo, Aadorp of Bornerbroek? Lees wat het bouwjaar zegt, hoe je omgaat met beschermde dieren bij isolatie, en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Almelo",
  h1: "Je woning verduurzamen in Almelo",
  intro: [
    ["Woon je in Almelo of in een van de dorpen zoals ", { tekst: "Aadorp", href: "/regio/overijssel/almelo/aadorp" }, " of ", { tekst: "Bornerbroek", href: "/regio/overijssel/almelo/bornerbroek" }, "? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu zijn."],
    ["In Almelo is ruim een kwart van de woningvoorraad in de naoorlogse periode gebouwd. Dat zijn woningen met spouwmuren, maar de spouw zit er zelden goed in. Gijs kijkt eerst wat er al is gedaan."],
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
    { question: "Kijkt Gijs ook naar een warmtepomp of zonnepanelen?", answer: "Ja. Gijs kijkt naar isolatie én installaties, in de volgorde die bij jouw woning past." },
    { question: "Helpt Gijs ook in Aadorp en Bornerbroek?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Almelo, ook in de dorpen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Enschede", href: "/regio/overijssel/enschede" },
    { naam: "Woning verduurzamen in Hengelo", href: "/regio/overijssel/hengelo" },
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const HOF_VAN_TWENTE: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Hof van Twente | Gijs",
    description: "Je woning verduurzamen in Hof van Twente — Goor, Delden, Markelo of het buitengebied? Lees wat het bouwjaar zegt en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Hof van Twente",
  h1: "Je woning verduurzamen in Hof van Twente",
  intro: [
    ["Woon je in de gemeente Hof van Twente — in ", { tekst: "Goor", href: "/regio/overijssel/hof-van-twente/goor" }, ", ", { tekst: "Delden", href: "/regio/overijssel/hof-van-twente/delden" }, ", ", { tekst: "Markelo", href: "/regio/overijssel/hof-van-twente/markelo" }, " of het buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen."],
    ["Met 69% koopwoningen en een groot aandeel vrijstaande huizen is Hof van Twente een gemeente waar verduurzaming vaak een individuele keuze is. Gijs kijkt wat bij jouw huis past."],
  ],
  kernen: ["hof-van-twente", "goor", "delden", "markelo"],
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
    titel: "Hof van Twente: landelijke gemeente met diverse dorpen",
    alineas: [
      ["De gemeente Hof van Twente bestaat uit dertien kernen, met Goor als het grootste dorp. De woningvoorraad is landelijker dan in de steden: meer vrijstaande woningen, ruimere kavels en een grotere variatie in bouwjaren."],
      ["Die variatie maakt de aanpak per woning persoonlijker. Een boerderij uit 1930 vraagt een andere benadering dan een nieuwbouwwoning in Markelo. Gijs kijkt per woning naar de beste volgorde van maatregelen."],
    ],
    bekendVan: {
      titel: "Waar is Hof van Twente bekend van?",
      kaarten: [
        { icon: "landmark", titel: "Slot Twickel", tekst: "Het middeleeuwse Slot Twickel bij Delden is een van de best bewaarde kastelen van Nederland en wordt omgeven door een groot landgoed." },
        { icon: "tree-pine", titel: "Nationaal Landschap", tekst: "Het landgoed Twickel en de omgeving Delden vallen deels binnen bijzondere cultuurlandschappen van Twente, bekend om hun essenlandschappen en oude houtwallen." },
      ],
    },
    kernTekst: {
      "hof-van-twente": "De gemeente zelf, met Goor als voornaamste kern.",
      goor: "Het grootste dorp en centrum van de gemeente.",
      delden: "Historisch dorp met Slot Twickel in de nabijheid.",
      markelo: "Dorp op de rand van het Sallandse Heuvelrug-gebied.",
    },
    ontwikkeling: {
      titel: "Wat speelt er in Hof van Twente?",
      tekst: "Hof van Twente heeft een subsidieregeling voor woningisolatie. Isoleren loont extra in de landelijke gemeente, omdat vrijstaande woningen meer buitenoppervlak hebben. Gijs kijkt wat bij jouw situatie past.",
    },
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
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const HELLENDOORN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Hellendoorn | Gijs",
    description: "Je woning verduurzamen in Hellendoorn — Nijverdal, Daarle, Daarlerveen of Haarle? Lees wat het bouwjaar zegt en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Hellendoorn",
  h1: "Je woning verduurzamen in Hellendoorn",
  intro: [
    ["Woon je in de gemeente Hellendoorn — in ", { tekst: "Nijverdal", href: "/regio/overijssel/hellendoorn/nijverdal" }, ", ", { tekst: "Haarle", href: "/regio/overijssel/hellendoorn/haarle" }, " of het buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen."],
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
  ],
  verwant: [
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
    { naam: "Woning verduurzamen in Hof van Twente", href: "/regio/overijssel/hof-van-twente" },
    { naam: "Woning verduurzamen in Twenterand", href: "/regio/overijssel/twenterand" },
  ],
};

// CBS/BAG-cijfers via AlleCijfers.nl, peiljaar 2026, gecontroleerd op 21 oktober 2026.
const RIJSSEN_HOLTEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Rijssen-Holten | Gijs",
    description: "Je woning verduurzamen in Rijssen of Holten? Lees wat het bouwjaar zegt over jouw woning, hoe je omgaat met beschermde dieren bij isolatie, en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Rijssen-Holten",
  h1: "Je woning verduurzamen in Rijssen-Holten",
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
    description: "Je woning verduurzamen in Twenterand — Vriezenveen, Vroomshoop of Den Ham? Lees wat het bouwjaar zegt en welke subsidies er nu zijn.",
  },
  kicker: "Gemeente Twenterand",
  h1: "Je woning verduurzamen in Twenterand",
  intro: [
    ["Woon je in de gemeente Twenterand — in ", { tekst: "Vriezenveen", href: "/regio/overijssel/twenterand/vriezenveen" }, ", ", { tekst: "Vroomshoop", href: "/regio/overijssel/twenterand/vroomshoop" }, " of ", { tekst: "Den Ham", href: "/regio/overijssel/twenterand/den-ham" }, "? Ontdek welke isolatie en installaties bij jouw woning passen."],
    ["Met ruim een derde vrijstaande woningen en een WOZ-waarde van gemiddeld €354.000 is Twenterand een landelijke gemeente waar verduurzaming per woning een andere aanpak vraagt. Gijs kijkt wat bij jouw huis past."],
  ],
  kernen: ["twenterand", "vriezenveen", "vroomshoop", "den-ham"],
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
      twenterand: "De gemeente, met Vriezenveen als grootste kern.",
      vriezenveen: "Het grootste dorp van de gemeente, met een rijke handelsgeschiedenis.",
      vroomshoop: "Woonkern in het midden van de gemeente.",
      "den-ham": "Dorp aan de rand van het Sallandse Heuvelrug-gebied.",
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
};

const PLAATS_VERHALEN: Record<string, Record<string, GemeenteVerhaal>> = {
  borne: { zenderen: ZENDEREN, hertme: HERTME },
};

export const getGemeenteVerhaal = (gemeenteSlug: string) => VERHALEN[gemeenteSlug];
export const getPlaatsVerhaal = (gemeenteSlug: string, plaatsSlug: string) =>
  PLAATS_VERHALEN[gemeenteSlug]?.[plaatsSlug];
