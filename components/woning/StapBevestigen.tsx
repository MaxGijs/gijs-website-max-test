"use client";

import { useEffect, useRef, useState } from "react";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import { Button } from "@/components/ds/core/Button";
import { Alert } from "@/components/ds/feedback/Alert";
import { zoekAdres, type AdresZoekResultaat } from "@/lib/pdok/adresZoeken";
import { haalBagGegevensOp, type BagGegevens } from "@/lib/bag/adresUitgebreid";
import { haalEnergielabelOp, type EnergielabelResultaat } from "@/lib/ep-online/energielabel";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import { Woningbeeld } from "./Woningbeeld";
import { WoningtypeRegel } from "./ScanVragen";

// Stap 1 "Jouw woning": postcode + huisnummer → adres opzoeken (PDOK, echte
// data) → locatiebeeld → bewoner controleert adres en woning → "Ja, dit
// klopt". Daarmee is de woningbevestiging afgerond; stap 2 vraagt dit niet
// opnieuw. Het akkoord met de algemene voorwaarden stond hier dubbel (ook
// op de landingspagina) en is op beide plekken weggehaald; privacy,
// voorwaarden en Cyclomedia-gebruik worden later juridisch beoordeeld.
export function StapBevestigen({
  postcode,
  huisnummer,
  houseType,
  woningtypeBron,
  onHouseTypeChange,
  onAutoHouseType,
  onAdresSubmit,
  onBevestig,
}: {
  postcode: string;
  huisnummer: string;
  houseType: HouseType;
  woningtypeBron: "" | "automatisch" | "handmatig";
  onHouseTypeChange: (type: HouseType) => void;
  /** Voor een automatisch (EP-Online) bepaald woningtype: overschrijft nooit een al handmatige keuze van de bewoner. */
  onAutoHouseType: (type: HouseType) => void;
  onAdresSubmit: (postcode: string, huisnummer: string) => void;
  onBevestig: (addressLabel: string, manual?: boolean, bag?: BagGegevens | null, epOnline?: EnergielabelResultaat | null) => void;
}) {
  const [pc, setPc] = useState(postcode);
  const [hn, setHn] = useState(huisnummer);
  const [manual, setManual] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [bewerken, setBewerken] = useState(postcode.trim() === "" || huisnummer.trim() === "");
  // null = nog geen resultaat voor de huidige postcode/huisnummer ("bezig met opzoeken").
  const [resultaat, setResultaat] = useState<AdresZoekResultaat | null>(null);
  // Bonus-verrijking via de BAG (bouwjaar/woonoppervlakte); blijft null zolang er geen sleutel/koppeling is.
  const [bag, setBag] = useState<BagGegevens | null>(null);
  // Bonus-verrijking via EP-Online (energielabel, en waar betrouwbaar het woningtype); blijft null zonder sleutel/registratie.
  const [epOnline, setEpOnline] = useState<EnergielabelResultaat | null>(null);
  // Voorkomt een "stale closure" in de (async) EP-Online-callback hieronder, zonder dat
  // woningtypeBron/onAutoHouseType de opzoek-effect hieronder bij elke render laat herhalen.
  const woningtypeBronRef = useRef(woningtypeBron);
  useEffect(() => { woningtypeBronRef.current = woningtypeBron; }, [woningtypeBron]);
  const onAutoHouseTypeRef = useRef(onAutoHouseType);
  useEffect(() => { onAutoHouseTypeRef.current = onAutoHouseType; }, [onAutoHouseType]);

  useEffect(() => {
    if (bewerken || manual) return;
    if (!postcode.trim() || !huisnummer.trim()) return;
    let actief = true;
    zoekAdres(postcode, huisnummer).then((res) => {
      if (!actief) return;
      setResultaat(res);
      setBag(null);
      setEpOnline(null);
      if (res.status === "gevonden" && res.adres.nummeraanduidingId) {
        haalBagGegevensOp(res.adres.nummeraanduidingId, houseType).then((data) => { if (actief) setBag(data); });
      }
      if (res.status === "gevonden" && res.adres.adresseerbaarObjectId) {
        haalEnergielabelOp(res.adres.adresseerbaarObjectId).then((data) => {
          if (!actief || !data) return;
          setEpOnline(data);
          if (data.houseType && woningtypeBronRef.current !== "handmatig") onAutoHouseTypeRef.current(data.houseType);
        });
      }
    });
    return () => { actief = false; };
  }, [postcode, huisnummer, bewerken, manual, houseType]);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResultaat(null);
    setBewerken(false);
    onAdresSubmit(pc, hn);
  }

  const handmatigKnop = (
    <button type="button" className="text-left underline font-semibold py-3 min-h-11" onClick={() => setManual(true)}>
      Adres zelf invullen en doorgaan
    </button>
  );

  const adresFormulier = (knop: string) => (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Field label="Postcode" className="flex-1">
          <Input aria-label="Postcode" required value={pc} autoComplete="postal-code" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPc(e.target.value)} placeholder="1234 AB" />
        </Field>
        <Field label="Huisnummer" className="w-32">
          <Input aria-label="Huisnummer" required value={hn} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHn(e.target.value)} placeholder="12" />
        </Field>
      </div>
      <Button type="submit" variant="accent" size="lg" iconRight="arrow-right">{knop}</Button>
    </form>
  );

  if (manual) {
    return (
      <section className="grid gap-4">
        <h3 className="text-2xl font-bold">Vul je adres zelf in</h3>
        <p>Je kunt gewoon verder. Gijs controleert dit adres later met je.</p>
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); onAdresSubmit(pc, hn); onBevestig(street + " " + hn + ", " + pc + " " + city, true); }}>
          <Field label="Straat"><Input aria-label="Straat" required value={street} onChange={e => setStreet(e.target.value)} /></Field>
          <Field label="Huisnummer"><Input aria-label="Huisnummer" required value={hn} onChange={e => setHn(e.target.value)} /></Field>
          <Field label="Postcode"><Input aria-label="Postcode" required value={pc} onChange={e => setPc(e.target.value)} /></Field>
          <Field label="Woonplaats"><Input aria-label="Woonplaats" required value={city} onChange={e => setCity(e.target.value)} /></Field>
          <WoningtypeRegel houseType={houseType} onChange={onHouseTypeChange} />
          <Button type="submit" variant="accent" size="lg" iconRight="arrow-right">Ja, verder met dit adres</Button>
          <button type="button" className="underline text-left min-h-11" onClick={() => { setManual(false); setBewerken(true); }}>Adres alsnog opzoeken</button>
        </form>
      </section>
    );
  }

  if (bewerken) {
    return (
      <section className="w-full flex flex-col gap-4">
        <h3 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is je adres?</h3>
        <p className="text-[17px]">Vul je postcode en huisnummer in. Gijs zoekt je adres op.</p>
        {adresFormulier("Zoek mijn woning")}
        {handmatigKnop}
      </section>
    );
  }

  if (resultaat === null) {
    return (
      <section className="w-full flex flex-col items-center gap-3 text-center" role="status">
        <p className="text-[17px]">Je adres wordt opgezocht…</p>
        {handmatigKnop}
      </section>
    );
  }

  if (resultaat.status !== "gevonden") {
    const melding = resultaat.status === "ongeldige-invoer"
      ? resultaat.melding
      : resultaat.status === "niet-gevonden"
        ? "Dit adres kon niet gevonden worden. Controleer de postcode en het huisnummer."
        : "Het adres kan op dit moment niet worden opgezocht. Probeer het zo opnieuw.";
    return (
      <section className="w-full flex flex-col gap-4">
        <h3 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat is je adres?</h3>
        <Alert tone="error">{melding}</Alert>
        {adresFormulier("Opnieuw zoeken")}
        {handmatigKnop}
      </section>
    );
  }

  const { adres } = resultaat;
  const label = `${adres.straatEnHuisnummer}, ${adres.postcode} ${adres.woonplaats}`;
  return (
    <section className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col gap-4">
        <p className="text-[17px] font-semibold text-[var(--accent-700)]">Gevonden!</p>
        <h3 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Is dit jouw woning?</h3>
        <div className="gijs-card gijs-card--muted flex flex-col gap-1">
          <span className="font-semibold text-[18px] text-[var(--gijs-donkergroen)]">{adres.straatEnHuisnummer}</span>
          <span>{adres.postcode} {adres.woonplaats}</span>
        </div>
        {(bag || epOnline) && (
          <div className="gijs-card gijs-card--muted flex flex-col gap-2">
            <span className="font-semibold text-[15px] text-[var(--gijs-donkergroen)]">Woninggegevens opgehaald</span>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[15px]">
              <dt className="text-[var(--grey-600,#5b6560)]">Type woning</dt><dd>{HOUSE_MODELS[houseType].label}</dd>
              {bag?.bouwjaar && <><dt className="text-[var(--grey-600,#5b6560)]">Bouwjaar</dt><dd>{bag.bouwjaar}</dd></>}
              {bag?.woonoppervlakte && <><dt className="text-[var(--grey-600,#5b6560)]">Woonoppervlakte</dt><dd>{bag.woonoppervlakte} m²</dd></>}
              {epOnline && <><dt className="text-[var(--grey-600,#5b6560)]">Energielabel</dt><dd>{epOnline.energieklasse ?? "Niet gevonden"}</dd></>}
            </dl>
          </div>
        )}
        <WoningtypeRegel houseType={houseType} onChange={onHouseTypeChange} />
        {woningtypeBron === "automatisch" && (
          <p className="text-[14px] text-[var(--grey-600,#5b6560)] -mt-2">Automatisch bepaald op basis van beschikbare woninggegevens. Klopt dit niet? Kies het juiste woningtype.</p>
        )}
        <div className="flex flex-col items-start gap-2">
          <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => onBevestig(label, false, bag, epOnline)}>Ja, dit klopt</Button>
          <button type="button" className="underline font-semibold min-h-11" onClick={() => setBewerken(true)}>Nee, adres aanpassen</button>
        </div>
      </div>
      <Woningbeeld adresLabel={label} />
    </section>
  );
}
