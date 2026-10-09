import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import {
  ACCENT, BG, EIND, STIJL, T, WIT,
  ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup,
} from "../animatie/basis";

// Scène + tijdlijn voor "Zonnepanelen plaatsen in één dag" (Gijs-infographic,
// 6 stappen). Zelfde stijl en regie-afspraken als de warmtepomp-animatie
// (zie ../animatie/basis.ts):
// 1. Bus komt aan, bewoners zwaaien.
// 2. Valbeveiliging: de steiger wordt laag voor laag opgebouwd. De bewoners gaan weg.
// 3. Constructie: rails op het linker dakvlak; de omvormer gaat van de aanhanger naar binnen.
// 4. Panelen: de stapel gaat van de aanhanger de steiger op en wordt op de rails gelegd.
// 5. Binnenwerk: kabel van de panelen naar de omvormer; bewoners terug voor de uitleg.
// 6. Steiger weg, bus rijdt weg, bewoners zwaaien, de zon schijnt op de panelen.

export { T, EIND };
/** Begint op y = 0: de installateur bij de nok moet er met zijn hoofd in passen. */
export const VIEWBOX = "0 0 900 315";

/** Huis staat rechts van het midden (x 480-720), zodat de steiger ernaast past. */
const dak = (t: number) => ({ x: 480 + 120 * t, y: 160 - 90 * t });
const HOEK = -36.87; // helling van het linker dakvlak
/** Linkeronderhoek van elk paneel (3 boven het dak, langs de helling). */
const PANELEN = [0.22, 0.43, 0.64].map(t => ({ x: dak(t).x - 1.8, y: dak(t).y - 2.4 }));
const STAPEL = [0, 1, 2].map(i => 262 - 5 * i); // onderkant van elk paneel op de aanhanger

const paneel = `<rect x="0" y="-5" width="30" height="5" rx="0.8" fill="${WIT}"/><path d="M10,-5 V0 M20,-5 V0" stroke="${BG}" stroke-width="1"/>`;
const omvormer = (schermKlasse: string) => `
  <rect x="0" y="0" width="18" height="26" rx="2" fill="${BG}" stroke="${WIT}" stroke-width="2.5"/>
  <rect class="${schermKlasse}" x="4" y="5" width="10" height="5" rx="1" fill="${ACCENT}" style="opacity:0.3"/>
  <path d="M5,18 H13 M5,21 H13" stroke="${WIT}" stroke-width="1.5" stroke-linecap="round"/>`;

export function sceneMarkup({ busLogo }: { busLogo: string }) {
  const lijn = `fill="none" stroke="${WIT}" stroke-width="2.5" stroke-linecap="round"`;
  const sporten = (van: number, tot: number) =>
    Array.from({ length: Math.floor((van - tot) / 12) }, (_, i) => `M432,${van - 12 * (i + 1)} H448`).join(" ");
  const railVan = dak(0.86), railTot = dak(0.2);
  const haken = [0.3, 0.5, 0.72].map(t => `M${dak(t).x},${dak(t).y} l-0.9,-1.2`).join(" ");
  const zon = { x: 438, y: 62 };
  const stralen = [0, 1, 2, 3, 4].map(i => {
    const a = (-20 + i * 32) * (Math.PI / 180);
    return `M${(zon.x + Math.cos(a) * 14).toFixed(1)},${(zon.y + Math.sin(a) * 14).toFixed(1)} l${(Math.cos(a) * 10).toFixed(1)},${(Math.sin(a) * 10).toFixed(1)}`;
  }).join(" ");
  return `
  ${STIJL}
  <polygon class="warm" points="480,300 480,160 600,70 720,160 720,300" fill="${ACCENT}" style="opacity:0"/>
  <path d="M480,300 V160 L600,70 L720,160 V300" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linejoin="round"/>
  <path class="zon" d="M${zon.x - 9},${zon.y} a9,9 0 1 0 18,0 a9,9 0 1 0 -18,0 ${stralen}" ${lijn}/>
  <path class="steiger-1" d="M414,300 V240 M466,300 V240 M410,240 H470 M414,300 L466,240" ${lijn}/>
  <path class="ladder-1" d="M432,300 V240 M448,300 V240 ${sporten(300, 240)}" ${lijn} stroke-width="1.8"/>
  <path class="steiger-2" d="M414,240 V168 M466,240 V168 M410,168 H476 M414,240 L466,168" ${lijn}/>
  <path class="ladder-2" d="M432,240 V168 M448,240 V168 ${sporten(240, 168)}" ${lijn} stroke-width="1.8"/>
  <path class="steiger-3" d="M414,168 V148 M466,168 V148 M414,150 H466" ${lijn}/>
  <path class="rail" d="M${railVan.x - 0.9},${railVan.y - 1.2} L${railTot.x - 0.9},${railTot.y - 1.2} ${haken}" ${lijn} stroke-width="2"/>
  <path class="kabel" d="M543,114 V262 H690" fill="none" stroke="${WIT}" stroke-width="2.5" stroke-linejoin="round"/>
  <g transform="translate(690,236)"><g class="wp-as omvormer" style="opacity:0">${omvormer("scherm")}</g></g>
  ${PANELEN.map((p, i) => `<g transform="translate(${p.x},${p.y})"><g class="wp-as paneel paneel-${i}" style="opacity:0">${paneel}</g></g>`).join("")}
  <line x1="0" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", 362, { pet: true })}
  ${busMarkup({
    busLogo,
    lading: `${STAPEL.map(y => `<g class="paneel-kopie" transform="translate(60,${y})">${paneel}</g>`).join("")}
    <g class="omvormer-kopie" transform="translate(122,236)">${omvormer("scherm-kopie")}</g>`,
  })}
  ${ballonMarkup(566, 238)}
  ${vinkjeMarkup(650, 46)}`;
}

