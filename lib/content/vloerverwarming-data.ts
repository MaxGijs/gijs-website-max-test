// Vloerverwarming-gegevens. Uitsluitend overgenomen uit de 9 bronbestanden
// die zijn aangeleverd via "Archief.zip" (public/productbladen/), plus de
// reeds bestaande, generieke Gijs-tekst in lib/content/measure-details.ts.
// Zie het eindverslag voor de volledige per-claim bronverwijzing.
//
// BRONNEN:
// - eco2floor-opstartprotocol.pdf (eco2floor/OP/V2/04.11.20): het volledige
//   opstartprotocol (dag/watertemperatuur/dagen-tabel) en de
//   restvochtpercentages per vloerbedekkingstype. Dit document heeft GEEN
//   tekstlaag (volledig als afbeelding aangeleverd) — alle cijfers zijn
//   overgenomen door de pagina's visueel te renderen en te lezen, niet via
//   automatische tekstextractie.
// - eco2floor-lijmadviezen.pdf (eco2floor/LF/V1/04.04.22): algemeen
//   stappenplan voor het beleggen van de vloer. De lijst met 9
//   lijmfabrikanten (Ardex, Coba, Forbo Eurocol, Kiwitz, Mapei, Omnicol,
//   PCI-BASF, Sika-Schönox, Uzin Utz) is NIET overgenomen op de pagina —
//   dit is installateurs-/vakhandelinformatie, geen consumentencontent.
// - ECOCEM-Folder-3luik.pdf: consumentgerichte kenmerken (droogtijden,
//   sterkteklasse, duurzaamheid, toepassing in natte ruimtes).
// - ECOCEM-Technical-Datasheet-A4-HR.pdf: installateursniveau technische
//   gegevens (laagdiktes, druksterkte, soortelijk gewicht, opbrengsttabel,
//   nabehandeling) — gebruikt voor het "Bekijk technische gegevens"-blok.
// - RIHO-BOXER-VERDELER.pdf, RIHO-Boxer-LTV-verdeler.pdf,
//   RIHO-VK-VERDELER.pdf, RIHO-KUNSTSTOF-VK-VERDELER.pdf: verdelergegevens.
//   Consumentvriendelijk samengevat tot 2 categorieën (cv-ketel /
//   warmtepomp-laagtemperatuursysteem); de volledige productbladen met
//   maatvoering, artikelnummers en pompkarakteristieken staan achter
//   "Bekijk technische gegevens".
// - Brochure-Isolatiebeton-Twente.pdf: generieke brochure van een externe
//   producent (Isolatiebeton Twente BV, geen Gijs-merk). Alleen het
//   consument-relevante gegeven "isolatiebeton kan bij het renoveren van
//   een houten vloer als stabiele, isolerende basis in de kruipruimte
//   worden gebruikt, met optioneel vloerverwarming erin" is overgenomen —
//   dit dekt zich met de reeds bestaande Gijs-tekst in measure-details.ts
//   ("Bij Gijs worden schuimbeton... uitsluitend toegepast in combinatie
//   met vloerverwarming"). Contactgegevens, KVK/BTW en de volledige
//   toepassingenlijst (funderen, damwanden, zwembaden, rioleringen) zijn
//   NIET gebruikt: niet relevant voor vloerverwarming, en Isolatiebeton
//   Twente wordt niet als Gijs-merk gepresenteerd.
//
// NIET GEBRUIKT (bewust weggelaten): alle contactgegevens/KVK/BTW van
// Isolatiebeton Twente en de lijmfabrikanten-lijst; de volledige
// toepassingentabel van isolatiebeton (soortelijk gewicht/druksterkte/
// Rc-waarde per type — installateursniveau, niet consument-relevant).
//
// TEGENSTRIJDIGHEID TUSSEN BRONNEN (bewust niet zelf opgelost): de
// ECOCEM-Technical-Datasheet-A4-HR.pdf noemt in de tabel "Eigenschappen
// verhard product" onder "Verwarming aanzetten": "Na 5 dagen (protocol)".
// Het specifieke, gedetailleerde eco2floor-opstartprotocol.pdf noemt
// echter expliciet "op zijn vroegst 3 dagen" met als eerste stap in de
// tabel dag 4 (20°C). Deze pagina toont uitsluitend de tabel uit het
// dedicated opstartprotocol-document (de meest specifieke en recente
// bron voor dit exacte gegeven); het "5 dagen"-cijfer uit het technisch
// datasheet is niet getoond. Zie eindverslag.

