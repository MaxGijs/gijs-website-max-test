"use server";
import "server-only";

import type { HouseType } from "@/lib/woning-types";
import { haalWoningtypeOpUitBag } from "@/lib/bag/bagWfs";

/**
 * Server action: leidt het woningtype af uit de BAG-plattegronden (zie
 * lib/bag/woningtypeGeometrie.ts). Wordt gebruikt als EP-Online geen
 * eenduidig gebouwtype heeft. Retourneert null als het niet betrouwbaar
 * te bepalen is — dan kiest de bewoner zelf.
 */
export async function bepaalWoningtypeUitBag(adresseerbaarObjectId: string): Promise<HouseType | null> {
  return haalWoningtypeOpUitBag(adresseerbaarObjectId);
}
