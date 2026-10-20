"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { MAATREGELEN, STAP, type Annotatie, type Sleutel } from "@/components/home/cutaway/stappen";
import { STATEN, type Regie } from "@/components/home/cutaway/anime-prototype/staten";
import basis from "@/components/home/HouseModelPrototype.module.css";

// Hergebruikt de bestaande interactieve 3D-woning van de homepage (zelfde model, materialen,
// belichting en camera-engine uit AnimeWoningScene), zonder de scroll-verhaallijn van de homepage.
// Geen nieuwe woningillustratie, geen duplicatie van de scène zelf — alleen een lichte mount die de
// camera via de bestaande regie.naar(staat) stuurt: naar het overzicht, of naar een gekozen
// bouwdeel (focus) als links/rechts op een maatregel wordt geklikt.
const AnimeWoningScene = dynamic(() => import("@/components/home/cutaway/anime-prototype/AnimeWoningScene"), { ssr: false });

const OVERZICHT = STATEN.length - 1;

export function OverijsselWoning({ focus }: { focus: Sleutel | null }) {
  const sectie = useRef<HTMLElement>(null);
  const annotaties = useRef<Record<string, Annotatie>>({});
  const regie = useRef<Regie | null>(null);
  const [geladen, setGeladen] = useState(false);
  const [mobiel, setMobiel] = useState(false);
  const onGeladen = useMemo(() => () => setGeladen(true), []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobiel(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Geen scroll-staten op deze pagina: direct naar het overzicht, of naar het gekozen bouwdeel.
  useEffect(() => {
    if (geladen) regie.current?.naar(focus ? STAP[focus] : OVERZICHT);
  }, [geladen, focus]);

  const actief = focus ? MAATREGELEN.find(m => m.sleutel === focus) : null;
  const label = actief
    ? `Opengewerkte woning van Gijs, met de nadruk op ${actief.titel.naam.toLowerCase()}`
    : "Opengewerkte woning van Gijs, met isolatie en installaties zichtbaar";

  return (
    // flex-col: .visual (HouseModelPrototype.module.css) groeit met flex: 1, net als in de homepagekolom;
    // zonder flexouder krijgt het canvas geen hoogte en blijft de woning een smalle strook.
    <section ref={sectie} className="relative flex flex-col h-[380px] sm:h-[460px] lg:h-[560px]" aria-label="Opengewerkte woning van Gijs">
      <div className={basis.visual} role="img" aria-label={label}>
        <div className={basis.halo} />
        <AnimeWoningScene sectie={sectie} onStaat={() => {}} onGeladen={onGeladen} mobiel={mobiel} annotaties={annotaties} regie={regie} />
        {!geladen && <p role="status" className={basis.loading}>De woning wordt geladen…</p>}
      </div>
    </section>
  );
}
