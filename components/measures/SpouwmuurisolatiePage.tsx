import Image from "next/image";
import Link from "next/link";
import { titelOvergang } from "@/lib/overgang";
import { FotoOvergang } from "@/components/FotoOvergang";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL, ENERGIESCAN_HREF } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import { SPOUW_PRODUCTS } from "@/lib/content/spouw-products";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { WhatsAppTrackedButton } from "@/components/regio/WhatsAppTrackedButton";
import { RegioBreadcrumb, RegioMain, H2 } from "@/components/regio/RegioBlokken";
import { AdviseurFoto, ADVISEUR_FOTO } from "@/components/regio/VerhaalSecties";
import { SubsidiecheckStart } from "@/components/subsidie/SubsidiecheckStart";
import {
  EYEBROW, SECTIE_BASE, LEAD, TEKST, BRON, WIT_BLOK, GRIJS_BLOK, HERO_H1, HERO_INTRO, GijsWatermark,
  RASTER, RASTER_CEL, TEKSTLINK, H3_GROOT, KAARTKOP, KAARTTEKST, Kop,
} from "@/components/regio/regio-template-styles";
import { ArtikelKaarten } from "@/components/kennis/ArtikelKaarten";
import regioStyles from "@/components/regio/regio.module.css";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { MeasureRegioLink } from "@/components/measures/MeasureRegioLink";
import { SpouwmuurInstallatieAnimatie } from "@/components/measures/SpouwmuurInstallatieAnimatie";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Spouwmuurisolatiepagina in de stijl van de warmtepomp-/isolatieglas-/ketelpagina
// (SEO-ronde 25-11-2026). Aanleiding: GSC (7 dagen, filter +spouw) toont vooral
// "spouwisolatie" (63 vert., pos. 27,4) en "spouwmuurisolatie" (33 vert., pos. 46,9),
// en daarnaast duidelijke clusters rond inspectie ("spouwmuur inspectie", "heb ik een
// spouwmuur"), materiaal (pur, glaswol, isolatiekorrels), dikte/smalle spouw en
// vervangen/verwijderen van oude isolatie. Plaatsgebonden zoekwoorden
// (spouwmuurisolatie + plaatsnaam) horen bij de regiopagina's en blijven hier buiten
// beschouwing.
//
// NIEUWE BRON: "Feiten en fabels na-isoleren van spouwmuren" (Milieu Centraal / RVO /
// Ministerie BZK, onderzoek door TU Delft en AaCee Bouwen & Milieu, oktober 2015). Dit
// is dezelfde, nu wel gelezen en geverifieerde bron die bij de vorige contentronde nog
// bewust buiten de pagina is gehouden. Gebruikt voor: minimale spouwbreedte (40 mm,
// 30 mm bij PUR), het belang van vooronderzoek/endoscopie, en de feiten-en-fabels-sectie
// over vocht, koudebruggen en gezondheid. Het is onderzoek uit 2015: cijfers over
// besparing en terugverdientijd uit dat rapport zijn bewust NIET overgenomen (te
// gedateerd voor een concrete besparingsclaim); de kwalitatieve bevindingen over
// vochtrisico, koudebruggen en materiaalveiligheid zijn dat niet en worden met bron en
// jaartal vermeld.
//
// Bronnen materialen/voorwaarden/uitvoering: ongewijzigd de drie aangeleverde
// productbladen "Informatie spouwmuurisolatie (HR EcoWool / HR EcoPearl / HR IsoFoam)
// met aanvullende voorwaarden.pdf", zie lib/content/spouw-products.ts.

const SECTIE = `${SECTIE_BASE} ${regioStyles.opkomen}`;

