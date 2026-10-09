import { createTimeline, stagger, type Timeline, type TimelineParams } from "animejs";
import {
  ACCENT, BG, EIND, STIJL, T, WIT,
  ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup,
} from "../animatie/basis";

// Scène + tijdlijn voor "Thuisbatterij plaatsen in één dag" (Gijs-infographic,
// 6 stappen). Zelfde stijl en regie-afspraken als de andere animaties (zie
// ../animatie/basis.ts).
// 1. Bus komt aan, bewoners zwaaien.
// 2. Voorbereiden: meterkast bekijken, beschermmat van de aanhanger uitrollen. Bewoners gaan weg.
// 3. Onderdelen: samen de sokkel van de aanhanger naar binnen dragen, beugel monteren.
// 4. Batterij: de modules van de aanhanger op de sokkel; kabel van de batterij de meterkast in.
// 5. Binnenwerk: alles aansluiten en inregelen; bewoners terug voor de uitleg.
// 6. Bus rijdt weg, bewoners zwaaien.

export { T, EIND };
export const VIEWBOX = "0 30 900 285";

const SOKKEL = { x: 588, y: 292 };                       // 30 x 8, onderkant op de vloer
const MODULE = (i: number) => ({ x: 590, y: 280 - 12 * i }); // 26 x 12, gestapeld op de sokkel
const MAT = { x: 576, y: 297 };                          // 46 x 3 beschermmat
const ROL = { x: 576, y: 293 };                          // middelpunt van de opgerolde mat

const batterijModule = (ledKlasse: string) => `
  <rect x="0" y="0" width="26" height="12" rx="1.5" fill="${BG}" stroke="${WIT}" stroke-width="2"/>
  <rect class="${ledKlasse}" x="19" y="4.5" width="4" height="3" rx="1" fill="${ACCENT}" style="opacity:0.3"/>`;
const sokkel = `<rect x="0" y="0" width="30" height="5" rx="1" fill="${WIT}"/><path d="M3,5 V8 M27,5 V8" stroke="${WIT}" stroke-width="2"/>`;
const rol = `<circle r="5" fill="${BG}" stroke="${WIT}" stroke-width="2"/>`;

export function sceneMarkup({ busLogo }: { busLogo: string }) {
  const lijn = `fill="none" stroke="${WIT}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"`;
  return `
  ${STIJL}
  <polygon class="warm" points="400,300 400,160 520,70 640,160 640,300" fill="${ACCENT}" style="opacity:0"/>
  <path d="M400,300 V160 L520,70 L640,160 V300" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linejoin="round"/>
  <rect class="meterkast" x="406" y="228" width="22" height="48" rx="1.5" ${lijn}/>
  <path class="meterkast" d="M410,234 H424 V244 H410 Z M410,250 H424 V258 H410 Z M411,266 H423 M411,270 H423" ${lijn} stroke-width="1.6"/>
  <path class="beugel" d="M594,292 V250 M612,292 V250 M592,252 H614" ${lijn} stroke-width="2"/>
  <path class="kabel-mk" d="M603,256 V190 H417 V228" ${lijn}/>
  <g transform="translate(${MAT.x},${MAT.y})"><g class="wp-as mat" style="transform:scaleX(0)"><rect x="0" y="0" width="46" height="3" fill="${WIT}"/></g></g>
  <g transform="translate(${SOKKEL.x},${SOKKEL.y})"><g class="wp-as sokkel" style="opacity:0">${sokkel}</g></g>
  ${[0, 1, 2].map(i => `<g transform="translate(${MODULE(i).x},${MODULE(i).y})"><g class="wp-as module module-${i}" style="opacity:0">${batterijModule("led")}</g></g>`).join("")}
  <g transform="translate(${ROL.x},${ROL.y})"><g class="wp-as rol" style="opacity:0">${rol}</g></g>
  <line x1="0" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", 362, { pet: true })}
  ${busMarkup({
    busLogo,
    lading: `${[0, 1, 2].map(i => `<g class="module-kopie" transform="translate(60,${250 - 12 * i})">${batterijModule("led-kopie")}</g>`).join("")}
    <g class="sokkel-kopie" transform="translate(96,254)">${sokkel}</g>
    <g class="rol-kopie" transform="translate(140,257)">${rol}</g>`,
  })}
  ${ballonMarkup(461, 238)}
  ${vinkjeMarkup(566, 64)}`;
}

