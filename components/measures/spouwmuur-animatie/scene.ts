import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import { ACCENT, BG, EIND, STIJL, T, WIT, ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup } from "../animatie/basis";
import { BALLON, geslotenAanhanger, huisMarkup, standaardStappen } from "../animatie/standaard";

// Scène + tijdlijn voor "Spouwmuurisolatie plaatsen in één dag" (Gijs-infographic).
// Huis met dubbele muren (spouw: x 400-407 en 633-640).
// Stap 3: vanaf ladders aan beide kanten boren ze gaten in de voegen van de
// buitenmuur; de boor gaat zichtbaar door de buitenmuur de spouw in.
// Stap 4: slangen vanaf de gesloten aanhanger, langs de ladder naar de
// spuitmond. Per gat (van onder naar boven) stroomt er isolatie door de slang en
// vult de spouw verder op; daarna worden de gaten van boven naar beneden afgevoegd.

export { T, EIND };
export const VIEWBOX = "0 30 900 285";

const GATEN = [188, 213, 238, 263];                     // hoogte van de boorgaten (van boven naar beneden)
const VOETEN = GATEN.map(y => Math.min(0, y + 38 - 300)); // y-verschuiving van de installateur bij dat gat
const LINKS = 374, RECHTS = 666;                         // waar de installateurs op de ladder staan
/** Hoe ver de spouw gevuld is (scaleY) als het gat op hoogte y gevuld is. */
const VULLING = (y: number) => Math.min(1, (300 - (y - 25)) / 137);

/** Boor/spuitmond in de hand, langs de arm; de punt komt ~29 naast het midden van het poppetje. */
const gereedschap = (r: 1 | -1) =>
  `<g><rect x="${r > 0 ? 0 : -8}" y="9" width="8" height="8" rx="2" fill="${WIT}"/><path d="M${4 * r},17 V23" stroke="${WIT}" stroke-width="2.2" stroke-linecap="round"/></g>`;
const ladder = (x: number, klasse: string) => {
  const sporten = Array.from({ length: 9 }, (_, i) => `M${x - 6},${288 - i * 12} H${x + 6}`).join(" ");
  return `<path class="${klasse}" d="M${x - 6},300 V190 M${x + 6},300 V190 ${sporten}" fill="none" stroke="${WIT}" stroke-width="2" stroke-linecap="round"/>`;
};
/** Slang van de aanhanger, over de grond, langs de ladder omhoog naar de spuitmond op hoogte y. */
const slangLinks = (y: number) => `M150,252 C166,252 160,291 186,291 H356 Q362,291 362,283 V${y + 16} Q362,${y + 3} 389,${y + 3}`;
const slangRechts = (y: number) => `M150,255 C168,255 162,294 190,294 H672 Q678,294 678,286 V${y + 16} Q678,${y + 3} 651,${y + 3}`;

export function sceneMarkup({ busLogo }: { busLogo: string }) {
  const spouw = (x: number, klasse: string) =>
    `<g transform="translate(${x},300)"><g class="wp-as ${klasse}" style="transform:scaleY(0)"><path d="M0,0 V-137" stroke="${WIT}" stroke-width="5.5" stroke-dasharray="2.2 1.4"/></g></g>`;
  const onder = GATEN[GATEN.length - 1];
  const stof = (x: number, r: 1 | -1, k: string) => `<g transform="translate(${x},0)"><g class="wp-as ${k}"><g class="${k}-stof" stroke="${WIT}" stroke-width="1.8" stroke-linecap="round" style="opacity:0">
    <path d="M0,0 l${-6 * r},-5 M0,0 l${-8 * r},0 M0,0 l${-6 * r},5 M${-3 * r},-2 l${-3 * r},-6 M${-3 * r},2 l${-3 * r},6"/></g></g></g>`;
  return `
  ${STIJL}
  ${huisMarkup({ dubbel: true })}
  ${spouw(403.5, "spouw-l")}${spouw(636.5, "spouw-r")}
  ${GATEN.map((y, k) => `<g class="gat gat-${k}" style="opacity:0"><circle cx="400" cy="${y}" r="2.8" fill="${BG}" stroke="${WIT}" stroke-width="1.4"/><circle cx="640" cy="${y}" r="2.8" fill="${BG}" stroke="${WIT}" stroke-width="1.4"/></g>`).join("")}
  ${ladder(LINKS, "ladder-l")}${ladder(RECHTS, "ladder-r")}
  <path class="slang slang-l" d="${slangLinks(onder)}" fill="none" stroke="${WIT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path class="slang slang-r" d="${slangRechts(onder)}" fill="none" stroke="${WIT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path class="stroom stroom-l" d="${slangLinks(onder)}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>
  <path class="stroom stroom-r" d="${slangRechts(onder)}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>
  ${stof(404, 1, "stof-l")}${stof(636, -1, "stof-r")}
  <line x1="0" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true, hand: gereedschap(1) })}
  ${poppetje("inst2", 362, { pet: true, handLinks: gereedschap(-1) })}
  ${busMarkup({ busLogo, lading: geslotenAanhanger })}
  ${ballonMarkup(BALLON.x, BALLON.y)}
  ${vinkjeMarkup(566, 64)}`;
}

