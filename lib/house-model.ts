import { Box3, BoxGeometry, Group, Matrix4, Mesh, MeshStandardMaterial, Object3D, Vector3, type Material } from "three";
import { baseHouseType, HOUSE_PROPORTIONS, type HouseType } from "./woning-types";
import { applyAttachedVariant } from "./house-variants";
import { updateCornerFacade, openDetachedWindows } from "./house-facades";
import { updateDetachedFacade, distinguishDoors, addDormerPanels, finishDetachedHouse, addPlasticProfiles, openPlintBijDeuren, addGevelbekleding, addLuifel, addAanbouw } from "./house-details";

// Work on an independent clone: neither animations nor highlights may mutate the loader cache.
export function prepareHouse(source: Group, type: HouseType, scan = false, hoekZijde?: "Links" | "Rechts") {
  const requestedType=type;
  type=baseHouseType(type);
  const scene = source.clone(true);
  // Rijwoningen (hoek- en tussenwoning) krijgen Nederlandse materialen en details naar referentiefoto's.
  scene.userData.nlRij = type === "hoekwoning";
  // Vrijstaand en twee-onder-een-kap: eigen stijl naar de referentiefoto's (zandkleurige steen, houten topgevel).
  scene.userData.nlVrij = type === "vrijstaand";
  // Elk woningtype een eigen uitstraling naar de referentiefoto's (zie STIJLEN in house-realism.ts).
  scene.userData.stijl = requestedType;
  scene.traverse(object => {
    if ((object as Mesh).isMesh) {
      const mesh = object as Mesh;
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone();
    }
  });
  // Dakopbouw zoals het hoort: isolatie tegen de binnenkant van het dak, daaronder witte gipsplaten,
  // en boven de isolatie één laag latten in plaats van twee.
  const tengellatten = scene.getObjectByName("Tengellatten");
  if (tengellatten) { disposeHouse(tengellatten); tengellatten.removeFromParent(); }
  voegGipsplatenToe(scene);
  scene.updateMatrixWorld(true);
  const facade = scene.getObjectByName("Buitengevel_voor") as Mesh | undefined;
  const brick = facade?.material;
  for (const root of scene.children) {
    if (root.name.startsWith("Schoorsteen")) root.traverse(part => {
      if ((part as Mesh).isMesh && part.name.startsWith("schacht") && brick && !Array.isArray(brick)) {
        const mesh = part as Mesh;
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.dispose();
        mesh.material = brick.clone();
      }
    });
  }

  // Thuisbatterij: Gijs plaatst de Sigenergy SigenStor. Die is wit met
  // lichtgrijze onderkant en een klein donker display (zie
  // public/images/maatregelen/thuisbatterij/thuisbatterij-sigenstor.png). Het GLB-model had een
  // zwarte kast met een groene strip; hier gecorrigeerd voor homepage én scan.
  scene.getObjectByName("Thuisbatterij")?.traverse(part => {
    const mesh = part as Mesh;
    if (!mesh.isMesh) return;
    const kleur = mesh.name === "batterij_accent" ? "#353b40" : mesh.name === "batterij_voet" ? "#b9bec2" : "#eceeec";
    for (const materiaal of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      const m = materiaal as MeshStandardMaterial;
      if (!m.isMeshStandardMaterial) continue;
      m.color.set(kleur);
      m.metalness = 0;
      m.roughness = mesh.name === "batterij_accent" ? 0.35 : 0.55;
    }
  });

  const dormer = scene.getObjectByName("Dakkapel");
  if (dormer) {
    const box = new Box3().setFromObject(dormer);
    const pivot = box.getCenter(new Vector3());
    pivot.y = box.min.y;
    const factor = new Vector3(type === "hoekwoning" ? 1.35 : 1.25, 1.3, 1.1);
    // The GLB dormer has a world-origin pivot. Scale about its own base instead.
    dormer.scale.multiply(factor);
    dormer.position.add(pivot.clone().multiply(new Vector3(1, 1, 1).sub(factor)));
    dormer.position.y += 0.35;
    // Rijwoningen hebben in het GLB maar één dakkapel, op de voorzijde. Regel voor de scan: bij 1
    // dakkapel staat die altijd op de achterzijde, nooit de voorzijde; pas bij 2 komt er ook een
    // voorzijde bij (zelfde naamgeving/spiegeltechniek als de vrijstaande woning al gebruikte, zie
    // finishDetachedHouse: 180° om de y-as + x/z omkeren). Dus eerst de voorzijde-kopie maken uit de
    // onveranderde (voorzijde-)positie, en dan pas het origineel naar achteren spiegelen.
    if (scan && type === "hoekwoning") {
      // Scan: de dakkapel loopt naar achteren door tot zijn platte dak het dakvlak raakt (geen losse
      // achterwand boven de pannen). Het deel onder het dakvlak knipt HouseViewer weg (clipping).
      const pannen = scene.getObjectByName("Dakpannen");
      if (pannen) {
        const dak = new Box3().setFromObject(pannen), kapel = new Box3().setFromObject(dormer);
        const helling = (dak.max.y - dak.min.y) / ((dak.max.z - dak.min.z) / 2);
        const raakZ = (dak.getCenter(new Vector3()).z + (dak.max.y - kapel.max.y) / helling) - 0.1;
        const f = (kapel.max.z - raakZ) / (kapel.max.z - kapel.min.z);
        if (f > 1) { dormer.scale.z *= f; dormer.position.z = kapel.max.z + (dormer.position.z - kapel.max.z) * f; }
      }
      const voor = dormer.clone(true);
      voor.name = "Dakkapel_voor";
      voor.traverse(part => { if ((part as Mesh).isMesh) { const mesh = part as Mesh; mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone(); } });
      scene.add(voor);
      dormer.rotation.y += Math.PI;
      dormer.position.x = -dormer.position.x;
      dormer.position.z = -dormer.position.z;
    }
  }

  if (type === "hoekwoning") {
    updateCornerFacade(scene);
    distinguishDoors(scene,type);
    openPlintBijDeuren(scene);
    if (requestedType === "tussenwoning") addLuifel(scene);
    // Keep the outdoor unit visible beside the free side facade in the story's fixed camera.
    const heatPump = scene.getObjectByName("Warmtepomp_DeWarmte");
    if (heatPump) heatPump.position.z = 1.7;
    // De achterdeur staat (via distinguishDoors) op x=1.6; het grote
    // achterraam op de begane grond (Raam_achter_03, zie house-facades.ts)
    // loopt van x=-2.0 tot x=0.1. De enige vrije muurstrook op de begane
    // grond ligt daartussen; de thuisbatterij komt daar te staan.
    const battery = scene.getObjectByName("Thuisbatterij");
    if (battery) battery.position.x = 0.58;
    for (const child of scene.children) {
      if (child.name.startsWith("Zonnepaneel") && child.position.z > 0) child.position.x = Math.sign(child.position.x) * 1.95;
    }
    // Scan: per dakvlak ruimte voor een dakkapel (bij 1 dakkapel alleen achter, bij 2 ook voor). Zonder
    // dakkapel op dat vlak liggen er juist panelen in het midden; mét dakkapel verdwijnen die en schuiven
    // de buitenste panelen opzij (HouseViewer zet dit per frame, zie userData.dakvlak).
    if (scan) {
      const dak = scene.children.filter(c => /^Zonnepaneel_\d+$/.test(c.name));
      for (const p of dak) {
        const voor = p.position.z > 0;
        const x0 = voor ? Math.sign(p.position.x) * 1.67 : p.position.x;
        p.userData.dakvlak = voor ? "voor" : "achter";
        if (Math.abs(x0) < 1) p.userData.onderKapel = true;
        else { p.userData.vrijX = x0; p.userData.kapelX = Math.sign(x0) * 1.95; }
      }
      for (const p of dak.filter(c => c.position.z > 0)) {
        const midden = p.clone(true);
        midden.name = `${p.name}_midden`;
        midden.position.x = Math.sign(p.position.x) * 0.56;
        midden.userData = { dakvlak: "voor", onderKapel: true };
        midden.traverse(part => { if ((part as Mesh).isMesh) { const mesh = part as Mesh; mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone(); } });
        scene.add(midden);
      }
    }
    const neighbour = scene.getObjectByName("Buurwoning_rij");
    if (neighbour) {
      // Give the adjoining home the same bay width and facade rhythm as the selected house.
      const neighbourBody = neighbour.getObjectByName("buur_romp");
      const width = 5.28;
      const centre = -width;
      if (neighbourBody) {
        neighbourBody.scale.x = width / 4.2; neighbourBody.position.x = centre;
        // De muren van de buurwoning stopten 44 cm onder het dakvlak (zichtbare wig lucht onder het dak).
        // Trek de bovenkant op tot tegen de onderkant van de dakschilden.
        const romp = neighbourBody as Mesh;
        romp.geometry = romp.geometry.clone();
        romp.geometry.userData.owned = true;
        const pos = romp.geometry.getAttribute("position");
        for (let i = 0; i < pos.count; i++) if (pos.getY(i) > 2.6) pos.setY(i, pos.getY(i) + 0.44);
        pos.needsUpdate = true;
        romp.geometry.computeVertexNormals();
        romp.geometry.computeBoundingBox();
      }
      for (const child of [...neighbour.children]) {
        if (/^buur_(deur|kozijn|glas)/.test(child.name)) neighbour.remove(child);
        // Naamloze delen zijn de windveren: die horen op de (verbrede) kopgevel, niet midden op het dak.
        if ((child as Mesh).isMesh && !child.name.startsWith("buur_")) child.position.x = centre - width / 2;
        if (/^buur_(dakschild|goot|nok|plint)/.test(child.name)) {
          child.position.x = centre;
          child.scale.x = child.name === "buur_plint" ? width / 4.2 : width / 4.34;
        }
      }
      for (const child of scene.children) {
        if (/^(Raam_(voor|achter)_|Voordeur$|Achterdeur$)/.test(child.name)) {
          const copy = child.clone(true);
          copy.position.x += centre;
          // De buurwoning is een massief blok zonder gaten: zet de (verzonken) kozijnen weer op de gevel.
          copy.position.z += Math.sign(copy.position.z) * 0.07;
          copy.name = `buur_${child.name}`;
          neighbour.add(copy);
        }
      }
      neighbour.traverse(part => {
        if ((part as Mesh).isMesh) {
          const mesh = part as Mesh;
          if (mesh.geometry.userData.owned) mesh.geometry = mesh.geometry.clone();
          mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone();
          for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            if ((material as MeshStandardMaterial).isMeshStandardMaterial) (material as MeshStandardMaterial).color.multiplyScalar(0.83);
          }
        }
      });
    }
  } else {
    for (const child of scene.children) {
      if (child.name.startsWith("Zonnepaneel") && child.position.x > 4) child.userData.garagePanel = true;
    }
    // The garage side stays quiet: one small attic window. Other side windows align with the front.
    const side = scene.getObjectByName("Zijraam_boven_garage");
    if (side) {
      side.name = "Raam_rechts_zolder";
      side.position.set(3.77, 3.75, 0);
      side.scale.set(1, 0.65, 0.8);
    }
    for (const name of ["Raam_links_02", "Raam_links_03"]) {
      const window = scene.getObjectByName(name);
      if (window) window.position.y = 1.6;
    }
    updateDetachedFacade(scene);
    distinguishDoors(scene,type);
    openPlintBijDeuren(scene);
    openDetachedWindows(scene);
    addGevelbekleding(scene, requestedType === "twee-onder-een-kap" ? ["rechts"] : ["links", "rechts"]);
    finishDetachedHouse(scene, scan);
  }

  addDormerPanels(scene);
  if(scan)addPlasticProfiles(scene);
  scene.updateMatrixWorld(true);
  if ((scan || requestedType === "tussenwoning") && type === "hoekwoning") {
    const right = scene.getObjectByName("Buitengevel_rechts") as Mesh;
    const left = right.clone();
    left.name = "Buitengevel_links";
    left.position.x = -right.position.x;
    left.geometry = (source.getObjectByName("Buitengevel_rechts") as Mesh).geometry;
    left.material = Array.isArray(right.material) ? right.material.map(m => m.clone()) : right.material.clone();
    scene.add(left);
    // De bouwmuur deelde zijn buitenvlak met deze gekloonde gevel, wat flikkerde (z-fighting).
    // Laat de bouwmuur nu achter de gevel beginnen; de binnenkant blijft op dezelfde plek.
    const bouwmuur = scene.getObjectByName("Bouwmuur_links");
    if (bouwmuur) {
      scene.updateMatrixWorld(true);
      const huid = new Box3().setFromObject(left), muur = new Box3().setFromObject(bouwmuur);
      const f = (muur.max.x - huid.max.x - 0.005) / (muur.max.x - muur.min.x);
      if (f > 0.05 && f < 1) {
        const p = bouwmuur.position.x;
        bouwmuur.scale.x *= f;
        bouwmuur.position.x += muur.max.x - (p + (muur.max.x - p) * f);
      }
    }
  }
  if (scan || requestedType==="vrijstaand") for (const child of [...scene.children]) if (child.name.startsWith("Buurwoning")) { disposeHouse(child); scene.remove(child); }
  applyAttachedVariant(scene,source,requestedType,scan,hoekZijde);
  // Aanbouw is alleen in de scan te kiezen; na de gedeelde muren, zodat die ook bij de aanbouw grijs worden.
  if (scan) addAanbouw(scene);
  scene.scale.set(...HOUSE_PROPORTIONS[requestedType]);
  scene.updateMatrixWorld(true);
  const bounds = new Box3();
  for (const child of scene.children) {
    // Buurwoningen en de (optionele) aanbouw tellen niet mee, zodat de woning in beeld hetzelfde blijft.
    if (!/^(Buurwoning|Aanbouw|Fundering_aanbouw)/.test(child.name)) bounds.expandByObject(child);
  }
  const size = bounds.getSize(new Vector3());
  const scale = scan ? 3.3 / Math.max(size.x, size.y, size.z) : 3 / Math.max(12.1, size.x, size.y, size.z);
  const position = bounds.getCenter(new Vector3()).multiplyScalar(-scale);
  return { scene, scale, position, bounds };
}

