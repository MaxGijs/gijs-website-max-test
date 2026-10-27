import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";
import { REGIO_PLAATSEN, getProvincie, getGemeente, getPlaats, plaatsenVan, regioPad } from "@/lib/content/regio";
import { getLokaleInhoud } from "@/lib/content/regio-lokaal";
import { getPlaatsVerhaal, getGemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { FAQAccordion } from "@/components/measures/FAQAccordion";
import { LokalePagina } from "@/components/regio/LokalePagina";
import { GemeenteVerhaalPagina, type VerhaalKern } from "@/components/regio/GemeenteVerhaalPagina";
import { RegioBreadcrumb, RegioMain, IsolatieMaatregelen, EnergiescanBlok, RegioCta } from "@/components/regio/RegioBlokken";
import { Alineas } from "@/components/regio/LokalePagina";
import { RegelingenInGemeente } from "@/components/subsidie/RegelingenInGemeente";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";

type Props = { params: Promise<{ provincie: string; gemeente: string; plaats: string }> };
export const dynamicParams = false;
// Een plaats met dezelfde naam als de gemeente krijgt geen eigen pagina.
export function generateStaticParams() {
  return REGIO_PLAATSEN.filter(k => k.gepubliceerd && k.slug !== k.gemeente)
    .map(k => ({ provincie: k.provincie, gemeente: k.gemeente, plaats: k.slug }));
}
async function laad(params: Props["params"]) {
  const { provincie, gemeente, plaats } = await params;
  const p = getProvincie(provincie);
  const g = p && getGemeente(p.slug, gemeente);
  const k = g && getPlaats(p.slug, g.slug, plaats);
  return p && g && k && k.slug !== g.slug ? { p, g, k } : null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await laad(params);
  if (!data) return {};
  const { p, g, k } = data;
  const pad = regioPad(p.slug, g.slug, k.slug);
  const ogBeeld = k.afbeelding ? { path: k.afbeelding, alt: `Plaatsnaambord ${k.naam}` } : undefined;
  const plaatsVerhaal = getPlaatsVerhaal(g.slug, k.slug);
  if (plaatsVerhaal) return createMetadata(pad, plaatsVerhaal.seo.title, plaatsVerhaal.seo.description, k.indexeerbaar, ogBeeld);
  const lokaal = getLokaleInhoud(pad);
  // Een plaats met eigen, unieke inhoud mag geïndexeerd worden, ook als de bovenliggende
  // gemeentepagina alleen een eenvoudig overzicht is (Berkum onder Zwolle).
  if (lokaal) return createMetadata(pad, lokaal.seo.title, lokaal.seo.description, k.indexeerbaar, ogBeeld);
  return createMetadata(
    pad,
    `Isolatie in ${k.naam} | Gijs`,
    `Je woning isoleren in ${k.naam}, gemeente ${g.naam}? Lees welke isolatiemaatregelen er zijn. Gemeentelijke subsidies controleer je bij de gemeente ${g.naam}.`,
    k.indexeerbaar && g.indexeerbaar,
    ogBeeld,
  );
}

export default async function PlaatsPage({ params }: Props) {
  const data = await laad(params);
  if (!data) notFound();
  const { p, g, k } = data;
  const gemeenteUrl = regioPad(p.slug, g.slug);
  const crumbs = [
    { naam: "Home", url: "/" }, { naam: "Regio", url: "/regio" }, { naam: p.naam, url: regioPad(p.slug) },
    { naam: g.naam, url: gemeenteUrl }, { naam: k.naam, url: regioPad(p.slug, g.slug, k.slug) },
  ];
  const plaatsVerhaal = getPlaatsVerhaal(g.slug, k.slug);
  if (plaatsVerhaal) {
    const alleKernen = plaatsenVan(p.slug, g.slug);
    const verhaalKernen: VerhaalKern[] = plaatsVerhaal.kernen.map(slug => {
      const kern = alleKernen.find(pl => pl.slug === slug);
      if (slug === k.slug) {
        // huidige pagina — geen link
        return { slug, naam: kern?.naam ?? k.naam, afbeelding: kern?.afbeelding ?? k.afbeelding };
      }
      if (slug === g.slug) {
        // de gemeentekern verwijst naar de gemeentepagina
        return { slug, naam: kern?.naam ?? g.naam, afbeelding: kern?.afbeelding, href: regioPad(p.slug, g.slug) };
      }
      return { slug, naam: kern?.naam ?? slug, afbeelding: kern?.afbeelding, href: kern ? regioPad(p.slug, g.slug, slug) : undefined };
    });
    return (
      <>
        <Header />
        <GemeenteVerhaalPagina
          verhaal={plaatsVerhaal}
          gemeente={g.naam}
          plaatsnaam={k.naam}
          crumbs={crumbs}
          kernen={verhaalKernen}
          officieleSubsidieUrl={g.officieleSubsidieUrl}
        />
        <Footer />
      </>
    );
  }
  const gemeenteVerhaal = getGemeenteVerhaal(g.slug);
  const lokaal = getLokaleInhoud(regioPad(p.slug, g.slug, k.slug));
  if (lokaal) {
    return (
      <>
        <Header />
        <LokalePagina
          inhoud={lokaal}
          crumbs={crumbs}
          afbeelding={k.afbeelding ? { src: k.afbeelding, alt: `Plaatsnaambord ${k.naam}` } : undefined}
          officieleSubsidieUrl={g.officieleSubsidieUrl}
          gemeenteNaam={g.naam}
        />
        <Footer />
      </>
    );
  }
  return (
    <>
      <Header />
      <RegioMain>
        <RegioBreadcrumb crumbs={crumbs} />

        <header className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-center mb-14">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">{k.naam}, gemeente {g.naam}</p>
            <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-display)] text-[var(--gijs-donkergroen)]">
              Isolatie in {k.naam}
            </h1>
            <p className="text-zinc-600">
              {k.naam} hoort bij de gemeente{" "}
              <Link href={gemeenteUrl} className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">{g.naam}</Link>.
              Wil je je woning in {k.naam} beter isoleren? Hieronder vind je de isolatiemaatregelen. Gemeentelijke
              subsidies en regelingen controleer je bij je eigen gemeente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button href="/woning" variant="accent" size="lg" iconRight="arrow-right">Start de woningscan</Button>
              <Button href="/contact#energiescan" variant="secondary" size="lg">Vraag een gratis energiescan aan</Button>
            </div>
          </div>
          {k.afbeelding && (
            <Image
              src={k.afbeelding}
              alt={`Plaatsnaambord ${k.naam}`}
              width={1366}
              height={329}
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="w-full h-auto rounded-2xl"
            />
          )}
        </header>

        {gemeenteVerhaal?.intro && gemeenteVerhaal.intro.length > 0 && (
          <section className="mb-10 prose prose-zinc max-w-none text-zinc-600 text-[17px] leading-relaxed">
            <h2 className="not-prose text-xl font-semibold text-[var(--gijs-donkergroen)] mb-4">
              Verduurzamen in de gemeente {g.naam}
            </h2>
            <Alineas alineas={gemeenteVerhaal.intro} />
          </section>
        )}

        <RegelingenInGemeente
          gemeente={g.naam}
          officieleUrl={g.officieleSubsidieUrl}
          relatie={`${k.naam} valt onder de gemeente ${g.naam}. Daarom gelden hier de regelingen van de gemeente ${g.naam}.`}
        />

        <IsolatieMaatregelen
          titel={`Isoleren in ${k.naam}`}
          intro="Kies een maatregel om te lezen hoe het werkt. Welke maatregel bij jouw woning past, bekijkt Gijs tijdens de energiescan."
        />

        {gemeenteVerhaal?.faq && gemeenteVerhaal.faq.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-[var(--gijs-donkergroen)] mb-6">
              Veelgestelde vragen over isoleren in {g.naam}
            </h2>
            <FAQAccordion items={gemeenteVerhaal.faq} className="[&_.gijs-accordion__trigger]:py-6 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
          </section>
        )}

        <section className="mb-14">
          <Link href={gemeenteUrl} className="text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] inline-flex items-center gap-1 no-underline">
            Meer over isoleren in de gemeente {g.naam}, zoals landelijke subsidies <Icon name="arrow-right" size="sm" />
          </Link>
        </section>

        <EnergiescanBlok />
        <RegioCta titel={`Je woning isoleren in ${k.naam}?`} />
      </RegioMain>
      <Footer />
    </>
  );
}
