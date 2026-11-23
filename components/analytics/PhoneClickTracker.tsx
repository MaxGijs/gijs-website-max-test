"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

function bepaalPlaats(link: HTMLAnchorElement): string {
  const explicietePlaats = link.dataset.phonePlace;
  if (explicietePlaats) return explicietePlaats;

  if (link.closest("footer")) return "footer";

  const pad = window.location.pathname;
  if (pad === "/contact") return "contactpagina";
  if (pad === "/woning") return "woningscan";
  if (pad.startsWith("/kennis/")) return "kennisartikel";
  if (pad.startsWith("/maatregelen/")) return "maatregelpagina";
  if (pad.startsWith("/regio/")) return "regiopagina";
  return "pagina";
}

/**
 * Meet iedere klik op een tel:-link, ook bij telefoonnummers die later aan de site worden
 * toegevoegd. De exacte pagina registreert GA4 zelf via page_location; `plaats` groepeert het
 * soort pagina zonder het telefoonnummer of andere persoonsgegevens mee te sturen.
 */
export function PhoneClickTracker() {
  useEffect(() => {
    function registreerTelefoonklik(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (!link) return;

      track({ name: "phone_clicked", plaats: bepaalPlaats(link) });
    }

    // Capture zorgt dat de dataLayer-push plaatsvindt voordat de browser de telefoon-app opent.
    document.addEventListener("click", registreerTelefoonklik, true);
    return () => document.removeEventListener("click", registreerTelefoonklik, true);
  }, []);

  return null;
}
