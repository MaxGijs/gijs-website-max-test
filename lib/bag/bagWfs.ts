import type { HouseType } from "@/lib/woning-types";
import { bepaalWoningtypeUitGeometrie, type BagPand, type BagVerblijfsobject } from "@/lib/bag/woningtypeGeometrie";

// Haalt de BAG-panden en -verblijfsobjecten rond een adres op via de openbare
// BAG WFS van PDOK (geen sleutel nodig) en leidt daar het woningtype uit af
// (zie lib/bag/woningtypeGeometrie.ts). Faalt altijd stil: dit is een
// aanvulling, geen verplicht onderdeel van de scan.
//
// Alleen voor gebruik op de server — via de server action in
// lib/bag/woningtypeUitBag.ts.

const WFS_URL = "https://service.pdok.nl/lv/bag/wfs/v2_0";
/** Zoekgebied (m) rond het adres: ruim genoeg voor de buren én de buren van de buren. */
const ZOEKSTRAAL = 60;
const TIMEOUT_MS = 6000;

type GeoJsonGeometrie =
  | { type: "Polygon"; coordinates: number[][][] }
  | { type: "MultiPolygon"; coordinates: number[][][][] }
  | { type: "Point"; coordinates: number[] };
type Feature = { properties?: Record<string, unknown>; geometry?: GeoJsonGeometrie | null };

async function wfs(params: Record<string, string>): Promise<Feature[]> {
  const url = new URL(WFS_URL);
  const vast = { service: "WFS", version: "2.0.0", request: "GetFeature", outputFormat: "application/json", srsName: "EPSG:28992" };
  for (const [k, v] of Object.entries({ ...vast, ...params })) url.searchParams.set(k, v);
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`BAG WFS status ${response.status}`);
  const data = (await response.json()) as { features?: Feature[] };
  return Array.isArray(data.features) ? data.features : [];
}

function tekst(waarde: unknown): string {
  return typeof waarde === "string" ? waarde : typeof waarde === "number" ? String(waarde) : "";
}

function naarPand(feature: Feature): BagPand | null {
  const id = tekst(feature.properties?.identificatie);
  const g = feature.geometry;
  if (!id || !g) return null;
  const buitenringen = g.type === "Polygon" ? [g.coordinates[0]] : g.type === "MultiPolygon" ? g.coordinates.map((p) => p[0]) : [];
  const ringen = buitenringen
    .filter((r): r is number[][] => Array.isArray(r) && r.length >= 4)
    .map((r) => r.map(([x, y]) => [x, y] as [number, number]));
  return ringen.length > 0 ? { id, ringen } : null;
}

function naarVerblijfsobjecten(feature: Feature): BagVerblijfsobject[] {
  const id = tekst(feature.properties?.identificatie);
  // Een verblijfsobject kan (zelden) in meerdere panden liggen; PDOK geeft die dan komma-gescheiden.
  const pandIds = tekst(feature.properties?.pandidentificatie).split(",").map((s) => s.trim()).filter(Boolean);
  const woonfunctie = tekst(feature.properties?.gebruiksdoel).includes("woonfunctie");
  return id ? pandIds.map((pandId) => ({ id, pandId, woonfunctie })) : [];
}

/** Woningtype voor een BAG-adresseerbaarobject-id (16 cijfers), of null als het niet betrouwbaar te bepalen is. */
export async function haalWoningtypeOpUitBag(adresseerbaarObjectId: string): Promise<HouseType | null> {
  if (!/^\d{16}$/.test(adresseerbaarObjectId)) return null;
  try {
    const [eigen] = await wfs({
      typeName: "bag:verblijfsobject",
      filter: `<Filter><PropertyIsEqualTo><PropertyName>identificatie</PropertyName><Literal>${adresseerbaarObjectId}</Literal></PropertyIsEqualTo></Filter>`,
    });
    if (!eigen || eigen.geometry?.type !== "Point") return null;
    const eigenVbo = naarVerblijfsobjecten(eigen);
    // Meerdere panden of geen woonfunctie: niet te typeren als grondgebonden woning.
    if (eigenVbo.length !== 1 || !eigenVbo[0].woonfunctie) return null;

    const [x, y] = eigen.geometry.coordinates;
    const bbox = `${x - ZOEKSTRAAL},${y - ZOEKSTRAAL},${x + ZOEKSTRAAL},${y + ZOEKSTRAAL},EPSG:28992`;
    const [pandFeatures, vboFeatures] = await Promise.all([
      wfs({ typeName: "bag:pand", bbox }),
      wfs({ typeName: "bag:verblijfsobject", bbox }),
    ]);
    const panden = pandFeatures.map(naarPand).filter((p): p is BagPand => p !== null);
    const verblijfsobjecten = vboFeatures.flatMap(naarVerblijfsobjecten);
    return bepaalWoningtypeUitGeometrie(eigenVbo[0].pandId, panden, verblijfsobjecten);
  } catch (e) {
    console.warn("[bag] woningtype kon niet uit de BAG worden afgeleid:", e instanceof Error ? e.message : e);
    return null;
  }
}
