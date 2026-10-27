"use client";
import { useRef, useState } from "react";
import { ontgrendelWoningplan } from "@/lib/woningdossier-opslag";
import { track, logError } from "@/lib/analytics";
import { geldigTelefoonnummer } from "@/lib/telefoon";
import { Button } from "@/components/ds/core/Button";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import styles from "./WoningFlow.module.css";

// Zelfde patroon als EMAIL in lib/opslag-hulp.ts: dat bestand is "server-only" en kan dus niet
// rechtstreeks in deze client-component worden geïmporteerd.
const EMAIL_PATROON = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ONTGRENDEL_FOUT = "Kon niet worden opgeslagen. Probeer het opnieuw of bel Gijs.";

// De gate voor het uitgebreide woningplan: e-mailadres verplicht, telefoonnummer optioneel —
// geen energiescan-aanvraag. Ontgrendelt de subsidieregelingen (RegelingenInScan) in WoningFlow;
// het bestaande, zwaardere aanvraagformulier daaronder blijft ongewijzigd en krijgt dit
// e-mailadres (en telefoonnummer, indien ingevuld) straks voorgevuld (via scan.email/telefoon,
// zie onOntgrendeld hieronder en WoningFlow.tsx).
export function WoningplanGate({ sessieJson, onOntgrendeld }: { sessieJson: () => string; onOntgrendeld: (email: string, telefoon: string) => void }) {
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<{ email?: string; telefoon?: string }>({});
  const honeypotRef = useRef<HTMLInputElement>(null);
  const fieldId = "woningplan-gate-email";

  async function versturen(e: React.FormEvent) {
    e.preventDefault();
    const emailWaarde = email.trim();
    const telefoonWaarde = telefoon.trim();
    const nieuweFouten: { email?: string; telefoon?: string } = {};
    if (!EMAIL_PATROON.test(emailWaarde)) nieuweFouten.email = "Vul een geldig e-mailadres in.";
    if (telefoonWaarde && !geldigTelefoonnummer(telefoonWaarde)) nieuweFouten.telefoon = "Vul een geldig telefoonnummer in, bijvoorbeeld 06 12345678.";
    if (Object.keys(nieuweFouten).length) { setFout(nieuweFouten); return; }
    setBezig(true);
    setFout({});
    const { ontgrendeld, fout: serverFout } = await ontgrendelWoningplan(sessieJson(), emailWaarde, telefoonWaarde, honeypotRef.current?.value)
      .catch((error) => { logError("woningplan_ontgrendeling", error); return { ontgrendeld: false, fout: ONTGRENDEL_FOUT }; });
    setBezig(false);
    if (ontgrendeld) {
      track({ name: "woningplan_uitgebreid_ontgrendeld" });
      track({ name: "lead_created", source: "woningscan_email" });
      onOntgrendeld(emailWaarde, telefoonWaarde);
      return;
    }
    setFout({ email: serverFout ?? ONTGRENDEL_FOUT });
  }

  return (
    <section className={styles.gate}>
      <h3 className={styles.planTitel}>Welke subsidies gelden er voor jouw plan?</h3>
      <p className={styles.uitleg}>
        Je hebt gezien welke maatregelen bij je woning passen. Laat je e-mailadres achter en bekijk direct welke subsidies en regelingen
        voor jouw gemeente en jouw gekozen maatregelen gelden, met de actuele bedragen en voorwaarden.
      </p>
      <form onSubmit={versturen} noValidate data-clarity-mask="True" data-cs-mask="">
        {/* Honeypot: zelfde patroon als het aanvraagformulier verderop in WoningFlow.tsx. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor={`${fieldId}-website`}>Website</label>
          <input ref={honeypotRef} id={`${fieldId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className={styles.aanvraagVelden}>
          <Field label="E-mailadres" htmlFor={fieldId} error={fout.email}>
            <Input id={fieldId} type="email" autoComplete="email" maxLength={254} aria-required="true" invalid={!!fout.email}
              value={email} onChange={e => { setEmail(e.target.value); setFout(f => ({ ...f, email: undefined })); }} />
          </Field>
          <Field label="Telefoonnummer" htmlFor={`${fieldId}-telefoon`} optional error={fout.telefoon}>
            <Input id={`${fieldId}-telefoon`} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} invalid={!!fout.telefoon}
              value={telefoon} onChange={e => { setTelefoon(e.target.value); setFout(f => ({ ...f, telefoon: undefined })); }} />
          </Field>
        </div>
        <Button type="submit" variant="primary" size="lg" loading={bezig} disabled={bezig}>{bezig ? "Bezig…" : "Bekijk mijn subsidieoverzicht"}</Button>
        <p className={styles.kleineNoot}>
          Dit is geen aanvraag voor een energiescan. Gijs gebruikt je gegevens om je dit overzicht te tonen en kan contact met je opnemen
          over de mogelijkheden voor jouw woning — telefonisch als je een nummer invult, anders per e-mail. Lees hoe we met je gegevens omgaan
          in onze <a href="/avg-verklaring" target="_blank" rel="noopener noreferrer" className="underline">privacyverklaring</a>.
        </p>
      </form>
    </section>
  );
}
