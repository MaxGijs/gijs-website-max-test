import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Subsidiecheck } from "@/components/subsidie/Subsidiecheck";
import styles from "@/components/MeasureExplorer.module.css";

export const metadata = pageMetadata("/subsidiecheck");

// De subsidiecheck: alle regelingen voor een adres uit de Energiesubsidiewijzer van Milieu Centraal
// (lib/milieu-centraal). Geen eigen bedragen of rekenregels: de teksten komen rechtstreeks van de bron.
export default function SubsidiecheckPagina() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.overviewHero}>
          <p className={styles.eyebrow}>Subsidie</p>
          <h1>Welke subsidies gelden voor jouw woning?</h1>
          <p>
            Vul je postcode in. Je ziet direct alle subsidies, leningen en andere regelingen van je gemeente, je provincie en het Rijk, voor
            isolatie, een warmtepomp, zonnepanelen en meer. Actueel uit de Energiesubsidiewijzer van Milieu Centraal.
          </p>
        </header>
        <section>
          <Subsidiecheck />
          <p className="mt-10 text-sm text-zinc-500 max-w-3xl">
            Meer weten over hoe subsidie werkt? Lees de <Link className="underline" href="/kennis#subsidies">uitleg over subsidies en financiering</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
