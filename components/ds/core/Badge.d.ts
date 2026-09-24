export type BadgeTone =
  | "neutral"
  | "accent"
  | "dark"
  | "success"
  | "warning"
  | "error"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Status colour. accent = accentgroen tint; dark = donkergroen fill. */
  tone?: BadgeTone;
  /** Optional Lucide icon name before the label. */
  icon?: string;
  children?: React.ReactNode;
}

export declare function Badge(props: BadgeProps): JSX.Element;
