"use client";

import { useEffect, useRef, useState } from "react";
import type { Timeline, TimelineParams } from "animejs";
import styles from "./InstallatieAnimatie.module.css";

// Speler voor een geanimeerde Gijs-infographic ("... plaatsen in één dag",
// 6 stappen). De scène en regie komen uit een scene.ts per maatregel (gedeeld
// met de video's). Speelt alleen af als hij in beeld is; met "beweging
// verminderen" aan speelt niets vanzelf en toont elke stapknop de eindstand
// van die stap.

export type InstallatieScene = {
  T: number[];
  EIND: number;
  VIEWBOX: string;
  sceneMarkup: (opties: { busLogo: string }) => string;
  bouwTijdlijn: (root: Element, params?: TimelineParams) => Timeline;
};
export type InstallatieStap = { titel: string; tekst: string };


/** Afspeelsnelheid; de tijden in scene.ts blijven de "regie" op normale snelheid. */
const TEMPO = 1.1;

export function InstallatieAnimatie({ scene, stappen, label }: { scene: InstallatieScene; stappen: InstallatieStap[]; label: string }) {
  const { T, EIND } = scene;
  const [markup] = useState(() => scene.sceneMarkup({ busLogo: "/images/shared/logo/logo.png" }));
  const rootRef = useRef<SVGSVGElement>(null);
  const vullingRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<Timeline | null>(null);
  const actiefRef = useRef(0);
  const gepauzeerdRef = useRef(false);
  const zichtbaarRef = useRef(false);
  const minderBewegingRef = useRef(false);
  const [actief, setActief] = useState(0);
  const [gepauzeerd, setGepauzeerd] = useState(false);
  const [minderBeweging, setMinderBeweging] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const minder = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    minderBewegingRef.current = minder;
    setMinderBeweging(minder);

    const sync = (t: number) => {
      let i = 0;
      while (i < T.length - 1 && t >= T[i + 1]) i++;
      if (i !== actiefRef.current) {
        actiefRef.current = i;
        setActief(i);
      }
      vullingRefs.current.forEach((v, j) => {
        if (!v) return;
        const eind = T[j + 1] ?? EIND;
        const p = j < i ? 1 : j > i ? 0 : Math.min(1, (t - T[j]) / (eind - T[j]));
        v.style.transform = `scaleX(${p})`;
      });
    };

    const tl = scene.bouwTijdlijn(root, {
      loop: true,
      loopDelay: 1800,
      playbackRate: TEMPO,
      onUpdate: self => sync(self.iterationCurrentTime),
    });

    tlRef.current = tl;

    if (minder) tl.seek(T[1] - 1);
    else tl.seek(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        zichtbaarRef.current = entry.isIntersecting;
        if (minder) return;
        if (entry.isIntersecting && !gepauzeerdRef.current) tl.play();
        else tl.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      tl.revert();
      tlRef.current = null;
    };
    // De scène ligt per maatregel vast; opnieuw opbouwen is alleen nodig bij een andere scène.
  }, [scene, T, EIND]);

  const gaNaar = (i: number) => {
    const tl = tlRef.current;
    if (!tl) return;
    if (minderBewegingRef.current) {
      tl.seek((T[i + 1] ?? EIND) - 1);
      return;
    }
    tl.seek(T[i]);
    gepauzeerdRef.current = false;
    setGepauzeerd(false);
    tl.play();
  };

  const wissel = () => {
    const tl = tlRef.current;
    if (!tl) return;
    const nu = !gepauzeerdRef.current;
    gepauzeerdRef.current = nu;
    setGepauzeerd(nu);
    if (nu) tl.pause();
    else if (zichtbaarRef.current) tl.play();
  };

  const stap = stappen[actief];

  return (
    <div className={styles.kaart}>
      <div className={styles.kop}>
        <div className={styles.uitleg}>
          <p className={styles.uitlegKop}>Stap {actief + 1}: {stap.titel}</p>
          <p className={styles.uitlegTekst}>{stap.tekst}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- klein decoratief logo, zelfde bestand als in de header */}
        <img src="/images/shared/logo/logo-white.png" alt="" width={912} height={520} className={styles.logo} />
      </div>
      <svg
        ref={rootRef}
        className={styles.podium}
        viewBox={scene.VIEWBOX}
        role="img"
        aria-label={label}
        dangerouslySetInnerHTML={{ __html: markup }}
      />

      <div className={styles.onder}>
        <div className={styles.balk}>
          {!minderBeweging && (
            <button type="button" className={styles.speel} onClick={wissel} aria-label={gepauzeerd ? "Animatie afspelen" : "Animatie pauzeren"}>
              {gepauzeerd ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor" /></svg>
              )}
            </button>
          )}
          <ol className={styles.stappen}>
            {stappen.map((s, i) => (
              <li key={s.titel}>
                <button
                  type="button"
                  className={styles.stapKnop}
                  aria-current={i === actief ? "step" : undefined}
                  aria-label={`Stap ${i + 1}: ${s.titel}`}
                  onClick={() => gaNaar(i)}
                >
                  <span className={styles.spoor}>
                    <span className={styles.vulling} ref={v => { vullingRefs.current[i] = v; }} />
                  </span>
                  <span className={styles.stapLabel}>{i + 1}. {s.titel}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
