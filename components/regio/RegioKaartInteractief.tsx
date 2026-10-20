"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OVERIJSSEL_GEMEENTEN_VORMEN, OVERIJSSEL_GEMEENTEN_CROP_VIEWBOX } from "@/lib/content/overijssel-gemeenten-shapes";
import { getGemeente, slugify, regioPad } from "@/lib/content/regio";

// Interactieve kaart van de gemeenten in Overijssel (echte gemeentegrenzen,
// zie lib/content/overijssel-gemeenten-shapes.ts voor de bron/verificatie).
// Toont direct Overijssel, geen Nederlandkaart/inzoomstap ervoor: deze pagina
// gaat al alleen over Overijssel. Geen eigen gemeentelijst eronder — die
// staat al, met dezelfde "binnenkort"-logica, in de ProvincieKaart-sectie
// verderop op de pagina (components/regio/RegioDrilldown.tsx).
//
// Klikken/tikken/Enter op een gemeente die al een pagina heeft navigeert naar
// /regio/overijssel/<gemeente>. Overige gemeenten tonen hun naam (hover,
// focus of tik) maar zijn nog niet klikbaar.
export function RegioKaartInteractief() {
  const router = useRouter();
  const [hoverGemeente, setHoverGemeente] = useState<string | null>(null);
  const [actieveGemeente, setActieveGemeente] = useState<string | null>(null);

  function kiesGemeente(naam: string, slug: string) {
    setActieveGemeente(naam);
    const gemeente = getGemeente("overijssel", slug);
    if (gemeente) router.push(regioPad("overijssel", slug));
  }

  const getoondeNaam = hoverGemeente ?? actieveGemeente;

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--gijs-donkergroen)] mb-3 min-h-[20px]" aria-live="polite">
        {getoondeNaam ? `Gemeente ${getoondeNaam}` : "Beweeg over of tik op een gemeente"}
      </p>

      <svg
        viewBox={OVERIJSSEL_GEMEENTEN_CROP_VIEWBOX}
        className="w-full max-w-[520px] mx-auto h-auto"
        role="img"
        aria-label="Kaart van de gemeenten in Overijssel"
      >
        {OVERIJSSEL_GEMEENTEN_VORMEN.map(g => {
          const slug = slugify(g.naam);
          const bestaat = !!getGemeente("overijssel", slug);
          const isActief = actieveGemeente === g.naam || hoverGemeente === g.naam;
          return (
            <path
              key={g.naam}
              d={g.d}
              stroke="var(--gijs-donkergroen)"
              strokeOpacity={0.35}
              strokeWidth={30}
              tabIndex={0}
              role="button"
              aria-label={`Gemeente ${g.naam}${bestaat ? "" : " (binnenkort beschikbaar)"}`}
              onMouseEnter={() => setHoverGemeente(g.naam)}
              onMouseLeave={() => setHoverGemeente(null)}
              onFocus={() => setHoverGemeente(g.naam)}
              onBlur={() => setHoverGemeente(null)}
              onClick={() => kiesGemeente(g.naam, slug)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kiesGemeente(g.naam, slug); } }}
              className={
                "cursor-pointer outline-none transition-colors [&:focus-visible]:stroke-[var(--gijs-donkergroen)] " +
                (bestaat
                  ? (isActief ? "fill-[var(--gijs-donkergroen)]" : "fill-[var(--accent-600)] hover:fill-[var(--accent-700)]")
                  : (isActief ? "fill-[var(--grey-200)]" : "fill-[var(--grey-100)] hover:fill-[var(--grey-200)]"))
              }
            />
          );
        })}
      </svg>
    </div>
  );
}
