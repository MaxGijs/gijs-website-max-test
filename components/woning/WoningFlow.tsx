"use client";
import { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import { useWoningDraft } from "./WoningDraftProvider";
import { HouseViewer } from "./HouseViewer";
import { HOUSE_MODELS, baseHouseType, type HouseType } from "@/lib/woning-types";
import { StapBevestigen } from "./StapBevestigen";
import { Woningbeeld } from "./Woningbeeld";
import { MaatregelenSamenvatting } from "./MaatregelenSamenvatting";
import { CONTACT } from "@/lib/content/contact";
import { MEASURE_DETAILS } from "@/lib/content/measure-details";
import { freshScan, readScan, SCAN_KEY, SCAN_MEASURES, SCAN_GROUPS, SCAN_WISHES, sameAddress, scanMessage, type ScanSession } from "@/lib/scan-session";
import { ZONE_LABELS, measuresForZone, computeWoningplanTotals, type WoningZoneId } from "@/lib/measures";
import { maakWoningdossier, type DatapuntStatus } from "@/lib/woningdossier";
import { Button } from "@/components/ds/core/Button";
import { Badge } from "@/components/ds/core/Badge";
import { Checkbox } from "@/components/ds/forms/Checkbox";
import { Tag } from "@/components/ds/core/Tag";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import { Alert } from "@/components/ds/feedback/Alert";
import { Stepper } from "@/components/ds/navigation/Stepper";
import styles from "./WoningFlow.module.css";

// Zeven hoofdstappen in de stapindicator; elke stap kan intern meerdere
// homeQgo-onderzoeksmomenten combineren (zie WERKWIJZE-notitie in de
// opdracht: "Woning" = herkennen + controleren, "Bouw jouw woning" =
// woningtype/dak/zichtbare kenmerken samenstellen, "Situatie" = bestaande
// maatregelen + installaties, "Woningplan" = resultaat + plan + vervolg).
const STEPS = ["Adres", "Woning", "Bouw jouw woning", "Situatie", "Energie", "Maatregelen", "Woningplan"];

const STATUS_BADGE: Record<DatapuntStatus, { tone: "neutral" | "success"; label: string }> = {
  geschat: { tone: "neutral", label: "Voorbeelddata" },
  bevestigd: { tone: "success", label: "Door jou bevestigd" },
  gecorrigeerd: { tone: "success", label: "Door jou aangepast" },
};

const toggleIn = (list: string[], id: string) => list.includes(id) ? list.filter(x => x !== id) : [...list, id];

/**
 * Eén woningveld: direct te bewerken (dropdown bij een vaste keuzelijst,
 * anders een gewoon invoerveld) met de herkomst-badge er subtiel naast —
 * geen extra klik om eerst te "openen" en apart op te slaan.
 */
function DossierVeld({ label, value, status, onChange, opties, suffix, editable = true, id }: { label: string; value: string; status: DatapuntStatus; onChange?: (v: string) => void; opties?: string[]; suffix?: string; editable?: boolean; id: string }) {
  const badge = STATUS_BADGE[status];
  return (
    <div className={styles.dossierRij}>
      <div className={styles.dossierLabelRij}>
        <label htmlFor={id} className={styles.dossierLabel}>{label}</label>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </div>
      {editable ? (
        opties
          ? <select id={id} className="gijs-input" value={value} onChange={e => onChange?.(e.target.value)}>{opties.map(o => <option key={o} value={o}>{o}</option>)}</select>
          : <Input id={id} value={value} suffix={suffix} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)} />
      ) : (
        <p id={id} className={styles.dossierWaardeVast}>{value}{suffix}</p>
      )}
    </div>
  );
}

/**
 * Compacte, alleen-lezen rij met een "Wijzigen"-link naar "Bouw jouw
 * woning" — voor kenmerken die daar horen te worden aangepast (woningtype,
 * dakkapel, aanbouw) zodat wijzigen later niet betekent dat de bewoner de
 * hele scan opnieuw moet doen (zie opdracht item 9/10).
 */
