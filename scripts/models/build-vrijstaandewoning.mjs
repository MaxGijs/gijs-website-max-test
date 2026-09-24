import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import fs from "fs";
import zlib from "zlib";

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    }).catch((err) => { if (this.onerror) this.onerror(err); });
  }
};

// ------------------------------------------------------------
// Zelfde PNG-encoder + Canvas/OffscreenCanvas-polyfill als bij de
// hoekwoning (puur Node zlib, geen "canvas"-package of netwerk nodig).
// ------------------------------------------------------------
function crc32(buf) {
  if (!crc32.table) {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    crc32.table = t;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = crc32.table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; ihdrData[9] = 6; ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
  const ihdr = pngChunk("IHDR", ihdrData);
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    for (let x = 0; x < stride; x++) raw[y * (stride + 1) + 1 + x] = rgba[y * stride + x];
  }
  const idat = pngChunk("IDAT", zlib.deflateSync(raw));
  const iend = pngChunk("IEND", Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

globalThis.ImageData = class {
  constructor(data, width, height) { this.data = data; this.width = width; this.height = height; }
};

class FakeContext2D {
  constructor(canvas) { this.canvas = canvas; }
  translate() {}
  scale() {}
  putImageData(imageData) { this.canvas._imageData = imageData; }
  drawImage() { throw new Error("polyfill: drawImage niet ondersteund, alleen DataTexture-export"); }
}

globalThis.OffscreenCanvas = class {
  constructor(w, h) { this.width = w; this.height = h; }
  getContext() { return this._ctx ?? (this._ctx = new FakeContext2D(this)); }
  convertToBlob({ type } = {}) {
    const { data, width, height } = this._imageData;
    const buffer = encodePNG(width, height, data);
    return Promise.resolve({
      size: buffer.length,
      type: type || "image/png",
      arrayBuffer: () => Promise.resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)),
    });
  }
};

// ============================================================
// GIJS vrijstaande woning — tweede woningtype naast de hoekwoning,
// zelfde bouwmethode/naamgeving (zodat de bestaande explode-animatie
// in HouseModelPrototype.tsx, die objecten puur op NAAM aanstuurt,
// ongewijzigd werkt voor beide modellen). Gebaseerd op de twee
// referentiebeelden die Max stuurde: een fotocollage van een
// jaren70-90 vrijstaande woning (2 bouwlagen, baksteen roodbruin,
// zadeldak met betonnen pannen, 1 schoorsteen, aangebouwde garage)
// en een doorsnede-infographic in dezelfde stijl als de hoekwoning.
//
// Prototypeaanname: geen bouwtekening beschikbaar, dus alle maten
// hieronder zijn een redelijke inschatting op basis van de foto's,
// net als bij de hoekwoning. Wat afwijkt van de hoekwoning-aanpak
// staat expliciet in de commentaren.
// ============================================================

// ---------- Maatvoering hoofdvolume (prototypeaanname) ----------
const MUUR_BREEDTE = 7.2;     // x, breedte van de voor-/achtergevel van het hoofdvolume
const MUUR_DIEPTE = 9.0;      // z, diepte van de woning
const VERDIEPING_HOOGTE = 2.7; // hoogte per bouwlaag — NIEUW t.o.v. hoekwoning: dit is een 2-laags woning
const MUUR_HOOGTE = VERDIEPING_HOOGTE * 2; // gevelhoogte tot de gootlijn, twee bouwlagen
const WALLTOP = MUUR_HOOGTE / 2;

const DIKTE_BUITENGEVEL = 0.10;
const DIKTE_SPOUW = 0.05;
const DIKTE_BINNENMUUR = 0.12;

const NOK_HOOGTE = 2.8;   // ruimere kap: bruikbare zolder
const OVERSTEK_GEVEL = 0.25;
const OVERSTEK_DAK = 0.32;
const HALF_SPAN_NOK = MUUR_BREEDTE / 2 + OVERSTEK_GEVEL;
const HALF_DIEPTE_DAK = MUUR_DIEPTE / 2 + OVERSTEK_DAK;
const NOK_Y = WALLTOP + NOK_HOOGTE;

const DAKCONSTRUCTIE_DIKTE = 0.16;
const DAKBESCHOT_DIKTE = 0.05;
const DAKISOLATIE_DIKTE = 0.12;
const TENGELLAT_DIKTE = 0.03;
const PANLAT_DIKTE = 0.025;
const DAKPANNEN_DIKTE = 0.06;

const PLINT_HOOGTE = 0.16;

// ---------- Garage (aangebouwd, rechts van het hoofdvolume) ----------
// Prototypeaanname: eenvoudige platte-dak-garage, want de foto's tonen
// geen bouwkundige details van de garageconstructie zelf. De garage
// wordt hier bewust NIET laagsgewijs opgebouwd (geen losse
// isolatie/spouw-lagen) omdat geen van de uitlegstappen in
// HouseModelPrototype over de garage gaat — het is een "Garage"-groep
// die als één geheel blijft staan tijdens de explode-animatie
// (movement() geeft voor onbekende namen [0,0,0,0], dus dit werkt
// vanzelf zonder extra code in dat bestand).
const GARAGE_BREEDTE = 3.8;
const GARAGE_DIEPTE = 6.8;
const GARAGE_HOOGTE = VERDIEPING_HOOGTE + 0.15; // net iets boven de eerste-verdiepingshoogte van het hoofdvolume

// ---------- Kleuren (zelfde palet als de hoekwoning, plus garagedeur) ----------
const KLEUR = {
  baksteen: 0x9a5c42,
  spouwisolatie: 0xe7dcb4,
  binnenmuur: 0x8f9089,
  beton: 0x9a9b98,
  dakconstructie: 0x7c6a4d,
  dakbeschot: 0x6b5738,
  dakisolatie: 0xdcbb8d,
  tengellat: 0x5b4c36,
  dakpannen: 0x33383b,
  nok: 0x2c3134,
  windveer: 0xf2f1ec,
  dakgoot: 0xefeee9,
  kozijnwit: 0xf2f1ec,
  glas: 0xbfe0ea,
  deur: 0x1f4a3d,
  garagedeur: 0x1f4a3d,          // zelfde donkergroen als de voordeur, zoals op de referentiefoto's
  plint: 0x2a241f,
  zonnepaneel: 0x0b0d10,        // all-black paneelvlak (2026-stijl: geen zichtbare blauwe cellen)
  zonnepaneelframe: 0x131518,   // zwart frame en zwarte montagerails
  bouwmuur: 0x8d8478,
  dakkapel: 0x3f4548,
  warmtepompFrame: 0x2b2d30,
  warmtepompLamel: 0xa8794a,
  warmtepompGrille: 0x8d99a6,
  warmtepomp: 0xe7e9e8,
  schoorsteen: 0x8a4a37,
  schoorsteenkap: 0x4b4d4c,
  vloerafwerking: 0x2a241f,
  vloerisolatie: 0xdcbb8d,
  vloerverwarming: 0xc85a2e,
  batterijFrame: 0x24292c,
  batterijAccent: 0x2fae63,
};

function mat(kleur, extra = {}) {
  return new THREE.MeshStandardMaterial({ color: kleur, roughness: 0.85, metalness: 0.04, ...extra });
}

