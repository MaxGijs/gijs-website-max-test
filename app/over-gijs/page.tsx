import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CONTACT } from "@/lib/content/contact";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/MeasureExplorer.module.css";
export const metadata=pageMetadata("/over-gijs");
export default function OverGijs(){return <><Header/><main className={styles.page}><header className={styles.overviewHero}><p className={styles.eyebrow}>Over Gijs</p><h1>Samen kijken wat jouw huis nodig heeft.</h1><p>Gijs helpt je mogelijkheden voor isolatie en installaties te verkennen. Jouw woning en wensen zijn het vertrekpunt voor een persoonlijk gesprek.</p></header><div className={styles.article}>
 <section><h2>Energie voor synergie</h2><p>Gijs is ontstaan vanuit één gedachte: een duurzame oplossing en een energiezuinige woning moeten haalbaar zijn, tegen een eerlijke prijs. Dat noemen we bij Gijs &ldquo;energie voor synergie&rdquo;: door samen te werken kom je verder dan alleen. Het hele team van Gijs zoekt in ieder advies naar de balans tussen mens, milieu en economie, zodat een oplossing niet alleen goed is voor je energierekening, maar ook praktisch en betaalbaar blijft.</p></section>
 <section><h2>Van eerste vraag naar advies</h2><p>Je hoeft vooraf geen maatregel of merk te kiezen. Bekijk de mogelijkheden of verzamel je wensen in de digitale woningscan. Een adviseur beoordeelt wat technisch bij jouw huis past.</p><Link href="/zo-werkt-gijs">Lees hoe Gijs werkt →</Link></section>
 <section><h2>Isolatie en installaties</h2><p>Van dak-, spouw- en vloerisolatie tot glas en kozijnen, zonnepanelen, warmtepompen, vloerverwarming en thuisbatterijen. De aanpak hangt af van de bestaande woning en wat je wilt verbeteren.</p><Link href="/maatregelen">Bekijk alle maatregelen →</Link></section>
 <section><h2>Samenwerking met Energieloket Twente</h2><p>Voor de energiescan aan huis werkt Gijs samen met <a href="https://energieloket-twente.nl" target="_blank" rel="noopener noreferrer">Energieloket Twente</a>, dat onafhankelijk energieadvies geeft aan bewoners in de regio Twente.</p></section>
 <section><h2>Contact vanuit Hengelo</h2><p>Ons kantoor is gevestigd aan {CONTACT.street}, {CONTACT.city}. Dit is geen reguliere bezoeklocatie; telefonisch of online helpen we je graag.</p><p>Bel <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> tussen 08:30 en 17:30 of mail <a href={"mailto:"+CONTACT.email}>{CONTACT.email}</a>.</p></section>
 </div><section className={styles.cta}><div><h2>Even samen naar je huis kijken?</h2><p>Bespreek een gratis en vrijblijvende energiescan aan huis, ter waarde van €350.</p></div><Link href="/contact#energiescan" className={styles.button}>Plan een gratis energiescan →</Link></section></main><Footer/></>;}
