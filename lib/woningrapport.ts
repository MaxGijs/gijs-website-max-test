// Woningrapport (stap 3 van de woningscan): welke verduurzamingskansen liggen er waarschijnlijk nog,
// in een logische volgorde voor deze woning. Zuivere functie zonder I/O.
//
// Er worden hier GEEN nieuwe cijfers bedacht, en GEEN subsidiebedragen: subsidie komt uitsluitend uit de
// koppeling met de Energiesubsidiewijzer van Milieu Centraal (zoekSubsidies, per adres), in het rapport
// zelf (Max, 17-11-2026). Besparingen komen uit bestaande bronnen:
// - isolatie: berekenFinancieelOverzicht() (Milieu Centraal-besparing per woningtype, Gijs-tarieven van
//   Thom voor de terugverdientijd, zonder subsidie), per maatregel apart doorgerekend;
// - warmtepomp: de ervaringscijfers van Gijs (lib/content/warmtepomp-besparing.ts, Naud 13-10-2026);
// - zonnepanelen, vloerverwarming, thuisbatterij: geen betrouwbare bron in de codebase, dus geen
//   bedrag en geen besparing, alleen een kwalitatieve uitleg.
// Investeringsprijzen worden bewust NIET teruggegeven: die tonen we pas na controle van de woning.
//
// Volgorde (Trias Energetica): eerst isoleren, gesorteerd op de gasbesparing die Milieu Centraal
// voor dit woningtype noemt; dan de warmtepomp; dan zonnepanelen; vloerverwarming en thuisbatterij
// als vervolgstap. Hooguit vier kansen staan bovenaan als "aanbevolen" (waarvan hooguit twee isolatie,
// en geen isolatie met een terugverdientijd boven 15 jaar), de rest als "later".

import type { HouseType } from "./woning-types";
import { HOUSE_MODELS } from "./woning-types";
import { berekenFinancieelOverzicht, type IsolatieId } from "./woningplan-financieel";
import { gebruiktGas, type Antwoord } from "./scan-session";
import { bouwperiodeVan, geschatIsolatieniveau, type Bouwperiode } from "./energie-schatting";
import { WARMTEPOMP_GASBESPARING, WARMTEPOMP_STROOM_ERBIJ } from "./content/warmtepomp-besparing";
import { MC_KENGETALLEN, MC_GLAS, GLAS_OPPERVLAKTE } from "./content/verduurzaming-financieel";

export type KansId = "dakisolatie" | "gevelisolatie" | "vloerisolatie" | "glas-kozijnen" | "warmtepomp" | "zonnepanelen" | "vloerverwarming" | "thuisbatterij";

export type Kans = {
  id: KansId;
  aanbevolen: boolean;
  waarom: string;
  /** null: geen betrouwbare bron voor een besparing. */
  besparing: string | null;
  verbruik: string | null;
  terugverdientijd: string | null;
  comfort: string;
  /** Twee à vier woorden voor de tegel in de hoofdkaart. */
  comfortKort: string;
  woningwaarde: string | null;
  voorwaarden: string[];
  /** Alleen bij de warmtepomp: warmteafgifte wordt pas bij de woningopname gecontroleerd. */
  warmteafgifteControle: boolean;
  /** Bij "Ik weet het niet precies": besparing is een voorbeeldscenario, geen woninggerichte indicatie. */
  voorbeeld: boolean;
  /** Korte waarden voor in de rij (de lange uitleg staat in de velden hierboven). */
  kort: { besparing: string | null; terugverdientijd: string | null };
};

export type RapportInvoer = {
  houseType: HouseType;
  bouwjaar: number | null;
  energielabel: string;
  bestaande: string[];
  aanwezigOnbekend: boolean;
  verwarming: string[];
  kruipruimte: Antwoord | null;
  /** Antwoorden op "Hoe wordt de warmte afgegeven?" (AFGIFTE_OPTIES); leeg = niet ingevuld. */
  warmteafgifte: string[];
  gasverbruik: number | null;
  gasprijs: number | null;
  stroomprijs: number | null;
};

export type Woningrapport = {
  periode: Bouwperiode;
  /** Voor de kop van het rapport: "hier liggen nog N kansen, waarvan X met subsidie". */
  samenvatting: {
    kansen: number;
    /** Indicatieve gasbesparing van die isolatiekansen samen (begrensd op het eigen verbruik); null als die niet te onderbouwen is. */
    isolatieBesparing: { min: number; max: number } | null;
    /** Netto besparing per jaar van een hybride warmtepomp (gas minus extra stroom); null zonder warmtepompkans. */
    warmtepompBesparing: number | null;
  };
  kansen: Kans[];
  nietToepasbaar: { id: KansId; reden: string }[];
  /** Isolatie die bij een woning vanaf 1975 waarschijnlijk al bij de bouw is toegepast (niet aangevinkt, wel aannemelijk). */
  waarschijnlijkBijBouw: KansId[];
};

