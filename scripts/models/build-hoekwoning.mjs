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
// Minimale PNG-encoder + Canvas/OffscreenCanvas-polyfill, puur met
// Node's ingebouwde zlib (geen "canvas"-package nodig, geen netwerk
// vereist). GLTFExporter heeft dit nodig om een DataTexture (ons
// procedurele baksteenpatroon) als PNG in de GLB te bakken — in de
// browser doet de echte Canvas API dat, in kale Node bestaat die
// niet, dus dit levert precies genoeg van die API na om te werken.
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
// GIJS hoekwoning v3 — herbouw van het dak (echt hellend i.p.v.
// een platte doos), gecorrigeerde kozijnen/dorpels (per raam
// i.p.v. één groot overlappend paneel dat de ramen verborg), een
// gecorrigeerde aansluiting van de kopgevels op de vloer, en een
// minder oranje baksteenkleur. Zie het begeleidende bericht voor
// de volledige uitleg van wat v2 mis had en wat hier is aangepast.
// ============================================================

// ---------- Maatvoering (prototypeaanname waar geen bron is) ----------
// De vorige versie was één bouwlaag hoog (2,30 m tot de goot) op een
// grondvlak van 3,4 x 5,0 m. Dat leest niet als Nederlandse hoekwoning.
// Hieronder de gebruikelijke maatvoering van een rijwoning: twee volle
// woonlagen met een bruikbare zolder onder het zadeldak.
const MUUR_BREEDTE = 5.0;   // x, breedte van de voor-/achtergevel
const MUUR_DIEPTE = 7.4;    // z, diepte van de woning (links/rechts)
const VERDIEPING_HOOGTE = 2.6;
const MUUR_HOOGTE = VERDIEPING_HOOGTE * 2;  // gevelhoogte tot de gootlijn: twee bouwlagen
const WALLTOP = MUUR_HOOGTE / 2;

const DIKTE_BUITENGEVEL = 0.10;
const DIKTE_SPOUW = 0.05;
const DIKTE_BINNENMUUR = 0.12;

// Nok loopt langs x (over de breedte); het dak helt naar voor- en
// achtergevel toe. De kopgevels (links/rechts) zijn de gevels die
// tot aan de nok doorlopen (herkenbaar puntdak-silhouet vanaf de
// zijkant, vlakke gootlijn aan voor- en achterkant).
const NOK_HOOGTE = 2.2;   // kap hoog genoeg voor een bruikbare zolder
const OVERSTEK_GEVEL = 0.25; // overstek aan de kopgevel-kant (x)
const OVERSTEK_DAK = 0.32;  // overstek aan de druiplijn voor/achter (z)
const HALF_SPAN_NOK = MUUR_BREEDTE / 2 + OVERSTEK_GEVEL;
const HALF_DIEPTE_DAK = MUUR_DIEPTE / 2 + OVERSTEK_DAK;
const NOK_Y = WALLTOP + NOK_HOOGTE;
const DAK_HOEK = Math.atan2(NOK_HOOGTE, HALF_DIEPTE_DAK); // ~31° — herkenbaar zadeldak, niet te steil

const DAKCONSTRUCTIE_DIKTE = 0.16;
const DAKBESCHOT_DIKTE = 0.05;
const DAKISOLATIE_DIKTE = 0.12;
const TENGELLAT_DIKTE = 0.03;
const PANLAT_DIKTE = 0.025;
const DAKPANNEN_DIKTE = 0.06;

const PLINT_HOOGTE = 0.16;

