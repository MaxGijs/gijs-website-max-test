import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import {
  VERDELER_CVKETEL,
  VERDELER_WARMTEPOMP,
  VERDELER_LTV_NOOT,
  VERDELER_INTRO,
  OPSTART_TABEL,
  OPSTART_NOOT,
  RESTVOCHT_TABEL,
  AFWERKING_TIMING,
  ECOFLOOR_KENMERKEN,
  ECOFLOOR_TECHNISCH,
  ECOFLOOR_NIET_DOEN,
  SYSTEEMOPBOUW,
  UITVOERING_STAPPEN,
  AANDACHTSPUNTEN_VOOR,
  AANDACHTSPUNTEN_NA,
  VOORDELEN,
} from "@/lib/content/vloerverwarming-data";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { MeasureHero } from "@/components/measures/MeasureHero";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { UitvoeringStappen } from "@/components/measures/UitvoeringStappen";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { TechnicalDetails } from "@/components/measures/TechnicalDetails";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Vloerverwarmingpagina, volledig herbouwd op basis van 9 brongegevens
// aangeleverd via "Archief.zip" (public/productbladen/vloerverwarming-src),
// plus de reeds bestaande, gevalideerde Gijs-tekst uit measure-details.ts.
// Zie lib/content/vloerverwarming-data.ts voor de volledige, per-claim
// brontoelichting en het eindverslag voor de samenvatting.
//
// Deze pagina volgt een eigen 13-secties-opzet (i.p.v. het sjabloon van de
// isolatiepagina's), omdat vloerverwarming een installatie is met een eigen
// opbouw-, droog- en verdelerlogica die niet in dat sjabloon past:
// Hero, Wat is het, Vloeropbouw, Past het bij mij, Voordelen, eco2floor,
// Verdeler/warmtebron, Uitvoering, Drogen en opstarten, Vloerafwerking,
// Voorbereiding en aandachtspunten, FAQ, CTA.
//
// VEREENVOUDIGING VOOR LEKEN (contentaudit, geen redesign): de
// "Systeemopbouw"-heading is hernoemd naar de klantvraag "Hoe wordt de
// vloer opgebouwd?". De eco2floor-intro noemde eerder "zelfnivellerende,
// verpompbare gietdekvloer" en "GGBS" zonder uitleg — herschreven naar
// gewone taal; de materiaalnaam (GGBS) staat nu alleen nog in het
// technische blok. De verdeler-sectie opende voorheen direct met de
// productkaarten; er is nu eerst een plain-taal alinea ("Wat doet de
// verdeler?") vóór de kaarten. De kenmerken van beide verdelers waren
// behoorlijk technisch (debietregeling, "100% hydraulisch neutraal",
// pompmodel/-standen) — deze zijn verplaatst naar het bestaande
// "Bekijk technische gegevens"-blok (nu via het gedeelde
// TechnicalDetails-component, zie components/measures/
// TechnicalDetails.tsx) en vervangen door 2-3 kernpunten in gewone taal
// per verdeler. Zie lib/content/vloerverwarming-data.ts voor de exacte
// woordkeuzes en welke gegevens zijn verplaatst.
//
// HERO-VERVANGING: de hero-foto is vervangen door een nieuwe, echte
// Gijs-installatiefoto ("vloerverwarming_hero.png" uit een aangeleverde
// Archief.zip) — een Gijs-installateur die de dekvloer over de
// vloerverwarmingsleidingen giet. Bijgesneden van 1672×941 naar
// 1344×941 (de vaste 10:7-heroverhouding die alle maatregelpagina's
// gebruiken), gecentreerd zodat zowel de installateur als beide
// slangbogen in beeld blijven. Vervangt de vorige hero-foto (zelf al
// een uit een eerdere bron geëxtraheerde eco2floor-foto) onder dezelfde
// bestandsnaam (vloerverwarming-hero.png).
export function VloerverwarmingPage({ item }: { item: MeasurePageItem }) {
  const title = "Vloerverwarming";
  const startScanHref = "/woning?maatregel=" + item.id;

  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "systeemopbouw", label: "Vloeropbouw" },
    { id: "past-het", label: "Past het bij mij?" },
    { id: "voordelen", label: "De voordelen" },
    { id: "uitvoering", label: "Uitvoering" },
    { id: "eco2floor", label: "eco2floor" },
    { id: "verdeler", label: "Verdeler & warmtebron" },
    { id: "drogen-en-opstarten", label: "Drogen en opstarten" },
    { id: "vloerafwerking", label: "Vloerafwerking" },
    { id: "voorbereiding", label: "Aandachtspunten" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  const faqItems: FAQItem[] = [
    { question: "Hoe lang duurt het voordat ik vloerbedekking mag leggen?", answer: "Dat hangt af van de gekozen afwerking. Een tegelvloer kan na ongeveer 1 week, overige afwerkingen zoals tapijt of parket na ongeveer 2 weken, mits het restvochtgehalte op orde is. Dit wordt vastgesteld met een CM-meting, niet met een elektronische (indicatieve) meting." },
    { question: "Moet ik een speciale verdeler hebben voor mijn warmtepomp?", answer: "Ja. Een verdeler voor een cv-ketel (hoge temperatuur) is niet hetzelfde als een verdeler voor een warmtepomp (lage temperatuur verwarming en/of hoge temperatuur koeling). Gijs kiest de juiste verdeler bij je warmtebron." },
    { question: "Kan vloerverwarming ook koelen?", answer: "Bij een warmtepomp met een geschikte verdeler (zoals de RIHO VK-verdeler) kan de vloer ook passief koelen. Bij een verdeler voor een cv-ketel is dat niet het geval." },
    { question: "Is het opstartprotocol verplicht?", answer: "Het wordt aanbevolen om het opstartprotocol minimaal één keer volledig te doorlopen vóór de vloer verder wordt afgewerkt. Dit verkort de droogtijd en helpt spanningen in de vloer te verminderen, die anders tot scheurvorming zouden kunnen leiden." },
    { question: "Wat is een verdeler?", answer: "De verdeler zorgt dat elke kamer via de leidingen genoeg warm water krijgt, zodat de vloer overal gelijkmatig warm wordt." },
    { question: "Wat betekent laag temperatuur verwarming?", answer: "Dit is verwarming die werkt met een lagere watertemperatuur dan een traditionele cv-ketel, zoals bij een warmtepomp. Vloerverwarming is hier goed geschikt voor." },
    { question: item.question, answer: item.answer },
  ];

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
        title="Vloerverwarming voor jouw woning"
        subtitle="Comfortabele warmte vanuit de vloer, zonder radiatoren"
        intro="Vloerverwarming verdeelt warmte vanuit je vloer, via leidingen die zijn ingefreesd in een geschikte bestaande vloer of ingebouwd in een nieuwe vloeropbouw. Voor de dekvloer boven de leidingen werkt Gijs onder meer met eco2floor, een gietdekvloer die snel droogt en goed geschikt is voor vloerverwarming."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Plan een gratis energiescan", href: "/contact#energiescan" }}
        image="/productbladen/vloerverwarming-hero.png"
        imageAlt="Een Gijs-installateur giet de dekvloer over de vloerverwarmingsleidingen"
      />

      <div>
        <MeasureSectionNav sections={sections} />

        <section id="wat-is-het" className="scroll-mt-40 mt-4 mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is vloerverwarming?</h2>
            <p className="text-lg font-medium text-[var(--gijs-donkergroen)] leading-relaxed">
              Vloerverwarming verwarmt je huis vanaf de vloer.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Bij vloerverwarming stroomt warm water door leidingen in de vloer. De vloer geeft die warmte
              gelijkmatig af aan de ruimte, in plaats van via radiatoren. Het werkt met een cv-ketel of een
              warmtepomp.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              De bestaande vloer en je verbouwplannen bepalen welke uitvoering mogelijk is. Daar hoef je zelf niet
              technisch uit te komen: tijdens een energiescan aan huis bekijkt een expert van Gijs de vloeropbouw en
              je bestaande warmtebron, en bespreekt welke oplossing past.
            </p>
          </div>
        </section>

        <section id="systeemopbouw" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">Hoe wordt de vloer opgebouwd?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col gap-3 !p-7">
              <span className="w-14 h-14 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                <Icon name="layout-grid" size="lg" />
              </span>
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">In een bestaande vloer</h3>
              <p className="text-base text-zinc-600 leading-relaxed">{SYSTEEMOPBOUW.bestaandeVloer}</p>
            </Card>
            <Card className="flex flex-col gap-3 !p-7">
              <span className="w-14 h-14 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                <Icon name="square" size="lg" />
              </span>
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">In een nieuwe vloeropbouw</h3>
              <p className="text-base text-zinc-600 leading-relaxed">{SYSTEEMOPBOUW.nieuweOpbouw}</p>
            </Card>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl mt-6">{SYSTEEMOPBOUW.isolatiebeton}</p>
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
                <span>De bestaande vloerconstructie en opbouw</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Of infrezen mogelijk is, of een nieuwe opbouw nodig is</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>De aansluiting op je cv-ketel of warmtepomp</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>De gewenste vloerafwerking</span>
              </li>
            </ul>
            <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
          </Card>
        </section>

        <section id="voordelen" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">De voordelen</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">Voordelen van de eco2floor-dekvloer die Gijs bij vloerverwarming toepast:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VOORDELEN.map(voordeel => (
              <Card key={voordeel} className="flex flex-col gap-4 !p-7">
                <span className="w-14 h-14 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                  <Icon name="zap" size="lg" />
                </span>
                <p className="font-bold text-[var(--gijs-donkergroen)] leading-snug">{voordeel}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="uitvoering" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Hoe verloopt de uitvoering?</h2>
          <p className="text-lg text-zinc-600 mb-10 max-w-2xl">Gijs plaatst de vloerverwarming en de eco2floor-dekvloer volgens een vaste aanpak.</p>
          <UitvoeringStappen stappen={UITVOERING_STAPPEN} />
        </section>

        <section id="eco2floor" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">eco2floor: de dekvloer boven de leidingen</h2>
          <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
            eco2floor is een vloeibare dekvloer die om de vloerverwarmingsleidingen heen wordt gegoten. Deze vloer
            geeft de warmte van de vloerverwarming goed door aan de kamer, en is daarom een goede combinatie met
            vloerverwarming.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {ECOFLOOR_KENMERKEN.map(k => (
              <div key={k} className="flex items-start gap-2 text-base text-zinc-700">
                <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                <span>{k}</span>
              </div>
            ))}
          </div>
          <Card variant="tint" className="!p-7 mb-8">
            <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-3">Niet doen met eco2floor</h3>
            <ul className="flex flex-col gap-2.5">
              {ECOFLOOR_NIET_DOEN.map(v => (
                <li key={v} className="flex items-start gap-2 text-base text-zinc-700">
                  <Icon name="x" size="sm" className="mt-1 text-[var(--accent-700)] shrink-0" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </Card>

          <TechnicalDetails id="eco2floor-technisch">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {ECOFLOOR_TECHNISCH.map(rij => (
                <li key={rij.label} className="flex items-start justify-between gap-3 border-b border-[var(--border-default)] pb-2">
                  <span className="text-zinc-500 text-sm">{rij.label}</span>
                  <span className="font-semibold text-zinc-800 text-sm text-right">{rij.waarde}</span>
                </li>
              ))}
            </ul>
          </TechnicalDetails>
        </section>

        <section id="verdeler" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Wat doet de verdeler?</h2>
          <p className="text-lg text-zinc-600 mb-8 max-w-2xl">{VERDELER_INTRO}</p>

          <h3 className="font-bold text-xl text-[var(--gijs-donkergroen)] mb-4">Welke verdeler wordt gebruikt?</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {[VERDELER_CVKETEL, VERDELER_WARMTEPOMP].map(verdeler => (
              <Card key={verdeler.naam} className="flex flex-col gap-5 !p-6">
                <div className="rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)] aspect-[4/3] flex items-center justify-center">
                  <Image src={verdeler.image} alt={verdeler.imageAlt} width={600} height={450} className="max-w-[80%] max-h-[80%] object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">{verdeler.naam}</h3>
                  <p className="text-sm text-zinc-600 mt-1">{verdeler.toepassing}</p>
                </div>
                <ul className="flex flex-col gap-2.5 text-sm border-t border-[var(--border-default)] pt-4">
                  {verdeler.kenmerken.map(k => (
                    <li key={k} className="flex items-start gap-2 text-zinc-700">
                      <Icon name="check" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <div className="flex flex-col gap-3">
          <TechnicalDetails id="drie-temperaturen" title={"Drie verschillende “temperaturen”"}>
            <p className="text-sm text-zinc-600 mb-4">Bij vloerverwarming kom je een paar keer het woord &ldquo;temperatuur&rdquo; tegen. Dat zijn drie verschillende dingen:</p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-base text-zinc-700">
                <Icon name="thermometer" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                <span><strong className="text-[var(--gijs-donkergroen)]">Kamerthermostaat:</strong> de temperatuur die jij in de kamer wilt voelen. Dit stel je zelf in.</span>
              </li>
              <li className="flex items-start gap-3 text-base text-zinc-700">
                <Icon name="thermometer" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                <span><strong className="text-[var(--gijs-donkergroen)]">Instelling op de verdeler:</strong> bij een verdeler voor een cv-ketel is de temperatuur van het water dat naar de vloerverwarming gaat instelbaar tussen 20-50°C. De installateur zet deze bij oplevering goed.</span>
              </li>
              <li className="flex items-start gap-3 text-base text-zinc-700">
                <Icon name="thermometer" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                <span><strong className="text-[var(--gijs-donkergroen)]">Opstartprotocol-watertemperatuur:</strong> een tijdelijke, stapsgewijze temperatuurcurve die alleen wordt gebruikt vlak na het storten van een nieuwe eco2floor-vloer, om deze goed te laten drogen. Geen permanente instelling, zie hieronder.</span>
              </li>
            </ul>
          </TechnicalDetails>

          <TechnicalDetails id="verdeler-technisch">
            <div className="flex flex-col gap-8">
              <p className="text-sm text-zinc-600">{VERDELER_LTV_NOOT}</p>
              {[VERDELER_CVKETEL, VERDELER_WARMTEPOMP].map(verdeler => (
                <div key={verdeler.naam}>
                  <h4 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-3">{verdeler.naam}</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {verdeler.technisch.map(rij => (
                      <li key={rij.label} className="flex items-start justify-between gap-3 border-b border-[var(--border-default)] pb-2">
                        <span className="text-zinc-500 text-sm">{rij.label}</span>
                        <span className="font-semibold text-zinc-800 text-sm text-right">{rij.waarde}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TechnicalDetails>
          </div>
        </section>

        <section id="drogen-en-opstarten" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Drogen en opstarten</h2>
          <p className="text-lg text-zinc-600 mb-6 max-w-2xl">
            Na het storten van de eco2floor-vloer moet het restvocht eruit voordat je een vloerbedekking mag
            aanbrengen. Met vloerverwarming kan dat sneller, mits je de vloer volgens een vast opstartprotocol
            opwarmt en weer afkoelt. Alle temperaturen hieronder zijn <strong>watertemperaturen</strong>, niet de
            instelling van je kamerthermostaat.
          </p>
          <div className="mb-8">
          <TechnicalDetails id="opstartschema" title="Bekijk het opstartschema">
          <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)] mb-3 bg-white">
            <table className="w-full text-left border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Dag na het storten</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Watertemperatuur vloerverwarming</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Dagen aanhouden</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {OPSTART_TABEL.map(rij => (
                  <tr key={rij.dag}>
                    <td className="px-6 py-3 text-zinc-700 whitespace-nowrap">{rij.dag}</td>
                    <td className="px-6 py-3 text-zinc-700 whitespace-nowrap">{rij.temperatuur}</td>
                    <td className="px-6 py-3 text-zinc-700 whitespace-nowrap">{rij.dagenAanhouden}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl">{OPSTART_NOOT}</p>
          </TechnicalDetails>
          </div>
          <Card variant="tint" className="!p-7">
            <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-2">Waarom is dit protocol belangrijk?</h3>
            <p className="text-base text-zinc-700 leading-relaxed">
              Een opwarmende vloer zet uit, een afkoelende vloer krimpt weer. Door dit stapsgewijs en gelijkmatig
              te doen, verklein je de kans op schade aan de vloer en de latere afwerking, en verminder je
              spanningen in de vloer die anders tot scheurvorming zouden kunnen leiden. Het opwarmen verkort
              bovendien de droogtijd. Of het restvochtgehalte laag genoeg is, wordt vastgesteld met een
              CM-meting, de enige betrouwbare methode. Elektronische metingen zijn slechts indicatief.
            </p>
          </Card>
        </section>

        <section id="vloerafwerking" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Vloerafwerking</h2>
          <p className="text-lg text-zinc-600 mb-6 max-w-2xl">
            Een tegelvloer kan na ongeveer {AFWERKING_TIMING.tegel}, overige afwerkingen zoals tapijt of parket na
            ongeveer {AFWERKING_TIMING.overig} worden aangebracht. Onder normale omstandigheden bedraagt het
            restvochtpercentage na 14 dagen circa {AFWERKING_TIMING.vochtNa14Dagen}. Het toelaatbare percentage
            hangt af van de gekozen afwerking:
          </p>
          <TechnicalDetails id="restvochtwaarden" title="Bekijk de restvochtwaarden per vloerbedekking">
          <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)] mb-6 bg-white">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Type vloerbedekking</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Toelichting</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Vereiste waarde</th>
                  <th scope="col" className="px-6 py-4 text-sm font-bold text-[var(--gijs-donkergroen)]">Technisch mogelijk bij eco2floor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {RESTVOCHT_TABEL.map(rij => (
                  <tr key={rij.type}>
                    <td className="px-6 py-4 text-zinc-700 whitespace-nowrap">{rij.type}</td>
                    <td className="px-6 py-4 text-zinc-600">{rij.toelichting}</td>
                    <td className="px-6 py-4 text-zinc-600 whitespace-nowrap">{rij.vereist}</td>
                    <td className="px-6 py-4 text-zinc-600 whitespace-nowrap">{rij.technischMogelijk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl">
            Deze percentages zijn een grove indicatie; de leverancier van de gekozen lijm of afwerking schrijft het
            exacte toelaatbare restvochtpercentage voor. Gijs geeft hierover graag een passend advies. Levering en
            plaatsing van de uiteindelijke afwerkvloer worden apart afgesproken.
          </p>
          </TechnicalDetails>
        </section>

        <section id="voorbereiding" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Voorbereiding en aandachtspunten</h2>
          <p className="text-lg text-zinc-600 mb-6 max-w-2xl">Een paar praktische punten om rekening mee te houden.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="!p-8">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Vóór en tijdens de uitvoering</h3>
              <ul className="flex flex-col gap-4">
                {AANDACHTSPUNTEN_VOOR.map(v => (
                  <li key={v} className="flex items-start gap-3 text-base text-zinc-700">
                    <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="!p-8">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Na de uitvoering</h3>
              <ul className="flex flex-col gap-4">
                {AANDACHTSPUNTEN_NA.map(v => (
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
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Past vloerverwarming bij jouw woning?</h2>
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
