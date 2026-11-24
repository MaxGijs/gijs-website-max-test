import type { GemeenteVerhaal } from "./gemeente-verhalen";

// Interne links naar de regio- en plaatspagina's met een geplande isolatiekans (SEO-dashboard, 24-11-2026).
// Getoond op /maatregelen (alle provincies) en op de provinciepagina (alleen `provinciepagina`: links die de
// gemeentekaart daar nog niet geeft). Pagina's met een lopend experiment (Borne, Holten, Apeldoorn, Lelystad,
// Zwolle, Arnhem) staan er bewust niet in, zodat die metingen niet extra worden beïnvloed.
export type IsolatieRegioLink = { tekst: string; href: string; provinciepagina?: boolean };

export const ISOLATIE_REGIO_LINKS: { provincie: string; naam: string; links: IsolatieRegioLink[] }[] = [
  {
    provincie: "overijssel",
    naam: "Overijssel",
    links: [
      { tekst: "Isolatie in Delden", href: "/regio/overijssel/hof-van-twente/delden", provinciepagina: true },
      { tekst: "Je woning isoleren in Goor", href: "/regio/overijssel/hof-van-twente/goor", provinciepagina: true },
      { tekst: "Isolatie in Vroomshoop", href: "/regio/overijssel/twenterand/vroomshoop", provinciepagina: true },
      { tekst: "Isolatieadvies in Hardenberg", href: "/regio/overijssel/hardenberg" },
      { tekst: "Isolatie in Wierden en Enter", href: "/regio/overijssel/wierden" },
      { tekst: "Isolatie in Losser", href: "/regio/overijssel/losser" },
      { tekst: "Woningisolatie in Raalte", href: "/regio/overijssel/raalte" },
      { tekst: "Isolatieadvies in Dinkelland", href: "/regio/overijssel/dinkelland" },
      { tekst: "Je woning isoleren in Olst of Wijhe", href: "/regio/overijssel/olst-wijhe" },
      { tekst: "Isolatie in Tubbergen", href: "/regio/overijssel/tubbergen" },
      { tekst: "Isolatieadvies in Steenwijk", href: "/regio/overijssel/steenwijkerland" },
      { tekst: "Spouwmuurisolatie in Ommen", href: "/regio/overijssel/ommen" },
      { tekst: "Isolatie in Staphorst", href: "/regio/overijssel/staphorst" },
      { tekst: "Dakisolatie in Kampen", href: "/regio/overijssel/kampen" },
      { tekst: "Dakisolatie in Almelo", href: "/regio/overijssel/almelo" },
      { tekst: "Dakisolatie in Enschede", href: "/regio/overijssel/enschede" },
    ],
  },
  {
    provincie: "gelderland",
    naam: "Gelderland",
    links: [
      { tekst: "Isolatieadvies in Doetinchem", href: "/regio/gelderland/doetinchem" },
      { tekst: "Isolatie in Zevenaar", href: "/regio/gelderland/zevenaar" },
      { tekst: "Vloerisolatie in Huissen", href: "/regio/gelderland/lingewaard/huissen", provinciepagina: true },
    ],
  },
  {
    provincie: "flevoland",
    naam: "Flevoland",
    links: [
      { tekst: "Mogelijkheden voor woningisolatie in Zeewolde", href: "/regio/flevoland/zeewolde" },
    ],
  },
  {
    provincie: "utrecht",
    naam: "Utrecht",
    links: [
      { tekst: "Isolatie in de stad Utrecht", href: "/regio/utrecht/utrecht", provinciepagina: true },
    ],
  },
];

/** Eigen isolatieantwoord voor een plaatspagina zonder eigen verhaal (basispagina), per "gemeente/plaats". */
export const PLAATS_ISOLATIE_ANTWOORD: Record<string, NonNullable<GemeenteVerhaal["isolatieAntwoord"]>> = {
  // Gemeentecijfer uit de Lingewaard-pagina (CBS 2022); vloer/bodem zoals op /maatregelen/vloerisolatie.
  "lingewaard/huissen": {
    eyebrow: "Vloerisolatie in Huissen",
    h2: "Vloerisolatie en bodemisolatie in Huissen",
    alineas: [
      ["Last van een koude vloer in je huis in Huissen? Daar zijn twee aanpakken voor. Bij vloerisolatie komt de isolatie direct tegen de onderkant van de vloer, in de kruipruimte. Bij bodemisolatie ligt het materiaal op de bodem van de kruipruimte. De constructie, de bereikbaarheid en het vocht in de kruipruimte bepalen welke aanpak bij jouw woning mogelijk is."],
      ["In de gemeente Lingewaard is 43% van de woningen gebouwd vóór 1975. Bij huizen uit die tijd is de vloer vaak niet geïsoleerd. Toch is de vloer niet altijd de beste eerste stap: soms levert het dak of de spouwmuur meer op. Gijs kijkt daarom eerst naar de hele woning, tijdens een gratis energiescan aan huis."],
      ["Na het advies regelt Gijs de uitvoering door vakspecialisten. Je hebt één aanspreekpunt, van de eerste beoordeling tot de uitvoering helemaal is afgerond. Lees meer over ", { tekst: "vloerisolatie en het verschil met bodemisolatie", href: "/maatregelen/vloerisolatie" }, "."],
    ],
  },
};
