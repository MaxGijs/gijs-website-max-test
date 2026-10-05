import Link from "next/link";
import Image from "next/image";
import { NL_PROVINCIES, NL_LABELPUNTEN } from "@/lib/content/nl-provincies";
import { getProvincie, alleGemeentenVan, plaatsenVan, regioPad, type RegioProvincie, type RegioGemeente } from "@/lib/content/regio";
import { Icon } from "@/components/ds/core/Icon";
import { H2 } from "@/components/regio/RegioBlokken";
import styles from "./RegioDrilldown.module.css";

// Visuele "inzoom"-navigatie Nederland → provincie → gemeente → plaats.
// Elke stap is een echte pagina (geen virtuele/SPA-state): klikken op
// Overijssel navigeert naar /regio/overijssel, klikken op Borne naar
// /regio/overijssel/borne, enzovoort. Dat houdt elke stap indexeerbaar,
// linkbaar en werkend zonder JavaScript; de .module.css hierboven geeft
// bij elke paginawissel een korte inzoom/fade, voor het "zoomen"-gevoel
// zonder kaart- of animatiebibliotheek.
//
// De Nederlandkaart komt uit het aangeleverde archief
// (public/productbladen/Archief.zip → nl.svg, bron: Simplemaps.com, zie
// lib/content/nl-provincies.ts). Er was geen gemeente- of plaatsgrenzenkaart
// aangeleverd: het archief bevat alleen een Nederlandkaart en een losse
// illustratie van Overijssel binnen Nederland (geen gemeentegrenzen). Het
// gemeente- en plaatsniveau tonen daarom bewust geen (verzonnen) kaartvlakken,
// maar een duidelijke, visuele kaartenset met pin-iconen — zie het eindverslag
// voor de onderbouwing.

const NL_ONBEKEND = "var(--grey-100)";

