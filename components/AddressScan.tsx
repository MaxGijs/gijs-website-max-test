"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds/core/Button";
import { Checkbox } from "@/components/ds/forms/Checkbox";
import { useWoningDraft } from "@/components/woning/WoningDraftProvider";

// Werkende prototypeflow achter de hero-CTA: er is nog geen echte
// BAG/PDOK-koppeling voor woningkenmerken, dus dit stuurt alleen de
// ingevulde postcode/huisnummer door naar de woningflow, die met
// voorbeeldgegevens werkt (zie lib/woningdossier.ts).
//
// Hernoemd van WoningScan naar AddressScan op verzoek van Max
// (techniek-sectie van de opdracht, voorgestelde componentnaam) en
// knoptekst gewijzigd van "Doe nu de scan" naar "Start met mijn woning"
// (hero-sectie van de opdracht). Het oude, ongebruikte
// components/WoningScan.tsx is inmiddels opgeruimd.
export default function AddressScan({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const router = useRouter();
  const id = useId();
  const { draft, setDraft } = useWoningDraft();
  const { postcode, huisnummer, akkoordVoorwaarden } = draft;
  // Rustige, niet-blokkerende statustekst i.p.v. een harde alert wanneer
  // iemand toch op "Start met mijn woning" klikt zonder akkoord (de knop
  // is al disabled, maar een druk op Enter kan het formulier alsnog
  // proberen te verzenden — zie opdracht item 3).
  const [foutmelding, setFoutmelding] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postcode.trim() || !huisnummer.trim()) return;
    if (!akkoordVoorwaarden) { setFoutmelding("Vink eerst aan dat je akkoord gaat, dan kun je verder."); return; }
    setFoutmelding("");
    const params = new URLSearchParams({
      postcode: postcode.trim(),
      huisnummer: huisnummer.trim(),
    });
    onNavigate?.();
    router.push(`/woning?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(100px,.5fr)] gap-3">
        <label htmlFor={`${id}-postcode`} className="flex flex-col gap-2 text-sm font-semibold">Postcode
        <input
          id={`${id}-postcode`}
          type="text"
          placeholder="1234 AB"
          autoComplete="postal-code"
          aria-label="Postcode"
          required
          value={postcode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(current => ({ ...current, postcode: e.target.value }))}
          className="gijs-input w-full min-w-0"
        />
        </label>
        <label htmlFor={`${id}-nummer`} className="flex flex-col gap-2 text-sm font-semibold">Huisnummer
        <input
          id={`${id}-nummer`}
          type="text"
          placeholder="12"
          aria-label="Huisnummer"
          required
          value={huisnummer}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(current => ({ ...current, huisnummer: e.target.value }))}
          className="gijs-input w-full min-w-0"
        />
        </label>
      </div>
      {/*
        Prototype-placeholder: /algemene-voorwaarden bevat nog geen
        definitieve juridische tekst (zie die pagina zelf — "wordt
        gepubliceerd zodra de definitieve tekst is vastgesteld"). Dit
        akkoord is dus al wel technisch verplicht vóór de start van de
        scan, maar moet naar de echte voorwaardentekst/-link wijzen zodra
        die er is. Dezelfde tekst/link als in StapBevestigen.tsx, bewust
        niet opnieuw verzonnen.
      */}
      <Checkbox
        required
        checked={akkoordVoorwaarden}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDraft(current => ({ ...current, akkoordVoorwaarden: e.target.checked })); if (e.target.checked) setFoutmelding(""); }}
        label={<>Ik ga akkoord met de <a className="underline" href="/algemene-voorwaarden" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>algemene voorwaarden</a></>}
      />
      {foutmelding && <p role="status" className="text-sm text-[var(--status-error)]">{foutmelding}</p>}
      <Button type="submit" variant="accent" size="lg" fullWidth iconRight="arrow-right" disabled={!akkoordVoorwaarden}>
        Start de woningscan
      </Button>
    </form>
  );
}
