// Kengetallen voor het financiële woningplan. Er bestaat geen API voor investeringskosten of
// besparingen; dit zijn handmatig overgenomen cijfers van onafhankelijke bronnen, met bron, peildatum
// en aannames erbij. Rekenmethode: lib/woningplan-financieel.ts. Uitleg: docs/financieel-woningplan.md.

import type { HouseType } from "../woning-types";

// ── Milieu Centraal: kosten en gasbesparing per woningtype ─────────────────────────────────────
// Pagina's "laatst gewijzigd 14 oktober 2026", gecontroleerd 27 oktober 2026:
// - https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/dakisolatie/ (schuin dak, Rd 3,8)
// - https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/spouwmuurisolatie/
// - https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/vloerisolatie/ (Rd 3,5, uitbesteed)
// Besparing = "van geen naar goede isolatie" met een hr-ketel. Milieu Centraal's subsidiebedragen worden
// bewust niet gebruikt: de subsidie wordt hieronder met de RVO-tarieven en oppervlakten berekend.

export type McKengetal = { kosten: number; besparingGasM3: number };
export type BouwdeelMaatregel = "dakisolatie" | "gevelisolatie" | "vloerisolatie";

export const MC_KENGETALLEN: Record<BouwdeelMaatregel, Record<HouseType, McKengetal>> = {
  gevelisolatie: {
    tussenwoning: { kosten: 800, besparingGasM3: 180 },
    hoekwoning: { kosten: 1800, besparingGasM3: 400 },
    "twee-onder-een-kap": { kosten: 1900, besparingGasM3: 400 },
    vrijstaand: { kosten: 2700, besparingGasM3: 600 },
  },
  dakisolatie: {
    tussenwoning: { kosten: 6000, besparingGasM3: 320 },
    hoekwoning: { kosten: 6500, besparingGasM3: 340 },
    "twee-onder-een-kap": { kosten: 6500, besparingGasM3: 360 },
    vrijstaand: { kosten: 10000, besparingGasM3: 550 },
  },
  vloerisolatie: {
    tussenwoning: { kosten: 2150, besparingGasM3: 80 },
    hoekwoning: { kosten: 2240, besparingGasM3: 130 },
    "twee-onder-een-kap": { kosten: 2900, besparingGasM3: 170 },
    vrijstaand: { kosten: 4200, besparingGasM3: 250 },
  },
};

// Glas: Milieu Centraal geeft alleen een referentie (gemiddelde hoekwoning, 22 m² ramen, HR++-glas in
// bestaande kozijnen ter vervanging van dubbel glas: ± € 4.700, ± 70 m³ gas per jaar). Volgens dezelfde
// pagina schalen de kosten mee met het aantal vervangen ramen ("ongeveer de helft" bij de helft), dus
// wordt per m² gerekend en vermenigvuldigd met het raamoppervlak uit de RVO-referentiewoning.
// https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/triple-hr-of-vacuumglas/
export const MC_GLAS = { referentieM2: 22, kosten: 4700, besparingGasM3: 70 } as const;

// ── RVO: ISDE-tarieven voor isolatie (woningeigenaren) ─────────────────────────────────────────
// https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen, rechtstreeks
// gecontroleerd op 27 oktober 2026. De pagina noemt deze bedragen LETTERLIJK onder de kop
// "Subsidiebedrag voor uitvoering in 2025 of later": "Voor dakisolatie kunt u € 16,25 per m2
// ontvangen" en "Voor spouwmuurisolatie kunt u € 5,25 per m2 ontvangen" — geen apart bedrag voor
// 2026 in tekst (de 2026-tabel staat alleen in een afbeelding, niet leesbaar als tekst).
//
// Eerdere versie gebruikte € 17,50 / € 6,50, gebaseerd op een Milieu Centraal-zin ("€ 1,25 per m²
// hoger dan vorig jaar"). Die zin staat echter onder het kopje over beschermde dieren, noemt de
// ISDE niet met naam, en bevestigt niet dat het om spouwmuur- of dakisolatie specifiek gaat. Omdat
// dat niet aantoonbaar dezelfde regeling/maatregel is, is dit teruggedraaid naar het bedrag dat RVO
// zelf voor woningeigenaren noemt. Mocht RVO de 2026-tabel ooit als tekst publiceren, dan moeten
// deze bedragen daarmee worden vergeleken.
//
// Bij meer dan één isolatiemaatregel binnen 24 maanden, of isolatie gecombineerd met een warmtepomp,
// zonneboiler of warmtenetaansluiting, verdubbelt het bedrag per m² (RVO, expliciet in tekst).
// Milieu Centraal noemt glas uitdrukkelijk als een van de hoofdmaatregelen die meetellen.
//
// Of een maatregel daadwerkelijk voor dit bedrag in aanmerking komt, hangt af van de uitgevoerde
// werkzaamheden (o.a. de behaalde isolatiewaarde) en de ISDE-voorwaarden; dat wordt pas na aanvraag
// definitief. Omdat de oppervlakte bovendien een schatting uit een RVO-referentiewoning is, niet een
// meting van de eigen woning, noemt de rekenmotor dit een "woninggerichte indicatie", geen
// woninggerichte indicatie — zie ScenarioAard in lib/woningplan-financieel.ts.
export type Isde = { perM2: number; minM2: number; maxM2: number };
export const ISDE_ISOLATIE: Record<BouwdeelMaatregel | "glas-kozijnen", Isde> = {
  dakisolatie: { perM2: 16.25, minM2: 20, maxM2: 200 },
  gevelisolatie: { perM2: 5.25, minM2: 10, maxM2: 170 }, // spouwmuurisolatie
  vloerisolatie: { perM2: 5.5, minM2: 20, maxM2: 130 },
  "glas-kozijnen": { perM2: 25, minM2: 3, maxM2: 45 }, // HR++-glas zonder nieuwe kozijnen
};

