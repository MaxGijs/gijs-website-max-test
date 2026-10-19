import type { HouseType } from "@/lib/woning-types";

// Woningtype afleiden uit de BAG-plattegronden (pand-geometrie), voor adressen
// waar EP-Online geen (eenduidig) gebouwtype heeft — bijvoorbeeld omdat er geen
// energielabel geregistreerd staat. Puur rekenwerk, geen netwerk: het ophalen
// gebeurt in lib/bag/woningtypeUitBag.ts.
//
// Idee: tel met hoeveel andere woonpanden het eigen pand een muur deelt.
// - geen enkele gedeelde muur            → vrijstaande woning
// - twee of meer                         → tussenwoning
// - precies één, en die buur deelt verder
//   met niemand een muur                 → twee-onder-een-kap
// - precies één, en die buur zit wél
//   verder vast aan een woning           → hoekwoning (eind van een rij)
//
// Bewust voorzichtig: telt het eigen pand meer dan één verblijfsobject (flat,
// boven-/benedenwoning, woning boven een winkel, of een hele rij die als één
// pand is ingetekend), dan geven we geen woningtype en kiest de bewoner zelf.
// Panden zonder woonfunctie (garages, schuurtjes) tellen niet als buur.

export type BagPand = {
  id: string;
  /** Buitenringen van de plattegrond in RD-coördinaten (meters); meerdere bij een multipolygoon. */
  ringen: [number, number][][];
};

export type BagVerblijfsobject = {
  id: string;
  pandId: string;
  woonfunctie: boolean;
};

/** Minimale lengte (m) van een gedeelde muur om als "vastgebouwd" te tellen; voorkomt dat een rakend hoekje meetelt. */
export const MIN_GEDEELDE_MUUR = 2;
/** Tolerantie (m) tussen twee pandranden die als dezelfde muur gelden (tekenonnauwkeurigheid in de BAG). */
const TOLERANTIE = 0.3;
/** Afstand (m) tussen meetpunten langs de eigen gevel. */
const STAP = 0.25;

function afstandTotLijnstuk(px: number, py: number, [ax, ay]: [number, number], [bx, by]: [number, number]): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lengte2 = dx * dx + dy * dy;
  const t = lengte2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengte2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function ligtOpRand(px: number, py: number, pand: BagPand): boolean {
  for (const ring of pand.ringen) {
    for (let i = 0; i < ring.length - 1; i++) {
      if (afstandTotLijnstuk(px, py, ring[i], ring[i + 1]) <= TOLERANTIE) return true;
    }
  }
  return false;
}

function omhullende(pand: BagPand) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const ring of pand.ringen) for (const [x, y] of ring) {
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}

/** Lengte (m) van de rand van pand a die samenvalt met de rand van pand b. */
export function gedeeldeMuurLengte(a: BagPand, b: BagPand): number {
  const oa = omhullende(a);
  const ob = omhullende(b);
  if (oa.maxX + TOLERANTIE < ob.minX || ob.maxX + TOLERANTIE < oa.minX || oa.maxY + TOLERANTIE < ob.minY || ob.maxY + TOLERANTIE < oa.minY) return 0;
  let gedeeld = 0;
  for (const ring of a.ringen) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [ax, ay] = ring[i];
      const [bx, by] = ring[i + 1];
      const lengte = Math.hypot(bx - ax, by - ay);
      const stappen = Math.max(1, Math.round(lengte / STAP));
      for (let s = 0; s < stappen; s++) {
        const t = (s + 0.5) / stappen;
        if (ligtOpRand(ax + t * (bx - ax), ay + t * (by - ay), b)) gedeeld += lengte / stappen;
      }
    }
  }
  return gedeeld;
}

/**
 * Bepaalt het woningtype van het pand `eigenPandId` op basis van de omliggende
 * panden en verblijfsobjecten. Geeft null als het niet betrouwbaar te zeggen is.
 */
export function bepaalWoningtypeUitGeometrie(eigenPandId: string, panden: BagPand[], verblijfsobjecten: BagVerblijfsobject[]): HouseType | null {
  const woningenPerPand = new Map<string, number>();
  const objectenPerPand = new Map<string, number>();
  for (const vbo of new Map(verblijfsobjecten.map((v) => [`${v.id}:${v.pandId}`, v])).values()) {
    objectenPerPand.set(vbo.pandId, (objectenPerPand.get(vbo.pandId) ?? 0) + 1);
    if (vbo.woonfunctie) woningenPerPand.set(vbo.pandId, (woningenPerPand.get(vbo.pandId) ?? 0) + 1);
  }
  const pandenOpId = new Map(panden.map((p) => [p.id, p]));
  const eigen = pandenOpId.get(eigenPandId);
  // Alleen een pand met precies één verblijfsobject (de woning zelf) is een grondgebonden woning
  // die we kunnen typeren; een woning boven een winkel of een pand met meerdere woningen niet.
  if (!eigen || woningenPerPand.get(eigenPandId) !== 1 || objectenPerPand.get(eigenPandId) !== 1) return null;

  const vastgebouwdeWoonpanden = (pand: BagPand) =>
    panden.filter((p) => p.id !== pand.id && (woningenPerPand.get(p.id) ?? 0) > 0 && gedeeldeMuurLengte(pand, p) >= MIN_GEDEELDE_MUUR);

  const buren = vastgebouwdeWoonpanden(eigen);
  if (buren.length === 0) return "vrijstaand";
  if (buren.length >= 2) return "tussenwoning";

  const buur = buren[0];
  if ((woningenPerPand.get(buur.id) ?? 0) > 1) return "hoekwoning";
  const burenVanBuur = vastgebouwdeWoonpanden(buur).filter((p) => p.id !== eigen.id);
  return burenVanBuur.length === 0 ? "twee-onder-een-kap" : "hoekwoning";
}
