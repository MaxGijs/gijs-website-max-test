import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/woning");
import { parseHouseType } from "@/lib/woning-types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WoningFlow } from "@/components/woning/WoningFlow";

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
        <div className="max-w-[640px] mx-auto px-6 pt-8">
          <h1 className="text-[clamp(26px,3vw,40px)] leading-[1.2] font-bold text-[var(--green-900)]">
            Van jouw woning naar een plan.
          </h1>
          <p className="mt-2 text-[var(--green-900)]">
            Bevestig je woning, vul een paar gegevens in en zie direct je woningplan. Je hoeft niet alles te weten.
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
