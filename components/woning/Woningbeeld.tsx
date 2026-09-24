import { Icon } from "@/components/ds/core/Icon";

// Herkenningslaag bij "Is dit jouw woning?" — apart van de Gijs 3D-woning
// (die pas daarna de centrale, interactieve omgeving wordt). Er is nog
// geen goedgekeurde beeldbron (bijvoorbeeld een kaart-/satellietservice
// of Cyclomedia): dit component is bewust het enige aansluitpunt.
// Vervang de placeholder hieronder door een <img>/kaartcomponent zodra
// een bron beschikbaar is; de rest van de flow hoeft dan niet te wijzigen.
//
// Toekomstige richting (nog niet gebouwd): naast de herkenningsfoto ook
// het oppervlak per bouwdeel (dak, gevel, muur) uit dezelfde bron halen,
// zodat dat straks in lib/woningdossier.ts als extra Datapunt per
// bouwdeel kan landen — vandaag is dit uitsluitend fictieve tekst.
export function Woningbeeld({ adresLabel }: { adresLabel: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-muted)]">
      <span className="shrink-0 w-11 h-11 rounded-full bg-white border border-[var(--border-default)] flex items-center justify-center">
        <Icon name="map" size="md" />
      </span>
      <div className="text-sm">
        <p className="font-semibold text-[var(--gijs-donkergroen)]">Kaartbeeld volgt hier</p>
        <p className="text-zinc-600">
          Zodra Gijs een kaart- of luchtfotobron koppelt, zie je hier een echt beeld van {adresLabel || "je woning"}.
          Later kan dit ook de oppervlaktes per onderdeel opleveren, zoals dak, gevel en muur.
        </p>
      </div>
    </div>
  );
}
