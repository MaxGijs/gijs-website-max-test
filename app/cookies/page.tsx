import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/cookies");
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/components/MeasureExplorer.module.css";
import { OpenCookieInstellingenKnop } from "@/components/consent/OpenCookieInstellingenKnop";

export default function Cookies() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.overviewHero}>
          <p className={styles.eyebrow}>Vertrouwen</p>
          <h1>Cookies</h1>
          <p>
            Gijs gebruikt noodzakelijke cookies en opslag om de website, waaronder de digitale woningscan, goed te
            laten werken. Voor al het andere vraagt Gijs eerst toestemming via de cookiebanner die bij je eerste
            bezoek verschijnt.
          </p>
        </header>

        <article className={styles.article}>
          <section>
            <h2>Welke cookies gebruikt Gijs?</h2>
            <p>
              <strong>Noodzakelijk (altijd actief).</strong> Alleen opslag die aantoonbaar nodig is voor de werking
              van de website. De woningscan bewaart je antwoorden bijvoorbeeld tijdelijk in de opslag van je eigen
              browser (sessionStorage), zodat je tussen de stappen door niets kwijtraakt. Dit verlaat je browser pas
              zodra je zelf een aanvraag verstuurt.
            </p>
            <p>
              <strong>Statistieken (standaard uit).</strong> Helpen Gijs begrijpen hoe bezoekers de website
              gebruiken, bijvoorbeeld via Google Analytics 4, Microsoft Clarity of Contentsquare. Deze laden pas
              nadat je hiervoor toestemming hebt gegeven.
            </p>
            <p>
              <strong>Marketing (standaard uit).</strong> Bedoeld voor eventuele toekomstige advertentietracking.
              Hier is op dit moment niets van actief, ook niet na toestemming.
            </p>
          </section>

          <section>
            <h2>Je keuze wijzigen</h2>
            <p>
              Je kunt je voorkeuren op elk moment aanpassen of intrekken. Dit geldt voor de hele website, niet alleen
              voor deze pagina.
            </p>
            <OpenCookieInstellingenKnop />
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
