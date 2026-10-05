export type Stat = { label: string; value: string };

// Vervangt een rij identieke "dashboard"-kaartjes (elk een los afgerond
// kaartje met een label en een groot getal, bijvoorbeeld bij subsidiebedragen)
// door één doorlopende, van boven en onder omlijnde statistiekenrij —
// dezelfde grammatica als het grote cijfer bij "jaar ervaring" op
// /over-gijs. Geen bedragen of cijfers gewijzigd, alleen de omlijsting.
export function StatRow({ items }: { items: Stat[] }) {
  const cols = items.length >= 4 ? "sm:grid-cols-4" : items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <dl className={`grid grid-cols-2 ${cols} gap-x-8 gap-y-6 border-y border-[var(--border-default)] py-6 max-w-4xl`}>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{item.label}</dt>
          <dd className="text-2xl font-bold text-[var(--gijs-donkergroen)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
