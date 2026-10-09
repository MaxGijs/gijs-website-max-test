"use client";
import { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWoningDraft } from "./WoningDraftProvider";
import { AFGIFTE_STAAT, HouseViewer, MAATREGEL_STAAT, VERWARMING_STAAT, type HouseFocus } from "./HouseViewer";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import { StapBevestigen } from "./StapBevestigen";
import { WoningtypeRegel, KeuzeRij, OptieToggle, VerbruikVeld } from "./ScanVragen";
import { BeeldKeuze } from "./BeeldKeuze";
import { CONTACT, WHATSAPP_NUMMER } from "@/lib/content/contact";
import { SCAN_TITELS } from "@/lib/content/maatregel-titels";
import { SUBSIDIE_PER_M2 } from "@/lib/content/subsidie-per-m2";
import { MC_BRONNEN } from "@/lib/content/milieu-centraal";
import {
  freshScan, readScan, SCAN_KEY, SCAN_MEASURES, SCAN_GROUPS, SCAN_WISHES, SCAN_STAPPEN, STAP, sameAddress, scanMessage, dakkapelTekst, bewonersTekst,
  VERWARMING_OPTIES, AFGIFTE_OPTIES, WARMWATER_OPTIES, MONUMENT_OPTIES, BEWONERS_OPTIES, VERDIEPINGEN_OPTIES, DAKKAPEL_OPTIES, JA_NEE_OPTIES, HOEK_ZIJDE_OPTIES, VOORKEURSMOMENT_OPTIES,
  gebruiktGas, gebruiktWarmtenet, bereikbareDagen, type ScanSession,
} from "@/lib/scan-session";
import { schatVerbruik, woonsituaties, energiekosten, leesGetal } from "@/lib/energie-schatting";
import { track, logError } from "@/lib/analytics";
import { maakWoningdossier } from "@/lib/woningdossier";
import { slaWoningdossierOp } from "@/lib/woningdossier-opslag";
import { verstuurEnergiescanAanvraag } from "@/lib/energiescan-opslag";
import { Button } from "@/components/ds/core/Button";
import { Checkbox } from "@/components/ds/forms/Checkbox";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import { Stepper } from "@/components/ds/navigation/Stepper";
import styles from "./WoningFlow.module.css";
import { geldigTelefoonnummer } from "@/lib/telefoon";

// Woningscan in drie stappen:
//   1 Jouw woning         adres → foto → "Ja, dit klopt"
//   2 Woning en energie   gegevens, verwarming (beeldkaarten), wat er al is, verbruik en prijzen
//   3 Jouw woningplan     energie nu, mogelijkheden met subsidie, energiescan aanvragen
// Wat al aanwezig is, wordt niet opnieuw als nieuwe maatregel voorgesteld.

const toggleIn = (list: string[], id: string) => list.includes(id) ? list.filter(x => x !== id) : [...list, id];

// Foto per maatregel bij "Wat kun je nog doen?", om vertrouwen te wekken: geen tekening,
// maar een echte foto van het onderdeel. Vloerisolatie toont bewust de kruipruimte:
// dat is voor de meeste mensen de onbekendste plek van de ingreep.
const MAATREGEL_BEELD: Record<string, { src: string; alt: string }> = {
  zonnepanelen: { src: "/images/woningscan/maatregelen/zonnepanelen-dak.jpg", alt: "Zonnepanelen op een dak" },
  dakisolatie: { src: "/images/woningscan/maatregelen/dakisolatie.png", alt: "Dakisolatie tijdens het aanbrengen" },
  warmtepomp: { src: "/images/maatregelen/warmtepomp/warmtepomp-hero.png", alt: "Buitenunit van een warmtepomp" },
  gevelisolatie: { src: "/images/maatregelen/spouwmuurisolatie/spouwmuurisolatie-aanbrengen-gijs.png", alt: "Spouwmuurisolatie wordt aangebracht" },
  vloerisolatie: { src: "/images/woningscan/maatregelen/icynene-vloerisolatie.png", alt: "Vloerisolatie wordt in de kruipruimte aangebracht" },
  "glas-kozijnen": { src: "/images/maatregelen/kozijnen/kozijnen-hero.jpg", alt: "Nieuwe kozijnen met isolatieglas" },
  vloerverwarming: { src: "/images/maatregelen/vloerverwarming/vloerverwarming-hero.png", alt: "Vloerverwarming in de dekvloer" },
  thuisbatterij: { src: "/images/maatregelen/thuisbatterij/thuisbatterij-hero-v2.png", alt: "Thuisbatterij naast de woning" },
};


// Welk scan-veld het (kadaster-afgeleide) oppervlak voor deze maatregel bevat; leeg als niet opgehaald.
// Vloeroppervlakte komt direct van de kadastrale plattegrond; dak- en geveloppervlak zijn een richtwaarde
// daarbovenop (dakhelling en bouwhoogte staan niet in de BAG). Glasoppervlak staat nergens geregistreerd
// en wordt daarom niet berekend, zie de losse noot bij die maatregel.
// Tijdelijk uit: de vierkante meters komen pas terug als de gemiddelde waarden met Thom zijn afgestemd.
const TOON_M2 = false;
const M2_PER_MAATREGEL: Partial<Record<string, keyof ScanSession>> = {
  gevelisolatie: "gevelOppervlakte",
  vloerisolatie: "vloeroppervlakte",
  dakisolatie: "dakoppervlakte",
};


// Korte subsidiemelding voor een keuzerij, voor maatregelen die in SUBSIDIE_PER_M2 als
// subsidiabel staan. Geen bedragen: die wijzigen regelmatig en horen pas in het gesprek
// tijdens de energiescan thuis.
function subsidieKort(id: string) {
  const regels = SUBSIDIE_PER_M2[id];
  if (!regels?.length) return undefined;
  return "Hiervoor is mogelijk subsidie beschikbaar";
}

// Zelfde patroon als EMAIL in lib/woningdossier-opslag.ts; server-only bestanden ("use server")
// kunnen geen gewone constanten exporteren naar een client-component, dus lokaal gedupliceerd.
const EMAIL_PATROON = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const euro = (n: number) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const aantal = (n: string) => { const g = leesGetal(n); return g === null ? n : g.toLocaleString("nl-NL"); };

