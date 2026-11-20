import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/SeoSchema";
import { RegioBreadcrumb, RegioMain } from "@/components/regio/RegioBlokken";
import { EYEBROW, HERO_INTRO } from "@/components/regio/regio-template-styles";
import { ARTIKEL_TEKST, ArtikelFoto } from "@/components/kennis/ArtikelOpmaak";
import { SlimmeWarmtepompSubsidie2027, SlimmeWarmtepompInleiding } from "@/components/kennis/SlimmeWarmtepompSubsidie2027";
import { SalderenThuisbatterij2027, SalderenInleiding } from "@/components/kennis/SalderenThuisbatterij2027";
import { WarmtenetKerschotenApeldoorn, WarmtenetKerschotenInleiding } from "@/components/kennis/WarmtenetKerschotenApeldoorn";
import { CvKetelVervangen2029, CvKetelInleiding } from "@/components/kennis/CvKetelVervangen2029";
import { KENNIS_ARTIKELEN, kennisArtikelPad, artikelOvergangId, formatteerDatum } from "@/lib/content/kennis-artikelen";
import { createMetadata, SITE_URL } from "@/lib/seo";
import { titelOvergang } from "@/lib/overgang";

// Artikeltekst per slug. Nieuw artikel: gegevens in lib/content/kennis-artikelen.ts, tekst als
// component in components/kennis/, en hier koppelen.
const INHOUD: Record<string, { inleiding: ComponentType<{ className?: string }>; tekst: ComponentType<{ slug: string }> }> = {
  "slimme-warmtepomp-subsidie-2027": { inleiding: SlimmeWarmtepompInleiding, tekst: SlimmeWarmtepompSubsidie2027 },
  "cv-ketel-vervangen-2029-gas-of-warmtepomp": { inleiding: CvKetelInleiding, tekst: CvKetelVervangen2029 },
  "warmtenet-kerschoten-verduurzamen-apeldoorn": { inleiding: WarmtenetKerschotenInleiding, tekst: WarmtenetKerschotenApeldoorn },
  "salderen-stopt-2027-thuisbatterij": { inleiding: SalderenInleiding, tekst: SalderenThuisbatterij2027 },
};

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return KENNIS_ARTIKELEN.map(a => ({ slug: a.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = KENNIS_ARTIKELEN.find(x => x.slug === slug);
  if (!a) return {};
  const basis = createMetadata(kennisArtikelPad(a.slug), a.seoTitel, a.beschrijving, true, a.afbeelding);
  return {
    ...basis,
    openGraph: {
      ...basis.openGraph,
      type: "article",
      publishedTime: a.gepubliceerd,
      ...(a.gewijzigd && { modifiedTime: a.gewijzigd }),
    },
  };
}

export default async function KennisArtikelPagina({ params }: Props) {
  const { slug } = await params;
  const a = KENNIS_ARTIKELEN.find(x => x.slug === slug);
  const inhoud = INHOUD[slug];
  if (!a || !inhoud) notFound();
  const { inleiding: Inleiding, tekst: Tekst } = inhoud;
  const url = SITE_URL + kennisArtikelPad(a.slug);

  return (
    <>
      <Header />
      <RegioMain>
        <RegioBreadcrumb crumbs={[
          { naam: "Home", url: "/" },
          { naam: "Kennis", url: "/kennis" },
          { naam: a.titel, url: kennisArtikelPad(a.slug) },
        ]} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.titel,
          description: a.beschrijving,
          image: [SITE_URL + a.afbeelding.path],
          datePublished: a.gepubliceerd,
          dateModified: a.gewijzigd ?? a.gepubliceerd,
          inLanguage: "nl-NL",
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          url,
          author: { "@id": SITE_URL + "/#organization" },
          publisher: { "@id": SITE_URL + "/#organization" },
        }} />
        <article className="mx-auto max-w-[68ch] pt-2 lg:pt-6">
          {/* Titel en inleiding boven de foto. Bij doorklikken vanaf een kaart op /kennis schuift de
              kaartfoto naar zijn plek hieronder en schuift de rest van de pagina van onderen in beeld
              ("Foto-overgang" in globals.css). */}
          <header>
            <p className={EYEBROW + " mb-4"}>Kennis</p>
            <h1 className="text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.04em] text-[var(--gijs-donkergroen)] [text-wrap:balance]" style={titelOvergang(artikelOvergangId(a.slug))}>
              {a.titel}
            </h1>
            <p className={HERO_INTRO + " !text-[15px] mt-5"}>
              Gepubliceerd op <time dateTime={a.gepubliceerd}>{formatteerDatum(a.gepubliceerd)}</time>
              {a.gewijzigd && <> · Bijgewerkt op <time dateTime={a.gewijzigd}>{formatteerDatum(a.gewijzigd)}</time></>}
            </p>
            <Inleiding className={HERO_INTRO + " mt-6"} />
          </header>
          <ArtikelFoto src={a.afbeelding.path} alt={a.afbeelding.alt} priority overgang={artikelOvergangId(a.slug)} />
          <div className={ARTIKEL_TEKST}>
            <Tekst slug={a.slug} />
          </div>
        </article>
      </RegioMain>
      <Footer />
    </>
  );
}
