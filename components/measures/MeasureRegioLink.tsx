import Link from "next/link";
import { Icon } from "@/components/ds/core/Icon";
import type { Alinea } from "@/lib/content/regio-lokaal";
import { RijkeTekst } from "@/components/regio/regio-template-styles";

// Isolatie-maatregelpagina's linkten nergens terug naar de regiopagina's,
// terwijl de regiopagina's wel naar deze 5 isolatiemaatregelen linken
// (components/regio/RegioBlokken.tsx). Dit maakt die link wederzijds.
// `voorbeeld` is een optionele zin met links naar specifieke regiopagina's.
// `regios` is een korte rij links naar regiopagina's waar deze maatregel concreet behandeld wordt.
export function MeasureRegioLink({ voorbeeld, regios }: { voorbeeld?: Alinea; regios?: { kop: string; links: { tekst: string; href: string }[] } }) {
  return (
    <div className="mt-8 flex flex-col gap-3">
      {voorbeeld && <RijkeTekst alinea={voorbeeld} className="text-[15px] leading-relaxed text-zinc-700 max-w-3xl [text-wrap:pretty]" />}
      {regios && (
        <div className="flex flex-col gap-2">
          <p className="text-[15px] font-semibold text-[var(--gijs-donkergroen)]">{regios.kop}</p>
          <ul className="flex flex-wrap gap-2">
            {regios.links.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="gijs-tag no-underline inline-flex items-center gap-1 font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">
                  {l.tekst} <Icon name="arrow-right" size="sm" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm text-zinc-600">
        Benieuwd of Gijs ook in jouw gemeente actief is?{" "}
        <Link href="/regio" className="font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] no-underline inline-flex items-center gap-1">
          Bekijk jouw regio <Icon name="arrow-right" size="sm" />
        </Link>
      </p>
    </div>
  );
}
