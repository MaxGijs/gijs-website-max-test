"use client";

import { useId, useState } from "react";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import type { Antwoord } from "@/lib/scan-session";

const WONINGTYPE_VOLGORDE: HouseType[] = ["tussenwoning", "hoekwoning", "twee-onder-een-kap", "vrijstaand"];

/**
 * Toont het eerder gekozen woningtype ("Woningtype: Hoekwoning") met een
 * kleine, secundaire "Wijzigen". De vier opties verschijnen pas na die
 * klik: het woningtype wordt niet standaard opnieuw gevraagd.
 */
export function WoningtypeRegel({ houseType, onChange }: { houseType: HouseType; onChange: (type: HouseType) => void }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="my-4">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[17px]">
        <span>Woningtype: <strong className="text-[var(--gijs-donkergroen)]">{HOUSE_MODELS[houseType].label}</strong></span>
        <button type="button" className="min-h-11 font-semibold underline text-[var(--accent-700)]" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {open ? "Sluiten" : "Wijzigen"}
        </button>
      </p>
      {open && (
        <fieldset id={id} className="mt-3 border-0 p-0">
          <legend className="font-semibold mb-2">Kies het woningtype dat het meest op jouw woning lijkt</legend>
          <div className="grid grid-cols-2 gap-3 max-w-[460px]">
            {WONINGTYPE_VOLGORDE.map(type => (
              <button
                key={type}
                type="button"
                aria-pressed={houseType === type}
                onClick={() => { onChange(type); setOpen(false); }}
                className="min-h-14 rounded-[var(--radius-control)] border-2 px-4 py-3 text-left text-[16px] font-semibold border-[var(--border-default)] bg-white aria-pressed:border-[var(--gijs-donkergroen)] aria-pressed:bg-[var(--accent-050)]"
              >
                {houseType === type ? "✓ " : ""}{HOUSE_MODELS[type].label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

/**
 * Eén woningvraag met Ja / Nee / Ik weet het niet als grote keuzevlakken
 * (echte radioknoppen, dus ook met toetsenbord te bedienen).
 */
export function JaNeeVraag({ vraag, uitleg, waarde, onChange }: { vraag: string; uitleg?: string; waarde: Antwoord | null; onChange: (a: Antwoord) => void }) {
  const naam = useId();
  const opties: { waarde: Antwoord; label: string }[] = [
    { waarde: "ja", label: "Ja" },
    { waarde: "nee", label: "Nee" },
    { waarde: "onbekend", label: "Ik weet het niet" },
  ];
  return (
    <fieldset className="mt-7 border-0 p-0">
      <legend className="text-[19px] font-bold text-[var(--gijs-donkergroen)]">{vraag}</legend>
      {uitleg && <p className="mt-1 text-[16px] text-[var(--grey-800)]">{uitleg}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        {opties.map(optie => (
          <label key={optie.waarde} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border-2 border-[var(--border-default)] bg-white px-4 py-2 text-[16px] font-semibold has-[:checked]:border-[var(--gijs-donkergroen)] has-[:checked]:bg-[var(--accent-050)] has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--accent-600)]">
            <input type="radio" name={naam} className="h-5 w-5 accent-[var(--gijs-donkergroen)]" checked={waarde === optie.waarde} onChange={() => onChange(optie.waarde)} />
            {optie.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Compacte ja/nee/weet-ik-niet-vraag voor in een raster (echte radioknoppen). */
export function KeuzeRij({ vraag, uitleg, waarde, onChange }: { vraag: string; uitleg?: string; waarde: Antwoord | null; onChange: (a: Antwoord) => void }) {
  const naam = useId();
  const opties: { waarde: Antwoord; label: string }[] = [
    { waarde: "ja", label: "Ja" },
    { waarde: "nee", label: "Nee" },
    { waarde: "onbekend", label: "Weet ik niet" },
  ];
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="gijs-label">{vraag}</legend>
      {uitleg && <p className="mt-1 text-[13px] text-[var(--text-muted)]">{uitleg}</p>}
      <div className="mt-2 grid grid-cols-3 gap-1 rounded-[14px] bg-[var(--grey-050)] p-1">
        {opties.map(optie => (
          <label key={optie.waarde} className="flex min-h-11 cursor-pointer items-center justify-center rounded-[10px] px-2 text-center text-[14px] font-semibold text-[var(--gijs-donkergroen)] has-[:checked]:bg-white has-[:checked]:shadow-[var(--shadow-1)] has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--accent-600)]">
            <input type="radio" name={naam} className="sr-only" checked={waarde === optie.waarde} onChange={() => onChange(optie.waarde)} />
            {optie.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Compacte keuzerij met vrije opties (geen vaste Antwoord-waarden), voor
 * dingen die van buitenaf gewoon te zien zijn: dakkapel (aantal), garage en
 * aanbouw (ja/nee), en bij een hoekwoning aan welke kant de buurwoning
 * staat. Bij "namelijk" verschijnt een tekstveld zodra die optie gekozen is.
 */
export function OptieToggle({ vraag, uitleg, opties, waarde, onChange, namelijk, kop = false }: { vraag: string; uitleg?: string; opties: readonly string[]; waarde: string; onChange: (v: string) => void; namelijk?: { trigger: string; waarde: string; onChange: (v: string) => void; label?: string }; /** Vraag als donkergroene kop, zoals de beeldkeuzes (BeeldKeuze) eromheen. */ kop?: boolean }) {
  const naam = useId();
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={kop ? "p-0 text-[19px] font-bold tracking-[-0.01em] text-[var(--gijs-donkergroen)]" : "gijs-label"}>{vraag}</legend>
      {uitleg && <p className="mt-1 text-[13px] text-[var(--text-muted)]">{uitleg}</p>}
      <div className="mt-2 grid gap-1 rounded-[14px] bg-[var(--grey-050)] p-1" style={{ gridTemplateColumns: `repeat(${opties.length}, minmax(0,1fr))` }}>
        {opties.map(optie => (
          <label key={optie} className="flex min-h-11 cursor-pointer items-center justify-center rounded-[10px] px-2 text-center text-[14px] font-semibold text-[var(--gijs-donkergroen)] has-[:checked]:bg-white has-[:checked]:shadow-[var(--shadow-1)] has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--accent-600)]">
            <input type="radio" name={naam} className="sr-only" checked={waarde === optie} onChange={() => onChange(optie)} />
            {optie}
          </label>
        ))}
      </div>
      {namelijk && waarde === namelijk.trigger && (
        <label className="mt-2 flex flex-col gap-1 text-[13px] font-semibold text-[var(--gijs-donkergroen)]">
          <span>{namelijk.label ?? `${namelijk.trigger}, namelijk`}</span>
          <input className="gijs-input" maxLength={120} value={namelijk.waarde} onChange={e => namelijk.onChange(e.target.value)} autoFocus />
        </label>
      )}
    </fieldset>
  );
}

/**
 * Verplicht verbruiksveld met "Help me schatten": vult een voorstel in dat
 * de bewoner daarna nog kan aanpassen.
 */
export function VerbruikVeld({ id, label, eenheid, waarde, onChange, schatting, fout }: { id: string; label: string; eenheid: string; waarde: string; onChange: (v: string) => void; schatting: number | null; fout?: string }) {
  return (
    <div className="gijs-field-wrap">
      <label className="gijs-label" htmlFor={id}>{label}</label>
      <span className="gijs-input-group">
        <input id={id} className={`gijs-input pr-[92px] ${fout ? "gijs-input--invalid" : ""}`} inputMode="numeric" required aria-invalid={fout ? true : undefined} aria-describedby={fout ? `${id}-fout` : undefined} value={waarde} onChange={e => onChange(e.target.value)} />
        <span className="gijs-input-group__suffix">{eenheid}</span>
      </span>
      {fout && <span id={`${id}-fout`} className="gijs-error">{fout}</span>}
      {schatting !== null && (
        <button type="button" className="self-start min-h-11 text-[15px] font-semibold text-[var(--accent-700)] underline" onClick={() => onChange(String(schatting))}>
          Help me schatten
        </button>
      )}
    </div>
  );
}
