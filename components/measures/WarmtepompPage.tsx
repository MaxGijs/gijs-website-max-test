import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { WARMTEPOMP_PRODUCTEN } from "@/lib/content/warmtepomp-producten";
import { CONTACT } from "@/lib/content/contact";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { MeasureHero } from "@/components/measures/MeasureHero";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { UitvoeringStappen, type UitvoeringStap } from "@/components/measures/UitvoeringStappen";
import { TechnicalDetails, TechnicalDetailRow } from "@/components/measures/TechnicalDetails";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { FeatureList } from "@/components/measures/FeatureList";
import { VoorwaardenKolommen } from "@/components/measures/VoorwaardenKolommen";
import { HOOFDSTUK_MB, HOOFDSTUK_DIVIDER } from "@/components/measures/sectionRhythm";
import { StatRow } from "@/components/measures/StatRow";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Warmtepomppagina, gebouwd in dezelfde stijl als de andere
// maatregelpagina's (MeasureHero/MeasureSectionNav/Card/Button/Icon/
// UitvoeringStappen/FAQAccordion).
//
// BRONNEN (zie het eindverslag voor de volledige, per-claim bronverwijzing):
// - "alle_brochures_in_1.pdf" (pagina 42-46 van 49): het 6-stappen
//   installatieproces ("Hybride warmtepomp plaatsen in één dag"), de
//   "Aanvullende voorwaarden voor hybride warmtepomp" en de
//   subsidietabel. Deze pagina's zijn generiek (niet merkgebonden) en
//   gebruikt voor UITVOERING_STAPPEN, VOORWAARDEN en de subsidiesectie.
// - Warmtepomp-ZIP: "deWarmte/Brochure hybride warmtepomp deWarmte van
//   Gijs April 2025.pdf" (incl. het officiële datasheet op de laatste
//   pagina's) en "deWarmte/Productblad deWarmte van Gijs.pdf" voor alle
//   DeWarmte-gegevens; "Hybride-warmtepomp-Gijs.pdf" (dit is, ondanks de
//   generieke bestandsnaam, de volledige Remeha Elga Ace-brochure) voor
//   Elga Ace; "Gijs-brochure-warmtepomp-Xtend-Intergas.pdf" voor Intergas
//   Xtend. Zie lib/content/warmtepomp-producten.ts voor de volledige
//   gegevens per product.
// - "Wat is een hybride warmtepomp?" is samengesteld uit een zin die
//   vrijwel woordelijk terugkomt in zowel de Elga Ace- als de
//   Xtend-brochure ("Een hybride installatie in je huis bestaat uit een
//   hybride warmtepomp en een cv-ketel..."), en daarom behandeld als de
//   generieke, merkneutrale Gijs-formulering.
// - De "onderdelen"-uitleg (buitenunit/binnenunit/cv-ketel/thermostaat)
//   komt letterlijk uit de Elga Ace-brochure: "Het systeem bestaat uit:
//   een binnenunit, een buitenunit, de (bestaande) cv-ketel, een
//   thermostaat." Er is geen apart uitlegschema (zoals bij zonnepanelen)
//   aangeleverd voor warmtepomp, dus deze sectie gebruikt alleen tekst +
//   iconen, geen los diagram.
//
// NIET GEBRUIKT (bewust weggelaten, zie eindverslag voor de volledige
// lijst): COP/sCOP/energieklasse, alle prijzen en meerkosten, alle
// gasbesparingspercentages ("tot 85%", "tot 80%", "bespaar 25%"), en de
// Bosch/Nefit/WeHeat-brochures (niet met naam genoemd in de opdracht en
// niet elders bevestigd als actueel Gijs-aanbod).
//
// TEGENSTRIJDIGHEDEN TUSSEN BRONNEN (bewust niet zelf opgelost):
// - De verkorte "Productblad hybride warmtepomp van Gijs"-pagina in
//   alle_brochures_in_1.pdf noemt de maten 492×268×220mm "Afmeting
//   binnendeel" bij Elga Ace. De volledige Remeha-technische tabel in
//   "Hybride-warmtepomp-Gijs.pdf" toont exact diezelfde maten echter als
//   "Buitenunit (HxBxD)" — met een heel andere binnenunit-maat
//   (550×849×342mm voor 4kW). Deze pagina gebruikt de volledige,
//   duidelijk per-uitvoering gespecificeerde Remeha-tabel als leidend.
// - De ISDE-subsidiebedragen verschillen tussen bronnen: de generieke
//   Gijs-tabel (alle_brochures_in_1.pdf) noemt €1.700/€1.800/€2.000 voor
//   4/5/6 kW, de Elga Ace-brochure noemt €1.600 (4kW) en €1.800 (6kW).
//   Deze pagina toont alleen de generieke Gijs-tabel; het Elga
//   Ace-specifieke bedrag is niet gebruikt.
// - De "Aanvullende voorwaarden"-lijst komt op twee vrijwel identieke
//   pagina's voor (42-44 en 45-46), maar de tweede versie mist het punt
//   over de digitale inspectie. Deze pagina gebruikt de volledige lijst
//   (9 punten, pagina 44).
// - Het gewicht van de Pomp MP wijkt af tussen de marketingtekst ("134
//   kg") en het officiële Datasheet Pomp MP ("150 kg") in dezelfde
//   november 2025-brochure. Het datasheet-gewicht is leidend gebruikt.
//
// VEREENVOUDIGING VOOR LEKEN (contentaudit, geen redesign): de
// intro-alinea bij "Wat is een hybride warmtepomp?" is herschreven om
// "compressie" en "gesloten systeem" te vermijden (dezelfde feiten,
// eenvoudiger verwoord). De Pomp MP-kenmerken noemden "GWP" zonder
// uitleg — vervangen door "beperkte impact op het klimaat" (zelfde
// brongegeven: propaan-koudemiddel met een lage GWP-waarde, nu zonder
// onuitgelegde afkorting). VOORWAARDEN_VOOR is herschreven vanuit het
// perspectief van de bewoner (bijv. "warmteafgiftesysteem" → "je
// bestaande verwarmingssysteem", "Opdrachtgever" → "je") zonder de
// inhoud te wijzigen. Een FAQ-item over ISDE is toegevoegd.
//
// HERO-VERVANGING: de hero-foto is vervangen door een nieuwe, echte
// Gijs-installatiefoto ("warmtepomp_hero.png" uit een aangeleverde
// Archief.zip) — een Gijs-installateur die een DeWarmte-warmtepomp
// tegen de gevel plaatst. Bijgesneden van 1672×941 naar 1344×941 (de
// vaste 10:7-heroverhouding die alle maatregelpagina's gebruiken),
// waarbij is gekozen de linkerkant (buurhuis/planten) in te korten in
// plaats van de installateur of de warmtepomp zelf. Vervangt de vorige
// hero-foto onder dezelfde bestandsnaam (warmtepomp-hero.png).
//
// UPDATE (aanvullende bron): de apart aangeleverde "Brochure DeWarmte
// Hybride warmtepomp 112025-gecomprimeerd.pdf" (versie november 2025,
// 30 pagina's, incl. het officiële Datasheet Pomp MP) introduceert een
// tweede, groter DeWarmte-model: de Pomp MP (1,9-16,5 kW, koudemiddel
// propaan R290, tot 70°C afgiftetemperatuur). Deze is toegevoegd als
// tweede DeWarmte-product naast de Pomp AO. Bewust niet gebruikt uit
// deze nieuwe bron: de concurrentievergelijking met "een traditionele
// hybride pomp van de lokale loodgieter" (ongenuanceerde marketing, niet
// gevraagd), het "gemiddeld 9% woningwaardestijging"-cijfer, de
// "Dubbele Pomp MP" (nichetoepassing), klantreviews/sterrenscores, en
// alle prijzen/meerkosten/onderhoudscontract-tarieven.
const UITVOERING_STAPPEN: UitvoeringStap[] = [
  { bestand: "maatregelen/warmtepomp/proces/warmtepomp-stap-1.svg", label: "Aankomst" },
  { bestand: "maatregelen/warmtepomp/proces/warmtepomp-stap-2.svg", label: "Uitleg" },
  { bestand: "maatregelen/warmtepomp/proces/warmtepomp-stap-3.svg", label: "Voorbereiding" },
  { bestand: "maatregelen/warmtepomp/proces/warmtepomp-stap-4.svg", label: "Buitenunit plaatsen" },
  { bestand: "maatregelen/warmtepomp/proces/warmtepomp-stap-5.svg", label: "Opleveren" },
  { bestand: "maatregelen/warmtepomp/proces/warmtepomp-stap-6.svg", label: "Genieten" },
];

