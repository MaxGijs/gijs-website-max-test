import type { ReactNode } from "react";
import styles from "./Nadruk.module.css";

/**
 * Zet een paar belangrijke woorden in een lopende tekst subtiel in de verf (lichtgroen, vet, iets
 * groter). De tekst zelf blijft gewoon een string, zodat dezelfde uitleg elders (bv. de woningscan)
 * zonder opmaak gebruikt kan worden. Alleen de eerste keer dat een woord voorkomt, wordt gemarkeerd.
 */
export function markeer(tekst: string, woorden: readonly string[] = []): ReactNode {
  if (!woorden.length) return tekst;
  const delen: ReactNode[] = [];
  let rest = tekst;
  for (const woord of woorden) {
    const i = rest.indexOf(woord);
    if (i < 0) continue;
    delen.push(rest.slice(0, i), <strong key={woord} className={styles.nadruk}>{woord}</strong>);
    rest = rest.slice(i + woord.length);
  }
  delen.push(rest);
  return delen;
}
