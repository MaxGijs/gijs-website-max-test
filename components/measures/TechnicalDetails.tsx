import type { ReactNode } from "react";
import { Icon } from "@/components/ds/core/Icon";

// Herbruikbaar "Bekijk technische gegevens"-blok voor maatregelpagina's.
// Standaard dichtgeklapt (<details> zonder `open`) — de gewone bezoeker
// hoeft dit niet te zien. Vervangt de losse, per-pagina gekopieerde
// <details>-blokken (zonnepanelen/kozijnen/vloerverwarming hadden elk hun
// eigen inline versie); nieuwe maatregelpagina's gebruiken voortaan dit
// component. `id` bepaalt het anker waarnaar "Bekijk technische
// gegevens"-links elders op de pagina kunnen springen.
export function TechnicalDetails({ id, title = "Bekijk technische gegevens", children }: { id: string; title?: string; children: ReactNode }) {
  return (
    <details id={id} className="group scroll-mt-40 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-white [&_summary::-webkit-details-marker]:hidden">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-6 py-4 font-semibold text-[var(--accent-700)]">
        {title}
        <Icon name="chevron-down" size="sm" className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6">{children}</div>
    </details>
  );
}

// Simpele label/waarde-rij, voor gebruik binnen TechnicalDetails (of los).
export function TechnicalDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-3 border-b border-[var(--border-default)] pb-2">
      <span className="text-zinc-500 text-sm">{label}</span>
      <span className="font-semibold text-zinc-800 text-sm text-right">{value}</span>
    </li>
  );
}
