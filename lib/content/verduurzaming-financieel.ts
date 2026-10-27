// Investerings- en besparingskengetallen per woningtype, voor het uitgebreide (financiële)
// woningplan. Er bestaat geen API hiervoor: de MILIEU_CENTRAAL_API_KEY-koppeling in
// lib/milieu-centraal/ is uitsluitend de Energiesubsidiewijzer (regelingen), geen kosten of
// besparingen. Dit zijn daarom, zoals de opdracht vraagt, handmatig overgenomen cijfers van een
// betrouwbare, onafhankelijke bron (Milieu Centraal), met bron, peildatum en aannames vastgelegd.
//
// Bron, peildatum en methode (gecontroleerd 27 oktober 2026; pagina's zelf "laatst gewijzigd
// 14 oktober 2026"):
// - https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/spouwmuurisolatie/
// - https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/dakisolatie/
// - https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/vloerisolatie/
// - https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/triple-hr-of-vacuumglas/
// Gasprijsaanname: € 1,37 per m³ (Milieu Centraal: verwachte gemiddelde gasprijs 2026-2040).
// Besparing = overgang van "geen" naar "goede" isolatie (Rd-waarde 3,5 à 3,8, per maatregel).
// "subsidie" hieronder is Milieu Centraal's eigen landelijke indicatie (ISDE-achtig) per
// woningtype — dus NIET dezelfde bron als de regelingen in RegelingenInScan (de
// Energiesubsidiewijzer-API, met de actuele gemeentelijke/provinciale/landelijke regelingen).
// Bewust niet bij elkaar optellen: dat zou dubbeltelling zijn. Zie lib/woningplan-financieel.ts.
//
// Niet opgenomen: warmtepomp, zonnepanelen, thuisbatterij, vloerverwarming. Milieu Centraal
// publiceert hiervoor geen vergelijkbare, gedateerde tabel per woningtype; gevonden cijfers bij
// andere bronnen liepen te ver uiteen (systeemgrootte, salderingsregeling, energieprijzen) om
// als betrouwbare indicatie te tonen. Voor deze maatregelen toont het woningplan daarom geen
// bedrag, zie FINANCIEEL_ONDERBOUWD hieronder.

import type { HouseType } from "../woning-types";

export type KostenBesparing = { kosten: number; subsidie: number; besparingPerJaar: number };

const ISOLATIE_TABEL = {
  gevelisolatie: {
    tussenwoning: { kosten: 800, subsidie: 200, besparingPerJaar: 240 },
    hoekwoning: { kosten: 1800, subsidie: 450, besparingPerJaar: 575 },
    "twee-onder-een-kap": { kosten: 1900, subsidie: 450, besparingPerJaar: 575 },
    vrijstaand: { kosten: 2700, subsidie: 700, besparingPerJaar: 800 },
  },
  dakisolatie: {
    tussenwoning: { kosten: 6000, subsidie: 850, besparingPerJaar: 460 },
    hoekwoning: { kosten: 6500, subsidie: 900, besparingPerJaar: 480 },
    "twee-onder-een-kap": { kosten: 6500, subsidie: 950, besparingPerJaar: 510 },
    vrijstaand: { kosten: 10000, subsidie: 1500, besparingPerJaar: 750 },
  },
  vloerisolatie: {
    tussenwoning: { kosten: 2150, subsidie: 260, besparingPerJaar: 110 },
    hoekwoning: { kosten: 2240, subsidie: 280, besparingPerJaar: 180 },
    "twee-onder-een-kap": { kosten: 2900, subsidie: 350, besparingPerJaar: 230 },
    vrijstaand: { kosten: 4200, subsidie: 500, besparingPerJaar: 340 },
  },
} satisfies Record<string, Record<HouseType, KostenBesparing>>;

// Glas: Milieu Centraal publiceert geen tabel per woningtype, alleen één referentiescenario
// (gemiddelde hoekwoning, bestaande kozijnen, 22 m² glasoppervlak, HR++ i.p.v. dubbel glas).
// Wordt voor elk woningtype als dezelfde, duidelijk gelabelde referentie getoond — zie de
// toelichting die bij GLAS_REFERENTIE_TOELICHTING hoort.
const GLAS_REFERENTIE: KostenBesparing = { kosten: 4700, subsidie: 550, besparingPerJaar: 90 };
export const GLAS_REFERENTIE_TOELICHTING = "gebaseerd op een gemiddelde hoekwoning met 22 m² glasoppervlak in bestaande kozijnen; jouw werkelijke glasoppervlak en besparing kunnen afwijken";

export type FinancieelMaatregelId = keyof typeof ISOLATIE_TABEL | "glas-kozijnen";
export const FINANCIEEL_ONDERBOUWD: FinancieelMaatregelId[] = ["dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen"];

export function kostenBesparingVoor(maatregelId: string, houseType: HouseType): KostenBesparing | null {
  if (maatregelId === "glas-kozijnen") return GLAS_REFERENTIE;
  if (maatregelId in ISOLATIE_TABEL) return ISOLATIE_TABEL[maatregelId as keyof typeof ISOLATIE_TABEL][houseType];
  return null;
}

export const MC_FINANCIEEL_BRON = {
  naam: "Milieu Centraal",
  peildatum: "14 oktober 2026",
  gasprijs: "€ 1,37 per m³ (verwachte gemiddelde gasprijs 2026–2040)",
  url: "https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/",
};
