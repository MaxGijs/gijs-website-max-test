import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { SIGENSTOR } from "@/lib/content/thuisbatterij-producten";
import { CONTACT } from "@/lib/content/contact";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { MeasureHero } from "@/components/measures/MeasureHero";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { UitvoeringStappen, type UitvoeringStap } from "@/components/measures/UitvoeringStappen";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { TechnicalDetails, TechnicalDetailRow } from "@/components/measures/TechnicalDetails";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Thuisbatterijpagina, gebouwd in dezelfde stijl als de andere
// maatregelpagina's (MeasureHero/MeasureSectionNav/Card/Button/Icon/
// UitvoeringStappen/FAQAccordion).
//
// BRONNEN (zie het eindverslag voor de volledige, per-claim bronverwijzing):
// - "alle_brochures_in_1.pdf" (pagina 2-3 van 49): het 6-stappen
//   installatieproces ("Thuisbatterij plaatsen in één dag") en "Voordat
//   we een thuisbatterij komen plaatsen" (voorwaarden). Deze pagina's
//   zijn generiek Gijs-eigen en gebruikt voor UITVOERING_STAPPEN en
//   VOORWAARDEN.
// - "Sigenergy Infoblad.pdf": een generiek, internationaal marketingblad
//   van fabrikant Sigenergy over de SigenStor-thuisbatterij. Gebruikt
//   voor de productkenmerken, werkmodi en veiligheidskenmerken in
//   lib/content/thuisbatterij-producten.ts. De onderdelen-uitleg
//   (EMS/batterijpakket/EV-oplader/batterij-PCS/PV-omvormer) komt
//   letterlijk uit het systeemdiagram op pagina 2 van dit infoblad.
// - "thuisbatterij-uitlegvisual.png": een door Gijs zelf aangeleverde
//   uitlegvisual (dezelfde stijl als "zonnepanelen-uitlegvisual.png" op de
//   zonnepanelenpagina) die de volledige energiecyclus toont: zonnepanelen
//   → regelaar → thuisbatterij → omvormer → meterkast → apparaten in huis.
//   Huidige versie is v1.2 ("batterijcylus v.1.2.png", 8628×3800) — een
//   resolutieverbetering t.o.v. de eerste aanlevering; de nummering (1-6)
//   was in beide versies al correct, geverifieerd via een pixel-crop van
//   het bronbestand.
//
// BELANGRIJKE BEPERKING: het Sigenergy-infoblad bevat geen capaciteit
// (kWh), afmetingen, gewicht, prijs of garantietermijn — dit infoblad is
// duidelijk generieke internationale marketing, geen Gijs-specifiek of
// gedetailleerd technisch productblad zoals bij zonnepanelen/warmtepomp.
// Deze gegevens zijn daarom niet op de pagina gezet. Er is ook geen
// aparte, thuisbatterij-specifieke subsidieregeling aangetroffen in de
// aangeleverde bronnen (in tegenstelling tot bijv. de hybride
// warmtepomp), dus deze pagina heeft bewust geen subsidiesectie. Er is
// verder geen ander warmtepomp-achtig "aanvullende voorwaarden"-document
// specifiek voor thuisbatterijen aangetroffen; de geschiktheidspunten
// hieronder zijn afgeleid van wat wél in de installatievoorwaarden en de
// bestaande, al goedgekeurde measure-pages.ts/measure-details.ts-teksten
// staat (met name de nadrukkelijke restrictie dat niet elke thuisbatterij
// een back-upfunctie ondersteunt).
//
// NIET GEBRUIKT: alle gasbesparings-/CO2-percentages en
// prijs-/kostenclaims staan niet in deze bronnen voor thuisbatterijen, dus
// die kwestie speelt hier niet; wel is er bewust geen kWh-capaciteit of
// ander cijfer verzonnen om de ontbrekende technische specificaties op te
// vullen.
//
// VEREENVOUDIGING VOOR LEKEN (contentaudit, geen redesign): dit was
// volgens de opdracht de belangrijkste pagina om te vereenvoudigen. De
// intro bij "Wat is een thuisbatterij?" noemt nu expliciet dat het
// systeem automatisch regelt wanneer stroom wordt opgeslagen of gebruikt
// (bron: Sigenergy Infoblad, "Sigen AI-modus" — "past het gebruik
// automatisch aan op basis van energieverbruikspatronen"). De 5
// systeemonderdelen (EMS/Batterijpakket/EV-oplader/Batterij-PCS/
// PV-omvormer) hebben nu een gewone-taal-titel als hoofdlabel met de
// technische naam klein eronder, in plaats van andersom — de uitleg zelf
// was al in gewone taal en is ongewijzigd. IP66 (bij de Sigenergy-
// kenmerken) is nu direct in de zin zelf uitgelegd ("bescherming tegen
// stof en water") in plaats van als los jargon-cijfer te blijven staan.
// Een FAQ-item over V2X is toegevoegd (de afkorting stond al tussen
// haakjes bij de kenmerken, nu ook als losse, vindbare uitleg).
//
// HERO-VERVANGING: de hero-foto is vervangen door een nieuwe, echte
// Gijs-installatiefoto ("batterijhero.png" uit een aangeleverde
// Archief.zip) — een Gijs-installateur die een Sigenergy SigenStor
// aansluit. Een eerdere aanlevering (vorige beurt) toonde per ongeluk
// "SINENERGY" i.p.v. "SIGENERGY" op de accu (typisch AI-artefact) en is
// toen bewust niet gebruikt; in deze nieuwe aanlevering is de merknaam
// op beide zichtbare labels gecontroleerd en correct gespeld. Bijgesneden
// van 1672×941 naar 1344×941 (de vaste 10:7-heroverhouding). Vervangt de
// vorige hero-foto onder dezelfde bestandsnaam (thuisbatterij-hero.png).
//
// HERO-BESTANDSNAAM GEWIJZIGD naar thuisbatterij-hero-v2.png (zelfde foto,
// ongewijzigd — geverifieerd via MD5). Reden: de opdrachtgever zag op zijn
// eigen apparaat nog een oudere, allang vervangen foto op deze plek. De
// pagina/server bleken al de juiste foto te serveren (geverifieerd via
// directe fetch + MD5), dus de oorzaak was een hardnekkige browsercache
// op dezelfde bestandsnaam/URL uit een eerdere ronde. Een nieuwe
// bestandsnaam forceert een verse URL en omzeilt dat definitief.
// Migratie naar de gedeelde UitvoeringStappen-component (dezelfde als
// Dakisolatie, Spouwmuurisolatie, Vloerisolatie, Isolatieglas en
// Kozijnen), met de nieuwe procesvisuals uit de "thuisbatterij"-map.
// Labels en volgorde exact zoals aangeleverd.
const UITVOERING_STAPPEN: UitvoeringStap[] = [
  { bestand: "thuisbatterij-stap-1.svg", label: "Aankomst" },
  { bestand: "thuisbatterij-stap-2.svg", label: "Uitleg" },
  { bestand: "thuisbatterij-stap-3.svg", label: "Voorbereiding" },
  { bestand: "thuisbatterij-stap-4.svg", label: "Batterij plaatsen" },
  { bestand: "thuisbatterij-stap-5.svg", label: "Controle" },
  { bestand: "thuisbatterij-stap-6.svg", label: "Oplevering" },
];

