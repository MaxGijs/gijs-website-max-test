import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ds/core/Icon";

// Aangeleverd Gijs-beeld (duurzame wijk aan het water, woningen met
// zonnepanelen) uit de marketing-ZIP — vervangt de eerdere bannerfoto
// op verzoek van Max.
export default function EenheidBanner() {
  return (
    <section className="bg-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="relative mx-auto w-full max-w-[1280px] aspect-[851/315] max-h-[460px] overflow-hidden rounded-[24px] sm:rounded-[32px]">
        <Image
          src="/duurzame-wijk.png"
          alt="Duurzame wijk aan het water met woningen met zonnepanelen"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <Link
          href="/woning"
          className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 inline-flex items-center gap-2 no-underline rounded-[var(--radius-pill)] bg-white/75 hover:bg-white/90 backdrop-blur-xl backdrop-saturate-150 border border-white/60 text-[var(--gijs-donkergroen)] text-sm font-semibold tracking-[-0.01em] px-5 py-3 shadow-[0_10px_40px_rgba(19,62,53,.18)] transition-colors"
        >
          Start de woningscan
          <Icon name="arrow-right" size="sm" />
        </Link>
      </div>
    </section>
  );
}
