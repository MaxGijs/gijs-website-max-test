import type { GemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { cbsWijkenVoor, normaliseerWijknaam } from "@/lib/content/cbs-wijken";

/** Een bestaande plaatspagina; de href komt altijd uit de routebron (REGIO_PLAATSEN), nooit afgeleid van een naam. */
export type PlaatsPagina = { slug: string; naam: string; href: string };
export type PlaatsGroep = { id: "dorpen" | "buurtschappen" | "wijken" | "overig"; label: string; plaatsen: PlaatsPagina[] };

/** Groepeert bestaande plaatspagina's op type. Dorp of buurtschap alleen via `plaatsTypen` in het verhaal,
 *  wijk alleen via de CBS-wijkenlijst; zonder bron komt een plaats onder "Overige plaatsen". Lege groepen vallen weg. */
export function groepeerPlaatsen(v: GemeenteVerhaal, gemeenteSlug: string, paginas: PlaatsPagina[]): PlaatsGroep[] {
  const cbs = new Set(cbsWijkenVoor(gemeenteSlug).map(w => normaliseerWijknaam(w.naam)));
  const groepen: PlaatsGroep[] = [
    { id: "dorpen", label: "Dorpen", plaatsen: [] },
    { id: "buurtschappen", label: "Buurtschappen", plaatsen: [] },
    { id: "wijken", label: "Wijken", plaatsen: [] },
    { id: "overig", label: "Overige plaatsen", plaatsen: [] },
  ];
  const groep = (id: PlaatsGroep["id"]) => groepen.find(g => g.id === id)!;
  for (const p of paginas) {
    const type = v.plaatsTypen?.[p.slug];
    if (type === "dorp") groep("dorpen").plaatsen.push(p);
    else if (type === "buurtschap") groep("buurtschappen").plaatsen.push(p);
    else if (cbs.has(normaliseerWijknaam(p.naam))) groep("wijken").plaatsen.push(p);
    else groep("overig").plaatsen.push(p);
  }
  for (const g of groepen) g.plaatsen.sort((a, b) => a.naam.localeCompare(b.naam, "nl"));
  return groepen.filter(g => g.plaatsen.length > 0);
}
