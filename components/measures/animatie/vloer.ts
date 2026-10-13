import { createTimeline, type Timeline, type TimelineParams } from "animejs";
import { ACCENT, BG, FOLIE_KLEUR, STIJL, T, WIT, ballonMarkup, busMarkup, poppetje, regie, vinkjeMarkup } from "./basis";
import { BALLON, WEG, geslotenAanhanger, huisMarkup, standaardStappen } from "./standaard";

// Gedeelde scène voor de vloer- en bodemisolatie-infographics. Een echte
// kruipruimte onder het huis (48 diep) met de houten vloerbalken in doorsnede
// onder de vloer, en een luik in de vloer bij x 600-616. De balken worden NA
// het isolatiemateriaal getekend, zodat ze er zichtbaar doorheen/overheen
// steken (het materiaal komt dus tussen de balken, niet als een laag eronder).
// - folie (reflecterende folie-isolatie): klimaatfolie gespannen tussen de
//   balken, die daartussen bol doorzakt (geen plaat en geen gipsplaat: dat zit
//   niet in de dienst). De installateur gaat op zijn rug de kruipruimte in en
//   schuift zich met zijn benen voort; zijn armen blijven vrij om de folie
//   vast te zetten.
// - pur (p29/32): PUR-schuim tegen de onderkant van de vloer gespoten, ook
//   liggend op zijn rug; de bewoners gaan in stap 3 de deur uit (verplicht).
// - bodem (p39): werk op de bodem onder hem, dus hij blijft op handen en
//   knieën (alle ledematen bewegen mee) en reikt voorover om het
//   korrelige materiaal te verdelen.

export type VloerSoort = "folie" | "pur" | "bodem";

const DIEP = 48;                                         // diepte van de kruipruimte
const BODEM = 300 + DIEP;
const LUIK = 608;                                        // midden van het luik
const STA_Y = DIEP;                                      // y-verschuiving: staand in het luik (voeten op de bodem)
const KRUIP_Y = 31;                                      // y-verschuiving van het lijf in de kruiphouding
const KRUIP_HOEK = -84;                                  // lijf bijna horizontaal, hoofd naar links
const INST2 = 362;                                       // beginplek van installateur 2
const JOIST_W = 6, JOIST_H = 10;                         // vloerbalken (doorsnede), het luik blijft vrij
const BALKEN = [408, 440, 472, 504, 536, 568, 626];
const ONDER_BALK = 300 + JOIST_H;                         // onderkant van de vloerbalken
const BULGE_VLOER = 9;                                   // hoeveel de folie tussen de balken doorzakt
const ZAK = { x: 94, y: 250 };                           // zak in de aanhanger, 22 x 20
const ZAK_PLEK = 372;                                    // waar de zak naast het huis komt te staan
/** Plek van de installateur (x van zijn heup) direct onder het luik, met het hoofd naar links. */
const KRUIP_VAN = 640;
/** Verste bay, waar hij begint met isoleren (en dan terugwerkt naar het luik). */
const VERSTE_BAY = 420;

/** Bays tussen opeenvolgende balken; de brede opening bij het luik slaat hij over. */
const BAYS = BALKEN.slice(0, -1)
  .map((x, i) => ({ x0: x + JOIST_W, x1: BALKEN[i + 1] }))
  .filter(b => b.x1 - b.x0 < 40);

/** Golvende klimaatfolie tussen de balken: raakt elke balk (onderkant) en zakt daartussen bol door. */
function folieTussenBalken() {
  return BAYS.map(({ x0, x1 }) => {
    const mid = (x0 + x1) / 2;
    return `M${x0},${ONDER_BALK} Q${mid},${ONDER_BALK + BULGE_VLOER} ${x1},${ONDER_BALK}`;
  }).join(" ");
}

