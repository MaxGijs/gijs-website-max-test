import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { GLASSOORTEN, GLASSOORTEN_HIGHLIGHT } from "@/lib/content/isolatieglas-glassoorten";
import { CONTACT } from "@/lib/content/contact";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { MeasureHero } from "@/components/measures/MeasureHero";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { UitvoeringStappen } from "@/components/measures/UitvoeringStappen";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { FeatureList } from "@/components/measures/FeatureList";
import { VoorwaardenKolommen } from "@/components/measures/VoorwaardenKolommen";
import { HOOFDSTUK_MB, HOOFDSTUK_DIVIDER } from "@/components/measures/sectionRhythm";
import { StatRow } from "@/components/measures/StatRow";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Isolatieglaspagina, gebouwd op de vloerisolatiepagina als template
// (zelfde structuur, componenten, spacing en stijl). Alleen de inhoud gaat
// over isolatieglas.
//
// Bron: "Informatie isolatieglas van Gijs met aanvullende voorwaarden.pdf"
// (3 pagina's) — pagina 1 (uitvoeringsstappen), pagina 2 (aanvullende
// voorwaarden + subsidie-informatie), pagina 3 (glassoorten-schema "HR
// EcoGlazz" met U-waarden en bouwjaar-indicatie, zie
// lib/content/isolatieglas-glassoorten.ts). De hero is een echte
// Gijs-uitvoeringsfoto (isolatieglas.png).
//
// De opbouw-uitleg bij "Wat is isolatieglas?" gebruikt sinds de
// uitlegvisual-vervangingsronde de nieuwe, door Gijs aangeleverde
// afbeelding isolatieglas-uitlegvisual.png ("isolatieglasv2.1.png" uit de
// aangeleverde ZIP) — vervangt de eerdere isolatiegrlas_hout_voorbeeld.png
// (verwijderd, nergens anders gebruikt). De nieuwe afbeelding bevat de
// legenda (meerdere glaslagen/speciale coating/isolerende vulling/
// afstandhouder) al zelf; deze wordt daarom als geheel getoond (geen
// losse HTML-legenda erover/eronder gebouwd). Het bestaande 4-koloms
// iconenblok direct onder de afbeelding bevat aanvullende, per-glassoort
// technische details (HR+++/driedubbel glas, gasvulling bij HR+, HR++(G)
// kunststof afstandhouder) die niet in de nieuwe afbeelding staan — dit
// blok is daarom ongewijzigd gelaten (geen tekst herschreven/verwijderd,
// buiten scope van de uitlegvisual-vervanging).
//
// De enige uitzondering op "alleen Gijs-bronnen" is het infoblok "Wat
// betekent de U-waarde?" direct onder de tabel: dat is op expliciet
// verzoek gebaseerd op https://www.glaswebwinkel.nl/kennisbank/dubbelglas/
// wat-is-de-u-waarde-van-glas/ (geen Gijs-bron, geen formule, geen
// extra claims toegevoegd).
// UITVOERINGSVISUAL — PROCES V2: de eerdere set losse SVG's is volledig
// vervangen door de definitieve "proces v2"-set (submap "Isolatieglas"):
// elk bestand bevat nu icoon + nummerbadge + titel + een korte uitlegzin.
// Alle 6 bestanden zijn hernoemd naar isolatieglas-stap-1.svg t/m
// -stap-6.svg; de vorige bestanden (stap-1/2/5/6.svg,
// stap-3/4-isolatieglas.svg) zijn verwijderd. Titel van stap 3 is in deze
// aanlevering weer "Verwijderen oud" (dichter bij de oorspronkelijke
// "Oude beglazing verwijderen" dan de vorige, generieke "Voorbereiden").
//
// GECORRIGEERD — fout in het aangeleverde bestand (herbevestigd, zie het
// gesprek): isolatieglas-stap-5.svg (badge "5", titel "Controle", icoon
// = checklist-tablet) heeft de ingebakken uitlegzin "Het werk wordt
// netjes afgerond" — dat is de Oplevering-zin. isolatieglas-stap-6.svg
// (badge "6", titel "Oplevering", icoon = vinkje) heeft de ingebakken
// zin "De bestaande ramen en kozijne worden ingemeten" — een inmeet-zin
// die letterlijk overeenkomt met kozijnen-stap-1.svg en nergens in het
// isolatieglas-proces thuishoort. Icoon, badge en titel kloppen in beide
// bestanden wél; alleen de tekst in het lichtgroene vlak is verwisseld/
// fout. Omdat die tekst als vectorpaden in de afbeelding zelf zit (geen
// bewerkbare tekst, geen <text>-elementen), kan dit niet ter plekke
// worden gecorrigeerd zonder de afbeelding zelf na te tekenen — dat wil
// ik niet doen (geen AI-gegenereerde vervangende iconen/tekst). In
// plaats daarvan wordt hier alleen het onderste (foute) deel van beide
// afbeeldingen verborgen en vervangen door een HTML-vlak in dezelfde
// stijl (zie UitvoeringStappen.tsx, `uitlegOverride`), met tekst die al
// elders voor isolatieglas is vastgelegd: "Het werk wordt netjes
// afgerond" staat letterlijk (maar verkeerd geplaatst) al in stap-5.svg
// zelf; "Het werk wordt nagelopen" komt uit de eerder goedgekeurde
// isolatieglas-tekst ("...waarna het werk wordt nagelopen en
// opgeleverd"). Geen nieuwe tekst verzonnen, niets van een andere
// maatregelpagina geleend.
const UITVOERING_STAPPEN = [
  { bestand: "maatregelen/glas/proces/isolatieglas-stap-1.svg", label: "Aankomst" },
  { bestand: "maatregelen/glas/proces/isolatieglas-stap-2.svg", label: "Uitleg" },
  { bestand: "maatregelen/glas/proces/isolatieglas-stap-3.svg", label: "Verwijderen oud" },
  { bestand: "maatregelen/glas/proces/isolatieglas-stap-4.svg", label: "Plaatsen nieuw" },
  { bestand: "maatregelen/glas/proces/isolatieglas-stap-5.svg", label: "Controle", uitlegOverride: "Het werk wordt nagelopen." },
  { bestand: "maatregelen/glas/proces/isolatieglas-stap-6.svg", label: "Oplevering", uitlegOverride: "Het werk wordt netjes afgerond." },
];

