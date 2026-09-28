import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { SPOUW_PRODUCTS } from "@/lib/content/spouw-products";
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

// Herwerkte spouwmuurisolatiepagina, opgezet naar het beeld/structuur dat
// Max heeft aangeleverd — met Gijs' eigen beelden/pictogrammen in plaats
// van de generieke voorbeeldfoto en -iconen uit dat voorbeeld.
//
// Twee zinnen uit dat voorbeeld zijn NIET letterlijk overgenomen omdat ze
// niet te herleiden zijn tot een gecontroleerde Gijs-bron (zie het
// eindverslag in de conversatie voor de onderbouwing):
// - "Vaak toepasbaar bij huizen na circa 1930" → vervangen door een
//   controleerbaar feit ("bestaande spouwmuur nodig").
// - De FAQ "Zorgt spouwmuurisolatie voor vochtproblemen?" (dat vraagt om
//   het nog niet-geverifieerde feiten-en-fabels-document) → vervangen
//   door "Kan spouwmuurisolatie altijd?", wel te onderbouwen vanuit de
//   al goedgekeurde voorwaarden (vleermuizen, staat van de gevel).
//
// Bronnen: de drie aangeleverde productbladen "Informatie
// spouwmuurisolatie (HR EcoWool / HR EcoPearl / HR IsoFoam) met
// aanvullende voorwaarden.pdf" — pagina 1 (uitvoeringsstappen), pagina 2
// (aanvullende voorwaarden + subsidie-informatie, identiek in alle drie
// bladen) en pagina 3 (per materiaal: beschrijving, productvoordelen,
// productafbeelding — zie lib/content/spouw-products.ts). Bedragen en
// voorwaarden zijn letterlijk overgenomen uit deze bladen.
//
// UITLEGVISUAL-VERVANGING: de doorsnede-afbeelding bij "Wat is
// spouwmuurisolatie?" is vervangen door de nieuw aangeleverde
// spouwmuurisolatie-uitlegvisual.png ("spouwisolatie.png" uit de
// aangeleverde ZIP, 4753×2522) — vervangt de eerdere
// spouwmuurisolatie-doorsnede.png (verwijderd, nergens anders gebruikt).
// De nieuwe afbeelding bevat de nummering en legenda (binnenmuur/
// isolatiemateriaal/boorgat/buitenmuur) al zelf en wordt daarom als
// geheel, ongecropt weergegeven (was eerder een vaste 4:3-crop met
// object-cover; nu volle contentbreedte met de eigen beeldverhouding).
// UITVOERINGSVISUAL — PROCES V2: net als bij dakisolatie (zie
// DakisolatiePage.tsx) is de eerdere set losse SVG's volledig vervangen
// door de definitieve "proces v2"-set (submap "spouwisolatie stappen"):
// elk bestand bevat nu icoon + nummerbadge + titel + een korte uitlegzin.
// Alle 6 bestanden zijn hernoemd naar spouwmuurisolatie-stap-1.svg t/m
// -stap-6.svg; de vorige bestanden (stap-1/2/5/6.svg, boorgatenmaken.svg,
// stap-4-spouwisolatie.svg) zijn verwijderd. Titels ongewijzigd
// overgenomen: stap 3 heet nog steeds "Boorgaten maken".
const UITVOERING_STAPPEN = [
  { bestand: "spouwmuurisolatie-stap-1.svg", label: "Aankomst" },
  { bestand: "spouwmuurisolatie-stap-2.svg", label: "Uitleg" },
  { bestand: "spouwmuurisolatie-stap-3.svg", label: "Boorgaten maken" },
  { bestand: "spouwmuurisolatie-stap-4.svg", label: "Isolatie aanbrengen" },
  { bestand: "spouwmuurisolatie-stap-5.svg", label: "Controle" },
  { bestand: "spouwmuurisolatie-stap-6.svg", label: "Oplevering" },
];