/** Hand van de geknielde installateur (heup op x): omhoog tegen de vloer of naar voren op de bodem. */
const handOmhoog = (x: number) => x - 42;
const handOmlaag = (x: number) => x - 34;
/** Slangen; het laatste stuk volgt de hand van de installateur in de kruipruimte. */
const slangPur = (handX: number) => `M150,250 C166,250 160,291 186,291 H594 Q602,291 604,300 V326 Q604,330 596,330 H${handX}`;
const slangBodem = (handX: number) => `M${ZAK_PLEK + 8},284 C392,290 396,320 404,334 Q408,340 416,340 H${handX}`;

/** Bobbelige laag tussen x0 en x1: aan de bovenkant (bodem) of onderkant (schuim tegen de vloer). */
function bobbelLaag(x0: number, x1: number, y: number, dikte: number, bobbels: "boven" | "onder") {
  const r = 4;
  let rand = "";
  for (let x = x1; x > x0; x -= 2 * r) rand += ` q${-r},${bobbels === "onder" ? r * 1.2 : -r * 1.2} ${-2 * r},0`;
  return bobbels === "onder"
    ? `M${x0},${y} H${x1} V${y + dikte}${rand} Z`
    : `M${x0},${y + dikte} H${x1} V${y}${rand} Z`;
}

