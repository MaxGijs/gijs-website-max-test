export type CardVariant = "default" | "elevated" | "tint" | "muted" | "dark";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** default = white with hairline border. tint = accent-050. dark = donkergroen. */
  variant?: CardVariant;
  /** Adds lift-on-hover, press feedback and a focus ring. */
  interactive?: boolean;
  /** Removes padding and clips children — for cards that open with an image. */
  flush?: boolean;
  /** Override the element ("article", "li", "a", …). */
  as?: keyof JSX.IntrinsicElements;
  href?: string;
  children?: React.ReactNode;
}

export declare function Card(props: CardProps): JSX.Element;
