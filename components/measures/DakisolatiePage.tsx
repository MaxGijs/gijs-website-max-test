import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { DAK_PRODUCTS } from "@/lib/content/dakisolatie-products";
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

// Dakisolatiepagina, gebouwd op de spouwmuurisolatiepagina als template
// (zelfde structuur, componenten, spacing en stijl — zie
// components/measures/SpouwmuurisolatiePage.tsx). Alleen de inhoud gaat
// over dakisolatie.
//
// Bronnen: drie aangeleverde productbladen — pagina 1 (uitvoeringsstappen),
// pagina 2 (aanvullende voorwaarden + subsidie-informatie) en pagina 3
// (per materiaal: beschrijving, productvoordelen, productafbeelding — zie
// lib/content/dakisolatie-products.ts):
// - "Informatie dakisolatie zonder afwerking (HR WoodFibre) met
//   aanvullende voorwaarden.pdf"
// - "Informatie dakisolatie zonder afwerking (HR TimberWool) met
//   aanvullende voorwaarden.pdf"
// - "Informatie dakisolatie (HR EcoFoil) met aanvullende voorwaarden.pdf"
//
// LET OP — subsidiebedragen verschillen tussen de drie bladen:
// HR WoodFibre noemt € 425–€ 7.500 / € 21,25 per m² (1 maatregel) / € 37,50
// per m² (2 maatregelen); HR TimberWool en HR EcoFoil komen onderling
// overeen op € 325–€ 6.500 / € 16,25 / € 32,50. Het aantal m² (20 t/m 200)
// is in alle drie gelijk. Deze pagina toont de bedragen waarover twee van
// de drie bronnen overeenstemmen (TimberWool/EcoFoil) — dit is bewust geen
// automatische keuze voor de afwijkende WoodFibre-bedragen. Controleer dit
// met Max voordat de pagina live gaat.
//
// HR NatuWool en HR IcyFoam staan wel genoemd in de bestaande Gijs-content
// (measure-details.ts), maar de enige aangetroffen bronbladen hiervoor
// waren lege cloud-only placeholders (0 bytes) — geen bruikbare inhoud.
// Daarom bewust niet als materiaalkaart opgenomen (zie DAK_PRODUCTS).
//
// UITLEGVISUAL-VERVANGING: de afbeelding bij "Wat is dakisolatie?" is
// vervangen door de nieuw aangeleverde dakisolatie-uitlegvisual.png
// ("dakisolatie v.2.1.png" uit de aangeleverde ZIP, 5969×2744) — vervangt
// de eerdere Dakisolatie_voorbeeld.png (verwijderd, nergens anders
// gebruikt). Bevat de nummering/legenda (dakpannen/isolatiemateriaal/
// dakconstructie/binnenafwerking) al zelf; volle contentbreedte, geen
// crop (was eerder een vaste 4:3-crop met object-cover).
// CORRECTIE: de opdrachtgever leverde daarna een gecorrigeerde versie aan
// ("1.png" in productbladen, zelfde 5969×2744) — het leidinglijntje van
// label "1" wees in de eerdere export net naast de dakpannen (in de
// witruimte erboven) in plaats van ernaar toe. Geverifieerd via een
// pixel-diff tussen beide bestanden (enige verschilregio: rond label 1/
// "Dakpannen"); de rest van de afbeelding is ongewijzigd. Deze
// gecorrigeerde versie vervangt het eerdere bestand onder dezelfde naam.
//
// UITVOERINGSVISUAL — PROCES V2: deze sectie toonde eerder 6 losse SVG's
// (proces.zip) via het gedeelde UitvoeringStappen-component. De
// opdrachtgever leverde een volledig nieuwe, definitieve set aan ("proces
// v2"-map, submap "dakisolatie stappen") die de vorige set overal
// vervangt: elk bestand bevat nu icoon + nummerbadge + titel + een korte
// uitlegzin (voorheen alleen icoon + badge + titel, geen uitleg). Alle 6
// bestanden zijn hernoemd naar dakisolatie-stap-1.svg t/m -stap-6.svg
// (zie public/productbladen/proces/); de vorige set (stap-1.svg t/m
// stap-6.svg) is verwijderd. Titels en uitlegzinnen zijn ongewijzigd
// overgenomen zoals aangeleverd (niet herschreven).
const UITVOERING_STAPPEN = [
  { bestand: "dakisolatie-stap-1.svg", label: "Aankomst" },
  { bestand: "dakisolatie-stap-2.svg", label: "Uitleg" },
  { bestand: "dakisolatie-stap-3.svg", label: "Voorbereiden" },
  { bestand: "dakisolatie-stap-4.svg", label: "Isolatie aanbrengen" },
  { bestand: "dakisolatie-stap-5.svg", label: "Controle" },
  { bestand: "dakisolatie-stap-6.svg", label: "Oplevering" },
];
// Aanvullende voorwaarden — pagina 2 van de drie productbladen (wording
// verschilt per blad; hier samengevat op de gemeenschappelijke thema's).
// In twee groepen verdeeld: wat de woning/omgeving beschikbaar moet
// hebben (links) en wat er tijdens de uitvoering zelf gebeurt (rechts).
const VOORWAARDEN_LINKS = [
  "De te isoleren oppervlakken zijn voor aanvang van de werkzaamheden goed bereikbaar",
  "Zolderruimtes, vliering en knieschotten zijn voor aanvang van de werkzaamheden leeggemaakt",
  "Het dak is asbestvrij",
];
const VOORWAARDEN_RECHTS = [
  "Het isolatiemateriaal wordt aan de binnenzijde van het dak aangebracht",
  "Waar een folie- en lattenconstructie wordt gebruikt, is deze bedoeld om de isolatie op zijn plek te houden",
  "De (eind)afwerking is, afhankelijk van de toepassing, voor rekening van de opdrachtgever",
];

