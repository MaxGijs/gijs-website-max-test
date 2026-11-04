"use client";

import { useState } from "react";

// Van oud naar nieuw: donker naar licht, gelijk aan het woningverhaal op de gemeentepagina's.
const KLEUR = ["bg-[var(--gijs-donkergroen)]", "bg-[var(--accent-700)]", "bg-[var(--accent-600)]", "bg-[var(--accent-200)]"];

export function BouwperiodeBalk({ periodes }: { periodes: { label: string; percentage: number; tekst: string }[] }) {
  const [actief, setActief] = useState<number | null>(null);
  const gedimd = (i: number) => (actief !== null && actief !== i ? "opacity-30" : "opacity-100");

  return (
    <div onMouseLeave={() => setActief(null)}>
      <div className="flex h-2.5 w-full gap-1 mb-6" role="img"
        aria-label={`Bouwperiodes: ${periodes.map(b => `${b.label} ${b.percentage}%`).join(", ")}`}>
        {periodes.map((b, i) => (
          <span key={b.label} onMouseEnter={() => setActief(i)}
            className={`h-full rounded-full transition-opacity duration-[var(--dur-base)] ${KLEUR[i % KLEUR.length]} ${gedimd(i)}`}
            style={{ width: `${b.percentage}%` }} />
        ))}
      </div>
      <ol className={`grid gap-x-8 gap-y-6 ${periodes.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
        {periodes.map((b, i) => (
          <li key={b.label} tabIndex={0} onMouseEnter={() => setActief(i)} onFocus={() => setActief(i)} onBlur={() => setActief(null)}
            className={`flex flex-col gap-1 rounded-[var(--radius-md)] outline-none transition-opacity duration-[var(--dur-base)] focus-visible:shadow-[var(--shadow-focus)] ${gedimd(i)}`}>
            <span className="text-[1.375rem] font-bold leading-none tracking-[-0.03em] text-[var(--gijs-donkergroen)]">{b.percentage}%</span>
            <span className="text-[14px] font-semibold text-[var(--gijs-donkergroen)]">{b.label}</span>
            <span className="text-[14px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]">{b.tekst}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
