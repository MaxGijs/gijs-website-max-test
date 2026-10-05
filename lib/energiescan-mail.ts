"use server";
import "server-only";

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { SCAN_MEASURES } from "@/lib/scan-session";

// Stuurt, ná een succesvolle opslag in `energiescanaanvraag`, één interne
// e-mail naar Gijs met het volledige dossier. Haalt daarvoor de VIEW
// `woningdossier_overzicht` op (bestaande database, hier niets aan
// gewijzigd) en zet die om in een rustige HTML-mail.
//
// Bron van waarheid blijft Supabase: deze functie wordt pas aangeroepen
// nadat de aanvraag al veilig is opgeslagen (zie lib/energiescan-opslag.ts),
// en een mislukte mail verandert daar niets aan — er wordt niets
// teruggedraaid, er komt geen tweede dossier, en de bezoeker ziet nooit een
// technische foutmelding of API-sleutel. Fouten gaan alleen naar de
// serverlog (nooit de RESEND_API_KEY zelf).
//
// Geen generiek "verstuur een mail"-endpoint: deze functie neemt alleen een
// woningdossier_id, haalt zelf de bijbehorende gegevens op en stuurt altijd
// naar hetzelfde, vaste ENERGIESCAN_EMAIL_TO-adres — er is geen manier om
// van buitenaf een ander e-mailadres of andere inhoud te laten versturen.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? "";
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_TO = process.env.ENERGIESCAN_EMAIL_TO ?? "";
const EMAIL_FROM = process.env.ENERGIESCAN_EMAIL_FROM ?? "";

const NIET_INGEVULD = "Niet ingevuld";

type OverzichtRij = {
  postcode: string | null; huisnummer: string | null; straat: string | null; woonplaats: string | null;
  woningtype: string | null; bouwjaar: string | number | null; woonoppervlakte: number | null; monument: string | null;
  energielabel: string | null;
  dakkapel: string | null; garage: string | null; aanbouw: string | null; kruipruimte: string | null; spouwmuur: string | null;
  verwarming: string | null; warmteafgifte: string | null; warm_water: string | null;
  aantal_bewoners: number | null; elektriciteitsverbruik: number | null; gasverbruik: number | null;
  elektriciteitsprijs: number | null; gasprijs: number | null; zonnepanelen_aantal: number | null;
  wensen: string | null; bestaande_maatregelen: string | null; gekozen_maatregelen: string | null;
  naam: string | null; email: string | null; telefoon: string | null; voorkeursmoment: string | null; opmerking: string | null;
};

const escapeHtml = (v: unknown): string =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const weergave = (v: unknown, leeg = NIET_INGEVULD) => {
  if (v === null || v === undefined) return leeg;
  const t = String(v).trim();
  return t === "" ? leeg : t;
};
/** Zelfde betekenis als antwoordTekst() in lib/scan-session.ts: "onbekend" is iets anders dan "nee". */
const antwoordWeergave = (v: string | null) => (v === "ja" ? "Ja" : v === "nee" ? "Nee" : v === "onbekend" ? "Onbekend" : NIET_INGEVULD);

/** verwarming/warmteafgifte/warm_water komen uit de view als json-array-in-tekst, bv. '["Cv-ketel"]'. */
function arrayWeergave(v: string | null): string {
  if (!v) return NIET_INGEVULD;
  try {
    const lijst: unknown = JSON.parse(v);
    if (Array.isArray(lijst) && lijst.length) return lijst.map(String).join(", ");
  } catch { /* geen geldige JSON: toon de ruwe tekst hieronder */ }
  return v || NIET_INGEVULD;
}

/** wensen komt uit de view al als leesbare, kommagescheiden tekst (bv. "Lagere energiekosten, Meer wooncomfort"). */
const naarLijst = (v: string | null) => (v ? v.split(/,\s*/).map((x) => x.trim()).filter(Boolean) : []);

/** bestaande_maatregelen/gekozen_maatregelen zijn kommagescheiden maatregel-id's; toon het bestaande label. */
const MAATREGEL_LABEL = new Map(SCAN_MEASURES.map((m) => [m.id, m.label]));
const maatregelenWeergave = (v: string | null) => naarLijst(v).map((id) => MAATREGEL_LABEL.get(id) ?? id);

function adresWeergave(r: OverzichtRij): string {
  const straatEnNummer = [r.straat, r.huisnummer].filter((x) => x && String(x).trim()).join(" ");
  const plaatsRegel = [r.postcode, r.woonplaats].filter((x) => x && String(x).trim()).join(" ");
  return [straatEnNummer, plaatsRegel].filter(Boolean).join(", ") || "Adres onbekend";
}

