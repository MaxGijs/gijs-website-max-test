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
  const ctx = canvas.getContext("2d");
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
export function baksteenTextuur() {
  const B = 1024, lagen = 16, perLaag = 8;
  const { canvas, ctx } = maakCanvas(B, B);
  const rand = willekeur(7);
  ctx.fillStyle = "#b7ae9f";
  ctx.fillRect(0, 0, B, B);
  korrel(ctx, B, B, 18, rand);
  const lh = B / lagen, sb = B / perLaag, voeg = 6;
  const palet = ["#8e3f2b", "#98452f", "#a25038", "#874031", "#934d38", "#7f3a2a", "#a55a41", "#8a4733"];
  for (let r = 0; r < lagen; r++) {
    const verschuiving = r % 2 ? sb / 2 : 0;
    for (let c = -1; c <= perLaag; c++) {
      const x = c * sb + verschuiving;
      ctx.fillStyle = variant(palet[Math.floor(rand() * palet.length)], rand, 0.14);
      ctx.fillRect(x + voeg / 2, r * lh + voeg / 2, sb - voeg, lh - voeg);
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
export function grasTextuur() {
  const B = 1024;
  const { canvas, ctx } = maakCanvas(B, B);
  const rand = willekeur(31);
  ctx.fillStyle = "#7a9158";
  ctx.fillRect(0, 0, B, B);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = variant(rand() > 0.5 ? "#6f8a4d" : "#86a064", rand, 0.2);
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

// Afmetingen van een blokvormig mesh-vlak (lokaal, incl. objectschaal):
// de twee grootste maten bepalen hoe vaak een textuur herhaalt, zodat
// stenen en pannen op elke gevel even groot zijn.
function vlakMaten(mesh: Mesh) {
  mesh.geometry.computeBoundingBox();
  const maat = (mesh.geometry.boundingBox ?? new Box3()).getSize(new Vector3());
  const schaal = new Vector3();
  mesh.getWorldScale(schaal);
  const m = [maat.x * schaal.x, maat.y * schaal.y, maat.z * schaal.z].sort((a, b) => b - a);
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
  const baksteen = baksteenTextuur();
  const pannen = dakpanTextuur();
  const cellen = zonnecelTextuur();
  texturen.push(baksteen, pannen, cellen);

  scene.traverse(object => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const naam = hoofdnaam(mesh, scene);
    const materialen = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const materiaal of materialen) {
      const m = materiaal as MeshStandardMaterial;
      if (!m.isMeshStandardMaterial) continue;
      const installatie = /^(Warmtepomp|Thuisbatterij|Zonnepaneel)/.test(naam);
      // Natuurlijker: geen plastic glans, nauwelijks metaal (behalve installaties).
      if (!installatie) m.metalness = Math.min(m.metalness, 0.04);
      m.roughness = Math.max(m.roughness, 0.55);
      m.envMapIntensity = 0.6;

      if (m.map) {
        // Baksteen: 22 x 6,2 cm per steen incl. voeg → tegel van 1,76 x 1,0 m.
        const { u, v } = vlakMaten(mesh);
        m.map = herhaal(baksteen, u / 1.76, v / 0.99, texturen);
        m.color.set(naam.startsWith("Buurwoning") ? "#b2a79c" : "#ffffff");
        m.roughness = 0.92;
      } else if (m.transparent && m.opacity < 1) {
        // Glas: donker, licht reflecterend in plaats van lichtblauw plastic.
        m.color.set("#243339");
        m.opacity = 0.9;
        m.roughness = 0.06;
        m.metalness = 0;
        m.envMapIntensity = 1.3;
      } else if (naam === "Dakpannen" && luminantie(m) < 0.08 && mesh.name !== "Nok") {
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
      } else if (naam === "Dakgoot" || naam === "Regenpijpen") {
        // Zinken goot en regenpijp, zoals gebruikelijk bij Nederlandse woningen.
        m.color.set("#8e959a");
        m.roughness = 0.5;
        m.metalness = 0.35;
      }
    }
  });
  return texturen;
}
