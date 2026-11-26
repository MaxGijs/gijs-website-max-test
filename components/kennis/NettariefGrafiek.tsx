// Indicatieve variabele transporttarieven per uur (ct/kWh), ACM-rekenvoorbeeld 8 oktober 2026.
const WINTER = [11, ...Array(14).fill(8), 11, 11, 17, 17, 17, 17, 17, 11, 11];
const ZOMER = [8, 8, 8, ...Array(7).fill(5), ...Array(7).fill(0), 5, 5, 11, 11, 11, 11, 11];

const KLEUR: Record<number, string> = {
  0: "#3f6b3a",
  5: "#8aa66e",
  8: "#d8bb6c",
  11: "#b98445",
  17: "#a84f3e",
};

const MAX = 18;
const RASTER = [0, 5, 10, 15];
const UREN = ["00:00", "06:00", "12:00", "18:00", "24:00"];

function Seizoen({ titel, waarden, omschrijving }: { titel: string; waarden: number[]; omschrijving: string }) {
  return (
    <figure className="mx-0 mb-0">
      <figcaption className="mb-3 text-[14px] font-semibold text-[var(--gijs-donkergroen)]">{titel}</figcaption>
      <div className="flex gap-2" role="img" aria-label={omschrijving}>
        <div className="relative h-36 w-8 shrink-0 text-right text-[12px] tabular-nums text-zinc-500 sm:h-44" aria-hidden>
          {RASTER.map(r => (
            <span key={r} className="absolute right-0 translate-y-1/2" style={{ bottom: `${(r / MAX) * 100}%` }}>{r}¢</span>
          ))}
        </div>
        <div className="flex-1">
          <div className="relative h-36 sm:h-44">
            {RASTER.map(r => (
              <div key={r} className="absolute inset-x-0 border-t border-black/[0.08]" style={{ bottom: `${(r / MAX) * 100}%` }} aria-hidden />
            ))}
            <div className="absolute inset-0 flex items-end gap-[2px] sm:gap-[3px]">
              {waarden.map((w, uur) => (
                <div
                  key={uur}
                  title={`${String(uur).padStart(2, "0")}:00–${String(uur + 1).padStart(2, "0")}:00 · ${w} ct/kWh`}
                  className="flex-1 rounded-t-[3px]"
                  style={{ height: w === 0 ? "3px" : `${(w / MAX) * 100}%`, background: KLEUR[w] }}
                />
              ))}
            </div>
          </div>
          <div className="relative mt-2 h-4 text-[12px] tabular-nums text-zinc-500" aria-hidden>
            {UREN.map((u, i) => (
              <span
                key={u}
                className={"absolute " + (i === 0 ? "left-0" : i === UREN.length - 1 ? "right-0" : "-translate-x-1/2")}
                style={i > 0 && i < UREN.length - 1 ? { left: `${i * 25}%` } : undefined}
              >
                {u}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

export function NettariefGrafiek() {
  return (
    <div className="my-8 rounded-[var(--radius-xl)] border border-black/[0.08] bg-white p-5 sm:p-7">
      <p className="mb-6 text-[clamp(1.125rem,1.05rem+0.4vw,1.375rem)] font-bold leading-snug tracking-[-0.015em] text-[var(--gijs-donkergroen)]">
        Wanneer betaal je meer voor het elektriciteitsnet?
      </p>
      <div className="flex flex-col gap-10">
        <Seizoen
          titel="Winter: oktober t/m maart"
          waarden={WINTER}
          omschrijving="Winter: 8 cent per kWh van 01.00 tot 15.00 uur, 11 cent rond middernacht en van 15.00 tot 17.00 en 22.00 tot 00.00 uur, 17 cent van 17.00 tot 22.00 uur."
        />
        <Seizoen
          titel="Zomer: april t/m september"
          waarden={ZOMER}
          omschrijving="Zomer: 8 cent per kWh van 00.00 tot 03.00 uur, 5 cent van 03.00 tot 10.00 en 17.00 tot 19.00 uur, 0 cent van 10.00 tot 17.00 uur, 11 cent van 19.00 tot 00.00 uur."
        />
      </div>
      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 p-0 text-[13px] text-zinc-600" aria-label="Legenda">
        {Object.entries(KLEUR).map(([w, kleur]) => (
          <li key={w} className="flex list-none items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full" style={{ background: kleur }} aria-hidden />
            {w} ct/kWh
          </li>
        ))}
      </ul>
      <p className="mt-4 mb-0 text-[13px] italic leading-relaxed text-zinc-500">
        Indicatieve variabele transporttarieven op basis van de netkosten in 2026. Bron: ACM, 8 oktober 2026. Geen
        definitieve tarieven voor 2029.
      </p>
    </div>
  );
}
