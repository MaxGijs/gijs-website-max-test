import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";
import { REGIO_PLAATSEN, getProvincie, getGemeente, getPlaats, plaatsenVan, regioPad } from "@/lib/content/regio";
import { getLokaleInhoud } from "@/lib/content/regio-lokaal";
import { getPlaatsVerhaal, getGemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { LokalePagina } from "@/components/regio/LokalePagina";
import { LokaalProfielPagina } from "@/components/regio/LokaalProfielPagina";
import { sfeerFoto } from "@/lib/content/hero-sfeerfoto";
import { basisPagina } from "@/lib/content/lokaal-profiel-adapter";
import { GemeenteVerhaalPagina, type VerhaalKern } from "@/components/regio/GemeenteVerhaalPagina";

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
          provincie={p.slug}
          gemeente={g.naam}
          gemeenteSlug={g.slug}
          plaatsnaam={k.naam}
          plaatsSlug={k.slug}
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
          provincie={p.slug}
          gemeenteSlug={g.slug}
          plaatsSlug={k.slug}
        />
        <Footer />
      </>
    );
  }
  // Geen volledige gemeente-intro of -FAQ overnemen: dat zou dezelfde tekst (met de gemeentenaam
  // erin) onder tientallen plaatsnamen laten verschijnen en zo de gemeentepagina beconcurreren voor
  // haar eigen brede zoekwoorden. De korte basisPagina-intro verwijst al door naar de gemeentepagina.
  const basis = basisPagina({
    plaats: k.naam,
    gemeente: g.naam,
    gemeenteHref: gemeenteUrl,
    foto: sfeerFoto(`${g.slug}/${k.slug}`),
    faq: [],
  });
  return (
    <>
      <Header />
      <LokaalProfielPagina
        verhaal={basis.verhaal}
        profiel={basis.profiel}
        provincie={p.slug}
        gemeente={g.naam}
        gemeenteSlug={g.slug}
        plaatsnaam={k.naam}
        plaatsSlug={k.slug}
        crumbs={crumbs}
        kernen={[]}
        officieleSubsidieUrl={g.officieleSubsidieUrl}
      />
      <Footer />
    </>
  );
}