// Bron: "alle_brochures_in_1.pdf", pagina 2-3 — "Voordat we een
// thuisbatterij komen plaatsen" (4 punten voor, 4 punten tijdens de
// werkzaamheden).
const VOORWAARDEN_VOOR = [
  "Zorg voor voldoende parkeergelegenheid zo dicht mogelijk bij je woning.",
  "Er wordt een omvormer geplaatst; zorg voor voldoende werkruimte hiervoor.",
  "Het installatieteam moet vaak door het huis naar boven; zorg dat dit overal toegankelijk is.",
  "Zorg dat er een toilet beschikbaar is voor het installatieteam.",
];
const VOORWAARDEN_TIJDENS = [
  "Blijf je thuis werken? Het monteren kan wat lawaai met zich meebrengen.",
  "Er worden gaten geboord door de gevels voor het aanleggen van kabels.",
  "Kabels lopen naar de meterkast, zoveel mogelijk uit het zicht (niet altijd te garanderen).",
  "Het systeem wordt werkend opgeleverd; wees aanwezig voor de app-uitleg.",
];

// Voordelen: bewust voorzichtig geformuleerd (geen kwantificering, geen
// harde back-up-belofte), sourced uit het Sigenergy-infoblad en de
// bestaande, al goedgekeurde measure-details.ts-tekst.
const VOORDELEN = [
  { icon: "sun", title: "Zelf opgewekte stroom bewaren", text: "Bewaar zonnestroom om op een later moment te gebruiken." },
  { icon: "battery-charging", title: "Elektrisch voertuig opladen", text: "Bidirectioneel laden maakt het mogelijk je EV vanuit de batterij op te laden." },
  { icon: "shield-check", title: "Mogelijke back-up bij storing", text: "Afhankelijk van je systeem en aansluiting; niet elke thuisbatterij ondersteunt dit." },
  { icon: "leaf", title: "Kleinere koolstofvoetafdruk", text: "Minder afhankelijk van het elektriciteitsnet op piekmomenten." },
];

