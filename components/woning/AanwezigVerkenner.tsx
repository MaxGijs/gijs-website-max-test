"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ds/core/Icon";

// Stap 2 van de woningscan ("Wat is al aan je woning gedaan?") in dezelfde vorm als het maatregelenblok op
// de regiopagina's (components/regio/IsolatieInstallatiesSectie.tsx): één lichtgroen paneel met de woning
// groot links en rechts pill-tabs met witte rijen. Verschil: een rij is hier een aanvinkvakje ("is al
// aanwezig"), en aanklikken zoomt de woning in op dat onderdeel. Met "Volgende" loop je tab voor tab door
// de woning: isolatie, installaties, warmteafgifte.

export type VerkennerTab = "isolatie" | "installaties" | "afgifte";
type Rij = { id: string; naam: string; tekst?: string; icoon: string };

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

// Alle rijen even groot: één regel naam, één regel korte uitleg (Max, 17-11-2026).
const UITLEG: Record<string, string> = {
  dakisolatie: "Warmte blijft onder je dak.",
  gevelisolatie: "Isolatie in de spouwmuur.",
  "glas-kozijnen": "Glas dat de warmte binnenhoudt.",
  vloerisolatie: "Minder koude vloer.",
  zonnepanelen: "Eigen stroom van je dak.",
  warmtepomp: "Hybride of volledig elektrisch.",
  thuisbatterij: "Zonnestroom bewaren voor later.",
  vloerverwarming: "Warmte vanuit de vloer.",
};

const AFGIFTE_RIJEN: Rij[] = [
  { id: "Normale radiatoren (hoge temperatuur)", naam: "Normale radiatoren", tekst: "Werken op een hoge temperatuur.", icoon: "heater" },
  { id: "Vloerverwarming of lagetemperatuurradiatoren", naam: "Lage temperatuur", tekst: "Vloerverwarming of grote radiatoren.", icoon: "waves" },
  { id: "Convectorputten", naam: "Convectorputten", tekst: "Verwarming in een put in de vloer.", icoon: "grip-horizontal" },
  { id: "Anders", naam: "Anders", tekst: "Vul in hoe het bij jou zit.", icoon: "pencil" },
];

const TAB_INFO: Record<VerkennerTab, { label: string; uitleg: string }> = {
  isolatie: { label: "Isolatie", uitleg: "Welke isolatie heeft je woning al? Vink aan wat er nu al is; je ziet het meteen in de woning." },
  installaties: { label: "Installaties", uitleg: "Welke installaties heb je al? Vink aan wat er nu al is." },
  afgifte: { label: "Warmteafgifte", uitleg: "Hoe wordt de warmte nu in huis afgegeven? Vink aan wat je hebt." },
};
const VOLGORDE: VerkennerTab[] = ["isolatie", "installaties", "afgifte"];

