import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";

// "Past dit bij mijn woning?" — bewust GEEN definitief technisch advies of
// vinkjes die suggereren dat een woning al geschikt is bevonden. Alleen een
// neutrale lijst controlepunten (een loep-icoon, geen vinkje) die tijdens
// de energiescan/opname worden beoordeeld.
export function MeasureSuitabilityCard({
  title,
  intro,
  points,
  note,
  cta,
}: {
  title: string;
  intro: string;
  points: string[];
  note: string;
  cta: { label: string; href: string };
}) {
  return (
    <Card variant="tint" className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-[var(--gijs-donkergroen)]">{title}</h2>
      <p className="text-sm text-zinc-700">{intro}</p>
      <ul className="flex flex-col gap-2 text-sm text-[var(--green-800)]">
        {points.map(point => (
          <li key={point} className="flex items-start gap-2">
            <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-zinc-500">{note}</p>
      <Button href={cta.href} variant="accent" className="self-start">
        {cta.label}
      </Button>
    </Card>
  );
}
