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

      goor: "Het grootste dorp en centrum van de gemeente.",
      delden: "Historisch dorp met Slot Twickel in de nabijheid.",
      markelo: "Dorp op de rand van het Sallandse Heuvelrug-gebied.",
      diepenheim: "Klein historisch stadje met een rijke verleden als heerlijkheid.",
      bentelo: "Landelijk dorp in het westen van de gemeente.",
      hengevelde: "Dorp aan de grens met Duitsland, met een landelijk karakter.",
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
      { waarde: "~250", label: "woningen" },
      { waarde: "~55%", label: "vrijstaand" },
      { waarde: "~85%", label: "koopwoning" },
      { waarde: "~40%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 18, tekst: "Boerderijen en historische lintbebouwing langs de doorgaande wegen. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 23, tekst: "Naoorlogse woonuitbreiding van het dorp. Spouwmuren zijn er, maar de spouw is vaak nog leeg." },
      { label: "1975 – 1995", percentage: 33, tekst: "De grootste bouwgolf in Beckum. Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 26, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Beckum, 2026", url: "https://www.allecijfers.nl/buurt/beckum-hengelo/" },
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
    ["Boekelo heeft een gevarieerde woningvoorraad — van oudere vrijstaande woningen langs de historische linten tot modernere woningen in de woonstraten. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["boekelo", "enschede", "glanerbrug", "lonneker", "usselo", "twekkelo"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Boekelo verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "~1.200", label: "woningen" },
      { waarde: "~42%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~78%", label: "koopwoning" },
      { waarde: "~35%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 14, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd zonder isolatie gebouwd." },
      { label: "1945 – 1975", percentage: 22, tekst: "Naoorlogse uitbreiding van het dorp. Spouwmuren zijn er, maar de spouw is vaak leeg." },
      { label: "1975 – 1995", percentage: 34, tekst: "De grootste bouwgolf. Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 30, tekst: "Beter geïsoleerd. De winst zit vaker in installaties of beter glas." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Boekelo, 2026", url: "https://www.allecijfers.nl/buurt/boekelo-enschede/" },
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
      { waarde: "~6.500", label: "woningen" },
      { waarde: "~38%", label: "tussenwoning" },
      { waarde: "~55%", label: "koopwoning" },
      { waarde: "~50%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 10, tekst: "Oorspronkelijke bebouwing langs de grensdoorgangen. Gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 40, tekst: "Massale naoorlogse uitbreiding. Spouwmuren zijn aanwezig, maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 33, tekst: "Verder uitgebouwd. Deels geïsoleerd, maar zelden op huidig niveau." },
      { label: "Na 1995", percentage: 17, tekst: "Beter geïsoleerd. De winst zit vaker in installaties of beter glas." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Glanerbrug, 2026", url: "https://www.allecijfers.nl/buurt/glanerbrug-enschede/" },
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
      { waarde: "~600", label: "woningen" },
      { waarde: "~50%", label: "vrijstaand" },
      { waarde: "~82%", label: "koopwoning" },
      { waarde: "~38%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 20, tekst: "Agrarische bebouwing en historische boerderijen. Bijna altijd zonder isolatienormen gebouwd." },
      { label: "1945 – 1975", percentage: 19, tekst: "Naoorlogse woningbouw. Spouwmuren zijn er, maar de spouw is vaak nog leeg." },
      { label: "1975 – 1995", percentage: 35, tekst: "Deels geïsoleerd. Bijna altijd nog te verbeteren, zeker bij vrijstaande woningen." },
      { label: "Na 1995", percentage: 26, tekst: "Beter geïsoleerd. De winst zit vaker in installaties of beter glas." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Lonneker, 2026", url: "https://www.allecijfers.nl/buurt/lonneker-enschede/" },
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
      { waarde: "~400", label: "woningen" },
      { waarde: "~52%", label: "vrijstaand" },
      { waarde: "~83%", label: "koopwoning" },
      { waarde: "~32%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 12, tekst: "Historische bebouwing op het markepad. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 21, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar vaak nog niet gevuld." },
      { label: "1975 – 1995", percentage: 37, tekst: "Grootste bouwgolf van Usselo. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 30, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Usselo, 2026", url: "https://www.allecijfers.nl/buurt/usselo-enschede/" },
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
      { waarde: "~300", label: "woningen" },
      { waarde: "~55%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~84%", label: "koopwoning" },
      { waarde: "~38%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische bebouwing langs de Twekkelerweg. Bijna altijd zonder isolatie gebouwd." },
      { label: "1945 – 1975", percentage: 24, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar vaak nog niet gevuld." },
      { label: "1975 – 1995", percentage: 35, tekst: "Grootste bouwgolf van Twekkelo. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 26, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Twekkelo, 2026", url: "https://www.allecijfers.nl/buurt/twekkelo-enschede/" },
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
      { waarde: "~900", label: "woningen" },
      { waarde: "~45%", label: "tussenwoning" },
      { waarde: "~72%", label: "koopwoning" },
      { waarde: "~40%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd zonder isolatienormen gebouwd." },
      { label: "1945 – 1975", percentage: 26, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 37, tekst: "Grootste bouwgolf van Aadorp. Deels geïsoleerd, maar bijna altijd te verbeteren." },
      { label: "Na 1995", percentage: 22, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Aadorp, 2026", url: "https://www.allecijfers.nl/buurt/aadorp-almelo/" },
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
      { waarde: "~700", label: "woningen" },
      { waarde: "~48%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~78%", label: "koopwoning" },
      { waarde: "~35%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 14, tekst: "Agrarische bebouwing en historische boerderijen. Bijna altijd zonder isolatienormen gebouwd." },
      { label: "1945 – 1975", percentage: 22, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 38, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 26, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Bornerbroek, 2026", url: "https://www.allecijfers.nl/buurt/bornerbroek-almelo/" },
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
      { waarde: "~5.200", label: "woningen" },
      { waarde: "~38%", label: "tussenwoning" },
      { waarde: "~65%", label: "koopwoning" },
      { waarde: "~42%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 16, tekst: "Historische bebouwing in het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 27, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 33, tekst: "Grootste bouwgolf van Goor. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 24, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Goor, 2026", url: "https://www.allecijfers.nl/buurt/goor-hof-van-twente/" },
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
};

const DELDEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Delden | Gijs",
    description: "Je woning verduurzamen in Delden? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hof van Twente.",
  },
  kicker: "Stadje in gemeente Hof van Twente",
  h1: "Je woning verduurzamen in Delden",
  intro: [
    ["Woon je in Delden? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hof van Twente", href: "/regio/overijssel/hof-van-twente" }, " zijn."],
    ["Delden is een historisch stadje met een gevarieerde woningvoorraad. Van karakteristieke panden in het centrum tot naoorlogse woningbouw in de uitbreidingswijken. Per woning verschilt de meest effectieve isolatiestap."],
  ],
  kernen: ["delden", "goor", "markelo", "diepenheim", "bentelo", "hengevelde"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Delden verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "~2.800", label: "woningen" },
      { waarde: "~40%", label: "tussenwoning" },
      { waarde: "~68%", label: "koopwoning" },
      { waarde: "~45%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 18, tekst: "Historische panden in en rond het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 28, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 32, tekst: "Verdere uitbreiding van het dorp. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 22, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Delden, 2026", url: "https://www.allecijfers.nl/buurt/delden-hof-van-twente/" },
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
      { waarde: "~2.200", label: "woningen" },
      { waarde: "~42%", label: "tussenwoning" },
      { waarde: "~70%", label: "koopwoning" },
      { waarde: "~38%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Agrarische bebouwing en historische panden. Bijna altijd zonder isolatienormen gebouwd." },
      { label: "1945 – 1975", percentage: 24, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 36, tekst: "Grootste bouwgolf van Markelo. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 25, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Markelo, 2026", url: "https://www.allecijfers.nl/buurt/markelo-hof-van-twente/" },
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
      { waarde: "~700", label: "woningen" },
      { waarde: "~50%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~76%", label: "koopwoning" },
      { waarde: "~34%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 13, tekst: "Historische bebouwing bij het kasteel en langs de doorgaande wegen. Bijna altijd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 22, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 37, tekst: "Grootste bouwgolf van Diepenheim. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 28, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Diepenheim, 2026", url: "https://www.allecijfers.nl/buurt/diepenheim-hof-van-twente/" },
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
      { waarde: "~200", label: "woningen" },
      { waarde: "~58%", label: "vrijstaand" },
      { waarde: "~82%", label: "koopwoning" },
      { waarde: "~35%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 14, tekst: "Historische boerderijbebouwing. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 22, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 36, tekst: "Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 28, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Bentelo, 2026", url: "https://www.allecijfers.nl/buurt/bentelo-hof-van-twente/" },
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
      { waarde: "~1.200", label: "woningen" },
      { waarde: "~45%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~74%", label: "koopwoning" },
      { waarde: "~37%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 14, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 24, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 36, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 26, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Hengevelde, 2026", url: "https://www.allecijfers.nl/buurt/hengevelde-hof-van-twente/" },
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
};

// ─── PlaatsVerhalen Hellendoorn ──────────────────────────────────────────────

const NIJVERDAL: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Nijverdal | Gijs",
    description: "Je woning verduurzamen in Nijverdal? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Hellendoorn.",
  },
  kicker: "Kern in gemeente Hellendoorn",
  h1: "Je woning verduurzamen in Nijverdal",
  intro: [
    ["Woon je in Nijverdal? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Hellendoorn", href: "/regio/overijssel/hellendoorn" }, " zijn."],
    ["Nijverdal is de grootste kern van de gemeente Hellendoorn. De woningvoorraad is gevarieerd: van naoorlogse rijtjeswoningen in de uitbreidingswijken tot vrijstaande woningen aan de rand van de Hellendoornse Berg. Per woning verschilt de eerste stap."],
  ],
  kernen: ["nijverdal", "daarle", "daarlerveen", "haarle"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Nijverdal verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "~9.500", label: "woningen" },
      { waarde: "~36%", label: "tussenwoning" },
      { waarde: "~62%", label: "koopwoning" },
      { waarde: "~44%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 16, tekst: "Historische bebouwing in het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 29, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 32, tekst: "Grootste bouwgolf van Nijverdal. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 23, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Nijverdal, 2026", url: "https://www.allecijfers.nl/buurt/nijverdal-hellendoorn/" },
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
      { waarde: "~500", label: "woningen" },
      { waarde: "~52%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~78%", label: "koopwoning" },
      { waarde: "~36%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 14, tekst: "Historische boerderijbebouwing. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 23, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 37, tekst: "Grootste bouwgolf van Daarle. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 26, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Daarle, 2026", url: "https://www.allecijfers.nl/buurt/daarle-hellendoorn/" },
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
      { waarde: "~250", label: "woningen" },
      { waarde: "~56%", label: "vrijstaand" },
      { waarde: "~80%", label: "koopwoning" },
      { waarde: "~33%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 12, tekst: "Historische bebouwing in het buitengebied. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 22, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 37, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 29, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Daarlerveen, 2026", url: "https://www.allecijfers.nl/buurt/daarlerveen-hellendoorn/" },
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
      { waarde: "~650", label: "woningen" },
      { waarde: "~55%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~80%", label: "koopwoning" },
      { waarde: "~37%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 14, tekst: "Historische bebouwing langs de doorgaande wegen. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 24, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 36, tekst: "Grootste bouwgolf van Haarle. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 26, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Haarle, 2026", url: "https://www.allecijfers.nl/buurt/haarle-hellendoorn/" },
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
    title: "Woning isoleren en verduurzamen in Rijssen | Gijs",
    description: "Je woning verduurzamen in Rijssen? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Rijssen-Holten.",
  },
  kicker: "Kern in gemeente Rijssen-Holten",
  h1: "Je woning verduurzamen in Rijssen",
  intro: [
    ["Woon je in Rijssen? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" }, " zijn."],
    ["Rijssen is de grootste kern van de gemeente Rijssen-Holten. De woningvoorraad is gevarieerd: van compacte naoorlogse woningen in de oudere wijken tot ruime vrijstaande woningen in de nieuwere buurten. Per woning verschilt de meest effectieve stap."],
  ],
  kernen: ["rijssen", "holten"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Rijssen verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "~10.000", label: "woningen" },
      { waarde: "~38%", label: "tussenwoning" },
      { waarde: "~68%", label: "koopwoning" },
      { waarde: "~42%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 16, tekst: "Historische bebouwing in het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 27, tekst: "Naoorlogse uitbreiding van de stad. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 33, tekst: "Grootste bouwgolf van Rijssen. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 24, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Rijssen, 2026", url: "https://www.allecijfers.nl/buurt/rijssen-rijssen-holten/" },
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
    { question: "Welke subsidies zijn er voor mijn woning in Rijssen?", answer: "Rijssen valt onder de gemeente Rijssen-Holten. De regelingen van Rijssen-Holten gelden dus ook in Rijssen." },
    { question: "Mijn naoorlogse woning in Rijssen heeft een lege spouw. Wat doe ik?", answer: "Spouwmuurisolatie is voor veel naoorlogse woningen de meest effectieve eerste stap. Gijs kijkt of dat bij jouw woning ook het geval is." },
    { question: "Helpt Gijs ook in Rijssen?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Rijssen-Holten, dus ook in Rijssen." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Gijs kijkt naar de combinatie van isolatie en installaties die bij jouw woning past." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
  ],
};

const HOLTEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Holten | Gijs",
    description: "Je woning verduurzamen in Holten? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Rijssen-Holten.",
  },
  kicker: "Kern in gemeente Rijssen-Holten",
  h1: "Je woning verduurzamen in Holten",
  intro: [
    ["Woon je in Holten of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" }, " zijn."],
    ["Holten is een dorp aan de rand van de Holterberg. Met een mix van woningen in de kern en vrijstaande woningen aan de bosrand is de verduurzamingsopgave gevarieerd. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["holten", "rijssen"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Holten verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "~4.200", label: "woningen" },
      { waarde: "~42%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~70%", label: "koopwoning" },
      { waarde: "~40%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische bebouwing in het dorpscentrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 26, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 34, tekst: "Grootste bouwgolf van Holten. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 25, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Holten, 2026", url: "https://www.allecijfers.nl/buurt/holten-rijssen-holten/" },
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
    { question: "Welke subsidies zijn er voor mijn woning in Holten?", answer: "Holten valt onder de gemeente Rijssen-Holten. De regelingen van Rijssen-Holten gelden dus ook in Holten." },
    { question: "Helpt Gijs ook in Holten?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Rijssen-Holten, dus ook in Holten." },
    { question: "Kijkt Gijs ook naar zonnepanelen?", answer: "Ja. Ruime percelen aan de bosrand in Holten bieden goede condities voor zonnepanelen." },
  ],
  verwant: [
    { naam: "Woning verduurzamen in Rijssen-Holten", href: "/regio/overijssel/rijssen-holten" },
    { naam: "Woning verduurzamen in Hellendoorn", href: "/regio/overijssel/hellendoorn" },
  ],
};

// ─── PlaatsVerhalen Twenterand ───────────────────────────────────────────────

const VRIEZENVEEN: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Vriezenveen | Gijs",
    description: "Je woning verduurzamen in Vriezenveen? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Twenterand.",
  },
  kicker: "Kern in gemeente Twenterand",
  h1: "Je woning verduurzamen in Vriezenveen",
  intro: [
    ["Woon je in Vriezenveen? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Twenterand", href: "/regio/overijssel/twenterand" }, " zijn."],
    ["Vriezenveen is de grootste kern van de gemeente Twenterand. Met een gevarieerde woningvoorraad van naoorlogse rijtjeswoningen tot nieuwere vrijstaande woningen is er voor elk huis een logische eerste stap."],
  ],
  kernen: ["vriezenveen", "vroomshoop", "den-ham", "geerdijk", "de-pollen", "westerhaar-vriezenveensewijk"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Vriezenveen verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "~7.200", label: "woningen" },
      { waarde: "~36%", label: "tussenwoning" },
      { waarde: "~63%", label: "koopwoning" },
      { waarde: "~43%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 17, tekst: "Historische bebouwing langs de langgerekte veenkoloniale linten. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 27, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 32, tekst: "Grootste bouwgolf van Vriezenveen. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 24, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Vriezenveen, 2026", url: "https://www.allecijfers.nl/buurt/vriezenveen-twenterand/" },
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
};

