// Landelijke subsidie per m², overgenomen uit het subsidieoverzicht van Gijs
// (public/images/kennis/subsidie/subsidieoverzicht-1.png en -2.png). Alleen
// maatregelen die daar een bedrag per m² hebben staan hier; warmtepomp,
// zonnepanelen, vloerverwarming en thuisbatterij bewust niet.
export type SubsidiePerM2 = { soort?: string; een: string; meer: string; oppervlak: string };

export const SUBSIDIE_PER_M2: Record<string, SubsidiePerM2[]> = {
  dakisolatie: [{ een: "€ 15", meer: "€ 30", oppervlak: "20 t/m 200 m²" }],
  gevelisolatie: [{ een: "€ 4", meer: "€ 8", oppervlak: "10 t/m 170 m²" }],
  vloerisolatie: [{ een: "€ 5,50", meer: "€ 11", oppervlak: "20 t/m 130 m²" }],
  "glas-kozijnen": [
    { soort: "Dubbel glas (u-waarde 1,2 of lager)", een: "€ 23", meer: "€ 53", oppervlak: "8 t/m 45 m²" },
    { soort: "Driedubbel glas (u-waarde 0,8 of lager)", een: "€ 65,50", meer: "€ 131", oppervlak: "8 t/m 45 m²" },
  ],
};
