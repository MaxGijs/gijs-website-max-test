import { Button } from "@/components/ds/core/Button";
import { H2 } from "@/components/regio/RegioBlokken";

// Zelfde opmaak als de slot-CTA op regiopagina's (RegioCta in
// components/regio/RegioBlokken.tsx): identieke padding, kop- en
// knopstijl, zodat de afsluitende sectie van een maatregelpagina er
// hetzelfde uitziet als die van een regiopagina. Tekst en links komen
// van de pagina die deze component aanroept.
export function MeasureCta({
  titel,
  tekst,
  primaryHref,
  primaryLabel = "Start de woningscan",
}: {
  titel: string;
  tekst: string;
  primaryHref: string;
  primaryLabel?: string;
}) {
  return (
    <section className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-10 sm:px-10 md:px-14 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
      <div className="max-w-xl min-w-0 [&_h2]:[hyphens:auto]">
        <h2 className={H2 + " mb-3"}>{titel}</h2>
        <p className="text-[17px] leading-relaxed text-zinc-700 [text-wrap:pretty]">{tekst}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <Button href={primaryHref} variant="accent" size="lg" iconRight="arrow-right" className="w-full md:w-auto">
          {primaryLabel}
        </Button>
        <Button href="/contact" variant="secondary" size="lg" className="w-full md:w-auto">Neem contact op</Button>
      </div>
    </section>
  );
}