// Bestaande, goedgekeurde Gijs-foto's: dezelfde beelden als bovenaan de betreffende maatregelpagina's.
const ANDERE_STAPPEN = [
  { titel: "Dakisolatie", tekst: "Een flink deel van de warmte verlaat je huis via het dak. Dakisolatie vermindert dat warmteverlies.", href: "/maatregelen/dakisolatie",
    foto: "/images/maatregelen/dakisolatie/57bfad47-7c34-4f85-80dd-7b3f2f1bf8a4.png", alt: "Dakisolatie wordt tussen de dakconstructie aangebracht" },
  { titel: "Vloerisolatie", tekst: "Ook via een ongeïsoleerde vloer gaat warmte verloren, en voelt de vloer kouder aan.", href: "/maatregelen/vloerisolatie",
    foto: "/images/maatregelen/vloerisolatie/hero_vloerisolatie.png", alt: "Vloerisolatie wordt vanuit de kruipruimte tegen de onderzijde van de vloer aangebracht" },
  { titel: "Isolatieglas", tekst: "Isolatieglas vermindert warmteverlies en verhoogt het comfort bij het raam.", href: "/maatregelen/isolatieglas",
    foto: "/images/maatregelen/glas/isolatieglas.png", alt: "Monteur van Gijs plaatst isolatieglas in een raam" },
  { titel: "Kozijnen", tekst: "Oude, lekkende kozijnen tasten het isolerend effect van een goede gevel aan.", href: "/maatregelen/kozijnen",
    foto: "/images/maatregelen/kozijnen/kozijnen-hero.jpg", alt: "Nieuw geplaatst kozijn met raam en voordeur" },
];

// Waar Gijs tijdens het vooronderzoek op let. Bron: SKG-IKOB-uitvoeringsrichtlijnen,
// geciteerd in Milieu Centraal/RVO/TU Delft, "Feiten en fabels na-isoleren van
// spouwmuren", oktober 2015, par. 3.2 en bijlage 1.
const VOORONDERZOEK = [
  { icon: "ruler", titel: "De breedte van de spouw", tekst: "Een spouw moet minimaal 40 mm breed zijn om te isoleren (30 mm bij PUR-isolatieschuim). Bij een smallere spouw neemt de kans op vochtdoorslag toe." },
  { icon: "search", titel: "Vervuiling in de spouw", tekst: "Specieresten of puin in de spouw kunnen regendoorslag veroorzaken. Een vervuilde spouw moet eerst gereinigd worden." },
  { icon: "brick-wall", titel: "De staat van de gevel", tekst: "Scheuren, gebrekkig voegwerk of een sterk vochtremmende afwerking (zoals geglazuurde steen) kunnen een reden zijn om niet te isoleren." },
  { icon: "cat", titel: "Vleermuizen in de spouw", tekst: "Vleermuizen zijn wettelijk beschermd. Zitten ze in de spouw, dan moeten daar eerst maatregelen voor getroffen worden." },
];

const MATERIAAL_ICONEN: Record<string, string> = {
  "Glaswolvlokken": "wind",
  "EPS-isolatieparels": "circle-dot",
  "PUR-isolatieschuim": "droplets",
};

// Feiten en fabels: bron Milieu Centraal/RVO/TU Delft, oktober 2015 (zie boven).
const FEITEN_EN_FABELS = [
  {
    vraag: "Veroorzaakt spouwmuurisolatie vochtdoorslag?",
    antwoord: "Bij een geschikt, goed aangebracht isolatiemateriaal neemt de kans op vochtdoorslag niet toe. In het verleden gingen ongeschikte, vochtabsorberende materialen wel eens mis; daarom is de vooropname van de spouw zo belangrijk, en is dit onderdeel van de uitvoeringsrichtlijnen waaraan Gijs werkt.",
  },
  {
    vraag: "Versterkt spouwmuurisolatie koudebruggen?",
    antwoord: "Nee. Bestaande koudebruggen (bijvoorbeeld bij lateien) kunnen door spouwmuurisolatie niet erger worden. In de meeste gevallen vermindert isolatie de koudebrugwerking juist.",
  },
  {
    vraag: "Zijn glaswol en PUR schadelijk voor de gezondheid?",
    antwoord: "Volgens onderzoek zijn mineraalwolvezels niet kankerverwekkend en lossen ze op in de longen als ze daar al in terechtkomen. Het PUR dat in de spouw gegoten wordt (niet gespoten), geeft voor bewoners geen te verwachten gezondheidseffecten.",
  },
];

