"use client";
import { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import { useWoningDraft } from "./WoningDraftProvider";
import { AFGIFTE_STAAT, HouseViewer, MAATREGEL_STAAT, type HouseFocus } from "./HouseViewer";
import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import { StapBevestigen } from "./StapBevestigen";
import { WoningtypeRegel, OptieToggle, VerbruikVeld } from "./ScanVragen";
import { Woningrapport } from "./Woningrapport";
import { AanwezigVerkenner } from "./AanwezigVerkenner";
import { GoogleScore } from "@/components/reviews/GoogleScore";
import { CONTACT, WHATSAPP_NUMMER } from "@/lib/content/contact";
import { SCAN_TITELS } from "@/lib/content/maatregel-titels";
import { MC_BRONNEN } from "@/lib/content/milieu-centraal";
import { FinancieelWoningplan } from "./FinancieelWoningplan";
import {
  freshScan, readScan, SCAN_KEY, SCAN_MEASURES, SCAN_STAPPEN, STAP, sameAddress, scanMessage,
  VOORKEURSMOMENT_OPTIES, gebruiktGas, gebruiktWarmtenet, bereikbareDagen, type ScanSession,
} from "@/lib/scan-session";
import { schatVerbruikVoorScan, energiekosten, leesGetal } from "@/lib/energie-schatting";
import { maakWoningrapport } from "@/lib/woningrapport";
import { track, logError } from "@/lib/analytics";
import { leesRegioHerkomst, wisRegioHerkomst } from "@/lib/regio-source";
import { maakWoningdossier } from "@/lib/woningdossier";
import { slaWoningdossierOp } from "@/lib/woningdossier-opslag";
import { verstuurEnergiescanAanvraag } from "@/lib/energiescan-opslag";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { Checkbox } from "@/components/ds/forms/Checkbox";
import { Field } from "@/components/ds/forms/Field";
import { Input } from "@/components/ds/forms/Input";
import { Stepper } from "@/components/ds/navigation/Stepper";
import styles from "./WoningFlow.module.css";
import { geldigTelefoonnummer } from "@/lib/telefoon";

// Woningscan in drie stappen:
//   1 Jouw woning         adres → foto → "Ja, dit klopt" (BAG/EP-Online: woningtype, bouwjaar, oppervlak, label)
//   2 Woning en energie   "Wat is al aan je woning gedaan?": aanwezige maatregelen en verbruik, verder niets
//   3 Jouw woningplan     woningrapport: kansen in volgorde, subsidie, besparing, energiescan aanvragen
// Wat al aanwezig is, wordt niet opnieuw als kans voorgesteld.
//
// Uit stap 2 gehaald (november 2026): verwarming, verwarmde verdiepingen, warm water,
// aantal bewoners, wensen, monument, kruipruimte, dakkapel, garage, aanbouw en buurwoning. De velden
// blijven in ScanSession, de opslag en de aanvraagmail bestaan (lege waarde = "Niet ingevuld"), zodat
// opgeslagen scans en de Supabase-koppeling niet breken. Verwarming wordt nu afgeleid: een aangevinkte
// warmtepomp (hybride of volledig elektrisch), anders gaan we uit van een cv-ketel. De warmteafgifte is
// op verzoek van Max (17-11-2026) teruggekomen: die bepaalt mee hoe goed een warmtepomp past.

// Stap 2: aanwezige maatregelen in twee groepen. De id's zijn die van lib/measures.ts.
const AANWEZIG_GROEPEN: { kop: string; items: { id: string; label: string }[] }[] = [
  // Binnen elke groep van boven naar beneden door de woning: de camera loopt zo mee van dak naar vloer.
  { kop: "Isolatie", items: [
    { id: "dakisolatie", label: "Dakisolatie" },
    { id: "gevelisolatie", label: "Spouwmuurisolatie" },
    { id: "glas-kozijnen", label: "Isolatieglas en kozijnen" },
    { id: "vloerisolatie", label: "Vloer- of bodemisolatie" },
  ] },
  { kop: "Installaties", items: [
    { id: "zonnepanelen", label: "Zonnepanelen" },
    { id: "warmtepomp", label: "Warmtepomp" },
    { id: "thuisbatterij", label: "Thuisbatterij" },
    { id: "vloerverwarming", label: "Vloerverwarming" },
  ] },
];
const AANWEZIG_LABEL: Record<string, string> = Object.fromEntries(AANWEZIG_GROEPEN.flatMap(g => g.items.map(i => [i.id, i.label])));
const WARMTEPOMP_SOORTEN = ["Hybride", "Volledig elektrisch"] as const;
const POMP_VERWARMING = ["Hybride warmtepomp", "Volledig elektrische warmtepomp met boiler"];
// Zie de noot bij het financiële woningplan in stap 3.
// Het financiële woningplan is de beloning voor het achterlaten van gegevens (18-11-2026): één formulier
// (voornaam, achternaam, e-mail, telefoon, alle verplicht), daarna direct de cijfers en altijd contact.
// De losse e-mailgate (WoningplanGate) wordt in stap 3 niet meer gebruikt; component en server-actie bestaan nog.
const TOON_PRIJSPLAN_NA_AANVRAAG = true;

const toggleIn = (list: string[], id: string) => list.includes(id) ? list.filter(x => x !== id) : [...list, id];



// Zelfde patroon als EMAIL in lib/woningdossier-opslag.ts; server-only bestanden ("use server")
// kunnen geen gewone constanten exporteren naar een client-component, dus lokaal gedupliceerd.
const EMAIL_PATROON = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const euro = (n: number) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const aantal = (n: string) => { const g = leesGetal(n); return g === null ? n : g.toLocaleString("nl-NL"); };

type Fouten = Partial<Record<"stroom" | "gas" | "warmte", string>>;

export function WoningFlow({ initialHouseType, initialPostcode, initialHuisnummer, initialMeasure }: { initialHouseType?: HouseType; initialPostcode: string; initialHuisnummer: string; initialMeasure?: string }) {
  const { draft, setDraft } = useWoningDraft();
  const [scan, setScan] = useState<ScanSession>(() => freshScan(initialPostcode || draft.postcode, initialHuisnummer || draft.huisnummer, initialHouseType || draft.houseType));
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmNew, setConfirmNew] = useState(false);
  const [fouten, setFouten] = useState<Fouten>({});
  const [aanvraagFouten, setAanvraagFouten] = useState<{ voornaam?: string; achternaam?: string; email?: string; telefoon?: string }>({});
  const [versturen, setVersturen] = useState(false);
  const [lokaleTest, setLokaleTest] = useState(false);
  // Welke vraag nu actief is: stuurt de camera van de 3D-woning naar het bijbehorende onderdeel (zie
  // HouseViewer's `focus`-prop). Puur een UI-keuze, dus geen onderdeel van de opgeslagen scanstate;
  // bij een stapwissel (zie go/wijzig/terugNaarPlan hieronder) heeft een vorige focus geen betekenis meer.
  // rondom: bij de vinkjes "Welke stappen heb je al gezet?" blijft de hele woning in beeld en draait
  // de camera eromheen (het onderdeel licht op); bij de vragen zoomt hij in op het onderdeel.
  const [kijk, setKijk] = useState<{ focus: HouseFocus; rondom: boolean }>({ focus: null, rondom: false });
  const focus = kijk.focus;
  const setFocus = (f: HouseFocus, rondom = false) => setKijk({ focus: f, rondom });
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
    // Vuur region_arrived als er een regioherkomst in de sessie staat — ongeacht of er al een scan
    // bezig is. Dit meet de daadwerkelijke aankomst op /woning vanuit een regiopagina, los van
    // region_to_scan (CTA-klik) en woningscan_started (adres bevestigd).
    const herkomst = leesRegioHerkomst();
    if (herkomst) track({ name: "region_arrived", ...herkomst });
  }, [draft, initialHouseType, initialPostcode, initialHuisnummer, initialMeasure]);

  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(SCAN_KEY, JSON.stringify(scan)); } catch { /* sessionStorage kan ontbreken/geblokkeerd zijn */ }
    setDraft(current => ({ ...current, postcode: scan.postcode, huisnummer: scan.huisnummer, houseType: scan.houseType }));
    // Bewust geen postcode/huisnummer meer in de zichtbare URL: dat stond anders de hele scan door
    // in de adresbalk, en dus ook in alles wat een analysetool zelf uit window.location leest
    // (Contentsquare/Clarity lezen de URL rechtstreeks, los van onze eigen GTM-events — zie het
    // privacyrapport van 14 oktober 2026). Het adres zelf blijft volledig werken: dat staat al in
    // sessionStorage (SCAN_KEY hierboven), niet in de URL. Enige gevolg: een gedeelde link midden in
    // de scan vult op een ander apparaat niet meer automatisch hetzelfde adres in — met Max akkoord.
    history.replaceState(null, "", "/woning?" + new URLSearchParams({ woningtype: scan.houseType }));
  }, [scan, ready, setDraft]);

  useEffect(() => {
    if (scroll.current) { scroll.current = false; heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "start", behavior: "smooth" }); }
  }, [scan.step]);

  // Eén "woningscan_step_viewed" per stapwissel (ook de allereerste, stap 1) — pas zodra de
  // teruggelezen sessie bekend is (ready), anders telt een hersteld "stap 3" bij het laden als een
  // valse eerste weergave van stap 1.
  useEffect(() => {
    if (!ready) return;
    track({ name: "woningscan_step_viewed", step: scan.step + 1, step_name: SCAN_STAPPEN[scan.step] });
    if (scan.step === STAP.woning) track({ name: "woningscan_step_1_viewed" });
    else if (scan.step === STAP.gegevens) track({ name: "woningscan_step_2_viewed" });
    else if (scan.step === STAP.plan) track({ name: "woningscan_step_3_viewed" });
  }, [ready, scan.step]);

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

  // Verwarming wordt niet meer gevraagd maar afgeleid uit stap 2: een aangevinkte warmtepomp (hybride of
  // volledig elektrisch), anders een cv-ketel. Een eerder gekozen andere verwarming (bv. stadsverwarming uit
  // een opgeslagen scan) blijft staan zolang er geen warmtepomp is aangevinkt.
  const warmtepompSoort = scan.verwarming.includes("Volledig elektrische warmtepomp met boiler") ? "Volledig elektrisch" : "Hybride";
  const verwarming = scan.bestaandeMaatregelen.includes("warmtepomp")
    ? [warmtepompSoort === "Volledig elektrisch" ? "Volledig elektrische warmtepomp met boiler" : "Hybride warmtepomp"]
    : scan.verwarming.length && !scan.verwarming.some(v => POMP_VERWARMING.includes(v)) ? scan.verwarming : ["Cv-ketel"];
  // Vloerverwarming als afgiftesysteem uit een opgeslagen scan: dan liggen de leidingen in de vloer.
  const heeftVloerverwarming = scan.warmteafgifte.some(v => AFGIFTE_STAAT[v] === "vloerverwarming");
  const zichtbareMaatregelen = [...new Set([...scan.bestaandeMaatregelen, ...scan.measures, ...(heeftVloerverwarming ? ["vloerverwarming"] : [])])];
  // Dakkapel/garage zijn van buitenaf te zien: alleen "Geen"/"Nee" haalt het onderdeel uit de illustratieve weergave.
  // "Meerdere" toont er 2: meer dakkapellen kan de illustratieve woning niet laten zien.
  // De dakkapelvraag zit niet meer in de scan: standaard staat er één dakkapel op de woning (Max, 17-11-2026).
  const dakkapelAantal = scan.dakkapel === "Geen" ? 0 : !scan.dakkapel || scan.dakkapel === "1" ? 1 : 2;
  const viewer = (
    <HouseViewer
      selectedMeasureIds={zichtbareMaatregelen}
      dakkapelAantal={dakkapelAantal}
      dakkapelZijde={scan.dakkapel ? "achter" : "voor"}
      garageAanwezig={scan.garage !== "Nee"}
      aanbouwAanwezig={scan.aanbouw !== "Nee"}
      hoekZijde={scan.houseType === "hoekwoning" ? ((scan.hoekZijde || "Links") as "Links" | "Rechts") : undefined}
      compact={false}
      klein={scan.step === STAP.plan}
      vol={scan.step === STAP.gegevens}
      focus={focus}
      onFocusChange={f => setFocus(f)}
      rondom={kijk.rondom}
      verwarming={verwarming}
      afgifte={scan.warmteafgifte}
      kruipruimte={scan.kruipruimte}
      spouwmuur={scan.spouwmuur}
      zonderMonteur
      oplichten={scan.step === STAP.gegevens}
      opPaneel={scan.step === STAP.gegevens}
      zonderExtras={scan.step === STAP.gegevens}
    />
  );
  const setHouseType = (houseType: HouseType) => patch({ houseType, woningtypeBron: "handmatig" });
  const setAutoHouseType = (houseType: HouseType) => patch({ houseType, woningtypeBron: "automatisch" });
  const titelVan = (id: string) => SCAN_TITELS[id] ?? { naam: SCAN_MEASURES.find(m => m.id === id)?.label ?? id, titel: "", uitleg: "", slug: "", cta: "" };

  const gas = gebruiktGas(verwarming);
  const warmtenet = gebruiktWarmtenet(verwarming);
  const bouwjaarGetal = leesGetal(scan.bouwjaar);
  // "Help mij schatten" zonder aantal bewoners: zie schatVerbruikVoorScan (Milieu Centraal-tabellen).
  const schatting = schatVerbruikVoorScan({
    houseType: scan.houseType, bouwjaar: bouwjaarGetal, woonoppervlakte: leesGetal(scan.woonoppervlakte),
    verwarming, bestaandeMaatregelen: scan.bestaandeMaatregelen, aanwezigOnbekend: scan.aanwezigOnbekend,
    naamVan: id => AANWEZIG_LABEL[id] ?? titelVan(id).naam,
  });
  const kosten = energiekosten({ ...scan, verwarming });
  // Stroom zonder aantal bewoners: de bandbreedte is de schatting, het getal in het veld alleen het midden.
  const stroomBand = `${schatting.stroom.min.toLocaleString("nl-NL")} tot ${schatting.stroom.max.toLocaleString("nl-NL")} kWh per jaar`;
  const stroomGeschat = leesGetal(scan.elektriciteitsverbruik) === schatting.stroom.midden;
  const nieuweMaatregelen = SCAN_MEASURES.filter(m => !scan.bestaandeMaatregelen.includes(m.id));
  // Woningplan achter de e-mailgate: de aangevinkte kansen, of anders de aanbevolen kansen uit het rapport.
  const gekozenNieuw = scan.measures.filter(id => nieuweMaatregelen.some(m => m.id === id));
  // Het woningrapport rekent bij elke render opnieuw: wijzig je in stap 2 iets, dan klopt stap 3 direct.
  // (planMaatregelen staat hieronder, na het rapport.)
  const rapport = maakWoningrapport({
    houseType: scan.houseType, bouwjaar: bouwjaarGetal, energielabel: scan.energielabel,
    bestaande: scan.bestaandeMaatregelen, aanwezigOnbekend: scan.aanwezigOnbekend, verwarming,
    kruipruimte: scan.kruipruimte, warmteafgifte: scan.warmteafgifte, gasverbruik: gas ? leesGetal(scan.gasverbruik) : null,
    gasprijs: leesGetal(scan.gasprijs), stroomprijs: leesGetal(scan.elektriciteitsprijs),
  });
  const planMaatregelen = gekozenNieuw.length ? gekozenNieuw : rapport.kansen.filter(k => k.aanbevolen).map(k => k.id);
  // Alleen isolatie krijgt een prijsindicatie (tarieven Thom, Milieu Centraal voor glas); de rest bepaalt Gijs bij de opname.
  const PRIJS_IDS = ["dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen"];
  const naamLijst = (ids: string[]) => {
    const namen = ids.map((id, i) => { const n = AANWEZIG_LABEL[id] ?? titelVan(id).naam; return i === 0 ? n : n.toLowerCase(); });
    return namen.length < 2 ? namen.join("") : `${namen.slice(0, -1).join(", ")} en ${namen[namen.length - 1]}`;
  };
  const planMetPrijs = planMaatregelen.filter(id => PRIJS_IDS.includes(id));
  const planZonderPrijs = planMaatregelen.filter(id => !PRIJS_IDS.includes(id));

  // Welke rij van stap 2 nu in beeld is: de maatregel of warmteafgifte waar de camera op ingezoomd staat.
  const actieveRij = focus
    ? Object.keys(MAATREGEL_STAAT).find(id => MAATREGEL_STAAT[id] === focus) ?? Object.keys(AFGIFTE_STAAT).find(o => AFGIFTE_STAAT[o] === focus) ?? null
    : null;
  const toggleAanwezig = (id: string) => {
    const bestaand = toggleIn(scan.bestaandeMaatregelen, id);
    patch({
      bestaandeMaatregelen: bestaand, aanwezigOnbekend: false,
      measures: scan.measures.filter(m => !bestaand.includes(m)),
      ...(id === "warmtepomp" ? { verwarming: bestaand.includes("warmtepomp") ? ["Hybride warmtepomp"] : ["Cv-ketel"] } : {}),
    });
    // Scanantwoord → camerastaat: het onderdeel verschijnt en de camera gaat ernaartoe.
    const staat = MAATREGEL_STAAT[id] as HouseFocus | undefined;
    if (staat && bestaand.includes(id)) setFocus(staat);
    else if (staat && focus === staat) setFocus(null);
  };

  function valideer(): Fouten {
    const f: Fouten = {};
    if (leesGetal(scan.elektriciteitsverbruik) === null) f.stroom = "Vul je stroomverbruik in, of kies Help mij schatten.";
    if (gas && leesGetal(scan.gasverbruik) === null) f.gas = "Vul je gasverbruik in, of kies Help mij schatten.";
    if (warmtenet && leesGetal(scan.warmteverbruik) === null) f.warmte = "Vul je warmteverbruik in, of kies Help mij schatten.";
    return f;
  }
  const naarPlan = () => {
    const f = valideer();
    setFouten(f);
    const eerste = (["stroom", "gas", "warmte"] as const).find(k => f[k]);
    if (eerste) { document.getElementById(`${fieldId}-${eerste}`)?.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    // De afgeleide verwarming vastleggen, zodat opslag, aanvraagmail en kostenberekening dezelfde gebruiken.
    patch({ verwarming });
    if (!scan.terugNaarPlan) {
      const h = leesRegioHerkomst();
      track({ name: "scan_completed" });
      track({ name: "woningscan_step_completed", step: STAP.gegevens + 1, step_name: SCAN_STAPPEN[STAP.gegevens] });
      track({ name: "woningscan_completed", ...(h ?? {}) });
      // woningplan_viewed: historische naam behouden voor bestaande GTM-triggers.
      // woningplan_preview_viewed: nieuwe, canonieke naam voor GA4-rapportage (gebruik díe als conversie).
      // Beide events vuren op hetzelfde moment — zet maar één als GA4-conversie in.
      track({ name: "woningplan_viewed" });
      track({ name: "woningplan_preview_viewed", ...(h ?? {}) });
    }
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
    const { verstuurd, fout, lokaal } = await verstuurEnergiescanAanvraag(JSON.stringify(sessieMetAfgerond), honeypotRef.current?.value)
      .catch((error): { verstuurd: boolean; fout?: string; lokaal?: boolean } => { logError("energiescan_aanvraag", error); return { verstuurd: false, fout: "De aanvraag kon niet worden opgeslagen. Bel of mail Gijs voor een echte afspraak." }; });
    setVersturen(false);
    // Na een geslaagde aanvraag staan deze gegevens al veilig in Supabase; de
    // succesmelding hieronder toont ze niet meer, dus hoeven ze niet langer
    // in sessionStorage te blijven staan.
    // Na versturen staan de cijfers op de plek van het formulier: daar naartoe scrollen.
    if (verstuurd) requestAnimationFrame(() => document.getElementById(`${fieldId}-aanvraag`)?.scrollIntoView({ block: "start", behavior: "smooth" }));
    if (verstuurd && lokaal) {
      // Lokale test (localhost of next dev): niets opgeslagen, niets naar Teamleader, geen mail en dus
      // ook geen lead-events. Alleen een lokale melding; de ingevulde testgegevens blijven staan.
      setLokaleTest(true);
      setScan({ ...sessieMetAfgerond });
      return;
    }
    if (verstuurd) {
      const h = leesRegioHerkomst();
      track({ name: "energy_scan_requested" });
      track({ name: "lead_created", source: "woningscan", ...(h ?? {}) });
      // Herkomst wissen: de scan is volledig afgerond. Een eventuele volgende directe scan
      // in dezelfde tab krijgt geen verouderde regio-attributie.
      wisRegioHerkomst();
      setScan({ ...sessieMetAfgerond, name: "", achternaam: "", email: "", telefoon: "", opmerking: "", whatsappToestemming: false });
      return;
    }
    logError("energiescan_aanvraag", fout ?? "onbekende fout");
    setStatus(fout ?? "De aanvraag kon niet worden opgeslagen. Bel of mail Gijs voor een echte afspraak.");
  }

  return (
    <div className={`${styles.flow} ${scan.step !== STAP.woning ? styles.flowCompact : ""}`}>
      {/* Scanmodus vanaf stap 2: de pagina-intro (H1) blijft in de HTML, maar neemt geen ruimte meer in, zodat
          de eigenlijke vraag hoger op het scherm begint. */}
      {scan.step !== STAP.woning && <style href="woningscan-compact" precedence="default">{`.woning-intro{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}`}</style>}
      {/* Kicker, titel en basisuitleg staan server-side in app/woning/page.tsx, in de opmaak van de overige pagina's. */}
      <Stepper steps={[...SCAN_STAPPEN]} current={scan.step} className={styles.stepper} />
      <p className={styles.stapTeller}>Stap {scan.step + 1} van {SCAN_STAPPEN.length}</p>
      {/* Stap 1: geen zichtbare kop "Jouw woning" (na "Stap 1 van 3" volgt direct "Gevonden! Is dit jouw
          woning?"); de kop blijft wel voor schermlezers en als focuspunt bij het wisselen van stap. */}
      <h2 ref={heading} tabIndex={-1} className={scan.step === STAP.gegevens ? styles.heading : "sr-only"}>{scan.step === STAP.gegevens ? "Wat is al aan je woning gedaan?" : SCAN_STAPPEN[scan.step]}</h2>

      {scan.step === STAP.woning && (
        <StapBevestigen
          postcode={scan.postcode} huisnummer={scan.huisnummer}
          houseType={scan.houseType} woningtypeBron={scan.woningtypeBron}
          onHouseTypeChange={setHouseType} onAutoHouseType={setAutoHouseType}
          onAdresSubmit={(postcode, huisnummer) => patch({ postcode, huisnummer, addressLabel: "", woningBevestigd: false })}
          onBevestig={(addressLabel, manual = false, bag, epOnline, adresDelen) => {
            if (!scan.dossierId) {
              track({ name: "scan_started" });
              const h = leesRegioHerkomst();
              track({ name: "woningscan_started", ...(h ?? {}) });
            }
            if (!scan.terugNaarPlan) track({ name: "woningscan_step_completed", step: STAP.woning + 1, step_name: SCAN_STAPPEN[STAP.woning] });
            patch({
              addressLabel, manualAddress: manual, woningBevestigd: true,
              straat: adresDelen?.straat ?? "", woonplaats: adresDelen?.woonplaats ?? "",
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
        <div className={styles.stap2}>
          <p className={styles.uitleg}>Vink aan wat je woning <strong>nu al heeft</strong>. Wat er nog niet is, laten we je in stap 3 zien als kans, met besparing en subsidie.</p>

          {/* Eerst de woninggegevens (die bepalen alles daarna), in gelijke kolommen. */}
          <section className={styles.stap2Blok}>
            <h3 className={styles.sectieKop}>1. Klopt dit van je woning?</h3>
            <WoningtypeRegel houseType={scan.houseType} onChange={setHouseType} />
            {scan.bagOpgehaald && <p className={styles.bagNoot}>Bouwjaar en woonoppervlakte zijn automatisch opgehaald uit het Kadaster (BAG). Klopt het niet? Pas het gerust aan.</p>}
            <div className={styles.gelijkRaster} style={{ "--kolommen": 3 } as React.CSSProperties}>
              <Field label="Bouwjaar" htmlFor={`${fieldId}-bouwjaar`}><Input id={`${fieldId}-bouwjaar`} inputMode="numeric" value={scan.bouwjaar} onChange={e => patch({ bouwjaar: e.target.value, bagOpgehaald: false })} /></Field>
              <Field label="Woonoppervlakte" htmlFor={`${fieldId}-oppervlak`}><Input id={`${fieldId}-oppervlak`} inputMode="numeric" suffix="m²" className="pr-12" value={scan.woonoppervlakte} onChange={e => patch({ woonoppervlakte: e.target.value, bagOpgehaald: false })} /></Field>
              <Field label="Energielabel" htmlFor={`${fieldId}-label`}><Input id={`${fieldId}-label`} readOnly value={scan.energielabel ? `${scan.energielabel.toUpperCase()} (EP-Online)` : "Niet gevonden"} /></Field>
            </div>
          </section>

          {/* Zelfde vorm als het maatregelenblok op de regiopagina's: woning groot links, tabs met rijen rechts.
              Een rij aanvinken zoomt de woning in op dat onderdeel. */}
          <div className={styles.stap2Blok}>
            <h3 className={styles.sectieKop}>2. Wat heeft je woning nu al?</h3>
            <p className={styles.uitleg}>Vink alles aan wat er nu al is. Niet zeker? Kies dan &quot;Ik weet het niet precies&quot;; de adviseur controleert het later.</p>
          </div>
          <AanwezigVerkenner
            woning={viewer}
            groepen={{ isolatie: AANWEZIG_GROEPEN[0].items, installaties: AANWEZIG_GROEPEN[1].items }}
            bestaande={scan.bestaandeMaatregelen}
            onToggle={toggleAanwezig}
            actief={actieveRij}
            aanwezigOnbekend={scan.aanwezigOnbekend}
            onOnbekend={aan => {
              // Wie het niet precies weet, wist de losse vinkjes: anders rekent het rapport met een half beeld.
              if (aan) { setFocus(null); patch({ aanwezigOnbekend: true, bestaandeMaatregelen: [], verwarming: ["Cv-ketel"] }); }
              else patch({ aanwezigOnbekend: false });
            }}
            warmtepompKeuze={scan.bestaandeMaatregelen.includes("warmtepomp") ? (
              <div className={styles.warmtepompSoort}>
                <OptieToggle vraag="Welke warmtepomp is het?" opties={WARMTEPOMP_SOORTEN} waarde={warmtepompSoort}
                  onChange={soort => patch({ verwarming: [soort === "Volledig elektrisch" ? "Volledig elektrische warmtepomp met boiler" : "Hybride warmtepomp"] })} />
              </div>
            ) : null}
            afgifte={scan.warmteafgifte}
            onToggleAfgifte={optie => {
              // "Weet ik niet" sluit de andere keuzes uit, en andersom.
              const nieuw = optie === "Weet ik niet"
                ? (scan.warmteafgifte.includes(optie) ? [] : [optie])
                : toggleIn(scan.warmteafgifte.filter(v => v !== "Weet ik niet"), optie);
              patch({ warmteafgifte: nieuw });
              const staat = AFGIFTE_STAAT[optie] as HouseFocus | undefined;
              if (staat && nieuw.includes(optie)) setFocus(staat);
              else if (staat && focus === staat) setFocus(null);
            }}
            afgifteAnders={
              <Field label="Anders, namelijk" htmlFor={`${fieldId}-afgifte-anders`} className={styles.andersVeld}>
                <Input id={`${fieldId}-afgifte-anders`} maxLength={120} value={scan.warmteafgifteAnders} onChange={e => patch({ warmteafgifteAnders: e.target.value })} />
              </Field>
            }
          />

          {/* Daarna het verbruik: de laatste stap voor het rapport, in gelijke kolommen. */}
          <section className={styles.stap2Blok}>
              <h3 className={styles.sectieKop}>3. Je energieverbruik</h3>
              <p className={styles.uitleg}>Staat het op je jaarafrekening? Vul dat in. Weet je het niet, kies dan Help mij schatten.</p>
              <div className={styles.gelijkRaster} style={{ "--kolommen": 1 + (gas ? 1 : 0) + (warmtenet ? 1 : 0) } as React.CSSProperties}>
                <div id={`${fieldId}-stroom`}>
                  <VerbruikVeld id={`${fieldId}-stroom-veld`} label="Elektriciteitsverbruik" eenheid="kWh/jaar" waarde={scan.elektriciteitsverbruik} schatting={schatting.stroom.midden} fout={fouten.stroom}
                    toelichting={stroomGeschat
                      ? `Geschat: ${stroomBand}. We rekenen met het midden; vul je eigen verbruik in als je dat weet.`
                      : `Geschatte bandbreedte: ${stroomBand}.`}
                    onChange={elektriciteitsverbruik => { patch({ elektriciteitsverbruik }); setFouten(f => ({ ...f, stroom: undefined })); }} />
                </div>
                {gas && (
                  <div id={`${fieldId}-gas`}>
                    <VerbruikVeld id={`${fieldId}-gas-veld`} label="Gasverbruik" eenheid="m³/jaar" waarde={scan.gasverbruik} schatting={schatting.gas} fout={fouten.gas}
                      toelichting="Geen gasaansluiting? Vul 0 in."
                      onChange={gasverbruik => { patch({ gasverbruik }); setFouten(f => ({ ...f, gas: undefined })); }} />
                  </div>
                )}
                {warmtenet && (
                  <div id={`${fieldId}-warmte`}>
                    <VerbruikVeld id={`${fieldId}-warmte-veld`} label="Warmteverbruik" eenheid="GJ/jaar" waarde={scan.warmteverbruik} schatting={schatting.warmte} fout={fouten.warmte}
                      onChange={warmteverbruik => { patch({ warmteverbruik }); setFouten(f => ({ ...f, warmte: undefined })); }} />
                  </div>
                )}
              </div>
              {scan.bestaandeMaatregelen.includes("zonnepanelen") && <p className={styles.note}>Je hebt zonnepanelen. De schatting houdt geen rekening met eigen opwek; vul bij voorkeur het verbruik van je jaarafrekening in.</p>}
              <div className={styles.bronRaster}>
              <details className={styles.bron}>
                <summary>Waar is de schatting op gebaseerd?</summary>
                <ul>{schatting.uitleg.map(regel => <li key={regel}>{regel}</li>)}</ul>
                <p>Bron: <a href={MC_BRONNEN.gemiddeld} target="_blank" rel="noopener noreferrer">Milieu Centraal, gemiddeld energieverbruik</a>, <a href={MC_BRONNEN.hybride} target="_blank" rel="noopener noreferrer">hybride warmtepomp</a> en <a href={MC_BRONNEN.volledig} target="_blank" rel="noopener noreferrer">volledige warmtepomp</a>.</p>
              </details>
              <details className={styles.bron}>
                <summary>Energieprijzen aanpassen</summary>
                <div className={styles.veldRaster}>
                  <Field label="Stroomprijs" htmlFor={`${fieldId}-stroomprijs`}><Input id={`${fieldId}-stroomprijs`} inputMode="decimal" suffix="€/kWh" className="pr-20" value={scan.elektriciteitsprijs} onChange={e => patch({ elektriciteitsprijs: e.target.value })} /></Field>
                  {gas && <Field label="Gasprijs" htmlFor={`${fieldId}-gasprijs`}><Input id={`${fieldId}-gasprijs`} inputMode="decimal" suffix="€/m³" className="pr-20" value={scan.gasprijs} onChange={e => patch({ gasprijs: e.target.value })} /></Field>}
                  {warmtenet && <Field label="Prijs stadsverwarming" htmlFor={`${fieldId}-warmteprijs`}><Input id={`${fieldId}-warmteprijs`} inputMode="decimal" suffix="€/GJ" className="pr-20" value={scan.warmteprijs} onChange={e => patch({ warmteprijs: e.target.value })} /></Field>}
                </div>
                <p>Vooringevuld met een gemiddelde: stroom volgens <a href={MC_BRONNEN.prijzen} target="_blank" rel="noopener noreferrer">Milieu Centraal</a> (januari 2026){gas ? ", gas € 1,42 per m³" : ""}{warmtenet ? " en de prijs voor stadsverwarming van Gijs" : ""}. Pas ze aan naar je eigen contract.</p>
              </details>
              </div>
          </section>

            <div className={styles.stapActies}>
              <Button variant="primary" size="lg" iconRight="arrow-right" onClick={naarPlan}>{scan.terugNaarPlan ? "Terug naar mijn woningrapport" : "Bekijk mijn woningrapport"}</Button>
              {Object.values(fouten).some(Boolean) && <p className="gijs-error" role="alert">Vul de gemarkeerde velden in om je woningrapport te zien.</p>}
              {!scan.terugNaarPlan && <button type="button" className={styles.vorigeKnop} onClick={() => go(STAP.woning)}>← Vorige stap</button>}
            </div>
        </div>
      )}

      {scan.step === STAP.plan && (
        <div className={styles.plan}>
          <div className={styles.planHoofd}>
            <Woningrapport
              rapport={rapport}
              naamVan={id => AANWEZIG_LABEL[id] ?? titelVan(id).naam} slugVan={id => titelVan(id).slug}
              gekozen={scan.measures} onKies={id => patch({ measures: toggleIn(scan.measures, id) })}
              onBekijk={id => {
                const staat = id ? MAATREGEL_STAAT[id] as HouseFocus | undefined : null;
                if (staat !== undefined && (staat !== focus || kijk.rondom)) setFocus(staat);
              }}
              formulier={
            <section id={`${fieldId}-aanvraag`} className={styles.aanvraag}>
              {/* Zelfde opbouw als het adviseursblok op de regiopagina's: portretten links, tekst rechts. De groene
                  rand zit in het portret zelf; niet wegsnijden. */}
              <div className={styles.aanvraagKop}>
                <div className={styles.aanvraagPortretten}>
                  <span><Image src="/images/over-gijs/thom/thom-portret.png" alt="Thom, adviseur bij Gijs" fill sizes="96px" className="object-contain" /></span>
                  <span><Image src="/images/over-gijs/team/naud.jpeg" alt="Naud, adviseur bij Gijs" fill sizes="96px" className="object-contain" /></span>
                </div>
                <div>
                  <p className={styles.aanvraagEyebrow}>Persoonlijk advies van Gijs</p>
                  <h3 className={styles.aanvraagTitel}>{scan.scanAfgerond ? "Dit kost en levert het ongeveer op" : "Wil je weten wat dit kost en wanneer je het terugverdient?"}</h3>
                  <p>{scan.scanAfgerond
                    ? "Hieronder staat je eerste indicatie. De precieze prijs hoor je na een gratis energiescan aan huis (ter waarde van €\u00a0349)."
                    : "Laat je gegevens achter en je ziet direct wat de aanbevolen maatregelen ongeveer kosten en opleveren."}</p>
                  {/* Sociaal bewijs: live Google-score; zonder geldige data staat hier niets. */}
                  <div className={styles.aanvraagScore}><GoogleScore /></div>
                </div>
              </div>

              {!scan.scanAfgerond && <div className={styles.gateChecklist}>
                <p className={styles.gateChecklistKop}>Dit zie je direct na het versturen:</p>
                <ul>
                  {([
                    ["wallet", "Prijsindicatie per maatregel"],
                    ["piggy-bank", "Besparing en terugverdientijd"],
                    ["trending-up", "Mogelijke stijging van je woningwaarde"],
                    ["percent", "Subsidieregelingen voor jouw adres"],
                  ] as const).map(([icoon, tekst]) => (
                    <li key={tekst}><span className={styles.gateIcon}><Icon name={icoon} size="sm" /></span>{tekst}</li>
                  ))}
                </ul>
              </div>}

              <div className={styles.aanvraagFormulier}>
                {!scan.scanAfgerond && <>
                  <p className={styles.gateVraag}>Waar mogen we je bereiken?</p>
                  {/* Duidelijk wat we vragen en waarom, en het makkelijk houden: geen account, geen app (zie de tips
                      van Zivver over persoonsgegevens delen, gedeeld door Max op 18-11-2026). */}
                  <p className={styles.gegevensWaarom}>We vragen alleen wat nodig is om je advies op maat te maken. Geen account en geen nieuwsbrief.</p>
                </>}
                  {scan.scanAfgerond ? (
                    <>
                      <div className={styles.succesPaneel} role="status">
                        {lokaleTest
                          ? <p>Lokale test geslaagd. Er is niets verstuurd: geen aanvraag in de database, geen mail en geen lead in Teamleader.</p>
                          : <p>Bedankt. Thom of Naud belt je om je vragen te beantwoorden.</p>}
                      </div>
                      {TOON_PRIJSPLAN_NA_AANVRAAG && planMaatregelen.length > 0 && (
                        <FinancieelWoningplan
                          invoer={{
                            maatregelIds: planMaatregelen,
                            houseType: scan.houseType,
                            bouwjaar: leesGetal(scan.bouwjaar),
                            kruipruimte: scan.kruipruimte,
                            verwarming: verwarming,
                            gasverbruik: leesGetal(scan.gasverbruik),
                            gasprijs: leesGetal(scan.gasprijs),
                            aanwezigOnbekend: scan.aanwezigOnbekend,
                          }}
                          aanbevolen={!gekozenNieuw.length}
                          naamVan={id => AANWEZIG_LABEL[id] ?? titelVan(id).naam}
                          postcode={scan.postcode}
                          huisnummer={scan.huisnummer}
                          gekozenMaatregelen={scan.measures}
                        />
                      )}
                    </>
                  ) : (
                    <form onSubmit={verstuurAanvraag} noValidate data-clarity-mask="True" data-cs-mask="">
                      {/* Honeypot: voor mensen onzichtbaar, maar formulier-bots vullen dit vaak automatisch in. */}
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

                      {/* Zichtbaar onder de velden, niet in de uitklapper. Staat standaard uit: de bezoeker vinkt het
                          bewust aan (AVG). Alleen over deze aanvraag, geen marketing. */}
                      <div className={styles.whatsappKeuze}>
                        <Checkbox card label="Je mag me ook via WhatsApp benaderen"
                          description="Neem ik niet op, dan stuurt Gijs een berichtje. Alleen over deze aanvraag."
                          checked={scan.whatsappToestemming}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ whatsappToestemming: e.target.checked })} />
                      </div>
                      <details className={styles.bron}>
                        <summary>Aanvullende voorkeuren (optioneel)</summary>
                        <div className={styles.formOptioneelInhoud}>
                          <Checkbox card label="Ik wil iets wijzigen aan wat ik al heb" checked={scan.advice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ advice: e.target.checked })} />
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
                          <fieldset className="min-w-0 border-0 p-0">
                            <legend className="p-0 text-[17px] font-bold text-[var(--gijs-donkergroen)]">Op welke dagen ben je goed bereikbaar?</legend>
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
                        </div>
                      </details>

                      {/* Zichtbaar maken waarvoor je een prijsindicatie krijgt: je eigen vinkjes, of anders de aanbevolen kansen. */}
                      {planMaatregelen.length > 0 && (
                        <div className={styles.planVoor}>
                          {planMetPrijs.length > 0 && <p><strong>Je krijgt een prijsindicatie voor:</strong> {naamLijst(planMetPrijs).toLowerCase()} {gekozenNieuw.length ? "(jouw keuze)" : "(aanbevolen voor jouw woning)"}.</p>}
                          {planZonderPrijs.length > 0 && <p>{naamLijst(planZonderPrijs)}: de prijs bepaalt Gijs bij de woningopname.</p>}
                          {!gekozenNieuw.length && <p>Liever iets anders? Vink hierboven aan waar je meer over wilt weten.</p>}
                        </div>
                      )}
                      <Button type="submit" variant="primary" size="lg" loading={versturen} disabled={versturen} className={styles.aanvraagKnop}>{versturen ? "Bezig…" : "Bekijk wat het kost en oplevert"}</Button>
                      {status && <p role="alert" className="gijs-error">{status}</p>}
                      <p className={styles.kleineNoot}>Je cijfers verschijnen direct hieronder. Vrijblijvend: Thom of Naud belt je kort om je vragen te beantwoorden, en een energiescan aan huis plan je alleen als je dat wilt. We gebruiken je gegevens alleen voor deze aanvraag; lees onze <a href="/avg-verklaring" target="_blank" rel="noopener noreferrer" className="underline">privacyverklaring</a>.</p>
                      <details className={styles.optioneel}><summary>Bekijk alle gegevens van je aanvraag</summary><div className={styles.preview}>{message}</div></details>
                    </form>
                  )}
              </div>
              <div className={styles.directContact}>
                <p className={styles.directContactLabel}>Liever direct contact?</p>
                <a className={styles.directContactBel} href={CONTACT.phoneHref}>Bel {CONTACT.phone}</a>
                {/* Deze tekst start de Huisscan-flow in CommuniQate (route "website van Gijs"); gelijk houden met ENERGIESCAN_HREF in lib/seo.ts. */}
                {WHATSAPP_NUMMER && <a className={styles.whatsappLink} href={`https://wa.me/${WHATSAPP_NUMMER}?text=${encodeURIComponent("Ik wil graag een gratis energiescan plannen via de website van Gijs")}`} target="_blank" rel="noopener noreferrer">Of stuur een bericht via WhatsApp</a>}
              </div>
            </section>
              }
              postcode={scan.postcode} huisnummer={scan.huisnummer}
            />
            <div className={styles.stapActies}>
              <button type="button" className={styles.vorigeKnop} onClick={() => go(STAP.gegevens)}>← Vorige stap</button>
            </div>
          </div>

          <aside className={styles.planZij}>
            {/* Nu en straks naast elkaar: het verschil is waar het om gaat (Max, 18-11-2026). "Straks" is de
                aanbevolen isolatie samen (Milieu Centraal, begrensd op je eigen gasverbruik); zonder isolatiekans de
                hybride warmtepomp (ervaringscijfers Gijs). Niet opgeteld: dat zou dubbel tellen. */}
            <section className={styles.samenvatting}>
              <div className={styles.samenvattingKop}>
                <h3>Je energiekosten</h3>
                <button type="button" className={styles.tekstLink} onClick={() => wijzig(STAP.gegevens)}>Wijzigen<span className="sr-only"> energiegegevens</span></button>
              </div>
              {kosten && (() => {
                const iso = rapport.samenvatting.isolatieBesparing;
                const wp = rapport.samenvatting.warmtepompBesparing;
                const minder = iso ? iso.max : wp;
                const straksLabel = iso ? "Na isolatie" : "Met warmtepomp";
                const straks = minder ? Math.max(0, kosten.totaal - minder) : null;
                return (
                  <>
                    <dl className={styles.nuStraks}>
                      <div><dt>Nu</dt><dd>± {euro(kosten.totaal)}</dd></div>
                      {straks !== null && <div className={styles.straks}><dt>{straksLabel}</dt><dd>± {euro(straks)}</dd></div>}
                    </dl>
                    {straks !== null && (
                      <>
                        <div className={styles.balken} aria-hidden="true">
                          <span style={{ width: "100%" }} />
                          <span className={styles.balkStraks} style={{ width: `${Math.max(8, Math.round((straks / kosten.totaal) * 100))}%` }} />
                        </div>
                        <p className={styles.verschil}>± {euro(minder!)} per jaar minder</p>
                      </>
                    )}
                    <p className={styles.kleineNoot}>
                      Per jaar, indicatie: je verbruik ({stroomGeschat ? `${schatting.stroom.min.toLocaleString("nl-NL")}–${schatting.stroom.max.toLocaleString("nl-NL")}` : aantal(scan.elektriciteitsverbruik)} kWh{gas ? `, ${aantal(scan.gasverbruik)} m³ gas` : ""}) keer de energieprijs, zonder vaste kosten.
                      {straks !== null ? (iso ? " Met een warmtepomp of zonnepanelen kan het verder dalen." : "") : " Gijs rekent het verschil voor jouw woning uit."}
                    </p>
                  </>
                );
              })()}
              <p className={styles.zijAdres}>{scan.addressLabel || `${scan.postcode} ${scan.huisnummer}`}</p>
              <details className={styles.zijDetails}>
                <summary>Bekijk ingevoerde gegevens</summary>
                <dl className={styles.woningLijst}>
                  <div><dt>Woning</dt><dd>{HOUSE_MODELS[scan.houseType].label}{dossier.bouwjaar.waarde ? `, ${dossier.bouwjaar.waarde}` : ""}</dd></div>
                  {scan.woonoppervlakte && <div><dt>Oppervlakte</dt><dd>{scan.woonoppervlakte} m²</dd></div>}
                  <div><dt>Energielabel</dt><dd>{scan.energielabel ? scan.energielabel.toUpperCase() : "Niet gevonden"}</dd></div>
                  {scan.warmteafgifte.length > 0 && <div><dt>Afgifte</dt><dd>{scan.warmteafgifte.join(", ")}</dd></div>}
                  <div><dt>Aanwezig</dt><dd>{scan.bestaandeMaatregelen.length ? scan.bestaandeMaatregelen.map(id => AANWEZIG_LABEL[id] ?? titelVan(id).naam).join(", ") : scan.aanwezigOnbekend ? "Weet ik niet precies" : "Nog niets aangevinkt"}</dd></div>
                </dl>
              </details>
            </section>
          </aside>
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
