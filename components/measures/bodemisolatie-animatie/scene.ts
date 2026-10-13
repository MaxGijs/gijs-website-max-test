import { EIND, T } from "../animatie/basis";
import { vloerScene } from "../animatie/vloer";

// Scène + tijdlijn voor de bodemisolatie-infographic (bodem); zie ../animatie/vloer.ts.
export { T, EIND };
export const VIEWBOX = "0 30 900 325";
export const { sceneMarkup, bouwTijdlijn } = vloerScene("bodem");