const ISOLATIE: IsolatieId[] = ["dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen"];
const MAX_AANBEVOLEN = 4;
/** Hooguit twee isolatiemaatregelen bovenaan (die met de grootste besparing), zodat de top niet alleen uit isolatie bestaat. */
const MAX_ISOLATIE_AANBEVOLEN = 2;
/** Isolatie met een langere indicatieve terugverdientijd zakt naar "later" (aanname, af te stemmen met Thom). */
const MAX_TERUGVERDIENTIJD_BOVENAAN = 15;
const nl = (n: number) => Math.round(n).toLocaleString("nl-NL");
const euro = (n: number) => `€ ${nl(n)}`;
const bereikTekst = (min: number, max: number, f: (n: number) => string) => (min === max ? f(min) : `${f(min)} tot ${f(max)}`);

/** Label A t/m B: zuinig; C: gemiddeld; D t/m G: veel winst te halen; leeg: onbekend. */
function labelGroep(label: string): "zuinig" | "gemiddeld" | "onzuinig" | "onbekend" {
  const l = label.trim().toUpperCase();
  if (!l) return "onbekend";
  if (l.startsWith("A") || l === "B") return "zuinig";
  if (l === "C") return "gemiddeld";
  return "onzuinig";
}

const COMFORT: Record<KansId, string> = {
  dakisolatie: "Minder warmteverlies via het dak. De bovenverdieping blijft in de winter warmer en in de zomer koeler.",
  gevelisolatie: "Minder koude buitenmuren en minder tocht langs de gevel.",
  vloerisolatie: "Een minder koude vloer en warmere voeten op de begane grond.",
  "glas-kozijnen": "Minder kou en tocht bij de ramen, en vaak minder geluid van buiten.",
  warmtepomp: "Gelijkmatige warmte in huis. Bij een hybride warmtepomp blijft de ketel als back-up.",
  zonnepanelen: "Geen verschil in comfort, wel eigen stroom van je dak.",
  vloerverwarming: "Gelijkmatige warmte vanuit de vloer, zonder radiatoren aan de muur.",
  thuisbatterij: "Je gebruikt meer van je eigen zonnestroom, ook 's avonds.",
};

const COMFORT_KORT: Record<KansId, string> = {
  dakisolatie: "Warmere bovenverdieping",
  gevelisolatie: "Minder koude muren",
  vloerisolatie: "Warmere voeten",
  "glas-kozijnen": "Minder tocht bij ramen",
  warmtepomp: "Gelijkmatige warmte",
  zonnepanelen: "Eigen stroom",
  vloerverwarming: "Warmte vanuit de vloer",
  thuisbatterij: "Meer eigen stroom gebruiken",
};

const VOORWAARDEN: Record<KansId, string[]> = {
  dakisolatie: ["Hangt af van de dakconstructie: isoleren aan de binnenkant of aan de buitenkant."],
  gevelisolatie: ["Alleen mogelijk bij een spouwmuur die nog niet gevuld is. Spouwmuren werden gebouwd vanaf circa 1930."],
  vloerisolatie: ["Vraagt een toegankelijke kruipruimte onder de vloer."],
  "glas-kozijnen": ["Soms kan nieuw glas in de bestaande kozijnen, soms zijn nieuwe kozijnen verstandiger."],
  warmtepomp: ["Werkt het best in een goed geïsoleerde woning. Isoleren eerst maakt de warmtepomp kleiner en zuiniger."],
  zonnepanelen: ["Hangt af van de ligging, de schaduw en de ruimte op je dak."],
  vloerverwarming: ["Vraagt aanpassing van de vloer. Wordt vaak gecombineerd met een warmtepomp."],
  thuisbatterij: ["Alleen zinvol in combinatie met zonnepanelen."],
};

const WAARDE_LABEL = "Kan bijdragen aan een beter energielabel, wat je woning aantrekkelijker kan maken. Een persoonlijke waardestijging rekenen we niet uit.";

/** Gasbesparing van Milieu Centraal voor dit woningtype, alleen om de isolatiemaatregelen te ordenen. */
function sorteerwaarde(id: IsolatieId, houseType: HouseType): number {
  if (id === "glas-kozijnen") return (MC_GLAS.besparingGasM3 / MC_GLAS.referentieM2) * GLAS_OPPERVLAKTE[houseType];
  return MC_KENGETALLEN[id][houseType].besparingGasM3;
}

