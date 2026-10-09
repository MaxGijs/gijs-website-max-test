import React from "react";
import * as LucideIcons from "lucide-react";

// Overgenomen uit de GIJS Design System (components/core/Icon.jsx), hier
// omgezet naar het lokaal gebundelde lucide-react in plaats van Lucide-SVG's
// bij elke weergave vanaf unpkg.com op te halen (geen externe runtime-
// afhankelijkheid, werkt ook offline/in CI en bij een geblokkeerde CDN).
// `name` blijft kebab-case (bv. "arrow-right"); dat wordt hier vertaald naar
// de PascalCase-componentnaam die lucide-react gebruikt (bv. "ArrowRight").
function naarComponentNaam(name) {
  return name.split("-").map(deel => deel.charAt(0).toUpperCase() + deel.slice(1)).join("");
}

export function Icon({ name, size = "md", label, className = "", style, ...rest }) {
  const Component = LucideIcons[naarComponentNaam(name)];
  return (
    <span
      {...rest}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      className={`gijs-icon gijs-icon--${size} ${className}`.trim()}
      style={style}
    >
      {Component && <Component width="100%" height="100%" aria-hidden="true" focusable="false" />}
    </span>
  );
}