// Bron: "alle_brochures_in_1.pdf", pagina 44 — "Aanvullende voorwaarden
// voor hybride warmtepomp" (9 punten, zie code-comment hierboven voor de
// afwijkende, kortere versie elders in dezelfde bron).
const VOORWAARDEN_VOOR = [
  "De woning is voldoende geïsoleerd.",
  "Gijs controleert of je bestaande verwarmingssysteem geschikt is voor een hybride warmtepomp.",
  "De uitvoerder wijst een geschikte plek voor de buitenunit aan.",
  "Voor de start van de werkzaamheden vindt een digitale inspectie plaats.",
  "Je sluit een onderhoudscontract af, voor een optimale werking van de warmtepomp.",
];
const VOORWAARDEN_TIJDENS = [
  "Voor aanvang van de werkzaamheden zijn de aangewezen locaties bereikbaar en toegankelijk.",
  "Mits van toepassing wordt de oude ketel verwijderd.",
  "Er is een toilet beschikbaar voor de uitvoerders.",
  "De werkruimte is voor aanvang asbestvrij.",
];

// Bron: "alle_brochures_in_1.pdf", pagina 44 — "Subsidiemogelijkheden bij
// hybride warmtepomp".
const SUBSIDIE_TABEL = [
  { vermogen: "4 kW", bedrag: "€ 1.700,-" },
  { vermogen: "5 kW", bedrag: "€ 1.800,-" },
  { vermogen: "6 kW", bedrag: "€ 2.000,-" },
];

