/* eslint-disable @next/next/no-img-element -- externe straatbeeld-URL, wordt niet door next/image geoptimaliseerd. */
import { Icon } from "@/components/ds/core/Icon";
import { straatbeeldUrl } from "@/lib/straatbeeld";

// Foto van de echte woning in stap 1 ("Klopt dit?"). Zolang er geen
// straatbeeldkoppeling is (lib/straatbeeld.ts), staat hier een placeholder
// in hetzelfde kader, zodat de rest van de scan niet hoeft te wijzigen.
export function Woningbeeld({ adresLabel }: { adresLabel: string }) {
  const url = straatbeeldUrl(adresLabel);
  return (
    <figure className="m-0 overflow-hidden rounded-[24px] bg-[var(--grey-050)]">
      {url ? (
        <img src={url} alt={`Straatbeeld van ${adresLabel}`} className="block aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,#eef3f0,#e2ebe6)] px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[var(--accent-700)] shadow-[var(--shadow-1)]">
            <Icon name="map" size="lg" />
          </span>
          <p className="text-[15px] font-semibold text-[var(--gijs-donkergroen)]">Foto van {adresLabel || "je woning"}</p>
          <p className="max-w-[34ch] text-[13px] text-[var(--text-muted)]">Hier verschijnt straks een foto van je woning. De koppeling hiervoor is nog niet actief.</p>
        </div>
      )}
      <figcaption className="px-4 py-3 text-[13px] text-[var(--text-muted)]">{adresLabel}</figcaption>
    </figure>
  );
}
