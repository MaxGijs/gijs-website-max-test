import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ds/core/Icon";

// Aangeleverd Gijs-beeld (duurzame wijk aan het water, woningen met
// zonnepanelen) uit de marketing-ZIP — vervangt de eerdere bannerfoto
// op verzoek van Max.
export default function EenheidBanner() {
  return (
    <section className="bg-white">
      <div className="relative w-full aspect-[851/315] max-h-[420px]">
        <Image
          src="/duurzame-wijk.png"
          alt="Duurzame wijk aan het water met woningen met zonnepanelen"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <Link
          href="/woning"
          className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 inline-flex items-center gap-2 no-underline rounded-[var(--radius-pill)] bg-[var(--gijs-donkergroen)]/90 hover:bg-[var(--gijs-donkergroen)] text-white text-sm font-semibold px-5 py-3 shadow-[var(--shadow-2)]"
        >
          Start de woningscan
          <Icon name="arrow-right" size="sm" />
        </Link>
      </div>
    </section>
  );
}
