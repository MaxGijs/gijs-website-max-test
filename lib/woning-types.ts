export type HouseType = "hoekwoning" | "vrijstaand" | "tussenwoning" | "twee-onder-een-kap";
export const HOUSE_MODELS: Record<HouseType, { label: string; url: string }> = {
  hoekwoning: { label: "Hoekwoning", url: "/models/gijs-hoekwoning.glb" },
  tussenwoning: { label: "Tussenwoning", url: "/models/gijs-hoekwoning.glb" },
  "twee-onder-een-kap": { label: "Twee-onder-een-kap", url: "/models/gijs-vrijstaandewoning.glb" },
  vrijstaand: { label: "Vrijstaande woning", url: "/models/gijs-vrijstaandewoning.glb" },
};
export function parseHouseType(value: unknown): HouseType | undefined {
  return typeof value === "string" && Object.hasOwn(HOUSE_MODELS,value) ? value as HouseType : undefined;
}
export const baseHouseType = (type:HouseType): "hoekwoning"|"vrijstaand" => type === "vrijstaand" || type === "twee-onder-een-kap" ? "vrijstaand" : "hoekwoning";
export type WoningDraft = { postcode: string; huisnummer: string; houseType: HouseType };
// Keep the height familiar, while giving the example homes distinct footprints.
export const HOUSE_PROPORTIONS: Record<HouseType,[number,number,number]> = {
  tussenwoning:[.95,1,1],
  hoekwoning:[1.08,1,1.04],
  "twee-onder-een-kap":[1,1,1],
  vrijstaand:[1.22,1,1.16],
};
