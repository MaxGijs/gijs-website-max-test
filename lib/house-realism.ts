import { Box3, CanvasTexture, ClampToEdgeWrapping, Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, Vector3, type Object3D, type Texture } from "three";

// Realistischere materialen voor de homepage-woning (HouseModelPrototype).
// Het GLB-model bestaat uit eenvoudige blokvormen met UV 0..1 per vlak en
// één kleine cartoon-baksteentextuur (128px). Hier worden in de browser
// kleine, deterministische canvas-texturen gemaakt (baksteen met voegen,
// dakpannen, zonnecellen, gras, bestrating, contactschaduw) en worden
// glans/metaal van de materialen natuurlijker gezet. Geen nieuwe assets,
// geen downloads. Alleen voor de homepage: de scan (HouseViewer) gebruikt
// dit bestand niet.

function maakCanvas(breedte: number, hoogte: number) {
  const canvas = document.createElement("canvas");
  canvas.width = breedte;
  canvas.height = hoogte;
  // willReadFrequently: korrel() en de alfa-uitlopen lezen elke pixel terug (getImageData). Met deze
  // hint houdt de browser het canvas in het werkgeheugen, zodat dat geen trage GPU-terugleesactie wordt
  // tijdens het laden. Zelfde tekening, zelfde (vaste) ruis.
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D niet beschikbaar");
  return { canvas, ctx };
}

// Vaste seed: de textuur ziet er bij elk bezoek hetzelfde uit.
function willekeur(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function korrel(ctx: CanvasRenderingContext2D, breedte: number, hoogte: number, sterkte: number, rand: () => number) {
  const beeld = ctx.getImageData(0, 0, breedte, hoogte);
  const d = beeld.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * sterkte;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(beeld, 0, 0);
}

function variant(hex: string, rand: () => number, spreiding: number) {
  const f = 1 + (rand() - 0.5) * spreiding;
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.round((n & 255) * f));
  return `rgb(${r},${g},${b})`;
}