// ── RVO Voorbeeldwoningen bestaande bouw 2022: mediane oppervlakten per woningtype en bouwperiode ──
// https://www.rvo.nl/sites/default/files/2023-01/brochure-voorbeeldwoningen-bestaande-bouw-2022.pdf
// Gebruikt als subsidiabele oppervlakte (dak = hellend dak, gevel = dichte gevel, vloer = begane
// grondvloer) en voor het glasoppervlak. Het werkelijke oppervlak van een woning kan afwijken.
export type Oppervlakten = { dak: number; gevel: number; vloer: number; raam: number };
export type Bouwperiode = { label: string; vanaf: number; tot: number } & Oppervlakten;

const periode = (label: string, vanaf: number, tot: number, vloer: number, gevel: number, dak: number, raam: number): Bouwperiode =>
  ({ label, vanaf, tot, vloer, gevel, dak, raam });

export const RVO_REFERENTIEWONINGEN: Record<HouseType, Bouwperiode[]> = {
  vrijstaand: [
    periode("tot 1965", 0, 1965, 89.59, 131.12, 84.42, 28.36),
    periode("1965–1974", 1965, 1975, 112.9, 126.68, 94.5, 38.08),
    periode("1975–1991", 1975, 1992, 93.0, 126.42, 100.86, 31.4),
    periode("1992–2005", 1992, 2006, 102.21, 133.3, 116.8, 39.06),
    periode("2006–2014", 2006, 2015, 110.82, 152.78, 112.15, 37.72),
    periode("2015 en later", 2015, 9999, 92.8, 176.12, 124.0, 46.08),
  ],
  "twee-onder-een-kap": [
    periode("tot 1965", 0, 1965, 66.58, 87.26, 53.6, 22.92),
    periode("1965–1974", 1965, 1975, 61.45, 91.68, 61.56, 30.19),
    periode("1975–1991", 1975, 1992, 61.4, 94.22, 64.4, 24.23),
    periode("1992–2005", 1992, 2006, 68.95, 103.3, 65.12, 27.22),
    periode("2006–2014", 2006, 2015, 68.08, 109.66, 72.6, 28.26),
    periode("2015 en later", 2015, 9999, 66.06, 93.94, 75.85, 21.34),
  ],
  tussenwoning: [
    periode("tot 1946", 0, 1946, 48.72, 41.58, 42.58, 19.3),
    periode("1946–1964", 1946, 1965, 44.21, 39.78, 48.0, 19.86),
    periode("1965–1974", 1965, 1975, 48.3, 37.67, 55.6, 24.98),
    periode("1975–1991", 1975, 1992, 49.15, 37.86, 58.4, 18.17),
    periode("1992–2005", 1992, 2006, 54.04, 46.38, 53.19, 22.37),
    periode("2006–2014", 2006, 2015, 51.48, 41.11, 61.67, 19.8),
    periode("2015 en later", 2015, 9999, 52.3, 42.29, 60.24, 18.0),
  ],
  hoekwoning: [
    periode("tot 1946", 0, 1946, 54.15, 86.72, 50.48, 21.32),
    periode("1946–1964", 1946, 1965, 46.6, 86.02, 48.15, 20.1),
    periode("1965–1974", 1965, 1975, 50.0, 87.4, 56.53, 26.6),
    periode("1975–1991", 1975, 1992, 50.0, 88.7, 58.46, 18.82),
    periode("1992–2005", 1992, 2006, 62.03, 103.6, 58.82, 23.39),
    periode("2006–2014", 2006, 2015, 56.8, 110.98, 59.38, 26.93),
    periode("2015 en later", 2015, 9999, 55.7, 95.2, 61.6, 19.22),
  ],
};

// Tot circa 1930 werden geen spouwmuren toegepast (RVO-brochure); dit is een bouwkundig gegeven over
// of een spouw bestáát, geen uitspraak over de huidige isolatiestatus. Spouwmuurisolatie wordt daarom
// alleen bij een ouder bouwjaar als "niet toepasbaar" uitgesloten. Of een bouwdeel al geïsoleerd ís,
// wordt nergens uit het bouwjaar afgeleid: het bouwjaar zegt niets over latere renovaties. Dat gebruikt
// in plaats daarvan wat de bewoner zelf al over bestaande maatregelen heeft ingevuld (zie
// lib/woningplan-financieel.ts: alleen maatregelen die de bewoner niet als "al gedaan" heeft
// aangevinkt komen in aanmerking, en bij "weet ik niet precies" wordt de besparing als voorbeeld
// gepresenteerd in plaats van als woninggerichte indicatie).
export const SPOUWMUREN_VANAF = 1930;

export const FINANCIEEL_BRONNEN = {
  milieuCentraal: { naam: "Milieu Centraal", peildatum: "14 oktober 2026", url: "https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/" },
  rvoIsde: { naam: "RVO (ISDE)", peildatum: "27 oktober 2026", url: "https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen" },
  rvoVoorbeeldwoningen: { naam: "RVO Voorbeeldwoningen 2022", url: "https://www.rvo.nl/sites/default/files/2023-01/brochure-voorbeeldwoningen-bestaande-bouw-2022.pdf" },
} as const;
