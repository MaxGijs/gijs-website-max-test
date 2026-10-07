"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Icon } from "@/components/ds/core/Icon";

export type VoorwaardenMobielPaneel = {
  id: string;
  label: string;
  trigger: { src: string; width: number; height: number };
  // Vrije inhoud i.p.v. alleen een afbeelding: een afbeelding (+ eigen sr-only tekst) op de ene
  // pagina, een gewone zichtbare lijst op een andere (als er nog geen bijpassende afbeelding is).
  inhoud: ReactNode;
};

// Mobiele variant van de voor/tijdens/na-installatie-infographic: in plaats van één lange
// afbeelding tikt de bezoeker een kopbalk open om de bijbehorende tekstvakken te zien. Gebruikt
// de door Max aangeleverde afbeeldingen (koptitel + inhoud per fase), alleen zichtbaar < lg —
// op desktop staat de volledige infographic (zie ZonnepanelenPage.tsx).
export function VoorwaardenMobielAccordion({ panelen }: { panelen: VoorwaardenMobielPaneel[] }) {
  const [open, setOpen] = useState<string | null>(panelen[0]?.id ?? null);
  return (
    <div className="flex flex-col gap-3">
      {panelen.map(paneel => {
        const isOpen = open === paneel.id;
        return (
          <div key={paneel.id}>
            <button
              type="button"
              className="block w-full text-left"
              aria-expanded={isOpen}
              aria-controls={`voorwaarden-mobiel-${paneel.id}`}
              onClick={() => setOpen(isOpen ? null : paneel.id)}
            >
              <span className="relative block">
                <Image
                  src={paneel.trigger.src}
                  alt={paneel.label}
                  width={paneel.trigger.width}
                  height={paneel.trigger.height}
                  quality={100}
                  className="w-full h-auto"
                />
                <Icon
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                />
              </span>
            </button>
            {/* Grid-rows 0fr/1fr-animatie i.p.v. tonen/verbergen: het tekstvak schuift zo
                soepel onder de kopbalk vandaan in plaats van abrupt te verschijnen. */}
            <div
              id={`voorwaarden-mobiel-${paneel.id}`}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="mt-2">{paneel.inhoud}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