function maakBaksteenTexture() {
  const w = 128, h = 128;
  const data = new Uint8Array(w * h * 4);
  const stenen = [
    [150, 84, 60], [141, 76, 54], [158, 92, 66], [134, 70, 50],
  ];
  const voeg = [200, 190, 172];
  const steenBreedte = 30, steenHoogte = 13, voegDikte = 3;
  const stap = steenBreedte + voegDikte;
  const rijStap = steenHoogte + voegDikte;
  for (let y = 0; y < h; y++) {
    const rij = Math.floor(y / rijStap);
    const yInRij = y % rijStap;
    const offset = rij % 2 === 0 ? 0 : Math.floor(steenBreedte / 2);
    for (let x = 0; x < w; x++) {
      const xVerschoven = x + offset;
      const xInSteen = xVerschoven % stap;
      const isVoeg = yInRij >= steenHoogte || xInSteen >= steenBreedte;
      const i = (y * w + x) * 4;
      let kleur;
      if (isVoeg) {
        kleur = voeg;
      } else {
        const steenIndex = Math.floor(xVerschoven / stap) + rij * 7;
        kleur = stenen[Math.abs(steenIndex) % stenen.length];
      }
      data[i] = kleur[0]; data[i + 1] = kleur[1]; data[i + 2] = kleur[2]; data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 7.7);  // ~0,70 m per herhaling op een gevel van 7,2 x 5,4 m
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const MAT = {
  baksteen: new THREE.MeshStandardMaterial({ map: maakBaksteenTexture(), roughness: 0.92, metalness: 0.02 }),
  spouwisolatie: mat(KLEUR.spouwisolatie, { roughness: 1 }),
  binnenmuur: mat(KLEUR.binnenmuur),
  beton: mat(KLEUR.beton),
  dakconstructie: mat(KLEUR.dakconstructie, { roughness: 1 }),
  dakbeschot: mat(KLEUR.dakbeschot, { roughness: 0.95 }),
  dakisolatie: mat(KLEUR.dakisolatie, { roughness: 1 }),
  tengellat: mat(KLEUR.tengellat, { roughness: 0.9 }),
  dakpannen: mat(KLEUR.dakpannen, { roughness: 0.6 }),
  nok: mat(KLEUR.nok, { roughness: 0.6 }),
  windveer: mat(KLEUR.windveer, { roughness: 0.5 }),
  dakgoot: mat(KLEUR.dakgoot, { roughness: 0.4, metalness: 0.15 }),
  kozijnwit: mat(KLEUR.kozijnwit, { roughness: 0.45 }),
  glas: new THREE.MeshStandardMaterial({ color: KLEUR.glas, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.82 }),
  deur: mat(KLEUR.deur, { roughness: 0.55 }),
  garagedeur: mat(KLEUR.garagedeur, { roughness: 0.5 }),
  plint: mat(KLEUR.plint, { roughness: 0.8 }),
  zonnepaneel: mat(KLEUR.zonnepaneel, { roughness: 0.35, metalness: 0.3 }),
  zonnepaneelframe: mat(KLEUR.zonnepaneelframe, { roughness: 0.6, metalness: 0.4 }),
  warmtepomp: mat(KLEUR.warmtepomp, { roughness: 0.5 }),
  bouwmuur: mat(KLEUR.bouwmuur, { roughness: 0.95 }),
  dakkapel: mat(KLEUR.dakkapel, { roughness: 0.5, metalness: 0.2 }),
  warmtepompFrame: mat(KLEUR.warmtepompFrame, { roughness: 0.55, metalness: 0.25 }),
  warmtepompLamel: mat(KLEUR.warmtepompLamel, { roughness: 0.45, metalness: 0.5 }),
  warmtepompGrille: mat(KLEUR.warmtepompGrille, { roughness: 0.35, metalness: 0.55 }),
  schoorsteen: mat(KLEUR.schoorsteen),
  schoorsteenkap: mat(KLEUR.schoorsteenkap, { roughness: 0.4, metalness: 0.3 }),
  vloerafwerking: mat(KLEUR.vloerafwerking, { roughness: 0.6 }),
  vloerisolatie: mat(KLEUR.vloerisolatie, { roughness: 1 }),
  vloerverwarming: mat(KLEUR.vloerverwarming, { roughness: 0.4, metalness: 0.15 }),
  batterijFrame: mat(KLEUR.batterijFrame, { roughness: 0.4, metalness: 0.25 }),
  batterijAccent: mat(KLEUR.batterijAccent, { roughness: 0.3, metalness: 0.1 }),
};

// ---------- Generieke helpers (zelfde als hoekwoning) ----------
function box(naam, w, h, d, materiaal, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materiaal);
  mesh.name = naam;
  mesh.position.set(x, y, z);
  return mesh;
}

function groep(naam, kinderen, x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.name = naam;
  g.position.set(x, y, z);
  for (const kind of kinderen) g.add(kind);
  return g;
}

// ============================================================
// 1. Fundering + vloeropbouw begane grond.
// ============================================================
const fundering = box("Fundering", MUUR_BREEDTE + 0.2, 0.30, MUUR_DIEPTE + 0.2, MAT.beton, 0, -WALLTOP - 0.40, 0);
const vloerisolatie = box("Vloerisolatie", MUUR_BREEDTE - 0.15, 0.10, MUUR_DIEPTE - 0.15, MAT.vloerisolatie, 0, -WALLTOP - 0.20, 0);
const vloerconstructie = box("Vloerconstructie", MUUR_BREEDTE - 0.05, 0.12, MUUR_DIEPTE - 0.05, MAT.beton, 0, -WALLTOP - 0.09, 0);
const vloer = box("Vloer", MUUR_BREEDTE - 0.02, 0.05, MUUR_DIEPTE - 0.02, MAT.vloerafwerking, 0, -WALLTOP + 0.005, 0);
// Vloerverwarming: dunne laag verwarmingsslangen in de dekvloer, net
// onder de afwerkvloer — verschijnt (net als Vloerisolatie) pas als de
// vloerlagen tijdens de maatregel-animatie uit elkaar schuiven.
const vloerverwarming = box("Vloerverwarming", MUUR_BREEDTE - 0.10, 0.02, MUUR_DIEPTE - 0.10, MAT.vloerverwarming, 0, -WALLTOP - 0.025, 0);


// ============================================================
// Verdiepingsvloer en zoldervloer. Deze maken bij het opengaan van de
// gevels zichtbaar dat de woning twee volle woonlagen heeft plus een
// bruikbare zolder onder het zadeldak. Beide blijven staan tijdens de
// animatie (hun naam komt in movement() niet voor): het zijn
// referentievlakken die de opbouw leesbaar maken, geen maatregelen.
// ============================================================
const verdiepingsvloer = box("Verdiepingsvloer", MUUR_BREEDTE - 0.02, 0.16, MUUR_DIEPTE - 0.02, MAT.beton, 0, -WALLTOP + VERDIEPING_HOOGTE, 0);
const zoldervloer = box("Zoldervloer", MUUR_BREEDTE - 0.02, 0.16, MUUR_DIEPTE - 0.02, MAT.beton, 0, WALLTOP - 0.08, 0);

// ============================================================
// 2. Gevelopbouw voor/achter: drie losse lagen, nu over de volle
//    hoogte van TWEE bouwlagen (MUUR_HOOGTE is hier dus groter dan
//    bij de hoekwoning — de rest van de aanpak is identiek).
// ============================================================
const gevelsVoorAchter = [];
for (const zijde of [1, -1]) {
  const naamDeel = zijde === 1 ? "voor" : "achter";
  const zBinnen = zijde * (MUUR_DIEPTE / 2 - DIKTE_BINNENMUUR / 2);
  const zSpouw = zijde * (MUUR_DIEPTE / 2 + DIKTE_SPOUW / 2 - 0.005);
  const zBuiten = zijde * (MUUR_DIEPTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL / 2 - 0.01);
  gevelsVoorAchter.push(
    box(`Binnenmuur_${naamDeel}`, MUUR_BREEDTE, MUUR_HOOGTE, DIKTE_BINNENMUUR, MAT.binnenmuur, 0, 0, zBinnen),
    box(`Spouwisolatie_${naamDeel}`, MUUR_BREEDTE, MUUR_HOOGTE, DIKTE_SPOUW, MAT.spouwisolatie, 0, 0, zSpouw),
    box(`Buitengevel_${naamDeel}`, MUUR_BREEDTE, MUUR_HOOGTE, DIKTE_BUITENGEVEL, MAT.baksteen, 0, 0, zBuiten),
  );
}
const buitenZVoor = MUUR_DIEPTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
const buitenZAchter = -buitenZVoor;

// ============================================================
// 3. Kopgevels links/rechts: puntgevel tot aan de nok, exact dezelfde
//    hellingsformule als het dak (zelfde gable-gap-fix als hoekwoning
//    v3, hier meteen goed vanaf het begin).
// ============================================================
function roofLijnHoogte(z) {
  return NOK_Y - (NOK_HOOGTE / HALF_DIEPTE_DAK) * Math.abs(z);
}

function maakKopgevelVorm() {
  const shape = new THREE.Shape();
  const halfDiepte = MUUR_DIEPTE / 2;
  shape.moveTo(-halfDiepte, -WALLTOP);
  shape.lineTo(halfDiepte, -WALLTOP);
  shape.lineTo(halfDiepte, roofLijnHoogte(halfDiepte));
  shape.lineTo(0, NOK_Y);
  shape.lineTo(-halfDiepte, roofLijnHoogte(-halfDiepte));
  shape.closePath();
  return shape;
}


// ============================================================
// ExtrudeGeometry (kopgevels, buurwoningromp) zet UV's in METERS, terwijl
// een BoxGeometry 0..1 per vlak gebruikt. Met dezelfde texture-repeat als de
// rechte gevels leverde dat een 7x te fijne baksteen op beide kopgevels op. Hier
// schalen we de UV's terug, zodat een steenrij op de kopgevel exact even
// groot is als op de voorgevel.
// ============================================================
const GEVEL_UV_SCHAAL = 1 / (0.72 * 10);
function schaalGevelUV(geometry) {
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i += 1) uv.setXY(i, uv.getX(i) * GEVEL_UV_SCHAAL, uv.getY(i) * GEVEL_UV_SCHAAL);
  uv.needsUpdate = true;
  return geometry;
}

function maakKopgevelLaag(naam, dikte, xCenter, materiaal) {
  const shape = maakKopgevelVorm();
  const geometry = schaalGevelUV(new THREE.ExtrudeGeometry(shape, { depth: dikte, bevelEnabled: false, curveSegments: 1 }));
  geometry.translate(0, 0, -dikte / 2);
  geometry.rotateY(Math.PI / 2);
  const mesh = new THREE.Mesh(geometry, materiaal);
  mesh.name = naam;
  mesh.position.set(xCenter, 0, 0);
  return mesh;
}