// Aanvullende voorwaarden — pagina 2, identiek in alle drie productbladen.
// In twee groepen verdeeld: wat de woning/omgeving beschikbaar moet
// hebben (links) en wat er tijdens de uitvoering zelf gebeurt (rechts).
const VOORWAARDEN_LINKS = [
  "De te isoleren gevels zijn voor aanvang van de werkzaamheden bereikbaar en toegankelijk",
  "Er is voor aanvang van de werkzaamheden een watervoorziening (buitenkraan) aanwezig",
  "Er is parkeergelegenheid voor een combinatie van circa 15 meter lang",
];
const VOORWAARDEN_RECHTS = [
  "Bij het boren is het soms onvermijdelijk dat de hoeken van de stenen worden geraakt",
  "Er is een toilet beschikbaar voor de uitvoerende partij",
  "Je gaat akkoord met het faciliteren van verblijfsruimte (verplicht) voor vleermuizen in de nok of een geschikte locatie. Een lokale koudebrug kan hierbij niet worden gegarandeerd te voorkomen",
];

// Drie voordelen, elk specifiek voor spouwmuurisolatie — "Minder geluid
// van buiten" is bewust geen algemene comfortclaim maar rechtstreeks
// herleid tot HR EcoWool's eigen productomschrijving ("thermisch en
// akoestisch na-isoleren"), zie lib/content/spouw-products.ts. Dit is
// een voordeel dat dak- en vloerisolatie niet delen.
const VOORDELEN = [
  { icon: "thermometer", title: "Meer wooncomfort", text: "Een gelijkmatigere temperatuur in huis en minder koude buitenmuren." },
  { icon: "volume-2", title: "Minder geluid van buiten", text: "HR EcoWool isoleert niet alleen thermisch, maar ook akoestisch." },
  { icon: "wind", title: "Minder warmteverlies", text: "Je woning verliest minder warmte via de buitenmuren." },
];

