// Foto per maatregel (id's uit lib/measures.ts), gedeeld door de woningscan ("Wat kun je nog doen?")
// en de regiopagina's. Geen tekening maar een echte foto van het onderdeel, om vertrouwen te wekken.
// Vloerisolatie toont bewust de kruipruimte: voor de meeste mensen de onbekendste plek van de ingreep.
export const MAATREGEL_BEELD: Record<string, { src: string; alt: string }> = {
  zonnepanelen: { src: "/images/woningscan/maatregelen/zonnepanelen-dak.jpg", alt: "Zonnepanelen op een dak" },
  dakisolatie: { src: "/images/woningscan/maatregelen/dakisolatie.png", alt: "Dakisolatie tijdens het aanbrengen" },
  warmtepomp: { src: "/images/maatregelen/warmtepomp/warmtepomp-hero.png", alt: "Buitenunit van een warmtepomp" },
  gevelisolatie: { src: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-aanbrengen-gijs.png", alt: "Spouwmuurisolatie wordt aangebracht" },
  vloerisolatie: { src: "/images/woningscan/maatregelen/icynene-vloerisolatie.png", alt: "Vloerisolatie wordt in de kruipruimte aangebracht" },
  "glas-kozijnen": { src: "/images/maatregelen/kozijnen/kozijnen-hero.jpg", alt: "Nieuwe kozijnen met isolatieglas" },
  vloerverwarming: { src: "/images/maatregelen/vloerverwarming/vloerverwarming-hero.png", alt: "Vloerverwarming in de dekvloer" },
  thuisbatterij: { src: "/images/maatregelen/thuisbatterij/thuisbatterij-hero-v2.png", alt: "Thuisbatterij naast de woning" },
};
