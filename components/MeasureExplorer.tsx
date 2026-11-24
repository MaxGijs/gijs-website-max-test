import Link from "next/link";
import MeasureImage from "./MeasureImage";
import { OVERGANG_TYPES, titelOvergang } from "@/lib/overgang";
import { FotoOvergang } from "./FotoOvergang";
import { MEASURE_PAGES } from "@/lib/content/measure-pages";
import { ISOLATIE_REGIO_LINKS } from "@/lib/content/isolatie-regio";
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
  { question: "Warmte binnenhouden", links: [{ label: "Isolaties", href: "#isolatie" }] },
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
          onderaan ("Waar wil je iets aan doen?") vervult dezelfde
          functie (naar dezelfde #isolatie/#installaties-anchors), maar
          met meer context per vraag. Twee concurrerende manieren om te
          beginnen leidde tot een minder duidelijke eerste indruk; nu is
          er nog maar één duidelijke ingang. */}
    </header>
    {/* UX-CORRECTIERONDE: subtekst iets herformuleerd zodat het verschil
        tussen de twee categorieën direct duidelijk is ("houdt warmte
        binnen" vs. "helpt bij") — zelfde feiten/scope als voorheen (dak/
        muren/vloer/ramen; opwekken/bewaren/verwarmen), geen nieuwe claim
        toegevoegd. */}
    {[
      { id: "isolatie", title: "Isolaties", text: "Isolaties houden warmte beter binnen via dak, muren, vloer en ramen." },
      { id: "installaties", title: "Installaties", text: "Installaties helpen je bij verwarmen, zelf stroom opwekken of stroom bewaren." },
    ].map(group => <section key={group.id} id={group.id} className={styles.category}>
      <h2>{group.title}</h2><p>{group.text}</p>
      <div className={styles.cards}>{MEASURE_PAGES.filter(item => item.category === group.id).map(item => <Link id={item.slug} key={item.slug} href={"/maatregelen/"+item.slug} transitionTypes={OVERGANG_TYPES} className={styles.card}>
        <FotoOvergang id={"maatregel-"+item.slug}><div className={styles.cardImage}><MeasureImage image={item.image} name={item.name}/></div></FotoOvergang>
        <div className={styles.cardBody}><h3 style={titelOvergang("maatregel-"+item.slug)}>{item.name}</h3><p>{item.result}</p><span>Lees meer over {item.name.toLowerCase()} <span aria-hidden="true">→</span></span></div>
      </Link>)}</div>
      {group.id === "isolatie" && <p className={styles.regioRegel}>
        Welke isolatie het eerst loont, hangt ook af van waar en wanneer je huis is gebouwd. Lees bijvoorbeeld over{" "}
        <Link href="/regio/overijssel/borne">isolatie in Borne</Link>, waar ruim een derde van de woningen van vóór 1975 is, over een{" "}
        <Link href="/regio/overijssel/rijssen-holten/holten">isolatiebedrijf in Holten</Link> of over{" "}
        <Link href="/regio/flevoland/lelystad">je woning isoleren in Lelystad</Link>, waar de meeste huizen na 1975 zijn gebouwd.
      </p>}
      {group.id === "isolatie" && <div className={styles.regioBlok}>
        <h3>Isolatie in jouw regio</h3>
        <dl className={styles.regioRijen}>
          {ISOLATIE_REGIO_LINKS.map(p => <div key={p.provincie} className={styles.regioRij}>
            <dt>{p.naam}</dt>
            <dd><ul>{p.links.map(l => <li key={l.href}><Link href={l.href}>{l.tekst}</Link></li>)}</ul></dd>
          </div>)}
        </dl>
      </div>}
    </section>)}
    {/* Keuzehulp onderaan (op verzoek van Max): eerst direct de isolaties en installaties,
        daarna voor wie nog twijfelt deze ingang per wens. */}
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
    <section className={styles.cta}><div><h2>Twijfel je wat past?</h2><p>Je hoeft nog geen maatregel of merk te kiezen. Ontdek wat bij jouw woning past.</p></div><Link className={styles.button} href="/woning">Ik wil mijn woning verduurzamen →</Link></section>
  </div>;
}
