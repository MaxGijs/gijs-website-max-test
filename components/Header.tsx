"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ds/core/Icon";
import { Button } from "@/components/ds/core/Button";
import SocialLinks from "@/components/SocialLinks";
import styles from "./Header.module.css";

type NavLink = { label: string; href: string; external?: boolean };
type NavGroup = { label: string; items: NavLink[] };
type NavEntry =
  | { type: "link"; label: string; href: string }
  | { type: "group"; label: string; items: NavLink[] }
  | { type: "verduurzamen"; label: string };

// Maatregel-categorieën voor de geneste "Maatregelen"-flyout binnen het
// "Verduurzamen"-dropdown (desktop: zijwaarts openende submenu's op hover,
// zoals de navigatie oorspronkelijk was; mobiel: geneste accordion).
// Routes zijn de bestaande maatregelpagina's — geen nieuwe routes.
const ISOLATIE_ITEMS: NavLink[] = [
  { label: "Dakisolatie", href: "/maatregelen/dakisolatie" },
  { label: "Spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" },
  { label: "Vloerisolatie", href: "/maatregelen/vloerisolatie" },
  { label: "Isolatieglas", href: "/maatregelen/isolatieglas" },
  { label: "Kozijnen", href: "/maatregelen/kozijnen" },
];
const INSTALLATIES_ITEMS: NavLink[] = [
  { label: "Zonnepanelen", href: "/maatregelen/zonnepanelen" },
  { label: "Hybride warmtepomp", href: "/maatregelen/warmtepomp" },
  { label: "Vloerverwarming", href: "/maatregelen/vloerverwarming" },
  { label: "Thuisbatterij", href: "/maatregelen/thuisbatterij" },
  { label: "Ketel", href: "/maatregelen/ketel" },
];
// Overige "Verduurzamen"-links, ongewijzigd t.o.v. de oorspronkelijke navigatie.
const VERDUURZAMEN_FOOTER_LINKS: NavLink[] = [
  { label: "Zo werkt Gijs", href: "/zo-werkt-gijs" },
  { label: "Kennis", href: "/kennis" },
];

const NAV: NavEntry[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "verduurzamen", label: "Verduurzamen" },
  {
    type: "group",
    label: "Over Gijs",
    items: [
      { label: "Over Gijs", href: "/over-gijs" },
      { label: "Cases", href: "/cases" },
    ],
  },
  { type: "link", label: "Contact", href: "/contact" },
];

function NavItemLink({ item, className, onClick }: { item: NavLink; className: string; onClick?: () => void }) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`${className} inline-flex items-center gap-1.5`}
      >
        {item.label}
        <Icon name="external-link" size="sm" />
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {item.label}
    </Link>
  );
}

