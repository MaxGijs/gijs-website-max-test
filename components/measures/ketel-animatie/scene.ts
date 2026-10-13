import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import { ACCENT, BG, EIND, STIJL, T, WIT, ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup } from "../animatie/basis";
import { BALLON, huisMarkup, standaardStappen } from "../animatie/standaard";

// Scène + tijdlijn voor het vervangen van een cv-ketel. Er is geen
// infographic; de 6 stappen volgen de aangeleverde procesvisuals
// (public/images/maatregelen/ketel/proces): aankomst, uitleg, oude ketel
// verwijderen, nieuwe ketel plaatsen, controle, opleveren.
// De ketel hangt beneden aan de rechtermuur, rechts van de plek van de uitleg.

export { T, EIND };
export const VIEWBOX = "0 30 900 285";

const KETEL = { x: 596, y: 226 };                       // 26 x 38
const MIDDEN = KETEL.x + 13;
const KOPIE = { x: 70, y: 224 };                        // nieuwe ketel op de aanhanger
const OP_AANHANGER = { x: 122, y: 224 };                // waar de oude ketel komt te staan

const ketel = (kleur: string, schermKlasse: string) => `
  <rect x="0" y="0" width="26" height="38" rx="2.5" fill="${BG}" stroke="${kleur}" stroke-width="2.5"/>
  <rect class="${schermKlasse}" x="6" y="7" width="14" height="6" rx="1" fill="${kleur === WIT ? ACCENT : kleur}" style="opacity:${kleur === WIT ? 0.3 : 0.6}"/>
  <path d="M7,30 H19" stroke="${kleur}" stroke-width="1.5" stroke-linecap="round"/>`;

export function sceneMarkup({ busLogo }: { busLogo: string }) {
  return `
  ${STIJL}
  ${huisMarkup()}
  <path d="M${KETEL.x + 7},264 V300 M${KETEL.x + 19},264 V300" stroke="${WIT}" stroke-width="2.5"/>
  <path class="aansluiting" d="M${KETEL.x + 4},268 H${KETEL.x + 10} M${KETEL.x + 16},268 H${KETEL.x + 22}" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round"/>
  <g transform="translate(${KETEL.x},${KETEL.y})"><g class="wp-as oud">${ketel(ACCENT, "scherm-oud")}</g></g>
  <g transform="translate(${KETEL.x},${KETEL.y})"><g class="wp-as nieuw" style="opacity:0">${ketel(WIT, "scherm")}</g></g>
  <line x1="0" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", 362, { pet: true })}
  ${busMarkup({ busLogo, lading: `<g class="nieuw-kopie" transform="translate(${KOPIE.x},${KOPIE.y})">${ketel(WIT, "scherm-kopie")}</g>` })}
  ${ballonMarkup(BALLON.x, BALLON.y)}
  ${vinkjeMarkup(566, 64)}`;
}

export function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
  const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
  const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
  const r = regie(tl, el);
  const { zet, opPad, vanPad, draai, loop, draag, werk, teken, gum } = r;
  const standaard = standaardStappen(tl, r, el);
  const vast = (id: string, at: number) => { draai(`${id}-ar`, at, -40, 250); draai(`${id}-al`, at, 40, 250); };
  const omhoog = (id: string, at: number) => { draai(`${id}-ar`, at, -110, 250); draai(`${id}-al`, at, 110, 250); };
  const los = (id: string, at: number) => { draai(`${id}-ar`, at, 0, 200); draai(`${id}-al`, at, 0, 200); };
  const bij = (x: number) => x - MIDDEN;

  zet("nieuw", 0, { x: KOPIE.x - KETEL.x, y: KOPIE.y - KETEL.y });

  standaard.stap1();
  standaard.stap2();

  // Stap 3: de oude ketel loskoppelen en zelf naar de aanhanger dragen.
  loop("inst1", MIDDEN - 345, T[2], 1000);
  loop("inst2", MIDDEN - 36 - 362, T[2] + 100, 900);
  werk("inst1-ar", T[2] + 1000, 1500, -110, -80, 220);
  werk("inst2-ar", T[2] + 1000, 1500, -70, -40, 220);
  gum("aansluiting", T[2] + 1600, 600);                // leidingen los
  omhoog("inst1", T[2] + 2500);
  draag("oud", T[2] + 2700, 300, { y: 12 });            // van de muur, voor zich
  vast("inst1", T[2] + 2800);
  loop("inst1", OP_AANHANGER.x + 13 - 345, T[2] + 3000, 2300);  // naar de aanhanger
  draag("oud", T[2] + 3000, 2300, { x: bij(OP_AANHANGER.x + 13) });
  draag("oud", T[2] + 5300, 300, { x: OP_AANHANGER.x - KETEL.x, y: OP_AANHANGER.y - KETEL.y }); // op de aanhanger
  los("inst1", T[2] + 5400);

  // Stap 4: de nieuwe ketel van de aanhanger halen, ophangen en aansluiten.
  loop("inst2", KOPIE.x + 13 - 362, T[3], 1700);
  vanPad("nieuw-kopie", T[3] + 1700); opPad("nieuw", T[3] + 1700);
  vast("inst2", T[3] + 1600);
  draag("nieuw", T[3] + 1700, 200, { x: bij(KOPIE.x + 13), y: 12 });
  loop("inst2", MIDDEN - 362, T[3] + 1900, 2100);
  draag("nieuw", T[3] + 1900, 2100, { x: 0 });
  omhoog("inst2", T[3] + 4000);
  draag("nieuw", T[3] + 4100, 300, { y: 0 });           // aan de muur
  los("inst2", T[3] + 4500);
  loop("inst2", MIDDEN - 36 - 362, T[3] + 4500, 500);
  loop("inst1", MIDDEN - 345, T[3] + 1500, 2000);       // terug naar de ketel
  teken("aansluiting", T[3] + 4700, 800);
  werk("inst1-ar", T[3] + 4700, 1100, -100, -70, 200);

  // Stap 5: de nieuwe ketel controleren; de bewoners komen terug.
  werk("inst1-ar", T[4] + 200, 3200, -120, -90, 260);
  [1, 0.3, 1, 0.3, 1].forEach((o, k) => tl.add(el("scherm"), { opacity: o, duration: 250 }, T[4] + 600 + k * 400));
  werk("inst2-ar", T[4] + 400, 2400, -60, -30, 300);
  standaard.bewonersTerug(T[4] + 3000);

  // Stap 6: opleveren: uitleg, vinkje, en weer weg.
  standaard.afronding(T[5], EIND);
  // De oude ketel staat op de aanhanger en rijdt mee weg.
  tl.add(el("oud"), { x: OP_AANHANGER.x - KETEL.x + 920, duration: 1300, ease: "inQuad" }, T[5] + 4700);
  return tl;
}
