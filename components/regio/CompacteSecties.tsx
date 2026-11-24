import { Fragment } from "react";
import Link from "next/link";
import type { GemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { ENERGIESCAN_HREF } from "@/lib/seo";
import { WhatsAppTrackedButton } from "@/components/regio/WhatsAppTrackedButton";
import { H2 } from "./RegioBlokken";
import { AdviseurFoto, ADVISEUR_FOTO } from "./VerhaalSecties";
import { EYEBROW, LEAD, TEKSTLINK } from "./regio-template-styles";
import type { PlaatsGroep } from "./plaats-groepen";

type Compact = NonNullable<GemeenteVerhaal["compacteOpzet"]>;

/** Alle bestaande plaatspagina's direct onder de hero, gegroepeerd op type; geen uitklap of carrousel. */
export function PlaatsenKiezer({ groepen, naam, className }: { groepen: PlaatsGroep[]; naam: string; className: string }) {
  if (groepen.length === 0) return null;
  return (
    <section id="plaatsen" aria-labelledby="plaatsen-kop" className={className}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 mb-5">
        <h2 id="plaatsen-kop" className="text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] font-semibold tracking-[-0.02em] text-[var(--gijs-donkergroen)]">
          Woon je in een dorp, buurtschap of wijk van {naam}?
        </h2>
        <p className="text-[14px] text-[var(--text-muted)]">
          Je bekijkt nu: <span className="font-semibold text-[var(--gijs-donkergroen)]" aria-current="page">gemeente {naam}</span>
        </p>
      </div>
      <dl className="border-t border-[var(--border-default)]">
        {groepen.map(g => (
          <div key={g.id} className="grid grid-cols-1 gap-2 border-b border-[var(--border-default)] py-4 md:grid-cols-[10rem_1fr] md:gap-6">
            <dt className="text-[14px] font-semibold text-[var(--text-muted)]">{g.label}</dt>
            <dd className="m-0">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:flex md:flex-wrap md:gap-x-6 md:gap-y-2">
                {g.plaatsen.map(p => (
                  <li key={p.slug}><Link href={p.href} className={TEKSTLINK + " text-[15px]"}>{p.naam}</Link></li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Compact overzicht in plaats van vier fotokaarten: bouwjaar, woningtype en isolatieniveau als rijen met maatregellinks. */
export function WoningKeuzeSectie({ k, naam, scanKnop, className }: { k: Compact["woningKeuze"]; naam: string; scanKnop: React.ReactNode; className: string }) {
  return (
    <section id="jouw-woning" className={className}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div className="flex flex-col gap-4">
          <p className={EYEBROW}>Verduurzamen in {naam}</p>
          <h2 className={H2}>{k.h2}</h2>
          <p className={LEAD}>{k.intro}</p>
          <p className="text-[15px] leading-relaxed text-zinc-700">De woningscan zet voor jouw adres op een rij welke maatregelen passen.</p>
          <div>{scanKnop}</div>
        </div>
        <ul className="border-t border-[var(--border-default)]">
          {k.rijen.map(r => (
            <li key={r.titel} className="flex flex-col gap-1.5 border-b border-[var(--border-default)] py-4">
              <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-[var(--gijs-donkergroen)]">{r.titel}</h3>
              <p className="text-[15px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]">{r.tekst}</p>
              <p className="text-[15px]">
                <span className="text-zinc-700">Bekijk </span>
                {r.links.map((l, i) => (
                  <Fragment key={l.href}>
                    {i > 0 && (i === r.links.length - 1 ? " of " : ", ")}
                    <Link href={l.href} className={TEKSTLINK}>{l.tekst.toLowerCase()}</Link>
                  </Fragment>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Thom als smalle strook na de maatregelen, met de CTA-volgorde woningscan (primair) en energiescan (secundair). */
export function ThomStrook({ t, scanKnop }: { t: Compact["thom"]; scanKnop?: React.ReactNode }) {
  const rustig = t.alleenEnergiescan;
  return (
    <div className={`mt-2 flex flex-col gap-5 md:flex-row md:items-center md:gap-6 ${rustig ? "rounded-[var(--radius-xl)] bg-[var(--accent-050)] px-5 py-6 sm:px-7" : "border-y border-[var(--border-default)] py-6"}`}>
      <div className="flex items-center gap-4 md:flex-1">
        <AdviseurFoto src={ADVISEUR_FOTO.thom.src} alt={ADVISEUR_FOTO.thom.alt} className="size-16 sm:size-20" />
        <div className="flex flex-col gap-1">
          <p className="text-[18px] font-semibold tracking-[-0.015em] text-[var(--gijs-donkergroen)]">{t.titel}</p>
          <p className="text-[15px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]">{t.tekst}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 md:shrink-0">
        {scanKnop}
        <WhatsAppTrackedButton plaats="regio_thomstrook" href={ENERGIESCAN_HREF} size="lg" variant={scanKnop ? "secondary" : undefined} iconRight="arrow-right" className="max-w-full max-sm:!px-4">Vraag een gratis energiescan aan</WhatsAppTrackedButton>
      </div>
    </div>
  );
}
