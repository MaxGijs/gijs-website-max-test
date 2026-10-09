import { Vector3 } from "three";

// Gedeelde camera-wiskunde voor een doorsnede-woning: generiek, zonder kennis van één specifiek
// model, dus veilig te delen tussen de homepage-doorsnede (components/home/cutaway/WoningScene.tsx)
// en de woningscan (components/woning/HouseViewer.tsx). Hier losgetrokken uit WoningScene.tsx zodat
// de woningscan deze logica kan hergebruiken zonder de hele (veel zwaardere) homepage-module met zijn
// eigen GLB/texturen/CSS mee te importeren.

/** Hoek-/beeldveld van de doorsnede-camera (graden), zelfde waarde als voorheen lokaal in beide bestanden. */
export const FOV = 30;

export type Stand = { pos: Vector3; look: Vector3 };

/**
 * Welke modellagen per hoofdstuk uit elkaar schuiven (lokale modeleenheden), van buitenste naar
 * binnenste laag. Gedeeld door de homepage (bouwRoute) en de woningscan; de namen bestaan in beide
 * woningmodellen.
 */
export type HoofdstukLaag = { hoofdstuk: "dak" | "spouw" | "vloer"; naam: RegExp; offset: [number, number, number] };
export const HOOFDSTUK_LAGEN: HoofdstukLaag[] = [
  { hoofdstuk: "dak", naam: /^(Dakpannen|Dakkapel|Schoorsteen|Dakgoot|Zonnepaneel)/, offset: [0, 0.95, 0] },
  { hoofdstuk: "dak", naam: /^Panlatten$/, offset: [0, 0.6, 0] },
  { hoofdstuk: "dak", naam: /^Dakisolatie$/, offset: [0, 0.26, 0] },
  { hoofdstuk: "spouw", naam: /^Buitengevel_voor$/, offset: [0, 0, 0.85] },
  { hoofdstuk: "spouw", naam: /^Spouwisolatie_voor$/, offset: [0, 0, 0.42] },
  { hoofdstuk: "vloer", naam: /^Vloerisolatie$/, offset: [0, -0.22, 0] },
];

/**
 * Tussen twee standen `a` en `b` een fractie `t` (0-1) interpoleren, via een boog rond het
 * middelpunt `midden` in plaats van een rechte lijn — zodat de camera nooit dwars door de woning
 * beweegt. Schrijft het resultaat in de meegegeven `pos`/`look` (geen allocatie per frame).
 */
export function mengStanden(a: Stand, b: Stand, t: number, midden: Vector3, pos: Vector3, look: Vector3) {
  const ha = Math.atan2(a.pos.x - midden.x, a.pos.z - midden.z), hb = Math.atan2(b.pos.x - midden.x, b.pos.z - midden.z);
  let d = hb - ha;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  const ra = Math.hypot(a.pos.x - midden.x, a.pos.z - midden.z), rb = Math.hypot(b.pos.x - midden.x, b.pos.z - midden.z);
  const hoek = ha + d * t, r = ra + (rb - ra) * t;
  pos.set(midden.x + Math.sin(hoek) * r, a.pos.y + (b.pos.y - a.pos.y) * t, midden.z + Math.cos(hoek) * r);
  look.lerpVectors(a.look, b.look, t);
}