// Aanvullende voorwaarden — pagina 2 van de brochure. Deze gelden, anders
// dan bij vloerisolatie, voor alle isolatieglas-plaatsingen (geen
// materiaalafhankelijk onderscheid in de bron).
const VOORWAARDEN = [
  "De te isoleren oppervlaktes zijn bereikbaar en toegankelijk, en vrij van vitrage, rolluiken, planten en gordijnen",
  "Het glas wordt vooraf ingemeten; hiervoor neemt de inmeter telefonisch contact op",
  "Er is parkeergelegenheid voor een combinatie van circa 15 meter lang",
  "Bij onverwachte houtrot tijdens de plaatsing wordt het glas niet geplaatst; eerst wordt reparatie geadviseerd",
  "Alle glaslatten worden in grondverf afgeleverd; de opdrachtgever verzorgt zelf het schilderwerk",
  "Bij een prijsafwijking van meer dan 10% na het inmeten is heroverweging van de overeenkomst mogelijk",
  "Er is een toilet beschikbaar voor de uitvoerende partij",
];

// Drie voordelen, elk direct te herleiden tot de brochure: de U-waarde-
// vergelijking (minder warmteverlies), de temperatuurindicatie bij het
// glasoppervlak op pagina 3 (warmer bij het raam) en de afsluitende
// tekst bij stap 6 ("Geniet van je isolatieglas en je lage
// energierekening!").
const VOORDELEN = [
  { icon: "wind", title: "Minder warmteverlies", text: "Isolatieglas heeft een lagere U-waarde dan enkel- of gewoon dubbelglas, waardoor er minder warmte via het glas verloren gaat." },
  { icon: "thermometer", title: "Warmer bij het raam", text: "Naarmate het glas beter isoleert, voelt het glasoppervlak aan de binnenzijde warmer aan." },
  { icon: "piggy-bank", title: "Lagere energierekening", text: "Minder warmteverlies via het glas draagt bij aan een lagere energierekening." },
];

