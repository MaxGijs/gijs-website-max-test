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

const VERHALEN: Record<string, GemeenteVerhaal> = { borne: BORNE };

export const getGemeenteVerhaal = (gemeenteSlug: string) => VERHALEN[gemeenteSlug];