// ---------- Kleuren ----------
const KLEUR = {
  baksteen: 0x9a5c42,        // getemperd roodbruin baksteen (minder oranje/verzadigd dan v2)
  spouwisolatie: 0xe7dcb4,
  binnenmuur: 0x8f9089,
  beton: 0x9a9b98,
  dakconstructie: 0x7c6a4d,
  dakbeschot: 0x6b5738,      // duidelijk kouder/donkerder houtbruin (multiplex-achtig) i.p.v. bijna-dezelfde tint als dakisolatie hieronder — dat gaf de indruk van "twee lagen isolatie"
  dakisolatie: 0xdcbb8d,
  tengellat: 0x5b4c36,
  dakpannen: 0x33383b,       // donker antraciet
  nok: 0x2c3134,
  windveer: 0xf2f1ec,
  dakgoot: 0xefeee9,
  kozijnwit: 0xf2f1ec,
  glas: 0xbfe0ea,
  deur: 0x1f4a3d,            // GIJS donkergroen-achtig, prototypeaanname
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

// Eenvoudig, procedureel baksteenpatroon (geen los textuurbestand nodig)
// i.p.v. een vlakke kleur — dit is wat de vlakke, "plastic" indruk van
// v3/v4 moet verhelpen. Halfsteensverband: even rijen verschoven t.o.v.
// oneven rijen, met een lichte kleurvariatie per steen.
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
  texture.repeat.set(7, 7.4);  // ~0,70 m per herhaling op een gevel van 5,0 x 5,2 m
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

// De buurwoning krijgt een eigen, lichtere steenkleur en een andere voordeur.
// Zonder dat verschil lopen beide voorgevels visueel in elkaar over en lijken
// de twee voordeuren bij een en dezelfde woning te horen. De map wordt gedeeld,
// dus dit kost geen extra textuurgeheugen.
MAT.baksteenBuur = new THREE.MeshStandardMaterial({ map: MAT.baksteen.map, color: 0xc9a894, roughness: 0.92, metalness: 0.02 });
MAT.deurBuur = mat(0x6d4a35, { roughness: 0.5 });

// ---------- Generieke helpers ----------
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
// 1. Fundering + vloeropbouw (ongewijzigd t.o.v. v2, was niet het
//    probleem — vier losse lagen, elk apart benoemd/animeerbaar).
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
// 2. Gevelopbouw voor/achter: drie losse lagen (buitengevel /
//    spouwisolatie / binnenmuur), simpele platen — dit deel gaf
//    geen klachten, alleen de kleur is minder oranje gemaakt.
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
const buitenZVoor = MUUR_DIEPTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01; // buitenkant buitengevel_voor
const buitenZAchter = -buitenZVoor;

// ============================================================
// 3. Kopgevels links/rechts: puntgevel die doorloopt tot de nok
//    (herkenbaar vanaf de zijkant). BUG IN v2: de vorm werd vanaf
//    lokale y=0 (voet) getekend maar het object bleef op
//    position.y=0 staan, waardoor de wand ~1,15 los van de vloer
//    "zweefde". Hier tekenen we de vorm direct in wereld-y
//    (-WALLTOP tot NOK_Y), dus position.y=0 klopt meteen.
// ============================================================
// BUG (gevonden via live screenshot, niet via de bounding-box-check):
// de vorige versie liet de puntgevel recht omhoog lopen tot WALLTOP en
// dan pas hellen naar de nok — maar het echte dakvlak (met overstek
// OVERSTEK_DAK) bereikt WALLTOP pas verderop, bij HALF_DIEPTE_DAK, niet
// al bij de muurrand (halfDiepte). Daardoor hadden gevel en dak een
// andere hellingshoek en ontstond er een driehoekige kier langs de
// daklijn — zichtbaar als een beige/bruine streep (de isolatie/
// constructielaag die er doorheen scheen). Hier gebruiken we exact
// dezelfde hellingsformule als het dak, zodat de rand van de puntgevel
// precies op het dakvlak ligt, over de volle lengte.
function roofLijnHoogte(z) {
  return NOK_Y - (NOK_HOOGTE / HALF_DIEPTE_DAK) * Math.abs(z);
}

function maakKopgevelVorm(halfDiepte = MUUR_DIEPTE / 2) {
  const shape = new THREE.Shape();
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
// rechte gevels leverde dat een 5x te fijne baksteen op de vrije zijgevel op. Hier
// schalen we de UV's terug, zodat een steenrij op de kopgevel exact even
// groot is als op de voorgevel.
// ============================================================
const GEVEL_UV_SCHAAL = 1 / (0.714 * 7);
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

// De hoekwoning is aan de LINKERZIJDE (-x) aangebouwd aan de buurwoning.
// Daar zit bouwkundig geen spouwgevel met buitenblad, maar één
// woningscheidende bouwmuur. Dat is niet alleen juister, het lost ook een
// animatieprobleem op: een gevellaag die daar naar buiten zou vliegen,
// verdwijnt onzichtbaar ín de (statische) buurwoning. "Bouwmuur_links"
// komt in movement() niet voor en blijft dus staan.
const BUITENVLAK_X = MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
const BOUWMUUR_DIKTE = DIKTE_BINNENMUUR + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
const gevelsZijkanten = [
  maakKopgevelLaag("Binnenmuur_rechts", DIKTE_BINNENMUUR, MUUR_BREEDTE / 2 - DIKTE_BINNENMUUR / 2, MAT.binnenmuur),
  maakKopgevelLaag("Spouwisolatie_rechts", DIKTE_SPOUW, MUUR_BREEDTE / 2 + DIKTE_SPOUW / 2 - 0.005, MAT.spouwisolatie),
  maakKopgevelLaag("Buitengevel_rechts", DIKTE_BUITENGEVEL, MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL / 2 - 0.01, MAT.baksteen),
  maakKopgevelLaag("Bouwmuur_links", BOUWMUUR_DIKTE, -(BUITENVLAK_X - BOUWMUUR_DIKTE / 2), MAT.bouwmuur),
];

// ============================================================
// 4. Dakvlak-wiskunde (vectorbased, geen handmatige sin/cos-tekens
//    die fout kunnen gaan): een punt/normaal op het hellende vlak
//    voor een gegeven kant (+1 voor, -1 achter), fractie t (0 =
//    nok, 1 = druiplijn) en zijwaartse positie x.
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

// Eén dakschild (voor- of achterkant) als platte plaat die exact
// tussen nok en druiplijn ligt, met een naar-buiten-uitstand voor
// geneste lagen (constructie binnenin, pannen buitenop).
function maakDakSchild(zijde, breedte, dikte, uitstand, materiaal, xCenter = 0, extraLengte = 0) {
  const { punt: nokPunt, richting } = dakvlakPunt(zijde, 0, xCenter, uitstand);
  const { punt: druipPunt } = dakvlakPunt(zijde, 1, xCenter, uitstand);
  const lengte = nokPunt.distanceTo(druipPunt) + extraLengte;
  const midden = new THREE.Vector3().addVectors(nokPunt, druipPunt).multiplyScalar(0.5);
  // Bij extra lengte (pannen-overstek voorbij de druiplijn) schuift het
  // midden iets mee in de hellingsrichting.
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
// (Dakbeschot_voor/achter zitten genest in Dakconstructie — findbaar
// bij naam via scene.traverse, geen apart top-level object nodig.)

const dakisolatie = maakDakLaagGroep("Dakisolatie", DAKISOLATIE_DIKTE, uitIsolatie, DAK_BREEDTE - 0.15, MAT.dakisolatie);

// Tengellatten/panlatten: dun en vooral aanwezig/vindbaar bij naam,
// geen fijne losse latjes (dat zou de geometrie onnodig zwaar maken).
const tengellatten = groep("Tengellatten", [
  maakDakSchild(1, DAK_BREEDTE - 0.2, TENGELLAT_DIKTE, uitTengellat, MAT.tengellat, 0),
  maakDakSchild(-1, DAK_BREEDTE - 0.2, TENGELLAT_DIKTE, uitTengellat, MAT.tengellat, 0),
]);
const panlatten = groep("Panlatten", [
  maakDakSchild(1, DAK_BREEDTE - 0.2, PANLAT_DIKTE, uitPanlat, MAT.tengellat, 0),
  maakDakSchild(-1, DAK_BREEDTE - 0.2, PANLAT_DIKTE, uitPanlat, MAT.tengellat, 0),
]);

const dakpannen = maakDakLaagGroep("Dakpannen", DAKPANNEN_DIKTE, uitPannen, DAK_BREEDTE + 0.16, MAT.dakpannen, 0.18);

// Nok (vorstpan) — dunne balk precies op de noklijn, bovenop de pannen.
// De nokvorst lag op NOK_Y + uitPannen * 0,55 en verdween daarmee 0,22 m
// ONDER het punt waar de twee pannenvlakken samenkomen: de nok had dus
// helemaal geen zichtbare afwerking. Hij ligt nu op dat snijpunt (net iets
// verzonken zodat hij in de pannen bedt) en is breder dan het dakvlak, zodat
// hij ook de bovenkant van de windveren afdekt.
const nok = box("Nok", DAK_BREEDTE + 0.10, 0.18, 0.50, MAT.nok, 0, NOK_Y + uitPannen / Math.cos(Math.atan2(NOK_HOOGTE, HALF_DIEPTE_DAK)) - 0.02, 0);
dakpannen.add(nok);

// Windveren: witte boeiboorden langs de twee schuine daklijnen aan
// weerszijden (kopgevel-kant) — geeft het silhouet een duidelijke,
// herkenbare rand i.p.v. een kale donkere dakrand.
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
// Alleen aan de VRIJE kopgevel (+x): aan de aangebouwde zijde loopt het
// dak door over de buurwoning, daar hoort geen boeiboord.
const windveren = groep("Windveren", [
  maakWindveer(1, HALF_SPAN_NOK), maakWindveer(-1, HALF_SPAN_NOK),
]);
dakpannen.add(windveren);

// Dakdoorvoeren: kleine ventilatiepijpjes door het voorschild.
const dakdoorvoeren = new THREE.Group();
dakdoorvoeren.name = "Dakdoorvoeren";
// Op het ACHTERschild (zijde -1): op het voorschild ligt het
// zonnepanelenveld, daar mag niets doorheen steken.
for (const x of [-1.0]) {
  const { punt, normaal } = dakvlakPunt(-1, 0.5, x, uitPannen);
  const pijp = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.30, 10), MAT.nok);
  pijp.position.copy(punt).addScaledVector(normaal, 0.10);
  pijp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normaal);
  dakdoorvoeren.add(pijp);
}
dakpannen.add(dakdoorvoeren);

