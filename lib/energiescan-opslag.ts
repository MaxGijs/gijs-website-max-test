"use server";
import "server-only";

import { createClient } from "@supabase/supabase-js";
import { readScan, UUID } from "@/lib/scan-session";
import { slaWoningdossierOp } from "@/lib/woningdossier-opslag";
import { EMAIL } from "@/lib/opslag-hulp";
import { verstuurEnergiescanMail } from "@/lib/energiescan-mail";
import { magDoorgaan } from "@/lib/rate-limit";
import { geldigTelefoonnummer } from "./telefoon";
const TELEFOON_FOUT = "Vul een geldig telefoonnummer in, bijvoorbeeld 06 12345678.";

// Slaat de aanvraag voor een gratis energiescan op in public.energiescanaanvraag,
// gekoppeld aan het bestaande woningdossier via woningdossier_id (dezelfde
// uuid als scan.dossierId/woningdossier.id).
//
// Vereist SUPABASE_SECRET_KEY: deze tabel weigert, net als de andere
// kindtabellen, elke INSERT van de anon-sleutel (RLS-test bevestigd:
// "new row violates row-level security policy"). Zonder de secret key
// mislukt dit dus altijd stil — zie lib/woningdossier-opslag.ts voor
// dezelfde afweging.
//
// Het afronden van de scan (woningdossier.status = "afgerond") en het
// indienen van deze aanvraag zijn twee aparte gebeurtenissen: iemand kan
// het woningplan afronden zonder een aanvraag te doen. Daarom wordt het
// woningdossier hier altijd eerst bijgewerkt (met scan_afgerond = true),
// en pas daarna de aanvraag zelf weggeschreven.

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? "";
const OPSLAGFOUT = "De aanvraag kon niet worden opgeslagen. Bel of mail Gijs voor een echte afspraak.";

export async function verstuurEnergiescanAanvraag(ruweSessie: string, honeypot?: string): Promise<{ verstuurd: boolean; fout?: string }> {
  // Honeypot: "honeypot" is een veld dat voor mensen onzichtbaar is (zie WoningFlow.tsx) maar dat
  // formulier-bots vaak automatisch invullen. Gevuld = bot: doe alsof het gelukt is (geen hint
  // voor de bot dat hij geblokkeerd is), maar sla niets op.
  if (typeof honeypot === "string" && honeypot.trim()) return { verstuurd: true };
  if (!(await magDoorgaan("energiescan"))) return { verstuurd: false, fout: OPSLAGFOUT };

  // Nooit de browser vertrouwen: dezelfde validatie als in het formulier, opnieuw server-side.
  const s = readScan(ruweSessie);
  if (!s || !s.woningBevestigd || !UUID.test(s.dossierId)) return { verstuurd: false, fout: OPSLAGFOUT };

  const voornaam = s.name.trim(), achternaam = s.achternaam.trim();
  const naam = `${voornaam} ${achternaam}`.trim();
  const email = s.email.trim();
  const telefoon = s.telefoon.trim();
  // Voornaam, achternaam, e-mailadres en telefoonnummer zijn alle vier verplicht.
  if (!voornaam || !achternaam) return { verstuurd: false, fout: "Vul je voornaam en achternaam in." };
  if (!EMAIL.test(email)) return { verstuurd: false, fout: "Vul een geldig e-mailadres in." };
  if (!geldigTelefoonnummer(telefoon)) return { verstuurd: false, fout: TELEFOON_FOUT };
  if (!URL_ || !SECRET_KEY) { console.warn("[energiescanaanvraag] SUPABASE_SECRET_KEY ontbreekt; niets opgeslagen."); return { verstuurd: false, fout: OPSLAGFOUT }; }

  // Zorg dat het woningdossier (en de gekoppelde wensen/maatregelen) up-to-date en "afgerond" zijn
  // vóór de koppeling; twee losse gebeurtenissen die hier wel na elkaar gebeuren.
  const { opgeslagen } = await slaWoningdossierOp(ruweSessie, true);
  if (!opgeslagen) return { verstuurd: false, fout: OPSLAGFOUT };

  try {
    const db = createClient(URL_, SECRET_KEY, { auth: { persistSession: false } });
    const { error } = await db.from("energiescanaanvraag").insert({
      woningdossier_id: s.dossierId,
      naam,
      email: email || null,
      telefoon: telefoon || null,
      voorkeursmoment: s.voorkeursmoment || null,
      // Wat de bewoner wil wijzigen aan wat er al is, komt mee in de opmerking (geen eigen kolom).
      opmerking: [s.advice && s.wijzigToelichting.trim() ? `Wil iets wijzigen aan wat er al is: ${s.wijzigToelichting.trim()}` : "", s.opmerking.trim()].filter(Boolean).join("\n\n") || null,
      status: "nieuw",
    });
    if (error) { console.error("[energiescanaanvraag] opslaan mislukt:", error.message); return { verstuurd: false, fout: OPSLAGFOUT }; }

    // De aanvraag staat nu veilig in Supabase; dat is de bron van waarheid en
    // verandert niet meer. De interne mail is een extra stap erna: wachten we
    // hier bewust op (in plaats van "fire and forget"), zodat de server-
    // functie niet eindigt terwijl het versturen nog bezig is. Lukt de mail
    // niet, dan wordt dat alleen gelogd — de aanvraag blijft "verstuurd".
    await verstuurEnergiescanMail(s.dossierId).catch((e) => {
      console.error("[energiescanaanvraag] interne mail kon niet worden verstuurd:", e);
    });
    return { verstuurd: true };
  } catch (e) {
    console.error("[energiescanaanvraag] onverwachte fout:", e);
    return { verstuurd: false, fout: OPSLAGFOUT };
  }
}
