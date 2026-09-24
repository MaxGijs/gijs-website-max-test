// Zonnepanelen-productgegevens. Uitsluitend overgenomen uit de door Gijs
// aangeleverde datasheets (JASolar460.pdf, Aiko440wp.pdf, de twee Jinko
// Tiger Neo-datasheets). Elk cijfer hieronder is te herleiden tot een van
// deze bronnen — zie het eindverslag voor de volledige bronverwijzing per
// gegeven. Er is bewust GEEN opbrengst, terugverdientijd, prijs of advies
// over aantal panelen opgenomen (niet in de bronnen, en expliciet niet
// gevraagd).
//
// Belangrijk: Jinko levert twee technisch verschillende productlijnen die
// beide "Tiger Neo N-type" heten maar een andere celtechniek-aanduiding,
// afmeting en mechanische belasting hebben (54HL4-B vs 54HL4R-B). Deze
// worden daarom als twee aparte producten getoond, niet samengevoegd.
//
// Rendement = modulerendement (celrendement, bijv. JA Solar's "tot 26%",
// is een ander getal en wordt bewust niet getoond naast modulerendement,
// om de twee begrippen niet door elkaar te halen).
//
// Garantie: per merk apart gehouden. Aiko wijkt af van JA Solar/Jinko
// (0,35%/jaar in plaats van 0,4%/jaar) — dit is een echt, bevestigd
// verschil tussen de bronnen en wordt niet gelijkgetrokken.
export type ElektrischeVariant = {
  type: string;
  pmaxStc: string;
  pmaxNoct: string;
  vocStc: string;
  vmpStc: string;
  iscStc: string;
  impStc: string;
  efficientie: string;
};

export type ZonnepaneelProduct = {
  merk: string;
  naam: string;
  ondertitel: string;
  vermogen: string;
  celtype: string;
  aantalCellen: string;
  afmetingen: string;
  gewicht: string;
  rendement: string;
  garantieProduct: string;
  garantieVermogen: string;
  degradatie: string;
  maxSysteemspanning: string;
  mechanischeBelasting: string;
  junctionBox: string;
  connector?: string;
  image: string;
  imageAlt: string;
  kenmerken: string[];
  varianten: ElektrischeVariant[];
};

