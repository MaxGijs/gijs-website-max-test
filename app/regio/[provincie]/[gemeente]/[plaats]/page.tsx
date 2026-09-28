import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";
import { REGIO_PLAATSEN, getProvincie, getGemeente, getPlaats, regioPad } from "@/lib/content/regio";
import { RegioBreadcrumb, RegioMain, IsolatieMaatregelen, GemeentelijkeSubsidies, EnergiescanBlok, RegioCta } from "@/components/regio/RegioBlokken";
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
  return createMetadata(
    regioPad(p.slug, g.slug, k.slug),
    `Isolatie in ${k.naam} | Gijs`,
    `Je woning isoleren in ${k.naam}, gemeente ${g.naam}? Lees welke isolatiemaatregelen er zijn. Gemeentelijke subsidies controleer je bij de gemeente ${g.naam}.`,
    k.indexeerbaar && g.indexeerbaar,
    { path: k.afbeelding, alt: `Plaatsnaambord ${k.naam}` },
  );
}

export default async function PlaatsPage({ params }: Props) {
  const data = await laad(params);
  if (!data) notFound();
  const { p, g, k } = data;
  const gemeenteUrl = regioPad(p.slug, g.slug);
  return (
    <>
      <Header />
      <RegioMain>
        <RegioBreadcrumb crumbs={[
          { naam: "Home", url: "/" }, { naam: "Regio", url: "/regio" }, { naam: p.naam, url: regioPad(p.slug) },
          { naam: g.naam, url: gemeenteUrl }, { naam: k.naam, url: regioPad(p.slug, g.slug, k.slug) },
        ]} />

        <header className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-center mb-14">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">{k.naam}, gemeente {g.naam}</p>
            <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-heading)] text-[var(--gijs-donkergroen)]">
              Isolatie in {k.naam}
            </h1>
            <p className="text-zinc-600">
              {k.naam} hoort bij de gemeente{" "}
              <Link href={gemeenteUrl} className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">{g.naam}</Link>.
              Wil je je woning in {k.naam} beter isoleren? Hieronder vind je de isolatiemaatregelen. Gemeentelijke
              subsidies en regelingen controleer je bij je eigen gemeente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button href="/contact#energiescan" variant="accent" size="lg" iconRight="arrow-right">Plan een gratis energiescan</Button>
            </div>
          </div>
          <Image
            src={k.afbeelding}
            alt={`Plaatsnaambord ${k.naam}`}
            width={1366}
            height={329}
            priority
            sizes="(max-width: 1024px) 100vw, 520px"
            className="w-full h-auto"
          />
        </header>

        <GemeentelijkeSubsidies
          gemeente={g.naam}
          officieleUrl={g.officieleSubsidieUrl}
          relatie={`${k.naam} valt onder de gemeente ${g.naam}. Voor eventuele gemeentelijke subsidies of regelingen raadpleeg je daarom de actuele informatie van de gemeente ${g.naam}.`}
        />

        <IsolatieMaatregelen
          titel={`Isoleren in ${k.naam}`}
          intro="Kies een maatregel om te lezen hoe het werkt. Welke maatregel bij jouw woning past, bekijkt Gijs tijdens de energiescan."
        />

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
