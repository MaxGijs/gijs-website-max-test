import type { Timeline } from "animejs";
import { ACCENT, EIND, T, WIT, BG, regie } from "./basis";

// Standaardregie voor de isolatie-/kozijnen-infographics, die allemaal
// hetzelfde begin en einde hebben:
// 1. Aankomst; bewoners zijn thuis en zwaaien.
// 2. Uitleg midden in huis met tekstwolkje; daarna gaan de bewoners weg.
// 5. Bewoners komen terug, uitleg met tekstwolkje, vinkje.
// 6. Installateurs stappen in, bus rijdt weg, bewoners zwaaien.
// Stap 3 en 4 regisseert elke scène zelf.

/** Plekken (verschuiving t.o.v. de beginplek) voor de uitleg midden in huis: x 455/484/518/542.
 *  Ruim uit elkaar, zodat je de gebaren van elk poppetje ziet. */
export const UITLEG = { inst1: 110, inst2: 122, bewoner: 18, bewoner2: 20 };
/** Staart van het tekstwolkje, boven de installateur die uitlegt. */
export const BALLON = { x: 461, y: 238 };
/** Bewoners buiten beeld (rechts). */
export const WEG = 430;

/** Huis x 400-640, nok (520,70). */
export function huisMarkup({ dubbel = false, zolder = false, kruipruimte = false, balken = false } = {}) {
  const buiten = `<path d="M400,300 V160 L520,70 L640,160 V300" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linejoin="round"/>`;
  const binnen = dubbel ? `<path d="M407,300 V163 L520,79 L633,163 V300" fill="none" stroke="${ACCENT}" stroke-width="2.5" stroke-linejoin="round"/>` : "";
  const vloer = zolder ? `<line x1="${dubbel ? 407 : 400}" y1="172" x2="${dubbel ? 633 : 640}" y2="172" stroke="${WIT}" stroke-width="3"/>` : "";
  const kruip = kruipruimte ? `<path d="M400,300 V332 H640 V300" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linejoin="round"/>` : "";
  const grond = kruipruimte ? grondStippen() : "";
  const bl = balken ? Array.from({ length: 7 }, (_, i) => `<rect x="${420 + i * 32}" y="300" width="5" height="9" fill="${WIT}"/>`).join("") : "";
  return `<polygon class="warm" points="400,300 400,160 520,70 640,160 640,300" fill="${ACCENT}" style="opacity:0"/>${buiten}${binnen}${vloer}${kruip}${grond}${bl}`;
}

/** Zand-/grondstipjes naast de kruipruimte, zoals op de infographic. */
function grondStippen() {
  const stippen: string[] = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (const [x0, x1] of [[350, 395], [645, 690]]) {
    for (let k = 0; k < 16; k++) stippen.push(`<circle cx="${(x0 + rnd() * (x1 - x0)).toFixed(1)}" cy="${(306 + rnd() * 24).toFixed(1)}" r="${(0.8 + rnd() * 0.9).toFixed(1)}" fill="${WIT}"/>`);
  }
  return stippen.join("");
}

/** Gesloten aanhanger (laadbak). Spullen "in" de aanhanger staan erachter, in de laag achter de bus. */
export const geslotenAanhanger = `<rect x="50" y="208" width="108" height="54" rx="3" fill="${WIT}"/>
  <path d="M58,254 H150 M104,214 V250" stroke="${BG}" stroke-width="1.5" stroke-linecap="round"/>`;

type Regie = ReturnType<typeof regie>;

export function standaardStappen(tl: Timeline, r: Regie, el: (c: string) => SVGElement[]) {
  const { zet, opPad, vanPad, loop, werk, teken, praat, zwaai } = r;
  return {
    stap1() {
      zet("bewoner", 0, { x: UITLEG.bewoner }); zet("bewoner2", 0, { x: UITLEG.bewoner2 });
      opPad("bewoner", 0); opPad("bewoner2", 0);
      tl.add(el("bus"), { x: [-760, 0], duration: 3000, ease: "outCubic" }, 0);
      tl.add(el("wiel"), { rotate: [0, 1260], duration: 3000, ease: "outCubic" }, 0);
      opPad("inst1", 3000); opPad("inst2", 3000);         // nog achter de bus
      loop("inst1", 40, 3300, 800);
      loop("inst2", 40, 3600, 800);
      zwaai("bewoner", 3300, 2200); zwaai("bewoner2", 3500, 2000);
    },
    /** `bewonersWeg`: gaan de bewoners na de uitleg meteen weg (anders regelt de scène dat zelf). */
    stap2(bewonersWeg = true) {
      loop("inst1", UITLEG.inst1, T[1], 1100);
      loop("inst2", UITLEG.inst2, T[1] + 100, 1100);
      praat(T[1] + 1300, 3000);
      werk("inst1-ar", T[1] + 1300, 2900, -70, -40, 300);
      if (!bewonersWeg) return;
      loop("bewoner", WEG, T[1] + 4400, 1900);
      loop("bewoner2", WEG, T[1] + 4500, 1900);
    },
    /** `klaar`: ms na het begin van stap 5 waarop beide installateurs weer op de begane grond staan. */
    stap5(klaar = 0) {
      loop("inst1", UITLEG.inst1, T[4] + klaar, 900);
      loop("inst2", UITLEG.inst2, T[4] + klaar + 100, 1000);
      loop("bewoner", UITLEG.bewoner, T[4] + 300, 2400);
      loop("bewoner2", UITLEG.bewoner2, T[4] + 400, 2400);
      const uitleg = Math.max(2900, klaar + 1300);
      teken("vinkje", T[4] + uitleg - 300, 500);
      praat(T[4] + uitleg, STAP_REST(uitleg));
      werk("inst1-ar", T[4] + uitleg, STAP_REST(uitleg) - 100, -70, -40, 300);
    },
    stap6() {
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
    },
  };
}

const STAP_REST = (vanaf: number) => Math.max(1600, T[5] - T[4] - vanaf - 100);
