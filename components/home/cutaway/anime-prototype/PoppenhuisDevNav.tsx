"use client";

import type { RefObject } from "react";
import { STATEN, type Regie } from "./staten";
import styles from "./PoppenhuisDevNav.module.css";

/**
 * TIJDELIJK, ALLEEN VOOR TESTEN (Anime.js-prototype). Springt direct naar een staat zonder te scrollen.
 * Weghalen: dit bestand + PoppenhuisDevNav.module.css verwijderen en de ene regel in AnimePoppenhuis.tsx.
 */
export default function PoppenhuisDevNav({ regie, staat, productie }: { regie: RefObject<Regie | null>; staat: number; productie: boolean }) {
  if (productie) return null;

  return (
    <details className={styles.nav} open>
      <summary>DEV · poppenhuis-staten</summary>
      <div className={styles.knoppen}>
        {STATEN.map((s, i) => (
          <button key={s.id} type="button" aria-pressed={staat === i} onClick={() => regie.current?.naar(i)}>{s.knop}</button>
        ))}
      </div>
      <p className={styles.noot}>Tijdelijk testmenu, niet voor livegang.</p>
    </details>
  );
}