// De garage staat tegen de RECHTER kopgevel aan. In de vorige versie
// overlapte de garage die kopgevel: de garagevoetafdruk begon op x=1,80
// en het dakoverstek zelfs op x=1,72, terwijl het buitenvlak van de
// kopgevel op x=1,94 ligt — de muur liep dus dwars door de garage heen.
// Hieronder sluit de garage exact op dat buitenvlak aan (zie
// GARAGE_AANSLUIT_X) en heeft het garagedak géén overstek aan de
// huiszijde, zodat de aansluiting bouwkundig klopt.
// De LINKER kopgevel is een volledig vrije gevel en schuift tijdens de
// explode netjes naar buiten. De RECHTER kopgevel is de gevel waar de
// garage tegenaan staat. Die kreeg eerder dezelfde namen
// (Buitengevel_rechts / Spouwisolatie_rechts) en schoof daardoor 2,4 resp.
// 1,2 m naar +x — dwars door de statische garage heen. Die zijde heet nu
// "Zijgevel_garage_*": die naam komt in movement() niet voor, dus de muur
// blijft staan op de aansluiting met de garage. De laagopbouw blijft wel
// gewoon zichtbaar in het model; alleen de beweging vervalt aan die kant.
const gevelsZijkanten = [
  maakKopgevelLaag("Binnenmuur_links", DIKTE_BINNENMUUR, -(MUUR_BREEDTE / 2 - DIKTE_BINNENMUUR / 2), MAT.binnenmuur),
  maakKopgevelLaag("Spouwisolatie_links", DIKTE_SPOUW, -(MUUR_BREEDTE / 2 + DIKTE_SPOUW / 2 - 0.005), MAT.spouwisolatie),
  maakKopgevelLaag("Buitengevel_links", DIKTE_BUITENGEVEL, -(MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL / 2 - 0.01), MAT.baksteen),
  maakKopgevelLaag("Zijgevel_garage_binnen", DIKTE_BINNENMUUR, MUUR_BREEDTE / 2 - DIKTE_BINNENMUUR / 2, MAT.binnenmuur),
  maakKopgevelLaag("Zijgevel_garage_isolatie", DIKTE_SPOUW, MUUR_BREEDTE / 2 + DIKTE_SPOUW / 2 - 0.005, MAT.spouwisolatie),
  maakKopgevelLaag("Zijgevel_garage_buiten", DIKTE_BUITENGEVEL, MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL / 2 - 0.01, MAT.baksteen),
];

// ============================================================
// 4. Dakvlak-wiskunde (identiek aan hoekwoning).
// ============================================================
function dakvlakPunt(zijde, t, x = 0, normaalUitstand = 0) {
  const nok = new THREE.Vector3(x, NOK_Y, 0);
  const druip = new THREE.Vector3(x, WALLTOP, zijde * HALF_DIEPTE_DAK);
  const hellingsVector = new THREE.Vector3().subVectors(druip, nok);
  const richting = hellingsVector.clone().normalize();
  let normaal = new THREE.Vector3(0, -richting.z, richting.y);
  if (normaal.y < 0) normaal.negate();
  const punt = new THREE.Vector3().copy(nok).addScaledVector(hellingsVector, t).addScaledVector(normaal, normaalUitstand);
  return { punt, normaal, richting };
}

function maakDakSchild(zijde, breedte, dikte, uitstand, materiaal, xCenter = 0, extraLengte = 0) {
  const { punt: nokPunt, richting } = dakvlakPunt(zijde, 0, xCenter, uitstand);
  const { punt: druipPunt } = dakvlakPunt(zijde, 1, xCenter, uitstand);
  const lengte = nokPunt.distanceTo(druipPunt) + extraLengte;
  const midden = new THREE.Vector3().addVectors(nokPunt, druipPunt).multiplyScalar(0.5);
  midden.addScaledVector(richting, extraLengte / 2);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(breedte, dikte, lengte), materiaal);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), richting);
  mesh.position.copy(midden);
  return mesh;
}

const DAK_BREEDTE = HALF_SPAN_NOK * 2;
let cum = 0;
const uitConstructie = cum + DAKCONSTRUCTIE_DIKTE / 2; cum += DAKCONSTRUCTIE_DIKTE;
const uitBeschot = cum + DAKBESCHOT_DIKTE / 2; cum += DAKBESCHOT_DIKTE;
const uitIsolatie = cum + DAKISOLATIE_DIKTE / 2; cum += DAKISOLATIE_DIKTE;
const uitTengellat = cum + TENGELLAT_DIKTE / 2; cum += TENGELLAT_DIKTE;
const uitPanlat = cum + PANLAT_DIKTE / 2; cum += PANLAT_DIKTE;
const uitPannen = cum + DAKPANNEN_DIKTE / 2;

function maakDakLaagGroep(naam, dikte, uitstand, breedte, materiaal, extraLengte = 0) {
  const voor = maakDakSchild(1, breedte, dikte, uitstand, materiaal, 0, extraLengte);
  const achter = maakDakSchild(-1, breedte, dikte, uitstand, materiaal, 0, extraLengte);
  return groep(naam, [voor, achter]);
}

const dakconstructie = maakDakLaagGroep("Dakconstructie", DAKCONSTRUCTIE_DIKTE, uitConstructie, DAK_BREEDTE, MAT.dakconstructie);
dakconstructie.add(maakDakSchild(1, DAK_BREEDTE - 0.1, DAKBESCHOT_DIKTE, uitBeschot, MAT.dakbeschot, 0));
dakconstructie.children[dakconstructie.children.length - 1].name = "Dakbeschot_voor";
dakconstructie.add(maakDakSchild(-1, DAK_BREEDTE - 0.1, DAKBESCHOT_DIKTE, uitBeschot, MAT.dakbeschot, 0));
dakconstructie.children[dakconstructie.children.length - 1].name = "Dakbeschot_achter";

const dakisolatie = maakDakLaagGroep("Dakisolatie", DAKISOLATIE_DIKTE, uitIsolatie, DAK_BREEDTE - 0.15, MAT.dakisolatie);

const tengellatten = groep("Tengellatten", [
  maakDakSchild(1, DAK_BREEDTE - 0.2, TENGELLAT_DIKTE, uitTengellat, MAT.tengellat, 0),
  maakDakSchild(-1, DAK_BREEDTE - 0.2, TENGELLAT_DIKTE, uitTengellat, MAT.tengellat, 0),
]);
const panlatten = groep("Panlatten", [
  maakDakSchild(1, DAK_BREEDTE - 0.2, PANLAT_DIKTE, uitPanlat, MAT.tengellat, 0),
  maakDakSchild(-1, DAK_BREEDTE - 0.2, PANLAT_DIKTE, uitPanlat, MAT.tengellat, 0),
]);

const dakpannen = maakDakLaagGroep("Dakpannen", DAKPANNEN_DIKTE, uitPannen, DAK_BREEDTE + 0.16, MAT.dakpannen, 0.18);

// Zie hoekwoning: de nokvorst lag 0,22 m onder het snijpunt van de
// pannenvlakken en was daardoor onzichtbaar.
const nok = box("Nok", DAK_BREEDTE + 0.10, 0.18, 0.50, MAT.nok, 0, NOK_Y + uitPannen / Math.cos(Math.atan2(NOK_HOOGTE, HALF_DIEPTE_DAK)) - 0.02, 0);
dakpannen.add(nok);

function maakWindveer(zijde, xRand) {
  const { punt: nokPunt, richting } = dakvlakPunt(zijde, 0, xRand, uitPannen + 0.03);
  const { punt: druipPunt } = dakvlakPunt(zijde, 1, xRand, uitPannen + 0.03);
  const lengte = nokPunt.distanceTo(druipPunt);
  const midden = new THREE.Vector3().addVectors(nokPunt, druipPunt).multiplyScalar(0.5);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, lengte), MAT.windveer);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), richting);
  mesh.position.copy(midden);
  return mesh;
}
const windveren = groep("Windveren", [
  maakWindveer(1, -HALF_SPAN_NOK), maakWindveer(1, HALF_SPAN_NOK),
  maakWindveer(-1, -HALF_SPAN_NOK), maakWindveer(-1, HALF_SPAN_NOK),
]);
dakpannen.add(windveren);

// Schoorsteen: op de referentiefoto's staat er maar ÉÉN schoorsteen
// (i.p.v. twee bij de hoekwoning), dicht bij de nok aan de linkerkant.
function maakSchoorsteen(naam, x, tOpDak, breedte, hoogteBoven) {
  const { punt } = dakvlakPunt(-1, tOpDak, x, uitPannen);
  // De schacht is verticaal maar het dak loopt schuin: op de afwaartse hoek
  // van de voetafdruk ligt het pannenvlak lager, waardoor de schoorsteen daar
  // los boven het dak zweefde (gemeten 5 cm). De inbouwdiepte hieronder is
  // precies het hoogteverschil over de voetafdruk plus marge, zodat de
  // schoorsteen rondom in de pannen steekt. De bovenkant blijft gelijk.
  const inbouw = breedte * Math.tan(Math.atan2(NOK_HOOGTE, HALF_DIEPTE_DAK)) + 0.14;
  const groepje = groep(naam, [
    box("schacht", breedte, hoogteBoven + inbouw, breedte, MAT.schoorsteen, 0, (hoogteBoven - inbouw) / 2 - 0.05, 0),
    box("kap", breedte + 0.08, 0.05, breedte + 0.08, MAT.schoorsteenkap, 0, hoogteBoven - 0.02, 0),
  ], punt.x, punt.y, punt.z);
  return groepje;
}
const schoorsteen01 = maakSchoorsteen("Schoorsteen_01", 0.0, 0.12, 0.46, 0.95);


