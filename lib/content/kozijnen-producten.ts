// Bron: HR IsoFrame.zip (aangeleverd door Gijs), met name "HR IsoFrame
// Producten.pdf" (de drie productniveaus) en "Kozijnprofielen EVP.docx"
// (profielvergelijkingen). Cijfers en kenmerken zijn woordelijk c.q.
// rechtstreeks overgenomen uit deze documenten.
//
// Let op: "Kozijnprofielen EVP.docx" noemt de kunststof profielen van het
// merk Aluplast; de bijbehorende profieldoorsnede-afbeelding op de pagina
// (kozijnen-profieldoorsnede.jpg) komt uit een ander bestand in dezelfde
// zip (Veka/veka-profiel-doorsnede.jpg, een VEKA TOPLINE NL-doorsnede) en
// wordt daarom bewust generiek bijgeschreven ("doorsnede van een
// geïsoleerd kunststofprofiel"), niet als hetzelfde Aluplast-profiel.

export type HrIsoFrameTier = {
  naam: string;
  tagline: string;
  // Top 3 kenmerken voor de compacte kaart — de volledige lijst staat in
  // `kenmerken` en wordt gebruikt voor de technische tabel eronder.
  kernkenmerken: string[];
  kenmerken: string[];
  glas: string;
  ugWaarde: string;
  subsidie: string;
};

// Bron: "HR IsoFrame Producten.pdf" (3 pagina's, één per niveau).
export const HR_ISOFRAME_TIERS: HrIsoFrameTier[] = [
  {
    naam: "HR IsoFrame Basic",
    tagline: "Inclusief HR++ glas van 24 mm dikte",
    kernkenmerken: [
      "HR++ glas, 24 mm dikte",
      "Volgens de norm van het Nederlands Bouwbesluit",
      "Voorzien van stalen versterking",
    ],
    kenmerken: [
      "Volgens de norm van het Nederlands Bouwbesluit",
      "Voorzien van stalen versterking",
      "HR++ glas 24 mm dikte met Ug-waarde 1,1",
      "Verdekt hang- en sluitwerk",
      "24 mm dikte paneel- en schrootvulling",
      "3 scharnieren op deuren",
    ],
    glas: "HR++, 24 mm",
    ugWaarde: "1,1",
    subsidie: "€ 35,- per m²",
  },
  {
    naam: "HR IsoFrame Standard",
    tagline: "Inclusief HR++ Warm-Edge glas van 24 mm dikte",
    kernkenmerken: [
      "HR++ Warm-Edge glas, 24 mm dikte",
      "16% hogere isolatiewaarde dan Basic",
      "Kerntrekbeveiliging op alle deuren (SKG***)",
    ],
    kenmerken: [
      "16% hogere isolatiewaarde dan HR IsoFrame Basic",
      "Voorzien van versterking",
      "HR++ Warm-Edge glas 24 mm dikte met Ug-waarde 1,1",
      "Verdekt hang- en sluitwerk, extra middendichting",
      "42 mm dikte paneel- en schrootvulling",
      "4 scharnieren op deuren, extra ventilatiestanden op draaikiepramen",
      "Kerntrekbeveiliging op alle deuren (SKG***)",
    ],
    glas: "HR++ Warm-Edge, 24 mm",
    ugWaarde: "1,1",
    subsidie: "€ 35,- per m²",
  },
  {
    naam: "HR IsoFrame Comfort",
    tagline: "Inclusief triple glas van 42 mm dikte",
    kernkenmerken: [
      "Triple glas, 42 mm dikte",
      "32% hogere isolatiewaarde dan Basic",
      "Kerntrekbeveiliging op alle deuren (SKG***)",
    ],
    kenmerken: [
      "32% hogere isolatiewaarde dan HR IsoFrame Basic",
      "Voorzien van Thermofibra®-versterking",
      "Triple glas 42 mm dikte met Ug-waarde 0,6",
      "ActivPilot Giant (180 kg) hang- en sluitwerk",
      "42 mm dikte paneel- en schrootvulling, extra middendichting",
      "4 scharnieren op deuren, kerntrekbeveiliging (SKG***)",
    ],
    glas: "Triple, 42 mm",
    ugWaarde: "0,6",
    subsidie: "€ 100,- per m² op triple beglazing",
  },
];

export type KunststofProfiel = {
  breedte: string;
  kamers: string;
  afdichtingen: string;
  isolatiewaardeUf: string;
  maxGlasdikte: string;
};

// Bron: "Kozijnprofielen EVP.docx" — tabel "Kunststof profielen vergelijken".
export const KUNSTSTOF_PROFIELEN: KunststofProfiel[] = [
  { breedte: "70 mm (vlak)", kamers: "5 kamers", afdichtingen: "2", isolatiewaardeUf: "1,4 W/m²K", maxGlasdikte: "41 mm" },
  { breedte: "85 mm (half verdiept)", kamers: "6 kamers", afdichtingen: "2", isolatiewaardeUf: "1,3 W/m²K", maxGlasdikte: "41 mm" },
  { breedte: "120 mm (verdiept)", kamers: "3 kamers", afdichtingen: "2", isolatiewaardeUf: "1,4 W/m²K", maxGlasdikte: "41 mm" },
];

export type SchuifpuiProfiel = {
  naam: string;
  kozijnbreedte: string;
  isolatiewaardeUf: string;
  glastype: string;
};

// Bron: "Kozijnprofielen EVP.docx" — tabel "Kunststof profielen voor
// hefschuifpuien vergelijken".
export const SCHUIFPUI_PROFIELEN: SchuifpuiProfiel[] = [
  { naam: "Comfort", kozijnbreedte: "168 mm", isolatiewaardeUf: "1,3 – 1,5 W/m²K", glastype: "Dubbel + triple" },
  { naam: "Premium", kozijnbreedte: "197 mm", isolatiewaardeUf: "1,1 – 1,3 W/m²K", glastype: "Dubbel + triple" },
];