// Dakgoot: langs beide druiplijnen (voor en achter).
const dakgoot = groep("Dakgoot", [
  box("Dakgoot_voor", DAK_BREEDTE - 0.1, 0.06, 0.09, MAT.dakgoot, 0, WALLTOP - 0.02, HALF_DIEPTE_DAK - 0.02),
  box("Dakgoot_achter", DAK_BREEDTE - 0.1, 0.06, 0.09, MAT.dakgoot, 0, WALLTOP - 0.02, -(HALF_DIEPTE_DAK - 0.02)),
]);


// Schoorstenen: doorboren het achterschild dicht bij de nok, staan
// verticaal (gebruikelijk voor een schoorsteen, ook op een hellend
// dak) — positie via dakvlakPunt, dus altijd correct op het nieuwe
// dakvlak i.p.v. de losse aanname uit v2.
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
const schoorsteen01 = maakSchoorsteen("Schoorsteen_01", -1.60, 0.25, 0.44, 0.85);
const schoorsteen02 = maakSchoorsteen("Schoorsteen_02", -1.60, 0.46, 0.30, 0.55);


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

// De dakkapel zit op het VOORschild, want dat is het dakvlak dat vanaf de
// straat (en in de hero) zichtbaar is; een dakkapel aan de achterkant zou
// je nooit zien. De panelen liggen om de dakkapel heen op het voorschild
// en vullen daarnaast het hele achterschild, met de schoorstenen en
// dakdoorvoeren als obstakels. Zo blijft geen dakvlak onnodig leeg.
const DAKKAPEL_BREEDTE = 1.7;
const DAKKAPEL_VOOR = 3.05;
const DAKKAPEL_ACHTER = 1.70;
const dakkapel = maakDakkapel("Dakkapel", 1, DAKKAPEL_BREEDTE, DAKKAPEL_VOOR, DAKKAPEL_ACHTER);

