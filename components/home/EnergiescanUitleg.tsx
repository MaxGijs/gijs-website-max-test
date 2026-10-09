import { Icon } from "@/components/ds/core/Icon";

// Compacte, scanbare uitleg bij de energiescan-CTA's (voor wie, wat je krijgt,
// vrijblijvendheid en het vervolg). Bevat alleen wat elders in de site al
// aantoonbaar vaststaat, of door Gijs bevestigd is (digitaal of fysiek; het
// werkgebied staat er bewust niet bij, meekijken in jouw belang wel); geen bezoekduur
// of reden voor "gratis", die staan niet in de repo — zie het MVP-overzicht
// onder "Input nodig van Gijs/Thom".
const PUNTEN = [
  "Voor woningeigenaren. Gijs kijkt mee in jouw belang, digitaal of fysiek.",
  "Een adviseur bekijkt je woning, neemt de bestaande situatie op en bespreekt welke maatregelen technisch passen.",
  "Gratis en vrijblijvend, ter waarde van €349. Na je aanvraag neemt Gijs contact met je op om een moment af te stemmen.",
];

export function EnergiescanUitleg({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-col gap-2 text-sm text-zinc-700 ${className}`}>
      {PUNTEN.map((tekst, i) => (
        <li key={i} className="flex items-start gap-2 text-left">
          <Icon name="check" size="sm" className="shrink-0 mt-0.5 text-[var(--accent-700)]" />
          <span>{tekst}</span>
        </li>
      ))}
    </ul>
  );
}
