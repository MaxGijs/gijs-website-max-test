import { EIND, T } from "../animatie/basis";
import { vloerScene } from "../animatie/vloer";

// Scène + tijdlijn voor de vloerisolatie-infographic (klimaatfolie tussen de
// balken); zie ../animatie/vloer.ts.
export { T, EIND };
export const VIEWBOX = "0 30 900 325";
export const { sceneMarkup, bouwTijdlijn } = vloerScene("folie");