function sectieHtml(titel: string, rijen: [string, string][]) {
  const rijenHtml = rijen
    .map(([label, waarde]) => `<tr>
      <td style="padding:6px 16px 6px 0;color:#5b6560;font-size:14px;width:200px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;color:#1A1A1A;font-size:14px;vertical-align:top;">${escapeHtml(waarde)}</td>
    </tr>`)
    .join("");
  return `<tr><td style="padding:22px 32px 4px;">
    <h2 style="margin:0 0 10px;font-size:15px;font-weight:700;color:#133E35;">${escapeHtml(titel)}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rijenHtml}</table>
  </td></tr>`;
}

function lijstHtml(titel: string, items: string[]) {
  const inhoud = items.length
    ? `<ul style="margin:0;padding-left:18px;color:#1A1A1A;font-size:14px;">${items.map((i) => `<li style="margin:2px 0;">${escapeHtml(i)}</li>`).join("")}</ul>`
    : `<p style="margin:0;color:#5b6560;font-size:14px;">${NIET_INGEVULD}</p>`;
  return `<tr><td style="padding:22px 32px 4px;">
    <h2 style="margin:0 0 10px;font-size:15px;font-weight:700;color:#133E35;">${escapeHtml(titel)}</h2>
    ${inhoud}
  </td></tr>`;
}

