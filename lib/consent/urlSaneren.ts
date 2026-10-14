// Queryparameters die nooit naar een analysetool mogen, ook niet als ze (per ongeluk, nu of later)
// toch een keer in de URL zouden staan. Vandaag gaat het om postcode/huisnummer uit de woningscan
// (WoningFlow.tsx houdt die zelf al buiten de adresbalk, dit is de tweede, code-eigen laag
// daarachter — zie het privacyrapport van 14 oktober 2026).
const GEVOELIGE_PARAMS = ["postcode", "huisnummer"];

/** Geeft "pathname" of "pathname?overgebleven-query" terug, zonder de gevoelige parameters. */
export function saneerPad(pathname: string, searchParams: URLSearchParams): string {
  const schoon = new URLSearchParams(searchParams);
  for (const naam of GEVOELIGE_PARAMS) schoon.delete(naam);
  const query = schoon.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** Zelfde opschoning, maar voor een volledige URL (bv. window.location.href of document.referrer). */
export function saneerUrl(url: string): string {
  try {
    const parsed = new URL(url);
    for (const naam of GEVOELIGE_PARAMS) parsed.searchParams.delete(naam);
    return parsed.toString();
  } catch {
    return url;
  }
}