// Twee voordelen — de dakbrochures (Wood-Fibre/TimberWool/EcoFoil Roof)
// ondersteunen geen gedeelde derde voordeelclaim: Wood-Fibre is dampopen,
// EcoFoil Roof is juist dampdicht, en alleen TimberWool noemt onbrandbaar.
// In plaats van een generieke derde kaart ("lagere energievraag") te
// herhalen zoals bij spouw/vloer, blijft het bij twee sterke, dak-
// specifieke voordelen (zie instructie: liever twee sterke kaarten dan
// een derde niet-onderbouwde).
const VOORDELEN = [
  { icon: "thermometer", title: "Meer wooncomfort", text: "Een gelijkmatigere temperatuur in huis, ook via het dak." },
  { icon: "wind", title: "Minder warmteverlies via het dak", text: "Je woning verliest minder warmte via het dak." },
];

export function DakisolatiePage({ item }: { item: MeasurePageItem }) {
  const title = "Dakisolatie";
  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "voordelen", label: "Voordelen" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "materialen", label: "Materialen" },
    { id: "voorwaarden", label: "Voorwaarden" },
    { id: "subsidie", label: "Subsidie" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  // FAQ herzien (zie eindverslag in de conversatie voor de volledige
  // broncontrole per vraag). "Hoe verloopt de uitvoering?" is verwijderd:
  // die vraag herhaalde vrijwel woordelijk de iconenrij direct erboven
  // (geen verdieping, pure dubbeling). "Is dakisolatie brandveilig?" is
  // toegevoegd — sourced uit lib/content/dakisolatie-products.ts (HR
  // TimberWool: "Onbrandbaar (brandklasse A1)"); de andere twee systemen
  // claimen dit niet, dus het antwoord noemt bewust alleen TimberWool en
  // beweert niets over Wood-Fibre/EcoFoil. Overige vragen behouden,
  // opnieuw geordend op klantprioriteit (geschiktheid → materialen →
  // voorbereiding → overige).
  const faqItems: FAQItem[] = [
    { question: "Is mijn dak geschikt voor dakisolatie?", answer: "Dat hangt af van de bestaande dakconstructie en de staat van het dak. Gijs beoordeelt dit tijdens de energiescan. Dit is geen definitief technisch advies vooraf." },
    { question: "Welke soorten dakisolatie gebruikt Gijs?", answer: "Gijs werkt onder andere met houtvezelisolatie (HR Wood-Fibre), inblaaswol (HR TimberWool) en reflecterende folie-isolatie (HR EcoFoil Roof). Welk systeem past, hangt af van je dakconstructie." },
    { question: "Is dakisolatie brandveilig?", answer: "Dat hangt af van het gekozen materiaal. HR TimberWool is bijvoorbeeld onbrandbaar (brandklasse A1). Tijdens de energiescan bekijkt Gijs welk systeem bij jouw dak past." },
    { question: "Wat moet ik vooraf voorbereiden?", answer: "Zorg dat de te isoleren oppervlakken bereikbaar zijn en dat zolderruimtes, vliering en knieschotten leeg zijn. Het dak moet asbestvrij zijn." },
    { question: "Wordt de binnenzijde afgewerkt?", answer: "Niet altijd. Bij sommige systemen blijft een folie- en lattenconstructie zichtbaar; de (eind)afwerking is dan voor rekening van de opdrachtgever." },
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
        label="MAATREGEL"
        title={title}
        subtitle="Meer wooncomfort, minder warmteverlies via het dak"
        intro="Gijs isoleert het dak aan de binnenzijde. Hieronder lees je hoe het werkt, welk systeem bij jouw dakconstructie past en hoe de uitvoering en de energiescan verlopen."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Plan een gratis energiescan", href: "/contact#energiescan" }}
        image="/productbladen/57bfad47-7c34-4f85-80dd-7b3f2f1bf8a4.png"
        imageAlt="Plaatsen van dakisolatie aan de binnenzijde van een woning"
        imageCaption="Isolatiemateriaal wordt tussen de dakconstructie aangebracht"
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
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is dakisolatie?</h2>
          <p className="text-lg font-medium text-[var(--gijs-donkergroen)]">
            Zie dakisolatie als een muts voor je huis. Een isolatielaag bij het dak helpt de warmte beter binnen
            te houden.
          </p>
          <p className="text-zinc-600">
            Gijs isoleert het dak aan de binnenzijde. Het isolatiemateriaal komt tussen of tegen de bestaande
            dakconstructie. Gijs werkt hiervoor met houtvezel (HR Wood-Fibre), isolatiewol (HR TimberWool) of een
            reflecterend foliesysteem (HR EcoFoil Roof).
          </p>
          <p className="text-zinc-600">
            Bij sommige systemen blijft een folie- en lattenconstructie zichtbaar; de (eind)afwerking van de
            binnenzijde is dan een apart punt, voor rekening van de opdrachtgever.
          </p>
          <p className="text-zinc-600">
            Welk systeem past, hangt af van de bestaande dakconstructie en de staat van het dak. Daar hoef je zelf
            niet technisch uit te komen: tijdens een energiescan aan huis bekijkt een expert van Gijs je dak en
            bespreekt welke oplossing past.
          </p>
        </div>
        <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] mt-8 max-w-[820px] mx-auto">
          {/* PNG vervangen door SVG: zelfde crop/inhoud (ratio geverifieerd),
              de opdrachtgever heeft alleen de hoekafronding van de
              labels/badges aangepast (uitlegvisuals.zip). */}
          <Image
            src="/productbladen/dakisolatie-uitlegvisual.svg"
            alt="Uitleg van dakpannen, isolatiemateriaal, dakconstructie en binnenafwerking bij dakisolatie"
            width={5969}
            height={2744}
            quality={100}
            className="w-full h-auto"
          />
        </div>

        <div className="mt-10">
          <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Hoe wordt jouw dak geïsoleerd?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {DAK_PRODUCTS.map(product => (
              <div key={product.name} className="flex flex-col gap-1">
                <h4 className="font-bold text-[var(--gijs-donkergroen)]">{product.name}</h4>
                <p className="text-sm text-zinc-600">{product.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Card variant="tint" className="mt-8 flex flex-col md:flex-row md:items-center gap-6 !p-8">
          <div className="md:flex-1 flex flex-col gap-1">
            <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Past dakisolatie bij mijn woning?</h3>
            <p className="text-sm text-zinc-600">Tijdens de energiescan wordt beoordeeld welke toepassing bij de bestaande dakconstructie mogelijk is.</p>
          </div>
          <ul className="md:flex-[1.6] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>De bestaande dakconstructie en staat van het dak</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>De bereikbaarheid en eventueel al aanwezige isolatie</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>De eventuele binnenafwerking is een apart aandachtspunt</span>
            </li>
          </ul>
          <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
        </Card>
      </section>

      <section id="voordelen" className="scroll-mt-40 mb-14">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">De voordelen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
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
          Gijs werkt met verschillende isolatiesystemen: houtvezel, isolatiewol en andere systemen. Welk systeem het
          meest geschikt is, hangt af van jouw dakconstructie. Dit is geen keuze voor het &quot;beste&quot; systeem.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DAK_PRODUCTS.map(product => (
            <MaterialCard
              key={product.name}
              name={product.name}
              description={product.text}
              benefits={product.benefits}
              image={product.image}
              imageAlt={product.alt}
              badge={product.badge}
            />
          ))}
        </div>
        <p className="text-sm text-zinc-500 mt-5 max-w-2xl">
          Tijdens de energiescan wordt bekeken welk systeem bij de woning en de bestaande dakconstructie past. Twijfel je
          tussen isolatiemaatregelen? Bekijk ook{" "}
          <Link href="/maatregelen/spouwmuurisolatie" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">spouwmuurisolatie</Link>,{" "}
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
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Subsidie bij dakisolatie</h2>
        <p className="text-zinc-600 mb-6 max-w-2xl">
          Laat je meer dan één isolatiemaatregel installeren? Dan verdubbelt het subsidiebedrag voor isolatie. Dit
          geldt ook als je een isolatiemaatregel combineert met de installatie van een warmtepomp. Gijs vraagt
          hiervoor subsidie aan binnen 24 maanden nadat je de eerste maatregel uitvoert.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mb-6">
          <Card className="flex flex-col gap-2 text-center !p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Bedrag wat je kunt ontvangen</span>
            <span className="text-2xl font-bold text-[var(--gijs-donkergroen)]">€ 325 – € 6.500</span>
          </Card>
          <Card className="flex flex-col gap-2 text-center !p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Per m² met 1 maatregel</span>
            <span className="text-2xl font-bold text-[var(--gijs-donkergroen)]">€ 16,25</span>
          </Card>
          <Card className="flex flex-col gap-2 text-center !p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Per m² met 2 maatregelen</span>
            <span className="text-2xl font-bold text-[var(--gijs-donkergroen)]">€ 32,50</span>
          </Card>
          <Card className="flex flex-col gap-2 text-center !p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Aantal m² met subsidie</span>
            <span className="text-2xl font-bold text-[var(--gijs-donkergroen)]">20 t/m 200 m²</span>
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
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Past dakisolatie bij jouw woning?</h2>
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
