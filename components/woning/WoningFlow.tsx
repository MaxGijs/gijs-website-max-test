"use client";
import { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWoningDraft } from "./WoningDraftProvider";
import { HouseViewer } from "./HouseViewer";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import { StapBevestigen } from "./StapBevestigen";
import { WoningtypeRegel, JaNeeVraag } from "./ScanVragen";
import { CONTACT } from "@/lib/content/contact";
import { MEASURE_DETAILS } from "@/lib/content/measure-details";
import { SCAN_TITELS } from "@/lib/content/maatregel-titels";
import { freshScan, readScan, SCAN_KEY, SCAN_MEASURES, SCAN_GROUPS, SCAN_WISHES, SCAN_STAPPEN, STAP, sameAddress, scanMessage, antwoordTekst, type ScanSession } from "@/lib/scan-session";
import { SUBSIDIE_PER_M2 } from "@/lib/content/subsidie-per-m2";
import { maakWoningdossier } from "@/lib/woningdossier";
import { Button } from "@/components/ds/core/Button";
import { Checkbox } from "@/components/ds/forms/Checkbox";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import { Stepper } from "@/components/ds/navigation/Stepper";
import styles from "./WoningFlow.module.css";

// Woningscan als één logische klantreis in zeven stappen:
//   1 Jouw woning          adres → straatbeeld → "Ja, dit klopt"
//   2 Jouw wensen          doelen en ambities (incl. zo energieneutraal mogelijk)
//   3 Woning aanvullen     alleen ontbrekende kenmerken, met "Ik weet het niet"
//   4 Wat is al aanwezig?  bestaande maatregelen/installaties → woningdossier
//   5 Wat wil je verbeteren?
//   6 Resultaat            passende mogelijkheden, door naar de maatregelpagina
//   7 Jouw woningplan      alles controleren en gericht wijzigen
// Vuistregel: vraag alleen wat nog niet bekend is. Woningtype komt van de
// landingspagina, de woning wordt één keer bevestigd (stap 1), en wat al
// aanwezig is wordt niet opnieuw als nieuwe maatregel voorgesteld.

const toggleIn = (list: string[], id: string) => list.includes(id) ? list.filter(x => x !== id) : [...list, id];

// Keuzelijsten; "Weet ik niet" wordt in het woningdossier als onbekend bewaard.
const VERWARMING_OPTIES = ["Gasketel (cv)", "Hybride warmtepomp", "Volledig elektrisch", "Anders", "Weet ik niet"];
const WARMTEAFGIFTE_OPTIES = ["Radiatoren", "Vloerverwarming", "Radiatoren en vloerverwarming", "Weet ik niet"];
const WARMWATER_OPTIES = ["Cv-ketel", "Aparte boiler", "Anders", "Weet ik niet"];
const MONUMENT_OPTIES = ["Geen monument", "Gemeentelijk monument", "Rijksmonument", "Weet ik niet"];
const BEWONERS_OPTIES = ["1 bewoner", "2 bewoners", "3 bewoners", "4 bewoners", "5 of meer bewoners"];

// Maatregel-id → sleutel in MEASURE_DETAILS ("Dit bekijkt Gijs").
const DETAIL_SLEUTEL: Record<string, string> = {
  zonnepanelen: "Zonnepanelen", warmtepomp: "Warmtepomp", dakisolatie: "Dakisolatie", gevelisolatie: "Spouwisolatie",
  vloerisolatie: "Vloerisolatie", "glas-kozijnen": "Isolatieglas", vloerverwarming: "Vloerverwarming", thuisbatterij: "Thuisbatterij",
};