export function AanwezigVerkenner({ woning, groepen, bestaande, onToggle, actief, aanwezigOnbekend, onOnbekend, warmtepompKeuze, afgifte, onToggleAfgifte, afgifteAnders }: {
  /** De 3D-woning (HouseViewer met `vol`). */
  woning: ReactNode;
  groepen: Record<"isolatie" | "installaties", { id: string; label: string }[]>;
  bestaande: string[];
  onToggle: (id: string) => void;
  /** Welke rij nu in de woning in beeld is (maatregel-id of afgifte-optie). */
  actief: string | null;
  aanwezigOnbekend: boolean;
  onOnbekend: (aan: boolean) => void;
  /** Keuze hybride/volledig, getoond zodra de warmtepomp is aangevinkt. */
  warmtepompKeuze: ReactNode;
  afgifte: string[];
  onToggleAfgifte: (optie: string) => void;
  /** Tekstveld bij "Anders". */
  afgifteAnders: ReactNode;
}) {
  const [tab, setTab] = useState<VerkennerTab>("isolatie");
  const volgende = VOLGORDE[VOLGORDE.indexOf(tab) + 1];
  // Status per tab, zodat je ziet dat er achter een ander tabblad al keuzes staan.
  const aantal: Record<VerkennerTab, number> = {
    isolatie: groepen.isolatie.filter(g => bestaande.includes(g.id)).length,
    installaties: groepen.installaties.filter(g => bestaande.includes(g.id)).length,
    afgifte: afgifte.filter(a => a !== "Weet ik niet").length,
  };

  const rijen: Rij[] = tab === "afgifte"
    ? AFGIFTE_RIJEN
    : groepen[tab].map(({ id, label }) => ({ id, naam: label, tekst: UITLEG[id], icoon: PICTOGRAM[id] ?? "circle" }));
  const isAan = (id: string) => (tab === "afgifte" ? afgifte.includes(id) : bestaande.includes(id));
  const toggle = (id: string) => (tab === "afgifte" ? onToggleAfgifte(id) : onToggle(id));
  const onbekendAan = tab === "afgifte" ? afgifte.includes("Weet ik niet") : aanwezigOnbekend;

  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-4 py-8 sm:px-5 md:px-10 md:py-10">
      {/* items-start: de woning blijft op zijn plek als de rechterkolom per tab een andere hoogte heeft.
          Onder lg geen vaste hoogte: de woning (HouseViewer .vol) heeft daar zelf een vaste hoogte, en het bijschrift
          eronder moet mee kunnen groeien, anders loopt het over de tabbladen heen. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 lg:gap-10 items-start">
        <div className="flex flex-col lg:h-[580px] min-w-0">{woning}</div>

        <div className="flex min-w-0 flex-col gap-4">
          <div role="tablist" aria-label="Wat is er al aan je woning gedaan?" className="flex w-full sm:inline-flex sm:w-auto self-start rounded-full bg-white p-1 shadow-[var(--shadow-1)]">
            {VOLGORDE.map(id => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 sm:px-5 py-2 text-[13px] sm:text-sm font-semibold transition-colors ${tab === id ? "bg-[var(--gijs-donkergroen)] text-white" : "text-zinc-600 hover:text-[var(--gijs-donkergroen)]"}`}>
                {TAB_INFO[id].label}
                {aantal[id] > 0 && <span className={`ml-1.5 inline-flex min-w-5 h-5 items-center justify-center rounded-full px-1.5 text-[12px] font-bold ${tab === id ? "bg-white/20 text-white" : "bg-[var(--accent-100)] text-[var(--accent-700)]"}`}>{aantal[id]}<span className="sr-only"> gekozen</span></span>}
              </button>
            ))}
          </div>

          <p className="text-zinc-600 text-sm">{TAB_INFO[tab].uitleg}</p>

          <ul role="tabpanel" aria-label={TAB_INFO[tab].label} className="flex flex-col gap-2">
            {rijen.map(r => (
              <VerkennerRij key={r.id} rij={r} aan={isAan(r.id)} actief={actief === r.id} onClick={() => toggle(r.id)} />
            ))}
            <VerkennerRij
              rij={{ id: "onbekend", naam: "Ik weet het niet precies", tekst: "Gijs controleert het bij de opname.", icoon: "circle-help" }}
              aan={onbekendAan} actief={false} aanLabel=""
              onClick={() => (tab === "afgifte" ? onToggleAfgifte("Weet ik niet") : onOnbekend(!aanwezigOnbekend))}
            />
          </ul>

          {tab === "installaties" && warmtepompKeuze}
          {tab === "afgifte" && afgifte.includes("Anders") && afgifteAnders}

          {volgende && (
            <button type="button" onClick={() => setTab(volgende)} className="self-start inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">
              Volgende: {TAB_INFO[volgende].label.toLowerCase()} <Icon name="arrow-right" size="sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function VerkennerRij({ rij, aan, actief, onClick, aanLabel = "Heb ik al" }: { rij: Rij; aan: boolean; actief: boolean; onClick: () => void; /** Tekst naast het vinkje als de rij aan staat; leeg = geen tekst. */ aanLabel?: string }) {
  return (
    <li>
      <button type="button" role="checkbox" aria-checked={aan} onClick={onClick}
        className={`flex h-[68px] w-full items-center gap-4 rounded-[var(--radius-card)] border bg-white px-4 text-left transition-all duration-500 ease-out ${
          aan || actief ? "border-[var(--gijs-accentgroen)] shadow-[var(--shadow-1)]" : "border-transparent hover:border-[var(--border-default)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]"
        }`}>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${aan ? "bg-[var(--gijs-accentgroen)] text-white" : "bg-[var(--surface-tint)] text-[var(--accent-700)]"}`}>
          <Icon name={rij.icoon} size="md" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[15px] font-semibold text-[var(--gijs-donkergroen)]">{rij.naam}</span>
          {rij.tekst && <span className="truncate text-[13px] text-zinc-600">{rij.tekst}</span>}
        </span>
        {aan && aanLabel && <span className="hidden sm:inline shrink-0 text-[12px] font-semibold text-[var(--accent-700)]">{aanLabel}</span>}
        <span aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${aan ? "border-[var(--gijs-accentgroen)] bg-[var(--gijs-accentgroen)] text-white" : "border-[var(--border-default)] bg-white text-transparent"}`}>
          <Icon name="check" size="sm" />
        </span>
      </button>
    </li>
  );
}
