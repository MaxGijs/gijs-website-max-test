import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";
import { REGIO_PROVINCIES, getProvincie, regioPad } from "@/lib/content/regio";
import { RegioBreadcrumb, RegioMain, H2, RegioCta } from "@/components/regio/RegioBlokken";
import { ProvincieKaart } from "@/components/regio/RegioDrilldown";
import { RegioKaartInteractief } from "@/components/regio/RegioKaartInteractief";
import { IsolatieInstallatiesSectie } from "@/components/regio/IsolatieInstallatiesSectie";
import { SubsidiecheckStart } from "@/components/subsidie/SubsidiecheckStart";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { HOOFDSTUKKEN } from "@/lib/content/zo-werkt-gijs";

type Props = { params: Promise<{ provincie: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return REGIO_PROVINCIES.filter(p => p.gepubliceerd).map(p => ({ provincie: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProvincie((await params).provincie);
  if (!p) return {};
  return createMetadata(
    regioPad(p.slug),
    `Isoleren en verduurzamen in ${p.naam} | Gijs`,
    `Isolatie en installaties voor jouw woning in ${p.naam}: isolatiemaatregelen, warmtepomp en zonnepanelen, subsidies en de gratis energiescan aan huis. Kies hieronder je gemeente.`,
    p.indexeerbaar,
  );
}

export default async function ProvinciePage({ params }: Props) {
  const p = getProvincie((await params).provincie);
  if (!p) notFound();

  return (
    <>
      <Header />
      <RegioMain>
        <RegioBreadcrumb crumbs={[{ naam: "Home", url: "/" }, { naam: "Regio", url: "/regio" }, { naam: p.naam, url: regioPad(p.slug) }]} />

        {/* Hero: geen kaarten, één primaire CTA. */}
        <header className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-center mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Provincie {p.naam}</p>
            <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-display)] text-[var(--gijs-donkergroen)]">
              Isoleren en verduurzamen in {p.naam}
            </h1>
            <p className="text-zinc-600">
              Verduurzamen begint meestal bij isoleren: minder warmteverlies via dak, muren, vloer en ramen, voor
              meer comfort en een lagere energierekening. Daarna wordt het vaak aantrekkelijk om ook installaties
              toe te voegen, zoals een warmtepomp of zonnepanelen. Gijs helpt woningeigenaren in heel {p.naam} bij
              allebei: van de eerste isolatiemaatregel tot een volledig verduurzaamde woning.
            </p>
            <div className="mt-2">
              <Button href="/woning" variant="accent" size="lg" iconRight="arrow-right" className="max-w-full !h-auto min-h-[var(--control-h-lg)] py-3 !whitespace-normal text-center">
                Start de woningscan
              </Button>
            </div>
          </div>
          <RegioKaartInteractief />
        </header>

        {/* Samenwerkingen: één rustig kader met drie gelijke vakken en de echte logo's. Alleen
            Energieloket Twente is een bevestigde samenwerking (zelfde bron als /zo-werkt-gijs); Jouw
            Energieloket en Digitaal Energieloket zijn losse, bestaande energieloketten en worden als
            zodanig genoemd, zonder claim van officiële erkenning of exclusiviteit. */}
        <section className="mb-16">
          <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)] mb-4">Samen maken we verduurzamen makkelijker</p>
          <Card className="!p-0 overflow-hidden">
            <ul className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-default)]">
              {[
                { naam: "Energieloket Twente", logo: "/images/shared/partners/energieloket-twente.png", href: "https://energieloket-twente.nl" },
                { naam: "Jouw Energieloket", logo: "/images/shared/partners/jouw-energieloket.png", href: "https://www.jouw-energieloket.nl/overijssel/hengelo" },
                { naam: "Digitaal Energieloket", logo: "/images/shared/partners/digitaal-energieloket.svg", href: "https://www.digitaal-energieloket.nl/" },
              ].map(l => (
                <li key={l.naam}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-8 md:p-10 no-underline group transition-colors hover:bg-[var(--surface-muted)]">
                    <Image src={l.logo} alt={l.naam} width={64} height={64} className="h-16 w-16 object-contain" />
                    <span className="font-semibold text-[var(--gijs-donkergroen)] group-hover:text-[var(--accent-700)]">
                      {l.naam}<span className="sr-only"> (opent in nieuw tabblad)</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
          <p className="text-sm text-zinc-500 mt-3 max-w-2xl">
            Voor de energiescan aan huis werkt Gijs samen met Energieloket Twente. Jouw Energieloket en Digitaal
            Energieloket zijn losse energieloketten die ook in Overijssel een goede aanvulling kunnen zijn bij het
            verduurzamen van je woning.
          </p>
        </section>

        {/* Gemeenten in Overijssel: de bestaande ProvincieKaart, ongewijzigd (zelfde component als
            voorheen op deze pagina en op /regio/overijssel vóór dit herontwerp). */}
        <ProvincieKaart provincie={p} />

        {/* Isolatie en installaties: de woning als centraal, klikbaar beeld, geen rij grote kaarten. */}
        <section id="isolatie-en-installaties" className="scroll-mt-40 mb-16">
          <h2 className={H2 + " mb-8"}>Isolatie en installaties voor jouw woning</h2>
          <IsolatieInstallatiesSectie />
        </section>

        {/* Subsidies: uitleg links, rechts de subsidiecheck met postcode en huisnummer, die direct naar de
            regelingen voor dat adres gaat (Milieu Centraal, zie components/subsidie). */}
        <section id="subsidies" className="scroll-mt-40 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 text-zinc-600">
              <h2 className={H2}>Subsidies voor isolatie en verduurzaming in {p.naam}</h2>
              <p>
                Een subsidie is een financiële bijdrage van de overheid die een deel van de kosten van verduurzamen
                vergoedt. Subsidies bestaan om het voor woningeigenaren aantrekkelijker te maken om te isoleren of
                duurzame installaties aan te schaffen.
              </p>
              <p>
                Er zijn landelijke subsidies, zoals de ISDE-regeling, en gemeentelijke subsidies. Gemeentelijke
                regelingen verschillen per gemeente en kunnen veranderen; soms is het ook mogelijk om een landelijke
                en gemeentelijke subsidie te combineren, afhankelijk van de voorwaarden.
              </p>
            </div>
            <Card variant="tint" className="!p-8 md:!p-10 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[var(--gijs-donkergroen)]">Welke subsidies passen bij jouw woning?</h3>
              <p className="text-zinc-700">
                Vul je postcode en huisnummer in en zie direct alle landelijke en gemeentelijke regelingen voor jouw adres.
              </p>
              <SubsidiecheckStart idPrefix="sc-overijssel" />
            </Card>
          </div>
        </section>

        {/* Zo werkt Gijs: rustige verticale tijdlijn, geen vijf grote stappenkaarten. */}
        <section id="zo-werkt-gijs" className="scroll-mt-40 mb-16">
          <h2 className={H2 + " mb-8"}>Zo werkt Gijs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <ol className="flex flex-col">
              {HOOFDSTUKKEN.map((fase, i) => (
                <li key={fase.nummer} className="flex gap-4 pb-6 relative">
                  {i < HOOFDSTUKKEN.length - 1 && <span className="absolute left-[19px] top-10 bottom-0 w-px bg-[var(--border-default)]" aria-hidden="true" />}
                  <span className="shrink-0 w-10 h-10 rounded-full bg-[var(--gijs-accentgroen)] text-white font-bold flex items-center justify-center z-10">
                    {fase.nummer}
                  </span>
                  <div className="pt-1.5">
                    <p className="font-semibold text-[var(--gijs-donkergroen)]">{fase.titel}</p>
                    <p className="text-sm text-zinc-600 mt-1">{fase.kop}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-[var(--surface-muted)]">
                <Image src="/images/zo-werkt-gijs/zo_werkt_gijs_hero.jpeg" alt="Twee bewoners bekijken samen hun woning vanaf de stoep" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
              <Link href="/zo-werkt-gijs" className="text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] inline-flex items-center gap-1 no-underline">
                Lees hoe Gijs werkt <Icon name="arrow-right" size="sm" />
              </Link>
            </div>
          </div>
        </section>

        <RegioCta
          titel="Klaar om jouw woning te verduurzamen?"
          tekst="Ontdek welke isolatiemaatregelen en installaties bij jouw woning passen. Gijs helpt je graag op weg."
        />
      </RegioMain>
      <Footer />
    </>
  );
}
