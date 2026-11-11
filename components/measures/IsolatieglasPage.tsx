import Image from "next/image";
import Link from "next/link";
import { GLASSOORTEN, GLASSOORTEN_HIGHLIGHT } from "@/lib/content/isolatieglas-glassoorten";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { WhatsAppTrackedButton, WhatsAppTrackedLink } from "@/components/regio/WhatsAppTrackedButton";
import { RegioBreadcrumb, RegioMain, H2 } from "@/components/regio/RegioBlokken";
import { AdviseurBlok, ADVISEUR_FOTO } from "@/components/regio/VerhaalSecties";
import { SubsidiecheckStart } from "@/components/subsidie/SubsidiecheckStart";
import { EYEBROW, SECTIE_BASE, LEAD, TEKST, BRON, WIT_BLOK, GRIJS_BLOK, HERO_H1, HERO_INTRO, GijsWatermark, RASTER, RASTER_CEL, TEKSTLINK } from "@/components/regio/regio-template-styles";
import regioStyles from "@/components/regio/regio.module.css";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { IsolatieglasInstallatieAnimatie } from "@/components/measures/IsolatieglasInstallatieAnimatie";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { MeasureRegioLink } from "@/components/measures/MeasureRegioLink";
import { ENERGIESCAN_HREF } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Isolatieglaspagina in de opbouw en stijl van de regiopagina's (LokaalProfielPagina /
// Winterswijk-sjabloon): dezelfde hero, sectiekoppen (eyebrow + H2 + lead), grijze blokken met
// witte kaarten, het adviseurblok van Thom en de afsluitende strook. Stijlen komen uit
// regio-template-styles, zodat een wijziging daar ook hier doorwerkt.
//
// Inhoud richt zich op de zoekwoorden uit Search Console (nov. 2026): "isolatieglas (laten)
// plaatsen/zetten", "glasisolatie", "woning isoleren met glas" en HR++ versus triple glas.
//
// Bron voor alle feiten: "Informatie isolatieglas van Gijs met aanvullende voorwaarden.pdf"
// - p. 1: de zes stappen van de plaatsingsdag (IsolatieglasInstallatieAnimatie);
// - p. 2: aanvullende voorwaarden (VOORWAARDEN) en de rol van Gijs bij de subsidieaanvraag;
// - p. 3: productblad HR EcoGlazz met U-waarden (GLASSOORTEN) en de temperatuur van het glas
//   aan de binnenzijde bij 0 °C buiten en 20 °C binnen (GLASTEMPERATUUR).
// Subsidiebedragen uit p. 2 staan bewust niet op de pagina: die wijzigen, zie SubsidieSectie.tsx.
// Het adviseurblok hergebruikt de goedgekeurde regiotekst (gratis energiescan t.w.v. €349,
// begeleiding van de uitvoering).

const SECTIE = `${SECTIE_BASE} ${regioStyles.opkomen}`;

const VOORWAARDEN = [
  "De te isoleren oppervlaktes zijn bereikbaar en toegankelijk, en vrij van vitrage, rolluiken, planten en gordijnen",
  "Het glas wordt vooraf ingemeten; hiervoor neemt de inmeter telefonisch contact op",
  "Er is parkeergelegenheid voor een combinatie van circa 15 meter lang",
  "Bij onverwachte houtrot tijdens de plaatsing wordt het glas niet geplaatst; eerst wordt reparatie geadviseerd",
  "Alle glaslatten worden in grondverf afgeleverd; de opdrachtgever verzorgt zelf het schilderwerk",
  "Bij een prijsafwijking van meer dan 10% na het inmeten is heroverweging van de overeenkomst mogelijk",
  "Er is een toilet beschikbaar voor de uitvoerende partij",
];

