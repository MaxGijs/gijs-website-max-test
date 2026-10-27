import type { HouseType } from "./woning-types";
import { kostenBesparingVoor, FINANCIEEL_ONDERBOUWD, type FinancieelMaatregelId } from "./content/verduurzaming-financieel";

// Zuivere rekenfunctie (geen I/O): telt de Milieu Centraal-kengetallen van de geselecteerde
// maatregelen bij elkaar op. Maatregelen zonder betrouwbare data (warmtepomp, zonnepanelen,
// thuisbatterij, vloerverwarming) komen in nogNietBerekenbaar terecht, nooit met een verzonnen
// bedrag. Besparingen zijn een optelling van losse Milieu Centraal-aannames (elk "van geen naar
// goede isolatie" vanuit dezelfde ongeïsoleerde uitgangssituatie); bij meerdere maatregelen
// tegelijk kan de werkelijke besparing iets lager uitvallen door overlap — zie de toelichting
// die hierbij in de UI hoort (FinancieelWoningplan.tsx), niet hier als rekencorrectie verzonnen.

export type FinancieelMaatregel = { id: string; kosten: number; subsidie: number; besparingPerJaar: number };

export type FinancieelOverzicht = {
  onderbouwd: FinancieelMaatregel[];
  nogNietBerekenbaar: string[];
  brutoInvestering: number;
  subsidieIndicatie: number;
  nettoInvestering: number;
  jaarlijkseBesparing: number;
  /** null als er niets te besparen valt (voorkomt delen door nul). */
  terugverdientijdJaren: number | null;
};

export function berekenFinancieelOverzicht(maatregelIds: string[], houseType: HouseType): FinancieelOverzicht {
  const onderbouwd: FinancieelMaatregel[] = [];
  const nogNietBerekenbaar: string[] = [];
  for (const id of maatregelIds) {
    const kb = kostenBesparingVoor(id, houseType);
    if (kb) onderbouwd.push({ id, ...kb });
    else nogNietBerekenbaar.push(id);
  }
  const brutoInvestering = onderbouwd.reduce((s, m) => s + m.kosten, 0);
  const subsidieIndicatie = onderbouwd.reduce((s, m) => s + m.subsidie, 0);
  const nettoInvestering = brutoInvestering - subsidieIndicatie;
  const jaarlijkseBesparing = onderbouwd.reduce((s, m) => s + m.besparingPerJaar, 0);
  return {
    onderbouwd,
    nogNietBerekenbaar,
    brutoInvestering,
    subsidieIndicatie,
    nettoInvestering,
    jaarlijkseBesparing,
    terugverdientijdJaren: jaarlijkseBesparing > 0 ? nettoInvestering / jaarlijkseBesparing : null,
  };
}

export const isFinancieelOnderbouwd = (maatregelId: string): maatregelId is FinancieelMaatregelId =>
  (FINANCIEEL_ONDERBOUWD as string[]).includes(maatregelId);
