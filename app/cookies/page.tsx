import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/cookies");
import PlaceholderPage from "@/components/PlaceholderPage";

export default function Cookies() {
  return (
    <PlaceholderPage
      cluster="Vertrouwen"
      title="Cookies"
      intro="Deze website plaatst op dit moment geen cookies om je te volgen en gebruikt geen statistiek- of advertentiediensten. Wat je in de woningscan invult, blijft in je eigen browser staan en wordt pas verstuurd als je daar zelf voor kiest. Zodra hier iets aan verandert, wordt deze pagina bijgewerkt met de definitieve tekst."
      vervolg={[
        { href: "/avg-verklaring", titel: "AVG-verklaring", tekst: "Hoe Gijs met je persoonsgegevens omgaat." },
        { href: "/contact", titel: "Contact", tekst: "Vragen hierover? Bel of mail Gijs." },
        { href: "/woning", titel: "Digitale woningscan", tekst: "Bekijk zelf wat de scan van je vraagt en wat niet." },
      ]}
    />
  );
}
