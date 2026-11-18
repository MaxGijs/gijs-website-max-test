import type { ReactNode } from "react";
import Image from "next/image";
import { FotoOvergang } from "@/components/FotoOvergang";

// Foto binnen de artikeltekst: bestaande, goedgekeurde Gijs-beelden, vaste 3:2-uitsnede, afgeronde
// hoeken zoals op de maatregelpagina's. `priority` alleen voor de bovenste foto.
export function ArtikelFoto({ src, alt, priority = false, overgang }: { src: string; alt: string; priority?: boolean; overgang?: string }) {
  const foto = (
    <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--grey-050)]">
      <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
    </div>
  );
  return (
    <figure className="mx-0 my-8">
      {overgang ? <FotoOvergang id={overgang}>{foto}</FotoOvergang> : foto}
    </figure>
  );
}

// Gedeelde opmaak voor kennisartikelen: leesbare kolombreedte, Gijs-typografie, ruimte tussen
// alinea's. Koppen krijgen een id zodat ze direct te linken zijn.
export const ARTIKEL_TEKST =
  "max-w-[68ch] text-[clamp(16px,0.95rem+0.2vw,18px)] leading-[1.7] text-zinc-700 [text-wrap:pretty] [&>p]:mb-5";

export function ArtikelH2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-32 mt-12 mb-4 text-[clamp(1.5rem,1.15rem+1.2vw,2.125rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">
      {children}
    </h2>
  );
}