export function NederlandKaart() {
  return (
    <section id="provincies" className={"scroll-mt-40 mb-14 " + styles.stage}>
      <h2 className={H2 + " mb-2"}>Kies je provincie</h2>
      <p className="text-zinc-600 mb-6 max-w-2xl">
        Klik op de kaart op je provincie. Voor nu is alleen Overijssel beschikbaar; andere provincies volgen later.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-auto max-w-[440px] mx-auto md:mx-0"
          role="img"
          aria-label="Kaart van Nederland met de provincies. Overijssel is aanklikbaar, de overige provincies volgen later."
        >
          {NL_PROVINCIES.map(p => {
            const provincie = getProvincie(p.slug);
            if (!provincie) {
              return (
                <path key={p.id} d={p.d} fill={NL_ONBEKEND} stroke="#fff" strokeWidth={2} strokeLinejoin="round">
                  <title>{`${p.naam} (binnenkort)`}</title>
                </path>
              );
            }
            const label = NL_LABELPUNTEN[p.id];
            return (
              <Link key={p.id} href={regioPad(provincie.slug)} aria-label={`Isoleren en verduurzamen in ${provincie.naam}`} className="outline-none">
                <path
                  d={p.d}
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  className="fill-[var(--accent-600)] transition-colors hover:fill-[var(--accent-700)] focus-visible:fill-[var(--gijs-donkergroen)] cursor-pointer"
                />
                {label && (
                  <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[26px] font-bold pointer-events-none select-none">
                    {provincie.naam}
                  </text>
                )}
                <title>{`Isoleren en verduurzamen in ${provincie.naam}`}</title>
              </Link>
            );
          })}
        </svg>

        {/* Tekstuele lijst als toegankelijk alternatief/fallback, ook op desktop. */}
        <ul className="flex flex-col gap-2 min-w-[200px]">
          {NL_PROVINCIES.map(p => {
            const provincie = getProvincie(p.slug);
            return (
              <li key={p.id}>
                {provincie ? (
                  <Link href={regioPad(provincie.slug)} className="gijs-tag no-underline inline-flex items-center gap-2 font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] w-full">
                    <Icon name="map-pin" size="sm" /> {provincie.naam}
                    <Icon name="arrow-right" size="sm" className="ml-auto" />
                  </Link>
                ) : (
                  <span className="gijs-tag inline-flex items-center gap-2 w-full text-zinc-400">
                    {p.naam} <span className="ml-auto text-xs">binnenkort</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ProvincieKaart({ provincie }: { provincie: RegioProvincie }) {
  const gemeenten = alleGemeentenVan(provincie.slug);
  return (
    <section id="gemeenten" className={"scroll-mt-40 mb-14 " + styles.stage}>
      <h2 className={H2 + " mb-2"}>Gemeenten in {provincie.naam}</h2>
      <p className="text-zinc-600 mb-6 max-w-2xl">Kies je gemeente om te zien welke plaatsen erbij horen.</p>
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
        <figure className="flex flex-col gap-2 max-w-[200px] mx-auto lg:mx-0">
          <Image
            src="/images/regio/kaarten/overijssel-in-nederland.webp"
            alt={`Ligging van de provincie ${provincie.naam} in Nederland`}
            width={1280}
            height={1350}
            sizes="200px"
            className="w-full h-auto rounded-[var(--radius-card)]"
          />
          <figcaption className="text-xs text-zinc-500 text-center">{provincie.naam} in Nederland</figcaption>
        </figure>
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {gemeenten.map(g => (
            <li key={g.slug}>
              {g.gepubliceerd ? (
                <Link href={regioPad(provincie.slug, g.slug)} className="no-underline group block h-full">
                  <span className="h-full flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-card)] px-5 py-4 transition-shadow group-hover:shadow-[var(--shadow-2)]">
                    <span className="flex items-center gap-3 font-bold text-[var(--gijs-donkergroen)]">
                      <Icon name="map-pin" size="md" className="text-[var(--accent-600)]" /> {g.naam}
                    </span>
                    <Icon name="arrow-right" size="sm" className="text-[var(--accent-700)]" />
                  </span>
                </Link>
              ) : (
                <span className="h-full flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--border-hairline)] bg-[var(--surface-muted)] px-5 py-4 text-zinc-400">
                  <span className="flex items-center gap-3 font-semibold">
                    <Icon name="map-pin" size="md" /> {g.naam}
                  </span>
                  <span className="text-xs">binnenkort</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function GemeenteKaart({ provincie, gemeente }: { provincie: RegioProvincie; gemeente: RegioGemeente }) {
  const plaatsen = plaatsenVan(provincie.slug, gemeente.slug);
  return (
    <section id="plaatsen" className={"scroll-mt-40 mb-14 " + styles.stage}>
      <h2 className={H2 + " mb-2"}>Plaatsen binnen de gemeente {gemeente.naam}</h2>
      <p className="text-zinc-600 mb-6 max-w-2xl">De gemeente {gemeente.naam} bestaat uit de volgende plaatsen.</p>
      <ul className="flex flex-wrap gap-3">
        {plaatsen.map(k => {
          if (k.slug === gemeente.slug) {
            return (
              <li key={k.slug}>
                <span className="gijs-tag inline-flex items-center gap-2 bg-[var(--accent-050)] text-[var(--gijs-donkergroen)] font-semibold">
                  <Icon name="map-pin" size="sm" /> {k.naam}
                  <span className="text-xs font-normal text-zinc-500">(deze pagina)</span>
                </span>
              </li>
            );
          }
          if (k.gepubliceerd) {
            return (
              <li key={k.slug}>
                <Link href={regioPad(provincie.slug, gemeente.slug, k.slug)} className="gijs-tag no-underline inline-flex items-center gap-1 font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">
                  <Icon name="map-pin" size="sm" /> {k.naam} <Icon name="arrow-right" size="sm" />
                </Link>
              </li>
            );
          }
          return (
            <li key={k.slug}>
              <span className="gijs-tag inline-flex items-center gap-1 text-zinc-400">{k.naam} <span className="text-xs">· binnenkort</span></span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
