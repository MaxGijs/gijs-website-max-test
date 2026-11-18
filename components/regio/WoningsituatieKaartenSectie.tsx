import Image from "next/image";
import Link from "next/link";
import type { GemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { selecteerWoningFoto } from "@/lib/content/woningsituatie-fotos";
import { RegioWoningscanKnop } from "./RegioWoningscanKnop";
import { H2 } from "./RegioBlokken";
import { EYEBROW, LEAD } from "./regio-template-styles";

type Props = {
  kaarten: NonNullable<GemeenteVerhaal["woningsituatieKaarten"]>;
  naam: string;
  gemeente: string;
  provincie: string;
  gemeenteSlug: string;
  plaatsSlug?: string;
  className: string;
  /** Vervangt de standaard woningscan-balk onder de kaarten (bijv. het Thom-blok). */
  children?: React.ReactNode;
};

export function WoningsituatieKaartenSectie({ kaarten: k, naam, gemeente, provincie, gemeenteSlug, plaatsSlug, className, children }: Props) {
  return (
    <section id="jouw-woning" className={className}>
      <div className="flex flex-col gap-4 mb-10 md:mb-14 max-w-3xl">
        <p className={EYEBROW}>Verduurzamen in {naam}</p>
        <h2 className={H2}>{k.h2}</h2>
        <p className={LEAD}>{k.intro}</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-4 lg:mb-5">
        {k.kaarten.map(c => {
          const foto = c.foto ?? selecteerWoningFoto(c.type, gemeente);
          return (
            <li key={c.naam}>
              <Link
                href={c.href}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--grey-050)] no-underline transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] motion-reduce:transform-none"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                    style={foto.positie ? { objectPosition: foto.positie } : undefined}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-[18px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">{c.naam}</h3>
                  <p className="flex-1 text-[14px] leading-[1.5] text-[var(--text-muted)] [text-wrap:pretty]">{c.tekst}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--accent-700)] transition-colors group-hover:text-[var(--gijs-donkergroen)]">
                    {c.cta}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {children ?? (
        <div className="rounded-[var(--radius-xl)] bg-[var(--grey-050)] px-6 py-7 sm:px-10 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">Welke maatregelen passen bij jouw woning?</h3>
            <p className="text-[15px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]">Bekijk de mogelijkheden in de digitale woning van Gijs en ontdek welke verbeteringen interessant kunnen zijn.</p>
          </div>
          <RegioWoningscanKnop provincie={provincie} gemeente={gemeenteSlug} plaats={plaatsSlug} className="shrink-0 self-start sm:self-auto" />
        </div>
      )}
    </section>
  );
}
