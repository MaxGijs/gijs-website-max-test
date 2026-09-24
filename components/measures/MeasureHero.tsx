import type { ReactNode } from "react";
import { Button } from "@/components/ds/core/Button";
import MeasureImage from "@/components/MeasureImage";

type CTA = { label: string; href: string };

// Herbruikbare hero voor een maatregelpagina: label + titel + korte intro
// + primaire/secundaire CTA, met een
// afbeelding ernaast. Geen eigen claims — alle tekst komt van de pagina
// die deze component aanroept.
//
// `imageCaption` toont een kleine bijschrift-chip onderaan de afbeelding
// (bijvoorbeeld "De spouw gevuld met isolatiemateriaal") — een eenvoudiger,
// robuustere vervanging voor een met de hand getekende pijl-annotatie,
// zonder aan een specifieke schermgrootte gebonden absolute posities.
// `overlayCard` plaatst een los kaartje dat de afbeelding aan de
// onderkant overlapt (bijvoorbeeld een korte "vul je adres in"-CTA).
export function MeasureHero({
  label,
  title,
  subtitle,
  intro,
  image,
  imageAlt,
  imageCaption,
  overlayCard,
  primaryCta,
  secondaryCta,
}: {
  label: string;
  title: string;
  subtitle?: string;
  intro?: string;
  image?: string;
  imageAlt: string;
  imageCaption?: string;
  overlayCard?: ReactNode;
  primaryCta?: CTA;
  secondaryCta?: CTA;
}) {
  return (
    <header className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-start py-6 md:py-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold tracking-[0.14em] uppercase text-[var(--accent-700)]">{label}</p>
        <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-display)] text-[var(--gijs-donkergroen)]">
          {title}
        </h1>
        {subtitle && <p className="text-[var(--fs-500)] font-semibold text-[var(--accent-700)]">{subtitle}</p>}
        {intro && <p className="text-[var(--fs-400)] text-zinc-600 max-w-prose mt-1">{intro}</p>}
        {primaryCta && (
          <div className="flex flex-wrap gap-3 mt-2">
            <Button href={primaryCta.href} variant="accent" size="lg" iconRight="arrow-right">
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="secondary" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
      <div className={`relative ${overlayCard ? "pb-10 md:pb-14" : ""}`}>
        <div className="relative rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)]">
          <MeasureImage image={image} name={imageAlt} priority />
          {imageCaption && (
            <span className="absolute left-4 top-4 max-w-[80%] rounded-[var(--radius-pill)] bg-[var(--green-900)]/90 text-white text-xs font-semibold px-4 py-2">
              {imageCaption}
            </span>
          )}
        </div>
        {overlayCard && (
          <div className="absolute left-4 right-4 md:left-auto md:right-6 bottom-0 md:w-80">{overlayCard}</div>
        )}
      </div>
    </header>
  );
}
