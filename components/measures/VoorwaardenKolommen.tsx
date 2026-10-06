import { Icon } from "@/components/ds/core/Icon";

export type VoorwaardenGroep = { label?: string; items: string[] };

// Open, redactionele twee-koloms weergave voor "Voorbereiding en voorwaarden" —
// vervangt het eerdere patroon van twee grote afgeronde kaarten (achtergrond/
// border/shadow) dat op meerdere maatregelpagina's identiek voorkwam. Deze
// voorwaarden zijn feitelijke opsommingen, geen zelfstandige/vergelijkbare
// items, dus geen kaart nodig (zie de visuele regel in de opdracht).
// Zelfde inhoud als voorheen; alleen de omlijsting is weg.
export function VoorwaardenKolommen({ groepen }: { groepen: VoorwaardenGroep[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
      {groepen.map((groep, i) => (
        <div key={i} className="flex flex-col gap-4">
          {groep.label && (
            <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] border-b border-[var(--border-default)] pb-3">
              {groep.label}
            </h3>
          )}
          <ul className="flex flex-col gap-4">
            {groep.items.map(item => (
              <li key={item} className="flex items-start gap-3 text-zinc-700">
                <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
