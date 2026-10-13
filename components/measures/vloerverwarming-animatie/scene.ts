import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import { ACCENT, BG, STAP_DUUR, STIJL, WIT, ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup } from "../animatie/basis";
import { BALLON, geslotenAanhanger, huisMarkup, standaardStappen } from "../animatie/standaard";

// Scène + tijdlijn voor het aanleggen van vloerverwarming. Er is geen
// infographic; de 7 stappen volgen de aangeleverde procesvisuals
// (public/images/maatregelen/vloerverwarming/proces): aankomst, uitleg,
// voorbereiden, leidingen plaatsen, controleren, storten & afwerken,
// drogen & opstarten.
// Het komt ín de vloer: in stap 3 gaat de oude toplaag van de vloer eruit (de
// installateurs staan dan in de uitsparing), daarin komen ondervloer en
// leidingen, en in stap 6 vult de nieuwe dekvloer de uitsparing tot het
// vloeroppervlak; de installateurs komen mee omhoog.

export const T = [0, 1, 2, 3, 4, 5, 6].map(i => i * STAP_DUUR);
export const EIND = 7 * STAP_DUUR;
export const VIEWBOX = "0 30 900 300";

const DIEP = 18;                                         // diepte van de uitsparing in de vloer
const BINNEN = { van: 400, tot: 640 };                   // binnenkant van het huis
const VERDELER = { x: 606, y: 236 };                    // 20 x 22
const KOPIE = { x: 60, y: 240 };                        // verdeler in de aanhanger (achter de wand)
const ROL = { x: 96, y: 248 };                          // rol leiding in de aanhanger, middelpunt
const VLOER = { van: 412, tot: 600 };
const LEIDING_Y = 300 + DIEP - 8;                        // leidingen midden in de uitsparing

/** Leiding in lussen door de vloer, vanaf de verdeler naar links en terug. */
function leidingPad() {
  const y = LEIDING_Y;
  let d = `M${VERDELER.x + 6},${VERDELER.y + 22} V${y}`;
  for (let x = VLOER.tot; x > VLOER.van; x -= 12) d += ` Q${x - 3},${y - 3} ${x - 6},${y} Q${x - 9},${y + 3} ${x - 12},${y}`;
  d += ` Q${VLOER.van - 6},${y} ${VLOER.van},${y + 4} H${VERDELER.x + 14} V${VERDELER.y + 22}`;
  return d;
}

const verdeler = `
  <rect x="0" y="0" width="20" height="22" rx="2" fill="${BG}" stroke="${WIT}" stroke-width="2.2"/>
  <path d="M4,15 V22 M8,15 V22 M12,15 V22 M16,15 V22" stroke="${WIT}" stroke-width="1.5"/>
  <circle class="lampje" cx="10" cy="7" r="2.2" fill="${ACCENT}" style="opacity:0.3"/>`;

/** Een vloerlaag over de hele binnenbreedte, groeiend/krimpend vanaf de onderkant van de uitsparing. */
const laag = (klasse: string, opacity: number, start: "0" | "1") =>
  `<g transform="translate(${BINNEN.van + 1.5},${300 + DIEP})"><g class="wp-as ${klasse}" style="transform:scaleY(${start})"><rect x="0" y="${-DIEP}" width="${BINNEN.tot - BINNEN.van - 3}" height="${DIEP}" fill="${WIT}" fill-opacity="${opacity}"/></g></g>`;

const slangPad = `M150,252 C166,252 160,291 186,291 H${VLOER.van + 16} Q${VLOER.van + 22},291 ${VLOER.van + 22},298 V${300 + DIEP - 4}`;

