import { createTimeline, stagger, svg as animeSvg, type Timeline, type TimelineParams } from "animejs";

// Gedeelde scène + tijdlijn voor "Hybride warmtepomp plaatsen in één dag"
// (Gijs-infographic, 6 stappen). Gebruikt door de website-animatie
// (WarmtepompInstallatieAnimatie.tsx) én door het render-script van de
// video, zodat beide exact hetzelfde laten zien.
//
// Regie-afspraken (Max + Naud, 2026-10-09):
// - Niets verschijnt uit het niets: mensen lopen het beeld in of stappen
//   achter de bus vandaan, units worden van de aanhanger gehaald en
//   gedragen, het interieur van het huis wordt als lijnen ingetekend.
//   Geen losse symbolen; alleen het vinkje (staat ook op de infographic).
// - Stap 3: boren door de vloer naar de kruipruimte; vanaf daar leidingen
//   naar radiatoren aan beide muren.
// - Stap 4: de installateur boven plaatst de binnenunit naast de cv; de
//   ander plaatst de buitenunit. Daarna een bypass vanaf de radiator-
//   leidingen naar de buitenunit. Bewoners blijven weg.
// - De bewoners zijn al thuis en zwaaien. Bij de uitleg (stap 2 en 5) staat
//   iedereen midden in huis, niet voor de radiatoren; met tekstwolkje. Na de
//   uitleg in stap 2 gaan de bewoners weg, in stap 5 komen ze terug.

/** Starttijd (ms, op normale snelheid) van elke stap, plus het einde. */
/** Alle stappen even lang (Max, 2026-10-09). */
export const STAP_DUUR = 6000;
export const T = [0, 1, 2, 3, 4, 5].map(i => i * STAP_DUUR);
export const EIND = 6 * STAP_DUUR;
export const VIEWBOX = "0 30 900 305";

const BG = "#133E35";
const ACCENT = "#17BF92";
const WIT = "#fff";

const lijn = (x1: number, y1: number, x2: number, y2: number, w = 4) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${WIT}" stroke-width="${w}" stroke-linecap="round"/>`;

/** Poppetje met de voeten op de grond (y = 300). Armen en benen draaien om schouder/heup. */
function poppetje(id: string, x: number, { pet = false, hand = "", haar = false, schaal = 1 } = {}) {
  return `<g transform="translate(${x},300) scale(${schaal})"><g class="wp-as ${id}" style="opacity:0">
    <g transform="translate(-3,-20)"><g class="wp-as ${id}-bl">${lijn(0, 0, -1, 20)}</g></g>
    <g transform="translate(3,-20)"><g class="wp-as ${id}-br">${lijn(0, 0, 1, 20)}</g></g>
    <rect x="-7" y="-42" width="14" height="24" rx="5" fill="${WIT}"/>
    <g transform="translate(-6,-38)"><g class="wp-as ${id}-al">${lijn(0, 0, -4, 15, 3.5)}</g></g>
    <g transform="translate(6,-38)"><g class="wp-as ${id}-ar">${lijn(0, 0, 4, 15, 3.5)}${hand}</g></g>
    ${haar ? `<path d="M-8,-50 Q-8,-59 0,-59 Q8,-59 8,-50 L9,-38 L-9,-38 Z" fill="${WIT}"/>` : ""}
    <circle cy="-50" r="7" fill="${WIT}"/>
    ${pet ? `<path d="M-7.5,-51 A7.5,7.5 0 0 1 7.5,-51 L12,-51 L12,-48.5 L-7.5,-48.5 Z" fill="${ACCENT}"/>` : ""}
  </g></g>`;
}

const wiel = (x: number, r = 12) => `<g transform="translate(${x},${300 - r})"><g class="wp-as wiel">
  <circle r="${r}" fill="${BG}" stroke="${WIT}" stroke-width="3.5"/>
  <path d="M${-r + 4},0 H${r - 4} M0,${-r + 4} V${r - 4}" stroke="${WIT}" stroke-width="2"/></g></g>`;

