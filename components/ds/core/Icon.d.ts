export type IconSize = "sm" | "md" | "lg" | "xl";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon name in kebab-case, e.g. "house", "leaf", "arrow-right". */
  name: string;
  /** sm = 1em, md = 1.25em, lg = 1.75em, xl = 2.5em. Scales with font-size. */
  size?: IconSize;
  /** Accessible label. Omit for decorative icons (then aria-hidden is set). */
  label?: string;
}

export declare function Icon(props: IconProps): JSX.Element;
