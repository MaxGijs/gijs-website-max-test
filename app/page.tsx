import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/");
import HomeCutawayTest from "@/components/home/cutaway/HomeCutawayTest";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleReviewsSummary from "@/components/home/GoogleReviewsSummary";
import EenheidBanner from "@/components/home/EenheidBanner";
import EnergyScanCTA from "@/components/home/EnergyScanCTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HomeCutawayTest>

        {/* Sociale bewijskracht: bestaande Google-beoordeling van Gijs. */}
        <GoogleReviewsSummary />

        {/* "Zo werkt Gijs" staat niet meer op de homepage; de volledige
            uitleg leeft op de eigen pagina (/zo-werkt-gijs). */}

        {/* Eenheid: bestaand Gijs-beeld. */}
        <EenheidBanner />

        {/* Wederkerigheid: gratis energiescan t.w.v. € 349. Dit is
            bewust de laatste sectie vóór de footer — de pagina sluit af
            met "iets gratis krijgen", niet met een derde herhaling van
            de "start met mijn woning"-CTA (die staat al in de hero en
            in de uitlegsectie hierboven). */}
        <EnergyScanCTA />
        </HomeCutawayTest>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
