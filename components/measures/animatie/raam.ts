import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import { ACCENT, BG, STIJL, T, WIT, ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup } from "./basis";
import { BALLON, huisMarkup, standaardStappen } from "./standaard";

// Gedeelde scène voor "Kozijnen plaatsen binnen enkele dagen" en "Isolatieglas
// plaatsen in één dag" (Gijs-infographics). Eén raam in de gevel op handhoogte,
// rechts van de plek van de uitleg. De installateurs pakken het oude deel zelf
// vast en dragen het weg; het nieuwe dragen ze zelf naar binnen en zetten het erin.
// - kozijn: het oude (groene) kozijn gaat in de afvalcontainer; het nieuwe
//   (witte) kozijn komt van de aanhanger.
// - glas: het kozijn blijft zitten. Eerst gaan de glaslatten eraf, dan de oude
//   ruit eruit (terug op de aanhanger); daarna de nieuwe ruit erin en nieuwe
//   glaslatten erop. De nieuwe glaslatten worden in grondverf geleverd (lichtgrijs).

export type RaamSoort = "kozijn" | "glas";

const RAAM = { x: 572, y: 250 };                        // 48 x 28, onderkant op heuphoogte
const MIDDEN = RAAM.x + 24;                              // daar staat de drager recht voor het raam
const KOPIE = { x: 70, y: 234 };                        // staand op de aanhanger
const CONTAINER_X = 700;                                 // midden van de afvalcontainer
const GRONDVERF = "#D5DCD7";                             // kleur van de nieuwe glaslatten
const OP_AANHANGER_X = 108;                              // waar het oude glas op de aanhanger komt

const kozijn = (kleur: string) => `
  <rect x="0" y="0" width="48" height="28" rx="1" fill="${BG}" stroke="${kleur}" stroke-width="3"/>
  <rect x="4" y="4" width="40" height="20" fill="none" stroke="${kleur}" stroke-width="1.5"/>
  <path d="M24,4 V24" stroke="${kleur}" stroke-width="2"/>`;
const ruit = (kleur: string) => `
  <rect x="5" y="5" width="38" height="18" fill="${kleur}" fill-opacity="0.18" stroke="${kleur}" stroke-width="1.5"/>
  <path d="M10,19 L18,9 M15,20 L22,12" stroke="${kleur}" stroke-width="1.5" stroke-linecap="round"/>`;

/** Glaslatten: vier latjes langs de rand van de ruit (lokaal in het raam, 48 x 28). */
const glaslatten = (kleur: string) => `<g fill="${kleur}">
  <rect x="4" y="4" width="40" height="2.6"/><rect x="4" y="21.4" width="40" height="2.6"/>
  <rect x="4" y="4" width="2.6" height="20"/><rect x="41.4" y="4" width="2.6" height="20"/></g>`;