vulDakvlakMetPanelen(1, [dakkapelObstakel(DAKKAPEL_BREEDTE, DAKKAPEL_VOOR, DAKKAPEL_ACHTER)]);
vulDakvlakMetPanelen(-1, [
  { x0: -2.07, x1: -1.13, s0: 0.68, s1: 1.62 },   // Schoorsteen_01 + werkruimte eromheen
  { x0: -2.00, x1: -1.20, s0: 1.71, s1: 2.51 },   // Schoorsteen_02
  { x0: -1.45, x1: -0.55, s0: 1.12, s1: 1.63 },   // dakdoorvoer
]);


// ============================================================
// 5. Ramen, kozijnen, deuren — BUG IN v2: "Kozijnen_voor" en
//    "Raamdorpels" waren elk ÉÉN grote plaat die vrijwel de hele
//    gevel met alle ramen tegelijk overlapte, waardoor ze de ramen
//    en de voordeur aan het zicht onttrokken (z-fighting/overlap).
//    Hier krijgt elk raam zijn EIGEN kleine kozijn+dorpel, precies
//    op maat van dat raam.
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

// Voorgevel: vaste, expliciete posities per opening. De indeling volgt nu
// TWEE woonlagen. Vloerniveaus (wereld-y): begane grond op -WALLTOP,
// eerste verdieping op -WALLTOP + VERDIEPING_HOOGTE, zolder op WALLTOP.
const raamdorpelData = [];
function maakDorpel(x, breedte, onderkantY, zijde) {
  const buitenZ = (zijde === 1 ? buitenZVoor : buitenZAchter) + zijde * 0.06;
  return box("dorpel", breedte + 0.1, 0.05, 0.1, MAT.beton, x, onderkantY - 0.03, buitenZ);
}

