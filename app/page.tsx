import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/");
import HomepageWoning from "@/components/home/cutaway/anime-prototype/HomepageWoning";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleReviewsSummary from "@/components/home/GoogleReviewsSummary";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HomepageWoning>

        {/* Sociale bewijskracht: bestaande Google-beoordeling van Gijs. */}
        <GoogleReviewsSummary />

        {/* "Zo werkt Gijs" staat niet meer op de homepage; de volledige
            uitleg leeft op de eigen pagina (/zo-werkt-gijs). */}

        {/* Het beeld met de huizen (EenheidBanner) en de losse energiescan-CTA (EnergyScanCTA)
            staan niet meer op de homepage: de woningscan en de gratis energiescan staan al in het
            slot van het woningverhaal hierboven. */}
        </HomepageWoning>
      </main>

      <Footer />
    </div>
  );
}