export const ZONNEPANEEL_PRODUCTEN: ZonnepaneelProduct[] = [
  {
    merk: "JA Solar",
    naam: "JA Solar JAM54D41 LR",
    ondertitel: "n-type dubbelglas monofaciale module",
    vermogen: "440 - 465 Wp",
    celtype: "Mono (n-type)",
    aantalCellen: "108 (6×18)",
    afmetingen: "1762 × 1134 × 30 mm",
    gewicht: "22 kg",
    rendement: "22,0% - 23,3%",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar lineaire vermogensgarantie",
    degradatie: "1% degradatie in het eerste jaar, daarna 0,4% per jaar over 30 jaar",
    maxSysteemspanning: "1500 V DC",
    mechanischeBelasting: "Voorzijde 5400 Pa, achterzijde 2400 Pa",
    junctionBox: "IP68, 3 bypass-diodes",
    connector: "QC 4.10-351 / MC4-EVO2A",
    image: "/productbladen/zonnepanelen-jasolar.png",
    imageAlt: "JA Solar JAM54D41 LR zonnepaneel",
    kenmerken: [
      "n-Bycium+ halfcelltechnologie (16BB)",
      "n-type cellen met lagere lichtinductie-degradatie (LID)",
      "Betere temperatuurcoëfficiënt",
      "Beter rendement bij weinig licht",
    ],
    varianten: [
      { type: "JAM54D41-440/LR", pmaxStc: "440 Wp", pmaxNoct: "333 Wp", vocStc: "38,90 V", vmpStc: "32,47 V", iscStc: "14,31 A", impStc: "13,55 A", efficientie: "22,0%" },
      { type: "JAM54D41-445/LR", pmaxStc: "445 Wp", pmaxNoct: "337 Wp", vocStc: "39,10 V", vmpStc: "32,65 V", iscStc: "14,40 A", impStc: "13,63 A", efficientie: "22,3%" },
      { type: "JAM54D41-450/LR", pmaxStc: "450 Wp", pmaxNoct: "341 Wp", vocStc: "40,30 V", vmpStc: "32,99 V", iscStc: "14,41 A", impStc: "13,64 A", efficientie: "22,5%" },
      { type: "JAM54D41-455/LR", pmaxStc: "455 Wp", pmaxNoct: "344 Wp", vocStc: "40,50 V", vmpStc: "33,33 V", iscStc: "14,42 A", impStc: "13,65 A", efficientie: "22,8%" },
      { type: "JAM54D41-460/LR", pmaxStc: "460 Wp", pmaxNoct: "348 Wp", vocStc: "40,60 V", vmpStc: "33,68 V", iscStc: "14,43 A", impStc: "13,66 A", efficientie: "23,0%" },
      { type: "JAM54D41-465/LR", pmaxStc: "465 Wp", pmaxNoct: "352 Wp", vocStc: "40,70 V", vmpStc: "34,02 V", iscStc: "14,44 A", impStc: "13,67 A", efficientie: "23,3%" },
    ],
  },
  {
    merk: "Aiko",
    naam: "Aiko AIKO-A-MAH54Db",
    ondertitel: "N-type ABC dubbelglas module",
    vermogen: "440 - 455 Wp",
    celtype: "N-type ABC",
    aantalCellen: "108 (6×18)",
    afmetingen: "1722 × 1134 × 30 mm",
    gewicht: "24,0 kg (±5%)",
    rendement: "22,5% - 23,3%",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar lineaire vermogensgarantie",
    degradatie: "Maximaal 1% degradatie in het eerste jaar, daarna maximaal 0,35% per jaar (jaar 2 t/m 30)",
    maxSysteemspanning: "1500 V DC",
    mechanischeBelasting: "Voorzijde 5400 Pa, achterzijde 2400 Pa",
    junctionBox: "IP68, 3 bypass-diodes",
    connector: "MC4 EVO2",
    image: "/productbladen/zonnepanelen-aiko.png",
    imageAlt: "Aiko AIKO-A-MAH54Db zonnepaneel",
    kenmerken: [
      "N-type ABC-celtechnologie zonder rasterlijnen aan de voorzijde (full black design)",
      "Hogere energieopbrengst per paneel",
      "Geoptimaliseerd voor lagere kosten aan montage, bekabeling en arbeid",
    ],
    varianten: [
      { type: "AIKO-A440-MAH54Db", pmaxStc: "440 Wp", pmaxNoct: "332 Wp", vocStc: "40,05 V", vmpStc: "33,69 V", iscStc: "13,62 A", impStc: "13,07 A", efficientie: "22,5%" },
      { type: "AIKO-A445-MAH54Db", pmaxStc: "445 Wp", pmaxNoct: "336 Wp", vocStc: "40,15 V", vmpStc: "33,79 V", iscStc: "13,68 A", impStc: "13,18 A", efficientie: "22,8%" },
      { type: "AIKO-A450-MAH54Db", pmaxStc: "450 Wp", pmaxNoct: "339 Wp", vocStc: "40,25 V", vmpStc: "33,89 V", iscStc: "13,74 A", impStc: "13,28 A", efficientie: "23,0%" },
      { type: "AIKO-455-MAH54Db", pmaxStc: "455 Wp", pmaxNoct: "343 Wp", vocStc: "40,35 V", vmpStc: "33,99 V", iscStc: "13,80 A", impStc: "13,39 A", efficientie: "23,3%" },
    ],
  },
  {
    merk: "Jinko",
    naam: "Jinko Tiger Neo 54HL4-B",
    ondertitel: "N-type all-black module",
    vermogen: "425 Wp",
    celtype: "N-type mono-kristallijn",
    aantalCellen: "108 (6×18)",
    afmetingen: "1722 × 1134 × 30 mm",
    gewicht: "22 kg",
    rendement: "21,76%",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar lineaire vermogensgarantie",
    degradatie: "0,4% per jaar over 30 jaar",
    maxSysteemspanning: "1000 V DC (IEC)",
    mechanischeBelasting: "Wind 2400 Pa, sneeuw 5400 Pa",
    junctionBox: "IP68",
    image: "/productbladen/zonnepanelen-jinko.png",
    imageAlt: "Jinko Tiger Neo 54HL4-B zonnepaneel",
    kenmerken: [
      "SMBB-technologie voor betere lichtopvang en stroomopbrengst",
      "Hot 2.0-technologie: betere betrouwbaarheid en lagere LID/LETID",
      "PID-bestendig",
      "Bestand tegen zilte lucht en ammoniak",
    ],
    varianten: [
      { type: "JKM425N-54HL4-B", pmaxStc: "425 Wp", pmaxNoct: "320 Wp", vocStc: "38,95 V", vmpStc: "32,37 V", iscStc: "13,58 A", impStc: "13,13 A", efficientie: "21,76%" },
    ],
  },
  {
    merk: "Jinko",
    naam: "Jinko Tiger Neo 54HL4R-B",
    ondertitel: "N-type all-black module",
    vermogen: "420 - 440 Wp",
    celtype: "N-type mono-kristallijn",
    aantalCellen: "108 (6×18)",
    afmetingen: "1762 × 1134 × 30 mm",
    gewicht: "22 kg",
    rendement: "21,02% - 22,02%",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar lineaire vermogensgarantie",
    degradatie: "0,4% per jaar over 30 jaar",
    maxSysteemspanning: "1000 V DC (IEC)",
    mechanischeBelasting: "Wind 4000 Pa, sneeuw 6000 Pa",
    junctionBox: "IP68",
    image: "/productbladen/zonnepanelen-jinko.png",
    imageAlt: "Jinko Tiger Neo 54HL4R-B zonnepaneel",
    kenmerken: [
      "SMBB-technologie voor betere lichtopvang en stroomopbrengst",
      "Hot 2.0-technologie: betere betrouwbaarheid en lagere LID/LETID",
      "PID-bestendig",
      "Verhoogde mechanische belastbaarheid (wind en sneeuw)",
    ],
    varianten: [
      { type: "JKM420N-54HL4R-B", pmaxStc: "420 Wp", pmaxNoct: "316 Wp", vocStc: "38,74 V", vmpStc: "32,16 V", iscStc: "13,51 A", impStc: "13,06 A", efficientie: "21,02%" },
      { type: "JKM425N-54HL4R-B", pmaxStc: "425 Wp", pmaxNoct: "320 Wp", vocStc: "38,95 V", vmpStc: "32,37 V", iscStc: "13,58 A", impStc: "13,13 A", efficientie: "21,27%" },
      { type: "JKM430N-54HL4R-B", pmaxStc: "430 Wp", pmaxNoct: "323 Wp", vocStc: "39,16 V", vmpStc: "32,58 V", iscStc: "13,65 A", impStc: "13,20 A", efficientie: "21,52%" },
      { type: "JKM435N-54HL4R-B", pmaxStc: "435 Wp", pmaxNoct: "327 Wp", vocStc: "39,36 V", vmpStc: "32,78 V", iscStc: "13,72 A", impStc: "13,27 A", efficientie: "21,77%" },
      { type: "JKM440N-54HL4R-B", pmaxStc: "440 Wp", pmaxNoct: "331 Wp", vocStc: "39,57 V", vmpStc: "32,99 V", iscStc: "13,80 A", impStc: "13,34 A", efficientie: "22,02%" },
    ],
  },
];