function NavDropdown({ label, items }: NavGroup) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={styles.dropdownButton}
      >
        {label}
        <Icon name="chevron-down" size="md" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full mt-1 min-w-[220px] bg-white rounded-[var(--radius-card)] border border-[var(--grey-200)] shadow-[var(--shadow-2)] py-2 z-50"
        >
          {items.map((item) => (
            <NavItemLink
              key={item.href}
              item={item}
              onClick={() => setOpen(false)}
              className="block no-underline px-4 py-2 text-sm font-medium text-[var(--gijs-donkergroen)] hover:bg-[var(--accent-050)] hover:text-[var(--accent-700)]"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Een rij binnen een flyout-menu die zelf weer een submenu opent op
// hover (zijwaarts, naar rechts) — gebruikt voor "Maatregelen" (opent
// Isolatie/Installaties) en voor "Isolatie"/"Installaties" daarbinnen
// (openen de losse maatregelitems). Sluit pas na een korte vertraging bij
// het verlaten met de muis, zodat diagonaal naar het submenu bewegen niet
// per ongeluk het menu sluit.
function FlyoutRow({ label, href, children, onNavigate }: { label: string; href?: string; children: ReactNode; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const Label = href ? (
    <Link href={href} onClick={onNavigate} className={styles.flyoutTrigger} aria-haspopup="true" aria-expanded={open}>
      {label}
      <Icon name="chevron-right" size="sm" />
    </Link>
  ) : (
    <button type="button" onClick={() => setOpen(v => !v)} className={`${styles.flyoutTrigger} w-full`} aria-haspopup="true" aria-expanded={open}>
      {label}
      <Icon name="chevron-right" size="sm" />
    </button>
  );

  // Ook met toetsenbord (focus) en touch (tik op de knop) te openen, niet alleen via hover.
  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeSoon(); }}
    >
      {Label}
      {open && (
        <div className={styles.flyoutPanel}>
          {children}
        </div>
      )}
    </div>
  );
}

// Desktop-dropdown voor "Verduurzamen", met de oorspronkelijke
// zijwaarts-openende submenu-structuur: hover op "Maatregelen" toont
// Isolatie/Installaties, hover op een van die twee toont de losse
// maatregelitems.
function VerduurzamenDropdown({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={styles.dropdownButton}
      >
        {label}
        <Icon name="chevron-down" size="md" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-[220px] bg-white rounded-[var(--radius-card)] border border-[var(--grey-200)] shadow-[var(--shadow-2)] py-2 z-50">
          <FlyoutRow label="Maatregelen" href="/maatregelen" onNavigate={close}>
            <FlyoutRow label="Isolatie" onNavigate={close}>
              {ISOLATIE_ITEMS.map(item => (
                <Link key={item.href} href={item.href} onClick={close} className={styles.megaLink}>
                  {item.label}
                </Link>
              ))}
            </FlyoutRow>
            <FlyoutRow label="Installaties" onNavigate={close}>
              {INSTALLATIES_ITEMS.map(item => (
                <Link key={item.href} href={item.href} onClick={close} className={styles.megaLink}>
                  {item.label}
                </Link>
              ))}
            </FlyoutRow>
          </FlyoutRow>
          {VERDUURZAMEN_FOOTER_LINKS.map((item) => (
            <NavItemLink
              key={item.href}
              item={item}
              onClick={close}
              className="block no-underline px-4 py-2 text-sm font-medium text-[var(--gijs-donkergroen)] hover:bg-[var(--accent-050)] hover:text-[var(--accent-700)]"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Mobiele geneste accordion: één buitenste sectie (bijv. "Isolatie") die
// open/dicht klapt en daarbinnen de losse maatregellinks toont.
function MobileSubAccordion({ label, items, onNavigate }: { label: string; items: NavLink[]; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} className={styles.mobileSubButton}>
        {label}
        <Icon name={open ? "chevron-up" : "chevron-down"} size="sm" />
      </button>
      {open && (
        <div className={styles.mobileSubPanel}>
          {items.map(item => (
            <Link key={item.href} href={item.href} onClick={onNavigate}>{item.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggle = useRef<HTMLButtonElement>(null);

  return (
    <header className={styles.header} onKeyDown={event => { if (event.key === "Escape" && mobileOpen) { setMobileOpen(false); mobileToggle.current?.focus(); } }}>
      {/* Hoofdbalk: hoogte = --header-h (76px), logo groter */}
      <div className={styles.brandRow}>
        <Link href="/" className="no-underline flex items-center">
          <Image src="/logo-white.png" alt="Gijs" width={912} height={520} style={{ height: "auto" }} className={styles.logo} priority />
        </Link>

        {/* Social media (op verzoek van Max), rechtsboven naast het
            logo — alleen zichtbaar vanaf md, en pas zodra er echte
            links in lib/content/social.ts staan. */}
        <div className={styles.social}>
          <SocialLinks />
        </div>

        {/* Hamburger: alleen op smalle schermen, waar de secundaire
            navigatiebalk verborgen is. */}
        <button
          ref={mobileToggle}
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobiel-menu"
          aria-label={mobileOpen ? "Sluit menu" : "Open menu"}
          className={styles.mobileToggle}
        >
          <Icon name={mobileOpen ? "x" : "menu"} size="xl" />
        </button>
      </div>

      {/* Secundaire navigatiebalk (desktop/tablet) */}
      <nav aria-label="Hoofdnavigatie" className={styles.desktopNav}>
        {NAV.map((entry) => {
          if (entry.type === "link") {
            return (
              <Link key={entry.href} href={entry.href} className={styles.navLink}>
                {entry.label}
              </Link>
            );
          }
          if (entry.type === "verduurzamen") {
            return <VerduurzamenDropdown key={entry.label} label={entry.label} />;
          }
          return <NavDropdown key={entry.label} label={entry.label} items={entry.items} />;
        })}

        <div className="ml-auto">
          {/* Secundaire CTA (sectie "Header" van de opdracht): linkt naar
              het "Gratis energiescan"-blok onderaan de homepage. Vanaf
              een andere pagina navigeert dit eerst naar home en scrollt
              de browser daarna naar het anker. */}
          <Button href="/contact#energiescan" variant="accent" size="md">
            Plan een gratis energiescan
          </Button>
        </div>
      </nav>

      {/* Mobiel menu: geneste accordion voor "Verduurzamen"
          (Isolatie/Installaties als losse uitklapbare subsecties),
          overige entries blijven platte links. */}
      {mobileOpen && (
        <nav
          id="mobiel-menu"
          aria-label="Mobiele navigatie"
          className={styles.mobileNav}
        >
          {NAV.map((entry) => {
            const closeMenu = () => setMobileOpen(false);
            if (entry.type === "link") {
              return (
                <NavItemLink
                  key={entry.href}
                  item={entry}
                  onClick={closeMenu}
                  className="no-underline hover:text-[var(--accent-700)] py-2 border-b border-[var(--grey-100)]"
                />
              );
            }
            if (entry.type === "verduurzamen") {
              return (
                <div key={entry.label} className="border-b border-[var(--grey-100)]">
                  <p className="font-bold text-[var(--gijs-donkergroen)] pt-4 pb-1">{entry.label}</p>
                  <Link href="/maatregelen" onClick={closeMenu} className="block no-underline text-sm font-semibold text-[var(--accent-700)] py-2">
                    Maatregelen: bekijk alle mogelijkheden
                  </Link>
                  <MobileSubAccordion label="Isolatie" items={ISOLATIE_ITEMS} onNavigate={closeMenu} />
                  <MobileSubAccordion label="Installaties" items={INSTALLATIES_ITEMS} onNavigate={closeMenu} />
                  <div className="flex flex-col pb-2">
                    {VERDUURZAMEN_FOOTER_LINKS.map(item => (
                      <NavItemLink
                        key={item.href}
                        item={item}
                        onClick={closeMenu}
                        className="no-underline text-sm hover:text-[var(--accent-700)] py-2"
                      />
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={entry.label} className="flex flex-col border-b border-[var(--grey-100)]">
                <p className="font-bold text-[var(--gijs-donkergroen)] pt-4 pb-1">{entry.label}</p>
                {entry.items.map(item => (
                  <NavItemLink
                    key={item.href}
                    item={item}
                    onClick={closeMenu}
                    className="no-underline hover:text-[var(--accent-700)] py-2"
                  />
                ))}
              </div>
            );
          })}
          <div onClick={() => setMobileOpen(false)}><Button href="/contact#energiescan" variant="accent" size="md" fullWidth className="mt-3">Plan een gratis energiescan</Button></div>
          <div className="mt-4"><SocialLinks /></div>
        </nav>
      )}
    </header>
  );
}
