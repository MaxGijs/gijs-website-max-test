// Inhoud voor de pagina /zo-werkt-gijs. Gebaseerd op de bestaande
// werkwijze van de digitale woningscan (zie components/woning/WoningFlow.tsx)
// en op veilige, tijdloze procesinformatie — geen prijzen, subsidiebedragen,
// technische prestaties of oude certificeringsclaims.
export type ZoWerktGijsFase = {
  nummer: number;
  titel: string;
  onderdelen: string[];
  toelichting: string;
};

export const ZO_WERKT_GIJS_FASEN: ZoWerktGijsFase[] = [
  {
    nummer: 1,
    titel: "Vind jouw woning",
    onderdelen: ["Adres invoeren", "Woning herkennen", "Adres bevestigen"],
    toelichting:
      "Je vult je postcode en huisnummer in. Gijs zoekt je adres op en laat een voorbeeldwoning zien die op je situatie lijkt. Jij bevestigt of dit klopt, of vult je adres zelf in.",
  },
  {
    nummer: 2,
    titel: "Bouw jouw digitale woning",
    onderdelen: ["Woninggegevens controleren", "Woningtype kiezen", "Bestaande isolatie en installaties vastleggen"],
    toelichting:
      "Je controleert de automatisch gevonden woninggegevens en past aan wat niet klopt. Je kiest het woningtype dat het best bij je huis past en geeft aan wat je woning al heeft, zoals isolatie of zonnepanelen, zodat Gijs dit niet opnieuw voorstelt.",
  },
  {
    nummer: 3,
    titel: "Bekijk de mogelijkheden",
    onderdelen: ["Maatregelen bekijken", "Interesse aangeven", "Woning verder aanvullen"],
    toelichting:
      "Je bekijkt welke maatregelen er voor een woning als de jouwe bestaan, van dakisolatie tot een warmtepomp. Je geeft aan waar je interesse in hebt; dit is nog geen definitieve keuze en je hoeft nog niets te weten.",
  },
  {
    nummer: 4,
    titel: "Maak Mijn woningplan",
    onderdelen: ["Maatregelen bundelen", "Woningdossier aanvullen", "Rapport voorbereiden"],
    toelichting:
      "De maatregelen waar je interesse in toonde, komen samen in Mijn woningplan. Samen met je woningdossier vormt dit de voorbereiding op het gesprek met een adviseur.",
  },
  {
    nummer: 5,
    titel: "Bespreek het met Gijs",
    onderdelen: ["Energiescan", "Adviseur controleert", "Aanvullende info", "Vervolgstap bespreken"],
    toelichting:
      "Tijdens een gratis en vrijblijvende energiescan aan huis bekijkt een adviseur van Gijs je woning en je woningplan. De adviseur neemt de bestaande situatie op, bijvoorbeeld door te meten en te kijken naar de constructie, controleert wat technisch bij je woning past, vult ontbrekende informatie aan en bespreekt met je wat een logische vervolgstap is.",
  },
  {
    nummer: 6,
    titel: "Van woningplan naar uitvoering",
    onderdelen: ["Afspraken over de uitvoering"],
    toelichting:
      "Kies je ervoor om verder te gaan? Dan bespreekt Gijs met je hoe de uitvoering eruitziet. De details hiervan bespreek je persoonlijk met je adviseur.",
  },
];

// Jan Janssen is uitdrukkelijk mockdata: een verzonnen "Voorbeeld" om te
// laten zien hoe een woningplan eruit kan zien. Geen echte klantgegevens,
// geen bedragen en geen technische beoordelingen.
export const JAN_JANSSEN_VOORBEELD = {
  naam: "Jan Janssen",
  adres: "Voorbeeldstraat 12, Voorbeeldstad",
  woningtype: "Hoekwoning",
  maatregelen: ["Dakisolatie", "Spouwisolatie", "Zonnepanelen"],
  woningplan: [
    "3 maatregelen geselecteerd als interesse: dakisolatie, spouwisolatie en zonnepanelen",
    "Woninggegevens gecontroleerd en aangevuld waar nodig",
    "Voorbereid als gespreksonderwerp voor de energiescan",
  ],
  rapport: [
    "Overzicht van de huidige situatie van de woning",
    "De maatregelen waarin interesse is getoond",
    "Ruimte voor het advies van de adviseur na de energiescan",
  ],
};
