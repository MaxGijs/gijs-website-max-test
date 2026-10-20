"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { zoekSubsidies } from "@/app/subsidiecheck/actions";
import { Alert } from "@/components/ds/feedback/Alert";
import { Button } from "@/components/ds/core/Button";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import { Tag } from "@/components/ds/core/Tag";
import { MEASURES } from "@/lib/measures";
import { SCAN_KEY } from "@/lib/scan-session";
import { BRON_MILIEU_CENTRAAL, TYPE_LABEL, type Doelgroep, type Niveau, type RegelingType, type SubsidieUitkomst } from "@/lib/milieu-centraal/types";
import { RegelingKaart } from "./RegelingKaart";

// De subsidiecheck: postcode (en huisnummer) in, alle regelingen van de Energiesubsidiewijzer van
// Milieu Centraal eruit. Gemeente, regio, provincie en Rijk; subsidies, leningen en overige regelingen.

const NIVEAUS: Niveau[] = ["gemeentelijk", "regionaal", "provinciaal", "landelijk"];
const KOPPEN: Record<Niveau, string> = {
  gemeentelijk: "Van je gemeente",
  regionaal: "In je regio",
  provinciaal: "Van je provincie",
  landelijk: "Landelijk",
};
const TYPES: RegelingType[] = ["subsidie", "lening", "overig"];
export const ADRES_SLEUTEL = "gijs-subsidiecheck-adres";

