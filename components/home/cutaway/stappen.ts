import { MAATREGEL_TITELS, type MaatregelTitel } from "@/lib/content/maatregel-titels";
import { SUBSIDIE_PER_M2 } from "@/lib/content/subsidie-per-m2";

// Hoofdstukken van het woningverhaal (gedeeld door de pagina en de 3D-scène,
// zonder Three.js, zodat de pagina zelf licht blijft).

export type Sleutel = "kozijn" | "glas" | "dak" | "zon" | "spouw" | "vloer" | "pomp" | "batterij";
export const MAATREGELEN: { sleutel: Sleutel; titel: MaatregelTitel; kort: string; benefit: string; subsidie?: string }[] = [
  { sleutel: "kozijn", titel: MAATREGEL_TITELS.kozijnen, kort: "Houd warmte binnen en kou buiten.", benefit: "Minder kou bij het raam." },
  { sleutel: "glas", titel: MAATREGEL_TITELS.isolatieglas, kort: "Warmer bij het raam.", benefit: "Warmer bij het raam.", subsidie: "glas-kozijnen" },
  { sleutel: "dak", titel: MAATREGEL_TITELS.dakisolatie, kort: "Houd warmte beter binnen.", benefit: "Minder warmte die via het dak verdwijnt.", subsidie: "dakisolatie" },
  { sleutel: "zon", titel: MAATREGEL_TITELS.zonnepanelen, kort: "Je wekt zelf een deel van je stroom op.", benefit: "Je wekt zelf een deel van je stroom op." },
  { sleutel: "spouw", titel: MAATREGEL_TITELS.spouwmuurisolatie, kort: "Isolatie tussen de binnen- en buitenmuur.", benefit: "Je woning koelt minder snel af.", subsidie: "gevelisolatie" },
  { sleutel: "vloer", titel: MAATREGEL_TITELS.vloerisolatie, kort: "Minder kou vanuit de kruipruimte.", benefit: "Meer comfort voor je voeten.", subsidie: "vloerisolatie" },
  { sleutel: "pomp", titel: MAATREGEL_TITELS.warmtepomp, kort: "Minder gas nodig om je woning te verwarmen.", benefit: "Minder gas nodig om je woning te verwarmen." },
  { sleutel: "batterij", titel: MAATREGEL_TITELS.thuisbatterij, kort: "Zelf opgewekte stroom bewaren.", benefit: "Zelf opgewekte stroom bewaren." },
];
// Stappen: 0 overzicht (dicht), 1 opengewerkt overzicht, 2-9 de maatregelen, 10 eindbeeld.
export const EERSTE = 2;
export const EIND = EERSTE + MAATREGELEN.length;
export const STAP = Object.fromEntries(MAATREGELEN.map((m, i) => [m.sleutel, EERSTE + i])) as Record<Sleutel, number>;

export type Annotatie = { lijn: SVGLineElement | null; punt: SVGCircleElement | null; label: HTMLDivElement | null };

/** Subsidieregel uit het subsidieoverzicht van Gijs (lib/content/subsidie-per-m2.ts); alleen waar een bedrag bekend is. */
export function subsidieRegel(sleutel?: string) {
  const regels = sleutel ? SUBSIDIE_PER_M2[sleutel] : undefined;
  if (!regels?.length) return null;
  if (regels.length > 1) return `Subsidie vanaf ${regels[0].een} per m², meer bij driedubbel glas of bij twee of meer isolatiemaatregelen.`;
  return `Subsidie ${regels[0].een} per m², of ${regels[0].meer} per m² bij twee of meer isolatiemaatregelen.`;
}
