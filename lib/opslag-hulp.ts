// Gedeelde hulpmiddelen voor lib/woningdossier-opslag.ts en lib/energiescan-opslag.ts.
//
// Geen "use server" hier: bestanden met die richtlijn mogen alléén async
// functions exporteren (elke export daar wordt als Server Action
// beschouwd). Een gedeelde regex of type-only export zou de build laten
// falen ("Export ... doesn't exist"), dus staat dat hier in een gewoon
// bestand. Bevat zelf geen secret, maar hoort uitsluitend bij de
// server-only opslaglaag — vandaar toch "server-only", zodat een
// toekomstige (per ongeluk) client-import direct een buildfout geeft.
import "server-only";

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Rij = Record<string, unknown>;
export type Schrijf = (rij: Rij) => PromiseLike<{ error: { code?: string; message: string } | null }>;

/** Ontbreekt een kolom in Supabase (PGRST204), dan de rest wél opslaan en de kolom in de serverlog noemen. */
export async function schrijfMetOntbrekendeKolommen(rij: Rij, schrijf: Schrijf) {
  const kopie = { ...rij };
  for (let poging = 0; poging < 4; poging++) {
    const { error } = await schrijf(kopie);
    if (!error) return null;
    const kolom = error.code === "PGRST204" ? /'([^']+)' column/.exec(error.message)?.[1] : undefined;
    if (!kolom || !(kolom in kopie)) return error;
    console.warn(`[opslag] kolom "${kolom}" bestaat niet in Supabase; opgeslagen zonder dit veld.`);
    delete kopie[kolom];
  }
  return { code: undefined, message: "te veel ontbrekende kolommen" };
}