export function Subsidiecheck() {
  const [postcode, setPostcode] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [doelgroep, setDoelgroep] = useState<Doelgroep>("eigenaar");
  const [uitkomst, setUitkomst] = useState<SubsidieUitkomst | null>(null);
  const [maatregel, setMaatregel] = useState<string | null>(null);
  const [type, setType] = useState<RegelingType | null>(null);
  const [bezig, start] = useTransition();

  const zoek = (pc = postcode, nr = huisnummer, dg = doelgroep) =>
    start(async () => {
      const r = await zoekSubsidies(pc, nr, dg);
      setUitkomst(r);
      setMaatregel(null);
      setType(null);
      if (r.status === "ok") {
        try { sessionStorage.setItem(ADRES_SLEUTEL, JSON.stringify({ postcode: pc, huisnummer: nr })); } catch { /* opslag kan geblokkeerd zijn */ }
      }
    });

  // Adres uit de woningscan of een eerdere check overnemen (sessionStorage, nooit via de URL).
  useEffect(() => {
    let bewaard: { postcode?: unknown; huisnummer?: unknown } | null = null;
    try {
      bewaard = JSON.parse(sessionStorage.getItem(ADRES_SLEUTEL) ?? "null") ?? JSON.parse(sessionStorage.getItem(SCAN_KEY) ?? "null");
    } catch { /* opslag kan geblokkeerd zijn */ }
    if (typeof bewaard?.postcode !== "string" || typeof (bewaard.huisnummer ?? "") !== "string") bewaard = null;
    const pc = typeof bewaard?.postcode === "string" ? bewaard.postcode : "";
    const nr = typeof bewaard?.huisnummer === "string" ? bewaard.huisnummer : "";
    if (pc) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- eenmalig herstellen na hydratatie (sessionStorage bestaat pas in de browser)
      setPostcode(pc);
      setHuisnummer(nr);
      zoek(pc, nr, "eigenaar");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- alleen bij de eerste keer laden
  }, []);

  const regelingen = useMemo(() => (uitkomst?.status === "ok" ? uitkomst.regelingen : []), [uitkomst]);
  const zichtbaar = regelingen.filter(r => (!maatregel || r.voor.includes(maatregel)) && (!type || r.type === type));
  const perMaatregel = MEASURES.map(m => ({ m, n: regelingen.filter(r => r.voor.includes(m.id)).length })).filter(x => x.n > 0);
  const lokaal = regelingen.filter(r => r.niveau !== "landelijk").length;

  return (
    <div className="flex flex-col gap-10">
      <form
        className="gijs-card !p-6 md:!p-8 flex flex-col gap-5"
        onSubmit={e => {
          e.preventDefault();
          zoek();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Postcode" htmlFor="sc-postcode">
            <Input id="sc-postcode" autoComplete="postal-code" placeholder="1234 AB" maxLength={7} value={postcode} onChange={e => setPostcode(e.target.value)} required />
          </Field>
          <Field label="Huisnummer" htmlFor="sc-huisnummer" optional>
            <Input id="sc-huisnummer" inputMode="numeric" placeholder="12" maxLength={10} value={huisnummer} onChange={e => setHuisnummer(e.target.value)} />
          </Field>
          <Button type="submit" loading={bezig} iconRight="arrow-right">Bekijk regelingen</Button>
        </div>
        <fieldset className="flex flex-wrap items-center gap-2 border-0 p-0 m-0">
          <legend className="sr-only">Voor wie</legend>
          <span className="text-sm text-zinc-600 mr-1">Ik zoek regelingen voor:</span>
          <Tag selectable selected={doelgroep === "eigenaar"} onClick={() => { setDoelgroep("eigenaar"); if (uitkomst?.status === "ok") zoek(postcode, huisnummer, "eigenaar"); }}>Mijn eigen woning</Tag>
          <Tag selectable selected={doelgroep === "vve"} onClick={() => { setDoelgroep("vve"); if (uitkomst?.status === "ok") zoek(postcode, huisnummer, "vve"); }}>Appartement met VvE</Tag>
        </fieldset>
        <p className="text-sm text-zinc-500">
          We zoeken alleen je gemeente op (via het Kadaster) en slaan je adres niet op.
        </p>
      </form>

      {uitkomst?.status === "ongeldig" && <Alert tone="warning">{uitkomst.melding}</Alert>}
      {uitkomst?.status === "niet-gevonden" && <Alert tone="warning">We konden deze postcode niet vinden. Controleer of je hem goed hebt ingevuld.</Alert>}
      {uitkomst?.status === "storing" && (
        <Alert tone="error" title="De regelingen konden nu niet worden opgehaald">
          Probeer het later nog eens, of <Link className="underline" href="/contact">neem contact op met Gijs</Link>: wij zoeken het graag voor je uit.
        </Alert>
      )}

      {uitkomst?.status === "ok" && (
        <section aria-live="polite" className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--gijs-donkergroen)]">
              {regelingen.length} {regelingen.length === 1 ? "regeling" : "regelingen"} voor {uitkomst.adres ?? `postcode ${postcode.toUpperCase()}`}
            </h2>
            <p className="text-zinc-600">
              Gemeente {uitkomst.gemeente.naam}{uitkomst.gemeente.provincie ? `, provincie ${uitkomst.gemeente.provincie}` : ""}.{" "}
              {lokaal > 0 ? `Waarvan ${lokaal} van je gemeente, regio of provincie.` : "Er staan nu geen regelingen van je gemeente, regio of provincie in de Energiesubsidiewijzer."}
            </p>
          </div>

          {regelingen.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter op maatregel">
                <Tag selectable selected={!maatregel} onClick={() => setMaatregel(null)}>Alle maatregelen</Tag>
                {perMaatregel.map(({ m, n }) => (
                  <Tag key={m.id} selectable selected={maatregel === m.id} onClick={() => setMaatregel(maatregel === m.id ? null : m.id)}>
                    {m.label} ({n})
                  </Tag>
                ))}
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter op soort regeling">
                <Tag selectable selected={!type} onClick={() => setType(null)}>Alle soorten</Tag>
                {TYPES.filter(t => regelingen.some(r => r.type === t)).map(t => (
                  <Tag key={t} selectable selected={type === t} onClick={() => setType(type === t ? null : t)}>
                    {TYPE_LABEL[t]} ({regelingen.filter(r => r.type === t).length})
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {NIVEAUS.map(niveau => {
            const lijst = zichtbaar.filter(r => r.niveau === niveau);
            if (!lijst.length) return null;
            return (
              <div key={niveau} className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-[var(--gijs-donkergroen)]">
                  {KOPPEN[niveau]} <span className="font-normal text-zinc-500">({lijst.length})</span>
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  {lijst.map(r => <RegelingKaart key={r.id} r={r} />)}
                </div>
              </div>
            );
          })}
          {regelingen.length > 0 && !zichtbaar.length && <p className="text-zinc-600">Geen regelingen met deze filters.</p>}

          <div className="gijs-card gijs-card--tint !p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-semibold text-[var(--gijs-donkergroen)]">Hulp nodig bij je aanvraag?</p>
              <p className="text-zinc-700">
                Tijdens de gratis energiescan aan huis kijken we welke regelingen echt bij jouw woning passen. Gijs helpt bij de aanvraag, maar kan toekenning niet garanderen.
              </p>
            </div>
            <Button href="/woning" variant="primary" iconRight="arrow-right">Start de woningscan</Button>
          </div>

          <p className="text-sm text-zinc-500">
            Bron:{" "}
            <a className="underline" href={BRON_MILIEU_CENTRAAL.url} target="_blank" rel="noopener noreferrer">{BRON_MILIEU_CENTRAAL.naam}</a>. De gegevens worden dagelijks ververst. Regelingen veranderen regelmatig en kunnen op zijn; lees altijd de actuele voorwaarden bij de aanbieder.{" "}
            Een regeling van de gemeente of regio kan alleen voor bepaalde wijken of postcodes gelden.
          </p>
        </section>
      )}
    </div>
  );
}
