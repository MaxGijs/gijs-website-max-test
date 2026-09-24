import React from "react";

// Overgenomen uit de GIJS Design System (components/core/Icon.jsx).
// Lucide-iconen als currentColor-gemaskeerde achtergrond; GIJS heeft
// zelf geen icon set aangeleverd (zie readme.md van het design system).
const LUCIDE_BASE = "https://unpkg.com/lucide-static@0.544.0/icons/";

export function Icon({ name, size = "md", label, className = "", style, ...rest }) {
  const url = `url("${LUCIDE_BASE}${name}.svg")`;
  return (
    <span
      {...rest}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      className={`gijs-icon gijs-icon--${size} ${className}`.trim()}
      style={{ WebkitMaskImage: url, maskImage: url, ...style }}
    />
  );
}
