import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/disclaimer");
import PlaceholderPage from "@/components/PlaceholderPage";

export default function Disclaimer() {
  return (
    <PlaceholderPage
      cluster="Vertrouwen"
      title="Disclaimer"
      intro="De disclaimer van Gijs komt op deze pagina zodra de definitieve tekst is vastgesteld."
      opvraagbaar
      vervolg={[
        { href: "/contact", titel: "Contact", tekst: "Bel of mail Gijs met je vraag." },
        { href: "/kennis", titel: "Uitleg en vragen", tekst: "Antwoorden op de vragen die het vaakst gesteld worden." },
        { href: "/over-gijs", titel: "Over Gijs", tekst: "Wie we zijn en hoe we werken." },
      ]}
    />
  );
}