const KOPER = "#B9845C";
/**
 * Buitenunit: DeWarmte-unit (donker frame, koperkleurige lamellen in een
 * golf, merknaam verticaal rechts), lokaal 64 x 42.
 */
const buitenunitTekening = (lamelKlasse: string) => {
  const lamellen = Array.from({ length: 16 }, (_, i) => {
    const x = 6 + i * 3.05;
    const golf = Math.sin(i / 2.6) * 1.6;
    return `<path class="${lamelKlasse}" d="M${x},5 C${x + golf},15 ${x - golf},27 ${x},37" stroke="${KOPER}" stroke-width="1.9" fill="none" stroke-linecap="round"/>`;
  }).join("");
  return `
  <rect x="0" y="0" width="64" height="42" rx="2.5" fill="#1D2321" stroke="${WIT}" stroke-width="2.5"/>
  ${lamellen}
  <text transform="translate(61.5,37.5) rotate(-90)" font-size="5.6" font-weight="700" fill="${KOPER}" font-family="Arial, sans-serif" letter-spacing="0.2">DeWarmte</text>`;
};
/** Binnenunit, lokaal 30 x 34. */
const binnenunitTekening = (schermKlasse: string) => `
  <rect x="0" y="0" width="30" height="34" rx="3" fill="${BG}" stroke="${WIT}" stroke-width="3"/>
  <rect class="${schermKlasse}" x="7" y="7" width="16" height="7" rx="1.5" fill="${ACCENT}" style="opacity:0.3"/>`;

/** Ledenradiator tegen de muur, 28 breed, onderkant op y = 280 (aansluiting in het midden). */
function radiator(x: number, kraan: "links" | "rechts") {
  const lijn = `class="radiator" fill="none" stroke="${WIT}" stroke-linecap="round"`;
  const leden = Array.from({ length: 6 }, (_, i) =>
    `<rect ${lijn} x="${x + 0.4 + i * 4.7}" y="252" width="3.6" height="26" rx="1.8" stroke-width="1.6"/>`).join("");
  const kx = kraan === "rechts" ? x + 28 : x;
  const r = kraan === "rechts" ? 1 : -1;
  return `${leden}
  <path ${lijn} d="M${x},256 H${x + 28} M${x},274 H${x + 28}" stroke-width="1.2"/>
  <path ${lijn} d="M${x + 4},278 V281 M${x + 24},278 V281" stroke-width="1.6"/>
  <path ${lijn} d="M${kx},274 H${kx + 4 * r} M${kx + 4 * r},271 V277 M${kx + 2.5 * r},270 H${kx + 5.5 * r}" stroke-width="1.6"/>`;
}

