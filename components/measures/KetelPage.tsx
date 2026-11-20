import Image from "next/image";
import Link from "next/link";
import { titelOvergang } from "@/lib/overgang";
import { FotoOvergang } from "@/components/FotoOvergang";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL, ENERGIESCAN_HREF } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import { KETELS } from "@/lib/content/ketel-producten";
import { WARMTEPOMP_GASBESPARING } from "@/lib/content/warmtepomp-besparing";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { WhatsAppTrackedButton } from "@/components/regio/WhatsAppTrackedButton";
import { RegioBreadcrumb, RegioMain, H2 } from "@/components/regio/RegioBlokken";
import { AdviseurFoto, ADVISEUR_FOTO } from "@/components/regio/VerhaalSecties";
import { SubsidiecheckStart } from "@/components/subsidie/SubsidiecheckStart";
import {
  EYEBROW, SECTIE_BASE, LEAD, TEKST, BRON, WIT_BLOK, GRIJS_BLOK, HERO_H1, HERO_INTRO, GijsWatermark,
  RASTER, RASTER_CEL, TEKSTLINK, H3_GROOT, KAARTKOP, KAARTTEKST, UITKLAP, Kop,
} from "@/components/regio/regio-template-styles";
import regioStyles from "@/components/regio/regio.module.css";
import { ArtikelKaarten } from "@/components/kennis/ArtikelKaarten";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { MeasureRegioLink } from "@/components/measures/MeasureRegioLink";
import { KetelInstallatieAnimatie } from "@/components/measures/KetelInstallatieAnimatie";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { GoogleScore } from "@/components/reviews/GoogleScore";
import { GoogleReviewsSectie } from "@/components/reviews/GoogleReviewsSectie";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Ketelpagina in de stijl van de warmtepomppagina (SEO-ronde 20-11-2026). Aanleiding: de oude
// pagina stond in Search Console op "Gevonden, momenteel niet geïndexeerd" en was erg dun.
// Zoekwoorden (GSC, 28 dagen tot 20-11-2026): vooral hybride + cv-ketel (kosten, subsidie),
// verder "verwarmingsketel" (pos. 3,9) en "cv ketel op stroom" (pos. 23). Kosten en subsidie
// van de hybride warmtepomp horen op de warmtepomppagina; hier kort beantwoord en doorgelinkt,
// zodat de twee pagina's niet met elkaar concurreren.
//
// INHOUDELIJKE AFSPRAKEN:
// - Merken: alleen Intergas is bevestigd (Max, 20-11-2026). Geen andere merken of logo's tonen.
// - Producten en specificaties uitsluitend uit lib/content/ketel-producten.ts (Warmteservice).
// - Geen prijzen, bandbreedtes of levensduurgetallen: daar is geen bron voor aangeleverd.
// - Hybride: dezelfde formuleringen en vuistregel als op de warmtepomppagina
//   (lib/content/warmtepomp-besparing.ts). 2029-regels zoals in het kennisartikel
//   (Rijksoverheid, 7-10-2026): nog niet definitief, alleen bij vervanging.
// - Subsidie: ISDE geldt niet voor een gasketel, wel voor de hybride warmtepomp. Geen bedragen.

const SECTIE = `${SECTIE_BASE} ${regioStyles.opkomen}`;
const HYBRIDE_PROCENT = Math.round(WARMTEPOMP_GASBESPARING.hybride * 100);