import type { UitvoeringStap } from "@/components/measures/UitvoeringStappen";

export type VerdelerGroep = {
  naam: string;
  toepassing: string;
  image: string;
  imageAlt: string;
  kenmerken: string[];
  technisch: { label: string; waarde: string }[];
};

// Bron: RIHO-BOXER-VERDELER.pdf. Kenmerken zijn bewust consumentvriendelijk
// samengevat (vereenvoudiging voor leken); de volledige, technische
// omschrijving (debietregeling, hydraulische neutraliteit, pompmodel/
// -standen) staat hieronder bij `technisch`.
export const VERDELER_CVKETEL: VerdelerGroep = {
  naam: "Verdeler voor een cv-ketel",
  toepassing: "Voor een woning met een cv-ketel.",
  image: "/images/maatregelen/vloerverwarming/vloerverwarming-verdeler-cvketel.png",
  imageAlt: "Verdeler voor vloerverwarming op een cv-ketel",
  kenmerken: [
    "De temperatuur van het water naar de vloerverwarming is in te stellen tussen 20 en 50°C",
    "Elke kamer krijgt via een eigen aansluiting genoeg warm water",
    "Beïnvloedt de werking van je cv-ketel niet",
  ],
  technisch: [
    { label: "Aansluiting primair", waarde: "DN 15 (1/2\") bi of DN 20 (3/4\") bi" },
    { label: "Aansluiting secundair", waarde: "3/4\" buitendraad, Euroconus" },
    { label: "Hoogte", waarde: "460 mm" },
    { label: "Diepte", waarde: "180 mm" },
    { label: "Breedte", waarde: "240 mm (2 groepen) tot 890 mm (15 groepen)" },
    { label: "Debietregeling", waarde: "Instelbaar per verwarmingsgroep" },
    { label: "Hydraulische afstemming", waarde: "100% hydraulisch neutraal: beïnvloedt de doorstroming in het cv-systeem niet" },
    { label: "Circulatiepomp", waarde: "Stand 1: max. 1,5 m opvoerhoogte / 3,4 m³/h · Stand 2: max. 3 m / 2,8 m³/h · Stand 3: max. 4,5 m / 2 m³/h · Stand 4: automatisch" },
  ],
};

// Bron: RIHO-VK-VERDELER.pdf en RIHO-KUNSTSTOF-VK-VERDELER.pdf (twee
// uitvoeringen van dezelfde verdeler, hieronder samengevoegd). Kenmerken
// zijn bewust consumentvriendelijk samengevat; de volledige technische
// omschrijving staat hieronder bij `technisch`.
export const VERDELER_WARMTEPOMP: VerdelerGroep = {
  naam: "Verdeler voor een warmtepomp",
  toepassing: "Voor een woning met een warmtepomp of een ander lage-temperatuursysteem.",
  image: "/images/maatregelen/vloerverwarming/vloerverwarming-verdeler-warmtepomp.png",
  imageAlt: "Verdeler voor vloerverwarming op een warmtepomp, ook geschikt om te koelen",
  kenmerken: [
    "Kan de vloer ook laten koelen, als de rest van het systeem dat ondersteunt",
    "De temperatuur van het water wordt geregeld door de warmtepomp zelf",
    "Elke kamer krijgt via een eigen aansluiting genoeg water",
  ],
  technisch: [
    { label: "Aansluiting primair", waarde: "1\" bi (metalen uitvoering) of DN25 1\" (kunststof uitvoering)" },
    { label: "Aansluiting secundair", waarde: "3/4\" buitendraad, Euroconus" },
    { label: "Hoogte", waarde: "355 mm (metaal) · 390 mm (kunststof)" },
    { label: "Diepte", waarde: "155 mm (metaal) · 135 mm (kunststof)" },
    { label: "Breedte", waarde: "300-950 mm (metaal, 2-15 groepen) · 250-1030 mm (kunststof, 2-15 groepen)" },
    { label: "Debietregeling", waarde: "Instelbaar per verwarmingsgroep" },
    { label: "Ook leverbaar in", waarde: "Kunststof uitvoering" },
    { label: "Kunststof uitvoering", waarde: "Medium water of water-glycol (max. 30% glycol) · max. werkdruk 6 bar · thermometerschaal 0-60°C · flowmeterschaal 0-5 l/min" },
  ],
};

