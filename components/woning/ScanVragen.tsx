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
