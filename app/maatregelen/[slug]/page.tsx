import type { Metadata } from "next";
import { createMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/SeoSchema";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MeasureImage from "@/components/MeasureImage";
import { MEASURE_PAGES } from "@/lib/content/measure-pages";
import { SPOUW_PRODUCTS } from "@/lib/content/spouw-products";
import { SpouwmuurisolatiePage } from "@/components/measures/SpouwmuurisolatiePage";
import { DakisolatiePage } from "@/components/measures/DakisolatiePage";
import { VloerisolatiePage } from "@/components/measures/VloerisolatiePage";
import { IsolatieglasPage } from "@/components/measures/IsolatieglasPage";
import { KozijnenPage } from "@/components/measures/KozijnenPage";
import { ZonnepanelenPage } from "@/components/measures/ZonnepanelenPage";
import { WarmtepompPage } from "@/components/measures/WarmtepompPage";
import { ThuisbatterijPage } from "@/components/measures/ThuisbatterijPage";
import { VloerverwarmingPage } from "@/components/measures/VloerverwarmingPage";
import { KetelPage } from "@/components/measures/KetelPage";
import styles from "@/components/MeasureExplorer.module.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return MEASURE_PAGES.map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = MEASURE_PAGES.find(item => item.slug === slug);
  if (!item) return {};
  // Spouwmuurisolatie heeft eigen, gerichte SEO-metadata (title/description/
  // OG-afbeelding) i.p.v. het generieke sjabloon hieronder — zie het
  // eindverslag voor de zoekwoorden waarop deze pagina is geoptimaliseerd.
  if (item.slug === "spouwmuurisolatie") {
    return createMetadata(
      "/maatregelen/spouwmuurisolatie",
      "Spouwmuurisolatie voor jouw woning | Gijs",
      "Ontdek hoe spouwmuurisolatie werkt, welke materialen Gijs gebruikt en hoe de uitvoering verloopt. Start de woningscan of plan een energiescan.",
      true,
      { path: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-aanbrengen-gijs.png", alt: "Spouwmuurisolatie wordt via een boorgat in de gevel aangebracht" }
    );
  }
  if (item.slug === "dakisolatie") {
    return createMetadata(
      "/maatregelen/dakisolatie",
      "Dakisolatie voor jouw woning | Gijs",
      "Ontdek hoe dakisolatie werkt, welke materialen Gijs gebruikt en hoe de uitvoering verloopt. Start de woningscan of plan een energiescan.",
      true,
      { path: "/images/maatregelen/dakisolatie/57bfad47-7c34-4f85-80dd-7b3f2f1bf8a4.png", alt: "Dakisolatie wordt tussen de dakconstructie aangebracht" }
    );
  }
  if (item.slug === "vloerisolatie") {
    return createMetadata(
      "/maatregelen/vloerisolatie",
      "Vloerisolatie voor jouw woning | Gijs",
      "Ontdek hoe vloerisolatie werkt, welke materialen Gijs gebruikt en hoe de uitvoering verloopt. Start de woningscan of plan een energiescan.",
      true,
      { path: "/images/maatregelen/vloerisolatie/hero_vloerisolatie.png", alt: "Vloerisolatie wordt vanuit de kruipruimte tegen de onderzijde van de vloer aangebracht" }
    );
  }
  if (item.slug === "isolatieglas") {
    return createMetadata(
      "/maatregelen/isolatieglas",
      "Isolatieglas voor jouw woning | Gijs",
      "Ontdek welke soorten isolatieglas er zijn, van HR++ glas tot HR+++ glas, en hoe Gijs het glas vervangen verzorgt. Start de woningscan of plan een energiescan.",
      true,
      { path: "/images/maatregelen/glas/isolatieglas.png", alt: "Monteur van Gijs plaatst isolatieglas in een raam" }
    );
  }
  if (item.slug === "kozijnen") {
    return createMetadata(
      "/maatregelen/kozijnen",
      "Kozijnen voor jouw woning | Gijs",
      "Ontdek welke kunststof en aluminium kozijnen Gijs plaatst, inclusief deuren en schuifpuien. Start de woningscan of plan een energiescan.",
      true,
      { path: "/images/maatregelen/kozijnen/kozijnen-hero.jpg", alt: "Nieuw geplaatst kozijn met raam en voordeur" }
    );
  }
  if (item.slug === "zonnepanelen") {
    return createMetadata(
      "/maatregelen/zonnepanelen",
      "Zonnepanelen voor jouw woning | Gijs",
      "Ontdek welke zonnepanelen Gijs plaatst en hoe de installatie in één dag verloopt. Start de woningscan of plan een energiescan.",
      true,
      { path: "/images/maatregelen/zonnepanelen/zonnepanelen-hero-v2.png", alt: "Een Gijs-installateur plaatst zonnepanelen op een schuin dak" }
    );
  }
  if (item.slug === "warmtepomp") {
    return createMetadata(
      "/maatregelen/warmtepomp",
      "Hybride warmtepomp voor jouw woning | Gijs",
      "Ontdek hoe een hybride warmtepomp samenwerkt met je cv-ketel, welke warmtepompen Gijs plaatst en hoe de installatie in één dag verloopt.",
      true,
      { path: "/images/maatregelen/warmtepomp/warmtepomp-hero.png", alt: "Een Gijs-installateur plaatst een hybride warmtepomp tegen de gevel van een woning" }
    );
  }
  if (item.slug === "thuisbatterij") {
    return createMetadata(
      "/maatregelen/thuisbatterij",
      "Thuisbatterij voor jouw woning | Gijs",
      "Ontdek hoe een thuisbatterij zonnestroom opslaat voor later gebruik, welke thuisbatterij Gijs plaatst en hoe de installatie verloopt.",
      true,
      { path: "/images/maatregelen/thuisbatterij/thuisbatterij-hero-v2.png", alt: "Een Gijs-installateur sluit een thuisbatterij aan" }
    );
  }
  if (item.slug === "vloerverwarming") {
    return createMetadata(
      "/maatregelen/vloerverwarming",
      "Vloerverwarming voor jouw woning | Gijs",
      "Ontdek hoe vloerverwarming werkt, hoe de gietdekvloer en het opstartprotocol werken, en welke verdeler past bij je cv-ketel of warmtepomp.",
      true,
      { path: "/images/maatregelen/vloerverwarming/vloerverwarming-hero.png", alt: "Een Gijs-installateur giet de dekvloer over de vloerverwarmingsleidingen" }
    );
  }
  if (item.slug === "ketel") {
    return createMetadata(
      "/maatregelen/ketel",
      "Ketel voor jouw woning | Gijs",
      "Ontdek wat een cv-ketel doet en hoe deze samenwerkt met een hybride warmtepomp of vloerverwarming. Start de woningscan of plan een energiescan.",
      false
    );
  }
  return createMetadata("/maatregelen/"+item.slug,item.name+" voor je woning | Mogelijkheden en advies van Gijs",item.intro+" Ontdek de mogelijkheden bij Gijs.");
}
export default async function MeasurePage({ params }: Props) {
  const { slug } = await params;
  const item = MEASURE_PAGES.find(item => item.slug === slug);
  if (!item) notFound();
  // Herwerkte opzet (contentaudit-vervolg): alleen spouwmuurisolatie
  // gebruikt vooralsnog de nieuwe, compactere componenten. De overige
  // maatregelen blijven op de bestaande opzet hieronder staan.
  if (item.slug === "spouwmuurisolatie") return <><Header/><SpouwmuurisolatiePage item={item} /><Footer/></>;
  if (item.slug === "dakisolatie") return <><Header/><DakisolatiePage item={item} /><Footer/></>;
  if (item.slug === "vloerisolatie") return <><Header/><VloerisolatiePage item={item} /><Footer/></>;
  if (item.slug === "isolatieglas") return <><Header/><IsolatieglasPage item={item} /><Footer/></>;
  if (item.slug === "kozijnen") return <><Header/><KozijnenPage item={item} /><Footer/></>;
  if (item.slug === "zonnepanelen") return <><Header/><ZonnepanelenPage item={item} /><Footer/></>;
  if (item.slug === "warmtepomp") return <><Header/><WarmtepompPage item={item} /><Footer/></>;
  if (item.slug === "thuisbatterij") return <><Header/><ThuisbatterijPage item={item} /><Footer/></>;
  if (item.slug === "vloerverwarming") return <><Header/><VloerverwarmingPage item={item} /><Footer/></>;
  if (item.slug === "ketel") return <><Header/><KetelPage item={item} /><Footer/></>;
  return <><Header/><main className={styles.page}>
    <JsonLd data={{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{name:"Home",url:"/"},{name:"Maatregelen",url:"/maatregelen"},{name:item.name,url:"/maatregelen/"+item.slug}].map((crumb,i)=>({"@type":"ListItem",position:i+1,name:crumb.name,item:SITE_URL+crumb.url}))}}/>
    <nav aria-label="Broodkruimel" className={styles.breadcrumb}><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/maatregelen">Maatregelen</Link><span aria-hidden="true">/</span><span aria-current="page">{item.name}</span></nav>
    <header className={styles.detailHero}><div><p className={styles.eyebrow}>{item.category === "isolatie" ? "Isolatie" : "Installaties"}</p><h1>{item.name} voor jouw woning</h1><p>{item.intro} <strong>{item.result}</strong></p></div><div className={styles.detailImage}><MeasureImage image={item.image} name={item.name} priority/></div></header>
    <div className={styles.article}>
      <section><h2>Wanneer kan {item.name.toLowerCase()} interessant zijn?</h2><p>{item.fitting}</p><p>Wat technisch past, beoordeelt Gijs samen met jou. Je hoeft vooraf geen product of merk te kiezen.</p></section>
      <section><h2>Welke mogelijkheden zijn er?</h2><ul>{item.types.map(text => <li key={text}>{text.replace("De bronnen noemen ", "Mogelijkheden zijn ").replace("de aangeleverde mogelijkheden omvatten", "een mogelijkheid is")}</li>)}</ul>
        {item.id === "gevelisolatie" && SPOUW_PRODUCTS.map(product => <details key={product.name} className={styles.accordion}><summary>{product.name} · materiaal en doorsnede</summary><Image className={styles.productImage} src={product.image} alt={product.alt} width={300} height={300}/><p>{product.text}</p></details>)}
      </section>
      <section><h2>Wat bekijkt Gijs en hoe verloopt de uitvoering?</h2><p>{item.execution}</p>{item.category === "installaties" && <p>Als de installatie dat vraagt, bekijkt Gijs ook de elektrische aansluiting en beschikbare groepen.</p>}
      </section>
      <section><h2>Veelgestelde vragen</h2><details className={styles.accordion}><summary>{item.question}</summary><p>{item.answer}</p></details><details className={styles.accordion}><summary>Moet ik eerst de digitale woningscan doen?</summary><p>Nee. Je kunt direct contact opnemen. De digitale woningscan is een optionele voorbereiding waarin je wensen verzamelt, geen technische beoordeling van je huis.</p></details><details className={styles.accordion}><summary>Is de energiescan aan huis vrijblijvend?</summary><p>Ja, de energiescan aan huis is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je huis en je wensen met een adviseur van Gijs.</p></details></section>
      <section><h2>Bekijk ook</h2><div className={styles.related}>{MEASURE_PAGES.filter(other => other.category === item.category && other.slug !== item.slug).map(other => <Link key={other.slug} href={"/maatregelen/"+other.slug}>{other.name}</Link>)}</div></section>
    </div>
    <section className={styles.cta}><div><h2>Wat past bij jouw huis?</h2><p>Bespreek je vragen over {item.name.toLowerCase()} met Gijs.</p><Link className={styles.secondary} href={"/woning?maatregel="+item.id}>Liever eerst zelf ontdekken? Neem mee in mijn woningplan</Link></div><Link className={styles.button} href="/contact#energiescan">Bespreek het met Gijs →</Link></section>
  </main><Footer/></>;
}