export function raamScene(soort: RaamSoort) {
  const nieuwTekening = soort === "kozijn" ? kozijn(WIT) : ruit(WIT);
  const oudTekening = soort === "kozijn" ? kozijn(ACCENT) : ruit(ACCENT);

  function sceneMarkup({ busLogo }: { busLogo: string }) {
    const container = soort === "kozijn"
      ? `<path d="M${CONTAINER_X - 36},262 L${CONTAINER_X - 28},300 H${CONTAINER_X + 28} L${CONTAINER_X + 36},262 Z" fill="${ACCENT}" stroke="${WIT}" stroke-width="2" stroke-linejoin="round"/>
         <path d="M${CONTAINER_X - 14},266 V296 M${CONTAINER_X + 14},266 V296" stroke="${WIT}" stroke-width="1.5"/>`
      : "";
    const vasteKozijn = soort === "glas"
      ? `<rect x="${RAAM.x}" y="${RAAM.y}" width="48" height="28" rx="1" fill="none" stroke="${ACCENT}" stroke-width="3"/>`
      : "";
    return `
  ${STIJL}
  ${huisMarkup({ dubbel: true })}
  ${vasteKozijn}
  <g transform="translate(${RAAM.x},${RAAM.y})"><g class="wp-as oud">${oudTekening}</g></g>
  <g transform="translate(${RAAM.x},${RAAM.y})"><g class="wp-as nieuw" style="opacity:0">${nieuwTekening}</g></g>
  ${soort === "glas" ? `<g transform="translate(${RAAM.x},${RAAM.y})"><g class="wp-as latten-oud">${glaslatten(ACCENT)}</g></g>
  <g transform="translate(${RAAM.x},${RAAM.y})"><g class="wp-as latten-nieuw" style="opacity:0">${glaslatten(GRONDVERF)}</g></g>` : ""}
  ${container}
  <line x1="0" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", 362, { pet: true })}
  ${busMarkup({ busLogo, lading: `<g class="nieuw-kopie" transform="translate(${KOPIE.x},${KOPIE.y})">${nieuwTekening}${soort === "glas" ? glaslatten(GRONDVERF) : ""}</g>` })}
  ${ballonMarkup(BALLON.x, BALLON.y)}
  ${vinkjeMarkup(566, 64)}`;
  }

  function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
    const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
    const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
    const r = regie(tl, el);
    const { zet, opPad, vanPad, draai, loop, draag, werk } = r;
    const standaard = standaardStappen(tl, r, el);
    const vast = (id: string, at: number) => { draai(`${id}-ar`, at, -40, 250); draai(`${id}-al`, at, 40, 250); };
    const los = (id: string, at: number) => { draai(`${id}-ar`, at, 0, 200); draai(`${id}-al`, at, 0, 200); };
    /** Raamdeel dat iemand op x voor zich draagt (zelfde hoogte als in de gevel). */
    const bij = (x: number) => x - MIDDEN;

    zet("nieuw", 0, { x: KOPIE.x - RAAM.x, y: KOPIE.y - RAAM.y });
    if (soort === "glas") zet("latten-nieuw", 0, { x: KOPIE.x - RAAM.x, y: KOPIE.y - RAAM.y });

    standaard.stap1();
    standaard.stap2();

    // Stap 3: losmaken en zelf het oude kozijn / de oude ruit eruit dragen.
    loop("inst2", RAAM.x - 10 - 362, T[2], 700);        // links naast het raam
    loop("inst1", MIDDEN - 345, T[2], 1000);              // recht voor het raam
    werk("inst2-ar", T[2] + 800, 1600, -70, -40, 200);   // losmaken
    werk("inst1-ar", T[2] + 1100, 1300, -60, -30, 200);
    if (soort === "glas") {                                // eerst de glaslatten eraf, op de grond ernaast
      vast("inst2", T[2] + 1600);
      draag("latten-oud", T[2] + 1700, 400, { x: bij(RAAM.x - 10), y: 4 });
      draag("latten-oud", T[2] + 2200, 300, { y: 300 - 28 - RAAM.y });
      los("inst2", T[2] + 2400);
    }
    vast("inst1", T[2] + 2500);                           // vastpakken
    if (soort === "kozijn") {
      loop("inst1", CONTAINER_X - 345, T[2] + 2900, 1100); // naar de container
      draag("oud", T[2] + 2900, 1100, { x: bij(CONTAINER_X) });
      draag("oud", T[2] + 4000, 500, { y: 300 - 28 - RAAM.y }); // erin laten zakken
      los("inst1", T[2] + 4300);
      loop("inst1", MIDDEN - 345 - 40, T[2] + 4700, 1100); // terug naar binnen
    } else {
      loop("inst1", 94 - 345, T[2] + 2900, 2300);          // terug naar de aanhanger
      draag("oud", T[2] + 2900, 2300, { x: bij(94) });
      draag("oud", T[2] + 5200, 300, { x: OP_AANHANGER_X - RAAM.x, y: KOPIE.y - RAAM.y }); // op de aanhanger
      los("inst1", T[2] + 5400);
    }

    // Stap 4: de nieuwe zelf van de aanhanger halen en erin zetten.
    if (soort === "kozijn") {
      loop("inst2", 94 - 362, T[3], 1500);                // naar de aanhanger
      vanPad("nieuw-kopie", T[3] + 1500); opPad("nieuw", T[3] + 1500);
      vast("inst2", T[3] + 1400);
      draag("nieuw", T[3] + 1500, 200, { x: bij(94), y: 0 }); // optillen, voor zich
      loop("inst2", MIDDEN - 362, T[3] + 1700, 2100);     // terug naar het raam
      draag("nieuw", T[3] + 1700, 2100, { x: 0 });
      loop("inst1", RAAM.x - 10 - 345, T[3] + 1000, 900);  // helpt links
      werk("inst2-ar", T[3] + 3900, 1300, -50, -25, 200); // vastzetten
      werk("inst1-ar", T[3] + 3900, 1300, -70, -40, 200);
      los("inst2", T[3] + 5200);
    } else {
      // De oude glaslatten gaan mee naar de aanhanger; de nieuwe ruit en latten komen terug.
      vast("inst2", T[3]);
      draag("latten-oud", T[3], 300, { y: 4 });
      loop("inst2", 94 - 362, T[3] + 300, 1500);
      draag("latten-oud", T[3] + 300, 1500, { x: bij(94) });
      draag("latten-oud", T[3] + 1800, 200, { x: OP_AANHANGER_X - RAAM.x, y: KOPIE.y - RAAM.y });
      vanPad("nieuw-kopie", T[3] + 2000); opPad("nieuw", T[3] + 2000); opPad("latten-nieuw", T[3] + 2000);
      draag("nieuw", T[3] + 2000, 200, { x: bij(94), y: 0 });
      draag("latten-nieuw", T[3] + 2000, 200, { x: bij(94), y: 6 });
      loop("inst2", MIDDEN - 362, T[3] + 2200, 1900);     // terug naar het raam
      draag("nieuw", T[3] + 2200, 1900, { x: 0 });
      draag("latten-nieuw", T[3] + 2200, 1900, { x: 0 });
      loop("inst1", RAAM.x - 10 - 345, T[3] + 1000, 2400); // helpt links
      werk("inst1-ar", T[3] + 4100, 1300, -70, -40, 200);
      draag("latten-nieuw", T[3] + 4600, 400, { y: 0 });  // glaslatten erop
      werk("inst2-ar", T[3] + 4600, 800, -50, -25, 200);
      los("inst2", T[3] + 5400);
    }
    loop("inst2", RAAM.x + 58 - 362, T[3] + 5450, 500);    // stap opzij: het nieuwe raam is te zien

    standaard.stap5(0);
    standaard.stap6();
    // De oude ruit en glaslatten staan op de aanhanger en rijden mee weg.
    if (soort === "glas") {
      tl.add(el("oud"), { x: OP_AANHANGER_X - RAAM.x + 920, duration: 2600, ease: "inCubic" }, T[5] + 1800);
      tl.add(el("latten-oud"), { x: OP_AANHANGER_X - RAAM.x + 920, duration: 2600, ease: "inCubic" }, T[5] + 1800);
    }
    return tl;
  }

  return { sceneMarkup, bouwTijdlijn };
}
