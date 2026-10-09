import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import { ACCENT, BG, STIJL, T, WIT, ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup } from "./basis";
import { BALLON, geslotenAanhanger, huisMarkup, standaardStappen } from "./standaard";

// Gedeelde scène voor de dakisolatie-infographics (zolder met trap, dubbel dak).
// - platen (p17/20): stap 3 isolatieplaten van de aanhanger naar de zolder en
//   tegen het dak; stap 4 naden afdichten en klimaatfolie aanbrengen.
// - inblazen (p23/26): stap 3 folie aanbrengen en via een slang vanaf de
//   aanhanger isolatie in het dak blazen; stap 4 boorgaten afdichten en controleren.

export type DakSoort = "platen" | "inblazen";

const ZOLDER = -128;                                     // y-verschuiving van de begane grond naar de zolder
const PLATEN = { x: 92, y: 250 };                        // stapel platen, 24 x 10, staat in de aanhanger
/** Slang van de aanhanger, boven de grond, langs de trap omhoog naar de zolder. */
const SLANG = "M150,250 C166,250 160,291 186,291 H552 Q556,291 556,283 V182 Q556,170 568,150";
const binnenDak = (x: number) => (x <= 520 ? 163 - (x - 407) * 0.743 : 79 + (x - 520) * 0.743);

