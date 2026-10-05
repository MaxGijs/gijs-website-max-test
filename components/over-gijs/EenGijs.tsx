import Image from "next/image";
import { EEN_GIJS } from "@/lib/content/over-gijs";
import styles from "./EenGijs.module.css";

// Vier "Een Gijs…"-momenten, elk met een eigen beeld. Tekst en beeld wisselen
// van kant per moment (niet steeds hetzelfde sjabloon), zie
// lib/content/over-gijs.ts voor de herkomst van elk beeld.
export function EenGijs() {
  return (
    <div className="max-w-6xl mx-auto px-6 flex flex-col gap-2">
      {EEN_GIJS.map((item, i) => (
        <div key={item.kop} className={`${styles.paneel} ${styles.opkomen}`}>
          <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "" : "lg:[&>*:first-child]:order-2"}`}>
            <div className="flex flex-col gap-5 max-w-lg">
              <h3 className={styles.uitspraak}>
                <span className={styles.vast}>Een Gijs</span>
                <span className={styles.kop}>{item.kop}</span>
              </h3>
              <p className={styles.tekst}>{item.tekst}</p>
            </div>
            <div className={styles.beeldKader}>
              <Image src={item.beeld} alt={item.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" style={{ objectPosition: item.positie }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
