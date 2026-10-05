import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { MEASURE_PAGES } from "@/lib/content/measure-pages";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/MeasureExplorer.module.css";
export const metadata=pageMetadata("/kennis");
// Pagina's uit "Subsidieoverzicht-Gijs.pdf" (aangeleverd), 1-op-1 als PNG weergegeven; bedragen niet overgenomen of gewijzigd.
const SUBSIDIE_PAGINAS=[
 {titel:"Landelijke subsidie isolatie (behalve glas)",src:"/images/kennis/subsidie/subsidieoverzicht-1.png",alt:"Subsidieoverzicht van Gijs voor spouwmuur-, gevel-, bodem-, vloer-, dak- en zoldervloerisolatie: bedrag dat je kunt ontvangen, subsidiebedrag per m² bij 1 of 2 maatregelen en het aantal m² waarvoor je subsidie kunt krijgen"},
 {titel:"Landelijke subsidie isolatieglas",src:"/images/kennis/subsidie/subsidieoverzicht-2.png",alt:"Subsidieoverzicht van Gijs voor dubbel en driedubbel glas en isolerende panelen en deuren: subsidiebedrag per m² bij 1 of vanaf 2 maatregelen en het aantal m² waarvoor je subsidie kunt krijgen"},
 {titel:"Subsidie warmtepompen",src:"/images/kennis/subsidie/subsidieoverzicht-3.png",alt:"Subsidieoverzicht van Gijs voor hybride, volledige en bodemwarmtepompen: geschatte subsidie per vermogen"},
];
export default function Kennis(){return <><Header/><main className={styles.page}>
 <header className={styles.overviewHero}><p className={styles.eyebrow}>Kennis en vragen</p><h1>Je huis verduurzamen begint met begrijpen.</h1><p>Je hoeft geen expert te zijn. Hieronder vind je uitleg over maatregelen en het adviesgesprek met Gijs.</p></header>
 <div className={styles.article}>
 <section id="keuzehulpen"><h2>Waar begin je?</h2><p>Kijk eerst naar wat je wilt verbeteren: tocht, een koude vloer, minder gas gebruiken of zelf stroom opwekken. Je hoeft niet alles tegelijk te doen.</p><Link href="/maatregelen">Lees over isolatie en installaties →</Link><p>In de <Link href="/woning">digitale woningscan</Link> verzamel je wensen op een voorbeeldwoning. Gijs beoordeelt later wat technisch bij je huis past.</p></section>
 <section id="veelgestelde-vragen"><h2>Veelgestelde vragen</h2>
 <details className={styles.accordion}><summary>Is de energiescan aan huis gratis en vrijblijvend?</summary><p>Ja. De energiescan is gratis en vrijblijvend, ter waarde van €349. Je bespreekt je woning en wensen met een adviseur.</p></details>
 <details className={styles.accordion}><summary>Wat gebeurt er tijdens de energiescan aan huis?</summary><p>Een adviseur van Gijs bekijkt je woning en je woningplan, neemt de bestaande situatie op (bijvoorbeeld door te meten en te kijken naar de constructie) en controleert wat technisch bij je woning past. Daarna bespreekt de adviseur met je wat een logische vervolgstap is.</p></details>
 <details className={styles.accordion}><summary>Is het 3D-model mijn echte woning?</summary><p>Nee. Het is een voorbeeldmodel van het woningtype dat je kiest. Het invullen van je adres maakt er geen digitale kopie van je huis van.</p></details>
 <details className={styles.accordion}><summary>Moet ik al weten welke maatregelen ik wil?</summary><p>Nee. Je kunt aangeven dat je hulp wilt bij het kiezen of direct contact opnemen. De digitale woningscan is geen verplichte voorbereiding.</p></details>
 {MEASURE_PAGES.map(m=><details key={m.slug} className={styles.accordion}><summary>{m.question}</summary><p>{m.answer}</p><Link href={"/maatregelen/"+m.slug}>Meer over {m.name.toLowerCase()}</Link></details>)}</section>
 <section id="subsidies"><h2>Subsidies en financiering</h2><p>Deze website geeft nog geen persoonlijke subsidie- of financieringsberekening. De digitale woningscan laat geen definitieve kosten, besparingen of aanspraak op subsidie zien.</p>
 <p>In het subsidieoverzicht van Gijs zie je per onderwerp hoe de landelijke subsidie is opgebouwd:</p>
 {SUBSIDIE_PAGINAS.map(p=><details key={p.src} className={styles.accordion}><summary>{p.titel}</summary>
  <a href={p.src} target="_blank" rel="noopener noreferrer" className="block mt-4 overflow-hidden rounded-[var(--radius-card)]"><Image src={p.src} alt={p.alt} width={1787} height={2527} sizes="(max-width: 800px) 100vw, 760px" className="w-full h-auto" /></a>
  <p className="text-sm">Tik of klik op het overzicht om het groter te bekijken.</p></details>)}
 <p><a href="/images/kennis/subsidie/Subsidieoverzicht-Gijs.pdf" target="_blank" rel="noopener noreferrer">Download het subsidieoverzicht (pdf)</a></p>
 <p>Neem je vragen mee naar het gesprek met Gijs.</p></section>
 </div><section className={styles.cta}><div><h2>Staat jouw vraag er niet bij?</h2><p>Bel of stel je vraag aan Gijs.</p></div><Link className={styles.button} href="/contact">Neem contact op →</Link></section>
 </main><Footer/></>;}
