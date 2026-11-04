import type { GemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { sfeerFoto } from "@/lib/content/hero-sfeerfoto";
import { leidProfielAf } from "@/lib/content/lokaal-profiel-adapter";
import { LokaalProfielPagina } from "./LokaalProfielPagina";

export type VerhaalKern = { slug: string; naam: string; afbeelding?: string; href?: string };

/** Gemeente- of plaatspagina uit een verhaal. Alle pagina's gebruiken dezelfde opbouw als de
 *  Winterswijk-pagina (LokaalProfielPagina); dit onderdeel levert alleen de plaatsgebonden gegevens. */
export function GemeenteVerhaalPagina({
  verhaal,
  provincie,
  gemeente,
  gemeenteSlug,
  plaatsnaam,
  plaatsSlug,
  crumbs,
  kernen,
  officieleSubsidieUrl,
}: {
  verhaal: GemeenteVerhaal;
  provincie: string;
  gemeente: string;
  gemeenteSlug: string;
  /** Alleen gezet als de pagina over een plaats gaat (niet over de gemeente zelf). */
  plaatsnaam?: string;
  plaatsSlug?: string;
  crumbs: { naam: string; url: string }[];
  kernen: VerhaalKern[];
  officieleSubsidieUrl?: string;
}) {
  const naam = plaatsnaam ?? gemeente;
  const profiel = leidProfielAf(verhaal, {
    naam,
    gemeente,
    foto: sfeerFoto(plaatsSlug ? `${gemeenteSlug}/${plaatsSlug}` : gemeenteSlug),
  });

  return (
    <LokaalProfielPagina
      verhaal={verhaal}
      profiel={profiel}
      provincie={provincie}
      gemeente={gemeente}
      gemeenteSlug={gemeenteSlug}
      plaatsnaam={plaatsnaam}
      plaatsSlug={plaatsSlug}
      crumbs={crumbs}
      kernen={kernen}
      officieleSubsidieUrl={officieleSubsidieUrl}
      eigenSecties
    />
  );
}