export function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
  const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
  const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
  const r = regie(tl, el);
  const { zet, opPad, draai, loop, klim, flits, teken, gum } = r;
  const standaard = standaardStappen(tl, r, el);
  /** Arm trilt tijdens het boren, en eindigt weer horizontaal (naar de muur). */
  const tril = (c: string, at: number, duur: number, basis: number) => {
    const n = Math.floor(duur / 70);
    tl.add(el(c), { rotate: [...Array.from({ length: n }, (_, k) => ({ to: basis + (k % 2 ? 3 : -3), duration: 70 })), { to: basis, duration: 70 }] }, at);
  };
  const naarMuur = (at: number) => { draai("inst1-ar", at, -95); draai("inst2-al", at, 95); };
  const beide = (fn: (id: string) => void) => { fn("inst1"); fn("inst2"); };

  standaard.stap1();
  standaard.stap2();

  // Stap 3: ladders tegen beide gevels, van boven naar beneden gaten boren.
  teken("ladder-l", T[2], 600); teken("ladder-r", T[2] + 100, 600);
  loop("inst1", LINKS - 345, T[2], 900);
  loop("inst2", RECHTS - 362, T[2], 1000);
  naarMuur(T[2] + 1300);
  GATEN.forEach((y, k) => {
    const at = T[2] + 1000 + k * 1150;
    beide(id => klim(id, VOETEN[k], at, k ? 300 : 600));
    zet("stof-l", at + 650, { y }); zet("stof-r", at + 650, { y });
    tril("inst1-ar", at + 700, 600, -95); tril("inst2-al", at + 700, 600, 95);
    flits("stof-l-stof", at + 700, 5); flits("stof-r-stof", at + 700, 5);
    opPad(`gat-${k}`, at + 1000);
  });

  // Stap 4: slangen vanaf de aanhanger; per gat (onder naar boven) isolatie inspuiten.
  teken("slang-l", T[3], 1100); teken("slang-r", T[3] + 150, 1200);
  [...GATEN].reverse().forEach((y, i) => {
    const at = T[3] + 1300 + i * 850;
    if (i) {
      beide(id => klim(id, VOETEN[GATEN.indexOf(y)], at, 250));
      tl.add(el("slang-l"), { d: slangLinks(y), duration: 250, ease: "linear" }, at);
      tl.add(el("stroom-l"), { d: slangLinks(y), duration: 250, ease: "linear" }, at);
      tl.add(el("slang-r"), { d: slangRechts(y), duration: 250, ease: "linear" }, at);
      tl.add(el("stroom-r"), { d: slangRechts(y), duration: 250, ease: "linear" }, at);
    }
    tl.add(el("spouw-l"), { scaleY: VULLING(y), duration: 550, ease: "linear" }, at + 250);
    tl.add(el("spouw-r"), { scaleY: VULLING(y), duration: 550, ease: "linear" }, at + 250);
  });
  tl.add(el("stroom"), { opacity: 1, duration: 150 }, T[3] + 1500);
  tl.add(el("stroom"), { strokeDashoffset: [0, -260], duration: 3300, ease: "linear" }, T[3] + 1500);
  tl.add(el("stroom"), { opacity: 0, duration: 150 }, T[3] + 4750);
  gum("slang-l", T[3] + 4900, 800); gum("slang-r", T[3] + 4950, 800);
  // Gaten afvoegen, van boven naar beneden.
  GATEN.forEach((_, k) => {
    const at = T[3] + 4900 + k * 270;
    if (k) beide(id => klim(id, VOETEN[k], at, 220));
    tl.add(el(`gat-${k}`), { opacity: 0, duration: 220 }, at + 30);
  });

  // Stap 5: ladders weg, oplevering.
  draai("inst1-ar", T[4], 0); draai("inst2-al", T[4], 0);
  gum("ladder-l", T[4] + 200, 600); gum("ladder-r", T[4] + 300, 600);
  standaard.stap5(300);
  standaard.stap6();
  return tl;
}
