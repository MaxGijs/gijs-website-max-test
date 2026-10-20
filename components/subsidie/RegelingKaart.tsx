import { Badge } from "@/components/ds/core/Badge";
import { Card } from "@/components/ds/core/Card";
import { NIVEAU_LABEL, TYPE_LABEL, type SubsidieRegeling } from "@/lib/milieu-centraal/types";

// Eén regeling uit de Energiesubsidiewijzer van Milieu Centraal. Alle tekst komt uit de API en is
// al omgezet naar platte tekst (we tonen nooit HTML van buiten). Werkt op de server en in de browser.

const LINK = "underline underline-offset-2 text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]";

/** Platte tekst met alinea's en opsommingstekens ("• ") als nette HTML. */
export function Tekstblok({ tekst }: { tekst: string }) {
  const blokken: { lijst: boolean; regels: string[] }[] = [];
  for (const regel of tekst.split("\n").map(r => r.trim()).filter(Boolean)) {
    const lijst = regel.startsWith("• ");
    const laatste = blokken[blokken.length - 1];
    if (laatste && laatste.lijst && lijst) laatste.regels.push(regel.slice(2));
    else blokken.push({ lijst, regels: [lijst ? regel.slice(2) : regel] });
  }
  return (
    <div className="flex flex-col gap-2">
      {blokken.map((b, i) =>
        b.lijst ? (
          <ul key={i} className="list-disc pl-5 flex flex-col gap-1">
            {b.regels.map((r, j) => <li key={j}>{r}</li>)}
          </ul>
        ) : (
          <p key={i}>{b.regels[0]}</p>
        ),
      )}
    </div>
  );
}

const datum = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

export function RegelingKaart({ r, compact = false }: { r: SubsidieRegeling; compact?: boolean }) {
  return (
    <Card as="article" className="flex flex-col gap-3 !p-6">
      <div className="flex flex-wrap gap-2">
        <Badge tone={r.niveau === "landelijk" ? "neutral" : "accent"}>{NIVEAU_LABEL[r.niveau]}</Badge>
        <Badge tone={r.type === "subsidie" ? "success" : "outline"}>{TYPE_LABEL[r.type]}</Badge>
        {r.deelgebied && <Badge tone="warning">Alleen in een deel van de gemeente</Badge>}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[var(--gijs-donkergroen)] leading-snug">{r.titel}</h3>
        {r.aanbieder && <p className="text-sm text-zinc-500 mt-1">Aangeboden door {r.aanbieder}</p>}
      </div>
      {r.intro && <div className="text-zinc-700"><Tekstblok tekst={r.intro} /></div>}
      {r.maatregelenMc.length > 0 && !compact && (
        <p className="text-sm text-zinc-600">
          <span className="font-medium text-zinc-700">Voor: </span>
          {r.maatregelenMc.join(", ")}
        </p>
      )}
      {!compact && (r.bedragen || r.voorwaarden || r.aanvullend) && (
        <div className="flex flex-col divide-y divide-zinc-200 border-y border-zinc-200 text-zinc-700">
          {r.bedragen && (
            <details className="group py-2">
              <summary className="cursor-pointer font-medium text-[var(--gijs-donkergroen)] py-1">Bedragen</summary>
              <div className="pt-2 pb-1"><Tekstblok tekst={r.bedragen} /></div>
            </details>
          )}
          {r.voorwaarden && (
            <details className="group py-2">
              <summary className="cursor-pointer font-medium text-[var(--gijs-donkergroen)] py-1">Voorwaarden</summary>
              <div className="pt-2 pb-1"><Tekstblok tekst={r.voorwaarden} /></div>
            </details>
          )}
          {r.aanvullend && (
            <details className="group py-2">
              <summary className="cursor-pointer font-medium text-[var(--gijs-donkergroen)] py-1">Meer informatie</summary>
              <div className="pt-2 pb-1"><Tekstblok tekst={r.aanvullend} /></div>
            </details>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm mt-auto">
        <span className="text-zinc-500">{r.einde ? `Loopt tot ${datum(r.einde)}` : "Geen einddatum bekend"}</span>
        {r.url && (
          <a href={r.url} target="_blank" rel="noopener noreferrer" className={LINK}>
            Bekijk op Verbeter Je Huis<span className="sr-only"> (opent in nieuw tabblad)</span>
          </a>
        )}
      </div>
    </Card>
  );
}