// ============================================================
// Zonnepanelen — volledig zwarte (all-black) panelen in een strak
// raster. Eén generieke paneelbouwer, zodat elk paneel exact dezelfde
// maat en randafwerking heeft; de posities komen uit een raster met
// overal dezelfde tussenruimte. Rijafstanden worden LANGS DE HELLING
// gemeten (niet in de parameter t), anders zouden rijen op een steiler
// dak dichter op elkaar komen te liggen.
// Elk paneel is een eigen top-level object (Zonnepaneel_NN) en dus
// afzonderlijk zichtbaar of animeerbaar.
// Prototypeaanname: de paneelmaat is meegeschaald met dit
// vereenvoudigde woningmodel, het is geen echte 1,72 x 1,13 m.
// ============================================================
const PANEEL_BREEDTE = 1.05;   // langs de nok (x) — staand paneel, ca. 1,05 x 1,70 m
const PANEEL_LENGTE = 1.70;    // langs de dakhelling
const PANEEL_DIKTE = 0.035;
const PANEEL_TUSSEN_X = 0.06;
const PANEEL_TUSSEN_L = 0.06;
const DAK_SCHUINE_LENGTE = Math.hypot(NOK_HOOGTE, HALF_DIEPTE_DAK);

function maakPaneelVlak(naam) {
  const g = new THREE.Group();
  g.name = naam;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(PANEEL_BREEDTE, PANEEL_DIKTE, PANEEL_LENGTE), MAT.zonnepaneelframe);
  const glasvlak = new THREE.Mesh(new THREE.BoxGeometry(PANEEL_BREEDTE - 0.05, PANEEL_DIKTE * 0.7, PANEEL_LENGTE - 0.05), MAT.zonnepaneel);
  glasvlak.position.y = PANEEL_DIKTE * 0.3;
  g.add(frame, glasvlak);
  return g;
}

// Paneel plat op een hellend dakvlak. afstandVanNok is gemeten langs de
// helling, zodat rijen onderling exact even ver uit elkaar liggen.
// De uitstand (uitPannen + 0,055) is zo gekozen dat de ONDERKANT van het
// paneel (halve paneeldikte = 0,0175) nog altijd 0,0075 m boven het
// buitenvlak van de dakpannen (uitPannen + 0,03) ligt: het paneel ligt dus
// op de pannen en steekt er nooit doorheen.
function maakDakPaneel(naam, zijde, x, afstandVanNok) {
  const { punt, normaal } = dakvlakPunt(zijde, afstandVanNok / DAK_SCHUINE_LENGTE, x, uitPannen + 0.055);
  const g = maakPaneelVlak(naam);
  g.position.copy(punt);
  g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normaal);
  return g;
}

function paneelKolommen(aantal, midden = 0) {
  const stap = PANEEL_BREEDTE + PANEEL_TUSSEN_X;
  return Array.from({ length: aantal }, (_, i) => midden + (i - (aantal - 1) / 2) * stap);
}

function paneelRijen(aantal, eersteAfstand) {
  const stap = PANEEL_LENGTE + PANEEL_TUSSEN_L;
  return Array.from({ length: aantal }, (_, i) => eersteAfstand + i * stap);
}

// Doorlopende nummering over alle daken heen, zodat elk paneel een
// unieke naam Zonnepaneel_NN houdt.
const zonnepanelen = [];
function voegPaneelToe(maker) {
  const naam = `Zonnepaneel_${String(zonnepanelen.length + 1).padStart(2, "0")}`;
  const paneel = maker(naam);
  zonnepanelen.push(paneel);
  return paneel;
}

// ============================================================
// Dakkapel. Steekt door het dakvlak heen — zo hoort dat — maar onder-
// en bovenkant worden afgeleid van de dakvlakformule, zodat er nooit
// een kier onder de kap ontstaat en de bovenkant altijd bóven de
// pannen uitkomt. De kap blijft één statische groep: hij hoort bij de
// woning, niet bij de laagopbouw die uit elkaar schuift.
// afstandVoor/afstandAchter zijn afstanden vanaf de nok, LANGS de helling.
// ============================================================
function maakDakkapel(naam, zijde, breedte, afstandVoor, afstandAchter) {
  const tVoor = afstandVoor / DAK_SCHUINE_LENGTE;
  const tAchter = afstandAchter / DAK_SCHUINE_LENGTE;
  const zVoor = zijde * tVoor * HALF_DIEPTE_DAK;
  const zAchter = zijde * tAchter * HALF_DIEPTE_DAK;
  const onder = NOK_Y - tVoor * NOK_HOOGTE - 0.32;   // ruim onder het dakvlak: geen kier
  const boven = NOK_Y - tAchter * NOK_HOOGTE + 0.20; // boven het dakvlak aan de bovenzijde
  const hoogte = boven - onder;
  const diepte = Math.abs(zVoor - zAchter);
  const yMidden = (onder + boven) / 2;
  const zMidden = (zVoor + zAchter) / 2;
  const buitenZ = zVoor + zijde * 0.03;
  // De kap was een enkel blok met een raam erop geplakt en las daardoor niet
  // als dakkapel. Nu met de onderdelen die een Nederlandse dakkapel herkenbaar
  // maken: twee zijwangen, een gesloten borstwering onder het raam, een
  // terugliggend kozijn en een overstekende dakrand erboven.
  const wang = 0.10;
  const borstwering = 0.34;                       // dicht paneel onder het raam
  const bovendorpel = 0.16;                       // dicht randje onder de dakrand
  const raamBreedte = breedte - wang * 2 - 0.06;
  const raamHoogte = Math.max(0.34, hoogte - borstwering - bovendorpel);
  const raamY = onder + borstwering + raamHoogte / 2;
  const zKozijn = buitenZ - zijde * 0.05;
  return groep(naam, [
    box("dakkapel_wang_links", wang, hoogte, diepte, MAT.dakkapel, -breedte / 2 + wang / 2, yMidden, zMidden),
    box("dakkapel_wang_rechts", wang, hoogte, diepte, MAT.dakkapel, breedte / 2 - wang / 2, yMidden, zMidden),
    box("dakkapel_borstwering", breedte - wang * 2, borstwering, 0.08, MAT.dakkapel, 0, onder + borstwering / 2, buitenZ - zijde * 0.04),
    box("dakkapel_bovendorpel", breedte - wang * 2, bovendorpel, 0.08, MAT.dakkapel, 0, boven - bovendorpel / 2, buitenZ - zijde * 0.04),
    box("dakkapel_achterwand", breedte - wang * 2, hoogte, 0.08, MAT.dakkapel, 0, yMidden, zAchter),
    box("dakkapel_kozijn_links", 0.07, raamHoogte, 0.10, MAT.kozijnwit, -raamBreedte / 2 + 0.035, raamY, zKozijn),
    box("dakkapel_kozijn_rechts", 0.07, raamHoogte, 0.10, MAT.kozijnwit, raamBreedte / 2 - 0.035, raamY, zKozijn),
    box("dakkapel_kozijn_boven", raamBreedte, 0.07, 0.10, MAT.kozijnwit, 0, raamY + raamHoogte / 2 - 0.035, zKozijn),
    box("dakkapel_kozijn_onder", raamBreedte, 0.07, 0.10, MAT.kozijnwit, 0, raamY - raamHoogte / 2 + 0.035, zKozijn),
    box("dakkapel_glas", raamBreedte - 0.14, raamHoogte - 0.14, 0.02, MAT.glas, 0, raamY, zKozijn - zijde * 0.04),
    // Dakrand steekt aan alle kanten over, zoals bij een echte dakkapel.
    box("dakkapel_dakrand", breedte + 0.18, 0.10, diepte + 0.16, MAT.dakgoot, 0, boven + 0.05, zMidden - zijde * 0.04),
  ]);
}

// Rechthoek (in x en afstand-langs-de-helling) die een dakkapel op een
// dakvlak inneemt, inclusief werkmarge. Gebruikt als obstakel bij het
// vullen van het dakvlak met panelen.
function dakkapelObstakel(breedte, afstandVoor, afstandAchter, marge = 0.20) {
  return { x0: -breedte / 2 - marge, x1: breedte / 2 + marge, s0: afstandAchter - marge, s1: afstandVoor + marge };
}

// ============================================================
// Dakvlak zo vol mogelijk leggen met panelen: één raster met overal
// dezelfde tussenruimte, waarbij elke positie die een obstakel raakt
// (dakkapel, schoorsteen, dakdoorvoer) of buiten de veilige marge van
// nok, goot en dakrand valt, wordt overgeslagen. Zo ligt er nooit een
// paneel door iets heen én blijft er geen dakvlak onnodig leeg.
// ============================================================
const PANEEL_RAND_X = 0.35;     // vrije marge tot de zijkant van het dakvlak
const PANEEL_RAND_NOK = 0.35;   // vrije marge onder de nok
const PANEEL_RAND_GOOT = 0.45;  // vrije marge boven de goot

