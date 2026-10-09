import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { MEASURE_PAGES } from "@/lib/content/measure-pages";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/MeasureExplorer.module.css";
export const metadata=pageMetadata("/kennis");
// Scanbaarheid: korte in-paginanavigatie, zelfde herbruikbare component als op elke
// maatregelpagina (ook al mobielvriendelijk: horizontaal scrollende rij, geen overflow).
const SECTIONS=[{id:"keuzehulpen",label:"Waar begin je?"},{id:"veelgestelde-vragen",label:"Veelgestelde vragen"},{id:"subsidies",label:"Subsidies"}];
// Sommige maatregelen delen letterlijk dezelfde FAQ-tekst (bv. ketel/warmtepomp: "moet mijn
// cv-ketel weg?"). Op de eigen maatregelpagina hoort die vraag thuis, maar in déze
// verzamellijst zou hetzelfde antwoord twee keer op één pagina staan. Hier dus eenmalig
// ontdubbelen op vraag+antwoord, zonder de brontekst in measure-pages.ts aan te passen.
const FAQ_MAATREGELEN=MEASURE_PAGES.filter((m,i)=>MEASURE_PAGES.findIndex(x=>x.question===m.question&&x.answer===m.answer)===i);
export default function Kennis(){return <><Header/><main className={styles.page}>
 <header className={styles.overviewHero}><p className={styles.eyebrow}>Kennis en vragen</p><h1>Je huis verduurzamen begint met begrijpen.</h1><p>Je hoeft geen expert te zijn. Hieronder vind je uitleg over maatregelen en het adviesgesprek met Gijs.</p></header>
 <MeasureSectionNav sections={SECTIONS} />
 <div className={styles.article}>
 <section id="keuzehulpen"><h2>Waar begin je?</h2><p>Kijk eerst naar wat je wilt verbeteren: tocht, een koude vloer, minder gas gebruiken of zelf stroom opwekken. Je hoeft niet alles tegelijk te doen.</p><Link href="/maatregelen">Lees over isolaties en installaties →</Link><p>In de <Link href="/woning">digitale woningscan</Link> verzamel je wensen op een voorbeeldwoning. Gijs beoordeelt later wat technisch bij je huis past.</p></section>
 <section id="veelgestelde-vragen"><h2>Veelgestelde vragen</h2>
 <h3 className={styles.faqGroep}>Algemeen</h3>
 <details className={styles.accordion}><summary>Is de energiescan aan huis gratis en vrijblijvend?</summary><p>Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur.</p></details>
 <details className={styles.accordion}><summary>Wat gebeurt er tijdens de energiescan aan huis?</summary><p>Een adviseur van Gijs bekijkt je woning en je woningplan, neemt de bestaande situatie op (bijvoorbeeld door te meten en te kijken naar de constructie) en controleert wat technisch bij je woning past. Daarna bespreekt de adviseur met je wat een logische vervolgstap is.</p></details>
 <details className={styles.accordion}><summary>Is het 3D-model mijn echte woning?</summary><p>Nee. Het is een voorbeeldmodel van het woningtype dat je kiest. Het invullen van je adres maakt er geen digitale kopie van je huis van.</p></details>
 <details className={styles.accordion}><summary>Moet ik al weten welke maatregelen ik wil?</summary><p>Nee. Je kunt aangeven dat je hulp wilt bij het kiezen of direct contact opnemen. De digitale woningscan is geen verplichte voorbereiding.</p></details>
 <h3 className={styles.faqGroep}>Per maatregel</h3>
 {FAQ_MAATREGELEN.map(m=><details key={m.slug} className={styles.accordion}><summary>{m.question}</summary><p>{m.answer}</p><Link href={"/maatregelen/"+m.slug}>Meer over {m.name.toLowerCase()}</Link></details>)}</section>
 <section id="subsidies"><h2>Subsidies en financiering</h2><p>Deze website geeft nog geen persoonlijke subsidie- of financieringsberekening. De digitale woningscan laat geen definitieve kosten, besparingen of aanspraak op subsidie zien.</p>
 <p>Voor sommige verduurzamingsmaatregelen is subsidie beschikbaar. De voorwaarden en bedragen kunnen wijzigen. Tijdens de energiescan bespreken we welke mogelijkheden op dat moment voor jouw woning gelden.</p>
 <p>Meer weten over de landelijke ISDE-regeling? Bekijk de <a href="https://www.rvo.nl/subsidies-financiering/isde" target="_blank" rel="noopener noreferrer">officiële ISDE-pagina van RVO</a>.</p>
 <p>Neem je vragen mee naar het gesprek met Gijs. Benieuwd wat er voor jouw woning mogelijk is? Bekijk de <Link href="/subsidiecheck">subsidiecheck</Link>.</p></section>
 </div><section className={styles.cta}><div><h2>Staat jouw vraag er niet bij?</h2><p>Bel of stel je vraag aan Gijs.</p></div><Link className={styles.button} href="/contact">Neem contact op →</Link></section>
 </main><Footer/></>;}
