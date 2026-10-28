"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NL_PROVINCIES, NL_LABELPUNTEN } from "@/lib/content/nl-provincies";

const ACTIEVE_PROVINCIES: Record<string, { naam: string; href: string }> = {
  overijssel: { naam: "Overijssel", href: "/regio/overijssel" },
  gelderland: { naam: "Gelderland", href: "/regio/gelderland" },
};

export function RegioNlKaart() {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-sm font-semibold text-[var(--gijs-donkergroen)] mb-3 min-h-[20px]" aria-live="polite">
        {hover
          ? `Klik om naar ${ACTIEVE_PROVINCIES[hover]?.naam ?? hover} te gaan`
          : "Klik op een groene provincie"}
      </p>
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-auto"
        role="img"
        aria-label="Kaart van Nederland — kies Overijssel of Gelderland"
      >
        {NL_PROVINCIES.map(p => {
          const actief = ACTIEVE_PROVINCIES[p.slug];
          const isHover = hover === p.slug;
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
                onClick={() => actief && router.push(actief.href)}
                onMouseEnter={() => actief && setHover(p.slug)}
                onMouseLeave={() => setHover(null)}
                aria-label={actief ? `Ga naar ${actief.naam}` : p.naam}
                role={actief ? "button" : undefined}
                tabIndex={actief ? 0 : undefined}
                onKeyDown={e => {
                  if (actief && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    router.push(actief.href);
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
                  fill={isHover ? "white" : "white"}
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
