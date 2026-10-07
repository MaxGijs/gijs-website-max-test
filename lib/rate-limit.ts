import "server-only";
import { headers } from "next/headers";

// Simpele in-memory rate limiter voor de formulieren (contactformulier, energiescanaanvraag):
// zonder dit kan een bot/script deze Server Actions rechtstreeks aanroepen (buiten de UI om) en
// onbeperkt Resend-mails versturen en/of Supabase-rijen aanmaken. Net als de bestaande cooldown in
// app/api/google-reviews/route.ts reset dit bij elke cold start/herdeploy — dat is geen probleem,
// het doel is simpele bots afremmen, niet een waterdichte garantie.
const VENSTER_MS = 10 * 60 * 1000; // 10 minuten
const MAX_PER_VENSTER = 5;
const pogingen = new Map<string, number[]>();

export async function magDoorgaan(formulier: string): Promise<boolean> {
  let ip = "onbekend";
  try {
    const h = await headers();
    ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "onbekend";
  } catch {
    // headers() kan buiten een request-context niet beschikbaar zijn (bv. tests); dan geldt de
    // gedeelde "onbekend"-sleutel, wat nog steeds misbruik binnen één proces beperkt.
  }
  const sleutel = `${formulier}:${ip}`;
  const nu = Date.now();
  const recent = (pogingen.get(sleutel) ?? []).filter(t => nu - t < VENSTER_MS);
  if (recent.length >= MAX_PER_VENSTER) return false;
  recent.push(nu);
  pogingen.set(sleutel, recent);
  return true;
}
