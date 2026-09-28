"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds/core/Button";
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
  const { postcode, huisnummer, houseType } = draft;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postcode.trim() || !huisnummer.trim()) return;
    // Het gekozen woningtype gaat mee, zodat de scan het niet opnieuw vraagt.
    const params = new URLSearchParams({
      postcode: postcode.trim(),
      huisnummer: huisnummer.trim(),
      woningtype: houseType,
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
      {/* Het akkoord met de algemene voorwaarden stond hier én in stap 1 van de
          scan (dubbel). Beide zijn weggehaald; privacy, voorwaarden en
          Cyclomedia-gebruik worden later juridisch beoordeeld. */}
      <Button type="submit" variant="accent" size="lg" fullWidth iconRight="arrow-right">
        Start de woningscan
      </Button>
    </form>
  );
}
