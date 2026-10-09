"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import AddressScan from "@/components/AddressScan";
import { TrustStrip } from "@/components/home/TrustStrip";
import { MAATREGELEN, type Annotatie } from "../stappen";
import { markeer } from "../../Nadruk";
import nadruk from "../../Nadruk.module.css";
import { FOCUS, STATEN, type Regie } from "./staten";
import basis from "../../HouseModelPrototype.module.css";
import styles from "../HomeCutawayTest.module.css";

// PROTOTYPE (branch animejs-poppenhuis-prototype): de homepage_woning, met een gescripte reeks van
// 11 staten (gesloten, open, 8 maatregelen, overzicht), geanimeerd met Anime.js v4. Zelfde hero, adresinvoer, scanbalk en scandialoog als
// HomeCutawayTest en dezelfde 8 maatregelteksten. Anime.js zit uitsluitend in de
// apart geladen scène (./AnimeWoningScene.tsx), niet in deze pagina-code.
// Terug naar de huidige versie: in app/page.tsx weer HomeCutawayTest renderen.
const AnimeWoningScene = dynamic(() => import("./AnimeWoningScene"), { ssr: false });

const maatregel = (sleutel: string) => MAATREGELEN.find(m => m.sleutel === sleutel)!;
// Alle 8 maatregelen, in de volgorde van stappen.ts (= staten 2 t/m 9).
const HOOFDSTUKKEN = FOCUS.map(maatregel);

