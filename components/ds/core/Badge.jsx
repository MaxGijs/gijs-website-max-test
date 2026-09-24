import React from "react";
import { Icon } from "./Icon.jsx";

// Overgenomen uit de GIJS Design System (components/core/Badge.jsx).
export function Badge({ children, tone = "neutral", icon, className = "", ...rest }) {
  return (
    <span className={`gijs-badge gijs-badge--${tone} ${className}`.trim()} {...rest}>
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </span>
  );
}
