import { Button } from "@/components/ds/core/Button";
import { Badge } from "@/components/ds/core/Badge";
import { Icon } from "@/components/ds/core/Icon";

export default function EnergyScanCTA() {
  return (
    <section id="gratis-energiescan" className="relative bg-[var(--grey-050)] scroll-mt-32">
      <a
        href="/contact"
        aria-label="Neem contact op met Gijs"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 no-underline text-sm font-semibold text-[var(--gijs-donkergroen)] hover:text-[var(--accent-700)]"
      >
        <Icon name="message-circle" size="md" />
        <span className="hidden sm:inline">Neem contact op</span>
      </a>

      <div className="max-w-3xl mx-auto px-6 py-[var(--section-y)] flex flex-col items-center text-center gap-5">
        <Badge tone="accent">Gratis en vrijblijvend · ter waarde van €289</Badge>
        <h2 className="text-[var(--fs-display-2)] font-bold text-[var(--gijs-donkergroen)]">
          Gratis energiescan aan huis
        </h2>
        <p className="max-w-xl text-zinc-700">
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
