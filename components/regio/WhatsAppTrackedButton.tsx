"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ds/core/Button";
import { trackIfWhatsApp } from "@/lib/analytics";

/**
 * Drop-in vervanger voor <Button> op plekken waar de bestemming (href) uit content/CTA-data komt en
 * dus niet altijd naar WhatsApp wijst (bv. soms "/woning", soms een wa.me-link) — zoals de
 * regiopagina's in LokalePagina.tsx. Vuurt whatsapp_clicked alleen als href écht naar wa.me wijst.
 *
 * Nodig als losse "use client"-component omdat de paginas die dit renderen server components zijn:
 * een functie (onClick) kan niet rechtstreeks van een server component naar <Button> (ook een server
 * component) doorgegeven worden. Zelfde patroon als RegioWoningscanKnop.tsx voor "Start de
 * woningscan": alleen het interactieve knopje is client, de rest van de pagina blijft server-gerenderd.
 */
export function WhatsAppTrackedButton({ plaats, ...props }: ButtonProps & { plaats: string }) {
  return <Button {...props} onClick={trackIfWhatsApp(props.href, plaats)} />;
}

/** Zelfde reden en patroon als hierboven, voor een gewone tekstlink (next/link) in plaats van een knop. */
export function WhatsAppTrackedLink({
  plaats,
  href,
  children,
  ...props
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode; plaats: string }) {
  return (
    <Link href={href} {...props} onClick={trackIfWhatsApp(href, plaats)}>
      {children}
    </Link>
  );
}
