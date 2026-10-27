import type { HouseType } from "./woning-types";
import { gebruiktGas, primaireVerwarming, type Antwoord } from "./scan-session";
import { MC_VERWARMING } from "./content/milieu-centraal";
import {
  MC_KENGETALLEN, MC_GLAS, ISDE_ISOLATIE, RVO_REFERENTIEWONINGEN, SPOUWMUREN_VANAF,
  type BouwdeelMaatregel, type Bouwperiode, type Oppervlakten,
} from "./content/verduurzaming-financieel";

// Rekenmotor voor het financiële woningplan. Zuivere functie zonder I/O: dezelfde invoer geeft altijd
// dezelfde uitkomst. Bronnen en aannames: lib/content/verduurzaming-financieel.ts en
// docs/financieel-woningplan.md. Waar de gegevens tekortschieten, geeft de motor een bandbreedte of
// geen bedrag (met reden), nooit een opgevuld getal.
//
// Principes, aangescherpt na controle (27 oktober 2026):
// 1. Het bouwjaar is GEEN bewijs van de huidige isolatiestatus (latere renovaties tellen niet mee in
//    een bouwjaar). Of een bouwdeel al geïsoleerd is, komt daarom uitsluitend uit wat de bewoner zelf
//    over bestaande maatregelen heeft ingevuld: alleen maatregelen die niet als "al gedaan" zijn
//    aangevinkt, komen in aanmerking. Weet de bewoner het niet precies (aanwezigOnbekend), dan wordt
//    de besparing gepresenteerd als een voorbeeldscenario (ScenarioAard "voorbeeld"), niet als een
//    bevestigde woninggerichte indicatie.
// 2. Het optellen van losse Milieu Centraal-besparingen (dak + gevel + vloer + glas) bij twee of meer
//    maatregelen tegelijk is een redelijke, maar niet door Milieu Centraal zelf bevestigde aanname; de
//    bovengrens op het eigen gasverbruik maakt het resultaat realistischer, maar bewijst niet dat de
//    optelling zelf klopt. Op expliciet verzoek (27 oktober 2026) tonen we ook dan een terugverdientijd,
//    maar wel duidelijk gelabeld als gebaseerd op een optelling van losse schattingen (Besparing.optelling),
//    niet stilzwijgend als een even precies cijfer als bij één maatregel.
// 3. Oppervlakten komen altijd uit een RVO-referentiewoning, nooit uit een meting van de eigen woning.
//    De rekenmotor noemt het resultaat daarom een "woninggerichte indicatie", geen persoonlijke
//    berekening — zie ScenarioAard hieronder.

export type Bereik = { min: number; max: number };
export type IsolatieId = BouwdeelMaatregel | "glas-kozijnen";
/** "woninggericht": gebaseerd op wat de bewoner invulde over bestaande isolatie, met oppervlakten uit
 *  een RVO-referentiewoning (geen meting). "voorbeeld": de bewoner weet niet precies wat er al is
 *  gedaan, dus dit is een voorbeeldscenario voor dit woningtype. */
export type ScenarioAard = "woninggericht" | "voorbeeld";

const ISOLATIE: IsolatieId[] = ["dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen"];
const BOUWDEEL: Record<IsolatieId, keyof Oppervlakten> = { dakisolatie: "dak", gevelisolatie: "gevel", vloerisolatie: "vloer", "glas-kozijnen": "raam" };

export type FinancieleInvoer = {
  maatregelIds: string[];
  houseType: HouseType;
  bouwjaar: number | null;
  kruipruimte: Antwoord | null;
  verwarming: string[];
  /** m³ per jaar, uit de scan. */
  gasverbruik: number | null;
  /** € per m³, uit de scan. */
  gasprijs: number | null;
  /** Bewoner koos "Ik weet het niet precies" bij bestaande maatregelen: zie ScenarioAard hierboven. */
  aanwezigOnbekend: boolean;
};

export type FinancieleMaatregel = {
  id: IsolatieId;
  bouwdeel: keyof Oppervlakten;
  /** Oppervlakte van de RVO-referentiewoning, in m². Bandbreedte als het bouwjaar onbekend is. */
  oppervlakte: Bereik;
  kosten: Bereik;
  subsidie: Bereik;
  /** null: geen onderbouwde besparing voor dit bouwdeel. Anders een bandbreedte (bouwjaar onbekend: per bouwperiode). */
  besparingGasM3: Bereik | null;
};

export type Besparing = {
  gasM3: Bereik;
  euro: Bereik;
  begrensd: boolean;
  voor: IsolatieId[];
  aard: ScenarioAard;
  /** true bij twee of meer maatregelen: de besparing is dan een optelling van losse schattingen. */
  optelling: boolean;
};

