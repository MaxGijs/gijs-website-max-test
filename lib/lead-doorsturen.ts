// Stuurt aanvragen van de website door naar de Make-koppeling
// "Website-aanvraag → Teamleader lead". Die zoekt het contact op e-mailadres,
// maakt het zo nodig aan, zet een deal in de pipeline en geeft het contact de
// tag "WhatsApp over aanvraag" als het vinkje aan stond (standaard aan; geen marketingtoestemming).
//
// Twee soorten aanvragen gaan door: de energiescan-aanvraag (stuurLeadDoor) en het
// contactformulier (stuurContactDoor). Beide gebruiken hetzelfde formaat, zodat één
// Make-scenario alles afhandelt; de dealtitel laat zien waar de aanvraag vandaan komt.
//
// Slaapt tot LEAD_WEBHOOK_URL én LEAD_WEBHOOK_TOKEN in Vercel staan: zonder
// die twee gebeurt er niets en werkt de site precies zoals voorheen. Een fout
// hier wordt alleen gelogd en verandert niets aan wat de bewoner ziet.
//
// Bewust geen "use server": dit is een interne hulpfunctie, geen Server Action
// (dan zou elke export van buitenaf aan te roepen zijn). "server-only" zorgt
// dat een import vanuit de browser een buildfout geeft.
import "server-only";

import { scanMessage, type ScanSession } from "@/lib/scan-session";

const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL ?? "";
const WEBHOOK_TOKEN = process.env.LEAD_WEBHOOK_TOKEN ?? "";
const HERKOMST = "groeninjestraat.nl";

const isMobiel = (nummer: string) => /^(\+31|0031|0)6/.test(nummer.replace(/[\s()-]/g, ""));

type Lead = {
  voornaam: string;
  achternaam: string;
  email: string;
  telefoon: string;
  adres?: { straat: string; postcode: string; woonplaats: string };
  herkomstOmschrijving: string;
  dealTitel: string;
  dealNotitie: string;
  whatsappToestemming: boolean;
};

// Teamleader wil altijd een achternaam. Eén los woord ("Jan") wordt daarom de achternaam.
function splitsNaam(naam: string): { voornaam: string; achternaam: string } {
  const delen = naam.trim().split(/\s+/).filter(Boolean);
  if (delen.length <= 1) return { voornaam: "", achternaam: delen[0] ?? "" };
  return { voornaam: delen[0], achternaam: delen.slice(1).join(" ") };
}

async function naarMake(lead: Lead, logLabel: string): Promise<{ doorgestuurd: boolean }> {
  if (!WEBHOOK_URL || !WEBHOOK_TOKEN) return { doorgestuurd: false };

  const { voornaam, achternaam, email, telefoon, adres } = lead;
  const contactNieuw = {
    ...(voornaam ? { first_name: voornaam } : {}),
    last_name: achternaam || email,
    emails: [{ type: "primary", email }],
    telephones: telefoon ? [{ type: isMobiel(telefoon) ? "mobile" : "phone", number: telefoon }] : [],
    ...(adres && adres.straat && adres.postcode && adres.woonplaats
      ? { addresses: [{ type: "primary", address: { line_1: adres.straat, postal_code: adres.postcode, city: adres.woonplaats, country: "NL" } }] }
      : {}),
    language: "nl",
    remarks: `Herkomst: ${lead.herkomstOmschrijving}`,
  };

  // Make plakt dealTitelJson en dealNotitieJson letterlijk in de Teamleader-body,
  // dus die moeten zelf al geldige JSON-waarden zijn (een string mét aanhalingstekens).
  const payload = {
    token: WEBHOOK_TOKEN,
    onderdeel: "klantaanvraag",
    contactZoekJson: JSON.stringify({ filter: { email: { type: "primary", email } } }),
    contactNieuwJson: JSON.stringify(contactNieuw),
    dealTitelJson: JSON.stringify(lead.dealTitel),
    dealNotitieJson: JSON.stringify(lead.dealNotitie),
    whatsappToestemming: lead.whatsappToestemming,
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) { console.error(`[lead-doorsturen] ${logLabel}: Make gaf status`, res.status); return { doorgestuurd: false }; }
    return { doorgestuurd: true };
  } catch (e) {
    console.error(`[lead-doorsturen] ${logLabel}: Make niet bereikbaar:`, e instanceof Error ? e.message : e);
    return { doorgestuurd: false };
  }
}

export async function stuurLeadDoor(s: ScanSession): Promise<{ doorgestuurd: boolean }> {
  const voornaam = s.name.trim();
  const achternaam = s.achternaam.trim();
  const naam = `${voornaam} ${achternaam}`.trim();
  return naarMake({
    voornaam,
    achternaam,
    email: s.email.trim(),
    telefoon: s.telefoon.trim(),
    adres: { straat: [s.straat.trim(), s.huisnummer.trim()].filter(Boolean).join(" "), postcode: s.postcode.trim(), woonplaats: s.woonplaats.trim() },
    herkomstOmschrijving: `website ${HERKOMST} (woningscan)`,
    dealTitel: `Energiescan ${naam} (${HERKOMST})`,
    dealNotitie: scanMessage(s),
    whatsappToestemming: s.whatsappToestemming === true,
  }, "energiescan");
}

export async function stuurContactDoor(c: { naam: string; email: string; telefoon: string; bericht: string }): Promise<{ doorgestuurd: boolean }> {
  const { voornaam, achternaam } = splitsNaam(c.naam);
  const notitie = [
    `Bericht via het contactformulier op ${HERKOMST}.`,
    "",
    `Naam: ${c.naam}`,
    `E-mailadres: ${c.email}`,
    `Telefoonnummer: ${c.telefoon || "Niet ingevuld"}`,
    "",
    "Bericht:",
    c.bericht,
  ].join("\n");
  return naarMake({
    voornaam,
    achternaam,
    email: c.email,
    telefoon: c.telefoon,
    herkomstOmschrijving: `website ${HERKOMST} (contactformulier)`,
    dealTitel: `Contactformulier ${c.naam} (${HERKOMST})`,
    dealNotitie: notitie,
    whatsappToestemming: false,
  }, "contactformulier");
}