function vulDakvlakMetPanelen(zijde, obstakels = []) {
  const halveBreedte = HALF_SPAN_NOK - PANEEL_RAND_X;
  const sMin = PANEEL_RAND_NOK;
  const sMax = DAK_SCHUINE_LENGTE - PANEEL_RAND_GOOT;
  const kolomStap = PANEEL_BREEDTE + PANEEL_TUSSEN_X;
  const rijStap = PANEEL_LENGTE + PANEEL_TUSSEN_L;
  const aantalKolommen = Math.max(0, Math.floor((halveBreedte * 2 + PANEEL_TUSSEN_X) / kolomStap));
  const aantalRijen = Math.max(0, Math.floor((sMax - sMin + PANEEL_TUSSEN_L) / rijStap));
  const veld = [];
  for (let rij = 0; rij < aantalRijen; rij += 1) {
    const s = sMin + PANEEL_LENGTE / 2 + rij * rijStap;
    for (let kolom = 0; kolom < aantalKolommen; kolom += 1) {
      const x = (kolom - (aantalKolommen - 1) / 2) * kolomStap;
      const vak = { x0: x - PANEEL_BREEDTE / 2, x1: x + PANEEL_BREEDTE / 2, s0: s - PANEEL_LENGTE / 2, s1: s + PANEEL_LENGTE / 2 };
      const raaktObstakel = obstakels.some((o) => vak.x0 < o.x1 && vak.x1 > o.x0 && vak.s0 < o.s1 && vak.s1 > o.s0);
      if (raaktObstakel) continue;
      veld.push(voegPaneelToe((naam) => maakDakPaneel(naam, zijde, x, s)));
    }
  }
  return veld;
}

// ============================================================
// Warmtepomp buitenunit — "Warmtepomp_DeWarmte"
// Vormstudie op basis van de referentieafbeelding die Max aanleverde:
// een liggende rechthoekige kast met donker frame, een strak
// gelamelleerde lange zijde en een rond geperforeerd grillevlak op de
// kopse kant. Alleen de VORM/uitstraling is nagebouwd — geen logo,
// merknaam op het model, en geen technische specificaties, want daar
// is geen bron voor.
// ============================================================
function maakWarmtepompDeWarmte(naam, x, vloerY, z, draaiing = 0) {
  const B = 0.92;  // lengte van de kast
  const H = 0.60;  // hoogte van de kast
  const D = 0.36;  // diepte van de kast
  const g = new THREE.Group();
  g.name = naam;
  // vloerY is de onderkant van de voetjes; de kast staat daar bovenop.
  g.position.set(x, vloerY + 0.06 + H / 2, z);
  g.rotation.y = draaiing;

  g.add(box("wp_kast", B, H, D, MAT.warmtepompFrame, 0, 0, 0));
  g.add(box("wp_bovenplaat", B + 0.04, 0.03, D + 0.04, MAT.warmtepompFrame, 0, H / 2 + 0.015, 0));

  // Verticale lamellen over de lange zijde, met overal dezelfde tussenruimte.
  const lamelAantal = 17;
  const lamelSpan = B - 0.12;
  const lamelStap = lamelSpan / (lamelAantal - 1);
  for (let i = 0; i < lamelAantal; i += 1) {
    g.add(box(`wp_lamel_${i}`, 0.022, H - 0.10, 0.035, MAT.warmtepompLamel, -lamelSpan / 2 + i * lamelStap, 0, D / 2 + 0.014));
  }

  // Rond geperforeerd grillevlak op de kopse kant.
  const grille = new THREE.Mesh(new THREE.CylinderGeometry(H * 0.34, H * 0.34, 0.025, 24), MAT.warmtepompGrille);
  grille.rotation.z = Math.PI / 2;
  grille.position.set(-B / 2 - 0.012, 0, 0);
  grille.name = "wp_grille";
  g.add(grille);

  // Twee lage voetjes.
  for (const vx of [-B * 0.34, B * 0.34]) {
    g.add(box("wp_voet", 0.10, 0.06, D * 0.8, MAT.warmtepompFrame, vx, -H / 2 - 0.03, 0));
  }
  return g;
}

// ============================================================
// Thuisbatterij — eenvoudige, staande buitenkast met een groen
// statusaccent (Gijs-kleur), naast de warmtepomp-buitenunit. Alleen de
// vorm/uitstraling is een aanname; geen merk of specificaties.
// ============================================================
function maakThuisbatterij(naam, x, vloerY, z, draaiing = 0) {
  const B = 0.62; // breedte
  const H = 1.10; // hoogte
  const D = 0.20; // diepte
  const g = new THREE.Group();
  g.name = naam;
  g.position.set(x, vloerY + 0.03 + H / 2, z);
  g.rotation.y = draaiing;

  g.add(box("batterij_kast", B, H, D, MAT.batterijFrame, 0, 0, 0));
  g.add(box("batterij_top", B - 0.04, 0.03, D + 0.01, MAT.batterijFrame, 0, H / 2 + 0.015, 0));
  g.add(box("batterij_accent", B - 0.10, 0.05, 0.01, MAT.batterijAccent, 0, H * 0.30, D / 2 + 0.006));
  g.add(box("batterij_voet", B - 0.06, 0.05, D + 0.02, MAT.warmtepompFrame, 0, -H / 2 - 0.025, 0));
  return g;
}

// ============================================================
// Contextwoning — puur visuele context, altijd statisch.
// De groepsnaam komt in movement() (HouseModelPrototype.tsx) niet voor,
// dus deze woning krijgt offset [0,0,0,0] en blijft tijdens de hele
// scroll-animatie exact staan. Alle onderdelen zitten GENEST in deze
// ene groep; alleen top-level objecten worden geanimeerd, dus er kan
// nooit een los onderdeel van de buurwoning meebewegen.
// Prototypeaanname: massief volume zonder laagopbouw — de buurwoning
// is context, geen onderwerp van de uitleg.
// ============================================================
function maakContextWoning({ naam, breedte, diepte, muurHoogte, nokHoogte, overstekGevel, overstekDak, vloerY, x, z }) {
  const g = new THREE.Group();
  g.name = naam;
  g.position.set(x, 0, z);

  const halfDiepteDak = diepte / 2 + overstekDak;
  const gootY = vloerY + muurHoogte;
  const nokY = gootY + nokHoogte;
  const dakLijn = (zz) => nokY - (nokHoogte / halfDiepteDak) * Math.abs(zz);

  // Romp: gevel + puntgevel in één profiel, geëxtrudeerd over de breedte.
  const shape = new THREE.Shape();
  shape.moveTo(-diepte / 2, vloerY);
  shape.lineTo(diepte / 2, vloerY);
  shape.lineTo(diepte / 2, dakLijn(diepte / 2));
  shape.lineTo(0, nokY);
  shape.lineTo(-diepte / 2, dakLijn(-diepte / 2));
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: breedte, bevelEnabled: false, curveSegments: 1 });
  geo.translate(0, 0, -breedte / 2);
  geo.rotateY(Math.PI / 2);
  const romp = new THREE.Mesh(geo, MAT.baksteen);
  romp.name = "context_romp";
  g.add(romp);

  // Dakvlakken: dezelfde vectoraanpak als bij het hoofdvolume, zodat het
  // pannenvlak exact op de puntgevel aansluit (geen kier langs de daklijn).
  for (const zijde of [1, -1]) {
    const nokPunt = new THREE.Vector3(0, nokY, 0);
    const druipPunt = new THREE.Vector3(0, gootY, zijde * halfDiepteDak);
    const hellingsVector = new THREE.Vector3().subVectors(druipPunt, nokPunt);
    const richting = hellingsVector.clone().normalize();
    const normaal = new THREE.Vector3(0, -richting.z, richting.y);
    if (normaal.y < 0) normaal.negate();
    const lengte = hellingsVector.length() + 0.16;
    const midden = new THREE.Vector3().addVectors(nokPunt, druipPunt).multiplyScalar(0.5)
      .addScaledVector(richting, 0.08)
      .addScaledVector(normaal, 0.05);
    const schild = new THREE.Mesh(new THREE.BoxGeometry(breedte + overstekGevel * 2, 0.10, lengte), MAT.dakpannen);
    schild.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), richting);
    schild.position.copy(midden);
    schild.name = `context_dakschild_${zijde === 1 ? "voor" : "achter"}`;
    g.add(schild);
    g.add(box(`context_goot_${zijde === 1 ? "voor" : "achter"}`, breedte + 0.05, 0.06, 0.09, MAT.dakgoot, 0, gootY - 0.02, zijde * (halfDiepteDak - 0.03)));
  }
  g.add(box("context_nok", breedte + overstekGevel * 2, 0.12, 0.3, MAT.nok, 0, nokY + 0.07, 0));

  // Eenvoudige gevelinvulling op de voorgevel (+z): deur en twee ramen.
  const gevelZ = diepte / 2 + 0.03;
  g.add(box("context_deur", 0.55, 1.9, 0.05, MAT.deur, -breedte * 0.24, vloerY + 0.95, gevelZ));
  g.add(box("context_deurkader", 0.63, 1.98, 0.03, MAT.kozijnwit, -breedte * 0.24, vloerY + 0.99, gevelZ - 0.012));
  for (const [rx, ry, rb, rh] of [
    [breedte * 0.22, vloerY + muurHoogte * 0.30, 1.05, 1.15],
    [breedte * 0.22, vloerY + muurHoogte * 0.72, 0.85, 0.95],
    [-breedte * 0.24, vloerY + muurHoogte * 0.72, 0.85, 0.95],
  ]) {
    if (ry + rh / 2 > gootY - 0.1) continue; // nooit door de gootlijn heen
    g.add(box("context_kozijn", rb, rh, 0.04, MAT.kozijnwit, rx, ry, gevelZ));
    g.add(box("context_glas", rb - 0.14, rh - 0.14, 0.02, MAT.glas, rx, ry, gevelZ + 0.02));
  }
  return g;
}

