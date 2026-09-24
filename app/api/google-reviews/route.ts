import { isGoogleReviews } from "@/lib/google-reviews";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
let pending: Promise<Response> | null = null;
let retryAfter = 0;

async function loadReviews(key: string, placeId: string): Promise<Response> {
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=nl`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri" },
      cache: "no-store", signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error("Places unavailable");
    const data: unknown = await response.json();
    if (!isGoogleReviews(data)) throw new Error("Invalid Places response");
    return Response.json({ available: true, data }, { headers });
  } catch {
    // No content or keys are stored or logged; only a short failure cooldown.
    retryAfter = Date.now() + 30_000;
    return Response.json({ available: false }, { status: 503, headers });
  }
}

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return Response.json({ available: false }, { headers });
  if (Date.now() < retryAfter) return Response.json({ available: false }, { status: 503, headers });
  if (!pending) pending = loadReviews(key, placeId).finally(() => { pending = null; });
  return (await pending).clone();
}