function Keuzelijst({ id, label, value, opties, onChange, fout }: { id: string; label: string; value: string; opties: string[]; onChange: (v: string) => void; fout?: string }) {
  return (
    <Field label={label} htmlFor={id} error={fout}>
      <select id={id} className={`gijs-input ${fout ? "gijs-input--invalid" : ""}`} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Kies een optie</option>
        {opties.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}

type Fouten = Partial<Record<"verwarming" | "bewoners" | "stroom" | "gas" | "warmte", string>>;

export function WoningFlow({ initialHouseType, initialPostcode, initialHuisnummer, initialMeasure }: { initialHouseType?: HouseType; initialPostcode: string; initialHuisnummer: string; initialMeasure?: string }) {
  const { draft, setDraft } = useWoningDraft();
  const [scan, setScan] = useState<ScanSession>(() => freshScan(initialPostcode || draft.postcode, initialHuisnummer || draft.huisnummer, initialHouseType || draft.houseType));
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmNew, setConfirmNew] = useState(false);
  const [fouten, setFouten] = useState<Fouten>({});
  const [aanvraagFouten, setAanvraagFouten] = useState<{ voornaam?: string; achternaam?: string; email?: string; telefoon?: string }>({});
  const [versturen, setVersturen] = useState(false);
  const [woonsituatieId, setWoonsituatieId] = useState<string | undefined>();
  const [mobiel, setMobiel] = useState(false);
  const [woningUitgeklapt, setWoningUitgeklapt] = useState(false);
  // Welke vraag nu actief is: stuurt de camera van de 3D-woning naar het bijbehorende onderdeel (zie
  // HouseViewer's `focus`-prop). Puur een UI-keuze, dus geen onderdeel van de opgeslagen scanstate;
  // bij een stapwissel (zie go/wijzig/terugNaarPlan hieronder) heeft een vorige focus geen betekenis meer.
  // rondom: bij de vinkjes "Welke stappen heb je al gezet?" blijft de hele woning in beeld en draait
  // de camera eromheen (het onderdeel licht op); bij de vragen zoomt hij in op het onderdeel.
  const [kijk, setKijk] = useState<{ focus: HouseFocus; rondom: boolean }>({ focus: null, rondom: false });
  const focus = kijk.focus;
  const setFocus = (f: HouseFocus, rondom = false) => setKijk({ focus: f, rondom });
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobiel(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const fieldId = useId();
  const honeypotRef = useRef<HTMLInputElement>(null);
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
    // Vanaf een maatregelpagina ("Start de woningscan"): die maatregel staat alvast aangevinkt in het plan.
    if (initialMeasure && SCAN_MEASURES.some(m => m.id === initialMeasure) && !restored.bestaandeMaatregelen.includes(initialMeasure)) {
      restored.measures = [...new Set([...restored.measures, initialMeasure])];
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

  // Supabase-opslag bij elke stapwissel (en bij het terugladen): steeds hetzelfde dossier bijwerken.
  // sessionStorage blijft de bron tijdens de scan; mislukt opslaan, dan loopt de scan gewoon door.
  const huidigeScan = useRef(scan);
  useEffect(() => { huidigeScan.current = scan; }, [scan]);
  useEffect(() => {
    if (!ready) return;
    const s = huidigeScan.current;
    if (!s.woningBevestigd || !s.dossierId) return;
    slaWoningdossierOp(JSON.stringify(s), s.scanAfgerond).catch(() => { /* optioneel; sessionStorage is de fallback */ });
  }, [ready, scan.step, scan.dossierId]);

  const patch = (p: Partial<ScanSession>) => { setStatus(""); setScan(s => ({ ...s, ...p })); };
  const go = (step: number) => { scroll.current = true; setFocus(null); setScan(s => ({ ...s, step, reached: Math.max(s.reached, step) })); };
  // Vanuit het woningplan: spring gericht terug en kom daarna in één klik terug.
  const wijzig = (step: number) => { scroll.current = true; setFocus(null); setScan(s => ({ ...s, step, terugNaarPlan: true })); };
  const terugNaarPlan = () => { scroll.current = true; setFocus(null); setScan(s => ({ ...s, step: STAP.plan, reached: STAP.plan, terugNaarPlan: false })); };
  const message = scanMessage(scan);
  if (!ready) return <p className="p-8" role="status">Je woningscan wordt klaargezet…</p>;

  const dossier = maakWoningdossier({
    adres: { postcode: scan.postcode, huisnummer: scan.huisnummer, label: scan.addressLabel, handmatig: scan.manualAddress },
    houseType: scan.houseType,
    dakkapel: scan.dakkapel, dakkapelAantal: scan.dakkapelAantal, garage: scan.garage, aanbouw: scan.aanbouw,
    kruipruimte: scan.kruipruimte, spouwmuur: scan.spouwmuur,
    bouwjaar: scan.bouwjaar, bagOpgehaald: scan.bagOpgehaald, woonoppervlakte: scan.woonoppervlakte, monument: scan.monument,
    wensen: scan.wishes, wensenOnbekend: scan.wensenOnbekend,
    verwarming: scan.verwarming, warmWater: scan.warmWater,
    warmteafgifte: scan.warmteafgifte,
    bestaandeMaatregelen: scan.bestaandeMaatregelen, aanwezigOnbekend: scan.aanwezigOnbekend,
    gewenstMaatregelen: scan.measures,
  });

  // Verwarmt de woning al met een (hybride) warmtepomp, dan staat de buitenunit er ook.
  const heeftWarmtepomp = scan.verwarming.some(v => VERWARMING_STAAT[v] === "pomp");
  // Idem voor vloerverwarming als afgiftesysteem: dan liggen de leidingen in de vloer.
  const heeftVloerverwarming = scan.warmteafgifte.some(v => AFGIFTE_STAAT[v] === "vloerverwarming");
  const zichtbareMaatregelen = [...new Set([...scan.bestaandeMaatregelen, ...scan.measures, ...(heeftWarmtepomp ? ["warmtepomp"] : []), ...(heeftVloerverwarming ? ["vloerverwarming"] : [])])];
  // Dakkapel/garage zijn van buitenaf te zien: alleen "Geen"/"Nee" haalt het onderdeel uit de illustratieve weergave.
  // "Meerdere" toont er 2: meer dakkapellen kan de illustratieve woning niet laten zien.
  const dakkapelAantal = scan.dakkapel === "Geen" || !scan.dakkapel ? 0 : scan.dakkapel === "1" ? 1 : 2;
  const compact = mobiel && !woningUitgeklapt;
  const viewer = (
    <HouseViewer
      selectedMeasureIds={zichtbareMaatregelen}
      dakkapelAantal={dakkapelAantal}
      garageAanwezig={scan.garage !== "Nee"}
      aanbouwAanwezig={scan.aanbouw !== "Nee"}
      hoekZijde={scan.houseType === "hoekwoning" ? ((scan.hoekZijde || "Links") as "Links" | "Rechts") : undefined}
      compact={compact}
      vol={!mobiel && scan.step === STAP.gegevens}
      focus={focus}
      onFocusChange={f => setFocus(f)}
      rondom={kijk.rondom}
      verwarming={scan.verwarming}
      afgifte={scan.warmteafgifte}
      kruipruimte={scan.kruipruimte}
      spouwmuur={scan.spouwmuur}
      onBekijkWoning={() => setWoningUitgeklapt(true)}
    />
  );
  // Mobiel: woning blijft als compacte sticky balk zichtbaar tijdens het scrollen door de
  // vragen/het plan (sectie 7/8 van de opdracht), i.p.v. bovenaan te verdwijnen. "Bekijk
  // woning" klapt dezelfde viewer tijdelijk groter uit, in de normale paginaflow (niet sticky),
  // met een "Verklein"-knop om weer compact te maken. Desktop: ongewijzigd (styles.grid regelt
  // de sticky kolom al via CSS).
  const woningWeergave = mobiel ? (
    <div className={compact ? styles.woningSticky : styles.woningUitgeklapt}>
      {viewer}
      {!compact && <button type="button" className={styles.tekstLink} onClick={() => setWoningUitgeklapt(false)}>Verklein woningweergave</button>}
    </div>
  ) : viewer;
  const setHouseType = (houseType: HouseType) => patch({ houseType, woningtypeBron: "handmatig" });
  const setAutoHouseType = (houseType: HouseType) => patch({ houseType, woningtypeBron: "automatisch" });
  const titelVan = (id: string) => SCAN_TITELS[id] ?? { naam: SCAN_MEASURES.find(m => m.id === id)?.label ?? id, titel: "", uitleg: "", slug: "", cta: "" };

  const gas = gebruiktGas(scan.verwarming);
  const warmtenet = gebruiktWarmtenet(scan.verwarming);
  const schatting = scan.aantalBewoners && scan.verwarming
    ? schatVerbruik({ houseType: scan.houseType, aantalBewoners: scan.aantalBewoners, verwarming: scan.verwarming, bestaandeMaatregelen: scan.bestaandeMaatregelen, woonsituatieId })
    : null;
  const kosten = energiekosten(scan);
  const nieuweMaatregelen = SCAN_MEASURES.filter(m => !scan.bestaandeMaatregelen.includes(m.id));

  function valideer(): Fouten {
    const f: Fouten = {};
    if (!scan.verwarming.length) f.verwarming = "Kies hoe je woning verwarmd wordt (je kunt meerdere opties kiezen).";
    if (!scan.aantalBewoners) f.bewoners = "Kies met hoeveel mensen je in huis woont.";
    if (leesGetal(scan.elektriciteitsverbruik) === null) f.stroom = "Vul je stroomverbruik in, of kies Help me schatten.";
    if (gas && leesGetal(scan.gasverbruik) === null) f.gas = "Vul je gasverbruik in, of kies Help me schatten.";
    if (warmtenet && leesGetal(scan.warmteverbruik) === null) f.warmte = "Vul je warmteverbruik in, of kies Help me schatten.";
    return f;
  }
  const naarPlan = () => {
    const f = valideer();
    setFouten(f);
    const eerste = (["verwarming", "bewoners", "stroom", "gas", "warmte"] as const).find(k => f[k]);
    if (eerste) { document.getElementById(`${fieldId}-${eerste}`)?.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    if (!scan.terugNaarPlan) track({ name: "scan_completed" });
    if (scan.terugNaarPlan) terugNaarPlan(); else go(STAP.plan);
  };

  async function verstuurAanvraag(e: React.FormEvent) {
    e.preventDefault();
    // Voornaam, achternaam, e-mailadres en telefoonnummer zijn alle vier verplicht.
    const fouten = {
      voornaam: scan.name.trim() ? undefined : "Vul je voornaam in.",
      achternaam: scan.achternaam.trim() ? undefined : "Vul je achternaam in.",
      email: EMAIL_PATROON.test(scan.email.trim()) ? undefined : scan.email.trim() ? "Vul een geldig e-mailadres in." : "Vul je e-mailadres in.",
      telefoon: geldigTelefoonnummer(scan.telefoon) ? undefined : scan.telefoon.trim() ? "Vul een geldig telefoonnummer in, bijvoorbeeld 06 12345678." : "Vul je telefoonnummer in.",
    };
    setAanvraagFouten(fouten);
    if (Object.values(fouten).some(Boolean)) return;
    setVersturen(true);
    setStatus("");
    const sessieMetAfgerond = { ...scan, scanAfgerond: true };
    const { verstuurd, fout } = await verstuurEnergiescanAanvraag(JSON.stringify(sessieMetAfgerond), honeypotRef.current?.value)
      .catch((error) => { logError("energiescan_aanvraag", error); return { verstuurd: false, fout: "De aanvraag kon niet worden opgeslagen. Bel of mail Gijs voor een echte afspraak." }; });
    setVersturen(false);
    // Na een geslaagde aanvraag staan deze gegevens al veilig in Supabase; de
    // succesmelding hieronder toont ze niet meer, dus hoeven ze niet langer
    // in sessionStorage te blijven staan.
    if (verstuurd) { track({ name: "energy_scan_requested" }); setScan({ ...sessieMetAfgerond, name: "", achternaam: "", email: "", telefoon: "", opmerking: "" }); return; }
    logError("energiescan_aanvraag", fout ?? "onbekende fout");
    setStatus(fout ?? "De aanvraag kon niet worden opgeslagen. Bel of mail Gijs voor een echte afspraak.");
  }

  return (
    <div className={styles.flow}>
      {/* Titel en basisuitleg staan nu server-side in app/woning/page.tsx (vóór
          deze client-component), zodat ze altijd in de HTML staan, ongeacht
          scanstap. Dit kickertje met icoon blijft hier, om duplicatie van die
          tekst te voorkomen. */}
      {scan.step === STAP.woning && <header className={styles.intro}>
        <p className="font-semibold">Jouw digitale woningscan</p>
      </header>}
      <Stepper steps={[...SCAN_STAPPEN]} current={scan.step} className={styles.stepper} />
      <p className={styles.stapTeller}>Stap {scan.step + 1} van {SCAN_STAPPEN.length}</p>
      {/* Stap 1: geen zichtbare kop "Jouw woning" (na "Stap 1 van 3" volgt direct "Gevonden! Is dit jouw
          woning?"); de kop blijft wel voor schermlezers en als focuspunt bij het wisselen van stap. */}
      <h2 ref={heading} tabIndex={-1} className={scan.step === STAP.woning ? "sr-only" : styles.heading}>{SCAN_STAPPEN[scan.step]}</h2>

      {scan.step === STAP.woning && (
        <StapBevestigen
          postcode={scan.postcode} huisnummer={scan.huisnummer}
          houseType={scan.houseType} woningtypeBron={scan.woningtypeBron}
          onHouseTypeChange={setHouseType} onAutoHouseType={setAutoHouseType}
          onAdresSubmit={(postcode, huisnummer) => patch({ postcode, huisnummer, addressLabel: "", woningBevestigd: false })}
          onBevestig={(addressLabel, manual = false, bag, epOnline) => {
            if (!scan.dossierId) track({ name: "scan_started" });
            patch({
              addressLabel, manualAddress: manual, woningBevestigd: true,
              dossierId: scan.dossierId || crypto.randomUUID(),
              // Alleen invullen als de bewoner dit nog niet zelf had ingevuld.
              bouwjaar: scan.bouwjaar || bag?.bouwjaar || "",
              woonoppervlakte: scan.woonoppervlakte || bag?.woonoppervlakte || "",
              bagOpgehaald: !!bag && (!scan.bouwjaar || !scan.woonoppervlakte),
              vloeroppervlakte: bag?.vloeroppervlakte || "",
              dakoppervlakte: bag?.dakoppervlakte || "",
              gevelOppervlakte: bag?.gevelOppervlakte || "",
              energielabel: scan.energielabel || epOnline?.energieklasse || "",
            });
            if (scan.terugNaarPlan) terugNaarPlan(); else go(STAP.gegevens);
          }}
        />
      )}

      {scan.step === STAP.gegevens && (
        <div className={styles.grid}>
          {woningWeergave}
          <div className={styles.panel}>
            <p className={styles.uitleg}>Controleer je woning en vul je verbruik in. Daarna zie je direct je woningplan.</p>

            <section className={styles.sectie}>
              <h3 className={styles.sectieKop}>Zijn de gegevens juist?</h3>
              <WoningtypeRegel houseType={scan.houseType} onChange={setHouseType} />
              {scan.bagOpgehaald && <p className={styles.bagNoot}>Bouwjaar en woonoppervlakte zijn automatisch opgehaald uit het Kadaster (BAG). Klopt het niet? Pas het gerust aan.</p>}
              <div className={styles.veldRaster}>
                <Field label="Bouwjaar" htmlFor={`${fieldId}-bouwjaar`}><Input id={`${fieldId}-bouwjaar`} inputMode="numeric" value={scan.bouwjaar} onChange={e => patch({ bouwjaar: e.target.value, bagOpgehaald: false })} /></Field>
                <Field label="Woonoppervlakte" htmlFor={`${fieldId}-oppervlak`}><Input id={`${fieldId}-oppervlak`} inputMode="numeric" suffix="m²" className="pr-12" value={scan.woonoppervlakte} onChange={e => patch({ woonoppervlakte: e.target.value, bagOpgehaald: false })} /></Field>
                <Keuzelijst id={`${fieldId}-monument`} label="Monument" value={scan.monument} opties={MONUMENT_OPTIES} onChange={monument => patch({ monument })} />
              </div>
              <div className={styles.veldRaster}>
                <div onFocus={() => setFocus("kruipruimte")}><KeuzeRij vraag="Kruipruimte" waarde={scan.kruipruimte} onChange={kruipruimte => patch({ kruipruimte })} /></div>
                {/* Afspraak met Gijs: bij een bouwjaar na 1995 wordt de spouwmuurvraag niet gesteld. */}
                {!((Number(scan.bouwjaar) || 0) > 1995) && <div onFocus={() => setFocus("spouwmuur")}><KeuzeRij vraag="Spouwmuren" waarde={scan.spouwmuur} onChange={spouwmuur => patch({ spouwmuur })} /></div>}
                <div onFocus={() => setFocus("dakkapel", true)}>
                  <OptieToggle vraag="Dakkapel" opties={DAKKAPEL_OPTIES} waarde={scan.dakkapel} onChange={dakkapel => patch({ dakkapel })}
                    namelijk={{ trigger: "Meerdere", waarde: scan.dakkapelAantal, onChange: dakkapelAantal => patch({ dakkapelAantal }) }} />
                </div>
                <div onFocus={() => setFocus("garage", true)}><OptieToggle vraag="Garage" opties={JA_NEE_OPTIES} waarde={scan.garage} onChange={garage => patch({ garage })} /></div>
                <div onFocus={() => setFocus("aanbouw", true)}><OptieToggle vraag="Aanbouw" opties={JA_NEE_OPTIES} waarde={scan.aanbouw} onChange={aanbouw => patch({ aanbouw })} /></div>
                {scan.houseType === "hoekwoning" && (
                  <OptieToggle vraag="Buurwoning" uitleg="Aan welke kant, gezien vanaf de straat?" opties={HOEK_ZIJDE_OPTIES} waarde={scan.hoekZijde || "Links"} onChange={hoekZijde => patch({ hoekZijde })} />
                )}
              </div>
            </section>

            <section className={styles.sectie}>
              <h3 className={styles.sectieKop}>Over je verwarming en warm water</h3>
              <p className={styles.uitleg}>Je kunt bij elke vraag meerdere opties kiezen: sommige woningen hebben bijvoorbeeld zowel een cv-ketel als een houtkachel.</p>
              <div id={`${fieldId}-verwarming`}>
                <BeeldKeuze legend="Hoe wordt je woning verwarmd?" opties={VERWARMING_OPTIES} waarde={scan.verwarming} onChange={verwarming => {
                  // Gekozen verwarming: de camera draait om de woning naar het toestel, dat oplicht.
                  const nieuw = verwarming.find(v => !scan.verwarming.includes(v));
                  const weg = scan.verwarming.find(v => !verwarming.includes(v));
                  if (nieuw && VERWARMING_STAAT[nieuw]) setFocus(VERWARMING_STAAT[nieuw] as HouseFocus, true);
                  else if (weg && focus === VERWARMING_STAAT[weg]) setFocus(null);
                  patch({ verwarming }); setFouten(f => ({ ...f, verwarming: undefined }));
                }} verplicht
                  anders={{ waarde: scan.verwarmingAnders, onChange: verwarmingAnders => patch({ verwarmingAnders }) }} />
                {fouten.verwarming && <p className="gijs-error mt-2">{fouten.verwarming}</p>}
              </div>
              <BeeldKeuze legend="Hoe wordt de warmte afgegeven?" uitleg="Lage-temperatuurradiatoren zijn extra grote radiatoren die ook op een lagere temperatuur voldoende warmte afgeven; dat past goed bij een warmtepomp." opties={AFGIFTE_OPTIES} waarde={scan.warmteafgifte} onChange={warmteafgifte => {
                  // Gekozen afgifte: de camera draait om de woning en radiatoren, vloerverwarming of convectorputten lichten op.
                  const nieuw = warmteafgifte.find(v => !scan.warmteafgifte.includes(v));
                  const weg = scan.warmteafgifte.find(v => !warmteafgifte.includes(v));
                  if (nieuw && AFGIFTE_STAAT[nieuw]) setFocus(AFGIFTE_STAAT[nieuw] as HouseFocus, true);
                  else if (weg && focus === AFGIFTE_STAAT[weg]) setFocus(null);
                  patch({ warmteafgifte });
                }}
                anders={{ waarde: scan.warmteafgifteAnders, onChange: warmteafgifteAnders => patch({ warmteafgifteAnders }) }} />
              <OptieToggle kop vraag="Welke verdiepingen verwarm je?" opties={VERDIEPINGEN_OPTIES} waarde={scan.verwarmdeVerdiepingen} onChange={verwarmdeVerdiepingen => patch({ verwarmdeVerdiepingen })} />
              <BeeldKeuze legend="Warm water in de badkamer voor" opties={WARMWATER_OPTIES} waarde={scan.warmWater} onChange={warmWater => patch({ warmWater })} />
            </section>

            <section className={styles.sectie}>
              <h3 className={styles.sectieKop}>Welke stappen heb je al gezet?</h3>
              <p className={styles.uitleg}>{scan.bouwjaar ? `Je woning is gebouwd in ${scan.bouwjaar}, maar misschien is er intussen al verduurzaamd. ` : ""}Vink aan wat je al hebt.</p>
              <div className={styles.chipRaster}>
                {SCAN_MEASURES.map(m => (
                  <Checkbox key={m.id} card label={titelVan(m.id).naam}
                    checked={scan.bestaandeMaatregelen.includes(m.id)}
                    onChange={() => {
                      const bestaand = toggleIn(scan.bestaandeMaatregelen, m.id);
                      patch({ bestaandeMaatregelen: bestaand, aanwezigOnbekend: false, measures: scan.measures.filter(id => !bestaand.includes(id)) });
                      // Scanantwoord → camerastaat: het onderdeel verschijnt en de camera gaat ernaartoe.
                      const staat = MAATREGEL_STAAT[m.id] as HouseFocus | undefined;
                      if (staat && bestaand.includes(m.id)) setFocus(staat, true);
                      else if (staat && focus === staat) setFocus(null);
                    }}
                  />
                ))}
                <Checkbox card label="Ik weet het niet precies" checked={scan.aanwezigOnbekend} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ aanwezigOnbekend: e.target.checked })} />
              </div>
              {scan.bestaandeMaatregelen.includes("zonnepanelen") && (
                <Field label="Hoeveel zonnepanelen liggen er al? (optioneel)" className={styles.zonnepanelenVeld} htmlFor={`${fieldId}-panelen`}>
                  <Input id={`${fieldId}-panelen`} inputMode="numeric" value={scan.zonnepanelenAantal} onChange={e => patch({ zonnepanelenAantal: e.target.value })} onFocus={() => setFocus("zon")} />
                </Field>
              )}
            </section>

            <section className={styles.sectie}>
              <h3 className={styles.sectieKop}>Laatste vragen voor je woningplan</h3>
              <div className={styles.veldRaster}>
                <div id={`${fieldId}-bewoners`}>
                  <OptieToggle vraag="Aantal bewoners" opties={BEWONERS_OPTIES} waarde={scan.aantalBewoners}
                    onChange={aantalBewoners => { patch({ aantalBewoners }); setWoonsituatieId(undefined); setFouten(f => ({ ...f, bewoners: undefined })); }}
                    namelijk={{ trigger: "Meer", waarde: scan.aantalBewonersAantal, onChange: aantalBewonersAantal => patch({ aantalBewonersAantal }) }} />
                  {fouten.bewoners && <p className="gijs-error mt-2">{fouten.bewoners}</p>}
                </div>
              </div>
              {!schatting && <p className={styles.note}>Kies je verwarming en het aantal bewoners, dan helpen we je verbruik te schatten.</p>}
              <div className={styles.veldRaster}>
                <div id={`${fieldId}-stroom`}>
                  <VerbruikVeld id={`${fieldId}-stroom-veld`} label="Elektriciteitsverbruik" eenheid="kWh/jaar" waarde={scan.elektriciteitsverbruik} schatting={schatting?.stroom ?? null} fout={fouten.stroom}
                    onChange={elektriciteitsverbruik => { patch({ elektriciteitsverbruik }); setFouten(f => ({ ...f, stroom: undefined })); }} />
                </div>
                {gas && (
                  <div id={`${fieldId}-gas`}>
                    <VerbruikVeld id={`${fieldId}-gas-veld`} label="Gasverbruik" eenheid="m³/jaar" waarde={scan.gasverbruik} schatting={schatting?.gas ?? null} fout={fouten.gas}
                      onChange={gasverbruik => { patch({ gasverbruik }); setFouten(f => ({ ...f, gas: undefined })); }} />
                  </div>
                )}
                {warmtenet && (
                  <div id={`${fieldId}-warmte`}>
                    <VerbruikVeld id={`${fieldId}-warmte-veld`} label="Warmteverbruik" eenheid="GJ/jaar" waarde={scan.warmteverbruik} schatting={schatting?.warmte ?? null} fout={fouten.warmte}
                      onChange={warmteverbruik => { patch({ warmteverbruik }); setFouten(f => ({ ...f, warmte: undefined })); }} />
                  </div>
                )}
              </div>
              {scan.bestaandeMaatregelen.includes("zonnepanelen") && <p className={styles.note}>Je hebt zonnepanelen. De schatting houdt geen rekening met eigen opwek; vul bij voorkeur het verbruik van je jaarafrekening in.</p>}
              {schatting && (
                <details className={styles.bron}>
                  <summary>Waar is de schatting op gebaseerd?</summary>
                  <ul>{schatting.uitleg.map(regel => <li key={regel}>{regel}</li>)}</ul>
                  <Field label="Past een andere omschrijving beter bij je woning?" htmlFor={`${fieldId}-woonsituatie`}>
                    <select id={`${fieldId}-woonsituatie`} className="gijs-input" value={schatting.woonsituatie.id} onChange={e => setWoonsituatieId(e.target.value)}>
                      {woonsituaties(scan.aantalBewoners).map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
                    </select>
                  </Field>
                  <p>Bron: <a href={MC_BRONNEN.gemiddeld} target="_blank" rel="noopener noreferrer">Milieu Centraal, gemiddeld energieverbruik</a>, <a href={MC_BRONNEN.hybride} target="_blank" rel="noopener noreferrer">hybride warmtepomp</a> en <a href={MC_BRONNEN.volledig} target="_blank" rel="noopener noreferrer">volledige warmtepomp</a>.</p>
                </details>
              )}
              <div className={styles.veldRaster}>
                <Field label="Stroomprijs" htmlFor={`${fieldId}-stroomprijs`}><Input id={`${fieldId}-stroomprijs`} inputMode="decimal" suffix="€/kWh" className="pr-20" value={scan.elektriciteitsprijs} onChange={e => patch({ elektriciteitsprijs: e.target.value })} /></Field>
                {gas && <Field label="Gasprijs" htmlFor={`${fieldId}-gasprijs`}><Input id={`${fieldId}-gasprijs`} inputMode="decimal" suffix="€/m³" className="pr-20" value={scan.gasprijs} onChange={e => patch({ gasprijs: e.target.value })} /></Field>}
                {warmtenet && <Field label="Prijs stadsverwarming" htmlFor={`${fieldId}-warmteprijs`}><Input id={`${fieldId}-warmteprijs`} inputMode="decimal" suffix="€/GJ" className="pr-20" value={scan.warmteprijs} onChange={e => patch({ warmteprijs: e.target.value })} /></Field>}
              </div>
              <p className={styles.note}>Prijzen staan vooringevuld met een gemiddelde: stroom volgens <a className="underline" href={MC_BRONNEN.prijzen} target="_blank" rel="noopener noreferrer">Milieu Centraal</a> (januari 2026){gas ? ", gas € 1,42 per m³" : ""}{warmtenet ? " en de prijs voor stadsverwarming van Gijs" : ""}. Pas ze aan naar je eigen contract.</p>
            </section>

            <section className={styles.sectie}>
              <h3 className={styles.sectieKop}>Wat is voor jou belangrijk? <span className={styles.optioneelLabel}>optioneel</span></h3>
              <div className={styles.wishes}>
                {SCAN_WISHES.map(w => (
                  <label key={w}><input type="checkbox" checked={scan.wishes.includes(w)} onChange={() => patch({ wishes: toggleIn(scan.wishes, w), wensenOnbekend: false })} />{w}</label>
                ))}
                <label><input type="checkbox" checked={scan.wensenOnbekend} onChange={e => patch({ wensenOnbekend: e.target.checked, wishes: e.target.checked ? [] : scan.wishes })} />Weet ik nog niet</label>
              </div>
            </section>

            <div className={styles.stapActies}>
              <Button variant="primary" size="lg" iconRight="arrow-right" onClick={naarPlan}>{scan.terugNaarPlan ? "Terug naar mijn woningplan" : "Bekijk mijn woningplan"}</Button>
              {Object.values(fouten).some(Boolean) && <p className="gijs-error" role="alert">Vul de gemarkeerde velden in om je woningplan te zien.</p>}
              {!scan.terugNaarPlan && <button type="button" className={styles.vorigeKnop} onClick={() => go(STAP.woning)}>← Vorige stap</button>}
            </div>
          </div>
        </div>
      )}

      {scan.step === STAP.plan && (
        <div className={styles.plan}>
          <aside className={styles.planZij}>
            <section className={styles.samenvatting}>
              <div className={styles.samenvattingKop}>
                <h3>Wat je nu betaalt aan energie</h3>
                <button type="button" className={styles.tekstLink} onClick={() => wijzig(STAP.gegevens)}>Wijzigen<span className="sr-only"> energiegegevens</span></button>
              </div>
              {kosten && <p className={styles.kosten}>± {euro(kosten.totaal)} <span>per jaar</span></p>}
              <dl className={styles.kerncijfers}>
                <div><dt>Stroom</dt><dd>{aantal(scan.elektriciteitsverbruik)} kWh</dd></div>
                {gas && <div><dt>Gas</dt><dd>{aantal(scan.gasverbruik)} m³</dd></div>}
                {warmtenet && <div><dt>Warmte</dt><dd>{aantal(scan.warmteverbruik)} GJ</dd></div>}
              </dl>
              {kosten && <p className={styles.kleineNoot}>Dit is een schatting: je verbruik keer de prijs per eenheid. Vaste kosten en belastingteruggave zitten hier dus niet bij.</p>}
            </section>
            <section className={styles.samenvatting}>
              <div className={styles.samenvattingKop}>
                <h3>Jouw woning, kort samengevat</h3>
                <button type="button" className={styles.tekstLink} onClick={() => wijzig(STAP.gegevens)}>Wijzigen<span className="sr-only"> woninggegevens</span></button>
              </div>
              <dl className={styles.woningLijst}>
                <div><dt>Adres</dt><dd>{scan.addressLabel || `${scan.postcode} ${scan.huisnummer}`}</dd></div>
                <div><dt>Soort woning</dt><dd>{HOUSE_MODELS[scan.houseType].label}{dossier.bouwjaar.waarde ? `, gebouwd in ${dossier.bouwjaar.waarde}` : ""}</dd></div>
                <div><dt>Verwarming</dt><dd>{(scan.verwarming.includes("Anders") && scan.verwarmingAnders.trim() ? scan.verwarming.map(w => w === "Anders" ? `Anders: ${scan.verwarmingAnders.trim()}` : w) : scan.verwarming).join(", ") || "Niet ingevuld"}</dd></div>
                <div><dt>Dakkapel</dt><dd>{dakkapelTekst(scan)}</dd></div>
                <div><dt>Garage / aanbouw</dt><dd>{scan.garage || "Niet ingevuld"} / {scan.aanbouw || "Niet ingevuld"}</dd></div>
                <div><dt>Aantal bewoners</dt><dd>{bewonersTekst(scan)}</dd></div>
                <div><dt>Wat je al hebt gedaan</dt><dd>{scan.bestaandeMaatregelen.length ? scan.bestaandeMaatregelen.map(id => titelVan(id).naam).join(", ") : scan.aanwezigOnbekend ? "Weet ik niet precies" : "Nog niets"}</dd></div>
              </dl>
            </section>
            {mobiel ? woningWeergave : <details className={styles.planViewer}><summary>Bekijk de woningweergave</summary>{viewer}</details>}
          </aside>

          <div className={styles.planHoofd}>
            <section>
              <h3 className={styles.planTitel}>Wat kun je nog doen?</h3>
              <p className={styles.uitleg}>{nieuweMaatregelen.length ? "Vink aan waar je meer over wilt weten. Gijs bespreekt het met je tijdens de energiescan." : "Je hebt alle maatregelen al. Gijs denkt graag met je mee over de volgende stap."}</p>
              {SCAN_GROUPS.map(group => {
                const items = nieuweMaatregelen.filter(m => group.ids.includes(m.id));
                if (!items.length) return null;
                return (
                  <div key={group.label} className={styles.keuzeGroep}>
                    <h4>{group.label}</h4>
                    <ul className={styles.keuzeRijen}>
                      {items.map(m => {
                        const t = titelVan(m.id);
                        const beeld = MAATREGEL_BEELD[m.id];
                        const m2 = M2_PER_MAATREGEL[m.id] ? scan[M2_PER_MAATREGEL[m.id]!] : "";
                        const label = TOON_M2 && m2 ? `${m2} m² ${t.naam.toLowerCase()}` : t.naam;
                        const glasNoot = m.id === "glas-kozijnen" ? "Glasoppervlak wordt tijdens de energiescan bij je thuis gemeten." : "";
                        const beschrijving = [subsidieKort(m.id), glasNoot].filter(Boolean).join(" · ") || undefined;
                        return (
                          <li key={m.id} className={styles.keuzeRij}>
                            {beeld && <Image src={beeld.src} alt={beeld.alt} width={224} height={224} quality={100} className={styles.keuzeBeeld} />}
                            <Checkbox card label={label} description={beschrijving} checked={scan.measures.includes(m.id)} onChange={() => patch({ measures: toggleIn(scan.measures, m.id) })} />
                            {t.slug && <Link className={styles.infoLink} href={`/maatregelen/${t.slug}`}>Meer info<span className="sr-only"> over {t.naam.toLowerCase()}</span></Link>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              <ul className={styles.keuzeRijen}>
                <li className={styles.keuzeRij}><Checkbox card label="Ik wil iets wijzigen aan wat ik al heb" checked={scan.advice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ advice: e.target.checked })} /></li>
              </ul>
              {/* Aangevinkt: kies (als er al iets is) waar het om gaat en vul in wat je wilt wijzigen. */}
              {scan.advice && (
                <div className={styles.wijzigBlok}>
                  {scan.bestaandeMaatregelen.length > 0 && (
                    <fieldset className="min-w-0 border-0 p-0">
                      <legend className="gijs-label mb-2">Waar gaat het om?</legend>
                      <div className={styles.keuzeLijst}>
                        {scan.bestaandeMaatregelen.map(id => <Checkbox key={id} card label={titelVan(id).naam} checked={scan.measures.includes(id)} onChange={() => patch({ measures: toggleIn(scan.measures, id) })} />)}
                      </div>
                    </fieldset>
                  )}
                  <Field label="Wat wil je wijzigen?" htmlFor={`${fieldId}-wijzig`}>
                    <textarea id={`${fieldId}-wijzig`} className="gijs-textarea" maxLength={500} placeholder="Bijvoorbeeld: ik heb al spouwmuurisolatie, maar ben er niet tevreden over."
                      value={scan.wijzigToelichting} onChange={e => patch({ wijzigToelichting: e.target.value })} />
                  </Field>
                </div>
              )}
              {nieuweMaatregelen.some(m => SUBSIDIE_PER_M2[m.id]) && <p className={styles.kleineNoot}>Voor sommige van deze maatregelen is subsidie beschikbaar. De voorwaarden en bedragen kunnen wijzigen; tijdens de energiescan bespreken we welke mogelijkheden op dat moment voor jouw woning gelden. Gijs helpt bij de aanvraag, maar kan toekenning niet garanderen. Meer weten? Bekijk de <Link className="underline" href="/kennis#subsidies">uitleg over subsidies en financiering</Link> of de <Link className="underline" href="/subsidiecheck">subsidiecheck</Link>.</p>}
              {TOON_M2 && (scan.vloeroppervlakte || scan.dakoppervlakte || scan.gevelOppervlakte) && <p className={styles.kleineNoot}>Vloeroppervlak komt van de kadastrale plattegrond van je woning; dak- en geveloppervlak zijn een richtwaarde daarbovenop. Gijs meet de precieze maten tijdens de energiescan.</p>}
              {/* Sectie 27 van de opdracht: ruimte gereserveerd voor mogelijke invloed op
                  woningwaarde en indicatieve terugverdientijd, bewust zonder cijfers zolang
                  daarvoor geen betrouwbare rekenregels/data bestaan ("menselijke input nodig"). */}
              {nieuweMaatregelen.length > 0 && <p className={styles.kleineNoot}>Sommige maatregelen kunnen ook invloed hebben op je wooncomfort, energiekosten en mogelijk je woningwaarde. Gijs bespreekt tijdens de energiescan wat voor jouw woning realistisch is.</p>}
              <button type="button" className={styles.tekstLink} onClick={() => { const el = document.getElementById(`${fieldId}-opmerking`); el?.scrollIntoView({ block: "center", behavior: "smooth" }); (el as HTMLTextAreaElement | null)?.focus(); }}>
                Iets anders bespreken?<span className="sr-only"> Ga naar het opmerkingenveld bij je aanvraag.</span>
              </button>
            </section>

            <section className={styles.aanvraag}>
              <h3 className={styles.planTitel}>Vraag een gratis energiescan aan</h3>
              <div className={styles.woningSamenvatting}>
                <p className={styles.woningSamenvattingLabel}>Voor deze woning</p>
                <p className={styles.woningSamenvattingAdres}>{scan.addressLabel || `${scan.postcode} ${scan.huisnummer}`}</p>
                <div className={styles.woningSamenvattingRij}>
                  <p>{HOUSE_MODELS[scan.houseType].label}</p>
                  <button type="button" className={styles.tekstLink} onClick={() => wijzig(STAP.gegevens)}>Bekijk woninggegevens</button>
                </div>
              </div>
              <p className={styles.uitleg}>Gratis en vrijblijvend, ter waarde van €349. Laat je contactgegevens achter, dan neemt Gijs contact met je op om de energiescan af te stemmen.</p>
              {scan.scanAfgerond ? (
                <div className={styles.succesPaneel} role="status">
                  <p>Bedankt. Je aanvraag is ontvangen. Gijs neemt contact met je op om de energiescan af te stemmen.</p>
                </div>
              ) : (
                <form onSubmit={verstuurAanvraag} noValidate>
                  {/* Honeypot: voor mensen onzichtbaar (geen display:none, dat herkennen sommige
                      bots), maar formulier-bots vullen dit vaak automatisch in. Zie
                      lib/energiescan-opslag.ts. */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                    <label htmlFor={`${fieldId}-website`}>Website</label>
                    <input ref={honeypotRef} id={`${fieldId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className={styles.aanvraagVelden}>
                    <Field label="Voornaam" htmlFor={`${fieldId}-voornaam`} error={aanvraagFouten.voornaam}>
                      <Input id={`${fieldId}-voornaam`} autoComplete="given-name" maxLength={100} aria-required="true" invalid={!!aanvraagFouten.voornaam}
                        value={scan.name} onChange={e => { patch({ name: e.target.value }); setAanvraagFouten(f => ({ ...f, voornaam: undefined })); }} />
                    </Field>
                    <Field label="Achternaam" htmlFor={`${fieldId}-achternaam`} error={aanvraagFouten.achternaam}>
                      <Input id={`${fieldId}-achternaam`} autoComplete="family-name" maxLength={100} aria-required="true" invalid={!!aanvraagFouten.achternaam}
                        value={scan.achternaam} onChange={e => { patch({ achternaam: e.target.value }); setAanvraagFouten(f => ({ ...f, achternaam: undefined })); }} />
                    </Field>
                    <Field label="E-mailadres" htmlFor={`${fieldId}-email`} error={aanvraagFouten.email}>
                      <Input id={`${fieldId}-email`} type="email" autoComplete="email" maxLength={254} aria-required="true" invalid={!!aanvraagFouten.email}
                        value={scan.email} onChange={e => { patch({ email: e.target.value }); setAanvraagFouten(f => ({ ...f, email: undefined })); }} />
                    </Field>
                    <Field label="Telefoonnummer" htmlFor={`${fieldId}-telefoon`} error={aanvraagFouten.telefoon}>
                      <Input id={`${fieldId}-telefoon`} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} aria-required="true" invalid={!!aanvraagFouten.telefoon}
                        value={scan.telefoon} onChange={e => { patch({ telefoon: e.target.value }); setAanvraagFouten(f => ({ ...f, telefoon: undefined })); }} />
                    </Field>
                  </div>
                  {/* Op welke werkdagen de bewoner goed bereikbaar is; meerdere dagen mogelijk. */}
                  <fieldset className="mb-4 min-w-0 border-0 p-0">
                    <legend className="p-0 text-[17px] font-bold text-[var(--gijs-donkergroen)]">Op welke dagen ben je goed bereikbaar? <span className="font-normal text-[15px] text-[var(--text-subtle)]">(optioneel, meerdere dagen mogelijk)</span></legend>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {VOORKEURSMOMENT_OPTIES.map(dag => {
                        const gekozen = bereikbareDagen(scan.voorkeursmoment);
                        return (
                          <label key={dag} className="flex min-h-12 cursor-pointer items-center justify-center rounded-[12px] border-2 border-[var(--border-default)] bg-white px-1 text-center text-[15px] font-semibold text-[var(--gijs-donkergroen)] transition-colors hover:border-[var(--gijs-donkergroen)] has-[:checked]:border-[var(--gijs-donkergroen)] has-[:checked]:bg-[var(--gijs-donkergroen)] has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--accent-600)]">
                            <input type="checkbox" className="sr-only" checked={gekozen.includes(dag)}
                              onChange={() => patch({ voorkeursmoment: VOORKEURSMOMENT_OPTIES.filter(d => d === dag ? !gekozen.includes(d) : gekozen.includes(d)).join(", ") })} />
                            <span aria-hidden="true" className="sm:hidden">{dag.slice(0, 2)}</span><span className="max-sm:sr-only">{dag}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                  <Field label="Opmerking" htmlFor={`${fieldId}-opmerking`} optional>
                    <textarea id={`${fieldId}-opmerking`} className="gijs-textarea" maxLength={500} placeholder="Is er iets waar we rekening mee moeten houden?"
                      value={scan.opmerking} onChange={e => patch({ opmerking: e.target.value })} />
                  </Field>
                  <Button type="submit" variant="primary" size="lg" loading={versturen} disabled={versturen}>{versturen ? "Aanvraag versturen…" : "Verstuur mijn aanvraag"}</Button>
                  {status && <p role="alert" className="gijs-error">{status}</p>}
                  <p className={styles.kleineNoot}>We gebruiken je gegevens alleen om contact met je op te nemen over je aanvraag. Lees hoe we met je gegevens omgaan in onze <a href="/avg-verklaring" target="_blank" rel="noopener noreferrer" className="underline">privacyverklaring</a>.</p>
                  <details className={styles.optioneel}><summary>Bekijk alle gegevens van je aanvraag</summary><div className={styles.preview}>{message}</div></details>
                </form>
              )}
              <div className={styles.directContact}>
                <p className={styles.directContactLabel}>Liever direct contact?</p>
                <a className={styles.directContactBel} href={CONTACT.phoneHref}>Bel {CONTACT.phone}</a>
                {WHATSAPP_NUMMER && <a className={styles.whatsappLink} href={`https://wa.me/${WHATSAPP_NUMMER}`} target="_blank" rel="noopener noreferrer">Of stuur een bericht via WhatsApp</a>}
              </div>
            </section>
            <div className={styles.stapActies}>
              <button type="button" className={styles.vorigeKnop} onClick={() => go(STAP.gegevens)}>← Vorige stap</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 border-t pt-5">
        {confirmNew ? (
          <>
            <p>Opnieuw beginnen wist de gegevens en keuzes van deze scan.</p>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => { setScan(freshScan("", "", scan.houseType)); setConfirmNew(false); setFouten({}); scroll.current = true; }}>Begin opnieuw</Button>
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
