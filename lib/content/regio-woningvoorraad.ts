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
};
