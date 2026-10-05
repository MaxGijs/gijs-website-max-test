"use server";
import "server-only";

import { mapGebouwtypeNaarHouseType } from "@/lib/ep-online/woningtypeMapping";
import type { HouseType } from "@/lib/woning-types";

// Energielabel + (waar mogelijk) woningtype via EP-Online (RVO), de
// officiële bron voor geregistreerde energielabels. Gebruikt hetzelfde
// BAG-adresseerbaarobject-id dat PDOK al meegeeft bij het adres opzoeken
// (lib/pdok/adresZoeken.ts) — geen nieuwe adreszoekactie nodig.
//
// API: https://public.ep-online.nl/api/v5/PandEnergielabel/AdresseerbaarObject/{id}
// (live swagger-spec opgehaald en gecontroleerd: public.ep-online.nl/swagger/v5/swagger.json).
// Header "Authorization: <sleutel>" (geen "Bearer"-prefix, zo eist EP-Online het).
//
// Faalt altijd stil (geen sleutel, geen label geregistreerd, dienst niet
// bereikbaar): dit is een bonus-verrijking, geen verplicht onderdeel van de
// scan. Nooit de sleutel zelf loggen.
const EP_ONLINE_API_KEY = process.env.EP_ONLINE_API_KEY ?? "";
const BASE_URL = "https://public.ep-online.nl/api/v5/PandEnergielabel";

type PandEnergielabelV5 = {
  Registratiedatum?: string;
  Energieklasse?: string | null;
  Gebouwtype?: string | null;
};

export type EnergielabelResultaat = {
  /** De letter van het geregistreerde energielabel (bv. "C"), of null als er niets geregistreerd staat. */
  energieklasse: string | null;
  /** Alleen gevuld als het geregistreerde gebouwtype betrouwbaar naar een van de vier Gijs-woningtypes mapt. */
  houseType: HouseType | null;
};

/**
 * Haalt het meest recent geregistreerde energielabel (en waar mogelijk het
 * woningtype) op bij een BAG-adresseerbaarobject-id. Retourneert null bij
 * elke fout of als er niets geregistreerd staat — de woningscan gaat dan
 * gewoon verder zonder deze gegevens.
 */
export async function haalEnergielabelOp(adresseerbaarObjectId: string): Promise<EnergielabelResultaat | null> {
  if (!EP_ONLINE_API_KEY || !adresseerbaarObjectId) return null;
  try {
    const response = await fetch(`${BASE_URL}/AdresseerbaarObject/${encodeURIComponent(adresseerbaarObjectId)}`, {
      headers: { Accept: "application/json", Authorization: EP_ONLINE_API_KEY },
      cache: "no-store",
    });
    // 404 = geen geregistreerd label voor dit adres; dat is een normale, verwachte uitkomst.
    if (response.status === 404) return { energieklasse: null, houseType: null };
    if (!response.ok) {
      console.warn(`[ep-online] onverwachte status ${response.status} bij het ophalen van het energielabel.`);
      return null;
    }
    const data = (await response.json()) as PandEnergielabelV5[];
    if (!Array.isArray(data) || data.length === 0) return { energieklasse: null, houseType: null };

    // Kan meerdere registraties bevatten (herinspecties); de meest recente telt.
    const laatste = [...data].sort((a, b) => (b.Registratiedatum ?? "").localeCompare(a.Registratiedatum ?? ""))[0];
    return {
      energieklasse: laatste.Energieklasse?.trim() || null,
      houseType: mapGebouwtypeNaarHouseType(laatste.Gebouwtype),
    };
  } catch (e) {
    console.error("[ep-online] kon energielabel niet ophalen:", e);
    return null;
  }
}
