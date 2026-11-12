import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL, ENERGIESCAN_HREF } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
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
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { MeasureRegioLink } from "@/components/measures/MeasureRegioLink";
import { WarmtepompInstallatieAnimatie } from "@/components/measures/WarmtepompInstallatieAnimatie";
import { MerkenStrook } from "@/components/measures/MerkenStrook";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { GoogleScore } from "@/components/reviews/GoogleScore";
import { GoogleReviewsSectie } from "@/components/reviews/GoogleReviewsSectie";
import { WARMTEPOMP_MERKEN } from "@/lib/content/warmtepomp-merken";
import { WARMTEPOMP_PRODUCTEN } from "@/lib/content/warmtepomp-producten";
import { WARMTEPOMP_VOORBEELDEN, contactLinkVoorModel } from "@/lib/content/warmtepomp-voorbeelden";
import {
  WARMTEPOMP_HUIDIG_VERBRUIK, WARMTEPOMP_GASBESPARING, WARMTEPOMP_STROOM_ERBIJ,
} from "@/lib/content/warmtepomp-besparing";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Warmtepomppagina in de stijl van de isolatieglaspagina, opgebouwd volgens de definitieve
// structuur van Max (12-11-2026, met ontwerpschets):
//   hero (+ live Google-score) → navigatie → Waarom een warmtepomp bij Gijs? (verhaal + Naud,
//   Soms is een andere stap slimmer, merklogo's) → Google-reviews → besparing →
//   welke past → voorbeelden van warmtepompen → plaatsen (+ animatie) → subsidie → vragen → afsluiting.
//
// INHOUDELIJKE AFSPRAKEN, ongewijzigd van kracht:
// - Besparing: Nauds vuistregels zijn leidend (lib/content/warmtepomp-besparing.ts). De
//   cijfers hieronder worden daar alleen mee uitgerekend, niet aangepast:
//     bespaard gas = huidig gas x 0,6; extra stroom hybride = 2.000 kWh per jaar.
// - Geen prijzen: geen aanschafprijs, bandbreedte, installatieprijs, maandbedrag of kostentabel.
// - Geen euro's bij de besparing; de gasprijsindicatie (nov. 2026) staat niet op de pagina.
// - Koelen en levensduur: overal weggelaten. COP/SCOP: niet op de pagina.
// - Google-score en reviews komen live uit /api/google-reviews (useGoogleReviews); niets vast.
// - Subsidie via de bestaande subsidiecheck (SubsidiecheckStart), geen bedragen.
// - Voorbeeldwarmtepompen: zie lib/content/warmtepomp-voorbeelden.ts (twee foto's ontbreken nog).
// - De plaatsingsanimatie staat altijd direct in beeld.

const SECTIE = `${SECTIE_BASE} ${regioStyles.opkomen}`;

// Bestaande, goedgekeurde Gijs-foto's: dezelfde beelden als bovenaan de betreffende maatregelpagina's.
const ANDERE_STAPPEN = [
  { titel: "Thuisbatterij", tekst: "Met een thuisbatterij sla je zonnestroom op voor later gebruik, ook als de warmtepomp draait.", href: "/maatregelen/thuisbatterij",
    foto: "/images/maatregelen/thuisbatterij/thuisbatterij-hero-v2.png", alt: "Een Gijs-installateur sluit een thuisbatterij aan" },
  { titel: "Isolatieglas", tekst: "Isolatieglas vermindert warmteverlies en verhoogt het comfort bij het raam.", href: "/maatregelen/isolatieglas",
    foto: "/images/maatregelen/glas/isolatieglas.png", alt: "Monteur van Gijs plaatst isolatieglas in een raam" },
  { titel: "Vloerverwarming", tekst: "Vloerverwarming werkt op een lagere watertemperatuur en sluit daardoor goed aan op een warmtepomp.", href: "/maatregelen/vloerverwarming",
    foto: "/images/maatregelen/vloerverwarming/vloerverwarming-hero.png", alt: "Een installateur van Gijs giet de dekvloer over de vloerverwarmingsleidingen" },
  { titel: "Zonnepanelen", tekst: "Met zonnepanelen kun je een deel van het extra stroomverbruik van de warmtepomp zelf opwekken.", href: "/maatregelen/zonnepanelen",
    foto: "/images/maatregelen/zonnepanelen/zonnepanelen-schuin-dak.jpg", alt: "Zonnepanelen op het schuine pannendak van een woning" },
];

