"use server";
import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readScan, UUID, dakkapelTekst, type ScanSession } from "@/lib/scan-session";
import { leesGetal } from "@/lib/energie-schatting";
import { schrijfMetOntbrekendeKolommen } from "@/lib/opslag-hulp";

// Slaat de woningscan op in Supabase: de vaste woning-/energiegegevens in
// public.woningdossier (één rij per scan, upsert op id — nooit een nieuwe
// rij per stap), en de meerkeuzevelden (wensen, bestaande maatregelen,
// gekozen maatregelen) als losse rijen in hun eigen tabel
// (woning_wensen / bestaande_maatregelen / gekozen_maatregelen), telkens
// gekoppeld via woningdossier_id.
//
// Waarom altijd de secret key: woningdossier stond al open voor een
// eenmalige INSERT door de anon-sleutel, maar de drie kindtabellen
// weigeren élke INSERT van anon (RLS-test bevestigd: 42501 "new row
// violates row-level security policy"). Zonder SUPABASE_SECRET_KEY (server-
// only, nooit naar de browser) kan er dus helemaal niets in die tabellen
// worden weggeschreven; dit bestand faalt dan stil (console.warn, geen
// crash) in plaats van te doen alsof het gelukt is.
//
// Het dossier-id is een willekeurige uuid die de browser zelf aanmaakt bij
// het bevestigen van het adres en in sessionStorage bewaart; dat id wordt
// bij elke stap hergebruikt (upsert), zodat er precies één woningdossier
// per scan ontstaat.
//
// Oude JSON-kolom: `woningkenmerken` (jsonb) bestaat nog op woningdossier
// en blijft gevuld met de velden die (nog) geen eigen kolom hebben in het
// nieuwe schema (zie hieronder) — er gaat dus niets verloren, en er wordt
// niets verwijderd voordat de nieuwe opslag bewezen werkt.

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? "";

function client(): SupabaseClient | null {
  if (!URL_ || !SECRET_KEY) return null;
  return createClient(URL_, SECRET_KEY, { auth: { persistSession: false } });
}

const leeg = (v: string) => (v.trim() === "" ? null : v);
/** "2 bewoners" -> 2, "5 of meer bewoners" -> 5; leeg/onbekend -> null. De kolom aantal_bewoners is een geheel getal. */
const bewonersGetal = (v: string) => { const m = /^(\d+)/.exec(v.trim()); return m ? Number(m[1]) : null; };
/**
 * Alleen voor de opslag, niet voor de weergave/schatting elders: een
 * niet-plausibele waarde (bv. een woonoppervlakte van miljoenen m²) wordt
 * hier behandeld als "niet ingevuld" (null), net als een lege invoer.
 * `leesGetal` zelf (gedeeld met de rekenlogica) blijft ongewijzigd.
 */
const leesGetalBegrensd = (v: string, min: number, max: number) => {
  const n = leesGetal(v);
  return n !== null && n >= min && n <= max ? n : null;
};
/** "Anders" krijgt de vrije toelichting erbij, zoals ook al in scanMessage() gebeurt — geen nieuwe kolom nodig. */
const metToelichting = (lijst: string[], anders: string) => lijst.map((v) => (v === "Anders" && anders.trim() ? `Anders: ${anders.trim()}` : v));