// Vereenvoudigde merksamenvatting voor de hoofdproductkaarten en de
// vergelijkingstabel (leken-niveau: 5 kerngegevens, geen volledige
// datasheet-tabel). Jinko's twee productlijnen (zie ZONNEPANEEL_PRODUCTEN
// hierboven) zijn hier samengevoegd tot één "Jinko"-kaart met een
// vermogen- en rendementsbereik dat de unie van beide lijnen dekt, en een
// afmetingenveld dat beide daadwerkelijke maten toont (geen gemiddelde of
// verzonnen tussenwaarde). De volledige, ongesamenvatte gegevens per
// productlijn staan in het inklapbare technische blok op de pagina.
export type ZonnepaneelMerkSamenvatting = {
  merk: string;
  naam: string;
  vermogen: string;
  rendement: string;
  afmetingen: string;
  gewicht: string;
  garantieProduct: string;
  garantieVermogen: string;
  image: string;
  imageAlt: string;
};

export const ZONNEPANEEL_MERKEN: ZonnepaneelMerkSamenvatting[] = [
  {
    merk: "JA Solar",
    naam: "JAM54D41 LR",
    vermogen: "440 - 465 Wp",
    rendement: "22,0% - 23,3%",
    afmetingen: "1762 × 1134 × 30 mm",
    gewicht: "22 kg",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar vermogensgarantie",
    image: "/productbladen/zonnepanelen-jasolar.png",
    imageAlt: "JA Solar JAM54D41 LR zonnepaneel",
  },
  {
    merk: "Aiko",
    naam: "AIKO-A-MAH54Db",
    vermogen: "440 - 455 Wp",
    rendement: "22,5% - 23,3%",
    afmetingen: "1722 × 1134 × 30 mm",
    gewicht: "24,0 kg",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar vermogensgarantie",
    image: "/productbladen/zonnepanelen-aiko.png",
    imageAlt: "Aiko AIKO-A-MAH54Db zonnepaneel",
  },
  {
    merk: "Jinko",
    naam: "Tiger Neo N-type",
    vermogen: "420 - 440 Wp",
    rendement: "21,02% - 22,02%",
    afmetingen: "1722 mm / 1762 mm (afhankelijk van uitvoering)",
    gewicht: "22 kg",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar vermogensgarantie",
    image: "/productbladen/zonnepanelen-jinko.png",
    imageAlt: "Jinko Tiger Neo N-type zonnepaneel",
  },
];
