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
    merk: "Zonnepaneel",
    naam: "Dubbelglas zonnepaneel",
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
    image: "/images/maatregelen/zonnepanelen/zonnepanelen-jasolar.png",
    imageAlt: "Dubbelglas zonnepaneel",
    kenmerken: [
      "n-Bycium+ halfcelltechnologie (16BB)",
      "n-type cellen met lagere lichtinductie-degradatie (LID)",
      "Betere temperatuurcoëfficiënt",
      "Beter rendement bij weinig licht",
    ],
    varianten: [
      { type: "440 Wp", pmaxStc: "440 Wp", pmaxNoct: "333 Wp", vocStc: "38,90 V", vmpStc: "32,47 V", iscStc: "14,31 A", impStc: "13,55 A", efficientie: "22,0%" },
      { type: "445 Wp", pmaxStc: "445 Wp", pmaxNoct: "337 Wp", vocStc: "39,10 V", vmpStc: "32,65 V", iscStc: "14,40 A", impStc: "13,63 A", efficientie: "22,3%" },
      { type: "450 Wp", pmaxStc: "450 Wp", pmaxNoct: "341 Wp", vocStc: "40,30 V", vmpStc: "32,99 V", iscStc: "14,41 A", impStc: "13,64 A", efficientie: "22,5%" },
      { type: "455 Wp", pmaxStc: "455 Wp", pmaxNoct: "344 Wp", vocStc: "40,50 V", vmpStc: "33,33 V", iscStc: "14,42 A", impStc: "13,65 A", efficientie: "22,8%" },
      { type: "460 Wp", pmaxStc: "460 Wp", pmaxNoct: "348 Wp", vocStc: "40,60 V", vmpStc: "33,68 V", iscStc: "14,43 A", impStc: "13,66 A", efficientie: "23,0%" },
      { type: "465 Wp", pmaxStc: "465 Wp", pmaxNoct: "352 Wp", vocStc: "40,70 V", vmpStc: "34,02 V", iscStc: "14,44 A", impStc: "13,67 A", efficientie: "23,3%" },
    ],
  },
  {
    merk: "Zonnepaneel",
    naam: "Full black dubbelglas zonnepaneel",
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
    image: "/images/maatregelen/zonnepanelen/zonnepanelen-aiko.png",
    imageAlt: "Full black dubbelglas zonnepaneel",
    kenmerken: [
      "N-type ABC-celtechnologie zonder rasterlijnen aan de voorzijde (full black design)",
      "Hogere energieopbrengst per paneel",
      "Geoptimaliseerd voor lagere kosten aan montage, bekabeling en arbeid",
    ],
    varianten: [
      { type: "440 Wp", pmaxStc: "440 Wp", pmaxNoct: "332 Wp", vocStc: "40,05 V", vmpStc: "33,69 V", iscStc: "13,62 A", impStc: "13,07 A", efficientie: "22,5%" },
      { type: "445 Wp", pmaxStc: "445 Wp", pmaxNoct: "336 Wp", vocStc: "40,15 V", vmpStc: "33,79 V", iscStc: "13,68 A", impStc: "13,18 A", efficientie: "22,8%" },
      { type: "450 Wp", pmaxStc: "450 Wp", pmaxNoct: "339 Wp", vocStc: "40,25 V", vmpStc: "33,89 V", iscStc: "13,74 A", impStc: "13,28 A", efficientie: "23,0%" },
      { type: "455 Wp", pmaxStc: "455 Wp", pmaxNoct: "343 Wp", vocStc: "40,35 V", vmpStc: "33,99 V", iscStc: "13,80 A", impStc: "13,39 A", efficientie: "23,3%" },
    ],
  },
  {
    merk: "Zonnepaneel",
    naam: "All-black zonnepaneel",
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
    image: "/images/maatregelen/zonnepanelen/zonnepanelen-jinko.png",
    imageAlt: "All-black zonnepaneel",
    kenmerken: [
      "SMBB-technologie voor betere lichtopvang en stroomopbrengst",
      "Hot 2.0-technologie: betere betrouwbaarheid en lagere LID/LETID",
      "PID-bestendig",
      "Bestand tegen zilte lucht en ammoniak",
    ],
    varianten: [
      { type: "425 Wp", pmaxStc: "425 Wp", pmaxNoct: "320 Wp", vocStc: "38,95 V", vmpStc: "32,37 V", iscStc: "13,58 A", impStc: "13,13 A", efficientie: "21,76%" },
    ],
  },
  {
    merk: "Zonnepaneel",
    naam: "All-black zonnepaneel, extra bestand tegen wind en sneeuw",
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
    image: "/images/maatregelen/zonnepanelen/zonnepanelen-jinko.png",
    imageAlt: "All-black zonnepaneel, extra bestand tegen wind en sneeuw",
    kenmerken: [
      "SMBB-technologie voor betere lichtopvang en stroomopbrengst",
      "Hot 2.0-technologie: betere betrouwbaarheid en lagere LID/LETID",
      "PID-bestendig",
      "Verhoogde mechanische belastbaarheid (wind en sneeuw)",
    ],
    varianten: [
      { type: "420 Wp", pmaxStc: "420 Wp", pmaxNoct: "316 Wp", vocStc: "38,74 V", vmpStc: "32,16 V", iscStc: "13,51 A", impStc: "13,06 A", efficientie: "21,02%" },
      { type: "425 Wp", pmaxStc: "425 Wp", pmaxNoct: "320 Wp", vocStc: "38,95 V", vmpStc: "32,37 V", iscStc: "13,58 A", impStc: "13,13 A", efficientie: "21,27%" },
      { type: "430 Wp", pmaxStc: "430 Wp", pmaxNoct: "323 Wp", vocStc: "39,16 V", vmpStc: "32,58 V", iscStc: "13,65 A", impStc: "13,20 A", efficientie: "21,52%" },
      { type: "435 Wp", pmaxStc: "435 Wp", pmaxNoct: "327 Wp", vocStc: "39,36 V", vmpStc: "32,78 V", iscStc: "13,72 A", impStc: "13,27 A", efficientie: "21,77%" },
      { type: "440 Wp", pmaxStc: "440 Wp", pmaxNoct: "331 Wp", vocStc: "39,57 V", vmpStc: "32,99 V", iscStc: "13,80 A", impStc: "13,34 A", efficientie: "22,02%" },
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
    merk: "Dubbelglas zonnepaneel",
    naam: "N-type, monofaciaal",
    vermogen: "440 - 465 Wp",
    rendement: "22,0% - 23,3%",
    afmetingen: "1762 × 1134 × 30 mm",
    gewicht: "22 kg",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar vermogensgarantie",
    image: "/images/maatregelen/zonnepanelen/zonnepanelen-jasolar.png",
    imageAlt: "Dubbelglas zonnepaneel",
  },
  {
    merk: "Full black dubbelglas zonnepaneel",
    naam: "Zonder rasterlijnen aan de voorzijde",
    vermogen: "440 - 455 Wp",
    rendement: "22,5% - 23,3%",
    afmetingen: "1722 × 1134 × 30 mm",
    gewicht: "24,0 kg",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar vermogensgarantie",
    image: "/images/maatregelen/zonnepanelen/zonnepanelen-aiko.png",
    imageAlt: "Full black dubbelglas zonnepaneel",
  },
  {
    merk: "All-black zonnepaneel",
    naam: "N-type, twee uitvoeringen",
    vermogen: "420 - 440 Wp",
    rendement: "21,02% - 22,02%",
    afmetingen: "1722 mm / 1762 mm (afhankelijk van uitvoering)",
    gewicht: "22 kg",
    garantieProduct: "25 jaar productgarantie",
    garantieVermogen: "30 jaar vermogensgarantie",
    image: "/images/maatregelen/zonnepanelen/zonnepanelen-jinko.png",
    imageAlt: "All-black zonnepaneel",
  },
];