const TYPES: HouseType[] = ["tussenwoning", "hoekwoning", "twee-onder-een-kap", "vrijstaand"];

// Gasverbruik per jaar per woningtype, uit Nauds vuistregels (lib/content/warmtepomp-besparing.ts).
// Geeft exact: 1.200/480/720, 1.400/560/840, 1.500/600/900 en 1.800/720/1.080 m³.
const GASBESPARING = TYPES.map(type => {
  const nu = WARMTEPOMP_HUIDIG_VERBRUIK[type].gas;
  const hybride = Math.round(nu * (1 - WARMTEPOMP_GASBESPARING.hybride));
  return { label: HOUSE_MODELS[type].label, nu, hybride, minder: nu - hybride };
});
const m3 = (n: number) => `${n.toLocaleString("nl-NL")} m³`;

const HYBRIDE = [
  "Werkt samen met je bestaande cv-ketel",
  "Past in veel bestaande woningen",
  "Je radiatoren kunnen meestal blijven",
  "In één dag geplaatst",
];

const VOLLEDIG = [
  "Vervangt je cv-ketel helemaal, ook voor warm water",
  "Vraagt een goed geïsoleerd huis",
  "Vaak met grotere radiatoren of vloerverwarming",
  "Je gaat helemaal van het gas af",
];

// Waar Gijs op let. Alleen in de uitklapper, als één rustige opsomming (teksten van Max, 12-11-2026).
const CRITERIA = [
  { titel: "Isolatie", tekst: "Hoe beter je huis is geïsoleerd, hoe meer je aan een warmtepomp hebt. Bij matige isolatie kijkt Gijs eerst welke isolatiemaatregelen logisch zijn." },
  { titel: "Radiatoren, vloerverwarming en watertemperatuur", tekst: "Een warmtepomp werkt het prettigst met water op een lagere temperatuur. Ruime radiatoren of vloerverwarming zijn daarom gunstig." },
  { titel: "Je huidige cv-ketel", tekst: "Bij een hybride warmtepomp blijft de cv-ketel hangen. Gijs kijkt welke ketel er hangt, hoe oud die is en of die nog geschikt is." },
  { titel: "Ruimte, geluid en de plek van het buitendeel", tekst: "Buiten moet voldoende ruimte zijn voor het buitendeel. De gekozen plek bepaalt mede wat jij en je buren ervan horen." },
  { titel: "Elektra en benodigd vermogen", tekst: "Gijs kijkt welk vermogen je woning vraagt en of de meterkast en groepen daarvoor geschikt zijn." },
];

