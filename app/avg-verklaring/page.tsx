import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/avg-verklaring");
import PlaceholderPage from "@/components/PlaceholderPage";

export default function AvgVerklaring() {
  return (
    <PlaceholderPage
      cluster="Vertrouwen"
      title="AVG-verklaring"
      intro="Gijs gaat zorgvuldig om met je gegevens. De volledige AVG-verklaring komt op deze pagina zodra de definitieve tekst is vastgesteld."
      opvraagbaar
      vervolg={[
        { href: "/contact", titel: "Contact", tekst: "Vragen over je gegevens? Bel of mail Gijs." },
        { href: "/cookies", titel: "Cookies", tekst: "Wat deze website wel en niet op je apparaat opslaat." },
        { href: "/zo-werkt-gijs", titel: "Zo werkt Gijs", tekst: "Welke gegevens je deelt en waarvoor." },
      ]}
    />
  );
}
