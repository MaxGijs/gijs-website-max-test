"use client";
import { useEffect, useState } from "react";

// Compacte in-pagina navigatie naar de secties van een maatregelpagina.
// Sticky op desktop (onder de bestaande, ook al sticky, hoofdheader);
// op mobiel een horizontaal scrollende rij zodat er geen overflow ontstaat.
//
// Houdt bij welke sectie momenteel in beeld is (IntersectionObserver) en
// geeft die een groene tekst/underline — puur visuele status, geen nieuwe
// navigatiefunctionaliteit.
export function MeasureSectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const ids = sections.map(section => section.id);
    // Net onder de sticky hoofdheader + deze subnav zelf: de laatste
    // sectie waarvan de bovenkant deze lijn al is gepasseerd, is de
    // actieve sectie. Een simpele "laatste die de lijn passeerde"-check
    // in plaats van IntersectionObserver-drempels, zodat een snelle
    // sprong (of toetsenbordnavigatie) nooit een sectie kan overslaan.
    const threshold = 140;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // Secties zijn vaste content per pagina; alleen bij mount opnieuw koppelen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      aria-label="Onderdelen van deze pagina"
      className="flex gap-6 overflow-x-auto whitespace-nowrap border-y border-[var(--border-default)] bg-white py-3 md:sticky md:top-[72px] md:z-30"
    >
      {sections.map(section => {
        const isActive = section.id === active;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            className={`text-sm font-semibold no-underline shrink-0 pb-1 border-b-2 transition-colors ${
              isActive
                ? "text-[var(--green-800)] border-[var(--green-800)]"
                : "text-zinc-600 border-transparent hover:text-[var(--accent-700)]"
            }`}
          >
            {section.label}
          </a>
        );
      })}
    </nav>
  );
}
