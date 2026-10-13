import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import { ACCENT, BG, FOLIE_KLEUR, STIJL, T, WIT, ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup } from "./basis";
import { BALLON, geslotenAanhanger, huisMarkup, standaardStappen } from "./standaard";

// Scène voor dakisolatie (Gijs-infographics p23/26), zoals Gijs het uitvoert:
// het dak heeft gordingen (balken in de lengte van het dak, hier in doorsnede);
// op die gordingen wordt klimaatfolie gespannen en de ruimte tussen folie en dak
// wordt volgeblazen met isolatie. Geen platen of gipsplaten: die afwerking zit
// niet in de dienst.
// Stap 3: de trap op, folie over de gordingen spannen, slang vanaf de aanhanger
// en per kant isolatie inblazen. Stap 4: slang terug, boorgaten in de folie
// afdichten en controleren of alles goed gevuld is.

const ZOLDER = -128;                                     // y-verschuiving van de begane grond naar de zolder

/** Punt op het linker/rechter dakvlak (t = 0 bij de goot, 1 bij de nok), d naar binnen. */
const links = (t: number, d = 0) => ({ x: 400 + 120 * t + 0.6 * d, y: 160 - 90 * t + 0.8 * d });
const rechts = (t: number, d = 0) => ({ x: 640 - 120 * t - 0.6 * d, y: 160 - 90 * t + 0.8 * d });

const GORDING = 10, GORDING_H = 14;                      // gordingen in doorsnede: dichte balkjes, dwars op het dakvlak
const GORDING_T = [0.18, 0.43, 0.68];                    // plek van elke gording op het dakvlak (0 = goot, 1 = nok)
const FOLIE = 17;                                        // folie raakt de gordingen op deze diepte
const BULGE = 8;                                         // extra diepte waarmee de folie tussen de gordingen doorzakt
const ISOLATIE = "#9DB4AB";                              // ingeblazen isolatie: grijsgroen, zodat de witte gordingen zichtbaar blijven
const GAT_L = links(0.665, FOLIE), GAT_R = rechts(0.665, FOLIE);

/**
 * Isolatie als losse stukken TUSSEN de gordingen (niet als één doorlopende baan
 * waar de gordingen toevallig op liggen): bij elke gording een duidelijk gaatje.
 */
function vulTussenGordingen(kant: (t: number, d?: number) => { x: number; y: number }) {
  const marge = 0.014;                                   // ruimte die een gording zelf inneemt
  const ts = [0.03, ...GORDING_T, 0.94];
  let pad = "";
  for (let i = 0; i < ts.length - 1; i++) {
    const a = kant(ts[i] + (i > 0 ? marge : 0), FOLIE / 2);
    const b = kant(ts[i + 1] - (i < ts.length - 2 ? marge : 0), FOLIE / 2);
    pad += `M${a.x.toFixed(1)},${a.y.toFixed(1)} L${b.x.toFixed(1)},${b.y.toFixed(1)} `;
  }
  return pad.trim();
}

/**
 * Golvende klimaatfolie: raakt elke gording (diepte FOLIE) en zakt daartussen
 * door (diepte FOLIE + BULGE), zodat hij bol hangt in plaats van strak als een plaat.
 */
function folieBulge(kant: (t: number, d?: number) => { x: number; y: number }) {
  const ts = [0.04, ...GORDING_T, 0.9];
  const punt = (t: number, d: number) => kant(t, d);
  let pad = `M${punt(ts[0], FOLIE).x.toFixed(1)},${punt(ts[0], FOLIE).y.toFixed(1)}`;
  for (let i = 0; i < ts.length - 1; i++) {
    const cp = punt((ts[i] + ts[i + 1]) / 2, FOLIE + BULGE);
    const eind = punt(ts[i + 1], FOLIE);
    pad += ` Q${cp.x.toFixed(1)},${cp.y.toFixed(1)} ${eind.x.toFixed(1)},${eind.y.toFixed(1)}`;
  }
  return pad;
}
/** Waar installateur 2 staat om bij een gat te kunnen (rechts: arm naar rechtsboven, links: naar linksboven).
 *  Dicht bij de nok, zodat hun hoofd onder de folie blijft. */
