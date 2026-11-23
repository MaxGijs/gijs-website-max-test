import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/woning");
import { parseHouseType } from "@/lib/woning-types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WoningFlow } from "@/components/woning/WoningFlow";
import { EYEBROW, HERO_H1, HERO_INTRO } from "@/components/regio/regio-template-styles";

export default async function WoningPagina({
  searchParams,
}: {
  searchParams: Promise<{ postcode?: string; huisnummer?: string; woningtype?: string; maatregel?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Server-gerenderde H1 + korte basisuitleg, altijd aanwezig ongeacht
            scanstap (zie ook WoningFlow.tsx: de bestaande stap-1-intro is
            hierdoor teruggezet naar een h2, voor precies één h1 per pagina).
            Tekst is de al bestaande, goedgekeurde introtekst van stap 1. */}
        <div className="woning-intro max-w-[1200px] mx-auto px-6 pt-10 md:pt-14 flex flex-col gap-4">
          <p className={EYEBROW}>Gratis en vrijblijvend persoonlijk advies</p>
          <h1 className={HERO_H1}>Op weg naar je gratis adviesgesprek.</h1>
          <p className={`${HERO_INTRO} max-w-2xl`}>
            Bevestig je woning en vul een paar gegevens in. Je ziet direct wat er bij jouw woning mogelijk is en vraagt daarna
            een gratis en vrijblijvend adviesgesprek aan huis aan. Je hoeft niet alles te weten.
          </p>
        </div>
        <WoningFlow
          initialMeasure={params.maatregel}
          initialHouseType={parseHouseType(params.woningtype)}
          initialPostcode={params.postcode ?? ""}
          initialHuisnummer={params.huisnummer ?? ""}
        />
      </main>
      <Footer />
    </div>
  );
}
