export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  /** Makes the tag a toggle button (renders <button> with aria-pressed). */
  selectable?: boolean;
  selected?: boolean;
  /** Shows an inline remove affordance. */
  onRemove?: (e: React.SyntheticEvent) => void;
  /** Optional Lucide icon name. */
  icon?: string;
  children?: React.ReactNode;
}

export declare function Tag(props: TagProps): JSX.Element;
