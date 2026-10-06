import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/content/contact";
import styles from "@/components/MeasureExplorer.module.css";

export type VervolgRoute = { href: string; titel: string; tekst: string };

// Gedeelde pagina voor onderdelen die volgens de Productbriefing een plek in
// de navigatie hebben, maar waarvan de definitieve inhoud nog door Gijs wordt
// aangeleverd. We vullen die niet met verzonnen tekst. Wel voorkomen we dat de
// bezoeker strandt: elke pagina wijst door naar plekken die er wel zijn en
// naar een mens die de vraag kan beantwoorden.
const STANDAARD_VERVOLG: VervolgRoute[] = [
  { href: "/maatregelen", titel: "Alle maatregelen", tekst: "Isolatie en installaties, met per maatregel uitleg over wat het voor je huis betekent." },
  { href: "/woning", titel: "Digitale woningscan", tekst: "Stel je woningplan samen als voorbereiding op een gesprek met een adviseur." },
  { href: "/contact", titel: "Contact", tekst: "Liever meteen iemand spreken? Bel of mail Gijs." },
];

export default function PlaceholderPage({
  title,
  cluster,
  intro,
  opvraagbaar = false,
  vervolg = STANDAARD_VERVOLG,
}: {
  title: string;
  cluster: string;
  intro?: string;
  /** Zet dit aan voor documenten die je nu al bij Gijs kunt opvragen. */
  opvraagbaar?: boolean;
  vervolg?: VervolgRoute[];
}) {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.overviewHero}>
          <p className={styles.eyebrow}>{cluster}</p>
          <h1>{title}</h1>
          <p>
            {intro ??
              "De definitieve inhoud van deze pagina wordt door Gijs aangeleverd. Tot die tijd zetten we hier geen tekst neer die we niet kunnen onderbouwen."}
          </p>
          {opvraagbaar && (
            <p>
              Wil je dit document nu al inzien? Vraag het op via{" "}
              <a href={"mailto:" + CONTACT.email}>{CONTACT.email}</a> of bel{" "}
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>. Je krijgt het dan per mail toegestuurd.
            </p>
          )}
        </header>

        <section className={styles.category}>
          <h2>Hoe je hier wel verder komt</h2>
          <div className={styles.cards}>
            {vervolg.map((route) => (
              <Link key={route.href} href={route.href} className={styles.card}>
                <div className={styles.cardBody}>
                  <h3>{route.titel}</h3>
                  <p>{route.tekst}</p>
                  <span>Bekijken &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <h2>Even samen naar je huis kijken?</h2>
            <p>Bespreek een gratis en vrijblijvende energiescan aan huis, ter waarde van &euro;349.</p>
          </div>
          <Link href="/contact#energiescan" className={styles.button}>Vraag een gratis energiescan aan &rarr;</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
