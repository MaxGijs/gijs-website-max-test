import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EenGijs } from "@/components/over-gijs/EenGijs";
import { ReviewKaart } from "@/components/over-gijs/ReviewKaart";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { pageMetadata, SEO_INDEXABLE } from "@/lib/seo";
import { KERNWAARDEN, GIJS_HELPT_BIJ, TEAM, CIJFERBEWIJS } from "@/lib/content/over-gijs";
import styles from "./page.module.css";

export const metadata = pageMetadata("/over-gijs");

// Merkverhaal in de Apple-huisstijl van de site: één doorlopende pagina met
// grote typografie, lopende tekst, beeld, een quote en een groot cijfer, in
// plaats van rijen kaarten. Kaarten alleen waar ze functioneel zijn: de
// profielkaarten van het team. Inhoud komt uit lib/content/over-gijs.ts;
// beelden die nog ontbreken zijn dummy's of duidelijke placeholders.

function Eyebrow({ children, licht = false }: { children: string; licht?: boolean }) {
  return <p className={`text-[17px] font-semibold tracking-[-0.01em] ${licht ? "text-[var(--accent-200)]" : "text-[var(--accent-700)]"}`}>{children}</p>;
}

const ruim = "py-[var(--section-y)]";
const kop = "text-[clamp(2.25rem,1.2rem+3.6vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[var(--gijs-donkergroen)] [text-wrap:balance]";
const kopGroot = "text-[clamp(2.5rem,1.2rem+4.6vw,6rem)] font-bold leading-[1.02] tracking-[-0.045em] text-[var(--gijs-donkergroen)] [text-wrap:balance]";
const lead = "text-[clamp(20px,1.05rem+0.7vw,26px)] leading-[1.45] text-[var(--text-muted)] [text-wrap:pretty]";
const tekst = "text-[clamp(17px,1.1rem+0.2vw,20px)] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]";

