"use client";

import { useEffect, useState } from "react";
import { zoekSubsidies } from "@/app/subsidiecheck/actions";
import { Badge } from "@/components/ds/core/Badge";
import { MEASURES } from "@/lib/measures";
import { NIVEAU_LABEL, TYPE_LABEL, type SubsidieUitkomst } from "@/lib/milieu-centraal/types";
import { Tekstblok } from "./RegelingKaart";

// In het woningplan van de scan: de regelingen van Milieu Centraal die voor dit adres gelden, voor de
// maatregelen die de bewoner aanvinkt (of, als er nog niets is aangevinkt, voor alle mogelijke).
// Bewust zonder links naar buiten of naar andere pagina's: de bewoner blijft in de scan. Bedragen en
// voorwaarden klappen hier zelf open. Lukt het ophalen niet, dan verschijnt er niets.

const EERST = 4;
const naamVan = (id: string) => MEASURES.find(m => m.id === id)?.label ?? id;

export function RegelingenInScan({ postcode, huisnummer, mogelijk, gekozen, toelichting }: { postcode: string; huisnummer: string; mogelijk: string[]; gekozen: string[]; toelichting?: string }) {
  const [uitkomst, setUitkomst] = useState<{ voor: string; data: SubsidieUitkomst } | null>(null);
  const [alles, setAlles] = useState(false);
  const sleutel = `${postcode}|${huisnummer}`;

  useEffect(() => {
    if (!postcode) return;
    let weg = false;
    zoekSubsidies(postcode, huisnummer)
      .then(data => { if (!weg) setUitkomst({ voor: sleutel, data }); })
      .catch(() => { /* geen regelingen tonen */ });
    return () => { weg = true; };
  }, [postcode, huisnummer, sleutel]);

  if (!uitkomst || uitkomst.voor !== sleutel || uitkomst.data.status !== "ok") return null;
  const { gemeente, regelingen } = uitkomst.data;
  const focus = gekozen.filter(id => mogelijk.includes(id));
  const ids = focus.length ? focus : mogelijk;
  const relevant = regelingen.filter(r => r.voor.some(v => ids.includes(v)));
  if (!relevant.length) return null;
  const lokaal = relevant.filter(r => r.niveau !== "landelijk").length;
  const getoond = alles ? relevant : relevant.slice(0, EERST);

  return (
    <div className="gijs-card gijs-card--tint !p-5 md:!p-6 flex flex-col gap-4 my-6">
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-semibold text-[var(--gijs-donkergroen)]">Subsidies en regelingen voor jouw adres</h4>
        <p className="text-zinc-700">
          {focus.length ? "Voor wat je hebt aangevinkt" : "Voor de maatregelen hierboven"} gelden in de gemeente {gemeente.naam} nu {relevant.length}{" "}
          {relevant.length === 1 ? "regeling" : "regelingen"}{lokaal ? `, waarvan ${lokaal} van je gemeente, regio of provincie` : ""}.
        </p>
        {toelichting && <p className="text-sm text-zinc-600">{toelichting}</p>}
      </div>
      <ul className="flex flex-col divide-y divide-[var(--border-subtle)] bg-white rounded-[var(--radius-card)] border border-[var(--border-subtle)]">
        {getoond.map(r => (
          <li key={r.id} className="flex flex-col gap-1.5 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={r.niveau === "landelijk" ? "neutral" : "accent"}>{NIVEAU_LABEL[r.niveau]}</Badge>
              <Badge tone={r.type === "subsidie" ? "success" : "outline"}>{TYPE_LABEL[r.type]}</Badge>
            </div>
            <p className="font-medium text-[var(--gijs-donkergroen)]">{r.titel}</p>
            <p className="text-sm text-zinc-600">Voor {r.voor.filter(v => ids.includes(v)).map(v => naamVan(v).toLowerCase()).join(", ")}</p>
            {(r.bedragen || r.voorwaarden) && (
              <details className="text-sm text-zinc-700">
                <summary className="cursor-pointer font-medium text-[var(--accent-700)] py-1">Bedragen en voorwaarden</summary>
                <div className="flex flex-col gap-3 pt-2">
                  {r.bedragen && <div><p className="font-medium text-zinc-800">Bedragen</p><Tekstblok tekst={r.bedragen} /></div>}
                  {r.voorwaarden && <div><p className="font-medium text-zinc-800">Voorwaarden</p><Tekstblok tekst={r.voorwaarden} /></div>}
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
      {relevant.length > EERST && (
        <button type="button" className="self-start text-sm font-semibold text-[var(--accent-700)] underline underline-offset-2" onClick={() => setAlles(a => !a)} aria-expanded={alles}>
          {alles ? "Toon minder" : `Toon alle ${relevant.length} regelingen`}
        </button>
      )}
      <p className="text-sm text-zinc-600">
        Tijdens de gratis energiescan aan huis kijkt Gijs welke regelingen echt bij jouw woning passen en helpt bij de aanvraag. Gijs kan toekenning
        niet garanderen. Bron: Milieu Centraal, Energiesubsidiewijzer.
      </p>
    </div>
  );
}