export function sceneMarkup({ busLogo }: { busLogo: string }) {
  return `
  ${STIJL}
  ${huisMarkup()}
  ${laag("oude-vloer", 0.28, "1")}
  <path d="M${BINNEN.van},300 V${300 + DIEP + 4} H${BINNEN.tot} V300" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linejoin="round"/>
  <path class="ondervloer" d="M${BINNEN.van + 3},${300 + DIEP - 1.5} H${BINNEN.tot - 3}" stroke="${WIT}" stroke-width="3" stroke-dasharray="6 2"/>
  <path class="leiding" d="${leidingPad()}" fill="none" stroke="${ACCENT}" stroke-width="2.2" stroke-linejoin="round"/>
  ${laag("dekvloer", 0.92, "0")}
  <g transform="translate(${VERDELER.x},${VERDELER.y})"><g class="wp-as verdeler" style="opacity:0">${verdeler}</g></g>
  <g transform="translate(${ROL.x},${ROL.y})"><g class="wp-as rol" style="opacity:0"><circle r="9" fill="none" stroke="${ACCENT}" stroke-width="3"/><circle r="4" fill="none" stroke="${ACCENT}" stroke-width="2"/></g></g>
  <path class="slang" d="${slangPad}" fill="none" stroke="${WIT}" stroke-width="3" stroke-linecap="round"/>
  <path class="stroom" d="${slangPad}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>
  <line x1="0" y1="300" x2="${BINNEN.van}" y2="300" stroke="${WIT}" stroke-width="3"/>
  <line x1="${BINNEN.tot}" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  <path class="vloerlijn" d="M${BINNEN.van},300 H${BINNEN.tot}" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", 362, { pet: true })}
  ${busMarkup({ busLogo, lading: geslotenAanhanger })}
  ${ballonMarkup(BALLON.x, BALLON.y)}
  ${vinkjeMarkup(566, 64)}`;
}