const BG_VLOER = -WALLTOP;
const V1_VLOER = -WALLTOP + VERDIEPING_HOOGTE;

// Raam met de ONDERKANT op een gekozen hoogte boven de vloer — dat is hoe
// je een gevelindeling leest, en het voorkomt de fragiele middenhoogtes
// van de vorige versie.
function raamOpVloer(naam, breedte, hoogte, x, vloerY, borstwering, zijde, kozijnNaam) {
  const y = vloerY + borstwering + hoogte / 2;
  raamdorpelData.push(maakDorpel(x, breedte, y - hoogte / 2, zijde));
  return maakRaam(naam, breedte, hoogte, x, y, zijde, kozijnNaam);
}

// Camera staat op +x/+z: de +x-kant van de voorgevel komt het meest
// frontaal in beeld. Het grote woonkamerraam hoort daarom op +x.
const raamVoor01 = raamOpVloer("Raam_voor_01", 2.10, 1.60, 1.10, BG_VLOER, 0.85, 1, "Kozijn_voor_01");
const raamVoor02 = raamOpVloer("Raam_voor_02", 1.30, 1.35, 1.35, V1_VLOER, 0.90, 1, "Kozijn_voor_02");
const raamVoor03 = raamOpVloer("Raam_voor_03", 1.00, 1.35, -0.65, V1_VLOER, 0.90, 1, "Kozijn_voor_03");
const raamVoor04 = raamOpVloer("Raam_voor_04", 0.45, 1.05, -1.85, V1_VLOER, 1.20, 1, "Kozijn_voor_04");

const voordeur = maakDeur("Voordeur", 0.95, 2.10, -1.55, BG_VLOER + 2.10 / 2, 1);
const deurdorpel = box("Deurdorpel", 0.95 + 0.10, 0.04, 0.14, MAT.beton, -1.55, BG_VLOER - 0.02, buitenZVoor + 0.07);

// Achtergevel: tuindeuren op de begane grond, twee slaapkamerramen boven.
const achterdeur = maakDeur("Achterdeur", 1.80, 2.15, 0.30, BG_VLOER + 2.15 / 2, -1);
const raamAchter01 = raamOpVloer("Raam_achter_01", 1.30, 1.35, -0.90, V1_VLOER, 0.90, -1, "Kozijn_achter_01");
const raamAchter02 = raamOpVloer("Raam_achter_02", 1.00, 1.35, 1.00, V1_VLOER, 0.90, -1, "Kozijn_achter_02");

