import { Icon } from "@/components/ds/core/Icon";

// Beeld van de daadwerkelijke locatie in stap 1 ("Klopt dit?"), bedoeld voor
// het Cyclomedia-panorama. Er is nog geen Cyclomedia-koppeling: dit
// component is bewust het enige aansluitpunt. Vervang de placeholder door
// het panorama zodra de koppeling (en de juridische toets van het gebruik)
// rond is; de rest van de flow hoeft dan niet te wijzigen.
//
// Belangrijk onderscheid voor de bewoner:
//   dit beeld        = de echte locatie/woning
//   Gijs 3D-model    = illustratieve woningweergave
export function Woningbeeld({ adresLabel }: { adresLabel: string }) {
  return (
    <figure className="m-0 flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-muted)]">
      <span className="shrink-0 w-11 h-11 rounded-full bg-white border border-[var(--border-default)] flex items-center justify-center">
        <Icon name="map" size="md" />
      </span>
      <figcaption className="text-[15px]">
        <p className="font-semibold text-[var(--gijs-donkergroen)]">Straatbeeld van de locatie</p>
        <p className="text-[var(--grey-800)]">
          Hier komt een straatbeeld (panorama) van {adresLabel || "je adres"}, zodat je kunt zien of dit je woning is.
          Dat beeld is nog niet gekoppeld.
        </p>
      </figcaption>
    </figure>
  );
}
