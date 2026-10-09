import { EIND, T } from "../animatie/basis";
import { dakScene } from "../animatie/dak";

// Scène + tijdlijn voor de dakisolatie-infographic (inblazen); zie ../animatie/dak.ts.
export { T, EIND };
export const VIEWBOX = "0 30 900 285";
export const { sceneMarkup, bouwTijdlijn } = dakScene("inblazen");