export function vloerScene(soort: VloerSoort) {
  function sceneMarkup({ busLogo }: { busLogo: string }) {
    const lijn = `fill="none" stroke="${WIT}" stroke-linecap="round"`;
    const spray = `<g class="spray" style="opacity:0" stroke="${WIT}" stroke-width="1.4" stroke-linecap="round"><path d="M4,17 l-3,6 M4,17 l1,7 M4,17 l5,5"/></g>`;
    const lading = soort === "pur"
      ? `${geslotenAanhanger}<g transform="translate(66,220)"><rect width="22" height="26" rx="2" fill="${BG}" stroke="${BG}"/><rect x="3" y="3" width="16" height="6" fill="${WIT}"/><circle cx="7" cy="15" r="2.5" fill="${WIT}"/><circle cx="15" cy="15" r="2.5" fill="${WIT}"/></g>`
      : geslotenAanhanger;
    // De laag wordt zichtbaar met een meegroeiend knipvlak (zo blijven de bobbels in vorm).
    const knip = (x: number, y: number, h: number) =>
      `<defs><clipPath id="wp-vloerlaag"><rect class="laag-knip" x="${x}" y="${y}" width="0" height="${h}"/></clipPath></defs>`;
    const werk = soort === "folie"
      ? `<path class="folie" d="${folieTussenBalken()}" fill="none" stroke="${FOLIE_KLEUR}" stroke-width="2.5" stroke-linecap="round"/>`
      : soort === "pur"
        ? `${knip(404, 300, 30)}
           <path d="${bobbelLaag(404, 596, ONDER_BALK - 10, 17, "onder")}" fill="${WIT}" fill-opacity="0.92" clip-path="url(#wp-vloerlaag)"/>
           <path class="slang" d="${slangPur(596)}" ${lijn} stroke-width="3" stroke-linejoin="round"/>
           <path class="stroom" d="${slangPur(596)}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>`
        : `${knip(404, BODEM - 16, 16)}
           <g clip-path="url(#wp-vloerlaag)"><path d="${bobbelLaag(404, 636, BODEM - 9, 9, "boven")}" fill="${WIT}" fill-opacity="0.85"/>
             ${Array.from({ length: 40 }, (_, k) => `<circle cx="${408 + k * 5.6}" cy="${BODEM - 4 + (k % 3) - 1}" r="0.9" fill="${BG}"/>`).join("")}</g>
           <g transform="translate(${ZAK.x},${ZAK.y})"><g class="wp-as zak" style="opacity:0"><path d="M2,0 Q0,-14 6,-18 L9,-21 L13,-21 L16,-18 Q22,-14 20,0 Z" fill="${WIT}"/><path d="M8,-17 L14,-17" stroke="${BG}" stroke-width="1.2"/></g></g>
           <path class="slang" d="${slangBodem(410)}" ${lijn} stroke-width="3" stroke-linejoin="round"/>
           <path class="stroom" d="${slangBodem(410)}" fill="none" stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="3 7" stroke-linecap="round" style="opacity:0"/>`;
    // De balken komen NA het isolatiemateriaal: ze steken er zichtbaar doorheen/overheen
    // (tussen de balken, niet als een laag eronder).
    const balken = BALKEN.map(x => `<rect x="${x}" y="300" width="${JOIST_W}" height="${JOIST_H}" fill="${WIT}"/>`).join("");
    return `
  ${STIJL}
  ${huisMarkup({ kruipruimte: true, kruipDiepte: DIEP })}
  <path class="luik-gat" d="M601,300 H615" stroke="${BG}" stroke-width="4" style="opacity:0"/>
  <path class="luik" d="M616,300 L622,286" ${lijn} stroke-width="2.5"/>
  ${werk}
  ${balken}
  <line x1="0" y1="300" x2="601" y2="300" stroke="${WIT}" stroke-width="3"/><line x1="615" y1="300" x2="900" y2="300" stroke="${WIT}" stroke-width="3"/>
  <path class="luik-dicht" d="M601,300 H615" stroke="${WIT}" stroke-width="3"/>
  ${poppetje("bewoner", 500)}
  ${poppetje("bewoner2", 522, { haar: true })}
  ${poppetje("inst1", 345, { pet: true })}
  ${poppetje("inst2", INST2, { pet: true, hand: soort === "pur" ? spray : "" })}
  ${busMarkup({ busLogo, lading })}
  ${ballonMarkup(BALLON.x, BALLON.y)}
  ${vinkjeMarkup(566, 64)}`;
  }

  function bouwTijdlijn(root: Element, params: TimelineParams = {}): Timeline {
    const el = (c: string) => Array.from(root.querySelectorAll<SVGElement>(`.${c}`));
    const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" }, ...params });
    const r = regie(tl, el);
    const { opPad, vanPad, draai, beweeg, loop, draag, werk, flits, teken, gum } = r;
    const standaard = standaardStappen(tl, r, el);
    const vast = (id: string, at: number) => { draai(`${id}-ar`, at, -40, 200); draai(`${id}-al`, at, 40, 200); };
    const los = (id: string, at: number) => { draai(`${id}-ar`, at, 0, 200); draai(`${id}-al`, at, 0, 200); };
    /** Armen of benen om een basishoek laten zwaaien (eindigt weer op de basishoek). Voor het afwisselende
     *  kruipen op handen en knieën (bodem). */
    const rond = (c: string, at: number, duur: number, basis: number, amp: number, stap = 220) => {
      const n = Math.max(2, Math.round(duur / stap));
      const kf = [...Array.from({ length: n }, (_, k) => ({ to: basis + (k % 2 ? -amp : amp), duration: duur / (n + 1) })), { to: basis, duration: duur / (n + 1) }];
      tl.add(el(c), { rotate: kf }, at);
    };
    /** Beide benen SAMEN buigen/strekken (i.p.v. om en om): voor iemand die op zijn rug voortschuift. */
    const scoot = (c: string, at: number, duur: number, stap = 260) => {
      const n = Math.max(2, Math.round(duur / stap));
      const kf = [...Array.from({ length: n }, (_, k) => ({ to: k % 2 ? 70 : 110, duration: duur / (n + 1) })), { to: 90, duration: duur / (n + 1) }];
      tl.add(el(c), { rotate: kf }, at);
    };
    /**
     * folie/pur: op zijn rug, dus alleen de benen bewegen mee (voortschuiven, samen);
     * de armen blijven vrij om te werken. bodem: op handen en knieën (afwisselend),
     * alle ledematen bewegen mee.
     */
    let armenMee = soort === "bodem";
    const ledematen = (at: number, beenHoek: number, armHoek: number, duur = 400) => {
      draai("inst2-bl", at, beenHoek, duur); draai("inst2-br", at, beenHoek, duur);
      draai("inst2-al", at, armHoek, duur); draai("inst2-ar", at, armHoek, duur);
      // Het hoofd blijft rechtop (anders lijkt de nek geknakt), met de klep naar voren (links).
      tl.add(el("inst2-hoofd"), beenHoek ? { rotate: -KRUIP_HOEK, scaleX: -1, duration: duur } : { rotate: 0, scaleX: 1, duration: duur }, at);
    };
    /** Installateur 2 stapt rustig via het luik naar beneden en gaat liggen/zitten (1700 ms). */
    const erin = (at: number) => {
      beweeg("inst2", { x: LUIK - INST2 }, at, 300);
      beweeg("inst2", { y: STA_Y }, at + 300, 800);
      tl.add(el("inst2"), { x: KRUIP_VAN - INST2, y: KRUIP_Y, rotate: KRUIP_HOEK, duration: 600 }, at + 1100);
      ledematen(at + 1100, 90, soort === "bodem" ? 90 : 76, 600);
    };
    /** En andersom: overeind komen onder het luik en omhoog stappen (1500 ms). */
    const eruit = (at: number) => {
      tl.add(el("inst2"), { x: LUIK - INST2, y: STA_Y, rotate: 0, duration: 600 }, at);
      ledematen(at, 0, 0, 600);
      beweeg("inst2", { y: 0 }, at + 700, 800);
    };
    /** Voortbewegen naar x: de benen bewegen altijd mee; de armen alleen als ze niet aan het werk zijn (bodem). */
    const kruip = (naarX: number, at: number, duur: number) => {
      tl.add(el("inst2"), { x: naarX - INST2, duration: duur, ease: "linear" }, at);
      if (soort === "bodem") {
        rond("inst2-bl", at, duur, 90, 16); rond("inst2-br", at, duur, 90, -16);
        if (armenMee) { rond("inst2-al", at, duur, 90, -14); rond("inst2-ar", at, duur, 90, 14); }
      } else {
        scoot("inst2-bl", at, duur); scoot("inst2-br", at, duur);
      }
    };
    const stroom = (at: number, duur: number) => {
      tl.add(el("stroom"), { opacity: 1, duration: 150 }, at);
      tl.add(el("stroom"), { strokeDashoffset: [0, -(duur / 12)], duration: duur, ease: "linear" }, at);
      tl.add(el("stroom"), { opacity: 0, duration: 150 }, at + duur);
    };

    standaard.stap1();
    if (soort === "bodem") opPad("zak", 3000);
    standaard.stap2(soort !== "pur");

    // Stap 3: luik open, de kruipruimte nakijken (pur: de bewoners gaan de deur uit).
    if (soort === "pur") {
      loop("bewoner", WEG, T[2], 2200);
      loop("bewoner2", WEG, T[2] + 150, 2200);
    }
    loop("inst1", LUIK - 18 - 345, T[2], 1000);
    werk("inst1-ar", T[2] + 1000, 600, -20, 10, 150);
    tl.add(el("luik-dicht"), { opacity: 0, duration: 1 }, T[2] + 1300);
    opPad("luik-gat", T[2] + 1300);
    teken("luik", T[2] + 1300, 300);
    loop("inst2", LUIK + 12 - INST2, T[2] + 200, 1300);
    erin(T[2] + 1500);
    kruip(soort === "bodem" ? 452 : 500, T[2] + 3200, 1500); // de kruipruimte nakijken
    if (soort !== "bodem") kruip(KRUIP_VAN, T[2] + 4700, 1200); // terug onder het luik, klaar voor stap 4

    // Installateur 1 haalt alvast het materiaal (folie: de folie zit al gespannen,
    // niets om te halen; hij blijft bij het luik).
    if (soort === "pur") {
      loop("inst1", 160 - 345, T[2] + 2000, 1900);       // naar de machine in de aanhanger
    } else if (soort === "bodem") {
      loop("inst1", 104 - 345, T[2] + 1800, 1700);
      vast("inst1", T[2] + 3500);
      draag("zak", T[2] + 3500, 200, { y: 36 });
      loop("inst1", ZAK_PLEK - 14 - 345, T[2] + 3700, 1300);
      draag("zak", T[2] + 3700, 1300, { x: ZAK_PLEK - ZAK.x });
      draag("zak", T[2] + 5000, 300, { y: 50 });         // neerzetten naast het huis
      los("inst1", T[2] + 5200);
    }

    // Stap 4: het isolatiemateriaal aanbrengen in de kruipruimte.
    if (soort === "folie") {
      // Naar de verste bay kruipen, en dan de folie bay voor bay vastzetten op de terugweg.
      kruip(VERSTE_BAY, T[3] + 300, 1500);
      teken("folie", T[3] + 2000, 3600);
      kruip(KRUIP_VAN, T[3] + 2000, 3600);
      werk("inst2-ar", T[3] + 2000, 3600, 70, 100, 260);  // zet de folie telkens vast tegen een balk
    } else {
      const slang = soort === "pur" ? slangPur : slangBodem;
      const hand = soort === "bodem" ? handOmlaag : handOmhoog;
      const van = soort === "bodem" ? 452 : KRUIP_VAN - 2;
      const naar = soort === "bodem" ? 640 : 446;
      // pur: rechterarm omhoog naar de vloer (spuiten); bodem: naar voren over de bodem,
      // en niet meer op handen en knieën (hij reikt alleen nog met de arm).
      if (soort === "bodem") armenMee = false;
      draai("inst2-ar", T[3] + 300, soort === "pur" ? -90 : 60);
      kruip(naar, T[3] + 1000, 4200);
      // De laag groeit mee met de hand van de installateur.
      const knip = el("laag-knip");
      if (soort === "pur") tl.add(knip, { x: [596, 404], width: [0, 192], duration: 4200, ease: "linear" }, T[3] + 1000);
      else tl.add(knip, { width: [0, 232], duration: 4200, ease: "linear" }, T[3] + 1000);
      if (soort === "bodem") tl.add(el("zak"), { scaleY: 0, duration: 4200, ease: "linear" }, T[3] + 1000); // de zak raakt leeg
      tl.add(el("slang"), { d: slang(hand(van)), duration: 1 }, T[3]);
      tl.add(el("stroom"), { d: slang(hand(van)), duration: 1 }, T[3]);
      teken("slang", T[3] + 50, 900);
      tl.add(el("slang"), { d: slang(hand(naar)), duration: 4200, ease: "linear" }, T[3] + 1000);
      tl.add(el("stroom"), { d: slang(hand(naar)), duration: 4200, ease: "linear" }, T[3] + 1000);
      stroom(T[3] + 1000, 4200);
      werk("inst1-ar", T[3] + 1000, 4300, -70, -40, 300);
      if (soort === "pur") flits("spray", T[3] + 1000, 34, 120);
      if (soort === "bodem") armenMee = true;
      draai("inst2-ar", T[4], 90);                       // arm weer in de kruiphouding
    }

    // Stap 5: terugkruipen naar het luik, eruit, luik dicht, oplevering.
    if (soort !== "folie") gum("slang", T[4], 900);
    // folie: hij is al bij het luik (de terugweg zat al in stap 4 verwerkt).
    const terug = soort === "folie" ? 1 : soort === "bodem" ? 300 : 1100;
    kruip(KRUIP_VAN, T[4] + 100, terug);
    eruit(T[4] + 200 + terug);
    gum("luik", T[4] + 1900 + terug, 300);
    tl.add(el("luik-dicht"), { opacity: 1, duration: 1 }, T[4] + 2200 + terug);
    vanPad("luik-gat", T[4] + 2200 + terug);
    standaard.stap5(1800 + terug);
    standaard.stap6();
    return tl;
  }

  return { sceneMarkup, bouwTijdlijn };
}
