import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { RegioBreadcrumb, RegioMain, H2, RegioCta } from "./RegioBlokken";
import { Alineas } from "./LokalePagina";
import { IsolatieInstallatiesSectie } from "./IsolatieInstallatiesSectie";
import { RegelingenInGemeente } from "@/components/subsidie/RegelingenInGemeente";
import { SubsidiecheckStart } from "@/components/subsidie/SubsidiecheckStart";
import { FAQAccordion } from "@/components/measures/FAQAccordion";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { Button } from "@/components/ds/core/Button";
import { Card } from "@/components/ds/core/Card";
import { Icon } from "@/components/ds/core/Icon";

// De gemeentepagina als lokale verduurzamingspagina: lokale hero, het woningverhaal (bouwjaren),
// de kernen, een lokaal onderwerp (natuurvriendelijk isoleren) en dan de actie: de homepage-woning
// met isolatie en installaties, actuele subsidies met subsidiecheck, FAQ en woningscan.

export type VerhaalKern = { slug: string; naam: string; afbeelding?: string; href?: string };

const EYEBROW = "text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]";
const SECTIE = "scroll-mt-40 mb-20";
const LINK = "underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]";
// Van oud naar nieuw: donker naar licht.
const BALKKLEUR = ["bg-[var(--gijs-donkergroen)]", "bg-[var(--accent-700)]", "bg-[var(--accent-600)]", "bg-[var(--accent-200)]"];

