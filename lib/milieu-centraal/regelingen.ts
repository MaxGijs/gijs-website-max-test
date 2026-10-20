import "server-only";
import { getFilters, zoekRegelingen, type Doelgroep as McDoelgroep, type Regeling } from "./client";
import type { Doelgroep, Gemeente, Niveau, SubsidieRegeling } from "./types";

// Alle regelingen van de Energiesubsidiewijzer voor één gemeente: subsidies, leningen en overige
// regelingen van de gemeente, de regio, de provincie en het Rijk. Vertaald naar de maatregelen van
// Gijs (lib/measures.ts), zodat ze in de woningscan en op de maatregelpagina's terugkomen.

const PDOK_FREE = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free";
const EEN_WEEK = 60 * 60 * 24 * 7;

const normaal = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

// ── Gemeente bepalen (PDOK Locatieserver, Kadaster) ──

type PdokDoc = Record<string, unknown>;

async function pdok(params: Record<string, string>): Promise<PdokDoc[] | null> {
  try {
    const res = await fetch(`${PDOK_FREE}?${new URLSearchParams({ rows: "1", ...params })}`, {
      next: { revalidate: EEN_WEEK },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { response?: { docs?: PdokDoc[] } };
    return data.response?.docs ?? [];
  } catch {
    return null;
  }
}

const tekst = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/** Gemeentenaam zonder toevoeging: PDOK schrijft bijv. "Hengelo (O)". */
const zonderToevoeging = (l: string) => l.replace(/\s*\(.*\)\s*$/, "");

/** Gemeente en adres bij een postcode (en eventueel huisnummer). null = PDOK onbereikbaar. */
export async function gemeenteVoorAdres(postcode: string, huisnummer?: string): Promise<{ gemeente: Gemeente; adres?: string } | "niet-gevonden" | null> {
  const fl = "gemeentecode gemeentenaam provincienaam weergavenaam";
  const nummer = huisnummer?.match(/^\d+/)?.[0];
  const opAdres = nummer ? await pdok({ q: `postcode:${postcode} AND huisnummer:${nummer}`, fq: "type:adres", fl }) : [];
  // Geen huisnummer of niet gevonden: de gemeente volgt ook uit de postcode alleen.
  const docs = opAdres?.length ? opAdres : await pdok({ q: `postcode:${postcode}`, fq: "type:postcode", fl });
  if (docs === null) return null;
  const doc = docs[0];
  const code = tekst(doc?.gemeentecode);
  const naam = tekst(doc?.gemeentenaam);
  if (!doc || !code || !naam) return "niet-gevonden";
  return {
    gemeente: { code, naam: zonderToevoeging(naam), provincie: tekst(doc.provincienaam) ?? "" },
    adres: opAdres?.length ? tekst(doc.weergavenaam) : undefined,
  };
}

/** Gemeente bij een gemeentenaam (voor de regiopagina's). */
export async function gemeenteVoorNaam(naam: string): Promise<Gemeente | null> {
  const docs = await pdok({ q: `gemeentenaam:"${naam.replace(/"/g, "")}"`, fq: "type:gemeente", fl: "gemeentecode gemeentenaam provincienaam" });
  const doc = docs?.[0];
  const code = tekst(doc?.gemeentecode);
  const gevonden = tekst(doc?.gemeentenaam);
  if (!doc || !code || !gevonden || normaal(zonderToevoeging(gevonden)) !== normaal(naam)) return null;
  return { code, naam: zonderToevoeging(gevonden), provincie: tekst(doc.provincienaam) ?? "" };
}

// ── Maatregelen van Milieu Centraal naar die van Gijs ──

const ISOLATIE = ["dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen"];
const VAST: Record<string, string[]> = {
  "isolatie en glas": ISOLATIE,
  warmtepomp: ["warmtepomp"],
  zonnepanelen: ["zonnepanelen"],
  thuisbatterij: ["thuisbatterij"],
};
// Voor als Milieu Centraal fijnere maatregelen gebruikt (bijv. "Spouwmuurisolatie").
const PATRONEN: [string, RegExp][] = [
  ["gevelisolatie", /spouw|gevelisolatie|muurisolatie/i],
  ["dakisolatie", /dakisolatie|zolder/i],
  ["vloerisolatie", /vloerisolatie|bodemisolatie|kruipruimte/i],
  ["glas-kozijnen", /glas|hr\+\+|kozijn/i],
  ["warmtepomp", /warmtepomp/i],
  ["zonnepanelen", /zonnepane/i],
  ["thuisbatterij", /thuisbatterij|thuisaccu/i],
  ["vloerverwarming", /vloerverwarming|laagtemperatuur/i],
];

function voorGijs(r: Regeling): string[] {
  const uit = new Set<string>();
  for (const m of r.maatregelen) {
    const vast = VAST[normaal(m)];
    if (vast) vast.forEach((s) => uit.add(s));
    else if (!/vergroen/i.test(m)) for (const [id, p] of PATRONEN) if (p.test(m)) uit.add(id);
  }
  return [...uit];
}

// ── Niveau: gemeente, regio, provincie of landelijk ──

// Landelijke regelingen hebben als locatie het hele postcodebereik, bijv. "0000-9999".
const LANDELIJK = /^0{4}\s*-\s*9{4}$/;

function niveauVan(r: Regeling, g: Gemeente): { niveau: Niveau; deelgebied: boolean } {
  const locaties = r.locaties.map(normaal);
  const eigen = normaal(g.naam);
  const noemtGemeente = locaties.some((l) => l === eigen || zonderToevoeging(l) === eigen);
  const isEigen = !!r.aanbieder && normaal(r.aanbieder) === `gemeente ${eigen}`;
  if (!locaties.length || locaties.some((l) => LANDELIJK.test(l) || l === "nederland" || l === "landelijk")) return { niveau: "landelijk", deelgebied: false };
  if (r.aanbieder && /^provincie\b/i.test(r.aanbieder)) return { niveau: "provinciaal", deelgebied: false };
  if (noemtGemeente || isEigen) return { niveau: "gemeentelijk", deelgebied: !noemtGemeente && locaties.length > 0 };
  const provincie = normaal(g.provincie);
  if (provincie && locaties.some((l) => l === provincie || l === `provincie ${provincie}`)) return { niveau: "provinciaal", deelgebied: false };
  return { niveau: "regionaal", deelgebied: false };
}

const VOLGORDE: Record<Niveau, number> = { gemeentelijk: 0, regionaal: 1, provinciaal: 2, landelijk: 3 };
const TYPEVOLGORDE = { subsidie: 0, lening: 1, overig: 2 } as const;
const DOELGROEP: Record<Doelgroep, McDoelgroep> = { eigenaar: "Woningeigenaar", vve: "Vereniging van Eigenaren" };

/** De stad-ID van Milieu Centraal: "pdok-" plus de gemeentecode. Valt terug op de naam (ook toegestaan volgens de API-gids). */
async function cityIdVoor(g: Gemeente) {
  const filters = await getFilters();
  const code = g.code.replace(/^GM/i, "").padStart(4, "0");
  const opCode = filters?.steden.find((s) => s.id === `pdok-${code}`);
  if (opCode) return opCode.id;
  return filters?.steden.find((s) => normaal(zonderToevoeging(s.naam)) === normaal(g.naam))?.id ?? g.naam;
}

/** Alle geldende regelingen voor een gemeente. null = geen sleutel of storing bij Milieu Centraal. */
export async function regelingenVoorGemeente(g: Gemeente, doelgroep: Doelgroep = "eigenaar"): Promise<SubsidieRegeling[] | null> {
  const lijst = await zoekRegelingen(await cityIdVoor(g), DOELGROEP[doelgroep]);
  if (!lijst) return null;
  const vandaag = new Date().toISOString().slice(0, 10);
  return lijst
    .filter((r) => !r.einde || r.einde >= vandaag)
    .map((r): SubsidieRegeling => ({
      id: r.id,
      titel: r.titel,
      type: r.type,
      ...niveauVan(r, g),
      intro: r.intro,
      aanvullend: r.aanvullend,
      bedragen: r.bedragen,
      voorwaarden: r.voorwaarden,
      url: r.url,
      aanbieder: r.aanbieder,
      aanbiederUrl: r.aanbiederUrl,
      maatregelenMc: r.maatregelen,
      voor: voorGijs(r),
      einde: r.einde,
    }))
    .sort((a, b) => VOLGORDE[a.niveau] - VOLGORDE[b.niveau] || TYPEVOLGORDE[a.type] - TYPEVOLGORDE[b.type] || a.titel.localeCompare(b.titel, "nl"));
}