function textuur(canvas: HTMLCanvasElement, kleur = true) {
  const t = new CanvasTexture(canvas);
  if (kleur) t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

// Halfsteensverband: 16 lagen, 8 stenen per laag, dunne lichte voeg en
// per steen een kleine kleurvariatie (rood-bruin, zoals het bestaande model).
const PALET_STANDAARD = ["#8e3f2b", "#98452f", "#a25038", "#874031", "#934d38", "#7f3a2a", "#a55a41", "#8a4733"];
// Roodbruine baksteen zoals bij Nederlandse rijwoningen uit de jaren 60-80 (referentiefoto's): donkerder, rustiger.
const PALET_NL = ["#6c3526", "#763b2a", "#7f4230", "#693427", "#733d2d", "#5e2f23", "#86493a", "#70392a"];
// Zandkleurige, genuanceerde baksteen zoals bij veel vrijstaande woningen uit de jaren 70 (referentiefoto's).
const PALET_VRIJ = ["#a9825a", "#9c7650", "#b38c63", "#94704c", "#a2805b", "#b8956b", "#8e6b48", "#a5845e"];

// Helderder rode baksteen, zoals de tussenwoningen op referentiefoto 4.
const PALET_ROOD = ["#8f3b27", "#9a432d", "#a54b33", "#8a3a28", "#96452f", "#81352a", "#a8533a", "#913f2c"];
// Zalmkleurige, oranjebruine baksteen, zoals de twee-onder-een-kapwoningen op de referentiefoto's (jaren 70).
const PALET_ZALM = ["#b26a4f", "#a8634a", "#bb7357", "#9f5d45", "#ad6a52", "#c27a5d", "#99573f", "#b3705a"];

/**
 * Stijl per woningtype, elk naar de eigen referentiefoto's, zodat de vier
 * woningtypes niet op elkaar lijken.
 */
type Woningstijl = { steen: string[]; voeg: string; pan: string; latei: boolean; voordeur?: string; garagedeur?: string; bekleding?: string; horizontaal?: boolean; witteRanden?: boolean };
const STIJLEN: Record<string, Woningstijl> = {
  hoekwoning: { steen: PALET_NL, voeg: "#8e877c", pan: "#5d544c", latei: false },
  tussenwoning: { steen: PALET_ROOD, voeg: "#9d978c", pan: "#5a3a2f", latei: true, voordeur: "#1f2f4b" },
  vrijstaand: { steen: PALET_VRIJ, voeg: "#a39c90", pan: "#403b37", latei: false, garagedeur: "#2d4038", bekleding: "#3b4348" },
  "twee-onder-een-kap": { steen: PALET_ZALM, voeg: "#a19a8e", pan: "#9a4b2e", latei: false, voordeur: "#23324a", garagedeur: "#23324a", bekleding: "#e6e2d9", horizontaal: true, witteRanden: true },
};

export function baksteenTextuur(palet: string[] = PALET_STANDAARD, voegkleur = "#b7ae9f") {
  const nl = palet !== PALET_STANDAARD;
  const B = 1024, lagen = 16, perLaag = 8;
  const { canvas, ctx } = maakCanvas(B, B);
  const rand = willekeur(7);
  ctx.fillStyle = voegkleur;
  ctx.fillRect(0, 0, B, B);
  korrel(ctx, B, B, 18, rand);
  const lh = B / lagen, sb = B / perLaag, voeg = nl ? 7 : 6;
  for (let r = 0; r < lagen; r++) {
    const verschuiving = r % 2 ? sb / 2 : 0;
    for (let c = -1; c <= perLaag; c++) {
      const x = c * sb + verschuiving;
      ctx.fillStyle = variant(palet[Math.floor(rand() * palet.length)], rand, nl ? 0.1 : 0.14);
      ctx.fillRect(x + voeg / 2, r * lh + voeg / 2, sb - voeg, lh - voeg);
      if (nl) {
        // Verdiepte voeg: smalle schaduw onder en licht boven elke steen.
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(x + voeg / 2, r * lh + lh - voeg / 2 - 3, sb - voeg, 3);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(x + voeg / 2, r * lh + voeg / 2, sb - voeg, 2);
      }
    }
  }
  korrel(ctx, B, B, 22, rand);
  return textuur(canvas);
}

// Antraciet keramische pannen: 16 rijen, 10 pannen per rij, met een
// schaduwrand onder elke rij (overlap) en een subtiele lichtrand erboven.
export function dakpanTextuur() {
  const B = 1024, rijen = 16, perRij = 10;
  const { canvas, ctx } = maakCanvas(B, B);
  const rand = willekeur(11);
  const rh = B / rijen, pb = B / perRij;
  for (let r = 0; r < rijen; r++) {
    const verschuiving = r % 2 ? pb / 2 : 0;
    for (let c = -1; c <= perRij; c++) {
      const x = c * pb + verschuiving;
      const grad = ctx.createLinearGradient(0, r * rh, 0, (r + 1) * rh);
      const basis = variant("#3a3f44", rand, 0.18);
      grad.addColorStop(0, basis);
      grad.addColorStop(0.75, basis);
      grad.addColorStop(1, "#1d2023");
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, r * rh, pb - 2, rh);
    }
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(0, r * rh, B, 3);
  }
  korrel(ctx, B, B, 14, rand);
  return textuur(canvas);
}

// Gesmoorde (grijsbruine) golfpannen: per pan een licht-donker verloop voor de golf,
// schaduw onder elke rij door de overlap. Referentie: jaren 60-80 rijwoningen.
export function golfpanTextuur(basiskleur = "#5d544c") {
  const B = 1024, rijen = 16, perRij = 10;
  const { canvas, ctx } = maakCanvas(B, B);
  const rand = willekeur(13);
  const rh = B / rijen, pb = B / perRij;
  for (let r = 0; r < rijen; r++) {
    const verschuiving = r % 2 ? pb * 0.12 : 0;
    for (let c = -1; c <= perRij; c++) {
      const x = c * pb + verschuiving;
      const basis = variant(basiskleur, rand, 0.16);
      const golf = ctx.createLinearGradient(x, 0, x + pb, 0);
      golf.addColorStop(0, "rgba(255,255,255,0.10)");
      golf.addColorStop(0.3, "rgba(255,255,255,0.02)");
      golf.addColorStop(0.62, "rgba(0,0,0,0.28)");
      golf.addColorStop(1, "rgba(0,0,0,0.04)");
      ctx.fillStyle = basis;
      ctx.fillRect(x, r * rh, pb, rh);
      ctx.fillStyle = golf;
      ctx.fillRect(x, r * rh, pb, rh);
    }
    const overlap = ctx.createLinearGradient(0, (r + 1) * rh - 12, 0, (r + 1) * rh);
    overlap.addColorStop(0, "rgba(0,0,0,0)");
    overlap.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = overlap;
    ctx.fillRect(0, (r + 1) * rh - 12, B, 12);
  }
  korrel(ctx, B, B, 16, rand);
  return textuur(canvas);
}