function naarWoningdossierRij(s: ScanSession, afgerond: boolean) {
  return {
    id: s.dossierId,
    postcode: leeg(s.postcode),
    huisnummer: leeg(s.huisnummer),
    // straat/woonplaats zijn nieuwe kolommen waar geen los scanveld voor bestaat (alleen de
    // samengestelde addressLabel, bv. "Kievitstraat 1, 7622AB Borne") — bewust NIET met een
    // regex uit elkaar getrokken, want dat kan stilletjes verkeerd gaan. Zie rapportage.
    woningtype: s.houseType,
    bouwjaar: leesGetalBegrensd(s.bouwjaar, 1000, 2100),
    woonoppervlakte: leesGetalBegrensd(s.woonoppervlakte, 1, 2000),
    monument: leeg(s.monument),
    energielabel: leeg(s.energielabel),
    // Geen aparte dakkapel_aantal-kolom: "Meerdere: <toelichting>" gaat, net als op het scherm, in dakkapel zelf.
    dakkapel: s.dakkapel ? dakkapelTekst(s) : null,
    garage: leeg(s.garage),
    aanbouw: leeg(s.aanbouw),
    // "onbekend" blijft "onbekend", null = niet beantwoord; nooit stilzwijgend "nee".
    kruipruimte: s.kruipruimte,
    spouwmuur: s.spouwmuur,
    verwarming: s.verwarming,
    warmteafgifte: metToelichting(s.warmteafgifte, s.warmteafgifteAnders),
    warm_water: s.warmWater,
    aantal_bewoners: bewonersGetal(s.aantalBewoners),
    elektriciteitsverbruik: leesGetalBegrensd(s.elektriciteitsverbruik, 0, 200000),
    gasverbruik: leesGetalBegrensd(s.gasverbruik, 0, 100000),
    elektriciteitsprijs: leesGetalBegrensd(s.elektriciteitsprijs, 0, 10),
    gasprijs: leesGetalBegrensd(s.gasprijs, 0, 10),
    zonnepanelen_aantal: leesGetalBegrensd(s.zonnepanelenAantal, 0, 500),
    status: afgerond ? "afgerond" : "concept",
    scan_afgerond: afgerond,
    woningkenmerken: {
      addressLabel: leeg(s.addressLabel),
      manualAddress: s.manualAddress,
      woningBevestigd: s.woningBevestigd,
      hoekZijde: leeg(s.hoekZijde),
      dakkapelAantal: leeg(s.dakkapelAantal),
      bagOpgehaald: s.bagOpgehaald,
      vloeroppervlakte: leeg(s.vloeroppervlakte),
      dakoppervlakte: leeg(s.dakoppervlakte),
      gevelOppervlakte: leeg(s.gevelOppervlakte),
      warmteafgifteAnders: leeg(s.warmteafgifteAnders),
      warmteverbruik: leeg(s.warmteverbruik),
      warmteprijs: leeg(s.warmteprijs),
      aanwezigOnbekend: s.aanwezigOnbekend,
      wensenOnbekend: s.wensenOnbekend,
      advice: s.advice,
    },
  };
}

/**
 * Vervangt alle rijen voor dit dossier in `tabel` door de actuele lijst:
 * eerst verwijderen (alleen de rijen met dit woningdossier_id, dus nooit
 * een ander dossier), dan de huidige keuzes opnieuw invoegen. Eenvoudige,
 * veilige manier om te synchroniseren zonder dubbele of verouderde rijen.
 */
async function syncKindTabel(db: SupabaseClient, tabel: string, kolom: string, dossierId: string, waarden: string[]) {
  const { error: verwijderFout } = await db.from(tabel).delete().eq("woningdossier_id", dossierId);
  if (verwijderFout) { console.error(`[opslag] kon ${tabel} niet opschonen voor dossier ${dossierId}:`, verwijderFout.message); return false; }
  const unieke = [...new Set(waarden)];
  if (!unieke.length) return true;
  const { error: invoegFout } = await db.from(tabel).insert(unieke.map((waarde) => ({ woningdossier_id: dossierId, [kolom]: waarde })));
  if (invoegFout) { console.error(`[opslag] kon ${tabel} niet vullen voor dossier ${dossierId}:`, invoegFout.message); return false; }
  return true;
}

export async function slaWoningdossierOp(ruweSessie: string, afgerond: boolean): Promise<{ opgeslagen: boolean }> {
  // Nooit de browser vertrouwen: dezelfde validatie als bij het inlezen van sessionStorage.
  const s = readScan(ruweSessie);
  if (!s || !UUID.test(s.dossierId) || !s.woningBevestigd) return { opgeslagen: false };
  const db = client();
  if (!db) { console.warn("[woningdossier] SUPABASE_SECRET_KEY ontbreekt; niets opgeslagen (zie lib/woningdossier-opslag.ts)."); return { opgeslagen: false }; }
  try {
    const rij = naarWoningdossierRij(s, afgerond);
    const fout = await schrijfMetOntbrekendeKolommen(rij, (r) => db.from("woningdossier").upsert(r, { onConflict: "id" }));
    if (fout) { console.error("[woningdossier] opslaan mislukt:", fout.message); return { opgeslagen: false }; }
    const [wensenOk, aanwezigOk, gekozenOk] = await Promise.all([
      syncKindTabel(db, "woning_wensen", "wens", s.dossierId, s.wishes),
      syncKindTabel(db, "bestaande_maatregelen", "maatregel_id", s.dossierId, s.bestaandeMaatregelen),
      syncKindTabel(db, "gekozen_maatregelen", "maatregel_id", s.dossierId, s.measures),
    ]);
    return { opgeslagen: wensenOk && aanwezigOk && gekozenOk };
  } catch (e) {
    console.error("[woningdossier] onverwachte fout:", e);
    return { opgeslagen: false };
  }
}