function KenmerkRij({ id, label, value, status, onWijzigen }: { id: string; label: string; value: string; status: DatapuntStatus; onWijzigen: () => void }) {
  const badge = STATUS_BADGE[status];
  return (
    <div className={styles.dossierRij}>
      <div className={styles.dossierLabelRij}>
        <span id={id} className={styles.dossierLabel}>{label}</span>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className={styles.dossierWaardeVast} aria-labelledby={id}>{value}</p>
        <button type="button" className={styles.textButton} onClick={onWijzigen}>Wijzigen</button>
      </div>
    </div>
  );
}

const VERWARMING_OPTIES = ["Gasketel (CV)", "Hybride warmtepomp", "Volledig elektrisch", "Anders"];
const WARMTEAFGIFTE_OPTIES = ["Radiatoren", "Vloerverwarming", "Radiatoren en vloerverwarming"];
const WARMWATER_OPTIES = ["CV-ketel", "Aparte boiler", "Anders"];
const MONUMENT_OPTIES = ["Geen monument", "Gemeentelijk monument", "Rijksmonument", "Weet ik niet"];
const KRUIPRUIMTE_OPTIES = ["Aanwezig", "Niet aanwezig", "Weet ik niet"];
const MUREN_OPTIES = ["Spouwmuur", "Massieve muur", "Weet ik niet"];
const BEWONERS_OPTIES = ["1 bewoner", "2 bewoners", "3 bewoners", "4 bewoners", "5 of meer bewoners"];