export function IsolatieglasPage({ item }: { item: MeasurePageItem }) {
  const title = "Isolatieglas";
  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "glassoorten", label: "Glassoorten" },
    { id: "voordelen", label: "Voordelen" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "voorwaarden", label: "Voorwaarden" },
    { id: "subsidie", label: "Subsidie" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  // FAQ herzien (zie eindverslag): drie vragen zijn verwijderd omdat ze
  // vrijwel woordelijk een bestaande sectie herhaalden zonder verdieping
  // toe te voegen — "Wat is het verschil tussen HR++, HR+++..." (dubbel
  // met de Glassoorten-tabel + U-waarde-uitleg direct op de pagina),
  // "Hoe verloopt de plaatsing?" (dubbel met de iconenrij hierboven) en
  // "Kan ik subsidie krijgen voor isolatieglas?" (dubbel met de
  // Subsidie-sectie). De losse, generieke vraag ("Hoe lang duurt het
  // plaatsen van isolatieglas?") is ook weggelaten op deze pagina: die
  // herhaalt letterlijk de herotitel/-intro ("Isolatieglas plaatsen in
  // één dag"). Overige vragen behouden en herordend op klantprioriteit.
  const faqItems: FAQItem[] = [
    { question: "Welk isolatieglas past bij mijn woning?", answer: "Dat hangt af van je huidige glas en kozijnen. Tijdens de energiescan beoordeelt Gijs welk type isolatieglas voor jouw woning passend is." },
    { question: "Hoe wordt het glas ingemeten?", answer: "Voor aanvang van de werkzaamheden wordt het glas ingemeten. Hiervoor neemt de inmeter telefonisch contact met je op." },
    { question: "Wat gebeurt er bij houtrot?", answer: "Bij onverwachte houtrot tijdens de plaatsing laat Gijs het glas achter, maar wordt het niet geplaatst. Eerst wordt reparatie geadviseerd." },
    { question: "Wie schildert de glaslatten?", answer: "De glaslatten worden in grondverf afgeleverd. Je zorgt zelf voor het schilderwerk." },
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
        subtitle="Isolatieglas plaatsen in één dag"
        intro="Gijs plaatst isolatieglas in één dag. Hieronder lees je hoe het werkt, welke glassoorten er zijn en hoe de uitvoering en de energiescan verlopen."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Vraag een gratis energiescan aan", href: "/contact#energiescan" }}
        image="/images/maatregelen/glas/isolatieglas.png"
        imageAlt="Monteur van Gijs plaatst isolatieglas in een raam"
      />

      {/* Eén gedeelde wrapper om subnav + secties: zie vloerisolatiepagina
          voor de toelichting op deze structuur (sticky subnav). */}
      <div>
        <MeasureSectionNav sections={sections} />

        <section id="wat-is-het" className="scroll-mt-40 mt-12 mb-14">
          <div className="flex flex-col gap-4 max-w-3xl">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is isolatieglas?</h2>
            <p className="text-lg font-medium text-[var(--gijs-donkergroen)]">
              Zie isolatieglas als een warme deken voor je ramen. Het glas beperkt warmteverlies via het raam en
              voelt aan de binnenkant warmer aan.
            </p>
            <p className="text-zinc-600">
              Gijs plaatst hiervoor isolatieglas. Er bestaan verschillende soorten isolatieglas, van enkelglas tot
              HR+++. Hoe beter het glas isoleert, hoe minder warmte er via het glas verloren gaat.
            </p>
            <p className="text-zinc-600">
              Welk glas past, hangt af van het glas en de kozijnen die je nu hebt. Daar hoef je zelf niet technisch
              uit te komen: tijdens een energiescan aan huis bekijkt een expert van Gijs je bestaande ramen en
              kozijnen, en bespreekt welke oplossing past.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] mt-8 max-w-[820px] mx-auto">
            {/* PNG vervangen door SVG: zelfde crop/inhoud (ratio geverifieerd),
                de opdrachtgever heeft alleen de hoekafronding van de
                labels/badges aangepast (uitlegvisuals.zip). SVG met een
                .svg-extensie wordt door next/image automatisch als
                unoptimized behandeld, dus geen dangerouslyAllowSVG nodig. */}
            <Image
              src="/images/maatregelen/glas/isolatieglas-uitlegvisual.svg"
              alt="Uitleg van glaslagen, coating, isolerende vulling en afstandhouder bij isolatieglas"
              width={4384}
              height={2853}
              quality={100}
              className="w-full h-auto"
            />
          </div>

          <div className="mt-8">
            <FeatureList
              columns={4}
              items={[
                { icon: "layers", title: "Meerdere glaslagen", text: "Isolatieglas bestaat uit meerdere lagen glas met een tussenruimte. Bij HR+++ gebruikt Gijs zelfs drie lagen glas (driedubbel glas)." },
                { icon: "sparkles", title: "Speciale coating", text: "Op het glas zit een speciale coating. Bij HR is dit een warmtereflecterende coating, bij HR++ een verbeterde coating." },
                { icon: "wind", title: "Isolerende vulling", text: "Bij HR+ zit er een gasvulling in de spouw tussen de glaslagen." },
                { icon: "ruler", title: "Afstandhouder", text: "De afstandhouder houdt de glaslagen op de juiste afstand van elkaar. Bij HR++ (G) is deze van kunststof." },
              ]}
            />
          </div>

          <Card variant="tint" className="mt-8 flex flex-col md:flex-row md:items-center gap-6 !p-8">
            <div className="md:flex-1 flex flex-col gap-1">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Past isolatieglas bij mijn woning?</h3>
              <p className="text-sm text-zinc-600">Tijdens de energiescan wordt bekeken welk glas je nu hebt en welke isolatieglas-opties passen.</p>
            </div>
            <ul className="md:flex-[1.6] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>De ramen zijn bereikbaar en toegankelijk</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Het glas wordt vooraf ingemeten</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Van HR++ tot HR+++ zijn er meerdere opties mogelijk</span>
              </li>
            </ul>
            <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
          </Card>
        </section>

        <section id="glassoorten" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Welke soorten isolatieglas zijn er?</h2>
          <p className="text-zinc-600 mb-8 max-w-2xl">
            Van enkelglas tot HR+++: hoe lager de U-waarde, hoe beter het glas isoleert.
          </p>

          <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] mb-8">
            <Image
              src="/images/maatregelen/glas/isolatieglas-glassoorten-overzicht.png"
              alt="Overzicht van de soorten isolatieglas met U-waarden, kenmerken en bouwjaar-indicatie, van enkelglas tot HR+++"
              width={842}
              height={595}
              quality={100}
              className="w-full h-auto"
            />
          </div>

          <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)]">
            <table className="w-full text-left border-collapse min-w-[440px]">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th scope="col" className="px-6 py-5 text-sm font-bold text-[var(--gijs-donkergroen)]">Glassoort</th>
                  <th scope="col" className="px-6 py-5 text-sm font-bold text-[var(--gijs-donkergroen)]">U-waarde</th>
                  <th scope="col" className="px-6 py-5 text-sm font-bold text-[var(--gijs-donkergroen)]">Kenmerk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {GLASSOORTEN.map(soort => (
                  <tr key={soort.naam} className={GLASSOORTEN_HIGHLIGHT.has(soort.naam) ? "bg-[var(--accent-050)]" : undefined}>
                    <td className="px-6 py-5 font-bold text-[var(--gijs-donkergroen)] whitespace-nowrap">{soort.naam}</td>
                    <td className="px-6 py-5 text-zinc-700 whitespace-nowrap">{soort.uWaarde}</td>
                    <td className="px-6 py-5 text-zinc-600">{soort.uitleg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Gemarkeerde rijen voldoen aan de minimale U-waarde voor subsidie (zie hieronder).
          </p>

          <Card variant="tint" className="mt-6 !p-6 max-w-2xl">
            <h3 className="font-bold text-[var(--gijs-donkergroen)] mb-2">Wat betekent de U-waarde?</h3>
            <p className="text-sm text-zinc-700">
              De U-waarde geeft aan hoeveel warmte er door het glas verloren gaat. Een lage U-waarde betekent dat er
              weinig warmte door het glas ontsnapt; een hoge U-waarde betekent dat je warmte via het raam naar
              buiten verliest.
            </p>
            <p className="font-bold text-[var(--gijs-donkergroen)] mt-3">
              Hoe lager de U-waarde, hoe beter het glas isoleert.
            </p>
          </Card>

          <p className="text-sm text-zinc-500 mt-4 max-w-2xl">
            Ook kozijnen vervangen? Bekijk{" "}
            <Link href="/maatregelen/kozijnen" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">kozijnen</Link>.
          </p>
        </section>

        <section id="voordelen" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">De voordelen</h2>
          <FeatureList columns={3} items={VOORDELEN} />
        </section>

        <section id="hoe-werkt-het" className={`scroll-mt-40 ${HOOFDSTUK_MB}`}>
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Hoe verloopt de uitvoering?</h2>
          <p className="text-zinc-600 mb-10 max-w-2xl">Gijs werkt volgens een vaste aanpak. Zo weet je precies wat je kunt verwachten.</p>
          {/* Gedeeld component, gebruikt door alle isolatiepagina's, zodat
              de iconen op elke pagina exact dezelfde afmeting/uitlijning
              hebben — zie UitvoeringStappen.tsx voor de volledige
              toelichting (responsive gedrag, aspect-ratio-fix). */}
          <UitvoeringStappen stappen={UITVOERING_STAPPEN} />
        </section>

        <section id="voorwaarden" className={`scroll-mt-40 ${HOOFDSTUK_MB} ${HOOFDSTUK_DIVIDER}`}>
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Voorbereiding en voorwaarden</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">
            Voor een goede uitvoering gelden een paar praktische voorwaarden.
          </p>
          <VoorwaardenKolommen
            groepen={[
              { items: VOORWAARDEN.slice(0, 4) },
              { items: VOORWAARDEN.slice(4) },
            ]}
          />
        </section>

        <section id="subsidie" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Subsidie bij isolatieglas</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">
            Voor dubbel glas met een minimale U-waarde van 1,2 kun je subsidie krijgen. Laat je meer dan één
            isolatiemaatregel installeren? Dan verdubbelt het subsidiebedrag. Gijs vraagt hiervoor subsidie aan
            binnen 24 maanden nadat je de eerste maatregel uitvoert.
          </p>
          <div className="mb-8">
            <StatRow
              items={[
                { label: "Subsidiebedrag per m² bij 1 maatregel", value: "€ 25" },
                { label: "Subsidiebedrag per m² vanaf 2 maatregelen", value: "€ 50" },
                { label: "Aantal m² met subsidie", value: "3 t/m 45 m²" },
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
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Past isolatieglas bij jouw woning?</h2>
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