export function maakWoningrapport(invoer: RapportInvoer): Woningrapport {
  const { houseType, bouwjaar, bestaande, aanwezigOnbekend } = invoer;
  const periode = bouwperiodeVan(bouwjaar);
  const label = labelGroep(invoer.energielabel);
  const type = HOUSE_MODELS[houseType].label.toLowerCase();
  const isolatieniveau = geschatIsolatieniveau(bestaande, bouwjaar);
  const gas = gebruiktGas(invoer.verwarming);
  const heeft = (id: string) => bestaande.includes(id);
  const kansen: Kans[] = [];
  let warmtepompBesparing: number | null = null;
  const nietToepasbaar: { id: KansId; reden: string }[] = [];
  // Bij een woning vanaf 1975 én een zuinig label is isoleren waarschijnlijk al grotendeels gebeurd:
  // dan staan de isolatiekansen lager, als "controleren", in plaats van bovenaan.
  const isolatieWaarschijnlijkOk = periode === "vanaf1975" && label === "zuinig";
  const waarschijnlijkBijBouw = periode === "vanaf1975" && !aanwezigOnbekend
    ? ISOLATIE.filter(id => id !== "glas-kozijnen" && !heeft(id)) as KansId[]
    : [];

  // ── Isolatie ────────────────────────────────────────────────────────────────────────────────
  const isolatieKandidaten = ISOLATIE.filter(id => !heeft(id)).sort((a, b) => sorteerwaarde(b, houseType) - sorteerwaarde(a, houseType));
  for (const id of isolatieKandidaten) {
    const o = berekenFinancieelOverzicht({
      maatregelIds: [id], houseType, bouwjaar, kruipruimte: invoer.kruipruimte,
      verwarming: invoer.verwarming, gasverbruik: invoer.gasverbruik, gasprijs: invoer.gasprijs, aanwezigOnbekend,
    });
    const niet = o.nietToepasbaar.find(n => n.id === id);
    if (niet) { nietToepasbaar.push({ id, reden: niet.reden }); continue; }
    // Terugverdientijd zonder subsidie (investering volgens de Gijs-tarieven ÷ besparing): met subsidie is
    // die korter, maar de subsidie zelf rekenen we niet uit.
    // Geen tarief van Gijs (glas): dan ook geen terugverdientijd; die rekent de adviseur uit.
    const jaren = !o.zonderPrijs.length && o.besparing && o.besparing.euro.min > 0 ? Math.max(1, Math.round(o.bruto.min / o.besparing.euro.min)) : null;

    const besparing = o.besparing
      ? `${bereikTekst(o.besparing.euro.min, o.besparing.euro.max, euro)} per jaar${o.besparing.aard === "voorbeeld" ? " (voorbeeld)" : ""}`
      : null;
    const verbruik = o.besparing ? `Ongeveer ${bereikTekst(o.besparing.gasM3.min, o.besparing.gasM3.max, nl)} m³ gas per jaar minder.` : null;
    const terugverdientijd = jaren !== null ? `Ongeveer ${jaren} jaar zonder subsidie. Met subsidie is dat korter.` : null;

    const naam = { dakisolatie: "het dak", gevelisolatie: "de spouwmuren", vloerisolatie: "de vloer", "glas-kozijnen": "de ramen" }[id];
    const isZijn = id === "gevelisolatie" || id === "glas-kozijnen" ? "zijn" : "is";
    const besparingMc = sorteerwaarde(id, houseType);
    const waarom = [
      bouwjaar
        ? periode === "vanaf1975"
          ? `Bij een ${type} uit ${bouwjaar} ${isZijn} ${naam} bij de bouw waarschijnlijk al geïsoleerd, maar naar de eisen van toen.`
          : id === "glas-kozijnen"
            ? `Bij een ${type} uit ${bouwjaar} zat er bij de bouw meestal nog geen isolatieglas in de ramen.`
            : `Bij een ${type} uit ${bouwjaar} ${isZijn} ${naam} bij de bouw meestal niet geïsoleerd.`
        : `Je hebt ${naam} nog niet als geïsoleerd aangevinkt.`,
      `Milieu Centraal rekent voor een gemiddelde ${type} met ongeveer ${nl(Math.round(besparingMc / 10) * 10)} m³ gas per jaar minder.`,
      label === "onzuinig" ? `Met energielabel ${invoer.energielabel.toUpperCase()} is er waarschijnlijk nog veel winst te halen.` : "",
    ].filter(Boolean).join(" ");

    // Voor de volgorde bij glas (geen tarief van Gijs): de Milieu Centraal-prijs als ondergrens. Volgens Thom is
    // die aan de lage kant, dus de echte terugverdientijd is eerder langer. Alleen intern, nergens getoond.
    const ondergrensJaren = id === "glas-kozijnen" && o.besparing && o.besparing.euro.min > 0
      ? Math.round(((MC_GLAS.kosten / MC_GLAS.referentieM2) * GLAS_OPPERVLAKTE[houseType]) / o.besparing.euro.min)
      : null;
    const traag = (jaren ?? ondergrensJaren) !== null && (jaren ?? ondergrensJaren)! > MAX_TERUGVERDIENTIJD_BOVENAAN;
    const kort = {
      besparing: o.besparing ? `${bereikTekst(o.besparing.euro.min, o.besparing.euro.max, euro)} per jaar` : null,
      terugverdientijd: jaren !== null ? `± ${jaren} jaar` : null,
    };
    kansen.push({
      id, aanbevolen: !isolatieWaarschijnlijkOk && !traag, waarom, besparing, verbruik, terugverdientijd, kort,
      comfort: COMFORT[id], comfortKort: COMFORT_KORT[id], woningwaarde: WAARDE_LABEL, voorwaarden: VOORWAARDEN[id],
      warmteafgifteControle: false, voorbeeld: o.besparing?.aard === "voorbeeld",
    });
  }
  // Geen cv-ketel (bv. hybride warmtepomp): berekenFinancieelOverzicht geeft dan zelf geen besparing,
  // want de Milieu Centraal-cijfers gelden voor een woning met cv-ketel. De kaart blijft, zonder bedrag.

  // ── Warmtepomp ──────────────────────────────────────────────────────────────────────────────
  if (!heeft("warmtepomp") && gas) {
    const lageTemperatuur = heeft("vloerverwarming") || invoer.warmteafgifte.includes("Vloerverwarming of lagetemperatuurradiatoren");
    const alleenHoog = !lageTemperatuur && invoer.warmteafgifte.includes("Normale radiatoren (hoge temperatuur)");
    // Gijs' ervaringscijfer: met vloerverwarming (lage temperatuur) valt bij een hybride meer gas weg.
    const aandeel = lageTemperatuur ? WARMTEPOMP_GASBESPARING.hybrideMetVloerverwarming : WARMTEPOMP_GASBESPARING.hybride;
    const g = invoer.gasverbruik, gp = invoer.gasprijs, sp = invoer.stroomprijs;
    let besparing: string | null = null;
    let besparingKort: string | null = null;
    let verbruik: string | null = null;
    if (g !== null && g > 0 && gp !== null && sp !== null) {
      const minderGas = g * aandeel;
      const netto = minderGas * gp - WARMTEPOMP_STROOM_ERBIJ.hybride * sp;
      verbruik = `Hybride: ongeveer ${nl(Math.round(minderGas / 10) * 10)} m³ gas minder en ongeveer ${nl(WARMTEPOMP_STROOM_ERBIJ.hybride)} kWh stroom meer per jaar.`;
      if (netto > 0) {
        besparing = `Ongeveer ${euro(Math.round(netto / 10) * 10)} per jaar (hybride, gas minus extra stroom)`;
        besparingKort = `± ${euro(Math.round(netto / 10) * 10)} per jaar`;
        warmtepompBesparing = Math.round(netto / 10) * 10;
      }
    }
    const afgifteZin = lageTemperatuur
      ? " Je hebt vloerverwarming of lagetemperatuurradiatoren: die passen goed bij een warmtepomp."
      : alleenHoog
        ? " Met normale radiatoren is een hybride warmtepomp vaak de logische eerste stap; Gijs bekijkt of de radiatoren volstaan."
        : "";
    const waarom = (isolatieniveau === "matig"
      ? `Je ${type} stookt op gas. Een hybride warmtepomp neemt het grootste deel van de verwarming over. Omdat je woning nog niet goed geïsoleerd is, levert hij meer op als eerst de isolatie op orde is.`
      : isolatieniveau === "goed"
        ? `Je woning is goed geïsoleerd. Dan kan een hybride of zelfs een volledig elektrische warmtepomp het gasverbruik flink verlagen.`
        : `Je woning is redelijk geïsoleerd. Een hybride warmtepomp kan dan het grootste deel van het gasverbruik overnemen.`) + afgifteZin;
    kansen.push({
      id: "warmtepomp", aanbevolen: true, waarom,
      besparing, verbruik, terugverdientijd: null, kort: { besparing: besparingKort, terugverdientijd: null },
      comfort: COMFORT.warmtepomp, comfortKort: COMFORT_KORT.warmtepomp, woningwaarde: WAARDE_LABEL, voorwaarden: VOORWAARDEN.warmtepomp,
      warmteafgifteControle: true, voorbeeld: aanwezigOnbekend,
    });
  }

  // ── Zonnepanelen, vloerverwarming, thuisbatterij ────────────────────────────────────────────
  if (!heeft("zonnepanelen")) {
    kansen.push({
      id: "zonnepanelen", aanbevolen: true,
      waarom: "Je hebt nog geen zonnepanelen. Met eigen stroom van je dak verlaag je je stroomrekening, ook als je later elektrisch gaat verwarmen.",
      besparing: null, verbruik: "De opbrengst hangt af van je dak; die rekent Gijs uit bij de woningopname.", terugverdientijd: null,
      kort: { besparing: null, terugverdientijd: null },
      comfort: COMFORT.zonnepanelen, comfortKort: COMFORT_KORT.zonnepanelen, woningwaarde: WAARDE_LABEL, voorwaarden: VOORWAARDEN.zonnepanelen,
      warmteafgifteControle: false, voorbeeld: false,
    });
  }
  if (!heeft("vloerverwarming")) {
    kansen.push({
      id: "vloerverwarming", aanbevolen: false,
      waarom: "Vloerverwarming verwarmt op een lage temperatuur. Dat past goed bij een warmtepomp en is vooral interessant als je de vloer toch aanpakt.",
      besparing: null, verbruik: null, terugverdientijd: null, kort: { besparing: null, terugverdientijd: null },
      comfort: COMFORT.vloerverwarming, comfortKort: COMFORT_KORT.vloerverwarming, woningwaarde: null, voorwaarden: VOORWAARDEN.vloerverwarming,
      warmteafgifteControle: false, voorbeeld: false,
    });
  }
  if (!heeft("thuisbatterij")) {
    kansen.push({
      id: "thuisbatterij", aanbevolen: heeft("zonnepanelen"),
      waarom: heeft("zonnepanelen")
        ? "Je hebt al zonnepanelen. Met een thuisbatterij bewaar je overdag opgewekte stroom voor 's avonds."
        : "Een thuisbatterij is pas zinvol als je zonnepanelen hebt. Daarom staat hij na de zonnepanelen.",
      besparing: null, verbruik: null, terugverdientijd: null, kort: { besparing: null, terugverdientijd: null },
      comfort: COMFORT.thuisbatterij, comfortKort: COMFORT_KORT.thuisbatterij, woningwaarde: null, voorwaarden: VOORWAARDEN.thuisbatterij,
      warmteafgifteControle: false, voorbeeld: false,
    });
  }

  // Hooguit twee isolatiemaatregelen en vier kansen in totaal bovenaan, in de volgorde hierboven; de rest
  // komt onder "later" (ook in die volgorde).
  let isolatieBovenaan = 0;
  for (const k of kansen) {
    if (!k.aanbevolen || !(ISOLATIE as string[]).includes(k.id)) continue;
    if (isolatieBovenaan < MAX_ISOLATIE_AANBEVOLEN) isolatieBovenaan++;
    else k.aanbevolen = false;
  }
  const geordend = [...kansen.filter(k => k.aanbevolen), ...kansen.filter(k => !k.aanbevolen)];
  geordend.forEach((k, i) => { k.aanbevolen = k.aanbevolen && i < MAX_AANBEVOLEN; });
  // Samenvatting voor de kop: de aanbevolen isolatiekansen samen doorgerekend met dezelfde rekentool
  // (besparing als optelling, begrensd op het eigen gasverbruik). Subsidie staat hier bewust niet in.
  // Alleen de aanbevolen kansen: dat is het advies; de "later"-kansen tellen niet mee in de kop.
  const advies = geordend.filter(k => k.aanbevolen);
  const isolatieIds = advies.filter(k => (ISOLATIE as string[]).includes(k.id)).map(k => k.id);
  const samen = isolatieIds.length ? berekenFinancieelOverzicht({
    maatregelIds: [...isolatieIds, ...(advies.some(k => k.id === "warmtepomp") ? ["warmtepomp"] : [])], houseType, bouwjaar,
    kruipruimte: invoer.kruipruimte, verwarming: invoer.verwarming, gasverbruik: invoer.gasverbruik, gasprijs: invoer.gasprijs, aanwezigOnbekend,
  }) : null;
  const samenvatting = {
    kansen: advies.length,
    isolatieBesparing: samen?.besparing ? samen.besparing.euro : null,
    warmtepompBesparing,
  };
  return { periode, samenvatting, kansen: geordend, nietToepasbaar, waarschijnlijkBijBouw };
}
