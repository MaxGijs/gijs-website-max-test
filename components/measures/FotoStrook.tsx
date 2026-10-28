"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./FotoStrook.module.css";

export type StrookFoto = {
  src: string;
  alt: string;
  caption: string;
  /** Breedte gedeeld door hoogte van de foto, bijvoorbeeld 4 / 3. */
  verhouding: number;
  label?: string;
};

// Eager laden: de strook schuift foto's van opzij in beeld, en lui laden liet ze dan nog even leeg zien.
function Reeks({ fotos, verborgen }: { fotos: StrookFoto[]; verborgen?: boolean }) {
  return (
    <div className={styles.reeks} aria-hidden={verborgen || undefined}>
      {fotos.map(foto => (
        <figure key={foto.src} className={styles.foto}>
          <div className={styles.beeld} style={{ aspectRatio: foto.verhouding }}>
            <Image src={foto.src} alt={verborgen ? "" : foto.alt} fill sizes="400px" loading="eager" draggable={false} className="object-cover" />
            {foto.label && <span className={styles.label}>{foto.label}</span>}
          </div>
          <figcaption className={styles.onderschrift}>{foto.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * Rij foto's die vanzelf van links naar rechts doorschuift. Bezoekers kunnen hem zelf slepen of
 * vegen (en met de pijltjestoetsen bewegen); daarna schuift hij rustig verder. Met de muis erop
 * staat hij stil. De rij staat er twee keer in, zodat hij zonder naad rondloopt.
 */
export function FotoStrook({ fotos, duur = 40, hoogte }: { fotos: StrookFoto[]; duur?: number; hoogte?: number }) {
  const vensterRef = useRef<HTMLDivElement>(null);
  const rijRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const venster = vensterRef.current;
    const rij = rijRef.current;
    if (!venster || !rij) return;
    const reeks = rij.firstElementChild as HTMLElement;
    const rustig = window.matchMedia("(prefers-reduced-motion: reduce)");

    let positie = 0;
    let breedte = reeks.offsetWidth;
    let zichtbaar = false;
    let muisErop = false;
    let slepen: { x: number; positie: number; id: number } | null = null;
    let vaart = 0; // na loslaten nog even doorglijden, in px per seconde
    let laatsteBeweging = { x: 0, t: 0 };
    let hervatNa = 0; // na vegen op een telefoon even wachten voor hij weer zelf gaat
    let frame = 0;
    let vorige = 0;

    const zet = () => {
      if (breedte > 0) positie = ((positie % breedte) + breedte) % breedte - breedte;
      rij.style.transform = `translate3d(${positie}px, 0, 0)`;
    };

    const stap = (nu: number) => {
      const dt = Math.min(0.05, (nu - (vorige || nu)) / 1000);
      vorige = nu;
      if (!slepen) {
        if (Math.abs(vaart) > 5) {
          positie += vaart * dt;
          vaart *= Math.pow(0.04, dt);
        } else {
          vaart = 0;
          if (!muisErop && !rustig.matches && nu > hervatNa) positie += (breedte / duur) * dt;
        }
      }
      zet();
      frame = zichtbaar ? requestAnimationFrame(stap) : 0;
    };

    const start = () => {
      if (!frame && zichtbaar) {
        vorige = 0;
        frame = requestAnimationFrame(stap);
      }
    };

    const zichtbaarheid = new IntersectionObserver(([entry]) => {
      zichtbaar = entry.isIntersecting;
      if (zichtbaar) start();
    });
    zichtbaarheid.observe(venster);

    const maat = new ResizeObserver(() => {
      breedte = reeks.offsetWidth;
      zet();
    });
    maat.observe(reeks);

    const omlaag = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      slepen = { x: e.clientX, positie, id: e.pointerId };
      laatsteBeweging = { x: e.clientX, t: performance.now() };
      vaart = 0;
      venster.dataset.slepen = "";
    };
    const beweeg = (e: PointerEvent) => {
      if (!slepen || e.pointerId !== slepen.id) return;
      const dx = e.clientX - slepen.x;
      // Pas na een paar pixels echt vastpakken, zodat een gewone klik of tik niets verschuift.
      if (!venster.hasPointerCapture(e.pointerId) && Math.abs(dx) > 4) venster.setPointerCapture(e.pointerId);
      positie = slepen.positie + dx;
      const nu = performance.now();
      const dt = (nu - laatsteBeweging.t) / 1000;
      if (dt > 0) vaart = (e.clientX - laatsteBeweging.x) / dt;
      laatsteBeweging = { x: e.clientX, t: nu };
      zet();
    };
    const los = (e: PointerEvent) => {
      if (!slepen || e.pointerId !== slepen.id) return;
      slepen = null;
      delete venster.dataset.slepen;
      if (performance.now() - laatsteBeweging.t > 80) vaart = 0;
      vaart = Math.max(-3000, Math.min(3000, vaart));
      if (e.pointerType !== "mouse") hervatNa = performance.now() + 1500;
    };
    const muisIn = (e: PointerEvent) => { if (e.pointerType === "mouse") muisErop = true; };
    const muisUit = (e: PointerEvent) => { if (e.pointerType === "mouse") muisErop = false; };
    const wiel = (e: WheelEvent) => {
      // Alleen zijwaarts scrollen (trackpad); gewoon omlaag scrollen blijft de pagina scrollen.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      positie -= e.deltaX;
      vaart = 0;
      zet();
    };
    const toets = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      vaart = e.key === "ArrowRight" ? 900 : -900;
    };

    venster.addEventListener("pointerdown", omlaag);
    venster.addEventListener("pointermove", beweeg);
    venster.addEventListener("pointerup", los);
    venster.addEventListener("pointercancel", los);
    venster.addEventListener("pointerenter", muisIn);
    venster.addEventListener("pointerleave", muisUit);
    venster.addEventListener("wheel", wiel, { passive: false });
    venster.addEventListener("keydown", toets);
    zet();

    return () => {
      cancelAnimationFrame(frame);
      zichtbaarheid.disconnect();
      maat.disconnect();
      venster.removeEventListener("pointerdown", omlaag);
      venster.removeEventListener("pointermove", beweeg);
      venster.removeEventListener("pointerup", los);
      venster.removeEventListener("pointercancel", los);
      venster.removeEventListener("pointerenter", muisIn);
      venster.removeEventListener("pointerleave", muisUit);
      venster.removeEventListener("wheel", wiel);
      venster.removeEventListener("keydown", toets);
    };
  }, [duur]);

  return (
    <div
      ref={vensterRef}
      className={styles.venster}
      tabIndex={0}
      role="region"
      aria-roledescription="fotostrook"
      aria-label="Foto's, sleep of gebruik de pijltjestoetsen om te schuiven"
      style={hoogte ? ({ "--strook-hoogte": `${hoogte}px` } as React.CSSProperties) : undefined}
    >
      <div ref={rijRef} className={styles.rij}>
        <Reeks fotos={fotos} />
        <Reeks fotos={fotos} verborgen />
      </div>
    </div>
  );
}