// Productblad p. 3: temperatuur van het glasoppervlak aan de binnenkant (0 °C buiten, 20 °C binnen).
const GLASTEMPERATUUR = [
  { waarde: "6,9 °C", label: "Gewoon dubbelglas" },
  { waarde: "17 °C", label: "HR++ glas" },
  { waarde: "18,9 °C", label: "HR+++ of triple glas" },
];

const OPBOUW = [
  { icon: "layers", title: "Meerdere glaslagen", text: "Isolatieglas bestaat uit meerdere lagen glas met een tussenruimte. Bij HR+++ zijn dat drie lagen (driedubbel glas)." },
  { icon: "sparkles", title: "Speciale coating", text: "Op het glas zit een coating die warmte terugkaatst. HR++ heeft een verbeterde coating, HR+++ een dubbele." },
  { icon: "wind", title: "Isolerende vulling", text: "Vanaf HR+ zit er een gasvulling in de spouw tussen de glaslagen." },
  { icon: "ruler", title: "Afstandhouder", text: "De afstandhouder houdt de glaslagen op de juiste afstand. Bij HR++ (G) is deze van kunststof." },
];

function Kop({ eyebrow, titel, lead }: { eyebrow: string; titel: string; lead?: string }) {
  return (
    <div className="flex flex-col gap-4 mb-10 md:mb-12 max-w-3xl">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className={H2}>{titel}</h2>
      {lead && <p className={LEAD}>{lead}</p>}
    </div>
  );
}

const H3_GROOT = "text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--gijs-donkergroen)] [text-wrap:balance]";
const KAARTKOP = "text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[var(--gijs-donkergroen)] [text-wrap:balance]";
const KAARTTEKST = "text-[15px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]";
const UITKLAP = "flex cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-[var(--border-default)] bg-white px-5 py-3 text-[15px] font-semibold text-[var(--gijs-donkergroen)] transition-colors duration-[var(--dur-base)] hover:border-[var(--accent-700)] hover:text-[var(--accent-700)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] [&::-webkit-details-marker]:hidden";

