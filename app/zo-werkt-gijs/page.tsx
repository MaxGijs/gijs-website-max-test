import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/zo-werkt-gijs");
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddressScan from "@/components/AddressScan";
import Link from "next/link";
import { Button } from "@/components/ds/core/Button";
import { Badge } from "@/components/ds/core/Badge";
import { HOOFDSTUKKEN, DIGITAAL_PERSOONLIJK, EN_DAARNA, JAN_JANSSEN_VOORBEELD } from "@/lib/content/zo-werkt-gijs";
import styles from "./page.module.css";

// Eén doorlopende klantreis rond dezelfde (fictieve) voorbeeldwoning van Jan
// Janssen, in plaats van vijf losse proceskaarten. Elk hoofdstuk toont
// hetzelfde woningdossier, steeds een stap completer — zie WoningdossierLijst
// hieronder. Stijl volgt dezelfde grammatica als /over-gijs (Eyebrow, kop/
// kopGroot/lead/tekst, ruime secties, rustig opkomen bij scrollen).

function Eyebrow({ children }: { children: string }) {
  return <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">{children}</p>;
}

const ruim = "py-[var(--section-y)]";
const kop = "text-[clamp(2.25rem,1.2rem+3.6vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[var(--gijs-donkergroen)] [text-wrap:balance]";
const kopGroot = "text-[clamp(2.5rem,1.2rem+4.6vw,6rem)] font-bold leading-[1.02] tracking-[-0.045em] text-[var(--gijs-donkergroen)] [text-wrap:balance]";
const lead = "text-[clamp(20px,1.05rem+0.7vw,26px)] leading-[1.45] text-[var(--text-muted)] [text-wrap:pretty]";
const tekst = "text-[clamp(17px,1.1rem+0.2vw,20px)] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]";

type DossierVeld = { label: string; waarde: string; nadruk?: boolean };

