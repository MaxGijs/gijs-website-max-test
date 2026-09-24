import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/toegankelijkheid");
import PlaceholderPage from "@/components/PlaceholderPage";

export default function Toegankelijkheid() {
  return (
    <PlaceholderPage
      cluster="Vertrouwen"
      title="Toegankelijkheid"
      intro="We willen dat iedereen deze website kan gebruiken, ook met een schermlezer, alleen het toetsenbord of een kleiner scherm. De formele toegankelijkheidsverklaring volgt zodra die is vastgesteld."
      vervolg={[
        { href: "/contact", titel: "Meld wat niet werkt", tekst: "Kom je iets tegen dat onleesbaar of onbedienbaar is? Laat het ons weten, dan pakken we het op." },
        { href: "/maatregelen", titel: "Alle maatregelen", tekst: "Dezelfde informatie als in de 3D-woning, maar dan als gewone tekst." },
        { href: "/kennis", titel: "Uitleg en vragen", tekst: "Antwoorden op de vragen die het vaakst gesteld worden." },
      ]}
    />
  );
}