export function GemeenteVerhaalPagina({
  verhaal: v,
  gemeente,
  plaatsnaam,
  crumbs,
  kernen,
  officieleSubsidieUrl,
}: {
  verhaal: GemeenteVerhaal;
  /** De gemeente (altijd), gebruikt voor subsidies-API en teksten die de gemeente bedoelen. */
  gemeente: string;
  /** Optioneel: de plaatsnaam voor koppen en FAQ, als de pagina over een dorp gaat (niet de gemeente zelf). */
  plaatsnaam?: string;
  crumbs: { naam: string; url: string }[];
  kernen: VerhaalKern[];
  officieleSubsidieUrl?: string;
}) {
  const naamVoorKop = plaatsnaam ?? gemeente;
  const hoofdkern = kernen[0];

  return (
    <RegioMain>
      <RegioBreadcrumb crumbs={crumbs} />

      {/* Lokale hero */}
      <header className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-center mb-20">
        <div className="flex flex-col gap-4 max-w-2xl">
          <p className={EYEBROW}>{v.kicker}</p>
          <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-display)] text-[var(--gijs-donkergroen)]">{v.h1}</h1>
          <Alineas alineas={v.intro} />
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-semibold text-[var(--gijs-donkergroen)]">
            <Icon name="map-pin" size="sm" className="text-[var(--accent-700)]" />
            {kernen.map((k, i) => (
              <Fragment key={k.slug}>
                {i > 0 && <span aria-hidden="true" className="text-zinc-400">·</span>}
                {k.href ? <Link href={k.href} className={LINK}>{k.naam}</Link> : <span>{k.naam}</span>}
              </Fragment>
            ))}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button href="/woning" variant="accent" size="lg" iconRight="arrow-right">Start de woningscan</Button>
            <Button href="/contact#energiescan" variant="secondary" size="lg">Vraag een gratis energiescan aan</Button>
          </div>
        </div>
        {hoofdkern?.afbeelding && (
          <Image src={hoofdkern.afbeelding} alt={`Plaatsnaambord ${hoofdkern.naam}`} width={1366} height={329} priority sizes="(max-width: 1024px) 100vw, 520px" className="w-full h-auto rounded-[var(--radius-xl)]" />
        )}
      </header>

      <MeasureSectionNav sections={[
        { id: "woningen", label: "Woningverhaal" },
        { id: "kernen", label: "Kernen" },
        { id: "maatregelen", label: "Maatregelen" },
        { id: "subsidies", label: "Subsidies" },
        { id: "natuurvriendelijk-isoleren", label: "Natuur" },
        { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
      ]} />

      {/* Het woningverhaal */}
      <section id="woningen" className={SECTIE}>
        <p className={EYEBROW + " mb-2"}>Het woningverhaal van {naamVoorKop}</p>
        <h2 className={H2 + " mb-3"}>Wat vertelt het bouwjaar over jouw woning?</h2>
        <p className="text-zinc-600 max-w-2xl mb-8">{v.woningen.lead}</p>

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {v.woningen.kerncijfers.map(c => (
            <div key={c.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-zinc-600">{c.label}</dt>
              <dd className="text-[clamp(2rem,1.5rem+1.5vw,2.75rem)] font-bold leading-none tracking-[-0.03em] text-[var(--gijs-donkergroen)]">{c.waarde}</dd>
            </div>
          ))}
        </dl>

        <div className="flex h-3 w-full overflow-hidden rounded-full mb-6" role="img"
          aria-label={`Bouwperiodes: ${v.woningen.bouwperiodes.map(b => `${b.label} ${b.percentage}%`).join(", ")}`}>
          {v.woningen.bouwperiodes.map((b, i) => (
            <span key={b.label} className={BALKKLEUR[i % BALKKLEUR.length]} style={{ width: `${b.percentage}%` }} />
          ))}
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {v.woningen.bouwperiodes.map((b, i) => (
            <li key={b.label} className="flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-sm font-semibold text-[var(--gijs-donkergroen)]">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${BALKKLEUR[i % BALKKLEUR.length]}`} />
                {b.label}
              </span>
              <span className="text-2xl font-bold tracking-[-0.02em] text-[var(--gijs-donkergroen)]">{b.percentage}%</span>
              <span className="text-sm text-zinc-600">{b.tekst}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-zinc-500 mt-6 max-w-3xl">
          {v.woningen.voetnoot} Bron: <a href={v.woningen.bron.url} target="_blank" rel="noopener noreferrer" className="underline">{v.woningen.bron.naam}</a>.
        </p>
      </section>

      {/* De kernen */}
      <section id="kernen" className={SECTIE}>
        <div className={`grid grid-cols-1 gap-10 items-start mb-8 ${v.lokaal.bekendVan ? "lg:grid-cols-[3fr_2fr]" : ""}`}>
          <div className="max-w-3xl">
            <h2 className={H2 + " mb-4"}>{v.lokaal.titel}</h2>
            <Alineas alineas={v.lokaal.alineas} />
          </div>
          {v.lokaal.bekendVan && (
            <div className="flex flex-col gap-4">
              <p className={EYEBROW}>{v.lokaal.bekendVan.titel}</p>
              {v.lokaal.bekendVan.kaarten.map(k => (
                <Card key={k.titel} variant="tint" className="flex flex-col gap-2 !p-5">
                  <Icon name={k.icon} size="md" className="text-[var(--accent-700)]" />
                  <span className="font-bold text-lg text-[var(--gijs-donkergroen)]">{k.titel}</span>
                  <span className="text-sm text-zinc-600">{k.tekst}</span>
                </Card>
              ))}
            </div>
          )}
        </div>
        {kernen.length >= 6 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {kernen.map(k => {
              const inhoud = (
                <Card className="h-full flex flex-col gap-2 !p-3 transition-shadow group-hover:shadow-[var(--shadow-2)]">
                  {k.afbeelding && (
                    <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "3/2" }}>
                      <Image src={k.afbeelding} alt={`Plaatsnaambord ${k.naam}`} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px" className="object-cover" />
                    </div>
                  )}
                  <span className="font-semibold text-sm leading-tight text-[var(--gijs-donkergroen)]">{k.naam}</span>
                  {k.href && <span className="mt-auto inline-flex items-center gap-1 rounded-full bg-[var(--gijs-donkergroen)] px-3 py-1 text-xs font-semibold text-white">Bekijk <Icon name="arrow-right" size="sm" /></span>}
                </Card>
              );
              return <li key={k.slug}>{k.href ? <Link href={k.href} className="no-underline group block h-full">{inhoud}</Link> : inhoud}</li>;
            })}
          </ul>
        ) : (
          <ul className={`grid grid-cols-1 gap-5 ${kernen.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {kernen.map(k => {
              const inhoud = (
                <Card className="h-full flex flex-col gap-3 !p-5 transition-shadow group-hover:shadow-[var(--shadow-2)]">
                  {k.afbeelding && <Image src={k.afbeelding} alt={`Plaatsnaambord ${k.naam}`} width={1366} height={329} sizes="(max-width: 768px) 100vw, 380px" className="w-full h-auto rounded-[12px]" />}
                  <span className="font-bold text-lg text-[var(--gijs-donkergroen)]">{k.naam}</span>
                  {v.lokaal.kernTekst[k.slug] && <span className="text-sm text-zinc-600 flex-1">{v.lokaal.kernTekst[k.slug]}</span>}
                  {k.href ? (
                    <span className="mt-auto inline-flex items-center gap-1 rounded-full bg-[var(--gijs-donkergroen)] px-4 py-1.5 text-sm font-semibold text-white self-start">
                      Bekijk <Icon name="arrow-right" size="sm" />
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-[var(--accent-700)]">Je bekijkt deze pagina</span>
                  )}
                </Card>
              );
              return <li key={k.slug}>{k.href ? <Link href={k.href} className="no-underline group block h-full">{inhoud}</Link> : inhoud}</li>;
            })}
          </ul>
        )}
        {v.lokaal.wijken && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--gijs-donkergroen)] mb-1">{v.lokaal.wijken.titel}</h3>
            <p className="text-zinc-600 text-sm mb-5">{v.lokaal.wijken.intro}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--border-default)]">
              {v.lokaal.wijken.lijst.map(w => (
                <li key={w.naam} className="flex flex-col gap-1 bg-white p-5">
                  <span className="flex items-center gap-2 font-semibold text-[var(--gijs-donkergroen)]">
                    <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${w.tijdvak === null ? "bg-[var(--grey-200)]" : BALKKLEUR[w.tijdvak % BALKKLEUR.length]}`} />
                    {w.naam}
                  </span>
                  <span className="text-sm text-zinc-700">{w.periode}</span>
                  <span className="text-sm text-zinc-500">{w.woningen.toLocaleString("nl-NL")} woningen · meest {w.type}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-zinc-500 mt-3">
              Bron: <a href={v.lokaal.wijken.bron.url} target="_blank" rel="noopener noreferrer" className="underline">{v.lokaal.wijken.bron.naam}</a>; woningen 2025, bouwjaren en woningtypen 2026.
            </p>
          </div>
        )}
        <div className="mt-8 flex gap-4 rounded-[var(--radius-xl)] border border-[var(--border-default)] p-6">
          <Icon name="target" size="md" className="text-[var(--accent-700)] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-[var(--gijs-donkergroen)]">{v.lokaal.ontwikkeling.titel}</p>
            <p className="text-zinc-600 text-sm">{v.lokaal.ontwikkeling.tekst}</p>
          </div>
        </div>
      </section>

      {/* Van lokale kennis naar actie */}
      <section id="maatregelen" className={SECTIE}>
        <p className={EYEBROW + " mb-2"}>Van lokale kennis naar actie</p>
        <h2 className={H2 + " mb-8"}>Welke maatregelen passen bij jouw woning?</h2>
        <IsolatieInstallatiesSectie />
      </section>

      <section id="subsidies" className="scroll-mt-40 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-10">
          <div className="flex flex-col gap-4 text-zinc-600">
            <p className={EYEBROW}>Subsidies</p>
            <h2 className={H2}>Actuele subsidies in {naamVoorKop}</h2>
            <p>
              Hieronder staan de regelingen die nu voor de gemeente {gemeente} in de Energiesubsidiewijzer van Milieu Centraal
              staan. Regelingen veranderen regelmatig. Wil je weten wat er voor jouw adres geldt, ook landelijk? Doe de subsidiecheck.
            </p>
            {officieleSubsidieUrl && (
              <p className="text-sm">
                Kijk voor de voorwaarden ook bij de{" "}
                <a href={officieleSubsidieUrl} target="_blank" rel="noopener noreferrer" className={LINK}>gemeente {gemeente}<span className="sr-only"> (opent in nieuw tabblad)</span></a>.
              </p>
            )}
          </div>
          <Card variant="tint" className="!p-8 md:!p-10 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[var(--gijs-donkergroen)]">Welke subsidies passen bij jouw woning?</h3>
            <p className="text-zinc-700">Vul je postcode en huisnummer in en zie direct alle regelingen voor jouw adres.</p>
            <SubsidiecheckStart idPrefix="sc-gemeente" />
          </Card>
        </div>
        <RegelingenInGemeente gemeente={gemeente} officieleUrl={officieleSubsidieUrl} toonKop={false} terugvalInhoud={null} />
      </section>

      {/* Lokaal onderwerp: natuurvriendelijk isoleren */}
      <section id="natuurvriendelijk-isoleren" className={SECTIE}>
        <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-10 md:px-12 md:py-12 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10">
          <div className="flex flex-col gap-4">
            <p className={EYEBROW}>Goed om te weten</p>
            <h2 className={H2}>{v.natuur.titel}</h2>
            <p className="text-zinc-700">{v.natuur.lead}</p>
            <p className="text-sm text-zinc-600">{v.natuur.zelf}</p>
            <p className="text-sm text-zinc-500">
              Bron: <a href={v.natuur.bron.url} target="_blank" rel="noopener noreferrer" className="underline">{v.natuur.bron.naam}</a>.
            </p>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {v.natuur.stappen.map(s => (
              <li key={s.titel} className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]">
                  <Icon name={s.icon} size="md" />
                </span>
                <span className="font-semibold text-[var(--gijs-donkergroen)]">{s.titel}</span>
                <span className="text-sm text-zinc-600">{s.tekst}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="veelgestelde-vragen" className={SECTIE}>
        <h2 className={H2 + " mb-6"}>Veelgestelde vragen over verduurzamen in {naamVoorKop}</h2>
        <div className="max-w-3xl">
          <FAQAccordion items={v.faq} className="[&_.gijs-accordion__trigger]:py-6 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
        </div>
        {v.verwant.length > 0 && (
          <p className="mt-8 text-zinc-600">
            Ook in de buurt:{" "}
            {v.verwant.map((l, i) => (
              <Fragment key={l.href}>
                {i > 0 && " · "}
                <Link href={l.href} className={LINK}>{l.naam}</Link>
              </Fragment>
            ))}
          </p>
        )}
      </section>

      <RegioCta titel={`Klaar om je woning in ${naamVoorKop} te verduurzamen?`} tekst="Start de woningscan en zie welke isolatie en installaties bij jouw woning passen. Gijs helpt je graag op weg." />
    </RegioMain>
  );
}