// Voordelen: overgenomen uit de DeWarmte-bron (Gijs' primaire
// warmtepomppartner), niet gemengd met Elga Ace- of Xtend-voordelen.
const VOORDELEN = WARMTEPOMP_PRODUCTEN[0].kenmerken.slice(0, 4);

export function WarmtepompPage({ item }: { item: MeasurePageItem }) {
  const title = "Warmtepomp";
  const dewarmteAO = WARMTEPOMP_PRODUCTEN[0];
  const dewarmteMP = WARMTEPOMP_PRODUCTEN[1];
  const andereWarmtepompen = WARMTEPOMP_PRODUCTEN.slice(2);

  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "past-het", label: "Past het bij mij?" },
    { id: "voordelen", label: "De voordelen" },
    { id: "meest-geplaatst", label: "Meest geplaatst" },
    { id: "andere-warmtepompen", label: "Andere warmtepompen" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "voorwaarden", label: "Voorwaarden" },
    { id: "subsidie", label: "Subsidie" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  const faqItems: FAQItem[] = [
    { question: "Wat is een hybride warmtepomp?", answer: "Een hybride installatie bestaat uit een hybride warmtepomp en een cv-ketel. De warmtepomp haalt warmte uit de buitenlucht en gebruikt die om je woning te verwarmen. De cv-ketel blijft aanwezig en springt bij wanneer dat nodig is." },
    { question: "Wat betekent ISDE?", answer: "ISDE staat voor Investeringssubsidie duurzame energie en warmtepompen: de subsidieregeling waarmee je de aanschaf van een hybride warmtepomp deels vergoed kunt krijgen." },
    { question: "Blijft mijn cv-ketel aanwezig?", answer: "Ja. Bij een gecombineerde installatie zorgt de warmtepomp grotendeels voor de verwarming van de woning, en levert de cv-ketel het warme water en eventuele bijverwarming bij lage buitentemperaturen. Het schakelen tussen cv-ketel en warmtepomp gebeurt automatisch." },
    { question: "Is mijn woning geschikt voor een hybride warmtepomp?", answer: "De woning moet voldoende geïsoleerd zijn en je bestaande verwarmingssysteem moet geschikt zijn. Dit wordt vooraf beoordeeld tijdens een digitale inspectie." },
    { question: "Waar komt de buitenunit te staan?", answer: "Een geschikte locatie voor het buitendeel wordt aangewezen door de uitvoerder." },
    { question: "Hoe groot is de warmtepomp?", answer: "Dat verschilt per merk en model. Bekijk hieronder de afmetingen van elke warmtepomp die Gijs plaatst." },
    { question: "Hoeveel geluid maakt de warmtepomp?", answer: "Ook dit verschilt per merk en model; de exacte dB(A)-waarden per product en meetafstand staan hieronder. De warmtepomp die Gijs het meest plaatst heeft bijvoorbeeld een stille modus die 's nachts (23.00-07.00 uur) automatisch inschakelt." },
    { question: "Hoe verloopt de installatie?", answer: "Gijs plaatst de hybride warmtepomp in één dag, volgens een vaste aanpak: aankomst, uitleg, voorbereiding van het leidingwerk, het plaatsen en aansluiten van de buitenunit, inregelen en opleveren." },
    { question: "Is een onderhoudscontract nodig?", answer: "Ja, voor een optimale werking sluit de opdrachtgever een onderhoudscontract af." },
    { question: "Kan ik subsidie krijgen voor een hybride warmtepomp?", answer: "Ja, via de ISDE-subsidie. Het basisbedrag is € 1.250, met een geschatte subsidie tot € 2.000 afhankelijk van het vermogen van de warmtepomp. Gijs ondersteunt bij de aanvraag, maar kan toekenning niet garanderen." },
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
        label="Installaties"
        title="Hybride warmtepomp voor jouw woning"
        subtitle="Hybride warmtepomp plaatsen in één dag"
        intro="Een hybride warmtepomp werkt samen met je cv-ketel: de warmtepomp haalt warmte uit de buitenlucht, de cv-ketel springt bij wanneer dat nodig is. Gijs werkt hiervoor samen met een vaste warmtepomppartner."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Vraag een gratis energiescan aan", href: "/contact#energiescan" }}
        image="/images/maatregelen/warmtepomp/warmtepomp-hero.png"
        imageAlt="Een Gijs-installateur plaatst een hybride warmtepomp tegen de gevel van een woning"
      />

      <div>
        <MeasureSectionNav sections={sections} />

        <section id="wat-is-het" className="scroll-mt-40 mt-4 mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is een hybride warmtepomp?</h2>
            <p className="text-lg font-medium text-[var(--gijs-donkergroen)] leading-relaxed">
              Een warmtepomp haalt warmte uit de buitenlucht en gebruikt die om je woning te verwarmen.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Bij een hybride warmtepomp blijft je cv-ketel aanwezig. De cv-ketel springt bij wanneer dat nodig is,
              en schakelen tussen de warmtepomp en de cv-ketel gebeurt automatisch. Gijs plaatst vooral één vaste
              hybride warmtepomp, en daarnaast een paar andere hybride warmtepompen.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Of een hybride warmtepomp past, hangt af van je woning en je huidige verwarming. Daar hoef je zelf niet
              technisch uit te komen: tijdens een energiescan aan huis bekijkt een expert van Gijs je huidige
              verwarmingssituatie en bespreekt welke oplossing past.
            </p>
          </div>

          <div className="mt-10">
            <FeatureList
              columns={4}
              items={[
                { icon: "square", title: "Buitenunit", text: "Haalt warmte uit de buitenlucht." },
                { icon: "layout-grid", title: "Binnenunit", text: "Verbindt de warmtepomp met de cv-installatie." },
                { icon: "flame", title: "CV-ketel", text: "Je bestaande ketel springt bij wanneer nodig." },
                { icon: "thermometer", title: "Thermostaat", text: "Bedient de installatie in huis." },
              ]}
            />
          </div>
        </section>

        <section id="past-het" className="scroll-mt-40 mb-16">
          <Card variant="tint" className="flex flex-col md:flex-row md:items-center gap-6 !p-6 md:!p-7">
            <div className="md:flex-1 flex flex-col gap-1">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Past dit bij mijn woning?</h3>
              <p className="text-sm text-zinc-600">Tijdens de energiescan beoordeelt Gijs samen met jou onder meer het volgende:</p>
            </div>
            <ul className="md:flex-[1.6] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Of de woning voldoende is geïsoleerd</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Of je bestaande verwarmingssysteem geschikt is</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Een geschikte locatie voor het buitendeel</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Of de werkruimte asbestvrij is</span>
              </li>
            </ul>
            <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
          </Card>
        </section>

        <section id="voordelen" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">De voordelen</h2>
          <FeatureList columns={4} items={VOORDELEN.map(voordeel => ({ icon: "zap", title: voordeel }))} />
        </section>

        <section id="meest-geplaatst" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">De warmtepomp die Gijs het meest plaatst</h2>
          <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
            Gijs werkt samen met een vaste warmtepomppartner. Deze hybride warmtepomp plaatst Gijs het meest.
            Sinds kort is er ook een grotere uitvoering, geschikt voor de allergrootste woningen.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 items-center mb-10">
            <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)]">
              <Image
                src={dewarmteAO.image}
                alt={dewarmteAO.imageAlt}
                width={1024}
                height={942}
                quality={100}
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">{dewarmteAO.merk}</p>
                <h3 className="font-bold text-2xl text-[var(--gijs-donkergroen)]">{dewarmteAO.naam}</h3>
                <p className="text-zinc-600 mt-1">{dewarmteAO.ondertitel}</p>
              </div>
              <ul className="flex flex-col gap-2.5 text-base">
                {dewarmteAO.kenmerken.map(k => (
                  <li key={k} className="flex items-start gap-2 text-zinc-700">
                    <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
              {dewarmteAO.garantie && (
                <p className="flex items-start gap-2 text-sm text-zinc-700 border-t border-[var(--border-default)] pt-4">
                  <Icon name="shield-check" size="sm" className="mt-0.5 text-[var(--accent-700)] shrink-0" />
                  <span>Garantie: {dewarmteAO.garantie}</span>
                </p>
              )}
            </div>
          </div>

          <Card className="flex flex-col md:flex-row md:items-center gap-6 !p-6 md:!p-7">
            <div className="md:flex-1">
              <span className="inline-block text-xs font-bold uppercase tracking-wide text-white bg-[var(--green-800)] rounded-full px-3 py-1 mb-2">Nieuw</span>
              <h3 className="font-bold text-xl text-[var(--gijs-donkergroen)]">{dewarmteMP.naam}</h3>
              <p className="text-sm text-zinc-600 mt-1">{dewarmteMP.ondertitel}</p>
              <ul className="flex flex-col gap-2 mt-3">
                {dewarmteMP.kenmerken.map(k => (
                  <li key={k} className="flex items-start gap-2 text-sm text-zinc-700">
                    <Icon name="check" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <div className="mt-6">
            <TechnicalDetails id="meest-geplaatst-technisch">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {[dewarmteAO, dewarmteMP].map(product => (
                  <div key={product.naam}>
                    <h4 className="font-bold text-[var(--gijs-donkergroen)] mb-3">{product.naam}</h4>
                    <ul className="flex flex-col gap-2">
                      <TechnicalDetailRow label="Vermogen" value={product.vermogen} />
                      <TechnicalDetailRow label="Afmetingen" value={product.afmetingen} />
                      <TechnicalDetailRow label="Geluid" value={product.geluid} />
                    </ul>
                  </div>
                ))}
              </div>
            </TechnicalDetails>
          </div>
        </section>

        <section id="andere-warmtepompen" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Andere warmtepompen van Gijs</h2>
          <p className="text-zinc-600 mb-8 max-w-2xl">
            Naast deze warmtepomp plaatst Gijs ook andere hybride warmtepompen. Geen van deze producten
            wordt hieronder als beste keuze aangewezen. Dat bekijkt Gijs samen met jou.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {andereWarmtepompen.map(product => (
              <Card key={product.naam} className="flex flex-col gap-5 !p-6">
                <div className="rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)] aspect-[4/3] flex items-center justify-center">
                  <Image src={product.image} alt={product.imageAlt} width={600} height={450} className="max-w-[85%] max-h-[85%] object-contain" />
                </div>
                <div>
                  <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">{product.merk}</p>
                  <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">{product.naam}</h3>
                  <p className="text-sm text-zinc-600 mt-1">{product.ondertitel}</p>
                </div>
                <details className="group border-t border-[var(--border-default)] pt-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer list-none flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">
                    Bekijk technische gegevens
                    <Icon name="chevron-down" size="sm" className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 flex flex-col gap-3 text-sm text-zinc-600">
                    <p><span className="font-semibold text-zinc-800">Vermogen: </span>{product.vermogen}</p>
                    <p><span className="font-semibold text-zinc-800">Geluid: </span>{product.geluid}</p>
                    <p><span className="font-semibold text-zinc-800">Afmetingen: </span>{product.afmetingen}</p>
                    <ul className="flex flex-col gap-1.5">
                      {product.kenmerken.map(k => (
                        <li key={k} className="flex items-start gap-2">
                          <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </Card>
            ))}
          </div>
        </section>

        <section id="hoe-werkt-het" className={`scroll-mt-40 ${HOOFDSTUK_MB}`}>
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Hoe verloopt de uitvoering?</h2>
          <p className="text-lg text-zinc-600 mb-10 max-w-2xl">Gijs plaatst de hybride warmtepomp in één dag, volgens een vaste aanpak.</p>
          <UitvoeringStappen stappen={UITVOERING_STAPPEN} />
        </section>

        <section id="voorwaarden" className={`scroll-mt-40 ${HOOFDSTUK_MB} ${HOOFDSTUK_DIVIDER}`}>
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Voorbereiding en voorwaarden</h2>
          <p className="text-lg text-zinc-600 mb-6 max-w-2xl">
            Voor een goede uitvoering gelden een paar praktische voorwaarden.
          </p>
          <VoorwaardenKolommen
            groepen={[
              { label: "Voor de installatie", items: VOORWAARDEN_VOOR },
              { label: "Tijdens de installatie", items: VOORWAARDEN_TIJDENS },
            ]}
          />
        </section>

        <section id="subsidie" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Subsidie bij een hybride warmtepomp</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">
            Voor een hybride warmtepomp geldt een basisbedrag van € 1.250. Combineer je dit met een isolatiemaatregel?
            Dan verdubbelt het subsidiebedrag voor isolatie. Gijs vraagt de subsidie aan binnen 24 maanden nadat je de
            eerste maatregel uitvoert.
          </p>
          <div className="mb-8">
            <StatRow items={SUBSIDIE_TABEL.map(rij => ({ label: `Geschatte subsidie bij ${rij.vermogen}`, value: rij.bedrag }))} />
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl">
            Gijs ondersteunt je graag bij het verzorgen van je subsidieaanvraag. Onze dienstverlening beperkt zich tot
            het faciliteren van de aanvraagprocedure, tegen een eenmalige administratievergoeding die is verwerkt in
            de begroting. Gijs kan de toekenning van subsidies niet garanderen en is niet verantwoordelijk voor
            eventuele onjuistheden in de verstrekte informatie of andere gerelateerde zaken.
          </p>
          <p className="text-sm text-zinc-500 max-w-2xl mt-3">
            Meer weten? Lees de{" "}
            <Link href="/kennis#subsidies" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">uitleg over subsidies en financiering</Link>.
          </p>
        </section>

        <section id="veelgestelde-vragen" className={`scroll-mt-40 mb-10 sm:mb-14 lg:mb-16 ${HOOFDSTUK_DIVIDER}`}>
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
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Past een hybride warmtepomp bij jouw woning?</h2>
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
