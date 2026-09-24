"use client";

import { useEffect, useState } from "react";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import { Checkbox } from "@/components/ds/forms/Checkbox";
import { Button } from "@/components/ds/core/Button";
import { Badge } from "@/components/ds/core/Badge";
import { Alert } from "@/components/ds/feedback/Alert";
import { Icon } from "@/components/ds/core/Icon";
import { useWoningDraft } from "./WoningDraftProvider";
import { HOUSE_MODELS } from "@/lib/woning-types";
import { zoekAdres, type AdresZoekResultaat } from "@/lib/pdok/adresZoeken";

// Stap 1 van de woningflow: postcode + huisnummer → echte adresopzoeking
// via PDOK → "Klopt dit adres?" → bevestiging.
//
// PDOK-adresdata (straatEnHuisnummer, postcode, woonplaats in
// `zoekResultaat`) is ECHTE, externe data. De kenmerken daaronder
// (bouwjaar, woningtype, woonoppervlak, uit MOCK_WONING) blijven
// mockdata — er is nog geen BAG-, Cyclomedia- of andere koppeling voor
// woningkenmerken. Dat onderscheid staat ook zo in de tekst voor de
// bezoeker, niet alleen in de code.
export function StapBevestigen({
  postcode,
  huisnummer,
  akkoordVoorwaarden,
  onAkkoordChange,
  onAdresSubmit,
  onBevestig,
  onAnderAdres,
  onWijzigWoningtype,
}: {
  postcode: string;
  huisnummer: string;
  akkoordVoorwaarden: boolean;
  onAkkoordChange: (akkoord: boolean) => void;
  onAdresSubmit: (postcode: string, huisnummer: string) => void;
  onBevestig: (addressLabel: string, manual?: boolean) => void;
  onAnderAdres: () => void;
  onWijzigWoningtype: () => void;
}) {
  const { draft } = useWoningDraft();
  const [adresKlopt, setAdresKlopt] = useState(false);
  const [pc, setPc] = useState(postcode);
  const [hn, setHn] = useState(huisnummer);
  const [manual,setManual]=useState(false);
  const [street,setStreet]=useState("");
  const [city,setCity]=useState("");
  const [bewerken, setBewerken] = useState(postcode.trim() === "" || huisnummer.trim() === "");
  // Opgeslagen in de scansessie (niet lokale state): zo geldt het akkoord
  // voor élk subscherm van deze stap — ook wanneer een bewoner met een
  // reeds bekend adres meteen op "Klopt dit adres?" landt — en blijft
  // readScan() dit ook na een paginaherlaad kunnen afdwingen.
  const akkoord = akkoordVoorwaarden;
  const setAkkoord = onAkkoordChange;
  // null = nog geen resultaat voor de huidige postcode/huisnummer (dus
  // "bezig met opzoeken"). Wordt alleen ná afloop van de opzoeking gezet
  // (in de .then()), nooit synchroon aan het begin van het effect —
  // dat laatste triggert onnodige dubbele renders.
  const [resultaat, setResultaat] = useState<AdresZoekResultaat | null>(null);

  useEffect(() => {
    if (bewerken || manual) return;
    if (!postcode.trim() || !huisnummer.trim()) return;

    let actief = true;
    zoekAdres(postcode, huisnummer).then((res) => {
      if (actief) setResultaat(res);
    });

    return () => {
      actief = false;
    };
  }, [postcode, huisnummer, bewerken, manual]);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Fouten (leeg/ongeldig formaat) worden pas ná het opzoeken getoond
    // (zoekAdres valideert ook), zodat er maar één plek is die de
    // foutmeldingen bepaalt. De ingevulde waarden blijven altijd staan,
    // ook bij een fout. setResultaat(null) hier (in de event handler,
    // niet in het effect) zorgt dat de laadstatus meteen klopt zodra er
    // een nieuwe opzoeking start.
    setResultaat(null);
    setBewerken(false);
    onAdresSubmit(pc, hn);
  }

  if(manual) return <section className="grid gap-4"><h3 className="text-2xl font-bold">Vul je adres zelf in</h3><p>Je kunt gewoon verder. Gijs controleert dit adres later met je.</p><form className="grid gap-4" onSubmit={e=>{e.preventDefault();onAdresSubmit(pc,hn);onBevestig(street+" "+hn+", "+pc+" "+city,true);}}><Field label="Straat"><Input aria-label="Straat" required value={street} onChange={e=>setStreet(e.target.value)}/></Field><Field label="Huisnummer"><Input aria-label="Huisnummer" required value={hn} onChange={e=>setHn(e.target.value)}/></Field><Field label="Postcode"><Input aria-label="Postcode" required value={pc} onChange={e=>setPc(e.target.value)}/></Field><Field label="Woonplaats"><Input aria-label="Woonplaats" required value={city} onChange={e=>setCity(e.target.value)}/></Field><Checkbox required checked={akkoord} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setAkkoord(e.target.checked)} label={<>Ik ga akkoord met de <a className="underline" href="/algemene-voorwaarden" target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}>algemene voorwaarden</a></>}/><Button type="submit" variant="accent" disabled={!akkoord}>Verder met dit adres</Button><button type="button" className="underline" onClick={()=>{setManual(false);setBewerken(true);}}>Adres alsnog opzoeken</button></form></section>;
  const manualButton=<button type="button" className="text-left underline font-semibold py-3" onClick={()=>setManual(true)}>Adres zelf invullen en doorgaan</button>;
  if (bewerken) {
    return (
      <section className="w-full flex flex-col gap-4">
        <h3 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">
          Vul je postcode en huisnummer in
        </h3>
        <p className="text-zinc-600">
          Gijs zoekt je adres op en laat zien wat er mogelijk is voor jouw
          woning.
        </p>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Field label="Postcode" className="flex-1">
              <Input
                aria-label="Postcode" required value={pc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPc(e.target.value)}
                placeholder="1234 AB"
              />
            </Field>
            <Field label="Huisnummer" className="w-28">
              <Input
                aria-label="Huisnummer" required value={hn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHn(e.target.value)}
                placeholder="12"
              />
            </Field>
          </div>
          <Checkbox
            required
            checked={akkoord}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAkkoord(e.target.checked)}
            label={<>Ik ga akkoord met de <a className="underline" href="/algemene-voorwaarden" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>algemene voorwaarden</a></>}
          />
          <Button type="submit" variant="accent" iconRight="arrow-right" disabled={!akkoord}>
            Zoek mijn woning
          </Button>
        </form>{manualButton}
      </section>
    );
  }

  if (resultaat === null) {
    return (
      <section className="w-full flex flex-col items-center gap-3 text-center">
        <p className="text-zinc-600">Je adres wordt opgezocht…</p>{manualButton}
      </section>
    );
  }

  if (resultaat.status !== "gevonden") {
    let melding: string;
    if (resultaat.status === "ongeldige-invoer") {
      melding = resultaat.melding;
    } else if (resultaat.status === "niet-gevonden") {
      melding = "Dit adres kon niet gevonden worden. Controleer de postcode en het huisnummer.";
    } else {
      melding = "Het adres kan op dit moment niet worden opgezocht. Probeer het zo opnieuw.";
    }

    return (
      <section className="w-full flex flex-col gap-4">
        <h3 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">
          Vul je postcode en huisnummer in
        </h3>
        <Alert tone="error">{melding}</Alert>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Field label="Postcode" className="flex-1">
              <Input
                aria-label="Postcode" required value={pc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPc(e.target.value)}
                placeholder="1234 AB"
              />
            </Field>
            <Field label="Huisnummer" className="w-28">
              <Input
                aria-label="Huisnummer" required value={hn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHn(e.target.value)}
                placeholder="12"
              />
            </Field>
          </div>
          <Button type="submit" variant="accent" iconRight="arrow-right">
            Opnieuw proberen
          </Button>
        </form>{manualButton}
      </section>
    );
  }

  const { adres } = resultaat;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Badge tone="accent">Gevonden via PDOK</Badge>
        <h3 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">
          Klopt dit adres?
        </h3>
        <div className="gijs-card gijs-card--muted flex flex-col gap-1">
          <span className="font-semibold text-[var(--gijs-donkergroen)]">
            {adres.straatEnHuisnummer}
          </span>
          <span className="text-zinc-600">
            {adres.postcode} {adres.woonplaats}
          </span>
        </div>
        {/* TODO: vervang door een echte kaartweergave (bijv. PDOK/Kadaster
            of Mapbox) zodra dat betrouwbaar beschikbaar is. Tot die tijd
            bewust een duidelijke, neutrale placeholder in plaats van een
            nagemaakte kaart. */}
        <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-default)] bg-[var(--surface-muted)] flex flex-col items-center justify-center gap-2 py-8 text-center">
          <Icon name="map-pin" size="lg" className="text-[var(--accent-600)]" />
          <p className="text-sm text-zinc-600">Kaartweergave van dit adres volgt hier binnenkort.</p>
        </div>
        <p className="text-sm text-zinc-600">
          Dit adres is gevonden via PDOK. De 3D-woning volgt het woningtype
          dat je zelf koos. Het model is een voorbeeld, geen herkenning van jouw huis.
        </p>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="font-semibold">Gekozen woningtype: {HOUSE_MODELS[draft.houseType].label}</p>
          <button type="button" className="text-sm font-semibold underline" onClick={onWijzigWoningtype}>Wijzig woningtype</button>
        </div>
        <Checkbox
          required
          checked={akkoord}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAkkoord(e.target.checked)}
          label={<>Ik ga akkoord met de <a className="underline" href="/algemene-voorwaarden" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>algemene voorwaarden</a></>}
        />
        <Checkbox
          required
          checked={adresKlopt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdresKlopt(e.target.checked)}
          label="Dit adres klopt"
        />
        <div className="flex flex-wrap gap-3 mt-2">
          <Button variant="accent" iconRight="arrow-right" disabled={!akkoord || !adresKlopt} onClick={() => onBevestig(`${adres.straatEnHuisnummer}, ${adres.postcode} ${adres.woonplaats}`)}>
            Doorgaan
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setBewerken(true);
              onAnderAdres();
            }}
          >
            Adres aanpassen
          </Button>
        </div>
      </div>
    </section>
  );
}