function Keuzelijst({ id, label, value, opties, onChange }: { id: string; label: string; value: string; opties: string[]; onChange: (v: string) => void }) {
  return (
    <Field label={label} htmlFor={id}>
      <select id={id} className="gijs-input" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Kies een optie</option>
        {opties.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}

/** Eén overzichtsblok in het woningplan met een gerichte "Wijzigen". */
function PlanBlok({ titel, onWijzigen, children }: { titel: string; onWijzigen: () => void; children: React.ReactNode }) {
  return (
    <section className={styles.planBlok}>
      <div className={styles.planBlokKop}>
        <h3>{titel}</h3>
        <button type="button" className={styles.wijzigKnop} onClick={onWijzigen}>Wijzigen<span className="sr-only"> {titel.toLowerCase()}</span></button>
      </div>
      {children}
    </section>
  );
}

export function WoningFlow({ initialHouseType, initialPostcode, initialHuisnummer, initialMeasure }: { initialHouseType?: HouseType; initialPostcode: string; initialHuisnummer: string; initialMeasure?: string }) {
  const { draft, setDraft } = useWoningDraft();
  const [scan, setScan] = useState<ScanSession>(() => freshScan(initialPostcode || draft.postcode, initialHuisnummer || draft.huisnummer, initialHouseType || draft.houseType));
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmNew, setConfirmNew] = useState(false);
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
    // Vanaf een maatregelpagina ("Start de woningscan"): die maatregel staat
    // alvast aangevinkt en wie de woning al bevestigde, gaat direct naar stap 5.
    if (initialMeasure && SCAN_MEASURES.some(m => m.id === initialMeasure) && !restored.bestaandeMaatregelen.includes(initialMeasure)) {
      restored.measures = [...new Set([...restored.measures, initialMeasure])];
      restored.step = restored.woningBevestigd ? STAP.verbeteren : STAP.woning;
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
  // Vanuit het woningplan: spring gericht naar één stap en kom daarna in één klik terug.
  const wijzig = (step: number) => { scroll.current = true; setScan(s => ({ ...s, step, terugNaarPlan: true })); };
  const terugNaarPlan = () => { scroll.current = true; setScan(s => ({ ...s, step: STAP.plan, terugNaarPlan: false })); };
  const message = scanMessage(scan);
  if (!ready) return <p className="p-8" role="status">Je woningscan wordt klaargezet…</p>;

  const dossier = maakWoningdossier({
    adres: { postcode: scan.postcode, huisnummer: scan.huisnummer, label: scan.addressLabel, handmatig: scan.manualAddress },
    houseType: scan.houseType,
    dakkapel: scan.dakkapel, garage: scan.garage, aanbouw: scan.aanbouw, kruipruimte: scan.kruipruimte, spouwmuur: scan.spouwmuur,
    bouwjaar: scan.bouwjaar, woonoppervlakte: scan.woonoppervlakte, monument: scan.monument,
    wensen: scan.wishes, wensenOnbekend: scan.wensenOnbekend,
    verwarming: scan.verwarming, warmteafgifte: scan.warmteafgifte, warmWater: scan.warmWater,
    bestaandeMaatregelen: scan.bestaandeMaatregelen, aanwezigOnbekend: scan.aanwezigOnbekend,
    gewenstMaatregelen: scan.measures,
  });

  const zichtbareMaatregelen = [...new Set([...scan.bestaandeMaatregelen, ...scan.measures])];
  // "Ik weet het niet" bij dakkapel/garage verandert het model niet: alleen een duidelijk "nee" haalt het onderdeel weg.
  const viewer = <HouseViewer selectedMeasureIds={zichtbareMaatregelen} dakkapelAanwezig={scan.dakkapel !== "nee"} aanbouwAanwezig={scan.garage !== "nee"} />;
  const planStap = scan.step === STAP.plan;
  const setHouseType = (houseType: HouseType) => patch({ houseType });

  // Primaire knop naar de volgende stap; "← Vorige stap" is aanwezig maar rustig.
  // Na "Wijzigen" vanuit het woningplan wordt de primaire knop "Terug naar mijn woningplan".
  const acties = (volgende: string, naar: number) => (
    <div className={styles.stapActies}>
      {scan.terugNaarPlan
        ? <Button variant="accent" size="lg" iconRight="arrow-right" onClick={terugNaarPlan}>Terug naar mijn woningplan</Button>
        : <Button variant="accent" size="lg" iconRight="arrow-right" onClick={() => go(naar)}>{volgende}</Button>}
      {scan.step > 0 && <button type="button" className={styles.vorigeKnop} onClick={() => go(scan.step - 1)}>← Vorige stap</button>}
    </div>
  );

  const titelVan = (id: string) => SCAN_TITELS[id] ?? { naam: SCAN_MEASURES.find(m => m.id === id)?.label ?? id, titel: "", uitleg: "", slug: "", cta: "" };

  return (
    <div className={styles.flow}>
      {scan.step === STAP.woning && <header className={styles.intro}>
        <span className="inline-flex w-11 h-11 rounded-full bg-white border border-[var(--border-default)] items-center justify-center mb-3">
          <Image src="/huisscan.png" alt="" width={26} height={26} />
        </span>
        <p className="font-semibold">Jouw digitale woningscan</p>
        <h1>Van jouw woning naar een goed gesprek.</h1>
        <p>Beantwoord een paar vragen over je woning en je wensen. Je hoeft niet alles te weten: kies gerust &quot;Ik weet het niet&quot;.</p>
      </header>}
      <Stepper steps={[...SCAN_STAPPEN]} current={scan.step} className={styles.stepper} />
      <p className={styles.stapTeller}>Stap {scan.step + 1} van {SCAN_STAPPEN.length}</p>
      <h2 ref={heading} tabIndex={-1} className={styles.heading}>{SCAN_STAPPEN[scan.step]}</h2>
      <div className={styles.grid + (planStap ? " " + styles.planGrid : "")}>
        {planStap ? <details className={styles.planViewer}><summary>Bekijk de illustratieve woningweergave</summary>{viewer}</details> : viewer}
        <div className={styles.panel}>

          {scan.step === STAP.woning && (
            <StapBevestigen
              postcode={scan.postcode} huisnummer={scan.huisnummer}
              houseType={scan.houseType} onHouseTypeChange={setHouseType}
              onAdresSubmit={(postcode, huisnummer) => patch({ postcode, huisnummer, addressLabel: "", woningBevestigd: false })}
              onBevestig={(addressLabel, manual = false) => {
                patch({ addressLabel, manualAddress: manual, woningBevestigd: true });
                if (scan.terugNaarPlan) terugNaarPlan(); else go(STAP.wensen);
              }}
            />
          )}

          {scan.step === STAP.wensen && (
            <>
              <fieldset className={styles.vraagGroep}>
                <legend>Wat is voor jou belangrijk?</legend>
                <p className={styles.uitleg}>Je kunt meer dan één ding kiezen.</p>
                <div className={styles.keuzeLijst}>
                  {SCAN_WISHES.map(w => (
                    <Checkbox key={w} card label={w} checked={scan.wishes.includes(w)} onChange={() => patch({ wishes: toggleIn(scan.wishes, w), wensenOnbekend: false })} />
                  ))}
                  <Checkbox card label="Ik weet het nog niet" description="Geen probleem. Dat bespreek je later met Gijs." checked={scan.wensenOnbekend} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ wensenOnbekend: e.target.checked, wishes: e.target.checked ? [] : scan.wishes })} />
                </div>
              </fieldset>
              {acties("Volgende: je woning aanvullen", STAP.aanvullen)}
            </>
          )}

          {scan.step === STAP.aanvullen && (
            <>
              <h3 className={styles.stapVraag}>Klopt dit voor jouw woning?</h3>
              <p className={styles.uitleg}>Vul alleen aan wat je weet. Weet je iets niet zeker? Kies dan &quot;Ik weet het niet&quot;.</p>
              <WoningtypeRegel houseType={scan.houseType} onChange={setHouseType} />
              <JaNeeVraag vraag="Heeft je woning een dakkapel?" uitleg="Een dakkapel is een uitbouw in het schuine dak, met een raam erin." waarde={scan.dakkapel} onChange={dakkapel => patch({ dakkapel })} />
              <JaNeeVraag vraag="Heeft je woning een garage?" waarde={scan.garage} onChange={garage => patch({ garage })} />
              <JaNeeVraag vraag="Heeft je woning een aanbouw?" uitleg="Bijvoorbeeld een uitgebouwde keuken of woonkamer." waarde={scan.aanbouw} onChange={aanbouw => patch({ aanbouw })} />
              <JaNeeVraag vraag="Heeft je woning een kruipruimte?" uitleg="Een kruipruimte is een lage ruimte onder de begane grondvloer." waarde={scan.kruipruimte} onChange={kruipruimte => patch({ kruipruimte })} />
              <JaNeeVraag vraag="Heeft je woning spouwmuren?" uitleg="Een spouwmuur bestaat uit een buitenmuur en een binnenmuur, met een ruimte ertussen." waarde={scan.spouwmuur} onChange={spouwmuur => patch({ spouwmuur })} />
              <details className={styles.optioneel}>
                <summary>Weet je meer over je woning? (optioneel)</summary>
                <div className={styles.fieldGrid}>
                  <Field label="Bouwjaar" htmlFor={`${fieldId}-bouwjaar`}><Input id={`${fieldId}-bouwjaar`} inputMode="numeric" value={scan.bouwjaar} onChange={e => patch({ bouwjaar: e.target.value })} /></Field>
                  <Field label="Woonoppervlak (m²)" htmlFor={`${fieldId}-oppervlak`}><Input id={`${fieldId}-oppervlak`} inputMode="numeric" value={scan.woonoppervlakte} onChange={e => patch({ woonoppervlakte: e.target.value })} /></Field>
                  <Keuzelijst id={`${fieldId}-monument`} label="Is je woning een monument?" value={scan.monument} opties={MONUMENT_OPTIES} onChange={monument => patch({ monument })} />
                </div>
              </details>
              <p className={styles.note}>De woning hiernaast is een illustratieve woningweergave. Een garage of dakkapel die je hier aangeeft, wordt vastgelegd in je woningdossier; het model is geen exacte weergave van jouw woning.</p>
              {acties("Volgende: wat is al aanwezig?", STAP.aanwezig)}
            </>
          )}

          {scan.step === STAP.aanwezig && (
            <>
              <p className={styles.uitleg}>Vink aan wat je al hebt.</p>
              <div className={styles.keuzeLijst}>
                {SCAN_MEASURES.map(m => (
                  <Checkbox key={m.id} card label={titelVan(m.id).naam}
                    checked={scan.bestaandeMaatregelen.includes(m.id)}
                    onChange={() => {
                      const bestaand = toggleIn(scan.bestaandeMaatregelen, m.id);
                      patch({ bestaandeMaatregelen: bestaand, aanwezigOnbekend: false, measures: scan.measures.filter(id => !bestaand.includes(id)) });
                    }}
                  />
                ))}
                <Checkbox card label="Ik weet het niet precies" checked={scan.aanwezigOnbekend} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ aanwezigOnbekend: e.target.checked })} />
              </div>
              {scan.bestaandeMaatregelen.includes("zonnepanelen") && (
                <Field label="Hoeveel zonnepanelen liggen er al? (optioneel)" className={styles.zonnepanelenVeld} htmlFor={`${fieldId}-panelen`}>
                  <Input id={`${fieldId}-panelen`} inputMode="numeric" value={scan.zonnepanelenAantal} onChange={e => patch({ zonnepanelenAantal: e.target.value })} />
                </Field>
              )}
              <details className={styles.optioneel}>
                <summary>Verwarming en energieverbruik (optioneel)</summary>
                <div className={styles.fieldGrid}>
                  <Keuzelijst id={`${fieldId}-verwarming`} label="Huidige verwarming" value={scan.verwarming} opties={VERWARMING_OPTIES} onChange={verwarming => patch({ verwarming })} />
                  <Keuzelijst id={`${fieldId}-warmteafgifte`} label="Hoe wordt de warmte afgegeven?" value={scan.warmteafgifte} opties={WARMTEAFGIFTE_OPTIES} onChange={warmteafgifte => patch({ warmteafgifte })} />
                  <Keuzelijst id={`${fieldId}-warmwater`} label="Warm water" value={scan.warmWater} opties={WARMWATER_OPTIES} onChange={warmWater => patch({ warmWater })} />
                  <Keuzelijst id={`${fieldId}-bewoners`} label="Aantal bewoners" value={scan.aantalBewoners} opties={BEWONERS_OPTIES} onChange={aantalBewoners => patch({ aantalBewoners })} />
                  <Field label="Stroomverbruik (kWh per jaar)" htmlFor={`${fieldId}-elek`}><Input id={`${fieldId}-elek`} inputMode="numeric" value={scan.elektriciteitsverbruik} onChange={e => patch({ elektriciteitsverbruik: e.target.value })} /></Field>
                  <Field label="Gasverbruik (m³ per jaar)" htmlFor={`${fieldId}-gas`}><Input id={`${fieldId}-gas`} inputMode="numeric" value={scan.gasverbruik} onChange={e => patch({ gasverbruik: e.target.value })} /></Field>
                </div>
              </details>
              {acties("Volgende: wat wil je verbeteren?", STAP.verbeteren)}
            </>
          )}

          {scan.step === STAP.verbeteren && (
            <>
              <p className={styles.uitleg}>Je kunt meer dan één ding kiezen.</p>
              {SCAN_GROUPS.map(group => {
                const nieuw = group.ids.filter(id => !scan.bestaandeMaatregelen.includes(id));
                return nieuw.length > 0 && (
                  <fieldset key={group.label} className={styles.vraagGroep}>
                    <legend>{group.label}</legend>
                    <div className={styles.keuzeLijst}>
                      {nieuw.map(id => <Checkbox key={id} card label={titelVan(id).naam} checked={scan.measures.includes(id)} onChange={() => patch({ measures: toggleIn(scan.measures, id) })} />)}
                    </div>
                  </fieldset>
                );
              })}
              {scan.bestaandeMaatregelen.length > 0 && (
                <details className={styles.optioneel} open={scan.bestaandeMaatregelen.some(id => scan.measures.includes(id))}>
                  <summary>Ik wil iets wijzigen aan wat ik al heb</summary>
                  <div className={styles.keuzeLijst}>
                    {scan.bestaandeMaatregelen.map(id => <Checkbox key={id} card label={titelVan(id).naam} checked={scan.measures.includes(id)} onChange={() => patch({ measures: toggleIn(scan.measures, id) })} />)}
                  </div>
                </details>
              )}
              <div className="mt-6"><Checkbox card label="Ik weet het nog niet, help mij kiezen" checked={scan.advice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ advice: e.target.checked })} /></div>
              {acties("Bekijk mijn resultaat", STAP.resultaat)}
            </>
          )}

          {scan.step === STAP.resultaat && (
            <>
              <h3 className={styles.stapVraag}>Dit zijn jouw mogelijkheden</h3>
              {scan.measures.length ? (
                <ul className={styles.resultaatLijst}>
                  {scan.measures.map(id => {
                    const t = titelVan(id);
                    const detail = MEASURE_DETAILS[DETAIL_SLEUTEL[id] as keyof typeof MEASURE_DETAILS];
                    return (
                      <li key={id} className={styles.resultaatKaart}>
                        <span className={styles.maatregelNaam}>{t.naam}</span><span className="sr-only">: </span>
                        <span className={styles.maatregelTitel}>{t.titel}</span>
                        {scan.bestaandeMaatregelen.includes(id) && <p className={styles.wijziging}>Je hebt dit al en wilt iets wijzigen.</p>}
                        {SUBSIDIE_PER_M2[id]?.map(r => (
                          <p key={r.soort ?? id} className={styles.subsidie}>
                            <strong>Subsidie{r.soort ? ` ${r.soort.charAt(0).toLowerCase()}${r.soort.slice(1)}` : ""}:</strong> {r.een} per m², of {r.meer} per m² bij 2 of meer isolatiemaatregelen. Voor {r.oppervlak}.
                          </p>
                        ))}
                        {detail && <details className={styles.bekijktGijs}><summary>Wat bekijkt Gijs?</summary><p>{detail.execution}</p></details>}
                        {t.slug && <Link className={styles.meerLink} href={`/maatregelen/${t.slug}`}>Meer over {t.naam.toLowerCase()} <span aria-hidden="true">→</span></Link>}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className={styles.uitleg}>Je hebt nog geen maatregel gekozen. Dat is geen probleem: Gijs helpt je de mogelijkheden te onderzoeken.</p>
              )}
              {scan.measures.some(id => SUBSIDIE_PER_M2[id]) && <p className={styles.note}>Subsidiebedragen uit het <Link className="underline" href="/kennis#subsidies">subsidieoverzicht van Gijs</Link>. Gijs helpt bij de aanvraag, maar kan toekenning niet garanderen.</p>}
              <p className={styles.note}>Dit is een voorbereiding op advies. Gijs beoordeelt wat technisch bij jouw woning past.</p>
              {acties("Bekijk mijn woningplan", STAP.plan)}
            </>
          )}

          {scan.step === STAP.plan && (
            <>
              <p className={styles.uitleg}>Controleer je keuzes. Klopt iets niet? Kies &quot;Wijzigen&quot; bij dat onderdeel; daarna kom je hier direct terug.</p>

              <PlanBlok titel="Jouw woning" onWijzigen={() => wijzig(STAP.aanvullen)}>
                <dl className={styles.planLijst}>
                  <div><dt>Adres</dt><dd>{scan.addressLabel || `${scan.postcode} ${scan.huisnummer}`} <button type="button" className={styles.wijzigKnop} onClick={() => wijzig(STAP.woning)}>Adres wijzigen</button></dd></div>
                  <div><dt>Woningtype</dt><dd>{HOUSE_MODELS[scan.houseType].label}</dd></div>
                  <div><dt>Dakkapel</dt><dd>{antwoordTekst(scan.dakkapel)}</dd></div>
                  <div><dt>Garage</dt><dd>{antwoordTekst(scan.garage)}</dd></div>
                  <div><dt>Aanbouw</dt><dd>{antwoordTekst(scan.aanbouw)}</dd></div>
                  <div><dt>Kruipruimte</dt><dd>{antwoordTekst(scan.kruipruimte)}</dd></div>
                  <div><dt>Spouwmuren</dt><dd>{antwoordTekst(scan.spouwmuur)}</dd></div>
                  {dossier.bouwjaar.waarde && <div><dt>Bouwjaar</dt><dd>{dossier.bouwjaar.waarde}</dd></div>}
                  {dossier.woonoppervlakte.waarde && <div><dt>Woonoppervlak</dt><dd>{dossier.woonoppervlakte.waarde} m²</dd></div>}
                </dl>
              </PlanBlok>

              <PlanBlok titel="Jouw wensen" onWijzigen={() => wijzig(STAP.wensen)}>
                <p>{scan.wishes.length ? scan.wishes.join(", ") : scan.wensenOnbekend ? "Weet ik nog niet" : "Nog niets gekozen"}</p>
              </PlanBlok>

              <PlanBlok titel="Wat is al aanwezig?" onWijzigen={() => wijzig(STAP.aanwezig)}>
                <p>{scan.bestaandeMaatregelen.length ? scan.bestaandeMaatregelen.map(id => titelVan(id).naam).join(", ") : scan.aanwezigOnbekend ? "Weet ik niet precies" : "Nog niets aangegeven"}</p>
              </PlanBlok>

              <PlanBlok titel="Wat wil je verbeteren?" onWijzigen={() => wijzig(STAP.verbeteren)}>
                <p>{scan.measures.length ? scan.measures.map(id => titelVan(id).naam).join(", ") : scan.advice ? "Ik wil graag hulp bij het kiezen" : "Nog niets gekozen"}</p>
              </PlanBlok>

              <h3 className="text-2xl font-bold mt-10">Plan een gratis energiescan</h3>
              <p className="text-[17px]">Gratis en vrijblijvend, ter waarde van €350. Een adviseur van Gijs bekijkt je woning en bespreekt je woningplan met je.</p>
              <form onSubmit={e => { e.preventDefault(); setStatus("Je aanvraag staat hieronder klaar als voorbeeld. Er is niets verstuurd. Bel of mail Gijs voor een echte afspraak."); }} aria-describedby="scan-form-status">
                <p id="scan-form-status" className={styles.note}>Dit is een prototype. Verzenden is nog niet aangesloten: je gegevens worden niet naar Gijs verstuurd.</p>
                <label className={styles.field}>Naam<input autoComplete="name" required maxLength={100} value={scan.name} onChange={e => patch({ name: e.target.value })} /></label>
                <label className={styles.field}>E-mailadres of telefoonnummer<input required maxLength={254} value={scan.contact} onChange={e => patch({ contact: e.target.value })} /></label>
                <details className={styles.optioneel}><summary>Bekijk alle gegevens van je aanvraag</summary><div className={styles.preview}>{message}</div></details>
                <Button type="submit" variant="accent" size="lg">Controleer mijn aanvraag · prototype</Button>
                <p role="status" className={styles.note}>{status}</p>
              </form>
              <p className="mt-6 text-[17px]">Liever direct contact? <a className="underline" href={CONTACT.phoneHref}>Bel {CONTACT.phone}</a> of <a className="underline" href={"mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("Gratis energiescan aan huis") + "&body=" + encodeURIComponent(message)}>mail je woningplan</a>.</p>
              <div className={styles.stapActies}>
                <button type="button" className={styles.vorigeKnop} onClick={() => go(STAP.resultaat)}>← Vorige stap</button>
              </div>
            </>
          )}

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
