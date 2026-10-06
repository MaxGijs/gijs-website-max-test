import { pageMetadata, SEO_INDEXABLE } from "@/lib/seo";
export const metadata = pageMetadata("/");
// PROTOTYPE (branch animejs-poppenhuis-prototype): homepage_woning i.p.v. HomeCutawayTest.
// Terugzetten: importeer weer HomeCutawayTest uit "@/components/home/cutaway/HomeCutawayTest".
import HomepageWoning from "@/components/home/cutaway/anime-prototype/HomepageWoning";
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
        <HomepageWoning productie={SEO_INDEXABLE}>

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
        </HomepageWoning>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
