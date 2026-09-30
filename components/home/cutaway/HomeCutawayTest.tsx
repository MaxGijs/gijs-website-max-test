"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import AddressScan from "@/components/AddressScan";
import { EERSTE, EIND, MAATREGELEN, subsidieRegel, type Annotatie } from "./stappen";
import basis from "../HouseModelPrototype.module.css";
import styles from "./HomeCutawayTest.module.css";

// PROTOTYPE (branch homepage-cutaway-test): de bestaande Gijs-woning als
// architectonische doorsnede (poppenhuis), met de 8 hoofdstukken van de
// homepage. De 3D-scène (./WoningScene.tsx) wordt apart geladen, zodat de
// hero en de adresinvoer direct bruikbaar zijn.
const WoningScene = dynamic(() => import("./WoningScene"), { ssr: false });

export default function HomeCutawayTest({ children }: { children?: ReactNode }) {
  const sectie = useRef<HTMLElement>(null);
  const dialoog = useRef<HTMLDialogElement>(null);
  const annotaties = useRef<Record<string, Annotatie>>({});
  const [stap, setStap] = useState(0);
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
    const update = () => {
      const hero = sectie.current?.querySelector("[data-stap='0']");
      const einde = document.getElementById("na-de-woning");
      setBalk(Boolean(hero && einde && hero.getBoundingClientRect().bottom < 120 && einde.getBoundingClientRect().top > window.innerHeight));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const vorigeOverflow = useRef("");
  const openScan = () => {
    if (!dialoog.current || dialoog.current.open) return;
    vorigeOverflow.current = document.body.style.overflow;
    dialoog.current.showModal();
    document.body.style.overflow = "hidden";
  };
  const actieve = stap >= EERSTE && stap < EIND ? MAATREGELEN[stap - EERSTE] : null;
  const annotatie = (sleutel: string) => annotaties.current[sleutel] ??= { lijn: null, punt: null, label: null };

  return (
    <>
      <section ref={sectie} className={basis.story} aria-label="Ontdek waar verduurzamingsmaatregelen in een woning zitten">
        <aside className={`${basis.visualColumn} ${styles.beeldKolom}`} aria-label="De woning tijdens het verhaal">
          <div className={basis.visual} role="img" aria-label={actieve ? `Doorsnede van de woning, met de nadruk op ${actieve.titel.naam.toLowerCase()}` : "Illustratieve woning van Gijs"}>
            <div className={basis.halo} />
            <WoningScene sectie={sectie} onStap={setStap} onGeladen={onGeladen} mobiel={mobiel} annotaties={annotaties} />
            {!geladen && <p role="status" className={basis.loading}>De woning wordt geladen…</p>}
            {/* Annotaties pas na het laden van de woning: zo staan ze niet vóór de H1 in de HTML. */}
            {geladen && <>
            <svg className={styles.lijnen} aria-hidden="true">
              {MAATREGELEN.map(m => (
                <g key={m.sleutel}>
                  <line ref={el => { annotatie(m.sleutel).lijn = el; }} className={styles.lijn} />
                  <circle ref={el => { annotatie(m.sleutel).punt = el; }} r={4.5} className={styles.punt} />
                </g>
              ))}
            </svg>
            {MAATREGELEN.map(m => (
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
          {/* Hero zoals de huidige homepage, met direct de woningscan; zonder woningtypekeuze (die gebeurt in de scan). */}
          <section className={basis.panel} data-stap={0}>
            <p className={basis.eyebrow}>Groen in je straat</p>
            <h1 className={basis.title}>Verduurzaam je woning.</h1>
            <p className={basis.description}>Lagere energiekosten, meer wooncomfort of zo energieneutraal mogelijk wonen? Ontdek stap voor stap welke maatregelen daarbij kunnen helpen.</p>
            <div className={basis.scanCard}>
              <h2 className={basis.scanCardTitle}>Start de digitale woningscan</h2>
              <p className={basis.scanCardIntro}>Vul je adres in en ontdek in een paar minuten wat er mogelijk is voor jouw woning.</p>
              <AddressScan />
            </div>
            <p className={basis.checkNote}>Daarna plan je een gratis energiescan aan huis, ter waarde van €349. Je woningtype wordt in de scan automatisch opgehaald.</p>
            <a className={basis.textLink} href="#woning-verhaal">Neem een kijkje in de woning ↓</a>
          </section>
          <section id="woning-verhaal" className={basis.panel} data-stap={1}>
            <p className={basis.eyebrow}>Je hoeft geen expert te zijn</p>
            <h2 className={basis.title}>Een fijne woning begint bij begrijpen.</h2>
            <p className={basis.description}>Waar blijft de warmte? Via je dak, muren, vloer en ramen kan warmte ontsnappen. Isolatie helpt die binnen te houden.</p>
            <p className={basis.description}>Zelf stroom maken? Dat doen zonnepanelen met zonlicht. Een warmtepomp gebruikt stroom om warmte van buiten naar binnen te brengen.</p>
            <p className={basis.description}>Kijk mee in de woning. Zo ontdek je waar iedere oplossing zit en wat jij ervan merkt.</p>
            <button type="button" className={basis.inlineScan} onClick={openScan}>Liever meteen jouw woning bekijken? Start de woningscan →</button>
          </section>
          {MAATREGELEN.map((m, i) => (
            <section key={m.sleutel} className={basis.panel} data-stap={EERSTE + i}>
              <p className={basis.eyebrow}>Onderdeel {i + 1} van {MAATREGELEN.length}</p>
              <h2 className={basis.maatregelKop}>
                <span className={basis.maatregelNaam}>{m.titel.naam}</span><span className="sr-only">: </span>
                <span className={basis.title}>{m.titel.titel}</span>
              </h2>
              <p className={basis.description}>{m.titel.uitleg}</p>
              <p className={basis.benefit}>{m.benefit}</p>
              {subsidieRegel(m.subsidie) && <p className={styles.subsidie}>{subsidieRegel(m.subsidie)} Gijs helpt bij de aanvraag, maar kan toekenning niet garanderen.</p>}
              <Link className={`${basis.textLink} ${styles.meerLink}`} href={`/maatregelen/${m.titel.slug}`}>Meer over {m.titel.naam.toLowerCase()} <span aria-hidden="true">→</span></Link>
            </section>
          ))}
          <section className={basis.options} data-stap={EIND}>
            <h2 className={basis.title}>Ontdek wat er mogelijk is voor jouw woning</h2>
            <p className={basis.description}>Vul je adres in. In de woningscan zie je in een paar minuten wat er voor jouw woning kan. Daarna plan je een gratis energiescan aan huis, ter waarde van €349.</p>
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
      <dialog ref={dialoog} className={basis.dialog} aria-labelledby="cutaway-scan-titel" onClose={() => { document.body.style.overflow = vorigeOverflow.current; }} onClick={e => { if (e.target === dialoog.current) dialoog.current?.close(); }}>
        <div className={basis.dialogBody}>
          <button className={basis.close} type="button" aria-label="Sluit scan" onClick={() => dialoog.current?.close()}>×</button>
          <p className={basis.eyebrow}>Jouw woning als vertrekpunt</p>
          <h2 id="cutaway-scan-titel">Wat kan er met jouw woning?</h2>
          <p>Vul je adres in en ga verder met de digitale woningscan. Het woningtype wordt daar automatisch opgehaald.</p>
          <AddressScan onNavigate={() => dialoog.current?.close()} />
        </div>
      </dialog>
    </>
  );
}
