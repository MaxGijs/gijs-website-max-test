import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import { ACCENT, BG, STIJL, T, WIT, ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup } from "./basis";
import { BALLON, WEG, geslotenAanhanger, huisMarkup, standaardStappen } from "./standaard";

// Gedeelde scène voor de vloer- en bodemisolatie-infographics (kruipruimte
// onder het huis, luik in de vloer bij x 600-616).
// - platen (p35/36): stap 3 luik open en de kruipruimte nakijken; stap 4
//   isolatieplaten van de aanhanger via het luik, liggend tegen de onderkant
//   van de vloer bevestigen.
// - pur (p29/32): de bewoners gaan in stap 3 de deur uit (verplicht); stap 4
//   een slang vanaf de machine in de aanhanger via het luik, liggend
//   isolatieschuim tegen de onderkant van de vloer spuiten.
// - bodem (p39): stap 3 nakijken; stap 4 een zak isolatiemateriaal naast het
//   huis, slang de kruipruimte in, liggend het materiaal over de bodem verdelen.

export type VloerSoort = "platen" | "pur" | "bodem";

const LUIK = 608;                                        // midden van het luik
const LIG_Y = 22;                                        // y-verschuiving: liggend op de bodem van de kruipruimte
const INST2 = 362;                                       // beginplek van installateur 2
const STAPEL = { x: 96, y: 250 };                        // platen in de aanhanger, 20 x 8
const ZAK = { x: 94, y: 250 };                           // zak in de aanhanger, 22 x 20
const ZAK_PLEK = 372;                                    // waar de zak naast het huis komt te staan

/** Hand van de liggende installateur (voeten op x): omhoog tegen de vloer of omlaag naar de bodem. */
const handOmhoog = (voetX: number) => voetX - 42;
const handOmlaag = (voetX: number) => voetX - 34;
/** Slangen; het laatste stuk volgt de hand van de installateur in de kruipruimte. */
const slangPur = (handX: number) => `M150,250 C166,250 160,291 186,291 H594 Q602,291 604,300 V312 Q604,316 596,316 H${handX}`;
const slangBodem = (handX: number) => `M${ZAK_PLEK + 8},284 C392,290 396,306 404,318 Q408,324 416,324 H${handX}`;

