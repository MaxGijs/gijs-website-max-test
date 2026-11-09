import Image from "next/image";
import Link from "next/link";
import type { Alinea } from "@/lib/content/regio-lokaal";
import gijsBeeldmerk from "@/app/icon.png";

// Gedeelde visuele constanten voor alle regio-templates (LokaalProfielPagina
// en GemeenteVerhaalPagina). Eén plek om typografie, spacing en hover-effecten
// aan te passen — wijzigingen hier werken door op alle 76 gemeentepagina's.

/** Kicker / eyebrow boven een sectietitel. */
export const EYEBROW = "text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]";

/** Sectie met scroll-offset voor de sticky header + sectienav. */
export const SECTIE_BASE = "scroll-mt-52 mb-16 md:mb-24";

/** Leadtekst onder een sectietitel. */
export const LEAD = "text-[clamp(17px,1rem+0.35vw,21px)] leading-[1.55] text-[var(--text-muted)] max-w-2xl [text-wrap:pretty]";

/** Hero-titel (H1): groot, met een subtiele hover-schaal — het "Apple-achtige" accent
 *  dat de regiopagina's en (sinds kort) de maatregelpagina's delen. */
export const HERO_H1 = "text-[clamp(2.5rem,1.4rem+3.6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.045em] text-[var(--gijs-donkergroen)] [text-wrap:balance] origin-left transition-transform duration-500 ease-out hover:scale-[1.015] cursor-default";

/** Introtekst direct onder de hero-titel. */
export const HERO_INTRO = "text-[clamp(18px,1.05rem+0.4vw,21px)] leading-[1.5] text-[var(--text-muted)] [text-wrap:pretty]";

/** Lopende tekst. */
export const TEKST = "text-[clamp(16px,0.95rem+0.2vw,18px)] leading-[1.65] text-zinc-700 [text-wrap:pretty]";

/** Lichtgrijze container voor een sectie-inhoud. */
export const GRIJS_BLOK = "rounded-[var(--radius-xl)] bg-[var(--grey-050)] px-4 py-8 sm:p-10 lg:p-10";

/** Witte kaart met Apple-achtig hover-effect: lift + schaduw. */
export const WIT_BLOK = "rounded-[var(--radius-lg)] bg-white p-6 sm:p-8 lg:p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]";

/** Hover voor kaarten die al in een Card-component zitten: halve lift. */
export const KAART_HOVER = "transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)]";

/** Hover voor statistiekenblokken: alleen glow, geen lift. */
export const STAT_HOVER = "transition-shadow duration-500 ease-out hover:shadow-[0_8px_32px_-2px_rgba(0,0,0,0.18)]";

/** Bronvermelding onder een sectie. */
export const BRON = "text-[13px] leading-relaxed text-zinc-500";
export const BRONLINK = "underline underline-offset-2 hover:text-[var(--gijs-donkergroen)]";

/** Gijs-beeldmerk als subtiel watermark (alleen desktop, 6% opacity). */
export function GijsWatermark({ size = 220 }: { size?: number }) {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center pointer-events-none select-none" aria-hidden="true">
      <Image src={gijsBeeldmerk} alt="" width={size} height={size} className="opacity-[0.06]" priority={false} />
    </div>
  );
}


/** Eén alinea met tekst en eventuele links (intern of extern), in de stijl van de lopende tekst. */
export function RijkeTekst({ alinea, className }: { alinea: string | Alinea; className?: string }) {
  const delen = typeof alinea === "string" ? [alinea] : alinea;
  return (
    <p className={className}>
      {delen.map((d, n) => typeof d === "string"
        ? <span key={n}>{d}</span>
        : d.extern
          ? <a key={n} href={d.href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-700)] underline underline-offset-2 decoration-[var(--accent-200)] hover:decoration-[var(--accent-700)]">{d.tekst}</a>
          : <Link key={n} href={d.href} className="text-[var(--accent-700)] underline underline-offset-2 decoration-[var(--accent-200)] hover:decoration-[var(--accent-700)]">{d.tekst}</Link>)}
    </p>
  );
}


/** Raster zonder half gevulde rijen: 4 items worden 2x2, 5 items 3+2 en de laatste rij vult de volle breedte.
 *  Gebruik `RASTER` op de lijst en `RASTER_CEL(n, i)` op elk item (vanaf md; op mobiel één kolom). */
export const RASTER = "grid grid-cols-1 md:grid-cols-6";

export function RASTER_CEL(n: number, i: number): string {
  const rijen: number[] = [];
  if (n <= 3) rijen.push(n);
  else if (n === 4) rijen.push(2, 2);
  else {
    let rest = n;
    while (rest > 0) {
      if (rest === 4) { rijen.push(2, 2); break; }
      const rij = Math.min(3, rest);
      rijen.push(rij);
      rest -= rij;
    }
  }
  let start = 0;
  for (const rij of rijen) {
    if (i < start + rij) return rij === 1 ? "md:col-span-6" : rij === 2 ? "md:col-span-3" : "md:col-span-2";
    start += rij;
  }
  return "md:col-span-2";
}