/** Bouwt de tijdlijn op de elementen uit sceneMarkup() binnen `root`. */
export function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
  const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
  const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
  const { zet, opPad, vanPad, draai, beweeg, loop, klim, draag, werk, teken, gum, praat, zwaai } = regie(tl, el);
  const handenOmhoog = (id: string, at: number) => { draai(`${id}-ar`, at, -150, 250); draai(`${id}-al`, at, 150, 250); };
  const handenOmlaag = (id: string, at: number) => { draai(`${id}-ar`, at, 0, 250); draai(`${id}-al`, at, 0, 250); };

  // Beginstand: bewoners thuis, panelen en omvormer op de aanhanger (onzichtbare echte exemplaren).
  zet("bewoner", 0, { x: 120 }); zet("bewoner2", 0, { x: 122 });
  opPad("bewoner", 0); opPad("bewoner2", 0);
  PANELEN.forEach((p, i) => zet(`paneel-${i}`, 0, { x: 60 - p.x, y: STAPEL[i] - p.y, rotate: 0 }));
  zet("omvormer", 0, { x: -568, y: 0 });

  // Stap 1: de bus komt aan, de installateurs stappen uit, de bewoners zwaaien.
  tl.add(el("bus"), { x: [-760, 0], duration: 3000, ease: "outCubic" }, 0);
  tl.add(el("wiel"), { rotate: [0, 1260], duration: 3000, ease: "outCubic" }, 0);
  opPad("inst1", 3000); opPad("inst2", 3000);           // nog achter de bus
  loop("inst1", 40, 3300, 800);
  loop("inst2", 40, 3600, 800);
  zwaai("bewoner", 3300, 2200); zwaai("bewoner2", 3500, 2000);

  // Stap 2: valbeveiliging; de steiger wordt laag voor laag opgebouwd.
  loop("bewoner", 430, T[1] + 300, 2000);
  loop("bewoner2", 430, T[1] + 400, 2000);
  loop("inst1", 95, T[1], 700);
  loop("inst2", 33, T[1] + 100, 300);
  teken("steiger-1", T[1] + 800, 900);
  teken("ladder-1", T[1] + 800, 900);
  werk("inst2-ar", T[1] + 800, 3600, -120, -80);
  klim("inst1", -60, T[1] + 1800, 800);
  teken("steiger-2", T[1] + 2700, 900);
  teken("ladder-2", T[1] + 2700, 900);
  werk("inst1-ar", T[1] + 2700, 900, -60, -100);
  klim("inst1", -132, T[1] + 3700, 800);
  teken("steiger-3", T[1] + 4600, 500);
  werk("inst1-ar", T[1] + 4600, 1200, -60, -100);

  // Stap 3: constructie op het dak; de omvormer gaat alvast naar binnen.
  beweeg("inst1", { x: 135, y: -140 }, T[2], 500);       // van de steiger op de dakrand
  beweeg("inst1", { x: 243, y: -221 }, T[2] + 500, 1200); // omhoog naar de nok
  teken("rail", T[2] + 2000, 2600);
  beweeg("inst1", { x: 171, y: -167 }, T[2] + 2000, 2600); // langs de rail naar beneden
  werk("inst1-ar", T[2] + 2000, 2600, -20, -60);
  beweeg("inst1", { x: 243, y: -221 }, T[2] + 4800, 900);
  loop("inst2", -231, T[2], 1300);                       // naar de aanhanger
  vanPad("omvormer-kopie", T[2] + 1300); opPad("omvormer", T[2] + 1300);
  draag("omvormer", T[2] + 1300, 200, { y: 28 });
  loop("inst2", 337, T[2] + 1500, 2000);                 // naar de muur binnen
  draag("omvormer", T[2] + 1500, 2000, { x: 0 });
  handenOmhoog("inst2", T[2] + 3500);
  draag("omvormer", T[2] + 3500, 300, { y: 0 });
  handenOmlaag("inst2", T[2] + 4000);
  loop("inst2", 33, T[2] + 4400, 1500);                  // terug naar de steiger

  // Stap 4: de panelen van de aanhanger de steiger op en op de rails.
  loop("inst2", -287, T[3], 1000);                       // naar de stapel panelen
  vanPad("paneel-kopie", T[3] + 1000); opPad("paneel", T[3] + 1000);
  handenOmhoog("inst2", T[3] + 900);
  PANELEN.forEach((p, i) => {
    draag(`paneel-${i}`, T[3] + 1000, 200, { y: 240 - 5 * i - p.y });
    draag(`paneel-${i}`, T[3] + 1200, 1200, { x: 425 - p.x });
    draag(`paneel-${i}`, T[3] + 2400, 1000, { y: 108 - 5 * i - p.y });
  });
  loop("inst2", 78, T[3] + 1200, 1200);                  // naar de steigerladder
  klim("inst2", -132, T[3] + 2400, 1000);
  [2, 1, 0].forEach((i, k) =>
    tl.add(el(`paneel-${i}`), { x: 0, y: 0, rotate: HOEK, duration: 600, ease: "inOutSine" }, T[3] + 3500 + k * 700));
  werk("inst1-ar", T[3] + 3500, 2100, -40, -90);
  handenOmlaag("inst2", T[3] + 5600);

  // Stap 5: binnenwerk; kabel naar de omvormer, bewoners terug voor de uitleg.
  beweeg("inst1", { x: 135, y: -140 }, T[4], 900);
  beweeg("inst1", { x: 95, y: -132 }, T[4] + 900, 300);
  klim("inst1", 0, T[4] + 1200, 900);
  loop("inst1", 215, T[4] + 2100, 700);
  klim("inst2", 0, T[4], 900);
  loop("inst2", 337, T[4] + 900, 1400);                  // naar de omvormer
  teken("kabel", T[4] + 1000, 1600);
  werk("inst2-ar", T[4] + 2300, 800, -60, -100);
  [1, 0.3, 1].forEach((o, k) => tl.add(el("scherm"), { opacity: o, duration: 250 }, T[4] + 2600 + k * 250));
  loop("inst2", 226, T[4] + 3100, 600);
  loop("bewoner", 120, T[4] + 500, 2400);
  loop("bewoner2", 122, T[4] + 600, 2400);
  teken("vinkje", T[4] + 3000, 500);
  praat(T[4] + 3700, 2200);
  werk("inst1-ar", T[4] + 3700, 2100, -70, -40, 300);

  // Stap 6: steiger weg, bus rijdt weg, bewoners zwaaien, de zon schijnt.
  tl.add(el("vinkje"), { opacity: [1, 0], duration: 300 }, T[5]);
  loop("inst1", 0, T[5], 1300);
  loop("inst2", 0, T[5] + 100, 1300);
  vanPad("inst1", T[5] + 1500); vanPad("inst2", T[5] + 1500); // achter de bus = ingestapt
  gum("steiger-3", T[5] + 200, 300);
  gum("steiger-2", T[5] + 450, 400); gum("ladder-2", T[5] + 450, 400);
  gum("steiger-1", T[5] + 850, 400); gum("ladder-1", T[5] + 850, 400);
  tl.add(el("bus"), { x: 920, duration: 2600, ease: "inCubic" }, T[5] + 1800);
  tl.add(el("wiel"), { rotate: 2700, duration: 2600, ease: "inCubic" }, T[5] + 1800);
  tl.add(el("snelheid"), { opacity: 1, duration: 300 }, T[5] + 2400);
  zwaai("bewoner", T[5] + 1500, 3600); zwaai("bewoner2", T[5] + 1700, 3400);
  tl.add(el("warm"), { opacity: 0.14, duration: 1200 }, T[5] + 2000);
  teken("zon", T[5] + 2200, 900);
  tl.add(el("warm"), { opacity: 0.14, duration: 1 }, EIND - 1);

  return tl;
}
