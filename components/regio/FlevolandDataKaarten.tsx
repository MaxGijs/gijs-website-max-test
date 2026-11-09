import Link from "next/link";

// Datakaarten specifiek voor de Flevoland-provinciepagina.
// Alle percentages komen uit CBS Kerncijfers wijken en buurten 2025 en
// Voorraad woningen naar bouwjaarklasse 2026, vastgelegd in
// lib/content/gemeente-verhalen-utrecht-flevoland.ts.

type Kaart = {
  stat?: string;
  statLabel?: string;
  titel: string;
  tekst: string;
  links: { label: string; href: string }[];
};

const KAARTEN: Kaart[] = [
  {
    stat: "37–57%",
    statLabel: "woningen met zonnestroom",
    titel: "Zonnepanelen: hoog aandeel, grote variatie",
    tekst:
      "Van alle Flevolandse gemeenten heeft Zeewolde het hoogste aandeel woningen met zonnestroom: 57%. Dronten volgt met 55%, Lelystad met 46%. In Almere is het 37%. Wie al panelen heeft, kan denken aan een thuisbatterij of een warmtepomp als volgende stap.",
    links: [
      { label: "Zonnepanelen", href: "/maatregelen/zonnepanelen" },
      { label: "Thuisbatterij", href: "/maatregelen/thuisbatterij" },
    ],
  },
  {
    stat: "58%",
    statLabel: "van Almere op stadsverwarming",
    titel: "Stadsverwarming: een warme start, geen eindpunt",
    tekst:
      "58% van de woningen in Almere is op stadsverwarming aangesloten. Met een warmtenet gaat een warmtepomp minder snel; isoleren en zonnepanelen blijven zinvol. In Zeewolde is 23% aangesloten op stadsverwarming.",
    links: [
      { label: "Dakisolatie", href: "/maatregelen/dakisolatie" },
      { label: "Isolatieglas", href: "/maatregelen/isolatieglas" },
    ],
  },
  {
    stat: "0%",
    statLabel: "woningen van voor 1975 in Almere",
    titel: "Jonge woningvoorraad: warmtepomp als logische stap",
    tekst:
      "In Almere en Zeewolde zijn geen woningen van voor 1975. In Lelystad is 87% van na 1975. Die woningen zijn al redelijk geïsoleerd, en een warmtepomp of beter isolatieglas is dan de eerste stap die het meeste oplevert.",
    links: [
      { label: "Warmtepomp", href: "/maatregelen/warmtepomp" },
      { label: "Isolatieglas", href: "/maatregelen/isolatieglas" },
    ],
  },
  {
    stat: "27–44%",
    statLabel: "woningen van voor 1975 in Urk & Nop",
    titel: "Urk en Noordoostpolder: isolatie eerst",
    tekst:
      "In Urk is 27% van de woningen van voor 1975; in de Noordoostpolder is dat 44%. De oudere polderwoningen en vissershuizen hebben regelmatig een lege spouw of geen dakisolatie. Hier is isoleren de eerste stap, ook als je daarna een warmtepomp wilt.",
    links: [
      { label: "Spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" },
      { label: "Dakisolatie", href: "/maatregelen/dakisolatie" },
    ],
  },
];

export function FlevolandDataKaarten() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
      {KAARTEN.map((k) => (
        <div
          key={k.titel}
          className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-page)] p-6"
        >
          {k.stat && (
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-[var(--gijs-accentgroen)] leading-tight">
                {k.stat}
              </span>
              <span className="text-xs text-zinc-500 mt-0.5">{k.statLabel}</span>
            </div>
          )}
          <p className="font-semibold text-[var(--gijs-donkergroen)] text-[15px]">{k.titel}</p>
          <p className="text-sm text-zinc-600 leading-relaxed">{k.tekst}</p>
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            {k.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-050)] px-3 py-1.5 text-[13px] font-semibold text-[var(--accent-700)] no-underline transition-colors hover:bg-[var(--accent-100)]"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