const VROOMSHOOP: GemeenteVerhaal = {
  seo: {
    title: "Woning isoleren en verduurzamen in Vroomshoop | Gijs",
    description: "Je woning verduurzamen in Vroomshoop? Lees wat het bouwjaar zegt en welke subsidies er nu zijn in gemeente Twenterand.",
  },
  kicker: "Dorp in gemeente Twenterand",
  h1: "Je woning verduurzamen in Vroomshoop",
  intro: [
    ["Woon je in Vroomshoop of het omliggende buitengebied? Ontdek welke isolatie en installaties bij jouw woning passen en welke regelingen er nu in de gemeente ", { tekst: "Twenterand", href: "/regio/overijssel/twenterand" }, " zijn."],
    ["Vroomshoop is een dorp in het noorden van de gemeente Twenterand, met een veenkoloniaal karakter en een gevarieerde woningvoorraad. Gijs kijkt per woning wat de logische stap is."],
  ],
  kernen: ["vroomshoop", "vriezenveen", "den-ham", "geerdijk", "de-pollen", "westerhaar-vriezenveensewijk"],
  woningen: {
    lead: "Het bouwjaar zegt veel over hoe een huis gebouwd is. Zo is de woningvoorraad van Vroomshoop verdeeld, en dit betekent het voor isolatie.",
    kerncijfers: [
      { waarde: "~3.400", label: "woningen" },
      { waarde: "~38%", label: "tussenwoning" },
      { waarde: "~65%", label: "koopwoning" },
      { waarde: "~40%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische veenkoloniale lintbebouwing. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 26, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 34, tekst: "Grootste bouwgolf van Vroomshoop. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 25, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Vroomshoop, 2026", url: "https://www.allecijfers.nl/buurt/vroomshoop-twenterand/" },
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
      { waarde: "~1.500", label: "woningen" },
      { waarde: "~42%", label: "vrijstaand of 2-onder-1-kap" },
      { waarde: "~70%", label: "koopwoning" },
      { waarde: "~40%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 16, tekst: "Historische bebouwing in het centrum. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 25, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 34, tekst: "Grootste bouwgolf van Den Ham. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 25, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Den Ham, 2026", url: "https://www.allecijfers.nl/buurt/den-ham-twenterand/" },
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
      { waarde: "~200", label: "woningen" },
      { waarde: "~56%", label: "vrijstaand" },
      { waarde: "~80%", label: "koopwoning" },
      { waarde: "~33%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 12, tekst: "Historische bebouwing in het buitengebied. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 22, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 37, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 29, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Geerdijk, 2026", url: "https://www.allecijfers.nl/buurt/geerdijk-twenterand/" },
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
      { waarde: "~150", label: "woningen" },
      { waarde: "~58%", label: "vrijstaand" },
      { waarde: "~82%", label: "koopwoning" },
      { waarde: "~35%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 13, tekst: "Historische bebouwing in het buitengebied. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 23, tekst: "Naoorlogse woningbouw. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 36, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 28, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, gemeente Twenterand, 2026", url: "https://www.allecijfers.nl/gemeente/twenterand/" },
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
      { waarde: "~2.200", label: "woningen" },
      { waarde: "~40%", label: "tussenwoning" },
      { waarde: "~66%", label: "koopwoning" },
      { waarde: "~40%", label: "gebouwd vóór 1975" },
    ],
    bouwperiodes: [
      { label: "Vóór 1945", percentage: 15, tekst: "Historische veenkoloniale lintbebouwing. Bijna altijd gebouwd zonder isolatienormen." },
      { label: "1945 – 1975", percentage: 26, tekst: "Naoorlogse uitbreiding. Spouwmuren zijn aanwezig maar de spouw is in veel woningen nog leeg." },
      { label: "1975 – 1995", percentage: 34, tekst: "Grootste bouwgolf. Deels geïsoleerd, bijna altijd nog te verbeteren." },
      { label: "Na 1995", percentage: 25, tekst: "Beter geïsoleerd. De winst zit vaker in een warmtepomp of zonnepanelen." },
    ],
    voetnoot: "Het bouwjaar is een eerste indicatie, geen conclusie. Gijs kijkt altijd naar jouw eigen huis.",
    bron: { naam: "CBS en BAG via AlleCijfers.nl, buurt Westerhaar, 2026", url: "https://www.allecijfers.nl/buurt/westerhaar-vriezenveensewijk-twenterand/" },
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
};

export const getGemeenteVerhaal = (gemeenteSlug: string) => VERHALEN[gemeenteSlug];
export const getPlaatsVerhaal = (gemeenteSlug: string, plaatsSlug: string) =>
  PLAATS_VERHALEN[gemeenteSlug]?.[plaatsSlug];
