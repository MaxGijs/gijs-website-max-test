import React from "react";

// Overgenomen uit de GIJS Design System (components/core/Card.jsx).
export function Card({
  children,
  variant = "default",
  interactive = false,
  flush = false,
  as,
  className = "",
  ...rest
}) {
  const Tag = as || (rest.href ? "a" : "div");
  const cls = [
    "gijs-card",
    variant !== "default" && `gijs-card--${variant}`,
    flush && "gijs-card--flush",
    interactive && "gijs-card--interactive",
    className,
  ].filter(Boolean).join(" ");
  return (
    <Tag className={cls} tabIndex={interactive && Tag === "div" ? 0 : undefined} {...rest}>
      {children}
    </Tag>
  );
}