export default function OverGijs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* 1. Hero */}
        <section className="bg-white">
          <div className="max-w-[var(--container-wide)] mx-auto px-6 pt-14 sm:pt-20 lg:pt-28 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
            <div>
              <Eyebrow>Over Gijs</Eyebrow>
              <h1 className="mt-5 max-w-2xl text-[clamp(2.75rem,1.2rem+5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.045em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">
                Iedereen kent wel een <span className="text-[var(--accent-600)]">Gijs</span>.
              </h1>
              <div className="mt-10 max-w-2xl flex flex-col gap-5">
                <p className={lead}>
                  Iedereen kent wel iemand die luistert. Die normaal uitlegt hoe iets zit en met je meedenkt. Iemand die
                  niet meteen iets probeert te verkopen, maar eerst wil begrijpen wat er nodig is.
                </p>
                <p className="text-[clamp(20px,1.05rem+0.7vw,26px)] font-semibold leading-[1.3] text-[var(--gijs-donkergroen)]">Dat is het idee achter Gijs.</p>
              </div>
              <a href="#verhaal" className="mt-10 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--accent-700)]">
                Lees het verhaal <Icon name="arrow-down" size="md" />
              </a>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden rounded-[var(--radius-media)] bg-[var(--surface-muted)]">
              <Image src="/images/over-gijs/hero/duurzame-wijk.png" alt="Een rij woningen met zonnepanelen aan het water" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[50%_62%]" />
            </div>
          </div>
        </section>

        {/* 2. Het verhaal van Gijs: de complexiteit en het antwoord daarop, als één hoofdstuk. */}
        <section id="verhaal" className="bg-white scroll-mt-24">
          <div className={`max-w-5xl mx-auto px-6 ${ruim} flex flex-col gap-10`}>
            <div className={`flex flex-col gap-6 ${styles.opkomen}`}>
              <Eyebrow>Het verhaal</Eyebrow>
              {/* Non-brekende spatie tussen "Tot" en "je": voorkomt dat "Tot" als wees op de
                  vorige regel achterblijft (bv. "logisch. Tot / je eraan begint."), zonder het
                  overloop-risico van de hele zin non-wrappable te maken op smalle schermen. */}
              <h2 className={kopGroot}>Verduurzamen klinkt logisch. Tot{" "}je eraan begint.</h2>
              <p className={`${lead} max-w-3xl`}>
                Maatregelen, techniek, subsidies, financiering, keuzes, verschillende aanbieders. Eerst isoleren, of
                past een warmtepomp al? Gijs brengt daar overzicht en rust in. Niet door zoveel mogelijk maatregelen te
                adviseren, maar door te kijken naar de woning, de wensen van de bewoner en hoe alles met elkaar
                samenhangt.
              </p>
            </div>
          </div>
        </section>

        {/* 3. "Een Gijs…" */}
        <section aria-labelledby="een-gijs" className="bg-white">
          <h2 id="een-gijs" className="sr-only">Een Gijs…</h2>
          <EenGijs />
        </section>

        {/* 4. De oprichter: Thom, zijn quote en 18+ jaar ervaring als één hoofdstuk. */}
        <section className="bg-[var(--gijs-donkergroen)]">
          <div className={`max-w-[var(--container-wide)] mx-auto px-6 ${ruim} flex flex-col gap-14`}>
            <div className={`grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center ${styles.opkomen}`}>
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 shrink-0 overflow-hidden rounded-full bg-white/10">
                  <Image src="/images/over-gijs/thom/thom-portret.png" alt="Thom van de Pasch, oprichter van Gijs" fill sizes="320px" className="object-cover" />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <Eyebrow licht>De oprichter</Eyebrow>
                <h2 className={`${kop} text-white`}>Thom van de Pasch heeft het Gijs-concept tot leven gebracht.</h2>
                <p className="text-[clamp(17px,1.1rem+0.2vw,20px)] leading-relaxed text-white/80 [text-wrap:pretty]">
                  Thom is ondernemer, met interesse in zowel duurzaamheid als mensen. Hij zoekt de balans tussen wensen
                  en oplossingen, tussen wat iemand nodig heeft en welke maatregel daarbij past, en tussen mensen en
                  techniek.
                </p>
                <p className="text-[clamp(17px,1.1rem+0.2vw,20px)] leading-relaxed text-white/80 [text-wrap:pretty]">
                  Vanuit die gedachte is Gijs ontstaan: geen bedrijf dat zoveel mogelijk maatregelen wil verkopen, maar
                  een plek waar goed advies voorop staat. Met als doel steeds meer duurzame woningen, straat voor straat.
                </p>
                <p className="text-[clamp(17px,1.1rem+0.2vw,20px)] leading-relaxed text-white/80 [text-wrap:pretty]">
                  Die naam is niet toevallig gekozen: Gijs is het gezicht van Groen in je straat, het bedrijf achter
                  deze aanpak.
                </p>
              </div>
            </div>
            <div className={`grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-center border-t border-white/15 pt-12 ${styles.opkomen}`}>
              <figure className="flex flex-col gap-5">
                <blockquote>
                  <p className="text-[clamp(2.5rem,1rem+5vw,5.5rem)] font-bold leading-[1] tracking-[-0.04em] text-white [text-wrap:balance]">&ldquo;Energie voor Synergie&rdquo;</p>
                </blockquote>
                <figcaption className="text-[16px] font-semibold text-[var(--accent-200)]">Thom van de Pasch, oprichter van Gijs</figcaption>
                <p className="max-w-lg text-[17px] leading-relaxed text-white/75">
                  Losse onderdelen worden sterker wanneer ze goed op elkaar aansluiten. Wie wensen, techniek en kennis
                  samen bekijkt, komt verder dan met losse maatregelen.
                </p>
              </figure>
              <div className="flex flex-col gap-2 md:border-l md:border-white/15 md:pl-12">
                <span className="text-[clamp(4rem,2rem+6vw,7rem)] font-bold leading-[0.85] tracking-[-0.05em] text-white">{CIJFERBEWIJS.ervaringJaren}+</span>
                <span className="text-[19px] font-bold text-white">jaar ervaring</span>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70 max-w-[28ch]">
                  Persoonlijk betekent bij Gijs niet dat deskundigheid minder belangrijk is. Beide horen erbij.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Deskundigheid, kernwaarden, missie en visie als één redactioneel hoofdstuk. */}
        <section className="bg-[var(--grey-050)]">
          <div className={`max-w-[var(--container-wide)] mx-auto px-6 ${ruim} flex flex-col gap-12`}>
            <div className={`flex flex-col gap-5 max-w-3xl ${styles.opkomen}`}>
              <Eyebrow>Deskundigheid en vertrouwen</Eyebrow>
              <h2 className={kop}>Gijs kijkt naar je hele woning, niet naar één product.</h2>
            </div>
            <dl className={`flex flex-col border-y border-[var(--border-default)] ${styles.opkomen}`}>
              {[
                { term: "Je woning als geheel", uitleg: "Isolatie en installaties hangen samen. Daarom kijkt Gijs eerst naar jouw woning en situatie, en pas daarna naar de maatregel." },
                { term: "Subsidie en financiering", uitleg: "Die kunnen onderdeel zijn van het advies, van eerste gesprek tot uitvoering." },
                { term: "Niet altijd ja", uitleg: "Niet iedere maatregel past bij iedere woning. Wat voor de buren slim is, hoeft dat voor jou niet te zijn." },
              ].map(rij => (
                <div key={rij.term} className="grid md:grid-cols-[1fr_2fr] gap-3 md:gap-12 py-6 border-b border-[var(--border-default)] last:border-b-0">
                  <dt className="text-[clamp(19px,1rem+0.4vw,24px)] font-semibold tracking-[-0.02em] text-[var(--gijs-donkergroen)]">{rij.term}</dt>
                  <dd className={tekst}>{rij.uitleg}</dd>
                </div>
              ))}
            </dl>
            <p className={`${lead} max-w-3xl ${styles.opkomen}`}>Gijs helpt bij {GIJS_HELPT_BIJ}.</p>
            <ul className={`grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 ${styles.opkomen}`}>
              {KERNWAARDEN.map(w => (
                <li key={w.woord} className="flex flex-col gap-2 border-t-2 border-[var(--gijs-donkergroen)] pt-4">
                  <p className="text-[clamp(1.25rem,0.8rem+1vw,1.75rem)] font-bold tracking-[-0.03em] text-[var(--gijs-donkergroen)]">{w.woord}</p>
                  <p className="text-[14px] leading-snug text-[var(--text-muted)]">{w.tekst}</p>
                </li>
              ))}
            </ul>
            <div className={`grid sm:grid-cols-2 gap-x-12 gap-y-8 pt-8 border-t border-[var(--border-default)] ${styles.opkomen}`}>
              <div className="flex flex-col gap-2">
                <Eyebrow>Onze missie</Eyebrow>
                <p className={tekst}>
                  Verduurzamen begrijpelijk, eerlijk en persoonlijk maken. Niet door naar losse maatregelen te kijken,
                  maar naar de woning en de situatie als geheel. Niet iedere maatregel hoeft uitgevoerd te worden; als
                  iets niet interessant is, hoort de bewoner dat ook.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Eyebrow>Onze visie</Eyebrow>
                <p className={tekst}>
                  Iedere woningeigenaar moet kunnen begrijpen welke stappen logisch zijn voor de eigen woning. Gijs
                  brengt woninginformatie, deskundigheid en persoonlijke begeleiding samen in één begrijpelijke
                  klantreis.
                </p>
              </div>
            </div>
            <Link href="/zo-werkt-gijs" className="self-start inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--accent-700)]">
              Lees hoe Gijs werkt <Icon name="arrow-right" size="md" />
            </Link>
          </div>
        </section>

        {/* 6. Ervaringen en team: vertrouwen door reviews en de mensen erachter, in één hoofdstuk. */}
        <section className="bg-white">
          <div className={`max-w-[var(--container-wide)] mx-auto px-6 ${ruim} flex flex-col gap-14`}>
            <div className="max-w-4xl flex flex-col gap-8">
              <div className={`flex flex-col gap-4 ${styles.opkomen}`}>
                <Eyebrow>Ervaringen</Eyebrow>
                <h2 className={kop}>Wat bewoners over Gijs zeggen</h2>
              </div>
              <div className={styles.opkomen}>
                <ReviewKaart groot toonPlaceholder={!SEO_INDEXABLE} />
              </div>
            </div>
            <div className={`flex flex-col gap-10 pt-10 border-t border-[var(--border-default)] ${styles.opkomen}`}>
              <div className="flex flex-col gap-4">
                <Eyebrow>Het team</Eyebrow>
                <h2 className={kop}>De mensen achter Gijs</h2>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {TEAM.map((lid, i) => (
                  <li key={lid.naam ?? i} className="flex flex-col items-center text-center gap-4">
                    {lid.foto ? (
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-full bg-[var(--grey-050)]">
                        <Image src={lid.foto} alt={lid.naam ?? ""} fill sizes="128px" className="object-cover" style={{ objectPosition: lid.fotoPositie }} />
                      </div>
                    ) : (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center rounded-full bg-[var(--grey-050)] text-[var(--text-muted)]">
                        <Icon name="user-round" size="lg" aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <p className={`font-semibold text-[17px] tracking-[-0.02em] ${lid.naam ? "text-[var(--gijs-donkergroen)]" : "text-[var(--text-muted)]"}`}>{lid.naam ?? "Naam volgt"}</p>
                      <p className={`text-[14px] ${lid.functie ? "font-semibold text-[var(--accent-700)]" : "text-[var(--text-muted)]"}`}>{lid.functie ?? "Functie volgt"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7. Afsluiting */}
        <section className="bg-white">
          <div className={`max-w-5xl mx-auto px-6 py-[clamp(6rem,14vw,12rem)] flex flex-col items-start gap-10 ${styles.opkomen}`}>
            <h2 className={kopGroot}>Benieuwd wat logisch is voor jouw woning?</h2>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href="/woning" variant="primary" size="lg" iconRight="arrow-right">Start de woningscan</Button>
              <Link href="/contact" className="inline-flex min-h-11 items-center font-semibold text-[var(--accent-700)] underline underline-offset-4">Neem contact op</Link>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-[var(--text-muted)]">
              Gijs helpt woningeigenaren door heel Nederland. Bij grotere afstand kan een eerste gesprek ook online plaatsvinden.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
