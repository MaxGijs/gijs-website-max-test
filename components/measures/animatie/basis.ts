import { stagger, svg as animeSvg, type Timeline } from "animejs";

// Gedeelde bouwstenen voor de installatie-animaties in Gijs-infographicstijl
// (wit op donkergroen). De warmtepomp-scène (../warmtepomp-animatie/scene.ts)
// heeft nog een eigen kopie van deze tekeningen; nieuwe scènes gebruiken deze.
//
// Regie-afspraken (Max, Naud, Thom): niets verschijnt uit het niets; mensen
// lopen in beeld of stappen achter de bus vandaan, spullen komen van de
// aanhanger, bouwwerk wordt als lijnen ingetekend. Bewoners zijn thuis en
// zwaaien; bij de uitleg een tekstwolkje. Alle stappen even lang.

export const BG = "#133E35";
export const ACCENT = "#17BF92";
export const WIT = "#fff";

/** Vaste stapduur (ms, op normale snelheid). */
export const STAP_DUUR = 6000;
export const T = [0, 1, 2, 3, 4, 5].map(i => i * STAP_DUUR);
export const EIND = 6 * STAP_DUUR;

export const STIJL = `<style>.wp-as{transform-box:view-box;transform-origin:0 0}</style>`;

const lijn = (x1: number, y1: number, x2: number, y2: number, w = 4) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${WIT}" stroke-width="${w}" stroke-linecap="round"/>`;

/** Poppetje met de voeten op de grond (y = 300). Armen en benen draaien om schouder/heup. */
export function poppetje(id: string, x: number, { pet = false, hand = "", handLinks = "", haar = false } = {}) {
  return `<g transform="translate(${x},300)"><g class="wp-as ${id}" style="opacity:0">
    <g transform="translate(-3,-20)"><g class="wp-as ${id}-bl">${lijn(0, 0, -1, 20)}</g></g>
    <g transform="translate(3,-20)"><g class="wp-as ${id}-br">${lijn(0, 0, 1, 20)}</g></g>
    <rect x="-7" y="-42" width="14" height="24" rx="5" fill="${WIT}"/>
    <g transform="translate(-6,-38)"><g class="wp-as ${id}-al">${lijn(0, 0, -4, 15, 3.5)}${handLinks}</g></g>
    <g transform="translate(6,-38)"><g class="wp-as ${id}-ar">${lijn(0, 0, 4, 15, 3.5)}${hand}</g></g>
    ${haar ? `<path d="M-8,-50 Q-8,-59 0,-59 Q8,-59 8,-50 L9,-38 L-9,-38 Z" fill="${WIT}"/>` : ""}
    <circle cy="-50" r="7" fill="${WIT}"/>
    ${pet ? `<path d="M-7.5,-51 A7.5,7.5 0 0 1 7.5,-51 L12,-51 L12,-48.5 L-7.5,-48.5 Z" fill="${ACCENT}"/>` : ""}
  </g></g>`;
}

const wiel = (x: number, r = 12) => `<g transform="translate(${x},${300 - r})"><g class="wp-as wiel">
  <circle r="${r}" fill="${BG}" stroke="${WIT}" stroke-width="3.5"/>
  <path d="M${-r + 4},0 H${r - 4} M0,${-r + 4} V${r - 4}" stroke="${WIT}" stroke-width="2"/></g></g>`;

/** Bus met aanhanger (geparkeerd: bus x 172-370, laadvloer x 50-158, bovenkant y 262). */
export function busMarkup({ busLogo, lading }: { busLogo: string; lading: string }) {
  return `<g class="wp-as bus" style="transform:translateX(-760px)">
    <g class="snelheid" stroke="${WIT}" stroke-width="2.5" stroke-linecap="round" style="opacity:0"><path d="M26,238 H48 M16,254 H48 M26,270 H48"/></g>
    <rect x="50" y="262" width="108" height="14" rx="3" fill="${WIT}"/>
    <path d="M158,270 L174,272" stroke="${WIT}" stroke-width="3"/>
    ${lading}
    ${wiel(104, 11)}
    <g transform="translate(40,0)">
      <path d="M132,288 V222 Q132,214 140,214 H268 Q280,214 288,224 L310,252 Q330,256 330,270 V282 Q330,288 324,288 Z" fill="${WIT}"/>
      <path d="M272,222 H284 L304,250 H272 Z" fill="${BG}"/>
      <path d="M262,222 V282" stroke="${BG}" stroke-width="1.5"/>
      <image href="${busLogo}" x="152" y="226" width="68" height="38.8"/>
    </g>
    ${wiel(206)}${wiel(338)}
  </g>`;
}

