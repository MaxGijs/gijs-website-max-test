"use client";

import type { RefObject } from "react";
import { STATEN, type Regie } from "./staten";
import styles from "./HomepageWoningDevNav.module.css";

/**
 * TIJDELIJK, ALLEEN VOOR TESTEN (Anime.js-prototype). Springt direct naar een staat zonder te scrollen.
 * Weghalen: dit bestand + HomepageWoningDevNav.module.css verwijderen en de ene regel in HomepageWoning.tsx.
 */
export default function HomepageWoningDevNav({ regie, staat, productie }: { regie: RefObject<Regie | null>; staat: number; productie: boolean }) {
  if (productie) return null;

  return (
    <details className={styles.nav} open>
      <summary>DEV · homepage_woning-staten</summary>
      <div className={styles.knoppen}>
        {STATEN.map((s, i) => (
          <button key={s.id} type="button" aria-pressed={staat === i} onClick={() => regie.current?.naar(i)}>{s.knop}</button>
        ))}
      </div>
      <p className={styles.noot}>Tijdelijk testmenu, niet voor livegang.</p>
    </details>
  );
}