/**
 * Witte gipsplaten aan de binnenkant van het dak, direct onder de isolatie. Elke plaat van de
 * dakconstructie wordt in tweeën verdeeld:
 * - buitenste kwart: donker, op de volle maat van het model, zodat hij net als eerst de muurkoppen en
 *   het overstek afdekt (buiten valt er niets wit op, ook niet bij de kopgevel);
 * - binnenste driekwart: witte gipsplaat, alleen binnen de muren (van de nok tot de binnenkant van
 *   voor- en achtergevel, en 0,5 m binnen de zijmuren). Op zolder en in de doorsnede zie je zo de
 *   witte platen.
 */
function voegGipsplatenToe(scene: Group) {
  const kap = scene.getObjectByName("Dakconstructie");
  if (!kap) return;
  scene.updateMatrixWorld(true);
  const lokaal = (o: Object3D) => new Box3().setFromObject(o).applyMatrix4(scene.matrixWorld.clone().invert());
  const muur = (namen: string[], kant: "min" | "max") => {
    for (const n of namen) { const o = scene.getObjectByName(n); if (o) return lokaal(o)[kant].x; }
    return null;
  };
  const binnenLinks = muur(["Binnenmuur_links", "Bouwmuur_links"], "max"), binnenRechts = muur(["Binnenmuur_rechts", "Zijgevel_garage_binnen"], "min");
  const voor = scene.getObjectByName("Binnenmuur_voor"), achter = scene.getObjectByName("Binnenmuur_achter");
  const binnenVoor = voor ? lokaal(voor).min.z : null, binnenAchter = achter ? lokaal(achter).max.z : null;
  const naarScene = kap.matrixWorld.clone().premultiply(scene.matrixWorld.clone().invert());
  const gips = new MeshStandardMaterial({ color: "#f2f0ea", roughness: 0.92, metalness: 0 });
  const nokken: { punt: Vector3; lengte: number }[] = [];
  // Buitenkant van de kopgevels: daar komt een donkere lat langs het dak, over de kier tussen muurkop en dak.
  const buitenLinks = muur(["Buitengevel_links"], "min"), buitenRechts = muur(["Buitengevel_rechts", "Zijgevel_garage_buiten"], "max");
  const lat = new MeshStandardMaterial({ color: "#3d3732", roughness: 0.8, metalness: 0 });
  for (const plaat of [...kap.children] as Mesh[]) {
    if (!plaat.isMesh) continue;
    plaat.geometry.computeBoundingBox();
    const g = plaat.geometry.boundingBox!;
    const c = g.getCenter(new Vector3());
    const hx = (g.max.x - g.min.x) / 2, hy = (g.max.y - g.min.y) / 2, hz = (g.max.z - g.min.z) / 2;
    const basis = plaat.matrix.clone();
    const m = basis.clone().premultiply(naarScene);
    const p = (x: number, y: number, z: number) => new Vector3(c.x + x, c.y + y, c.z + z).applyMatrix4(m);
    // Goot (laagste kant langs de helling) en binnenkant (de kant die naar beneden wijst).
    const e = p(0, 0, hz).y < p(0, 0, -hz).y ? 1 : -1;
    const i = p(0, hy, 0).y < p(0, -hy, 0).y ? 1 : -1;
    const nok = p(0, 0, -e * hz), goot = p(0, 0, e * hz);
    const binnen = goot.z > nok.z ? binnenVoor : binnenAchter;
    const t = binnen === null ? 1 : Math.max(0.2, Math.min(1, (binnen - nok.z) / (goot.z - nok.z)));
    const midden = p(0, 0, 0).x, richting = Math.sign(p(1, 0, 0).x - midden) || 1;
    // 0,5 m binnen de zijmuren: bovenaan de kopgevel sluit de muur in het model niet helemaal tegen het
    // dak, en door die kier zou je het wit anders van buiten zien.
    const lok = (x: number | null, k: number) => x === null ? k * (hx - 0.5) : Math.max(-hx, Math.min(hx, (x - midden) * richting - k * 0.5));
    const [x0, x1] = [lok(binnenLinks, -richting), lok(binnenRechts, richting)].sort((a, b) => a - b);
    const deel = (doel: Mesh, dx: number, sx: number, dz: number, sz: number, binnenDeel: boolean) => {
      const dy = binnenDeel ? i * 0.25 * hy : -i * 0.75 * hy, sy = binnenDeel ? 0.75 : 0.25;
      basis.clone()
        .multiply(new Matrix4().makeTranslation(c.x + dx, c.y + dy, c.z + dz))
        .multiply(new Matrix4().makeScale(sx, sy, sz))
        .multiply(new Matrix4().makeTranslation(-c.x, -c.y, -c.z))
        .decompose(doel.position, doel.quaternion, doel.scale);
    };
    const binnenPlaat = new Mesh(plaat.geometry, gips);
    binnenPlaat.name = "Gipsplaten";
    deel(binnenPlaat, (x0 + x1) / 2, Math.max(0.05, (x1 - x0) / (2 * hx)), e * hz * (t - 1), t, true);
    deel(plaat, 0, 1, 0, 1, false);
    for (const mat of (Array.isArray(plaat.material) ? plaat.material : [plaat.material]) as MeshStandardMaterial[]) {
      if (!mat.isMeshStandardMaterial) continue;
      mat.map = null; mat.color.set("#4a423c"); mat.roughness = 0.85; mat.metalness = 0; mat.needsUpdate = true;
    }
    kap.add(binnenPlaat);
    // Latten langs het dak aan de buitenkant van beide kopgevels (alleen de echte dakplaten, niet het
    // dakbeschot): de kier tussen muurkop en pannen dicht, over de hele lengte van het dakvlak.
    if (plaat.name.startsWith("Dakbeschot")) continue;
    nokken.push({ punt: nok.clone(), lengte: 2 * hx });
    for (const [buiten, k, zijde] of [[buitenLinks, -1, "links"], [buitenRechts, 1, "rechts"]] as [number | null, number, string][]) {
      if (buiten === null) continue;
      const xa = (buiten - midden) * richting, xb = xa + k * richting * 0.06;
      const latMesh = new Mesh(new BoxGeometry(1, 1, 1), lat);
      latMesh.geometry.userData.owned = true;
      // Los in de scène (niet onder de dakconstructie), zodat hij met zijn kopgevel mee kan bij de doorsnede.
      latMesh.name = `Daklat_${zijde}`;
      // Van 0,3 m onder de plaat tot net onder de pannen (over isolatie en latten heen).
      const yBinnen = c.y + i * (hy + 0.3), yBuiten = c.y - i * (hy + 0.2);
      basis.clone()
        .multiply(new Matrix4().makeTranslation(c.x + (xa + xb) / 2, (yBuiten + yBinnen) / 2, c.z))
        .multiply(new Matrix4().makeScale(Math.abs(xb - xa), Math.abs(yBinnen - yBuiten), 2 * hz))
        .premultiply(kap.matrix)
        .decompose(latMesh.position, latMesh.quaternion, latMesh.scale);
      scene.add(latMesh);
    }
  }
  // Nokbalk: waar de twee dakvlakken in de nok samenkomen, sluit een donkere balk over de hele lengte de
  // kier tussen de (dunne) bovenste lagen; anders zie je in de punt van het dak een gaatje.
  if (nokken.length === 2) {
    const [a, b2] = nokken;
    const midden = a.punt.clone().add(b2.punt).multiplyScalar(0.5);
    const balk = new Mesh(new BoxGeometry(Math.max(a.lengte, b2.lengte), 0.3, 0.26), new MeshStandardMaterial({ color: "#4a423c", roughness: 0.85, metalness: 0 }));
    balk.geometry.userData.owned = true;
    balk.name = "Nokbalk";
    balk.position.copy(midden).add(new Vector3(0, -0.12, 0));
    scene.add(balk);
  }
  // Isolatie en panlatten steken in het model een paar centimeter buiten de kopgevels uit (lichte strook
  // onder de pannen): 8 cm per kant korter, zodat ze binnen de gevel eindigen.
  for (const naam of ["Dakisolatie", "Panlatten"]) scene.getObjectByName(naam)?.children.forEach(deel => {
    const mesh = deel as Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.computeBoundingBox();
    const hx = (mesh.geometry.boundingBox!.max.x - mesh.geometry.boundingBox!.min.x) / 2;
    if (hx > 0.5) mesh.scale.x *= (hx - 0.08) / hx;
  });
}

export function disposeHouse(scene: Object3D) {
  const materials = new Set<Material>();
  scene.traverse(object => {
    if ((object as Mesh).isMesh) { const mesh = object as Mesh; if (mesh.geometry.userData.owned) mesh.geometry.dispose(); for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) materials.add(material); }
  });
  materials.forEach(material => material.dispose());
}
