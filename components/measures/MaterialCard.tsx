import Image from "next/image";
import { Card } from "@/components/ds/core/Card";
import { Icon } from "@/components/ds/core/Icon";
import { Badge } from "@/components/ds/core/Badge";

// Eén materiaalvariant: naam + korte, bronbestendige omschrijving + een
// paar scanbare kernvoordelen (zie lib/content/spouw-products.ts) + de
// eigen productafbeelding uit het productblad. Toont bewust geen "beste
// keuze" of aanbeveling — dat wordt tijdens de energiescan beoordeeld.
// `highlight` geeft een materiaal een iets prominentere, getinte kaart;
// `badge` een subtiel label (bijv. "Veel toegepast door Gijs") — bewust
// geen cijfermatige claim.
export function MaterialCard({
  name,
  description,
  benefits = [],
  image,
  imageAlt,
  highlight = false,
  badge,
  headingLevel: Heading = "h3",
}: {
  name: string;
  description: string;
  benefits?: string[];
  image?: string;
  imageAlt: string;
  highlight?: boolean;
  badge?: string;
  headingLevel?: "h3" | "h4";
}) {
  return (
    <Card variant={highlight ? "tint" : "default"} className="flex flex-col gap-4">
      {image && (
        <div className="rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)] aspect-square flex items-center justify-center">
          <Image src={image} alt={imageAlt} width={600} height={600} className="max-w-[90%] max-h-[90%] object-contain" />
        </div>
      )}
      {badge && <Badge tone="accent">{badge}</Badge>}
      <Heading className="font-bold text-lg text-[var(--gijs-donkergroen)]">{name}</Heading>
      <p className="text-sm text-zinc-600">{description}</p>
      {benefits.length > 0 && (
        <ul className="flex flex-col gap-1.5 mt-1">
          {benefits.map(benefit => (
            <li key={benefit} className="flex items-start gap-2 text-sm text-zinc-700">
              <Icon name="check" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
