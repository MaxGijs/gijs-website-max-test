import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/content/contact";
import styles from "@/components/MeasureExplorer.module.css";

export const metadata: Metadata = {
  title: "Pagina niet gevonden | Gijs",
  robots: { index: false, follow: true },
};

// Zonder dit bestand toont Next zijn eigen kale 404 zonder navigatie: een
// bezoeker die op een verouderde link klikt, kan dan alleen nog terug met de
// browserknop. Deze pagina houdt hem binnen de site en biedt de vier plekken
// waar mensen na een misser naartoe willen.
const VERVOLG = [
  { href: "/", titel: "Naar de homepage", tekst: "Bekijk een voorbeeldwoning in 3D en ontdek stap voor stap wat er mogelijk is." },
  { href: "/maatregelen", titel: "Alle maatregelen", tekst: "Isolatie en installaties, met per maatregel uitleg over wat het voor je huis betekent." },
  { href: "/woning", titel: "Digitale woningscan", tekst: "Stel je woningplan samen als voorbereiding op een gesprek met een adviseur." },
  { href: "/kennis", titel: "Uitleg en vragen", tekst: "Antwoorden op de vragen die het vaakst gesteld worden over verduurzamen." },
];

export default function NietGevonden() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.overviewHero}>
          <p className={styles.eyebrow}>Pagina niet gevonden</p>
          <h1>Deze pagina bestaat niet.</h1>
          <p>
            Waarschijnlijk is de link verouderd of staat er een typefout in het adres. Hieronder
            staan de plekken waar de meeste bezoekers naartoe willen.
          </p>
        </header>
        <div className={styles.cards}>
          {VERVOLG.map((route) => (
            <Link key={route.href} href={route.href} className={styles.card}>
              <div className={styles.cardBody}>
                <h3>{route.titel}</h3>
                <p>{route.tekst}</p>
                <span>Ga verder &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
        <section className={styles.cta}>
          <div>
            <h2>Kom je er niet uit?</h2>
            <p>
              Bel <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> tussen 08:30 en 17:30, of mail{" "}
              <a href={"mailto:" + CONTACT.email}>{CONTACT.email}</a>. Dan zoeken we het samen uit.
            </p>
          </div>
          <Link href="/contact" className={styles.button}>Neem contact op &rarr;</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
