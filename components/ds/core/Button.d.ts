export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "ghost"
  | "inverse"
  | "outlineInverse"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * The GIJS action control. Pill-shaped, Open Sans semibold.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = donkergroen (default CTA). accent = accentgroen. inverse/outlineInverse are for dark sections. */
  variant?: ButtonVariant;
  /** sm 36px · md 44px (default, meets the 44px touch minimum) · lg 52px */
  size?: ButtonSize;
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  /** Lucide icon name rendered after the label — use "arrow-right" for forward motion. */
  iconRight?: string;
  fullWidth?: boolean;
  /** Swaps the left icon for a spinner and blocks interaction. */
  loading?: boolean;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): JSX.Element;
