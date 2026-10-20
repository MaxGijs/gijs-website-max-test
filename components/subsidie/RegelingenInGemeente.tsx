import Link from "next/link";
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
}: {
  gemeente: string;
  officieleUrl?: string;
  relatie?: string;
  /** "geen": de pagina heeft al een eigen subsidieblok, dan niets tonen als de regelingen niet op te halen zijn. */
  terugval?: "standaard" | "geen";
}) {
  const g = await gemeenteVoorNaam(gemeente);
  const lijst = g ? await regelingenVoorGemeente(g) : null;
  if (!g || !lijst) return terugval === "geen" ? null : <GemeentelijkeSubsidies gemeente={gemeente} officieleUrl={officieleUrl} relatie={relatie} />;

  const lokaal = lijst.filter(r => r.niveau !== "landelijk");
  const landelijk = lijst.filter(r => r.niveau === "landelijk");
  return (
    <section id="gemeentelijke-subsidies" className="scroll-mt-40 mb-14">
      <h2 className={H2 + " mb-2"}>Subsidies en regelingen in {g.naam}</h2>
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
          {lokaal.map(r => <RegelingKaart key={r.id} r={r} />)}
        </div>
      )}
      <div className="max-w-2xl flex flex-col gap-3 text-zinc-600">
        <p>
          Wil je alles zien wat voor jouw adres geldt, ook de landelijke regelingen? Gebruik de{" "}
          <Link href="/subsidiecheck" className={LINK}>subsidiecheck</Link>. Gijs helpt je graag bij de aanvraag, maar kan toekenning niet garanderen.
        </p>
        {officieleUrl && (
          <p>
            Meer informatie vind je ook bij de{" "}
            <a href={officieleUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              gemeente {g.naam}<span className="sr-only"> (opent in nieuw tabblad)</span>
            </a>.
          </p>
        )}
        <p className="text-sm text-zinc-500">
          Bron:{" "}
          <a href={BRON_MILIEU_CENTRAAL.url} target="_blank" rel="noopener noreferrer" className="underline">{BRON_MILIEU_CENTRAAL.naam}</a>, dagelijks ververst. Regelingen veranderen regelmatig; lees altijd de actuele voorwaarden bij de aanbieder.
        </p>
      </div>
    </section>
  );
}
