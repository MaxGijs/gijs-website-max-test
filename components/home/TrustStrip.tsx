import { Icon } from "@/components/ds/core/Icon";

// Compacte vertrouwensstrook vlak bij de eerste CTA op de homepage. Alleen
// feiten die elders in de repo al aantoonbaar vaststaan (geen verzonnen
// keurmerken, aantallen of reviews): meekijken in jouw belang (onafhankelijk,
// zie de kernwaarden in lib/content/over-gijs.ts), "gratis en vrijblijvend"
// (overal herhaald) en de jarenervaring uit lib/content/over-gijs.ts
// (CIJFERBEWIJS.ervaringJaren). Het werkgebied (heel Nederland) staat hier
// bewust niet: klopt wel, maar is voor de bezoeker niet het belangrijkste.
const PUNTEN = [
  { icoon: "handshake", tekst: "Kijkt mee in jouw belang" },
  { icoon: "check", tekst: "Gratis en vrijblijvend" },
  { icoon: "home", tekst: "Persoonlijk advies aan huis" },
  { icoon: "clock", tekst: "Meer dan 20 jaar ervaring" },
];

export function TrustStrip({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {PUNTEN.map((punt) => (
        <li key={punt.tekst} className="flex items-center gap-1.5 text-sm font-medium text-zinc-600">
          <Icon name={punt.icoon} size="sm" className="shrink-0 text-[var(--accent-700)]" />
          {punt.tekst}
        </li>
      ))}
    </ul>
  );
}
