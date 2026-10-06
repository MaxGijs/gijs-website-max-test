import Link from "next/link";
import MeasureImage from "./MeasureImage";
import { MEASURE_PAGES } from "@/lib/content/measure-pages";
import styles from "./MeasureExplorer.module.css";

// Eenvoudige keuzehulp ("Waar wil je iets aan doen?"), toegevoegd om
// bezoekers zonder voorkennis snel naar de juiste maatregel te helpen —
// geen wizard, geen nieuwe techniek, alleen directe links naar bestaande
// maatregelpagina's/categorieën.
//
// UX-CORRECTIERONDE: deze links wezen eerst rechtstreeks naar de losse
// maatregelpagina's (bv. "/maatregelen/zonnepanelen"), waardoor een
// bezoeker die net een keuze maakte meteen van het overzicht af werd
// gestuurd — de rest van het aanbod verdween daarmee uit beeld. Nu
// wijzen alle links naar bestaande anchors op déze pagina: "#isolatie"
// (sectie) en de individuele kaart-id's (elke kaart heeft al een
// `id={item.slug}`, zie de kaarten-grid hieronder). Zo blijft de
// bezoeker op het overzicht en ziet hij alsnog alle opties (zie ook
// styles.category/.card, die al scroll-margin-top hebben voor de sticky
// header — geen nieuwe CSS nodig). Geen nieuwe pagina's, geen nieuwe
// secties.
const ORIENTATION_ITEMS = [
  { question: "Warmte binnenhouden", links: [{ label: "Isolatie", href: "#isolatie" }] },
  { question: "Anders verwarmen", links: [{ label: "Warmtepomp", href: "#warmtepomp" }, { label: "Vloerverwarming", href: "#vloerverwarming" }, { label: "Ketel", href: "#ketel" }] },
  { question: "Zelf stroom opwekken", links: [{ label: "Zonnepanelen", href: "#zonnepanelen" }] },
  { question: "Stroom bewaren", links: [{ label: "Thuisbatterij", href: "#thuisbatterij" }] },
];

export default function MeasureExplorer() {
  return <div className={styles.page}>
    <header className={styles.overviewHero}>
      <p className={styles.eyebrow}>Maatregelen voor je woning</p>
      <h1>Een fijner huis begint bij weten wat kan.</h1>
      <p>Warmte binnenhouden, anders verwarmen of zelf stroom opwekken. Lees wat de mogelijkheden zijn en wat Gijs samen met jou bekijkt.</p>
      {/* UX-CORRECTIERONDE: de losse "Isolatie ↓ / Installaties ↓"
          quick-links die hier stonden, zijn verwijderd — de keuzehulp
          direct hieronder ("Waar wil je iets aan doen?") vervult dezelfde
          functie (naar dezelfde #isolatie/#installaties-anchors), maar
          met meer context per vraag. Twee concurrerende manieren om te
          beginnen leidde tot een minder duidelijke eerste indruk; nu is
          er nog maar één duidelijke ingang. */}
    </header>
    <div className={styles.orientation}>
      <h2>Waar wil je iets aan doen?</h2>
      <div className={styles.orientationGrid}>
        {ORIENTATION_ITEMS.map(item => (
          <div key={item.question} className={styles.orientationItem}>
            <p>{item.question}</p>
            <div className={styles.orientationLinks}>
              {item.links.map(link => <Link key={link.href} href={link.href}>{link.label} →</Link>)}
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* UX-CORRECTIERONDE: subtekst iets herformuleerd zodat het verschil
        tussen de twee categorieën direct duidelijk is ("houdt warmte
        binnen" vs. "helpt bij") — zelfde feiten/scope als voorheen (dak/
        muren/vloer/ramen; opwekken/bewaren/verwarmen), geen nieuwe claim
        toegevoegd. */}
    {[
      { id: "isolatie", title: "Isolatie", text: "Isolatie houdt warmte beter binnen via dak, muren, vloer en ramen." },
      { id: "installaties", title: "Installaties", text: "Installaties helpen je bij verwarmen, zelf stroom opwekken of stroom bewaren." },
    ].map(group => <section key={group.id} id={group.id} className={styles.category}>
      <h2>{group.title}</h2><p>{group.text}</p>
      <div className={styles.cards}>{MEASURE_PAGES.filter(item => item.category === group.id).map(item => <Link id={item.slug} key={item.slug} href={"/maatregelen/"+item.slug} className={styles.card}>
        <div className={styles.cardImage}><MeasureImage image={item.image} name={item.name}/></div>
        <div className={styles.cardBody}><h3>{item.name}</h3><p>{item.result}</p><span>Lees meer over {item.name.toLowerCase()} <span aria-hidden="true">→</span></span></div>
      </Link>)}</div>
    </section>)}
    <section className={styles.cta}><div><h2>Twijfel je wat past?</h2><p>Je hoeft nog geen maatregel of merk te kiezen. Bespreek je huis en je wensen met Gijs.</p></div><Link className={styles.button} href="/contact#energiescan">Vraag een gratis energiescan aan →</Link></section>
  </div>;
}
