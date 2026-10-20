import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ds/core/Button";
import { GemeentelijkeSubsidies, H2 } from "@/components/regio/RegioBlokken";
import { gemeenteVoorNaam, regelingenVoorGemeente } from "@/lib/milieu-centraal/regelingen";
import { BRON_MILIEU_CENTRAAL } from "@/lib/milieu-centraal/types";
import { RegelingKaart } from "./RegelingKaart";

// De actuele regelingen van een gemeente op de regiopagina's, uit de Energiesubsidiewijzer van
// Milieu Centraal (dagelijks ververst). Lukt dat niet (geen sleutel, storing), dan het bestaande
// blok met de verwijzing naar de gemeente zelf.

const LINK = "underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]";

export async function RegelingenInGemeente({
  gemeente,
  officieleUrl,
  relatie,
  terugval = "standaard",
  terugvalInhoud,
  toonKop = true,
}: {
  gemeente: string;
  officieleUrl?: string;
  relatie?: string;
  /** "geen": de pagina heeft al een eigen subsidieblok, dan niets tonen als de regelingen niet op te halen zijn. */
  terugval?: "standaard" | "geen";
  /** Eigen subsidieblok van de pagina, alleen getoond als de regelingen niet op te halen zijn. */
  terugvalInhoud?: ReactNode;
  /** false: de pagina zet zelf een kop boven de regelingen. */
  toonKop?: boolean;
}) {
  const g = await gemeenteVoorNaam(gemeente);
  const lijst = g ? await regelingenVoorGemeente(g) : null;
  if (!g || !lijst) {
    if (terugvalInhoud !== undefined) return terugvalInhoud;
    return terugval === "geen" ? null : <GemeentelijkeSubsidies gemeente={gemeente} officieleUrl={officieleUrl} relatie={relatie} />;
  }

  const lokaal = lijst.filter(r => r.niveau !== "landelijk");
  const landelijk = lijst.filter(r => r.niveau === "landelijk");
  return (
    <section id="gemeentelijke-subsidies" className="scroll-mt-40 mb-14">
      {toonKop && <h2 className={H2 + " mb-2"}>Subsidies en regelingen in {g.naam}</h2>}
      <div className="max-w-2xl flex flex-col gap-3 text-zinc-600 mb-6">
        {relatie && <p className="text-zinc-700 font-medium">{relatie}</p>}
        <p>
          {lokaal.length
            ? `Dit zijn de regelingen van de gemeente ${g.naam}, de regio en de provincie ${g.provincie || ""} die nu in de Energiesubsidiewijzer van Milieu Centraal staan.`
            : `Op dit moment staan er geen regelingen van de gemeente ${g.naam}, de regio of de provincie in de Energiesubsidiewijzer van Milieu Centraal.`}{" "}
          Daarnaast {landelijk.length === 1 ? "geldt 1 landelijke regeling" : `gelden ${landelijk.length} landelijke regelingen`}, zoals de ISDE.
        </p>
      </div>
      {lokaal.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 mb-6">
          {lokaal.map(r => (
            <RegelingKaart
              key={r.id}
              r={r}
              actie={
                <Button href={r.voor.length === 1 ? `/woning?maatregel=${r.voor[0]}` : "/woning"} size="sm" variant="primary" iconRight="arrow-right">
                  Start de woningscan
                </Button>
              }
            />
          ))}
        </div>
      )}
      <div className="gijs-card gijs-card--tint !p-6 flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1 flex flex-col gap-1">
          <p className="font-semibold text-[var(--gijs-donkergroen)]">Wat betekent dit voor jouw woning?</p>
          <p className="text-zinc-700">
            Doe de gratis woningscan. Tijdens de energiescan aan huis zoekt Gijs uit welke subsidies je kunt krijgen en helpt bij de aanvraag. Gijs kan
            toekenning niet garanderen.
          </p>
        </div>
        <Button href="/woning" variant="primary" iconRight="arrow-right">Start de woningscan</Button>
      </div>
      <div className="max-w-2xl flex flex-col gap-3 text-zinc-600">
        <p>
          Alles zien wat voor jouw adres geldt, ook de landelijke regelingen? Gebruik de <Link href="/subsidiecheck" className={LINK}>subsidiecheck</Link>.
        </p>
        <p className="text-sm text-zinc-500">
          Bron:{" "}
          <a href={BRON_MILIEU_CENTRAAL.url} target="_blank" rel="noopener noreferrer" className="underline">{BRON_MILIEU_CENTRAAL.naam}</a>, dagelijks ververst. Regelingen veranderen regelmatig; lees altijd de actuele voorwaarden bij de aanbieder.
        </p>
      </div>
    </section>
  );
}
