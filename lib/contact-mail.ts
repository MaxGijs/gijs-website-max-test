"use server";
import "server-only";

import { Resend } from "resend";
import { EMAIL } from "@/lib/opslag-hulp";
import { magDoorgaan } from "@/lib/rate-limit";

// Stuurt het contactformulier (app/contact/page.tsx -> components/ContactForm.tsx) als één
// interne e-mail naar Gijs. Zelfde architectuur als de energiescanaanvraag
// (lib/energiescan-mail.ts): server-only, vaste afzender/ontvanger uit serverconfig, nooit
// een secret of technisch detail naar de bezoeker. Geen Supabase hier: het contactformulier
// heeft geen eigen tabel nodig, alleen een e-mail.
//
// CONTACT_EMAIL_TO is een eigen env var (los van ENERGIESCAN_EMAIL_TO), zodat Thom dit
// adres in Vercel kan wijzigen zonder iets anders te raken. FROM hergebruikt de al
// geverifieerde ENERGIESCAN_EMAIL_FROM-configuratie: één geverifieerd afzenderadres is genoeg.

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_TO = process.env.CONTACT_EMAIL_TO ?? "";
const EMAIL_FROM = process.env.ENERGIESCAN_EMAIL_FROM ?? "";

const MAX = { naam: 100, email: 254, telefoon: 40, bericht: 5000 };
const OPSLAGFOUT = "Je bericht kon niet worden verstuurd. Bel of mail Gijs rechtstreeks.";

const tekst = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escapeHtml = (v: string): string =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export type ContactInvoer = { naam: unknown; email: unknown; telefoon: unknown; bericht: unknown; bedrijf?: unknown };

export async function verstuurContactMail(invoer: ContactInvoer): Promise<{ verstuurd: boolean; fout?: string }> {
  // Honeypot: "bedrijf" is een veld dat voor mensen onzichtbaar is (zie ContactForm.tsx) maar dat
  // formulier-bots vaak automatisch invullen. Gevuld = bot: doe alsof het gelukt is (geen hint
  // voor de bot dat hij geblokkeerd is), maar verstuur niets.
  if (tekst(invoer.bedrijf, 200)) return { verstuurd: true };
  if (!(await magDoorgaan("contact"))) return { verstuurd: false, fout: OPSLAGFOUT };

  // Nooit de browser vertrouwen: lengte en vorm hier opnieuw afdwingen, los van de HTML-maxLength/type="email".
  const naam = tekst(invoer.naam, MAX.naam);
  const email = tekst(invoer.email, MAX.email);
  const telefoon = tekst(invoer.telefoon, MAX.telefoon);
  const bericht = tekst(invoer.bericht, MAX.bericht);

  if (!naam) return { verstuurd: false, fout: "Vul je naam in." };
  if (!EMAIL.test(email)) return { verstuurd: false, fout: "Vul een geldig e-mailadres in." };
  if (!bericht) return { verstuurd: false, fout: "Vul je bericht in." };
  if (!RESEND_API_KEY || !EMAIL_TO || !EMAIL_FROM) {
    console.warn("[contact-mail] RESEND_API_KEY, CONTACT_EMAIL_TO of ENERGIESCAN_EMAIL_FROM ontbreekt; mail niet verstuurd.");
    return { verstuurd: false, fout: OPSLAGFOUT };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const datumTijd = new Date().toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Amsterdam" });
    const regels: [string, string][] = [["Naam", naam], ["E-mail", email], ["Telefoon", telefoon || "Niet ingevuld"]];
    const html = `<!doctype html><html lang="nl"><body style="margin:0;padding:0;background:#F4F6F5;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F5;padding:24px 0;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
<tr><td style="background:#133E35;padding:28px 32px;">
  <p style="margin:0;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">Gijs &middot; Contactformulier</p>
  <h1 style="margin:6px 0 0;color:#ffffff;font-size:21px;font-weight:700;">Nieuw contactverzoek via Gijs</h1>
  <p style="margin:10px 0 0;color:#cfe3dd;font-size:13px;">${escapeHtml(datumTijd)}</p>
</td></tr>
<tr><td style="padding:22px 32px 4px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${regels.map(([label, waarde]) => `<tr><td style="padding:6px 16px 6px 0;color:#5b6560;font-size:14px;width:120px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#1A1A1A;font-size:14px;vertical-align:top;">${escapeHtml(waarde)}</td></tr>`).join("")}
  </table>
</td></tr>
<tr><td style="padding:10px 32px 28px;">
  <h2 style="margin:0 0 10px;font-size:15px;font-weight:700;color:#133E35;">Bericht</h2>
  <p style="margin:0;color:#1A1A1A;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(bericht)}</p>
</td></tr>
</table></td></tr></table></body></html>`;
    const text = [
      "Nieuw contactverzoek via Gijs",
      datumTijd,
      "",
      ...regels.map(([label, waarde]) => `${label}: ${waarde}`),
      "",
      "Bericht:",
      bericht,
    ].join("\n");

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: email,
      subject: "Nieuw contactverzoek via Gijs",
      html,
      text,
    });
    if (error) { console.error("[contact-mail] Resend gaf een fout:", error.message); return { verstuurd: false, fout: OPSLAGFOUT }; }
    return { verstuurd: true };
  } catch (e) {
    console.error("[contact-mail] onverwachte fout:", e);
    return { verstuurd: false, fout: OPSLAGFOUT };
  }
}