/** Bouwt de tijdlijn op de elementen uit sceneMarkup() binnen `root`. */
export function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
  const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
  const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
  const { zet, opPad, vanPad, draai, loop, draag, werk, teken, praat, zwaai } = regie(tl, el);
  const vasthouden = (id: string, at: number, hoek = 40) => { draai(`${id}-ar`, at, -hoek, 200); draai(`${id}-al`, at, hoek, 200); };
  const loslaten = (id: string, at: number) => { draai(`${id}-ar`, at, 0, 200); draai(`${id}-al`, at, 0, 200); };

  // Beginstand: bewoners thuis; sokkel, modules en mat op de aanhanger (onzichtbare echte exemplaren).
  zet("bewoner", 0, { x: 18 }); zet("bewoner2", 0, { x: 20 });
  opPad("bewoner", 0); opPad("bewoner2", 0);
  zet("sokkel", 0, { x: 96 - SOKKEL.x, y: 254 - SOKKEL.y });
  [0, 1, 2].forEach(i => zet(`module-${i}`, 0, { x: 60 - MODULE(i).x, y: 250 - 12 * i - MODULE(i).y }));
  zet("rol", 0, { x: 140 - ROL.x, y: 257 - ROL.y });
  zet("mat", 0, { scaleX: 0 });

  // Stap 1: de bus komt aan, de installateurs stappen uit, de bewoners zwaaien.
  tl.add(el("bus"), { x: [-760, 0], duration: 3000, ease: "outCubic" }, 0);
  tl.add(el("wiel"), { rotate: [0, 1260], duration: 3000, ease: "outCubic" }, 0);
  opPad("inst1", 3000); opPad("inst2", 3000);           // nog achter de bus
  loop("inst1", 40, 3300, 800);
  loop("inst2", 40, 3600, 800);
  zwaai("bewoner", 3300, 2200); zwaai("bewoner2", 3500, 2000);

  // Stap 2: voorbereiden; meterkast bekijken, beschermmat uitrollen. De bewoners gaan weg.
  loop("bewoner", 430, T[1] + 300, 2000);
  loop("bewoner2", 430, T[1] + 400, 2000);
  loop("inst1", 90, T[1], 800);                          // naar de meterkast
  teken("meterkast", T[1] + 300, 800);
  werk("inst1-al", T[1] + 1000, 4600, 70, 100);
  loop("inst2", -222, T[1], 1100);                       // naar de aanhanger
  vanPad("rol-kopie", T[1] + 1100); opPad("rol", T[1] + 1100);
  draag("rol", T[1] + 1100, 200, { y: 278 - ROL.y });
  loop("inst2", 210, T[1] + 1300, 1700);                 // naar de plek van de batterij
  draag("rol", T[1] + 1300, 1700, { x: 572 - ROL.x });
  loop("inst2", 190, T[1] + 3000, 300);                  // stapje opzij
  draag("rol", T[1] + 3000, 300, { x: 0, y: 0 });
  draag("rol", T[1] + 3400, 1000, { x: 46 });            // uitrollen
  tl.add(el("mat"), { scaleX: 1, duration: 1000, ease: "linear" }, T[1] + 3400);
  tl.add(el("rol"), { scale: 0, duration: 200 }, T[1] + 4400);
  werk("inst2-ar", T[1] + 3400, 1000, 30, 10);

  // Stap 3: samen de sokkel naar binnen dragen en de beugel monteren.
  loop("inst1", -256, T[2], 1700);                       // naar de aanhanger
  loop("inst2", -229, T[2], 1700);
  vanPad("sokkel-kopie", T[2] + 1700); opPad("sokkel", T[2] + 1700);
  vasthouden("inst1", T[2] + 1600); vasthouden("inst2", T[2] + 1600);
  draag("sokkel", T[2] + 1700, 200, { y: 272 - SOKKEL.y });
  loop("inst1", 236, T[2] + 1900, 1800);                 // samen naar binnen
  loop("inst2", 263, T[2] + 1900, 1800);
  draag("sokkel", T[2] + 1900, 1800, { x: 0 });
  draag("sokkel", T[2] + 3700, 300, { y: 0 });
  loslaten("inst1", T[2] + 3700); loslaten("inst2", T[2] + 3700);
  teken("beugel", T[2] + 4100, 1200);
  werk("inst1-ar", T[2] + 4000, 1800, -60, -100);
  werk("inst2-al", T[2] + 4000, 1800, 60, 100);

  // Stap 4: de modules op de sokkel; de batterij aansluiten in de meterkast.
  loop("inst1", 90, T[3], 1000);                         // naar de meterkast
  werk("inst1-al", T[3] + 1100, 4700, 70, 100);
  loop("inst2", -289, T[3], 1700);                       // naar de aanhanger
  vanPad("module-kopie", T[3] + 1700); opPad("module", T[3] + 1700);
  vasthouden("inst2", T[3] + 1600);
  [0, 1, 2].forEach(i => {
    draag(`module-${i}`, T[3] + 1700, 200, { y: -2 });
    draag(`module-${i}`, T[3] + 1900, 1800, { x: 0 });
    draag(`module-${i}`, T[3] + 3700, 300, { y: 0 });
  });
  loop("inst2", 241, T[3] + 1900, 1800);                 // naar de sokkel
  loslaten("inst2", T[3] + 3700);
  loop("inst2", 268, T[3] + 4000, 300);
  werk("inst2-ar", T[3] + 4300, 1200, -60, -100);
  teken("kabel-mk", T[3] + 4200, 1400);
  [1, 0.3, 1].forEach((o, k) => tl.add(el("led"), { opacity: o, duration: 250 }, T[3] + 5400 + k * 200));

  // Stap 5: binnenwerk; aansluiten en inregelen, bewoners terug voor de uitleg.
  werk("inst1-al", T[4], 1700, 70, 100);                 // meterkast afmaken
  werk("inst2-ar", T[4], 1500, -60, -100);               // batterij inregelen
  [0.3, 1, 0.3, 1].forEach((o, k) => tl.add(el("led"), { opacity: o, duration: 200, delay: stagger(120) }, T[4] + 900 + k * 250));
  loop("inst1", 110, T[4] + 1800, 500);
  loop("inst2", 122, T[4] + 1800, 900);
  loop("bewoner", 18, T[4] + 400, 2400);
  loop("bewoner2", 20, T[4] + 500, 2400);
  teken("vinkje", T[4] + 2800, 500);
  praat(T[4] + 3400, 2400);
  werk("inst1-ar", T[4] + 3400, 2300, -70, -40, 300);

  // Stap 6: de installateurs stappen in, de bus rijdt weg, de bewoners zwaaien.
  tl.add(el("vinkje"), { opacity: [1, 0], duration: 300 }, T[5]);
  loop("inst1", 0, T[5], 1300);
  loop("inst2", 0, T[5] + 100, 1300);
  vanPad("inst1", T[5] + 1500); vanPad("inst2", T[5] + 1500); // achter de bus = ingestapt
  tl.add(el("bus"), { x: 920, duration: 2600, ease: "inCubic" }, T[5] + 1800);
  tl.add(el("wiel"), { rotate: 2700, duration: 2600, ease: "inCubic" }, T[5] + 1800);
  tl.add(el("snelheid"), { opacity: 1, duration: 300 }, T[5] + 2400);
  zwaai("bewoner", T[5] + 1500, 3600); zwaai("bewoner2", T[5] + 1700, 3400);
  tl.add(el("warm"), { opacity: 0.14, duration: 1200 }, T[5] + 2000);
  tl.add(el("warm"), { opacity: 0.14, duration: 1 }, EIND - 1);

  return tl;
}
