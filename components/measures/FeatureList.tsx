import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ds/core/Icon";

export type Feature = {
  icon?: string;
  title: ReactNode;
  text?: ReactNode;
  href?: string;
  linkLabel?: string;
};

const COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-5",
};

// Vervangt een rij identieke iconkaarten (icoon-in-cirkel + titel + korte
// tekst, herhaald in afzonderlijke afgeronde kaartjes) door een rustige
// lijst met alleen een bovenrand per item — dezelfde grammatica als de
// kernwaardenlijst op /over-gijs (border-t + typografie in plaats van een
// kaartgrid). Gebruikt voor "De voordelen", onderdelen-uitleg en
// vergelijkbare korte-opsommingen op de maatregelpagina's. Puur
// presentatie: geen tekst toegevoegd of weggehaald, alleen de omlijsting.
export function FeatureList({ items, columns = 3 }: { items: Feature[]; columns?: 2 | 3 | 4 | 5 }) {
  return (
    <ul className={`grid grid-cols-1 ${COLS[columns]} gap-x-8 gap-y-8`}>
      {items.map((item, i) => (
        <li key={i} className="flex flex-col gap-2 border-t-2 border-[var(--gijs-donkergroen)] pt-4">
          {item.icon && <Icon name={item.icon} size="md" className="text-[var(--accent-700)]" />}
          <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">{item.title}</h3>
          {item.text && <p className="text-zinc-600 leading-relaxed">{item.text}</p>}
          {item.href && (
            <Link
              href={item.href}
              className="mt-1 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] no-underline hover:underline"
            >
              {item.linkLabel}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
