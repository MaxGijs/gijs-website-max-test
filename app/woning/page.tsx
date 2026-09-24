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
