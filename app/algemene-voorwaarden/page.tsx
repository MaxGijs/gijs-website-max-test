import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/algemene-voorwaarden");
import PlaceholderPage from "@/components/PlaceholderPage";

export default function AlgemeneVoorwaarden() {
  return (
    <PlaceholderPage
      cluster="Vertrouwen"
      title="Algemene voorwaarden"
      intro="De algemene voorwaarden van Gijs worden op deze pagina gepubliceerd zodra de definitieve tekst is vastgesteld."
      opvraagbaar
      vervolg={[
        { href: "/contact", titel: "Contact", tekst: "Bel of mail Gijs met je vraag over de voorwaarden." },
        { href: "/zo-werkt-gijs", titel: "Zo werkt Gijs", tekst: "Wat je stap voor stap van ons kunt verwachten." },
        { href: "/over-gijs", titel: "Over Gijs", tekst: "Wie we zijn en waar we vandaan komen." },
      ]}
    />
  );
}
