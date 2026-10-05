"use client";
/* eslint-disable @next/next/no-img-element -- kleine, lokale SVG-pictogrammen; geen optimalisatie nodig. */

import type { ReactNode } from "react";
import styles from "./BeeldKeuze.module.css";

// Aangeleverde Gijs-pictogrammen (public/images/woningscan/interface). Voor opties zonder
// aangeleverd pictogram (warm water, "Anders") een eenvoudige lijntekening
// in dezelfde kleur.
const lijn = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const PICTOGRAM_BESTANDEN: Record<string, string> = {
  "Cv-ketel": "/images/woningscan/interface/cv-ketel.svg",
  "Hr-ketel + hybride warmtepomp": "/images/woningscan/interface/ketel_pomp.svg",
  "Stads- of blokverwarming": "/images/woningscan/interface/stadsverwarming.svg",
  "Elektrische warmtepomp": "/images/woningscan/interface/warmtepomp.svg",
  "Normale radiatoren": "/images/woningscan/interface/radiator.svg",
  "Vloerverwarming of lagetemperatuurradiatoren": "/images/woningscan/interface/vloerverwarming.svg",
  "Radiatoren en vloerverwarming": "/images/woningscan/interface/radiator_vloerverwarming.svg",
  Luchtverwarming: "/images/woningscan/interface/luchtverwarming.svg",
  "Weet ik niet": "/images/woningscan/interface/onbekend.svg",
};

// Strakke uitsnede van de eigen lijntekeningen (zelfde marge als de aangeleverde SVG's),
// zodat alle pictogrammen op dezelfde hoogte even groot ogen.
const UITSNEDE: Record<string, [number, number, number, number]> = {
  Anders: [8.8, 6.8, 32.4, 35.4],
  Douche: [10.8, 4.8, 28.4, 38.4],
  "Douche en bad": [2.8, 3.8, 42.4, 39.4],
  "Stortdouche en/of luxe bad": [4.8, 2.8, 38.4, 38.4],
};
const HOOGTE = 56;

const PICTOGRAMMEN: Record<string, ReactNode> = {
  Anders: <><path d="M10 38l3-10 20-20 7 7-20 20z" {...lijn} /><path d="M29 12l7 7M13 28l7 7" {...lijn} /><path d="M26 41h12" {...lijn} /></>,
  Douche: <><path d="M12 42V12a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v2" {...lijn} /><path d="M22 18h16" {...lijn} /><path d="M24 24l-1 4M30 24v4M36 24l1 4M26 32l-1 4M34 32l1 4M30 32v5" {...lijn} /></>,
  "Douche en bad": <><path d="M8 20V9a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4" {...lijn} /><path d="M14 13h10M16 17v3M22 17v3" {...lijn} /><path d="M4 26h40v4a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8z" {...lijn} /><path d="M10 38l-2 4M38 38l2 4" {...lijn} /></>,
  "Stortdouche en/of luxe bad": <><rect x="10" y="4" width="28" height="6" rx="3" {...lijn} /><path d="M14 15v6M20 15v8M26 15v8M32 15v6M17 27v5M23 27v6M29 27v5" {...lijn} /><path d="M6 40h36" {...lijn} /><path d="M24 36l1.5 1.5L27 36" {...lijn} /></>,
};

const toggleIn = (lijst: string[], id: string) => (lijst.includes(id) ? lijst.filter((x) => x !== id) : [...lijst, id]);

/**
 * Meerkeuze uit een reeks opties als grote beeldkaarten (echte selectievak-
 * jes, dus met toetsenbord te bedienen). Meerdere opties tegelijk mogelijk,
 * want sommige woningen hebben bijvoorbeeld zowel een cv-ketel als een
 * houtkachel, of zowel een douche als een bad.
 */
export function BeeldKeuze({ legend, uitleg, opties, waarde, onChange, verplicht = false, anders }: { legend: string; uitleg?: string; opties: readonly string[]; waarde: string[]; onChange: (v: string[]) => void; verplicht?: boolean; anders?: { waarde: string; onChange: (v: string) => void } }) {
  return (
    <fieldset className={styles.groep}>
      <legend className={styles.legend}>{legend}{verplicht && <span className="sr-only"> (verplicht, kies minstens één)</span>}</legend>
      {uitleg && <p className={styles.uitleg}>{uitleg}</p>}
      <div className={styles.kaarten}>
        {opties.map((optie) => (
          <label key={optie} className={styles.kaart}>
            <input type="checkbox" value={optie} checked={waarde.includes(optie)} onChange={() => onChange(toggleIn(waarde, optie))} />
            {PICTOGRAM_BESTANDEN[optie]
              ? <img className={styles.pictogram} src={PICTOGRAM_BESTANDEN[optie]} alt="" aria-hidden="true" />
              : <svg className={styles.beeld} viewBox={(UITSNEDE[optie] ?? [0, 0, 48, 48]).join(" ")} style={{ width: HOOGTE * (UITSNEDE[optie]?.[2] ?? 48) / (UITSNEDE[optie]?.[3] ?? 48) }} aria-hidden="true">{PICTOGRAMMEN[optie]}</svg>}
            <span className={styles.label}>{optie}</span>
          </label>
        ))}
      </div>
      {anders && waarde.includes("Anders") && (
        <label className={styles.andersVeld}>
          <span>Anders, namelijk</span>
          <input className="gijs-input" maxLength={120} value={anders.waarde} onChange={e => anders.onChange(e.target.value)} autoFocus />
        </label>
      )}
    </fieldset>
  );
}