// Vrije zijgevel (+x): juist die gevel maakt zichtbaar dat dit een
// HOEKwoning is, dus daar horen ramen in. Ze zitten in het kopgevelvlak,
// dus met een eigen helper op het x-vlak i.p.v. het z-vlak.
const ZIJGEVEL_BUITEN_X = MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
function maakZijRaam(naam, breedte, hoogte, z, y) {
  // Zelfde opbouw als maakRaam, maar dan in het x-vlak van de kopgevel.
  const stijl = 0.08;
  const negge = 0.12;
  return groep(naam, [
    box("kozijn_boven", negge, stijl, breedte, MAT.kozijnwit, -negge / 2 + 0.005, hoogte / 2 - stijl / 2, 0),
    box("kozijn_onder", negge, stijl, breedte, MAT.kozijnwit, -negge / 2 + 0.005, -hoogte / 2 + stijl / 2, 0),
    box("kozijn_voor", negge, hoogte - stijl * 2, stijl, MAT.kozijnwit, -negge / 2 + 0.005, 0, breedte / 2 - stijl / 2),
    box("kozijn_achter", negge, hoogte - stijl * 2, stijl, MAT.kozijnwit, -negge / 2 + 0.005, 0, -breedte / 2 + stijl / 2),
    box("glas", 0.02, hoogte - stijl * 2, breedte - stijl * 2, MAT.glas, -negge + 0.035, 0, 0),
  ], ZIJGEVEL_BUITEN_X + 0.005, y, z);
}
const raamRechts01 = maakZijRaam("Raam_rechts_01", 1.10, 1.20, 1.30, BG_VLOER + 0.95 + 0.60);
const raamRechts02 = maakZijRaam("Raam_rechts_02", 0.90, 1.10, 1.30, V1_VLOER + 0.95 + 0.55);
const raamRechts03 = maakZijRaam("Raam_rechts_03", 0.70, 0.80, -1.40, BG_VLOER + 1.10 + 0.40);

const raamdorpels = groep("Raamdorpels", raamdorpelData);

// ============================================================
// 6. Plinten: dunne plint rondom de voet van de gevel (BUG IN v2:
//    was één blok halverwege de gevelhoogte i.p.v. bij de voet).
// ============================================================
const plintY = -WALLTOP + PLINT_HOOGTE / 2;
const plinten = groep("Plinten", [
  box("plint_voor", MUUR_BREEDTE + 0.05, PLINT_HOOGTE, 0.03, MAT.plint, 0, plintY, buitenZVoor + 0.02),
  box("plint_achter", MUUR_BREEDTE + 0.05, PLINT_HOOGTE, 0.03, MAT.plint, 0, plintY, buitenZAchter - 0.02),
  // Geen plint aan de bouwmuurzijde: daar staat de buurwoning tegenaan,
  // de plint zou daar ín dat volume zitten.
  box("plint_rechts", 0.03, PLINT_HOOGTE, MUUR_DIEPTE + 0.05, MAT.plint, (MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01) + 0.02, plintY, 0),
]);

// Regenpijpen: 4 hoekpijpen i.p.v. 1.
const regenpijpen = new THREE.Group();
regenpijpen.name = "Regenpijpen";
const hoekX = MUUR_BREEDTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
const hoekZ = MUUR_DIEPTE / 2 + DIKTE_SPOUW + DIKTE_BUITENGEVEL - 0.01;
// Alleen aan de vrije kopgevel (+x): aan de bouwmuurzijde staat de
// buurwoning tegenaan, daar zou een pijp ín dat volume zitten.
for (const x of [hoekX]) {
  for (const z of [-hoekZ, hoekZ]) {
    const pijp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, MUUR_HOOGTE + 0.1, 10), MAT.dakgoot);
    pijp.position.set(x * 1.03, -0.05, z * 1.03);
    regenpijpen.add(pijp);
  }
}