export default function HomepageWoning({ children }: { children?: ReactNode }) {
  const sectie = useRef<HTMLElement>(null);
  const dialoog = useRef<HTMLDialogElement>(null);
  const annotaties = useRef<Record<string, Annotatie>>({});
  const regie = useRef<Regie | null>(null);
  const [staat, setStaat] = useState(0);
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
  // Zwevende scanbalk, zoals op de homepage: zichtbaar na de hero, tot het einde van het woningverhaal.
  const [balk, setBalk] = useState(false);
  useEffect(() => {
    const hero = sectie.current?.querySelector("[data-staat='0']");
    const einde = document.getElementById("na-de-woning");
    if (!hero || !einde) return;
    // Hooguit één meting per frame, hoe vaak het scroll-event ook vuurt.
    let frame = 0;
    const meet = () => {
      frame = 0;
      setBalk(hero.getBoundingClientRect().bottom < 120 && einde.getBoundingClientRect().top > window.innerHeight);
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(meet); };
    meet();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const vorigeOverflow = useRef("");
  const openScan = () => {
    if (!dialoog.current || dialoog.current.open) return;
    vorigeOverflow.current = document.body.style.overflow;
    dialoog.current.showModal();
    document.body.style.overflow = "hidden";
  };
  const focus = STATEN[staat]?.focus;
  const actieve = focus ? maatregel(focus) : null;
  const annotatie = (sleutel: string) => annotaties.current[sleutel] ??= { lijn: null, punt: null, label: null };
  const beeldLabel = actieve
    ? `Doorsnede van de woning, met de nadruk op ${actieve.titel.naam.toLowerCase()}`
    : staat === 0 ? "Illustratieve woning van Gijs" : "Opengewerkte woning van Gijs";

  return (
    <>
      <section ref={sectie} className={basis.story} aria-label="Ontdek waar verduurzamingsmaatregelen in een woning zitten">
        <aside className={`${basis.visualColumn} ${styles.beeldKolom}`} aria-label="De woning tijdens het verhaal">
          <div className={basis.visual} role="img" aria-label={beeldLabel}>
            <div className={basis.halo} />
            <AnimeWoningScene sectie={sectie} onStaat={setStaat} onGeladen={onGeladen} mobiel={mobiel} annotaties={annotaties} regie={regie} />
            {!geladen && <p role="status" className={basis.loading}>De woning wordt geladen…</p>}
            {geladen && <>
            <svg className={styles.lijnen} aria-hidden="true">
              {HOOFDSTUKKEN.map(m => (
                <g key={m.sleutel}>
                  <line ref={el => { annotatie(m.sleutel).lijn = el; }} className={styles.lijn} />
                  <circle ref={el => { annotatie(m.sleutel).punt = el; }} r={4.5} className={styles.punt} />
                </g>
              ))}
            </svg>
            {HOOFDSTUKKEN.map(m => (
              <div key={m.sleutel} ref={el => { annotatie(m.sleutel).label = el; }} className={styles.label} aria-hidden="true">
                <strong>{m.titel.naam}</strong>
                <span>{m.kort}</span>
              </div>
            ))}
            </>}
          </div>
          <p className={styles.bijschrift}>Illustratieve woningweergave · Ontdek waar verduurzamingsmaatregelen in een woning zitten.</p>
        </aside>
        <div className={basis.narrative}>
          {/* Staat 0, gesloten woning: de hero zoals de huidige homepage, met direct de woningscan. */}
          <section className={basis.panel} data-staat={0}>
            <p className={basis.eyebrow}>Groen in je straat</p>
            <h1 className={basis.title}><span className={basis.regel}>Verduurzaam</span> <span className={`${basis.regel} ${basis.regelJ}`}>je woning.</span></h1>
            <p className={basis.description}>Lagere energiekosten, meer wooncomfort en zo energieneutraal mogelijk wonen? Ontdek stap voor stap welke maatregelen daarbij kunnen helpen.</p>
            <div className={basis.scanCard}>
              <h2 className={basis.scanCardTitle}>Start de digitale woningscan</h2>
              <p className={basis.scanCardIntro}>Vul je adres in en ontdek in een paar minuten wat er mogelijk is voor jouw woning.</p>
              <AddressScan />
            </div>
            <p className={basis.checkNote}>Daarna plan je een gratis energiescan aan huis, ter waarde van €349. Je woningtype wordt in de scan automatisch opgehaald.</p>
            <TrustStrip className="mt-4" />
          </section>
          {/* Staat 1, open homepage_woning. */}
          <section id="woning-verhaal" className={basis.panel} data-staat={1}>
            <p className={basis.eyebrow}>Je hoeft geen expert te zijn</p>
            <h2 className={basis.title}>Een comfortabele woning begint bij begrijpen.</h2>
            <p className={basis.description}>Waar verlies je warmte? Via je dak, muren, vloer en ramen kan warmte ontsnappen. Isolatie helpt die binnen te houden.</p>
            <p className={basis.description}>Zelf stroom opwekken? Dat doen je zonnepanelen door middel van zonlicht. Een warmtepomp gebruikt warme buitenlucht om binnen te verwarmen.</p>
            <p className={basis.description}>Kijk mee in de woning. Zo ontdek je waar iedere oplossing zit en wat jij ervan merkt.</p>
            <button type="button" className={basis.inlineScan} onClick={openScan}>Liever meteen jouw woning bekijken? Start de woningscan →</button>
          </section>
          {/* Staten 2-9: de 8 maatregelen. Bestaande teksten uit stappen.ts. */}
          {HOOFDSTUKKEN.map((m, i) => (
            <section key={m.sleutel} className={basis.panel} data-staat={2 + i}>
              <p className={basis.eyebrow}>Onderdeel {i + 1} van {HOOFDSTUKKEN.length}</p>
              <h2 className={basis.maatregelKop}>
                <span className={basis.maatregelNaam}>{m.titel.naam}</span><span className="sr-only">: </span>
                <span className={basis.title}>{m.titel.titel}</span>
              </h2>
              <p className={basis.description}>{markeer(m.titel.uitleg, m.titel.nadruk)}</p>
              {m.extra && <p className={styles.notitie}>{m.extra}</p>}
              <Link className={`${basis.textLink} ${styles.meerLink}`} href={`/maatregelen/${m.titel.slug}`}>Meer over {m.titel.naam.toLowerCase()} <span aria-hidden="true">→</span></Link>
            </section>
          ))}
          {/* Staat 10, overzicht: rustig open homepage_woning, met de woningscan. */}
          <section className={basis.options} data-staat={STATEN.length - 1}>
            <h2 className={basis.title}>Ontdek wat er mogelijk is voor jouw situatie</h2>
            <p className={basis.description}>Vul je adres in. In de woningscan zie je in een paar minuten wat er voor jouw woning kan. Daarna plan je een <strong className={nadruk.nadruk}>gratis energiescan</strong> aan huis, ter waarde van €349.</p>
            <div className={basis.scanCard}>
              <h3 className={basis.scanCardTitle}>Start de woningscan</h3>
              <AddressScan />
            </div>
          </section>
        </div>
      </section>
      <div id="na-de-woning" className={basis.support}>{children}</div>
      <div className={basis.scanBar} hidden={!balk}>
        <span>Wat kan er met jouw woning?</span>
        <button type="button" onClick={openScan}>Start de woningscan <span aria-hidden="true">→</span></button>
      </div>
      <dialog ref={dialoog} className={basis.dialog} aria-labelledby="anime-scan-titel" onClose={() => { document.body.style.overflow = vorigeOverflow.current; }} onClick={e => { if (e.target === dialoog.current) dialoog.current?.close(); }}>
        <div className={basis.dialogBody}>
          <button className={basis.close} type="button" aria-label="Sluit scan" onClick={() => dialoog.current?.close()}>×</button>
          <p className={basis.eyebrow}>Jouw woning als vertrekpunt</p>
          <h2 id="anime-scan-titel">Wat kan er met jouw woning?</h2>
          <p>Vul je adres in en ga verder met de digitale woningscan. Het woningtype wordt daar automatisch opgehaald.</p>
          <AddressScan onNavigate={() => dialoog.current?.close()} />
        </div>
      </dialog>
    </>
  );
}