// Paneel op een PLAT dak (het garagedak): op een lichte helling gezet,
// zoals de opstelling op de referentiefoto van het platte dak. De
// buitenste groep blijft horizontaal (voetjes op het dak), alleen het
// paneelvlak zelf kantelt — zo steekt er nooit iets door het dakvlak.
function maakPlatDakPaneel(naam, x, z, dakTopY) {
  const g = new THREE.Group();
  g.name = naam;
  g.position.set(x, dakTopY, z);
  const vlak = maakPaneelVlak("paneelvlak");
  vlak.position.y = 0.32;
  // Stond op -0.26: het paneelvlak keek daarmee naar -z (azimut 180), precies
  // de andere kant op dan het voorschild van het hoofddak (azimut 0), en de
  // hoge schoor stond onder de LAGE rand. Met +0.26 kijken alle panelen op het
  // model dezelfde kant op en staat de hoge schoor onder de hoge rand.
  vlak.rotation.x = 0.26; // ca. 15 graden, hoge rand naar achteren (-z), vlak kijkt naar +z
  g.add(vlak);
  g.add(box("rail_voor", PANEEL_BREEDTE * 0.92, 0.02, 0.035, MAT.zonnepaneelframe, 0, 0.01, PANEEL_LENGTE * 0.45));
  g.add(box("rail_achter", PANEEL_BREEDTE * 0.92, 0.02, 0.035, MAT.zonnepaneelframe, 0, 0.01, -PANEEL_LENGTE * 0.45));
  g.add(box("steun", 0.04, 0.44, 0.04, MAT.zonnepaneelframe, 0, 0.22, -PANEEL_LENGTE * 0.40));
  g.add(box("steun_voor", 0.04, 0.18, 0.04, MAT.zonnepaneelframe, 0, 0.09, PANEEL_LENGTE * 0.40));
  return g;
}

// --- Voorschild: volledig gevuld, geen obstakels op dit dakvlak ---
vulDakvlakMetPanelen(1);

// ============================================================
// 5. Ramen, kozijnen, deuren — NIEUW t.o.v. hoekwoning: twee
//    bouwlagen, dus twee rijen ramen aan de voorgevel i.p.v. één.
// ============================================================
function maakRaam(naam, breedte, hoogte, x, y, zijde = 1, kozijnNaam = null) {
  const buitenZ = zijde === 1 ? buitenZVoor : buitenZAchter;
  // De vorige versie was een dicht wit vlak met het glas er 1,5 cm VOOR: dat
  // oogde als een platte witte rechthoek. Nu vier losse kozijnstijlen met het
  // glas terugliggend in de negge, zodat er schaduw in het raam valt.
  const stijl = breedte > 1.6 || hoogte > 1.6 ? 0.10 : 0.08;
  const negge = 0.12;                              // hoe diep het kozijn in de gevel zit
  const zVlak = zijde * 0.005;                     // net voor het metselwerk (tegen z-fighting)
  const zKozijn = zVlak - zijde * (negge / 2);
  const zGlas = zVlak - zijde * (negge - 0.03);
  const delen = [
    box(kozijnNaam ?? "kozijn_boven", breedte, stijl, negge, MAT.kozijnwit, 0, hoogte / 2 - stijl / 2, zKozijn),
    box("kozijn_onder", breedte, stijl, negge, MAT.kozijnwit, 0, -hoogte / 2 + stijl / 2, zKozijn),
    box("kozijn_links", stijl, hoogte - stijl * 2, negge, MAT.kozijnwit, -breedte / 2 + stijl / 2, 0, zKozijn),
    box("kozijn_rechts", stijl, hoogte - stijl * 2, negge, MAT.kozijnwit, breedte / 2 - stijl / 2, 0, zKozijn),
    box("glas", breedte - stijl * 2, hoogte - stijl * 2, 0.02, MAT.glas, 0, 0, zGlas),
  ];
  // Bredere ramen krijgen een middenstijl, zoals gebruikelijk bij een
  // Nederlands houten kozijn van deze maat.
  if (breedte > 1.25) delen.push(box("roede", 0.06, hoogte - stijl * 2, negge * 0.8, MAT.kozijnwit, 0, 0, zKozijn));
  return groep(naam, delen, x, y, buitenZ);
}

function maakDeur(naam, breedte, hoogte, x, y, zijde = 1) {
  const buitenZ = zijde === 1 ? buitenZVoor : buitenZAchter;
  const paneel = box("paneel", breedte - 0.08, hoogte - 0.08, 0.05, MAT.deur, 0, 0, zijde * 0.02);
  const kader = box("kader", breedte, hoogte, 0.04, MAT.kozijnwit, 0, 0, 0);
  const kruk = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), MAT.zonnepaneelframe);
  kruk.position.set(breedte * 0.28, 0, zijde * 0.06);
  return groep(naam, [kader, paneel, kruk], x, y, buitenZ + zijde * 0.03);
}

// Vloerhoogtes van de twee bouwlagen (lokale y, WALLTOP-relatief):
// begane grond loopt van -WALLTOP tot -WALLTOP+VERDIEPING_HOOGTE,
// eerste verdieping van daar tot WALLTOP.
const BG_VLOER = -WALLTOP;
const V1_VLOER = -WALLTOP + VERDIEPING_HOOGTE;

const raamdorpelData = [];
function maakDorpel(x, breedte, onderkantY, zijde) {
  const buitenZ = (zijde === 1 ? buitenZVoor : buitenZAchter) + zijde * 0.06;
  return box("dorpel", breedte + 0.1, 0.05, 0.1, MAT.beton, x, onderkantY - 0.03, buitenZ);
}

// Raam met de ONDERKANT op een gekozen hoogte boven de vloer.
function raamOpVloer(naam, breedte, hoogte, x, vloerY, borstwering, zijde, kozijnNaam) {
  const y = vloerY + borstwering + hoogte / 2;
  raamdorpelData.push(maakDorpel(x, breedte, y - hoogte / 2, zijde));
  return maakRaam(naam, breedte, hoogte, x, y, zijde, kozijnNaam);
}

// Voorgevel van 7,2 m: erker-breed woonkamerraam op +x (kant die het meest
// frontaal in beeld komt), voordeur met zijlicht op -x, drie ramen boven.
const raamVoor01 = raamOpVloer("Raam_voor_01", 2.60, 1.70, 1.70, BG_VLOER, 0.85, 1, "Kozijn_voor_01");
const raamVoor02 = raamOpVloer("Raam_voor_02", 1.50, 1.40, 1.70, V1_VLOER, 0.90, 1, "Kozijn_voor_02");
const raamVoor03 = raamOpVloer("Raam_voor_03", 1.20, 1.40, -0.60, V1_VLOER, 0.90, 1, "Kozijn_voor_03");
const raamVoor04 = raamOpVloer("Raam_voor_04", 0.90, 1.40, -2.60, V1_VLOER, 0.90, 1, "Kozijn_voor_04");
const raamVoor05 = raamOpVloer("Raam_voor_05", 0.60, 1.60, -1.55, BG_VLOER, 0.90, 1, "Kozijn_voor_05");

const voordeur = maakDeur("Voordeur", 1.00, 2.15, -2.60, BG_VLOER + 2.15 / 2, 1);
const deurdorpel = box("Deurdorpel", 1.00 + 0.10, 0.04, 0.14, MAT.beton, -2.60, BG_VLOER - 0.02, buitenZVoor + 0.07);

// Achtergevel: brede tuindeuren ("Achterdeur" is de naam die de
// explode-stap voor deuren herkent) plus ramen op beide lagen.
const achterdeur = maakDeur("Achterdeur", 2.40, 2.20, 0.80, BG_VLOER + 2.20 / 2, -1);
const raamAchter01 = raamOpVloer("Raam_achter_01", 1.50, 1.40, -1.40, V1_VLOER, 0.90, -1, "Kozijn_achter_01");
const raamAchter02 = raamOpVloer("Raam_achter_02", 1.20, 1.40, 1.60, V1_VLOER, 0.90, -1, "Kozijn_achter_02");
const raamAchter03 = raamOpVloer("Raam_achter_03", 1.40, 1.55, -2.10, BG_VLOER, 0.90, -1, "Kozijn_achter_03");

