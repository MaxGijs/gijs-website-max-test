import { Button } from "@/components/ds/core/Button";
import { Badge } from "@/components/ds/core/Badge";
import { Icon } from "@/components/ds/core/Icon";

export default function EnergyScanCTA() {
  return (
    <section id="gratis-energiescan" className="relative bg-[#f4f6f5] scroll-mt-32">
      <a
        href="/contact"
        aria-label="Neem contact op met Gijs"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 no-underline text-sm font-semibold text-[var(--gijs-donkergroen)] hover:text-[var(--accent-700)]"
      >
        <Icon name="message-circle" size="md" />
        <span className="hidden sm:inline">Neem contact op</span>
      </a>

      <div className="max-w-3xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center gap-6">
        <Badge tone="accent">Gratis en vrijblijvend · ter waarde van €349</Badge>
        <h2 className="text-[clamp(2.5rem,1.6rem+3vw,4rem)] leading-[1.05] tracking-[-0.035em] font-bold text-[var(--gijs-donkergroen)] [text-wrap:balance]">
          Gratis energiescan aan huis
        </h2>
        <p className="max-w-xl text-[clamp(18px,1.4vw,21px)] leading-normal text-[var(--text-muted)]">
          Bespreek je huis en je wensen met een adviseur van Gijs. Je digitale
          woningplan helpt je om het gesprek voor te bereiden.
        </p>
        <Button href="/contact#energiescan" variant="primary" size="lg" iconRight="arrow-right">
          Plan een gratis energiescan
        </Button>
      </div>
    </section>
  );
}