export function WoningFlow({ initialHouseType, initialPostcode, initialHuisnummer, initialMeasure }: { initialHouseType?: HouseType; initialPostcode: string; initialHuisnummer: string; initialMeasure?: string }) {
  const { draft, setDraft } = useWoningDraft();
  const [scan, setScan] = useState<ScanSession>(() => freshScan(initialPostcode || draft.postcode, initialHuisnummer || draft.huisnummer, initialHouseType || draft.houseType));
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmNew, setConfirmNew] = useState(false);
  const [activeZone, setActiveZone] = useState<WoningZoneId | null>(null);
  const [hulpZichtbaar, setHulpZichtbaar] = useState(false);
  const fieldId = useId();
  const first = useRef(true);
  const heading = useRef<HTMLHeadingElement>(null);
  const scroll = useRef(false);

  useEffect(() => {
    if (!first.current) return;
    first.current = false;
    let saved: ScanSession | null = null;
    try { saved = readScan(sessionStorage.getItem(SCAN_KEY)); } catch { /* sessionStorage kan ontbreken/geblokkeerd zijn */ }
    const incoming = freshScan(initialPostcode || draft.postcode, initialHuisnummer || draft.huisnummer, initialHouseType || draft.houseType);
    const restored = saved && (!(initialPostcode && initialHuisnummer) || sameAddress(saved, incoming)) ? { ...saved, houseType: initialHouseType || saved.houseType } : incoming;
    if (initialMeasure && SCAN_MEASURES.some(m => m.id === initialMeasure)) {
      restored.measures = [...new Set([...restored.measures, initialMeasure])];
      restored.step = restored.woningBevestigd ? 4 : restored.addressLabel ? 1 : 0;
      restored.reached = Math.max(restored.reached, restored.step);
    }
    setScan(restored);
    setReady(true);
  }, [draft, initialHouseType, initialPostcode, initialHuisnummer, initialMeasure]);

  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(SCAN_KEY, JSON.stringify(scan)); } catch { /* sessionStorage kan ontbreken/geblokkeerd zijn */ }
    setDraft(current => ({ ...current, postcode: scan.postcode, huisnummer: scan.huisnummer, houseType: scan.houseType }));
    const query = new URLSearchParams({ woningtype: scan.houseType });
    if (scan.postcode) query.set("postcode", scan.postcode);
    if (scan.huisnummer) query.set("huisnummer", scan.huisnummer);
    history.replaceState(null, "", "/woning?" + query);
  }, [scan, ready, setDraft]);

  useEffect(() => {
    if (scroll.current) { scroll.current = false; heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "start", behavior: "smooth" }); }
  }, [scan.step]);

  const patch = (p: Partial<ScanSession>) => { setStatus(""); setScan(s => ({ ...s, ...p })); };
  const go = (step: number) => { scroll.current = true; setScan(s => ({ ...s, step, reached: Math.max(s.reached, step) })); };
  const toggleMeasure = (id: string) => setScan(s => ({ ...s, measures: toggleIn(s.measures, id) }));
  const back = <Button type="button" variant="ghost" onClick={() => go(scan.step - 1)}>Terug</Button>;
  const message = scanMessage(scan);
  if (!ready) return <p className="p-8" role="status">Je woningplan wordt klaargezet…</p>;

  // Eén centraal woningdossier voor het hele prototype: bevestigde/aangepaste
  // velden komen uit de scansessie, de rest valt terug op voorbeelddata
  // (zie lib/woningdossier.ts — de "Gijs-waarheid" met bron/status per veld).
  const dossier = maakWoningdossier({
    adres: { postcode: scan.postcode, huisnummer: scan.huisnummer, label: scan.addressLabel, handmatig: scan.manualAddress },
    houseType: scan.houseType,
    bouwjaar: scan.bouwjaar, woonoppervlakte: scan.woonoppervlakte, verwarming: scan.verwarming, energielabel: scan.energielabel,
    monument: scan.monument, kruipruimte: scan.kruipruimte, typeMuren: scan.typeMuren,
    bestaandeMaatregelen: scan.bestaandeMaatregelen, gewenstMaatregelen: scan.measures,
  });
  const dossierVolledig = { woning: scan.woningBevestigd, situatie: scan.bestaandeMaatregelen.length > 0 || Boolean(scan.verwarming), energie: Boolean(scan.aantalBewoners || scan.elektriciteitsverbruik || scan.gasverbruik), maatregelen: scan.measures.length > 0 };
  // Wat je aanvinkt — bestaand of gewenst — komt direct in de woning, net als
  // bij isolatie/installaties: geen aparte "eerst naar Maatregelen"-stap nodig.
  const zichtbareMaatregelen = [...new Set([...scan.bestaandeMaatregelen, ...scan.measures])];
  const viewer = <HouseViewer selectedMeasureIds={zichtbareMaatregelen} dakkapelAanwezig={scan.dakkapelAanwezig} aanbouwAanwezig={scan.aanbouwAanwezig} />;
  const tweeKoloms = scan.step !== 6;

  return (
    <div className={styles.flow}>
      <header className={styles.intro}>
        <span className="inline-flex w-11 h-11 rounded-full bg-white border border-[var(--border-default)] items-center justify-center mb-3">
          <Image src="/huisscan.png" alt="" width={26} height={26} />
        </span>
        <p className="font-semibold">Jouw digitale woningscan</p>
        <h1>Van jouw woning naar een goed gesprek.</h1>
        <p>Ontdek stap voor stap wat er mogelijk is. Je hoeft nog niets te weten; dat bespreek je met Gijs.</p>
      </header>
      <Stepper steps={STEPS} current={scan.step} className={styles.stepper} />
      <h2 ref={heading} tabIndex={-1} className={styles.heading}>{STEPS[scan.step]}</h2>
      <div className={styles.grid + (tweeKoloms ? "" : " " + styles.planGrid)}>
        {tweeKoloms ? viewer : <details className={styles.planViewer}><summary>Bekijk je woning in 360°</summary>{viewer}</details>}
        <div className={styles.panel}>

          {scan.step === 0 && (
            <StapBevestigen
              postcode={scan.postcode} huisnummer={scan.huisnummer}
              akkoordVoorwaarden={scan.akkoordVoorwaarden}
              onAkkoordChange={akkoordVoorwaarden => patch({ akkoordVoorwaarden })}
              onAdresSubmit={(postcode, huisnummer) => patch({ postcode, huisnummer, addressLabel: "" })}
              onBevestig={(addressLabel, manual = false) => { patch({ addressLabel, manualAddress: manual }); go(1); }}
              onAnderAdres={() => {}}
              onWijzigWoningtype={() => go(2)}
            />
          )}

          {scan.step === 1 && (scan.woningBevestigd ? (
            <>
              <h3 className="text-xl font-semibold">Controleer je woninggegevens</h3>
              <p className={styles.note}>Automatisch gevonden op basis van vergelijkbare woningen. Klopt iets niet? Pas het direct aan.</p>
              <div className="mb-2"><Woningbeeld adresLabel={scan.addressLabel} /></div>
              <KenmerkRij id={`${fieldId}-woningtype`} label="Woningtype" value={HOUSE_MODELS[dossier.woningtype.waarde].label} status={dossier.woningtype.status} onWijzigen={() => go(2)} />
              <KenmerkRij id={`${fieldId}-dakkapel-rij`} label="Dakkapel" value={scan.dakkapelAanwezig ? "Aanwezig" : "Niet aanwezig"} status="bevestigd" onWijzigen={() => go(2)} />
              {baseHouseType(scan.houseType) === "vrijstaand" && (
                <KenmerkRij id={`${fieldId}-aanbouw-rij`} label="Garage/aanbouw" value={scan.aanbouwAanwezig ? "Aanwezig" : "Niet aanwezig"} status="bevestigd" onWijzigen={() => go(2)} />
              )}
              <DossierVeld id={`${fieldId}-bouwjaar`} label="Bouwjaar" value={String(dossier.bouwjaar.waarde)} status={dossier.bouwjaar.status} onChange={v => patch({ bouwjaar: v })} />
              <DossierVeld id={`${fieldId}-oppervlak`} label="Woonoppervlak" value={String(dossier.woonoppervlakte.waarde)} suffix=" m²" status={dossier.woonoppervlakte.status} onChange={v => patch({ woonoppervlakte: v })} />
              <DossierVeld id={`${fieldId}-monument`} label="Monumentstatus" value={dossier.monumentstatus.waarde} status={dossier.monumentstatus.status} opties={MONUMENT_OPTIES} onChange={v => patch({ monument: v })} />
              <DossierVeld id={`${fieldId}-kruipruimte`} label="Kruipruimte" value={dossier.kruipruimte.waarde} status={dossier.kruipruimte.status} opties={KRUIPRUIMTE_OPTIES} onChange={v => patch({ kruipruimte: v })} />
              <DossierVeld id={`${fieldId}-muren`} label="Type muren" value={dossier.typeMuren.waarde} status={dossier.typeMuren.status} opties={MUREN_OPTIES} onChange={v => patch({ typeMuren: v })} />
              <div className={styles.actions}>{back}<Button variant="accent" iconRight="arrow-right" onClick={() => go(3)}>Verder naar mijn situatie</Button></div>
            </>
          ) : (
            <>
              <Badge tone="accent">Gevonden op basis van je adres</Badge>
              <h3 className="text-xl font-semibold mt-3">Is dit jouw woning?</h3>
              <p className="mt-2 text-lg font-semibold">{scan.addressLabel || (scan.postcode + " " + scan.huisnummer)}</p>
              <p className={styles.note}>bouwjaar {dossier.bouwjaar.waarde} (voorbeeld) · {dossier.woonoppervlakte.waarde} m² (voorbeeld)</p>
              <div className="mt-6"><Woningbeeld adresLabel={scan.addressLabel} /></div>
              <div className={styles.actions}>
                <Button variant="ghost" onClick={() => { patch({ addressLabel: "", woningBevestigd: false }); go(0); }}>Nee, zoek opnieuw</Button>
                <Button variant="accent" iconRight="arrow-right" onClick={() => { patch({ woningBevestigd: true }); go(2); }}>Ja, dit is mijn woning</Button>
              </div>
            </>
          ))}

          {scan.step === 2 && (
            <>
              <h3 className="text-xl font-semibold">Bouw jouw woning</h3>
              <p className={styles.note}>Stel je woning stap voor stap samen. Elke keuze verandert direct de 3D-woning hiernaast.</p>

              <fieldset className={styles.measureGroup}>
                <legend>Welk woningtype past het best?</legend>
                <div className={styles.chips}>
                  {(Object.keys(HOUSE_MODELS) as HouseType[]).map(type => (
                    <Tag key={type} selectable selected={scan.houseType === type} onClick={() => patch({ houseType: type })}>{HOUSE_MODELS[type].label}</Tag>
                  ))}
                </div>
              </fieldset>

              <fieldset className={styles.measureGroup}>
                <legend>Heeft je woning een dakkapel?</legend>
                <div className={styles.chips}>
                  <Tag selectable selected={scan.dakkapelAanwezig} onClick={() => patch({ dakkapelAanwezig: true })}>Ja</Tag>
                  <Tag selectable selected={!scan.dakkapelAanwezig} onClick={() => patch({ dakkapelAanwezig: false })}>Nee</Tag>
                </div>
              </fieldset>

              {baseHouseType(scan.houseType) === "vrijstaand" && (
                <fieldset className={styles.measureGroup}>
                  <legend>Heeft je woning een garage of aanbouw?</legend>
                  <div className={styles.chips}>
                    <Tag selectable selected={scan.aanbouwAanwezig} onClick={() => patch({ aanbouwAanwezig: true })}>Ja</Tag>
                    <Tag selectable selected={!scan.aanbouwAanwezig} onClick={() => patch({ aanbouwAanwezig: false })}>Nee</Tag>
                  </div>
                </fieldset>
              )}

              <p className={styles.note}>Dit is een visuele benadering op basis van je keuzes, geen exacte digitale tweeling van je woning.</p>
              <div className={styles.actions}>{back}<Button variant="accent" iconRight="arrow-right" onClick={() => go(3)}>Verder naar mijn situatie</Button></div>
            </>
          )}

          {scan.step === 3 && (
            <>
              <h3 className="text-xl font-semibold">Wat is er al aanwezig?</h3>
              <p className={styles.note}>Geef aan wat al is gedaan. Dan stelt Gijs dit niet nogmaals voor als maatregel, en je ziet het direct op je woning hiernaast.</p>
              <div className={styles.cardGrid}>
                {SCAN_MEASURES.map(m => (
                  <Checkbox key={m.id} card label={m.label} description={m.text}
                    checked={scan.bestaandeMaatregelen.includes(m.id)}
                    onChange={() => patch({ bestaandeMaatregelen: toggleIn(scan.bestaandeMaatregelen, m.id) })}
                  />
                ))}
              </div>
              {scan.bestaandeMaatregelen.includes("zonnepanelen") && (
                <Field label="Aantal zonnepanelen" className={styles.zonnepanelenVeld} htmlFor={`${fieldId}-panelen`}>
                  <Input id={`${fieldId}-panelen`} inputMode="numeric" value={scan.zonnepanelenAantal} onChange={e => patch({ zonnepanelenAantal: e.target.value })} />
                </Field>
              )}
              <h3 className="text-xl font-semibold mt-8">Installatie en verwarming</h3>
              <p className={styles.note}>Alleen als je dit al weet. Dit kun je later nog aanpassen.</p>
              <div className={styles.fieldGrid}>
                <Field label="Huidige verwarming" htmlFor={`${fieldId}-verwarming`}>
                  <select id={`${fieldId}-verwarming`} className="gijs-input" value={scan.verwarming} onChange={e => patch({ verwarming: e.target.value })}>
                    <option value="">Kies een optie</option>
                    {VERWARMING_OPTIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Warmteafgiftesysteem" htmlFor={`${fieldId}-warmteafgifte`}>
                  <select id={`${fieldId}-warmteafgifte`} className="gijs-input" value={scan.warmteafgifte} onChange={e => patch({ warmteafgifte: e.target.value })}>
                    <option value="">Kies een optie</option>
                    {WARMTEAFGIFTE_OPTIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Warm water" htmlFor={`${fieldId}-warmwater`}>
                  <select id={`${fieldId}-warmwater`} className="gijs-input" value={scan.warmWater} onChange={e => patch({ warmWater: e.target.value })}>
                    <option value="">Kies een optie</option>
                    {WARMWATER_OPTIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
              <div className={styles.actions}>{back}<Button variant="accent" iconRight="arrow-right" onClick={() => go(4)}>Verder naar energie</Button></div>
            </>
          )}

          {scan.step === 4 && (
            <>
              <h3 className="text-xl font-semibold">Hoe ziet je energieverbruik eruit?</h3>
              <p className={styles.note}>Optioneel, maar helpt Gijs een preciezer beeld te krijgen.</p>
              <div className={styles.fieldGrid}>
                <Field label="Aantal bewoners" htmlFor={`${fieldId}-bewoners`}>
                  <select id={`${fieldId}-bewoners`} className="gijs-input" value={scan.aantalBewoners} onChange={e => patch({ aantalBewoners: e.target.value })}>
                    <option value="">Kies een optie</option>
                    {BEWONERS_OPTIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Elektriciteitsverbruik (kWh/jaar)" htmlFor={`${fieldId}-elek`}><Input id={`${fieldId}-elek`} inputMode="numeric" value={scan.elektriciteitsverbruik} onChange={e => patch({ elektriciteitsverbruik: e.target.value })} /></Field>
                <Field label="Gasverbruik (m³/jaar)" htmlFor={`${fieldId}-gas`}><Input id={`${fieldId}-gas`} inputMode="numeric" value={scan.gasverbruik} onChange={e => patch({ gasverbruik: e.target.value })} /></Field>
                <Field label="Elektriciteitsprijs (€/kWh)" optional htmlFor={`${fieldId}-elekprijs`}><Input id={`${fieldId}-elekprijs`} inputMode="decimal" value={scan.elektriciteitsprijs} onChange={e => patch({ elektriciteitsprijs: e.target.value })} /></Field>
                <Field label="Gasprijs (€/m³)" optional htmlFor={`${fieldId}-gasprijs`}><Input id={`${fieldId}-gasprijs`} inputMode="decimal" value={scan.gasprijs} onChange={e => patch({ gasprijs: e.target.value })} /></Field>
              </div>
              <button type="button" className={styles.textButton} onClick={() => setHulpZichtbaar(true)}>Weet ik niet precies · Help mij schatten</button>
              {hulpZichtbaar && (
                <Alert tone="info" title="Dit is nog een prototypefunctie">
                  In de uiteindelijke website helpt Gijs je hier op basis van vergelijkbare woningen. In dit prototype vul je verbruik voorlopig zelf in. Er wordt nog niets automatisch geschat.
                </Alert>
              )}
              <div className={styles.actions}>{back}<Button variant="accent" iconRight="arrow-right" onClick={() => go(5)}>Verder naar maatregelen</Button></div>
            </>
          )}

          {scan.step === 5 && (
            <>
              <h3 className="text-xl font-semibold">Wat wil je verbeteren?</h3>
              <p className={styles.note}>Optioneel. Je mag ook direct maatregelen ontdekken.</p>
              <div className="mb-6"><MaatregelenSamenvatting totals={computeWoningplanTotals(scan.measures)} aantal={scan.measures.length} /></div>
              <div className={styles.wishes}>{SCAN_WISHES.map(w => (
                <label key={w}><input type="checkbox" checked={scan.wishes.includes(w)} onChange={() => patch({ wishes: toggleIn(scan.wishes, w) })} />{w}</label>
              ))}</div>
              <Checkbox label="Ik weet het nog niet, help mij kiezen" description="Je kunt altijd verder, ook zonder maatregelen te kiezen." checked={scan.advice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ advice: e.target.checked })} />
              <p className={styles.note + " mt-6"}>Kies een onderdeel van de woning voor gerichte mogelijkheden, of blader hieronder door alles.</p>
              <div className={styles.chips + " my-4"}>{(Object.keys(ZONE_LABELS) as WoningZoneId[]).map(zone => (
                <Tag key={zone} selectable selected={activeZone === zone} onClick={() => setActiveZone(activeZone === zone ? null : zone)}>{ZONE_LABELS[zone]}</Tag>
              ))}</div>
              {activeZone ? (
                <fieldset className={styles.measureGroup}>
                  <legend>{ZONE_LABELS[activeZone]}</legend>
                  <button type="button" className={styles.textButton} onClick={() => setActiveZone(null)}>← Toon alle mogelijkheden</button>
                  <div className={styles.cardGrid}>{measuresForZone(activeZone).map(m => (
                    <Checkbox key={m.id} card label={m.label} description={m.text + (scan.bestaandeMaatregelen.includes(m.id) ? " · Al aanwezig volgens jou" : "")} checked={scan.measures.includes(m.id)} onChange={() => toggleMeasure(m.id)} />
                  ))}</div>
                </fieldset>
              ) : SCAN_GROUPS.map(group => (
                <fieldset key={group.label} className={styles.measureGroup}>
                  <legend>{group.label}</legend>
                  <p className={styles.note}>{group.description}</p>
                  <div className={styles.cardGrid}>{SCAN_MEASURES.filter(m => group.ids.includes(m.id)).map(m => (
                    <Checkbox key={m.id} card label={m.label} description={m.text + (scan.bestaandeMaatregelen.includes(m.id) ? " · Al aanwezig volgens jou" : "")} checked={scan.measures.includes(m.id)} onChange={() => toggleMeasure(m.id)} />
                  ))}</div>
                </fieldset>
              ))}
              <p className={styles.note}>Dit zijn interesses, geen technische beoordeling. Bij isolatie openen we de woning om de laag te laten zien.</p>
              <div className={styles.actions}>{back}<Button variant="accent" iconRight="arrow-right" onClick={() => go(6)}>Bekijk mijn resultaat</Button></div>
            </>
          )}

          {scan.step === 6 && (() => {
            const totals = computeWoningplanTotals(scan.measures);
            const bestaand = SCAN_MEASURES.filter(m => scan.bestaandeMaatregelen.includes(m.id));
            const gewenst = SCAN_MEASURES.filter(m => scan.measures.includes(m.id));
            return (
              <>
                <p className="text-xl font-semibold">{scan.addressLabel || scan.postcode + " " + scan.huisnummer}</p>
                <p>{HOUSE_MODELS[scan.houseType].label}{scan.manualAddress ? " · adres handmatig ingevuld" : ""}</p>
                <button type="button" className={styles.textButton} onClick={() => go(1)}>Woning of adres wijzigen</button>

                <h3 className="text-xl font-bold mt-6">Dit weten we van je woning</h3>
                <ul className={styles.samenvattingLijst}>
                  <li>Bouwjaar: {dossier.bouwjaar.waarde} <Badge tone={STATUS_BADGE[dossier.bouwjaar.status].tone}>{STATUS_BADGE[dossier.bouwjaar.status].label}</Badge></li>
                  <li>Woonoppervlak: {dossier.woonoppervlakte.waarde} m² <Badge tone={STATUS_BADGE[dossier.woonoppervlakte.status].tone}>{STATUS_BADGE[dossier.woonoppervlakte.status].label}</Badge></li>
                  <li>Energielabel: {dossier.energieprofiel.energielabel.waarde} <Badge tone={STATUS_BADGE[dossier.energieprofiel.energielabel.status].tone}>{STATUS_BADGE[dossier.energieprofiel.energielabel.status].label}</Badge></li>
                </ul>

                <h3 className="text-xl font-bold mt-6">Al aanwezig</h3>
                {bestaand.length ? <ul className={styles.samenvattingLijst}>{bestaand.map(m => <li key={m.id}>{m.label}{m.id === "zonnepanelen" && scan.zonnepanelenAantal ? ` · ${scan.zonnepanelenAantal} panelen` : ""}</li>)}</ul> : <p className={styles.note}>Nog niets aangegeven.</p>}

                <h3 className="text-xl font-bold mt-6">Status van je woningdossier</h3>
                <ul className={styles.statusLijst}>
                  {[["Adres", true], ["Woninggegevens", dossierVolledig.woning], ["Situatie", dossierVolledig.situatie], ["Energiegegevens", dossierVolledig.energie], ["Maatregelen", dossierVolledig.maatregelen]].map(([label, done]) => (
                    <li key={label as string} data-klaar={done}><span aria-hidden="true">{done ? "✓" : "○"}</span>{label}</li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold mt-8">Mijn woningplan</h3>
                {gewenst.length ? gewenst.map(m => (
                  <details key={m.id} className={styles.planMeasure}>
                    <summary>{m.label}</summary>
                    <p><strong>Dit bekijkt Gijs:</strong> {MEASURE_DETAILS[m.label].execution}</p>
                  </details>
                )) : <p className={styles.note}>Nog geen maatregelen gekozen? Gijs helpt je de mogelijkheden te onderzoeken.</p>}
                <button type="button" className={styles.textButton} onClick={() => go(5)}>Maatregelen wijzigen</button>

                <div className="mt-4"><MaatregelenSamenvatting totals={totals} aantal={gewenst.length} /></div>
                <p className={styles.note}>Je woningplan is een voorbereiding op advies. Gijs beoordeelt wat technisch bij jouw woning past.</p>

                <h3 className="text-2xl font-bold mt-8">Plan een gratis energiescan</h3>
                <p>Gratis en vrijblijvend, ter waarde van €289.</p>
                <form onSubmit={e => { e.preventDefault(); setStatus("Je aanvraag staat hieronder klaar als voorbeeld. Er is niets verstuurd. Bel of mail Gijs voor een echte afspraak."); }} aria-describedby="scan-form-status">
                  <p id="scan-form-status" className={styles.note}>Dit is een lokaal prototype. Verzenden is nog niet aangesloten. Je gegevens worden niet naar Gijs verstuurd.</p>
                  <label className={styles.field}>Naam<input autoComplete="name" required maxLength={100} value={scan.name} onChange={e => patch({ name: e.target.value })} /></label>
                  <label className={styles.field}>E-mailadres of telefoonnummer<input required maxLength={254} value={scan.contact} onChange={e => patch({ contact: e.target.value })} /></label>
                  <details className={styles.planMeasure}><summary>Bekijk alle gegevens van je aanvraag</summary><div className={styles.preview}>{message}</div></details>
                  <Button type="submit" variant="accent">Controleer mijn aanvraag · prototype</Button>
                  <p role="status" className={styles.note}>{status}</p>
                </form>
                <p className="mt-6">Liever direct contact? <a className="underline" href={CONTACT.phoneHref}>Bel {CONTACT.phone}</a> of <a className="underline" href={"mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("Gratis energiescan aan huis") + "&body=" + encodeURIComponent(message)}>mail je woningplan</a>.</p>
              </>
            );
          })()}

        </div>
      </div>
      <div className="mt-10 border-t pt-5">
        {confirmNew ? (
          <>
            <p>Opnieuw beginnen wist de gegevens en keuzes van deze scan.</p>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => { setScan(freshScan("", "", scan.houseType)); setConfirmNew(false); scroll.current = true; }}>Begin opnieuw</Button>
              <Button variant="ghost" onClick={() => setConfirmNew(false)}>Bewaar mijn scan</Button>
            </div>
          </>
        ) : (
          <button type="button" className={styles.textButton} onClick={() => setConfirmNew(true)}>Nieuwe scan starten</button>
        )}
      </div>
    </div>
  );
}
