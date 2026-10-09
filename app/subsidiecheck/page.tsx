import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/subsidiecheck");
import PlaceholderPage from "@/components/PlaceholderPage";

// Placeholder voor de toekomstige subsidiecheck (sectie 25 van de opdracht): alleen route-structuur
// en stijl, bewust zonder subsidieregels, bedragen of een zelfbedachte rekenmethode. Thom en Max
// bepalen later samen de inhoud, voorwaarden en eventuele rekenregels; dan vervangt die inhoud deze
// pagina. Tot die tijd geen "Input nodig"-placeholder tekst verzinnen die op een echte check lijkt.
export default function Subsidiecheck() {
  return (
    <PlaceholderPage
      cluster="Subsidie"
      title="Subsidiecheck"
      intro="Gijs helpt je inzicht te krijgen in subsidies die mogelijk voor jouw woning gelden. Deze subsidiecheck wordt nog voorbereid: de precieze voorwaarden, bedragen en regelingen zijn nog niet definitief. Tot die tijd bespreekt Gijs de op dat moment geldende mogelijkheden gewoon tijdens de energiescan aan huis."
      vervolg={[
        { href: "/kennis#subsidies", titel: "Subsidies en financiering", tekst: "Algemene uitleg over hoe subsidie bij verduurzaming werkt, met een link naar de landelijke ISDE-regeling." },
        { href: "/woning", titel: "Digitale woningscan", tekst: "Stel je woningplan samen; Gijs bespreekt mogelijke subsidies met je tijdens de energiescan." },
        { href: "/contact", titel: "Contact", tekst: "Vraag alvast naar de mogelijkheden voor jouw situatie." },
      ]}
    />
  );
}