// Bron: RIHO-Boxer-LTV-verdeler.pdf — een derde, flexibele verdeler die
// met beide warmtebronnen kan werken. Genoemd als korte toelichting, niet
// als aparte derde categorie (spec vraagt om het bij 2 categorieën te
// houden en er geen technische catalogus van te maken).
export const VERDELER_LTV_NOOT =
  "Er bestaat ook een verdeler die geschikt is voor zowel een hoge temperatuur systeem (cv-ketel) als een lage temperatuur verwarmings- en/of hoge temperatuur koelingsysteem (warmtepomp). Welke verdeler het beste past, bepaalt Gijs per situatie.";

// Plain-taal intro voor de verdeler-sectie (vereenvoudiging voor leken),
// afgeleid van de functiebeschrijving die in alle 4 RIHO-productbladen
// terugkomt ("de aanvoerventielen op de secundaire groepen zijn voorzien
// van een instelbare debietregeling").
export const VERDELER_INTRO =
  "De verdeler zorgt dat elke kamer via de leidingen genoeg warm water krijgt, zodat de vloer overal gelijkmatig warm wordt. Welke verdeler daarvoor wordt gebruikt, hangt af van je warmtebron.";

// Bron: eco2floor-opstartprotocol.pdf, pagina 2 — de tabel "tijden en
// temperaturen". Watertemperatuur = temperatuur van het water in de
// verwarming, uitdrukkelijk NIET de instelling van de kamerthermostaat
// (zie ook de expliciete tekst hierover op pagina 1 van het protocol).
export const OPSTART_TABEL: { dag: string; temperatuur: string; dagenAanhouden: string }[] = [
  { dag: "0", temperatuur: "uit*", dagenAanhouden: "3" },
  { dag: "4", temperatuur: "20°C", dagenAanhouden: "2" },
  { dag: "6", temperatuur: "25°C", dagenAanhouden: "1" },
  { dag: "7", temperatuur: "30°C", dagenAanhouden: "1" },
  { dag: "8", temperatuur: "35°C", dagenAanhouden: "1" },
  { dag: "9", temperatuur: "40°C", dagenAanhouden: "2" },
  { dag: "11", temperatuur: "35°C", dagenAanhouden: "1" },
  { dag: "12", temperatuur: "30°C", dagenAanhouden: "1" },
  { dag: "13", temperatuur: "25°C", dagenAanhouden: "1" },
  { dag: "14", temperatuur: "20°C", dagenAanhouden: "2" },
];
export const OPSTART_NOOT = "* Bij lage temperaturen (onder 10°C) kan de verwarming al vanaf dag 0 op 20°C worden aangezet.";

// Bron: eco2floor-opstartprotocol.pdf, pagina 2 — restvochtpercentages
// per type vloerbedekking, uitdrukkelijk aangeduid als "grove indicatie".
export const RESTVOCHT_TABEL: { type: string; toelichting: string; vereist: string; technischMogelijk: string }[] = [
  { type: "Vochtdoorlatende bedekking", toelichting: "Tapijt(tegels) met open rug, naaldvilt", vereist: "4,5%", technischMogelijk: "5,0%" },
  { type: "Vochtdichte bedekking", toelichting: "Linoleum, rubber, PVC, marmoleum", vereist: "2,5%", technischMogelijk: "3,0%" },
  { type: "Tegels/keramiek", toelichting: "Dikbed/dunbed cementgebonden lijmen, alle soorten en formaten", vereist: "4,0%", technischMogelijk: "5,5%" },
  { type: "Laminaat/parket", toelichting: "", vereist: "2,0%", technischMogelijk: "2,0%" },
  { type: "Coatings/verf", toelichting: "", vereist: "2,0%", technischMogelijk: "2,0%" },
];

