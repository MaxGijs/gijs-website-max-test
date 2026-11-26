"use client";

import { useId, useState } from "react";
import { Kaart, zichtbareArtikelen } from "@/components/kennis/ArtikelKaarten";
import { RASTER, RASTER_CEL } from "@/components/regio/regio-template-styles";

const ARTIKELEN = zichtbareArtikelen();

// Hoofdletters en accenten negeren: "isolatie" vindt ook "Isolatie", "geïsoleerd" ook "geisoleerd".
const normaliseer = (s: string) => s.toLocaleLowerCase("nl").normalize("NFD").replace(/[̀-ͯ]/g, "");

const INDEX = ARTIKELEN.map(a => ({ a, tekst: normaliseer([a.titel, a.intro, a.beschrijving].join(" ")) }));

export function ArtikelZoeker({ compact = false }: { compact?: boolean }) {
  const [zoek, setZoek] = useState("");
  const id = useId();
  const termen = normaliseer(zoek).split(/\s+/).filter(Boolean);
  const gevonden = termen.length ? INDEX.filter(x => termen.every(t => x.tekst.includes(t))).map(x => x.a) : ARTIKELEN;
  const n = gevonden.length;

  return (
    <>
      <div className="relative mb-6 max-w-xl">
        <label htmlFor={id} className="sr-only">Zoek in artikelen</label>
        <svg className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.75" />
          <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        <input
          id={id}
          type="search"
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          onKeyDown={e => { if (e.key === "Escape") setZoek(""); }}
          placeholder="Zoek in artikelen, bijvoorbeeld warmtepomp of isolatie"
          autoComplete="off"
          className="h-12 w-full rounded-full border border-black/[0.12] bg-white pl-12 pr-11 text-[16px] text-zinc-800 placeholder:text-zinc-400 outline-none transition-colors focus:border-[var(--accent-700)] focus:ring-2 focus:ring-[var(--accent-200)] [&::-webkit-search-cancel-button]:hidden"
        />
        {zoek && (
          <button
            type="button"
            onClick={() => setZoek("")}
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 hover:bg-black/[0.06] hover:text-zinc-800"
            aria-label="Zoekopdracht wissen"
          >
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {termen.length ? `${n} ${n === 1 ? "artikel" : "artikelen"} gevonden` : ""}
      </p>

      {n > 0 ? (
        <ul className={RASTER + " gap-4 lg:gap-5 list-none p-0 m-0"}>
          {gevonden.map((a, i) => (
            <li key={a.slug} className={RASTER_CEL(n, i)}>
              <Kaart a={a} breed={n === 1} compact={compact} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[var(--radius-lg)] bg-[var(--grey-050)] p-8 text-center">
          <p className="m-0 text-[17px] font-semibold text-[var(--gijs-donkergroen)]">Geen artikelen gevonden voor &ldquo;{zoek.trim()}&rdquo;</p>
          <p className="mt-2 mb-4 text-[15px] text-zinc-600">Probeer een ander woord, zoals warmtepomp, isolatie of zonnepanelen.</p>
          <button type="button" onClick={() => setZoek("")} className="text-[15px] font-semibold text-[var(--accent-700)] underline underline-offset-[3px]">
            Toon alle artikelen
          </button>
        </div>
      )}
    </>
  );
}
