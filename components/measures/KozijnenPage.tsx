import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { HR_ISOFRAME_TIERS, KUNSTSTOF_PROFIELEN, SCHUIFPUI_PROFIELEN } from "@/lib/content/kozijnen-producten";
import { CONTACT } from "@/lib/content/contact";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { MeasureHero } from "@/components/measures/MeasureHero";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { MaterialCard } from "@/components/measures/MaterialCard";
import { UitvoeringStappen } from "@/components/measures/UitvoeringStappen";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Kozijnenpagina, opgebouwd in dezelfde stijl als de andere
// maatregelpagina's (MeasureHero/MeasureSectionNav/Card/Button/Icon/
// FAQAccordion), maar met een iets andere inhoudelijke indeling — de
// bron leent zich niet voor exact dezelfde opzet als isolatieglas.
//
// Bron: HR IsoFrame.zip (aangeleverd door Gijs). Inventarisatie en
// gebruikte/afgewezen bestanden staan in het eindverslag van deze
// wijziging. Kernbronnen:
// - "HR IsoFrame Producten.pdf": de drie HR IsoFrame-niveaus (Basic/
//   Standard/Comfort), zie lib/content/kozijnen-producten.ts.
// - "Kozijnprofielen EVP.docx": algemene uitleg kunststof vs. aluminium,
//   kunststof profielvergelijking (70/85/120 mm) en
//   hefschuifpui-profielvergelijking (Comfort/Premium).
// - "Aluminium/ulotka_MB-79N_NL.pdf" (Aluprof): technische gegevens van
//   het MB-79N raam-deursysteem.
// - Referentiefoto's (Referenties/1, /2, /4, /6 en /3. Delfzijl) en
//   productrenders (Schuifpui/Kiepschuif_a.jpg,
//   Schuifpui/Deuren/HR IsoDoor_1_0.jpg — beide generieke
//   fabrikant-renders, geen eigen Gijs-installatiefoto's).
//
// NIET gebruikt: Fabriekanten.png bevat contactgegevens van andere,
// niet-gerelateerde kozijnbedrijven (geen Gijs-leveranciers) en is
// daarom weggelaten. De "Kozijn samenstelling tekeningen"-map (34 kleine
// profiel-iconen) is te technisch/granulair voor een consumentenpagina
// en is niet gebruikt. Er is geen bron voor een volledig 6-stappen
// uitvoeringsproces voor kozijnen (in tegenstelling tot isolatieglas) —
// zie de eenvoudiger 4-stappen aanpak hieronder.
//
// Deuren en schuifpuien gebruiken de aangeleverde bestanden
// draaikiep.png en schuifpui.png (Productbladen).
//
// Technische tabellen (HR IsoFrame-vergelijking, kunststof profielen,
// aluminium, schuifpui-profielen) staan bewust achter een inklapbaar
// "Bekijk technische gegevens"-blok — de zichtbare kaarten tonen alleen
// naam + korte uitleg + max. 3 kernkenmerken, geen grote productfoto's.
//
// Let op: "Kozijnprofielen EVP.docx" noemt het merk Aluplast voor de
// kunststof profielen (70/85/120 mm, Uf-waarden) — Gijs geeft aan zelf
// met GEALAN te werken. Omdat er geen GEALAN-specificatiedocument is
// aangeleverd om te bevestigen dat dezelfde cijfers gelden, wordt op de
// pagina bewust GEEN merknaam genoemd bij de kunststof profielen (niet
// Aluplast, niet GEALAN) — alleen de onderliggende technische gegevens.
//
// "Waarom kiest Gijs voor dit kozijnprofiel?" toont een vergelijking
// tussen een Schüco-profiel (dat Gijs niet gebruikt) en het Gijs-profiel.
// De claims in dit beeld (waterdicht, geïsoleerd profiel, aantal
// afdichtingen) waren niet te verifiëren tegen de aangeleverde HR
// IsoFrame-documenten — expliciet geverifieerd en bevestigd door de
// eigenaar (tevens vakexpert) van Gijs, waarna de afbeelding alsnog is
// gebruikt. Oorspronkelijk als één gecombineerd beeld (verschillen.png,
// nog aanwezig maar niet meer ingeladen); op verzoek vervangen door twee
// losse, scherpere crops naast elkaar (verschillen-ander-profiel.png en
// verschillen-gijs-profiel.png) — zelfde inhoud, beter leesbaar.
//
// BEWUST NIET TOEGEVOEGD (zie eindverslag):
// - Geen "Wat zijn kozijnen?"-sectie met kozijn_voorbeeld_uitleg: dat
//   bestand staat niet in Productbladen (ook niet onder alternatieve
//   bestandsnamen aangetroffen).
//
// KLANTPERSPECTIEF-RONDE: de intro opende voorheen met productinformatie
// ("Gijs plaatst kunststof en aluminium kozijnen...") vóór enig klant-
// voordeel. Er is nu eerst een voordeelzin toegevoegd (hergebruikt uit de
// al goedgekeurde measure-intro.ts: "beter isolerend en dichter kozijn",
// "tocht of kou bij het kozijn"). De Afdichting/Geïsoleerd
// profiel-vergelijking noemde alleen de techniek (7 vs. 5 afdichtingen,
// wel/niet geïsoleerd) zonder te zeggen wat een bewoner daarvan merkt —
// nu aangevuld met de directe, logische praktische consequentie (minder
// tocht/vocht, warmte beter binnen), zonder de brongegevens zelf aan te
// passen.
// UITVOERINGSVISUAL — PROCES V2: de eerdere set losse SVG's is volledig
// vervangen door de definitieve "proces v2"-set (submap "kozijn"): elk
// bestand bevat nu icoon + nummerbadge + titel + een korte uitlegzin.
// Nog steeds bewust maar 4 stappen (geen hergebruik van de generieke
// 6-stappen-set, geen kunstmatige aanvulling — de bron heeft er echt maar
// 4, zie ook de toelichting hierboven "geen bron voor een volledig
// 6-stappen uitvoeringsproces voor kozijnen"). Alle 4 bestanden zijn
// hernoemd naar kozijnen-stap-1.svg t/m -stap-4.svg; de vorige bestanden
// (stap-1/2/3/4-kozijnen.svg) zijn verwijderd. Titels ongewijzigd
// overgenomen: "Inmeten ramen", "Uitleg en keuze", "Plaatsing",
// "Oplevering".
const UITVOERING_STAPPEN = [
  { bestand: "maatregelen/kozijnen/proces/kozijnen-stap-1.svg", label: "Inmeten ramen" },
  { bestand: "maatregelen/kozijnen/proces/kozijnen-stap-2.svg", label: "Uitleg en keuze" },
  { bestand: "maatregelen/kozijnen/proces/kozijnen-stap-3.svg", label: "Plaatsing" },
  { bestand: "maatregelen/kozijnen/proces/kozijnen-stap-4.svg", label: "Oplevering" },
];