export function SpouwmuurisolatiePage({ item }: { item: MeasurePageItem }) {
  const startScanHref = "/woning?maatregel=" + item.id;

  const plaatsKaarten = [
    {
      icon: "user-check",
      titel: "Eén vast aanspreekpunt",
      tekst: "Van de energiescan tot de uitvoering en oplevering: je houdt één vast aanspreekpunt. Gijs regelt de planning en de uitvoering voor je.",
    },
    {
      icon: "wallet",
      titel: "Wat kost spouwmuurisolatie?",
      tekst: "Dat hangt af van het geveloppervlak en het gekozen materiaal. Tijdens de energiescan brengt Gijs dit voor jouw situatie in kaart.",
    },
    {
      icon: "calendar-check",
      titel: "In één dag geplaatst",
      tekst: "De uitvoering van spouwmuurisolatie neemt meestal één dag in beslag. Na afloop worden de boorgaten netjes afgevoegd.",
    },
  ];

  const faqItems: FAQItem[] = [
    { question: "Hoe weet ik of mijn woning een spouwmuur heeft?", answer: "De meeste Nederlandse woningen vanaf de jaren '20 hebben een spouwmuur: twee gemetselde muren met een luchtspouw ertussen. Of jouw spouw bestaat en geschikt is om te isoleren, bekijkt Gijs met een endoscoop tijdens de energiescan." },
    { question: "Is mijn spouw geschikt voor isolatie?", answer: "Dat hangt af van de breedte en de staat van de spouw en de gevel. Zo moet de spouw minimaal 40 mm breed zijn (30 mm bij PUR), en mag deze niet ernstig vervuild zijn of ernstige gebreken vertonen. Gijs beoordeelt dit tijdens de energiescan. Dit is geen definitief technisch advies vooraf." },
    { question: "Kan oude of onvolledige spouwmuurisolatie vervangen worden?", answer: "Is je spouw ooit gedeeltelijk gevuld, of is het isolatiemateriaal in de loop der jaren uitgezakt? Dan beoordeelt Gijs via een endoscopische inspectie wat er in de spouw zit en of aanvullen of vervangen mogelijk is." },
    { question: "Welk materiaal past bij mijn spouw?", answer: item.answer },
    { question: "Zorgt spouwmuurisolatie voor vochtproblemen?", answer: "Bij een geschikt, goed aangebracht materiaal neemt de kans op vochtproblemen niet toe. Vochtklachten na isolatie hebben vrijwel altijd een andere oorzaak, zoals verminderde ventilatie." },
    { question: "Hoe lang duurt de uitvoering?", answer: "De uitvoering van spouwmuurisolatie neemt meestal één dag in beslag." },
    { question: "Wat moet ik voorbereiden en waar moet ik rekening mee houden?", answer: "Gijs bespreekt dit vooraf met je, zodat je weet waar je aan toe bent. Een paar praktische punten:", punten: [
      "De te isoleren gevels zijn voor aanvang van de werkzaamheden bereikbaar en toegankelijk",
      "Er is voor aanvang van de werkzaamheden een watervoorziening (buitenkraan) aanwezig",
      "Er is parkeergelegenheid voor een combinatie van circa 15 meter lang",
      "Bij het boren is het soms onvermijdelijk dat de hoeken van de stenen worden geraakt",
      "Er is een toilet beschikbaar voor de uitvoerende partij",
    ] },
  ];

  return (
    <RegioMain>
      <RegioBreadcrumb crumbs={[
        { naam: "Home", url: "/" },
        { naam: "Maatregelen", url: "/maatregelen" },
        { naam: "Spouwmuurisolatie", url: "/maatregelen/" + item.slug },
      ]} />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Spouwmuurisolatie",
        serviceType: "Isoleren van de spouwmuur",
        description: "Gijs kijkt met je mee of je spouwmuur geschikt is voor isolatie, welk materiaal past, en verzorgt de uitvoering: één aanspreekpunt van advies tot oplevering.",
        url: SITE_URL + "/maatregelen/" + item.slug,
        provider: { "@id": SITE_URL + "/#organization" },
        areaServed: { "@type": "Country", name: "Nederland" },
      }} />

      <header className="pt-2 lg:pt-6 mb-14 md:mb-20">
        <p className={EYEBROW + " mb-4"}>Spouwmuurisolatie</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
          <div className="flex flex-col gap-5">
            <h1 className={HERO_H1} style={titelOvergang("maatregel-" + item.slug)}>Spouwmuurisolatie voor jouw woning</h1>
            <p className={HERO_INTRO}>
              Zie spouwmuurisolatie als een extra jas voor je woning. Via kleine openingen in de gevel wordt de spouw
              gevuld met isolatiemateriaal, waardoor je minder warmte verliest en je huis comfortabeler aanvoelt. Gijs
              beoordeelt of je spouw geschikt is en regelt de uitvoering, met één vast aanspreekpunt.
            </p>
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
                <Image src="/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-aanbrengen-gijs.png"
                  alt="Spouwmuurisolatie wordt via een boorgat in de gevel aangebracht" fill priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover/hero:scale-[1.03]" />
              </div>
            </FotoOvergang>
          </figure>
        </div>
      </header>

      <MeasureSectionNav tweeRegelsMobiel sections={[
        { id: "waarom-gijs", label: "Waarom Gijs" },
        { id: "spouwmuur", label: "Heb ik een spouw?" },
        { id: "plaatsen", label: "Plaatsen" },
        { id: "feiten-en-fabels", label: "Feiten en fabels" },
        { id: "materialen", label: "Materialen" },
        { id: "subsidie", label: "Subsidie" },
        { id: "veelgestelde-vragen", label: "Vragen" },
      ]} />

      {/* Waarom Gijs: verhaal links, Thom rechts; daaronder de stappen die soms eerst slimmer zijn. */}
      <section id="waarom-gijs" className={SECTIE + " mt-8 lg:mt-12"}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8 lg:gap-14 items-stretch">
          <div className="flex flex-col gap-4 max-w-3xl">
            <p className={EYEBROW}>Waarom Gijs?</p>
            <h2 className={H2}>Waarom spouwmuurisolatie via Gijs?</h2>
            <p className={TEKST}>
              We kijken eerst naar je woning: heeft deze een spouwmuur, en is die geschikt om te isoleren? Niet elke
              spouw is dat. Een nauwkeurige vooropname voorkomt verrassingen achteraf, en bepaalt ook welk materiaal
              het beste past.
            </p>
            <p className={TEKST}>
              Past spouwmuurisolatie bij jouw huis? Dan regelen we ook de uitvoering. Je hebt één aanspreekpunt voor
              het advies en het werk zelf.
            </p>
          </div>

          <aside aria-labelledby="thom-titel" className="flex flex-col gap-5 rounded-[var(--radius-lg)] bg-[var(--accent-100)] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <AdviseurFoto src={ADVISEUR_FOTO.thom.src} alt={ADVISEUR_FOTO.thom.alt} className="size-20 sm:size-24" />
              <h3 id="thom-titel" className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[var(--gijs-donkergroen)]">Thom kijkt graag met je mee</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty]">
              Hij komt bij je thuis langs, bekijkt je spouw en gevel en vertelt je eerlijk wat er mogelijk is, ook als
              een andere stap eerst slimmer is.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty]">
              Dit gebeurt tijdens een gratis energiescan aan huis, t.w.v. €349.
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

      {/* Heb ik een spouwmuur en is hij geschikt: uitleg + vooronderzoek-criteria. */}
      <section id="spouwmuur" className={SECTIE}>
        <div className={GRIJS_BLOK}>
          <div className="flex mb-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <p className={EYEBROW}>Spouwmuur</p>
              <h2 className={H2}>Heeft mijn woning een spouwmuur, en is die geschikt?</h2>
              <p className={TEKST}>
                De meeste Nederlandse woningen hebben een spouwmuur: twee gemetselde muren met daartussen een
                luchtspouw van enkele centimeters. Via kleine openingen in de buitengevel wordt die ruimte gevuld
                met isolatiemateriaal.
              </p>
              <p className={TEKST}>
                Niet elke spouw is geschikt. Gijs doet daarom eerst een vooropname, onder meer met een endoscoop, en
                let daarbij op het volgende:
              </p>
            </div>
            <GijsWatermark />
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-8 lg:mb-10">
            {VOORONDERZOEK.map(v => (
              <li key={v.titel} className={WIT_BLOK + " flex flex-col gap-3"}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]">
                  <Icon name={v.icon} size="md" />
                </span>
                <h3 className={KAARTKOP}>{v.titel}</h3>
                <p className={KAARTTEKST}>{v.tekst}</p>
              </li>
            ))}
          </ul>
          <p className={BRON}>
            Bron: uitvoeringsrichtlijnen SKG-IKOB, geciteerd in &quot;Feiten en fabels na-isoleren van spouwmuren&quot;,
            Milieu Centraal / RVO / Ministerie BZK (onderzoek TU Delft en AaCee Bouwen &amp; Milieu), oktober 2015.
          </p>

          <div className="mt-8 flex flex-col gap-5 rounded-[var(--radius-lg)] bg-white p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h3 className={KAARTKOP}>Al eerder (gedeeltelijk) geïsoleerd, of twijfel je of je spouw geschikt is?</h3>
              <p className={KAARTTEKST}>
                Is je spouw ooit gedeeltelijk gevuld, of denk je dat het isolatiemateriaal in de loop der jaren is
                uitgezakt? Via een endoscopische inspectie bekijkt Gijs wat er in de spouw zit en wat er mogelijk is.
              </p>
            </div>
            <WhatsAppTrackedButton plaats="maatregelpagina_spouwmuur" href={ENERGIESCAN_HREF} size="md" iconRight="arrow-right" className="self-start md:self-center shrink-0">Vraag een energiescan aan</WhatsAppTrackedButton>
          </div>
        </div>
      </section>

      {/* Materialen: glaswolvlokken, EPS-parels, PUR-schuim. */}
      {/* Plaatsen: drie korte kaarten en de animatie. */}
      <section id="plaatsen" className={SECTIE}>
        <Kop eyebrow="Spouwmuurisolatie laten plaatsen" titel="Spouwmuurisolatie laten aanbrengen: hoe werkt dat?" />

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
        <SpouwmuurInstallatieAnimatie />
      </section>

      {/* Feiten en fabels: de drie meest gestelde vragen over vocht, koudebruggen en gezondheid. */}
      <section id="feiten-en-fabels" className={SECTIE}>
        <div className={GRIJS_BLOK}>
          <div className="flex mb-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <p className={EYEBROW}>Feiten en fabels</p>
              <h2 className={H2}>Spouwmuurisolatie: feiten en fabels</h2>
              <p className={TEKST}>
                Over het na-isoleren van spouwmuren doen al jaren hardnekkige verhalen de ronde. Onderzoek in opdracht
                van Milieu Centraal en RVO zet de belangrijkste zorgen tegenover de feiten.
              </p>
            </div>
            <GijsWatermark />
          </div>

          <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
            {FEITEN_EN_FABELS.map(f => (
              <li key={f.vraag} className={WIT_BLOK + " flex flex-col gap-3"}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]">
                  <Icon name="shield-check" size="md" />
                </span>
                <h3 className={KAARTKOP}>{f.vraag}</h3>
                <p className={KAARTTEKST}>{f.antwoord}</p>
              </li>
            ))}
          </ul>
          <p className={BRON + " mt-4"}>
            Bron: &quot;Feiten en fabels na-isoleren van spouwmuren&quot;, Milieu Centraal / RVO / Ministerie BZK
            (onderzoek TU Delft en AaCee Bouwen &amp; Milieu), oktober 2015.
          </p>
        </div>
      </section>

      <section id="materialen" className={SECTIE}>
        <Kop eyebrow="Materialen" titel="Welk isolatiemateriaal past bij jouw spouw?"
          lead="Gijs werkt met verschillende isolatiematerialen. Welk materiaal het meest geschikt is, hangt af van jouw woning. Dit is geen keuze voor het &quot;beste&quot; materiaal." />

        <ul className={RASTER + " gap-4 lg:gap-5"}>
          {SPOUW_PRODUCTS.map((product, i) => (
            <li key={product.name} className={(product.highlight ? "bg-[var(--surface-tint)]" : "bg-white") + " flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] " + RASTER_CEL(SPOUW_PRODUCTS.length, i)}>
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--grey-050)]">
                <Image src={product.image} alt={product.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-6" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className={KAARTKOP}>{product.name}</h3>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]">
                    <Icon name={MATERIAAL_ICONEN[product.name] ?? "layers"} size="sm" />
                  </span>
                </div>
                {product.badge && <span className="self-start rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-[var(--accent-700)]">{product.badge}</span>}
                <p className={KAARTTEKST}>{product.text}</p>
                {product.benefits.length > 0 && (
                  <ul className="flex flex-col gap-2 border-t border-[var(--border-default)] pt-4 mt-auto">
                    {product.benefits.map(b => (
                      <li key={b} className="flex items-start gap-2 text-sm text-zinc-700">
                        <Icon name="check" size="sm" className="mt-0.5 text-[var(--accent-700)] shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className={BRON + " mt-4"}>
          Tijdens de energiescan wordt bekeken welk materiaal bij de woning en de bestaande situatie past.
        </p>
      </section>

      <section id="subsidie" className={SECTIE}>
        <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-9 sm:px-10 lg:px-12 lg:py-11">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 text-zinc-600">
              <p className={EYEBROW}>Subsidie</p>
              <h2 className={H2}>Subsidie bij spouwmuurisolatie</h2>
              <p>
                Voor spouwmuurisolatie kan subsidie beschikbaar zijn, bijvoorbeeld als onderdeel van een pakket met
                meerdere isolatiemaatregelen. Welke regelingen op dit moment gelden en onder welke voorwaarden,
                bespreken we tijdens de energiescan. Gijs kan je daarna helpen met de subsidieaanvraag.
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
              <SubsidiecheckStart idPrefix="sc-spouwmuurisolatie" />
            </div>
          </div>
        </div>
      </section>

      {/* Kennisartikel over UF-schuim, als dezelfde kaart als op /kennis. */}
      <section id="kennis" className={SECTIE}>
        <Kop eyebrow="Kennis" titel="UF-schuim en spouwmuurisolatie" />
        <ArtikelKaarten slugs={["uf-schuim-spouwmuurisolatie-risicos-alternatieven"]} />
      </section>

      <section id="veelgestelde-vragen" className={SECTIE}>
        <h2 className={H2 + " mb-8 max-w-3xl"}>Veelgestelde vragen over spouwmuurisolatie</h2>
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
            Je spouwmuur laten isoleren? Vraag een gratis energiescan aan, of ontdek eerst zelf in de woningscan welke
            maatregelen bij jouw huis passen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 self-start shrink-0">
            <Button href={startScanHref} variant="accent" size="md" iconRight="arrow-right">Start de woningscan</Button>
            <WhatsAppTrackedButton plaats="maatregelpagina_afsluiting" href={ENERGIESCAN_HREF} size="md" iconRight="arrow-right" variant="secondary">Vraag een energiescan aan</WhatsAppTrackedButton>
          </div>
        </div>
      </section>

      <MeasureRegioLink voorbeeld={[
        "Spouwmuurisolatie in je eigen gemeente? In Borne is ruim een derde van de woningen gebouwd vóór 1975, in Apeldoorn 46%. Lees meer over ",
        { tekst: "spouwmuurisolatie in Apeldoorn", href: "/regio/gelderland/apeldoorn#isoleren" },
        " en over ",
        { tekst: "isolatie in Borne", href: "/regio/overijssel/borne" },
        ".",
      ]} regios={{
        kop: "Spouwmuurisolatie in de regio",
        links: [
          { tekst: "Spouwmuurisolatie in Ommen", href: "/regio/overijssel/ommen#isoleren" },
          { tekst: "De spouw isoleren in Raalte", href: "/regio/overijssel/raalte#isoleren" },
          { tekst: "Spouwmuurisolatie in Steenwijk", href: "/regio/overijssel/steenwijkerland#isoleren" },
          { tekst: "Isolatie in Delden", href: "/regio/overijssel/hof-van-twente/delden" },
          { tekst: "Isolatie in Vroomshoop", href: "/regio/overijssel/twenterand/vroomshoop" },
        ],
      }} />
    </RegioMain>
  );
}
