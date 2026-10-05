// Aansluitpunt voor een echte foto/straatbeeld van het adres (bijvoorbeeld
// Cyclomedia of Google Street View). De sleutel is nog fictief: zolang
// NEXT_PUBLIC_STRAATBEELD_API_KEY leeg is, toont de scan een placeholder.
export const STRAATBEELD_API_KEY = process.env.NEXT_PUBLIC_STRAATBEELD_API_KEY ?? "";

/** URL van de foto van dit adres, of null zolang er geen koppeling is. */
export function straatbeeldUrl(adres: string): string | null {
  if (!STRAATBEELD_API_KEY || !adres) return null;
  // Vul hier de URL van de gekozen dienst in zodra de koppeling (en de juridische toets) rond is.
  return null;
}