export function WarmtepompPage({ item }: { item: MeasurePageItem }) {
  const startScanHref = "/woning?maatregel=" + item.id;
  const geluid = WARMTEPOMP_PRODUCTEN[0].geluid.replace(" · ", ", en ");

  const plaatsKaarten = [
    {
      icon: "user-check",
      titel: "Eén vast aanspreekpunt",
      tekst: "Gijs is niet aan één merk gebonden. We adviseren welke oplossing bij jouw woning past en voeren de gekozen oplossing ook voor je uit. Van de energiescan en subsidie tot de planning, installatie en oplevering: je houdt één vast aanspreekpunt.",
    },
    {
      icon: "wallet",
      titel: "Wat kost het?",
      tekst: "Wat een warmtepomp bij jouw woning kost, hangt af van je huis, het type warmtepomp en wat er aan de bestaande verwarming en installatie moet gebeuren. Tijdens de energiescan brengt Gijs dit voor jouw situatie in kaart.",
    },
    {
      icon: "calendar-check",
      titel: "In één dag geplaatst",
      tekst: "We plaatsen een hybride warmtepomp in één dag. Voor een goede werking hoort er daarna een onderhoudscontract bij.",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "Blijft mijn cv-ketel hangen bij een hybride warmtepomp?",
      answer: "Ja. De warmtepomp verzorgt het grootste deel van de verwarming, en de cv-ketel levert het warme water en springt bij als het echt koud is. Het schakelen tussen de twee gaat automatisch.",
    },
    {
      question: "Kan ik mijn bestaande radiatoren houden?",
      answer: "Bij een hybride warmtepomp meestal wel. Bij volledig elektrisch verwarmen zijn grotere radiatoren of vloerverwarming vaker een logische stap. Of jouw radiatoren het aankunnen, bekijkt een adviseur van Gijs bij je thuis.",
    },
    {
      question: "Wordt mijn stroomrekening hoger?",
      answer: `Je stroomverbruik gaat omhoog, bij een hybride warmtepomp met zo'n ${WARMTEPOMP_STROOM_ERBIJ.hybride.toLocaleString("nl-NL")} kWh per jaar. Daar staat tegenover dat je flink minder gas gebruikt. Wat dat onder de streep doet, hangt af van je eigen energiecontract.`,
    },
    {
      question: "Hoeveel geluid maakt een warmtepomp?",
      answer: `Dat verschilt per model. De uitvoering die Gijs het meest plaatst zit op ${geluid}. Waar het buitendeel komt te staan, bepaalt mee wat jij en je buren ervan horen; daar houdt Gijs rekening mee.`,
    },
    {
      question: "Kan een hybride warmtepomp zonder buitenunit?",
      answer: "Een warmtepomp die warmte uit de buitenlucht haalt, heeft altijd een deel buiten nodig. Het hoeft wel geen hoge kast te zijn: er zijn ook uitvoeringen die laag en vlak tegen de gevel staan. Waar het komt en hoe het eruitziet, bespreekt Gijs vooraf met je.",
    },
    {
      question: "Welk merk warmtepomp is het beste?",
      answer: "Dat hangt af van je woning, je verwarming en de ruimte die je hebt. Gijs is aan geen enkel merk gebonden en kijkt welk model bij jouw huis past, niet welk merk er verkocht moet worden.",
    },
  ];

  return (
    <RegioMain>
      <RegioBreadcrumb crumbs={[
        { naam: "Home", url: "/" },
        { naam: "Maatregelen", url: "/maatregelen" },
        { naam: "Warmtepomp", url: "/maatregelen/" + item.slug },
      ]} />

      {/* Wat Gijs hier aanbiedt, als gestructureerde data. Het FAQPage-schema komt uit
          FAQAccordion zelf, dus niet hier nogmaals. */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Warmtepomp plaatsen",
        serviceType: "Plaatsen van een hybride of volledig elektrische warmtepomp",
        description: "Gijs adviseert onafhankelijk over een warmtepomp voor je bestaande woning en verzorgt ook de uitvoering: één aanspreekpunt van advies tot oplevering.",
        url: SITE_URL + "/maatregelen/" + item.slug,
        provider: { "@id": SITE_URL + "/#organization" },
        areaServed: { "@type": "Country", name: "Nederland" },
      }} />

      <header className="pt-2 lg:pt-6 mb-14 md:mb-20">
        <p className={EYEBROW + " mb-4"}>Warmtepomp</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
          <div className="flex flex-col gap-5">
            <h1 className={HERO_H1}>Een warmtepomp in je bestaande woning</h1>
            <p className={HERO_INTRO}>
              Een warmtepomp haalt warmte uit de buitenlucht en verwarmt daarmee je huis. Je gebruikt flink minder gas
              en het wordt er comfortabeler van. Gijs adviseert én voert uit, met één aanspreekpunt van advies tot
              oplevering.
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
            <div className="relative aspect-[3/2] lg:aspect-auto lg:h-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--grey-050)]">
              <Image src="/images/maatregelen/warmtepomp/warmtepomp-hero.png"
                alt="Een installateur van Gijs plaatst een warmtepomp tegen de gevel van een woning" fill priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover/hero:scale-[1.03]" />
            </div>
          </figure>
        </div>
      </header>

      <MeasureSectionNav tweeRegelsMobiel sections={[
        { id: "waarom-gijs", label: "Waarom Gijs" },
        { id: "besparing", label: "Besparing" },
        { id: "welke-past", label: "Welke past" },
        { id: "voorbeelden", label: "Voorbeelden" },
        { id: "plaatsen", label: "Plaatsen" },
        { id: "subsidie", label: "Subsidie" },
        { id: "veelgestelde-vragen", label: "Vragen" },
      ]} />

      {/* Waarom: de besparing in één oogopslag, daarna het adviseurblok. */}
      {/* Waarom een warmtepomp bij Gijs? Verhaal links, Naud rechts; daaronder de
          maatregelen die soms eerst slimmer zijn, en de merken als bewijs. */}
      <section id="waarom-gijs" className={SECTIE + " mt-8 lg:mt-12"}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8 lg:gap-14 items-stretch">
          <div className="flex flex-col gap-4 max-w-3xl">
            <p className={EYEBROW}>Waarom Gijs?</p>
            <h2 className={H2}>Waarom een warmtepomp bij Gijs?</h2>
            <p className={TEKST}>
              Bij Gijs werken we met verschillende merken en warmtepompen. We kijken eerst naar je woning en naar wat er
              nodig is om die comfortabel en efficiënt te verwarmen. Niet iedere woning is direct klaar voor een
              warmtepomp. Soms is het slimmer om eerst te isoleren, isolatieglas te plaatsen of de verwarming aan te
              passen. We leggen duidelijk uit welke volgorde bij jouw woning past en waarom.
            </p>
            <p className={TEKST}>
              Kies je voor een warmtepomp? Dan kunnen we de gekozen oplossing ook voor je uitvoeren. Gijs is dus niet
              alleen je adviseur, maar begeleidt en verzorgt ook de uitvoering. Je hebt daarbij één aanspreekpunt voor
              het advies, de subsidie en de werkzaamheden.
            </p>
          </div>

          <aside aria-labelledby="naud-titel" className="flex flex-col gap-5 rounded-[var(--radius-lg)] bg-[var(--accent-100)] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <AdviseurFoto src={ADVISEUR_FOTO.naud.src} alt={ADVISEUR_FOTO.naud.alt} className="size-20 sm:size-24" />
              <h3 id="naud-titel" className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[var(--gijs-donkergroen)]">Naud helpt je graag!</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty]">
              Hij komt bij je thuis langs, kijkt samen met je naar je woning en vertelt je eerlijk wat er mogelijk is, ook
              als een andere stap eerst slimmer is.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty]">
              Hij kijkt onafhankelijk naar jouw woning, is je aanspreekpunt en geeft je advies. Hierbij regelt hij ook de
              uitvoering.
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

          <div className="mt-10">
            <MerkenStrook merken={WARMTEPOMP_MERKEN} intro="We werken onder meer met deze merken." />
          </div>
        </div>
      </section>

      {/* Google-reviews, live. Zonder geldige data verdwijnt deze sectie helemaal. */}
      <GoogleReviewsSectie className={SECTIE} titel="Ervaringen met Gijs"
        intro="Lees hoe andere woningeigenaren de begeleiding, het advies en de uitvoering door Gijs hebben ervaren." />

      <section id="besparing" className={SECTIE}>
        <div className={GRIJS_BLOK}>
          <div className="flex mb-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <p className={EYEBROW}>Waarom een warmtepomp?</p>
              <h2 className={H2}>Hoeveel bespaar je met een warmtepomp?</h2>
              <p className={TEKST}>
                Een warmtepomp haalt warmte uit de buitenlucht, ook als het koud is. Daardoor heb je veel minder gas nodig
                om je huis warm te krijgen. Bij een hybride warmtepomp blijft je cv-ketel hangen voor het warme water en
                de koudste dagen.
              </p>
              <p className={TEKST}>
                Als vuistregel rekent Gijs met ongeveer {Math.round(WARMTEPOMP_GASBESPARING.hybride * 100)}% minder gas,
                en met vloerverwarming ongeveer {Math.round(WARMTEPOMP_GASBESPARING.hybrideMetVloerverwarming * 100)}%.
              </p>
            </div>
            <GijsWatermark />
          </div>

          {/* Vanaf sm dezelfde tabelstijl als op de isolatieglaspagina; daaronder de compacte mobiele rijen. */}
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--accent-700)] mb-3">Gasverbruik per jaar, in m³</p>
          {/* Mobiel: per woningtype één compacte rij, dunne scheidingslijnen, nooit horizontaal scrollen. */}
          <ul className="sm:hidden divide-y divide-[var(--border-default)] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white px-5">
            {GASBESPARING.map(r => (
              <li key={r.label} className="py-4">
                <p className="font-bold text-[var(--gijs-donkergroen)]">{r.label}</p>
                <dl className="mt-1.5 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-[14px] min-[400px]:text-[15px]">
                  <dt className="text-zinc-600">Nu met cv-ketel</dt>
                  <dd className="text-right text-zinc-700 whitespace-nowrap">{m3(r.nu)}</dd>
                  <dt className="text-zinc-600">Met hybride warmtepomp</dt>
                  <dd className="text-right text-zinc-700 whitespace-nowrap">{m3(r.hybride)}</dd>
                  <dt className="font-bold text-[var(--accent-700)]">Minder gas per jaar</dt>
                  <dd className="text-right font-bold text-[var(--accent-700)] whitespace-nowrap">{m3(r.minder)}</dd>
                </dl>
              </li>
            ))}
          </ul>
          <div className="hidden sm:block overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white">
            <table className="w-full text-left border-collapse min-w-[440px]">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th scope="col" className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-[var(--gijs-donkergroen)]">Woningtype</th>
                  <th scope="col" className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-[var(--gijs-donkergroen)] text-right">Nu met cv-ketel</th>
                  <th scope="col" className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-[var(--gijs-donkergroen)] text-right">Met hybride warmtepomp</th>
                  <th scope="col" className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-[var(--accent-700)] text-right">Minder gas per jaar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {GASBESPARING.map(r => (
                  <tr key={r.label}>
                    <th scope="row" className="px-5 py-3 font-bold text-[var(--gijs-donkergroen)] whitespace-nowrap">{r.label}</th>
                    <td className="px-5 py-3 text-zinc-700 whitespace-nowrap text-right">{m3(r.nu)}</td>
                    <td className="px-5 py-3 text-zinc-700 whitespace-nowrap text-right">{m3(r.hybride)}</td>
                    <td className="px-5 py-3 font-bold text-[var(--accent-700)] bg-[var(--accent-050)] whitespace-nowrap text-right">{m3(r.minder)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={BRON + " mt-3 mb-8 lg:mb-10"}>
            Gerekend met het gemiddelde gasverbruik per woningtype en de vuistregel van Gijs: ongeveer{" "}
            {Math.round(WARMTEPOMP_GASBESPARING.hybride * 100)}% minder gas met een hybride warmtepomp. Je stroomverbruik gaat
            daarbij met ongeveer {WARMTEPOMP_STROOM_ERBIJ.hybride.toLocaleString("nl-NL")} kWh per jaar omhoog. Je eigen
            verbruik kan afwijken; zie dit als richting, niet als belofte.
          </p>

          {/* Compacte CTA-balk zonder portret: Naud staat al uitgebreid bij "Waarom Gijs". */}
          <div className="flex flex-col gap-5 rounded-[var(--radius-lg)] bg-white p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h3 className={KAARTKOP}>Weten wat een warmtepomp in jouw woning kan besparen?</h3>
              <p className={KAARTTEKST}>
                Tijdens een energiescan bekijken we je woning, verwarming en energieverbruik. Je hoort eerlijk wat mogelijk
                is en welke stap het meeste oplevert.
              </p>
            </div>
            <WhatsAppTrackedButton plaats="maatregelpagina_besparing" href={ENERGIESCAN_HREF} size="md" iconRight="arrow-right" className="self-start md:self-center shrink-0">Vraag een energiescan aan</WhatsAppTrackedButton>
          </div>
        </div>
      </section>

      {/* Welke past: hybride of volledig elektrisch, net als HR++ of triple glas op de
          isolatieglaspagina. Waar Gijs op let, staat in een uitklapper. */}
      <section id="welke-past" className={SECTIE}>
        <Kop eyebrow="Hybride of volledig elektrisch" titel="Welke warmtepomp past bij jouw huis?"
          lead="Er zijn twee soorten. De meeste bestaande woningen beginnen met een hybride warmtepomp." />

        <div className={GRIJS_BLOK}>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {[
              { icon: "git-branch", titel: "Hybride warmtepomp", punten: HYBRIDE },
              { icon: "zap", titel: "Volledig elektrische warmtepomp", punten: VOLLEDIG },
            ].map(soort => (
              <li key={soort.titel} className={WIT_BLOK + " flex flex-col gap-4"}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]">
                  <Icon name={soort.icon} size="md" />
                </span>
                <h3 className={H3_GROOT}>{soort.titel}</h3>
                <ul className="flex flex-col gap-2.5">
                  {soort.punten.map(punt => (
                    <li key={punt} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--text-muted)]">
                      <Icon name="check" size="sm" className="mt-1 shrink-0 text-[var(--accent-600)]" />
                      <span>{punt}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className={TEKST + " mt-6 max-w-3xl"}>
            Welke van de twee bij jouw huis past, hoef je niet zelf uit te zoeken. Dat bekijkt Gijs samen met je tijdens
            de energiescan.
          </p>

          <details className="group mt-8">
            <summary className={UITKLAP}>
              <span className="group-open:hidden">Is mijn huis geschikt voor een warmtepomp? Bekijk waar Gijs op let</span>
              <span className="hidden group-open:inline">Verberg waar Gijs op let</span>
              <Icon name="chevron-down" size="sm" className="transition-transform group-open:rotate-180" />
            </summary>
            {/* Eén opsomming, geen kaarten: titel vet, toelichting eronder, dunne scheidingslijnen. */}
            <ul className="mt-6 max-w-3xl divide-y divide-[var(--border-default)] border-y border-[var(--border-default)]">
              {CRITERIA.map(c => (
                <li key={c.titel} className="py-4">
                  <p className="text-[16px] font-semibold leading-snug text-[var(--gijs-donkergroen)]">{c.titel}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]">{c.tekst}</p>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      {/* Voorbeelden van warmtepompen: informatief, geen webshop. Geen prijzen of voorraad; per model
          alleen één of twee controleerbare brochurekenmerken.
          Elke knop gaat naar /contact met het model als parameter; het formulier vult dan het bericht in. */}
      <section id="voorbeelden" className={SECTIE}>
        <Kop eyebrow="Voorbeelden" titel="Voorbeelden van warmtepompen"
          lead="We werken met verschillende merken, typen en modellen. Hieronder zie je een aantal warmtepompen die we regelmatig plaatsen. Welke uitvoering bij jouw woning past, bespreken we graag met je." />
        <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {WARMTEPOMP_VOORBEELDEN.map(v => (
            <li key={v.slug} className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white">
              {/* Zelfde kader, achtergrond en marge voor alle vier: de productfoto's zijn vrijstaand. */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--grey-050)]">
                {v.foto ? (
                  <Image src={v.foto.src} alt={v.foto.alt} fill sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-6" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-10">
                    <Image src={v.logo.src} alt={`Logo van ${v.merk}`} width={v.logo.breedte} height={v.logo.hoogte} sizes="200px" className="h-auto w-[55%] max-w-[180px]" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className={KAARTKOP}>
                  <span className="block text-[13px] font-semibold tracking-normal text-[var(--accent-700)]">{v.merk}</span>{" "}
                  {v.model}
                </h3>
                <span className="self-start rounded-full bg-[var(--surface-tint)] px-2.5 py-1 text-[12px] font-semibold text-[var(--accent-700)]">{v.label}</span>
                <p className={KAARTTEKST}>{v.tekst}</p>
                {v.kenmerken.length > 0 && (
                  <ul className="divide-y divide-[var(--border-default)] border-y border-[var(--border-default)] text-[14px] leading-snug text-zinc-700">
                    {v.kenmerken.map(k => <li key={k} className="py-2">{k}</li>)}
                  </ul>
                )}
                <Link href={contactLinkVoorModel(v.slug)} className="mt-auto inline-flex items-start gap-1 pt-1 text-[15px] font-semibold text-[var(--accent-700)] no-underline hover:text-[var(--gijs-donkergroen)]">
                  <span>Vraag advies over deze warmtepomp<span className="sr-only">: {v.merk} {v.model}</span></span>
                  <Icon name="arrow-right" size="sm" className="mt-1 shrink-0" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <p className={BRON + " mt-4"}>Dit zijn voorbeelden. Gijs kijkt samen met je welk merk, type en vermogen bij jouw woning passen.</p>
      </section>

      {/* Plaatsen: drie korte kaarten en de video, net als op de isolatieglaspagina. */}
      <section id="plaatsen" className={SECTIE}>
        <Kop eyebrow="Warmtepomp laten plaatsen" titel="Een warmtepomp laten plaatsen: hoe werkt dat?" />

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
          <p className={LEAD}>Bij de installatie van je warmtepomp werken we volgens een vaste aanpak. Zo weet je precies wat je kunt verwachten.</p>
        </div>
        <WarmtepompInstallatieAnimatie />
      </section>

      <section id="subsidie" className={SECTIE}>
        <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-9 sm:px-10 lg:px-12 lg:py-11">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 text-zinc-600">
              <p className={EYEBROW}>Subsidie</p>
              <h2 className={H2}>Subsidie bij een warmtepomp</h2>
              <p>
                Voor een warmtepomp kun je ISDE-subsidie aanvragen. Hoeveel je krijgt, hangt af van het type warmtepomp,
                en de voorwaarden kunnen wijzigen. Tijdens de energiescan bespreken we wat er op dat moment voor jouw
                woning geldt. Gijs kan je daarna helpen met de subsidieaanvraag.
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
              <SubsidiecheckStart idPrefix="sc-warmtepomp" />
            </div>
          </div>
        </div>
      </section>

      <section id="veelgestelde-vragen" className={SECTIE}>
        <h2 className={H2 + " mb-8 max-w-3xl"}>Veelgestelde vragen over warmtepompen</h2>
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
            Benieuwd of een warmtepomp bij jouw woning past? Vraag een gratis energiescan aan, of ontdek eerst zelf in de
            woningscan welke maatregelen bij jouw huis passen.
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
