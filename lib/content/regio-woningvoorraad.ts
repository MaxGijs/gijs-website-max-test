// Echte, geverifieerde woningvoorraad-cijfers per gemeente (CBS/Kadaster-
// cijfers, ontsloten via AlleCijfers.nl). Dit is bedoeld als stabiele,
// feitelijke invulling per gemeentepagina — in tegenstelling tot gemeentelijke
// subsidiebedragen (zie RegioGemeente.officieleSubsidieUrl) veranderen deze
// cijfers niet van maand tot maand, al worden ze wel periodiek bijgewerkt.
// Geen bedragen, voorwaarden of claims verzinnen: alleen overnemen wat op de
// brondata staat, met bron en peildatum erbij.
export type WoningvoorraadGemeente = {
  totaalWoningen: number;
  percentageKoopwoningen: number;
  percentageVoor1975: number;
  meestVoorkomendType: string;
  gemiddeldeWozWaarde: string;
  peildatum: string;
  bronUrl: string;
};

export const WONINGVOORRAAD_GEMEENTEN: Record<string, WoningvoorraadGemeente> = {
  borne: {
    totaalWoningen: 10_535,
    percentageKoopwoningen: 70,
    // Woningen voor 1945 (11%) + 1945-1965 (7%) + 1965-1975 (17%) = 35%.
    percentageVoor1975: 35,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 395.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/borne/",
  },
  enschede: {
    totaalWoningen: 77_688,
    percentageKoopwoningen: 48,
    // 19% + 16% + 16% = 51%.
    percentageVoor1975: 51,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 301.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/enschede/",
  },
  hengelo: {
    totaalWoningen: 40_426,
    percentageKoopwoningen: 57,
    // 18% + 17% + 13% = 48%.
    percentageVoor1975: 48,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 313.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/hengelo/",
  },
  oldenzaal: {
    totaalWoningen: 14_974,
    percentageKoopwoningen: 63,
    // 10% + 17% + 23% = 50%.
    percentageVoor1975: 50,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 360.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/oldenzaal/",
  },
  almelo: {
    totaalWoningen: 34_709,
    percentageKoopwoningen: 55,
    // 17% + 17% + 15% = 49%.
    percentageVoor1975: 49,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 295.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/almelo/",
  },
  "hof-van-twente": {
    totaalWoningen: 15_711,
    percentageKoopwoningen: 69,
    // 17% + 13% + 19% = 49%.
    percentageVoor1975: 49,
    meestVoorkomendType: "Vrijstaande woning",
    gemiddeldeWozWaarde: "€ 376.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/hof-van-twente/",
  },
  "rijssen-holten": {
    totaalWoningen: 15_310,
    percentageKoopwoningen: 70,
    // 11% + 12% + 18% = 41%.
    percentageVoor1975: 41,
    meestVoorkomendType: "Vrijstaande woning",
    gemiddeldeWozWaarde: "€ 386.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/rijssen-holten/",
  },
  hellendoorn: {
    totaalWoningen: 15_194,
    percentageKoopwoningen: 73,
    // 14% + 15% + 18% = 47%.
    percentageVoor1975: 47,
    meestVoorkomendType: "Vrijstaande woning",
    gemiddeldeWozWaarde: "€ 395.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/hellendoorn/",
  },
  twenterand: {
    totaalWoningen: 14_192,
    percentageKoopwoningen: 67,
    // 12% + 13% + 17% = 42%.
    percentageVoor1975: 42,
    meestVoorkomendType: "Vrijstaande woning",
    gemiddeldeWozWaarde: "€ 354.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/twenterand/",
  },

  // Utrecht (provincie): AlleCijfers.nl, opgehaald op 9 november 2026. Woningvoorraad, koop en WOZ
  // zijn CBS 2025; bouwperiode en woningtype zijn 2026. Bouwperiode-percentages staan op de bron
  // afgerond, dus de som voor 1975 kan een punt afwijken.
  amersfoort: {
    totaalWoningen: 72_367,
    percentageKoopwoningen: 58,
    // 15% + 10% + 11% = 36%.
    percentageVoor1975: 36,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 446.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/amersfoort/",
  },
  baarn: {
    totaalWoningen: 11_947,
    percentageKoopwoningen: 62,
    // 24% + 19% + 17% = 60%.
    percentageVoor1975: 60,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 508.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/baarn/",
  },
  bunnik: {
    totaalWoningen: 6_867,
    percentageKoopwoningen: 74,
    // 8% + 16% + 22% = 46%.
    percentageVoor1975: 46,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 550.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/bunnik/",
  },
  bunschoten: {
    totaalWoningen: 8_985,
    percentageKoopwoningen: 73,
    // 8% + 9% + 23% = 40%.
    percentageVoor1975: 40,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 463.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/bunschoten/",
  },
  "de-bilt": {
    // De bron geeft voor CBS 2025 alleen het afgeronde aantal 20.000 (de Kadaster-telling 2026 is 20.407).
    totaalWoningen: 20_000,
    percentageKoopwoningen: 61,
    // 23% + 22% + 19% = 64%.
    percentageVoor1975: 64,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 608.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/de-bilt/",
  },
  "de-ronde-venen": {
    totaalWoningen: 19_070,
    percentageKoopwoningen: 67,
    // 8% + 13% + 21% = 42%.
    percentageVoor1975: 42,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 543.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/de-ronde-venen/",
  },
  eemnes: {
    totaalWoningen: 4_375,
    percentageKoopwoningen: 72,
    // 7% + 6% + 22% = 35%.
    percentageVoor1975: 35,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 546.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/eemnes/",
  },
  houten: {
    totaalWoningen: 21_551,
    percentageKoopwoningen: 67,
    // 3% + 2% + 3% = 8%: Houten is vrijwel geheel na 1975 gebouwd.
    percentageVoor1975: 8,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 526.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/houten/",
  },
  ijsselstein: {
    totaalWoningen: 14_585,
    percentageKoopwoningen: 64,
    // 5% + 6% + 22% = 33%.
    percentageVoor1975: 33,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 458.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/ijsselstein/",
  },
  leusden: {
    totaalWoningen: 13_848,
    percentageKoopwoningen: 71,
    // 4% + 5% + 22% = 31%.
    percentageVoor1975: 31,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 484.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/leusden/",
  },
  lopik: {
    totaalWoningen: 5_958,
    percentageKoopwoningen: 75,
    // 17% + 10% + 20% = 47%.
    percentageVoor1975: 47,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 483.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/lopik/",
  },
  montfoort: {
    totaalWoningen: 5_825,
    percentageKoopwoningen: 74,
    // 11% + 8% + 23% = 42%.
    percentageVoor1975: 42,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 479.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/montfoort/",
  },
  nieuwegein: {
    totaalWoningen: 31_374,
    percentageKoopwoningen: 58,
    // 2% + 3% + 14% = 19%.
    percentageVoor1975: 19,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 386.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/nieuwegein/",
  },
  oudewater: {
    totaalWoningen: 4_575,
    percentageKoopwoningen: 69,
    // 21% + 11% + 16% = 48%.
    percentageVoor1975: 48,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 441.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/oudewater/",
  },
  renswoude: {
    totaalWoningen: 2_236,
    percentageKoopwoningen: 74,
    // 9% + 6% + 14% = 29%.
    percentageVoor1975: 29,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 514.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/renswoude/",
  },
  rhenen: {
    totaalWoningen: 8_426,
    percentageKoopwoningen: 65,
    // 15% + 23% + 17% = 55%.
    percentageVoor1975: 55,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 461.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/rhenen/",
  },
  soest: {
    totaalWoningen: 21_532,
    percentageKoopwoningen: 64,
    // 16% + 16% + 22% = 54%.
    percentageVoor1975: 54,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 477.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/soest/",
  },
  "stichtse-vecht": {
    totaalWoningen: 29_351,
    percentageKoopwoningen: 65,
    // 11% + 9% + 15% = 35%.
    percentageVoor1975: 35,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 506.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/stichtse-vecht/",
  },
  utrecht: {
    totaalWoningen: 168_736,
    percentageKoopwoningen: 45,
    // 26% + 12% + 9% = 47%.
    percentageVoor1975: 47,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 490.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/utrecht/",
  },
  "utrechtse-heuvelrug": {
    totaalWoningen: 22_488,
    percentageKoopwoningen: 65,
    // 15% + 17% + 22% = 54%.
    percentageVoor1975: 54,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 549.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/utrechtse-heuvelrug/",
  },
  veenendaal: {
    totaalWoningen: 30_164,
    percentageKoopwoningen: 59,
    // 8% + 10% + 14% = 32%.
    percentageVoor1975: 32,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 394.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/veenendaal/",
  },
  vijfheerenlanden: {
    totaalWoningen: 26_158,
    percentageKoopwoningen: 63,
    // 14% + 11% + 19% = 44%.
    percentageVoor1975: 44,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 404.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/vijfheerenlanden/",
  },
  "wijk-bij-duurstede": {
    totaalWoningen: 10_437,
    percentageKoopwoningen: 70,
    // 9% + 5% + 17% = 31%.
    percentageVoor1975: 31,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 456.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/wijk-bij-duurstede/",
  },
  woerden: {
    totaalWoningen: 23_206,
    percentageKoopwoningen: 66,
    // 12% + 9% + 16% = 37%.
    percentageVoor1975: 37,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 435.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/woerden/",
  },
  woudenberg: {
    totaalWoningen: 5_744,
    percentageKoopwoningen: 71,
    // 8% + 9% + 21% = 38%.
    percentageVoor1975: 38,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 505.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/woudenberg/",
  },
  zeist: {
    totaalWoningen: 30_260,
    percentageKoopwoningen: 53,
    // 24% + 14% + 17% = 55%.
    percentageVoor1975: 55,
    meestVoorkomendType: "Appartement",
    gemiddeldeWozWaarde: "€ 555.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/zeist/",
  },

  // Flevoland: AlleCijfers.nl, opgehaald op 9 november 2026. Woningvoorraad, koop en WOZ zijn
  // CBS 2025; bouwperiode en woningtype zijn 2026. De gemeenten zijn jong (Lelystad 1967,
  // Dronten 1962, Almere 1976, Zeewolde 1984), dus weinig tot geen woningen van vóór 1975.
  almere: {
    totaalWoningen: 94_045,
    percentageKoopwoningen: 62,
    // Geen woningen van vóór 1975 (Almere is vanaf 1976 gebouwd).
    percentageVoor1975: 0,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 397.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/almere/",
  },
  dronten: {
    totaalWoningen: 18_702,
    percentageKoopwoningen: 68,
    // 0% + 5% + 15% = 20%.
    percentageVoor1975: 20,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 371.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/dronten/",
  },
  lelystad: {
    totaalWoningen: 36_017,
    percentageKoopwoningen: 62,
    // 0% + 0% + 12% = 12%.
    percentageVoor1975: 12,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 350.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/lelystad/",
  },
  noordoostpolder: {
    totaalWoningen: 21_364,
    percentageKoopwoningen: 66,
    // 1% + 26% + 16% = 43%.
    percentageVoor1975: 43,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 340.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/noordoostpolder/",
  },
  urk: {
    totaalWoningen: 7_213,
    percentageKoopwoningen: 77,
    // 6% + 10% + 10% = 26%.
    percentageVoor1975: 26,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 359.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/urk/",
  },
  zeewolde: {
    totaalWoningen: 9_858,
    percentageKoopwoningen: 70,
    // Vrijwel geen woningen van vóór 1975 (Zeewolde is vanaf 1984 gebouwd).
    percentageVoor1975: 0,
    meestVoorkomendType: "Tussenwoning",
    gemiddeldeWozWaarde: "€ 423.000",
    peildatum: "2025/2026",
    bronUrl: "https://www.allecijfers.nl/gemeente/zeewolde/",
  },
};
