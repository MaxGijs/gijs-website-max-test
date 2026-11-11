import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { H2 } from "./RegioBlokken";
import { RegelingenInGemeente } from "@/components/subsidie/RegelingenInGemeente";
import { SubsidiecheckStart } from "@/components/subsidie/SubsidiecheckStart";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { Card } from "@/components/ds/core/Card";
import { WhatsAppTrackedButton } from "@/components/regio/WhatsAppTrackedButton";

const EYEBROW = "text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]";
const LINK = "underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]";

export const ADVISEUR_FOTO = {
  thom: { src: "/images/over-gijs/thom/thom-portret.png", alt: "Thom, adviseur bij Gijs" },
  naud: { src: "/images/over-gijs/team/naud.jpeg", alt: "Naud, adviseur bij Gijs" },
} as const;

// De groene rand zit in het portret zelf en hoort erbij; niet wegsnijden of overschrijven.
export function AdviseurFoto({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-white shadow-[var(--shadow-1)] ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 128px, 200px" className="object-contain" />
    </div>
  );
}

export function AdviseurBlok({ foto, titel, knopTekst = "Vraag een energiescan aan", plaats = "regio_adviseurblok", children }: {
  foto: { src: string; alt: string };
  titel: string;
  knopTekst?: string;
  /** Herkomstlabel voor het whatsapp_clicked-event; regiopagina's houden de standaardwaarde. */
  plaats?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-6 lg:gap-10 rounded-[var(--radius-lg)] bg-[var(--accent-100)] p-6 sm:p-7 lg:p-10 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)]">
      <AdviseurFoto src={foto.src} alt={foto.alt} className="size-24 sm:size-28 lg:size-36" />
      <div className="flex flex-col gap-3 max-w-2xl">
        <p className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Persoonlijk advies van Gijs</p>
        <h3 className="text-[clamp(1.25rem,1.05rem+0.6vw,1.625rem)] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">{titel}</h3>
        {children}
        <WhatsAppTrackedButton plaats={plaats} href="https://wa.me/31742340777?text=Ik%20wil%20graag%20een%20energiescan%20plannen" size="md" iconRight="arrow-right" className="self-start mt-2">{knopTekst}</WhatsAppTrackedButton>
      </div>
    </div>
  );
}

export function SubsidieSectie({ naamVoorKop, gemeente, officieleSubsidieUrl, className = "scroll-mt-40 mb-6", rustig = false }: {
  naamVoorKop: string;
  gemeente: string;
  officieleSubsidieUrl?: string;
  className?: string;
  /** Eén lichtgroen vlak met de subsidiecheck erin, zonder losse kaart. */
  rustig?: boolean;
}) {
  if (rustig) return (
    <section id="subsidies" className={className}>
      <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-9 sm:px-10 lg:px-12 lg:py-11">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="flex flex-col gap-4 text-zinc-600">
            <p className={EYEBROW}>Subsidies</p>
            <h2 className={H2}>Actuele subsidies in {naamVoorKop}</h2>
            <p>
              Hieronder staan de regelingen die nu voor de gemeente {gemeente} in de Energiesubsidiewijzer van Milieu Centraal
              staan. Regelingen veranderen regelmatig. Wil je weten wat er voor jouw adres geldt, ook landelijk? Doe de subsidiecheck.
            </p>
            {officieleSubsidieUrl && (
              <p className="text-sm">
                Kijk voor de voorwaarden ook bij de{" "}
                <a href={officieleSubsidieUrl} target="_blank" rel="noopener noreferrer" className={LINK}>gemeente {gemeente}<span className="sr-only"> (opent in nieuw tabblad)</span></a>.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-4 lg:pt-10">
            <h3 className="text-lg font-bold text-[var(--gijs-donkergroen)]">Welke subsidies passen bij jouw woning?</h3>
            <p className="text-zinc-700">Vul je postcode en huisnummer in en zie direct alle regelingen voor jouw adres.</p>
            <SubsidiecheckStart idPrefix="sc-gemeente" />
          </div>
        </div>
      </div>
      <div className="mt-10 empty:hidden">
        <RegelingenInGemeente gemeente={gemeente} officieleUrl={officieleSubsidieUrl} toonKop={false} terugvalInhoud={null} />
      </div>
    </section>
  );
  return (
    <section id="subsidies" className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-10 items-start mb-10">
        <div className="flex flex-col gap-4 text-zinc-600">
          <p className={EYEBROW}>Subsidies</p>
          <h2 className={H2}>Actuele subsidies in {naamVoorKop}</h2>
          <p>
            Hieronder staan de regelingen die nu voor de gemeente {gemeente} in de Energiesubsidiewijzer van Milieu Centraal
            staan. Regelingen veranderen regelmatig. Wil je weten wat er voor jouw adres geldt, ook landelijk? Doe de subsidiecheck.
          </p>
          {officieleSubsidieUrl && (
            <p className="text-sm">
              Kijk voor de voorwaarden ook bij de{" "}
              <a href={officieleSubsidieUrl} target="_blank" rel="noopener noreferrer" className={LINK}>gemeente {gemeente}<span className="sr-only"> (opent in nieuw tabblad)</span></a>.
            </p>
          )}
        </div>
        <Card variant="tint" className="!p-8 md:!p-10 flex flex-col gap-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]">
          <h3 className="text-lg font-bold text-[var(--gijs-donkergroen)]">Welke subsidies passen bij jouw woning?</h3>
          <p className="text-zinc-700">Vul je postcode en huisnummer in en zie direct alle regelingen voor jouw adres.</p>
          <SubsidiecheckStart idPrefix="sc-gemeente" />
        </Card>
      </div>
      <RegelingenInGemeente gemeente={gemeente} officieleUrl={officieleSubsidieUrl} toonKop={false} terugvalInhoud={null} />
    </section>
  );
}

export function FaqSectie({ naamVoorKop, faq, verwant, className }: {
  naamVoorKop: string;
  faq: FAQItem[];
  verwant: { naam: string; href: string }[];
  className: string;
}) {
  return (
    <section id="veelgestelde-vragen" className={className}>
      <h2 className={H2 + " mb-8 max-w-3xl"}>Veelgestelde vragen over verduurzamen in {naamVoorKop}</h2>
      <div className="max-w-3xl">
        <FAQAccordion items={faq} className="[&_.gijs-accordion__trigger]:py-6 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
      </div>
      {verwant.length > 0 && (
        <p className="mt-10 text-[15px] text-[var(--text-muted)]">
          Ook in de buurt:{" "}
          {verwant.map((l, i) => (
            <Fragment key={l.href}>
              {i > 0 && " · "}
              <Link href={l.href} className={LINK}>{l.naam}</Link>
            </Fragment>
          ))}
        </p>
      )}
    </section>
  );
}