// Vrije linker zijgevel: deze woning staat aan alle kanten vrij, dus daar
// horen ramen in. Ze zitten in het kopgevelvlak (x-vlak) en schuiven met
// die gevel mee naar buiten.
const ZIJGEVEL_LINKS_X = -(MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01);
function maakZijRaam(naam, breedte, hoogte, z, y, richtingX) {
  // Zelfde opbouw als maakRaam, maar dan in het x-vlak van de kopgevel.
  const stijl = 0.08;
  const negge = 0.12;
  const zij = Math.sign(richtingX);
  const buitenX = (zij < 0 ? ZIJGEVEL_LINKS_X : -ZIJGEVEL_LINKS_X) + zij * 0.005;
  const xKozijn = -zij * (negge / 2);
  const xGlas = -zij * (negge - 0.03);
  return groep(naam, [
    box("kozijn_boven", negge, stijl, breedte, MAT.kozijnwit, xKozijn, hoogte / 2 - stijl / 2, 0),
    box("kozijn_onder", negge, stijl, breedte, MAT.kozijnwit, xKozijn, -hoogte / 2 + stijl / 2, 0),
    box("kozijn_voor", negge, hoogte - stijl * 2, stijl, MAT.kozijnwit, xKozijn, 0, breedte / 2 - stijl / 2),
    box("kozijn_achter", negge, hoogte - stijl * 2, stijl, MAT.kozijnwit, xKozijn, 0, -breedte / 2 + stijl / 2),
    box("glas", 0.02, hoogte - stijl * 2, breedte - stijl * 2, MAT.glas, xGlas, 0, 0),
  ], buitenX, y, z);
}
const raamLinks01 = maakZijRaam("Raam_links_01", 1.40, 1.30, 1.60, BG_VLOER + 0.90 + 0.65, -1);
const raamLinks02 = maakZijRaam("Raam_links_02", 1.00, 1.20, 1.60, V1_VLOER + 0.90 + 0.60, -1);
const raamLinks03 = maakZijRaam("Raam_links_03", 0.80, 1.00, -1.80, V1_VLOER + 0.95 + 0.50, -1);

// Rechter zijgevel (garagezijde): boven het lage garagedak is die gevel wél
// vrij, dus daar past een raam. Het heet bewust NIET "Raam_..." maar
// "Zijraam_...": die gevel staat stil tijdens de explode (zie hierboven),
// en dan moet het raam ook stil blijven staan in plaats van los weg te
// vliegen door de garage heen.
const zijraamGarageZijde = maakZijRaam("Zijraam_boven_garage", 1.00, 1.20, -1.20, V1_VLOER + 0.90 + 0.60, 1);

const raamdorpels = groep("Raamdorpels", raamdorpelData);

// ============================================================
// 6. Plinten.
// ============================================================
const plintY = -WALLTOP + PLINT_HOOGTE / 2;
const plinten = groep("Plinten", [
  box("plint_voor", MUUR_BREEDTE + 0.05, PLINT_HOOGTE, 0.03, MAT.plint, 0, plintY, buitenZVoor + 0.02),
  box("plint_achter", MUUR_BREEDTE + 0.05, PLINT_HOOGTE, 0.03, MAT.plint, 0, plintY, buitenZAchter - 0.02),
  box("plint_links", 0.03, PLINT_HOOGTE, MUUR_DIEPTE + 0.05, MAT.plint, -(MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01) - 0.02, plintY, 0),
  // Aan de garagezijde loopt de plint alleen langs het stuk gevel dat vóór
  // de garage uitsteekt (de garage ligt 0,70 m terug); verder naar achteren
  // zou de plint in de garage steken.
  box("plint_rechts", 0.03, PLINT_HOOGTE, 0.72, MAT.plint, (MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01) + 0.02, plintY, buitenZVoor - 0.34),
]);

// Regenpijpen: 4 hoekpijpen.
const regenpijpen = new THREE.Group();
regenpijpen.name = "Regenpijpen";
const hoekX = MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
const hoekZ = MUUR_DIEPTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
// Alleen aan de linkerzijde: aan de rechterzijde staat de garage tegen de
// gevel aan, daar zou een regenpijp dwars door de garage lopen.
for (const x of [-hoekX]) {
  for (const z of [-hoekZ, hoekZ]) {
    const pijp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, MUUR_HOOGTE + 0.1, 10), MAT.dakgoot);
    pijp.position.set(x * 1.03, -0.05, z * 1.03);
    regenpijpen.add(pijp);
  }
}

// Dakgoot langs beide druiplijnen.
const dakgoot = groep("Dakgoot", [
  box("Dakgoot_voor", DAK_BREEDTE - 0.1, 0.06, 0.09, MAT.dakgoot, 0, WALLTOP - 0.02, HALF_DIEPTE_DAK - 0.02),
  box("Dakgoot_achter", DAK_BREEDTE - 0.1, 0.06, 0.09, MAT.dakgoot, 0, WALLTOP - 0.02, -(HALF_DIEPTE_DAK - 0.02)),
]);


// ============================================================
// 7. Garage (aangebouwd, rechts/+x van het hoofdvolume). Eén
//    top-level groep, geen losse explode-lagen (zie toelichting
//    hierboven bij GARAGE_*). Voorvlak vlak met de voorgevel van het
//    hoofdvolume, plat dak (prototypeaanname/vereenvoudiging).
// ============================================================
// De "Garage"-groep wordt geplaatst met zijn origin op vloerniveau
// (wereld-y = -WALLTOP, dezelfde vloerhoogte als het hoofdvolume), dus
// alle kinderen hieronder gebruiken LOKALE y-coördinaten vanaf 0 =
// vloerniveau (niet vanaf het wereld-nulpunt).
// Buitenvlak van de rechter kopgevel: hier sluit de garage exact op aan.
const GARAGE_AANSLUIT_X = MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
// De garage ligt bewust 0,70 m terug t.o.v. de voorgevel. Daardoor blijft
// de rechter kopgevel van het hoofdvolume aan de voorzijde vrij zichtbaar
// en leest de woning als vrijstaand met een lagere aanbouw ernaast.
const GARAGE_TERUGLIGGEND = 0.70;
const garageXCenter = GARAGE_AANSLUIT_X + GARAGE_BREEDTE / 2;
const garageZFront = buitenZVoor - GARAGE_TERUGLIGGEND;
const garageZCenter = garageZFront - GARAGE_DIEPTE / 2;
const garageMuurLokaalY = GARAGE_HOOGTE / 2;

const garageMuurAchter = box("garage_muur_achter", GARAGE_BREEDTE, GARAGE_HOOGTE, 0.12, MAT.baksteen, 0, garageMuurLokaalY, -GARAGE_DIEPTE / 2 + 0.06);
const garageMuurRechts = box("garage_muur_rechts", 0.12, GARAGE_HOOGTE, GARAGE_DIEPTE, MAT.baksteen, GARAGE_BREEDTE / 2 - 0.06, garageMuurLokaalY, 0);
const garageMuurVoorLinks = box("garage_muur_voor_links", 0.12, GARAGE_HOOGTE, 0.12, MAT.baksteen, -GARAGE_BREEDTE / 2 + 0.06, garageMuurLokaalY, GARAGE_DIEPTE / 2 - 0.06);
// Plat dak met overstek aan drie zijden; aan de huiszijde (-x) precies
// gelijk met de muur, zodat het dak niet door de kopgevel heen steekt.
const GARAGE_DAK_OVERSTEK = 0.16;
const garageDak = box("garage_dak", GARAGE_BREEDTE + GARAGE_DAK_OVERSTEK, 0.10, GARAGE_DIEPTE + GARAGE_DAK_OVERSTEK * 2, MAT.dakpannen, GARAGE_DAK_OVERSTEK / 2, GARAGE_HOOGTE + 0.05, 0);
// Daktrim langs de dakrand, zoals bij een plat garagedak gebruikelijk.
const garageDakrand = box("garage_dakrand", GARAGE_BREEDTE + GARAGE_DAK_OVERSTEK, 0.07, 0.05, MAT.dakgoot, GARAGE_DAK_OVERSTEK / 2, GARAGE_HOOGTE + 0.13, GARAGE_DIEPTE / 2 + GARAGE_DAK_OVERSTEK - 0.025);
// De deur was 0,50 m smaller dan de opening en 2,05 m hoog onder een dak op
// 2,85 m: daardoor stond er een open strook van 0,80 m boven de deur en 0,13 m
// naast de deur. De deur vult nu de volle opening en de strook erboven is
// dichtgemetseld, zodat de garage een gesloten bouwvolume is.
const garageDeur = box("Garagedeur", GARAGE_BREEDTE - 0.24, 2.05, 0.06, MAT.garagedeur, 0, 2.05 / 2, GARAGE_DIEPTE / 2 - 0.03);
const garageLatei = box("garage_voor_latei", GARAGE_BREEDTE, GARAGE_HOOGTE - 2.05, 0.12, MAT.baksteen, 0, (2.05 + GARAGE_HOOGTE) / 2, GARAGE_DIEPTE / 2 - 0.06);
const garage = groep("Garage", [garageMuurAchter, garageMuurRechts, garageMuurVoorLinks, garageDak, garageDakrand, garageDeur, garageLatei], garageXCenter, -WALLTOP, garageZCenter);

