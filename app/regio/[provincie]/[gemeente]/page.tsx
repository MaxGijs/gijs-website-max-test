import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";
import { REGIO_GEMEENTEN, getProvincie, getGemeente, plaatsenVan, regioPad } from "@/lib/content/regio";
import { getLokaleInhoud } from "@/lib/content/regio-lokaal";
import { LokalePagina } from "@/components/regio/LokalePagina";
import { getGemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { GemeenteVerhaalPagina, type VerhaalKern } from "@/components/regio/GemeenteVerhaalPagina";
import { GemeenteKaart } from "@/components/regio/RegioDrilldown";
import { RegioBreadcrumb, RegioMain, IsolatieMaatregelen, LandelijkeSubsidies, WoningenInGemeente, ZoWerktGijsKort, EnergiescanBlok, RegioCta, H2 } from "@/components/regio/RegioBlokken";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { RegelingenInGemeente } from "@/components/subsidie/RegelingenInGemeente";
import { Button } from "@/components/ds/core/Button";

type Props = { params: Promise<{ provincie: string; gemeente: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return REGIO_GEMEENTEN.filter(g => g.gepubliceerd).map(g => ({ provincie: g.provincie, gemeente: g.slug }));
}
async function laad(params: Props["params"]) {
  const { provincie, gemeente } = await params;
  const p = getProvincie(provincie);
  const g = p && getGemeente(p.slug, gemeente);
  return p && g ? { p, g } : null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await laad(params);
  if (!data) return {};
  const { p, g } = data;
  const bord = plaatsenVan(p.slug, g.slug).find(k => k.slug === g.slug);
  const ogBeeld = bord?.afbeelding ? { path: bord.afbeelding, alt: `Plaatsnaambord ${bord.naam}` } : undefined;
  const verhaal = getGemeenteVerhaal(g.slug);
  if (verhaal) return createMetadata(regioPad(p.slug, g.slug), verhaal.seo.title, verhaal.seo.description, g.indexeerbaar, ogBeeld);
  const lokaal = getLokaleInhoud(regioPad(p.slug, g.slug));
  if (lokaal) return createMetadata(regioPad(p.slug, g.slug), lokaal.seo.title, lokaal.seo.description, g.indexeerbaar, ogBeeld);
  return createMetadata(
    regioPad(p.slug, g.slug),
    `Isolatie in ${g.naam} | Gijs`,
    `Je woning isoleren in ${g.naam}? Lees over dak-, spouw- en vloerisolatie, isolatieglas en kozijnen, en over landelijke subsidies. Gemeentelijke regelingen controleer je bij je eigen gemeente.`,
    g.indexeerbaar,
    ogBeeld,
  );
}

export default async function GemeentePage({ params }: Props) {
  const data = await laad(params);
  if (!data) notFound();
  const { p, g } = data;
  const plaatsen = plaatsenVan(p.slug, g.slug);
  // Een kern met dezelfde naam als de gemeente valt samen met deze pagina.
  const hoofdkern = plaatsen.find(k => k.slug === g.slug);
  const crumbs = [
    { naam: "Home", url: "/" }, { naam: "Regio", url: "/regio" },
    { naam: p.naam, url: regioPad(p.slug) }, { naam: g.naam, url: regioPad(p.slug, g.slug) },
  ];

  const verhaal = getGemeenteVerhaal(g.slug);
  if (verhaal) {
    const kernen: VerhaalKern[] = verhaal.kernen.flatMap(slug => {
      const k = plaatsen.find(pl => pl.slug === slug);
      if (!k) return [];
      const href = k.slug !== g.slug && k.gepubliceerd ? regioPad(p.slug, g.slug, k.slug) : undefined;
      return [{ slug: k.slug, naam: k.naam, afbeelding: k.afbeelding, href }];
    });
    return (
      <>
        <Header />
        <GemeenteVerhaalPagina verhaal={verhaal} gemeente={g.naam} crumbs={crumbs} kernen={kernen} officieleSubsidieUrl={g.officieleSubsidieUrl} />
        <Footer />
      </>
    );
  }

  const lokaal = getLokaleInhoud(regioPad(p.slug, g.slug));
  if (lokaal) {
    return (
      <>
        <Header />
        <LokalePagina
          inhoud={lokaal}
          crumbs={crumbs}
          afbeelding={hoofdkern?.afbeelding ? { src: hoofdkern.afbeelding, alt: `Plaatsnaambord ${hoofdkern.naam}` } : undefined}
          officieleSubsidieUrl={g.officieleSubsidieUrl}
          gemeenteNaam={g.naam}
          woningvoorraad={{ gemeente: g.naam, slug: g.slug }}
        />
        <Footer />
      </>
    );
  }

  const faq: FAQItem[] = [
    { question: `Welke gemeentelijke subsidies gelden in ${g.naam}?`, answer: `Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Deze verschillen per gemeente en kunnen veranderen. Controleer daarom altijd de actuele mogelijkheden bij de gemeente ${g.naam} zelf.` },
    { question: "Welke isolatie past bij mijn woning?", answer: "Dat hangt af van je woning. Tijdens de gratis energiescan aan huis bekijkt een adviseur van Gijs wat technisch bij je woning past." },
    { question: "Is de energiescan aan huis gratis en vrijblijvend?", answer: "Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur." },
    { question: "Moet ik eerst de digitale woningscan doen?", answer: "Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding waarin je wensen verzamelt, geen technische beoordeling van je huis." },
  ];

  return (
    <>
      <Header />
      <RegioMain>
        <RegioBreadcrumb crumbs={crumbs} />

        <header className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-center mb-14">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Gemeente {g.naam}</p>
            <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-display)] text-[var(--gijs-donkergroen)]">
              Isoleren in {g.naam}
            </h1>
            <p className="text-zinc-600">
              Wil je je woning in {g.naam} beter isoleren? Hier lees je welke isolatiemaatregelen er zijn en welke
              subsidies en regelingen er in {g.naam} gelden.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button href="/woning" variant="accent" size="lg" iconRight="arrow-right">Start de woningscan</Button>
              <Button href="/contact#energiescan" variant="secondary" size="lg">Vraag een gratis energiescan aan</Button>
              <Button href="#gemeentelijke-subsidies" variant="secondary" size="lg">Gemeentelijke subsidies</Button>
            </div>
          </div>
          {hoofdkern?.afbeelding && (
            <Image
              src={hoofdkern.afbeelding}
              alt={`Plaatsnaambord ${hoofdkern.naam}`}
              width={1366}
              height={329}
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="w-full h-auto"
            />
          )}
        </header>

        <WoningenInGemeente gemeente={g.naam} slug={g.slug} />

        <IsolatieMaatregelen
          titel="Welke isolatiemaatregelen zijn er?"
          intro="Isoleren kan op verschillende plekken in huis. Welke maatregel bij jouw woning past, bekijkt Gijs tijdens de energiescan."
        />
        <LandelijkeSubsidies />
        <RegelingenInGemeente gemeente={g.naam} officieleUrl={g.officieleSubsidieUrl} />

        <GemeenteKaart provincie={p} gemeente={g} />

        <ZoWerktGijsKort />
        <EnergiescanBlok />

        <section id="veelgestelde-vragen" className="scroll-mt-40 mb-14">
          <h2 className={H2 + " mb-6"}>Veelgestelde vragen</h2>
          <div className="max-w-3xl">
            <FAQAccordion items={faq} className="[&_.gijs-accordion__trigger]:py-6 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
          </div>
        </section>

        <RegioCta titel={`Je woning isoleren in ${g.naam}?`} />
      </RegioMain>
      <Footer />
    </>
  );
}
