import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { VLOER_PRODUCTS } from "@/lib/content/vloerisolatie-products";
import { CONTACT } from "@/lib/content/contact";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { MeasureHero } from "@/components/measures/MeasureHero";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { MaterialCard } from "@/components/measures/MaterialCard";
import { UitvoeringStappen } from "@/components/measures/UitvoeringStappen";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { FeatureList } from "@/components/measures/FeatureList";
import { StatRow } from "@/components/measures/StatRow";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Vloerisolatiepagina, gebouwd op de spouwmuurisolatiepagina als template
// (zelfde structuur, componenten, spacing en stijl — zie
// components/measures/SpouwmuurisolatiePage.tsx). Alleen de inhoud gaat
// over vloerisolatie.
//
// Bronnen: drie aangeleverde productbladen — pagina 1 (uitvoeringsstappen),
// pagina 2 (aanvullende voorwaarden + subsidie-informatie) en pagina 3
// (per materiaal: beschrijving, productvoordelen, productafbeelding — zie
// lib/content/vloerisolatie-products.ts; voor GijsFloor ook pagina 4,
// kwaliteitsverklaringen):
// - "Informatie vloerisolatie (GijsFloor) met aanvullende voorwaarden.pdf"
// - "Informatie vloerisolatie (HR EcoSpray) met aanvullende voorwaarden.pdf"
// - "Informatie vloerisolatie (Icynene) met aanvullende voorwaarden.pdf"
//
// Subsidiebedragen zijn in alle drie de bladen identiek (geen
// discrepantie, in tegenstelling tot dakisolatie). De aanvullende
// voorwaarden verschillen wel: EcoSpray en Icynene noemen twee extra
// voorwaarden (droge/stofvrije/vetvrije ondergrond, parkeergelegenheid
// voor een vrachtwagen van 14 meter) die niet in het GijsFloor-blad staan
// — dit is expliciet gelabeld in de voorwaardensectie hieronder.
//
// De uitvoeringsstappen verschillen ook licht: bij EcoSpray/Icynene
// (spuitschuim) adviseert Gijs om tijdens de werkzaamheden niet in de
// woning aanwezig te zijn; bij GijsFloor (een vast isolatiesysteem) komt
// dit niet voor. Stap 3 hieronder is daarom bewust als "waar van
// toepassing" geformuleerd in plaats van een universele claim.
//
// UITLEGVISUAL-VERVANGING: de afbeelding bij "Wat is vloerisolatie?" is
// vervangen door de nieuw aangeleverde vloerisolatie-uitlegvisual.png
// ("vloerisolatiev2.1.png" uit de aangeleverde ZIP, 6747×3188) — vervangt
// de eerdere uitleg_vloerisolatie.png (verwijderd, nergens anders
// gebruikt; dit was zelf al het resultaat van een eerdere re-export-
// reeks v1.2–v1.6 uit een vorige sessie). Bevat de nummering/legenda
// (begane grondvloer/vloerisolatie/kruipruimte) al zelf; volle
// contentbreedte, geen crop (was eerder een vaste 4:3-crop met
// object-cover).
// UITVOERINGSVISUAL — PROCES V2: net als bij dakisolatie en
// spouwmuurisolatie (zie DakisolatiePage.tsx) is de eerdere set losse
// SVG's volledig vervangen door de definitieve "proces v2"-set (submap
// "vloerisolatie stappen"): elk bestand bevat nu icoon + nummerbadge +
// titel + een korte uitlegzin. Alle 6 bestanden zijn hernoemd naar
// vloerisolatie-stap-1.svg t/m -stap-6.svg; de vorige bestanden
// (stap-1/2/5/6.svg, stap-3/4-vloerisolatie.svg) zijn verwijderd. Titels
// ongewijzigd overgenomen.
//
// LET OP — informatie NIET verloren: de oude stap 3-beschrijving bevatte
// een praktisch/veiligheidsrelevant advies dat nergens anders op deze
// pagina stond ("bij spuitschuim-systemen wordt geadviseerd tijdens de
// werkzaamheden niet in de woning aanwezig te zijn", voor EcoSpray/
// Icynene). Ook de nieuwe v2-uitlegzinnen dekken dit niet (generiek: "De
// kruipruimte en werkplek worden voorbereid"), dus dit advies blijft als
// aparte notitie onder de stappenrij staan in plaats van stilzwijgend te
// laten vervallen.
const UITVOERING_STAPPEN = [
  { bestand: "maatregelen/vloerisolatie/proces/vloerisolatie-stap-1.svg", label: "Aankomst" },
  { bestand: "maatregelen/vloerisolatie/proces/vloerisolatie-stap-2.svg", label: "Uitleg" },
  { bestand: "maatregelen/vloerisolatie/proces/vloerisolatie-stap-3.svg", label: "Voorbereiden" },
  { bestand: "maatregelen/vloerisolatie/proces/vloerisolatie-stap-4.svg", label: "Isolatie aanbrengen" },
  { bestand: "maatregelen/vloerisolatie/proces/vloerisolatie-stap-5.svg", label: "Controle" },
  { bestand: "maatregelen/vloerisolatie/proces/vloerisolatie-stap-6.svg", label: "Oplevering" },
];