// Hetzelfde voorbeeld-woningdossier (Jan Janssen, zie lib/content/zo-werkt-gijs.ts)
// komt terug in elk hoofdstuk en wordt per hoofdstuk een stap completer. Een
// rustige lijst in plaats van een kaart, want dit is illustratief, geen
// losstaande functionele eenheid.
function WoningdossierLijst({ velden, titel = "Voorbeeld woningdossier" }: { velden: DossierVeld[]; titel?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-[var(--radius-media)] bg-white p-6 sm:p-8 shadow-[var(--shadow-2)]">
      <div className="flex items-center justify-between gap-3 pb-4 mb-1 border-b border-[var(--border-default)]">
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">{titel}</p>
        <Badge tone="neutral">Voorbeeld</Badge>
      </div>
      <dl className="flex flex-col">
        {velden.map(v => (
          <div key={v.label} className="flex items-baseline justify-between gap-4 py-2.5 border-b border-[var(--border-default)] last:border-b-0">
            <dt className="text-[14px] text-[var(--text-muted)]">{v.label}</dt>
            <dd className={`text-[15px] text-right ${v.nadruk ? "font-semibold text-[var(--gijs-donkergroen)]" : "text-[var(--gijs-donkergroen)]"}`}>{v.waarde}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ZoWerktGijs() {
  const [ch1, ch2, ch3, ch4, ch5] = HOOFDSTUKKEN;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero: geen drie voordeelkaarten, alleen de kernboodschap en de echte scan-CTA. */}
        <section className="bg-white">
          <div className="max-w-[var(--container-wide)] mx-auto px-6 pt-14 sm:pt-20 lg:pt-28 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
            <div>
              <Eyebrow>Zo werkt Gijs</Eyebrow>
              <h1 className="mt-5 max-w-2xl text-[clamp(2.75rem,1.2rem+5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.045em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">
                Begin bij je woning, niet bij een product.
              </h1>
              <div className="mt-8 max-w-xl flex flex-col gap-4">
                <p className={lead}>
                  Ontdek eerst wat er al bekend is over je woning, vul aan wat nodig is en bekijk welke stappen
                  logisch kunnen zijn. Daarna kijkt Gijs persoonlijk met je mee.
                </p>
                <p className={tekst}>
                  Je hebt hiervoor geen naam, telefoonnummer of e-mailadres nodig. Dat vraagt Gijs pas op het moment
                  dat je je plan daadwerkelijk verstuurt.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-[var(--surface-muted)]">
                <Image
                  src="/images/zo-werkt-gijs/zo_werkt_gijs_hero.jpeg"
                  alt="Twee bewoners bekijken samen hun woning vanaf de stoep"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <AddressScan className="bg-[var(--grey-050)] rounded-[var(--radius-media)] p-6 sm:p-8 w-full" />
            </div>
          </div>
        </section>

        {/* 1. Eerst je woning */}
        <section className={`bg-white ${ruim}`}>
          <div className="max-w-[var(--container-wide)] mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className={`flex flex-col gap-6 ${styles.opkomen}`}>
              <div>
                <Eyebrow>{ch1.titel}</Eyebrow>
                <h2 className={`mt-3 ${kop}`}>{ch1.kop}</h2>
              </div>
              <p className={tekst}>{ch1.tekst}</p>
            </div>
            <div className={`flex flex-col gap-6 ${styles.opkomen}`}>
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius-media)] bg-[var(--surface-muted)]">
                {/* Uitgesneden op het rechterdeel van de foto: het linkerdeel van het origineel
                    toont een verzonnen "Gijs"-tuinbord dat niet bestaat (geen echt beeldmateriaal
                    of marketingmateriaal) en dus niet gesuggereerd mag worden. */}
                <Image src="/images/zo-werkt-gijs/woning/hero-verduurzaamd-huis.png" alt="Een bewoner bekijkt met zijn kind op de arm zijn woning met zonnepanelen" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[100%_50%]" />
              </div>
              <WoningdossierLijst
                velden={[
                  { label: "Adres", waarde: JAN_JANSSEN_VOORBEELD.adres, nadruk: true },
                  { label: "Woningtype", waarde: JAN_JANSSEN_VOORBEELD.woningtype },
                  { label: "Bouwjaar", waarde: "automatisch gevonden" },
                  { label: "Woonoppervlakte", waarde: "automatisch gevonden" },
                  { label: "Energielabel", waarde: "indien beschikbaar" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* 2. Maak het beeld completer */}
        <section className={`bg-[var(--grey-050)] ${ruim}`}>
          <div className="max-w-[var(--container-wide)] mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className={`order-2 lg:order-1 ${styles.opkomen}`}>
              <WoningdossierLijst
                velden={[
                  { label: "Adres", waarde: JAN_JANSSEN_VOORBEELD.adres, nadruk: true },
                  { label: "Woningtype", waarde: JAN_JANSSEN_VOORBEELD.woningtype },
                  { label: "Bouwjaar", waarde: "automatisch gevonden" },
                  { label: "Huidige dakisolatie", waarde: "Ik weet het niet" },
                  { label: "Wensen", waarde: "Comfort en lagere energiekosten" },
                ]}
              />
            </div>
            <div className={`order-1 lg:order-2 flex flex-col gap-6 ${styles.opkomen}`}>
              <div>
                <Eyebrow>{ch2.titel}</Eyebrow>
                <h2 className={`mt-3 ${kop}`}>{ch2.kop}</h2>
              </div>
              <p className={tekst}>{ch2.tekst}</p>
            </div>
          </div>
        </section>

        {/* 3. Jouw woningplan: relevante maatregelen, geen rekenmotor en geen verzonnen bedragen. */}
        <section className={`bg-white ${ruim}`}>
          <div className="max-w-[var(--container-wide)] mx-auto px-6 flex flex-col gap-10">
            <div className={`max-w-3xl flex flex-col gap-6 ${styles.opkomen}`}>
              <div>
                <Eyebrow>{ch3.titel}</Eyebrow>
                <h2 className={`mt-3 ${kop}`}>{ch3.kop}</h2>
              </div>
              <p className={tekst}>{ch3.tekst}</p>
            </div>
            {/* De twee categorieën zoals ze ook elders op de site staan (zie lib/content/measure-pages.ts:
                category "isolatie" / "installaties"), niet een losse greep losse maatregelfoto's. */}
            <ul className={`grid sm:grid-cols-2 gap-px bg-[var(--border-default)] rounded-[var(--radius-media)] overflow-hidden ${styles.opkomen}`}>
              {[
                { naam: "Isolaties", href: "/maatregelen#isolatie", beeld: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-aanbrengen-gijs.png", voorbeelden: "Dakisolatie, spouwisolatie, vloerisolatie, isolatieglas en kozijnen" },
                { naam: "Installaties", href: "/maatregelen#installaties", beeld: "/images/maatregelen/warmtepomp/warmtepomp-hero.png", voorbeelden: "Warmtepomp, zonnepanelen, vloerverwarming en een thuisbatterij" },
              ].map(m => (
                <li key={m.naam} className="bg-white flex flex-col">
                  <Link href={m.href} className="group flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={m.beeld} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="p-6 flex flex-col gap-1.5">
                      <p className="font-semibold text-[19px] tracking-[-0.01em] text-[var(--gijs-donkergroen)] group-hover:underline">{m.naam}</p>
                      <p className="text-[14px] text-[var(--text-muted)]">{m.voorbeelden}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <p className={`max-w-2xl ${tekst} ${styles.opkomen}`}>
              Geschat oppervlak, indicatieve investering, indicatieve subsidie en een indicatief netto bedrag
              verschijnen per maatregel zodra daar voldoende gegevens voor bekend zijn. Staat jouw onderwerp er niet
              tussen? Ook dan kun je verder: er is altijd ruimte om aan te geven dat je iets anders wilt bespreken met
              Gijs.
            </p>
          </div>
        </section>

        {/* Editorial: digitaal vs persoonlijk, geen twee kaarten maar grote typografie + lijst. */}
        <section className={`bg-[var(--gijs-donkergroen)] ${ruim}`}>
          <div className="max-w-[var(--container-wide)] mx-auto px-6 grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
            <h2 className={`${kopGroot} text-white ${styles.opkomen}`}>
              <span>{DIGITAAL_PERSOONLIJK.kop}</span>
            </h2>
            <div className={`flex flex-col gap-10 ${styles.opkomen}`}>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                <div className="flex flex-col gap-3">
                  <p className="text-[15px] font-semibold text-[var(--accent-200)]">Online helpt bij</p>
                  <ul className="flex flex-col gap-2">
                    {DIGITAAL_PERSOONLIJK.digitaal.map(d => (
                      <li key={d} className="text-[17px] text-white/85 border-t border-white/15 pt-2 first:border-t-0 first:pt-0">{d}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-[15px] font-semibold text-[var(--accent-200)]">Gijs helpt persoonlijk bij</p>
                  <ul className="flex flex-col gap-2">
                    {DIGITAAL_PERSOONLIJK.persoonlijk.map(p => (
                      <li key={p} className="text-[17px] text-white/85 border-t border-white/15 pt-2 first:border-t-0 first:pt-0">{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-white/70 max-w-md">{DIGITAAL_PERSOONLIJK.tekst}</p>
            </div>
          </div>
        </section>

        {/* 4. Stuur je plan naar Gijs: bestaande, echte flow (zie lib/woningdossier.ts), in klanttaal. */}
        <section className={`bg-[var(--grey-050)] ${ruim}`}>
          <div className="max-w-[var(--container-wide)] mx-auto px-6 flex flex-col gap-10">
            <div className={`max-w-3xl flex flex-col gap-6 ${styles.opkomen}`}>
              <div>
                <Eyebrow>{ch4.titel}</Eyebrow>
                <h2 className={`mt-3 ${kop}`}>{ch4.kop}</h2>
              </div>
              <p className={tekst}>{ch4.tekst}</p>
            </div>
            <div className={`grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start ${styles.opkomen}`}>
              <dl className="flex flex-col border-y border-[var(--border-default)]">
                {[
                  { term: "Woning", punten: [`${JAN_JANSSEN_VOORBEELD.adres} · ${JAN_JANSSEN_VOORBEELD.woningtype}`] },
                  { term: "Mijn woningplan", punten: JAN_JANSSEN_VOORBEELD.woningplan },
                  { term: "Rapport (voorbeeld)", punten: JAN_JANSSEN_VOORBEELD.rapport },
                ].map(rij => (
                  <div key={rij.term} className="grid sm:grid-cols-[1fr_2fr] gap-2 sm:gap-8 py-5 border-b border-[var(--border-default)] last:border-b-0">
                    <dt className="font-semibold text-[16px] text-[var(--gijs-donkergroen)]">{rij.term}</dt>
                    <dd className="text-[15px] leading-relaxed text-[var(--text-muted)]">
                      {rij.punten.length > 1 ? (
                        <ul className="flex flex-col gap-1 list-disc pl-4 marker:text-[var(--grey-200)]">
                          {rij.punten.map(p => <li key={p}>{p}</li>)}
                        </ul>
                      ) : rij.punten[0]}
                    </dd>
                  </div>
                ))}
              </dl>
              <figure className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-4">
                  <Image
                    src="/images/zo-werkt-gijs/proces/verduurzamingsrapport-cover.jpg"
                    alt="Mock-up van de voorkant van een verduurzamingsplan van Gijs"
                    width={2400}
                    height={1601}
                    sizes="(max-width: 640px) 50vw, 260px"
                    className="w-full h-auto rounded-[var(--radius-card)]"
                  />
                  <Image
                    src="/images/zo-werkt-gijs/proces/verduurzamingsrapport-inhoud.jpg"
                    alt="Mock-up van een opengeslagen isolatieplan van Gijs met een overzicht van de woning en de stappen"
                    width={2400}
                    height={1603}
                    sizes="(max-width: 640px) 50vw, 260px"
                    className="w-full h-auto rounded-[var(--radius-card)]"
                  />
                </div>
                <figcaption className="text-[13px] text-[var(--text-muted)]">
                  Voorbeeldweergave (mock-up): geen losse productinformatie, maar een overzicht van je woning en de
                  mogelijke vervolgstappen.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 5. Gijs kijkt mee */}
        <section className={`bg-white ${ruim}`}>
          <div className="max-w-3xl mx-auto px-6 flex flex-col gap-6">
            <div className={styles.opkomen}>
              <Eyebrow>{ch5.titel}</Eyebrow>
              <h2 className={`mt-3 ${kop}`}>{ch5.kop}</h2>
            </div>
            <p className={`${tekst} ${styles.opkomen}`}>{ch5.tekst}</p>
            <p className={`text-[15px] text-[var(--text-muted)] ${styles.opkomen}`}>
              Voor de energiescan werkt Gijs samen met{" "}
              <a href="https://energieloket-twente.nl" target="_blank" rel="noopener noreferrer" className="underline">
                Energieloket Twente
              </a>
              .
            </p>
          </div>
        </section>

        {/* Afsluiting: kort, geen nieuwe zesde processtap. */}
        <section className="bg-white">
          <div className={`max-w-3xl mx-auto px-6 py-[clamp(5rem,12vw,10rem)] flex flex-col items-start gap-8 ${styles.opkomen}`}>
            <p className={tekst}>{EN_DAARNA}</p>
            <h2 className={kopGroot}>Ontdek wat logisch is voor jouw woning.</h2>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href="/woning" variant="accent" size="lg" iconRight="arrow-right">Start de woningscan</Button>
              <Link href="/contact" className="inline-flex min-h-11 items-center font-semibold text-[var(--accent-700)] underline underline-offset-4">Neem contact op</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
