// Stuurt een geslaagde energiescan-aanvraag door naar de Make-koppeling
// "Website-aanvraag → Teamleader lead". Die zoekt het contact op e-mailadres,
// maakt het zo nodig aan, zet een deal in de pipeline en geeft het contact de
// tag "WhatsApp over aanvraag" als het vinkje aan stond (standaard aan; geen marketingtoestemming).
//
// Slaapt tot LEAD_WEBHOOK_URL én LEAD_WEBHOOK_TOKEN in Vercel staan: zonder
// die twee gebeurt er niets en werkt de site precies zoals voorheen. De
// aanvraag staat al veilig in Supabase voordat dit draait, dus een fout hier
// wordt alleen gelogd en verandert niets aan wat de bewoner ziet.
//
// Bewust geen "use server": dit is een interne hulpfunctie, geen Server Action
// (dan zou elke export van buitenaf aan te roepen zijn). "server-only" zorgt
// dat een import vanuit de browser een buildfout geeft.
import "server-only";

import { scanMessage, type ScanSession } from "@/lib/scan-session";

const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL ?? "";
const WEBHOOK_TOKEN = process.env.LEAD_WEBHOOK_TOKEN ?? "";

const isMobiel = (nummer: string) => /^(\+31|0031|0)6/.test(nummer.replace(/[\s()-]/g, ""));

export async function stuurLeadDoor(s: ScanSession): Promise<{ doorgestuurd: boolean }> {
  if (!WEBHOOK_URL || !WEBHOOK_TOKEN) return { doorgestuurd: false };

  const voornaam = s.name.trim();
  const achternaam = s.achternaam.trim();
  const email = s.email.trim();
  const telefoon = s.telefoon.trim();
  const naam = `${voornaam} ${achternaam}`.trim();
  const straat = [s.straat.trim(), s.huisnummer.trim()].filter(Boolean).join(" ");

  const contactNieuw = {
    first_name: voornaam,
    last_name: achternaam,
    emails: [{ type: "primary", email }],
    telephones: telefoon ? [{ type: isMobiel(telefoon) ? "mobile" : "phone", number: telefoon }] : [],
    ...(straat && s.postcode.trim() && s.woonplaats.trim()
      ? { addresses: [{ type: "primary", address: { line_1: straat, postal_code: s.postcode.trim(), city: s.woonplaats.trim(), country: "NL" } }] }
      : {}),
    language: "nl",
    remarks: "Herkomst: website (woningscan)",
  };

  // Make plakt dealTitelJson en dealNotitieJson letterlijk in de Teamleader-body,
  // dus die moeten zelf al geldige JSON-waarden zijn (een string mét aanhalingstekens).
  const payload = {
    token: WEBHOOK_TOKEN,
    onderdeel: "klantaanvraag",
    contactZoekJson: JSON.stringify({ filter: { email: { type: "primary", email } } }),
    contactNieuwJson: JSON.stringify(contactNieuw),
    dealTitelJson: JSON.stringify(`Energiescan ${naam} (website)`),
    dealNotitieJson: JSON.stringify(scanMessage(s)),
    whatsappToestemming: s.whatsappToestemming === true,
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) { console.error("[lead-doorsturen] Make gaf status", res.status); return { doorgestuurd: false }; }
    return { doorgestuurd: true };
  } catch (e) {
    console.error("[lead-doorsturen] Make niet bereikbaar:", e instanceof Error ? e.message : e);
    return { doorgestuurd: false };
  }
}