export type FinancieelOverzicht = {
  maatregelen: FinancieleMaatregel[];
  nietToepasbaar: { id: string; reden: string }[];
  /** Installaties zonder betrouwbare bron voor kosten of besparing. */
  nogNietBerekenbaar: string[];
  /** Bouwperiode van de referentiewoning; null als het bouwjaar onbekend is (dan bandbreedtes). */
  periode: string | null;
  bruto: Bereik;
  subsidie: Bereik;
  netto: Bereik;
  combinatieTarief: boolean;
  besparing: Besparing | null;
  besparingReden?: string;
  /** null: geen onderbouwde besparing. Bij twee of meer maatregelen is dit gebaseerd op een optelling
   *  van losse schattingen (zie Besparing.optelling) — zie principe 2 hierboven. */
  terugverdientijdJaren: number | null;
  terugverdientijdReden?: string;
};

const opTien = (n: number) => Math.round(n / 10) * 10;
const opHonderd = (n: number) => Math.round(n / 100) * 100;
const bereik = (waarden: number[]): Bereik => ({ min: Math.min(...waarden), max: Math.max(...waarden) });
const optelBereik = (a: Bereik, b: Bereik): Bereik => ({ min: a.min + b.min, max: a.max + b.max });
const isIsolatie = (id: string): id is IsolatieId => (ISOLATIE as string[]).includes(id);

function referentieperioden(houseType: HouseType, bouwjaar: number | null): Bouwperiode[] {
  const alle = RVO_REFERENTIEWONINGEN[houseType];
  const gevonden = bouwjaar === null ? undefined : alle.find(p => bouwjaar >= p.vanaf && bouwjaar < p.tot);
  return gevonden ? [gevonden] : alle;
}

function kostenVoor(id: IsolatieId, houseType: HouseType, p: Bouwperiode): number {
  if (id === "glas-kozijnen") return opHonderd((MC_GLAS.kosten / MC_GLAS.referentieM2) * p.raam);
  return MC_KENGETALLEN[id][houseType].kosten;
}

function subsidieVoor(id: IsolatieId, m2: number, dubbel: boolean): number {
  const t = ISDE_ISOLATIE[id];
  if (m2 < t.minM2) return 0;
  return opTien(Math.min(m2, t.maxM2) * t.perM2 * (dubbel ? 2 : 1));
}

/** Besparing bij "van geen naar goede isolatie" (glas: van dubbel naar HR++); zie kengetallenbestand. */
function besparingVoor(id: IsolatieId, houseType: HouseType, p: Bouwperiode): number {
  if (id === "glas-kozijnen") return (MC_GLAS.besparingGasM3 / MC_GLAS.referentieM2) * p.raam;
  return MC_KENGETALLEN[id][houseType].besparingGasM3;
}

function nietToepasbaarReden(id: IsolatieId, invoer: FinancieleInvoer): string | null {
  if (id === "gevelisolatie" && invoer.bouwjaar !== null && invoer.bouwjaar < SPOUWMUREN_VANAF)
    return `Volgens RVO werden tot circa ${SPOUWMUREN_VANAF} geen spouwmuren gebouwd, dus spouwmuurisolatie is waarschijnlijk niet mogelijk.`;
  if (id === "vloerisolatie" && invoer.kruipruimte === "nee")
    return "Je gaf aan dat er geen kruipruimte is. De kosten van Milieu Centraal gaan uit van isoleren vanuit de kruipruimte.";
  return null;
}