// Bestaande, goedgekeurde Gijs-foto's: dezelfde beelden als bovenaan de betreffende maatregelpagina's.
const ANDERE_STAPPEN = [
  { titel: "Hybride warmtepomp", tekst: "Werkt samen met je cv-ketel en neemt het grootste deel van de verwarming over.", href: "/maatregelen/warmtepomp",
    foto: "/images/maatregelen/warmtepomp/warmtepomp-hero.png", alt: "Een installateur van Gijs plaatst een warmtepomp tegen de gevel van een woning" },
  { titel: "Vloerverwarming", tekst: "Met een verdeler die is afgestemd op je cv-ketel of warmtepomp.", href: "/maatregelen/vloerverwarming",
    foto: "/images/maatregelen/vloerverwarming/vloerverwarming-hero.png", alt: "Een installateur van Gijs giet de dekvloer over de vloerverwarmingsleidingen" },
  { titel: "Spouwmuurisolatie", tekst: "Er gaat minder warmte via je muren verloren, dus je ketel hoeft minder hard te werken.", href: "/maatregelen/spouwmuurisolatie",
    foto: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-aanbrengen-gijs.png", alt: "Spouwmuurisolatie wordt via een boorgat in de gevel aangebracht" },
  { titel: "Isolatieglas", tekst: "Isolatieglas vermindert warmteverlies en verhoogt het comfort bij het raam.", href: "/maatregelen/isolatieglas",
    foto: "/images/maatregelen/glas/isolatieglas.png", alt: "Monteur van Gijs plaatst isolatieglas in een raam" },
];

// Herkenbare signalen, bewust zonder leeftijdsgrens of percentages (daar is geen bron voor).
const SIGNALEN = [
  { icon: "triangle-alert", titel: "Je ketel valt vaker uit", tekst: "Moet de monteur steeds vaker langskomen, of slaat de ketel af en toe af? Dan is het tijd om te kijken wat vervangen oplevert." },
  { icon: "shower-head", titel: "Warm water laat op zich wachten", tekst: "Duurt het lang voordat er warm water uit de kraan komt, of wisselt de temperatuur tijdens het douchen? Dan kan een nieuwe combiketel meer comfort geven." },
  { icon: "calendar-clock", titel: "Je ketel is al wat ouder", tekst: "Laat op tijd bekijken wat er mogelijk is. Zo hoef je niet midden in de winter haastig een nieuwe ketel te kiezen." },
  { icon: "house", titel: "Je gaat verbouwen of verduurzamen", tekst: "Ga je isoleren, vloerverwarming aanleggen of denk je aan een warmtepomp? Dan is dit een goed moment om ook naar je ketel te kijken." },
];

const KEUZES = [
  {
    icon: "flame",
    titel: "Nieuwe cv-ketel",
    punten: [
      "Vervangt je oude ketel één op één",
      "Verwarming en warm water op gas",
      "Je radiatoren kunnen blijven",
      "Later eventueel aan te vullen met een hybride warmtepomp",
    ],
  },
  {
    icon: "git-branch",
    titel: "Cv-ketel met hybride warmtepomp",
    punten: [
      "De warmtepomp doet het grootste deel van de verwarming",
      "De cv-ketel levert warm water en helpt als het echt koud is",
      "Je radiatoren kunnen meestal blijven",
      `Volgens de vuistregel van Gijs ongeveer ${HYBRIDE_PROCENT}% minder gas`,
    ],
  },
  {
    icon: "zap",
    titel: "Volledig elektrische warmtepomp",
    punten: [
      "Vervangt je cv-ketel helemaal, ook voor warm water",
      "Vraagt een goed geïsoleerd huis",
      "Vaak met grotere radiatoren of vloerverwarming",
      "Je gaat helemaal van het gas af",
    ],
  },
];

// Op de kaart alleen wat voor beide ketels bekend is; de volledige gegevens staan in de uitklapper.
const KETEL_KAARTEN = KETELS.map(ketel => ({
  ...ketel,
  vermogen: ketel.technisch.find(r => r.label.startsWith("Vermogen"))?.waarde ?? "",
}));

export function KetelPage({ item }: { item: MeasurePageItem }) {
  const startScanHref = "/woning?maatregel=" + item.id;

  const plaatsKaarten = [
    {
      icon: "user-check",
      titel: "Eén vast aanspreekpunt",
      tekst: "Van de energiescan tot de plaatsing en oplevering: je houdt één vast aanspreekpunt. Gijs regelt de planning en de uitvoering voor je.",
    },
    {
      icon: "wallet",
      titel: "Wat kost een nieuwe cv-ketel?",
      tekst: "Dat hangt af van de ketel en het vermogen dat je woning nodig heeft, en van wat er bij jou thuis moet gebeuren, zoals aanpassingen aan leidingen of de afvoer. Tijdens de energiescan brengt Gijs dit voor jouw situatie in kaart.",
    },
    {
      icon: "lightbulb",
      titel: "We kijken verder dan de ketel",
      tekst: "Een nieuwe ketel is niet altijd de slimste stap. We vertellen je eerlijk of een hybride warmtepomp of eerst isoleren meer oplevert.",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "Mag ik nog een nieuwe cv-ketel laten plaatsen?",
      answer: "Ja. Het kabinet wil vanaf 2029 strengere eisen stellen als je je cv-ketel vervangt, zodat in veel woningen een slimme hybride warmtepomp de standaard wordt. Die regels zijn nog niet definitief, en een ketel die goed werkt hoeft niet weg.",
      links: [{ tekst: "Lees meer over de regels vanaf 2029", href: "/kennis/cv-ketel-vervangen-2029-gas-of-warmtepomp" }],
    },
    {
      question: "Wat is een hybride cv-ketel?",
      answer: "Meestal wordt daarmee een cv-ketel bedoeld die samenwerkt met een hybride warmtepomp. De warmtepomp verzorgt het grootste deel van de verwarming, en de cv-ketel levert het warme water en springt bij als het echt koud is. Het schakelen tussen de twee gaat automatisch.",
      links: [{ tekst: "Meer over de hybride warmtepomp", href: "/maatregelen/warmtepomp" }],
    },
    {
      question: "Kan mijn bestaande cv-ketel blijven bij een hybride warmtepomp?",
      answer: "Dat hangt af van je ketel. Gijs kijkt welke ketel er hangt, hoe oud die is en of die geschikt is om samen te werken met een warmtepomp. Is je ketel bijna aan vervanging toe, dan bespreken we of het slimmer is om beide in één keer te regelen.",
    },
    {
      question: "Is er subsidie voor een hybride cv-ketel?",
      answer: "Niet voor de cv-ketel zelf: voor een gasketel bestaat geen ISDE-subsidie. Voor de hybride warmtepomp die met de ketel samenwerkt, kun je wel ISDE-subsidie aanvragen. Gijs kan je helpen met de aanvraag.",
    },
    {
      question: "Bestaat er een cv-ketel op stroom?",
      answer: "Er bestaan elektrische ketels die het water met stroom verwarmen, maar die gebruiken veel elektriciteit. Wil je zonder gas verwarmen, dan is een volledig elektrische warmtepomp meestal de zuinigere keuze, omdat die een groot deel van de warmte uit de buitenlucht haalt. Of dat bij jouw woning past, bekijkt Gijs met je.",
    },
    {
      question: "Welke cv-ketels plaatst Gijs?",
      answer: "We plaatsen hr-combiketels van Intergas, meestal de Kombi Kompakt HRE 28/24 of HRE 36/30. Welke uitvoering en welk vermogen bij jouw woning passen, bespreken we tijdens de energiescan.",
    },
  ];

  return (
    <RegioMain>
      <RegioBreadcrumb crumbs={[
        { naam: "Home", url: "/" },
        { naam: "Maatregelen", url: "/maatregelen" },
        { naam: "Ketel", url: "/maatregelen/" + item.slug },
      ]} />

      {/* Wat Gijs hier aanbiedt, als gestructureerde data. Het FAQPage-schema komt uit
          FAQAccordion zelf, dus niet hier nogmaals. */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Cv-ketel vervangen",
        serviceType: "Vervangen en plaatsen van een hr-combiketel",
        description: "Gijs kijkt met je mee welke cv-ketel bij je woning past, of een hybride warmtepomp slimmer is, en verzorgt de plaatsing: één aanspreekpunt van advies tot oplevering.",
        url: SITE_URL + "/maatregelen/" + item.slug,
        provider: { "@id": SITE_URL + "/#organization" },
        areaServed: { "@type": "Country", name: "Nederland" },
      }} />

      <header className="pt-2 lg:pt-6 mb-14 md:mb-20">
        <p className={EYEBROW + " mb-4"}>Cv-ketel</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
          <div className="flex flex-col gap-5">
            <h1 className={HERO_H1} style={titelOvergang("maatregel-" + item.slug)}>Een nieuwe cv-ketel voor je woning</h1>
            <p className={HERO_INTRO}>
              Is je cv-ketel aan vervanging toe? Gijs kijkt met je mee welke verwarmingsketel bij je woning past, en of
              een hybride warmtepomp misschien slimmer is. We regelen ook de plaatsing, met één aanspreekpunt van advies
              tot oplevering.
            </p>
            <GoogleScore />
            <div className="flex flex-wrap items-center gap-3">
              <WhatsAppTrackedButton plaats="maatregelpagina_hero" href={ENERGIESCAN_HREF} size="lg" iconRight="arrow-right">Vraag een energiescan aan</WhatsAppTrackedButton>
            </div>
            <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
              <Link href="/contact" className={TEKSTLINK}>Neem contact op</Link>, of bel{" "}
              <a href={CONTACT.phoneHref} className={TEKSTLINK}>{CONTACT.phone}</a>.
            </p>
          </div>
          <figure className="m-0 group/hero">
            <FotoOvergang id={"maatregel-" + item.slug}>
              <div className="relative aspect-[3/2] lg:aspect-auto lg:h-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--grey-050)]">
                <Image src="/images/maatregelen/ketel/ketel-hero.png"
                  alt="Een installateur van Gijs sluit een nieuwe cv-ketel aan" fill priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover/hero:scale-[1.03]" />
              </div>
            </FotoOvergang>
          </figure>
        </div>
      </header>

      <MeasureSectionNav tweeRegelsMobiel sections={[
        { id: "waarom-gijs", label: "Waarom Gijs" },
        { id: "vervangen", label: "Vervangen" },
        { id: "keuze", label: "Ketel of warmtepomp" },
        { id: "onze-ketels", label: "Onze ketels" },
        { id: "plaatsen", label: "Plaatsen" },
        { id: "subsidie", label: "Subsidie" },
        { id: "veelgestelde-vragen", label: "Vragen" },
      ]} />

      {/* Waarom Gijs: verhaal links, Naud rechts; daaronder de stappen die soms eerst slimmer zijn. */}
      <section id="waarom-gijs" className={SECTIE + " mt-8 lg:mt-12"}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8 lg:gap-14 items-stretch">
          <div className="flex flex-col gap-4 max-w-3xl">
            <p className={EYEBROW}>Waarom Gijs?</p>
            <h2 className={H2}>Waarom een nieuwe cv-ketel via Gijs?</h2>
            <p className={TEKST}>
              We kijken eerst naar je woning en je huidige verwarming. Is je ketel aan vervanging toe, dan plaatsen we een
              nieuwe hr-combiketel. Maar soms is het slimmer om de ketel te combineren met een hybride warmtepomp, of om
              eerst te isoleren. We leggen duidelijk uit wat bij jouw woning past en waarom.
            </p>
            <p className={TEKST}>
              Kies je voor een nieuwe ketel? Dan regelen we ook de plaatsing. Je hebt één aanspreekpunt voor het advies en
              de uitvoering.
            </p>
          </div>

          <aside aria-labelledby="naud-titel" className="flex flex-col gap-5 rounded-[var(--radius-lg)] bg-[var(--accent-100)] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <AdviseurFoto src={ADVISEUR_FOTO.naud.src} alt={ADVISEUR_FOTO.naud.alt} className="size-20 sm:size-24" />
              <h3 id="naud-titel" className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[var(--gijs-donkergroen)]">Naud helpt je graag!</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty]">
              Hij komt bij je thuis langs, kijkt naar je ketel en je verwarming en vertelt je eerlijk wat er nodig is, ook
              als een andere stap eerst slimmer is.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty]">
              Hij is je vaste aanspreekpunt en regelt ook de plaatsing.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
              <WhatsAppTrackedButton plaats="maatregelpagina_waarom_gijs" href={ENERGIESCAN_HREF} size="md" iconRight="arrow-right">Vraag een energiescan aan</WhatsAppTrackedButton>
              <p className="text-[15px] text-zinc-700">
                of <Link href="/contact" className={TEKSTLINK}>neem contact op</Link>
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-14 lg:mt-16">
          <h3 className={H3_GROOT}>Soms is een andere stap slimmer</h3>
          <p className={LEAD + " mt-3 mb-8"}>We kijken wat jouw woning nodig heeft en kunnen die maatregelen ook voor je uitvoeren.</p>
          {/* Onder 480px compact: kleine foto links, tekst rechts, zodat vier kaarten geen lange strook worden. */}
          <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 min-[480px]:gap-4 lg:gap-5">
            {ANDERE_STAPPEN.map(stap => (
              <li key={stap.titel} className="flex flex-row min-[480px]:flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white">
                <div className="relative w-28 shrink-0 min-[480px]:w-auto min-[480px]:aspect-[4/3] bg-[var(--grey-050)]">
                  <Image src={stap.foto} alt={stap.alt} fill sizes="(max-width: 480px) 112px, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 min-[480px]:gap-2 p-4 min-[480px]:p-5">
                  <h4 className={KAARTKOP}>{stap.titel}</h4>
                  <p className={KAARTTEKST}>{stap.tekst}</p>
                  <Link href={stap.href} className="mt-auto inline-flex items-center gap-1 pt-1 text-[15px] font-semibold text-[var(--accent-700)] no-underline hover:text-[var(--gijs-donkergroen)]">
                    Lees meer<span className="sr-only"> over {stap.titel.toLowerCase()}</span> <Icon name="arrow-right" size="sm" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Google-reviews, live. Zonder geldige data verdwijnt deze sectie helemaal. */}
      <GoogleReviewsSectie className={SECTIE} titel="Ervaringen met Gijs"
        intro="Lees hoe andere woningeigenaren de begeleiding, het advies en de uitvoering door Gijs hebben ervaren." />

      <section id="vervangen" className={SECTIE}>
        <div className={GRIJS_BLOK}>
          <div className="flex mb-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <p className={EYEBROW}>Cv-ketel vervangen</p>
              <h2 className={H2}>Wanneer vervang je je cv-ketel?</h2>
              <p className={TEKST}>
                Je hoeft niet te wachten tot je ketel het opgeeft. Herken je een van deze signalen, dan is het slim om
                op tijd te kijken wat er mogelijk is.
              </p>
            </div>
            <GijsWatermark />
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-8 lg:mb-10">
            {SIGNALEN.map(s => (
              <li key={s.titel} className={WIT_BLOK + " flex flex-col gap-3"}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]">
                  <Icon name={s.icon} size="md" />
                </span>
                <h3 className={KAARTKOP}>{s.titel}</h3>
                <p className={KAARTTEKST}>{s.tekst}</p>
              </li>
            ))}
          </ul>

          {/* Compacte CTA-balk zonder portret: Naud staat al uitgebreid bij "Waarom Gijs". */}
          <div className="flex flex-col gap-5 rounded-[var(--radius-lg)] bg-white p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h3 className={KAARTKOP}>Twijfel je of je ketel vervangen moet worden?</h3>
              <p className={KAARTTEKST}>
                Tijdens een energiescan bekijken we je huidige ketel en verwarming. Je hoort eerlijk of vervangen nodig
                is, en wat de slimste volgende stap is.
              </p>
            </div>
            <WhatsAppTrackedButton plaats="maatregelpagina_vervangen" href={ENERGIESCAN_HREF} size="md" iconRight="arrow-right" className="self-start md:self-center shrink-0">Vraag een energiescan aan</WhatsAppTrackedButton>
          </div>
        </div>
      </section>

      {/* Ketel of warmtepomp: drie mogelijkheden naast elkaar, de 2029-regels eronder. Kosten en
          subsidie van de hybride warmtepomp staan op de warmtepomppagina. */}
      <section id="keuze" className={SECTIE}>
        <Kop eyebrow="Gas, hybride of elektrisch" titel="Nieuwe cv-ketel, hybride of volledig elektrisch?"
          lead="Is je ketel aan vervanging toe, dan heb je drie mogelijkheden. Welke past, hangt af van je woning." />

        <div className={GRIJS_BLOK}>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {KEUZES.map(keuze => (
              <li key={keuze.titel} className={WIT_BLOK + " flex flex-col gap-4"}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]">
                  <Icon name={keuze.icon} size="md" />
                </span>
                <h3 className={KAARTKOP}>{keuze.titel}</h3>
                <ul className="flex flex-col gap-2.5">
                  {keuze.punten.map(punt => (
                    <li key={punt} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--text-muted)]">
                      <Icon name="check" size="sm" className="mt-1 shrink-0 text-[var(--accent-600)]" />
                      <span>{punt}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-4 max-w-3xl">
            <p className={TEKST}>
              Welke mogelijkheid bij jouw huis past, hoef je niet zelf uit te zoeken. Dat bekijkt Gijs samen met je
              tijdens de energiescan. Wil je meer weten over de besparing, kosten en subsidie van een hybride
              warmtepomp? <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>Lees meer over de warmtepomp</Link>.
            </p>
            <p className={TEKST}>
              Het kabinet wil vanaf 2029 strengere eisen stellen als je je cv-ketel vervangt. De regels zijn nog niet
              definitief, en een ketel die goed werkt hoeft niet weg.{" "}
              <Link href="/kennis/cv-ketel-vervangen-2029-gas-of-warmtepomp" className={TEKSTLINK}>Lees wat er verandert</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Ketels die Gijs plaatst: alleen Intergas is bevestigd. Gegevens uit lib/content/ketel-producten.ts. */}
      <section id="onze-ketels" className={SECTIE}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10 md:mb-12">
          <div className="flex flex-col gap-4 max-w-3xl">
            <p className={EYEBROW}>Onze ketels</p>
            <h2 className={H2}>Welke cv-ketels plaatst Gijs?</h2>
            <p className={LEAD}>
              We plaatsen hr-combiketels van Intergas. Deze twee uitvoeringen plaatsen we het meest. Welke bij jouw woning
              past, bespreken we graag met je.
            </p>
          </div>
          <Image src="/images/merken/warmtepomp/intergas.png" alt="Logo van Intergas" width={1024} height={328}
            sizes="200px" className="h-9 sm:h-11 w-auto self-start md:self-end shrink-0" />
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          {KETEL_KAARTEN.map(ketel => (
            <li key={ketel.naam} className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--grey-050)]">
                <Image src={ketel.image} alt={ketel.imageAlt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-contain p-8" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <h3 className={KAARTKOP}>
                  <span className="block text-[13px] font-semibold tracking-normal text-[var(--accent-700)]">{ketel.merk}</span>{" "}
                  {ketel.naam}
                </h3>
                <dl className="divide-y divide-[var(--border-default)] border-y border-[var(--border-default)] text-[14px] leading-snug">
                  {[["Type", ketel.type], ["Warm water", ketel.warmwater], ["Vermogen", ketel.vermogen]].map(([label, waarde]) => (
                    <div key={label} className="flex justify-between gap-4 py-2">
                      <dt className="text-zinc-600">{label}</dt>
                      <dd className="text-zinc-800 text-right">{waarde}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          ))}
        </ul>
        <p className={BRON + " mt-4"}>
          CW staat voor warmwatercomfort: hoe hoger het getal, hoe meer warm water de ketel tegelijk kan leveren. Gijs kijkt
          samen met je welk vermogen bij je woning past.
        </p>

        <details className="group mt-8">
          <summary className={UITKLAP}>
            <span className="group-open:hidden">Bekijk alle technische gegevens</span>
            <span className="hidden group-open:inline">Verberg de technische gegevens</span>
            <Icon name="chevron-down" size="sm" className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {KETELS.map(ketel => (
              <div key={ketel.naam}>
                <h4 className="text-[16px] font-semibold text-[var(--gijs-donkergroen)] mb-2">{ketel.merk} {ketel.naam}</h4>
                {ketel.kenmerken.length > 0 && (
                  <ul className="mb-4 flex flex-col gap-2">
                    {ketel.kenmerken.map(k => (
                      <li key={k} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--text-muted)]">
                        <Icon name="check" size="sm" className="mt-1 shrink-0 text-[var(--accent-600)]" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <dl className="divide-y divide-[var(--border-default)] border-y border-[var(--border-default)] text-[14px] leading-snug">
                  {ketel.technisch.map(rij => (
                    <div key={rij.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-2">
                      <dt className="text-zinc-600">{rij.label}</dt>
                      <dd className="text-zinc-800">{rij.waarde}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <p className={BRON + " mt-4"}>Bron: productgegevens van Warmteservice.</p>
        </details>
      </section>

      {/* Plaatsen: drie korte kaarten en de animatie, net als op de warmtepomppagina. */}
      <section id="plaatsen" className={SECTIE}>
        <Kop eyebrow="Cv-ketel laten plaatsen" titel="Een nieuwe cv-ketel laten plaatsen: hoe werkt dat?" />

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
          <p className={LEAD}>We vervangen je ketel volgens een vaste aanpak: de oude ketel eruit, de nieuwe erin, alles gecontroleerd en netjes opgeleverd.</p>
        </div>
        <KetelInstallatieAnimatie />
      </section>

      <section id="subsidie" className={SECTIE}>
        <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-9 sm:px-10 lg:px-12 lg:py-11">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 text-zinc-600">
              <p className={EYEBROW}>Subsidie</p>
              <h2 className={H2}>Subsidie bij een nieuwe cv-ketel?</h2>
              <p>
                Voor een nieuwe cv-ketel op gas bestaat geen ISDE-subsidie. Combineer je de ketel met een hybride
                warmtepomp, dan kun je voor de warmtepomp wel ISDE-subsidie aanvragen. Hoeveel je krijgt, hangt af van
                het type warmtepomp, en de voorwaarden kunnen wijzigen. Gijs kan je helpen met de aanvraag.
              </p>
              <p className="text-sm">
                Meer weten over de landelijke ISDE-regeling? Bekijk de{" "}
                <a href="https://www.rvo.nl/subsidies-financiering/isde" target="_blank" rel="noopener noreferrer" className={TEKSTLINK}>
                  officiële ISDE-pagina van RVO<span className="sr-only"> (opent in nieuw tabblad)</span>
                </a>.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:pt-10">
              <h3 className="text-lg font-bold text-[var(--gijs-donkergroen)]">Welke subsidies passen bij jouw woning?</h3>
              <p className="text-zinc-700">Vul je postcode en huisnummer in en zie direct alle regelingen voor jouw adres.</p>
              <SubsidiecheckStart idPrefix="sc-ketel" />
            </div>
          </div>
        </div>
      </section>

      {/* Kennisartikel over de 2029-regels voor cv-ketels, als dezelfde kaart als op /kennis. */}
      <section id="kennis" className={SECTIE}>
        <Kop eyebrow="Kennis" titel="Cv-ketel vervangen: gas of warmtepomp?" />
        <ArtikelKaarten slugs={["cv-ketel-vervangen-2029-gas-of-warmtepomp"]} />
      </section>

      <section id="veelgestelde-vragen" className={SECTIE}>
        <h2 className={H2 + " mb-8 max-w-3xl"}>Veelgestelde vragen over cv-ketels</h2>
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
            Is je cv-ketel aan vervanging toe? Vraag een gratis energiescan aan, of ontdek eerst zelf in de woningscan
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