function bouwEmailHtml(r: OverzichtRij, datumTijd: string, adres: string) {
  return `<!doctype html>
<html lang="nl"><body style="margin:0;padding:0;background:#F4F6F5;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
<tr><td style="background:#133E35;padding:28px 32px;">
  <p style="margin:0;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">Gijs &middot; Woningscan</p>
  <h1 style="margin:6px 0 0;color:#ffffff;font-size:21px;font-weight:700;">Nieuwe energiescanaanvraag</h1>
  <p style="margin:10px 0 0;color:#cfe3dd;font-size:13px;">${escapeHtml(datumTijd)}</p>
  <p style="margin:2px 0 0;color:#cfe3dd;font-size:13px;">${escapeHtml(adres)}</p>
</td></tr>
${sectieHtml("Contactgegevens", [
  ["Naam", weergave(r.naam)],
  ["E-mail", weergave(r.email)],
  ["Telefoon", weergave(r.telefoon)],
  ["Voorkeursmoment", weergave(r.voorkeursmoment)],
  ["Opmerking", weergave(r.opmerking)],
])}
${sectieHtml("Woning", [
  ["Adres", adres],
  ["Postcode", weergave(r.postcode)],
  ["Huisnummer", weergave(r.huisnummer)],
  ["Woonplaats", weergave(r.woonplaats)],
  ["Woningtype", weergave(r.woningtype)],
  ["Bouwjaar", weergave(r.bouwjaar)],
  ["Woonoppervlakte", r.woonoppervlakte != null ? `${r.woonoppervlakte} m²` : NIET_INGEVULD],
  ["Energielabel", weergave(r.energielabel, "Niet gevonden")],
  ["Monument", weergave(r.monument)],
  ["Dakkapel", weergave(r.dakkapel)],
  ["Garage", weergave(r.garage)],
  ["Aanbouw", weergave(r.aanbouw)],
  ["Kruipruimte", antwoordWeergave(r.kruipruimte)],
  ["Spouwmuur", antwoordWeergave(r.spouwmuur)],
])}
${sectieHtml("Energie", [
  ["Verwarming", arrayWeergave(r.verwarming)],
  ["Warmteafgifte", arrayWeergave(r.warmteafgifte)],
  ["Warm water", arrayWeergave(r.warm_water)],
  ["Aantal bewoners", weergave(r.aantal_bewoners)],
  ["Elektriciteitsverbruik", r.elektriciteitsverbruik != null ? `${r.elektriciteitsverbruik} kWh/jaar` : NIET_INGEVULD],
  ["Gasverbruik", r.gasverbruik != null ? `${r.gasverbruik} m³/jaar` : NIET_INGEVULD],
  ["Elektriciteitsprijs", r.elektriciteitsprijs != null ? `€ ${r.elektriciteitsprijs} /kWh` : NIET_INGEVULD],
  ["Gasprijs", r.gasprijs != null ? `€ ${r.gasprijs} /m³` : NIET_INGEVULD],
  ["Aantal zonnepanelen", weergave(r.zonnepanelen_aantal)],
])}
${lijstHtml("Wensen", naarLijst(r.wensen))}
${lijstHtml("Bestaande maatregelen", maatregelenWeergave(r.bestaande_maatregelen))}
${lijstHtml("Woningplan / gekozen maatregelen", maatregelenWeergave(r.gekozen_maatregelen))}
<tr><td style="padding:20px 32px 28px;border-top:1px solid #e5e7eb;">
  <p style="margin:0;color:#5b6560;font-size:12px;">Automatisch gegenereerd vanuit de digitale woningscan van Gijs.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function bouwEmailText(r: OverzichtRij, datumTijd: string, adres: string) {
  const sectie = (titel: string, rijen: [string, string][]) => [`\n${titel}`, ...rijen.map(([l, w]) => `  ${l}: ${w}`)].join("\n");
  const lijst = (titel: string, items: string[]) => [`\n${titel}`, items.length ? items.map((i) => `  - ${i}`).join("\n") : `  ${NIET_INGEVULD}`].join("\n");
  return [
    `Nieuwe energiescanaanvraag`,
    datumTijd,
    adres,
    sectie("Contactgegevens", [
      ["Naam", weergave(r.naam)], ["E-mail", weergave(r.email)], ["Telefoon", weergave(r.telefoon)],
      ["Voorkeursmoment", weergave(r.voorkeursmoment)], ["Opmerking", weergave(r.opmerking)],
    ]),
    sectie("Woning", [
      ["Adres", adres], ["Postcode", weergave(r.postcode)], ["Huisnummer", weergave(r.huisnummer)], ["Woonplaats", weergave(r.woonplaats)],
      ["Woningtype", weergave(r.woningtype)], ["Bouwjaar", weergave(r.bouwjaar)],
      ["Woonoppervlakte", r.woonoppervlakte != null ? `${r.woonoppervlakte} m²` : NIET_INGEVULD],
      ["Energielabel", weergave(r.energielabel, "Niet gevonden")],
      ["Monument", weergave(r.monument)], ["Dakkapel", weergave(r.dakkapel)], ["Garage", weergave(r.garage)], ["Aanbouw", weergave(r.aanbouw)],
      ["Kruipruimte", antwoordWeergave(r.kruipruimte)], ["Spouwmuur", antwoordWeergave(r.spouwmuur)],
    ]),
    sectie("Energie", [
      ["Verwarming", arrayWeergave(r.verwarming)], ["Warmteafgifte", arrayWeergave(r.warmteafgifte)], ["Warm water", arrayWeergave(r.warm_water)],
      ["Aantal bewoners", weergave(r.aantal_bewoners)],
      ["Elektriciteitsverbruik", r.elektriciteitsverbruik != null ? `${r.elektriciteitsverbruik} kWh/jaar` : NIET_INGEVULD],
      ["Gasverbruik", r.gasverbruik != null ? `${r.gasverbruik} m³/jaar` : NIET_INGEVULD],
      ["Elektriciteitsprijs", r.elektriciteitsprijs != null ? `€ ${r.elektriciteitsprijs} /kWh` : NIET_INGEVULD],
      ["Gasprijs", r.gasprijs != null ? `€ ${r.gasprijs} /m³` : NIET_INGEVULD],
      ["Aantal zonnepanelen", weergave(r.zonnepanelen_aantal)],
    ]),
    lijst("Wensen", naarLijst(r.wensen)),
    lijst("Bestaande maatregelen", maatregelenWeergave(r.bestaande_maatregelen)),
    lijst("Woningplan / gekozen maatregelen", maatregelenWeergave(r.gekozen_maatregelen)),
  ].join("\n");
}

/**
 * Haalt het dossier op uit `woningdossier_overzicht` en stuurt de interne
 * e-mail. Faalt altijd stil (console.error, geen throw): de aanvraag staat
 * al veilig in Supabase voordat dit wordt aangeroepen, dus een mailfout mag
 * daar niets aan veranderen.
 */
export async function verstuurEnergiescanMail(woningdossierId: string): Promise<{ verzonden: boolean }> {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.warn("[energiescan-mail] SUPABASE_SECRET_KEY ontbreekt; kon dossier niet ophalen."); return { verzonden: false }; }
  if (!RESEND_API_KEY || !EMAIL_TO || !EMAIL_FROM) { console.warn("[energiescan-mail] RESEND_API_KEY, ENERGIESCAN_EMAIL_TO of ENERGIESCAN_EMAIL_FROM ontbreekt; mail niet verstuurd."); return { verzonden: false }; }
  try {
    const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
    const { data, error } = await db.from("woningdossier_overzicht").select("*").eq("id", woningdossierId).maybeSingle();
    if (error || !data) { console.error("[energiescan-mail] kon woningdossier_overzicht niet ophalen:", error?.message ?? "geen rij gevonden"); return { verzonden: false }; }
    const rij = data as OverzichtRij;
    const datumTijd = new Date().toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Amsterdam" });
    const adres = adresWeergave(rij);

    const resend = new Resend(RESEND_API_KEY);
    const { error: mailFout } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `Nieuwe energiescanaanvraag – ${adres}`,
      html: bouwEmailHtml(rij, datumTijd, adres),
      text: bouwEmailText(rij, datumTijd, adres),
    });
    if (mailFout) { console.error("[energiescan-mail] Resend gaf een fout:", mailFout.message); return { verzonden: false }; }
    return { verzonden: true };
  } catch (e) {
    console.error("[energiescan-mail] onverwachte fout:", e);
    return { verzonden: false };
  }
}
