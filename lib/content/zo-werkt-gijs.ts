// Inhoud voor /zo-werkt-gijs. Beschrijft dezelfde, al bestaande digitale
// woningscan als components/woning/WoningFlow.tsx, maar dan in klant-
// taal: geen API's, geen BAG-ID's, geen database, geen Supabase of Resend.
// Geen prijzen, subsidiebedragen of technische prestaties verzinnen; waar
// bedragen horen te staan (hoofdstuk 3) wordt alleen benoemd dát en wanneer
// die komen, nooit een voorbeeldbedrag.

export type ZoWerktGijsHoofdstuk = {
  nummer: number;
  titel: string;
  kop: string;
  tekst: string;
};

export const HOOFDSTUKKEN: ZoWerktGijsHoofdstuk[] = [
  {
    nummer: 1,
    titel: "Eerst je woning",
    kop: "Je begint met je adres, niet met een product.",
    tekst:
      "Je vult je postcode en huisnummer in. Gijs gebruikt beschikbare woningregistraties en laat zien wat daarin al bekend is: je woningtype, bouwjaar, woonoppervlakte en, waar beschikbaar, je energielabel. Dit is het begin van je woningdossier, dat tijdens de klantreis steeds completer wordt.",
  },
  {
    nummer: 2,
    titel: "Maak het beeld completer",
    kop: "Vertel wat je weet. De rest kan later.",
    tekst:
      "Niet alles hoeft meteen bekend te zijn. Klopt een gegeven niet, of weet je het antwoord niet? Dan pas je het aan of kies je gewoon ‘Ik weet het niet’. Je komt er nooit vast te zitten: ontbrekende informatie wordt later tijdens de energiescan aangevuld.",
  },
  {
    nummer: 3,
    titel: "Jouw woningplan",
    kop: "Bekijk wat bij je woning past.",
    tekst:
      "Op basis van je woninggegevens en waar je interesse in hebt, laat Gijs zien welke maatregelen voor een woning als de jouwe relevant kunnen zijn, van dakisolatie tot een warmtepomp. Geschat oppervlak, indicatieve investering, indicatieve subsidie en een indicatief netto bedrag verschijnen zodra daar voldoende gegevens voor bekend zijn, en worden daarna altijd door Gijs gecontroleerd. Staat er iets niet tussen de maatregelen dat je wel wilt bespreken? Ook daar is ruimte voor.",
  },
  {
    nummer: 4,
    titel: "Stuur je plan naar Gijs",
    kop: "Klaar? Stuur je plan naar Gijs.",
    tekst:
      "Pas aan het einde vraagt Gijs naar je naam en contactgegevens. Je woninginformatie en de keuzes die je maakte, zijn dan al bij Gijs bekend. Zodra Gijs contact met je opneemt, hoef je dus niet bij nul te beginnen.",
  },
  {
    nummer: 5,
    titel: "Gijs kijkt mee",
    kop: "Daarna kijkt Gijs echt met je mee.",
    tekst:
      "Tijdens een gratis en vrijblijvende energiescan aan huis bekijkt een adviseur van Gijs je woning en je woningplan. Hetzelfde woningdossier is het vertrekpunt, dus hoeft niets opnieuw verzameld te worden: de adviseur bevestigt, corrigeert en vult aan waar nodig, meet waar dat nodig is en beoordeelt wat technisch bij je woning past.",
  },
];

export const DIGITAAL_PERSOONLIJK = {
  kop: "Digitaal waar het helpt. Persoonlijk waar het nodig is.",
  digitaal: [
    "Woninginformatie verzamelen",
    "Keuzes structureren",
    "Eerste inzichten geven",
    "Een woningplan opbouwen",
  ],
  persoonlijk: [
    "De woning controleren",
    "Technisch beoordelen",
    "Onzekerheden wegnemen",
    "Maatwerk leveren",
    "Een logische vervolgstap bepalen",
  ],
  tekst:
    "De website helpt bij het structureren van keuzes en geeft eerste inzichten, maar doet geen definitieve technische beoordeling. Die rol blijft bij Gijs.",
};

// Na de energiescan: kort en zonder nieuwe toezeggingen over een proces dat
// nog niet is vastgelegd (zie ook ZO_WERKT_GIJS_FASEN nummer 6, hieronder).
export const EN_DAARNA =
  "Op basis van het gecontroleerde woningbeeld bespreekt Gijs welke vervolgstappen logisch zijn. Daarbij kunnen maatregelen, subsidies, financiering en uitvoering in samenhang worden bekeken.";

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
