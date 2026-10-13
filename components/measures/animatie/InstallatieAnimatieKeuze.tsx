"use client";

import { useState } from "react";
import { InstallatieAnimatie, type InstallatieScene, type InstallatieStap } from "./InstallatieAnimatie";
import styles from "./InstallatieAnimatie.module.css";

// Voor maatregelen met meerdere uitvoeringsmethodes (bijv. dakisolatie met
// platen of inblazen): een rustige keuze boven de animatie. Elke methode heeft
// een eigen scène; bij wisselen begint de animatie bij stap 1.

export type InstallatieVariant = { label: string; scene: InstallatieScene; stappen: InstallatieStap[]; animatieLabel: string };

export function InstallatieAnimatieKeuze({ varianten, vraag }: { varianten: InstallatieVariant[]; vraag: string }) {
  const [actief, setActief] = useState(0);
  const variant = varianten[actief];
  return (
    <div>
      <div className={styles.keuze} role="radiogroup" aria-label={vraag}>
        {varianten.map((v, i) => (
          <button
            key={v.label}
            type="button"
            role="radio"
            aria-checked={i === actief}
            className={styles.keuzeKnop}
            onClick={() => setActief(i)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <InstallatieAnimatie key={variant.label} scene={variant.scene} stappen={variant.stappen} label={variant.animatieLabel} />
    </div>
  );
}