// Aanvullende voorwaarden — pagina 2 van de drie productbladen. De
// voorwaarden links gelden voor alle systemen; de voorwaarden rechts
// staan alleen in de HR EcoSpray- en Icynene-bladen (niet in GijsFloor).
const VOORWAARDEN_ALGEMEEN = [
  "De kruipruimte is goed geventileerd en bereikbaar",
  "Er is geen staand water aanwezig tijdens de uitvoering",
  "Minimale werkhoogte van 45 cm en een kruipluik van minimaal 60 bij 40 cm",
  "De kruipruimte is puin- en asbestvrij",
];
const VOORWAARDEN_SPUITSYSTEMEN = [
  "De ondergrond is droog, stofvrij en vetvrij",
  "Er is parkeergelegenheid voor een vrachtwagen van 14 meter",
];

// Twee voordelen — de vloerbrochures (GijsFloor/HR EcoSpray/Icynene)
// ondersteunen geen gedeelde derde voordeelclaim die voor alle drie
// materialen geldt (GijsFloor is hypoallergeen, de spuitsystemen zijn
// waterafstotend — geen van beide is materiaal-overstijgend). In plaats
// van een generieke derde kaart te herhalen zoals bij spouw, blijft het
// bij twee sterke, vloer-specifieke voordelen.
const VOORDELEN = [
  { icon: "thermometer", title: "Warmere vloer", text: "Een warmere vloer en minder kou vanuit de kruipruimte." },
  { icon: "wind", title: "Minder warmteverlies via de vloer", text: "Je woning verliest minder warmte via de begane grondvloer." },
];

