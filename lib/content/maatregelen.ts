// Inhoud voor de maatregelensectie op de homepage. Titels en
// bijschriften zijn woordelijk overgenomen uit de aangeleverde AI-
// gegenereerde maatregelbeelden (Bestaande Gijs-info / aangeleverd
// beeldmateriaal) — niet zelf verzonnen. De zes maatregelen komen
// overeen met de zes maatregelen uit de Productbriefing V1-scope en
// met lib/measures.ts (MEASURES), zodat dezelfde zes maatregelen
// overal in het prototype terugkomen.
export type Maatregel = {
  titel: string;
  beschrijving: string;
  afbeelding: string;
  icon: string;
};

export const MAATREGELEN: Maatregel[] = [
  {
    titel: "Dakisolatie",
    beschrijving: "Houd de warmte binnen en bespaar op je energierekening.",
    // Zelfde hero-foto als de dakisolatiepagina zelf, voor visuele
    // herkenbaarheid tussen overzicht en detailpagina.
    afbeelding: "/images/maatregelen/dakisolatie/57bfad47-7c34-4f85-80dd-7b3f2f1bf8a4.png",
    icon: "home",
  },
  {
    titel: "Spouwisolatie",
    beschrijving: "Een comfortabeler huis met minder warmteverlies.",
    // Zelfde hero-foto als de spouwmuurisolatiepagina zelf, voor
    // visuele herkenbaarheid tussen overzicht en detailpagina.
    afbeelding: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-aanbrengen-gijs.png",
    icon: "brick-wall",
  },
  {
    titel: "Vloerisolatie",
    beschrijving: "Een warmer huis en minder kou vanuit de kruipruimte.",
    // Zelfde hero-foto als de vloerisolatiepagina zelf, voor visuele
    // herkenbaarheid tussen overzicht en detailpagina.
    afbeelding: "/images/maatregelen/vloerisolatie/hero_vloerisolatie.png",
    icon: "layers",
  },
  {
    titel: "Glas en kozijnen",
    beschrijving: "Meer comfort en een lagere energierekening.",
    afbeelding: "/images/home/maatregelen/maatregel-glas-kozijnen.png",
    icon: "app-window",
  },
  {
    titel: "Isolatieglas",
    beschrijving: "Minder warmteverlies en meer comfort bij het raam.",
    // Zelfde hero-foto als de isolatieglaspagina zelf, voor visuele
    // herkenbaarheid tussen overzicht en detailpagina.
    afbeelding: "/images/maatregelen/glas/isolatieglas.png",
    icon: "app-window",
  },
  {
    titel: "Kozijnen",
    beschrijving: "Kunststof en aluminium kozijnen, deuren en schuifpuien.",
    // Zelfde hero-foto als de kozijnenpagina zelf, voor visuele
    // herkenbaarheid tussen overzicht en detailpagina.
    afbeelding: "/images/maatregelen/kozijnen/kozijnen-hero.jpg",
    icon: "app-window",
  },
  {
    titel: "Warmtepomp",
    beschrijving: "Duurzaam verwarmen en klaar voor de toekomst.",
    // Zelfde hero-foto als de warmtepomppagina zelf (een echte Gijs-
    // installatiefoto, aangeleverd via Archief.zip), voor visuele
    // herkenbaarheid tussen overzicht en detailpagina.
    afbeelding: "/images/maatregelen/warmtepomp/warmtepomp-hero.png",
    icon: "fan",
  },
  {
    titel: "Zonnepanelen",
    beschrijving: "Opwekken van je eigen duurzame energie.",
    // Zelfde hero-foto als de zonnepanelenpagina zelf (een echte foto van
    // een Gijs-installateur met valbeveiliging), voor visuele
    // herkenbaarheid tussen overzicht en detailpagina.
    afbeelding: "/images/maatregelen/zonnepanelen/zonnepanelen-hero-v4.jpeg",
    icon: "sun",
  },
  {
    titel: "Vloerverwarming",
    beschrijving: "Comfortabele warmte vanuit de vloer, zonder radiatoren.",
    // Zelfde hero-foto als de vloerverwarmingpagina zelf (een echte
    // Gijs-installatiefoto, aangeleverd via Archief.zip), voor visuele
    // herkenbaarheid tussen overzicht en detailpagina.
    afbeelding: "/images/maatregelen/vloerverwarming/vloerverwarming-hero.png",
    icon: "thermometer",
  },
  {
    titel: "Thuisbatterij",
    beschrijving: "Sla je energie op voor later gebruik.",
    // Zelfde hero-foto als de thuisbatterijpagina zelf (een echte
    // Gijs-installatiefoto van een Sigenergy SigenStor, aangeleverd via
    // Archief.zip), voor visuele herkenbaarheid tussen overzicht en
    // detailpagina.
    afbeelding: "/images/maatregelen/thuisbatterij/thuisbatterij-hero-v2.png",
    icon: "battery-charging",
  },
  {
    titel: "Ketel",
    beschrijving: "Zorgt voor warmte in je huis.",
    // Zelfde hero-foto als de ketelpagina zelf (een echte Gijs-
    // installatiefoto, aangeleverd via Archief.zip), voor visuele
    // herkenbaarheid tussen overzicht en detailpagina. Ontbrak nog: het
    // ketel-kaartje op /maatregelen toonde hierdoor alleen het generieke
    // placeholder-icoon (zie MeasureImage.tsx) in plaats van deze foto.
    afbeelding: "/images/maatregelen/ketel/ketel-hero.png",
    icon: "flame",
  },
];
