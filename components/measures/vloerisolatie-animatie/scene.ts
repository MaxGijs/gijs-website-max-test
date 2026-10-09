import { EIND, T } from "../animatie/basis";
import { vloerScene } from "../animatie/vloer";

// Scène + tijdlijn voor de vloerisolatie-infographic (platen); zie ../animatie/vloer.ts.
export { T, EIND };
export const VIEWBOX = "0 30 900 305";
export const { sceneMarkup, bouwTijdlijn } = vloerScene("platen");
