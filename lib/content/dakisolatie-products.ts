// Bron: drie aangeleverde Gijs-productbladen — pagina 3 (beschrijving,
// productvoordelen): "Informatie dakisolatie zonder afwerking (HR
// WoodFibre) met aanvullende voorwaarden.pdf", "... (HR TimberWool) ...pdf"
// en "Informatie dakisolatie (HR EcoFoil) met aanvullende voorwaarden.pdf".
// De productafbeeldingen zijn crops uit pagina 3 van diezelfde bladen
// (geen AI-beeld). Voordelen zijn ingekort tot de belangrijkste kenmerken
// per materiaal, consumentvriendelijk herschreven.
//
// HR NatuWool en HR IcyFoam staan wel genoemd in de bestaande Gijs-content
// (lib/content/measure-details.ts), maar de enige aangetroffen bronbladen
// hiervoor (Brochure-Natuwool.pdf, Brochure-dakisolatie-Icynene.pdf) zijn
// lege cloud-only placeholders (0 bytes) — geen inhoud beschikbaar. Deze
// twee zijn daarom bewust niet als materiaalkaart opgenomen.
export const DAK_PRODUCTS = [
  {
    name: "HR Wood-Fibre",
    group: "Houtvezel",
    badge: "Houtvezel, inblaastoepassing",
    image: "/productbladen/woodfibre.png",
    alt: "HR Wood-Fibre houtvezelisolatie voor dakisolatie",
    text: "Houtvezelisolatie voor inblaastoepassingen, geschikt voor het isoleren van gesloten holle ruimtes en als liggende isolatie in horizontale constructies.",
    benefits: [
      "Uitstekende warmte-isolatie en warmte-accumulatievermogen",
      "Dampopen en vochtregulerend",
      "Gemaakt van duurzame, hernieuwbare grondstof: hout",
      "Bouwbiologisch product met NaturePlus-certificaat",
    ],
  },
  {
    name: "HR TimberWool",
    group: "Isolatiewol",
    badge: "Isolatiewol, inblaastoepassing",
    image: "/productbladen/TimberWool.png",
    alt: "HR TimberWool inblaaswol voor dakisolatie",
    text: "Inblaaswol voor het thermisch en akoestisch na-isoleren van hellende dakconstructies en houten verdiepingsvloeren, toepasbaar bij een framediepte van 70 tot 350 mm.",
    benefits: [
      "Hoge thermische en akoestische isolatiewaarde",
      "Zakt niet in en is ongevoelig voor vocht",
      "Onbrandbaar (brandklasse A1)",
      "Bevat geen kunstmatige kleurstoffen of chemicaliën",
    ],
  },
  {
    name: "HR EcoFoil Roof",
    group: "Andere systemen",
    badge: "Reflecterend foliesysteem",
    image: "/productbladen/pif_folie_voorbeeld-removebg-preview.png",
    alt: "HR EcoFoil Roof reflecterende folie-isolatie voor dakisolatie",
    text: "Dampdichte en vochtwerende isolatie die aan de binnenzijde van hellende daken kan worden toegepast, opgebouwd uit meerdere lagen warmte-reflecterend aluminium.",
    benefits: [
      "Zeer flexibel en makkelijk op maat te snijden",
      "Geringe dikte",
      "Volledig recyclebaar en niet corrosief",
      "Geen voedingsbodem voor ongedierte",
    ],
  },
];
