"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OVERIJSSEL_GEMEENTEN_VORMEN, OVERIJSSEL_GEMEENTEN_CROP_VIEWBOX } from "@/lib/content/overijssel-gemeenten-shapes";
import { GELDERLAND_GEMEENTEN_VORMEN, GELDERLAND_GEMEENTEN_CROP_VIEWBOX } from "@/lib/content/gelderland-gemeenten-shapes";
import { UTRECHT_GEMEENTEN_VORMEN, UTRECHT_GEMEENTEN_CROP_VIEWBOX } from "@/lib/content/utrecht-gemeenten-shapes";
import { FLEVOLAND_GEMEENTEN_VORMEN, FLEVOLAND_GEMEENTEN_CROP_VIEWBOX } from "@/lib/content/flevoland-gemeenten-shapes";
import { getGemeente, slugify, regioPad } from "@/lib/content/regio";

const PROVINCIE_VORMEN: Record<string, { vormen: { naam: string; d: string }[]; viewBox: string }> = {
  overijssel: { vormen: OVERIJSSEL_GEMEENTEN_VORMEN, viewBox: OVERIJSSEL_GEMEENTEN_CROP_VIEWBOX },
  gelderland: { vormen: GELDERLAND_GEMEENTEN_VORMEN, viewBox: GELDERLAND_GEMEENTEN_CROP_VIEWBOX },
  utrecht: { vormen: UTRECHT_GEMEENTEN_VORMEN, viewBox: UTRECHT_GEMEENTEN_CROP_VIEWBOX },
  flevoland: { vormen: FLEVOLAND_GEMEENTEN_VORMEN, viewBox: FLEVOLAND_GEMEENTEN_CROP_VIEWBOX },
};

export function RegioKaartInteractief({ provincie = "overijssel" }: { provincie?: string }) {
  const router = useRouter();
  const [hoverGemeente, setHoverGemeente] = useState<string | null>(null);
  const [actieveGemeente, setActieveGemeente] = useState<string | null>(null);

  const config = PROVINCIE_VORMEN[provincie] ?? null;
  if (!config) return null;

  function kiesGemeente(naam: string, slug: string) {
    setActieveGemeente(naam);
    const gemeente = getGemeente(provincie, slug);
    if (gemeente) router.push(regioPad(provincie, slug));
  }

  const getoondeNaam = hoverGemeente ?? actieveGemeente;

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--gijs-donkergroen)] mb-3 min-h-[20px]" aria-live="polite">
        {getoondeNaam ? `Gemeente ${getoondeNaam}` : "Beweeg over of tik op een gemeente"}
      </p>

      <svg
        viewBox={config.viewBox}
        className="w-full max-w-[520px] mx-auto h-auto"
        role="img"
        aria-label={`Kaart van de gemeenten in ${provincie.charAt(0).toUpperCase() + provincie.slice(1)}`}
      >
        {config.vormen.map(g => {
          const slug = slugify(g.naam);
          const bestaat = !!getGemeente(provincie, slug);
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