export function vloerScene(soort: VloerSoort) {
  function sceneMarkup({ busLogo }: { busLogo: string }) {
    const lijn = `fill="none" stroke="${WIT}" stroke-linecap="round"`;
    const spray = `<g class="spray" style="opacity:0" stroke="${WIT}" stroke-width="1.4" stroke-linecap="round"><path d="M4,17 l-3,6 M4,17 l1,7 M4,17 l5,5"/></g>`;
    const lading = soort === "platen"
      ? `${geslotenAanhanger}`
      : soort === "pur"
        ? `${geslotenAanhanger}<g transform="translate(66,220)"><rect width="22" height="26" rx="2" fill="${BG}" stroke="${BG}"/><rect x="3" y="3" width="16" height="6" fill="${WIT}"/><circle cx="7" cy="15" r="2.5" fill="${WIT}"/><circle cx="15" cy="15" r="2.5" fill="${WIT}"/></g>`
        : geslotenAanhanger;
    const werk = soort === "platen"
      ? `<path class="laag" d="M596,304.5 H410" ${lijn} stroke-width="5" stroke-linecap="butt"/>
         <g transform="translate(${STAPEL.x},${STAPEL.y})"><g class="wp-as stapel" style="opacity:0"><rect x="0" y="-8" width="20" height="8" fill="${WIT}"/><path d="M0,-4 H20" stroke="${BG}" stroke-width="1"/></g></g>`
      : soort === "pur"
        ? `<path class="laag" d="M596,305 H410" ${lijn} stroke-width="7"/>
           <path class="slang" d="${slangPur(596)}" ${lijn} stroke-width="3" stroke-linejoin="round"/>
           <path class="stroom" d="${slangPur(596)}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>`
        : `<path class="laag" d="M410,325 H600" ${lijn} stroke-width="7"/>
           <g transform="translate(${ZAK.x},${ZAK.y})"><g class="wp-as zak" style="opacity:0"><path d="M2,0 Q0,-14 6,-18 L9,-21 L13,-21 L16,-18 Q22,-14 20,0 Z" fill="${WIT}"/><path d="M8,-17 L14,-17" stroke="${BG}" stroke-width="1.2"/></g></g>
           <path class="slang" d="${slangBodem(410)}" ${lijn} stroke-width="3" stroke-linejoin="round"/>
           <path class="stroom" d="${slangBodem(410)}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>`;
    return `
  ${STIJL}
  ${huisMarkup({ kruipruimte: true, balken: soort === "bodem" })}
  <path class="luik-gat" d="M601,300 H615" stroke="${BG}" stroke-width="4" style="opacity:0"/>
  <path class="luik" d="M616,300 L622,286" ${lijn} stroke-width="2.5"/>
  ${werk}
  <line x1="0" y1="300" x2="601" y2="300" stroke="${WIT}" stroke-width="3"/><line x1="615" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  <path class="luik-dicht" d="M601,300 H615" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", INST2, { pet: true, hand: soort === "pur" ? spray : "" })}
  ${busMarkup({ busLogo, lading })}
  ${ballonMarkup(BALLON.x, BALLON.y)}
  ${vinkjeMarkup(566, 64)}`;
  }

  function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
    const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
    const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
    const r = regie(tl, el);
    const { opPad, vanPad, draai, beweeg, loop, draag, werk, flits, teken, gum } = r;
    const standaard = standaardStappen(tl, r, el);
    const vast = (id: string, at: number) => { draai(`${id}-ar`, at, -40, 200); draai(`${id}-al`, at, 40, 200); };
    const los = (id: string, at: number) => { draai(`${id}-ar`, at, 0, 200); draai(`${id}-al`, at, 0, 200); };
    /** Installateur 2 gaat via het luik liggend de kruipruimte in / komt eruit. */
    const erin = (at: number) => tl.add(el("inst2"), { x: LUIK + 30 - INST2, y: LIG_Y, rotate: -90, duration: 800 }, at);
    const eruit = (at: number) => tl.add(el("inst2"), { x: LUIK - INST2, y: 0, rotate: 0, duration: 800 }, at);
    const kruip = (voetX: number, at: number, duur: number) => beweeg("inst2", { x: voetX - INST2 }, at, duur);
    const stroom = (at: number, duur: number) => {
      tl.add(el("stroom"), { opacity: 1, duration: 150 }, at);
      tl.add(el("stroom"), { strokeDashoffset: [0, -(duur / 12)], duration: duur, ease: "linear" }, at);
      tl.add(el("stroom"), { opacity: 0, duration: 150 }, at + duur);
    };

    standaard.stap1();
    if (soort === "platen") opPad("stapel", 3000);       // staan achter de wand van de aanhanger
    if (soort === "bodem") opPad("zak", 3000);
    standaard.stap2(soort !== "pur");

    // Stap 3: luik open, de kruipruimte nakijken (pur: de bewoners gaan de deur uit).
    if (soort === "pur") {
      loop("bewoner", WEG, T[2], 2200);
      loop("bewoner2", WEG, T[2] + 150, 2200);
    }
    loop("inst1", LUIK - 18 - 345, T[2], 1000);
    werk("inst1-ar", T[2] + 1000, 600, -20, 10, 150);
    tl.add(el("luik-dicht"), { opacity: 0, duration: 1 }, T[2] + 1300);
    opPad("luik-gat", T[2] + 1300);
    teken("luik", T[2] + 1300, 300);
    loop("inst2", LUIK + 12 - INST2, T[2] + 200, 1300);
    erin(T[2] + 1800);
    const nakijkenTot = soort === "bodem" ? 452 : 520;
    kruip(nakijkenTot, T[2] + 2700, 1600);
    werk("inst2-ar", T[2] + 2700, 1600, -110, -70, 260);
    if (soort !== "bodem") kruip(638, T[2] + 4400, 1300); // terug naar het luik, klaar voor stap 4

    // Installateur 1 haalt alvast het materiaal.
    if (soort === "platen") {
      loop("inst1", 104 - 345, T[2] + 1800, 1700);
      vast("inst1", T[2] + 3500);
      draag("stapel", T[2] + 3500, 200, { y: 30 });
      loop("inst1", LUIK - 18 - 345, T[2] + 3700, 1800);
      draag("stapel", T[2] + 3700, 1800, { x: LUIK - 10 - STAPEL.x });
    } else if (soort === "pur") {
      loop("inst1", 160 - 345, T[2] + 2000, 1900);       // naar de machine in de aanhanger
    } else {
      loop("inst1", 104 - 345, T[2] + 1800, 1700);
      vast("inst1", T[2] + 3500);
      draag("zak", T[2] + 3500, 200, { y: 36 });
      loop("inst1", ZAK_PLEK - 14 - 345, T[2] + 3700, 1300);
      draag("zak", T[2] + 3700, 1300, { x: ZAK_PLEK - ZAK.x });
      draag("zak", T[2] + 5000, 300, { y: 50 });         // neerzetten naast het huis
      los("inst1", T[2] + 5200);
    }

    // Stap 4: het isolatiemateriaal aanbrengen, liggend in de kruipruimte.
    const van = soort === "bodem" ? 452 : 638;
    const naar = soort === "bodem" ? 630 : 452;
    const hand = soort === "bodem" ? handOmlaag : handOmhoog;
    const armHoek = soort === "bodem" ? 90 : -90;
    draai("inst2-ar", T[3] + 300, armHoek);
    kruip(naar, T[3] + 1000, 4200);
    teken("laag", T[3] + 1000, 4200);
    if (soort === "platen") {
      draag("stapel", T[3], 600, { y: 30 + 26 });         // via het luik naar beneden
      los("inst1", T[3] + 500);
      tl.add(el("stapel"), { scaleY: 0, duration: 4200, ease: "linear" }, T[3] + 1000);
      werk("inst1-ar", T[3] + 800, 4500, -30, 0, 300);
    } else {
      const slang = soort === "pur" ? slangPur : slangBodem;
      tl.add(el("slang"), { d: slang(hand(van)), duration: 1 }, T[3]);
      tl.add(el("stroom"), { d: slang(hand(van)), duration: 1 }, T[3]);
      teken("slang", T[3] + 50, 900);
      tl.add(el("slang"), { d: slang(hand(naar)), duration: 4200, ease: "linear" }, T[3] + 1000);
      tl.add(el("stroom"), { d: slang(hand(naar)), duration: 4200, ease: "linear" }, T[3] + 1000);
      stroom(T[3] + 1000, 4200);
      werk("inst1-ar", T[3] + 1000, 4300, -70, -40, 300);
      if (soort === "pur") flits("spray", T[3] + 1000, 34, 120);
    }

    // Stap 5: uit de kruipruimte, luik dicht, oplevering.
    draai("inst2-ar", T[4], 0);
    if (soort !== "platen") gum("slang", T[4], 900);
    kruip(LUIK + 30, T[4] + 100, soort === "bodem" ? 400 : 1300);
    eruit(T[4] + 1500);
    gum("luik", T[4] + 2300, 300);
    tl.add(el("luik-dicht"), { opacity: 1, duration: 1 }, T[4] + 2600);
    vanPad("luik-gat", T[4] + 2600);
    standaard.stap5(2400);
    standaard.stap6();
    return tl;
  }

  return { sceneMarkup, bouwTijdlijn };
}
