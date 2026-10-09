import type { ReactNode } from "react";
import Link from "next/link";
import { Card } from "@/components/ds/core/Card";
import { Icon } from "@/components/ds/core/Icon";

export type Feature = {
  icon?: string;
  title: ReactNode;
  text?: ReactNode;
  href?: string;
  linkLabel?: string;
};

const COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 lg:grid-cols-5",
};

// Lichtgetinte kaartjes (icoon + titel + korte tekst), 2 naast elkaar vanaf
// mobiel. Gebruikt voor "De voordelen", onderdelen-uitleg en vergelijkbare
// korte-opsommingen op de maatregelpagina's. Puur presentatie: geen tekst
// toegevoegd of weggehaald, alleen de omlijsting.
export function FeatureList({ items, columns = 3 }: { items: Feature[]; columns?: 2 | 3 | 4 | 5 }) {
  return (
    <ul className={`grid ${COLS[columns]} gap-3 sm:gap-6`}>
      {items.map((item, i) => (
        <li key={i} className="h-full">
          <Card variant="tint" className="flex h-full flex-col gap-2 !p-3 sm:!p-5">
            {item.icon && <Icon name={item.icon} size="md" className="text-[var(--accent-700)]" />}
            <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">{item.title}</h3>
            {item.text && <p className="text-sm text-zinc-600 leading-relaxed">{item.text}</p>}
            {item.href && (
              <Link
                href={item.href}
                className="mt-auto pt-1 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] no-underline hover:underline"
              >
                {item.linkLabel}
              </Link>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