export function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
  const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
  const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
  const r = regie(tl, el);
  const { zet, opPad, draai, loop, klim, draag, werk, teken, gum } = r;
  const standaard = standaardStappen(tl, r, el);
  const vast = (id: string, at: number) => { draai(`${id}-ar`, at, -40, 250); draai(`${id}-al`, at, 40, 250); };
  const los = (id: string, at: number) => { draai(`${id}-ar`, at, 0, 200); draai(`${id}-al`, at, 0, 200); };
  const omlaag = (id: string, at: number, duur: number) => werk(`${id}-ar`, at, duur, -20, 10, 240);
  /** Moment waarop iemand die van a naar b loopt (in duur ms vanaf start) de buitenmuur x = 400 passeert. */
  const bijMuur = (start: number, a: number, b: number, duur: number) => start + Math.round(((BINNEN.van - a) / (b - a)) * duur);
  /** De uitsparing in- of uitstappen. */
  const instappen = (id: string, at: number) => klim(id, DIEP, at, 250);
  const uitstappen = (id: string, at: number) => klim(id, 0, at, 250);

  zet("verdeler", 0, { x: KOPIE.x - VERDELER.x, y: KOPIE.y - VERDELER.y });
  standaard.stap1();
  opPad("verdeler", 3000); opPad("rol", 3000);          // staan achter de wand van de aanhanger
  standaard.stap2();

  // Stap 3: de oude toplaag van de vloer eruit, ondervloer leggen; de verdeler aan de muur.
  loop("inst2", 70 - 362, T[2], 1400);                  // eerst naar buiten, naar de aanhanger
  gum("vloerlijn", T[2] + 400, 700);
  tl.add(el("oude-vloer"), { scaleY: 0, duration: 900, ease: "inOutSine" }, T[2] + 500);
  instappen("inst1", T[2] + 500);
  loop("inst1", VLOER.van + 10 - 345, T[2] + 900, 700);
  teken("ondervloer", T[2] + 1600, 3400);
  loop("inst1", VLOER.tot - 345, T[2] + 1600, 3400);    // ondervloer leggen, van links naar rechts
  omlaag("inst1", T[2] + 1600, 3400);
  vast("inst2", T[2] + 1300);
  draag("verdeler", T[2] + 1400, 200, { y: 256 - VERDELER.y });
  loop("inst2", VERDELER.x + 10 - 362, T[2] + 1600, 2600);
  draag("verdeler", T[2] + 1600, 2600, { x: 0 });
  const binnen2 = bijMuur(T[2] + 1600, 70, VERDELER.x + 10, 2600);
  instappen("inst2", binnen2);
  draag("verdeler", binnen2, 250, { y: 256 + DIEP - VERDELER.y });
  draag("verdeler", T[2] + 4200, 400, { y: 0 });        // omhoog, aan de muur
  los("inst2", T[2] + 4600);
  werk("inst2-ar", T[2] + 4700, 1100, -110, -80, 220);

  // Stap 4: de verwarmingsleidingen in de vloer leggen (rol van de aanhanger, in lussen).
  uitstappen("inst1", T[3]);
  loop("inst1", 96 - 345, T[3] + 100, 1500);            // rol leiding halen
  vast("inst1", T[3] + 1500);
  draag("rol", T[3] + 1600, 200, { y: 278 - ROL.y });
  loop("inst1", VERDELER.x - 8 - 345, T[3] + 1800, 1800);
  draag("rol", T[3] + 1800, 1800, { x: VERDELER.x - 8 - ROL.x });
  const binnen1 = bijMuur(T[3] + 1800, 96, VERDELER.x - 8, 1800);
  instappen("inst1", binnen1);
  draag("rol", binnen1, 250, { y: 278 + DIEP - ROL.y });
  loop("inst2", VLOER.van + 30 - 362, T[3] + 600, 1400);
  teken("leiding", T[3] + 3600, 2300);
  loop("inst1", VLOER.van + 10 - 345, T[3] + 3600, 2300); // loopt achteruit en legt de leiding
  draag("rol", T[3] + 3600, 2300, { x: VLOER.van + 10 - ROL.x });
  tl.add(el("rol"), { scale: 0.5, duration: 2300, ease: "linear" }, T[3] + 3600);
  omlaag("inst2", T[3] + 3700, 2100);

  // Stap 5: controleren voordat de vloer dicht gaat (afpersen bij de verdeler, nalopen).
  tl.add(el("rol"), { scale: 0, duration: 300 }, T[4]);
  los("inst1", T[4]);
  loop("inst1", VERDELER.x - 8 - 345, T[4] + 300, 2000);
  werk("inst1-ar", T[4] + 2400, 3000, -110, -80, 240);
  [1, 0.3, 1, 0.3, 1].forEach((o, k) => tl.add(el("lampje"), { opacity: o, duration: 250 }, T[4] + 2600 + k * 450));
  loop("inst2", VLOER.tot - 20 - 362, T[4] + 300, 3200); // loopt de leidingen na
  werk("inst2-ar", T[4] + 300, 3200, 20, -10, 300);

  // Stap 6: de dekvloer storten tot aan het vloeroppervlak; de installateurs komen mee omhoog.
  teken("slang", T[5], 1000);
  tl.add(el("stroom"), { opacity: 1, duration: 150 }, T[5] + 1000);
  tl.add(el("stroom"), { strokeDashoffset: [0, -220], duration: 2800, ease: "linear" }, T[5] + 1000);
  tl.add(el("stroom"), { opacity: 0, duration: 150 }, T[5] + 3800);
  tl.add(el("dekvloer"), { scaleY: 1, duration: 2800, ease: "linear" }, T[5] + 1000);
  tl.add(el("inst1"), { y: 0, duration: 2800, ease: "linear" }, T[5] + 1000);
  tl.add(el("inst2"), { y: 0, duration: 2800, ease: "linear" }, T[5] + 1000);
  teken("vloerlijn", T[5] + 3800, 500);                 // de vloer is weer dicht
  loop("inst2", VLOER.van + 20 - 362, T[5], 700);
  loop("inst2", VLOER.tot - 362, T[5] + 1000, 2800);    // trekt de vloer af
  omlaag("inst2", T[5] + 1000, 2800);
  gum("slang", T[5] + 4000, 900);
  standaard.bewonersTerug(T[5] + 3400);

  // Stap 7: drogen en rustig opstarten; uitleg, vinkje, en weer weg.
  standaard.afronding(T[6], EIND);
  return tl;
}