// ============================================================
// 7. Installaties: warmtepomp binnen/buiten.
//    BUG (gevonden via live screenshot, ook tijdens scrollen): de
//    buitenunit stond op x=1.55, wat numeriek binnen de dikte van
//    Buitengevel_rechts valt (die kopgevel-buitenmuur loopt van
//    x≈1.74 tot x≈1.84 bij MUUR_BREEDTE/2+DIKTE_SPOUW+DIKTE_BUITENGEVEL),
//    en de unit (breedte 0.78, dus x-bereik 1.16–1.94) overlapte die
//    muur dus gedeeltelijk — vandaar dat hij "in de muur verdween".
//    Hier hangt de buitenunit i.p.v. tegen de kopgevel (rechts) nu
//    tegen de achtergevel, net als de binnenunit (die daar al wél
//    correct tegen de binnenkant hangt) — met dezelfde y-hoogte als
//    voorheen, en een kleine 0,03 m luchtspleet buiten het buitenoppervlak
//    van Buitengevel_achter (buitenZAchter ≈ -2,64) zodat hij duidelijk
//    "voor" de muur hangt i.p.v. erin te steken.
// ============================================================
// De buitenunit staat aan de VRIJE zijde (+x), net achter de kopgevel.
// Die plek is bewust gekozen: de kopgevel-plaat schuift tijdens de
// explode langs z tot -2,50 en de achtergevel beweegt alleen over
// x -1,70..1,70, dus op z = -3,05 / x = 2,15 wordt de unit door geen
// enkele wegvliegende gevel geraakt en blijft hij altijd zichtbaar.
const warmtepompBuiten = maakWarmtepompDeWarmte("Warmtepomp_DeWarmte", 2.95, -WALLTOP, -4.30, Math.PI / 2);
// x van 0,6 naar 2,0: op 0,6 stond de unit precies achter Raam_achter_02,
// en sinds de kozijnen een echte negge hebben stak dat kozijn erin.
const warmtepompBinnen = box("Warmtepomp_binnenunit", 0.7, 0.20, 0.18, MAT.warmtepomp, 2.0, -WALLTOP + VERDIEPING_HOOGTE + 0.90, buitenZAchter + 0.09);
// Thuisbatterij: zelfde vrije, ongebruikte zone als de warmtepomp-buitenunit
// (x buiten het bereik -1,70..1,70 waarover de achtergevel explodeert),
// maar los ernaast in x zodat de twee kasten elkaar nooit raken.
const thuisbatterij = maakThuisbatterij("Thuisbatterij", 2.20, -WALLTOP, -4.30);

// ============================================================
// Aangrenzende rijwoning aan de bouwmuurzijde (-x). Sluit exact aan op
// het buitenvlak van de bouwmuur en op het dakoverstek van de
// hoekwoning, zodat gevel- en daklijn doorlopen en er geen overlappende
// dakvlakken ontstaan. Iets smaller dan de hoekwoning zelf, zodat hij
// binnen het camerabeeld valt en de hoekwoning het onderwerp blijft
// (prototypeaanname).
// ============================================================
const BUUR_BREEDTE = 4.2;
const buurMiddenX = -BUITENVLAK_X - BUUR_BREEDTE / 2;
const buurDakRechts = -(HALF_SPAN_NOK + 0.08); // sluit exact aan op onze pannen i.p.v. erover te liggen
const buurDakLinks = buurMiddenX - BUUR_BREEDTE / 2 - OVERSTEK_GEVEL;
const buurDakBreedte = buurDakRechts - buurDakLinks;
const buurDakX = (buurDakRechts + buurDakLinks) / 2;

const buurwoning = new THREE.Group();
buurwoning.name = "Buurwoning_rij";
{
  const shape = maakKopgevelVorm(buitenZVoor);
  const geo = schaalGevelUV(new THREE.ExtrudeGeometry(shape, { depth: BUUR_BREEDTE, bevelEnabled: false, curveSegments: 1 }));
  geo.translate(0, 0, -BUUR_BREEDTE / 2);
  geo.rotateY(Math.PI / 2);
  const romp = new THREE.Mesh(geo, MAT.baksteenBuur);
  romp.name = "buur_romp";
  romp.position.set(buurMiddenX, 0, 0);
  buurwoning.add(romp);

  for (const zijde of [1, -1]) {
    const schild = maakDakSchild(zijde, buurDakBreedte, DAKPANNEN_DIKTE, uitPannen, MAT.dakpannen, buurDakX, 0.18);
    schild.name = `buur_dakschild_${zijde === 1 ? "voor" : "achter"}`;
    buurwoning.add(schild);
    buurwoning.add(box(`buur_goot_${zijde === 1 ? "voor" : "achter"}`, buurDakBreedte - 0.06, 0.06, 0.09, MAT.dakgoot, buurDakX, WALLTOP - 0.02, zijde * (HALF_DIEPTE_DAK - 0.02)));
  }
  buurwoning.add(box("buur_nok", buurDakBreedte, 0.18, 0.50, MAT.nok, buurDakX, NOK_Y + uitPannen / Math.cos(Math.atan2(NOK_HOOGTE, HALF_DIEPTE_DAK)) - 0.02, 0));
  buurwoning.add(maakWindveer(1, buurDakLinks), maakWindveer(-1, buurDakLinks));

  // Voorgevel van de buurwoning: deur + twee ramen, in dezelfde stijl.
  const buurGevelZ = buitenZVoor + 0.03;
  buurwoning.add(box("buur_deurkader", 1.03, 2.18, 0.03, MAT.kozijnwit, buurMiddenX + 1.35, -WALLTOP + 1.09, buurGevelZ - 0.012));
  buurwoning.add(box("buur_deur", 0.95, 2.10, 0.05, MAT.deurBuur, buurMiddenX + 1.35, -WALLTOP + 1.05, buurGevelZ));
  for (const [rx, ry, rb, rh] of [
    [buurMiddenX - 0.75, -WALLTOP + 1.65, 2.10, 1.60],
    [buurMiddenX - 0.55, -WALLTOP + VERDIEPING_HOOGTE + 1.575, 1.30, 1.35],
    [buurMiddenX + 1.35, -WALLTOP + VERDIEPING_HOOGTE + 1.575, 1.00, 1.35],
  ]) {
    buurwoning.add(box("buur_kozijn", rb, rh, 0.04, MAT.kozijnwit, rx, ry, buurGevelZ));
    buurwoning.add(box("buur_glas", rb - 0.14, rh - 0.14, 0.02, MAT.glas, rx, ry, buurGevelZ + 0.02));
  }
  buurwoning.add(box("buur_plint", BUUR_BREEDTE, PLINT_HOOGTE, 0.03, MAT.plint, buurMiddenX, -WALLTOP + PLINT_HOOGTE / 2, buitenZVoor + 0.02));
}