// Bron: ECOCEM-Folder-3luik.pdf ("Verkorten van de gehele bouwtijd")
export const AFWERKING_TIMING = {
  beloopbaar: "24 uur",
  belastbaar: "72 uur",
  tegel: "1 week",
  overig: "2 weken",
  vochtNa14Dagen: "circa 1,5%",
};

// Bron: ECOCEM-Folder-3luik.pdf + ECOCEM-Technical-Datasheet-A4-HR.pdf —
// consument-relevante kenmerken van eco2floor, in gewone taal
// (vereenvoudiging voor leken; de materiaalsamenstelling zelf staat nu
// bij ECOFLOOR_TECHNISCH).
export const ECOFLOOR_KENMERKEN: string[] = [
  "Een vloeibare dekvloer die om de vloerverwarmingsleidingen heen wordt gegoten",
  "Beloopbaar na 24 uur, belastbaar na 72 uur",
  "Geeft de warmte van de vloerverwarming goed door aan de kamer",
  "Geschikt voor droge én natte ruimtes, zoals badkamers en keukens",
  "Beperkte krimp: geen aparte voegen nodig bij normale vloeroppervlaktes",
  "Duurzaam materiaal: gemaakt van een hergebruikt bijproduct van de staalindustrie",
];

// Bron: ECOCEM-Technical-Datasheet-A4-HR.pdf, pagina 1-4 —
// installateursniveau, getoond achter "Bekijk technische gegevens".
export const ECOFLOOR_TECHNISCH: { label: string; waarde: string }[] = [
  { label: "Materiaal", waarde: "Gemalen gegranuleerd hoogovenslak (GGBS), zelfnivellerend en verpompbaar" },
  { label: "Sterkteklasse", waarde: "C20/F4 (NEN-EN 13813)" },
  { label: "Laagdikte (algemeen)", waarde: "20-100 mm" },
  { label: "Dekking op leidingen bij vloerverwarming", waarde: "minimaal 25 mm" },
  { label: "Bij zwevende vloeren incl. vloerverwarming", waarde: "minimaal 30 mm + dikte van de leidingen" },
  { label: "Soortelijk gewicht (specie)", waarde: "2150 kg/m³" },
  { label: "Soortelijk gewicht (verhard)", waarde: "2000 kg/m³" },
  { label: "Vloeimaat", waarde: "260-290 mm" },
  { label: "Open tijd", waarde: "4 uur (bij 20°C)" },
  { label: "Druksterkte na 24 uur", waarde: "4 N/mm²" },
  { label: "Totale krimp", waarde: "< 0,2 mm/m" },
  { label: "Maximale vloeroppervlakte zonder dilatatievoeg", waarde: "1000 m² (bij een lengte/breedte-verhouding tot 6/1)" },
  { label: "Aanbrengtemperatuur", waarde: "tussen 5°C en 30°C" },
  { label: "Minimale nabehandelingstijd", waarde: "3-4 dagen (bij hoge ruimtetemperatuur, tocht of vorstgevaar)" },
];

// Bron: eco2floor-opstartprotocol.pdf + ECOCEM-Technical-Datasheet — de
// expliciete waarschuwingen/grenzen uit de bronnen.
export const ECOFLOOR_NIET_DOEN: string[] = [
  "Niet eerder dan 3 dagen na het storten de vloerverwarming activeren",
  "De watertemperatuur niet sneller dan 5°C per dag verhogen of verlagen",
  "De vloer niet warmer laten worden dan 40-45°C",
  "Tijdens het op- en afwarmen geen bouwmaterialen of afdekkingen op de vloer",
  "Niet alle verwarmingsgroepen los van elkaar op- of afwarmen: dit moet gelijktijdig",
];