export function IsolatieglasPage({ item }: { item: MeasurePageItem }) {
  const startScanHref = "/woning?maatregel=" + item.id;

  const faqItems: FAQItem[] = [
    { question: "Welk isolatieglas past bij mijn woning?", answer: "Dat hangt af van je huidige glas en kozijnen. Gijs plaatst isolatieglas van HR tot HR+++, met bij HR+++ driedubbel (triple) glas. Tijdens de energiescan bepaalt Gijs welk type bij jouw woning past." },
    { question: "Hoe wordt het glas ingemeten?", answer: "Voor aanvang van de werkzaamheden wordt het glas ingemeten. Hiervoor neemt de inmeter telefonisch contact met je op." },
    { question: "Wat gebeurt er bij houtrot?", answer: "Bij onverwachte houtrot tijdens de plaatsing laat Gijs het glas achter, maar wordt het niet geplaatst. Eerst wordt reparatie geadviseerd." },
    { question: "Wie schildert de glaslatten?", answer: "De glaslatten worden in grondverf afgeleverd. Je zorgt zelf voor het schilderwerk." },
    {
      question: "Wat moet ik voorbereiden en waar moet ik rekening mee houden?",
      answer: "Gijs bespreekt dit vooraf met je, zodat je weet waar je aan toe bent. Een paar praktische punten:",
      punten: VOORWAARDEN,
    },
  ];

  const plaatsKaarten = [
    {
      icon: "snowflake",
      titel: "Wanneer is vervangen interessant?",
      tekst: <>Heb je nog enkelglas, gewoon dubbelglas of ouder HR-glas, of voelt het koud bij het raam? Gewoon dubbelglas heeft een U-waarde van 2,9, ruim twee keer zo hoog als HR++ (1,2). Daar valt dan winst te halen.</>,
    },
    {
      icon: "app-window",
      titel: "In je bestaande kozijnen",
      tekst: <>Het nieuwe glas komt in je huidige kozijn, dat dan wel in goede staat moet zijn. Bij houtrot adviseert Gijs eerst reparatie. Is het kozijn zelf aan vervanging toe? Kijk dan naar <Link href="/maatregelen/kozijnen" className={TEKSTLINK}>nieuwe kozijnen</Link>.</>,
    },
    {
      icon: "user-check",
      titel: "Gijs regelt het traject",
      tekst: <>Tijdens de gratis energiescan bekijkt een adviseur je ramen en bespreekt welk glas past. Daarna plant Gijs het inmeten en de plaatsing in. Je hebt één vast aanspreekpunt.</>,
    },
  ];

  return (
    <RegioMain>
      <RegioBreadcrumb crumbs={[
        { naam: "Home", url: "/" },
        { naam: "Maatregelen", url: "/maatregelen" },
        { naam: "Isolatieglas", url: "/maatregelen/" + item.slug },
      ]} />

      <header className="pt-2 lg:pt-6 mb-14 md:mb-20">
        <p className={EYEBROW + " mb-4"}>Isolatieglas</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
          <div className="flex flex-col gap-5">
            <h1 className={HERO_H1}>Isolatieglas laten plaatsen in je bestaande kozijnen</h1>
            <p className={HERO_INTRO}>
              Last van kou bij je ramen? Met isolatieglas gaat er minder warmte verloren via het raam. Gijs helpt je
              kiezen tussen HR++ en triple glas en regelt de plaatsing in één dag, met één vast aanspreekpunt van de
              eerste vraag tot en met de uitvoering.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <WhatsAppTrackedButton plaats="maatregelpagina_hero" href={ENERGIESCAN_HREF} size="lg" iconRight="arrow-right">Vraag een energiescan aan</WhatsAppTrackedButton>
              <Button href={startScanHref} variant="accent" size="lg" iconRight="arrow-right">Start de woningscan</Button>
            </div>
            <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
              Of <Link href="/contact" className={TEKSTLINK}>neem gewoon contact op</Link>, of bel{" "}
              <a href={CONTACT.phoneHref} className={TEKSTLINK}>{CONTACT.phone}</a>.
            </p>
          </div>
          <figure className="m-0 group/hero">
            <div className="relative aspect-[3/2] lg:aspect-auto lg:h-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--grey-050)]">
              <Image src="/images/maatregelen/glas/isolatieglas.png" alt="Monteur van Gijs plaatst isolatieglas in een raam" fill priority
                sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover/hero:scale-[1.03]" />
            </div>
          </figure>
        </div>
      </header>

      <MeasureSectionNav sections={[
        { id: "wat-is-het", label: "Waarom" },
        { id: "glassoorten", label: "Glassoorten" },
        { id: "hoe-werkt-het", label: "Plaatsen" },
        { id: "subsidie", label: "Subsidie" },
        { id: "veelgestelde-vragen", label: "Vragen" },
      ]} />

      <section id="wat-is-het" className={SECTIE + " mt-8 lg:mt-12"}>
        <div className={GRIJS_BLOK}>
          <div className="flex mb-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <p className={EYEBROW}>Waarom isolatieglas?</p>
              <h2 className={H2}>Last van kou bij je ramen?</h2>
              <p className={TEKST}>
                Zie isolatieglas als een warme deken voor je ramen. Het glas beperkt warmteverlies via het raam en voelt
                aan de binnenkant warmer aan. Isolatieglas, ook wel glasisolatie genoemd, is er in verschillende soorten,
                van HR tot HR+++.
              </p>
              <p className={TEKST}>
                Voelt een kamer met oud dubbelglas toch koud? Dat komt doordat het glas zelf koud wordt. Bij 0 °C buiten
                is gewoon dubbelglas aan de binnenkant maar 6,9 °C. HR++ glas blijft dan 17 °C. Dat verschil merk je vooral
                als je dicht bij het raam zit.
              </p>
            </div>
            <GijsWatermark />
          </div>

          <div className="rounded-[var(--radius-lg)] bg-white px-6 py-7 sm:px-8 sm:py-8 mb-4 lg:mb-5 transition-shadow duration-500 ease-out hover:shadow-[0_8px_32px_-2px_rgba(0,0,0,0.18)]">
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--accent-700)] mb-6">Temperatuur van het glas aan de binnenkant</p>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
              {GLASTEMPERATUUR.map(c => (
                <div key={c.label} className="flex flex-col-reverse gap-1.5">
                  <dt className="text-[15px] leading-snug text-[var(--text-muted)]">{c.label}</dt>
                  <dd className="text-[clamp(2.25rem,1.8rem+1.6vw,3rem)] font-bold leading-none tracking-[-0.04em] text-[var(--gijs-donkergroen)]">{c.waarde}</dd>
                </div>
              ))}
            </dl>
            <p className={BRON + " mt-6"}>Bij 0 °C buiten en 20 °C binnen. Bron: productblad isolatieglas HR EcoGlazz van Gijs.</p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-4 lg:mb-5">
            <li className={WIT_BLOK + " flex flex-col gap-3"}>
              <h3 className={KAARTKOP}>Minder warmteverlies, lagere energierekening</h3>
              <p className={KAARTTEKST}>
                Isolatieglas heeft een lagere U-waarde dan enkel- of gewoon dubbelglas. Er gaat minder warmte via het glas
                verloren, en dat draagt bij aan een lagere energierekening.
              </p>
            </li>
            <li className={WIT_BLOK + " flex flex-col gap-3"}>
              <h3 className={KAARTKOP}>Warmer en comfortabeler bij het raam</h3>
              <p className={KAARTTEKST}>
                Naarmate het glas beter isoleert, voelt het glasoppervlak aan de binnenkant warmer aan. Zo wordt de plek
                bij het raam weer een fijne plek om te zitten.
              </p>
            </li>
          </ul>

          <AdviseurBlok foto={ADVISEUR_FOTO.thom} titel="Thom kijkt graag met je mee" plaats="maatregelpagina_adviseurblok">
            <p className="text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty]">
              Twijfel je of je glas aan vervanging toe is? Thom komt langs voor een{" "}
              <strong className="font-bold text-[var(--accent-700)]">gratis en vrijblijvende energiescan ter waarde van €349</strong>{" "}
              en bekijkt je ramen en kozijnen. Gijs helpt je met passend advies en begeleidt de uitvoering, zodat je het
              traject niet zelf hoeft te organiseren.
            </p>
          </AdviseurBlok>
        </div>
      </section>

      <section id="glassoorten" className={SECTIE}>
        <Kop eyebrow="Glassoorten" titel="Welke soorten isolatieglas zijn er?"
          lead="Van enkelglas tot HR+++: hoe lager de U-waarde, hoe beter het glas isoleert. De U-waarde geeft aan hoeveel warmte er door het glas verloren gaat." />

        {/* Productblad (brochure p. 3) zichtbaar naast de tabel: zo is het beeld kleiner dan op volle
            breedte, en vullen beeld en tabel samen de rij. Op mobiel onder elkaar. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:items-center">
        <div className="rounded-[var(--radius-lg)] overflow-hidden bg-[var(--grey-050)]">
          <Image src="/images/maatregelen/glas/isolatieglas-glassoorten-overzicht.png"
            alt="Productblad isolatieglas HR EcoGlazz: U-waarden en temperatuur van het glas aan de binnenkant, van enkelglas tot HR+++"
            width={842} height={595} sizes="(max-width: 1024px) 100vw, 640px" className="w-full h-auto" />
        </div>
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white">
          <table className="w-full text-left border-collapse min-w-[440px]">
            <thead>
              <tr className="border-b border-[var(--border-default)]">
                <th scope="col" className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-[var(--gijs-donkergroen)]">Glassoort</th>
                <th scope="col" className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-[var(--gijs-donkergroen)]">U-waarde</th>
                <th scope="col" className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-[var(--gijs-donkergroen)]">Kenmerk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {GLASSOORTEN.map(soort => (
                <tr key={soort.naam} className={GLASSOORTEN_HIGHLIGHT.has(soort.naam) ? "bg-[var(--accent-050)]" : undefined}>
                  <td className="px-5 py-3 font-bold text-[var(--gijs-donkergroen)] whitespace-nowrap">{soort.naam}</td>
                  <td className="px-5 py-3 text-zinc-700 whitespace-nowrap">{soort.uWaarde}</td>
                  <td className="px-5 py-3 text-zinc-600">{soort.uitleg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        <p className={BRON + " mt-3"}>
          Gemarkeerde rijen isoleren het best. Tijdens de energiescan bespreken we of hiervoor op dat moment subsidie
          beschikbaar is.
        </p>

        <div className={GRIJS_BLOK + " mt-10"}>
          <h3 className={H3_GROOT + " mb-8 max-w-3xl"}>HR++ of triple glas: wat is het verschil?</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            <li className={WIT_BLOK + " flex flex-col gap-3"}>
              <h4 className={KAARTKOP}>HR++ glas</h4>
              <p className={KAARTTEKST}>
                Twee glasplaten met een verbeterde coating, U-waarde 1,2. In de uitvoering HR++ (G), met een kunststof
                afstandhouder, komt de U-waarde op 0,8.
              </p>
            </li>
            <li className={WIT_BLOK + " flex flex-col gap-3"}>
              <h4 className={KAARTKOP}>HR+++ of triple glas</h4>
              <p className={KAARTTEKST}>
                Drie glasplaten (driedubbel glas) met een dubbele coating, U-waarde 0,7. Dit is de beste isolatiewaarde in
                het overzicht.
              </p>
            </li>
          </ul>
          <p className={TEKST + " mt-6 max-w-3xl"}>
            Welke van de twee bij jouw ramen past, hangt vooral af van je kozijnen. Dat bekijkt Gijs samen met jou tijdens
            de energiescan.
          </p>

          <details className="group mt-8">
            <summary className={UITKLAP}>
              <span className="group-open:hidden">Bekijk hoe isolatieglas is opgebouwd</span>
              <span className="hidden group-open:inline">Verberg de opbouw van isolatieglas</span>
              <Icon name="chevron-down" size="sm" className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="pt-8 flex flex-col gap-4 lg:gap-5">
              <div className="rounded-[var(--radius-lg)] overflow-hidden bg-white">
                <Image src="/images/maatregelen/glas/isolatieglas-uitlegvisual.svg"
                  alt="Uitleg van glaslagen, coating, isolerende vulling en afstandhouder bij isolatieglas"
                  width={4384} height={2853} className="w-full h-auto" />
              </div>
              <ul className={RASTER + " gap-4 lg:gap-5"}>
                {OPBOUW.map((deel, i) => (
                  <li key={deel.title} className={WIT_BLOK + " flex flex-col gap-2 " + RASTER_CEL(OPBOUW.length, i)}>
                    <Icon name={deel.icon} size="md" className="text-[var(--accent-700)]" />
                    <h4 className={KAARTKOP}>{deel.title}</h4>
                    <p className={KAARTTEKST}>{deel.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </section>

      <section id="hoe-werkt-het" className={SECTIE}>
        <Kop eyebrow="Isolatieglas plaatsen" titel="Isolatieglas laten plaatsen: hoe werkt dat?"
          lead="Bij isolatieglas vervang je alleen het glas. Je kozijnen blijven zitten, dus het werk is overzichtelijk en in één dag klaar." />

        <ul className={RASTER + " gap-4 lg:gap-5 mb-14"}>
          {plaatsKaarten.map((k, i) => (
            <li key={k.titel} className={"flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white p-6 sm:p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] " + RASTER_CEL(plaatsKaarten.length, i)}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]">
                <Icon name={k.icon} size="md" />
              </span>
              <h3 className={KAARTKOP}>{k.titel}</h3>
              <p className={KAARTTEKST}>{k.tekst}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 mb-10 max-w-3xl">
          <h3 className={H3_GROOT}>Zo verloopt de dag van plaatsing</h3>
          <p className={LEAD}>Gijs werkt volgens een vaste aanpak. Zo weet je precies wat je kunt verwachten.</p>
        </div>
        <IsolatieglasInstallatieAnimatie />
      </section>

      <section id="subsidie" className={SECTIE}>
        <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-9 sm:px-10 lg:px-12 lg:py-11">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 text-zinc-600">
              <p className={EYEBROW}>Subsidie</p>
              <h2 className={H2}>Subsidie bij isolatieglas</h2>
              <p>
                Voor isolatieglas kan subsidie beschikbaar zijn. De voorwaarden en bedragen kunnen wijzigen. Tijdens de
                energiescan bespreken we welke mogelijkheden op dat moment voor jouw woning gelden. Gijs kan je daarna
                helpen met de subsidieaanvraag.
              </p>
              <p className="text-sm">
                Meer weten over de landelijke ISDE-regeling? Bekijk de{" "}
                <a href="https://www.rvo.nl/subsidies-financiering/isde" target="_blank" rel="noopener noreferrer" className={TEKSTLINK}>
                  officiële ISDE-pagina van RVO<span className="sr-only"> (opent in nieuw tabblad)</span>
                </a>{" "}
                of plan een{" "}
                <WhatsAppTrackedLink plaats="maatregelpagina_subsidiesectie" href={ENERGIESCAN_HREF} className={TEKSTLINK}>gratis energiescan aan huis</WhatsAppTrackedLink>.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:pt-10">
              <h3 className="text-lg font-bold text-[var(--gijs-donkergroen)]">Welke subsidies passen bij jouw woning?</h3>
              <p className="text-zinc-700">Vul je postcode en huisnummer in en zie direct alle regelingen voor jouw adres.</p>
              <SubsidiecheckStart idPrefix="sc-isolatieglas" />
            </div>
          </div>
        </div>
      </section>

      <section id="veelgestelde-vragen" className={SECTIE}>
        <h2 className={H2 + " mb-8 max-w-3xl"}>Veelgestelde vragen over isolatieglas</h2>
        <div className="max-w-3xl">
          <FAQAccordion items={faqItems} className="[&_.gijs-accordion__trigger]:py-6 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
          <Link href="/kennis#veelgestelde-vragen" className="mt-6 text-[15px] font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] inline-flex items-center gap-1 no-underline">
            Bekijk alle veelgestelde vragen <Icon name="arrow-right" size="sm" />
          </Link>
        </div>
      </section>

      <section className={`scroll-mt-52 ${regioStyles.opkomen}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-7 sm:px-10 sm:py-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]">
          <p className="max-w-xl text-[clamp(16px,0.95rem+0.2vw,18px)] leading-[1.6] text-zinc-700 [text-wrap:pretty]">
            Wil je isolatieglas laten plaatsen? Vraag een gratis energiescan aan, of ontdek eerst zelf in de woningscan
            welke maatregelen bij jouw huis passen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 self-start shrink-0">
            <Button href={startScanHref} variant="accent" size="md" iconRight="arrow-right">Start de woningscan</Button>
            <WhatsAppTrackedButton plaats="maatregelpagina_afsluiting" href={ENERGIESCAN_HREF} size="md" iconRight="arrow-right" variant="secondary">Vraag een energiescan aan</WhatsAppTrackedButton>
          </div>
        </div>
      </section>

      <MeasureRegioLink />
    </RegioMain>
  );
}
