"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Icon } from "@/components/ds/core/Icon";
import { MEASURE_GROUPS, measuresForGroup, type MeasureGroupId } from "@/lib/measures";
import { SCAN_TITELS } from "@/lib/content/maatregel-titels";
import { MAATREGEL_STAAT } from "@/components/woning/scan-camera";
import type { HouseFocus } from "@/components/woning/HouseViewer";

// Dezelfde 3D-woning, camerastanden en maatregelbeelden als de woningscan (HouseViewer): de batterij
// via de open zijgevel, vloerverwarming in de vloer. Maatregelen, groepen en namen ook als de scan
// ("Wat kun je nog doen?", zie lib/measures.ts), met een pictogram in plaats van een foto.
const HouseViewer = dynamic(() => import("@/components/woning/HouseViewer").then(m => m.HouseViewer), { ssr: false });

const PICTOGRAM: Record<string, string> = {
  dakisolatie: "house",
  gevelisolatie: "brick-wall",
  vloerisolatie: "layers",
  "glas-kozijnen": "app-window",
  zonnepanelen: "sun",
  warmtepomp: "fan",
  vloerverwarming: "waves",
  thuisbatterij: "battery-charging",
};
const TABS: MeasureGroupId[] = ["isolatie", "installaties"];
const groep = (id: MeasureGroupId) => MEASURE_GROUPS.find(g => g.id === id)!;

export function IsolatieInstallatiesSectie({ cta, defaultTab }: { cta?: React.ReactNode; defaultTab?: MeasureGroupId } = {}) {
  const [tab, setTab] = useState<MeasureGroupId>(defaultTab ?? "isolatie");
  const [actief, setActief] = useState<string | null>(null);

  function kiesTab(id: MeasureGroupId) {
    setTab(id);
    setActief(null);
  }

  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-10 md:px-10 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-center">
        <div className="flex flex-col lg:h-[580px]">
          <HouseViewer
            vol
            zonderExtras
            selectedMeasureIds={measuresForGroup(tab).map(m => m.id)}
            focus={actief ? (MAATREGEL_STAAT[actief] as HouseFocus) ?? null : null}
            onFocusChange={f => { if (!f) setActief(null); }}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div role="tablist" aria-label="Soort maatregel" className="inline-flex self-start rounded-full bg-white p-1 shadow-[var(--shadow-1)]">
            {TABS.map(id => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => kiesTab(id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  tab === id ? "bg-[var(--gijs-donkergroen)] text-white" : "text-zinc-600 hover:text-[var(--gijs-donkergroen)]"
                }`}
              >
                {groep(id).label}
              </button>
            ))}
          </div>

          <p className="text-zinc-600 text-sm">{groep(tab).description} Klik op een maatregel om te zien waar die in de woning zit.</p>

          <ul role="tabpanel" className="flex flex-col gap-2">
            {measuresForGroup(tab).map(m => {
              const t = SCAN_TITELS[m.id];
              const isActief = actief === m.id;
              return (
                <li key={m.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setActief(isActief ? null : m.id)}
                    aria-pressed={isActief}
                    className={`flex w-full items-center gap-4 rounded-[var(--radius-card)] border bg-white px-4 py-3 pr-32 text-left transition-all duration-500 ease-out ${
                      isActief ? "border-[var(--gijs-accentgroen)] shadow-[var(--shadow-1)]" : "border-transparent hover:border-[var(--border-default)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]"
                    }`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${isActief ? "bg-[var(--gijs-accentgroen)] text-white" : "bg-[var(--surface-tint)] text-[var(--accent-700)]"}`}>
                      <Icon name={PICTOGRAM[m.id] ?? "circle"} size="md" />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-semibold text-[var(--gijs-donkergroen)]">{t?.naam ?? m.label}</span>
                      {t?.titel && <span className="text-[13px] text-zinc-600">{t.titel}</span>}
                    </span>
                  </button>
                  {t?.slug && (
                    <Link href={`/maatregelen/${t.slug}`} className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-full bg-[var(--accent-050)] px-3 py-1.5 text-[13px] font-semibold text-[var(--accent-700)] no-underline transition-colors duration-[var(--dur-base)] hover:bg-[var(--accent-100)] hover:text-[var(--gijs-donkergroen)]">
                      Meer info<span className="sr-only"> over {(t.naam).toLowerCase()}</span> <Icon name="arrow-right" size="sm" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <Link href={`/maatregelen#${tab}`} className="text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] inline-flex items-center gap-1 no-underline">
            {tab === "isolatie" ? "Bekijk alle isolaties" : "Bekijk alle installaties"} <Icon name="arrow-right" size="sm" />
          </Link>

          {cta && <div className="mt-4 border-t border-[var(--accent-100)] pt-6">{cta}</div>}
        </div>
      </div>
    </div>
  );
}