// Bron: measure-details.ts (reeds bestaande, gevalideerde Gijs-tekst) +
// Brochure-Isolatiebeton-Twente.pdf, pagina 5 ("Renoveren van houten
// vloeren").
export const SYSTEEMOPBOUW = {
  bestaandeVloer: "In een geschikte bestaande vloer kunnen de leidingen worden ingefreesd. Een volledig nieuwe vloeropbouw is dan niet vanzelfsprekend nodig.",
  nieuweOpbouw: "In een nieuwe vloeropbouw bekijkt Gijs welke onderbouw en dekvloer bij je woning passen. Schuimbeton (isolatiebeton), zandcementdekvloeren en gietdekvloeren worden bij Gijs uitsluitend toegepast in combinatie met vloerverwarming.",
  isolatiebeton: "Bij het renoveren van een houten vloer kan de kruipruimte worden voorzien van isolatiebeton (schuimbeton) als stabiele, isolerende basis. De vloerverwarming kan hier optioneel in worden aangebracht, voordat de dekvloer volgt.",
};

// Bron: de aangeleverde procesvisuals voor vloerverwarming (7 stappen,
// public/images/maatregelen/vloerverwarming/proces/vloerverwarming-stap-N.svg). Nummer, icoon,
// titel en uitleg zitten in de afbeelding zelf; labels hieronder alleen
// voor de alt-tekst.
export const UITVOERING_STAPPEN: UitvoeringStap[] = [
  { bestand: "maatregelen/vloerverwarming/proces/vloerverwarming-stap-1.svg", label: "Aankomst" },
  { bestand: "maatregelen/vloerverwarming/proces/vloerverwarming-stap-2.svg", label: "Uitleg" },
  { bestand: "maatregelen/vloerverwarming/proces/vloerverwarming-stap-3.svg", label: "Voorbereiden" },
  { bestand: "maatregelen/vloerverwarming/proces/vloerverwarming-stap-4.svg", label: "Leidingen plaatsen" },
  { bestand: "maatregelen/vloerverwarming/proces/vloerverwarming-stap-5.svg", label: "Controleren" },
  { bestand: "maatregelen/vloerverwarming/proces/vloerverwarming-stap-6.svg", label: "Storten & afwerken" },
  { bestand: "maatregelen/vloerverwarming/proces/vloerverwarming-stap-7.svg", label: "Drogen & opstarten" },
];

// Praktische aandachtspunten — samengevat uit eco2floor-opstartprotocol.pdf
// (pagina 1, "BELANGRIJK") en de bestaande Gijs-tekst over de afwerkvloer.
export const AANDACHTSPUNTEN_VOOR: string[] = [
  "De ruimte is tijdens het op- en afwarmen vrij van bouwmaterialen en afdekkingen, zodat het vocht kan ontsnappen",
  "De ruimte waarin de vloer zich bevindt, is goed geventileerd",
  "Levering en plaatsing van de uiteindelijke afwerkvloer worden apart afgesproken",
];
export const AANDACHTSPUNTEN_NA: string[] = [
  "Het opstartprotocol wordt minimaal één keer volledig doorlopen vóór de vloer verder wordt afgewerkt",
  "Een volledig doorlopen protocol vervangt geen daadwerkelijke vochtmeting. Bij twijfel is een CM-meting de enige betrouwbare methode",
  "Vermijd tijdens gebruik een snelle stijging of daling van de vloertemperatuur, en verschillende temperaturen binnen één vloerveld",
];

// Voordelen — uitsluitend gebaseerd op de gesourcte eco2floor-eigenschappen
// (niet overdreven met algemene, ongesourcte vloerverwarming-claims).
export const VOORDELEN: string[] = [
  "Snelle droogtijd: beloopbaar na 24 uur, belastbaar na 72 uur",
  "Efficiënte warmteafgifte door de goede omsluiting van de leidingen",
  "Beperkte krimp, geen dilatatievoegen nodig",
  "Geschikt voor droge én natte ruimtes",
];
