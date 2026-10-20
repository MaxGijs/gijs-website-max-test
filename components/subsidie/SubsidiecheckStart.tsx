"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds/core/Button";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import { ADRES_SLEUTEL } from "./Subsidiecheck";

// Start van de subsidiecheck vanaf een andere pagina: postcode en huisnummer hier invullen, dan
// direct naar /subsidiecheck, die het adres uit sessionStorage overneemt en meteen de regelingen
// toont. Het adres gaat bewust niet via de URL.
const POSTCODE = /^[1-9][0-9]{3}[A-Z]{2}$/;

export function SubsidiecheckStart({ idPrefix = "sc-start" }: { idPrefix?: string }) {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [fout, setFout] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={e => {
        e.preventDefault();
        const pc = postcode.toUpperCase().replace(/\s+/g, "");
        const nr = huisnummer.trim();
        if (!POSTCODE.test(pc)) return setFout("Vul een geldige postcode in, bijvoorbeeld 7622 AA.");
        if (!/^[0-9]/.test(nr)) return setFout("Vul je huisnummer in.");
        try { sessionStorage.setItem(ADRES_SLEUTEL, JSON.stringify({ postcode: pc, huisnummer: nr })); } catch { /* opslag kan geblokkeerd zijn */ }
        router.push("/subsidiecheck");
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Postcode" htmlFor={`${idPrefix}-postcode`}>
          <Input id={`${idPrefix}-postcode`} autoComplete="postal-code" placeholder="1234 AB" maxLength={7} value={postcode}
            onChange={e => { setPostcode(e.target.value); setFout(null); }} required />
        </Field>
        <Field label="Huisnummer" htmlFor={`${idPrefix}-huisnummer`}>
          <Input id={`${idPrefix}-huisnummer`} inputMode="numeric" placeholder="12" maxLength={10} value={huisnummer}
            onChange={e => { setHuisnummer(e.target.value); setFout(null); }} required />
        </Field>
      </div>
      <Button type="submit" variant="accent" size="lg" iconRight="arrow-right" className="self-start">Doe de subsidiecheck</Button>
      {fout && <p className="gijs-error" role="alert">{fout}</p>}
      <p className="text-sm text-zinc-500">We zoeken alleen je gemeente op (via het Kadaster) en slaan je adres niet op.</p>
    </form>
  );
}
