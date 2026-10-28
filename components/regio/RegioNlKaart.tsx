"use client";
import { useState } from "react";
import { NL_PROVINCIES, NL_LABELPUNTEN } from "@/lib/content/nl-provincies";
import { RegioKaartInteractief } from "./RegioKaartInteractief";

const ACTIEVE_PROVINCIES: Record<string, { naam: string; slug: string }> = {
  "NL-OV": { naam: "Overijssel", slug: "overijssel" },
  "NL-GE": { naam: "Gelderland", slug: "gelderland" },
};

export function RegioNlKaart() {
  const [hover, setHover] = useState<string | null>(null);
  const [geselecteerd, setGeselecteerd] = useState<string | null>(null);

  if (geselecteerd) {
    const prov = ACTIEVE_PROVINCIES[geselecteerd];
    return (
      <div className="w-full">
        <button
          onClick={() => setGeselecteerd(null)}
          className="mb-3 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] inline-flex items-center gap-1.5 no-underline transition-colors"
        >
          ← Terug naar Nederland
        </button>
        <p className="text-sm font-semibold text-[var(--gijs-donkergroen)] mb-1">
          {prov.naam} — kies een gemeente
        </p>
        <RegioKaartInteractief provincie={prov.slug} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-sm font-semibold text-[var(--gijs-donkergroen)] mb-3 min-h-[20px]" aria-live="polite">
        {hover
          ? `Klik om in te zoomen op ${ACTIEVE_PROVINCIES[hover]?.naam ?? hover}`
          : "Klik op een groene provincie om in te zoomen"}
      </p>
      <svg
        viewBox="0 0 612.54211 723.61865"
        className="w-full h-auto"
        role="img"
        aria-label="Kaart van Nederland — kies Overijssel of Gelderland"
      >
        {NL_PROVINCIES.map(p => {
          const actief = ACTIEVE_PROVINCIES[p.id];
          const isHover = hover === p.id;
          const label = NL_LABELPUNTEN[p.id];

          return (
            <g key={p.slug}>
              <path
                d={p.d}
                fill={
                  actief
                    ? isHover
                      ? "var(--gijs-donkergroen)"
                      : "var(--gijs-accentgroen)"
                    : "var(--surface-muted)"
                }
                stroke="white"
                strokeWidth={2}
                strokeLinejoin="round"
                style={{ cursor: actief ? "pointer" : "default", transition: "fill 150ms ease" }}
                onClick={() => actief && setGeselecteerd(p.id)}
                onMouseEnter={() => actief && setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                aria-label={actief ? `Zoom in op ${actief.naam}` : p.naam}
                role={actief ? "button" : undefined}
                tabIndex={actief ? 0 : undefined}
                onKeyDown={e => {
                  if (actief && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setGeselecteerd(p.id);
                  }
                }}
              />
              {actief && label && (
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={16}
                  fontWeight={600}
                  fill="white"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {p.naam}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