export function KozijnenPage({ item }: { item: MeasurePageItem }) {
  const title = "Kozijnen";
  const sections = [
    { id: "wat-zijn-het", label: "Wat is het?" },
    { id: "kozijnprofiel", label: "Ons kozijnprofiel" },
    { id: "producten", label: "Producten" },
    { id: "referenties", label: "Referenties" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  // FAQ herzien (zie eindverslag): vier vragen verwijderd wegens dubbeling
  // met een bestaande sectie zonder verdieping — "Welke kozijnen zijn
  // mogelijk?" (dubbel met de Producten-sectie-intro), "Welke
  // profielsystemen gebruikt Gijs?" (dubbel met de technische tabellen
  // onder "Bekijk technische gegevens"), "Kan glas samen met kozijnen
  // worden vervangen?" (woordelijk dezelfde vraag/antwoord als de
  // dynamische item.question hieronder — dubbele vraag binnen dezelfde
  // FAQ) en "Welke referenties zijn beschikbaar?" (geen echte klantvraag,
  // herhaalt alleen de sectietitel eronder). Twee nieuwe vragen
  // toegevoegd, beide sourced uit de bestaande introtekst hierboven maar
  // daar nooit als aparte vraag uitgelicht: de profielkeuze-per-toepassing
  // en de kleurmogelijkheden (RAL/houtlook).
  const faqItems: FAQItem[] = [
    { question: "Gebruik ik voor elk kozijn hetzelfde profiel?", answer: "Niet per se. Een raam, deur of schuifpui kan elk een eigen profiel gebruiken, afhankelijk van de toepassing." },
    { question: "In welke kleuren zijn kozijnen leverbaar?", answer: "Kunststof en aluminium kozijnen zijn leverbaar in alle RAL-kleuren of in houtlook." },
    { question: "Hoe wordt een kozijn ingemeten?", answer: "De ramen worden ingemeten, zodat het nieuwe kozijn op maat gemaakt kan worden." },
    { question: "Waarom geen houten kozijnen?", answer: "Gijs plaatst kunststof en aluminium kozijnen, geen houten kozijnen. Wil je wel de uitstraling van hout? Beide zijn ook leverbaar in houtlook." },
    { question: item.question, answer: item.answer },
  ];

  const startScanHref = "/woning?maatregel=" + item.id;

  return (
    <main className="mx-auto px-6" style={{ maxWidth: "var(--container-wide)", paddingBottom: "var(--section-y)" }}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", url: "/" },
          { name: "Maatregelen", url: "/maatregelen" },
          { name: title, url: "/maatregelen/" + item.slug },
        ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: SITE_URL + crumb.url })),
      }} />

      <nav aria-label="Broodkruimel" className="flex flex-wrap gap-2 text-sm py-6">
        <Link href="/" className="underline underline-offset-2">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/maatregelen" className="underline underline-offset-2">Maatregelen</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{title}</span>
      </nav>

      <MeasureHero
        label="Maatregel"
        title={title}
        subtitle="Kunststof en aluminium kozijnen"
        intro="Gijs plaatst kunststof en aluminium kozijnen, inclusief deuren en schuifpuien. Hieronder lees je welke profielen en producten er zijn en hoe de plaatsing verloopt."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Vraag een gratis energiescan aan", href: "/contact#energiescan" }}
        image="/images/maatregelen/kozijnen/kozijnen-hero.jpg"
        imageAlt="Nieuw geplaatst kozijn met raam en voordeur"
      />

      <div>
        <MeasureSectionNav sections={sections} />

        <section id="wat-zijn-het" className="scroll-mt-40 mt-12 mb-14">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat zijn goede kozijnen?</h2>
            <p className="text-lg font-medium text-[var(--gijs-donkergroen)]">
              Goede kozijnen houden kou en tocht beter buiten.
            </p>
            <p className="text-zinc-600">
              Het kozijn is de omlijsting rond glas en deur. Een goed kozijn sluit beter af en isoleert beter,
              waardoor je minder tocht en kou bij het raam of de deur ervaart. De profielen van deze kozijnen zijn
              verkrijgbaar in kunststof en aluminium.
            </p>
            <p className="text-zinc-600">
              Kunststof kozijnen zijn iets goedkoper en verkrijgbaar in 70, 85 en 120 mm dikte; aluminium kozijnen
              zijn er in 60 en 86 mm. Beide zijn leverbaar in alle RAL-kleuren of in houtlook. De profielkeuze is
              belangrijk: verschillende toepassingen (een raam, een deur of een schuifpui) kunnen elk een eigen
              profiel gebruiken.
            </p>
            <p className="text-zinc-600">
              Daar hoef je zelf niet technisch uit te komen. Tijdens een energiescan aan huis bekijkt een expert van
              Gijs je bestaande ramen en kozijnen, en bespreekt welk profiel en welke uitvoering passen.
            </p>
          </div>

          <Card variant="tint" className="mt-8 flex flex-col md:flex-row md:items-center gap-6 !p-8">
            <div className="md:flex-1 flex flex-col gap-1">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Welke kozijnen passen bij mijn woning?</h3>
              <p className="text-sm text-zinc-600">Tijdens de energiescan wordt bekeken welk profiel en welke uitvoering passen.</p>
            </div>
            <ul className="md:flex-[1.6] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Kunststof is goedkoper en beter bestand tegen zilte lucht</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Aluminium is lichter en geschikter voor grote constructies</span>
              </li>
            </ul>
            <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
          </Card>
        </section>

        <section id="kozijnprofiel" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Waarom kiest Gijs voor dit kozijnprofiel?</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">
            Niet ieder kunststof kozijnprofiel is hetzelfde. Onderstaande vergelijking laat zien waarom Gijs voor
            dit profiel kiest.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] aspect-[8/5] flex items-center justify-center">
                <Image
                  src="/images/maatregelen/kozijnen/verschillen-ander-profiel.png"
                  alt="Doorsnede van een ander kunststof kozijnprofiel: niet waterdicht, geen geïsoleerd profiel, 5 afdichtingen"
                  width={862}
                  height={459}
                  quality={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2 text-center">Ander kunststof profiel</p>
            </div>
            <div>
              <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] aspect-[8/5] flex items-center justify-center">
                <Image
                  src="/images/maatregelen/kozijnen/verschillen-gijs-profiel.png"
                  alt="Doorsnede van het kozijnprofiel van Gijs: waterdicht, geïsoleerd profiel, 7 afdichtingen"
                  width={955}
                  height={594}
                  quality={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2 text-center">Kozijnprofiel van Gijs</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[var(--gijs-donkergroen)] mb-1">Afdichting</h3>
              <p className="text-sm text-zinc-600">
                Het kozijnprofiel van Gijs heeft 7 afdichtingspunten en is daarmee waterdicht. Dat merk je aan
                minder kans op tocht en vocht bij het kozijn. Het andere profiel in deze vergelijking, dat Gijs
                niet gebruikt, heeft 5 afdichtingen en is niet waterdicht.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[var(--gijs-donkergroen)] mb-1">Geïsoleerd profiel</h3>
              <p className="text-sm text-zinc-600">
                Het profiel van Gijs is geïsoleerd, wat helpt om warmte beter binnen te houden. Bij het
                andere profiel in deze vergelijking is dat niet het geval.
              </p>
            </div>
          </div>
        </section>

        <section id="producten" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Welke soorten kozijnen biedt Gijs?</h2>
          <p className="text-zinc-600 mb-8 max-w-2xl">
            Gijs werkt met kozijnen in drie niveaus. Daarnaast zijn er kunststof en aluminium
            profielsystemen en kunnen deuren en schuifpuien worden meegenomen.
          </p>

          <h3 className="font-bold text-xl text-[var(--gijs-donkergroen)] mb-4">Drie niveaus: Basic, Standard en Comfort</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {HR_ISOFRAME_TIERS.map(tier => (
              <MaterialCard
                key={tier.naam}
                name={tier.naam}
                description={tier.tagline}
                benefits={tier.kernkenmerken}
                imageAlt={tier.naam}
                badge={tier.subsidie}
                headingLevel="h4"
              />
            ))}
          </div>

          <details className="group rounded-[var(--radius-card)] border border-[var(--border-default)] mb-14 [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-6 py-4 font-semibold text-[var(--accent-700)]">
              Bekijk technische gegevens
              <Icon name="chevron-down" size="sm" className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-6 pb-6 flex flex-col gap-10">
              <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)]">
                <table className="w-full text-left border-collapse min-w-[520px]">
                  <thead>
                    <tr className="border-b border-[var(--border-default)]">
                      <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Niveau</th>
                      <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Glas</th>
                      <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Ug-waarde</th>
                      <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Subsidie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {HR_ISOFRAME_TIERS.map(tier => (
                      <tr key={tier.naam}>
                        <td className="px-6 py-4 font-bold text-[var(--gijs-donkergroen)] whitespace-nowrap">{tier.naam}</td>
                        <td className="px-6 py-4 text-zinc-600 whitespace-nowrap">{tier.glas}</td>
                        <td className="px-6 py-4 text-zinc-700 whitespace-nowrap">{tier.ugWaarde}</td>
                        <td className="px-6 py-4 text-zinc-600 whitespace-nowrap">{tier.subsidie}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Kunststof kozijnen</h4>
                <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 items-center mb-6">
                  <p className="text-zinc-600">
                    Kunststof kozijnprofielen zijn er in drie varianten: vlak (70 mm inbouwdiepte), half verdiept
                    (85 mm) en verdiept (120 mm). Het 120 mm-profiel lijkt qua vorm het meest op een houten kozijn;
                    het 70 mm-profiel is het goedkoopst en wordt bijvoorbeeld toegepast bij stacaravans, garages of
                    een moderner gevelbeeld. Qua isolatie zijn de profielen vergelijkbaar, met het 85 mm-profiel
                    iets beter.
                  </p>
                  <div className="rounded-[var(--radius-card)] bg-[var(--surface-muted)] aspect-[4/3] p-6 flex items-center justify-center">
                    <Image
                      src="/images/maatregelen/kozijnen/kozijnen-profieldoorsnede.jpg"
                      alt="Doorsnede van een geïsoleerd kunststof kozijnprofiel met meerdere kamers en glas"
                      width={600}
                      height={600}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mb-6 max-w-2xl">Technische doorsnede ter illustratie van een geïsoleerd kunststofprofiel.</p>
                <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)]">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-[var(--surface-muted)]">
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Profielbreedte</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Kamers</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Afdichtingen</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Isolatiewaarde (Uf)</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Max. glasdikte</th>
                      </tr>
                    </thead>
                    <tbody>
                      {KUNSTSTOF_PROFIELEN.map((profiel, i) => (
                        <tr key={profiel.breedte} className={i % 2 === 1 ? "bg-[var(--surface-muted)]/40" : undefined}>
                          <td className="px-5 py-4 font-bold text-[var(--gijs-donkergroen)] whitespace-nowrap">{profiel.breedte}</td>
                          <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{profiel.kamers}</td>
                          <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{profiel.afdichtingen}</td>
                          <td className="px-5 py-4 text-zinc-700 whitespace-nowrap">{profiel.isolatiewaardeUf}</td>
                          <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{profiel.maxGlasdikte}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Aluminium</h4>
                <p className="text-zinc-600 max-w-2xl">
                  Voor aluminium kozijnen wordt onder meer een aluminium raam- en deursysteem gebruikt. Dit systeem
                  is er in meerdere thermische varianten en heeft een warmte-isolatie vanaf Uw 0,64 W/(m²K) voor
                  ramen en Uf vanaf 0,83 W/(m²K). Aluminium is lichter dan kunststof en geschikt voor grotere
                  constructies.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Schuifpui-profielen</h4>
                <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)]">
                  <table className="w-full text-left border-collapse min-w-[520px]">
                    <thead>
                      <tr className="bg-[var(--surface-muted)]">
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Uitvoering</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Kozijnbreedte</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Isolatiewaarde (Uf)</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Glastype</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SCHUIFPUI_PROFIELEN.map((profiel, i) => (
                        <tr key={profiel.naam} className={i % 2 === 1 ? "bg-[var(--surface-muted)]/40" : undefined}>
                          <td className="px-5 py-4 font-bold text-[var(--gijs-donkergroen)] whitespace-nowrap">{profiel.naam}</td>
                          <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{profiel.kozijnbreedte}</td>
                          <td className="px-5 py-4 text-zinc-700 whitespace-nowrap">{profiel.isolatiewaardeUf}</td>
                          <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{profiel.glastype}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </details>

          <h3 className="font-bold text-xl text-[var(--gijs-donkergroen)] mb-4">Deuren en schuifpuien</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Card className="flex flex-col gap-4">
              <div className="rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)] aspect-square flex items-center justify-center">
                <Image src="/images/maatregelen/kozijnen/draaikiep.png" alt="Voorbeeld van een kunststof draaikiepraam" width={400} height={400} className="max-w-[90%] max-h-[90%] object-contain" />
              </div>
              <h4 className="font-bold text-[var(--gijs-donkergroen)]">Draaikiepraam</h4>
              <p className="text-sm text-zinc-600">Een draaikiepraam is er in dezelfde profielsystemen als de kozijnen.</p>
            </Card>
            <Card className="flex flex-col gap-4">
              <div className="rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)] aspect-square flex items-center justify-center">
                <Image src="/images/maatregelen/kozijnen/schuifpui.png" alt="Voorbeeld van een kunststof schuifpui" width={400} height={400} className="max-w-[90%] max-h-[90%] object-contain" />
              </div>
              <h4 className="font-bold text-[var(--gijs-donkergroen)]">Schuifpui</h4>
              <p className="text-sm text-zinc-600">Kunststof schuifpui-profielen zijn er in de uitvoeringen Comfort en Premium.</p>
            </Card>
          </div>

          <p className="text-sm text-zinc-500 mt-8 max-w-2xl">
            Alleen het glas verbeteren? Bekijk{" "}
            <Link href="/maatregelen/isolatieglas" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">isolatieglas</Link>.
          </p>
        </section>

        <section id="referenties" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Referenties</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">Een aantal eerder geplaatste kozijnen en deuren, zo zien ze eruit in echte woningen.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { src: "/images/maatregelen/kozijnen/kozijnen-referentie-1.jpg", alt: "Referentieproject met kunststof kozijnen en voordeur" },
              { src: "/images/maatregelen/kozijnen/kozijnen-referentie-3.jpg", alt: "Referentieproject met kunststof kozijn, close-up" },
              { src: "/images/maatregelen/kozijnen/kozijnen-referentie-4.jpg", alt: "Referentieproject met kunststof kozijnen en voordeur, Delfzijl" },
              { src: "/images/maatregelen/kozijnen/kozijnen-referentie-5.jpg", alt: "Referentieproject met kunststof kozijn en voordeur, close-up" },
            ].map(ref => (
              <div key={ref.src} className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] aspect-[4/3]">
                <Image src={ref.src} alt={ref.alt} width={800} height={600} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        <section id="hoe-werkt-het" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Hoe verloopt het proces?</h2>
          <p className="text-zinc-600 mb-10 max-w-2xl">Bij het plaatsen van een nieuw kozijn doorloopt Gijs de volgende stappen.</p>
          {/* Gedeeld component, gebruikt door alle isolatiepagina's, zodat
              de iconen op elke pagina exact dezelfde afmeting/uitlijning
              hebben — zie UitvoeringStappen.tsx voor de volledige
              toelichting (responsive gedrag, aspect-ratio-fix). Hier maar
              4 stappen i.p.v. 6 (zie toelichting bij UITVOERING_STAPPEN
              hierboven) — het component ondersteunt elk aantal stappen. */}
          <UitvoeringStappen stappen={UITVOERING_STAPPEN} />
        </section>

        <section id="veelgestelde-vragen" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">Veelgestelde vragen</h2>
          <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-8 items-start">
            <div>
              <FAQAccordion
                items={faqItems}
                className="[&_.gijs-accordion__trigger]:py-6 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg"
              />
              <Link href="/kennis#veelgestelde-vragen" className="mt-4 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] inline-flex items-center gap-1 no-underline">
                Bekijk alle veelgestelde vragen <Icon name="arrow-right" size="sm" />
              </Link>
            </div>
            <Card variant="tint" className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Nog een vraag?</h3>
              <p className="text-sm text-zinc-600">
                Kom je er niet helemaal uit? Bespreek het tijdens een gratis energiescan of neem direct contact op.
              </p>
              <Button href="/contact#energiescan" variant="accent">Vraag een gratis energiescan aan</Button>
              <a href={CONTACT.phoneHref} className="text-sm font-semibold text-[var(--green-800)] no-underline hover:underline">
                Bel {CONTACT.phone}
              </a>
            </Card>
          </div>
        </section>
      </div>

      <section className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-8 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4 max-w-xl">
          <span className="shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <Image src="/images/shared/icons/huisscan.png" alt="" width={34} height={34} />
          </span>
          <div className="min-w-0 [&_h2]:[hyphens:auto]">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Welke kozijnen passen bij jouw woning?</h2>
            <p className="text-zinc-700">Start de woningscan en ontdek welke mogelijkheden bij jouw woning passen.</p>
          </div>
        </div>
        <Button href={startScanHref} variant="accent" size="lg" iconRight="arrow-right" className="shrink-0 w-full md:w-auto">
          Start de woningscan
        </Button>
      </section>
    </main>
  );
}
