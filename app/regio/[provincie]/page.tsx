import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import { REGIO_PROVINCIES, getProvincie, regioPad } from "@/lib/content/regio";
import { ProvincieKaart } from "@/components/regio/RegioDrilldown";
import { RegioBreadcrumb, RegioMain, IsolatieMaatregelen, LandelijkeSubsidies, ZoWerktGijsKort, EnergiescanBlok, RegioCta } from "@/components/regio/RegioBlokken";

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
    `Lees per gemeente in ${p.naam} over dak-, spouw- en vloerisolatie, isolatieglas en kozijnen, landelijke subsidies en de gratis energiescan aan huis.`,
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
        <header className="flex flex-col gap-4 max-w-3xl mb-14">
          <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Provincie {p.naam}</p>
          <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-display)] text-[var(--gijs-donkergroen)]">
            Isoleren en verduurzamen in {p.naam}
          </h1>
          <p className="text-zinc-600">
            Wil je je woning in {p.naam} beter isoleren? Kies hieronder je gemeente. Daar lees je welke
            isolatiemaatregelen er zijn en hoe landelijke subsidies werken. Gemeentelijke subsidies verschillen per
            gemeente: die controleer je bij je eigen gemeente.
          </p>
          <p className="text-zinc-600">
            Het kantoor van Gijs zit aan de {CONTACT.street} in Hengelo. Voor de energiescan aan huis werkt Gijs
            samen met{" "}
            <a href="https://energieloket-twente.nl" target="_blank" rel="noopener noreferrer" className="underline">Energieloket Twente</a>.
          </p>
        </header>

        <ProvincieKaart provincie={p} />

        <IsolatieMaatregelen
          titel="Welke isolatiemaatregelen zijn er?"
          intro="Isoleren kan op verschillende plekken in huis. Welke maatregel bij jouw woning past, bekijkt Gijs tijdens de energiescan."
        />
        <LandelijkeSubsidies />
        <ZoWerktGijsKort />
        <EnergiescanBlok />
        <RegioCta titel={`Je woning isoleren in ${p.naam}?`} />
      </RegioMain>
      <Footer />
    </>
  );
}