/** Tekstwolkje; de staart wijst naar (x, y). */
export const ballonMarkup = (x: number, y: number) => `<g transform="translate(${x},${y})"><g class="wp-as ballon" style="transform:scale(0)">
    <rect x="0" y="-34" width="48" height="26" rx="13" fill="${WIT}"/>
    <path d="M5,-12 L0,0 L15,-10 Z" fill="${WIT}"/>
    <circle class="stip" cx="13" cy="-21" r="3" fill="${BG}"/><circle class="stip" cx="24" cy="-21" r="3" fill="${BG}"/><circle class="stip" cx="35" cy="-21" r="3" fill="${BG}"/>
  </g></g>`;

export const vinkjeMarkup = (x: number, y: number) =>
  `<path class="vinkje" d="M${x},${y} l16,16 l30,-34" fill="none" stroke="${WIT}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Regie-hulpjes op een tijdlijn; `el` zoekt elementen op klasse binnen de scène. */
export function regie(tl: Timeline, el: (c: string) => SVGElement[]) {
  const zet = (c: string, at: number, waarden: Record<string, number>) => tl.add(el(c), { ...waarden, duration: 1 }, at);
  const opPad = (c: string, at: number) => tl.add(el(c), { opacity: 1, duration: 1 }, at);
  const vanPad = (c: string, at: number) => tl.add(el(c), { opacity: 0, duration: 1 }, at);
  const draai = (c: string, at: number, rotate: number, duur = 300) => tl.add(el(c), { rotate, duration: duur }, at);
  const pendel = (from: number, to: number, n: number, stap: number) =>
    [...Array.from({ length: n }, (_, k) => ({ to: k % 2 ? from : to, duration: stap })), { to: 0, duration: stap }];
  const benen = (id: string, at: number, duur: number) => {
    const n = Math.max(2, Math.round(duur / 230));
    const stap = duur / (n + 1);
    tl.add(el(`${id}-bl`), { rotate: pendel(-22, 22, n, stap) }, at);
    tl.add(el(`${id}-br`), { rotate: pendel(22, -22, n, stap) }, at);
  };
  /** Lopen/klimmen naar een verschuiving t.o.v. de beginplek. */
  const beweeg = (id: string, naar: { x?: number; y?: number }, at: number, duur: number) => {
    tl.add(el(id), { ...naar, duration: duur, ease: "linear" }, at);
    benen(id, at, duur);
  };
  const loop = (id: string, x: number, at: number, duur: number) => beweeg(id, { x }, at, duur);
  const klim = (id: string, y: number, at: number, duur: number) => beweeg(id, { y }, at, duur);
  const draag = (c: string, at: number, duur: number, waarden: Record<string, number>) =>
    tl.add(el(c), { ...waarden, duration: duur, ease: "linear" }, at);
  const werk = (c: string, at: number, duur: number, a: number, b: number, stap = 260) =>
    tl.add(el(c), { rotate: pendel(a, b, Math.max(2, Math.round(duur / stap) - 1), stap) }, at);
  const flits = (c: string, at: number, n: number, stap = 120) => {
    for (let k = 0; k < n; k++) tl.add(el(c), { opacity: k % 2 ? 0.2 : 1, duration: stap }, at + k * stap);
    tl.add(el(c), { opacity: 0, duration: 200 }, at + n * stap);
  };
  const teken = (c: string, at: number, duur: number) =>
    tl.add(animeSvg.createDrawable(el(c), 0, 0), { draw: ["0 0", "0 1"], duration: duur, ease: "inOutSine" }, at);
  /** Bouwwerk weer afbreken: lijnen trekken zich terug. */
  const gum = (c: string, at: number, duur: number) => {
    tl.add(animeSvg.createDrawable(el(c), 0, 0), { draw: ["0 1", "0 0"], duration: duur, ease: "inOutSine" }, at);
    tl.add(el(c), { opacity: [1, 0], duration: 1 }, at + duur); // geen ronde lijnkapjes laten staan
  };
  /** Tekstwolkje met drie stippen die om de beurt oplichten. */
  const praat = (at: number, duur: number) => {
    tl.add(el("ballon"), { scale: [0, 1], duration: 400, ease: "outBack" }, at);
    for (let k = 0; k * 300 < duur - 700; k++) tl.add(el("stip"), { opacity: k % 2 ? 1 : 0.3, duration: 250, delay: stagger(80) }, at + 400 + k * 300);
    tl.add(el("stip"), { opacity: 1, duration: 1 }, at + duur - 250);
    tl.add(el("ballon"), { scale: 0, duration: 250, ease: "inQuad" }, at + duur - 250);
  };
  const zwaai = (id: string, at: number, duur: number) => werk(`${id}-al`, at, duur, 160, 125, 220);

  return { zet, opPad, vanPad, draai, beweeg, loop, klim, draag, werk, flits, teken, gum, praat, zwaai };
}
