import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import { KETELS } from "@/lib/content/ketel-producten";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { MeasureHero } from "@/components/measures/MeasureHero";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { TechnicalDetails, TechnicalDetailRow } from "@/components/measures/TechnicalDetails";
import { FeatureList } from "@/components/measures/FeatureList";
import { UitvoeringStappen, type UitvoeringStap } from "@/components/measures/UitvoeringStappen";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Ketelpagina. Bronnen:
// - Algemene uitleg en de rol bij een hybride warmtepomp of vloerverwarming: de
//   bestaande Gijs-tekst (lib/content/measure-details.ts, measure-pages.ts,
//   vloerverwarming-data.ts).
// - Producten: alleen de twee aangeleverde Warmteservice-pagina's, zie
//   lib/content/ketel-producten.ts.
// - Hero-foto en uitvoeringsstappen: aangeleverd (public/images/maatregelen/ketel).
//   Let op: de afbeelding van stap 4 (ketel-stap-4.svg) heeft nog een
//   ingebakken titel "Buitenunit plaatsen" die overgenomen lijkt uit de
//   warmtepomp-template — de bijschrifttekst zelf ("De nieuwe cv-ketel wordt
//   geplaatst") klopt wel. Kan alleen gefixt worden door het bronbestand zelf
//   opnieuw aan te leveren, niet door code.
// Bewust weggelaten (geen bron): voorwaarden, subsidie, voordelen buiten de
// productomschrijving, en wanneer Gijs welke ketel inzet.
export function KetelPage({ item }: { item: MeasurePageItem }) {
  const title = "Ketel";
  const startScanHref = "/woning?maatregel=" + item.id;

  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "past-het", label: "Past het bij mij?" },
    { id: "producten", label: "Ketels van Gijs" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  const UITVOERING_STAPPEN: UitvoeringStap[] = [
    { bestand: "maatregelen/ketel/proces/ketel-stap-1.svg", label: "Aankomst" },
    { bestand: "maatregelen/ketel/proces/ketel-stap-2.svg", label: "Uitleg" },
    { bestand: "maatregelen/ketel/proces/ketel-stap-3.svg", label: "Voorbereiding" },
    { bestand: "maatregelen/ketel/proces/ketel-stap-4.svg", label: "Nieuwe ketel plaatsen" },
    { bestand: "maatregelen/ketel/proces/ketel-stap-5.svg", label: "Controle" },
    { bestand: "maatregelen/ketel/proces/ketel-stap-6.svg", label: "Opleveren" },
  ];

  const faqItems: FAQItem[] = [
    { question: "Welke ketels gebruikt Gijs?", answer: "Gijs werkt met twee hr-combiketels. Welke uitvoering bij jouw woning past, bespreekt Gijs met je tijdens de energiescan." },
    { question: "Moet mijn cv-ketel weg als ik een warmtepomp neem?", answer: "Bij een hybride oplossing werkt de warmtepomp samen met een cv-ketel. Bij volledig elektrisch verwarmen wordt ook warm water zonder cv-ketel bekeken. Wat past, hangt af van je woning en installatie." },
    { question: "Kan mijn bestaande ketel blijven?", answer: "Dat wordt per situatie bekeken. Bij een hybride warmtepomp kijkt Gijs of de bestaande ketel kan blijven of vervanging nodig is." },
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
        label="Installaties"
        title="Ketel"
        subtitle="Zorgt voor warmte in je huis"
        intro="Een cv-ketel verwarmt je woning en levert warm water. Gijs werkt met hr-combiketels."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Vraag een gratis energiescan aan", href: "/contact#energiescan" }}
        image="/images/maatregelen/ketel/ketel-hero.png"
        imageAlt="Een Gijs-installateur sluit een nieuwe cv-ketel aan"
      />

      <div>
        <MeasureSectionNav sections={sections} />

        <section id="wat-is-het" className="scroll-mt-40 mt-4 mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is een ketel?</h2>
            <p className="text-lg font-medium text-[var(--gijs-donkergroen)] leading-relaxed">
              Een ketel zorgt voor warmte in je huis.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Een cv-ketel verwarmt je woning en levert warm water. In veel woningen is de ketel het enige onderdeel
              van het verwarmingssysteem; in andere situaties werkt de ketel samen met een andere warmtebron, zoals
              een hybride warmtepomp.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Of je bestaande ketel kan blijven of vervanging nodig is, hangt af van je woning en je huidige
              verwarming. Daar hoef je zelf niet technisch uit te komen: tijdens een energiescan aan huis bekijkt een
              expert van Gijs de bestaande verwarmingssituatie en bespreekt welke oplossing past.
            </p>
          </div>
        </section>

        <section id="past-het" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Past dit bij mijn woning?</h2>
          <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
            Overweeg je een hybride warmtepomp of een nieuwe vloerverwarming? Dan bekijkt Gijs ook wat dit voor je
            bestaande cv-ketel betekent.
          </p>
          <FeatureList
            columns={2}
            items={[
              {
                icon: "thermometer",
                title: "Bij een hybride warmtepomp",
                text: "Een hybride warmtepomp werkt samen met een cv-ketel. Gijs bekijkt of de bestaande ketel kan blijven of vervanging nodig is.",
                href: "/maatregelen/warmtepomp",
                linkLabel: "Meer over de hybride warmtepomp",
              },
              {
                icon: "layout-grid",
                title: "Bij vloerverwarming",
                text: "Voor een woning met een cv-ketel gebruikt Gijs een verdeler die is afgestemd op die warmtebron.",
                href: "/maatregelen/vloerverwarming",
                linkLabel: "Meer over vloerverwarming",
              },
            ]}
          />
        </section>

        <section id="producten" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Welke ketels gebruikt Gijs?</h2>
          <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
            Gijs werkt met twee hr-combiketels. Geen van beide wordt hier als beste keuze aangewezen:
            welke uitvoering past, bekijkt Gijs samen met jou.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 md:items-start gap-6 mb-8">
            {KETELS.map(ketel => (
              <Card key={ketel.naam} className="flex flex-col gap-4 !p-7">
                <div className="relative aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)]">
                  <Image src={ketel.image} alt={ketel.imageAlt} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-contain p-4" />
                </div>
                <div>
                  <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">{ketel.merk}</p>
                  <h3 className="font-bold text-xl text-[var(--gijs-donkergroen)]">{ketel.naam}</h3>
                  <p className="text-sm text-zinc-600 mt-1">{ketel.type} · {ketel.warmwater}</p>
                </div>
                {ketel.kenmerken.length > 0 && (
                  <ul className="flex flex-col gap-2 border-t border-[var(--border-default)] pt-4">
                    {ketel.kenmerken.map(k => (
                      <li key={k} className="flex items-start gap-2 text-sm text-zinc-700">
                        <Icon name="check" size="sm" className="mt-0.5 text-[var(--accent-700)] shrink-0" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>
          <TechnicalDetails id="technische-gegevens">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {KETELS.map(ketel => (
                <div key={ketel.naam}>
                  <h4 className="font-bold text-[var(--gijs-donkergroen)] mb-3">{ketel.naam}</h4>
                  <ul className="flex flex-col gap-2">
                    {ketel.technisch.map(rij => <TechnicalDetailRow key={rij.label} label={rij.label} value={rij.waarde} />)}
                  </ul>
                </div>
              ))}
            </div>
          </TechnicalDetails>
        </section>

        <section id="hoe-werkt-het" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Hoe verloopt de uitvoering?</h2>
          <p className="text-lg text-zinc-600 mb-10 max-w-2xl">Gijs vervangt de ketel volgens een vaste aanpak.</p>
          <UitvoeringStappen stappen={UITVOERING_STAPPEN} />
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
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Wat betekent dit voor jouw woning?</h2>
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