// De technische namen staan alleen in "Bekijk technische gegevens"; bovenaan
// de pagina volstaat de lekentitel.
const ONDERDELEN = [
  { icon: "cpu", title: "Slimme aansturing", technisch: "EMS", text: "Regelt wanneer stroom wordt gebruikt of opgeslagen." },
  { icon: "battery-full", title: "Thuisbatterij", technisch: "Batterijpakket", text: "Hier wordt de elektriciteit opgeslagen." },
  { icon: "car", title: "Elektrische auto laden", technisch: "EV-oplader", text: "De installatie kan worden gekoppeld aan het laden van een elektrische auto." },
  { icon: "zap", title: "Stroom omzetten", technisch: "Batterij-PCS", text: "Maakt de opgeslagen stroom bruikbaar voor de woning." },
  { icon: "sun", title: "Zonnestroom bruikbaar maken", technisch: "PV-omvormer", text: "Verbindt de batterij met je zonnepanelen." },
];

export function ThuisbatterijPage({ item }: { item: MeasurePageItem }) {
  const title = "Thuisbatterij";

  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "past-het", label: "Past het bij mij?" },
    { id: "voordelen", label: "De voordelen" },
    { id: "sigenergy", label: "Sigenergy" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "voorwaarden", label: "Voorwaarden" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  const faqItems: FAQItem[] = [
    { question: "Wat is een thuisbatterij?", answer: "Een thuisbatterij slaat elektriciteit op, zodat je deze op een later moment kunt gebruiken. Je energiegebruik en wat je wilt bereiken vormen het vertrekpunt voor het advies." },
    { question: "Welke thuisbatterij gebruikt Gijs?", answer: "Gijs plaatst de SigenStor van Sigenergy, een modulaire en stapelbare thuisbatterij." },
    { question: "Heb ik met een thuisbatterij altijd stroom bij een storing?", answer: item.answer },
    { question: "Kan ik mijn elektrische auto opladen vanuit de thuisbatterij?", answer: "De SigenStor ondersteunt bidirectioneel laden en ontladen, ook wel V2X genoemd, waardoor opladen vanuit de batterij mogelijk is." },
    { question: "Wat betekent V2X?", answer: "V2X staat voor bidirectioneel laden en ontladen: stroom kan niet alleen naar, maar ook vanuit bijvoorbeeld een elektrische auto stromen." },
    { question: "Werkt de thuisbatterij samen met zonnepanelen?", answer: "Ja. De batterij kan je energieverbruik thuis compenseren met zelf opgewekte zonne-energie." },
    { question: "Hoe verloopt de installatie?", answer: "Gijs plaatst de thuisbatterij in één dag: aankomst, uitleg, voorbereiding, de batterij plaatsen en aansluiten, het systeem instellen en controleren, en opleveren." },
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
        label="INSTALLATIES"
        title="Thuisbatterij voor jouw woning"
        subtitle="Sla je energie op voor later gebruik"
        intro="Een thuisbatterij slaat elektriciteit op. Je energiegebruik en wat je wilt bereiken vormen het vertrekpunt voor het advies. Gijs plaatst hiervoor de SigenStor van Sigenergy."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Plan een gratis energiescan", href: "/contact#energiescan" }}
        image="/productbladen/thuisbatterij-hero-v2.png"
        imageAlt="Een Gijs-installateur sluit een Sigenergy SigenStor thuisbatterij aan"
      />

      <div>
        <MeasureSectionNav sections={sections} />

        <section id="wat-is-het" className="scroll-mt-40 mt-4 mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is een thuisbatterij?</h2>
            <p className="text-lg font-medium text-[var(--gijs-donkergroen)] leading-relaxed">
              Zie een thuisbatterij als een voorraadkast voor je eigen stroom.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Een thuisbatterij bewaart elektriciteit, bijvoorbeeld zelf opgewekte zonnestroom die je niet meteen
              gebruikt. Die opgeslagen stroom kun je later alsnog in je woning gebruiken. Het systeem regelt
              automatisch wanneer stroom wordt opgeslagen of gebruikt. Gijs plaatst hiervoor de SigenStor van
              Sigenergy.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Of een thuisbatterij bij je past, hangt af van je energiegebruik en wat je wilt bereiken. Daar hoef je
              zelf niet technisch uit te komen: tijdens een energiescan aan huis bekijkt een expert van Gijs hoe je
              stroom opwekt en gebruikt, en bespreekt welke oplossing past.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-10 mb-10">
            {ONDERDELEN.map(deel => (
              <div key={deel.title} className="flex flex-col gap-3">
                <span className="w-14 h-14 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                  <Icon name={deel.icon} size="lg" />
                </span>
                <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">{deel.title}</h3>
                <p className="text-base text-zinc-600 leading-relaxed">{deel.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] max-w-[1000px] mx-auto">
            {/* v2: in het aangeleverde bestand ontbraken de nummers 1-3 op de
                tekening (legenda had 1-6). Toegevoegd als kopie van de
                bestaande badges uit hetzelfde bestand (groep
                #gijs-badges-1-2-3); de tekening zelf is ongewijzigd. */}
            <Image
              src="/productbladen/thuisbatterij-uitlegvisual-v2.svg"
              alt="Schema van een thuisbatterijsysteem: van (1) de zonnepanelen via (2) de regelaar naar (3) de thuisbatterij, en van daaruit via (4) de omvormer en (5) de meterkast naar (6) de apparaten in huis"
              width={2000}
              height={881}
              quality={100}
              className="w-full h-auto"
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
                <span>Je energiegebruik en wat je wilt bereiken</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Voldoende werkruimte voor de omvormer</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Of een back-upfunctie mogelijk en wenselijk is</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>De locatie en bereikbaarheid van de meterkast</span>
              </li>
            </ul>
            <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
          </Card>
        </section>

        <section id="voordelen" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">De voordelen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VOORDELEN.map(voordeel => (
              <Card key={voordeel.title} className="flex flex-col gap-4 !p-7">
                <span className="w-14 h-14 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                  <Icon name={voordeel.icon} size="lg" />
                </span>
                <h3 className="font-bold text-[var(--gijs-donkergroen)]">{voordeel.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{voordeel.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="sigenergy" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Sigenergy bij Gijs</h2>
          <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
            Gijs plaatst de {SIGENSTOR.naam} van {SIGENSTOR.merk}, een modulaire en stapelbare thuisbatterij.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 items-center mb-8">
            <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)]">
              <Image
                src={SIGENSTOR.image}
                alt={SIGENSTOR.imageAlt}
                width={791}
                height={441}
                quality={100}
                className="w-full h-auto"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--accent-700)]">{SIGENSTOR.merk}</p>
              <h3 className="font-bold text-2xl text-[var(--gijs-donkergroen)]">{SIGENSTOR.naam}</h3>
              <p className="text-zinc-600 mt-1">{SIGENSTOR.ondertitel}</p>
            </div>
          </div>

          <TechnicalDetails id="technische-gegevens">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div>
                <h4 className="font-bold text-[var(--gijs-donkergroen)] mb-3">Kenmerken</h4>
                <ul className="flex flex-col gap-2 text-sm text-zinc-700">
                  {SIGENSTOR.kenmerken.map(k => (
                    <li key={k} className="flex items-start gap-2">
                      <Icon name="check" size="sm" className="mt-0.5 text-[var(--accent-700)] shrink-0" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-zinc-500 mt-4">
                  {SIGENSTOR.levenscyclus}
                  <br />
                  <span className="text-xs">{SIGENSTOR.levenscyclusNoot}</span>
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[var(--gijs-donkergroen)] mb-3">Onderdelen</h4>
                <ul className="flex flex-col gap-2">
                  {ONDERDELEN.map(deel => <TechnicalDetailRow key={deel.technisch} label={deel.title} value={deel.technisch} />)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[var(--gijs-donkergroen)] mb-3">Werkmodi</h4>
                <ul className="flex flex-col gap-3">
                  {SIGENSTOR.werkmodi.map(modus => (
                    <li key={modus.titel}>
                      <p className="font-semibold text-sm text-zinc-800">{modus.titel}</p>
                      <p className="text-sm text-zinc-600">{modus.tekst}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[var(--gijs-donkergroen)] mb-3">Veiligheid</h4>
                <ul className="flex flex-col gap-2 text-sm text-zinc-700">
                  {SIGENSTOR.veiligheid.map(v => (
                    <li key={v} className="flex items-start gap-2">
                      <Icon name="shield-check" size="sm" className="mt-0.5 text-[var(--accent-700)] shrink-0" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TechnicalDetails>
        </section>

        <section id="hoe-werkt-het" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Hoe verloopt de uitvoering?</h2>
          <p className="text-lg text-zinc-600 mb-10 max-w-2xl">Gijs plaatst de thuisbatterij in één dag, volgens een vaste aanpak.</p>
          <UitvoeringStappen stappen={UITVOERING_STAPPEN} />
        </section>

        <section id="voorwaarden" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Voorbereiding en voorwaarden</h2>
          <p className="text-lg text-zinc-600 mb-6 max-w-2xl">
            Voor een goede uitvoering gelden een paar praktische voorwaarden.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="!p-8">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Voor de installatie</h3>
              <ul className="flex flex-col gap-4">
                {VOORWAARDEN_VOOR.map(v => (
                  <li key={v} className="flex items-start gap-3 text-base text-zinc-700">
                    <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="!p-8">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Tijdens de installatie</h3>
              <ul className="flex flex-col gap-4">
                {VOORWAARDEN_TIJDENS.map(v => (
                  <li key={v} className="flex items-start gap-3 text-base text-zinc-700">
                    <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
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
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Past een thuisbatterij bij jouw woning?</h2>
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
