import Image from "next/image";
import type { WarmtepompMerk } from "@/lib/content/warmtepomp-merken";

// Rustige logostrook: een wrappende, gecentreerde rij in plaats van een raster met kaartjes.
// Bij zeven logo's zou elk raster een half gevulde laatste rij opleveren; een wrappende rij
// centreert zichzelf en heeft dat probleem per definitie niet.
//
// Originele kleuren en verhoudingen blijven staan: geen grijsfilter, geen hover-effect, geen
// omlijsting. De hoogte verschilt per merk (zie lib/content/warmtepomp-merken.ts), zodat alle
// logo's optisch even zwaar ogen ondanks hun sterk verschillende verhoudingen.
export function MerkenStrook({ merken, intro }: { merken: WarmtepompMerk[]; intro: string }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-[15px] text-[var(--text-muted)] text-center">{intro}</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-7 sm:gap-x-12 sm:gap-y-9 list-none p-0 m-0">
        {merken.map(merk => (
          <li key={merk.naam} className="flex items-center">
            <Image
              src={merk.bestand}
              alt={`Logo van ${merk.naam}`}
              width={merk.breedte}
              height={merk.hoogte}
              sizes="(max-width: 640px) 40vw, 240px"
              className={`${merk.klasse} w-auto object-contain`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