const BIJ_GAT_R = 540, BIJ_GAT_L = 500;

/** Slang van de aanhanger, langs de trap omhoog, over de zoldervloer naar een gat in de folie. */
const slang = (gat: { x: number; y: number }) =>
  `M150,250 C166,250 160,291 186,291 H552 Q556,291 556,283 V178 Q556,172 548,172 H${(gat.x + 6).toFixed(1)} Q${gat.x.toFixed(1)},172 ${gat.x.toFixed(1)},${(gat.y + 2).toFixed(1)}`;

export function dakScene() {
  function sceneMarkup({ busLogo }: { busLogo: string }) {
    const lijn = `fill="none" stroke="${WIT}" stroke-linecap="round"`;
    const sporten = Array.from({ length: 10 }, (_, i) => `M560,${288 - i * 12} H576`).join(" ");
    const gording = (p: { x: number; y: number }, hoek: number) =>
      `<rect x="${-GORDING / 2}" y="${-GORDING_H / 2}" width="${GORDING}" height="${GORDING_H}" transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)}) rotate(${hoek})" fill="${WIT}"/>`;
    const midden = FOLIE / 2;
    const gordingen = GORDING_T.map(t => gording(links(t, midden), -36.87) + gording(rechts(t, midden), 36.87)).join("");
    return `
  ${STIJL}
  <path class="vul-l" d="${vulTussenGordingen(links)}" fill="none" stroke="${ISOLATIE}" stroke-width="${FOLIE - 2}" stroke-linecap="butt"/>
  <path class="vul-r" d="${vulTussenGordingen(rechts)}" fill="none" stroke="${ISOLATIE}" stroke-width="${FOLIE - 2}" stroke-linecap="butt"/>
  ${gordingen}
  <rect x="514" y="74" width="12" height="13" fill="${WIT}"/>
  ${huisMarkup({ zolder: true })}
  <path class="folie-l" d="${folieBulge(links)}" fill="none" stroke="${FOLIE_KLEUR}" stroke-width="3" stroke-linecap="round"/>
  <path class="folie-r" d="${folieBulge(rechts)}" fill="none" stroke="${FOLIE_KLEUR}" stroke-width="3" stroke-linecap="round"/>
  <circle class="gat gat-l" cx="${GAT_L.x.toFixed(1)}" cy="${GAT_L.y.toFixed(1)}" r="2.2" fill="${BG}" stroke="${WIT}" stroke-width="1.2" style="opacity:0"/>
  <circle class="gat gat-r" cx="${GAT_R.x.toFixed(1)}" cy="${GAT_R.y.toFixed(1)}" r="2.2" fill="${BG}" stroke="${WIT}" stroke-width="1.2" style="opacity:0"/>
  <path class="trap" d="M560,300 V172 M576,300 V172 ${sporten}" ${lijn} stroke-width="2"/>
  <path class="slang" d="${slang(GAT_R)}" ${lijn} stroke-width="3" stroke-linejoin="round"/>
  <path class="stroom" d="${slang(GAT_R)}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>
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
    const { opPad, draai, loop, klim, werk, teken, gum } = r;
    const standaard = standaardStappen(tl, r, el);
    const stroom = (aan: number, uit: number) => {
      tl.add(el("stroom"), { opacity: 1, duration: 150 }, aan);
      tl.add(el("stroom"), { strokeDashoffset: [0, -(uit - aan) / 12], duration: uit - aan, ease: "linear" }, aan);
      tl.add(el("stroom"), { opacity: 0, duration: 150 }, uit);
    };

    standaard.stap1();
    standaard.stap2();

    // Camera: tijdens stap 3 en 4 inzoomen op het dak, zodat folie, gordingen en
    // inblazen goed te zien zijn; bij stap 5 weer uitzoomen.
    const totaal = root.getAttribute("viewBox") ?? "0 30 900 285";
    const [, , bw, bh] = totaal.split(" ").map(Number);
    const zw = 540, zh = Math.round((zw * bh) / bw);     // niet te ver: het huis mag niet te groot in beeld
    const dak = `${520 - zw / 2} ${190 - zh} ${zw} ${zh}`;
    tl.add(root, { viewBox: [totaal, dak], duration: 1400, ease: "inOutSine" }, T[2] + 1900);
    tl.add(root, { viewBox: totaal, duration: 1400, ease: "inOutSine" }, T[4] + 200);

    // Stap 3: folie over de gordingen spannen, daarna isolatie inblazen.
    teken("trap", T[2] + 200, 700);
    loop("inst1", 223, T[2], 700);                       // naar de zoldertrap
    klim("inst1", ZOLDER, T[2] + 900, 1200);
    loop("inst1", BIJ_GAT_R - 345, T[2] + 2100, 300);
    teken("folie-r", T[2] + 2400, 1000);                 // rechts
    werk("inst1-ar", T[2] + 2400, 1000, -160, -130, 220);
    loop("inst1", BIJ_GAT_L - 345, T[2] + 3400, 500);
    teken("folie-l", T[2] + 3900, 1000);                 // links
    werk("inst1-al", T[2] + 3900, 1000, 160, 130, 220);
    loop("inst1", 520 - 345, T[2] + 5000, 300);           // maakt plaats
    loop("inst2", -258, T[2], 1500);                     // naar de aanhanger, slang pakken
    teken("slang", T[2] + 1500, 2900);                   // loopt mee naar de trap en omhoog
    loop("inst2", 206, T[2] + 1600, 1800);
    klim("inst2", ZOLDER, T[2] + 3400, 1000);
    loop("inst2", BIJ_GAT_R - 362, T[2] + 4400, 200);
    draai("inst2-ar", T[2] + 4600, -150);
    opPad("gat-r", T[2] + 4700);
    teken("vul-r", T[2] + 4900, 1700);                   // rechts inblazen
    stroom(T[2] + 4900, T[3] + 600);

    // Stap 4: de andere kant inblazen, boorgaten afdichten, controleren.
    loop("inst1", 552 - 345, T[3] + 300, 500);            // maakt weer plaats
    draai("inst2-ar", T[3] + 700, 0);
    loop("inst2", BIJ_GAT_L - 362, T[3] + 800, 800);
    tl.add(el("slang"), { d: slang(GAT_L), duration: 800, ease: "linear" }, T[3] + 800);
    tl.add(el("stroom"), { d: slang(GAT_L), duration: 800, ease: "linear" }, T[3] + 800);
    draai("inst2-al", T[3] + 1600, 150);
    opPad("gat-l", T[3] + 1600);
    teken("vul-l", T[3] + 1700, 1600);                   // links inblazen
    stroom(T[3] + 1700, T[3] + 3300);
    draai("inst2-al", T[3] + 3400, 0);
    gum("slang", T[3] + 3500, 900);
    tl.add(el("gat"), { opacity: 0, duration: 500 }, T[3] + 4300); // boorgaten afgedicht
    werk("inst2-al", T[3] + 4300, 800, 160, 130, 200);
    werk("inst1-ar", T[3] + 4500, 1300, -160, -130, 300);  // voelt en kijkt langs het dak

    // Stap 5: de trap af en oplevering.
    draai("inst1-ar", T[4], 0);
    loop("inst1", 223, T[4], 500);
    klim("inst1", 0, T[4] + 500, 1000);
    loop("inst2", 206, T[4] + 1300, 400);
    klim("inst2", 0, T[4] + 1700, 1000);
    standaard.stap5(2700);
    standaard.stap6();
    return tl;
  }

  return { sceneMarkup, bouwTijdlijn };
}
