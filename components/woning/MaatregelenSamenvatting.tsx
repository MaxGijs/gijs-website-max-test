import { Card } from "@/components/ds/core/Card";
import { Alert } from "@/components/ds/feedback/Alert";
import { formatEuro, type WoningplanTotals } from "@/lib/measures";

// Eén gedeelde samenvattingspaneel voor zowel de Maatregelen-stap
// (configurator: direct feedback tijdens het kiezen) als de Woningplan-
// stap (eindresultaat) — zelfde data (computeWoningplanTotals), zelfde
// weergave, zodat er geen twee losse "rekenmotor-UI's" ontstaan.
//
// BELANGRIJK: er bestaat nog geen gevalideerde rekenmotor. Alle waarden
// hieronder komen uit de illustratieve optelsom in lib/measures.ts en zijn
// nadrukkelijk als voorbeeld/prototype gelabeld — dit component verzint
// zelf geen cijfers, het toont alleen wat het meekrijgt.
export function MaatregelenSamenvatting({ totals, aantal, compact = false }: { totals: WoningplanTotals; aantal: number; compact?: boolean }) {
  if (aantal === 0) {
    return (
      <Card variant="muted" className={compact ? "text-sm" : undefined}>
        <p className="text-sm text-zinc-600">Kies hierboven een of meer maatregelen om een voorbeeldberekening te zien: investering, besparing en terugverdientijd.</p>
      </Card>
    );
  }
  return (
    <Card variant="tint" className="flex flex-col gap-3">
      <Alert tone="info" title="Voorbeeldberekening, geen echte berekening">
        Er bestaat nog geen gevalideerde rekenmotor, prijsboek of subsidiekoppeling. Deze bedragen zijn fictieve prototypewaarden.
      </Alert>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between"><span>Bruto investering (voorbeeld)</span><strong>{formatEuro(totals.brutoInvestering)}</strong></div>
        <div className="flex justify-between"><span>Verwachte subsidie (voorbeeld)</span><strong>- {formatEuro(totals.subsidieVoorbeeld)}</strong></div>
        <div className="flex justify-between border-t pt-2"><span>Netto investering (voorbeeld)</span><strong>{formatEuro(totals.nettoInvestering)}</strong></div>
        <div className="flex justify-between"><span>Indicatieve besparing per jaar</span><strong>{formatEuro(totals.besparingPerJaar)}</strong></div>
        <div className="flex justify-between"><span>Indicatief maandeffect</span><strong>{totals.nettoMaandeffectPerMaand >= 0 ? "+" : ""}{formatEuro(totals.nettoMaandeffectPerMaand)} / maand</strong></div>
        <div className="flex justify-between border-t pt-2"><span>Indicatieve terugverdientijd</span><strong>{totals.terugverdientijdJaar === null ? "—" : `± ${totals.terugverdientijdJaar} jaar`}</strong></div>
      </div>
    </Card>
  );
}
