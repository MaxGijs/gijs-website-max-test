import { EIND, T } from "../animatie/basis";
import { raamScene } from "../animatie/raam";

// Scène + tijdlijn voor de isolatieglas-infographic; zie ../animatie/raam.ts.
export { T, EIND };
export const VIEWBOX = "0 30 900 285";
export const { sceneMarkup, bouwTijdlijn } = raamScene("glas");
