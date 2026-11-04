"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { LokaalProfiel } from "@/lib/content/gemeente-verhalen";
import { BouwperiodeBalk } from "./BouwperiodeBalk";

// De drie kerncijfers staan altijd in beeld; de volledige bouwjaarverdeling, het dorp en het
// buitengebied en de bronnen zitten in een uitklap. Beide panelen staan in de HTML, ook als ze
// dicht of niet geselecteerd zijn, zodat zoekmachines alle lokale informatie blijven zien.

const BRONLINK = "underline underline-offset-2 hover:text-[var(--gijs-donkergroen)]";

type Inzichten = NonNullable<LokaalProfiel["inzichten"]>;

export function Woningcijfers({ naam, cijfers, extraCijfers = [], bouwjaarLead, bouwperiodes, gebieden, bronnen, bronNoot }: {
  naam: string;
  cijfers: Inzichten["cijfers"];
  extraCijfers?: Inzichten["cijfers"];
  bouwjaarLead: string;
  bouwperiodes: Inzichten["bouwperiodes"];
  gebieden: NonNullable<Inzichten["gebieden"]>;
  bronnen: Inzichten["bronnen"];
  bronNoot: string;
}) {
  const [actief, setActief] = useState(0);
  const id = useId();

  return (
    <div className="rounded-[var(--radius-lg)] bg-white px-6 py-7 sm:px-8 sm:py-8 lg:px-8 lg:py-7 transition-shadow duration-500 ease-out hover:shadow-[0_8px_32px_-2px_rgba(0,0,0,0.18)]">
      <p className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--accent-700)] mb-6">{naam} in cijfers</p>

      <dl className={`grid gap-x-8 gap-y-6 ${
        cijfers.length >= 4 ? "grid-cols-2 sm:grid-cols-4"
        : cijfers.length === 3 ? "grid-cols-1 sm:grid-cols-3"
        : cijfers.length === 2 ? "grid-cols-2"
        : "grid-cols-1"
      }`}>
        {cijfers.map(c => (
          <div key={c.label} className="flex flex-col gap-1.5">
            <dd className="text-[clamp(2.25rem,1.8rem+1.6vw,3rem)] font-bold leading-none tracking-[-0.04em] text-[var(--gijs-donkergroen)]">{c.waarde}</dd>
            <dt className="text-[15px] leading-snug text-[var(--text-muted)]">{c.label}</dt>
          </div>
        ))}
      </dl>

      <details className="group mt-8">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-[var(--border-default)] px-5 py-3 text-[15px] font-semibold text-[var(--gijs-donkergroen)] transition-colors duration-[var(--dur-base)] hover:border-[var(--accent-700)] hover:text-[var(--accent-700)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Bekijk alle woningcijfers</span>
          <span className="hidden group-open:inline">Verberg uitgebreide woningcijfers</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-open:-rotate-180 motion-reduce:transform-none">
            <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>

        <div className="pt-9">
          {extraCijfers.length > 0 && (
            <dl className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6 border-b border-[var(--border-default)] pb-8">
              {extraCijfers.map(c => (
                <div key={c.label} className="flex flex-col gap-1.5">
                  <dd className="text-[clamp(1.75rem,1.5rem+1vw,2.25rem)] font-bold leading-none tracking-[-0.035em] text-[var(--gijs-donkergroen)]">{c.waarde}</dd>
                  <dt className="text-[15px] leading-snug text-[var(--text-muted)]">{c.label}</dt>
                </div>
              ))}
            </dl>
          )}
          <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-[var(--gijs-donkergroen)] mb-1">Bouwjaarverdeling</h3>
          <p className="text-[15px] text-[var(--text-muted)] mb-6">{bouwjaarLead}</p>
          <BouwperiodeBalk periodes={bouwperiodes} />

          {gebieden.length > 0 && (
          <div className="mt-10 border-t border-[var(--border-default)] pt-8">
            <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-[var(--gijs-donkergroen)] mb-4">Waar staat jouw woning?</h3>
            <div role="tablist" aria-label="Dorp of buitengebied" className="inline-flex gap-1 rounded-full bg-[var(--grey-050)] p-1 mb-6">
              {gebieden.map((g, n) => (
                <button key={g.titel} type="button" role="tab" id={`${id}-tab-${n}`} aria-controls={`${id}-paneel-${n}`} aria-selected={actief === n}
                  onClick={() => setActief(n)}
                  className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors duration-[var(--dur-base)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] ${
                    actief === n ? "bg-[var(--gijs-donkergroen)] text-white" : "text-[var(--text-muted)] hover:text-[var(--gijs-donkergroen)]"}`}>
                  {g.titel}
                </button>
              ))}
            </div>
            {gebieden.map((g, n) => (
              <div key={g.titel} role="tabpanel" id={`${id}-paneel-${n}`} aria-labelledby={`${id}-tab-${n}`} hidden={actief !== n}
                className="flex flex-col gap-3">
                <p className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[clamp(1.75rem,1.5rem+1vw,2.25rem)] font-bold leading-none tracking-[-0.035em] text-[var(--gijs-donkergroen)]">{g.cijfer.waarde}</span>
                  <span className="text-[14px] text-[var(--text-muted)]">{g.cijfer.label}</span>
                </p>
                <p className="text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty] max-w-2xl">{g.tekst}</p>
                <ul className="flex flex-col gap-2 border-t border-[var(--border-default)] pt-4 max-w-2xl">
                  {g.aandachtspunten.map(a => (
                    <li key={a.tekst} className="text-[15px] leading-snug text-zinc-700">
                      {a.href
                        ? <Link href={a.href} className="underline underline-offset-2 decoration-[var(--accent-200)] hover:decoration-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">{a.tekst}</Link>
                        : a.tekst}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          )}

          <div className="mt-10 border-t border-[var(--border-default)] pt-6 flex flex-col gap-2 text-[13px] leading-relaxed text-zinc-500">
            <p>{bronNoot}</p>
            <p>
              Bron:{" "}
              {bronnen.map((b, n) => (
                <span key={b.naam}>
                  {n > 0 && "; "}
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className={BRONLINK}>{b.naam}</a>{b.peildatum && `, peildatum ${b.peildatum}`}
                </span>
              ))}.
            </p>
            <p>Het bouwjaar is een eerste indicatie, geen conclusie: veel woningen zijn later al verbeterd.</p>
          </div>
        </div>
      </details>
    </div>
  );
}
