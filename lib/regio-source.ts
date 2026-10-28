"use client";

// Regioherkomst: legt vast vanuit welke regiopagina een bezoeker naar de woningscan is gegaan.
// Opgeslagen in sessionStorage (tabblad-scoped, verdwijnt bij sluiten) zodat:
// - de herkomst de scan-stappen overleeft
// - een nieuwe browsersessie zonder voorgaande regio-klik geen oude waarde erft
// - geen persoonsgegevens worden opgeslagen (alleen openbare URL-segmenten)
//
// Wordt overschreven bij elke nieuwe regio-klik, zodat een gebruiker die een
// tweede regio bezoekt en daarna doorklikt de juiste herkomst krijgt.

export type RegioHerkomst = {
  source_region_page: string;   // bv. "/regio/gelderland/arnhem"
  source_province: string;      // bv. "gelderland"
  source_municipality: string;  // bv. "arnhem" (gemeente-slug, ook bij plaatspagina's)
};

const REGIO_SOURCE_KEY = "gijs-regio-herkomst-v1";

export function opslaanRegioHerkomst(herkomst: RegioHerkomst): void {
  try {
    sessionStorage.setItem(REGIO_SOURCE_KEY, JSON.stringify(herkomst));
  } catch { /* opslag kan geblokkeerd zijn; meten gaat dan zonder regio-params */ }
}

export function leesRegioHerkomst(): RegioHerkomst | null {
  try {
    const raw = sessionStorage.getItem(REGIO_SOURCE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (
      typeof v.source_region_page === "string" &&
      typeof v.source_province === "string" &&
      typeof v.source_municipality === "string"
    ) return v as RegioHerkomst;
  } catch { /* ongeldig of opslag geblokkeerd */ }
  return null;
}

export function wisRegioHerkomst(): void {
  try { sessionStorage.removeItem(REGIO_SOURCE_KEY); } catch { /* */ }
}
