import type { NextRequest } from "next/server";

// Straatbeeld (Google Street View Static API) van een adres, voor de foto in
// stap 1 van de woningscan (components/woning/Woningbeeld.tsx).
//
// Deze route haalt het beeld op de server op met de Google-serversleutel, zodat
// die sleutel nooit in de browser of in een afbeeldings-URL terechtkomt. Eerst
// wordt de (gratis) metadata-dienst gevraagd of er een buitenbeeld bestaat;
// alleen dan wordt het (betaalde) beeld opgehaald. Geen sleutel, geen beeld of
// een storing → 404, en de scan toont de placeholder.
//
// Niets wordt opgeslagen of gecachet (Google-voorwaarden): Cache-Control no-store.
// Sleutel: GOOGLE_STREETVIEW_API_KEY, of anders dezelfde serversleutel als de
// Google-reviews (GOOGLE_PLACES_API_KEY). Die sleutel moet in Google Cloud ook
// "Street View Static API" mogen gebruiken. Zie docs/straatbeeld.md.

export const dynamic = "force-dynamic";

const METADATA_URL = "https://maps.googleapis.com/maps/api/streetview/metadata";
const BEELD_URL = "https://maps.googleapis.com/maps/api/streetview";
const GEEN_CACHE = { "Cache-Control": "private, no-store" };
const ADRES_REGEX = /^[\p{L}\p{N} .,'\-/()]{3,120}$/u;

// Simpele rem op misbruik per IP (reset bij een cold start, net als lib/rate-limit.ts):
// een bezoeker ziet hooguit een handvol adressen; scripts mogen de Google-tegoed niet leegtrekken.
const VENSTER_MS = 10 * 60 * 1000;
const MAX_PER_VENSTER = 20;
const pogingen = new Map<string, number[]>();

function magDoorgaan(ip: string): boolean {
  const nu = Date.now();
  const recent = (pogingen.get(ip) ?? []).filter((t) => nu - t < VENSTER_MS);
  if (recent.length >= MAX_PER_VENSTER) return false;
  recent.push(nu);
  pogingen.set(ip, recent);
  return true;
}

const geenBeeld = (status = 404) => new Response(null, { status, headers: GEEN_CACHE });

export async function GET(request: NextRequest) {
  const key = process.env.GOOGLE_STREETVIEW_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
  const adres = request.nextUrl.searchParams.get("adres")?.trim() ?? "";
  if (!key || !ADRES_REGEX.test(adres)) return geenBeeld();

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "onbekend";
  if (!magDoorgaan(ip)) return geenBeeld(429);

  const locatie = `${adres}, Nederland`;
  try {
    const metadata = await fetch(`${METADATA_URL}?${new URLSearchParams({ location: locatie, source: "outdoor", key })}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const meta: unknown = metadata.ok ? await metadata.json() : null;
    if (!meta || typeof meta !== "object" || (meta as { status?: unknown }).status !== "OK") return geenBeeld();

    // Zonder "heading" richt Google de camera vanaf het dichtstbijzijnde beeldpunt op het adres.
    const beeld = await fetch(
      `${BEELD_URL}?${new URLSearchParams({ size: "640x480", location: locatie, source: "outdoor", fov: "80", return_error_code: "true", key })}`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) },
    );
    const type = beeld.headers.get("content-type") ?? "";
    if (!beeld.ok || !beeld.body || !type.startsWith("image/")) return geenBeeld();
    return new Response(beeld.body, { headers: { "Content-Type": type, ...GEEN_CACHE } });
  } catch {
    // Nooit de URL loggen: daar staat de sleutel in.
    return geenBeeld();
  }
}