export function VloerisolatiePage({ item }: { item: MeasurePageItem }) {
  const title = "Vloerisolatie";
  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "voordelen", label: "Voordelen" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "materialen", label: "Materialen" },
    { id: "voorwaarden", label: "Voorwaarden" },
    { id: "subsidie", label: "Subsidie" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  // FAQ herzien (zie eindverslag): "Hoe hoog moet mijn kruipruimte
  // zijn..." en "Wat gebeurt er als er water in mijn kruipruimte
  // staat?" zijn verwijderd — beide herhaalden een voorwaarde die al twee
  // keer op de pagina stond (de lijst bij "Alles begint in de
  // kruipruimte" én de Voorwaarden-sectie), zonder iets toe te voegen.
  // "Is vloerisolatie stofvrij te verwerken?" is toegevoegd — sourced uit
  // lib/content/vloerisolatie-products.ts (GijsFloor: "Hypoallergeen en
  // bij verwerking komt er geen (fijn)stof vrij"), een praktisch
  // relevant feit dat nergens anders op de pagina naar voren kwam.
  const faqItems: FAQItem[] = [
    { question: "Is mijn kruipruimte geschikt voor vloerisolatie?", answer: "Dat hangt af van de bereikbaarheid, ventilatie en staat van de kruipruimte. Gijs beoordeelt dit tijdens de energiescan. Dit is geen definitief technisch advies vooraf." },
    { question: "Welke materialen gebruikt Gijs?", answer: "Gijs werkt onder andere met reflecterende folie-isolatie, PUR-schuim en opencellige schuimsprayisolatie. Welk materiaal past, hangt af van de vloer en de kruipruimte." },
    { question: "Kan vloerisolatie bij een houten vloer?", answer: "Ja, reflecterende folie-isolatie kan bijvoorbeeld worden toegepast onder zowel houten als steenachtige begane grondvloeren." },
    { question: "Is vloerisolatie stofvrij te verwerken?", answer: "Bij reflecterende folie-isolatie komt tijdens de verwerking geen (fijn)stof vrij en is het materiaal hypoallergeen." },
    { question: "Is spuitschuim veilig?", answer: "Gezondheidsklachten bij spuitschuim ontstaan vrijwel alleen wanneer de twee grondstoffen ter plaatse in de verkeerde verhouding worden gemengd. Onafhankelijk onderzoek laat zien dat de kans op klachten bij correcte verwerking klein is. Daarom wordt geadviseerd om tijdens het spuiten zelf niet in de woning aanwezig te zijn." },
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
        subtitle="Een warmere vloer, minder warmteverlies"
        intro="Gijs brengt vloerisolatie aan de onderzijde van de begane grondvloer aan, vanuit de kruipruimte. Hieronder lees je hoe het werkt, welke materialen Gijs gebruikt en hoe de uitvoering en de energiescan verlopen."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Plan een gratis energiescan", href: "/contact#energiescan" }}
        image="/images/maatregelen/vloerisolatie/hero_vloerisolatie.png"
        imageAlt="Vloerisolatie wordt vanuit de kruipruimte tegen de onderzijde van de vloer aangebracht"
        imageCaption="Isolatiemateriaal wordt tegen de onderzijde van de vloer aangebracht"
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
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is vloerisolatie?</h2>
          <p className="text-lg font-medium text-[var(--gijs-donkergroen)]">
            Zie vloerisolatie als warme sokken voor je vloer. Je woning verliest minder warmte via de begane
            grondvloer.
          </p>
          <p className="text-zinc-600">
            Het isolatiemateriaal wordt aan de onderkant van de begane grondvloer aangebracht, vanuit de
            kruipruimte. Gijs werkt hiervoor met folie-isolatie, PUR-schuim en schuimsprayisolatie, die elk op een eigen manier
            worden aangebracht.
          </p>
          <p className="text-zinc-600">
            Welke oplossing past, hangt af van de vloer en de kruipruimte. Daar hoef je zelf niet technisch uit te
            komen: tijdens een energiescan aan huis bekijkt een expert van Gijs de vloer, de kruipruimte en hoe
            goed die bereikbaar is, en bespreekt welke oplossing past.
          </p>
        </div>
        <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] mt-8 max-w-[820px] mx-auto">
          {/* PNG vervangen door SVG: zelfde crop/inhoud (ratio geverifieerd),
              de opdrachtgever heeft alleen de hoekafronding van de
              labels/badges aangepast (uitlegvisuals.zip). */}
          <Image
            src="/images/maatregelen/vloerisolatie/vloerisolatie-uitlegvisual.svg"
            alt="Uitleg van begane grondvloer, vloerisolatie en kruipruimte"
            width={6747}
            height={3188}
            quality={100}
            className="w-full h-auto"
          />
        </div>

        <div className="mt-10">
          <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-1">Alles begint in de kruipruimte</h3>
          <p className="text-sm text-zinc-600 mb-4 max-w-2xl">Voordat er isolatiemateriaal wordt aangebracht, beoordeelt Gijs eerst de kruipruimte zelf.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VOORWAARDEN_ALGEMEEN.map(voorwaarde => (
              <li key={voorwaarde} className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>{voorwaarde}</span>
              </li>
            ))}
          </ul>
        </div>

        <Card variant="tint" className="mt-8 flex flex-col md:flex-row md:items-center gap-6 !p-8">
          <div className="md:flex-1 flex flex-col gap-1">
            <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Past vloerisolatie bij mijn woning?</h3>
            <p className="text-sm text-zinc-600">Tijdens de energiescan wordt beoordeeld of de kruipruimte geschikt is voor vloerisolatie.</p>
          </div>
          <ul className="md:flex-[1.6] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>De kruipruimte is bereikbaar en goed geventileerd</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>Er is geen staand water aanwezig tijdens de uitvoering</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>De kruipruimte is puin- en asbestvrij, met voldoende werkhoogte en een toegankelijk kruipluik</span>
            </li>
          </ul>
          <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
        </Card>
      </section>

      <section id="voordelen" className="scroll-mt-40 mb-14">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">De voordelen</h2>
        <div className="max-w-2xl">
          <FeatureList columns={2} items={VOORDELEN} />
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
        <p className="text-sm text-zinc-500 mt-4 max-w-2xl">
          Bij spuitschuim-systemen (PUR-schuim en schuimsprayisolatie) wordt geadviseerd om tijdens de werkzaamheden niet in de
          woning aanwezig te zijn.
        </p>
      </section>

      <section id="materialen" className="scroll-mt-40 mb-14">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Materialen</h2>
        <p className="text-zinc-600 mb-6 max-w-2xl">
          Gijs werkt met verschillende isolatiesystemen voor de vloer. Welk systeem het meest geschikt is, hangt af
          van jouw vloer en kruipruimte. Dit is geen keuze voor het &quot;beste&quot; systeem.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {VLOER_PRODUCTS.map(product => (
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
          Tijdens de energiescan wordt bekeken welk systeem bij de woning en de bestaande situatie past. Twijfel je
          tussen isolatiemaatregelen? Bekijk ook{" "}
          <Link href="/maatregelen/spouwmuurisolatie" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">spouwmuurisolatie</Link>,{" "}
          <Link href="/maatregelen/dakisolatie" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">dakisolatie</Link>,{" "}
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
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Voor alle systemen</p>
            <ul className="flex flex-col gap-3">
              {VOORWAARDEN_ALGEMEEN.map(voorwaarde => (
                <li key={voorwaarde} className="flex items-start gap-3 text-zinc-700">
                  <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                  <span>{voorwaarde}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Aanvullend bij PUR-schuim en schuimsprayisolatie</p>
            <ul className="flex flex-col gap-3">
              {VOORWAARDEN_SPUITSYSTEMEN.map(voorwaarde => (
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
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Subsidie bij vloerisolatie</h2>
        <p className="text-zinc-600 mb-6 max-w-2xl">
          Laat je meer dan één isolatiemaatregel installeren? Dan verdubbelt het subsidiebedrag voor isolatie. Dit
          geldt ook als je een isolatiemaatregel combineert met de installatie van een warmtepomp. Gijs vraagt
          hiervoor subsidie aan binnen 24 maanden nadat je de eerste maatregel uitvoert.
        </p>
        <div className="mb-8">
          <StatRow
            items={[
              { label: "Bedrag wat je kunt ontvangen", value: "€ 110 – € 1.690" },
              { label: "Per m² met 1 maatregel", value: "€ 5,50" },
              { label: "Per m² met 2 maatregelen", value: "€ 11" },
              { label: "Aantal m² met subsidie", value: "20 t/m 130 m²" },
            ]}
          />
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
            <Image src="/images/shared/icons/huisscan.png" alt="" width={34} height={34} />
          </span>
          <div className="min-w-0 [&_h2]:[hyphens:auto]">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Past vloerisolatie bij jouw woning?</h2>
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
