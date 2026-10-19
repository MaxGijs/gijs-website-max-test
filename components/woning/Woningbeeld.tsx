"use client";
/* eslint-disable @next/next/no-img-element -- straatbeeld via eigen API-route, wordt niet door next/image geoptimaliseerd of gecachet (Google-voorwaarden). */
import { useState } from "react";
import { Icon } from "@/components/ds/core/Icon";
import { straatbeeldUrl } from "@/lib/straatbeeld";

// Foto van de echte woning in stap 1 ("Klopt dit?"): Google Street View via
// app/api/straatbeeld/route.ts. Tijdens het laden, en als er voor dit adres
// geen straatbeeld is, staat hier een placeholder in hetzelfde kader, zodat de
// rest van de scan niet verschuift.
export function Woningbeeld({ adresLabel }: { adresLabel: string }) {
  const url = straatbeeldUrl(adresLabel);
  return (
    <figure className="m-0 overflow-hidden rounded-[24px] bg-[var(--grey-050)]">
      {url ? (
        // key: bij een ander adres opnieuw beginnen met laden.
        <Straatbeeld key={url} url={url} adresLabel={adresLabel} />
      ) : (
        <Placeholder adresLabel={adresLabel} tekst="Hier verschijnt een foto van je woning zodra het adres bekend is." />
      )}
      <figcaption className="px-4 py-3 text-[13px] text-[var(--text-muted)]">{adresLabel}</figcaption>
    </figure>
  );
}

function Straatbeeld({ url, adresLabel }: { url: string; adresLabel: string }) {
  const [status, setStatus] = useState<"laden" | "geladen" | "geen">("laden");
  if (status === "geen") {
    return <Placeholder adresLabel={adresLabel} tekst="Voor dit adres is (nog) geen straatbeeld beschikbaar." />;
  }
  return (
    <div className="relative aspect-[4/3] w-full">
      {status === "laden" && (
        <div className="absolute inset-0">
          <Placeholder adresLabel={adresLabel} tekst="De foto van je woning wordt geladen…" />
        </div>
      )}
      <img
        src={url}
        alt={`Straatbeeld van ${adresLabel}`}
        className={`block aspect-[4/3] w-full object-cover transition-opacity duration-300 ${status === "geladen" ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setStatus("geladen")}
        onError={() => setStatus("geen")}
      />
    </div>
  );
}

function Placeholder({ adresLabel, tekst }: { adresLabel: string; tekst: string }) {
  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,#eef3f0,#e2ebe6)] px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[var(--accent-700)] shadow-[var(--shadow-1)]">
        <Icon name="map" size="lg" />
      </span>
      <p className="text-[15px] font-semibold text-[var(--gijs-donkergroen)]">Foto van {adresLabel || "je woning"}</p>
      <p className="max-w-[34ch] text-[13px] text-[var(--text-muted)]">{tekst}</p>
    </div>
  );
}
