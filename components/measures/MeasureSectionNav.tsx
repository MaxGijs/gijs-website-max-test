"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";

// Compacte in-pagina navigatie naar de secties van een maatregelpagina.
// Sticky op desktop (onder de bestaande, ook al sticky, hoofdheader); op mobiel een
// horizontaal scrollende rij zodat er geen overflow ontstaat.
//
// Houdt bij welke sectie momenteel in beeld is en geeft die een groene tekst/underline.
//
// Nov. 2026, drie verbeteringen die voor alle pagina's gelden:
// - Actieve sectie: de drempel volgt nu de scroll-margin van elke sectie. Voorheen lag die vast
//   op 140px, terwijl secties met scroll-mt-40/52 (160/208px) na een klik op een ankerlink
//   dáár stoppen. De aangeklikte sectie werd dan niet actief, maar de vorige bleef groen.
//   Onderaan de pagina wordt de laatste sectie actief, ook als die te kort is om de drempel
//   ooit te halen.
// - Op mobiel schuift de rij zelf mee, zodat de actieve sectie altijd zichtbaar is.
// - Een zachte fade aan de rand laat zien dat er nog meer onderdelen zijn om naartoe te scrollen.
// - De sticky positie volgt de echte hoogte van de hoofdheader (72px boven 1100px, ~81px
//   daaronder), in plaats van een vaste 72px die tussen 768 en 1100px onder de header schoof.
export function MeasureSectionNav({ sections, tweeRegelsMobiel = false }: {
  sections: { id: string; label: string }[];
  /** Op mobiel de onderdelen over meerdere regels laten lopen in plaats van horizontaal te
   *  scrollen, zodat er nooit een half afgesneden item aan de rand staat. Desktop ongewijzigd. */
  tweeRegelsMobiel?: boolean;
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const [fade, setFade] = useState({ links: false, rechts: false });
  const [headerHoogte, setHeaderHoogte] = useState(72);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const ids = sections.map(section => section.id);
    let frame = 0;
    const update = () => {
      frame = 0;
      // Hoofdheader is altijd het eerste <header>-element (de paginahero komt pas in <main>).
      const kop = document.querySelector("header");
      if (kop) setHeaderHoogte(Math.round(kop.getBoundingClientRect().height));

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const marge = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        if (el.getBoundingClientRect().top <= Math.max(140, marge + 8)) current = id;
      }
      const onderaan = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (onderaan) {
        const laatste = document.getElementById(ids[ids.length - 1]);
        if (laatste && laatste.getBoundingClientRect().top < window.innerHeight) current = ids[ids.length - 1];
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

  // Fade aan de randen tonen zolang er in die richting nog iets te scrollen valt.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const meet = () => {
      const max = nav.scrollWidth - nav.clientWidth;
      setFade({ links: nav.scrollLeft > 4, rechts: max - nav.scrollLeft > 4 });
    };
    meet();
    nav.addEventListener("scroll", meet, { passive: true });
    window.addEventListener("resize", meet);
    return () => {
      nav.removeEventListener("scroll", meet);
      window.removeEventListener("resize", meet);
    };
  }, []);

  // Actieve link in beeld schuiven binnen de rij. Bewust nav.scrollTo en geen scrollIntoView:
  // dat laatste zou ook de pagina zelf verticaal laten verspringen.
  useEffect(() => {
    const nav = navRef.current;
    const link = active ? linkRefs.current[active] : null;
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    const links = link.offsetLeft - 24;
    const rechts = link.offsetLeft + link.offsetWidth + 24 - nav.clientWidth;
    if (nav.scrollLeft > links) nav.scrollTo({ left: links, behavior: "smooth" });
    else if (nav.scrollLeft < rechts) nav.scrollTo({ left: rechts, behavior: "smooth" });
  }, [active]);

  return (
    // De gemeten headerhoogte gaat via een CSS-variabele en geldt alleen vanaf md, waar de rij
    // sticky is. Een losse `top` op een niet-sticky (relative) element schuift het juist omlaag.
    <div
      className="relative border-y border-[var(--border-default)] bg-white z-30 md:sticky md:top-[var(--sectienav-top)] md:shadow-[var(--shadow-1)]"
      style={{ "--sectienav-top": `${headerHoogte}px` } as CSSProperties}
    >
      <nav
        ref={navRef}
        aria-label="Onderdelen van deze pagina"
        className={`flex py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          tweeRegelsMobiel
            ? "flex-wrap gap-x-5 gap-y-2 md:flex-nowrap md:gap-6 md:overflow-x-auto md:whitespace-nowrap"
            : "gap-6 overflow-x-auto whitespace-nowrap"
        }`}
      >
        {sections.map(section => {
          const isActive = section.id === active;
          return (
            <a
              key={section.id}
              ref={el => { linkRefs.current[section.id] = el; }}
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
      <span aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 ${fade.links ? "opacity-100" : "opacity-0"}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${fade.rechts ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
