"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NL_PROVINCIES } from "@/lib/content/nl-provincies";

const ACTIEVE_PROVINCIES: Record<string, { naam: string; slug: string }> = {
  "NL-OV": { naam: "Overijssel", slug: "overijssel" },
  "NL-GE": { naam: "Gelderland", slug: "gelderland" },
  "NL-UT": { naam: "Utrecht", slug: "utrecht" },
  "NL-FL": { naam: "Flevoland", slug: "flevoland" },
};

export function RegioNlKaart() {
  const [hover, setHover] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="w-full">
      <p className="text-sm font-semibold text-[var(--gijs-donkergroen)] mb-3 min-h-[20px]" aria-live="polite">
        {hover
          ? `Klik om naar ${ACTIEVE_PROVINCIES[hover]?.naam ?? hover} te gaan`
          : "Klik op een groene provincie"}
      </p>
      <svg
        viewBox="0 0 612.54211 723.61865"
        className="w-full h-auto"
        role="img"
        aria-label="Kaart van Nederland — kies Overijssel, Gelderland, Utrecht of Flevoland"
      >
        {NL_PROVINCIES.map(p => {
          const actief = ACTIEVE_PROVINCIES[p.id];
          const isHover = hover === p.id;

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
                onClick={() => actief && router.push(`/regio/${actief.slug}`)}
                onMouseEnter={() => actief && setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                aria-label={actief ? `Naar ${actief.naam}` : p.naam}
                role={actief ? "button" : undefined}
                tabIndex={actief ? 0 : undefined}
                onKeyDown={e => {
                  if (actief && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    router.push(`/regio/${actief.slug}`);
                  }
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