export function berekenFinancieelOverzicht(invoer: FinancieleInvoer): FinancieelOverzicht {
  const { houseType, bouwjaar } = invoer;
  const nietToepasbaar: { id: string; reden: string }[] = [];
  const nogNietBerekenbaar: string[] = [];
  const ids: IsolatieId[] = [];
  for (const id of invoer.maatregelIds) {
    if (!isIsolatie(id)) { nogNietBerekenbaar.push(id); continue; }
    const reden = nietToepasbaarReden(id, invoer);
    if (reden) nietToepasbaar.push({ id, reden });
    else ids.push(id);
  }

  // ISDE: dubbel bedrag bij meer dan één isolatiemaatregel, of isolatie samen met een warmtepomp.
  const combinatieTarief = ids.length >= 2 || (ids.length >= 1 && invoer.maatregelIds.includes("warmtepomp"));

  // Per bouwperiode van de referentiewoning één scenario; bij een onbekend bouwjaar alle perioden, en
  // dus een bandbreedte voor kosten, subsidie én besparing (niet alleen voor kosten/subsidie: het
  // bouwjaar bepaalt via de RVO-referentiewoning ook het glasoppervlak, en daarmee de glasbesparing).
  const perioden = referentieperioden(houseType, bouwjaar);
  const scenario = (p: Bouwperiode) => ids.map(id => {
    const m2 = p[BOUWDEEL[id]];
    return { id, m2, kosten: kostenVoor(id, houseType, p), subsidie: subsidieVoor(id, m2, combinatieTarief), besparingGasM3: besparingVoor(id, houseType, p) };
  });
  const scenarios = perioden.map(scenario);
  const totaal = (s: ReturnType<typeof scenario>, veld: "kosten" | "subsidie") => s.reduce((t, m) => t + m[veld], 0);

  const maatregelen: FinancieleMaatregel[] = ids.map((id, i) => ({
    id,
    bouwdeel: BOUWDEEL[id],
    oppervlakte: bereik(scenarios.map(s => s[i].m2)),
    kosten: bereik(scenarios.map(s => s[i].kosten)),
    subsidie: bereik(scenarios.map(s => s[i].subsidie)),
    besparingGasM3: bereik(scenarios.map(s => s[i].besparingGasM3)),
  }));

  // Besparing: alleen te onderbouwen bij een gasgestookte cv-ketel en een bekend verbruik en gasprijs.
  // Het bouwjaar bepaalt alléén welke RVO-oppervlakte geldt (zie hierboven), niet óf er iets te
  // besparen valt: dat volgt uit wat de bewoner al heeft aangevinkt (ids bevat nooit een maatregel die
  // als "al gedaan" is aangevinkt — die filtering gebeurt vóór dit bestand, in de woningscan zelf).
  let besparingReden: string | undefined;
  const pv = primaireVerwarming(invoer.verwarming);
  if (!gebruiktGas(invoer.verwarming)) besparingReden = "Je woning gebruikt geen aardgas. Wat isoleren op je energierekening scheelt, hangt af van je installatie.";
  else if (pv === "Hybride warmtepomp") besparingReden = "Met een hybride warmtepomp hangt de besparing af van de verdeling tussen gas en stroom. Die rekenen we door tijdens de energiescan.";
  else if (pv !== "Cv-ketel") besparingReden = "De besparingscijfers van Milieu Centraal gelden voor een woning met een cv-ketel.";
  else if (invoer.gasverbruik === null || invoer.gasprijs === null) besparingReden = "Je gasverbruik of gasprijs ontbreekt.";

  let besparing: Besparing | null = null;
  if (!besparingReden && ids.length) {
    const somGasM3 = maatregelen.reduce((t, m) => optelBereik(t, m.besparingGasM3!), { min: 0, max: 0 });
    // Bovengrens uit het eigen verbruik: na isoleren gaat de woning niet onder het gemiddelde verbruik
    // van een goed geïsoleerde woning van hetzelfde type met cv-ketel (Milieu Centraal, verwarming + warm water).
    const ruimte = invoer.gasverbruik! - MC_VERWARMING[houseType].goed.cvKetel.gas;
    if (ruimte <= 0) besparingReden = "Je gasverbruik ligt al op of onder het gemiddelde van een goed geïsoleerde woning van dit type, dus een extra besparing is niet te onderbouwen.";
    else {
      const begrensd = (n: number) => Math.min(n, ruimte);
      const gasM3 = { min: opTien(begrensd(somGasM3.min)), max: opTien(begrensd(somGasM3.max)) };
      besparing = {
        gasM3,
        euro: { min: opTien(gasM3.min * invoer.gasprijs!), max: opTien(gasM3.max * invoer.gasprijs!) },
        begrensd: begrensd(somGasM3.max) < somGasM3.max,
        voor: ids,
        aard: invoer.aanwezigOnbekend ? "voorbeeld" : "woninggericht",
        optelling: ids.length > 1,
      };
    }
  }

  const bruto = bereik(scenarios.map(s => totaal(s, "kosten")));
  const subsidie = bereik(scenarios.map(s => totaal(s, "subsidie")));
  const netto = bereik(scenarios.map(s => totaal(s, "kosten") - totaal(s, "subsidie")));

  // Terugverdientijd: altijd tonen zodra er een onderbouwde besparing is (op uitdrukkelijk verzoek,
  // 27 oktober 2026), ook bij meerdere maatregelen tegelijk. Bij twee of meer maatregelen is de
  // besparing een optelling van losse Milieu Centraal-schattingen (Besparing.optelling): de UI
  // labelt dat expliciet, in plaats van het stilzwijgend even precies te presenteren als bij één
  // maatregel (waar het cijfer rechtstreeks van Milieu Centraal komt, zonder optelling).
  let terugverdientijdJaren: number | null = null;
  let terugverdientijdReden: string | undefined;
  if (!besparing || besparing.euro.max <= 0) terugverdientijdReden = "Zonder onderbouwde besparing is geen terugverdientijd te berekenen.";
  else terugverdientijdJaren = Math.max(1, Math.round(netto.min / besparing.euro.min));

  return {
    maatregelen, nietToepasbaar, nogNietBerekenbaar,
    periode: perioden.length === 1 ? perioden[0].label : null,
    bruto, subsidie, netto, combinatieTarief,
    besparing, besparingReden,
    terugverdientijdJaren, terugverdientijdReden,
  };
}