// ============================================================
// Samenstellen
// ============================================================
const scene = new THREE.Scene();
scene.name = "GijsHoekwoning";
scene.add(
  fundering, vloerisolatie, vloerconstructie, vloer, vloerverwarming,
  ...gevelsVoorAchter, ...gevelsZijkanten,
  dakconstructie, dakisolatie, tengellatten, panlatten, dakpannen, dakgoot,
  schoorsteen01, schoorsteen02,
  ...zonnepanelen,
  verdiepingsvloer, zoldervloer, dakkapel,
  raamVoor01, raamVoor02, raamVoor03, raamVoor04, voordeur,
  raamAchter01, raamAchter02, achterdeur,
  raamRechts01, raamRechts02, raamRechts03,
  raamdorpels, deurdorpel, plinten, regenpijpen,
  warmtepompBuiten, warmtepompBinnen, thuisbatterij,
  buurwoning,
);

scene.updateMatrixWorld(true);
const box3 = new THREE.Box3().setFromObject(scene);
console.log("Bounding box:", box3.min, box3.max);

// ---------- Round-trip naamcontrole ----------
const gevonden = new Set();
scene.traverse((o) => { if (o.name) gevonden.add(o.name); });
const vereist = [
  "Buitengevel_voor", "Buitengevel_achter", "Buitengevel_rechts", "Bouwmuur_links",
  "Spouwisolatie_voor", "Spouwisolatie_achter", "Spouwisolatie_rechts",
  "Binnenmuur_voor", "Binnenmuur_achter", "Binnenmuur_rechts",
  "Dakpannen", "Panlatten", "Tengellatten", "Dakisolatie", "Dakconstructie", "Nok", "Dakgoot", "Windveren",
  "Schoorsteen_01", "Schoorsteen_02", "Dakdoorvoeren",
  "Vloer", "Vloerisolatie", "Fundering", "Vloerconstructie", "Vloerverwarming", "Thuisbatterij",
  "Raam_voor_01", "Raam_voor_02", "Raam_voor_03", "Raam_voor_04",
  "Raam_achter_01", "Raam_achter_02", "Raam_rechts_01", "Raam_rechts_02", "Raam_rechts_03",
  "Verdiepingsvloer", "Zoldervloer", "Dakkapel",
  "Kozijn_voor_01", "Voordeur", "Achterdeur",
  "Zonnepaneel_01", "Zonnepaneel_02", "Zonnepaneel_03", "Zonnepaneel_04",
  "Warmtepomp_DeWarmte", "Warmtepomp_binnenunit", "Buurwoning_rij",
  "Regenpijpen", "Raamdorpels", "Deurdorpel", "Plinten",
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
    fs.writeFileSync(process.argv[2] || "gijs-hoekwoning.glb", buffer);
    console.log("Geschreven:", buffer.length, "bytes");
  },
  (err) => { console.error("Export error:", err); process.exit(1); },
  { binary: true },
);
