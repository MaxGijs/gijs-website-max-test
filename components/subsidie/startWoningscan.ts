"use client";

import { track } from "@/lib/analytics";
import { freshScan, readScan, sameAddress, SCAN_KEY } from "@/lib/scan-session";
import type { HouseType } from "@/lib/woning-types";

// Vanuit de subsidiecheck door naar de woningscan, met het adres alvast ingevuld. Net als bij de
// adresinvoer op de homepage (AddressScan) gaat het adres via sessionStorage en niet via de URL;
// alleen het woningtype en eventueel de maatregel staan in de URL (niet persoonsgebonden).
export function woningscanUrl(opties: { postcode?: string; huisnummer?: string; houseType: HouseType; maatregel?: string; cta: string }) {
  const { postcode = "", huisnummer = "", houseType, maatregel, cta } = opties;
  track({ name: "cta_clicked", cta });
  if (postcode.trim()) {
    try {
      const bestaand = readScan(sessionStorage.getItem(SCAN_KEY));
      const nieuw = freshScan(postcode.trim().toUpperCase(), huisnummer.trim(), houseType);
      // Was de bezoeker al bezig met een scan voor dit adres? Dan die gewoon voortzetten.
      if (!bestaand || !sameAddress(bestaand, nieuw)) sessionStorage.setItem(SCAN_KEY, JSON.stringify(nieuw));
    } catch { /* opslag kan geblokkeerd zijn; de scan vraagt het adres dan gewoon */ }
  }
  const params = new URLSearchParams({ woningtype: houseType });
  if (maatregel) params.set("maatregel", maatregel);
  return `/woning?${params}`;
}
