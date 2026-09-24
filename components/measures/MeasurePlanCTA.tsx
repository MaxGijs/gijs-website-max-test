import { Button } from "@/components/ds/core/Button";

type CTA = { label: string; href: string };

// Afsluitende sectie die de maatregelpagina aan de digitale woning
// koppelt, in plaats van als losse SEO-pagina te voelen.
export function MeasurePlanCTA({
  title,
  text,
  primaryCta,
  secondaryCta,
}: {
  title: string;
  text: string;
  primaryCta: CTA;
  secondaryCta: CTA;
}) {
  return (
    <section className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-10 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="max-w-xl">
        <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">{title}</h2>
        <p className="text-zinc-700">{text}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <Button href={primaryCta.href} variant="accent" size="lg" iconRight="arrow-right">
          {primaryCta.label}
        </Button>
        <Button href={secondaryCta.href} variant="secondary" size="lg">
          {secondaryCta.label}
        </Button>
      </div>
    </section>
  );
}