/** De binnenkant van het <svg>-element (viewBox: VIEWBOX). */
export function sceneMarkup({ busLogo, hoekLogo }: { busLogo: string; hoekLogo?: string }) {
  const boor = `<g class="boor"><rect x="0" y="12" width="8" height="10" rx="2" fill="${WIT}"/><path d="M4,22 V38" stroke="${WIT}" stroke-width="2"/></g>`;
  const tekenLijn = `fill="none" stroke="${WIT}" stroke-width="3"`;
  return `
  <style>.wp-as{transform-box:view-box;transform-origin:0 0}</style>
  ${hoekLogo ? `<image href="${hoekLogo}" x="796" y="38" width="88" height="50"/>` : ""}
  <polygon class="warm" points="400,300 400,160 520,70 640,160 640,300" fill="${ACCENT}" style="opacity:0"/>
  <path d="M400,300 V160 L520,70 L640,160 V300" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M400,300 V330 H640 V300" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-dasharray="6 5"/>
  <line class="zolder" x1="400" y1="172" x2="640" y2="172" stroke="${ACCENT}" stroke-width="3"/>
  <path class="trap" d="M560,300 V172 M576,300 V172 M560,284 H576 M560,268 H576 M560,252 H576 M560,236 H576 M560,220 H576 M560,204 H576 M560,188 H576" fill="none" stroke="${WIT}" stroke-width="2" stroke-linecap="round"/>
${radiator(404, "rechts")}
  ${radiator(608, "links")}
  <rect class="cv" x="444" y="132" width="26" height="38" rx="3" ${tekenLijn}/>
  <circle class="cv" cx="457" cy="146" r="4" ${tekenLijn} stroke-width="2"/>
  <path class="pijp" d="M457,172 V316" ${tekenLijn}/>
  <path class="pijp-kruip" d="M418,280 V316 H622 V280" ${tekenLijn} stroke-linejoin="round"/>
  <path class="pijp-buiten" d="M622,316 H698 V298" ${tekenLijn} stroke-linejoin="round"/>
  <path class="verbinding" d="M470,152 H480" ${tekenLijn}/>
  <g transform="translate(457,297)"><g class="vonk" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" style="opacity:0">
    <path d="M0,0 l-7,-5 M0,0 l7,-5 M0,0 l-9,0 M0,0 l9,0 M0,0 l-5,-8 M0,0 l5,-8"/></g></g>
  <g transform="translate(480,136)"><g class="wp-as binnenunit" style="opacity:0">${binnenunitTekening("scherm")}</g></g>
  <g transform="translate(666,258)"><g class="wp-as buitenunit" style="opacity:0">${buitenunitTekening("lamel")}</g></g>
  <line x1="0" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", 362, { pet: true, hand: boor })}
  <g class="wp-as bus" style="transform:translateX(-760px)">
    <g class="snelheid" stroke="${WIT}" stroke-width="2.5" stroke-linecap="round" style="opacity:0"><path d="M26,238 H48 M16,254 H48 M26,270 H48"/></g>
    <rect x="50" y="262" width="108" height="14" rx="3" fill="${WIT}"/>
    <path d="M158,270 L174,272" stroke="${WIT}" stroke-width="3"/>
    <g class="buiten-kopie" transform="translate(52,220)">${buitenunitTekening("lamel-kopie")}</g>
    <g class="binnen-kopie" transform="translate(122,228)">${binnenunitTekening("scherm-kopie")}</g>
    ${wiel(104, 11)}
    <g transform="translate(40,0)">
      <path d="M132,288 V222 Q132,214 140,214 H268 Q280,214 288,224 L310,252 Q330,256 330,270 V282 Q330,288 324,288 Z" fill="${WIT}"/>
      <path d="M272,222 H284 L304,250 H272 Z" fill="${BG}"/>
      <path d="M262,222 V282" stroke="${BG}" stroke-width="1.5"/>
      <image href="${busLogo}" x="152" y="226" width="68" height="38.8"/>
    </g>
    ${wiel(206)}${wiel(338)}
  </g>
  <g transform="translate(474,238)"><g class="wp-as ballon" style="transform:scale(0)">
    <rect x="0" y="-34" width="48" height="26" rx="13" fill="${WIT}"/>
    <path d="M5,-12 L0,0 L15,-10 Z" fill="${WIT}"/>
    <circle class="stip" cx="13" cy="-21" r="3" fill="${BG}"/><circle class="stip" cx="24" cy="-21" r="3" fill="${BG}"/><circle class="stip" cx="35" cy="-21" r="3" fill="${BG}"/>
  </g></g>
  <path class="vinkje" d="M566,64 L582,80 L612,46" fill="none" stroke="${WIT}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** Bouwt de tijdlijn op de elementen uit sceneMarkup() binnen `root`. */
export function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
  const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
  const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });

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
  /** Lopen naar positie x (verschuiving t.o.v. de beginplek). */
  const loop = (id: string, x: number, at: number, duur: number) => {
    tl.add(el(id), { x, duration: duur, ease: "linear" }, at);
    benen(id, at, duur);
  };
  /** Trap op of af naar hoogte y. */
  const klim = (id: string, y: number, at: number, duur: number) => {
    tl.add(el(id), { y, duration: duur, ease: "linear" }, at);
    benen(id, at, duur);
  };
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

  /** Tekstwolkje met drie stippen die om de beurt oplichten. */
  const praat = (at: number, duur: number) => {
    tl.add(el("ballon"), { scale: [0, 1], duration: 400, ease: "outBack" }, at);
    for (let k = 0; k * 300 < duur - 700; k++) tl.add(el("stip"), { opacity: k % 2 ? 1 : 0.3, duration: 250, delay: stagger(80) }, at + 400 + k * 300);
    tl.add(el("stip"), { opacity: 1, duration: 1 }, at + duur - 250);
    tl.add(el("ballon"), { scale: 0, duration: 250, ease: "inQuad" }, at + duur - 250);
  };
  const zwaai = (id: string, at: number, duur: number) => werk(`${id}-al`, at, duur, 160, 125, 220);

  // Stap 1: de bewoners zijn thuis; de bus rijdt aan, de installateurs
  // stappen achter de bus vandaan en de bewoners zwaaien.
  zet("bewoner", 0, { x: 22 }); zet("bewoner2", 0, { x: 24 });
  opPad("bewoner", 0); opPad("bewoner2", 0);
  tl.add(el("bus"), { x: [-760, 0], duration: 3000, ease: "outCubic" }, 0);
  tl.add(el("wiel"), { rotate: [0, 1260], duration: 3000, ease: "outCubic" }, 0);
  opPad("inst1", 3000); opPad("inst2", 3000);           // nog achter de bus
  loop("inst1", 40, 3300, 800);
  loop("inst2", 40, 3600, 800);
  zwaai("bewoner", 3300, 2200); zwaai("bewoner2", 3500, 2000);

  // Stap 2: uitleg midden in huis; daarna gaan de bewoners weg.
  loop("inst1", 123, T[1], 1100);
  loop("inst2", 133, T[1] + 100, 1100);
  praat(T[1] + 1300, 3000);
  werk("inst1-ar", T[1] + 1300, 2900, -70, -40, 300);
  loop("bewoner", 430, T[1] + 4400, 1900);
  loop("bewoner2", 430, T[1] + 4500, 1900);

  // Stap 3: interieur intekenen, boren naar de kruipruimte, leidingen naar de
  // radiatoren. Daarna haalt de tweede installateur de binnenunit van de aanhanger.
  zet("binnenunit", T[2], { x: -358, y: 92 });           // = plek op de aanhanger
  zet("buitenunit", T[2], { x: -614, y: -38 });
  teken("zolder", T[2], 800);
  teken("trap", T[2] + 400, 700);
  teken("cv", T[2] + 400, 700);
  teken("radiator", T[2] + 400, 700);
  loop("inst1", 223, T[2] + 100, 900);                   // naar de zoldertrap
  klim("inst1", -128, T[2] + 1000, 1300);
  loop("inst1", 180, T[2] + 2300, 400);                  // op zolder naar de cv
  werk("inst1-ar", T[2] + 2800, 3000, -20, -55);
  loop("inst2", 85, T[2] + 100, 500);                    // boven het boorpunt
  werk("inst2-ar", T[2] + 500, 1800, -4, 3, 70);
  flits("vonk", T[2] + 500, 15);
  teken("pijp", T[2] + 2400, 900);
  teken("pijp-kruip", T[2] + 3300, 1600);
  loop("inst2", -225, T[2] + 2400, 1400);                // naar de aanhanger
  vanPad("binnen-kopie", T[2] + 3800); opPad("binnenunit", T[2] + 3800);
  draai("inst2-ar", T[2] + 3800, -40, 200); draai("inst2-al", T[2] + 3800, 40, 200);
  draag("binnenunit", T[2] + 3800, 200, { y: 120 });
  loop("inst2", 206, T[2] + 4000, 1500);                 // naar de trap
  draag("binnenunit", T[2] + 4000, 1500, { x: 73 });

  // Stap 4: binnenunit via de trap naar boven, naast de cv; buitenunit naast het huis.
  draai("inst1-ar", T[3], 0, 200);
  loop("inst1", 211, T[3], 400);                         // naar het trapgat
  draai("inst2-ar", T[3] + 400, -150); draai("inst2-al", T[3] + 400, 150);
  draag("binnenunit", T[3] + 400, 700, { y: -8, x: 61 });
  draai("inst2-ar", T[3] + 1100, 0); draai("inst2-al", T[3] + 1100, 0);
  loop("inst1", 180, T[3] + 1100, 1000);
  tl.add(el("binnenunit"), { x: 0, y: 0, duration: 1000, ease: "inOutSine" }, T[3] + 1100);
  teken("verbinding", T[3] + 2200, 400);
  werk("inst1-ar", T[3] + 2600, 3200, -60, -100);
  loop("inst2", -278, T[3] + 1100, 1700);                // terug naar de aanhanger
  vanPad("buiten-kopie", T[3] + 2800); opPad("buitenunit", T[3] + 2800);
  draai("inst2-ar", T[3] + 2800, -40, 200); draai("inst2-al", T[3] + 2800, 40, 200);
  draag("buitenunit", T[3] + 2800, 200, { y: -8 });
  loop("inst2", 336, T[3] + 3000, 1900);                 // naar de plek naast het huis
  draag("buitenunit", T[3] + 3000, 1900, { x: 0 });
  tl.add(el("buitenunit"), { y: 0, duration: 300, ease: "outQuad" }, T[3] + 4900);
  draai("inst2-ar", T[3] + 4900, 0); draai("inst2-al", T[3] + 4900, 0);
  loop("inst2", 398, T[3] + 5200, 500);
  teken("pijp-buiten", T[3] + 5100, 800);
  // Aan: een rustige glans loopt een paar keer over de lamellen.
  for (let k = 0; k < 3; k++) {
    const at = T[3] + 5900 + k * 2600;
    tl.add(el("lamel"), { opacity: 0.35, duration: 300, delay: stagger(45) }, at);
    tl.add(el("lamel"), { opacity: 1, duration: 400, delay: stagger(45) }, at + 300);
  }
  [1, 0.3, 1].forEach((o, k) => tl.add(el("scherm"), { opacity: o, duration: 250 }, T[3] + 5200 + k * 250));

  // Stap 5: inregelen en opleveren; de bewoners komen terug voor de uitleg.
  draai("inst1-ar", T[4], 0, 200);
  loop("inst1", 223, T[4], 500);
  klim("inst1", 0, T[4] + 500, 1100);
  loop("inst1", 123, T[4] + 1600, 700);
  loop("inst2", 133, T[4], 1700);
  loop("bewoner", 22, T[4] + 200, 2300);
  loop("bewoner2", 24, T[4] + 300, 2300);
  teken("vinkje", T[4] + 2000, 500);
  praat(T[4] + 2700, 3000);
  werk("inst1-ar", T[4] + 2700, 2900, -70, -40, 300);

  // Stap 6: de installateurs stappen in, de bus rijdt weg, het gezin zwaait.
  tl.add(el("vinkje"), { opacity: [1, 0], duration: 300 }, T[5]);
  loop("inst1", 0, T[5], 700);
  loop("inst2", 0, T[5] + 100, 800);
  vanPad("inst1", T[5] + 1000); vanPad("inst2", T[5] + 1000); // achter de bus = ingestapt
  tl.add(el("bus"), { x: 920, duration: 2600, ease: "inCubic" }, T[5] + 1300);
  tl.add(el("wiel"), { rotate: 2700, duration: 2600, ease: "inCubic" }, T[5] + 1300);
  tl.add(el("snelheid"), { opacity: 1, duration: 300 }, T[5] + 1900);
  zwaai("bewoner", T[5] + 1300, 3600); zwaai("bewoner2", T[5] + 1500, 3400);
  tl.add(el("warm"), { opacity: 0.14, duration: 1200 }, T[5] + 1600);
  tl.add(el("warm"), { opacity: 0.14, duration: 1 }, EIND - 1);

  return tl;
}