export function dakScene(soort: DakSoort) {
  function sceneMarkup({ busLogo }: { busLogo: string }) {
    const sporten = Array.from({ length: 10 }, (_, i) => `M560,${288 - i * 12} H576`).join(" ");
    const lijn = `fill="none" stroke="${WIT}" stroke-linecap="round"`;
    const extra = soort === "platen"
      ? `<path class="plaat-l" d="M411,167 L520,86" ${lijn} stroke-width="6" stroke-linecap="butt"/>
         <path class="plaat-r" d="M629,167 L520,86" ${lijn} stroke-width="6" stroke-linecap="butt"/>
         <path class="folie-l" d="M414,171 L520,93" ${lijn} stroke-width="1.5"/>
         <path class="folie-r" d="M626,171 L520,93" ${lijn} stroke-width="1.5"/>
         <g transform="translate(${PLATEN.x},${PLATEN.y})"><g class="wp-as platen" style="opacity:0">
           <rect x="0" y="-10" width="24" height="10" fill="${WIT}"/><path d="M0,-6.5 H24 M0,-3.2 H24" stroke="${BG}" stroke-width="1"/>
         </g></g>`
      : `<path class="vul-l" d="M403.5,161.5 L520,74.5" ${lijn} stroke-width="5"/>
         <path class="vul-r" d="M636.5,161.5 L520,74.5" ${lijn} stroke-width="5"/>
         <path class="folie-l" d="M411,167 L520,86" ${lijn} stroke-width="1.5"/>
         <path class="folie-r" d="M629,167 L520,86" ${lijn} stroke-width="1.5"/>
         <circle class="gat" cx="450" cy="${binnenDak(450)}" r="2.2" fill="${WIT}" style="opacity:0"/>
         <circle class="gat" cx="590" cy="${binnenDak(590)}" r="2.2" fill="${WIT}" style="opacity:0"/>
         <path class="slang" d="${SLANG}" ${lijn} stroke-width="3"/>
         <path class="stroom" d="${SLANG}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>`;
    return `
  ${STIJL}
  ${huisMarkup({ dubbel: true, zolder: true })}
  <path class="trap" d="M560,300 V172 M576,300 V172 ${sporten}" ${lijn} stroke-width="2"/>
  ${extra}
  <line x1="0" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", 362, { pet: true })}
  ${busMarkup({ busLogo, lading: geslotenAanhanger })}
  ${ballonMarkup(BALLON.x, BALLON.y)}
  ${vinkjeMarkup(566, 64)}`;
  }

  function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
    const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
    const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
    const r = regie(tl, el);
    const { opPad, draai, loop, klim, draag, werk, teken, gum } = r;
    const standaard = standaardStappen(tl, r, el);
    const vast = (id: string, at: number) => { draai(`${id}-ar`, at, -40, 200); draai(`${id}-al`, at, 40, 200); };
    const los = (id: string, at: number) => { draai(`${id}-ar`, at, 0, 200); draai(`${id}-al`, at, 0, 200); };

    standaard.stap1();
    if (soort === "platen") opPad("platen", 3000);      // staat achter de wand van de aanhanger
    standaard.stap2();

    // Stap 3: de trap op naar de zolder (installateur 1), en het materiaal erheen (installateur 2).
    teken("trap", T[2] + 200, 700);
    loop("inst1", 223, T[2], 700);
    klim("inst1", ZOLDER, T[2] + 900, 1200);
    loop("inst1", 135, T[2] + 2100, 500);
    loop("inst2", -258, T[2], 1500);                     // naar de aanhanger
    if (soort === "platen") {
      vast("inst2", T[2] + 1400);
      draag("platen", T[2] + 1500, 200, { y: 38 });
      loop("inst2", 206, T[2] + 1700, 1700);             // naar de trap
      draag("platen", T[2] + 1700, 1700, { x: 568 - 12 - PLATEN.x });
      klim("inst2", ZOLDER, T[2] + 3400, 1000);
      draag("platen", T[2] + 3400, 1000, { y: 38 + ZOLDER });
      loop("inst2", 198, T[2] + 4400, 200);
      draag("platen", T[2] + 4600, 300, { x: 548 - PLATEN.x, y: 172 - PLATEN.y }); // op de zoldervloer
      los("inst2", T[2] + 4700);
      tl.add(el("platen"), { scaleY: 0, duration: 2800, ease: "linear" }, T[2] + 4700); // raakt op
      teken("plaat-l", T[2] + 4300, 1600);
      werk("inst1-ar", T[2] + 4300, 1600, -150, -110, 260);
      teken("plaat-r", T[3], 1500);
      werk("inst2-ar", T[3], 1500, -150, -110, 260);

      // Stap 4: naden afdichten en klimaatfolie aanbrengen.
      teken("folie-l", T[3] + 1600, 2000);
      loop("inst1", 155, T[3] + 1600, 2000);
      werk("inst1-ar", T[3] + 1600, 2000, -140, -110, 220);
      teken("folie-r", T[3] + 2400, 2000);
      werk("inst2-ar", T[3] + 2400, 2000, -140, -110, 220);
      werk("inst1-al", T[3] + 4600, 1200, 150, 120, 220);
    } else {
      teken("folie-l", T[2] + 2500, 1300);
      werk("inst1-ar", T[2] + 2500, 2400, -150, -110, 220);
      teken("folie-r", T[2] + 3600, 1300);
      teken("slang", T[2] + 1500, 2900);                 // de slang loopt mee naar de trap en omhoog
      vast("inst2", T[2] + 1400);
      loop("inst2", 206, T[2] + 1600, 1800);
      klim("inst2", ZOLDER, T[2] + 3400, 1000);
      loop("inst2", 198, T[2] + 4400, 200);
      draai("inst2-ar", T[2] + 4600, -60); draai("inst2-al", T[2] + 4600, 0);
      opPad("gat", T[2] + 4700);
      teken("vul-l", T[2] + 4800, 1600);
      teken("vul-r", T[3] + 200, 1600);
      tl.add(el("stroom"), { opacity: 1, duration: 150 }, T[2] + 4700);
      tl.add(el("stroom"), { strokeDashoffset: [0, -260], duration: 3200, ease: "linear" }, T[2] + 4700);
      tl.add(el("stroom"), { opacity: 0, duration: 150 }, T[3] + 1850);

      // Stap 4: slang terug, boorgaten afdichten, controleren of alles goed gevuld is.
      draai("inst2-ar", T[3] + 1900, 0);
      gum("slang", T[3] + 2000, 1200);
      werk("inst1-ar", T[3] + 2000, 1400, -150, -120, 220);
      tl.add(el("gat"), { opacity: 0, duration: 600 }, T[3] + 2600);
      loop("inst1", 165, T[3] + 3600, 700);
      werk("inst1-ar", T[3] + 4300, 1500, -160, -140, 300); // kijkt en voelt langs het dak
      werk("inst2-al", T[3] + 3600, 2200, 160, 140, 300);
    }

    // Stap 5: de trap af en oplevering.
    draai("inst1-ar", T[4], 0); draai("inst2-ar", T[4], 0);
    loop("inst1", 223, T[4], 500);
    klim("inst1", 0, T[4] + 500, 1000);
    loop("inst2", 206, T[4] + 1500, 200);
    klim("inst2", 0, T[4] + 1700, 1000);
    standaard.stap5(2700);
    standaard.stap6();
    return tl;
  }

  return { sceneMarkup, bouwTijdlijn };
}