// Rollaag: een rij stenen op hun kant boven raam of deur.
export function rollaagTextuur(palet: string[] = PALET_NL) {
  const W = 1024, H = 128, stenen = 16;
  const { canvas, ctx } = maakCanvas(W, H);
  const rand = willekeur(17);
  ctx.fillStyle = "#8a8378";
  ctx.fillRect(0, 0, W, H);
  const sb = W / stenen, voeg = 7;
  for (let c = 0; c < stenen; c++) {
    ctx.fillStyle = variant(palet[Math.floor(rand() * palet.length)], rand, 0.12);
    ctx.fillRect(c * sb + voeg / 2, voeg / 2, sb - voeg, H - voeg);
  }
  korrel(ctx, W, H, 18, rand);
  return textuur(canvas);
}

// Verticale houten gevelbekleding in de topgevel, donker blauwgrijs zoals bij
// vrijstaande woningen uit de jaren 70 (referentiefoto's).
export function gevelbekledingTextuur(kleur = "#3b4348", horizontaal = false) {
  const B = 1024, delen = 10;
  const { canvas, ctx } = maakCanvas(B, B);
  const rand = willekeur(61);
  const db = B / delen;
  for (let c = 0; c < delen; c++) {
    ctx.fillStyle = variant(kleur, rand, 0.1);
    ctx.fillRect(c * db, 0, db, B);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.015 + rand() * 0.03})`;
      ctx.fillRect(c * db + rand() * db, 0, 1 + rand() * 2, B);
    }
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(c * db, 0, 4, B);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(c * db + 4, 0, 2, B);
  }
  korrel(ctx, B, B, 10, rand);
  if (!horizontaal) return textuur(canvas);
  // Rabatdelen (liggend): dezelfde planken, een kwartslag gedraaid.
  const { canvas: gedraaid, ctx: g } = maakCanvas(B, B);
  g.translate(B / 2, B / 2);
  g.rotate(Math.PI / 2);
  g.drawImage(canvas, -B / 2, -B / 2);
  return textuur(gedraaid);
}

// Zonnepaneel: 6 x 10 donkerblauwe cellen met lichte tussenruimte en dunne
// zilverachtige busbars.
export function zonnecelTextuur() {
  const W = 384, H = 640, kol = 6, rij = 10;
  const { canvas, ctx } = maakCanvas(W, H);
  const rand = willekeur(23);
  ctx.fillStyle = "#aab2b9";
  ctx.fillRect(0, 0, W, H);
  const cw = W / kol, ch = H / rij, gat = 3;
  for (let r = 0; r < rij; r++) for (let c = 0; c < kol; c++) {
    ctx.fillStyle = variant("#14213a", rand, 0.12);
    ctx.fillRect(c * cw + gat, r * ch + gat, cw - gat * 2, ch - gat * 2);
    ctx.fillStyle = "rgba(190,200,210,0.35)";
    for (let b = 1; b <= 2; b++) ctx.fillRect(c * cw + (cw * b) / 3, r * ch + gat, 1, ch - gat * 2);
  }
  korrel(ctx, W, H, 8, rand);
  return textuur(canvas);
}

// Gazon met zachte radiale uitloop naar transparant, zodat de woning niet
// in een lege ruimte zweeft maar er ook geen harde rand ontstaat.
export function grasTextuur(nl = false) {
  const B = 1024;
  const { canvas, ctx } = maakCanvas(B, B);
  const rand = willekeur(31);
  ctx.fillStyle = nl ? "#6f7f55" : "#7a9158";
  ctx.fillRect(0, 0, B, B);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = variant(rand() > 0.5 ? (nl ? "#66774c" : "#6f8a4d") : (nl ? "#7b8b5f" : "#86a064"), rand, 0.2);
    ctx.fillRect(rand() * B, rand() * B, 2, 3 + rand() * 4);
  }
  korrel(ctx, B, B, 12, rand);
  const beeld = ctx.getImageData(0, 0, B, B);
  const d = beeld.data;
  for (let y = 0; y < B; y++) for (let x = 0; x < B; x++) {
    const dx = x / B - 0.5, dy = y / B - 0.5;
    const afstand = Math.sqrt(dx * dx + dy * dy) * 2;
    const alpha = afstand < 0.55 ? 1 : Math.max(0, 1 - (afstand - 0.55) / 0.45);
    d[(y * B + x) * 4 + 3] = Math.round(alpha * alpha * 255);
  }
  ctx.putImageData(beeld, 0, 0);
  const t = textuur(canvas);
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  return t;
}

// Grijze betontegels 30x30 met voeg; de uiteinden lopen uit naar
// transparant zodat de strook zacht in het gras overgaat.
export function bestratingTextuur() {
  const W = 1024, H = 256, tegels = 32;
  const { canvas, ctx } = maakCanvas(W, H);
  const rand = willekeur(41);
  ctx.fillStyle = "#8f8d86";
  ctx.fillRect(0, 0, W, H);
  const t = W / tegels;
  for (let r = 0; r < H / t; r++) for (let c = 0; c < tegels; c++) {
    ctx.fillStyle = variant("#b3b1aa", rand, 0.08);
    ctx.fillRect(c * t + 1.5, r * t + 1.5, t - 3, t - 3);
  }
  korrel(ctx, W, H, 14, rand);
  const beeld = ctx.getImageData(0, 0, W, H);
  const d = beeld.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const rand01 = Math.min(x, W - x) / (W * 0.16);
    d[(y * W + x) * 4 + 3] = Math.round(Math.min(1, rand01) * 255);
  }
  ctx.putImageData(beeld, 0, 0);
  const tx = textuur(canvas);
  tx.wrapS = tx.wrapT = ClampToEdgeWrapping;
  return tx;
}

// Gebakken klinkers in keperverband (visgraat onder 45°), roodbruin/grijs zoals in
// Nederlandse woonstraten; de uiteinden lopen uit naar transparant.
export function klinkerTextuur() {
  const B = 1024;
  const { canvas, ctx } = maakCanvas(B, B);
  const rand = willekeur(43);
  ctx.fillStyle = "#6e6259";
  ctx.fillRect(0, 0, B, B);
  // Keperverband: motief van één liggende (2k × k) en één staande (k × 2k) steen,
  // herhaald met de vectoren (k, k) en (2k, -2k).
  const k = 32, voeg = 4;
  const palet = ["#8a5a48", "#7d5142", "#94634f", "#6f4a3e", "#85685a", "#7a5e52"];
  const steen = (x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = variant(palet[Math.floor(rand() * palet.length)], rand, 0.12);
    ctx.fillRect(x + voeg / 2, y + voeg / 2, w - voeg, h - voeg);
  };
  for (let i = -40; i < 40; i++) for (let j = -20; j < 20; j++) {
    const ox = (i + 2 * j) * k, oy = (i - 2 * j) * k;
    if (ox < -3 * k || ox > B + k || oy < -3 * k || oy > B + k) continue;
    steen(ox, oy, 2 * k, k);
    steen(ox, oy + k, k, 2 * k);
  }
  korrel(ctx, B, B, 16, rand);
  return textuur(canvas);
}

// Alpha-masker dat aan de linker- en rechterkant zacht uitloopt (voor stroken bestrating).
export function uitloopTextuur() {
  const W = 256, H = 4;
  const { canvas, ctx } = maakCanvas(W, H);
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#000");
  grad.addColorStop(0.16, "#fff");
  grad.addColorStop(0.84, "#fff");
  grad.addColorStop(1, "#000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  const t = new CanvasTexture(canvas);
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  return t;
}

// Zachte donkere vlek onder de woning (contactschaduw / ambient occlusion).
export function contactschaduwTextuur() {
  const B = 256;
  const { canvas, ctx } = maakCanvas(B, B);
  const grad = ctx.createRadialGradient(B / 2, B / 2, B * 0.18, B / 2, B / 2, B * 0.5);
  grad.addColorStop(0, "rgba(20,24,20,0.42)");
  grad.addColorStop(0.6, "rgba(20,24,20,0.18)");
  grad.addColorStop(1, "rgba(20,24,20,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, B, B);
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  return t;
}

const luminantie = (m: MeshStandardMaterial) => 0.2126 * m.color.r + 0.7152 * m.color.g + 0.0722 * m.color.b;

function hoofdnaam(object: Object3D, scene: Object3D) {
  let o: Object3D | null = object;
  while (o && o.parent && o.parent !== scene) o = o.parent;
  return o?.name ?? "";
}

// Binnen een buurwoning-kopie (bv. "buur_Dakpannen" in de tweeling) telt het
// onderdeel als het gewone onderdeel, zodat beide woningen er gelijk uitzien.
function onderdeelNaam(object: Object3D, scene: Object3D) {
  const hoofd = hoofdnaam(object, scene);
  if (!hoofd.startsWith("Buurwoning")) return hoofd;
  let o: Object3D | null = object;
  while (o && o.parent && o.parent.parent && o.parent.parent !== scene) o = o.parent;
  return (o?.name ?? "").replace(/^buur_/, "");
}

// Afmetingen van een blokvormig mesh-vlak (lokaal, incl. objectschaal):
// de twee grootste maten bepalen hoe vaak een textuur herhaalt, zodat
// stenen en pannen op elke gevel even groot zijn.
function vlakMaten(mesh: Mesh) {
  mesh.geometry.computeBoundingBox();
  const maat = (mesh.geometry.boundingBox ?? new Box3()).getSize(new Vector3());
  const schaal = new Vector3();
  mesh.getWorldScale(schaal);
  // Absolute schaal: een gespiegelde buurwoning (schaal -1) krijgt anders verkeerd herhaalde texturen.
  const m = [maat.x * Math.abs(schaal.x), maat.y * Math.abs(schaal.y), maat.z * Math.abs(schaal.z)].sort((a, b) => b - a);
  return { u: m[0], v: m[1] };
}

function herhaal(bron: Texture, u: number, v: number, eigen: Texture[]) {
  const t = bron.clone();
  t.repeat.set(u, v);
  t.needsUpdate = true;
  eigen.push(t);
  return t;
}

export function maakRealistisch(scene: Object3D) {
  const texturen: Texture[] = [];
  const vrij = scene.userData.nlVrij === true;
  const nl = scene.userData.nlRij === true || vrij;
  const stijl = nl ? STIJLEN[scene.userData.stijl as string] ?? STIJLEN.hoekwoning : null;
  const baksteen = stijl ? baksteenTextuur(stijl.steen, stijl.voeg) : baksteenTextuur();
  const pannen = stijl ? golfpanTextuur(stijl.pan) : dakpanTextuur();
  const cellen = zonnecelTextuur();
  const rollaag = rollaagTextuur(stijl?.steen);
  const bekleding = gevelbekledingTextuur(stijl?.bekleding, stijl?.horizontaal);
  texturen.push(baksteen, pannen, cellen, rollaag, bekleding);

  scene.traverse(object => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const naam = hoofdnaam(mesh, scene);
    const deel = onderdeelNaam(mesh, scene);
    const buur = naam.startsWith("Buurwoning");
    const materialen = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const materiaal of materialen) {
      const m = materiaal as MeshStandardMaterial;
      if (!m.isMeshStandardMaterial) continue;
      const installatie = /^(Warmtepomp|Thuisbatterij|Zonnepaneel)/.test(naam);
      // Natuurlijker: geen plastic glans, nauwelijks metaal (behalve installaties).
      if (!installatie) m.metalness = Math.min(m.metalness, 0.04);
      m.roughness = Math.max(m.roughness, 0.55);
      m.envMapIntensity = 0.6;

      if (m.userData.aanbouwPlint && m.map) {
        // Plint van de aanbouw: dezelfde donkere onderste stenen als de woning.
        const { u, v } = vlakMaten(mesh);
        m.map = herhaal(baksteen, u / 1.76, Math.max(v, 0.2) / 0.99, texturen);
        m.color.set("#8a7a70");
        m.roughness = 0.95;
      } else if (m.userData.bekleding) {
        const { u, v } = vlakMaten(mesh);
        m.map = herhaal(bekleding, u / 1.2, v / 1.2, texturen);
        m.color.set("#ffffff");
        m.roughness = 0.85;
      } else if (m.userData.rollaag && stijl?.latei) {
        // Tussenwoning: crèmekleurige betonnen latei boven raam (referentiefoto 4).
        m.color.set("#e3ddd0");
        m.roughness = 0.85;
      } else if (m.userData.rollaag) {
        const { u } = vlakMaten(mesh);
        m.map = herhaal(rollaag, u / 0.88, 1, texturen);
        m.color.set("#c9bbb1");
        m.roughness = 0.92;
      } else if (stijl?.voordeur && deel === "Voordeur" && mesh.name === "deurblad") {
        m.color.set(stijl.voordeur);
        m.roughness = 0.5;
      } else if (mesh.name === "entree_luifel") {
        m.color.set("#e3ddd0");
        m.roughness = 0.85;
      } else if (m.map) {
        // Baksteen: 22 x 6,2 cm per steen incl. voeg → tegel van 1,76 x 1,0 m.
        const { u, v } = vlakMaten(mesh);
        m.map = herhaal(baksteen, u / 1.76, v / 0.99, texturen);
        m.color.set(buur ? (vrij ? "#ece6e0" : nl ? "#cfc6be" : "#b2a79c") : "#ffffff");
        m.roughness = 0.92;
      } else if (nl && deel === "Plinten") {
        // Donkerder onderste stenen (trasraam), zoals bij de referentiewoningen.
        const { u, v } = vlakMaten(mesh);
        m.map = herhaal(baksteen, u / 1.76, Math.max(v, 0.2) / 0.99, texturen);
        m.color.set("#8a7a70");
        m.roughness = 0.95;
      } else if (nl && (mesh.parent?.name === "Windveren" || mesh.name === "dakkapel_dakrand")) {
        // Witte boeiborden bij de twee-onder-een-kap (referentiefoto's), elders donker.
        m.color.set(stijl?.witteRanden ? "#e4e0d8" : "#35342f");
        m.roughness = 0.75;
      } else if (nl && (mesh.name === "Nok" || mesh.name === "buur_nok")) {
        m.color.set("#473f39");
        m.roughness = 0.8;
      } else if (nl && mesh.name.startsWith("buur_dakschild")) {
        const { u, v } = vlakMaten(mesh);
        m.map = herhaal(pannen, u / 3.0, v / 5.3, texturen);
        m.color.set("#d9d3cd");
        m.roughness = 0.75;
      } else if (nl && buur && mesh.parent?.name.startsWith("Buurwoning") && !mesh.name.startsWith("buur_") && luminantie(m) > 0.6) {
        // Windveren van de buurwoning: donker, net als bij de woning zelf.
        m.color.set("#35342f");
        m.roughness = 0.75;
      } else if (nl && mesh.name.startsWith("buur_goot")) {
        m.color.set("#6f7579");
        m.roughness = 0.5;
        m.metalness = 0.3;
      } else if (m.transparent && m.opacity < 1) {
        // Glas: donker, licht reflecterend in plaats van lichtblauw plastic.
        m.color.set("#243339");
        m.opacity = 0.9;
        m.roughness = 0.06;
        m.metalness = 0;
        m.envMapIntensity = 1.3;
      } else if (stijl?.garagedeur && mesh.name === "Garagedeur") {
        m.color.set(stijl.garagedeur);
        m.roughness = 0.6;
      } else if (vrij && mesh.name === "garage_dakrand") {
        m.color.set("#35342f");
        m.roughness = 0.75;
      } else if (deel === "Dakpannen" && luminantie(m) < 0.08 && mesh.name !== "Nok") {
        const { u, v } = vlakMaten(mesh);
        m.map = herhaal(pannen, u / 3.0, v / 5.3, texturen);
        m.color.set("#ffffff");
        m.roughness = 0.72;
      } else if (naam.startsWith("Zonnepaneel")) {
        if (luminantie(m) < 0.03 && m.color.b >= m.color.r) {
          m.map = herhaal(cellen, 1, 1, texturen);
          m.color.set("#ffffff");
          m.roughness = 0.28;
          m.metalness = 0.1;
          m.envMapIntensity = 1.1;
        } else {
          m.color.set("#2b2e31");
          m.roughness = 0.45;
          m.metalness = 0.55;
        }
      } else if (deel === "Dakgoot" || deel === "Regenpijpen") {
        // Zinken goot en regenpijp, zoals gebruikelijk bij Nederlandse woningen.
        m.color.set(nl && deel === "Dakgoot" ? "#6f7579" : "#8e959a");
        m.roughness = 0.5;
        m.metalness = 0.35;
      }
    }
  });
  return texturen;
}
