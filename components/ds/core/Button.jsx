import React from "react";
import { Icon } from "./Icon.jsx";

// Overgenomen uit de GIJS Design System (components/core/Button.jsx).
export function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
  href,
  className = "",
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const cls = [
    "gijs-btn",
    `gijs-btn--${variant}`,
    size !== "md" && `gijs-btn--${size}`,
    fullWidth && "gijs-btn--block",
    className,
  ].filter(Boolean).join(" ");
  return (
    <Tag
      className={cls}
      href={href}
      disabled={Tag === "button" ? disabled || loading : undefined}
      aria-disabled={Tag === "a" && (disabled || loading) ? "true" : undefined}
      type={Tag === "button" ? rest.type || "button" : undefined}
      {...rest}
    >
      {loading && <span className="gijs-btn__spinner" />}
      {!loading && iconLeft && <Icon name={iconLeft} size="sm" />}
      {children}
      {iconRight && <Icon name={iconRight} size="sm" />}
    </Tag>
  );
}
