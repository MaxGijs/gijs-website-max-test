import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/zo-werkt-gijs");
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddressScan from "@/components/AddressScan";
import { Badge } from "@/components/ds/core/Badge";
import { ZO_WERKT_GIJS_FASEN, JAN_JANSSEN_VOORBEELD } from "@/lib/content/zo-werkt-gijs";

export default function ZoWerktGijs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[var(--grey-050)]">
          <div className="max-w-3xl mx-auto px-6 py-[var(--section-y)] flex flex-col gap-4">
            <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-heading)] text-[var(--gijs-donkergroen)]">
              Zo werkt Gijs
            </h1>
            <p className="text-[var(--fs-400)] font-semibold text-[var(--accent-700)]">
              Samen naar een energiezuiniger huis
            </p>
            <p className="text-zinc-600 max-w-xl">
              Een woning verduurzamen begint met inzicht in de huidige situatie.
              Gijs brengt de woning in kaart en onderzoekt welke
              verduurzamingsmaatregelen bij de woning passen. Daarbij wordt
              onder andere gekeken naar de thermische schil van de woning,
              zoals het dak, de gevel, de vloer en het glas, en naar aanwezige
              installaties. Hieronder lees je de stappen die daarbij horen.
            </p>
          </div>
        </section>

        {/* De 6 fasen van de digitale woningscan tot en met de energiescan. */}
        <section className="max-w-4xl mx-auto px-6 py-[var(--section-y)]">
          <div className="flex flex-col gap-6">
            {ZO_WERKT_GIJS_FASEN.map((fase) => (
              <div key={fase.titel} className="gijs-card gijs-card--elevated flex flex-col sm:flex-row gap-5">
                <span className="shrink-0 w-12 h-12 rounded-full bg-[var(--gijs-accentgroen)] text-white font-bold flex items-center justify-center text-lg">
                  {fase.nummer}
                </span>
                <div className="flex flex-col gap-3">
                  <h2 className="font-semibold text-xl text-[var(--gijs-donkergroen)]">
                    {fase.titel}
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {fase.onderdelen.map((onderdeel) => (
                      <li key={onderdeel} className="gijs-tag">{onderdeel}</li>
                    ))}
                  </ul>
                  <p className="text-zinc-600">{fase.toelichting}</p>
                  {fase.nummer === 5 && (
                    <p className="text-sm text-zinc-500">
                      Voor de energiescan werkt Gijs samen met{" "}
                      <a href="https://energieloket-twente.nl" target="_blank" rel="noopener noreferrer" className="underline">
                        Energieloket Twente
                      </a>
                      .
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Voorbeeld: Jan Janssen is verzonnen mockdata, geen echte klant. */}
        <section className="bg-[var(--grey-050)]">
          <div className="max-w-4xl mx-auto px-6 py-[var(--section-y)] flex flex-col gap-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-[var(--fs-display-2)] font-bold text-[var(--gijs-donkergroen)]">
                Zo kan jouw woningplan eruitzien
              </h2>
              <Badge tone="neutral">Voorbeeld</Badge>
            </div>
            <p className="text-zinc-600 max-w-2xl">
              {JAN_JANSSEN_VOORBEELD.naam} is een verzonnen voorbeeld, geen
              echte klant van Gijs. Dit laat zien hoe een woningplan er na de
              digitale woningscan uit kan zien.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="gijs-card flex flex-col gap-2">
                <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Woning</p>
                <p className="font-semibold text-[var(--gijs-donkergroen)]">{JAN_JANSSEN_VOORBEELD.adres}</p>
                <p className="text-sm text-zinc-600">{JAN_JANSSEN_VOORBEELD.woningtype}</p>
              </div>
              <div className="gijs-card flex flex-col gap-2">
                <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Mijn woningplan</p>
                <ul className="flex flex-col gap-1.5 text-sm text-zinc-600">
                  {JAN_JANSSEN_VOORBEELD.woningplan.map((regel) => <li key={regel}>{regel}</li>)}
                </ul>
              </div>
              <div className="gijs-card flex flex-col gap-2">
                <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Rapport (voorbeeld)</p>
                <ul className="flex flex-col gap-1.5 text-sm text-zinc-600">
                  {JAN_JANSSEN_VOORBEELD.rapport.map((regel) => <li key={regel}>{regel}</li>)}
                </ul>
              </div>
            </div>
            {/* Aangeleverde mock-ups ("Verduurzamingsrapport mock-up.zip"): een voorbeeldweergave, geen bestaand product. */}
            <figure className="flex flex-col gap-3 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Image
                  src="/productbladen/rapport/verduurzamingsrapport-cover.jpg"
                  alt="Mock-up van de voorkant van een verduurzamingsplan van Gijs"
                  width={2400}
                  height={1601}
                  sizes="(max-width: 640px) 100vw, 440px"
                  className="w-full h-auto rounded-[var(--radius-card)]"
                />
                <Image
                  src="/productbladen/rapport/verduurzamingsrapport-inhoud.jpg"
                  alt="Mock-up van een opengeslagen isolatieplan van Gijs met een overzicht van de woning en de stappen"
                  width={2400}
                  height={1603}
                  sizes="(max-width: 640px) 100vw, 440px"
                  className="w-full h-auto rounded-[var(--radius-card)]"
                />
              </div>
              <figcaption className="text-sm text-zinc-600">
                Voorbeeldweergave (mock-up) van hoe het rapport eruit kan zien: geen losse productinformatie, maar
                een overzicht van je woning en de mogelijke vervolgstappen. De inhoud van jouw rapport hangt af van je
                woning en het gesprek met je adviseur.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Afsluitende CTA: dezelfde woningscan als de homepage */}
        <section className="bg-[var(--accent-050)]">
          <div className="max-w-xl mx-auto px-6 py-[var(--section-y)] flex flex-col items-center text-center gap-4">
            <h2 className="text-[var(--fs-display-2)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-heading)] text-[var(--gijs-donkergroen)]">
              Start met de woning
            </h2>
            <p className="text-zinc-600 mb-4">
              Ontdek wat er mogelijk is voor jouw woning.
            </p>
            <AddressScan className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-2)] p-6 w-full max-w-md" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
