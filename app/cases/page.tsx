import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/cases");
import PlaceholderPage from "@/components/PlaceholderPage";

export default function Cases() {
  return (
    <PlaceholderPage
      cluster="Over Gijs"
      title="Projecten en ervaringen"
      intro="Zodra Gijs projecten vrijgeeft om te laten zien, staan ze hier: echte woningen, wat eraan is gedaan en wat de bewoners ervan merken. Tot die tijd zetten we hier geen voorbeelden neer die we niet kunnen onderbouwen."
      vervolg={[
        { href: "/maatregelen", titel: "Wat Gijs doet", tekst: "Isolatie en installaties, met per maatregel uitleg over wat het voor je huis betekent." },
        { href: "/zo-werkt-gijs", titel: "Zo werkt Gijs", tekst: "Van digitale woningscan naar een adviesgesprek bij je thuis." },
        { href: "/over-gijs", titel: "Over Gijs", tekst: "Wie we zijn en hoe we naar jouw woning kijken." },
      ]}
    />
  );
}
