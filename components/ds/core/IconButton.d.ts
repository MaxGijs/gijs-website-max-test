export type IconButtonVariant = "plain" | "outline" | "solid" | "inverse";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon name. */
  icon: string;
  /** Required — becomes aria-label and title. */
  label: string;
  variant?: IconButtonVariant;
  /** sm 36px · md 44px · lg 52px. Use md or lg for touch targets. */
  size?: IconButtonSize;
}

export declare function IconButton(props: IconButtonProps): JSX.Element;