export function SpouwmuurisolatiePage({ item }: { item: MeasurePageItem }) {
  const title = "Spouwmuurisolatie";
  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "voordelen", label: "Voordelen" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "materialen", label: "Materialen" },
    { id: "voorwaarden", label: "Voorwaarden" },
    { id: "subsidie", label: "Subsidie" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  // FAQ-volgorde herzien op klantprioriteit (geschiktheid → uitvoering →
  // voorbereiding → materialen); inhoud zelf was al bronondersteund en
  // niet dubbel met de rest van de pagina, dus ongewijzigd gelaten (zie
  // eindverslag).
  const faqItems: FAQItem[] = [
    { question: "Is mijn woning geschikt voor spouwmuurisolatie?", answer: "Dat hangt af van de staat van je gevel en de spouw. Gijs beoordeelt dit tijdens de energiescan. Dit is geen definitief technisch advies vooraf." },
    { question: "Kan spouwmuurisolatie altijd?", answer: "Nee, dat hangt af van de gevel en de spouw. Zo kan bijvoorbeeld de aanwezigheid van vleermuizen of de staat van het voegwerk een rol spelen. Dit wordt per woning beoordeeld." },
    { question: "Hoe lang duurt de uitvoering?", answer: "De uitvoering van spouwmuurisolatie neemt meestal één dag in beslag." },
    { question: "Wat gebeurt er met de boorgaten na de uitvoering?", answer: "Nadat het isolatiemateriaal via de boorgaten in de spouw is aangebracht, worden de gaten weer netjes afgevoegd." },
    { question: "Wat moet ik zelf voorbereiden?", answer: "Zorg dat de gevels bereikbaar zijn en dat er een watervoorziening (buitenkraan) en parkeergelegenheid beschikbaar zijn voor de installateur." },
    { question: "Welk materiaal past bij mijn spouw?", answer: item.answer },
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
        subtitle="Meer wooncomfort, minder geluid van buiten"
        intro="Spouwmuurisolatie maakt je woning comfortabeler en energiezuiniger door de spouw te vullen met isolatiemateriaal. Hieronder lees je hoe het werkt, welke materialen Gijs gebruikt en hoe de uitvoering en de energiescan verlopen."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Plan een gratis energiescan", href: "/contact#energiescan" }}
        image="/productbladen/spouwmuurisolatie-aanbrengen-gijs.png"
        imageAlt="Spouwmuurisolatie wordt via een boorgat in de gevel aangebracht"
        imageCaption="Isolatiemateriaal wordt via een boorgat aangebracht"
      />

      {/* Eén gedeelde wrapper om subnav + secties: geeft de sticky subnav
          een containing block met genoeg hoogte om daadwerkelijk te
          blijven "plakken" terwijl je door deze secties scrolt (een
          sticky element binnen een even hoge wrapper zou meteen weer
          "loslaten"). Stopt bewust vóór de laatste CTA-sectie. */}
      <div>
        <MeasureSectionNav sections={sections} />

        <section id="wat-is-het" className="scroll-mt-40 mt-12 mb-14">
        <div className="flex flex-col gap-4 max-w-3xl">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is spouwmuurisolatie?</h2>
          <p className="text-lg font-medium text-[var(--gijs-donkergroen)]">
            Zie spouwmuurisolatie als een extra jas in je muur. Een geïsoleerde spouw helpt de warmte beter binnen
            te houden.
          </p>
          <p className="text-zinc-600">
            De ruimte tussen de binnenmuur en de buitenmuur van je woning heet de spouw. Via kleine vulopeningen
            in de buitengevel wordt die ruimte gevuld met isolatiemateriaal. Gijs werkt hiervoor met HR EcoWool,
            HR EcoPearl en HR IsoFoam.
          </p>
          <p className="text-zinc-600">
            Niet elk materiaal past bij elke spouw: dat hangt af van de spouw en de staat van je gevel. Daar hoef je
            zelf niet technisch uit te komen. Tijdens een energiescan aan huis bekijkt een expert van Gijs de spouw
            en de bestaande situatie, en bespreekt welke oplossing past.
          </p>
        </div>
        <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] mt-8 max-w-[820px] mx-auto">
          {/* PNG vervangen door SVG: zelfde crop/inhoud (ratio geverifieerd),
              de opdrachtgever heeft alleen de hoekafronding van de
              labels/badges aangepast (uitlegvisuals.zip). */}
          <Image
            src="/productbladen/spouwmuurisolatie-uitlegvisual.svg"
            alt="Uitleg van binnenmuur, isolatiemateriaal, boorgat en buitenmuur bij spouwmuurisolatie"
            width={4753}
            height={2522}
            quality={100}
            className="w-full h-auto"
          />
        </div>

        <Card variant="tint" className="mt-8 flex flex-col md:flex-row md:items-center gap-6 !p-8">
          <div className="md:flex-1 flex flex-col gap-1">
            <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Past dit bij mijn woning?</h3>
            <p className="text-sm text-zinc-600">Tijdens de energiescan wordt beoordeeld of de bestaande spouw geschikt is.</p>
          </div>
          <ul className="md:flex-[1.6] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>Woning met een bestaande, onbehandelde spouw</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>De gevel is voor aanvang bereikbaar en toegankelijk</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>Mogelijke aanwezigheid van vleermuizen wordt meegenomen</span>
            </li>
          </ul>
          <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
        </Card>
      </section>

      <section id="voordelen" className="scroll-mt-40 mb-14">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">De voordelen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VOORDELEN.map(voordeel => (
            <Card key={voordeel.title} className="flex flex-col gap-5 !p-8">
              <span className="w-16 h-16 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                <Icon name={voordeel.icon} size="xl" />
              </span>
              <h3 className="font-bold text-xl text-[var(--gijs-donkergroen)]">{voordeel.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{voordeel.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="hoe-werkt-het" className="scroll-mt-40 mb-14">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Hoe verloopt de uitvoering?</h2>
        <p className="text-zinc-600 mb-10 max-w-2xl">Gijs werkt volgens een vaste aanpak. Zo weet je precies wat je kunt verwachten.</p>
        {/* Gedeeld component, gebruikt door alle isolatiepagina's, zodat de
            iconen op elke pagina exact dezelfde afmeting/uitlijning
            hebben — zie UitvoeringStappen.tsx voor de volledige
            toelichting (responsive gedrag, aspect-ratio-fix). */}
        <UitvoeringStappen stappen={UITVOERING_STAPPEN} />
      </section>

      <section id="materialen" className="scroll-mt-40 mb-14">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Materialen</h2>
        <p className="text-zinc-600 mb-6 max-w-2xl">
          Gijs werkt met verschillende isolatiematerialen. Welk materiaal het meest geschikt is, hangt af van jouw
          woning. Dit is geen keuze voor het &quot;beste&quot; materiaal.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPOUW_PRODUCTS.map(product => (
            <MaterialCard
              key={product.name}
              name={product.name}
              description={product.text}
              benefits={product.benefits}
              highlight={product.highlight}
              badge={product.badge}
              image={product.image}
              imageAlt={product.alt}
            />
          ))}
        </div>
        <p className="text-sm text-zinc-500 mt-5 max-w-2xl">
          Tijdens de energiescan wordt bekeken welk materiaal bij de woning en de bestaande situatie past. Twijfel je
          tussen isolatiemaatregelen? Bekijk ook{" "}
          <Link href="/maatregelen/dakisolatie" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">dakisolatie</Link>,{" "}
          <Link href="/maatregelen/vloerisolatie" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">vloerisolatie</Link>,{" "}
          <Link href="/maatregelen/isolatieglas" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">isolatieglas</Link>{" "}
          of{" "}
          <Link href="/maatregelen/kozijnen" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">kozijnen</Link>.
        </p>
      </section>

      <section id="voorwaarden" className="scroll-mt-40 mb-14">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Voorbereiding en voorwaarden</h2>
        <p className="text-zinc-600 mb-6 max-w-2xl">
          Voor een goede uitvoering gelden een paar praktische voorwaarden.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <ul className="flex flex-col gap-3">
              {VOORWAARDEN_LINKS.map(voorwaarde => (
                <li key={voorwaarde} className="flex items-start gap-3 text-zinc-700">
                  <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                  <span>{voorwaarde}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <ul className="flex flex-col gap-3">
              {VOORWAARDEN_RECHTS.map(voorwaarde => (
                <li key={voorwaarde} className="flex items-start gap-3 text-zinc-700">
                  <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                  <span>{voorwaarde}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section id="subsidie" className="scroll-mt-40 mb-14">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Subsidie bij spouwmuurisolatie</h2>
        <p className="text-zinc-600 mb-6 max-w-2xl">
          Laat je meer dan één isolatiemaatregel installeren? Dan verdubbelt het subsidiebedrag voor isolatie. Dit
          geldt ook als je een isolatiemaatregel combineert met de installatie van een warmtepomp. Gijs vraagt
          hiervoor subsidie aan binnen 24 maanden nadat je de eerste maatregel uitvoert.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mb-6">
          <Card className="flex flex-col gap-2 text-center !p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Bedrag wat je kunt ontvangen</span>
            <span className="text-2xl font-bold text-[var(--gijs-donkergroen)]">€ 40 – € 1.615</span>
          </Card>
          <Card className="flex flex-col gap-2 text-center !p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Per m² met 1 maatregel</span>
            <span className="text-2xl font-bold text-[var(--gijs-donkergroen)]">€ 5,25</span>
          </Card>
          <Card className="flex flex-col gap-2 text-center !p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Per m² met 2 maatregelen</span>
            <span className="text-2xl font-bold text-[var(--gijs-donkergroen)]">€ 10,50</span>
          </Card>
          <Card className="flex flex-col gap-2 text-center !p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Aantal m² met subsidie</span>
            <span className="text-2xl font-bold text-[var(--gijs-donkergroen)]">10 t/m 170 m²</span>
          </Card>
        </div>
        <p className="text-sm text-zinc-500 max-w-2xl">
          Gijs ondersteunt je graag bij het verzorgen van je subsidieaanvraag. Onze dienstverlening beperkt zich
          tot het faciliteren van de aanvraagprocedure, tegen een eenmalige administratievergoeding die is verwerkt
          in de begroting. Gijs kan de toekenning van subsidies niet garanderen en is niet verantwoordelijk voor
          eventuele onjuistheden in de verstrekte informatie of andere gerelateerde zaken.
        </p>
        <p className="text-sm text-zinc-500 max-w-2xl mt-3">
          Meer weten? Lees de{" "}
          <Link href="/kennis#subsidies" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">uitleg over subsidies en financiering</Link>{" "}
          of bekijk de{" "}
          <Link href="/contact#energiescan" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">gratis energiescan aan huis</Link>.
        </p>
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
            <Button href="/contact#energiescan" variant="accent">Plan een gratis energiescan</Button>
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
            <Image src="/huisscan.png" alt="" width={34} height={34} />
          </span>
          <div className="min-w-0 [&_h2]:[hyphens:auto]">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Past spouwmuurisolatie bij jouw woning?</h2>
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
