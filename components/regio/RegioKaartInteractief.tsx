"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NL_PROVINCIES } from "@/lib/content/nl-provincies";
import { OVERIJSSEL_GEMEENTEN_VORMEN, OVERIJSSEL_GEMEENTEN_CROP_VIEWBOX } from "@/lib/content/overijssel-gemeenten-shapes";
import { getProvincie, getGemeente, slugify, regioPad } from "@/lib/content/regio";
import { Icon } from "@/components/ds/core/Icon";
import styles from "./RegioKaartInteractief.module.css";

// Uitbreiding van de bestaande Nederlandkaart (NederlandKaart in
// RegioDrilldown.tsx — data en styling hergebruikt, niet opnieuw getekend):
// een klik op Overijssel zoomt vloeiend in, waarna de echte gemeentegrenzen
// van Overijssel verschijnen (public/images/regio/overijssel51.svg, zie
// lib/content/overijssel-gemeenten-shapes.ts voor de bron/verificatie).
// Beide kaartlagen blijven gemonteerd en faden in/uit (crossfade) terwijl de
// Nederlandlaag tegelijk inzoomt via een CSS-transform — zo blijft de
// overgang vloeiend zonder kaart- of animatiebibliotheek.
//
// Klikken/tikken/Enter op een gemeente die al een pagina heeft (nu alleen
// Borne) navigeert naar /regio/overijssel/<gemeente>. Overige gemeenten
// tonen hun naam (hover, focus of tik) maar zijn nog niet klikbaar —
// zelfde "binnenkort"-patroon als de rest van de regiosectie.
const IDENTITEIT = { scale: 1, tx: 0, ty: 0 };
const NL_ONBEKEND = "var(--grey-100)";

export function RegioKaartInteractief() {
  const router = useRouter();
  const overijsselPathRef = useRef<SVGPathElement | null>(null);
  const [inOverijssel, setInOverijssel] = useState(false);
  const [transform, setTransform] = useState(IDENTITEIT);
  const [hoverGemeente, setHoverGemeente] = useState<string | null>(null);
  const [actieveGemeente, setActieveGemeente] = useState<string | null>(null);

  function naarOverijssel() {
    const el = overijsselPathRef.current;
    if (el) {
      const b = el.getBBox();
      const marge = 1.12;
      const grootte = Math.max(b.width, b.height) * marge;
      const scale = 1000 / grootte;
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      setTransform({ scale, tx: 500 - cx * scale, ty: 500 - cy * scale });
    }
    window.setTimeout(() => setInOverijssel(true), 250);
  }

  function terugNaarNederland() {
    setInOverijssel(false);
    setTransform(IDENTITEIT);
    setHoverGemeente(null);
    setActieveGemeente(null);
  }

  function kiesGemeente(naam: string, slug: string) {
    setActieveGemeente(naam);
    const gemeente = getGemeente("overijssel", slug);
    if (gemeente) router.push(regioPad("overijssel", slug));
  }

  const getoondeNaam = hoverGemeente ?? actieveGemeente;

  return (
    <div className={styles.stage}>
      <div className="flex items-center justify-between gap-3 mb-3 min-h-[28px]">
        {inOverijssel ? (
          <button type="button" onClick={terugNaarNederland} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">
            <Icon name="arrow-left" size="sm" /> Terug naar Nederland
          </button>
        ) : <span />}
        {inOverijssel && (
          <p className="text-sm font-semibold text-[var(--gijs-donkergroen)]" aria-live="polite">
            {getoondeNaam ? `Gemeente ${getoondeNaam}` : "Beweeg over of tik op een gemeente"}
          </p>
        )}
      </div>

      <div className="relative w-full max-w-[520px] mx-auto" style={{ aspectRatio: "1 / 1" }}>
        <svg
          viewBox="0 0 1000 1000"
          className={"absolute inset-0 w-full h-full transition-opacity duration-500 " + (inOverijssel ? "opacity-0 pointer-events-none" : "opacity-100")}
          role="img"
          aria-label="Kaart van Nederland met de provincies. Overijssel is aanklikbaar."
        >
          <g className={styles.zoomGroep} style={{ transform: `translate(${transform.tx}px, ${transform.ty}px) scale(${transform.scale})`, transformOrigin: "0 0" }}>
            {NL_PROVINCIES.map(p => {
              const provincie = getProvincie(p.slug);
              if (!provincie) {
                return (
                  <path key={p.id} d={p.d} fill={NL_ONBEKEND} stroke="#fff" strokeWidth={2} strokeLinejoin="round" className={styles.vormInactief}>
                    <title>{`${p.naam} (binnenkort)`}</title>
                  </path>
                );
              }
              return (
                <path
                  key={p.id}
                  ref={p.slug === "overijssel" ? overijsselPathRef : undefined}
                  d={p.d}
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  tabIndex={0}
                  role="button"
                  aria-label={`Isoleren en verduurzamen in ${provincie.naam}`}
                  onClick={naarOverijssel}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); naarOverijssel(); } }}
                  className={styles.vorm + " fill-[var(--accent-600)] hover:fill-[var(--accent-700)]"}
                />
              );
            })}
          </g>
        </svg>

        <svg
          viewBox={OVERIJSSEL_GEMEENTEN_CROP_VIEWBOX}
          className={"absolute inset-0 w-full h-full transition-opacity duration-500 " + (inOverijssel ? "opacity-100" : "opacity-0 pointer-events-none")}
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
                tabIndex={inOverijssel ? 0 : -1}
                role="button"
                aria-label={`Gemeente ${g.naam}${bestaat ? "" : " (binnenkort beschikbaar)"}`}
                onMouseEnter={() => setHoverGemeente(g.naam)}
                onMouseLeave={() => setHoverGemeente(null)}
                onFocus={() => setHoverGemeente(g.naam)}
                onBlur={() => setHoverGemeente(null)}
                onClick={() => kiesGemeente(g.naam, slug)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kiesGemeente(g.naam, slug); } }}
                className={
                  styles.vorm + " " +
                  (bestaat
                    ? (isActief ? "fill-[var(--gijs-donkergroen)]" : "fill-[var(--accent-600)] hover:fill-[var(--accent-700)]")
                    : (isActief ? "fill-[var(--grey-200)]" : "fill-[var(--grey-100)] hover:fill-[var(--grey-200)]"))
                }
              />
            );
          })}
        </svg>
      </div>

      {/* Toegankelijke/mobiele fallback: dezelfde 25 gemeenten als tekstlijst,
          alfabetisch (de kaart zelf houdt de brondata-volgorde aan, die
          bepaalt alleen de tekenvolgorde van de vlakken, niet deze lijst). */}
      {inOverijssel && (
        <ul className="mt-5 flex flex-wrap gap-2 justify-center">
          {[...OVERIJSSEL_GEMEENTEN_VORMEN].sort((a, b) => a.naam.localeCompare(b.naam, "nl")).map(g => {
            const slug = slugify(g.naam);
            const bestaat = !!getGemeente("overijssel", slug);
            return (
              <li key={g.naam}>
                {bestaat ? (
                  <Link href={regioPad("overijssel", slug)} className="gijs-tag no-underline inline-flex items-center gap-1 font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">
                    {g.naam} <Icon name="arrow-right" size="sm" />
                  </Link>
                ) : (
                  <span className="gijs-tag text-zinc-400">{g.naam} · binnenkort</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