// --- Garagedak: 8 panelen in 2 kolommen x 4 rijen, met overal dezelfde
// tussenruimte en ruim binnen de dakrand (marge 0,25 m rondom). ---
const garageDakTopY = -WALLTOP + GARAGE_HOOGTE + 0.10;
const garageDakLinks = GARAGE_AANSLUIT_X + 0.25;
const garageDakRechts = garageXCenter + GARAGE_BREEDTE / 2 + GARAGE_DAK_OVERSTEK / 2 - 0.25;
const garagePaneelMidden = (garageDakLinks + garageDakRechts) / 2;
const garageRijStap = PANEEL_LENGTE + 0.30;   // ruimere rijafstand: gekantelde panelen mogen elkaar niet beschaduwen
const garageRijen = 3;
for (let rij = 0; rij < garageRijen; rij += 1) {
  const z = garageZCenter + (rij - (garageRijen - 1) / 2) * garageRijStap;
  for (const x of paneelKolommen(3, garagePaneelMidden)) {
    voegPaneelToe((naam) => maakPlatDakPaneel(naam, x, z, garageDakTopY));
  }
}

// ============================================================
// Dakkapel op het achterschild + panelen eromheen.
// De kap steekt door het dakvlak heen; het deel onder het dakvlak zit
// in de zolder en is niet zichtbaar. Onder- en bovenkant zijn afgeleid
// van de dakvlakformule, zodat er nooit een kier onder de dakkapel
// ontstaat en de bovenkant altijd boven de pannen uitkomt.
// ============================================================
const DAKKAPEL_BREEDTE = 2.4;
const DAKKAPEL_VOOR = 3.30;
const DAKKAPEL_ACHTER = 1.80;
const dakkapel = maakDakkapel("Dakkapel", -1, DAKKAPEL_BREEDTE, DAKKAPEL_VOOR, DAKKAPEL_ACHTER);

// --- Achterschild: gevuld rondom de dakkapel en de schoorsteen ---
vulDakvlakMetPanelen(-1, [
  dakkapelObstakel(DAKKAPEL_BREEDTE, DAKKAPEL_VOOR, DAKKAPEL_ACHTER),
  { x0: -0.48, x1: 0.48, s0: 0.42, s1: 0.92 },   // Schoorsteen_01 bij de nok
]);

// ============================================================
// Contextwoning op afstand: laat zien dat deze woning aan alle kanten
// vrij staat. Er zit ruim 2,4 m open ruimte tussen beide woningen.
// ============================================================
// Positie empirisch bepaald op het camerastandpunt van de hero (die kijkt
// van rechtsvoor). De woning staat naar voren EN naar links opgeschoven,
// want alleen dan valt de open ruimte ertussen ook in het beeldvlak; zou hij
// recht naast de woning staan, dan schuift zijn silhouet in dat van de
// hoofdwoning en lijkt hij aangebouwd. Hij is bovendien een halve bouwlaag
// lager, zodat de hoofdwoning het onderwerp blijft.
const buurwoningOpAfstand = maakContextWoning({
  naam: "Buurwoning_op_afstand",
  breedte: 4.6,
  diepte: 6.0,
  muurHoogte: 4.6,
  nokHoogte: 2.0,
  overstekGevel: 0.22,
  overstekDak: 0.28,
  vloerY: -WALLTOP,
  // De linker kopgevel schuift tijdens de explode tot x = -6,14; de
  // contextwoning begint pas op -7,3 en wordt dus niet geraakt.
  x: -9.0,
  z: 1.0,
});

// ============================================================
// 8. Installaties: warmtepomp binnen/buiten. Volgens de infographic
//    staat de buitenunit op maaiveld, naast de garage.
//    LET OP (les uit de hoekwoning-bugfix): de rechter kopgevel van
//    het hoofdvolume ligt hier PAL achter de garage — de garage steekt
//    verder naar +x uit dan die kopgevel. Zou de buitenunit tegen die
//    kopgevel gemonteerd worden (zoals bij de hoekwoning), dan zou hij
//    binnen de voetafdruk van de garage vallen en er half "in" hangen.
//    Daarom hier gemonteerd tegen de buitenkant van de GARAGE zelf
//    (rechterwand, verst van het huis) — met dezelfde 0,03 m
//    luchtspleet als bij de gecorrigeerde hoekwoning, dus gegarandeerd
//    vrij van elk muurvlak.
// ============================================================
// Buitenunit naast de garage, op maaiveld. De rechter kopgevel schuift
// tijdens de explode tot x = 4,29; de unit staat vanaf x = 4,60 en wordt
// dus door geen enkele wegvliegende gevel geraakt.
const garageBuitenXRechts = garageXCenter + GARAGE_BREEDTE / 2;
const warmtepompBuiten = maakWarmtepompDeWarmte("Warmtepomp_DeWarmte", garageBuitenXRechts + 0.42, -WALLTOP, garageZCenter + 1.9, Math.PI / 2);
const warmtepompBinnen = box("Warmtepomp_binnenunit", 0.7, 0.20, 0.18, MAT.warmtepomp, 0.6, -WALLTOP + VERDIEPING_HOOGTE + 0.55, buitenZAchter + 0.09);
// Thuisbatterij: naast de warmtepomp-buitenunit, tegen dezelfde garagewand,
// maar losstaand in z zodat de twee kasten elkaar nooit raken.
const thuisbatterij = maakThuisbatterij("Thuisbatterij", garageBuitenXRechts + 0.62, -WALLTOP, garageZCenter + 0.7);

// ============================================================
// Samenstellen
// ============================================================
const scene = new THREE.Scene();
scene.name = "GijsVrijstaandeWoning";
scene.add(
  fundering, vloerisolatie, vloerconstructie, vloer, vloerverwarming,
  ...gevelsVoorAchter, ...gevelsZijkanten,
  dakconstructie, dakisolatie, tengellatten, panlatten, dakpannen, dakgoot,
  schoorsteen01,
  ...zonnepanelen, dakkapel,
  verdiepingsvloer, zoldervloer,
  voordeur, raamVoor01, raamVoor02, raamVoor03, raamVoor04, raamVoor05,
  achterdeur, raamAchter01, raamAchter02, raamAchter03,
  raamLinks01, raamLinks02, raamLinks03, zijraamGarageZijde,
  raamdorpels, deurdorpel, plinten, regenpijpen,
  garage,
  warmtepompBuiten, warmtepompBinnen, thuisbatterij,
  buurwoningOpAfstand,
);

scene.updateMatrixWorld(true);
const box3 = new THREE.Box3().setFromObject(scene);
console.log("Bounding box:", box3.min, box3.max);

// ---------- Round-trip naamcontrole ----------
const gevonden = new Set();
scene.traverse((o) => { if (o.name) gevonden.add(o.name); });
const vereist = [
  "Buitengevel_voor", "Buitengevel_achter", "Buitengevel_links",
  "Spouwisolatie_voor", "Spouwisolatie_achter", "Spouwisolatie_links",
  "Binnenmuur_voor", "Binnenmuur_achter", "Binnenmuur_links",
  "Zijgevel_garage_buiten", "Zijgevel_garage_isolatie", "Zijgevel_garage_binnen",
  "Verdiepingsvloer", "Zoldervloer",
  "Dakpannen", "Panlatten", "Tengellatten", "Dakisolatie", "Dakconstructie", "Nok", "Dakgoot", "Windveren",
  "Schoorsteen_01",
  "Vloer", "Vloerisolatie", "Fundering", "Vloerconstructie", "Vloerverwarming", "Thuisbatterij",
  "Raam_voor_01", "Raam_voor_02", "Raam_voor_03", "Raam_voor_04", "Raam_voor_05",
  "Raam_achter_01", "Raam_achter_02", "Raam_achter_03",
  "Raam_links_01", "Raam_links_02", "Raam_links_03", "Zijraam_boven_garage",
  "Kozijn_voor_01", "Voordeur", "Achterdeur",
  "Zonnepaneel_01", "Zonnepaneel_03", "Zonnepaneel_12",
  "Warmtepomp_DeWarmte", "Warmtepomp_binnenunit", "Buurwoning_op_afstand", "Dakkapel",
  "Regenpijpen", "Raamdorpels", "Deurdorpel", "Plinten",
  "Garage", "Garagedeur",
];
const missend = vereist.filter((naam) => !gevonden.has(naam));
if (missend.length) {
  console.error("ONTBREKENDE VERPLICHTE NAMEN:", missend);
  process.exit(1);
}
console.log("Alle verplichte namen aanwezig. Totaal top-level scene children:", scene.children.length);

// ---------- Export ----------
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const buffer = Buffer.from(result);
    fs.writeFileSync(process.argv[2] || "gijs-vrijstaandewoning.glb", buffer);
    console.log("Geschreven:", buffer.length, "bytes");
  },
  (err) => { console.error("Export error:", err); process.exit(1); },
  { binary: true },
);
